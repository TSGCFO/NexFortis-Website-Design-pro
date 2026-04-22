# Internal Link Integrity Audit — NexFortis Production Sites

**Audit Date:** 2025-07-12
**Sites Audited:** nexfortis.com (17 URLs), qb.nexfortis.com (49 URLs)
**Source Code:** `/tmp/nf-review/artifacts/nexfortis/`, `/tmp/nf-review/artifacts/qb-portal/`, `/tmp/nf-review/artifacts/api-server/`
**Tool:** Parallel fetch (batches of 10) + parallel HEAD checks (`xargs -P 10`)

---

## Executive Summary

| Metric | Count |
|---|---|
| Source pages crawled | 66 |
| Unique internal link targets discovered | 84 |
| Dead links (4xx / 5xx) | **0** |
| Expected 301 redirects (retired expert-support) | 4 |
| Unexpected redirects | 0 |
| Orphan pages (zero inbound from crawled set) | **1** |
| Canonical mismatches | **0** |
| Lingering retired-slug references in source code | **8** (split by type, see below) |
| Anchor-text capitalization drift cases | **2 URLs** |

All 66 sitemap pages returned HTTP 200. All 84 unique internal link targets returned HTTP 200 when checked directly. The four retired product redirects behave correctly (301 → `/subscription`). One landing page is a sitemap orphan. The sitemap itself was not regenerated after the product removal PR and still lists the four retired URLs.

---

## 1. Source-Code References to Retired Slugs / IDs

### 1a. `public/sitemap.xml` — **NOT regenerated after PR** (Critical)

Both the source tree (`public/`) and the compiled artefact (`dist/public/`) still contain the retired URLs. The `generate-sitemap.mjs` script walks `dist/public/` for `index.html` files; because the retired pages were removed from `products.json` and their pre-rendered HTML was deleted, the script *would* drop them — but **it has not been re-run since the PR**. Until it is re-run and the output committed, these four stale `<loc>` entries will be submitted to search engines.

| File | Line | Stale Entry |
|---|---|---|
| `artifacts/qb-portal/public/sitemap.xml` | 16 | `https://qb.nexfortis.com/category/expert-support` |
| `artifacts/qb-portal/public/sitemap.xml` | 232 | `https://qb.nexfortis.com/service/expert-support-essentials` |
| `artifacts/qb-portal/public/sitemap.xml` | 238 | `https://qb.nexfortis.com/service/expert-support-premium` |
| `artifacts/qb-portal/public/sitemap.xml` | 244 | `https://qb.nexfortis.com/service/expert-support-professional` |
| `artifacts/qb-portal/dist/public/sitemap.xml` | 16 | `https://qb.nexfortis.com/category/expert-support` |
| `artifacts/qb-portal/dist/public/sitemap.xml` | 232 | `https://qb.nexfortis.com/service/expert-support-essentials` |
| `artifacts/qb-portal/dist/public/sitemap.xml` | 238 | `https://qb.nexfortis.com/service/expert-support-premium` |
| `artifacts/qb-portal/dist/public/sitemap.xml` | 244 | `https://qb.nexfortis.com/service/expert-support-professional` |

**Both `public/sitemap.xml` and `dist/public/sitemap.xml` are stale and must be regenerated.** The 4 URLs still resolve (they redirect 301 → `/subscription`) so they are not hard-broken, but submitting retired URLs in a sitemap is bad practice and may cause crawl budget waste.

> Note: `qb-urls.txt` (the "49 URLs" provided for audit) correctly omits these four retired URLs — the discrepancy between 49 provided vs. 53 in the sitemap is entirely explained by these four stale entries.

### 1b. API Server — `ALLOWED_CATEGORIES` allowlist not trimmed (Low)

| File | Line | Content |
|---|---|---|
| `artifacts/api-server/src/routes/qb-admin-promo.ts` | 28 | `"expert-support",` inside `ALLOWED_CATEGORIES` |

**Context:** This is a server-side validation array that controls which `category_slug` values are accepted when an admin creates a promo code. The `"expert-support"` category no longer exists in `products.json` (no active products carry `category_slug: "expert-support"`), so any promo code created with this category would match zero products. The entry is effectively dead but non-breaking. It should be removed to prevent confusing admin operators.

### 1c. Meta-description strings in QB portal source — "expert support" used generically (Informational)

These references use "expert support" as a **plain-English phrase**, not as a slug or route. They do not create any live links and are not technically incorrect, but they do reference a product category name that no longer exists in the catalog. Flagged for awareness.

| File | Line | Content |
|---|---|---|
| `artifacts/qb-portal/src/pages/catalog.tsx` | 40 | SEO `description` prop: `"Browse 20 QuickBooks services across 5 categories. Conversion, data services, platform migrations, expert support, and volume packs."` |
| `artifacts/qb-portal/src/pages/home.tsx` | 142 | SEO `description` prop: `"Canadian QuickBooks experts. Enterprise to Premier conversion, data services, and expert support. Starting at $75 CAD with our launch special."` |

Additionally, the catalog description says **"20 services across 5 categories"**. After removing IDs 16/17/18 and the expert-support category, there are now **17 services across 4 categories**. The count is wrong by 3 services and 1 category.

### 1d. Summary of all source-code findings

| Severity | Location | Issue |
|---|---|---|
| **Critical** | `qb-portal/public/sitemap.xml` lines 16, 232, 238, 244 | Stale retired URLs in sitemap (source copy) |
| **Critical** | `qb-portal/dist/public/sitemap.xml` lines 16, 232, 238, 244 | Stale retired URLs in sitemap (dist/compiled copy) |
| **Low** | `api-server/src/routes/qb-admin-promo.ts:28` | `"expert-support"` in `ALLOWED_CATEGORIES` allowlist |
| **Informational** | `qb-portal/src/pages/catalog.tsx:40` | Meta description says "expert support" as category name + wrong count ("20 services…5 categories") |
| **Informational** | `qb-portal/src/pages/home.tsx:142` | Meta description says "expert support" as service description |

No references to product IDs 16, 17, or 18 were found in any JS/TS/TSX/JSON/MD file. No `href` attributes pointing to the retired slugs were found in any source page or live-crawled HTML.

---

## 2. Live Internal Link Extraction

66 pages were fetched. All returned HTTP 200. 84 unique internal link targets were discovered and HEAD-checked. A directed link graph was built and saved to `/tmp/nf-review/seo-audit/link-graph.json`.

---

## 3. Dead Link Check

**No dead links found.** All 84 unique internal link targets returned HTTP 200 (after following any redirects).

Full status table:

| URL | Status | Hops | Final URL |
|---|---|---|---|
| All 84 unique targets | 200 | 0 | (same) |

The four retired-product URLs were tested separately (they are not linked from any crawled page and therefore did not appear in the 84-target set):

| URL | Status | Hops | Final URL | Classification |
|---|---|---|---|---|
| `https://qb.nexfortis.com/service/expert-support-essentials` | 200 | 1 | `https://qb.nexfortis.com/subscription` | Expected 301 |
| `https://qb.nexfortis.com/service/expert-support-professional` | 200 | 1 | `https://qb.nexfortis.com/subscription` | Expected 301 |
| `https://qb.nexfortis.com/service/expert-support-premium` | 200 | 1 | `https://qb.nexfortis.com/subscription` | Expected 301 |
| `https://qb.nexfortis.com/category/expert-support` | 200 | 1 | `https://qb.nexfortis.com/subscription` | Expected 301 |

> Note: curl reports `STATUS:200` because it follows the 301 to the final destination. The redirect machinery is working correctly — 1 hop, landing at `/subscription`, HTTP 200 at destination.

---

## 4. Unexpected Redirects

**None.** The only redirects observed were:

1. The 4 known retired-product 301s (documented above) — all expected.
2. `https://nexfortis.com/services/automation-software` → `https://nexfortis.com/services/workflow-automation` — this is a documented redirect in `render.yaml` and in `nexfortis/src/App.tsx`. It is **not linked from any crawled page**, so it poses no live user impact. It functions correctly.

---

## 5. Orphan Pages

Pages present in the sitemap with **zero inbound internal links** from any of the 66 crawled pages:

| URL | Site | Inbound Links | Notes |
|---|---|---|---|
| `https://qb.nexfortis.com/landing/quickbooks-support-subscription` | qb.nexfortis.com | **0** | No page in the crawl set links to this landing page |

**Details:** Every other landing page in the QB portal has at least 3 inbound links (from related-services widgets, category pages, or service detail pages). `landing/quickbooks-support-subscription` has no inbound links at all within the crawled graph. It is still discoverable via the sitemap and direct URL, but it receives no internal PageRank flow.

**Secondary note (blog posts):** The five NexFortis blog posts each have exactly **1 inbound link**, all coming from the `/blog` index page. This is structurally expected for a blog (the index lists all posts), but it means each individual post is one hop from the blog index and zero hops from any service page. There are no cross-links from service pages to relevant blog posts (e.g., no link from `/services/quickbooks` to `/blog/quickbooks-desktop-vs-online`). This is not a broken link but is a missed internal-linking opportunity.

**Full inbound link count table (sitemap URLs only):**

| URL | Inbound Links | Unique Source Pages |
|---|---|---|
| `https://nexfortis.com/` | 75 | 17 |
| `https://nexfortis.com/about` | 68 | 17 |
| `https://nexfortis.com/blog` | 78 | 17 |
| `https://nexfortis.com/blog/5-signs-your-business-needs-an-it-audit` | 1 | 1 |
| `https://nexfortis.com/blog/microsoft-365-migration-checklist-canadian-smbs` | 1 | 1 |
| `https://nexfortis.com/blog/quickbooks-desktop-vs-online` | 1 | 1 |
| `https://nexfortis.com/blog/top-5-workflow-automation-wins-small-businesses` | 1 | 1 |
| `https://nexfortis.com/blog/what-is-pipeda-why-it-matters` | 1 | 1 |
| `https://nexfortis.com/contact` | 172 | 66 |
| `https://nexfortis.com/privacy` | 52 | 17 |
| `https://nexfortis.com/services` | 57 | 17 |
| `https://nexfortis.com/services/digital-marketing` | 53 | 17 |
| `https://nexfortis.com/services/it-consulting` | 53 | 17 |
| `https://nexfortis.com/services/microsoft-365` | 53 | 17 |
| `https://nexfortis.com/services/quickbooks` | 53 | 17 |
| `https://nexfortis.com/services/workflow-automation` | 53 | 17 |
| `https://nexfortis.com/terms` | 34 | 17 |
| `https://qb.nexfortis.com/` | 250 | 66 |
| `https://qb.nexfortis.com/catalog` | 279 | 50 |
| `https://qb.nexfortis.com/category/platform-migrations` | 5 | 3 |
| `https://qb.nexfortis.com/category/quickbooks-conversion` | 13 | 7 |
| `https://qb.nexfortis.com/category/quickbooks-data-services` | 15 | 8 |
| `https://qb.nexfortis.com/category/volume-packs` | 6 | 4 |
| `https://qb.nexfortis.com/faq` | 197 | 49 |
| `https://qb.nexfortis.com/landing/accountedge-to-quickbooks` | 4 | 4 |
| `https://qb.nexfortis.com/landing/affordable-enterprise-conversion` | 9 | 9 |
| `https://qb.nexfortis.com/landing/audit-trail-removal` | 60 | 49 |
| `https://qb.nexfortis.com/landing/enterprise-to-premier-conversion` | 62 | 49 |
| `https://qb.nexfortis.com/landing/etech-alternative` | 9 | 9 |
| `https://qb.nexfortis.com/landing/file-repair` | 4 | 3 |
| `https://qb.nexfortis.com/landing/how-conversion-works` | 15 | 15 |
| `https://qb.nexfortis.com/landing/is-it-safe` | 7 | 7 |
| `https://qb.nexfortis.com/landing/list-reduction` | 4 | 4 |
| `https://qb.nexfortis.com/landing/multi-currency-removal` | 3 | 2 |
| `https://qb.nexfortis.com/landing/qbo-readiness` | 3 | 3 |
| `https://qb.nexfortis.com/landing/quickbooks-company-file-error` | 3 | 3 |
| `https://qb.nexfortis.com/landing/quickbooks-conversion-canada` | 9 | 9 |
| `https://qb.nexfortis.com/landing/quickbooks-desktop-end-of-life` | 54 | 49 |
| `https://qb.nexfortis.com/landing/quickbooks-file-too-large` | 60 | 49 |
| `https://qb.nexfortis.com/landing/quickbooks-multi-currency-problems` | 3 | 3 |
| `https://qb.nexfortis.com/landing/quickbooks-running-slow` | 59 | 49 |
| `https://qb.nexfortis.com/landing/quickbooks-support-subscription` | **0** | **0** |
| `https://qb.nexfortis.com/landing/sage-50-to-quickbooks` | 4 | 4 |
| `https://qb.nexfortis.com/landing/super-condense` | 15 | 15 |
| `https://qb.nexfortis.com/privacy` | 49 | 49 |
| `https://qb.nexfortis.com/qbm-guide` | 196 | 49 |
| `https://qb.nexfortis.com/service/10-pack-conversions` | 3 | 3 |
| `https://qb.nexfortis.com/service/5-pack-conversions` | 4 | 4 |
| `https://qb.nexfortis.com/service/accountedge-to-quickbooks` | 5 | 4 |
| `https://qb.nexfortis.com/service/audit-trail-cra-bundle` | 3 | 3 |
| `https://qb.nexfortis.com/service/audit-trail-removal` | 10 | 9 |
| `https://qb.nexfortis.com/service/cra-period-copy` | 2 | 2 |
| `https://qb.nexfortis.com/service/enterprise-to-premier-complex` | 7 | 7 |
| `https://qb.nexfortis.com/service/enterprise-to-premier-standard` | 18 | 13 |
| `https://qb.nexfortis.com/service/extended-support` | 2 | 2 |
| `https://qb.nexfortis.com/service/file-health-check` | 9 | 8 |
| `https://qb.nexfortis.com/service/guaranteed-30-minute` | 8 | 8 |
| `https://qb.nexfortis.com/service/list-reduction` | 10 | 9 |
| `https://qb.nexfortis.com/service/multi-currency-removal` | 10 | 9 |
| `https://qb.nexfortis.com/service/qbo-readiness-report` | 8 | 7 |
| `https://qb.nexfortis.com/service/rush-delivery` | 6 | 6 |
| `https://qb.nexfortis.com/service/sage50-to-quickbooks` | 6 | 5 |
| `https://qb.nexfortis.com/service/super-condense` | 10 | 9 |
| `https://qb.nexfortis.com/subscription` | 148 | 49 |
| `https://qb.nexfortis.com/terms` | 49 | 49 |
| `https://qb.nexfortis.com/waitlist` | 49 | 49 |

---

## 6. Cross-Site Links

### nexfortis.com → qb.nexfortis.com

All 17 nexfortis.com pages carry cross-site links in the navigation header. Both targets (`https://qb.nexfortis.com/` and `https://qb.nexfortis.com/catalog`) return HTTP 200.

| Source Pattern | Target | Anchor Text | Status |
|---|---|---|---|
| All 17 nexfortis.com pages (nav header) | `https://qb.nexfortis.com/` | "QB Portal" | ✅ 200 |
| `https://nexfortis.com/services/quickbooks` (×14 links) | `https://qb.nexfortis.com/catalog` | "Browse QB Services Portal" / "our QB Services Portal" | ✅ 200 |

**Observation:** The nexfortis.com header links to `qb.nexfortis.com/` are duplicated (two identical links per page in the DOM). Both point to the same destination, so it is not a functional issue, but it is worth noting as a minor markup redundancy.

### qb.nexfortis.com → nexfortis.com

All 49 QB portal pages carry a footer link to `https://nexfortis.com/contact`. That URL returns HTTP 200.

| Source Pattern | Target | Anchor Text | Status |
|---|---|---|---|
| All 49 qb.nexfortis.com pages (footer) | `https://nexfortis.com/contact` | "Contact NexFortis" | ✅ 200 |

**No cross-site link points to a dead or redirecting URL.**

---

## 7. Canonical Consistency

All 66 pages were checked. Every page carries a `<link rel="canonical">` tag, and every canonical URL exactly matches the URL that was fetched (trailing-slash tolerant). **Zero canonical mismatches.**

---

## 8. Anchor Text Inconsistencies

### 8a. Capitalization drift (same URL, same normalized text, different casing)

| Target URL | Variant A | Variant B | Source of Variant A | Source of Variant B |
|---|---|---|---|---|
| `https://nexfortis.com/contact` | "Contact Us" | "Contact us" | 7 nexfortis.com pages (nav) | 17 nexfortis.com pages (body/footer) |
| `https://qb.nexfortis.com/landing/how-conversion-works` | "How our migration process works" | "how our migration process works" | `category/platform-migrations` | `service/accountedge-to-quickbooks`, `service/sage50-to-quickbooks` |

**"Contact Us" vs "Contact us"** — The capital-U form appears in the main navigation/hero call-to-action buttons on 7 pages. The lowercase-u form appears in body copy across all 17 nexfortis.com pages. Both forms are correct English; pick one and be consistent across all touch points.

**"How our migration process works" vs "how our migration process works"** — The category page uses title case; two service detail pages use lowercase. Consistent sentence-case or title-case should be applied.

### 8b. Functional anchor text variety (same URL, intentionally different text — not errors)

These are contextual link labels that intentionally vary by context (e.g., `/catalog` is labeled "Services & Tools" in the nav but "Browse QB Services Portal" from the marketing site). Noted here for completeness; these are not errors.

| Target URL | Anchor variants (count) | Notes |
|---|---|---|
| `https://qb.nexfortis.com/catalog` | 14 variants | Mix of nav labels ("Services & Tools", "All Services"), contextual CTAs ("Fix a Slow QuickBooks File", "See Size-Reduction Services"), and cross-site labels ("Browse QB Services Portal") — intentional |
| `https://nexfortis.com/contact` | 7 variants | Nav ("Contact"), CTAs ("Get a Free Quote", "Book a Consultation"), body ("contact us for a quote"), cross-site footer ("Contact NexFortis") — intentional variation, except the Us/us caps drift noted above |
| `https://qb.nexfortis.com/` | 3 variants | "QB Portal" (from marketing site), "QuickBooks Services" and "Home" (from QB portal nav) — intentional |
| `https://qb.nexfortis.com/faq` | 3 variants | "FAQ" (nav), "Frequently asked questions" (footer), "Learn More" (subscription page CTA) — intentional |
| `https://qb.nexfortis.com/qbm-guide` | 2 variants | "QBM Guide" (nav) and "How to create a .QBM file" (footer) — intentional |

### 8c. "QuickBooks" capitalization

No instances of the incorrect lowercase form "Quickbooks" were found in any anchor text across either site. All occurrences use the correct "QuickBooks" trademark capitalization.

---

## Appendix: Complete List of Unique Internal Link Targets

All 84 unique internal link targets, all returning HTTP 200:

```
https://nexfortis.com/
https://nexfortis.com/about
https://nexfortis.com/blog
https://nexfortis.com/blog/5-signs-your-business-needs-an-it-audit
https://nexfortis.com/blog/microsoft-365-migration-checklist-canadian-smbs
https://nexfortis.com/blog/quickbooks-desktop-vs-online
https://nexfortis.com/blog/top-5-workflow-automation-wins-small-businesses
https://nexfortis.com/blog/what-is-pipeda-why-it-matters
https://nexfortis.com/contact
https://nexfortis.com/privacy
https://nexfortis.com/services
https://nexfortis.com/services/digital-marketing
https://nexfortis.com/services/it-consulting
https://nexfortis.com/services/microsoft-365
https://nexfortis.com/services/quickbooks
https://nexfortis.com/services/workflow-automation
https://nexfortis.com/terms
https://qb.nexfortis.com/
https://qb.nexfortis.com/catalog
https://qb.nexfortis.com/category/platform-migrations
https://qb.nexfortis.com/category/quickbooks-conversion
https://qb.nexfortis.com/category/quickbooks-data-services
https://qb.nexfortis.com/category/volume-packs
https://qb.nexfortis.com/faq
https://qb.nexfortis.com/landing/accountedge-to-quickbooks
https://qb.nexfortis.com/landing/affordable-enterprise-conversion
https://qb.nexfortis.com/landing/audit-trail-removal
https://qb.nexfortis.com/landing/enterprise-to-premier-conversion
https://qb.nexfortis.com/landing/etech-alternative
https://qb.nexfortis.com/landing/file-repair
https://qb.nexfortis.com/landing/how-conversion-works
https://qb.nexfortis.com/landing/is-it-safe
https://qb.nexfortis.com/landing/list-reduction
https://qb.nexfortis.com/landing/multi-currency-removal
https://qb.nexfortis.com/landing/qbo-readiness
https://qb.nexfortis.com/landing/quickbooks-company-file-error
https://qb.nexfortis.com/landing/quickbooks-conversion-canada
https://qb.nexfortis.com/landing/quickbooks-desktop-end-of-life
https://qb.nexfortis.com/landing/quickbooks-file-too-large
https://qb.nexfortis.com/landing/quickbooks-multi-currency-problems
https://qb.nexfortis.com/landing/quickbooks-running-slow
https://qb.nexfortis.com/landing/quickbooks-support-subscription
https://qb.nexfortis.com/landing/sage-50-to-quickbooks
https://qb.nexfortis.com/landing/super-condense
https://qb.nexfortis.com/login
https://qb.nexfortis.com/order
https://qb.nexfortis.com/order?service=1
https://qb.nexfortis.com/order?service=2
https://qb.nexfortis.com/order?service=3
https://qb.nexfortis.com/order?service=4
https://qb.nexfortis.com/order?service=5
https://qb.nexfortis.com/order?service=6
https://qb.nexfortis.com/order?service=7
https://qb.nexfortis.com/order?service=8
https://qb.nexfortis.com/order?service=9
https://qb.nexfortis.com/order?service=10
https://qb.nexfortis.com/order?service=11
https://qb.nexfortis.com/order?service=12
https://qb.nexfortis.com/order?service=13
https://qb.nexfortis.com/order?service=14
https://qb.nexfortis.com/order?service=15
https://qb.nexfortis.com/order?service=19
https://qb.nexfortis.com/order?service=20
https://qb.nexfortis.com/privacy
https://qb.nexfortis.com/qbm-guide
https://qb.nexfortis.com/service/10-pack-conversions
https://qb.nexfortis.com/service/5-pack-conversions
https://qb.nexfortis.com/service/accountedge-to-quickbooks
https://qb.nexfortis.com/service/audit-trail-cra-bundle
https://qb.nexfortis.com/service/audit-trail-removal
https://qb.nexfortis.com/service/cra-period-copy
https://qb.nexfortis.com/service/enterprise-to-premier-complex
https://qb.nexfortis.com/service/enterprise-to-premier-standard
https://qb.nexfortis.com/service/extended-support
https://qb.nexfortis.com/service/file-health-check
https://qb.nexfortis.com/service/guaranteed-30-minute
https://qb.nexfortis.com/service/list-reduction
https://qb.nexfortis.com/service/multi-currency-removal
https://qb.nexfortis.com/service/qbo-readiness-report
https://qb.nexfortis.com/service/rush-delivery
https://qb.nexfortis.com/service/sage50-to-quickbooks
https://qb.nexfortis.com/service/super-condense
https://qb.nexfortis.com/subscription
https://qb.nexfortis.com/terms
https://qb.nexfortis.com/waitlist
```

Note: `/order?service=16`, `/order?service=17`, and `/order?service=18` do **not appear** in the discovered link targets — confirming that no crawled page links to order forms for the retired products.

---

## Appendix: Confirmed Source Files Checked (Grep Scope)

- `artifacts/nexfortis/src/**/*.{ts,tsx}` — all clear
- `artifacts/nexfortis/scripts/**/*.{mjs,js}` — all clear
- `artifacts/nexfortis/public/sitemap.xml` — all clear (NF sitemap matches nf-urls.txt exactly)
- `artifacts/qb-portal/src/**/*.{ts,tsx}` — all clear for href/slug references (meta description text noted above)
- `artifacts/qb-portal/scripts/**/*.{mjs,js}` — all clear
- `artifacts/qb-portal/public/products.json` — IDs 16/17/18 absent (correct)
- `artifacts/qb-portal/dist/public/products.json` — IDs 16/17/18 absent (correct)
- `artifacts/qb-portal/public/sitemap.xml` — **STALE** (see §1a)
- `artifacts/qb-portal/dist/public/sitemap.xml` — **STALE** (see §1a)
- `artifacts/api-server/src/**/*.ts` — `expert-support` found in `qb-admin-promo.ts:28` (see §1b)
- Excluded: `render.yaml` (intentional redirect definitions), `node_modules/`, `CHANGELOG` files
