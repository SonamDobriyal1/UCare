import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { initFirebase, getDb, FieldValue } from "./firebase.js";
import {
  postCreateSchema,
  replyCreateSchema,
  contactCreateSchema,
  chatSchema,
  userUpdateSchema,
  signupSchema,
  loginSchema,
} from "./validators.js";

dotenv.config();

initFirebase();
const db = getDb();

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

app.disable("etag");
app.use(helmet());
app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    res.set("Cache-Control", "no-store");
  }
  next();
});

async function attachUser(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid auth token" });
  }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  return next();
}

app.use(attachUser);

function formatTimestamp(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return null;
}

function mapPostDoc(doc) {
  const raw = doc.data();
  return {
    id: doc.id,
    title: raw.title,
    body: raw.body,
    category: raw.category,
    authorName: raw.authorName,
    anonymous: raw.anonymous,
    createdAt: formatTimestamp(raw.createdAt),
    likes: raw.likeCount || 0,
    replies: raw.replyCount || 0,
    uid: raw.uid || null,
  };
}

function mapReplyDoc(doc) {
  const raw = doc.data();
  return {
    id: doc.id,
    postId: raw.postId,
    body: raw.body,
    authorName: raw.authorName,
    anonymous: raw.anonymous,
    createdAt: formatTimestamp(raw.createdAt),
    uid: raw.uid || null,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, status: "up", time: new Date().toISOString() });
});

app.get("/api/users/me", requireAuth, async (req, res) => {
  const userRef = db.collection("users").doc(req.user.sub);
  const snap = await userRef.get();
  res.json({ data: snap.exists ? { id: snap.id, ...snap.data() } : null });
});

app.put("/api/users/me", requireAuth, async (req, res) => {
  const parsed = userUpdateSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const updates = parsed.data;
  const safeUpdates = {
    displayName: updates.displayName ?? req.user.name ?? "",
    photoUrl: updates.photoUrl ?? req.user.picture ?? "",
    bio: updates.bio ?? "",
    location: updates.location ?? "",
    updatedAt: FieldValue.serverTimestamp(),
  };

  const userRef = db.collection("users").doc(req.user.sub);
  const userSnap = await userRef.get();
  await userRef.set(
    {
      uid: req.user.sub,
      email: req.user.email || "",
      ...safeUpdates,
      ...(userSnap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true }
  );

  const snap = await userRef.get();
  res.json({ data: { id: snap.id, ...snap.data() } });
});

app.get("/api/posts", async (req, res) => {
  const { category, q, limit = "20", offset = "0" } = req.query;
  const limitNum = Math.min(Number.parseInt(limit, 10) || 20, 50);
  const offsetNum = Number.parseInt(offset, 10) || 0;

  let query = db.collection("posts");
  const filteredByCategory = Boolean(category && category !== "All");
  if (filteredByCategory) {
    query = query.where("category", "==", category);
  } else {
    query = query.orderBy("createdAt", "desc");
  }

  if (offsetNum > 0) {
    query = query.offset(offsetNum);
  }

  const snapshot = await query.limit(limitNum).get();
  let data = snapshot.docs.map(mapPostDoc);
  if (filteredByCategory) {
    data = data.sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return bTime - aTime;
    });
  }

  if (q) {
    const term = String(q).toLowerCase();
    data = data.filter(
      (post) =>
        post.title?.toLowerCase().includes(term) ||
        post.body?.toLowerCase().includes(term)
    );
  }

  res.json({ data, limit: limitNum, offset: offsetNum });
});

app.post("/api/posts", async (req, res) => {
  const parsed = postCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const { title, body, category, authorName, anonymous } = parsed.data;
  const postRef = db.collection("posts").doc();

  await postRef.set({
    title,
    body,
    category,
    authorName,
    anonymous: Boolean(anonymous),
    uid: req.user?.sub || null,
    likeCount: 0,
    replyCount: 0,
    createdAt: FieldValue.serverTimestamp(),
  });

  const snap = await postRef.get();
  res.status(201).json({ data: mapPostDoc(snap) });
});

app.post("/api/posts/:id/like", async (req, res) => {
  const postRef = db.collection("posts").doc(req.params.id);
  const snap = await postRef.get();
  if (!snap.exists) {
    return res.status(404).json({ error: "Post not found" });
  }

  await postRef.update({ likeCount: FieldValue.increment(1) });
  const updated = await postRef.get();
  res.json({ data: { id: updated.id, likes: updated.data().likeCount || 0 } });
});

app.get("/api/posts/:id/replies", async (req, res) => {
  const snapshot = await db
    .collection("replies")
    .where("postId", "==", req.params.id)
    .get();

  const data = snapshot.docs
    .map(mapReplyDoc)
    .sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return aTime - bTime;
    });

  res.json({ data });
});

app.get("/api/dashboard", requireAuth, async (req, res) => {
  const postsSnapshot = await db
    .collection("posts")
    .where("uid", "==", req.user.sub)
    .get();

  const posts = postsSnapshot.docs.map(mapPostDoc);
  const postIds = posts.map((post) => post.id);

  let replies = [];
  if (postIds.length > 0) {
    const repliesSnapshot = await db
      .collection("replies")
      .where("postId", "in", postIds.slice(0, 10))
      .get();

    replies = repliesSnapshot.docs
      .map(mapReplyDoc)
      .sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        return bTime - aTime;
      });
  }

  res.json({ data: { posts, replies } });
});

app.post("/api/posts/:id/replies", async (req, res) => {
  const parsed = replyCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const { body, authorName, anonymous } = parsed.data;
  const replyRef = db.collection("replies").doc();

  await replyRef.set({
    postId: req.params.id,
    body,
    authorName,
    anonymous: Boolean(anonymous),
    uid: req.user?.sub || null,
    createdAt: FieldValue.serverTimestamp(),
  });

  await db
    .collection("posts")
    .doc(req.params.id)
    .update({ replyCount: FieldValue.increment(1) });

  const snap = await replyRef.get();
  res.status(201).json({ data: mapReplyDoc(snap) });
});

app.post("/api/contact", async (req, res) => {
  const parsed = contactCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const { name, email, message } = parsed.data;
  const ref = db.collection("contacts").doc();
  await ref.set({
    name,
    email,
    message,
    status: "new",
    createdAt: FieldValue.serverTimestamp(),
    uid: req.user?.sub || null,
  });

  res.status(201).json({ data: { id: ref.id } });
});

app.get("/api/chat/:sessionId", async (req, res) => {
  const snapshot = await db
    .collection("chatMessages")
    .where("sessionId", "==", req.params.sessionId)
    .get();

  const data = snapshot.docs
    .map((doc) => {
      const raw = doc.data();
      return {
        id: doc.id,
        sessionId: raw.sessionId,
        role: raw.role,
        content: raw.content,
        createdAt: formatTimestamp(raw.createdAt),
      };
    })
    .sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return aTime - bTime;
    });

  res.json({ data });
});

app.post("/api/chat", async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const { message } = parsed.data;
  let { sessionId } = parsed.data;

  const sessionRef = sessionId
    ? db.collection("chatSessions").doc(sessionId)
    : db.collection("chatSessions").doc();

  if (!sessionId) {
    sessionId = sessionRef.id;
  }

  const sessionSnap = await sessionRef.get();
  if (!sessionSnap.exists) {
    await sessionRef.set({
      uid: req.user?.sub || null,
      createdAt: FieldValue.serverTimestamp(),
      lastMessageAt: FieldValue.serverTimestamp(),
    });
  } else {
    await sessionRef.update({ lastMessageAt: FieldValue.serverTimestamp() });
  }

  await db.collection("chatMessages").add({
    sessionId,
    uid: req.user?.sub || null,
    role: "user",
    content: message,
    createdAt: FieldValue.serverTimestamp(),
  });

  const reply = await generateSupportiveReply(message);

  await db.collection("chatMessages").add({
    sessionId,
    uid: req.user?.sub || null,
    role: "assistant",
    content: reply,
    createdAt: FieldValue.serverTimestamp(),
  });

  res.json({ data: { sessionId, reply } });
});

app.post("/api/auth/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const { name, email, password } = parsed.data;
  const existing = await db.collection("users").where("email", "==", email).limit(1).get();
  if (!existing.empty) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userRef = db.collection("users").doc();
  await userRef.set({
    uid: userRef.id,
    name,
    email,
    passwordHash,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const token = jwt.sign(
    { sub: userRef.id, email, name },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );

  res.status(201).json({ data: { token } });
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const existing = await db.collection("users").where("email", "==", email).limit(1).get();
  if (existing.empty) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const userDoc = existing.docs[0];
  const user = userDoc.data();
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { sub: userDoc.id, email: user.email, name: user.name || "" },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );

  res.json({ data: { token } });
});

async function generateSupportiveReply(message) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "I'm here to listen. (Missing GEMINI_API_KEY on server.)";
  }

  const prompt = `You are UCare, a warm, supportive mental wellness companion. Keep replies short, empathetic, and non-judgmental.\nUser: ${message}`;

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // eslint-disable-next-line no-console
      console.warn("Gemini API error:", response.status, errorText);
      return "I'm here with you. Want to share a bit more?";
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return (text && String(text).trim()) || "I'm here with you. Want to share a bit more?";
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Gemini API request failed:", error);
    return "I'm here with you. Want to share a bit more?";
  }
}

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
