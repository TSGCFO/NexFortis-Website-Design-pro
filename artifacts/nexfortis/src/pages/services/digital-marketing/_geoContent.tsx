// Typed content for geo [service]+[city] pages — parallel to _dmContent.tsx.
// Each entry is GENUINELY local (real neighbourhoods, districts, market context, local
// proof) — never a templated city-name swap — which is what defeats Google's doorway-page
// penalty and the cross-page paragraph-dedup gate. The "what is <service>" definition is
// inherited from the national spoke and must NOT be re-authored here.
//
// Authored per page via the run book (Step 5), keyed "<parentSlug>/<citySlug>".
import type { ReactNode } from "react";
import type { SourcedStat, FeatureItem, FaqItem, TestimonialData } from "@/components/content/types";
import type { DmSpokeSlug } from "@/lib/internal-links";

/** A real district / neighbourhood / area the service is delivered in. */
export type GeoServiceArea = { name: string; note?: string };

/** A genuinely-local proof point. Real result/engagement OR a cited local market stat —
 *  NEVER an invented testimonial or client (per _facts.md). */
export type LocalProofPoint = { label: string; detail: ReactNode };

export type GeoPageContent = {
  // ---- identity (relates UP to the national spoke; do NOT re-author the service definition) ----
  parentSlug: DmSpokeSlug;
  citySlug: string;
  cityName: string;
  region: string; // "ON" | "AB" | "BC" | ...
  serviceType: string; // reuse the spoke's serviceType verbatim (schema)

  // ---- SEO meta (city-UNIQUE; cannibalization + INV-002/003/004 driver) ----
  metaTitle: string; // <=60 chars; include "NexFortis" or the suffix auto-appends
  metaDescription: string; // <=160 chars, city-specific (name a real local anchor)
  h1: string; // 25-70 chars — use "<Service> Services in <City>", never the bare 17-char form
  heroSubtitle: string;

  // ---- Service schema (city-aware) ----
  serviceSchemaName: string;
  serviceSchemaDescription: string;
  geoCoordinates?: { lat: number; lng: number };

  // ---- local body (the doorway-safe core; ALL city-unique prose) ----
  introHeading: string;
  intro: ReactNode;
  localContextHeading: string;
  localContext: ReactNode; // REQUIRED: real neighbourhoods, districts, landmarks, local market dynamics
  serviceAreas: readonly GeoServiceArea[]; // REQUIRED >=6 real districts/areas served
  localProof: readonly LocalProofPoint[]; // REQUIRED >=2 (real result or cited market stat — never invented)
  stats: readonly SourcedStat[]; // >=3 external sourced citations (content gate)
  features: readonly FeatureItem[]; // service-in-this-city specifics

  // ---- cross-link copy ----
  nearbyHeading?: string;

  // ---- FAQ (>=4; at least one CITY-specific question) ----
  faq: readonly FaqItem[];

  // ---- optional genuine city testimonial (real only) ----
  testimonial?: TestimonialData;

  authorNote: ReactNode;
  ctaHeading: string;
  ctaSubtext: string;
};

// Keyed "<parentSlug>/<citySlug>". Empty until Wave-1 page #1 (Local SEO Toronto) ships
// through the run book; entries are added as content passes the gates and the matching
// GEO_PAGES entry flips published:true.
export const GEO_PAGE_CONTENT: Partial<Record<string, GeoPageContent>> = {
  // "local-seo/toronto": { ... }  ← authored via the run book (Step 5)
};
