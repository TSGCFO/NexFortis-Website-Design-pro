import { useState } from "react";
import { useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { Section } from "@/components/ui-elements";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/operator/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Login failed");
      }
      setLocation("/blog/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <SEO title="Operator Login" description="Operator login for NexFortis blog admin." path="/admin/login" noIndex />
      <Section bg="brand-light">
        <div className="max-w-md mx-auto pt-16 pb-12">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-primary">Operator Login</h1>
                <p className="text-sm text-muted-foreground">Sign in to manage blog content.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="op-email" className="block text-sm font-semibold text-primary mb-2">Email</label>
                <input
                  id="op-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="operator@nexfortis.com"
                />
              </div>
              <div>
                <label htmlFor="op-password" className="block text-sm font-semibold text-primary mb-2">Password</label>
                <input
                  id="op-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-destructive text-sm" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !email || !password}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
}
