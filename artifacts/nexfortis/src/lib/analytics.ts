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
  // CRITICAL: this stub MUST push the native `arguments` object, not a
  // rest-parameter array. gtag.js's consent state machine sniffs for the
  // Arguments object shape (own `length`, no Array prototype methods) when
  // detecting consent declarations queued before the library loads. Pushing
  // a plain Array (e.g. `args` from `function gtag(...args)`) is silently
  // ignored, leaving ICS in `usedImplicit:true / active:false` and
  // suppressing every /g/collect hit, regardless of region.
  //
  // The rest-parameter signature is kept ONLY for TypeScript call-site
  // typing; the body still references the bound `arguments` object, which
  // is the actual Arguments instance JavaScript creates for any
  // non-arrow function. This MUST stay a `function` declaration
  // (not an arrow) so that `arguments` is bound.
  // eslint-disable-next-line prefer-rest-params
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  }
  window.gtag = gtag as typeof window.gtag;

  // gtag.js consent state machine: without an explicit consent declaration,
  // gtag.js leaves ICS (internal consent state) in `implicit: true / active:
  // false` and refuses to send any /g/collect hits, regardless of region.
  // We only reach this function after the user clicked Accept on the cookie
  // banner (see line above this block: getConsent() === "granted"), so it is
  // safe and accurate to declare default-denied and then update analytics
  // storage to granted. This is what unblocks the first /g/collect hit.
  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  // Grant all four Consent Mode v2 signals — analytics_storage unblocks the
  // /g/collect hit (behavioral analytics), and ad_storage / ad_user_data /
  // ad_personalization unblock the three ads-side signals so audience
  // remarketing, ads measurement, and conversion export to Google Ads can
  // function. The user has just clicked Accept on the cookie banner, which
  // means consent for both analytics AND advertising is given by our
  // banner copy.
  gtag("consent", "update", {
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
  // Consent withdrawal: signal the gtag.js consent state machine first so
  // any future hits are gated, then keep the legacy ga-disable-<ID> flag as
  // belt-and-suspenders for older gtag.js builds.
  if (typeof window.gtag === "function") {
    // Deny all four Consent Mode v2 signals on withdrawal — granting any of
    // them on Accept means we must explicitly revoke all of them on Decline,
    // not just analytics_storage.
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }
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

/**
 * Fire the GA4 `qualify_lead` key event — used to mark a visitor as a
 * qualified lead (typically on contact-form submit success or a
 * "book a consultation" CTA click). This is the conversion-side signal
 * GA4 uses for audience building, ads attribution, and conversion export.
 *
 * Pair with `trackEvent("contact_form_submit", …)` rather than replace it:
 * `contact_form_submit` is the behavioral form-completion signal,
 * `qualify_lead` is the business-conversion signal. Both should fire on a
 * successful submit.
 */
export function trackQualifyLead(params: {
  form_id?: string;
  service_interest?: string;
}): void {
  if (typeof window === "undefined") return;
  if (!MEASUREMENT_ID) return;
  if (getConsent() !== "granted") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "qualify_lead", {
    form_id: params.form_id ?? "contact",
    form_destination: window.location.pathname,
    service_interest: params.service_interest ?? "general",
  });
}
