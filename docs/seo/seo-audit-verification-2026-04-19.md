> **Mirror of `.local/seo-audit-verification.md`** — copied to a tracked path so reviewers can see this report directly in the repo. The `.local/` copy remains the canonical artifact.

# NexFortis SEO Audit — Verification Report

Date: 2026-04-19
Apps: `artifacts/nexfortis` (nexfortis.com), `artifacts/qb-portal` (qb.nexfortis.com)
Evidence source: prerendered HTML in each app's `dist/public/`, plus build logs.

Status legend: **Fixed** = signal present in built output, evidence cited. **N/A** = explicit out-of-scope justification.

## Critical 1–4 (already closed in prior passes — re-verified here)

| # | Item | Status | Files touched | Evidence |
|---|---|---|---|---|
| C1 | Canonical tags on every public page | Fixed | `nexfortis/src/components/seo.tsx`, `qb-portal/src/components/seo.tsx` | `<link rel="canonical" href="https://...">` present on every prerendered `index.html` (verified on `/`, `/about`, `/services`, `/landing/audit-trail-removal`, `/catalog`, `/waitlist`, `/terms`, `/privacy`). |
| C2 | qb-portal `terms`/`privacy` canonicals point to qb subdomain (no apex collision) | Fixed | `qb-portal/src/pages/terms.tsx`, `…/privacy.tsx` | `dist/public/terms/index.html` → `canonical href="https://qb.nexfortis.com/terms"`; same for `/privacy`. |
| C3 | XML sitemaps and robots.txt deployed for both apps | Fixed | `dist/public/sitemap.xml`, `dist/public/robots.txt` in both apps | nexfortis sitemap = 17 URLs; qb-portal sitemap = 53 URLs; both robots.txt files include `Sitemap:` line. |
| C4 | Organization / LocalBusiness / WebSite JSON-LD on every page | Fixed | `nexfortis/src/components/seo.tsx`, `qb-portal/src/lib/seo-schemas.ts` | `"@type":"Organization"`, `"LocalBusiness"`, `"WebSite"` present in every prerendered `index.html`. |

## HIGH 5–11

| # | Item | Status | Files touched | Evidence |
|---|---|---|---|---|
| H5 | Title tag on every page (≤60 chars where targeted) | Fixed | all marketing + qb pages | All prerendered titles are unique and lead with the primary keyword. Examples: home `"NexFortis IT Solutions — IT, Microsoft 365 & QuickBooks"` (57); catalog `"QuickBooks Service Catalog — Conversions, Repair & Support \| NexFortis QuickBooks Portal"`; subscription `"QuickBooks Support Plans — Monthly Expert Help \| NexFortis QuickBooks Portal"`. |
| H6 | Meta description on every page | Fixed | all page components | Verified in every prerendered `index.html`. Lengths: see M13. |
| H7 | Open Graph + Twitter card tags | Fixed | both `seo.tsx` components | `og:title/description/url/image/type/site_name/locale` and `twitter:card/title/description/image` present on every page. Spot-checked `/landing/audit-trail-removal` and `/about`. |
| H8 | Service / Product / FAQ / BreadcrumbList JSON-LD where appropriate | Fixed | service pages, FAQ pages, landing-page-layout, BreadcrumbSchema | `"@type":"Service"`/`"Product"` on QB landings; `"FAQPage"` on `/faq` and services FAQs; `"BreadcrumbList"` on inner pages. |
| H9 | robots.txt allows public, blocks transactional/admin | Fixed | both `public/robots.txt` | qb-portal robots disallows `/order`, `/order/`, `/ticket`, `/ticket/`, `/qb-portal/ticket`, `/qb-portal/ticket/`, `/qb-portal/admin*`. nexfortis robots disallows `/admin/login`, `/blog/admin`. |
| H10 | AI training crawlers blocked, AI search crawlers allowed | Fixed | both `public/robots.txt` | Blocked: GPTBot, anthropic-ai, ClaudeBot, Claude-Web, CCBot, Google-Extended, Bytespider, Omgilibot, cohere-ai. Allowed: PerplexityBot, Applebot, Applebot-Extended, OAI-SearchBot, FacebookBot. |
| H11 | Dynamic sitemaps with real `lastmod` (and blog posts on marketing) | Fixed | `nexfortis/scripts/generate-sitemap.mjs`, `qb-portal/scripts/generate-sitemap.mjs`, `nexfortis/scripts/blog-fallback.json`, both `package.json` build scripts | Both generators walk `dist/public/` for every emitted `index.html` and stamp each URL's `<lastmod>` with that file's real mtime. Build is reordered: `vite build && node prerender.mjs && node scripts/generate-sitemap.mjs`. Marketing generator additionally fetches live posts from `SITEMAP_BLOG_API` (default `https://api.nexfortis.com`) with a 5s timeout; on network failure it loads a checked-in `scripts/blog-fallback.json` (5 published slugs that mirror `api-server/src/seed-blog.ts`). Build log: `[sitemap] live-post fetch failed (fetch failed); using checked-in fallback / [sitemap] wrote 17 URLs`. |

## MEDIUM 12–23

| # | Item | Status | Files touched | Evidence |
|---|---|---|---|---|
| M12 | Trim 4 marketing titles to ≤60 chars | Fixed | `about.tsx`, `services/quickbooks.tsx`, `services/workflow-automation.tsx`, `contact.tsx` | All four titles emitted by SEO component are ≤60 chars in prerendered output. |
| M13 | Marketing descriptions in 150–160 chars | Fixed | `about.tsx`, `blog.tsx`, `contact.tsx`, `terms.tsx`, `privacy.tsx`, services pages | Final lengths from prerendered HTML: `/`=160, `/about`=155, `/services`=155, `/services/digital-marketing`=152, `/services/microsoft-365`=159, `/services/quickbooks`=152, `/services/it-consulting`=156, `/services/workflow-automation`=154, `/contact`=153, `/blog`=157, `/privacy`=156, `/terms`=153 — every page in the 150–160 band. |
| M14 | `loading="lazy"` + `decoding="async"` on QB below-fold images | Fixed | `qb-portal/src/components/layout.tsx`, page components | Footer partner badges have both attributes; verified in source and built HTML. Hero/LCP images intentionally not lazy. |
| M15 | WebP partner badges + 512×512 PNG schema logo | Fixed | `nexfortis/src/{components/layout.tsx,pages/home.tsx,pages/about.tsx}`, `qb-portal/src/components/layout.tsx`, `nexfortis/src/components/seo.tsx`, `qb-portal/src/lib/seo-schemas.ts`, generated assets | (a) Three WebP files generated per app via sharp: Microsoft 9.1KB→2.1KB (-77%), Google 3.2KB→0.8KB (-75%), QuickBooks 6.6KB→1.6KB (-76%). All four badge instances (nexfortis footer, nexfortis home hero, nexfortis about page, qb-portal footer) use `<picture><source type="image/webp"><img src="….png" width=… height=… loading="lazy" decoding="async"></picture>`. (b) New 512×512 `logo-512.png` (30.9KB) generated for both apps. Organization/LocalBusiness/WebPage schemas now reference `images/logo-512.png`. |
| M16 | Partner badges have explicit `width`/`height` | Fixed | both layouts + `nexfortis/src/pages/{home,about}.tsx` | Footer badges `width={120} height={36}`; home hero badges `width={133} height={40}`; about-page badges `width={120} height={36}`. |
| M17 | robots.txt covers `/ticket/`, `/qb-portal/ticket/`, `/order` | Fixed | `qb-portal/public/robots.txt` | Disallow lines for `/ticket`, `/ticket/`, `/qb-portal/ticket`, `/qb-portal/ticket/`, `/order`, `/order/`, `/qb-portal/admin*`. |
| M18 | `/waitlist` in QB sitemap (and a real indexable page) | Fixed | `qb-portal/src/pages/waitlist.tsx`, `qb-portal/prerender.mjs`, `qb-portal/scripts/generate-sitemap.mjs` | Page no longer redirects when slug is missing — shows generic waitlist form. Prerendered to `dist/public/waitlist/index.html` with title `"Join the Waitlist \| NexFortis QuickBooks Portal"`, canonical `https://qb.nexfortis.com/waitlist`. Sitemap line: `<loc>https://qb.nexfortis.com/waitlist</loc>`. |
| M19 | Explicit `index,follow,max-image-preview:large` on indexable pages | Fixed | both `seo.tsx` components | Verified in every prerendered `index.html`: `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">`. |
| M20 | Marketing blog posts in sitemap | Fixed | `nexfortis/scripts/generate-sitemap.mjs` | Generator emits one `<url>` per published post with that post's `updatedAt` and `priority=0.6`. Verified 5 `https://nexfortis.com/blog/<slug>` entries in `dist/public/sitemap.xml`. |
| M21 | Re-enable `modulePreload` in marketing Vite config | Fixed | `nexfortis/vite.config.ts` | `modulePreload: false` line removed. Built `index.html` now contains `<link rel="modulepreload" …>` for `vendor-react`, `app-root`, and route entry chunks. |
| M22 | Sitemap live in production location | Fixed | both apps | Sitemap copy written to both `public/sitemap.xml` (source) and `dist/public/sitemap.xml` (deployed asset) by every build. |
| M23 | Unblock FacebookBot in marketing robots.txt | Fixed | `nexfortis/public/robots.txt` | `User-agent: FacebookBot` placed in the social-previews allow group with `Allow: /` (Meta-ExternalAgent intentionally remains in the AI-training-blocked group, since that crawler is for model training, not link previews). |

## LOW 1–9 (polish bundle)

| # | Item | Status | Files touched | Evidence |
|---|---|---|---|---|
| L1 | QB `/catalog` and `/subscription` titles lead with "QuickBooks" | Fixed | `qb-portal/src/pages/catalog.tsx`, `…/subscription.tsx` | Catalog title `"QuickBooks Service Catalog — Conversions, Repair & Support \| NexFortis QuickBooks Portal"`; subscription title `"QuickBooks Support Plans — Monthly Expert Help \| NexFortis QuickBooks Portal"`. |
| L2 | QB Organization schema: populate `sameAs` + use new PNG logo | Fixed | `qb-portal/src/lib/seo-schemas.ts` | `sameAs` array includes the LinkedIn company URL; `logo` field references `images/logo-512.png` (verified in built `dist/public/index.html`). |
| L3 | QB landing/service pages emit `og:type=product` | Fixed | `qb-portal/src/components/landing-page-layout.tsx`, `qb-portal/src/components/seo.tsx` | SEO component now accepts `ogType` prop with `"product"` branch. Verified on `/landing/audit-trail-removal`: `<meta property="og:type" content="product">`. |
| L4 | QB catalog filter buttons have `aria-pressed` | Fixed | `qb-portal/src/pages/catalog.tsx` | `aria-pressed={activeCat === ...}` on each filter button. |
| L5 | Marketing WebSite schema includes `SearchAction` for sitelinks searchbox | Fixed | `nexfortis/src/components/seo.tsx` | WebSite schema includes `"potentialAction":{"@type":"SearchAction","target":"https://nexfortis.com/blog?q={search_term_string}",…}`. |
| L6 | Marketing OG image dimensions declared | Fixed | `nexfortis/src/components/seo.tsx` | Verified in `dist/public/index.html`: `og:image:width=1200`, `og:image:height=630`, `og:image:type=image/png`. |
| L7 | Person schema for Hassan Sadiq on About | Fixed | `nexfortis/src/pages/about.tsx` | `dist/public/about/index.html` includes `"@type":"Person","name":"Hassan Sadiq",…` with `jobTitle` and `worksFor` referencing the Organization `@id`. |
| L8 | Heading-hierarchy fixes on IT Consulting + About | Fixed | `nexfortis/src/pages/services/it-consulting.tsx`, `…/about.tsx` | All headings now form a contiguous `h1 → h2 → h3` tree (no h2→h4 skips). |
| L9 | `twitter:site` handle | N/A | n/a | NexFortis has no X (Twitter) account yet — see task step 13. Will be added when the account exists. No code change required; documented here as the explicit justification. |

## Build pipeline verification

```
nexfortis:  pnpm build  →  vite build (12 chunks)  →  prerender (12 routes, 12 ok 0 failed)  →  sitemap (17 URLs)
qb-portal:  pnpm build  →  vite build              →  prerender (53 routes, 53 ok 0 failed)  →  sitemap (53 URLs)
```

Both apps built cleanly on 2026-04-19. All sitemap `<lastmod>` values now derive from real prerender mtimes (or live blog post `updatedAt`s) — never a build-time stamp.

## Out-of-scope items (per task)

- Lighthouse re-run on deployed Render URLs — post-deploy step.
- WebP-converting the OG/social hero JPGs on QB Portal — Facebook/LinkedIn previews expect JPG/PNG.
- New product features or visual redesign work.

All 32 audit items have a verified status above. Ready for Render launch.

## Pass 6 verification (2026-04-19, post-bio rebuild)

- Person `description` (bio) now lands in the prerendered `/about/index.html`. Grep evidence:
  ```
  $ grep -oE '"description":"Hassan Sadiq is the founder[^"]*"' \
      artifacts/nexfortis/dist/public/about/index.html
  "description":"Hassan Sadiq is the founder and CEO of NexFortis IT Solutions in Nobleton, Ontario, with 15+ years helping Canadian small and mid-sized businesses adopt practical IT, Microsoft 365, and QuickBooks solutions that actually move the needle."
  ```
- Marketing rebuild: 12 prerendered routes, 17-URL sitemap. Build log: `[prerender] done. 12 ok, 0 failed. / [sitemap] wrote 17 URLs`.
- QB portal rebuild (parity): 53 prerendered routes, 53-URL sitemap. No regressions.
- Robots meta intentionally left as `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1` per user direction (the extra directives match Google defaults and provide a small defensive benefit; reviewer flagged this as "acceptable but differs from strict wording").
- This report is mirrored at `docs/seo/seo-audit-verification-2026-04-19.md` so it appears in code-review diffs.
