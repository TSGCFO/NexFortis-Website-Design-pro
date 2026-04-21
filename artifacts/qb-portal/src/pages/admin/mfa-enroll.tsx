import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type MfaState =
  | { status: "loading" }
  | { status: "ready"; factorId: string; qrCode: string; secret: string }
  | { status: "already-verified" }
  | { status: "error"; message: string };

export default function MFAEnroll() {
  const { session, loading: authLoading, isOperator } = useAuth();
  const [, navigate] = useLocation();
  const [state, setState] = useState<MfaState>({ status: "loading" });
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);
  const enrollInFlightRef = useRef(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Start (or restart) enrollment. Cleans up any stale unverified factor first,
  // then calls enroll() to get a fresh QR code + secret.
  const doEnroll = useCallback(async () => {
    if (enrollInFlightRef.current) return;
    enrollInFlightRef.current = true;
    setState({ status: "loading" });
    setError(null);
    setCode("");

    try {
      // Step 1: Inspect existing factors to decide what to do.
      const { data: factorsData, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) {
        setState({
          status: "error",
          message: listError.message || "Failed to check current MFA setup. Please try again.",
        });
        return;
      }

      // `data.all` contains every factor (verified + unverified). `data.totp`
      // is typed as verified-only by the SDK, so we filter `all` ourselves to
      // inspect pending (unverified) enrollments.
      const allFactors = factorsData?.all ?? [];
      const totpFactors = allFactors.filter((f) => f.factor_type === "totp");
      const verifiedFactor = totpFactors.find((f) => f.status === "verified");
      if (verifiedFactor) {
        // User is already fully enrolled. Don't auto-redirect (user may have
        // navigated here intentionally); show a short confirmation.
        setState({ status: "already-verified" });
        return;
      }

      // Step 2: Clean up any dangling unverified factors. These are created
      // when a user opens this page and closes the tab before typing a code.
      // Without this cleanup, Supabase returns factor_name_conflict on the
      // next enroll() call and the user gets stuck.
      const unverifiedFactors = totpFactors.filter((f) => f.status === "unverified");
      for (const stale of unverifiedFactors) {
        const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: stale.id });
        if (unenrollError) {
          // Swallow and continue — worst case enroll() below fails and we
          // surface that error, which is still better than blocking forever.
          console.warn("Failed to remove stale unverified MFA factor:", unenrollError.message);
        }
      }

      // Step 3: Create a fresh enrollment.
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: "totp" });
      if (enrollError || !data) {
        setState({
          status: "error",
          message: enrollError?.message || "Failed to start MFA enrollment. Please try again.",
        });
        return;
      }

      setState({
        status: "ready",
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
    } catch (err) {
      console.error("MFA enroll error:", err);
      setState({
        status: "error",
        message: "Failed to start MFA enrollment. Please try again.",
      });
    } finally {
      enrollInFlightRef.current = false;
    }
  }, []);

  // Gate: require an authenticated operator. Customers should not land here.
  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      navigate("/login");
      return;
    }

    if (!isOperator) {
      // MFA is operator-only by current product design. Customers have no use
      // for it and should not be allowed to enroll phantom factors.
      navigate("/portal");
      return;
    }

    void doEnroll();
  }, [authLoading, session, isOperator, navigate, doEnroll]);

  // Autofocus the code input once the QR code is ready.
  useEffect(() => {
    if (state.status === "ready") {
      codeInputRef.current?.focus();
    }
  }, [state.status]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.status !== "ready" || code.length !== 6) return;
    setVerifying(true);
    setError(null);
    try {
      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId: state.factorId,
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

  const handleStartOver = async () => {
    if (state.status !== "ready" || resetting) return;
    setResetting(true);
    setError(null);
    try {
      await supabase.auth.mfa.unenroll({ factorId: state.factorId });
    } catch (err) {
      console.warn("Failed to unenroll factor before restart:", err);
    } finally {
      setResetting(false);
      await doEnroll();
    }
  };

  const handleCopy = async () => {
    if (state.status !== "ready") return;
    try {
      await navigator.clipboard.writeText(state.secret);
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

  // --- Render ---

  if (authLoading || !session || !isOperator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B76E79]" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B76E79]" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (state.status === "already-verified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-[480px] w-full text-center">
          <h1 className="text-xl font-semibold text-[#0A1628] mb-3">MFA Already Configured</h1>
          <p className="text-gray-600 mb-6">Two-factor authentication is already set up for this account.</p>
          <Link
            href="/admin"
            className="inline-block py-3 px-6 rounded-lg font-semibold text-white transition-all bg-[#B76E79] hover:bg-[#B76E79]/90"
          >
            Go to Admin
          </Link>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-[480px] w-full text-center">
          <h1 className="text-xl font-semibold text-[#0A1628] mb-3">Enrollment Error</h1>
          <p className="text-red-600 mb-6">{state.message}</p>
          <button
            type="button"
            onClick={() => {
              void doEnroll();
            }}
            className="py-3 px-6 rounded-lg font-semibold text-white transition-all bg-[#B76E79] hover:bg-[#B76E79]/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // state.status === "ready"
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-4 py-8">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-[480px] w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#0A1628] mb-2" style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}>
            Set Up Two-Factor Authentication
          </h1>
          <p className="text-gray-600 text-sm">
            Scan this QR code with Google Authenticator, Authy, or your preferred authenticator app.
            If you can&apos;t scan the QR code, you can enter the key manually.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <img
            src={state.qrCode}
            alt="MFA QR code"
            className="w-[200px] h-[200px] rounded-lg border border-gray-200 p-2"
          />
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Manual setup key</p>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
            <code className="flex-1 text-sm font-mono text-[#0A1628] break-all select-all">{state.secret}</code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-xs px-3 py-1.5 rounded-md bg-[#0A1628] text-white hover:bg-[#0A1628]/90 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

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
            className="mt-4 w-full py-3 px-4 rounded-lg font-semibold text-white transition-all bg-[#B76E79] disabled:bg-[#B76E79]/50 disabled:cursor-not-allowed"
          >
            {verifying ? "Verifying..." : "Activate MFA"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleStartOver}
          disabled={resetting || verifying}
          className="mt-4 w-full text-sm text-gray-500 hover:text-[#0A1628] underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resetting ? "Resetting..." : "Start over with a new code"}
        </button>
      </div>
    </div>
  );
}
