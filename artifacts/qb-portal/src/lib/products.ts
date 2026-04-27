// Long-form body-copy schema (added in audit PR-1, 2026-04-26).
//
// Each service in products.json may now carry up to five optional content
// blocks that the service-detail template renders as separate cards. The
// fields are intentionally optional so the template stays valid for
// services that haven't been authored yet, and so future PRs (notably PR
// #4 heading hierarchy) can extend coverage without breaking existing
// data.
export interface ProductFAQ {
  question: string;
  answer: string;
}
export interface ProductHowItWorksStep {
  step: string;
  body: string;
}
export interface ProductFeatureSection {
  heading: string;
  body: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  category_slug: string;
  description: string;
  // Short hero subtitle used on the service detail page above the fold and as
  // a unique sentence on cross-listings (catalog/category cards). Required for
  // every service since PR fixing audit issue C1 — having it eliminates the
  // duplicate-paragraph pattern Seobility flagged across ~40 portal URLs.
  // 10–15 words, must NOT repeat any sentence in `description`.
  tagline?: string;
  // Optional SEO-specific description used as the <meta name="description">
  // and og:description on the service detail page. Should be <=155 chars so
  // Google doesn't truncate it. If absent, the page falls back to
  // `description` with a length check — see service-detail.tsx.
  meta_description?: string;
  deliverable: string;
  base_price_cad: number;
  launch_price_cad: number;
  turnaround: string;
  badge: "available";
  is_addon: boolean;
  requires_service: number | null;
  accepted_file_types: string[];
  sort_order: number;
  billing_type?: "subscription";
  billing_interval?: "month";
  pack_size?: number;
  // Long-form body copy. Each paragraph must be unique within and across
  // services (audit PDF p.45-46, p.36-37). Audit PR-1 populates
  // longDescription, featureSections, and faqs for every service to push
  // each page above the 500-word floor (PDF p.34-35). whyItMatters and
  // howItWorks remain in the schema for future PRs but are intentionally
  // not populated in PR-1 to keep the H2 count <=8 per page.
  longDescription?: string[];
  whyItMatters?: string;
  howItWorks?: ProductHowItWorksStep[];
  featureSections?: ProductFeatureSection[];
  faqs?: ProductFAQ[];
}

export interface ProductCatalog {
  promo_active: boolean;
  promo_label: string;
  services: Product[];
}

let catalogCache: ProductCatalog | null = null;

import { getApiBase } from "./api-base";

function apiBase(): string {
  return getApiBase();
}

async function fetchPromoStatusOverride(): Promise<{ promo_active: boolean; promo_label: string } | null> {
  try {
    const res = await fetch(`${apiBase()}/api/qb/site-settings/promo-status`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (typeof json?.promo_active !== "boolean") return null;
    return { promo_active: json.promo_active, promo_label: typeof json.promo_label === "string" ? json.promo_label : "" };
  } catch {
    return null;
  }
}

export async function loadProducts(): Promise<ProductCatalog> {
  if (catalogCache) return catalogCache;
  const res = await fetch(`${import.meta.env.BASE_URL}products.json`);
  const catalog = (await res.json()) as ProductCatalog;
  // Override the static promo_active value with the live, admin-controlled
  // setting from the server. If the server is unreachable, fall back to
  // whatever products.json says.
  const override = await fetchPromoStatusOverride();
  if (override) {
    catalog.promo_active = override.promo_active;
    catalog.promo_label = override.promo_label || catalog.promo_label;
  }
  catalogCache = catalog;
  return catalogCache;
}

export function clearProductsCache(): void {
  catalogCache = null;
}

export function getServiceCategories(services: Product[]): string[] {
  return [...new Set(services.map((s) => s.category))];
}

export function getProductById(catalog: ProductCatalog, id: number): Product | undefined {
  return catalog.services.find((p) => p.id === id);
}

export function getProductBySlug(catalog: ProductCatalog, slug: string): Product | undefined {
  return catalog.services.find((p) => p.slug === slug);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getActivePrice(product: Product): number {
  if (!catalogCache) return product.base_price_cad;
  return catalogCache.promo_active ? product.launch_price_cad : product.base_price_cad;
}

export function isPromoActive(): boolean {
  return catalogCache?.promo_active ?? false;
}

export function formatPriceCAD(cents: number): string {
  return `$${(cents / 100).toFixed(2)} CAD`;
}
