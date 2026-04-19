## Summary

All 19 medium- and low-priority SEO fixes from Prompt 2 are implemented on `seo/comprehensive-audit-fixes`. No UI behavior changes; everything is meta/markup/asset/config work.

### What changed

**Marketing site (`artifacts/nexfortis/`):**
- `seo.tsx`: title-suffix is now skipped when the title already contains "NexFortis"; added `og:image:width`/`height`; added a `SearchAction` to `WebSiteSchema`; added a new `PersonSchema` component.
- Shortened 4 overlong page titles (about, quickbooks, automation, contact).
- Tightened 10 meta descriptions to land in the 150–158 char band.
- Added Hassan Sadiq `Person` schema on `/about`.
- Added a missing `<h2>` ("Our IT Consulting Services") on the IT Consulting page so the heading hierarchy no longer skips from `<h1>` to `<h3>`.
- Removed the `FacebookBot` block from `robots.txt` so link previews work on Meta platforms.
- Deleted unused `public/opengraph.jpg` and `public/images/logo-grayscale.png`.
- Wrapped all 9 partner-badge `<img>` instances in `<picture>` with WebP source + PNG fallback and `loading="lazy"` (home, about, footer).

**QB Portal (`artifacts/qb-portal/`):**
- Improved 3 page titles to include the "QuickBooks" keyword (catalog, subscription, faq).
- Added `aria-pressed` to all category filter buttons on `/catalog`.
- Added `BreadcrumbList` JSON-LD on `/category/:slug`.
- Per-slug OG images on `/service/:slug` when a matching landing-page slug exists (falls back to the generic image otherwise).
- Switched the `Organization` schema `logo` from SVG to a freshly generated 512×512 PNG.
- `robots.txt`: added `Disallow: /ticket/` and `Disallow: /portal-settings`; commented the legacy `/qb-portal/admin*` entries.
- `sitemap.xml`: added `/waitlist`, refreshed all `<lastmod>` to `2026-04-19`, and re-tiered priorities (home 1.0; catalog & subscription 0.9; faq 0.8; qbm-guide 0.7; categories 0.7; services 0.8; landings 0.9; legal & waitlist 0.3).
- Wrapped the 3 footer badge `<img>`s in `<picture>` with WebP source + lazy loading.

**Tooling / assets:**
- New `scripts/convert-badges-to-webp.js` (uses `sharp` resolved from the qb-portal node_modules) generates the 6 badge WebPs and the 512×512 portal logo PNG. Idempotent; safe to re-run.

### How to test/run

- **Typecheck both artifacts** (from workspace root):
  ```
  cd artifacts/nexfortis && npx tsc --noEmit
  cd artifacts/qb-portal && npx tsc --noEmit
  ```
  Both pass clean.
- **Production builds with prerendering** require Puppeteer + a browser binary; in this sandbox use:
  ```
  PUPPETEER_EXECUTABLE_PATH=/usr/local/bin/google-chrome PORT=3000 BASE_PATH=/ npx vite build
  ```
  in each artifact directory. Both succeed and emit prerendered HTML for every public route.
- **Spot-check rendered SEO** by grepping the build output, e.g.:
  ```
  grep -o '<title>[^<]*</title>' artifacts/nexfortis/dist/public/about/index.html
  grep -o '<meta property="og:image[^"]*' artifacts/qb-portal/dist/public/service/audit-trail-removal/index.html
  ```
- **Re-generate badge WebPs / portal PNG logo** if source PNGs/SVG ever change:
  ```
  node scripts/convert-badges-to-webp.js
  ```

### Caveats / follow-ups

- All portal sitemap `<lastmod>` values are the same date (2026-04-19). A future build-time script could make these dynamic per page.
- `Organization.sameAs` arrays remain empty in both sites; populate once social profiles are confirmed.
- `twitter:site` is still not set on either SEO component — explicitly deferred until a Twitter/X handle is established (called out in the audit but not in this prompt).
- The portal organization schema's PNG logo was generated from the SVG; if a designer-provided 512×512 brand mark is preferred, drop it in at `artifacts/qb-portal/public/images/logo-original.png` and re-run no scripts needed.
- Marketing prerendered build only requires Puppeteer/Chromium at build time, not runtime.

No demo recorded — changes are all server-rendered HTML/SEO and asset substitutions, with no visual UI behavior to walk through.
