import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";

export default function AuthCallback() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const errorParam = params.get("error_description") || params.get("error");
    if (errorParam) {
      setError(errorParam);
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const searchError = searchParams.get("error_description") || searchParams.get("error");
    if (searchError) {
      setError(searchError);
      return;
    }
  }, []);

  useEffect(() => {
    if (!loading && user && !error) {
      navigate("/portal");
    }
  }, [user, loading, error, navigate]);

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center section-brand-light py-12">
        <SEO title="Sign In Error" description="An error occurred during sign in." path="/auth/callback" noIndex />
        <div className="text-center max-w-md px-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold font-display text-primary mb-2">Sign In Failed</h1>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Link href="/login">
            <Button className="bg-navy text-white hover:bg-navy/90 font-display">Try Again</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center section-brand-light py-12">
      <SEO title="Completing Sign In" description="Completing your sign in..." path="/auth/callback" noIndex />
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
        <p className="text-muted-foreground font-display">Completing sign-in...</p>
      </div>
    </div>
  );
}
