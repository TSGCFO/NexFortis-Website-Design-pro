import { useState } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

export default function ResetPassword() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const token = params.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div>
        <section className="bg-[#f5f7fa] py-16 min-h-[70vh]">
          <div className="max-w-md mx-auto px-4 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#1a2744] mb-2">Invalid Reset Link</h1>
            <p className="text-muted-foreground mb-6">This password reset link is invalid or has expired.</p>
            <Link href="/forgot-password">
              <Button className="bg-[#1a2744]">Request New Reset Link</Button>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/qb/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setSuccess(true);
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
        <section className="bg-[#f5f7fa] py-16 min-h-[70vh]">
          <div className="max-w-md mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-[#1a2744] mb-2">Password Reset Successfully</h2>
                <p className="text-sm text-muted-foreground mb-6">You can now sign in with your new password.</p>
                <Link href="/login">
                  <Button className="bg-[#1a2744]">Sign In</Button>
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
      <section className="bg-[#f5f7fa] py-16 min-h-[70vh]">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-[#1a2744] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#1a2744]">Set New Password</h1>
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50"
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full bg-[#1a2744] hover:bg-[#1a2744]/90">
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
