// Geo [service]+[city] page registry — the SINGLE SOURCE OF TRUTH for Phase B geo pages.
// A codegen script (scripts/gen-geo-routes.mjs) reads the published entries to emit the
// literal <Route> block into App.tsx; prerender + sitemap follow from those routes.
// Geo pages live in THIS registry (not DM_SPOKES), so they can never flood the mega-menu/
// footer (those read getPublishedSpokes()). City pages relate UP to their national spoke
// (parentSlug), ACROSS to sibling city pages (same service), and the spoke links DOWN here.
//
// Phase B build order + which cities qualify: seo-tools/runbook/geo/03-build-waves.md.
// Demand data behind each entry: seo-tools/runbook/geo/demand-raw.json (3-tool consensus).
import type { DmSpokeSlug } from "./internal-links";

export type GeoPage = {
  /** The national spoke this city page hangs off — MUST be an existing spoke slug. */
  parentSlug: DmSpokeSlug;
  /** URL-safe city slug, e.g. "toronto", "london-ontario" (disambiguated). */
  citySlug: string;
  /** Display name, e.g. "Toronto". */
  cityName: string;
  /** Province / territory code for geo.region (CA-<region>) + schema, e.g. "ON", "AB", "BC". */
  region: string;
  /** Gates route codegen / prerender / sitemap. Flip true only when run-book content is shipped. */
  published: boolean;
  /** Build wave (1-4), from geo/03-build-waves.md — for ordering only. */
  wave?: number;
};

const DM_PILLAR = "/services/digital-marketing";

// Mirrors prerender.mjs city-slug validation (prerender.mjs:137).
const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

// Entries are added per wave as run-book content ships. Wave 1 begins with Local SEO Toronto
// (vol 1000, KD 3 — the best demand-to-difficulty page in Phase B). published:false until its
// content passes the gates.
export const GEO_PAGES: readonly GeoPage[] = [
  { parentSlug: "local-seo", citySlug: "toronto", cityName: "Toronto", region: "ON", wave: 1, published: true },
  { parentSlug: "seo", citySlug: "mississauga", cityName: "Mississauga", region: "ON", wave: 1, published: true },
  { parentSlug: "seo", citySlug: "markham", cityName: "Markham", region: "ON", wave: 1, published: true },
  { parentSlug: "local-seo", citySlug: "edmonton", cityName: "Edmonton", region: "AB", wave: 1, published: true },
  { parentSlug: "web-design", citySlug: "hamilton", cityName: "Hamilton", region: "ON", wave: 1, published: true },
  { parentSlug: "local-seo", citySlug: "calgary", cityName: "Calgary", region: "AB", wave: 1, published: true },
];

export function geoHref(p: Pick<GeoPage, "parentSlug" | "citySlug">): string {
  return `${DM_PILLAR}/${p.parentSlug}/${p.citySlug}`;
}

export function geoKey(p: Pick<GeoPage, "parentSlug" | "citySlug">): string {
  return `${p.parentSlug}/${p.citySlug}`;
}

export function isValidCitySlug(slug: string): boolean {
  return SAFE_SLUG.test(slug);
}

export function getGeoPage(parentSlug: string, citySlug: string): GeoPage | undefined {
  return GEO_PAGES.find((p) => p.parentSlug === parentSlug && p.citySlug === citySlug);
}

export function getPublishedGeoPages(): readonly GeoPage[] {
  return GEO_PAGES.filter((p) => p.published);
}

/** Published city pages for a given national spoke — feeds the spoke's "Areas we serve" (DOWN links). */
export function getGeoPagesForSpoke(parentSlug: DmSpokeSlug): readonly GeoPage[] {
  return GEO_PAGES.filter((p) => p.parentSlug === parentSlug && p.published);
}

/** Other published city pages for the SAME service — feeds NearbyCities (ACROSS links). */
export function getNearbyCityPages(parentSlug: DmSpokeSlug, citySlug: string): readonly GeoPage[] {
  return GEO_PAGES.filter((p) => p.parentSlug === parentSlug && p.citySlug !== citySlug && p.published);
}

/** Published pages for the SAME city but other services — feeds same-city RelatedServices. */
export function getSameCityServices(citySlug: string, exceptParent: DmSpokeSlug): readonly GeoPage[] {
  return GEO_PAGES.filter((p) => p.citySlug === citySlug && p.parentSlug !== exceptParent && p.published);
}
