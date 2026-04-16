import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type CheckState = "loading" | "challenge" | "redirecting";

export default function MFAChallenge() {
  const { session, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [state, setState] = useState<CheckState>("loading");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const checkedRef = useRef(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      navigate("/login");
      return;
    }
    if (checkedRef.current) return;
    checkedRef.current = true;

    (async () => {
      try {
        const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aalError) {
          setError("Unable to check authentication level. Please try logging in again.");
          setState("challenge");
          return;
        }

        if (aalData.currentLevel === "aal2") {
          setState("redirecting");
          navigate("/admin");
          return;
        }

        const { data: factorsData } = await supabase.auth.mfa.listFactors();
        const totpFactors = factorsData?.totp?.filter((f) => f.status === "verified") ?? [];

        if (totpFactors.length === 0) {
          navigate("/admin/mfa-enroll");
          return;
        }

        setFactorId(totpFactors[0].id);
        setState("challenge");
        setTimeout(() => codeInputRef.current?.focus(), 100);
      } catch {
        setError("Unable to check authentication level. Please try logging in again.");
        setState("challenge");
      }
    })();
  }, [authLoading, session, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || code.length !== 6) return;
    setVerifying(true);
    setError(null);

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) {
        setError("Verification failed. Please try again.");
        setVerifying(false);
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) {
        setError("Incorrect code. Please check your authenticator app and try again.");
        setVerifying(false);
        return;
      }

      navigate("/admin");
    } catch {
      setError("Verification failed. Please try again.");
      setVerifying(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(val);
  };

  if (authLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B76E79]" />
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B76E79]" />
      </div>
    );
  }

  if (state === "redirecting") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B76E79]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-[480px] w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#0A1628] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#B76E79]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0A1628] mb-2" style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}>
            Two-Factor Authentication Required
          </h1>
          <p className="text-gray-600 text-sm">
            Enter the 6-digit code from your authenticator app to continue.
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <input
            ref={codeInputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={handleCodeChange}
            placeholder="000000"
            autoComplete="one-time-code"
            aria-label="6-digit verification code"
            className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B76E79] focus:border-[#B76E79] outline-none transition-all"
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={code.length !== 6 || verifying}
            className="mt-4 w-full py-3 px-4 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: code.length === 6 && !verifying ? "#B76E79" : undefined }}
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}
