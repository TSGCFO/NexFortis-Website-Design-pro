import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Monitor, Database, Cloud, Cog, LayoutDashboard, ArrowRight, Sun, Moon, MonitorSmartphone, ChevronUp, ExternalLink } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { trackEvent } from "@/lib/analytics";

const services = [
  { name: "Digital Marketing", href: "/services/digital-marketing", icon: Monitor },
  { name: "Microsoft 365 Solutions", href: "/services/microsoft-365", icon: Cloud },
  { name: "QuickBooks Migration", href: "/services/quickbooks", icon: Database },
  { name: "IT Consulting", href: "/services/it-consulting", icon: Cog },
  { name: "Workflow Automation", href: "/services/workflow-automation", icon: LayoutDashboard },
];

function NavLink({ href, children, location }: { href: string; children: React.ReactNode; location: string }) {
  const isActive = location === href || (href !== "/" && location.startsWith(href));
  return (
    <Link
      href={href}
      className={`text-sm font-display font-semibold transition-colors relative py-2 ${
        isActive
          ? "text-accent"
          : "text-foreground/80 hover:text-accent"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
      )}
    </Link>
  );
}

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

export function Layout({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [location] = useLocation();
  const { resolvedTheme } = useTheme();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const isServicesActive = location === "/services" || location.startsWith("/services/");
  const isServiceSubPage = location.startsWith("/services/");

  useEffect(() => {
    if (isServiceSubPage) {
      document.documentElement.style.scrollPaddingBottom = "7rem";
      return () => {
        document.documentElement.style.scrollPaddingBottom = "";
      };
    }
    return undefined;
  }, [isServiceSubPage]);

  const navbarLogo = resolvedTheme === "dark"
    ? `${import.meta.env.BASE_URL}images/logo-white.svg`
    : `${import.meta.env.BASE_URL}images/logo-original.svg`;

  return (
    <div className="min-h-dvh flex flex-col font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg py-2 border-b border-accent/20"
            : "bg-background py-4"
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center group" aria-label="NexFortis — Go to homepage">
            <img
              src={navbarLogo}
              alt="NexFortis"
              className={`w-auto group-hover:scale-105 transition-all duration-300 ${isScrolled ? "h-12" : "h-14 lg:h-16"}`}
              width={240}
              height={64}
              style={resolvedTheme === "dark" ? { mixBlendMode: "screen" } : undefined}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <NavLink href="/" location={location}>Home</NavLink>

            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setServicesDropdownOpen(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setServicesDropdownOpen(false);
                  (e.currentTarget.querySelector("button") as HTMLElement)?.focus();
                }
              }}
            >
              <button
                type="button"
                onClick={() => setServicesDropdownOpen((prev) => !prev)}
                className={`text-sm font-display font-semibold transition-colors flex items-center gap-1 py-2 relative ${
                  isServicesActive ? "text-accent" : "text-foreground/80 hover:text-accent"
                }`}
                aria-expanded={servicesDropdownOpen}
                aria-haspopup="true"
              >
                Services <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? "rotate-180" : ""}`} />
                {isServicesActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
                )}
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-card rounded-xl shadow-xl border border-border/50 overflow-hidden py-2 transition-all duration-150 origin-top ${
                  servicesDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                }`}
                role="list"
              >
                {services.map((service) => {
                  const Icon = service.icon;
                  const isItemActive = location === service.href;
                  return (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors group ${
                        isItemActive ? "bg-accent/5" : "hover:bg-secondary"
                      }`}
                      role="listitem"
                      aria-current={isItemActive ? "page" : undefined}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isItemActive
                          ? "bg-accent/10 text-accent"
                          : "bg-secondary group-hover:bg-accent/10 text-primary group-hover:text-accent"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-display font-medium transition-colors ${
                        isItemActive ? "text-accent" : "text-foreground group-hover:text-accent"
                      }`}>
                        {service.name}
                      </span>
                    </Link>
                  );
                })}
                <div className="border-t border-border/50 mt-2 pt-2">
                  <Link
                    href="/services"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-display font-semibold text-accent hover:bg-secondary transition-colors"
                    role="listitem"
                  >
                    View All Services <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            <NavLink href="/about" location={location}>About</NavLink>
            <NavLink href="/blog" location={location}>Blog</NavLink>
            <NavLink href="/contact" location={location}>Contact</NavLink>
            <a
              href="https://qbportal.nexfortis.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_click", { cta: "qb_portal", location: "navbar_desktop", destination: "https://qbportal.nexfortis.com" })}
              className="text-sm font-display font-semibold text-foreground/80 hover:text-accent transition-colors py-2 inline-flex items-center gap-1"
            >
              QB Portal <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/contact" className="px-6 py-2.5 rounded-full bg-rose-gold text-rose-gold-foreground font-display font-semibold text-sm hover:bg-rose-gold-hover hover:shadow-lg hover:shadow-rose-gold/20 transition-all hover:-translate-y-0.5">
              Get a Free Quote
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          ref={mobileMenuRef}
          className={`md:hidden border-t border-border overflow-hidden bg-background transition-all duration-200 ease-out ${
            mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col px-4 py-6 gap-4">
            <Link href="/" className={`text-lg font-display font-semibold min-h-[44px] flex items-center ${location === "/" ? "text-accent" : ""}`}>Home</Link>
            <Link href="/services" className={`text-lg font-display font-semibold min-h-[44px] flex items-center ${location === "/services" ? "text-accent" : ""}`}>All Services</Link>
            <div className="pl-4 flex flex-col gap-3 border-l-2 border-border ml-2">
              {services.map((s) => (
                <Link key={s.href} href={s.href} className={`min-h-[44px] font-display flex items-center transition-colors ${location === s.href ? "text-accent font-medium" : "text-muted-foreground hover:text-accent"}`}>
                  {s.name}
                </Link>
              ))}
            </div>
            <Link href="/about" className={`text-lg font-display font-semibold min-h-[44px] flex items-center ${location === "/about" ? "text-accent" : ""}`}>About</Link>
            <Link href="/blog" className={`text-lg font-display font-semibold min-h-[44px] flex items-center ${location === "/blog" ? "text-accent" : ""}`}>Blog</Link>
            <Link href="/contact" className={`text-lg font-display font-semibold min-h-[44px] flex items-center ${location === "/contact" ? "text-accent" : ""}`}>Contact</Link>
            <a href="https://qbportal.nexfortis.com" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("cta_click", { cta: "qb_portal", location: "navbar_mobile", destination: "https://qbportal.nexfortis.com" })} className="text-lg font-display font-semibold min-h-[44px] flex items-center gap-1.5">
              QB Portal <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
            <Link href="/contact" className="mt-4 px-6 py-3 text-center rounded-xl bg-rose-gold text-rose-gold-foreground font-display font-semibold min-h-[44px] flex items-center justify-center">
              Get a Free Quote
            </Link>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        className={`flex-grow pt-20 ${isServiceSubPage ? "pb-28" : ""}`}
        role="main"
      >
        {children}
      </main>

      <div className="brand-accent-bar" aria-hidden="true" />
      <footer className="section-brand-navy pt-20 pb-10" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-6" aria-label="NexFortis — Go to homepage">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo-white.svg`}
                  alt="NexFortis"
                  className="h-16 w-auto"
                  width={240}
                  height={64}
                  style={{ mixBlendMode: "screen" }}
                />
              </Link>
              <p className="text-white/90 mb-2 text-sm font-display font-semibold tracking-wide">
                Complexity Decoded. <span className="text-rose-gold">Advantage.</span>
              </p>
              <p className="text-white/50 mb-2 text-xs font-display">
                Your Business. Our Technology. Limitless Growth.
              </p>
              <p className="text-white/60 mb-6 text-sm leading-relaxed">
                NexFortis provides end-to-end IT solutions for Canadian businesses.
              </p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-lg mb-6 text-white">Services</h4>
              <ul className="space-y-4 text-sm text-white/60">
                {services.map(s => (
                  <li key={s.href}>
                    <Link href={s.href} className="hover:text-accent transition-colors flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" /> {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-lg mb-6 text-white">Company</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-lg mb-6 text-white">Contact</h4>
              <address className="not-italic space-y-4 text-sm text-white/60">
                <p>204 Hill Farm Rd<br/>Nobleton, ON L7B 0A1</p>
                <p><a href="mailto:contact@nexfortis.com" className="hover:text-accent transition-colors">contact@nexfortis.com</a></p>
                <p><a href="https://www.linkedin.com/company/nexfortis" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a></p>
              </address>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 pb-4 flex justify-center items-center gap-8">
            <picture>
              <source srcSet={`${import.meta.env.BASE_URL}images/badge-microsoft-partner.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}images/badge-microsoft-partner.png`}
                alt="Microsoft AI Cloud Partner Program badge"
                className="h-9 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity"
                width={120}
                height={40}
                loading="lazy"
              />
            </picture>
            <picture>
              <source srcSet={`${import.meta.env.BASE_URL}images/badge-google-partner.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}images/badge-google-partner.png`}
                alt="Google Partner badge"
                className="h-9 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity"
                width={120}
                height={40}
                loading="lazy"
              />
            </picture>
            <picture>
              <source srcSet={`${import.meta.env.BASE_URL}images/badge-quickbooks-proadvisor.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}images/badge-quickbooks-proadvisor.png`}
                alt="QuickBooks ProAdvisor badge"
                className="h-9 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity"
                width={120}
                height={40}
                loading="lazy"
              />
            </picture>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} NexFortis IT Solutions (17756968 Canada Inc.). All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function FloatingCTA() {
  const [location] = useLocation();
  const isServicePage = location.startsWith('/services/');

  if (!isServicePage) return null;

  return (
    <div className="fixed bottom-8 right-8 z-40 animate-[slideUp_0.3s_ease-out]">
      <Link
        href="/contact"
        className="flex items-center gap-2 px-6 py-4 rounded-full bg-rose-gold text-rose-gold-foreground font-bold shadow-xl shadow-rose-gold/30 hover:shadow-2xl hover:shadow-rose-gold/40 hover:-translate-y-1 transition-all group"
        aria-label="Get a Free Quote"
      >
        <span>Get a Free Quote</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 left-8 z-40 w-12 h-12 rounded-full bg-secondary border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-accent hover:text-white hover:border-accent transition-all hover:-translate-y-0.5 animate-[fadeInScale_0.2s_ease-out]"
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
