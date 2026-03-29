import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const result = await register({ name, email, password, phone: phone || undefined });
    setLoading(false);
    if (result.ok) {
      navigate("/portal");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f5f7fa] py-12">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-[#1a2744] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1a2744]">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Get started with NexFortis QuickBooks Services</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name *</label>
                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone (optional)</label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password *</label>
                <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50" />
                <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-[#1a2744] hover:bg-[#1a2744]/90">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account? <Link href="/login" className="text-[#f0a500] font-medium">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
