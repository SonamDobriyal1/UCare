import fs from "fs";
import admin from "firebase-admin";

export function initFirebase() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountRaw) {
    const looksLikeJson = serviceAccountRaw.trim().startsWith("{");
    const rawJson = looksLikeJson
      ? serviceAccountRaw
      : fs.readFileSync(serviceAccountRaw, "utf8");
    const serviceAccount = JSON.parse(rawJson);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
    });
  }

  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export function getDb() {
  return admin.firestore();
}

export const { FieldValue } = admin.firestore;
