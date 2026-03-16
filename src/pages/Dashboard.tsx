import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MessageCircle, ThumbsUp } from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface Post {
  id: string;
  title: string;
  body: string;
  category: string;
  authorName: string;
  anonymous: boolean;
  createdAt: string | null;
  likes: number;
  replies: number;
}

interface Reply {
  id: string;
  postId: string;
  body: string;
  authorName: string;
  createdAt: string | null;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repliesByPost = useMemo(() => {
    return replies.reduce<Record<string, Reply[]>>((acc, reply) => {
      acc[reply.postId] = acc[reply.postId] || [];
      acc[reply.postId].push(reply);
      return acc;
    }, {});
  }, [replies]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/api/dashboard`, {
          headers: { ...getAuthHeader() },
        });
        if (!response.ok) {
          throw new Error("Failed to load dashboard.");
        }
        const payload = await response.json();
        setPosts(payload?.data?.posts || []);
        setReplies(payload?.data?.replies || []);
      } catch (err) {
        setError("Unable to load your dashboard. Please sign in.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <Layout>
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Your Space
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Dashboard
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Track your posts and see how the community is responding.
            </p>
          </motion.div>

          {error && <div className="text-center text-sm text-destructive mb-6">{error}</div>}
          {isLoading && <div className="text-center text-sm text-muted-foreground mb-6">Loading...</div>}

          <div className="max-w-3xl mx-auto space-y-5">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.createdAt
                      ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                      : "just now"}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{post.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.body}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" /> {post.likes} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" /> {post.replies} replies
                  </span>
                </div>

                <div className="mt-4 border-t border-border pt-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Replies</div>
                  {(repliesByPost[post.id] || []).length === 0 && (
                    <p className="text-xs text-muted-foreground">No replies yet.</p>
                  )}
                  <div className="space-y-2">
                    {(repliesByPost[post.id] || []).map((reply) => (
                      <div key={reply.id} className="rounded-lg border border-border bg-secondary/40 p-3">
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{reply.authorName || "Anonymous"}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {reply.createdAt
                              ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })
                              : "just now"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {!isLoading && posts.length === 0 && (
              <div className="text-center text-sm text-muted-foreground">
                No posts yet. Share your first update in the community.
                <div className="mt-3">
                  <Button asChild size="sm">
                    <a href="/community">Go to Community</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
