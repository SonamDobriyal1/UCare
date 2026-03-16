import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Users, Clock, ThumbsUp, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { formatDistanceToNow } from "date-fns";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const categories = ["All", "Recovery", "Family Support", "Coping", "Stories", "Resources"];

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const PAGE_SIZE = 10;

const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface CommunityPost {
  id: string;
  authorName: string;
  body: string;
  category: string;
  title: string;
  likes: number;
  replies: number;
  createdAt: string | null;
  anonymous?: boolean;
}

interface Reply {
  id: string;
  postId: string;
  body: string;
  authorName: string;
  createdAt: string | null;
}

const Community = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showNewPost, setShowNewPost] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [repliesByPost, setRepliesByPost] = useState<Record<string, Reply[]>>({});
  const [openReplies, setOpenReplies] = useState<Set<string>>(new Set());
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [isLoadingReplies, setIsLoadingReplies] = useState<Record<string, boolean>>({});
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
    return initials || "AN";
  };

  const fetchPosts = async (reset = false) => {
    if (reset) {
      setIsLoading(true);
      offsetRef.current = 0;
      setOffset(0);
      setHasMore(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams();
      if (activeCategory !== "All") {
        params.set("category", activeCategory);
      }
      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      }
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(reset ? 0 : offsetRef.current));

      const response = await fetch(`${API_BASE}/api/posts?${params.toString()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        if (response.status === 304) return;
        throw new Error("Failed to load community posts.");
      }

      const payload = await response.json();
      const nextPosts = payload?.data || [];
      setPosts((prev) => (reset ? nextPosts : [...prev, ...nextPosts]));
      const nextOffset = reset ? nextPosts.length : offsetRef.current + nextPosts.length;
      offsetRef.current = nextOffset;
      setOffset(nextOffset);
      if (nextPosts.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      setError("Unable to load community posts right now.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const filtered = useMemo(() => posts, [posts]);


  const toggleLike = async (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

    try {
      const response = await fetch(`${API_BASE}/api/posts/${id}/like`, { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to like post.");
      }
      const payload = await response.json();
      const likes = payload?.data?.likes;
      if (typeof likes === "number") {
        setPosts((prev) =>
          prev.map((post) => (post.id === id ? { ...post, likes } : post))
        );
      }
    } catch (err) {
      setLikedPosts((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;

    setIsSubmitting(true);
    try {
      const category = activeCategory === "All" ? "Recovery" : activeCategory;
      const response = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({
          title: newTitle.trim(),
          body: newBody.trim(),
          category,
          authorName: "Anonymous",
          anonymous: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post.");
      }

      const payload = await response.json();
      if (payload?.data) {
        setPosts((prev) => [payload.data, ...prev]);
      }
      setNewTitle("");
      setNewBody("");
      setShowNewPost(false);
    } catch (err) {
      setError("Unable to create a post right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchReplies = async (postId: string) => {
    setIsLoadingReplies((prev) => ({ ...prev, [postId]: true }));
    try {
      const response = await fetch(`${API_BASE}/api/posts/${postId}/replies`);
      if (!response.ok) {
        throw new Error("Failed to load replies.");
      }
      const payload = await response.json();
      setRepliesByPost((prev) => ({ ...prev, [postId]: payload?.data || [] }));
    } catch (err) {
      setError("Unable to load replies right now.");
    } finally {
      setIsLoadingReplies((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const toggleReplies = (postId: string) => {
    setOpenReplies((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });

    if (!repliesByPost[postId]) {
      fetchReplies(postId);
    }
  };

  const handleReplySubmit = async (postId: string) => {
    const body = replyDrafts[postId]?.trim();
    if (!body) return;

    try {
      const response = await fetch(`${API_BASE}/api/posts/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({
          body,
          authorName: "Anonymous",
          anonymous: true,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create reply.");
      }
      const payload = await response.json();
      setRepliesByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), payload.data],
      }));
      setReplyDrafts((prev) => ({ ...prev, [postId]: "" }));
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, replies: (post.replies || 0) + 1 } : post
        )
      );
    } catch (err) {
      setError("Unable to send reply right now.");
    }
  };

  return (
    <Layout>
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Peer Support
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Community Forum
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              A safe, anonymous space to share, connect, and support each other on the journey to recovery.
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-8 mb-10"
          >
            {[
              { icon: Users, value: "2,400+", label: "Members" },
              { icon: MessageCircle, value: "850+", label: "Discussions" },
              { icon: Heart, value: "100%", label: "Anonymous" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <stat.icon className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">{stat.value}</span>
                <span>{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Controls */}
          <div className="max-w-3xl mx-auto mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className="pl-9"
                />
              </div>
              <Button onClick={() => setShowNewPost(!showNewPost)} className="gap-2">
                <Plus className="h-4 w-4" /> New Post
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* New post form */}
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="max-w-3xl mx-auto mb-8"
            >
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <Input
                  placeholder="Post title..."
                  className="font-medium"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Share your thoughts..."
                  rows={3}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleCreatePost} disabled={isSubmitting}>
                    Post
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Posts */}
          <div className="max-w-3xl mx-auto space-y-4">
            {error && (
              <div className="text-center py-6 text-sm text-destructive">{error}</div>
            )}

            {isLoading && (
              <div className="text-center py-6 text-sm text-muted-foreground">Loading discussions...</div>
            )}

            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                      {getInitials(post.authorName || "Anonymous")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-foreground">{post.authorName || "Anonymous"}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />{" "}
                        {post.createdAt
                          ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                          : "just now"}
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-2 py-0">
                        {post.category}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{post.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{post.body}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          likedPosts.has(post.id) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {post.likes}
                      </button>
                      <button
                        onClick={() => toggleReplies(post.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> {post.replies} replies
                      </button>
                    </div>

                    {openReplies.has(post.id) && (
                      <div className="mt-4 space-y-3">
                        {isLoadingReplies[post.id] && (
                          <div className="text-xs text-muted-foreground">Loading replies...</div>
                        )}

                        {(repliesByPost[post.id] || []).map((reply) => (
                          <div key={reply.id} className="border border-border rounded-lg p-3 bg-secondary/40">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <span className="font-semibold text-foreground">{reply.authorName || "Anonymous"}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {reply.createdAt
                                  ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })
                                  : "just now"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{reply.body}</p>
                          </div>
                        ))}

                        <div className="space-y-2">
                          <Textarea
                            rows={2}
                            placeholder="Write a reply..."
                            value={replyDrafts[post.id] || ""}
                            onChange={(e) =>
                              setReplyDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                            }
                          />
                          <div className="flex justify-end">
                            <Button size="sm" onClick={() => handleReplySubmit(post.id)}>
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No discussions found. Try a different search or category.
              </div>
            )}

            {hasMore && !isLoading && (
              <div className="text-center py-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPosts(false)}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Loading..." : "Load more"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Community;
