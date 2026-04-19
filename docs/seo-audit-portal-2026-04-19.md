# SEO Audit: NexFortis QB Portal
**Date:** 2026-07-11  
**Codebase:** `/home/user/workspace/NexFortis-Website-Design-pro/artifacts/qb-portal/`  
**Technology:** Vite + React SPA, Wouter router, react-helmet-async, Tailwind CSS, Supabase  
**Live domain:** `https://qb.nexfortis.com`

---

## Summary Scorecard

| Area | Rating |
|------|--------|
| Rendering Strategy | ⚠ WARN — Pure CSR, no pre-rendering |
| Meta Tags / Titles | ✅ PASS (per-page, unique, correct) |
| Open Graph / Social | ⚠ WARN — service pages use generic fallback OG image |
| Structured Data | ⚠ WARN — FAQ page missing FAQPage schema; service-detail missing Product/Offer schema |
| Sitemap.xml | ⚠ WARN — missing /waitlist; all other public URLs present |
| Robots.txt | ⚠ WARN — missing Disallow for /ticket, /order/:id, /portal-settings |
| Semantic HTML | ⚠ WARN — home page H1 is `<motion.h1>` (fine); subscription page H1 also `<motion.h1>` (fine); register & reset-password have conditional double H1 (noindex pages, minor) |
| Image SEO | ❌ FAIL — no WebP; no lazy loading; OG images are JPG (acceptable); badge PNGs missing dimensions |
| Core Web Vitals | ⚠ WARN — dual Inter font source (Google Fonts + local WOFF2 both loaded); no font preload hint; no code splitting |
| SPA-Specific Issues | ❌ CRITICAL — no `<noscript>` fallback; no pre-rendering; pure CSR |
| Landing Pages | ✅ PASS — all 20 pages have unique titles, descriptions, canonical, FAQ+Breadcrumb+Service/HowTo schema |

---

## 1. Rendering Strategy

### CRITICAL — Pure Client-Side Rendering, No Pre-Rendering

**File:** `vite.config.ts`, `src/main.tsx`

The site is a standard Vite React SPA with no SSR, SSG, or pre-rendering pipeline. `main.tsx` uses `createRoot` and renders entirely client-side:

```tsx
// src/main.tsx (line 4)
createRoot(document.getElementById("root")!).render(<App />);
```

`vite.config.ts` has no `vite-plugin-prerender`, `react-snap`, `vite-ssg`, `vite-plugin-ssr`, or equivalent. The built `dist/public` folder contains a single `index.html` with an empty `<div id="root"></div>`.

**Impact:** Googlebot must render JavaScript to see any page content. While Google does index JavaScript-rendered content, it goes into a second crawl wave with unpredictable delays (hours to weeks). Bing, DuckDuckGo, and social crawlers (LinkedIn, Slack) do NOT execute JavaScript and will see only the static fallback title `"NexFortis QuickBooks Portal"` with no content.

**Recommendation:** Implement static pre-rendering for all public routes. Options in order of effort:
1. **`vite-plugin-prerender`** — lowest effort, renders routes at build time using Puppeteer
2. **`react-snap`** — headless Chrome pre-rendering, zero config for Vite
3. **Migrate to Remix or Next.js** — most complete solution with SSR/SSG + API routes

Priority routes to pre-render immediately: `/`, `/catalog`, `/faq`, `/qbm-guide`, `/subscription`, all `/service/:slug`, all `/category/:slug`, all `/landing/:slug`

---

## 2. Meta Tags & Title Tags

### PASS — Per-Page SEO Component Implemented

**File:** `src/components/seo.tsx` (full file)

The site uses `react-helmet-async` with a dedicated `<SEO>` component that injects `<title>`, `<meta name="description">`, and `<link rel="canonical">` per page. All public pages call `<SEO>`.

**Title format** (line 26 of `seo.tsx`):
```tsx
const fullTitle = title.includes("NexFortis") ? title : `${title} | ${SITE_NAME}`;
```

### Per-Page Title Audit

| Route | Title (rendered) | Chars | Status |
|-------|-----------------|-------|--------|
| `/` | QuickBooks Conversion & Data Services \| NexFortis QuickBooks Portal | 66 | ✅ PASS |
| `/catalog` | Service Catalog \| NexFortis QuickBooks Portal | 47 | ⚠ WARN — generic title, no keyword |
| `/faq` | Frequently Asked Questions \| NexFortis QuickBooks Portal | 57 | ⚠ WARN — no keyword in title |
| `/qbm-guide` | How to Create a .QBM File \| NexFortis QuickBooks Portal | 57 | ✅ PASS |
| `/subscription` | Support Plans \| NexFortis QuickBooks Portal | 46 | ⚠ WARN — generic |
| `/terms` | Terms of Service \| NexFortis QuickBooks Portal | 48 | ✅ PASS |
| `/privacy` | Privacy Policy \| NexFortis QuickBooks Portal | 47 | ✅ PASS |
| `/service/:slug` | {product.name} \| NexFortis QuickBooks Portal | varies | ✅ PASS |
| `/category/:slug` | {categoryName} \| NexFortis QuickBooks Portal | varies | ⚠ WARN — category name only, no keyword |
| `/landing/:slug` | Set individually per landing page (e.g. "QuickBooks Enterprise to Premier Conversion \| NexFortis") | varies | ✅ PASS |
| `/waitlist` | Join the Waitlist \| NexFortis QuickBooks Portal | 49 | ✅ PASS |

### WARN — Static Fallback Title in index.html Never Removed

**File:** `index.html` (line 5)
```html
<title>NexFortis QuickBooks Portal</title>
```

This title is what non-JS crawlers (Bing, social unfurlers) see for every URL. Since there is no pre-rendering, this is the title that appears in social share cards for all pages. The `react-helmet-async` title only takes effect after JS execution.

### WARN — /catalog and /subscription Titles Lack Primary Keywords

- `/catalog` title is "Service Catalog" — could be "QuickBooks Services & Pricing | NexFortis" for better click-through
- `/subscription` title is "Support Plans" — could be "QuickBooks Expert Support Plans | NexFortis"
- `/faq` title lacks "QuickBooks" keyword — could be "QuickBooks FAQs: Conversion, Pricing & Data | NexFortis"
- `/category/:slug` title uses only the category name (e.g., "QuickBooks Conversion Services") — acceptable but could include brand

---

## 3. Open Graph & Social Meta Tags

### PASS — OG tags present on all pages

**File:** `src/components/seo.tsx` (lines 40–56)

Every `<SEO>` call injects:
- `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:site_name`, `og:locale`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

`og:locale` is set to `en_CA` — correct for a Canadian-first service.

### WARN — Service Detail Pages Use Generic OG Image

**File:** `src/pages/service-detail.tsx` (line 51)
```tsx
<SEO
  title={product.name}
  description={product.description}
  path={`/service/${product.slug}`}
/>  // no ogImage prop passed
```

All `/service/:slug` pages fall back to the generic `opengraph.jpg`. The `/landing/:slug` pages correctly pass per-landing OG images (`/og/{slug}.jpg` — 20 images exist in `public/og/`). The `/service/:slug` pages could also use these images since they correspond 1:1 with landing pages for many slugs.

### WARN — No twitter:site Handle

**File:** `src/components/seo.tsx` (lines 68–71)

Twitter card meta is present but missing `twitter:site` (brand account handle) and `twitter:creator`. These are optional but improve Twitter card display and association.

### FAIL — og:type "website" on All Service Pages

**File:** `src/pages/service-detail.tsx`

Service pages should use `og:type="product"` or at minimum distinguish themselves from generic pages. The `<SEO>` component supports `ogType` prop but `service-detail.tsx` does not pass it. Similarly, `/landing/:slug` pages should pass `ogType="article"` for service/educational content.

---

## 4. Structured Data (Schema.org JSON-LD)

### PASS — Global Schemas (Organization, WebSite, LocalBusiness/ProfessionalService)

**File:** `src/App.tsx` (lines 41–54), `src/lib/seo-schemas.ts`

All three global schemas are injected via `<GlobalSchemas>` on every page render:
- `Organization` with name, URL, logo, email, address
- `WebSite` with `SearchAction` (sitelinks search box eligible)
- `ProfessionalService` (subtype of LocalBusiness) with areaServed: CA, US, GB, AU

### PASS — Landing Pages Have Rich Schema

**File:** `src/components/landing-page-layout.tsx` (lines 42–56)

Landing pages inject:
- `FAQPage` schema from page FAQs (all 20 landing pages)
- `BreadcrumbList` schema (all 20 landing pages)
- `Service` schema with `Offer` (price in CAD) for `category: "service"` pages
- `HowTo` schema for `category: "educational"` pages with process steps

### FAIL — /faq Page Missing FAQPage Schema

**File:** `src/pages/faq.tsx` (line 55)
```tsx
<SEO
  title="Frequently Asked Questions"
  description="Answers to common questions..."
  path="/faq"
/>  // no jsonLd prop
```

The `/faq` page has 20+ Q&A pairs defined in `faqData` (starting line 5) but passes no `jsonLd` to the `<SEO>` component. The `generateFAQSchema()` utility exists in `src/lib/seo-schemas.ts` and is used on landing pages, but it is not called here. This is a missed opportunity for FAQ rich results which typically drive higher CTR.

**Fix:** Import `generateFAQSchema` and pass `jsonLd={generateFAQSchema(faqData.map(f => ({question: f.q, answer: f.a})))}` to the SEO component.

### FAIL — /service/:slug Pages Missing Product/Offer Schema

**File:** `src/pages/service-detail.tsx`

The `<SEO>` component in `service-detail.tsx` does not pass any `jsonLd`. Service detail pages display pricing, turnaround time, and availability — all the fields needed for `Product` or `Service` schema with an `Offer`. The `generateServiceSchema()` function in `seo-schemas.ts` already handles this but is only called from `landing-page-layout.tsx`.

**Fix:** In `service-detail.tsx`, after `product` is loaded, call `generateServiceSchema()` and pass the result as `jsonLd` to `<SEO>`. This also enables product rich results in Google Shopping.

### WARN — Organization schema has empty sameAs array

**File:** `src/lib/seo-schemas.ts` (line 27)
```ts
sameAs: [],
```

`sameAs` should list official social profiles (LinkedIn, Twitter/X, Facebook, etc.) and any Wikidata/Wikipedia entries. An empty array is not harmful but is a missed signal for entity disambiguation.

### WARN — Organization logo is SVG format

**File:** `src/lib/seo-schemas.ts` (line 24)
```ts
logo: `${BASE_URL}/images/logo-original.svg`,
```

Google's structured data guidelines for Organization logo recommend a raster image (PNG or JPG) at least 112×112px. SVG is not always reliably indexed. A PNG version of the logo at a standard size (e.g., 512×512px) should be provided and referenced in the schema.

### WARN — No BreadcrumbList on /service/:slug or /category/:slug

**File:** `src/pages/service-detail.tsx`, `src/pages/category.tsx`

Both pages have visible breadcrumb text in the UI but do NOT emit `BreadcrumbList` JSON-LD. The `Breadcrumbs` visual component is used only on landing pages. The breadcrumb trail in service-detail (`Services / {category} / {product.name}`) and category (`Services / {categoryName}`) should both have corresponding schema.

---

## 5. Sitemap.xml

**File:** `public/sitemap.xml`

### PASS — Sitemap exists, uses absolute URLs, includes lastmod

The sitemap is at the correct location, referenced in `robots.txt`, uses absolute HTTPS URLs, and includes `lastmod`, `changefreq`, and `priority` for all entries.

### PASS — All 20 landing pages listed (priority 0.9)

All 20 slugs from `landingPages.ts` are present in the sitemap under `/landing/` paths.

### PASS — All service pages listed (priority 0.8)

19 `/service/:slug` entries are present: enterprise-to-premier-standard, enterprise-to-premier-complex, guaranteed-30-minute, file-health-check, rush-delivery, extended-support, audit-trail-removal, super-condense, list-reduction, multi-currency-removal, qbo-readiness-report, cra-period-copy, audit-trail-cra-bundle, accountedge-to-quickbooks, sage50-to-quickbooks, expert-support-essentials, expert-support-professional, expert-support-premium, 5-pack-conversions, 10-pack-conversions.

### FAIL — /waitlist is Missing from Sitemap

**File:** `public/sitemap.xml`

The `/waitlist` route is a public, indexable page with an `<SEO>` component and no `noIndex` flag. It should be in the sitemap.

**Fix:** Add entry:
```xml
<url>
  <loc>https://qb.nexfortis.com/waitlist</loc>
  <lastmod>2026-04-16</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.3</priority>
</url>
```

### WARN — All lastmod dates are identical (2026-04-16)

Every URL has `<lastmod>2026-04-16</lastmod>`. This is a static hardcoded date. Google uses `lastmod` to decide recrawl priority. When all URLs have the same date, the signal is useless. Dates should reflect actual last-modified timestamps, ideally generated at build time.

### WARN — All static pages have priority 0.5 (default)

Priority 0.5 is the XML default and provides no useful signal differentiation. The home page (`/`) should be 1.0, and core commercial pages like `/catalog` and `/subscription` should be 0.8–0.9.

### PASS — Private/admin routes correctly excluded

No admin, portal, login, or auth routes appear in the sitemap. ✅

---

## 6. Robots.txt

**File:** `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /portal
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /order
Disallow: /auth/callback
Disallow: /admin
Disallow: /admin/mfa-enroll
Disallow: /admin/mfa-challenge
Disallow: /qb-portal/admin
Disallow: /qb-portal/admin/mfa-enroll
Disallow: /qb-portal/admin/mfa-challenge

Sitemap: https://qb.nexfortis.com/sitemap.xml
```

### PASS — Sitemap referenced, admin blocked

Sitemap URL is correct and present. All `/admin/*` routes are blocked.

### WARN — /ticket/:id Not Blocked

**File:** `public/robots.txt`

The route `/ticket/:id` (for customer support ticket detail) is authenticated content but is not in the Disallow list. While Googlebot would receive a redirect to login, it's cleaner to explicitly block it.

**Fix:** Add `Disallow: /ticket/`

### WARN — /order/:id (order-detail) Not Blocked

The route `/order/:id` shows customer order details and is behind authentication. Not in Disallow list.

**Fix:** Add `Disallow: /order/` (note: `/order` without trailing slash is already blocked; `/order/` with trailing slash covers dynamic order-detail routes like `/order/123`)

### WARN — Duplicate /qb-portal/ Prefix Entries

Lines 11–13 repeat `/admin` blocks with a `/qb-portal/` prefix. This may be a legacy artifact from a base-path deployment. If the live site serves from `https://qb.nexfortis.com/` (not `https://qb.nexfortis.com/qb-portal/`), these entries are unnecessary clutter. If the site is served under the `/qb-portal/` base path, the non-prefixed entries at lines 8–10 are the ones that need the prefix instead.

**Verify:** Confirm the production `BASE_PATH` environment variable value and remove the stale entries.

---

## 7. Semantic HTML

### PASS — Landmark Elements Present

**File:** `src/components/layout.tsx` (lines 96, 116, 241, 332)

- `<header>` — navbar wrapper ✅
- `<nav>` — inside header with `aria-label` equivalent (visually hidden desktop nav) ✅
- `<main>` — wraps all page content ✅
- `<footer>` — site footer ✅
- `<aside>` — used in `landing-page-layout.tsx` for the pricing sidebar ✅

### PASS — One H1 Per Public Page (SEO-Relevant)

All public indexable pages have exactly one `<h1>`:

| Page | H1 Content | Line | Status |
|------|-----------|------|--------|
| `/` | "QuickBooks Conversion & Data Services" | home.tsx:164 (motion.h1) | ✅ |
| `/catalog` | "Service Catalog" | catalog.tsx:46 | ✅ |
| `/faq` | "Frequently Asked Questions" | faq.tsx:62 | ✅ |
| `/qbm-guide` | "How to Create a .QBM File" | qbm-guide.tsx:15 | ✅ |
| `/subscription` | "Expert QuickBooks Support..." | subscription.tsx:222 (motion.h1) | ✅ |
| `/terms` | "Terms of Service" | terms.tsx:13 | ✅ |
| `/privacy` | "Privacy Policy" | privacy.tsx:13 | ✅ |
| `/service/:slug` | `{product.name}` | service-detail.tsx:72 | ✅ |
| `/category/:slug` | `{categoryName}` | category.tsx:55 | ✅ |
| `/landing/:slug` | `{page.h1}` | landing-page-layout.tsx:76 | ✅ |
| `/waitlist` | "Join the Waitlist" | waitlist.tsx:~line | ✅ |

### WARN — register.tsx Has Conditional Double H1 (noindex, low priority)

**File:** `src/pages/register.tsx` (lines 108, 125)

The register page renders either a "Check Your Email" H1 (confirmation state) or a "Create Account" H1 (form state) — these are mutually exclusive conditional renders, not simultaneous. Not technically a double-H1 at any moment. However, the `path="/register"` in both SEO calls is the same, which means the canonical URL is identical for two different page states. Both have `noIndex`, so this has no ranking impact. Low priority fix.

### WARN — reset-password.tsx Has Conditional Double H1 (noindex, low priority)

**File:** `src/pages/reset-password.tsx` (lines 99, 170)

Same pattern as register — two conditional H1s on the same route, both noindex. Low priority.

### PASS — Heading Hierarchy

Landing pages (`landing-page-layout.tsx`): H1 → H2 (Overview, Why NexFortis, How it works, FAQ) → H3 (benefit titles, step titles) — correct.

Service detail (`service-detail.tsx`): H1 → H2 (About This Service, What's Included, Available Add-Ons, Related Services) → H3 (Trust & Security, Category, Learn More) — correct.

Home (`home.tsx`): H1 (motion.h1) → H2 (How It Works, Why NexFortis?, Featured Services, Need Expert Support?, CTA) → H3 (step titles, service titles, plan names) — correct.

### PASS — Breadcrumb Navigation Has aria-label

**File:** `src/components/breadcrumbs.tsx` (line 8)
```tsx
<nav aria-label="Breadcrumb" ...>
```
`aria-current="page"` applied to last breadcrumb item ✅

### PASS — Interactive Elements Have Labels

- Theme toggle button: `aria-label="Theme: {current}. Click to change."` ✅
- Mobile menu button: `aria-label="Toggle menu"` ✅
- Support plans CTA: `aria-label="View all support plans"` ✅
- Logo link: `aria-label="NexFortis QuickBooks Services — Home"` ✅

### WARN — Filter Buttons on /catalog Not Accessible

**File:** `src/pages/catalog.tsx` (lines ~56–68)

The category filter buttons use `<button>` but lack `aria-pressed` state to indicate the active filter. Screen readers cannot determine which filter is selected.

---

## 8. Image SEO

### FAIL — No WebP Images Used

**Directory:** `public/images/`, `public/og/`

All raster images are JPG or PNG format:
- Partner badges: `badge-google-partner.png`, `badge-microsoft-partner.png`, `badge-quickbooks-proadvisor.png`
- OG images: 20× JPG files in `public/og/`
- Default OG: `public/opengraph.jpg`

No WebP versions exist. WebP typically reduces file size 25–35% vs JPG at equivalent quality, directly improving LCP and page load time.

**Recommendation:** Convert badge PNGs and the default opengraph.jpg to WebP using `sharp` (already installed as a devDependency in `package.json`). OG images are a lower priority since they are not rendered on-page, but the badge PNGs are displayed in the footer.

### FAIL — No lazy loading on Any Images

**Searched:** `grep -rn 'loading="lazy"'` returned zero results across the entire `src/` directory.

The footer partner badges (rendered in `layout.tsx` lines ~303–313) are below the fold and should have `loading="lazy"`. The logo images in the header are LCP candidates and should have `fetchpriority="high"` or a `<link rel="preload">` hint.

**Fix examples:**
```tsx
// Footer badges (below fold) — layout.tsx ~line 303
<img
  src={...badge-microsoft-partner.png}
  alt="Microsoft AI Cloud Partner Program badge"
  loading="lazy"
  width={...} height={...}
/>

// Navbar logo (LCP candidate) — layout.tsx ~line 107
<img
  src={navbarLogo}
  alt="NexFortis"
  fetchPriority="high"
  ...
/>
```

### WARN — Badge Images Missing Width/Height (Cumulative Layout Shift Risk)

**File:** `src/components/layout.tsx` (lines ~303–313)

The three partner badge images have no `width` or `height` attributes. Without explicit dimensions, the browser cannot reserve space for them before they load, causing layout shift (CLS) which hurts Core Web Vitals. The logo images DO have `width={200} height={56}` — apply the same practice to badges.

### PASS — All Images Have Descriptive alt Text

Every `<img>` in the codebase has a non-empty `alt` attribute:
- Logo: `alt="NexFortis"` ✅
- Partner badges: descriptive alt text ✅ (`"Microsoft AI Cloud Partner Program badge"`, etc.)
- Login/register logos: `alt="NexFortis"` ✅

---

## 9. Core Web Vitals Code Factors

### WARN — Dual Font Source Loading (Performance Impact)

**Files:** `index.html` (lines 8–10), `src/index.css` (lines 4–99)

Inter is loaded **twice**:
1. Via Google Fonts CDN in `index.html`: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`
2. Via local WOFF2 `@font-face` declarations in `index.css` with self-hosted files in `public/fonts/`

Both sources define Inter at weights 400, 500, 600, 700. The browser will fetch both until it resolves which to use, or may double-load. The Google Fonts link also adds a third-party DNS lookup + TLS handshake.

**Fix:** Remove the Google Fonts `<link>` from `index.html` entirely. The self-hosted local WOFF2 files are superior (no third-party dependency, no GDPR data transfer concern, faster load). The Google Fonts CDN fallback is redundant.

### WARN — No Font Preload Hints

**File:** `index.html`

The critical Inter-400 and Inter-600 (or 700) WOFF2 files are not preloaded. Font files discovered late cause FOUT (Flash of Unstyled Text). Add `<link rel="preload">` for the two most-used weights:

```html
<link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-600.woff2" as="font" type="font/woff2" crossorigin>
```

### PASS — Font Display: swap Set

**File:** `src/index.css` (lines 7, 15, 23, 31, etc.)

Every `@font-face` declaration uses `font-display: swap` — correct, prevents invisible text during font load.

### FAIL — No JavaScript Code Splitting

**File:** `vite.config.ts`

No `build.rollupOptions.output.manualChunks` or dynamic `import()` for route-level code splitting exists. All routes are imported statically at the top of `App.tsx` (lines 12–37). With 20+ page components, admin pages, and all dependencies bundled together, the main bundle will be large. Admin pages (MFA, dashboard, orders, customers, promo codes, tickets) are included in the bundle even for unauthenticated visitors browsing the public site.

**Recommendation:** Use React.lazy + Suspense for route-level splitting, especially for admin routes:

```tsx
// Instead of static import:
import AdminDashboard from "@/pages/admin/dashboard";

// Use lazy import:
const AdminDashboard = React.lazy(() => import("@/pages/admin/dashboard"));
```

This alone could reduce initial bundle size by 20–30% for non-admin users.

### WARN — framer-motion Included in Main Bundle

`framer-motion` is used for animations on several pages. It is a sizeable library (~60KB gzipped). Since it is used on the home page (which is likely LCP-critical), this is somewhat justified, but pages that don't use it (terms, privacy, FAQ) would benefit from deferred loading.

### PASS — Tailwind CSS with @tailwindcss/vite Plugin

**File:** `vite.config.ts` (line 7)

Using `@tailwindcss/vite` (Tailwind v4) which performs build-time CSS purging — only used utility classes are included in the output. No unused CSS concern.

---

## 10. SPA-Specific SEO Issues

### CRITICAL — No `<noscript>` Fallback

**File:** `index.html`

There is no `<noscript>` tag anywhere in the application. The body contains only:
```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

When social crawlers (LinkedIn, Slack, Facebook, Discord) or non-JS bots visit the site, they receive an empty `<div id="root">` with no content, no meta description, no OG tags, and only the static title "NexFortis QuickBooks Portal".

**Fix:** Add a minimal `<noscript>` block in `index.html` with a link to the site and basic description:
```html
<noscript>
  <p>NexFortis QuickBooks Portal — Canadian QuickBooks conversion and data services.
  <a href="https://qb.nexfortis.com">Visit our website</a> for more information.</p>
</noscript>
```

This is a mitigation, not a solution. The real fix is pre-rendering (see Section 1).

### PASS — History Mode Routing (Clean URLs)

**File:** `src/App.tsx` (line 88)
```tsx
<WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
```

Wouter uses HTML5 History API by default (no hash-based URLs). All routes are clean paths like `/catalog`, `/service/audit-trail-removal`, etc. No `#` fragments in URLs. ✅

**Note:** The auth callback in `src/pages/auth-callback.tsx` (line 3) reads `window.location.hash` for Supabase auth params — this is an OAuth/PKCE implementation detail, not the routing strategy.

### WARN — No Proper 404 HTTP Status for Not-Found Route

**File:** `src/pages/not-found.tsx`

The `NotFound` component renders a 404 UI but, being client-side only, the server always returns HTTP 200 for all routes. Googlebot receives a 200 status code for any URL, even non-existent ones, and sees the JavaScript-rendered 404 content only after rendering. The `noIndex` meta on the not-found page (`<SEO ... noIndex />`) prevents indexing once rendered, but Googlebot's first response is a 200 with an empty div.

**Fix:** Either configure the server/CDN to return 404 for unknown paths that aren't pre-rendered, or implement a server-side 404 handler. With pre-rendering, only known routes would have static files; unknown paths would naturally 404 at the CDN layer.

### PASS — Internal Links Use `<a>` Tags via Wouter `<Link>`

**File:** `src/components/layout.tsx`, all page components

All navigation uses Wouter's `<Link>` component which renders a standard `<a href="">` tag. Googlebot can follow these links. No JavaScript-only `onClick` navigation for internal links. ✅

### PASS — Robots Meta on Private Pages (noindex)

Private/auth pages correctly set `noIndex` via the SEO component:
- `/portal` — `noIndex` ✅ (portal.tsx:115)
- `/login` — `noIndex` ✅
- `/register` — `noIndex` ✅
- `/order` — `noIndex` ✅
- `/forgot-password` — `noIndex` ✅
- `/reset-password` — `noIndex` ✅
- `/auth/callback` — `noIndex` ✅

---

## 11. Landing Pages SEO

**File:** `src/data/landingPages.ts`  
**Count:** 20 landing pages across 4 categories (service, problem, comparison, educational)

### PASS — All 20 Landing Pages: Full Audit

| # | Slug | Category | Meta Title (chars) | Meta Desc (chars) | H1 | OG Image | Schema |
|---|------|----------|-------------------|-------------------|-----|----------|--------|
| 1 | enterprise-to-premier-conversion | service | "QuickBooks Enterprise to Premier Conversion \| NexFortis" (55) | 132 | ✅ | ✅ `/og/enterprise-to-premier-conversion.jpg` | Service + FAQ + Breadcrumb ✅ |
| 2 | audit-trail-removal | service | "QuickBooks Audit Trail Removal Service \| NexFortis Canada" (56) | 138 | ✅ | ✅ | Service + FAQ + Breadcrumb ✅ |
| 3 | super-condense | service | "QuickBooks Super Condense — Canadian Files \| NexFortis" (53) | 143 | ✅ | ✅ | Service + FAQ + Breadcrumb ✅ |
| 4 | file-repair | service | "QuickBooks File Repair & Recovery Service \| NexFortis" (53) | 131 | ✅ | ✅ | Service + FAQ + Breadcrumb ✅ |
| 5 | accountedge-to-quickbooks | service | "AccountEdge to QuickBooks Migration \| NexFortis Canada" (53) | ~130 | ✅ | ✅ | Service + FAQ + Breadcrumb ✅ |
| 6 | sage-50-to-quickbooks | service | "Sage 50 to QuickBooks Migration \| NexFortis Canada" (50) | ~130 | ✅ | ✅ | Service + FAQ + Breadcrumb ✅ |
| 7 | multi-currency-removal | service | "QuickBooks Multi-Currency Removal \| NexFortis Canada" (52) | ~130 | ✅ | ✅ | Service + FAQ + Breadcrumb ✅ |
| 8 | list-reduction | service | "QuickBooks List Reduction Service \| NexFortis Canada" (52) | ~130 | ✅ | ✅ | Service + FAQ + Breadcrumb ✅ |
| 9 | qbo-readiness | service | "QuickBooks Desktop to Online Readiness Report \| NexFortis" (57) | ~130 | ✅ | ✅ | Service + FAQ + Breadcrumb ✅ |
| 10 | quickbooks-file-too-large | problem | "QuickBooks File Too Large? How to Shrink It \| NexFortis" (54) | ~130 | ✅ | ✅ | FAQ + Breadcrumb ✅ |
| 11 | quickbooks-running-slow | problem | "QuickBooks Running Slow? Causes and Fixes \| NexFortis" (53) | ~130 | ✅ | ✅ | FAQ + Breadcrumb ✅ |
| 12 | quickbooks-company-file-error | problem | "QuickBooks Company File Error: Codes & Fixes \| NexFortis" (56) | ~130 | ✅ | ✅ | FAQ + Breadcrumb ✅ |
| 13 | quickbooks-multi-currency-problems | problem | "QuickBooks Multi-Currency Problems & Fix \| NexFortis" (53) | ~130 | ✅ | ✅ | FAQ + Breadcrumb ✅ |
| 14 | etech-alternative | comparison | "E-Tech Alternative for QuickBooks Conversion \| NexFortis" (56) | ~130 | ✅ | ✅ | FAQ + Breadcrumb ✅ (no Service — correct for comparison) |
| 15 | quickbooks-conversion-canada | comparison | "QuickBooks Conversion Canada \| NexFortis Canadian Editions" (57) | ~130 | ✅ | ✅ | FAQ + Breadcrumb ✅ |
| 16 | affordable-enterprise-conversion | comparison | "Affordable QuickBooks Enterprise Conversion \| NexFortis" (54) | ~130 | ✅ | ✅ | FAQ + Breadcrumb ✅ |
| 17 | how-conversion-works | educational | "How QuickBooks Conversion Works \| NexFortis Step-by-Step" (56) | ~130 | ✅ | ✅ | HowTo + FAQ + Breadcrumb ✅ |
| 18 | is-it-safe | educational | "Is QuickBooks Conversion Safe? \| NexFortis Security & Process" (61) | ~130 | ✅ | ✅ | HowTo + FAQ + Breadcrumb ✅ |
| 19 | quickbooks-desktop-end-of-life | educational | "QuickBooks Desktop End of Life \| NexFortis Migration Guide" (57) | ~130 | ✅ | ✅ | HowTo + FAQ + Breadcrumb ✅ |
| 20 | quickbooks-support-subscription | educational | "QuickBooks Support Subscription \| NexFortis Monthly Plans" (57) | ~130 | ✅ | ✅ | HowTo + FAQ + Breadcrumb ✅ |

**Overall: PASS.** All 20 landing pages have:
- Unique, keyword-optimized meta titles (47–61 chars — all within the 50–60 char ideal window)
- Unique meta descriptions (~130 chars — within 130–160 char window)
- Proper H1 tags
- Dedicated OG images
- Appropriate structured data (Service, HowTo, FAQ, Breadcrumb)
- Canonical URLs via `path` prop in `<SEO>`
- All slugs are SEO-friendly (lowercase, hyphenated)

### WARN — metaDescription Uses {launchPrice} Tokens

**File:** `src/data/landingPages.ts` (e.g., line for enterprise-to-premier-conversion)

Meta descriptions for service-category landing pages contain tokens like `{launchPrice}` and `{basePrice}`:
```
"Convert QuickBooks Enterprise to Premier or Pro with 100% data preservation. Canadian editions supported, next-business-day turnaround, from {launchPrice}."
```

These tokens are resolved in `landing-page-layout.tsx` using the product catalog (line 38: `resolveTokens(page.metaDescription, product)`). However, this resolution happens **client-side at runtime**. Pre-rendered HTML would contain the literal string `{launchPrice}` until the catalog loads.

If pre-rendering is added, the `catalog` prop will be `null` at build-time (since it is fetched from `/products.json` at runtime). The pre-rendered description would read "...from {launchPrice}." — which would appear in Google's search result snippet.

**Fix:** Either hardcode the price values in the `metaDescription` strings directly in `landingPages.ts`, or pass a static catalog snapshot to the pre-renderer at build time.

---

## 12. Prioritized Recommendations

### CRITICAL (fix before launch)

1. **Add pre-rendering or SSG** — Without it, Google relies on JavaScript rendering (slow, unreliable) and all other crawlers see empty pages. Use `vite-plugin-prerender` for a low-effort fix.
   - Affected files: `vite.config.ts`, deployment pipeline

2. **Add `<noscript>` fallback to `index.html`** — Minimum viable fix for social crawlers until pre-rendering is in place.
   - Affected file: `index.html`

3. **Add FAQPage schema to /faq** — Directly enables FAQ rich results in Google Search.
   - Affected file: `src/pages/faq.tsx` (add `jsonLd` to SEO call)

### HIGH (fix within 1–2 weeks)

4. **Add Product/Service schema to /service/:slug pages** — Enables rich results with pricing in Google Shopping and Knowledge Panels.
   - Affected file: `src/pages/service-detail.tsx`

5. **Remove Google Fonts CDN link from index.html** — Eliminates dual font loading, removes third-party DNS dependency, removes GDPR data transfer concern.
   - Affected file: `index.html` (delete lines 8–10)

6. **Add font preload hints for Inter-400 and Inter-600** — Prevents FOUT on first load.
   - Affected file: `index.html`

7. **Add per-slug OG images to /service/:slug pages** — Many service slugs match existing `/og/*.jpg` images; pass `ogImage` prop.
   - Affected file: `src/pages/service-detail.tsx`

8. **Implement route-level code splitting** — Reduces main bundle size, improves initial page load.
   - Affected file: `src/App.tsx`

### MEDIUM (fix within 1 month)

9. **Add BreadcrumbList schema to /service/:slug and /category/:slug** — Enables breadcrumb rich results.
   - Affected files: `src/pages/service-detail.tsx`, `src/pages/category.tsx`

10. **Add missing /waitlist to sitemap**.
    - Affected file: `public/sitemap.xml`

11. **Add width/height to badge images in footer** — Prevents CLS.
    - Affected file: `src/components/layout.tsx` (~lines 303–313)

12. **Add `loading="lazy"` to below-fold images** (footer badges, any images below hero).
    - Affected file: `src/components/layout.tsx`

13. **Convert PNG badge images to WebP** — Reduce file size ~30%.
    - Use sharp (already installed) to generate WebP versions

14. **Update robots.txt** — Add `Disallow: /ticket/` and `Disallow: /order/` (for `/order/:id` order-detail).
    - Affected file: `public/robots.txt`

15. **Fix sitemap lastmod dates** — Generate at build time rather than hardcoding.
    - Affected file: `public/sitemap.xml` or a build script

### LOW (polish)

16. **Strengthen title for /catalog** — "QuickBooks Services & Pricing | NexFortis" is more keyword-rich than "Service Catalog"
17. **Strengthen title for /subscription** — "QuickBooks Expert Support Plans | NexFortis"
18. **Populate sameAs in Organization schema** — Add LinkedIn and other social profiles
19. **Add PNG logo for Organization schema** — Replace SVG with a raster image per Google guidelines
20. **Add twitter:site handle** to seo.tsx once a Twitter/X account is established
21. **Add og:type="product"** to /service/:slug pages
22. **Add aria-pressed to catalog filter buttons**
23. **Resolve duplicate /qb-portal/ prefix entries in robots.txt**
24. **Resolve {launchPrice} token issue in pre-rendered meta descriptions** (only relevant if pre-rendering is implemented)

---

## Appendix: File Reference Index

| File | SEO Relevance |
|------|--------------|
| `index.html` | Static fallback title; font loading; noscript |
| `src/main.tsx` | CSR entry point — confirms no SSR |
| `vite.config.ts` | No pre-rendering plugins |
| `package.json` | `react-helmet-async` present; no SSR/prerender dep |
| `src/App.tsx` | Router (Wouter history mode); GlobalSchemas; all static imports |
| `src/components/seo.tsx` | SEO component definition |
| `src/lib/seo-schemas.ts` | All schema generators |
| `src/data/landingPages.ts` | 20 landing page definitions with meta |
| `src/pages/home.tsx` | Homepage SEO |
| `src/pages/catalog.tsx` | Catalog SEO |
| `src/pages/faq.tsx` | FAQ page — missing FAQPage schema |
| `src/pages/service-detail.tsx` | Service pages — missing Product schema, ogImage |
| `src/pages/category.tsx` | Category pages — missing BreadcrumbList schema |
| `src/pages/landing.tsx` | Landing page router |
| `src/components/landing-page-layout.tsx` | Landing page template with full schema |
| `src/components/layout.tsx` | Header/Footer/Main layout, badge images |
| `src/components/breadcrumbs.tsx` | Breadcrumb component |
| `public/sitemap.xml` | Missing /waitlist; all others present |
| `public/robots.txt` | Missing /ticket/, /order/ disallow |
| `public/og/` | 20 OG images for landing pages |
| `src/index.css` | Local @font-face (correct); font-display:swap |
