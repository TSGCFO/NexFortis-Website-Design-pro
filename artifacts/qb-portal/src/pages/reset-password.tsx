import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import zxcvbn from "zxcvbn";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { SEO } from "@/components/seo";

const STRENGTH_LABELS = ["Weak", "Weak", "Fair", "Strong", "Very Strong"] as const;
const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-red-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-600",
] as const;

function validatePassword(password: string, userInputs: string[]): { ok: true } | { ok: false; error: string } {
  if (password.length < 12) {
    return { ok: false, error: "Password must be at least 12 characters." };
  }
  if (!/[A-Za-z]/.test(password)) {
    return { ok: false, error: "Password must contain at least one letter." };
  }
  if (!/\d/.test(password)) {
    return { ok: false, error: "Password must contain at least one number." };
  }
  const result = zxcvbn(password, userInputs);
  if (result.score < 2) {
    const suggestion = result.feedback.warning || "This password is too common or easy to guess. Please choose a stronger one.";
    return { ok: false, error: suggestion };
  }
  return { ok: true };
}

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryMode(true);
      }
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
      setCheckingSession(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsRecoveryMode(true);
        if (session.user?.email) {
          setUserEmail(session.user.email);
        }
      }
      setCheckingSession(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const strength = useMemo(() => {
    if (!newPassword) return null;
    const userInputs = [userEmail].filter(Boolean);
    const result = zxcvbn(newPassword, userInputs);
    return {
      score: result.score,
      label: STRENGTH_LABELS[result.score],
      color: STRENGTH_COLORS[result.score],
    };
  }, [newPassword, userEmail]);

  if (checkingSession) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-muted-foreground">Verifying reset link...</p>
      </div>
    );
  }

  if (!isRecoveryMode && !success) {
    return (
      <div>
        <section className="section-brand-light py-16 min-h-[70vh]">
          <div className="max-w-md mx-auto px-4 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold font-display text-primary mb-2">Invalid Reset Link</h1>
            <p className="text-muted-foreground mb-6">This password reset link is invalid or has expired.</p>
            <Link href="/forgot-password">
              <Button className="bg-navy text-white hover:bg-navy/90 font-display">Request New Reset Link</Button>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const userInputs = [userEmail].filter(Boolean);
    const validation = validatePassword(newPassword, userInputs);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <section className="section-brand-light py-16 min-h-[70vh]">
          <div className="max-w-md mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-lg font-bold font-display text-primary mb-2">Password Reset Successfully</h2>
                <p className="text-sm text-muted-foreground mb-6">You can now sign in with your new password.</p>
                <Link href="/login">
                  <Button className="bg-navy text-white hover:bg-navy/90 font-display">Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <SEO title="Reset Password" description="Set a new password for your NexFortis QuickBooks Portal account." path="/reset-password" noIndex />
      <section className="section-brand-light py-16 min-h-[70vh]">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <img src={`${import.meta.env.BASE_URL}images/logo-original.svg`} alt="NexFortis" className="h-14 mx-auto mb-4 dark:hidden" />
            <img src={`${import.meta.env.BASE_URL}images/logo-white.svg`} alt="NexFortis" className="h-14 mx-auto mb-4 hidden dark:block" />
            <h1 className="text-2xl font-bold font-display text-primary">Set New Password</h1>
            <p className="text-muted-foreground">Enter your new password below</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    minLength={12}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="Minimum 12 characters"
                    autoComplete="new-password"
                  />
                  {strength && (
                    <div className="mt-2" data-testid="password-strength">
                      <div className="flex gap-1" aria-hidden="true">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              i < Math.max(1, strength.score) ? strength.color : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Strength: <span className="font-medium text-foreground" data-testid="password-strength-label">{strength.label}</span>
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">12+ characters, must include letters and numbers</p>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                </div>
                {error && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                    data-testid="reset-password-error"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full bg-navy text-white hover:bg-navy/90 font-display">
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
