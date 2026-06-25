# Phase B — Geo Page Architecture (design spec, pending operator approval)

**Date:** 2026-06-24 · **Status:** DESIGNED — awaiting operator sign-off before implementation.
**Source:** workflow `geo-architecture-design` (5 readers mapped the real code + a Plan-agent architect synthesized this), then **verified by hand** (seo.tsx geo/areaServed hardcoding confirmed at lines 53-54, 178-181; prerender route-discovery regex + `:`-exclusion confirmed in the routing map). Full raw proposal: `wfr7p27id.output`.

URL shape (locked): `/services/digital-marketing/<service>/<city>` — child of the national spoke; inherits sitemap `/services/` priority 0.8 automatically.

---

## 1. Route declaration — codegen literal routes from one registry
**Single source of truth:** new `src/lib/geo-links.ts` → `GEO_PAGES` (`{parentSlug, citySlug, cityName, region, href, title, linkText, published}`). Service slugs MUST equal the existing spoke slugs (`seo`, `local-seo`, `web-design`, `google-ads-ppc`, `social-media-marketing`) so parentage is a real reference.

**Why not a param route:** `prerender.mjs` discovers routes by regex on App.tsx `path="…"` literals and **excludes any route containing `:`** — a `/:service/:city` param route would never prerender (would serve the noindex SPA shell). Confirmed in the map.

**Decision (my refinement of the architect's "79 thin files"):** a codegen script (`scripts/gen-geo-routes.mjs`) reads `geo-links.ts` and emits, between sentinel comments in `App.tsx`, **79 literal render-prop Route lines sharing one body — no per-page files**:
```tsx
// <<< GEO ROUTES: generated from src/lib/geo-links.ts — do not edit by hand >>>
<Route path="/services/digital-marketing/local-seo/toronto">
  {() => <GeoServicePageBody service="local-seo" city="toronto" />}
</Route>
```
Literal `path="…"` → discovered by the existing regex (zero prerender change); shared body → no 79-file boilerplate; a drift test asserts the block matches the registry. (Architect's alternative — blog-style `discoverGeoRoutes()` + one param route — is the lighter fallback but needs a prerender.mjs change; **see Decision A**.)

## 2. Typed geo content model (the anti-doorway core)
New `_geoContent.tsx` → `GeoPageContent` type + `GEO_PAGE_CONTENT` map (keyed `"<service>/<city>"`), reusing existing primitives (`SourcedStat`, `FeatureItem`, `FaqItem`, `TestimonialData`). **Required city-unique local fields** (this is what defeats the doorway penalty + the cross-page paragraph-dedup gate):
- `localContext` (ReactNode) — real neighbourhoods, business districts, landmarks, local market dynamics.
- `serviceAreas` (≥6) — real districts/neighbourhoods served.
- `localProof` (≥2) — genuine local result/engagement (**never invented testimonials** — `_facts.md` rule; **see Decision B**).
- city-unique `intro`, ≥1 city-specific `faq`, `nearbyCities`, city-flavoured `features`, `metaTitle/Desc/h1`.
**Inherit from the national spoke (do NOT re-author):** `serviceType`, the service definition, brand voice, author identity.

## 3. Page component — new `_GeoServicePageBody.tsx`
Not an overload of `DmSpokePageBody` (its slug coupling to the closed `DmSpokeSlug` union + throwing lookup make overloading messy). Reuses every existing primitive (`PageHero`, `StatBand`, `FeatureGrid`, `RelatedServices`, `CTAStrip`, `AuthorBio`, FAQ, `PageBreadcrumbs`) + 3 net-new local blocks: `LocalContextSection`, `GeoServiceAreaList`, `NearbyCities`.

## 4. SEO/schema wiring — 2 backward-compatible `seo.tsx` changes (VERIFIED needed)
1. `SEO` gains `geoRegion` / `geoPlacename` props (default `"CA-ON"` / `"Nobleton"`) — fixes the hardcoded Nobleton on every page (lines 53-54). National callers unchanged.
2. `ServiceSchema` gains optional `areaServed` prop (default `{Country, Canada}`) — geo page passes `{ "@type":"City", name:cityName, containedInPlace:{AdministrativeArea, region} }` (line 178). National callers unchanged.
- **Canonical** = self (works as-is). **Breadcrumb** = Home→Services→Digital Marketing→{Service}→{City} (reuse `BreadcrumbSchema`).
- **No second LocalBusiness** (global one has fixed `@id #localbusiness` — duplicate @id collides). City signal rides on `ServiceSchema.areaServed=City` only.
- **Internal links:** UP (in-prose link to national spoke), ACROSS (`NearbyCities` → same service other cities), DOWN (an "Areas we serve" section on the *spoke* body → its city pages). Geo lives in a **separate registry**, so it is structurally impossible for 79 links to flood the mega-menu (nav reads only `getPublishedSpokes()`).
- **Meta:** H1 = `<Service> Services in <City>` (bare "Local SEO Toronto" = 17 chars, fails the 25-char floor — always use the "in {City}" form). Title ≤60, Desc ≤160, city-unique.

## 5. Prerender + sitemap — near-zero change
Codegen'd literal routes → discovered automatically. Sitemap `walkPrerendered` auto-includes every prerendered page at priority 0.8 → **zero sitemap change**. `published:false` in the registry = no route, no prerender, no sitemap entry. **Wave-gate the build** (any one failing geo page hard-fails the whole deploy) — ship Wave 1 (15) first.

## 6. Tests + cannibalization (the load-bearing encoding)
- `keyword-ownership.json`: national spoke owns the **unqualified head** (`local-seo` → `"local seo services"`); each city page owns **only city-qualified** strings (`"local seo toronto"`, never the bare head) → distinct keys → `check-cannibalization` passes. No two city pages share a string.
- Add `check-cannibalization.mjs` to the `test:seo` chain (currently manual) so 79 pages can't drift silently (**Decision G**).
- `dm-word-targets.json`: one entry per route (`kind:"geo"`, starting band ~700–1500, tightened per measured SERP at Step 4). Snapshots + known-issues stubs emitted by the generator per wave.

## 7. Per-page run book (the 8 steps for a geo page)
1 KW research (pull from `demand-raw.json`) → 2 cannibalization gate (city-qualified cluster) → 3 KI brief (geo intent) → 4 SERP length → 5 outline (spoke skeleton + required local sections) → 6 city-UNIQUE draft (real local detail, no fabrication) → 7 gates (paragraph-dedup = doorway guard) → 8 publish (`published:true`, regen routes, link QA, full `test:seo`).

## 8. File-change list (architecture + Wave-1 page #1 Local SEO Toronto)
**New:** `geo-links.ts`, `_geoContent.tsx`, `_GeoServicePageBody.tsx`, `LocalContextSection.tsx` / `GeoServiceAreaList.tsx` / `NearbyCities.tsx`, `scripts/gen-geo-routes.mjs`, `tests/seo/geo-routes-drift.test.mjs`.
**Edit:** `App.tsx` (codegen geo block), `seo.tsx` (2 prop additions), `_DmSpokePageBody.tsx` ("Areas we serve" DOWN-link), `keyword-ownership.json`, `dm-word-targets.json`, `__known-issues__.json`, root `package.json` (cannibalization in `test:seo`).

---

## OPEN DECISIONS (need operator sign-off)
- **A. Route mechanism** — *Rec:* codegen literal render-prop routes (no 79 files, no prerender change, drift-tested). Alt: blog-style param route + `discoverGeoRoutes()`.
- **B. Local-proof sourcing** — geo pages need genuine local proof. Do you have **real per-city results/engagement** to supply, or do we fall back to **market stats** (NEVER invented testimonials, per `_facts.md`)? ← the content-integrity decision.
- **C. Geo word band** — start 700–1500 `<main>`, tighten per measured SERP. Confirm.
- **D. Link graph** — `RelatedServices` = other 4 services SAME city; `NearbyCities` = same service OTHER cities. Confirm.
- **E. LocalBusiness depth** — `ServiceSchema.areaServed=City` only now; defer per-city `Place`/coordinates. Confirm.
- **F. Wave-gating** — build/ship Wave 1 (15) → 2 → 3 → 4. Confirm.
- **G. Cannibalization in CI** — add to `test:seo`. Confirm.
