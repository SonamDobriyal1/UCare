import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Users, Clock, ThumbsUp, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const categories = ["All", "Recovery", "Family Support", "Coping", "Stories", "Resources"];

const posts = [
  {
    id: 1,
    author: "Anonymous",
    initials: "AH",
    time: "2 hours ago",
    category: "Recovery",
    title: "Small wins matter — celebrating 30 days",
    body: "Today marks 30 days of recovery. It hasn't been easy, but the support from this community has made all the difference. Thank you for being here.",
    likes: 24,
    replies: 8,
  },
  {
    id: 2,
    author: "Sarah M.",
    initials: "SM",
    time: "5 hours ago",
    category: "Family Support",
    title: "How do I support my brother without enabling?",
    body: "My brother has been struggling with addiction for years. I want to help but I'm not sure where the line is. Has anyone navigated this?",
    likes: 18,
    replies: 12,
  },
  {
    id: 3,
    author: "Anonymous",
    initials: "JD",
    time: "1 day ago",
    category: "Coping",
    title: "Breathing exercises that actually help",
    body: "I've been practicing box breathing for the past two weeks and it's genuinely helped with my anxiety. 4-4-4-4 pattern. Would love to hear what works for others.",
    likes: 31,
    replies: 15,
  },
  {
    id: 4,
    author: "Mike R.",
    initials: "MR",
    time: "2 days ago",
    category: "Stories",
    title: "One year sober — my story",
    body: "A year ago I couldn't imagine getting through a single day. Today, I'm sharing my story hoping it gives someone else the strength to keep going.",
    likes: 56,
    replies: 22,
  },
  {
    id: 5,
    author: "Anonymous",
    initials: "KL",
    time: "3 days ago",
    category: "Resources",
    title: "Free online support group sessions",
    body: "Found some great free virtual group therapy sessions. They run every Tuesday and Thursday evening. Sharing the details for anyone interested.",
    likes: 42,
    replies: 9,
  },
];

const Community = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showNewPost, setShowNewPost] = useState(false);

  const filtered = posts.filter((p) => {
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
                <Input placeholder="Post title..." className="font-medium" />
                <Textarea placeholder="Share your thoughts... (This is a demo — posts aren't saved)" rows={3} />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => setShowNewPost(false)}>
                    Post
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Posts */}
          <div className="max-w-3xl mx-auto space-y-4">
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
                      {post.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-foreground">{post.author}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.time}
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
                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageCircle className="h-3.5 w-3.5" /> {post.replies} replies
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No discussions found. Try a different search or category.
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Community;
