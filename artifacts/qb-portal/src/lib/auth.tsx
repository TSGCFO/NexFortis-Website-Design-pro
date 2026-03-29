import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function apiUrl(path: string) {
  return "/api/qb" + path;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("qb_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("qb_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || "Login failed" };
      setUser(data.user);
      localStorage.setItem("qb_user", JSON.stringify(data.user));
      localStorage.setItem("qb_token", data.token);
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; name: string; phone?: string }) => {
    try {
      const res = await fetch(apiUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) return { ok: false, error: result.error || "Registration failed" };
      setUser(result.user);
      localStorage.setItem("qb_user", JSON.stringify(result.user));
      localStorage.setItem("qb_token", result.token);
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem("qb_user");
    localStorage.removeItem("qb_token");
    try {
      await fetch(apiUrl("/auth/logout"), { method: "POST", credentials: "include" });
    } catch {
      // ignore logout API errors
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getAuthToken(): string | null {
  return localStorage.getItem("qb_token");
}
