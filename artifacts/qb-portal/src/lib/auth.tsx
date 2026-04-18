import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "./supabase";
import { mapAuthError, AUTH_ERROR_RATE_LIMIT } from "./auth-errors";
import type { Session } from "@supabase/supabase-js";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isOperator: boolean;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ ok: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function apiUrl(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base.slice(0, -1) : base;
  return prefix.replace(/\/qb-portal$/, "") + "/api/qb" + path;
}

async function fetchUserProfile(accessToken: string): Promise<User | null> {
  try {
    const res = await fetch(apiUrl("/me"), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.access_token) {
        const profile = await fetchUserProfile(newSession.access_token);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.access_token) {
        const profile = await fetchUserProfile(existingSession.access_token);
        setUser(profile);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string, phone?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone },
        },
      });
      if (error) {
        return { ok: false, error: mapAuthError(error, "signUp") };
      }
      if (!data.user && !data.session) {
        return { ok: false, error: AUTH_ERROR_RATE_LIMIT };
      }
      if (data.session) {
        return { ok: true };
      }
      return { ok: true, error: "Check your email to confirm your account." };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: mapAuthError(error, "signIn") };
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/qb-portal/auth/callback",
      },
    });
  }, []);

  const signInWithMicrosoft = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo: window.location.origin + "/qb-portal/auth/callback",
      },
    });
  }, []);

  const signOutFn = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const resetPasswordFn = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/qb-portal/reset-password",
      });
      if (error) return { ok: false, error: mapAuthError(error, "resetPassword") };
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    return currentSession?.access_token || null;
  }, []);

  const isOperator = user?.role === "operator";

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isOperator,
      signUp,
      signIn,
      signInWithGoogle,
      signInWithMicrosoft,
      signOut: signOutFn,
      resetPassword: resetPasswordFn,
      getAccessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}
