import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import { SEO } from "@/components/seo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await resetPassword(email);
    setLoading(false);

    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong");
    }
  };

  return (
    <div>
      <SEO title="Forgot Password" description="Reset your NexFortis QuickBooks Portal password." path="/forgot-password" noIndex />
      <section className="section-brand-light py-16 min-h-[70vh]">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <img src={`${import.meta.env.BASE_URL}images/logo-original.svg`} alt="NexFortis" className="h-14 mx-auto mb-4 dark:hidden" />
            <img src={`${import.meta.env.BASE_URL}images/logo-white.svg`} alt="NexFortis" className="h-14 mx-auto mb-4 hidden dark:block" />
            <h1 className="text-2xl font-bold font-display text-primary">Reset Password</h1>
            <p className="text-muted-foreground">Enter your email to receive a password reset link</p>
          </div>

          {submitted ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-lg font-bold font-display text-primary mb-2">Check Your Email</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  If an account exists with <strong>{email}</strong>, you'll receive a password reset link.
                </p>
                <p className="text-xs text-muted-foreground">The link expires in 1 hour. Check your spam folder if you don't see it.</p>
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
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      placeholder="you@company.com"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full bg-navy text-white hover:bg-navy/90 font-display">
                    <Mail className="w-4 h-4 mr-2" />
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Remember your password? <Link href="/login" className="text-accent hover:underline">Sign in</Link>
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
