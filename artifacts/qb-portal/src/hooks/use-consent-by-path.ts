// Path-aware Consent Mode v2 re-evaluation on SPA navigation.
//
// qb.nexfortis.com is a single-page app — clicking a link doesn't reload
// the page, so initAnalytics() (which evaluates the path once on first
// page load) cannot keep ads-side consent in sync as the user moves
// between marketing and portal/authenticated areas.
//
// This hook fires on every route change and re-runs `consent("update", ...)`
// to grant the three ads-side signals when the user is on a public
// marketing path and revoke them when the user crosses into the portal.
// `analytics_storage` is unaffected — once granted by the user's banner
// accept, it stays granted regardless of path.
//
// Safe during prerender: the hook body is wrapped in a useEffect, and the
// effect bails out cleanly if window or window.gtag is undefined (which is
// always true during prerender, because gtag.js is only loaded after the
// user clicks Accept on the cookie banner — and prerender never clicks
// anything).
import { useEffect } from "react";
import { useLocation } from "wouter";
import { getConsent, isPublicMarketingPath } from "@/lib/analytics";

export function useConsentByPath(): void {
  const [location] = useLocation();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    if (getConsent() !== "granted") return;
    const grant = isPublicMarketingPath(location);
    window.gtag("consent", "update", {
      ad_storage: grant ? "granted" : "denied",
      ad_user_data: grant ? "granted" : "denied",
      ad_personalization: grant ? "granted" : "denied",
    });
  }, [location]);
}
