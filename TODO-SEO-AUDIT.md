# SEO Re-Audit — Complete Findings (April 22, 2026)

> **For the AI agent reading this after context compaction:** This file is the
> authoritative record of the SEO re-audit performed on both NexFortis sites on
> 2026-04-22. Read this file **and** `TODO-SEO-FIX-PLAN.md` immediately on
> resume before taking any other action on SEO work. The raw per-dimension
> reports live in `seo-audit/*.md` and contain every file:line reference.

---

## TL;DR

Both production sites pass the checks that actually hurt indexation:

- **Zero** canonical mismatches, zero noindex leaks, zero broken OG images, zero dead internal links, zero unexpected redirect chains.
- Sitemaps are **bit-perfect**: qb-portal has 49 URLs, nexfortis has 17, each exactly matches the dynamic source of truth (App.tsx routes + products.json + landingPages.ts + blog API/fallback).
- Every prerendered page has a working title, description, canonical, OG tags, Twitter card, robots meta, and at least one JSON-LD block.
- Lighthouse SEO score: **100/100 on all 6 sampled URLs**, both mobile and desktop.

The audit surfaced **two real landmines** (both fixed in PR #50) plus a list of polish items (deferred to PR #51) and accessibility/performance work (deferred to PR #52).

---

## Audit Scope

**Sites audited:**
- `https://nexfortis.com` (marketing site, 17 URLs in sitemap)
- `https://qb.nexfortis.com` (customer portal, 49 URLs in sitemap)

**Dimensions covered:**
1. Sitemap URL diff (committed vs live vs dynamic source)
2. Head tags per URL: title, description, canonical, robots, OG (title/description/url/image/type/site_name/locale), Twitter (card/title/description/image), JSON-LD structure validity
3. Internal link integrity: dead links, orphans, unexpected redirects, canonical consistency, lingering references to retired products
4. Prerender + routing correctness: dynamic route discovery regex, exclusion patterns, noindex safety, render.yaml rewrite ordering, security headers, cache headers, dedupe algorithm, fail-closed behavior
5. Lighthouse / PSI: SEO, accessibility, best-practices, performance (mobile + desktop, 6 URLs)

**Methodology:**
- Four parallel research subagents, one per dimension, each running in parallel with independent URL batches
- All results saved to `seo-audit/*.md` + structured JSON files for future diff-based regression detection
- Raw Lighthouse reports saved in `seo-audit/lh/*.json` (12 total: 6 URLs × mobile/desktop)

---

## Sitemap Diff Results

### QB Portal (`https://qb.nexfortis.com/sitemap.xml`)

| Source | URL count | Status |
|---|---|---|
| App.tsx static routes (minus excluded) | 8 | ✓ |
| products.json services | 17 | ✓ |
| products.json categories | 4 | ✓ |
| landingPages.ts slugs | 20 | ✓ |
| **Expected total** | **49** | |
| **Live sitemap** | **49** | **✓ bit-perfect** |
| Committed sitemap (before PR #50) | 53 | ✗ had 4 retired expert-support URLs |
| Committed sitemap (after PR #50) | 49 | ✓ fixed |

### Marketing (`https://nexfortis.com/sitemap.xml`)

| Source | URL count | Status |
|---|---|---|
| App.tsx static routes (minus excluded) | 12 | ✓ |
| Blog posts from API (or blog-fallback.json) | 5 | ✓ |
| **Expected total** | **17** | |
| **Live sitemap** | **17** | **✓ bit-perfect** |

No action needed for marketing — committed and live already match.

---

## Head Tags + JSON-LD Audit

| Dimension | QB (49 URLs) | NF (17 URLs) | Total |
|---|---|---|---|
| PASS (all dimensions clean) | 29 | 11 | 40 / 66 (61%) |
| CRITICAL (indexation-breaking) | 0 | 0 | **0** |
| IMPORTANT (ranking-affecting) | 9 on 8 URLs | 8 on 5 URLs | 17 issues |
| MINOR (polish only) | 7 | 1 | 8 issues |
| JSON-LD coverage gaps | 7 | 1 | 8 pages |

**Zero critical findings:** every page has a working title, description, canonical, robots, OG set, Twitter card, and at least one JSON-LD block. Every canonical matches its URL. No noindex leaks into prerendered pages. No duplicate dedupe-key tags.

### IMPORTANT issues (17) — all grouped by root cause

1. **Title overruns >70 chars (6 URLs).** Root cause: NF blog post `seoTitle` reuses the full article H1; QB `/catalog` and `/subscription` page titles are long. Affected files:
   - `artifacts/nexfortis/src/pages/blog-post.tsx:54`
   - `artifacts/qb-portal/src/pages/catalog.tsx` (title prop)
   - `artifacts/qb-portal/src/pages/subscription.tsx` (title prop)
   Fix: add a separate `seoTitle` field on blog posts; shorten static page titles.

2. **Description overruns >160 chars (11 URLs).** Root cause: QB services reuse the UI paragraph (`product.description`) as meta description; NF blog `post.excerpt` is an article opener, not a 160-char summary.
   - `artifacts/qb-portal/src/pages/service-detail.tsx` (description prop)
   - `artifacts/nexfortis/src/pages/blog-post.tsx` (description prop)
   Fix: add `meta_description` column to Supabase `services` table; add `metaDescription` field to NF blog API; fall back to truncation if missing.

### JSON-LD coverage gaps (8 pages)

1. **7 QB landing pages with `category="problem"` or `category="comparison"`** fall through the `landing-page-layout.tsx:49–58` conditional and emit no HowTo schema.
   Fix: extend the `else if` branch to also emit `HowTo` for `problem`/`comparison` pages when `process.length > 0`.

2. **`nexfortis.com/services`** has BreadcrumbList + sitewide Organization/WebSite schemas but no `Service` schema.
   Fix: add `<ServiceSchema>` wrapper in `artifacts/nexfortis/src/pages/services.tsx`.

### MINOR (8 issues)

- 3 QB category pages auto-generate descriptions like "Browse 6 QuickBooks quickbooks conversion services services." (double "services" suffix). Fix: strip the word "services" from `categoryName` before interpolating in `artifacts/qb-portal/src/pages/category.tsx:~52`.
- Remaining 5: various overlong but non-critical metas, some missing `og:locale`, minor Twitter card fallback gaps.

Full per-URL detail in `seo-audit/head-jsonld-findings.md`.

---

## Internal Link Integrity Audit

**Zero dead internal links. Zero unexpected redirects. Zero canonical mismatches.**

- All 66 sitemap pages returned HTTP 200
- All 84 unique internal link targets returned HTTP 200
- The four expected expert-support 301 redirects all return 301 → `/subscription` in one hop

### Issues found (all non-indexation-blocking)

1. **Sitemap not regenerated after PR #48** — FIXED in PR #50.

2. **Low: api-server `ALLOWED_CATEGORIES` not trimmed.**
   `artifacts/api-server/src/routes/qb-admin-promo.ts:28` still lists `"expert-support"` in the promo-code category allowlist. No active products carry that category, so any promo code created against it matches nothing. Dead code; remove in PR #51.

3. **Informational: meta descriptions reference retired category with wrong product counts.**
   - `artifacts/qb-portal/src/pages/catalog.tsx:40` — says "20 services across 5 categories"; correct count is now **17 services across 4 categories**.
   - `artifacts/qb-portal/src/pages/home.tsx:142` — still mentions "expert support" as a service category name.
   Both fix in PR #51.

4. **1 orphan page:** `https://qb.nexfortis.com/landing/quickbooks-support-subscription` has zero inbound internal links. It's in the sitemap and reachable, but receives no internal PageRank flow.
   Fix in PR #51: add one link from the subscription page.

5. **2 anchor-text casing inconsistencies:**
   - `nexfortis.com/contact`: "Contact Us" (7 pages) vs "Contact us" (17 pages) — pick one.
   - `qb.nexfortis.com/landing/how-conversion-works`: "How our migration process works" vs "how our migration process works" — two service detail pages use lowercase while the category page uses title case.

No instances of incorrect "Quickbooks" casing found anywhere. Full detail in `seo-audit/link-integrity-findings.md`.

---

## Prerender + Routing Audit

**Dynamic route discovery is working correctly on both sites.** Adding a new `<Route path="/foo" ...>` to App.tsx gets automatically prerendered on next build, with no config change needed, unless the route matches `EXCLUDED_ROUTES` or `EXCLUDED_PATTERNS`. Same for QB service/category/landing additions via products.json + landingPages.ts.

### Verified correct (14 checks)

| Check | Result |
|---|---|
| Multi-line `<Route>` JSX regex | ✅ `\s+` matches `\n`; all multi-line splits work |
| All `noindex` emitters only on excluded routes | ✅ grepped both artifact trees |
| `spa-shell.html` has noindex (confirmed live) | ✅ |
| Catch-all `/* → /*.html` last in render.yaml | ✅ |
| Redirects declared before rewrites | ✅ |
| Sitemap count 49 QB / 17 NF | ✅ Exact match |
| robots.txt `Sitemap:` directive on both sites | ✅ |
| All 4 QB expert-support 301s return HTTP 301 live | ✅ |
| NF `/services/automation-software` 301 live | ✅ |
| All 4 security headers (X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, HSTS preload) | ✅ both sites |
| `/assets/*` immutable caching (public, max-age=31536000) | ✅ both sites |
| seo-dedupe "last-wins" correctly keeps helmet tag over shell default | ✅ |
| Puppeteer failure = `process.exit(1)` (build fails) | ✅ |
| Blog API failure → blog-fallback.json | ✅ fail-closed |

### CRITICAL issues (4) — 3 of 4 FIXED in PR #50

1. **api.nexfortis.com is NXDOMAIN** — FIXED in PR #50 (both scripts now point to `nexfortis-api.onrender.com/api` and share the `BLOG_API` env var).

2. **Sitemap `fs.readFile` fallback had no try/catch** — FIXED in PR #50 (wrapped with descriptive throw).

3. **`products.json` failure was silent `console.warn`** — FIXED in PR #50 (now throws, build fails).

4. **Zero landing slugs silently ignored** — FIXED in PR #50 (now throws, build fails).

### IMPORTANT issues (4) — all deferred

1. **Blog API URL inconsistency** — already resolved alongside C1 above via unified env var.

2. **Redundant `/services/automation-software` entry in EXCLUDED_ROUTES + App.tsx redirect** — both needed for different stages, but there's no enforcement that they stay in sync. Low risk, document only (add code comment in PR #51).

3. **`/portal/*` rewrite in render.yaml has no matching pattern in EXCLUDED_ROUTES/EXCLUDED_PATTERNS** — a future `/portal/settings` route would escape into the prerender queue. Add `/^\/portal/` to `EXCLUDED_PATTERNS` in PR #51.

4. **`<Route component={NotFound}/>` has no `path=`** — correctly never prerendered, but adding `path="*"` later would break the build with a cryptic error. Add a code comment in PR #51.

Full detail in `seo-audit/prerender-routing-findings.md`.

---

## Lighthouse / PSI Results

| URL | Strategy | SEO | Best Practices | Accessibility | Performance |
|---|---|---|---|---|---|
| nexfortis.com/ | mobile | **100** | **100** | 94 | 64 |
| nexfortis.com/ | desktop | **100** | **100** | 94 | 34 |
| nexfortis.com/services/microsoft-365 | mobile | **100** | **100** | 90 | **19** 🔴 |
| nexfortis.com/services/microsoft-365 | desktop | **100** | **100** | 90 | 34 |
| nexfortis.com/blog/what-is-pipeda-why-it-matters | mobile | **100** | **100** | 97 | 49 |
| nexfortis.com/blog/what-is-pipeda-why-it-matters | desktop | **100** | **100** | 97 | 77 |
| qb.nexfortis.com/ | mobile | **100** | **100** | 92 | 48 |
| qb.nexfortis.com/ | desktop | **100** | **100** | 92 | 97 |
| qb.nexfortis.com/catalog | mobile | **100** | **100** | 93 | 66 |
| qb.nexfortis.com/catalog | desktop | **100** | **100** | 93 | 98 |
| qb.nexfortis.com/landing/audit-trail-removal | mobile | **100** | **100** | 95 | 66 |
| qb.nexfortis.com/landing/audit-trail-removal | desktop | **100** | **100** | 95 | 98 |

### SEO: 100/100 everywhere ✅

### Accessibility issues (common across pages)

1. **`color-contrast`** — some secondary text still below WCAG AA 4.5:1 even after PR #47 header fix. Needs per-element sweep.
2. **`heading-order`** — somewhere an H2 is followed by an H4 (skipped H3). Find with Axe or devtools audit.
3. **`meta-viewport`** — all pages have `user-scalable=no` in viewport meta. Violates WCAG 1.4.4 (pinch-to-zoom). Remove the restriction.
4. **`aria-allowed-role`** on nexfortis desktop — some element has an ARIA role not permitted on its tag.

### Performance opportunities (mobile especially)

1. **Unused JavaScript** — ~300–750 ms savings. Code-split heavier routes.
2. **Preconnect to third-party origins** — ~300 ms. Add `<link rel="preconnect">` for API, fonts, analytics.
3. **Render-blocking resources** — CSS loading strategy.
4. **Offscreen images** — lazy-load images below the fold.

The `nexfortis.com/services/microsoft-365` mobile score of 19 is the worst offender and needs investigation first in PR #52.

Full detail in `seo-audit/lighthouse-findings.md`.

---

## Raw Audit Files

All files in `seo-audit/`:

| File | Size | Purpose |
|---|---|---|
| `head-jsonld-findings.md` | 32 KB, 451 lines | Per-URL head tag + JSON-LD results |
| `link-integrity-findings.md` | 23 KB, 376 lines | Link graph + dead/orphan/redirect analysis |
| `prerender-routing-findings.md` | 31 KB, 593 lines | 13-question architectural audit |
| `lighthouse-findings.md` | 18 KB, 234 lines | PSI score table + audit failures |
| `head-jsonld-raw-results.json` | 112 KB | Structured head/JSON-LD data per URL |
| `link-graph.json` | 440 KB | Full internal link graph (extracted anchors from all 66 pages) |
| `parsed_results.json` | 42 KB | Structured Lighthouse score extracts + failed audits |
| `qb-urls.txt`, `nf-urls.txt` | 3 KB, 0.7 KB | URL inventories |

Raw Lighthouse JSONs (~8.5 MB, 12 files) were not committed to keep repo history light. Regenerate anytime via Lighthouse CLI 12.x against the 6 sampled URLs listed in `lighthouse-findings.md`.

---

## Work Plan

See `TODO-SEO-FIX-PLAN.md` for the three-PR fix plan and status.

---

## For Future AI Agents (Context Recovery Instructions)

If you are resuming this work after context compaction:

1. **Read this file completely** before responding.
2. **Read `TODO-SEO-FIX-PLAN.md`** to know which PRs are shipped and what's next.
3. **Never** modify files in `docs/` (user constraint — Replit agent only).
4. **Never** use the words "scrape" or "crawl". Use "collect", "extract", "browse", "read".
5. **Every** PR review must be line-by-line by the primary AI agent (the user does not trust other reviewers).
6. **Confirm** before sending emails, making purchases, or calling wide_research/wide_browse on 20+ entities.
7. The user wants PRs small and focused. Three bundles:
   - PR #50 (merged): stale sitemap + prerender fail-closed guards + blog API unification
   - PR #51 (not started): every polish item in "Head Tags", "JSON-LD coverage", "Link Integrity", and "Prerender IMPORTANT" sections above
   - PR #52 (not started): accessibility + performance — user wants to discuss this one live before starting
8. After PR #51 merges, submit the 4 retired URLs to Google Search Console for recrawl (not automated).
9. The subscription cancel test is the original pre-landmine goal and still pending.
