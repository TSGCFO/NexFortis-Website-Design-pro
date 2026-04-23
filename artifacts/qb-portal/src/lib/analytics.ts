// Consent-gated Google Analytics 4 loader for the QuickBooks portal.
//
// Mirrors the marketing site implementation (artifacts/nexfortis/src/lib/analytics.ts)
// so both hosts share one GA4 property with cross-domain tracking. A visitor
// who starts on nexfortis.com and moves to qb.nexfortis.com is counted as a
// single session as long as both hosts carry the same Measurement ID and the
// linker domains below.
//
// Analytics only fires AFTER the user clicks Accept on the cookie banner —
// the `nf_analytics_consent` localStorage key is the shared consent signal
// read and written on both hosts. Storage key is shared, but localStorage is
// per-origin, so the user is asked on each host the first time they arrive.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as
  | string
  | undefined;

const CROSS_DOMAINS = ["nexfortis.com", "qb.nexfortis.com"];

const CONSENT_KEY = "nf_analytics_consent";

export type ConsentStatus = "granted" | "denied" | "unset";

export function getConsent(): ConsentStatus {
  if (typeof window === "undefined") return "unset";
  const v = window.localStorage.getItem(CONSENT_KEY);
  if (v === "granted" || v === "denied") return v;
  return "unset";
}

export function setConsent(status: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, status);
  if (status === "granted") {
    initAnalytics();
  } else {
    disableAnalytics();
  }
}

let loaded = false;

export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (!MEASUREMENT_ID) return;
  if (getConsent() !== "granted") return;
  if (loaded) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag as typeof window.gtag;

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, {
    anonymize_ip: true,
    linker: { domains: CROSS_DOMAINS },
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    MEASUREMENT_ID,
  )}`;
  document.head.appendChild(script);
}

function disableAnalytics(): void {
  if (typeof window === "undefined") return;
  if (!MEASUREMENT_ID) return;
  (window as unknown as Record<string, boolean>)[
    `ga-disable-${MEASUREMENT_ID}`
  ] = true;
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  if (!MEASUREMENT_ID) return;
  if (getConsent() !== "granted") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(MEASUREMENT_ID);
}
