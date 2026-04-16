import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/hooks/use-theme";
import { Menu, X, User, LogOut, ArrowRight, Sun, Moon, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Services & Tools" },
  { href: "/subscription", label: "Support Plans" },
  { href: "/faq", label: "FAQ" },
  { href: "/qbm-guide", label: "QBM Guide" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const options = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: MonitorSmartphone, label: "System" },
  ];

  const current = options.find(o => o.value === theme) || options[2];
  const CurrentIcon = current.icon;

  return (
    <div
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="p-2 min-w-[40px] min-h-[40px] rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors flex items-center justify-center"
        aria-label={`Theme: ${current.label}. Click to change.`}
        aria-expanded={open}
      >
        <CurrentIcon className="w-5 h-5" />
      </button>
      <div
        className={`absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden w-36 z-50 transition-all duration-150 origin-top-right ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
        role="listbox"
        aria-label="Select theme"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => { setTheme(opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                isSelected ? "bg-accent/10 text-accent" : "text-foreground hover:bg-secondary"
              }`}
              role="option"
              aria-selected={isSelected}
            >
              <Icon className="w-4 h-4" />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, signOut, isOperator } = useAuth();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const navbarLogo = resolvedTheme === "dark"
    ? `${import.meta.env.BASE_URL}images/logo-white.svg`
    : `${import.meta.env.BASE_URL}images/logo-original.svg`;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg py-2 border-b border-accent/20"
          : "bg-background py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center group" aria-label="NexFortis QuickBooks Services — Home">
          <img
            src={navbarLogo}
            alt="NexFortis"
            className={`w-auto group-hover:scale-105 transition-all duration-300 ${isScrolled ? "h-10" : "h-12 lg:h-14"}`}
            width={200}
            height={56}
            style={resolvedTheme === "dark" ? { mixBlendMode: "screen" } : undefined}
          />
          <span className="hidden sm:inline text-xs text-muted-foreground ml-2 font-display">QuickBooks Services</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-display font-semibold transition-colors relative ${
                  isActive
                    ? "text-accent"
                    : "text-foreground/80 hover:text-accent"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              {isOperator && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-1 font-display text-muted-foreground">
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/portal">
                <Button variant="ghost" size="sm" className="gap-2 font-display">
                  <User className="w-4 h-4" />
                  {user.name.split(" ")[0]}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-display">Sign In</Button>
              </Link>
              <Link href="/order">
                <Button size="sm" className="bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold rounded-full px-5">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden border-t border-border overflow-hidden bg-background transition-all duration-200 ease-out ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-display font-semibold min-h-[44px] flex items-center ${
                location === link.href ? "text-accent" : "text-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border space-y-2">
            {user ? (
              <>
                {isOperator && (
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full font-display text-muted-foreground" size="sm">Admin Panel</Button>
                  </Link>
                )}
                <Link href="/portal" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full font-display" size="sm">Dashboard</Button>
                </Link>
                <Button variant="ghost" className="w-full font-display" size="sm" onClick={() => { signOut(); setOpen(false); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full font-display" size="sm">Sign In</Button>
                </Link>
                <Link href="/order" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <>
      <div className="brand-accent-bar" aria-hidden="true" />
      <footer className="section-brand-navy pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-10 mb-12">
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo-white.svg`}
                  alt="NexFortis"
                  className="h-14 w-auto"
                  width={200}
                  height={56}
                  style={{ mixBlendMode: "screen" }}
                />
              </Link>
              <p className="text-white/70 text-sm mb-1">
                Canadian-first QuickBooks conversion, migration, and data services.
              </p>
              <p className="text-white/40 text-xs">by NexFortis IT Solutions</p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-lg mb-4 text-white">Services</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/catalog" className="hover:text-accent transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> All Services</Link></li>
                <li><Link href="/order" className="hover:text-accent transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Order Now</Link></li>
                <li><Link href="/qbm-guide" className="hover:text-accent transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> QBM Guide</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-lg mb-4 text-white">Popular services</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/landing/enterprise-to-premier-conversion" className="hover:text-accent transition-colors">Enterprise to Premier Conversion</Link></li>
                <li><Link href="/landing/quickbooks-file-too-large" className="hover:text-accent transition-colors">QuickBooks File Too Large</Link></li>
                <li><Link href="/landing/quickbooks-running-slow" className="hover:text-accent transition-colors">QuickBooks Running Slow</Link></li>
                <li><Link href="/landing/audit-trail-removal" className="hover:text-accent transition-colors">Audit Trail Removal</Link></li>
                <li><Link href="/landing/quickbooks-desktop-end-of-life" className="hover:text-accent transition-colors">QuickBooks Desktop End of Life</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-lg mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/subscription" className="hover:text-accent transition-colors">Support Plans</Link></li>
                <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
                <li><a href="mailto:support@nexfortis.com" className="hover:text-accent transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-lg mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 pb-4 flex justify-center items-center gap-8">
            <img
              src={`${import.meta.env.BASE_URL}images/badge-microsoft-partner.png`}
              alt="Microsoft AI Cloud Partner Program badge"
              className="h-9 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity"
            />
            <img
              src={`${import.meta.env.BASE_URL}images/badge-google-partner.png`}
              alt="Google Partner badge"
              className="h-9 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity"
            />
            <img
              src={`${import.meta.env.BASE_URL}images/badge-quickbooks-proadvisor.png`}
              alt="QuickBooks ProAdvisor badge"
              className="h-9 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity"
            />
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} NexFortis IT Solutions. All rights reserved.</p>
            <p>Ontario, Canada | support@nexfortis.com</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
