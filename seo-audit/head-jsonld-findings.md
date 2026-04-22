# SEO Head + JSON-LD Audit — NexFortis Production Sites
**Audit Date:** 2025-07-14  
**Sites audited:** `https://qb.nexfortis.com` (49 URLs) · `https://nexfortis.com` (17 URLs)  
**Total URLs:** 66  
**Method:** Parallel `curl -sL` fetches (10 concurrent), custom Python parser with apostrophe-safe attribute regex  

---

## Executive Summary

| Dimension | QB (49 URLs) | NF (17 URLs) | Total |
|---|---|---|---|
| **URLs audited** | 49 | 17 | 66 |
| **PASS (no issues)** | 29 (59%) | 11 (65%) | **40 (61%)** |
| **Any issue** | 20 (41%) | 6 (35%) | **26 (39%)** |
| **CRITICAL** | 0 | 0 | **0** |
| **IMPORTANT** | 8 URLs / 9 issues | 5 URLs / 8 issues | **13 URLs / 17 issues** |
| **MINOR** | 7 URLs / 7 issues | 1 URL / 1 issue | **8 URLs / 8 issues** |
| **JSON-LD gaps** | 7 | 1 | **8** |
| **Total issues** | 23 | 10 | **33** |
| **Duplicate titles** | 0 | 0 | **0** |
| **Duplicate descriptions** | 0 | 0 | **0** |
| **noindex leaks** | 0 | 0 | **0** |
| **Missing canonicals** | 0 | 0 | **0** |
| **Canonical mismatches** | 0 | 0 | **0** |
| **Broken og:image** | 0 | 0 | **0** |
| **Dedupe failures** | 0 | 0 | **0** |

**Overall verdict: PASS with IMPORTANT findings.** No indexation-blocking issues were detected. Both sites have solid canonical hygiene, correct robots directives, working OG images, full Twitter card coverage, and zero dedupe failures. The 33 issues found are all title/description length overruns or missing optional JSON-LD schema types on a subset of landing pages.

---

## Dimensional Summary

### 1. Title (`<title>`)
- **PASS rate:** 55/66 (83%)
- All 66 titles are **non-empty** and **unique**.
- **QB** homepage title uses HTML-decoded ampersand correctly (`&` not `&amp;`).
- **15 titles exceed 60 characters** (soft limit); **5 of those exceed 70 characters** (hard flag).
- Root cause: QB uses `${title} | ${SITE_NAME}` where `SITE_NAME = "NexFortis QuickBooks Portal"` (26 chars). On longer service names this reliably pushes past 70 chars.
- NF blog titles use `${title} | NexFortis IT Solutions"` (21 chars suffix) combined with full article headlines.

### 2. Meta Description
- **PASS rate:** 57/66 (86%)
- All 66 descriptions are **non-empty** and **unique**.
- No descriptions below 50 characters after corrected apostrophe-safe parsing (initial run falsely flagged 2 blog posts due to single-quote content truncation — resolved in v2 parser).
- **9 descriptions exceed 160 characters** — all on QB service/volume-pack pages and NF blog posts.
- 3 QB category pages have a **double-word bug** in their auto-generated descriptions (see MINOR section).

### 3. Canonical
- **PASS rate:** 66/66 (100%)
- Every URL has a canonical present, pointing to the correct production URL (no localhost, no staging, no trailing-slash mismatch).
- Both sites correctly strip trailing slashes in canonical values.

### 4. Robots
- **PASS rate:** 66/66 (100%)
- All pages return `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`.
- **Zero noindex leaks** across all 66 URLs.

### 5. Open Graph
- **PASS rate:** 66/66 (100%)
- All 6 required OG tags present on every URL: `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:site_name`.
- `og:locale=en_CA` present on all 66 pages.
- `og:url` matches canonical on all pages.
- All `og:image` URLs are absolute `https://` and return **HTTP 200**.
- QB landing pages have **per-page OG images** (`/og/<slug>.jpg`) — all 20 return 200.
- QB service pages and NF all pages share a single OG image (default fallback) — not flagged as broken, but noted as an optimization gap.

### 6. Twitter Card
- **PASS rate:** 66/66 (100%)
- All 66 pages have `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.

### 7. Dedupe (react-helmet-async + lib/seo-dedupe.mjs)
- **PASS rate:** 66/66 (100%)
- Zero duplicate `<title>`, `<meta name="description">`, `<link rel="canonical">`, or any OG/Twitter tag on any page.
- The dedupe pipeline is functioning correctly on all prerendered output.

### 8. JSON-LD
- **PASS rate:** 58/66 (88%)
- Zero invalid JSON blocks, zero missing `@context`, zero missing `@type`.
- No placeholder/stale content detected (earlier detection of "your company/business" phrases were false positives from natural FAQ/article text).
- **8 pages missing expected schema type** (7 QB landing pages + 1 NF services overview).

---

## Issue Index — Complete List

### CRITICAL (0)
> No indexation-breaking issues found. All canonicals, robots, and titles are present and correct.

---

### IMPORTANT (17 issues across 13 URLs)

#### Title > 70 characters (6 issues)

| # | URL | Title (chars) | Title Text |
|---|---|---|---|
| I-01 | `qb.nexfortis.com/catalog` | **88c** | "QuickBooks Service Catalog — Conversions, Repair & Support \| NexFortis QuickBooks Portal" |
| I-02 | `qb.nexfortis.com/subscription` | **76c** | "QuickBooks Support Plans — Monthly Expert Help \| NexFortis QuickBooks Portal" |
| I-03 | `nexfortis.com/blog/microsoft-365-migration-checklist-canadian-smbs` | **76c** | "Microsoft 365 Migration Checklist for Canadian SMBs \| NexFortis IT Solutions" |
| I-04 | `nexfortis.com/blog/top-5-workflow-automation-wins-small-businesses` | **76c** | "Top 5 Workflow Automation Wins for Small Businesses \| NexFortis IT Solutions" |
| I-05 | `nexfortis.com/blog/what-is-pipeda-why-it-matters` | **76c** | "What Is PIPEDA and Why It Matters for Your Business \| NexFortis IT Solutions" |
| I-06 | `nexfortis.com/blog/quickbooks-desktop-vs-online` | **89c** | "QuickBooks Desktop vs. Online: Which Is Right for Your Business? \| NexFortis IT Solutions" |

**Root cause:** NF blog posts: `ArticleSchema` in `nexfortis/src/components/seo.tsx` (line 24) appends `| NexFortis IT Solutions` unconditionally via `${title} | ${SITE_NAME}`. The full article headline + suffix exceeds 70 chars on all 5 blog posts. QB: `catalog` and `subscription` page titles defined inline in their respective page components are too long before the suffix is even applied.

**Fix:** Either shorten the raw title prop passed to `<SEO>` in each page component, or truncate smartly in the `SEO` component at 70 chars with an ellipsis. For blog posts, consider a shorter display title separate from the H1 headline. Specific files:
- `nexfortis/src/pages/blog-post.tsx` line 54: `<SEO title={post.title}` — `post.title` is the full headline; add a `seoTitle` field to blog post data.
- `qb-portal/src/pages/catalog.tsx`: `title={...}` prop — shorten to `QuickBooks Services Catalog | NexFortis QB Portal` (55c).
- `qb-portal/src/pages/subscription.tsx`: `title={...}` prop — shorten to `QuickBooks Support Plans | NexFortis QB Portal` (46c).

---

#### Description > 160 characters (11 issues)

| # | URL | Chars | First 100 chars |
|---|---|---|---|
| I-07 | `nexfortis.com/blog/5-signs-your-business-needs-an-it-audit` | **206c** | "If your technology costs are climbing, your team is frustrated with slow systems…" |
| I-08 | `nexfortis.com/blog/microsoft-365-migration-checklist-canadian-smbs` | **202c** | "Planning a move to Microsoft 365? This comprehensive checklist covers everything…" |
| I-09 | `nexfortis.com/blog/quickbooks-desktop-vs-online` | **205c** | "Choosing between QuickBooks Desktop and QuickBooks Online is one of the most com…" |
| I-10 | `nexfortis.com/blog/top-5-workflow-automation-wins-small-businesses` | **181c** | "Workflow automation isn't just for enterprises. Here are five practical automati…" |
| I-11 | `nexfortis.com/blog/what-is-pipeda-why-it-matters` | **217c** | "Canada's federal privacy law affects every business that collects personal infor…" |
| I-12 | `qb.nexfortis.com/service/10-pack-conversions` | **181c** | "Bundle of 10 standard Enterprise → Premier/Pro conversions at the best value. Id…" |
| I-13 | `qb.nexfortis.com/service/5-pack-conversions` | **184c** | "Bundle of 5 standard Enterprise → Premier/Pro conversions at a discounted rate…" |
| I-14 | `qb.nexfortis.com/service/enterprise-to-premier-complex` | **174c** | "Convert complex QuickBooks Enterprise files with advanced inventory, multi-curre…" |
| I-15 | `qb.nexfortis.com/service/enterprise-to-premier-standard` | **185c** | "Convert your QuickBooks Enterprise file to Premier or Pro. Standard complexity f…" |
| I-16 | `qb.nexfortis.com/service/extended-support` | **178c** | "Upgrade your included 2-ticket post-order support to 5 tickets with 1-hour prio…" |
| I-17 | `qb.nexfortis.com/service/qbo-readiness-report` | **188c** | "Comprehensive report analyzing your QuickBooks Desktop file's readiness for migr…" |

**Root cause (NF):** Blog post `excerpt` field is used directly as description without trimming. In `nexfortis/src/pages/blog-post.tsx` line 54, `description={post.excerpt}` — the excerpt is the full article opener, not a constrained 155-char summary. These excerpts are stored in the API/database.

**Root cause (QB):** Service product `description` field in the Supabase `products` table is written for UI display (full paragraph), not as a constrained meta description. Passed directly to `<SEO description={product.description}>` in `qb-portal/src/pages/service-detail.tsx` line 75 with no truncation.

**Fix (NF):** Add a dedicated `metaDescription` field (max 155 chars) to the blog post content type, separate from `excerpt`. Edit `nexfortis/src/pages/blog-post.tsx` to prefer `post.metaDescription || post.excerpt.slice(0,155)`.

**Fix (QB):** Add a `meta_description` column to the products table (Supabase) constrained to 155 chars, or truncate in `service-detail.tsx`: `description={product.meta_description || product.description.slice(0,155)}`.

---

### MINOR (8 issues across 8 URLs)

#### Title 61–70 characters (7 issues)

These are titles that exceed the ideal 60-char soft limit but are below the 70-char hard flag. Google may truncate them in SERPs but they are not penalized.

| # | URL | Chars | Title |
|---|---|---|---|
| M-01 | `qb.nexfortis.com/` | **67c** | "QuickBooks Conversion & Data Services \| NexFortis QuickBooks Portal" |
| M-02 | `qb.nexfortis.com/landing/is-it-safe` | **61c** | "Is QuickBooks Conversion Safe? \| NexFortis Security & Process" |
| M-03 | `qb.nexfortis.com/service/audit-trail-cra-bundle` | **66c** | "Audit Trail + CRA Period Copy Bundle \| NexFortis QuickBooks Portal" |
| M-04 | `qb.nexfortis.com/service/enterprise-to-premier-complex` | **62c** | "Enterprise → Premier/Pro Complex \| NexFortis QuickBooks Portal" |
| M-05 | `qb.nexfortis.com/service/enterprise-to-premier-standard` | **63c** | "Enterprise → Premier/Pro Standard \| NexFortis QuickBooks Portal" |
| M-06 | `qb.nexfortis.com/service/guaranteed-30-minute` | **61c** | "Guaranteed 30-Minute Conversion \| NexFortis QuickBooks Portal" |
| M-07 | `qb.nexfortis.com/service/sage50-to-quickbooks` | **68c** | "Sage 50/Simply Accounting → QuickBooks \| NexFortis QuickBooks Portal" |

**Root cause:** The QB `SITE_NAME` suffix ` | NexFortis QuickBooks Portal` is 29 characters. Any page title base over 31 chars will push the full title past 60. The suffix cannot be shortened without a branding change; the only fix is shortening the base title.

**Fix:** Source file `qb-portal/src/components/seo.tsx` line 8: `SITE_NAME = "NexFortis QuickBooks Portal"`. Consider a shorter suffix like `| NexFortis QB` (14 chars) for service/landing pages, or set titles without suffix for pages where the brand is already in the base title (e.g. `/` homepage).

#### Title 61–70 characters (1 issue, NF)

| # | URL | Chars | Title |
|---|---|---|---|
| M-08 | `nexfortis.com/blog/5-signs-your-business-needs-an-it-audit` | **64c** | "5 Signs Your Business Needs an IT Audit \| NexFortis IT Solutions" |

---

### JSON-LD (8 issues across 8 URLs)

#### QB Portal: 7 landing pages missing Service/HowTo schema

The QB landing page layout (`qb-portal/src/components/landing-page-layout.tsx` lines 49–58) only injects `Service` schema when `page.category === "service"` and `HowTo` when `page.category === "educational" && page.process.length > 0`. Pages with `category` set to `"problem"` or `"comparison"` receive **neither** — they render only `FAQPage` + `BreadcrumbList` from their base `jsonLd` array.

| # | URL | page.category | JSON-LD present | Missing |
|---|---|---|---|---|
| J-01 | `qb.nexfortis.com/landing/quickbooks-file-too-large` | `problem` | FAQPage, BreadcrumbList | Service or HowTo |
| J-02 | `qb.nexfortis.com/landing/quickbooks-running-slow` | `problem` | FAQPage, BreadcrumbList | Service or HowTo |
| J-03 | `qb.nexfortis.com/landing/quickbooks-company-file-error` | `problem` | FAQPage, BreadcrumbList | Service or HowTo |
| J-04 | `qb.nexfortis.com/landing/quickbooks-multi-currency-problems` | `problem` | FAQPage, BreadcrumbList | Service or HowTo |
| J-05 | `qb.nexfortis.com/landing/etech-alternative` | `comparison` | FAQPage, BreadcrumbList | Service or HowTo |
| J-06 | `qb.nexfortis.com/landing/quickbooks-conversion-canada` | `comparison` | FAQPage, BreadcrumbList | Service or HowTo |
| J-07 | `qb.nexfortis.com/landing/affordable-enterprise-conversion` | `comparison` | FAQPage, BreadcrumbList | Service or HowTo |

**Fix:** In `qb-portal/src/components/landing-page-layout.tsx`, extend the `else if` block to also inject a `Service` schema for `"problem"` and `"comparison"` categories (since all of these pages describe a NexFortis-offered service as the solution). Alternatively, inject a `HowTo` when the page has `process.length > 0` regardless of category. The `generateServiceSchema()` utility in `qb-portal/src/lib/seo-schemas.ts` already accepts an optional product. Example fix:

```ts
// Current (line 49-57 of landing-page-layout.tsx)
if (page.category === "service") {
  jsonLd.unshift(generateServiceSchema(...));
} else if (page.category === "educational" && page.process.length > 0) {
  jsonLd.unshift(generateHowToSchema(...));
}

// Proposed
if (page.category === "service") {
  jsonLd.unshift(generateServiceSchema(...));
} else if (page.process.length > 0) {
  // educational, problem, and comparison pages all have process steps
  jsonLd.unshift(generateHowToSchema({ ...page, metaDescription }));
  // Optionally also add Service for problem/comparison pages that have a linked product:
  if (product) {
    jsonLd.unshift(generateServiceSchema({ ...page, metaDescription }, product));
  }
}
```

---

#### NF: /services page missing Service schema (J-08)

| # | URL | JSON-LD present | Missing |
|---|---|---|---|
| J-08 | `nexfortis.com/services` | Organization, LocalBusiness, WebSite, BreadcrumbList | Service (at minimum one for the aggregate page) |

`nexfortis/src/pages/services.tsx` renders `<SEO>` and `<BreadcrumbSchema>` but no `<ServiceSchema>`. Since this is an overview page listing 5 services, the ideal schema is an `ItemList` or at least one `Service` schema with `hasOfferCatalog`.

**Fix:** In `nexfortis/src/pages/services.tsx`, add one or more `<ServiceSchema>` components from `nexfortis/src/components/seo.tsx`. For the overview page a simple aggregate would work:

```tsx
// Add after BreadcrumbSchema on services.tsx
<ServiceSchema
  name="IT Services for Canadian Businesses"
  description="Managed IT services for Canadian SMBs: digital marketing, Microsoft 365, QuickBooks migration, IT consulting, and workflow automation."
  url="/services"
/>
```

---

## Additional Observations (Non-Issue, For Thoroughness)

### Category Page Description Double-Word Bug (Polish / Cosmetic)

Three QB category pages have a grammatical double-word in their auto-generated meta descriptions:

| URL | Description snippet |
|---|---|
| `qb.nexfortis.com/category/platform-migrations` | "Browse 2 QuickBooks **platform migration services services**." |
| `qb.nexfortis.com/category/quickbooks-conversion` | "Browse 6 QuickBooks **quickbooks conversion services services**." |
| `qb.nexfortis.com/category/quickbooks-data-services` | "Browse 7 QuickBooks **quickbooks data services services**." |

**Root cause:** `qb-portal/src/pages/category.tsx` line ~52 generates:

```tsx
description={`Browse ${products.length} QuickBooks ${categoryName.toLowerCase()} services.`}
```

`categoryName` values already contain the word "services" (e.g., "QuickBooks Conversion Services", "QuickBooks Data Services"), so lowercasing and appending ` services` yields the double occurrence. Additionally, "QuickBooks Conversion Services" starts with "QuickBooks", which is already prefixed in the template, producing "QuickBooks quickbooks...".

**Fix:** Strip trailing " services" from `categoryName` before interpolating, or change the template to not append the word:

```tsx
const displayName = categoryName.replace(/\s+services$/i, "").replace(/^quickbooks\s+/i, "");
description={`Browse ${products.length} QuickBooks ${displayName} services.`}
```

---

### QB Homepage: ProfessionalService vs LocalBusiness

The QB homepage (`qb.nexfortis.com`) emits `Organization`, `WebSite`, and `ProfessionalService` schemas. It does **not** include `LocalBusiness`. This is acceptable — `ProfessionalService` is a `schema.org` subtype of `LocalBusiness` and carries the same local SEO signals. Not flagged as an issue, but the NF homepage uses `LocalBusiness` explicitly for consistency. If local pack visibility is important for the QB portal, adding an explicit `LocalBusiness` alongside `ProfessionalService` adds no harm.

---

### NF Blog Posts: All Share the Same og:image

All 5 NF blog post pages return `og:image=https://nexfortis.com/opengraph.png` (the site default). In `nexfortis/src/pages/blog-post.tsx` line 54, no `image` prop is passed to `<SEO>`, so it falls back to `DEFAULT_IMAGE`. Social shares of individual blog posts will show the generic site banner rather than an article-specific image.

**Recommendation:** Add a `heroImage` or `featuredImage` field to blog post content and pass it to `<SEO image={post.heroImage}>`. The `SEO` component already handles this: `const ogImage = image || \`${siteUrl}${DEFAULT_IMAGE}\``.

---

### QB Service Pages: All Share the Same og:image

16 QB `/service/*` pages all return `og:image=https://qb.nexfortis.com/opengraph.jpg`. In `qb-portal/src/pages/service-detail.tsx`, no `ogImage` prop is passed, so the SEO component falls back to `DEFAULT_OG_IMAGE`. The 20 `/landing/*` pages correctly use per-page images (`/og/<slug>.jpg`). The service pages could benefit from the same treatment, especially for paid social campaigns targeting specific services.

---

### og:type = "product" on Service Pages

QB landing and service pages use `ogType="product"`. Strictly speaking, `og:type=product` is intended for physical or purchasable consumer products with price/availability. For a service offering, `og:type=website` or `og:type=article` would be more semantically accurate per the Open Graph Protocol specification. This is a minor semantic note — Facebook/LinkedIn will render the card correctly regardless — but `og:type=website` avoids potential confusion if a scraper interprets the "product" type literally.

---

### Unicode Arrows in QB Titles (Rendering Note)

Four QB service page titles contain the Unicode right-arrow character `→`:
- "AccountEdge/MYOB → QuickBooks" 
- "Enterprise → Premier/Pro Complex"
- "Enterprise → Premier/Pro Standard"
- "Sage 50/Simply Accounting → QuickBooks"

These render correctly in modern browsers and are decoded properly from the prerendered HTML. The arrows are preserved in og:title and twitter:title as well. No issue — just noting for awareness, as some email clients or older SERP renderers may not display Unicode arrows.

---

### hreflang Self-Reference Configuration

Both sites emit `hreflang="en-CA"` and `hreflang="x-default"` pointing to the canonical URL on every page. This is correct for a single-language, single-region site. No issues.

---

### <html lang="en-CA"> Present

All pages from both sites return `<html lang="en-CA">`. This is correct for Canadian English and aids accessibility/screen readers. Set by `nexfortis/src/components/seo.tsx` line 19 (`<html lang="en-CA" />`) and by `qb-portal/src/components/seo.tsx` (the `<html>` tag is set in the root HTML template).

---

## Per-URL Summary Tables

### nexfortis.com (17 URLs)

| URL | Title (c) | Desc (c) | Canonical | Robots | og:type | JSON-LD Types | Issues |
|---|---|---|---|---|---|---|---|
| `/` | 55 | 156 | ✅ OK | ✅ index | website | Org, LB, WebSite, FAQPage | — |
| `/about` | 37 | 155 | ✅ OK | ✅ index | website | Org, LB, WebSite, Person, BC | — |
| `/blog` | 48 | 157 | ✅ OK | ✅ index | website | Org, LB, WebSite, BC | — |
| `/blog/5-signs-your-business-needs-an-it-audit` | **64** | **206** | ✅ OK | ✅ index | article | Org, LB, WebSite, Article, BC | M-08, I-07 |
| `/blog/microsoft-365-migration-checklist-canadian-smbs` | **76** | **202** | ✅ OK | ✅ index | article | Org, LB, WebSite, Article, BC | I-03, I-08 |
| `/blog/quickbooks-desktop-vs-online` | **89** | **205** | ✅ OK | ✅ index | article | Org, LB, WebSite, Article, BC | I-06, I-09 |
| `/blog/top-5-workflow-automation-wins-small-businesses` | **76** | **181** | ✅ OK | ✅ index | article | Org, LB, WebSite, Article, BC | I-04, I-10 |
| `/blog/what-is-pipeda-why-it-matters` | **76** | **217** | ✅ OK | ✅ index | article | Org, LB, WebSite, Article, BC | I-05, I-11 |
| `/contact` | 40 | 153 | ✅ OK | ✅ index | website | Org, LB, WebSite, BC | — |
| `/privacy` | 39 | 156 | ✅ OK | ✅ index | website | Org, LB, WebSite, BC | — |
| `/services` | 60 | 155 | ✅ OK | ✅ index | website | Org, LB, WebSite, BC | J-08 |
| `/services/digital-marketing` | 55 | 152 | ✅ OK | ✅ index | website | Org, LB, WebSite, Svc, BC, FAQ | — |
| `/services/it-consulting` | 59 | 156 | ✅ OK | ✅ index | website | Org, LB, WebSite, Svc, BC, FAQ | — |
| `/services/microsoft-365` | 60 | 155 | ✅ OK | ✅ index | website | Org, LB, WebSite, Svc, BC, FAQ | — |
| `/services/quickbooks` | 56 | 152 | ✅ OK | ✅ index | website | Org, LB, WebSite, Svc, BC, FAQ | — |
| `/services/workflow-automation` | 59 | 154 | ✅ OK | ✅ index | website | Org, LB, WebSite, Svc, BC, FAQ | — |
| `/terms` | 41 | 153 | ✅ OK | ✅ index | website | Org, LB, WebSite, BC | — |

*BC = BreadcrumbList · Org = Organization · LB = LocalBusiness · Svc = Service · FAQ = FAQPage*

---

### qb.nexfortis.com (49 URLs)

| URL | Title (c) | Desc (c) | Canonical | Robots | og:type | JSON-LD Types | Issues |
|---|---|---|---|---|---|---|---|
| `/` | **67** | 142 | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc | M-01 |
| `/catalog` | **88** | 132 | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc, BC | I-01 |
| `/category/platform-migrations` | 57 | 105† | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc, BC | — |
| `/category/quickbooks-conversion` | 60 | 108†† | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc, BC | — |
| `/category/quickbooks-data-services` | 54 | 102†† | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc, BC | — |
| `/category/volume-packs` | 42 | 90 | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc, BC | — |
| `/faq` | 56 | 135 | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc, FAQPage, BC | — |
| `/landing/accountedge-to-quickbooks` | 54 | 152 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, FAQPage, BC | — |
| `/landing/affordable-enterprise-conversion` | 55 | 148 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, FAQPage, BC | J-07 |
| `/landing/audit-trail-removal` | 57 | 160 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, FAQPage, BC | — |
| `/landing/enterprise-to-premier-conversion` | 55 | 152 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, FAQPage, BC | — |
| `/landing/etech-alternative` | 56 | 157 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, FAQPage, BC | J-05 |
| `/landing/file-repair` | 53 | 157 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, FAQPage, BC | — |
| `/landing/how-conversion-works` | 56 | 156 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, HowTo, FAQPage, BC | — |
| `/landing/is-it-safe` | **61** | 152 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, HowTo, FAQPage, BC | M-02 |
| `/landing/list-reduction` | 52 | 152 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, FAQPage, BC | — |
| `/landing/multi-currency-removal` | 52 | 153 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, FAQPage, BC | — |
| `/landing/qbo-readiness` | 57 | 158 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, FAQPage, BC | — |
| `/landing/quickbooks-company-file-error` | 56 | 154 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, FAQPage, BC | J-03 |
| `/landing/quickbooks-conversion-canada` | 58 | 150 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, FAQPage, BC | J-06 |
| `/landing/quickbooks-desktop-end-of-life` | 58 | 150 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, HowTo, FAQPage, BC | — |
| `/landing/quickbooks-file-too-large` | 55 | 157 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, FAQPage, BC | J-01 |
| `/landing/quickbooks-multi-currency-problems` | 52 | 157 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, FAQPage, BC | J-04 |
| `/landing/quickbooks-running-slow` | 53 | 154 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, FAQPage, BC | J-02 |
| `/landing/quickbooks-support-subscription` | 57 | 158 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, HowTo, FAQPage, BC | — |
| `/landing/sage-50-to-quickbooks` | 50 | 153 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, FAQPage, BC | — |
| `/landing/super-condense` | 54 | 158 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, FAQPage, BC | — |
| `/privacy` | 44 | 117 | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc | — |
| `/qbm-guide` | 55 | 115 | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc | — |
| `/service/10-pack-conversions` | 49 | **181** | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | I-12 |
| `/service/5-pack-conversions` | 48 | **184** | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | I-13 |
| `/service/accountedge-to-quickbooks` | 59 | 141 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | — |
| `/service/audit-trail-cra-bundle` | **66** | 149 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | M-03 |
| `/service/audit-trail-removal` | 49 | 154 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | — |
| `/service/cra-period-copy` | 45 | 148 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | — |
| `/service/enterprise-to-premier-complex` | **62** | **174** | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | M-04, I-14 |
| `/service/enterprise-to-premier-standard` | **63** | **185** | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | M-05, I-15 |
| `/service/extended-support` | 46 | **178** | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | I-16 |
| `/service/file-health-check` | 47 | 158 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | — |
| `/service/guaranteed-30-minute` | **61** | 139 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | M-06 |
| `/service/list-reduction` | 44 | 154 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | — |
| `/service/multi-currency-removal` | 52 | 151 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | — |
| `/service/qbo-readiness-report` | 50 | **188** | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | I-17 |
| `/service/rush-delivery` | 43 | 95 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | — |
| `/service/sage50-to-quickbooks` | **68** | 156 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | M-07 |
| `/service/super-condense` | 44 | 151 | ✅ OK | ✅ index | product | Org, WebSite, ProfSvc, Svc, BC | — |
| `/subscription` | **76** | 128 | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc | I-02 |
| `/terms` | 46 | 103 | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc | — |
| `/waitlist` | 47 | 67 | ✅ OK | ✅ index | website | Org, WebSite, ProfSvc | — |

*† Description contains "services services" double-word (cosmetic bug)*  
*†† Description contains both "QuickBooks quickbooks" capitalization duplicate AND "services services" double-word*

---

## Prioritized Recommendations

### Priority 1 — IMPORTANT: Fix overlong blog post titles and descriptions (NF)
**File:** `nexfortis/src/pages/blog-post.tsx` line 54  
Add a `seoTitle` / `metaDescription` field to the blog post API response that is length-constrained, and use it in the `<SEO>` component instead of the raw `post.title` / `post.excerpt`.  
**Impact:** Affects 4/5 blog posts (those over 70 chars title or 160 chars description).

### Priority 2 — IMPORTANT: Fix overlong service descriptions (QB)
**File:** `qb-portal/src/pages/service-detail.tsx` line 75  
Add a `meta_description` column to the Supabase products table OR truncate in-component to 155 chars.  
**Impact:** Affects 6 service pages.

### Priority 3 — IMPORTANT: Fix catalog and subscription titles (QB)
**Files:** QB catalog and subscription page components  
Shorten page title props so the full `title | SITE_NAME` stays under 70 chars.  
**Impact:** Affects 2 pages (I-01, I-02).

### Priority 4 — JSON-LD: Add Service/HowTo schema to "problem" + "comparison" landing pages (QB)
**File:** `qb-portal/src/components/landing-page-layout.tsx` lines 49–58  
Extend the schema injection logic to cover `problem` and `comparison` categories.  
**Impact:** Affects 7 landing pages (J-01 through J-07).

### Priority 5 — JSON-LD: Add Service schema to /services overview page (NF)
**File:** `nexfortis/src/pages/services.tsx`  
Add one `<ServiceSchema>` component for the aggregate services page.  
**Impact:** Affects 1 page (J-08).

### Priority 6 — Polish: Fix category page description double-word (QB)
**File:** `qb-portal/src/pages/category.tsx` line ~52  
Strip trailing " services" and lowercase "QuickBooks" prefix from `categoryName` before interpolating.  
**Impact:** Affects 3 category pages. While not a ranking issue, it looks unprofessional in SERPs.

### Priority 7 — Polish: Shorten QB SITE_NAME suffix or reduce base titles (QB)
**File:** `qb-portal/src/components/seo.tsx` line 8  
The 26-char site name suffix `| NexFortis QuickBooks Portal` makes it structurally difficult to fit service names under 60 chars. Consider a conditional: use the full site name on the homepage and a shortened form `| NexFortis QB` for interior pages.  
**Impact:** Would resolve 7 MINOR title-length issues.

### Priority 8 — Enhancement: Per-page og:image for NF blog posts and QB service pages
**NF:** `nexfortis/src/pages/blog-post.tsx` — pass `image={post.heroImage}` to `<SEO>`.  
**QB:** `qb-portal/src/pages/service-detail.tsx` — pass `ogImage={/og/${product.slug}.jpg}` similar to landing pages.  
**Impact:** Improves social share appearance; not an SEO ranking factor.

---

## Appendix: Audit Methodology

- **Fetch method:** `curl -sL --max-time 30 <url>` following redirects, 10 concurrent workers
- **HTML parser:** Custom Python regex with apostrophe-safe attribute matching (`[^"]*` for double-quoted, `[^']*` for single-quoted attribute values), `html.unescape()` applied to all extracted values
- **Dedupe detection:** Tag occurrence counting via compiled regex against raw `<head>` content
- **JSON-LD extraction:** `re.findall` on `<script type="application/ld+json">` blocks, `json.loads()` parse with error capture
- **og:image verification:** `curl -sLo /dev/null -w "%{http_code}"` per unique image URL
- **Canonical comparison:** URL normalization (lowercase scheme+host, strip trailing slash, drop query+fragment)
- **False positive correction:** Initial run flagged "your company/business/name" as placeholder text; verified these were natural FAQ/article prose. Corrected — zero actual placeholders found.
- **Source code cross-reference:** `qb-portal/src/components/landing-page-layout.tsx`, `qb-portal/src/pages/category.tsx`, `qb-portal/src/pages/service-detail.tsx`, `nexfortis/src/pages/blog-post.tsx`, `nexfortis/src/pages/services.tsx`, `qb-portal/src/components/seo.tsx`, `nexfortis/src/components/seo.tsx`
