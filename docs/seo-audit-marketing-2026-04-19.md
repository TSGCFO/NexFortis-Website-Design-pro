# SEO Audit — NexFortis Marketing Site
**Codebase:** `/home/user/workspace/NexFortis-Website-Design-pro/artifacts/nexfortis/`  
**Date Audited:** 2025  
**Stack:** Vite + React (Client-Side Rendering), react-helmet-async, wouter routing  

---

## Summary

| Category | PASS | WARN | FAIL |
|---|---|---|---|
| 1. Meta Tags & Title Tags | 9 | 6 | 2 |
| 2. Open Graph & Social Meta | 7 | 3 | 1 |
| 3. Structured Data (JSON-LD) | 7 | 2 | 3 |
| 4. Sitemap.xml | 5 | 2 | 3 |
| 5. Robots.txt | 5 | 1 | 0 |
| 6. Semantic HTML | 8 | 3 | 1 |
| 7. Image SEO | 6 | 5 | 0 |
| 8. Core Web Vitals Code Factors | 6 | 2 | 1 |
| 9. Internal Linking | 4 | 1 | 0 |
| 10. URL Structure | 3 | 0 | 1 |

---

## 1. Meta Tags & Title Tags

### PASS

- **`<title>` tag present on all pages** — Every public-facing page uses the `SEO` component (`src/components/seo.tsx`, line 25) which injects a unique `<title>` via react-helmet-async.
- **`<meta name="description">` on all pages** — All pages pass a unique `description` prop to the SEO component (`seo.tsx`, line 26).
- **`<meta name="robots" content="index, follow">` set globally** — Present in `index.html` (line 11) as the default; admin pages (`/admin/login`, `/blog/admin`, `/404`) correctly set `noindex,nofollow` via the `noIndex` prop (`seo.tsx`, line 30; `admin-login.tsx`, line 39; `blog-admin.tsx`, line 272; `not-found.tsx`, line 9).
- **`<link rel="canonical">` on all pages** — Injected by the SEO component (`seo.tsx`, line 27) with the correct absolute URL for each route.
- **`hreflang` tags present** — `en-CA` and `x-default` alternates set on every page (`seo.tsx`, lines 28–29).
- **Geo meta tags** — `geo.region: CA-ON` and `geo.placename: Nobleton` set globally in `index.html` (lines 12–13) and on all pages via SEO component (lines 45–46).
- **Title tags are unique per page** — Each page passes a distinct `title` prop; no two pages produce the same `<title>`.
- **No duplicate descriptions** — Each page's `description` prop is unique.
- **Homepage title correct** — The SEO component special-cases `path="/"` to output the full brand tagline: *NexFortis IT Solutions — Complexity Decoded. Advantage.* (55 chars, within limit).

### WARN

- **`/about` title is 63 characters** (over the 60-char recommended limit)  
  `src/pages/about.tsx`, line 17  
  Current: `About Us — Canada's Trusted IT Partner | NexFortis IT Solutions` (63 chars)  
  Suggestion: `About NexFortis — Canada's Trusted IT Partner` (46 chars)

- **`/services/quickbooks` title is 70 characters** (over limit)  
  `src/pages/services/quickbooks.tsx`, line 114  
  Current: `QuickBooks Migration, Recovery & Add-On Tools | NexFortis IT Solutions` (70 chars)  
  Suggestion: `QuickBooks Migration & Recovery | NexFortis IT Solutions` (56 chars)

- **`/services/workflow-automation` title is 74 characters** (over limit)  
  `src/pages/services/automation.tsx`, line 84  
  Current: `Workflow Automation & Custom Software Development | NexFortis IT Solutions` (74 chars)  
  Suggestion: `Workflow Automation & Custom Software | NexFortis IT Solutions` (62 chars)

- **`/contact` title is 65 characters** (over limit)  
  `src/pages/contact.tsx`, line 65  
  Current: `Contact NexFortis — Free IT Consultation | NexFortis IT Solutions` (65 chars)  
  Suggestion: `Contact NexFortis — Free IT Consultation` (40 chars) or `Contact Us — NexFortis IT Solutions` (36 chars)

- **Most meta descriptions are outside the 150–160 character sweet spot:**  
  | Page | Length | Status |
  |---|---|---|
  | `index.html` (static fallback) | 161 | 1 over |
  | `/` (SEO component) | 192 | 32 over |
  | `/about` | 144 | 6 under |
  | `/services` | 175 | 15 over |
  | `/services/digital-marketing` | 173 | 13 over |
  | `/services/microsoft-365` | 165 | 5 over |
  | `/services/quickbooks` | 180 | 20 over |
  | `/services/it-consulting` | 183 | 23 over |
  | `/services/workflow-automation` | 176 | 16 over |
  | `/contact` | 140 | 10 under |
  | `/blog` | 148 | 2 under |
  | `/privacy` | 156 | ✓ OK |
  | `/terms` | 144 | 6 under |
  | `/404` | 44 | well under |

- **`/404` description too short** (44 chars)  
  `src/pages/not-found.tsx`, line 9  
  Current: `"The page you are looking for does not exist."` — acceptable for a noindex page, but worth improving if ever indexed.

### FAIL

- **SEO component does NOT output `<meta name="robots" content="index, follow">` on indexable pages** — The `index.html` provides the global fallback (line 11), but the SEO component only outputs a robots tag when `noIndex={true}` (`seo.tsx`, line 30). Since react-helmet-async merges/replaces tags, there is no explicit per-page `index, follow` robots meta emitted by the React layer, meaning the static fallback in `index.html` is relied upon. While Googlebot defaults to indexing without a robots tag, this is fragile — any CDN or server config that strips the HTML shell could lose the directive. **Recommendation:** add `{!noIndex && <meta name="robots" content="index, follow" />}` to the SEO component at `seo.tsx` line 30.

- **`index.html` canonical is hardcoded to `https://nexfortis.com/`** (line 8) — For a SPA, the HTML shell is served for all routes, so the static canonical in `index.html` will be `nexfortis.com/` for every page until React hydrates and react-helmet-async replaces it. Crawlers that don't execute JavaScript may see the wrong canonical. This is a known SPA limitation but should be acknowledged and mitigated with SSR or pre-rendering.

---

## 2. Open Graph & Social Meta

### PASS

- **`og:title`, `og:description`, `og:url`, `og:type`** — All present on every page via `seo.tsx` (lines 32–38).
- **`og:image`** — Set to absolute URL (`https://nexfortis.com/opengraph.png`) on all pages (`seo.tsx`, line 20, 36).
- **`og:site_name`** — Present on all pages (`seo.tsx`, line 37).
- **`og:locale`** — Set to `en_CA` (`seo.tsx`, line 38).
- **Twitter card tags** — `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` all present (`seo.tsx`, lines 40–43).
- **OG image dimensions** — `public/opengraph.png` is **1200×630 px** (verified). This is the exact recommended size for Open Graph.
- **Blog posts use `og:type="article"`** — `blog-post.tsx`, line 54 passes `type="article"` to the SEO component.

### WARN

- **`twitter:site` (Twitter/X handle) is missing** — The SEO component does not include `<meta name="twitter:site" content="@nexfortis">` or similar. If NexFortis has a Twitter/X account, this improves attribution. `src/components/seo.tsx` — add after line 43.

- **`og:image:width` and `og:image:height` are not set** — While crawlers can infer image dimensions, explicitly declaring them (`<meta property="og:image:width" content="1200" />` and `<meta property="og:image:height" content="630" />`) speeds up link preview rendering on Facebook and LinkedIn. Add to `seo.tsx`.

- **`public/opengraph.jpg` exists at 1280×720** — Only `opengraph.png` is referenced in the SEO meta. The `.jpg` is unused/unreferenced. Either update the reference to the `.jpg` (smaller file size) or remove the `.jpg` to avoid confusion. `public/opengraph.jpg`, `public/opengraph.png`.

---

## 3. Structured Data (Schema.org JSON-LD)

### PASS

- **Organization schema** — Implemented via `OrganizationSchema()` component, injected on the homepage (`src/pages/home.tsx`, line 130). Includes `name`, `legalName`, `url`, `logo`, `description`, `contactPoint`, `address`, `sameAs`.
- **LocalBusiness schema** — Implemented via `LocalBusinessSchema()`, injected on homepage (`home.tsx`, line 131). Includes `address`, `geo` (coordinates), `openingHoursSpecification`, `priceRange`.
- **WebSite schema** — Implemented via `WebSiteSchema()`, injected on homepage (`home.tsx`, line 132).
- **Service schema** — `ServiceSchema` component exists and is used on all five service detail pages: `digital-marketing.tsx` (line 53), `microsoft-365.tsx` (line 63), `quickbooks.tsx` (line 115), `it-consulting.tsx` (line 71), `automation.tsx` (line 85).
- **BreadcrumbList schema** — `BreadcrumbSchema` used on all interior pages: `about.tsx` (line 18), `services.tsx` (line 63), `contact.tsx` (line 66), `blog.tsx` (line 116), `blog-post.tsx` (line 56), `privacy.tsx` (line 12), `terms.tsx` (line 12), and all five service detail pages.
- **FAQ schema** — `FAQSchema` used on homepage (`home.tsx`, line 133), and on all service detail pages that have FAQs.
- **Article schema** — `ArticleSchema` correctly used on individual blog post pages (`blog-post.tsx`, line 55), using the dynamic `post.title`, `post.excerpt`, `post.createdAt`, and `post.slug`.

### WARN

- **Organization schema and LocalBusiness schema share the same `@id`** — Both `OrganizationSchema` and `LocalBusinessSchema` use `"@id": "https://nexfortis.com/#organization"` (`seo.tsx`, lines 56 and 92). In JSON-LD, two different entities sharing the same `@id` creates a merge conflict. The `LocalBusiness` should have a distinct `@id`, e.g., `https://nexfortis.com/#localbusiness`, OR combine them into a single `LocalBusiness` node (which is a subtype of `Organization`). Both schemas are also emitted on the same page (homepage), further compounding the collision.

- **`WebSiteSchema` is missing the `SearchAction` (Sitelinks Searchbox)** — The current schema only includes `@type`, `name`, and `url` (`seo.tsx`, lines 136–142). Adding a `potentialAction` with `SearchAction` enables the Google Sitelinks Searchbox for branded queries:
  ```json
  {
    "@type": "WebSite",
    "name": "NexFortis IT Solutions",
    "url": "https://nexfortis.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://nexfortis.com/blog?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }
  ```

### FAIL

- **`ArticleSchema` is missing `image`, `author` (Person), and `mainEntityOfPage`** — The current implementation (`seo.tsx`, lines 219–251) omits the `image` property (required for Google's Article rich result eligibility), uses `Organization` as the `author` (Google prefers `Person` for articles), and does not set `mainEntityOfPage`. Without an `image`, the article schema will not qualify for rich results in Google Search.

- **`ServiceSchema` is missing `serviceOutput`, `offers`, or `areaServed` specificity** — Each service schema only has `name`, `description`, `url`, `provider`, and a generic `areaServed: Country = Canada` (`seo.tsx`, lines 153–175). Adding `offers` with pricing ranges (even "Contact for pricing") or `serviceType` sub-categorization would improve schema richness.

- **No `Person` schema for Hassan Sadiq** — The About page features the founder prominently with photo, title, and bio (`src/pages/about.tsx`, lines 118–138). A `Person` schema linking to the `Organization` would enhance E-E-A-T signals, especially important for a professional services business.

---

## 4. Sitemap.xml

**File:** `public/sitemap.xml`

### PASS

- **File exists** at `public/sitemap.xml`.
- **Absolute URLs used** — All 12 URLs begin with `https://nexfortis.com/`.
- **`<changefreq>` and `<priority>` present** on all entries.
- **Admin/private pages excluded** — `/admin/login` and `/blog/admin` are correctly omitted.
- **`/privacy` and `/terms` included** — Present with appropriate low priority (0.3) and yearly changefreq.

### WARN

- **No `<lastmod>` dates** — None of the 12 sitemap entries include `<lastmod>`. Google recommends including accurate `<lastmod>` dates to help Googlebot prioritize crawl budget. Add ISO 8601 dates reflecting the last significant content change for each page.

- **Blog posts are not in the sitemap** — Individual blog post URLs (`/blog/slug`) are not listed. Since posts are dynamically loaded from an API, a static sitemap cannot enumerate them without a build-time generation step. Consider implementing a sitemap index with a dynamically generated blog sitemap, or adding a `/sitemap-blog.xml` endpoint that the server generates.

### FAIL

- **Sitemap URL path mismatch for Automation/Workflow Automation page:**  
  - Sitemap lists: `https://nexfortis.com/services/automation-software` (line 39)  
  - The page's SEO canonical is: `/services/workflow-automation` (`automation.tsx`, line 84)  
  - The nav (`layout.tsx`, line 12) links to: `/services/automation-software`  
  - App.tsx has **both** routes (`/services/workflow-automation` and `/services/automation-software`) pointing to the same component  
  - **Impact:** Googlebot will crawl `/services/automation-software` from the sitemap and find `<link rel="canonical" href="https://nexfortis.com/services/workflow-automation" />` — this signals the sitemap URL is not canonical, causing a canonical/sitemap conflict. **Fix:** Align all three (sitemap, nav links, and SEO `path` prop) to use the same URL. Recommended canonical URL: `/services/workflow-automation` (more descriptive). Update `sitemap.xml` line 39 and `layout.tsx` line 12 accordingly.

- **`<priority>` values are flat** — All service pages have priority 0.8 regardless of business importance. QuickBooks is a revenue-generating product with a portal; consider differentiating priority to reflect actual content hierarchy and business value.

- **Sitemap is not referenced in `index.html`** — Only `robots.txt` references the sitemap. Adding `<link rel="sitemap" type="application/xml" href="/sitemap.xml" />` to `index.html` is optional but provides an additional discovery signal.

---

## 5. Robots.txt

**File:** `public/robots.txt`

### PASS

- **File exists** at `public/robots.txt`.
- **Sitemap referenced** — `Sitemap: https://nexfortis.com/sitemap.xml` at line 59.
- **`/admin/login` disallowed** — `Disallow: /admin/login` (line 4) correctly blocks Googlebot from the admin login page.
- **`/blog/admin` disallowed** — `Disallow: /blog/admin` (line 5) correctly blocks the blog management UI.
- **AI training crawlers blocked** — GPTBot, Claude, CCBot, Bytespider, and others are blocked (`Disallow: /`) in lines 8–37, which is a legitimate choice to prevent training data harvesting.
- **AI search/grounding crawlers allowed** — PerplexityBot, Applebot, OAI-SearchBot are allowed with their specific admin disallows (lines 39–57).

### WARN

- **`FacebookBot` is listed under AI training crawler blocks** — Lines 32–33 block `FacebookBot`. Note that `FacebookBot` is also used by Facebook's link preview crawler (for OG image fetching). Blocking it may degrade how shared links appear when posted to Facebook/Meta platforms. Consider whether this is intentional, and if so, document the decision. Most sites only block `facebookexternalhit` for bad behaviour, not `FacebookBot`.

---

## 6. Semantic HTML

### PASS

- **Exactly one `<h1>` per page** — All interior pages use the `PageHero` component (`ui-elements.tsx`, line 115) which renders the single `<h1>`. The homepage (`home.tsx`, line 158) and 404 page (`not-found.tsx`, line 16) have their own `<h1>`. No page has more than one `<h1>`.
- **`<header>` landmark** — Present in `layout.tsx` (line 128) with `role="banner"`.
- **`<main>` landmark** — Present in `layout.tsx` (line 295): `<main id="main-content" ... role="main">`.
- **`<footer>` landmark** — Present in `layout.tsx` (line 300) with `role="contentinfo"`.
- **`<nav>` landmarks** — Both the desktop nav (`layout.tsx`, line 148: `aria-label="Main navigation"`) and the mobile nav (`layout.tsx`, line 269–270: `role="navigation" aria-label="Mobile navigation"`) are properly marked up.
- **`<section>` and `<article>` elements used appropriately** — Blog listing uses `<article>` elements (`blog.tsx`, lines 136, 201). Service sections use `<section>` via the `Section` component.
- **Skip navigation link present** — `layout.tsx` (lines 121–126) includes a visually-hidden skip-to-main-content link, correctly pointing to `#main-content`.
- **Descriptive link anchor text** — Navigation links use descriptive text ("About", "Digital Marketing", "Get a Free Quote") throughout. The CTA pattern "Get a Free Quote" with `<ArrowRight>` is used consistently.

### WARN

- **IT Consulting page (`/services/it-consulting`) has `<h3>` tags before the first `<h2>` within the services section** — The `SectionHeader` (which renders `<h2>`) is used after the stats, but the first block of service cards (`it-consulting.tsx`, line 124: `<h3>`) appears in the section before any `<h2>` sibling, creating an h1 → h3 skip at that point. While the PageHero provides the h1 and `SectionHeader` components provide h2s later, the first group of content (stats + service cards) has h3s without a visible h2 parent for that section. Recommendation: Wrap the initial stats/service blocks under a visually styled (but semantically present) h2.

- **About page heading order** — `about.tsx` line 99 uses `<h4>` for core values (inside the SectionHeader's h2 area), but the section also has h3 siblings at lines 59, 63, 69. The h3 → h4 → h3 progression (Partnerships section at line 160 uses h4 directly under a SectionHeader h2 without h3) is slightly inconsistent. Not a critical issue but worth documenting.

- **`<address>` element used correctly in footer** (`layout.tsx`, line 351) but the Contact page contact info block uses `<address>` (line 99) inside a `<div>` — this is correct usage, but note that `<address>` semantically means contact info for its nearest `<article>` or `<body>` ancestor, not physical addresses. Acceptable in practice.

### FAIL

- **Blog listing page (`/blog`) uses `<h2>` for post titles in the cards** (`blog.tsx`, lines 182, 245) — The page has an `<h1>` from `PageHero`, and then uses `<h2>` for both the featured post title and each card title. There is no `<h2>` section heading between the h1 and the post-card h2s; the section headings come from the card titles themselves. This is acceptable structure but for improved scannability, consider a brief `<h2>` like "Latest Articles" before the grid, with post titles as `<h3>`.

---

## 7. Image SEO

### PASS

- **All visible images have `alt` text** — Every `<img>` tag with meaningful content has a descriptive `alt` attribute:
  - Logo: `alt="NexFortis"` (`layout.tsx`, lines 140, 307)
  - Team photo: `alt="NexFortis IT team collaborating on client project"` (`home.tsx`, line 401)
  - Headshot: `alt="Hassan Sadiq, Founder & CEO of NexFortis"` (`about.tsx`, line 125)
  - Partner badges: `alt="Microsoft AI Cloud Partner Program badge"`, `alt="Google Partner badge"`, `alt="QuickBooks ProAdvisor badge"` (multiple pages)
  - Blog cover images: `alt={\`Cover image for ${post.title}\`}` (`blog.tsx`, lines 149, 215)
  - Decorative hero/section background images use `alt=""` and `aria-hidden="true"` correctly (`ui-elements.tsx`, line 104)
- **Modern WebP format used** — All primary images have WebP versions served via `<picture>` elements with `<source type="image/webp">` fallback to PNG/JPG. Examples: `about-team.webp`, `hassan-headshot.webp`, `hero-bg.webp`, `blog-1.webp`, `blog-2.webp`, `blog-3.webp`.
- **Below-fold images use `loading="lazy"`** — Team photo (`home.tsx`, line 403), headshot (`about.tsx`, line 129), blog cover images (`blog.tsx`, lines 151, 216). Hero image is `loading="eager"` as appropriate.
- **`width` and `height` attributes present on key images** — Logo (`layout.tsx`, line 141–142: `width={240} height={64}`), team photo (`home.tsx`, lines 404–405: `width={600} height={450}`), headshot (`about.tsx`, lines 127–128: `width={128} height={128}`), blog cover images (`blog.tsx`, lines 152–153, 218–219).

### WARN

- **Partner badge images (across all 3 pages) are missing `width` and `height` attributes:**  
  - `home.tsx`, lines 280–298 — three badge `<img>` tags have no `width`/`height`
  - `about.tsx`, lines 154–196 — three badge `<img>` tags have no `width`/`height`
  - `layout.tsx` footer, lines 363–377 — three badge `<img>` tags have no `width`/`height`  
  This causes Cumulative Layout Shift (CLS) as the browser cannot reserve space before images load. Add `width` and `height` attributes to match the actual rendered size (or use CSS aspect-ratio).

- **`hero-bg.webp` is preloaded in `index.html`** (line 35) — This is correct. However, the hero background is not used as an `<img>` tag but as a CSS background (the file exists in `public/images/` but `grep` finds no `<img src=...hero-bg` usage). If it is purely decorative CSS background, the preload is valid, but the image doesn't need `alt` text. Confirm the preload is actually needed; if the `HeroCanvas` animated canvas has replaced the static hero-bg image, the preload may be unnecessary (wasted bandwidth).

- **`logo-grayscale.png` exists in `/public/images/`** but is not referenced in any component — This appears to be an unused asset. It does not affect SEO but adds to build size. Consider removing.

- **Blog post cover image (`blog-post.tsx`) has no `<img>` tag** — The blog post page (`blog-post.tsx`, lines 63–85) renders the post title in a hero banner but does not render the `coverImage` field as a visible `<img>` element in the article body. Only the blog listing shows cover images. If posts have cover images, displaying them in the article improves visual SEO and can be included in the Article schema's `image` property.

- **Images in `public/images/` use `.png` extension** — While WebP versions exist, some usage contexts (e.g., badge images in `home.tsx`, `about.tsx`, `layout.tsx`) serve the `.png` directly without wrapping in a `<picture>` element for WebP delivery. This means visitors get unoptimised PNG files for badges. Consider wrapping badge images in `<picture>` elements with WebP sources, or converting them to WebP outright.

---

## 8. Core Web Vitals Code Factors

### PASS

- **CSS is not render-blocking** — Vite inlines critical CSS and injects the stylesheet bundle. Tailwind CSS is compiled at build time via `@tailwindcss/vite`. No external CSS `<link>` tags in `index.html`.
- **JavaScript is non-blocking** — The main entry point is loaded as `<script type="module">` (`index.html`, line 46). ES modules are deferred by default and do not block HTML parsing.
- **Fonts preloaded** — `index.html` preloads `inter-400.woff2` (line 33) and `alegreya-sans-sc-700-latin.woff2` (line 34) — the two most critical font files for initial render.
- **`font-display: swap`** — All `@font-face` declarations in `src/index.css` (lines 8, 16, 24, 32, 40, 49, 57, 67, 76, ...) use `font-display: swap`, preventing invisible text during font load.
- **Hero image preloaded** — `<link rel="preload" href="/images/hero-bg.webp">` in `index.html` (line 35). (See warning below about whether this preload is still needed.)
- **Lazy loading for all pages** — All route components use `React.lazy()` + `Suspense` (`App.tsx`, lines 9–24, 39–61) for code-splitting. Framer Motion and React Query are split into separate vendor chunks (`vite.config.ts`, `manualChunks` function).
- **`MotionConfig reducedMotion="user"`** — Framer Motion respects the user's OS reduce-motion preference (`providers.tsx`, line 15), benefiting accessibility and performance for users with motion sensitivity.

### WARN

- **This is a pure Client-Side Rendering (CSR) SPA** — There is no SSR (Server-Side Rendering) or SSG (Static Site Generation). All content is rendered by JavaScript. While Googlebot can crawl CSR SPAs via its "second wave" rendering, this introduces:
  - **LCP risk:** The Largest Contentful Paint is delayed until JS executes and renders content (the spinner placeholder in `main.tsx` is not real content).
  - **Indexing delay:** Content may be indexed days after the initial crawl due to the rendering queue.
  - **Social preview fragility:** When the OG/Twitter meta tags in `index.html` are the only visible meta before React hydrates, social crawlers that don't execute JS will use the static homepage meta for all routes.  
  **Recommendation:** Evaluate Vite SSR, Astro, or a CDN-level pre-rendering service (e.g., Rendertron, Prerender.io) for the marketing pages.

- **`modulePreload: false` in vite.config.ts** — Setting `modulePreload: false` (`vite.config.ts`, `build.modulePreload`) disables Vite's automatic `<link rel="modulepreload">` generation, which normally speculatively loads JS chunks before they're needed. This can increase time-to-interactive for users navigating between pages. Unless there is a specific reason for this (e.g., CDN incompatibility), re-enabling it is recommended.

### FAIL

- **Hero background image preload may be wasted** — `index.html` preloads `hero-bg.webp` (line 35), but no `<img>` tag or `background-image: url(...)` CSS reference to this file was found in the current source code. The hero section uses an animated canvas (`HeroCanvas`) with gradient overlays — no static background image is rendered. If `hero-bg.webp` is not actually displayed, the preload hint wastes ~100–400KB of bandwidth on initial load for every visitor. **Verify** whether this image is still used; if not, remove the preload from `index.html` line 35.

---

## 9. Internal Linking

### PASS

- **Navigation links all important pages** — Desktop nav (`layout.tsx`, lines 149–230) links to `/`, `/about`, `/blog`, `/contact`, and each of the 5 service subpages. Services dropdown is comprehensive.
- **Footer links all important pages** — Footer (`layout.tsx`, lines 325–346) links to all 5 services, `About`, `Blog`, `Contact`, `Privacy Policy`, and `Terms of Service`.
- **No orphan pages** — Every public page is reachable from either the header nav, the footer, or a CTA on another page. Privacy and Terms are linked in the footer. Service pages link to each other via the nav dropdown.
- **Logical site hierarchy** — `/` → `/services` → `/services/[service-name]` is a clean three-level hierarchy.

### WARN

- **`/services/workflow-automation` vs `/services/automation-software` link inconsistency** — The nav links to `/services/automation-software` (`layout.tsx`, line 12), but the page's canonical is `/services/workflow-automation` (`automation.tsx`, line 84). Google will follow the nav link to `/services/automation-software`, then encounter a canonical pointing elsewhere. Internal links should point to the canonical URL. **Fix:** Change the nav href from `/services/automation-software` to `/services/workflow-automation`.

---

## 10. URL Structure

### PASS

- **All URLs are clean, descriptive, and kebab-case** — `/services/digital-marketing`, `/services/microsoft-365`, `/services/quickbooks`, `/services/it-consulting` are all clean semantic URLs.
- **No query parameters in public page URLs** — All routes are path-based (`/blog/:slug`, not `/blog?post=slug`).
- **No trailing slashes inconsistency** — Canonical URLs in the sitemap and SEO component are consistently without trailing slashes (except the root `/`).

### FAIL

- **Duplicate URL paths for the Automation page** — `App.tsx` (lines 48–49) registers **two routes** for the same component:
  ```
  <Route path="/services/workflow-automation" component={AutomationSoftware} />
  <Route path="/services/automation-software" component={AutomationSoftware} />
  ```
  The page's SEO component sets canonical to `/services/workflow-automation`. The nav links to `/services/automation-software`. The sitemap lists `/services/automation-software`. This creates three conflicting signals for a single page.  
  **Fix:** Decide on one canonical URL (recommended: `/services/workflow-automation` — more descriptive and matches the page title). Remove the `/services/automation-software` route from `App.tsx` or redirect it (301) to the canonical. Update `sitemap.xml`, `layout.tsx` nav, and the SEO `path` prop to all use the same URL.

---

## Prioritised Action List

### Critical (High Impact, Implement Now)

1. **Fix the dual-URL / canonical conflict on the Automation page** — Update `App.tsx` route, nav `layout.tsx` href, `sitemap.xml` entry, and SEO `path` prop to all use `/services/workflow-automation`. Remove or 301-redirect `/services/automation-software`.

2. **Fix the OrganizationSchema / LocalBusinessSchema `@id` collision** — Give `LocalBusinessSchema` a distinct `@id` (`https://nexfortis.com/#localbusiness`) or merge the two into a single `LocalBusiness` node in `seo.tsx` (lines 51–85 and 87–131).

3. **Add `<lastmod>` to all sitemap entries** — Update `public/sitemap.xml` with ISO 8601 dates for each URL.

4. **Add explicit `robots: index, follow` to the SEO component for indexable pages** — Add `{!noIndex && <meta name="robots" content="index, follow" />}` to `seo.tsx` line 30.

### High Priority

5. **Add `image` property to `ArticleSchema`** — Without it, blog posts cannot qualify for Google's Article rich results. Update `seo.tsx` `ArticleSchema` function (line 219) to accept and emit an `image` field.

6. **Add `width` and `height` to all partner badge `<img>` tags** — Fix CLS on `home.tsx` (lines 280–298), `about.tsx` (lines 154–196), and `layout.tsx` (lines 363–377).

7. **Trim overlong title tags** — Fix 4 pages exceeding 60 characters: `/about` (63), `/services/quickbooks` (70), `/services/workflow-automation` (74), `/contact` (65). See specific suggestions in Section 1.

8. **Adjust meta descriptions toward 150–160 characters** — 10 of 13 pages are outside the optimal range. See table in Section 1.

### Medium Priority

9. **Add `SearchAction` to `WebSiteSchema`** — Enables the Google Sitelinks Searchbox. Update `seo.tsx` `WebSiteSchema` function (line 134).

10. **Add `twitter:site` meta tag** — Add to `seo.tsx` if a Twitter/X handle exists.

11. **Add `og:image:width` and `og:image:height` meta tags** — Add to `seo.tsx`.

12. **Add a `Person` schema for Hassan Sadiq** — Improves E-E-A-T signals for professional services. Add to `about.tsx`.

13. **Add blog post cover image to the `ArticleSchema`** — Modify `blog-post.tsx` to pass the `coverImage` URL to `ArticleSchema`.

14. **Consider SSR/pre-rendering** — Evaluate Astro, Vite SSR, or a pre-rendering proxy to address CSR indexing delays and social-share meta accuracy across all routes.

15. **Re-enable `modulePreload`** — Remove `modulePreload: false` from `vite.config.ts` to restore Vite's speculative chunk preloading.

16. **Verify and remove unnecessary hero-bg.webp preload** — If `hero-bg.webp` is no longer displayed as an `<img>`, remove `<link rel="preload">` from `index.html` line 35.

17. **Wrap badge images in `<picture>` elements for WebP delivery** — Or bulk-convert badge PNGs to WebP and update `src` references.

18. **Fix FacebookBot block in robots.txt** — Assess whether blocking `FacebookBot` is intentional, as it may degrade link previews on Meta platforms (Facebook, Instagram, WhatsApp).

---

## Files Referenced

| File | Primary Issues |
|---|---|
| `index.html` | Static canonical, static meta fallback, hero-bg preload |
| `src/components/seo.tsx` | Missing `index,follow` robots tag, `@id` collision, missing `SearchAction`, missing `ArticleSchema.image` |
| `public/sitemap.xml` | Missing `<lastmod>`, automation URL mismatch, blog posts missing |
| `public/robots.txt` | FacebookBot block review |
| `src/App.tsx` | Dual routes for automation page |
| `src/components/layout.tsx` | Nav links to wrong automation URL, badge images missing `width`/`height` |
| `src/pages/home.tsx` | Badge images missing `width`/`height` |
| `src/pages/about.tsx` | Badge images missing `width`/`height`, h4 heading hierarchy note |
| `src/pages/services/automation.tsx` | Title too long (74 chars), wrong `path` vs nav URL |
| `src/pages/services/quickbooks.tsx` | Title too long (70 chars) |
| `src/pages/contact.tsx` | Title too long (65 chars) |
| `src/pages/about.tsx` | Title too long (63 chars) |
| `src/pages/services/it-consulting.tsx` | h3 before h2 in first section |
| `src/pages/blog-post.tsx` | Missing cover image display, missing image in ArticleSchema |
| `vite.config.ts` | `modulePreload: false` disables chunk preloading |
