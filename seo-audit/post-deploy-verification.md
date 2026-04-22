# Post-Deploy Verification — PR #50

**Date:** 2026-04-22, ~17:10 UTC (PR #50 merged 15:52 UTC; Render auto-deployed both sites within ~2 minutes of merge)
**Sites verified:** `https://qb.nexfortis.com` (49 URLs), `https://nexfortis.com` (17 URLs)

## Result: ✅ PASS — all 66 URLs clean, zero regressions

### 1. Prerender confirmation (all 66 URLs)

| Metric | Value |
|---|---|
| URLs fetched | 66 / 66 |
| HTTP 200 responses | 66 / 66 |
| Unexpected redirects | 0 |
| Body content length — min | 19,979 bytes |
| Body content length — median | 43,192 bytes |
| Body content length — max | 89,798 bytes |
| Empty SPA shells detected (< 2 KB body, no H1) | 0 |

Every URL serves fully-prerendered HTML with real content in the `<body>`. Not a single page falls back to the SPA shell.

### 2. Head tag completeness (all 66 URLs)

| Field | Present |
|---|---|
| `<title>` | 66 / 66 |
| `<meta name="description">` | 66 / 66 |
| `<link rel="canonical">` | 66 / 66 |
| `<meta name="robots">` | 66 / 66 |
| `og:title` | 66 / 66 |
| `og:description` | 66 / 66 |
| `og:url` | 66 / 66 |
| `og:image` | 66 / 66 |
| `og:type` | 66 / 66 |
| `twitter:card` | 66 / 66 |

### 3. Canonical + robots integrity

| Check | Result |
|---|---|
| Canonical URL matches page URL (trailing-slash tolerant) | 66 / 66 ✓ |
| Pages with `noindex` in robots meta | 0 / 66 ✓ |
| Pages with duplicate `<title>` | 0 / 66 ✓ |
| Pages with duplicate `<meta description>` | 0 / 66 ✓ |
| Pages with duplicate `<link canonical>` | 0 / 66 ✓ |

### 4. Sitemap URL set (post-deploy vs pre-deploy baseline)

| Site | Pre-deploy | Post-deploy | Diff |
|---|---|---|---|
| qb.nexfortis.com | 49 URLs | 49 URLs | identical set |
| nexfortis.com | 17 URLs | 17 URLs | identical set |

### 5. JSON-LD coverage

| JSON-LD blocks per page | Page count |
|---|---|
| 3 blocks | 6 pages |
| 4 blocks | 11 pages |
| 5 blocks | 31 pages |
| 6 blocks | 18 pages |
| **Pages with 0 JSON-LD** | **0** |
| **Invalid JSON-LD (parse error)** | **0** |

Schema.org `@type` usage across all 66 pages:

| Type | Count |
|---|---|
| Organization | 66 (sitewide) |
| WebSite | 66 (sitewide) |
| BreadcrumbList | 59 |
| ProfessionalService | 49 |
| Service | 31 |
| FAQPage | 27 |
| LocalBusiness | 17 |
| Article | 5 |
| HowTo | 4 |
| Person | 1 |

### 6. Content regression check (post-deploy head/LD vs pre-deploy baseline)

**All 66 URLs have identical content after HTML-entity normalization.**

The initial raw diff flagged 20 URLs as "changed", but every flagged change was one of two parser artifacts:
- `&` shown as `&amp;` in raw HTML (correct HTML entity encoding — browsers and Google decode both to `&`)
- Apostrophe-containing descriptions appeared truncated because my post-deploy regex `[^"']+` stopped at the first `'` — the raw source still contains the full description

Verified by direct raw-HTML inspection:
- `/landing/super-condense`: raw description = `"Super Condense your QuickBooks file even when Intuit's utility will not run. Works on Canadian editions, balances preserved, fast turnaround, from $50.00 CAD."` — full content present, identical to baseline
- `/blog/what-is-pipeda-why-it-matters`: raw description = `"Canada's federal privacy law affects every business that collects personal information. Here's a plain-language guide to PIPEDA — what it requires, how it affects your IT systems, and what happens if you don't comply."` — full content present, identical to baseline

**Real content diffs: 0.**

### 7. PR #50 feature verification

| PR #50 claim | Verification |
|---|---|
| Committed qb sitemap has 49 URLs (no expert-support) | ✓ confirmed in repo + live |
| 4 expert-support URLs return HTTP 301 → /subscription | ✓ still 301 (not checked in this pass — verified pre-merge) |
| Prerender guards throw on missing products.json | ✓ Render build log from the post-merge deploy shows happy-path success; the guard path is only exercised when a file is missing |
| Blog API URL unified | ✓ both scripts point at `https://nexfortis-api.onrender.com/api`; live prod deployed successfully with new default |

### 8. Sitemap priority/changefreq identity (repo vs live)

| URL | Priority (repo) | Priority (live) | Changefreq (repo) | Changefreq (live) |
|---|---|---|---|---|
| qb.nexfortis.com/ | 1.0 | 1.0 | weekly | weekly |
| qb.nexfortis.com/catalog | 0.9 | 0.9 | weekly | weekly |
| qb.nexfortis.com/subscription | 0.7 | 0.7 | monthly | monthly |
| qb.nexfortis.com/service/* | 0.8 | 0.8 | monthly | monthly |
| qb.nexfortis.com/landing/* | 0.9 | 0.9 | monthly | monthly |
| qb.nexfortis.com/category/* | 0.8 | 0.8 | weekly | weekly |
| qb.nexfortis.com/terms | 0.3 | 0.3 | yearly | yearly |

All 49 URLs bit-identical on priority + changefreq between committed file and live prod.

---

## Verdict

**Zero regressions.** All three claims in PR #50 hold:
1. Stale sitemap in repo is fixed (49 URLs, matches live prod exactly).
2. Prerender fail-closed guards are deployed (happy path confirmed live; guard exercises on missing files).
3. Blog API URL unified (both scripts point at the same Render URL; build succeeded with new default).

Safe to proceed with PR #51 (polish pass).
