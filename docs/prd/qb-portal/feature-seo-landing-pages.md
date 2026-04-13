# Feature PRD: SEO Landing Pages — QB Portal

**Feature Name:** SEO Landing Pages for QB Portal (`qb.nexfortis.com`)
**Epic:** QB Portal — qb.nexfortis.com Full Launch
**Status:** Draft v1.0
**Author:** Product
**Date:** 2026-03-09

---

## 1. Feature Name

**SEO Landing Pages — QB Portal**

Keyword-targeted, conversion-optimised landing pages hosted within `qb.nexfortis.com` that capture organic search traffic and funnel visitors into the NexFortis order flow.

---

## 2. Epic

Parent context:
- **QB Portal PRD:** `/docs/prd/qb-portal/`
- **Main Site Architecture:** `artifacts/nexfortis`
- **Portal Codebase:** `artifacts/qb-portal`

The QB Portal currently has **zero SEO infrastructure** — no meta tags, no sitemap, no robots.txt, and no landing pages. The main site (`nexfortis.com`) has excellent SEO (JSON-LD, OG tags, sitemap, robots.txt). This feature closes the gap on the subdomain and adds 20+ purpose-built landing pages to capture intent-rich search queries that competitors currently own.

---

## 3. Goal

### Problem

`qb.nexfortis.com` is invisible to search engines. Visitors who arrive from the main site's QB services page are forwarded to `/contact` rather than the portal — losing conversion momentum. Meanwhile, the dominant competitor (E-Tech, operating under 5+ branded domains) saturates the search results for every major QuickBooks service query. Potential customers searching for "quickbooks enterprise to premier conversion" or "remove audit trail quickbooks" have no organic path to NexFortis.

### Solution

Build a library of keyword-targeted landing pages within the QB Portal, layered on top of a complete technical SEO foundation (sitemap, robots.txt, canonical URLs, JSON-LD schemas, OG tags). Each page targets a specific user intent — service queries, problem-symptom queries, comparison queries, and educational queries — and terminates in a clear CTA that routes the visitor into the order or account flow. Fix the main site's QB services page to link directly to the portal rather than `/contact`.

### Impact (Target KPIs)

| Metric | Baseline | 6-Month Target | 12-Month Target |
|---|---|---|---|
| Organic sessions to `qb.nexfortis.com` | ~0 | 500/month | 2,000/month |
| Landing page conversion rate (session → order start) | N/A | ≥ 3% | ≥ 5% |
| Google Search Console impressions | 0 | 10,000/month | 50,000/month |
| Pages indexed by Google | 0 | 25+ | 35+ |
| Average page load speed | N/A | < 2 seconds | < 1.5 seconds |
| Core Web Vitals (LCP/CLS/FID) | N/A | Pass | Pass |

---

## 4. User Personas

### Persona 1 — The Frustrated QB Desktop User
A small business owner or bookkeeper whose QuickBooks file has become too large, too slow, or is producing error codes. They search Google with symptom-first queries ("quickbooks file too large", "quickbooks running slow fix"). They are not yet aware that a professional data service exists. They need education, reassurance, and a low-friction path to a solution.

### Persona 2 — The Accountant Researching for a Client
A CPA, bookkeeper, or ProAdvisor whose client needs to downgrade from Enterprise or migrate from Sage/AccountEdge. They search with service-specific queries ("sage 50 to quickbooks migration service", "accountedge to quickbooks canada"). They are comparison shopping: price, turnaround, Canadian file support, and credibility (BBB, reviews, guarantees) all matter. Volume packs and the Professional/Premium support subscription are relevant upsells.

### Persona 3 — The Price-Conscious Switcher
A business owner who has found E-Tech or Big Red Consulting but wants to compare pricing before committing. They search "e-tech quickbooks alternative", "cheaper quickbooks enterprise conversion", or "quickbooks conversion canada". They respond to transparent pricing, explicit price anchoring, and trust signals (guarantee, secure file handling, PIPEDA compliance).

### Persona 4 — The Research-Mode Evaluator
A user in early research who is not yet ready to order but is building knowledge ("how does quickbooks enterprise to premier conversion work", "is it safe to convert quickbooks files"). High-quality educational content captures this persona at top-of-funnel and retains them through email capture or bookmarking.

---

## 5. User Stories

### Service-Specific Pages

**US-1:** As a business owner, I want to find a clear, trustworthy page about QuickBooks Enterprise-to-Premier conversion so that I understand the service, confirm it works for Canadian files, and can order with confidence.
**US-2:** As an accountant, I want to see a page specifically for QuickBooks Audit Trail Removal so that I can confirm scope, pricing, and turnaround time before recommending the service to my client.
**US-3:** As a Canadian QB user, I want to find a page about QuickBooks Super Condense so that I can understand why Canadian files can't be condensed natively and how NexFortis solves this.
**US-4:** As an accountant, I want to find a dedicated page for AccountEdge-to-QuickBooks migration so that I can compare NexFortis against E-Tech and choose the right provider for my client.
**US-5:** As a business owner migrating from Sage 50, I want a clear landing page that explains what data transfers, what doesn't, and what the file requirements are.
**US-6:** As a visitor who found the QuickBooks File Repair page, I want to understand the difference between file repair and data recovery so that I choose the right service.

### Problem-Focused Pages

**US-7:** As a QB user whose file is sluggish, I want to land on a page about slow QuickBooks performance so that I'm guided toward the right service (Super Condense, Audit Trail Removal, or Support Subscription) rather than a generic contact form.
**US-8:** As a QB user seeing error codes, I want a landing page that lists common error codes and explains which NexFortis service addresses each one, so I can self-diagnose and convert.
**US-9:** As a QB user with a file-too-large problem, I want a page that clearly explains file size limits, why Canadian files grow unbounded, and how Super Condense (from $50 at launch) solves the problem.

### Comparison / Alternative Pages

**US-10:** As a price-conscious buyer who found E-Tech, I want to find a page on NexFortis comparing the two services side-by-side so that I can make an informed decision (NexFortis publishes prices; E-Tech does not).
**US-11:** As a Canadian business owner frustrated by Big Red Consulting's US-only policy, I want to land on a page that explicitly confirms NexFortis supports Canadian Enterprise files at a transparent flat fee.
**US-12:** As a user searching "quickbooks conversion canada", I want a geo-targeted page that prominently mentions Canadian file support, CAD pricing, PIPEDA compliance, and the Ontario-based team.

### Educational / Trust Pages

**US-13:** As a first-time buyer, I want a detailed process explainer page so that I understand exactly what happens to my file during conversion — from upload to delivery.
**US-14:** As a cautious business owner, I want a "Is it safe?" FAQ page that addresses file security, data privacy (PIPEDA), what happens if something goes wrong, and the money-back guarantee, so that I feel confident handing over sensitive financial data.
**US-15:** As a QB Desktop user who read that Desktop is being deprecated, I want a page that explains the Desktop end-of-life timeline, my options, and how NexFortis can help with the transition.

### Technical / Infrastructure

**US-16:** As a search engine bot, I want a complete `sitemap.xml` and `robots.txt` so that all landing pages are discovered and indexed efficiently.
**US-17:** As a returning visitor sharing a landing page link on LinkedIn, I want rich Open Graph previews so that the shared link appears professional and drives click-through.

---

## 6. Requirements

### 6.1 Technical SEO Foundation (applies to entire QB Portal)

These must ship before or alongside the first landing page, as they affect all existing portal routes.

**Functional Requirements:**

- **Meta tags per route:** Every route in the QB Portal must render a unique `<title>` (50–60 characters) and `<meta name="description">` (150–160 characters) via a `<Helmet>` or equivalent React head management component (e.g. `react-helmet-async` or Vite's SSR meta injection).
- **Canonical URLs:** Every page must emit a `<link rel="canonical" href="https://qb.nexfortis.com/[path]" />` tag. No duplicate content between `http` and `https` or trailing-slash variants.
- **Open Graph tags:** Every page must emit `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, and `og:site_name`. Landing pages use a service-specific OG image (1200×630px).
- **Twitter Card tags:** `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` on every page.
- **`sitemap.xml`:** Auto-generated at `https://qb.nexfortis.com/sitemap.xml`. Must include all static routes + all landing page routes. Priority and changefreq attributes set per page type (landing pages: priority 0.9, monthly pages: 0.7).
- **`robots.txt`:** Served at `https://qb.nexfortis.com/robots.txt`. Allow all bots. Disallow `/portal/*` (authenticated dashboard), `/api/*`, `/admin/*`. Reference the sitemap URL.
- **JSON-LD — Global:** `Organization` and `WebSite` schemas in the root `<head>` of the portal app.
- **Breadcrumb schema:** `BreadcrumbList` JSON-LD on every landing page. Example: Home → Services → QuickBooks Audit Trail Removal.
- **Internal linking:** Each landing page links to ≥ 2 related landing pages via a "Related Services" component. All service landing pages link to the corresponding order page.
- **Main site fix:** The QB services page on `nexfortis.com` must be updated to link to `https://qb.nexfortis.com/` (or the relevant service page) instead of `/contact`.

**Non-Functional Requirements:**

- Page load time < 2 seconds on a standard 4G connection (measured by Lighthouse or WebPageTest).
- Core Web Vitals pass thresholds: LCP < 2.5s, CLS < 0.1, FID/INP < 200ms.
- Lighthouse SEO score ≥ 95 on all landing pages.
- Lighthouse Accessibility score ≥ 90 on all landing pages.
- All meta tag rendering must be server-side or static (not client-side only) to ensure Googlebot receives full tags without JavaScript execution dependency. If the portal remains a CSR SPA, implement dynamic rendering or pre-rendering for landing page routes via a static generation step (e.g. `vite-plugin-ssr`, prerendering, or a CDN-level rendering solution).
- HTTPS enforced. HTTP redirects to HTTPS with a 301.
- Trailing-slash consistency: choose one pattern (no trailing slash) and 301-redirect the other.

### 6.2 Landing Page Content Requirements (applies to each page)

**Functional Requirements:**

- **H1:** Must contain the primary target keyword verbatim or near-verbatim. One H1 per page.
- **Word count:** 800–1,500 words of unique, original content per page. No content reused verbatim between pages.
- **Above-fold CTA:** A primary call-to-action button visible without scrolling on desktop (1280px wide) and mobile (375px wide). CTA links to the relevant `/services/[slug]` order page or the product checkout. CTA text is action-oriented: "Get Started — From $50", "Order Now", "Upload Your File".
- **Pricing preview:** Display the launch promo price with the original price struck through (e.g., ~~$99~~ **$50**). Include "Launch pricing — limited time" label.
- **Trust signals block:** Process steps (3–5 steps from upload to delivery), security badge ("256-bit encrypted upload"), PIPEDA compliance note, 100% data guarantee, and a testimonials placeholder (3 slots, clearly marked for content population).
- **FAQ section:** 4–6 questions per page, specific to that service/problem. Rendered as an accordion UI component. FAQ JSON-LD (`FAQPage` schema) emitted for each page.
- **Related services sidebar/section:** Links to 2–4 related landing pages and services. Desktop: sidebar layout. Mobile: below-main-content card strip.
- **Structured data:** Service-specific JSON-LD schema (see Section 6.3).
- **Images:** At minimum, one above-fold hero image/illustration (service-relevant) and one process diagram. All images have descriptive `alt` text. Images served in WebP format with fallback.
- **Internal links:** Each page links to the portal home, the service catalog, the relevant order page, and ≥ 2 related landing pages.

**Non-Functional Requirements:**

- Content must be original and not duplicated from competitor sites.
- Reading level target: Grade 8–10 (Flesch-Kincaid). Plain language, no unnecessary jargon. Define technical terms on first use (e.g., "QuickBooks company file (.QBW)").
- Content must be legally accurate — do not make guarantees that cannot be fulfilled (e.g., "instant conversion" is out of scope for v1).
- All prices displayed must match the live product catalog in `products.json`. Prices are CAD; label as CAD on all pages.

### 6.3 JSON-LD Schema Requirements

| Page Type | Required Schemas |
|---|---|
| Service landing pages | `Service`, `FAQPage`, `BreadcrumbList` |
| Problem-focused pages | `FAQPage`, `BreadcrumbList` |
| Comparison pages | `FAQPage`, `BreadcrumbList` |
| Educational pages | `Article` or `HowTo`, `FAQPage`, `BreadcrumbList` |
| Portal root / home | `Organization`, `WebSite`, `BreadcrumbList` |

**`Service` schema fields (minimum):**
- `name`: Service name
- `description`: 150–200 word description
- `provider`: NexFortis organization object (name, url, address — 204 Hill Farm Rd, Nobleton ON L7B 0A1)
- `areaServed`: Canada (primary), with US/UK/AU noted where applicable
- `offers`: Price in CAD, `priceCurrency: "CAD"`, `availability: "https://schema.org/InStock"`
- `serviceType`: "QuickBooks Data Services" or relevant category

**`LocalBusiness` schema:** Emit once in the portal root `<head>` (not per page), covering NexFortis company details, address, and `support@nexfortis.com`.

### 6.4 Page Inventory

#### Group A — Service-Specific Landing Pages

| Slug | Page Title | Primary Keyword Target | Search Volume Category |
|---|---|---|---|
| `/landing/enterprise-to-premier-conversion` | QuickBooks Enterprise to Premier Conversion Service | convert quickbooks enterprise to premier | High |
| `/landing/audit-trail-removal` | QuickBooks Audit Trail Removal Service | remove audit trail quickbooks | Medium |
| `/landing/super-condense` | QuickBooks Super Condense Service — Canadian Files | quickbooks super condense | Medium |
| `/landing/file-repair` | QuickBooks File Repair Service | quickbooks file repair service | Medium |
| `/landing/accountedge-to-quickbooks` | AccountEdge to QuickBooks Migration | accountedge to quickbooks | Low–Medium |
| `/landing/sage-50-to-quickbooks` | Sage 50 to QuickBooks Migration Service | sage 50 to quickbooks migration | Medium |
| `/landing/multi-currency-removal` | QuickBooks Multi-Currency Removal Service | quickbooks multi currency removal | Low |
| `/landing/list-reduction` | QuickBooks List Reduction Service | quickbooks list reduction service | Low |
| `/landing/qbo-readiness` | QuickBooks Desktop to Online Readiness Report | quickbooks desktop to online migration | Medium |

#### Group B — Problem-Focused Landing Pages

| Slug | Page Title | Primary Keyword Target | Search Volume Category |
|---|---|---|---|
| `/landing/quickbooks-file-too-large` | QuickBooks File Too Large — Fix It Fast | quickbooks file too large | High |
| `/landing/quickbooks-running-slow` | Why Is QuickBooks Running Slow? Solutions & Services | quickbooks running slow | High |
| `/landing/quickbooks-company-file-error` | QuickBooks Company File Error — Fix & Recovery | quickbooks company file error | High |
| `/landing/quickbooks-multi-currency-problems` | QuickBooks Multi-Currency Problems & Removal | quickbooks multi currency problems | Low–Medium |

#### Group C — Comparison / Alternative Pages

| Slug | Page Title | Primary Keyword Target | Search Volume Category |
|---|---|---|---|
| `/landing/etech-alternative` | E-Tech Alternative for QuickBooks Conversion | e-tech quickbooks alternative | Low–Medium |
| `/landing/quickbooks-conversion-canada` | QuickBooks Conversion Service — Canada | quickbooks conversion canada | Medium |
| `/landing/affordable-enterprise-conversion` | Affordable QuickBooks Enterprise Conversion | cheaper quickbooks enterprise conversion | Low |

#### Group D — Educational / Trust Pages

| Slug | Page Title | Primary Keyword Target | Search Volume Category |
|---|---|---|---|
| `/landing/how-conversion-works` | How QuickBooks Enterprise to Premier Conversion Works | how does quickbooks enterprise conversion work | Medium |
| `/landing/is-it-safe` | Is It Safe to Convert QuickBooks Files? | is it safe to convert quickbooks files | Low–Medium |
| `/landing/quickbooks-desktop-end-of-life` | QuickBooks Desktop End of Life — What to Do | quickbooks desktop end of life | High |
| `/landing/quickbooks-support-subscription` | Expert QuickBooks Support Subscription — Canada | quickbooks support service canada | Low |

**Total: 20 landing pages at v1 launch.**

### 6.5 URL & Routing Architecture

- All landing pages are grouped under the `/landing/` path prefix within the QB Portal React router (`artifacts/qb-portal`).
- Route definition: add a dynamic catch-all or enumerate routes in `wouter` router config.
- Landing page components share a single `LandingPageLayout` wrapper component that handles:
  - Head management (Helmet) with per-page props
  - Breadcrumb component + JSON-LD injection
  - FAQ accordion + JSON-LD injection
  - Related services sidebar
  - Trust signals block
  - Hero + CTA section
- Page-specific content (H1, body copy, FAQ Q&As, schema fields, meta tags) is data-driven from a `landingPages.ts` content config file (similar to existing `products.json` pattern).

### 6.6 Content Management

- Content for all 20 pages is authored in a structured TypeScript config (`src/data/landingPages.ts`) with typed fields per page: `slug`, `metaTitle`, `metaDescription`, `h1`, `bodyContent` (MDX or string), `faqs[]`, `relatedSlugs[]`, `schema{}`.
- No CMS required at v1. Content updates are code changes and require a deploy. CMS migration is a v2 scope item.
- Blog admin authentication (existing gap) is out of scope for this PRD but must be tracked as a separate security fix.

---

## 7. Acceptance Criteria

### AC-1: Technical SEO Foundation

- [ ] `https://qb.nexfortis.com/sitemap.xml` returns a valid XML sitemap indexing all 20+ landing page URLs plus existing portal routes. Validated by Google Search Console "Test Sitemap" tool.
- [ ] `https://qb.nexfortis.com/robots.txt` is reachable, allows bots on public routes, and disallows `/portal/*`, `/api/*`, `/admin/*`.
- [ ] `<meta name="robots">` is not set to `noindex` on any landing page.
- [ ] Lighthouse SEO audit on every landing page returns a score ≥ 95.
- [ ] `<title>` tags on all landing pages are 50–60 characters. Confirmed by running an automated meta audit script.
- [ ] `<meta name="description">` tags on all landing pages are 150–160 characters.
- [ ] `<link rel="canonical">` is present and correct on every landing page.
- [ ] `og:image` resolves to a valid, crawlable image URL (1200×630px) on every landing page.
- [ ] JSON-LD structured data on each page validates with zero errors in Google's Rich Results Test.
- [ ] HTTP requests to any portal page return a 301 redirect to HTTPS.
- [ ] Trailing-slash variants return a 301 redirect to the non-trailing-slash canonical.

### AC-2: Landing Page Content

- [ ] Each of the 20 landing pages is reachable at its defined `/landing/[slug]` URL.
- [ ] Each page contains exactly one `<h1>` tag including the primary target keyword.
- [ ] Each page's body content is 800–1,500 words (measured by automated word count on rendered HTML, excluding navigation/footer).
- [ ] Each page displays the strikethrough launch pricing (e.g., ~~$99~~ **$50 CAD**) pulled from the product catalog.
- [ ] Each page's above-fold CTA is visible without scrolling on a 375px-wide viewport (Chrome DevTools mobile emulation).
- [ ] Each page's CTA links to the correct `/services/[product-slug]` page or the checkout flow.
- [ ] Each page's FAQ section contains 4–6 questions and uses the accordion UI component.
- [ ] Related services section on each page links to ≥ 2 other landing pages with valid internal links.
- [ ] All images have non-empty `alt` attributes.
- [ ] All images are served in WebP format.

### AC-3: Performance

- [ ] Lighthouse Performance score ≥ 80 on all landing pages (desktop).
- [ ] LCP < 2.5 seconds on a simulated 4G connection (Lighthouse throttled).
- [ ] CLS < 0.1 on all landing pages.
- [ ] Total page weight < 500KB (excluding images).

### AC-4: Mobile

- [ ] All landing pages pass Lighthouse "Mobile-Friendly" audit.
- [ ] Related services section renders as a card strip below main content on screens < 768px.
- [ ] FAQ accordion is functional on touch devices (no hover-only interactions).
- [ ] Above-fold CTA is reachable without horizontal scrolling on 375px viewports.

### AC-5: Main Site Fix

- [ ] The QB services page on `nexfortis.com` links to `https://qb.nexfortis.com` (or a specific service landing page URL) rather than `/contact`. Verified by inspecting the link's `href` in the deployed main site.

### AC-6: Comparison Pages

- [ ] The `/landing/etech-alternative` page does not make false or defamatory claims about E-Tech. All competitive claims are factually verifiable (e.g., "E-Tech does not publish prices" — accurate as of research date).
- [ ] The `/landing/quickbooks-conversion-canada` page explicitly states: Canadian files supported, all prices in CAD, PIPEDA-compliant data handling, Ontario-based company.

### AC-7: Schema Validation

- [ ] `Service` schema on service landing pages includes `provider.address` matching NexFortis's registered address (204 Hill Farm Rd, Nobleton ON L7B 0A1).
- [ ] `FAQPage` schema on each landing page matches the rendered FAQ questions and answers exactly (no hallucinated schema content).
- [ ] `BreadcrumbList` schema on each page matches the visible breadcrumb navigation.
- [ ] `HowTo` schema on `/landing/how-conversion-works` validates in the Rich Results Test with ≥ 3 steps.

---

## 8. Out of Scope (v1)

The following items are explicitly **not** included in this feature:

- **CMS or headless CMS integration** — Content is static config at v1. CMS is a v2 consideration.
- **Server-side rendering (SSR) or static site generation (SSG) infrastructure overhaul** — If the portal cannot support pre-rendering within the current Vite/React CSR architecture, a lightweight prerender plugin (`vite-plugin-prerender` or equivalent) is the minimum acceptable solution. A full Next.js migration is out of scope.
- **Blog content creation** — The blog admin authentication fix is a separate security task. Blog posts as SEO content are out of scope for this PRD.
- **Link building / off-page SEO** — This PRD covers on-page and technical SEO only.
- **Paid search (Google Ads / PPC)** — Out of scope. Landing pages are designed for organic only.
- **A/B testing infrastructure** — CTA and copy variations are out of scope for v1.
- **Automated keyword rank tracking** — Manual Google Search Console monitoring is sufficient at v1.
- **E-commerce product schema on landing pages** — `Offer` schema is included within the `Service` schema; separate `Product` structured data is not required at v1.
- **LocalBusiness multiple locations** — NexFortis has one address. Multi-location schema is not needed.
- **Video SEO / schema** — No video content is being produced for landing pages at v1.
- **Non-English pages** — French-language pages for Québec market are out of scope for v1.
- **Accountant portal / dedicated partner login** — Volume packs exist in the catalog; a separate accountant portal is a future epic.
- **Blog admin authentication fix** — Tracked separately as a security issue.
- **Founder headshot / LinkedIn** — Main site gap, not QB Portal scope.

---

## 9. Risks & Phased Rollout

### 9.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| CSR-only rendering means Googlebot can't read meta tags without JavaScript | High | High | Implement `vite-plugin-prerender` or equivalent static HTML generation for all `/landing/*` routes before first deploy. Validate with Google's URL Inspection tool. |
| Duplicate content penalty between landing pages with overlapping topics | Medium | Medium | Ensure unique H1s, unique intro paragraphs, and differentiated FAQ questions per page. Use canonical tags. Run a content uniqueness audit before launch. |
| E-Tech comparison page legal exposure | Low | Medium | Stick to factual, verifiable claims. No price comparisons beyond publicly stated figures. Legal review of comparison page copy before launch. |
| Launch promo price drift — prices change but landing page copy isn't updated | Medium | Medium | Drive displayed prices from `products.json` via the same data source used by the catalog. Avoid hardcoding prices in MDX/string content. |
| Sitemap not submitted to Google Search Console | Low | High | Submit sitemap immediately after first deploy. Add a task to the launch checklist. |
| Page speed regression from heavy landing page content | Medium | Medium | Use WebP images, lazy-load below-fold content, defer non-critical scripts. Set Lighthouse CI threshold in CI/CD pipeline. |

### 9.2 Phased Rollout

#### Phase 1 — SEO Foundation (Week 1–2)
**Deliverable: Technical SEO baseline on the entire portal — no landing pages yet.**

- Install `react-helmet-async` (or equivalent) and wire up per-route head management.
- Add default meta tags to all existing portal routes (home, catalog, service detail, auth pages, etc.).
- Generate and serve `sitemap.xml` and `robots.txt`.
- Emit `Organization` + `WebSite` + `LocalBusiness` JSON-LD from portal root.
- Implement OG + Twitter Card tags globally.
- Fix canonical URL + HTTPS redirect.
- Submit sitemap to Google Search Console.
- Fix the main site QB services page link (`/contact` → `qb.nexfortis.com`).

#### Phase 2 — Core Service Landing Pages (Week 3–5)
**Deliverable: 9 service-specific landing pages (Group A) + 4 problem-focused pages (Group B).**

Priority order within Phase 2:
1. `/landing/enterprise-to-premier-conversion` — highest commercial intent, highest search volume
2. `/landing/quickbooks-file-too-large` — high volume, symptom-first, leads to Super Condense
3. `/landing/quickbooks-running-slow` — high volume, leads to multiple services
4. `/landing/audit-trail-removal`
5. `/landing/super-condense`
6. `/landing/sage-50-to-quickbooks`
7. `/landing/accountedge-to-quickbooks`
8. `/landing/quickbooks-company-file-error`
9. `/landing/file-repair`
10. Remaining Group A + B pages

All pages in Phase 2 include full content, FAQ schema, and CTA wiring.

#### Phase 3 — Comparison + Educational Pages (Week 6–8)
**Deliverable: 7 remaining pages (Groups C and D).**

- 3 comparison pages (etech-alternative, conversion-canada, affordable-conversion)
- 4 educational pages (how-conversion-works, is-it-safe, desktop-end-of-life, support-subscription)
- Comprehensive internal linking audit across all 20 pages.
- Lighthouse CI integration to prevent future regressions.

#### Phase 4 — Iteration (Month 3+)
- Monitor Google Search Console for impressions, clicks, and indexing issues.
- Add additional pages based on Search Console query data (queries with impressions but no dedicated page).
- Refresh FAQ content as new customer questions emerge from support tickets.
- Consider CMS integration when content update frequency justifies the tooling cost.

---

## Appendix A: Keyword Research — Target Keyword Table

> **Volume categories** are estimates based on keyword research conventions. "High" = 1,000+ monthly searches; "Medium" = 200–999; "Low" = < 200. Search volumes are global English unless noted. Canadian variants tend to be 10–20% of US volume.

### A.1 High-Volume Keywords

| Keyword | Intent | Volume | Target Page |
|---|---|---|---|
| quickbooks file too large | Problem | High | `/landing/quickbooks-file-too-large` |
| quickbooks running slow | Problem | High | `/landing/quickbooks-running-slow` |
| quickbooks company file error | Problem | High | `/landing/quickbooks-company-file-error` |
| quickbooks desktop end of life | Research | High | `/landing/quickbooks-desktop-end-of-life` |
| convert quickbooks enterprise to premier | Commercial | High | `/landing/enterprise-to-premier-conversion` |
| quickbooks enterprise to pro conversion | Commercial | High | `/landing/enterprise-to-premier-conversion` |
| downgrade quickbooks enterprise | Commercial | High | `/landing/enterprise-to-premier-conversion` |

### A.2 Medium-Volume Keywords

| Keyword | Intent | Volume | Target Page |
|---|---|---|---|
| remove audit trail quickbooks | Commercial | Medium | `/landing/audit-trail-removal` |
| quickbooks audit trail removal service | Commercial | Medium | `/landing/audit-trail-removal` |
| quickbooks super condense | Commercial | Medium | `/landing/super-condense` |
| quickbooks condense canadian | Commercial | Medium | `/landing/super-condense` |
| quickbooks file repair service | Commercial | Medium | `/landing/file-repair` |
| sage 50 to quickbooks migration | Commercial | Medium | `/landing/sage-50-to-quickbooks` |
| simply accounting to quickbooks | Commercial | Medium | `/landing/sage-50-to-quickbooks` |
| quickbooks conversion canada | Commercial | Medium | `/landing/quickbooks-conversion-canada` |
| how does quickbooks enterprise conversion work | Research | Medium | `/landing/how-conversion-works` |
| quickbooks desktop to online migration | Research | Medium | `/landing/qbo-readiness` |
| quickbooks enterprise to premier canada | Commercial | Medium | `/landing/quickbooks-conversion-canada` |

### A.3 Low-to-Medium Volume Keywords

| Keyword | Intent | Volume | Target Page |
|---|---|---|---|
| accountedge to quickbooks | Commercial | Low–Med | `/landing/accountedge-to-quickbooks` |
| accountedge to quickbooks migration service | Commercial | Low–Med | `/landing/accountedge-to-quickbooks` |
| e-tech quickbooks alternative | Commercial | Low–Med | `/landing/etech-alternative` |
| e-tech quickbooks conversion competitor | Commercial | Low–Med | `/landing/etech-alternative` |
| is it safe to convert quickbooks files | Research | Low–Med | `/landing/is-it-safe` |
| quickbooks file conversion review | Research | Low–Med | `/landing/is-it-safe` |
| quickbooks multi currency problems | Problem | Low–Med | `/landing/quickbooks-multi-currency-problems` |
| quickbooks support subscription canada | Commercial | Low–Med | `/landing/quickbooks-support-subscription` |

### A.4 Low-Volume / Long-Tail Keywords

| Keyword | Intent | Volume | Target Page |
|---|---|---|---|
| remove multi currency from quickbooks | Commercial | Low | `/landing/multi-currency-removal` |
| quickbooks list reduction service | Commercial | Low | `/landing/list-reduction` |
| cheaper quickbooks enterprise conversion | Commercial | Low | `/landing/affordable-enterprise-conversion` |
| quickbooks enterprise downgrade cost canada | Commercial | Low | `/landing/affordable-enterprise-conversion` |
| quickbooks condense data canadian edition | Problem | Low | `/landing/super-condense` |
| quickbooks file too big to open | Problem | Low | `/landing/quickbooks-file-too-large` |
| cra period copy quickbooks | Commercial | Low | — (serve from catalog; consider future landing page) |
| quickbooks qbo readiness report | Commercial | Low | `/landing/qbo-readiness` |

### A.5 Competitive Keyword Gaps (E-Tech Owned, NexFortis Can Compete)

E-Tech's multi-domain strategy means they rank across several domains simultaneously. NexFortis concentrates authority on a single domain (`qb.nexfortis.com`), which is a disadvantage in volume but an advantage in domain authority consolidation. The most contestable terms are:

| E-Tech Page / Domain | NexFortis Competing Page | Differentiation Angle |
|---|---|---|
| `e-tech.ca` (enterprise conversion) | `/landing/enterprise-to-premier-conversion` | Transparent flat-fee CAD pricing; E-Tech is quote-required |
| `supercondense.com` | `/landing/super-condense` | Direct competitor — must match content depth |
| `quickbooksrepairpro.com` | `/landing/file-repair` | NexFortis can undercut on price ($149 CAD launch) |
| Various E-Tech blog posts | `/landing/how-conversion-works` | Educational content that establishes trust |

---

## Appendix B: Meta Tag Templates

The following templates are the minimum spec for each page type. Content editors must customise within character limits.

### Service Page Template

```
Title (50–60 chars):
[Service Name] | NexFortis QB Services

Example:
"QuickBooks Audit Trail Removal | NexFortis"  → 44 chars ✓

Description (150–160 chars):
Professional [service name] for QuickBooks Desktop. [Key differentiator]. From $[launch price] CAD. Secure upload, fast turnaround. Canadian files supported.

Example:
"Professional QuickBooks audit trail removal service. Reduce file size and protect privacy. From $50 CAD. Secure upload, fast turnaround. Canadian files supported." → 163 chars (trim by 3)
```

### Problem Page Template

```
Title:
[Problem Statement] — Fix It Fast | NexFortis

Description:
Is your QuickBooks [problem]? [One-sentence diagnosis]. NexFortis offers professional [relevant service] starting from $[price] CAD. Fast turnaround, Canadian files.
```

### Comparison Page Template

```
Title:
[Competitor] Alternative for QuickBooks | NexFortis

Description:
Looking for an alternative to [competitor]? NexFortis offers transparent flat-fee QuickBooks conversion from $[price] CAD. Canadian files supported. Compare services.
```

### Educational Page Template

```
Title:
[How-To or Question] | NexFortis QB Guide

Description:
[Answer the question in one sentence]. Learn how NexFortis's professional QuickBooks services work — secure, guaranteed, and priced in CAD for Canadian businesses.
```

---

## Appendix C: JSON-LD Examples

### Service Schema (excerpt — Enterprise Conversion page)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "QuickBooks Enterprise to Premier Conversion",
  "description": "Professional conversion of QuickBooks Enterprise company files to Premier or Pro editions. Works on Canadian, US, UK, and Australian QuickBooks files. Direct database access ensures 100% data integrity including payroll, templates, and linked transactions.",
  "provider": {
    "@type": "Organization",
    "name": "NexFortis",
    "url": "https://qb.nexfortis.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "204 Hill Farm Rd",
      "addressLocality": "Nobleton",
      "addressRegion": "ON",
      "postalCode": "L7B 0A1",
      "addressCountry": "CA"
    },
    "email": "support@nexfortis.com"
  },
  "areaServed": ["CA", "US", "GB", "AU"],
  "serviceType": "QuickBooks Data Conversion",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "CAD",
    "price": "75.00",
    "description": "Launch pricing (50% off). Standard rate $149 CAD.",
    "availability": "https://schema.org/InStock"
  }
}
```

### FAQPage Schema (excerpt)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does NexFortis support Canadian QuickBooks files?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. NexFortis fully supports Canadian QuickBooks Desktop files for all conversion and data services. All prices are in Canadian dollars (CAD) and we are PIPEDA-compliant."
      }
    },
    {
      "@type": "Question",
      "name": "Will I lose any data during the Enterprise to Premier conversion?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. NexFortis uses direct database access (not the QuickBooks SDK) to modify your company file in place. This preserves all linked transactions, payroll data, memorised transactions, and templates. We include a 100% data guarantee."
      }
    }
  ]
}
```

### BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://qb.nexfortis.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://qb.nexfortis.com/services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "QuickBooks Audit Trail Removal",
      "item": "https://qb.nexfortis.com/landing/audit-trail-removal"
    }
  ]
}
```

---

## Appendix D: `LandingPageLayout` Component Contract

The shared React layout component that wraps all 20 landing pages must accept the following props interface:

```typescript
interface LandingPageProps {
  // SEO / Head
  metaTitle: string;           // 50-60 chars
  metaDescription: string;     // 150-160 chars
  canonicalPath: string;       // e.g. "/landing/audit-trail-removal"
  ogImage: string;             // URL to 1200x630 image
  
  // Content
  h1: string;                  // Primary keyword-containing heading
  bodyContent: React.ReactNode; // MDX or JSX content block
  
  // Pricing
  productSlug: string;         // Links to products.json for price display
  ctaLabel: string;            // e.g. "Order Now — From $50 CAD"
  ctaHref: string;             // e.g. "/services/audit-trail-removal"
  
  // FAQ
  faqs: { question: string; answer: string }[]; // 4-6 items
  
  // Related
  relatedSlugs: string[];      // 2-4 landing page slugs
  
  // Schema
  schema: object | object[];   // JSON-LD to inject in <head>
  
  // Breadcrumbs
  breadcrumbs: { name: string; item: string }[]; // Excluding home (auto-prepended)
}
```

---

*PRD version 1.0 — NexFortis QB Portal. Next review: after Phase 1 deploy.*
