# NexFortis Render Launch Checklist

**Status:** Ready to execute
**Date opened:** 2026-04-20
**Owner:** Hassan
**Blueprint:** `render.yaml` (root)

---

## Architecture recap

Three services, deployed from a single `render.yaml` Blueprint:

| Service | Render runtime | What it serves | Domain (target) |
|---|---|---|---|
| `nexfortis-api` | `node` (web service) | Express API, CJS bundle, port 10000, `/api/healthz` health check | `nexfortis-api.onrender.com` (internal); proxied via `/api/*` from both static sites |
| `nexfortis-marketing` | `static` | Prerendered Vite/React SPA, served via CDN | `nexfortis.com` |
| `nexfortis-qb-portal` | `static` | Prerendered Vite/React SPA, served via CDN | `qb.nexfortis.com` |

**Key behavior the static sites depend on:**
- `/api/*` rewrites to `https://nexfortis-api.onrender.com/api/:splat` (so browser stays same-origin → no CORS)
- `/*` rewrites to `/index.html` ONLY when no static file exists at the requested path (Render's documented behavior — verified against [Render redirects/rewrites docs](https://render.com/docs/redirects-rewrites))
- The 301 redirect `/services/automation-software` → `/services/workflow-automation` is configured on the marketing site only

---

## Phase 0 — Pre-flight (do BEFORE pushing the deploy button)

### Code & config audit
- [x] `pnpm typecheck` passes with zero errors (root)
- [x] `pnpm test` passes (the 27 SEO/prerender tests we added in Task #161)
- [x] `pnpm --filter @workspace/nexfortis run build` succeeds locally and produces full `dist/public/` with prerendered files
- [x] `pnpm --filter @workspace/qb-portal run build` succeeds locally and produces full `dist/public/`
- [x] `pnpm --filter @workspace/api-server run build` produces `artifacts/api-server/dist/index.cjs`
- [x] No hardcoded `localhost:` or `replit.dev` URLs in production code (grep to confirm — `react-helmet-async` titles, schemas, fetch calls, OAuth redirects)
- [x] `render.yaml` env vars match what the apps actually read (no missing keys)
- [x] `replit.md` updated with deploy state (optional but recommended)

### Repository hygiene
- [x] All work committed to `main`
- [x] `main` pushed to GitHub
- [x] GitHub repo is connected to your Render account (one-time OAuth)
- [x] No secrets accidentally committed (run `git log -p -S "sk_"` and similar quick scans)

### Render account setup
- [x] Render account created and team/workspace selected
- [x] Payment method on file (free tier works for static sites; API service needs at least Starter)
- [x] Confirm region (`render.yaml` says `oregon` — fine, but Toronto users will get ~70ms extra latency vs. eastern regions; can leave as-is for v1)

### Secrets inventory (set in Render dashboard before first deploy)

These are all marked `sync: false` in `render.yaml`, meaning Render won't auto-create them — you must enter values manually in the dashboard for each service.

**`nexfortis-api` secrets (12 total):**
- [x] `DATABASE_URL` — production Postgres connection string (Supabase pooler URL)
- [x] `SUPABASE_URL`
- [x] `SUPABASE_ANON_KEY`
- [x] `SUPABASE_SERVICE_ROLE_KEY` (server-only — never put in static-site env)
- [x] `STRIPE_SECRET_KEY` (live mode key — `sk_live_...`)
- [x] `STRIPE_WEBHOOK_SECRET` (will be filled in AFTER you create the webhook on Stripe — see Phase 3)
- [x] `STRIPE_PUBLISHABLE_KEY` (live mode `pk_live_...`)
- [x] `SESSION_SECRET` (generate fresh: `openssl rand -hex 32`)
- [x] `BLOG_ADMIN_SECRET` (generate fresh: `openssl rand -hex 32`)
- [x] `RESEND_API_KEY`
- [x] `OPERATOR_EMAIL` (Hassan's admin email)
- [x] `OPERATOR_PASSWORD` (strong; will be hashed by `db:seed-operator` script)

**`nexfortis-marketing` secrets (1 total):**
- [x] `VITE_GA_MEASUREMENT_ID` (Google Analytics 4 measurement ID — `G-XXXXXXXXXX`) — **prerequisite:** create the GA4 property first (see Analytics & Search section below — the "create property" steps need to be done in Phase 0 to get this ID; the rest of the GA4/GSC wiring happens in Phase 4)

**`nexfortis-qb-portal` secrets (2 total):**
- [x] `VITE_SUPABASE_URL` (same as API's `SUPABASE_URL`)
- [x] `VITE_SUPABASE_ANON_KEY` (same as API's `SUPABASE_ANON_KEY` — anon key only, NEVER service-role)

### External service prep
- [x] **Database:** Confirm production Supabase project is provisioned and migrations are applied (`pnpm --filter @workspace/db run migrate`)
- [x] **Database:** Recent backup taken (just in case the seed-operator step or first writes go sideways)
- [x] **Resend:** Sender domain `nexfortis.com` is verified; SPF + DKIM + DMARC records published (so emails don't go to spam)
- [x] **Stripe:** Live-mode account ready; products and prices match the IDs hardcoded in `.replit` env (the `STRIPE_PRICE_*` constants); confirm whether to use existing live products or run setup script
- [x] **Supabase Auth:** Google OAuth and Microsoft OAuth configured in Supabase dashboard (we'll add Render redirect URIs in Phase 3)

---

## Phase 1 — First deploy via Blueprint

### Create the Blueprint
- [x] Render Dashboard → New + → Blueprint
- [x] Connect GitHub repo, select `main` branch
- [x] Render parses `render.yaml` and shows three services: `nexfortis-api`, `nexfortis-marketing`, `nexfortis-qb-portal`
- [x] Click "Apply" — Render creates all three services and starts building

### Set secrets
- [x] For each service, open Environment tab → enter all `sync: false` values from the inventory above
- [x] Trigger redeploy on each service (secrets change requires rebuild)

### Wait for first build
- [x] `nexfortis-api` build succeeds (watch the build log; Node 24 + pnpm install + esbuild bundle takes 4–8 min on first build)
- [x] `nexfortis-marketing` build succeeds (vite build + prerender + sitemap; ~3–6 min)
- [x] `nexfortis-qb-portal` build succeeds (~3–6 min)
- [x] All three services show "Live" status

### Smoke test on `*.onrender.com` URLs (BEFORE DNS cutover)

API service:
- [x] `curl https://nexfortis-api.onrender.com/api/healthz` returns 200 with healthy JSON
- [x] Spot-check one read endpoint (e.g., `/api/blog/posts`) returns 200

Marketing static site:
- [x] `curl -I https://nexfortis-marketing.onrender.com/` returns 200, content-type `text/html`
- [x] `curl -s https://nexfortis-marketing.onrender.com/ | grep -c application/ld+json` returns `1+` (schemas present)
- [x] `curl -s https://nexfortis-marketing.onrender.com/ | grep -oE '<title[^>]*>[^<]+</title>'` shows real prerendered title (not the shell)
- [x] `curl -I https://nexfortis-marketing.onrender.com/about/` returns 200
- [x] `curl -I https://nexfortis-marketing.onrender.com/about` (no trailing slash) — **VERIFIED 2026-04-21:** returns the prerendered about page (77,569 bytes), NOT the home shell (108,646 bytes). All real prerendered routes confirmed serving unique content: `/about` (77K), `/contact` (71K), `/services` (84K), `/services/digital-marketing` (92K), `/services/microsoft-365` (92K), `/services/quickbooks` (106K), `/services/it-consulting` (92K), `/services/workflow-automation` (94K), `/blog` (77K). QB portal: `/catalog` (57K), `/category/<slug>` (31-39K), `/service/<slug>` (33-36K), `/landing/<slug>` (53K). Two-part fix: (1) `prerender.mjs` writes both `dist/<route>/index.html` AND a flat `dist/<route>.html` mirror, and (2) `render.yaml` catch-all changed from `/* → /index.html` to `/* → /*.html` so Render serves the mirror for clean URLs (Render does NOT auto-strip `.html` like Netlify). SPA-only routes have explicit `→ /index.html` rewrites placed BEFORE the catch-all.

**Known limitation — soft 404s on non-existent routes:** Any URL that doesn't match a real prerendered file or SPA-only rewrite (e.g. typos like `/totally-fake-route`) currently returns HTTP 200 with a 0-byte empty body, because Render rewrites to `/<typo>.html`, the file doesn't exist, and Render does NOT chain to the SPA fallback when a rewrite destination is missing. Impact is minimal — the sitemap is clean, internal links all resolve, and real users from search/sitemap never hit this. Mitigations to consider post-launch: (a) generate per-route rewrites at build time and commit them, or (b) investigate if Render's `notFoundPage` config triggers when a rewrite destination is missing.
- [x] `curl -I https://nexfortis-marketing.onrender.com/services/automation-software` returns 301 → `/services/workflow-automation`
- [x] `curl https://nexfortis-marketing.onrender.com/sitemap.xml` returns the sitemap (and contains all expected URLs)
- [x] `curl https://nexfortis-marketing.onrender.com/robots.txt` returns the production robots.txt (no `noindex`)
- [x] `curl https://nexfortis-marketing.onrender.com/api/healthz` returns 200 (same-origin `/api/*` rewrite proxies through to the API)
- [x] Browser test: contact form submits successfully (relative `/api/contact` → rewrite → API)
- [x] Browser test: GA4 fires (check Realtime in GA dashboard)

QB portal static site:
- [x] `curl -I https://nexfortis-qb-portal.onrender.com/` returns 200
- [x] `curl -I https://nexfortis-qb-portal.onrender.com/catalog` (no trailing slash) returns 200 prerendered page
- [x] `curl https://nexfortis-qb-portal.onrender.com/api/healthz` returns 200 (same-origin `/api/*` rewrite works)
- [x] Browser test: catalog → order page → file upload → checkout works end-to-end (all fetch calls go through the same-origin `/api/*` rewrite)
- [x] Browser test: `/auth/login` page loads, Supabase auth widget renders without console errors
- [x] Browser test: log in with a test account; AuthProvider doesn't throw (confirms `VITE_SUPABASE_*` env vars baked into bundle correctly)

---

## Phase 2 — Custom domains (still no DNS cutover yet)

### Add custom domains in Render
- [x] `nexfortis-marketing` → Settings → Custom Domains → add `nexfortis.com` AND `www.nexfortis.com`
- [x] `nexfortis-qb-portal` → Settings → Custom Domains → add `qb.nexfortis.com`
- [x] `nexfortis-api` → no custom domain (it stays on `nexfortis-api.onrender.com`; it's only called via the static-site proxies)
- [x] Note the DNS records Render shows you for each (typically a CNAME or ALIAS for apex, CNAME for subdomains)

### Update OAuth callback URLs in Supabase
- [x] Supabase Dashboard → Authentication → URL Configuration → add to allowed redirect URLs:
  - `https://qb.nexfortis.com/auth/callback`
  - `https://nexfortis-qb-portal.onrender.com/auth/callback` (keep as fallback during transition)
- [x] Site URL → set to `https://qb.nexfortis.com`

### Update Stripe webhook
- [x] Stripe Dashboard → Developers → Webhooks → Add endpoint
- [x] URL: `https://nexfortis-api.onrender.com/api/qb/webhooks/stripe` (use the Render hostname, not the custom domain — webhooks shouldn't depend on DNS)
- [x] Subscribe to events your handler listens for (checkout.session.completed, customer.subscription.*, invoice.payment_failed, etc.)
- [x] Copy the new webhook signing secret → paste into `nexfortis-api`'s `STRIPE_WEBHOOK_SECRET` → trigger redeploy

### Seed the operator account
- [x] In Render dashboard: `nexfortis-api` → Shell tab → run:
  ```
  OPERATOR_EMAIL=hassan@nexfortis.com OPERATOR_PASSWORD='...' OPERATOR_NAME='Hassan' \
    pnpm --filter @workspace/api-server run db:seed-operator
  ```
- [x] Confirm bcrypt hash inserted via Supabase SQL editor: `SELECT email, name FROM operator_users;`

---

## Phase 3 — DNS cutover (the point of no return)

This is when `nexfortis.com` stops pointing at GoDaddy and starts pointing at Render. Browsers will see the new site within minutes; full propagation can take up to 48 hours.

### Pre-cutover sanity check
- [x] All Phase 1 + Phase 2 boxes above are checked
- [x] Take a screenshot of current GoDaddy DNS records (rollback insurance)
- [x] Pick a low-traffic window (off-hours)

### DNS changes (in your domain registrar — likely GoDaddy)
- [x] **Apex (`nexfortis.com`):** delete the existing A/ALIAS record pointing at GoDaddy's site builder; replace with the value Render gave you (typically an ALIAS or ANAME to `nexfortis-marketing.onrender.com`, or A records to Render's static IPs — Render's UI will tell you exactly)
- [x] **`www.nexfortis.com`:** CNAME to `nexfortis-marketing.onrender.com`
- [x] **`qb.nexfortis.com`:** CNAME to `nexfortis-qb-portal.onrender.com`
- [x] Delete any other GoDaddy-related DNS records you don't need (`Disallow: /404` robots.txt, parking page, etc. — verify before deleting if unsure)
- [x] **Do not touch MX records** (email keeps working independently)

### Watch Render verify the domains
- [x] Render Dashboard shows each custom domain transitioning from "Pending" → "Verified"
- [x] TLS certificates auto-provision (Let's Encrypt; usually 1–5 minutes after DNS resolves)
- [x] Browser test: `https://nexfortis.com` loads our React app with a green padlock (not GoDaddy)

---

## Phase 4 — Post-cutover verification

### Functional smoke tests on production domains
- [x] **VERIFIED 2026-04-21:** `https://nexfortis.com/` loads (108,646 bytes, prerendered), schemas visible in view-source — `Organization`, `LocalBusiness`, `WebSite`, `FAQPage`, `ContactPoint`, `PostalAddress`, `GeoCoordinates`, `OpeningHoursSpecification` all detected
- [x] **VERIFIED 2026-04-21:** `https://nexfortis.com/about/` returns 200 (77,569 bytes) with the real "Learn about NexFortis IT Solutions — our mission, vision..." meta description; trailing-slash and no-trailing-slash both work
- [x] **VERIFIED 2026-04-21:** `https://nexfortis.com/services/quickbooks/` returns 200 (106,849 bytes) with real "Certified QuickBooks ProAdvisor team..." meta description and per-page `og:title`; trailing-slash and no-trailing-slash both work
- [x] **VERIFIED 2026-04-21 (recheck):** `https://nexfortis.com/blog/` index page loads (77,191 bytes, real "Expert IT advice..." description) AND all 5 blog post URLs now serve unique prerendered content with per-post titles, descriptions, and self-canonicals. Sizes 69,914 / 70,559 / 70,752 / 71,797 / 71,818 bytes. Each post has its own `Article` + `BreadcrumbList` schema. The earlier "all 5 serve identical 61,794-byte home content" finding has been fixed by subsequent prerender hardening work (see `.local/tasks/seo-finalization-and-verification.md`).
- [ ] `https://nexfortis.com/contact` form submits → email arrives via Resend (browser test required — see runbook below)
- [x] **VERIFIED 2026-04-21:** `https://qb.nexfortis.com/` loads QB portal (200, 49,033 bytes); `/catalog` returns 200
- [ ] Sign up a test customer → confirm email → log in → MFA flow works (browser test required — see runbook below)
- [ ] Place a test order with a real (small-amount) Stripe test → webhook fires → order status updates (browser test required — see runbook below)
- [ ] Log in as operator at `/admin/login` → admin panel loads → see test order (browser test required — see runbook below)
- [ ] Trigger a ticket → operator replies → customer email arrives (browser test required — see runbook below)
- [ ] Cancel the test subscription → confirm flow → email arrives (browser test required — see runbook below)

**Separate finding (RESOLVED 2026-04-21):** An earlier note here flagged generic `<title>NexFortis IT Solutions</title>` on every prerendered page. That has been fixed — all 17 prerendered routes (and all 53 qb-portal routes) now have unique, per-page `<title>` values matching their `og:title` and meta description. Verified by curl-grep across all 12 marketing routes and confirmed in third-party audit. Root cause was the same prerender-wait issue as the blog post bug; both are resolved.

### SEO verification (technical baseline only — full analytics/search setup in next section)
- [x] **VERIFIED 2026-04-21:** `curl -s https://nexfortis.com/ | grep -c application/ld+json` returns `1` (single consolidated block contains Organization + LocalBusiness + WebSite + FAQPage + ContactPoint + GeoCoordinates + OpeningHoursSpecification + PostalAddress); qb.nexfortis.com same — `1` block (Organization + ProfessionalService + WebSite + PostalAddress)
- [x] **VERIFIED 2026-04-21:** `curl -s https://nexfortis.com/sitemap.xml` returns 17 URLs; `curl -s https://qb.nexfortis.com/sitemap.xml` returns 53 URLs — both valid XML
- [x] **VERIFIED 2026-04-21:** `curl -s https://nexfortis.com/robots.txt` returns production robots (no `noindex` directives); `curl -s https://qb.nexfortis.com/robots.txt` returns production robots (no `noindex`, plus the 8-AI-crawler block list)
- [ ] Run Lighthouse on `https://nexfortis.com/` — target 90+ on Performance, 100 on SEO *(browser-only — user runs in Chrome DevTools or PageSpeed Insights)*
- [ ] Run Lighthouse on `https://qb.nexfortis.com/` (note: lower SEO score expected on the app portal — fine) *(browser-only)*
- [x] **VERIFIED 2026-04-21:** Re-ran auditor's curl tests at `.local/audit-recheck-2026-04-21.md` — all 17 marketing + 10 sampled qb-portal routes pass: unique titles, descriptions, canonicals, schemas; 0 noindex leaks; HSTS preload on both sites

### Analytics, Search Console & discoverability infrastructure

This is the foundation for measuring everything that happens next (organic traffic growth, the local-SEO sprint, any future ad campaigns). Skip nothing here — most items are 5-minute jobs but each one closes a measurement gap.

**Google Analytics 4 (GA4):**
- [ ] **Phase 0 prereq:** Create GA4 property at `analytics.google.com` → Admin → Create Property; data stream type: Web; URL: `https://nexfortis.com`. Copy the `G-XXXXXXXXXX` measurement ID into the `VITE_GA_MEASUREMENT_ID` secret on `nexfortis-marketing`
- [ ] **Phase 0 prereq:** Decide whether to create a SECOND GA4 property for the QB portal (recommended — keeps marketing-funnel data clean from app-usage data) or use cross-domain tracking on a single property
- [ ] In GA4 → Admin → Data Streams → enable enhanced measurement (page views, scrolls, outbound clicks, file downloads, form interactions are all auto-tracked)
- [ ] In GA4 → Admin → Data Settings → Data Retention → set to **14 months** (default is 2 — costs nothing to extend)
- [ ] In GA4 → Admin → Property Settings → set time zone to `America/Toronto` and currency to `CAD`
- [ ] Configure key events (formerly "conversions"): contact form submission, QB portal signup, subscription checkout completed, ticket created
- [ ] After site is live: open `https://nexfortis.com/` in an incognito window, then check GA4 Realtime — confirm your visit appears within 30 seconds
- [ ] Filter your own internal traffic: Admin → Data Filters → Internal Traffic → define your IP ranges as "internal", then enable the filter (otherwise your own page-loads pollute analytics)

**Google Search Console (GSC):**
- [ ] Add property at `search.google.com/search-console` — use **Domain property** (covers `nexfortis.com`, `www.nexfortis.com`, `qb.nexfortis.com`, http+https — single property for everything)
- [ ] Verify via DNS TXT record at your registrar (GoDaddy or wherever DNS lives post-cutover) — Domain property requires DNS verification
- [ ] After verification: submit `https://nexfortis.com/sitemap.xml` under Sitemaps
- [ ] Submit `https://qb.nexfortis.com/sitemap.xml` if the portal has one (worth checking; less critical because the portal is mostly authenticated)
- [ ] Use the URL Inspection tool on `https://nexfortis.com/` → "Request Indexing" (kicks Googlebot to crawl immediately instead of waiting days)
- [ ] Same for `/about/`, `/services/quickbooks/`, `/blog/`, and each blog post URL — speeds initial indexation
- [ ] Link GA4 to GSC: GA4 → Admin → Search Console Links → Link → select your GSC property and the Web data stream (this surfaces query/landing-page reports inside GA4)
- [ ] Set up email alerts in GSC (Settings → Notifications) for crawl errors and manual actions

**Bing Webmaster Tools:**
- [ ] Add `https://nexfortis.com` at `bing.com/webmasters`
- [ ] Use the "Import from Google Search Console" option — Bing pulls verification + sitemap from GSC in one click (saves 10 minutes)
- [ ] Confirm sitemap submission shows the same URL count as GSC

**IndexNow (Bing + Yandex instant indexing):**
- [ ] Enable IndexNow via Bing Webmaster Tools (Settings → IndexNow → generate API key)
- [ ] Host the key file at `https://nexfortis.com/<key>.txt` (place in `artifacts/nexfortis/public/` so it ships with the static build)
- [ ] Optional: wire the blog admin "publish" action to ping the IndexNow API on new post creation (one HTTP POST; ~10 lines of code in the API server). Defer if not urgent — Bing will still discover via sitemap.

**Schema markup validation:**
- [ ] Run `https://nexfortis.com/` through Google's [Rich Results Test](https://search.google.com/test/rich-results) — confirm Organization, LocalBusiness, WebSite, FAQPage all detected and error-free
- [ ] Run each services page (`/services/quickbooks`, `/services/microsoft-365`, etc.) through Rich Results Test — confirm Service + BreadcrumbList detected
- [ ] Run a representative blog post through Rich Results Test — confirm Article + BreadcrumbList detected
- [ ] Run `https://validator.schema.org/?url=https%3A%2F%2Fnexfortis.com%2F` — same idea, stricter validator; confirm zero errors (warnings are fine)
- [ ] Spot-check `/about/`, `/contact/` — at minimum they should have BreadcrumbList without errors

**Google Business Profile (when verification clears — likely after launch):**
- [ ] Confirm GBP listing for NexFortis is verified (you submitted ~2026-04-20)
- [ ] Set primary website URL to `https://nexfortis.com`
- [ ] Confirm NAP on GBP exactly matches the canonical NAP we'll lock in for the local-SEO sprint (see `specs/2026-04-20-local-seo-and-topical-authority.md` Q1)
- [ ] Add primary category (e.g., "Computer Support and Services" or "IT Service") + secondary categories (Microsoft Cloud Solutions Provider, Bookkeeping Service, etc.)
- [ ] Upload logo, cover photo, 3–5 photos showing brand professionalism
- [ ] Write the GBP "About" description (750 chars) — should mirror the home-page meta description for consistency
- [ ] Enable messaging if you want leads through GBP chat
- [ ] Publish first GBP "Update" post (Google rewards active profiles with slightly higher local visibility)

**Conversion tracking infrastructure (foundation for any future ads):**
- [ ] Document a **UTM convention** in `specs/` (e.g., `utm_source=google` `utm_medium=cpc` `utm_campaign=launch-msp-vaughan`) so all future paid traffic is attributable. Even if you don't run ads day-one, having the convention written down prevents inconsistent tagging later
- [ ] Mark all GA4 key events (above) as conversions so they flow into ad-platform optimization later
- [ ] Register the website URL as a "verified domain" in any ad accounts you'll use (Google Ads → Tools → Settings → My preferences → Linked accounts; Meta Business Suite → Brand Safety → Domains)

**Ad platform readiness (only fill in if you'll run ads at or near launch — otherwise defer):**
- [ ] Google Ads account created, payment method on file
- [ ] Google Ads conversion tracking installed via GA4 import (preferred over a second pixel — single source of truth)
- [ ] Meta Pixel installed if running Meta ads (`fbq` snippet — would need to be added to `index.html` shell)
- [ ] LinkedIn Insight Tag if running LinkedIn ads
- [ ] If any of the above are added, re-run Lighthouse to confirm no Performance regression from third-party scripts

**Optional but recommended:**
- [ ] **Microsoft Clarity** (free heatmaps + session recordings) — `clarity.ms`, add the snippet to the marketing site shell. Useful for the upcoming local-SEO sprint to see how visitors interact with new pages
- [ ] **Cloudflare** in front of Render (optional, free tier) — gives you better caching control, WAF, bot management, and analytics. Defer unless you have a specific reason

### Security & headers verification
- [x] **VERIFIED 2026-04-21:** `curl -I https://nexfortis.com/` shows all four — `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, `strict-transport-security: max-age=31536000; includeSubDomains; preload`
- [x] **VERIFIED 2026-04-21:** Same headers present on `https://qb.nexfortis.com/`
- [ ] Mozilla Observatory scan on each domain — target B+ minimum *(external scan — visit `observatory.mozilla.org`, paste each domain)*

### Operational
- [ ] Render's auto-deploy is enabled on all three services (every push to `main` triggers redeploy)
- [ ] Notification preferences in Render (email/Slack on deploy failure)
- [ ] Cancel any old Replit deployment to avoid confusion / duplicate billing

---

## Phase 5 — Replit decommission (a few days after cutover, once you're confident)

- [ ] Confirm no traffic is hitting the old Replit-published URL (check Replit dashboard analytics if available)
- [ ] Update `.replit` to remove deployment config (keep workflows for local dev)
- [ ] Update `replit.md` to reflect "Production: Render. Replit: dev environment only"
- [ ] Document runbook for common ops (rotating operator password, updating Stripe webhook, redeploying after env change) in `specs/` or `replit.md`

---

## Rollback plan (if something is on fire)

If `https://nexfortis.com` is broken in production:

1. **Revert DNS** — change `nexfortis.com` A/ALIAS back to GoDaddy's site builder values (you screenshotted them in Phase 3). Browsers will start hitting the old site within minutes (TTL-dependent).
2. **Investigate** — Render service logs are the first place to look. The static-site builds either succeeded or didn't; the API logs to stdout via Render's log viewer.
3. **Fix in a branch** — push fix, let Render auto-deploy to `*.onrender.com`, smoke-test there, then re-cutover DNS.

For the API specifically, Render keeps previous deploys and you can roll back with one click in the dashboard ("Manual Deploy" → pick previous commit). The static sites work the same way.

---

## Pinned items NOT addressed in this checklist

These are tracked separately and explicitly out of scope for the launch:

- Local SEO + topical authority work — see `specs/2026-04-20-local-seo-and-topical-authority.md`
- The no-trailing-slash rewrite question — checked during Phase 1 smoke test; if it fails, fix is small (~5 lines in `prerender.mjs` or per-route rewrites in `render.yaml`)
- Adding `Content-Security-Policy` and `Permissions-Policy` headers — small follow-up after launch is verified stable
