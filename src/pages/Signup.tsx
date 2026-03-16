import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        throw new Error("Signup failed");
      }
      const payload = await response.json();
      if (!payload?.data?.token) {
        throw new Error("Missing token");
      }
      loginWithToken(payload.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-card border border-border rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                Join UCare
              </span>
              <h1 className="text-3xl font-serif font-semibold text-foreground">Create account</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Start your recovery journey with a supportive community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-xs text-destructive">{error}</div>}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full name</label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create account"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Signup;
