import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/qb/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSubmitted(true);
        if (data.resetUrl) {
          setDevResetUrl(data.resetUrl);
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-[#f5f7fa] py-16 min-h-[70vh]">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-[#1a2744] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#1a2744]">Reset Password</h1>
            <p className="text-muted-foreground">Enter your email to receive a password reset link</p>
          </div>

          {submitted ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-[#1a2744] mb-2">Check Your Email</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  If an account exists with <strong>{email}</strong>, we've sent a password reset link.
                </p>
                <p className="text-xs text-muted-foreground">The link expires in 1 hour. Check your spam folder if you don't see it.</p>
                {devResetUrl && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-left">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Development Mode — Reset Link:</p>
                    <Link href={devResetUrl} className="text-xs text-[#f0a500] underline break-all">{devResetUrl}</Link>
                  </div>
                )}
                <div className="mt-6">
                  <Link href="/login">
                    <Button variant="outline">Back to Sign In</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50"
                      placeholder="you@company.com"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full bg-[#1a2744] hover:bg-[#1a2744]/90">
                    <Mail className="w-4 h-4 mr-2" />
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Remember your password? <Link href="/login" className="text-[#f0a500] hover:underline">Sign in</Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
