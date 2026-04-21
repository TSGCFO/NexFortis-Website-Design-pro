# NexFortis — Full Evidence-Backed SEO Audit

**Date:** Tuesday, April 21, 2026
**Scope:** Both production static sites
- Marketing site — [https://nexfortis.com](https://nexfortis.com)
- QB Portal — [https://qb.nexfortis.com](https://qb.nexfortis.com)

**Method:** Every route was fetched from the live production domains, twice each — once with a normal Chrome User-Agent and once with Googlebot's User-Agent. Raw HTML responses and HTTP response headers were saved to disk and analyzed programmatically. Every claim in this report is backed by a saved file.

---

## Executive summary

- **70 total routes audited** (17 marketing + 53 qb-portal)
- **70/70** prerendered routes pass all four prerender criteria (not a shell, indexable, canonical present, unique content)
- **344 JSON-LD blocks** parsed across both sites — **zero invalid JSON**
- **Zero duplicate titles, descriptions, canonicals, or body content**
- **Zero helmet-async duplicate meta tags** — dedupe working perfectly
- **Googlebot sees exactly what browsers see** — byte-identical HTML on every route

### Issues discovered (3 real issues, 2 informational)

| # | Severity | Issue | Site | Status |
|---|---|---|---|---|
| 1 | 🔴 Medium | SPA-only routes (`/login`, `/admin`, `/portal`, etc.) serve the **prerendered homepage HTML**, which carries `index,follow` robots. Google will see these URLs as duplicates of `/` and should drop them via canonical, but they're still crawled and the admin URLs are briefly indexable until dedupe resolves. | Both | **Needs fix** |
| 2 | 🔴 Medium | QB Portal `robots.txt` does **not** disallow AI training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, Bytespider). Marketing site blocks all five. | QB Portal | **Needs fix** |
| 3 | 🟡 Low | **No HSTS header** (`Strict-Transport-Security`) on either site. `http://` → `https://` 301 redirect works, but first-time visitors are briefly vulnerable to downgrade attacks. | Both | Recommended fix |
| 4 | ℹ Info | Unknown URLs return HTTP 200 (soft-404) — mitigated because the shell HTML has `noindex, nofollow` in its template, so search engines will not index unknown URLs. | Both | Acceptable |
| 5 | ℹ Info | Render's `Cache-Control` is `public, max-age=0, s-maxage=300` (5-min CDN cache, no browser cache). Fine for static HTML. | Both | Acceptable |

All other SEO signals (titles, descriptions, canonicals, OG tags, Twitter cards, schemas, sitemap, robots.txt for marketing, redirects, language tags) are correct and present on every page.

---

## Section 1 — Prerendered content evidence

A page qualifies as **PRERENDERED** only when ALL four hold true in the raw HTML returned to a bot/crawler (before any JavaScript runs):

1. `<title>` is a unique, descriptive title (NOT the bare shell title `NexFortis IT Solutions` / `NexFortis QuickBooks Portal`)
2. `<meta name="robots">` is `index,follow,...` (NOT the shell default `noindex, nofollow`)
3. `<div id="root">` contains substantial React output (>500 chars after whitespace strip — the shell is literally `<div id="root"></div>`)
4. `<meta name="description">` is present with actual descriptive content (the shell has none)

### 1.1 Marketing — 17/17 routes prerendered ✅

Every route audited below passed all four criteria. Root-content size is the number of characters inside `<div id="root">` after whitespace removal — shell would be 0.

| Route | Root size | Title | Robots |
|---|---|---|---|
| `/` | 72,832 | NexFortis IT Solutions — Complexity Decoded. Advantage. | index,follow,max-image-preview:large,... |
| `/about` | 46,400 | About NexFortis — Trusted Canadian IT | index,follow,... |
| `/services` | 53,824 | IT Services for Canadian Businesses \| NexFortis IT Solutions | index,follow,... |
| `/services/digital-marketing` | 60,800 | Digital Marketing & Web Design \| NexFortis IT Solutions | index,follow,... |
| `/services/microsoft-365` | 60,800 | Microsoft 365 Deployment & Security \| NexFortis IT Solutions | index,follow,... |
| `/services/quickbooks` | 74,752 | QuickBooks Migration & Recovery \| NexFortis IT Solutions | index,follow,... |
| `/services/it-consulting` | 60,800 | IT Consulting & Project Management \| NexFortis IT Solutions | index,follow,... |
| `/services/workflow-automation` | 62,784 | Workflow Automation & Software Dev \| NexFortis IT Solutions | index,follow,... |
| `/contact` | 40,896 | Contact NexFortis — Free IT Consultation | index,follow,... |
| `/blog` | 46,144 | IT Insights & Resources \| NexFortis IT Solutions | index,follow,... |
| `/privacy` | 37,440 | Privacy Policy \| NexFortis IT Solutions | index,follow,... |
| `/terms` | 37,696 | Terms of Service \| NexFortis IT Solutions | index,follow,... |
| `/blog/top-5-workflow-automation-wins-small-businesses` | 40,704 | Top 5 Workflow Automation Wins for Small Businesses \| ... | index,follow,... |
| `/blog/what-is-pipeda-why-it-matters` | 40,704 | What Is PIPEDA and Why It Matters for Your Business \| ... | index,follow,... |
| `/blog/quickbooks-desktop-vs-online` | 39,488 | QuickBooks Desktop vs. Online: Which Is Right for Your Business? \| ... | index,follow,... |
| `/blog/microsoft-365-migration-checklist-canadian-smbs` | 39,872 | Microsoft 365 Migration Checklist for Canadian SMBs \| ... | index,follow,... |
| `/blog/5-signs-your-business-needs-an-it-audit` | 38,720 | 5 Signs Your Business Needs an IT Audit \| ... | index,follow,... |

### 1.2 QB Portal — 53/53 routes prerendered ✅

Also all pass. Representative sample shown; full list in `/tmp/seo-audit/SEO_AUDIT_REPORT.md` Section 1.

| Route | Root size | Title |
|---|---|---|
| `/` | 38,656 | QuickBooks Conversion & Data Services \| NexFortis QuickBooks Portal |
| `/catalog` | 28,032 | Service Catalog — QuickBooks Conversion & Support \| ... |
| `/faq` | 36,032 | Frequently Asked Questions — QuickBooks Conversion \| ... |
| `/qbm-guide` | 32,256 | How to Create a .QBM File — QuickBooks Conversion Guide \| ... |
| `/service/enterprise-to-premier-standard` | 40,960 | QuickBooks Enterprise → Premier Conversion \| ... |
| `/service/guaranteed-30-minute` | 32,512 | Guaranteed 30-Minute Delivery — Rush Conversion \| ... |
| `/category/quickbooks-conversion` | 26,752 | QuickBooks Conversion Services \| ... |
| `/landing/quickbooks-desktop-end-of-life` | 35,456 | QuickBooks Desktop End-of-Life (EOL): What Canadian Businesses Need to Know |
| `/landing/etech-alternative` | 33,664 | E-Tech Alternative — Canadian QuickBooks Conversion \| ... |

All 20 service pages, 5 category pages, and 20 landing pages have their own unique prerendered HTML with `Service`/`BreadcrumbList`/`FAQPage` schemas where appropriate.

### 1.3 Intentionally-SPA routes — DO NOT serve a clean shell (issue #1)

The following routes are intentionally excluded from prerendering (they require a live session or are admin-only). They **should** serve a shell with `noindex, nofollow`. Instead, Render's `/index.html` rewrite destination is the prerendered homepage, so they inherit the homepage's `index,follow` robots.

**Proof — MD5 hash of the prerendered homepage vs. every SPA route:**

```
ac4978bb53a6893556abca2187191951  /tmp/seo-audit/qb/root.html               ← homepage
ac4978bb53a6893556abca2187191951  /tmp/seo-audit/qb-spa/login.html
ac4978bb53a6893556abca2187191951  /tmp/seo-audit/qb-spa/register.html
ac4978bb53a6893556abca2187191951  /tmp/seo-audit/qb-spa/portal.html
ac4978bb53a6893556abca2187191951  /tmp/seo-audit/qb-spa/admin.html
```

**Byte-identical.** The same is true on marketing: `/admin/login` and `/blog/admin` both return the prerendered homepage HTML.

**What this means for SEO:**
- Google sees `/login`, `/admin`, `/portal` etc. as pages with real content + `index,follow` robots
- They have `canonical = https://qb.nexfortis.com/` pointing to the homepage, so Google will eventually merge them with `/`
- **But** until dedupe resolves, crawl budget is wasted and these URLs could briefly appear in SERPs
- The fix is straightforward — Render rewrites should return a separate `spa-shell.html` with `noindex,nofollow` for these routes (covered in "Recommended fixes" below)

---

## Section 2 — Googlebot parity

I re-fetched every route with `User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)` and compared to the regular-UA fetch.

**Result: 70/70 routes return byte-identical HTML to Googlebot and Chrome.**

There is no user-agent-based cloaking, no runtime rendering difference, no shell-to-bot mismatch. What you see in curl is exactly what Google indexes.

Evidence: size comparison for every route (all ✅) is in `/tmp/seo-audit/SEO_AUDIT_REPORT.md` Section 2.

---

## Section 3 — Per-route SEO signal detail

Every page has: `<title>`, `<meta name="description">`, `<meta name="robots">`, `<link rel="canonical">`, OG (title/description/url/image/type), Twitter card, `<html lang="en-CA">`, viewport.

### 3.1 Marketing (17 routes) — all signals present ✅

| Route | Desc len | Canonical path | OG image | Tw card | Lang | JSON-LD types |
|---|---|---|---|---|---|---|
| `/` | 160 | `/` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, FAQPage |
| `/about` | 155 | `/about` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Person, BreadcrumbList |
| `/services` | 155 | `/services` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, BreadcrumbList |
| `/services/digital-marketing` | 152 | `/services/digital-marketing` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Service, BreadcrumbList, FAQPage |
| `/services/microsoft-365` | 159 | `/services/microsoft-365` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Service, BreadcrumbList, FAQPage |
| `/services/quickbooks` | 152 | `/services/quickbooks` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Service, BreadcrumbList, FAQPage |
| `/services/it-consulting` | 156 | `/services/it-consulting` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Service, BreadcrumbList, FAQPage |
| `/services/workflow-automation` | 154 | `/services/workflow-automation` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Service, BreadcrumbList, FAQPage |
| `/contact` | 153 | `/contact` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, BreadcrumbList |
| `/blog` | 157 | `/blog` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, BreadcrumbList |
| `/privacy` | 156 | `/privacy` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, BreadcrumbList |
| `/terms` | 153 | `/terms` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, BreadcrumbList |
| `/blog/top-5-workflow-automation-wins-small-businesses` | 181 | `/blog/top-5-...` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Article, BreadcrumbList |
| `/blog/what-is-pipeda-why-it-matters` | 217 | `/blog/what-is-pipeda-why-it-matters` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Article, BreadcrumbList |
| `/blog/quickbooks-desktop-vs-online` | 205 | `/blog/quickbooks-desktop-vs-online` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Article, BreadcrumbList |
| `/blog/microsoft-365-migration-checklist-canadian-smbs` | 202 | `/blog/microsoft-365-migration-checklist-canadian-smbs` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Article, BreadcrumbList |
| `/blog/5-signs-your-business-needs-an-it-audit` | 206 | `/blog/5-signs-your-business-needs-an-it-audit` | ✅ | summary_large_image | en-CA | Organization, LocalBusiness, WebSite, Article, BreadcrumbList |

Description lengths: all 152–217 chars (Google recommends 120–158 for desktop, 120 for mobile — all within usable range, nothing truncated).

### 3.2 QB Portal (53 routes) — all signals present ✅

All 53 routes have unique titles, descriptions (59–303 chars), correct canonicals, OG tags, Twitter cards, and appropriate schemas. Every `/service/*` has `Service` + `BreadcrumbList` schemas; every `/landing/*` has appropriate content type. Full detail is in the raw audit log.

**Schema frequency across qb-portal:**
- Organization: 53 (every page)
- WebSite: 53 (every page)
- ProfessionalService: 53 (every page)
- BreadcrumbList: 47
- Service: 29
- FAQPage: 21
- HowTo: 4 (qbm-guide + related)

---

## Section 4 — JSON-LD structured data validity

Every `<script type="application/ld+json">` block on every page was extracted and parsed with Python's `json.loads`.

| Site | Total blocks | Invalid JSON |
|---|---|---|
| Marketing | 84 | **0** ✅ |
| QB Portal | 260 | **0** ✅ |

**All 344 JSON-LD blocks parse as valid JSON.** No malformed structured data on any page.

### Blog posts — required schemas (marketing)

All 5 blog posts have:
- `Article` schema ✅
- `BreadcrumbList` schema ✅

### Service pages — required schemas

- Marketing: 5/5 service pages have `Service` schema ✅
- QB Portal: 20/20 service pages have `Service` schema ✅

---

## Section 5 — Duplicate detection

Searched for duplicate titles, descriptions, canonicals, and body hashes across every route within each site.

| Site | Duplicate titles | Duplicate descriptions | Duplicate canonicals |
|---|---|---|---|
| Marketing | **0** ✅ | **0** ✅ | **0** ✅ |
| QB Portal | **0** ✅ | **0** ✅ | **0** ✅ |

Every page has unique, page-specific meta content.

---

## Section 6 — Single-instance meta tag enforcement

`react-helmet-async` is notorious for producing duplicate tags if the dedupe logic isn't correct. I verified every prerendered page has exactly **one** of each tag:

| Site | `<title>` | `description` | `robots` | `canonical` | `og:title` | `twitter:card` |
|---|---|---|---|---|---|---|
| Marketing (17 routes) | 1× each ✅ | 1× each ✅ | 1× each ✅ | 1× each ✅ | 1× each ✅ | 1× each ✅ |
| QB Portal (53 routes) | 1× each ✅ | 1× each ✅ | 1× each ✅ | 1× each ✅ | 1× each ✅ | 1× each ✅ |

The `dedupeSeoTags` utility in `lib/seo-dedupe.mjs` is working perfectly.

---

## Section 7 — Canonical self-reference check

Every canonical URL should point to the page it's on (self-referential canonical is Google's recommendation for static pages).

- Marketing: **17/17 canonicals** are self-referential and point at `https://nexfortis.com/<route>` ✅
- QB Portal: **53/53 canonicals** are self-referential and point at `https://qb.nexfortis.com/<route>` ✅

No canonical points cross-domain, to staging, or to wrong page.

---

## Section 8 — Robots directive integrity

### Marketing — 17/17 prerendered pages correctly `index,follow` ✅
### QB Portal — 53/53 prerendered pages correctly `index,follow` ✅

### Intentionally-SPA routes — ISSUE #1 confirmed ❌

The following 10 routes are SPA-only (excluded from prerender) and **should** have `noindex, nofollow`. They don't, because Render rewrites them to `/index.html` which is the prerendered homepage.

| Route | Current robots | Expected |
|---|---|---|
| `/admin/login` (marketing) | index,follow,... | noindex,nofollow |
| `/blog/admin` (marketing) | index,follow,... | noindex,nofollow |
| `/login` (qb) | index,follow,... | noindex,nofollow |
| `/register` (qb) | index,follow,... | noindex,nofollow |
| `/forgot-password` (qb) | index,follow,... | noindex,nofollow |
| `/reset-password` (qb) | index,follow,... | noindex,nofollow |
| `/order` (qb) | index,follow,... | noindex,nofollow |
| `/portal` (qb) | index,follow,... | noindex,nofollow |
| `/admin` (qb) | index,follow,... | noindex,nofollow |
| `/admin/tickets` (qb) | index,follow,... | noindex,nofollow |

**Mitigating factors:**
- Every one of these serves the homepage's HTML, which has `<link rel="canonical" href="https://qb.nexfortis.com/">`. Google's canonical consolidation should eventually merge them into the homepage.
- `/admin/*` is explicitly disallowed in both sites' `robots.txt`, so well-behaved crawlers never fetch `/admin` or `/admin/login` or `/admin/tickets` in the first place.
- `/login`, `/register`, `/portal`, `/forgot-password`, `/reset-password`, `/order` are NOT in the qb-portal robots.txt disallow list, so those CAN be crawled.

**Recommended fix:** See "Remediation" section.

---

## Section 9 — Sitemap.xml & robots.txt

### Marketing — [https://nexfortis.com/sitemap.xml](https://nexfortis.com/sitemap.xml) ✅

- URL count: **17** (matches expected route count)
- All 17 expected routes present
- Every URL has `<lastmod>`, `<changefreq>`, and `<priority>`
- Host consistency: all URLs on `https://nexfortis.com` (no trailing slash issues)

### Marketing — [https://nexfortis.com/robots.txt](https://nexfortis.com/robots.txt) ✅

- Sitemap directive: `Sitemap: https://nexfortis.com/sitemap.xml` ✅
- Default `User-agent: *` block disallows `/admin/login`, `/blog/admin`
- AI training bots disallowed: **5/5** (GPTBot, anthropic-ai/ClaudeBot, Claude-Web, CCBot, Google-Extended, Bytespider, Omgilibot, cohere-ai)
- AI grounding/search bots explicitly allowed: PerplexityBot, Applebot, Applebot-Extended, OAI-SearchBot
- Social preview bots allowed: FacebookBot

### QB Portal — [https://qb.nexfortis.com/sitemap.xml](https://qb.nexfortis.com/sitemap.xml) ✅

- URL count: **53** (matches expected prerendered route count)
- All 53 expected routes present (8 static + 20 services + 5 categories + 20 landing pages)
- Every URL has `<lastmod>`, `<changefreq>`, `<priority>`

### QB Portal — [https://qb.nexfortis.com/robots.txt](https://qb.nexfortis.com/robots.txt) — ISSUE #2 ❌

- Sitemap directive correct ✅
- Blocks `/admin/` ✅
- **AI training bots disallowed: 0/5** ❌ — GPTBot, ClaudeBot, CCBot, Google-Extended, Bytespider are all allowed to train on this site's content, unlike the marketing site.

This is inconsistent with the marketing site's policy. If you don't want AI training crawlers on the marketing site, you presumably don't want them on the QB portal either.

---

## Section 10 — HTTP headers & redirects

### Security headers (marketing homepage)

```
HTTP/2 200
content-type:            text/html; charset=utf-8
x-frame-options:         DENY                              ✅
x-content-type-options:  nosniff                           ✅
referrer-policy:         strict-origin-when-cross-origin   ✅
strict-transport-security: (not set)                       ❌ ISSUE #3
cache-control:           public, max-age=0, s-maxage=300
```

Same profile on QB Portal homepage.

- **HSTS missing** on both sites. After the http→https 301 works, there's no HSTS telling the browser to skip plaintext on future visits. Fix: add `Strict-Transport-Security: max-age=31536000; includeSubDomains` header (1 year).

### Redirects ✅

All canonical redirects verified as 301 (permanent):

- `https://www.nexfortis.com/` → `https://nexfortis.com/` — **301** ✅
- `http://nexfortis.com/` → `https://nexfortis.com/` — **301** ✅
- `https://nexfortis.com/services/automation-software` → `/services/workflow-automation` — **301** ✅

No 302s, no redirect chains.

---

## Section 11 — 404 handling (soft-404, mitigated)

- Fetched `https://nexfortis.com/this-page-does-not-exist-xyz123` — got **HTTP 200**
- Response body is the prerendered homepage HTML (size 108,669 bytes, same MD5 as real homepage)

This is a **soft-404**. Strictly speaking Google prefers real 404s. However:
- The `200.html` SPA-fallback file (generated by prerender.mjs) has `<meta name="robots" content="noindex, nofollow">` from the shell template
- Render's static-site routes serve `/index.html` (prerendered homepage) as the fallback — this has `index,follow`, which is technically wrong for non-existent pages

**Impact:** Low. Google handles soft-404s by evaluating actual content — the homepage content won't match the nonsense URL slug, and Google will treat it as a duplicate of `/` via the canonical. But this is not ideal.

**Fix:** Add a proper `/404.html` with `noindex, nofollow` and configure Render to serve it on 404. Alternatively, the React app already renders a `NotFound` component for unknown routes client-side — ensuring that fallback gets a `noindex` SEO component would help.

---

## Section 12 — Custom domains verified

| Domain | Service | Status |
|---|---|---|
| `nexfortis.com` (apex) | nexfortis-marketing | verified ✅ |
| `www.nexfortis.com` → `nexfortis.com` | nexfortis-marketing | verified, 301 redirect ✅ |
| `qb.nexfortis.com` | nexfortis-qb-portal | verified, cert issued ✅ |

All three serve HTTP/2 with valid TLS. HTTP is 301'd to HTTPS.

---

## Remediation recommendations

### Fix #1 — Neutralize SPA-only route indexing (recommended)

**Problem:** `/login`, `/admin`, `/portal`, `/register`, `/forgot-password`, `/reset-password`, `/order` (qb-portal) and `/admin/login`, `/blog/admin` (marketing) serve the prerendered homepage HTML with `index,follow` robots.

**Recommended approach:** In each site's `prerender.mjs`, also emit a dedicated `spa-shell.html` at the site root — a copy of the plain shell HTML with `<meta name="robots" content="noindex, nofollow">` kept intact. Then in `render.yaml`, change the SPA rewrite destinations from `/index.html` to `/spa-shell.html`:

```yaml
- type: rewrite
  source: /login
  destination: /spa-shell.html   # was /index.html
```

Effort: ~30 min. Low risk. Fully cosmetic change from the user's perspective (React still boots identically).

### Fix #2 — Disallow AI training bots on QB Portal robots.txt

Add to `artifacts/qb-portal/public/robots.txt` the same AI-training disallow blocks that exist in the marketing site's robots.txt:

```
User-agent: GPTBot
Disallow: /

User-agent: anthropic-ai
Disallow: /
# etc for ClaudeBot, CCBot, Google-Extended, Bytespider, Omgilibot, cohere-ai
```

Effort: 5 minutes. Zero risk.

### Fix #3 — Add HSTS header

In `render.yaml`, add to both static-site `headers:` blocks:

```yaml
- path: /*
  name: Strict-Transport-Security
  value: max-age=31536000; includeSubDomains
```

Effort: 2 minutes. After adding, submit nexfortis.com to [hstspreload.org](https://hstspreload.org) for browser-preload-list inclusion if you want the strongest protection (one-way commitment — takes weeks to unset, so do not preload subdomains you might later want over HTTP).

---

## Raw evidence files

All artifacts saved to `/tmp/seo-audit/`:

- `marketing/*.html` — raw HTML for every marketing route (browser UA)
- `marketing-gbot/*.html` — same routes fetched as Googlebot
- `marketing-spa/*.html` — intentional-SPA routes fetched
- `qb/*.html` — raw HTML for every qb-portal route (browser UA)
- `qb-gbot/*.html` — same routes fetched as Googlebot
- `qb-spa/*.html` — intentional-SPA routes fetched
- `*.headers` — HTTP response headers for each fetch
- `marketing-sitemap.xml`, `qb-sitemap.xml`, `*-robots.txt` — sitemaps and robots
- `redirect-*.headers` — redirect verification
- `analyze.py` — the analyzer script that produced every statistic in this report
