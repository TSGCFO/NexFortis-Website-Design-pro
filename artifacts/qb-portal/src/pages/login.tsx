import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      navigate("/portal");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f5f7fa] py-12">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-[#1a2744] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1a2744]">Sign In</h1>
          <p className="text-muted-foreground text-sm mt-1">Access your NexFortis account</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50" />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-[#1a2744] hover:bg-[#1a2744]/90">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="text-center mt-4 space-y-2">
              <p className="text-sm">
                <Link href="/forgot-password" className="text-[#f0a500] hover:underline text-sm">Forgot your password?</Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Don't have an account? <Link href="/register" className="text-[#f0a500] font-medium">Create one</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
