import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useAuth } from "@/lib/auth";
import { sanitizeReturnTo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/seo";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithMicrosoft } = useAuth();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const returnTo = sanitizeReturnTo(new URLSearchParams(searchString).get("returnTo"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.ok) {
      navigate(returnTo);
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleGoogleSignIn = () => {
    sessionStorage.setItem("authReturnTo", returnTo);
    signInWithGoogle();
  };

  const handleMicrosoftSignIn = () => {
    sessionStorage.setItem("authReturnTo", returnTo);
    signInWithMicrosoft();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center section-brand-light py-12">
      <SEO title="Sign In" description="Sign in to your NexFortis QuickBooks Portal account." path="/login" noIndex />
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <img src={`${import.meta.env.BASE_URL}images/logo-original.svg`} alt="NexFortis" className="h-14 mx-auto mb-4 dark:hidden" />
          <img src={`${import.meta.env.BASE_URL}images/logo-white.svg`} alt="NexFortis" className="h-14 mx-auto mb-4 hidden dark:block" />
          <h1 className="text-2xl font-bold font-display text-primary">Sign In</h1>
          <p className="text-muted-foreground text-sm mt-1">Access your NexFortis account</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-3 font-medium"
                onClick={handleGoogleSignIn}
              >
                <GoogleIcon />
                Sign in with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-3 font-medium"
                onClick={handleMicrosoftSignIn}
              >
                <MicrosoftIcon />
                Sign in with Microsoft
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-navy text-white hover:bg-navy/90 font-display">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="text-center mt-4 space-y-2">
              <p className="text-sm">
                <Link href="/forgot-password" className="text-accent hover:underline text-sm">Forgot your password?</Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Don't have an account? <Link href="/register" className="text-accent font-medium">Create one</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
