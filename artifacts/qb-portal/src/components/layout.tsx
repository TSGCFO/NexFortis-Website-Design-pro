import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Menu, X, Shield, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Services & Tools" },
  { href: "/faq", label: "FAQ" },
  { href: "/qbm-guide", label: "QBM Guide" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#1a2744]" />
            <div>
              <span className="text-lg font-bold text-[#1a2744]">NexFortis</span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-1">QuickBooks Services</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === link.href
                    ? "text-[#1a2744] bg-[#1a2744]/5"
                    : "text-muted-foreground hover:text-[#1a2744] hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/portal">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {user.name.split(" ")[0]}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/order">
                  <Button size="sm" className="bg-[#f0a500] text-[#1a2744] hover:bg-[#f0a500]/90 font-bold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  location === link.href ? "text-[#1a2744] bg-[#1a2744]/5" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border space-y-2">
              {user ? (
                <>
                  <Link href="/portal" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full" size="sm">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" className="w-full" size="sm" onClick={() => { logout(); setOpen(false); }}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/order" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-[#f0a500] text-[#1a2744] hover:bg-[#f0a500]/90 font-bold" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1a2744] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-[#f0a500]" />
              <span className="font-bold text-lg">NexFortis</span>
            </div>
            <p className="text-sm text-white/70">
              Canadian-first QuickBooks conversion, migration, and data services.
            </p>
            <p className="text-xs text-white/50 mt-2">by NexFortis IT Solutions</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[#f0a500]">Services</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/catalog" className="hover:text-white">All Services</Link></li>
              <li><Link href="/order" className="hover:text-white">Order Now</Link></li>
              <li><Link href="/qbm-guide" className="hover:text-white">QBM Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[#f0a500]">Support</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><a href="mailto:hassansadiq73@gmail.com" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[#f0a500]">Legal</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/50">
          <p>&copy; 2026 NexFortis IT Solutions. All rights reserved.</p>
          <p className="mt-1">Ontario, Canada | hassansadiq73@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
