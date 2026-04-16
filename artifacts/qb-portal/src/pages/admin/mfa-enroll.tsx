import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export default function MFAEnroll() {
  const { session, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const enrollCalledRef = useRef(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const doEnroll = useCallback(async () => {
    setEnrolling(true);
    setError(null);
    try {
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });
      if (enrollError) {
        const msg = enrollError.message?.toLowerCase() ?? "";
        if (
          msg.includes("already enrolled") ||
          msg.includes("factor_name_conflict") ||
          enrollError.code === "mfa_factor_name_conflict"
        ) {
          setAlreadyEnrolled(true);
          setTimeout(() => navigate("/admin/mfa-challenge"), 2000);
          return;
        }
        setError(enrollError.message);
        return;
      }
      if (data) {
        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
        setSecret(data.totp.secret);
        setTimeout(() => codeInputRef.current?.focus(), 100);
      }
    } catch {
      setError("Failed to start MFA enrollment. Please try again.");
    } finally {
      setEnrolling(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      navigate("/login");
      return;
    }
    if (enrollCalledRef.current) return;
    enrollCalledRef.current = true;
    doEnroll();
  }, [authLoading, session, navigate, doEnroll]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || code.length !== 6) return;
    setVerifying(true);
    setError(null);
    try {
      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });
      if (verifyError) {
        setError("Incorrect code. Please try again.");
        setVerifying(false);
        return;
      }
      navigate("/admin");
    } catch {
      setError("Verification failed. Please try again.");
      setVerifying(false);
    }
  };

  const handleCopy = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may not be available */
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(val);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B76E79]" />
      </div>
    );
  }

  if (!session) return null;

  if (alreadyEnrolled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-[480px] w-full text-center">
          <h1 className="text-xl font-semibold text-[#0A1628] mb-3">MFA Already Configured</h1>
          <p className="text-gray-600">MFA is already set up for this account. Redirecting to verification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-4 py-8">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-[480px] w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#0A1628] mb-2" style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}>
            Set Up Two-Factor Authentication
          </h1>
          <p className="text-gray-600 text-sm">
            Scan this QR code with Google Authenticator, Authy, or your preferred authenticator app.
            If you can't scan the QR code, you can enter the key manually.
          </p>
        </div>

        {enrolling && !qrCode && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B76E79]" />
          </div>
        )}

        {qrCode && (
          <>
            <div className="flex justify-center mb-6">
              <img
                src={qrCode}
                alt="MFA QR code"
                className="w-[200px] h-[200px] rounded-lg border border-gray-200 p-2"
              />
            </div>

            {secret && (
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Manual setup key</p>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <code className="flex-1 text-sm font-mono text-[#0A1628] break-all select-all">{secret}</code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-md bg-[#0A1628] text-white hover:bg-[#0A1628]/90 transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}

            <div className="mb-6 border-l-4 border-amber-400 bg-amber-50 rounded-r-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Save the secret key somewhere safe. You will need it to recover your account
                if you lose your device. NexFortis cannot recover your account without this key.
              </p>
            </div>

            <form onSubmit={handleVerify}>
              <label htmlFor="mfa-code" className="block text-sm font-medium text-gray-700 mb-2">
                Enter the 6-digit code from your authenticator app to confirm setup
              </label>
              <input
                ref={codeInputRef}
                id="mfa-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                autoComplete="one-time-code"
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
                {verifying ? "Verifying..." : "Activate MFA"}
              </button>
            </form>
          </>
        )}

        {error && !qrCode && !enrolling && (
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => {
                enrollCalledRef.current = false;
                doEnroll();
              }}
              className="px-6 py-2 rounded-lg font-semibold text-white transition-all"
              style={{ backgroundColor: "#B76E79" }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
