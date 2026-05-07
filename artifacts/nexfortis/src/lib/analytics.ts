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

  window.gtag?.("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });

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
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
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

export function trackQualifyLead(params: {
  form_id?: string;
  service_interest?: string;
}): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "qualify_lead", {
    form_id: params.form_id ?? "contact",
    form_destination: window.location.pathname,
    service_interest: params.service_interest ?? "general",
  });
}
