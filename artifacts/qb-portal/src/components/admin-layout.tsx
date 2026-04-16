import { useState, useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, session, loading: authLoading, isOperator } = useAuth();
  const [, navigate] = useLocation();
  const [aal2Verified, setAal2Verified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!session || !user) {
      navigate("/login");
      return;
    }

    if (!isOperator) {
      navigate("/portal");
      return;
    }

    (async () => {
      setChecking(true);
      try {
        const { data: factorsData } = await supabase.auth.mfa.listFactors();
        const totpFactors = factorsData?.totp?.filter((f) => f.status === "verified") ?? [];

        if (totpFactors.length === 0) {
          navigate("/admin/mfa-enroll");
          return;
        }

        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

        if (!aalData || aalData.currentLevel !== "aal2") {
          navigate("/admin/mfa-challenge");
          return;
        }

        setAal2Verified(true);
      } catch {
        navigate("/admin/mfa-challenge");
      } finally {
        setChecking(false);
      }
    })();
  }, [authLoading, session, user, isOperator, navigate]);

  if (authLoading || checking || !aal2Verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B76E79]" />
      </div>
    );
  }

  return <>{children}</>;
}
