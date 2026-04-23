import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  getConsent,
  initAnalytics,
  isAnalyticsConfigured,
  setConsent,
} from "@/lib/analytics";

// Cookie consent banner for PIPEDA-compliant analytics opt-in.
// Mirrors the marketing site banner — same copy, same storage key, so a visitor
// who accepts/declines on nexfortis.com sees a fresh prompt on qb.nexfortis.com
// (localStorage is per-origin) but the UX looks identical.
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isAnalyticsConfigured()) return;
    const status = getConsent();
    if (status === "granted") {
      initAnalytics();
      return;
    }
    if (status === "unset") {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-4xl bg-card border border-border shadow-2xl rounded-2xl p-5 sm:p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-foreground leading-relaxed">
          We use cookies for analytics to understand how visitors use our site
          and improve our services. No personal information is sold. See our{" "}
          <Link
            href="/privacy"
            className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setConsent("denied");
              setVisible(false);
            }}
            className="px-4 py-2.5 min-h-[44px] rounded-xl border border-border text-sm font-display font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => {
              setConsent("granted");
              setVisible(false);
            }}
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-accent text-white text-sm font-display font-semibold hover:bg-accent/90 transition-colors"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
