import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, ShoppingCart, Users, MessageSquare, LogOut, Menu, X } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/tickets", label: "Tickets", icon: MessageSquare },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, session, loading: authLoading, isOperator } = useAuth();
  const [location, navigate] = useLocation();
  const [aal2Verified, setAal2Verified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

    let cancelled = false;
    (async () => {
      setAal2Verified(false);
      setChecking(true);
      try {
        const { data: factorsData } = await supabase.auth.mfa.listFactors();
        if (cancelled) return;
        const totpFactors = factorsData?.totp?.filter((f) => f.status === "verified") ?? [];

        if (totpFactors.length === 0) {
          navigate("/admin/mfa-enroll");
          return;
        }

        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (cancelled) return;

        if (!aalData || aalData.currentLevel !== "aal2") {
          navigate("/admin/mfa-challenge");
          return;
        }

        setAal2Verified(true);
      } catch {
        if (cancelled) return;
        navigate("/admin/mfa-challenge");
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => { cancelled = true; };
  }, [authLoading, session, user, isOperator, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (authLoading || checking || !aal2Verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B76E79]" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0A1628] text-white transform transition-transform duration-200
        md:relative md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}>
                Admin Panel
              </h2>
              {user && (
                <p className="text-sm text-white/60 truncate mt-0.5">{user.name}</p>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href ||
                (item.href !== "/admin" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#B76E79]/20 text-[#B76E79]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white w-full transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 md:hidden sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-[#0A1628]" style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}>
            Admin
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
