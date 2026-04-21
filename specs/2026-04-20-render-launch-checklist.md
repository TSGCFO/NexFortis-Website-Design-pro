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
- [ ] `pnpm typecheck` passes with zero errors (root)
- [ ] `pnpm test` passes (the 27 SEO/prerender tests we added in Task #161)
- [ ] `pnpm --filter @workspace/nexfortis run build` succeeds locally and produces full `dist/public/` with prerendered files
- [ ] `pnpm --filter @workspace/qb-portal run build` succeeds locally and produces full `dist/public/`
- [ ] `pnpm --filter @workspace/api-server run build` produces `artifacts/api-server/dist/index.cjs`
- [ ] No hardcoded `localhost:` or `replit.dev` URLs in production code (grep to confirm — `react-helmet-async` titles, schemas, fetch calls, OAuth redirects)
- [ ] `render.yaml` env vars match what the apps actually read (no missing keys)
- [ ] `replit.md` updated with deploy state (optional but recommended)

### Repository hygiene
- [ ] All work committed to `main`
- [ ] `main` pushed to GitHub
- [ ] GitHub repo is connected to your Render account (one-time OAuth)
- [ ] No secrets accidentally committed (run `git log -p -S "sk_"` and similar quick scans)

### Render account setup
- [ ] Render account created and team/workspace selected
- [ ] Payment method on file (free tier works for static sites; API service needs at least Starter)
- [ ] Confirm region (`render.yaml` says `oregon` — fine, but Toronto users will get ~70ms extra latency vs. eastern regions; can leave as-is for v1)

### Secrets inventory (set in Render dashboard before first deploy)

These are all marked `sync: false` in `render.yaml`, meaning Render won't auto-create them — you must enter values manually in the dashboard for each service.

**`nexfortis-api` secrets (12 total):**
- [ ] `DATABASE_URL` — production Postgres connection string (Supabase pooler URL)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-only — never put in static-site env)
- [ ] `STRIPE_SECRET_KEY` (live mode key — `sk_live_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` (will be filled in AFTER you create the webhook on Stripe — see Phase 3)
- [ ] `STRIPE_PUBLISHABLE_KEY` (live mode `pk_live_...`)
- [ ] `SESSION_SECRET` (generate fresh: `openssl rand -hex 32`)
- [ ] `BLOG_ADMIN_SECRET` (generate fresh: `openssl rand -hex 32`)
- [ ] `RESEND_API_KEY`
- [ ] `OPERATOR_EMAIL` (Hassan's admin email)
- [ ] `OPERATOR_PASSWORD` (strong; will be hashed by `db:seed-operator` script)

**`nexfortis-marketing` secrets (1 total):**
- [ ] `VITE_GA_MEASUREMENT_ID` (Google Analytics 4 measurement ID — `G-XXXXXXXXXX`) — **prerequisite:** create the GA4 property first (see Analytics & Search section below — the "create property" steps need to be done in Phase 0 to get this ID; the rest of the GA4/GSC wiring happens in Phase 4)

**`nexfortis-qb-portal` secrets (2 total):**
- [ ] `VITE_SUPABASE_URL` (same as API's `SUPABASE_URL`)
- [ ] `VITE_SUPABASE_ANON_KEY` (same as API's `SUPABASE_ANON_KEY` — anon key only, NEVER service-role)

### External service prep
- [ ] **Database:** Confirm production Supabase project is provisioned and migrations are applied (`pnpm --filter @workspace/db run migrate`)
- [ ] **Database:** Recent backup taken (just in case the seed-operator step or first writes go sideways)
- [ ] **Resend:** Sender domain `nexfortis.com` is verified; SPF + DKIM + DMARC records published (so emails don't go to spam)
- [ ] **Stripe:** Live-mode account ready; products and prices match the IDs hardcoded in `.replit` env (the `STRIPE_PRICE_*` constants); confirm whether to use existing live products or run setup script
- [ ] **Supabase Auth:** Google OAuth and Microsoft OAuth configured in Supabase dashboard (we'll add Render redirect URIs in Phase 3)

---

## Phase 1 — First deploy via Blueprint

### Create the Blueprint
- [ ] Render Dashboard → New + → Blueprint
- [ ] Connect GitHub repo, select `main` branch
- [ ] Render parses `render.yaml` and shows three services: `nexfortis-api`, `nexfortis-marketing`, `nexfortis-qb-portal`
- [ ] Click "Apply" — Render creates all three services and starts building

### Set secrets
- [ ] For each service, open Environment tab → enter all `sync: false` values from the inventory above
- [ ] Trigger redeploy on each service (secrets change requires rebuild)

### Wait for first build
- [ ] `nexfortis-api` build succeeds (watch the build log; Node 24 + pnpm install + esbuild bundle takes 4–8 min on first build)
- [ ] `nexfortis-marketing` build succeeds (vite build + prerender + sitemap; ~3–6 min)
- [ ] `nexfortis-qb-portal` build succeeds (~3–6 min)
- [ ] All three services show "Live" status

### Smoke test on `*.onrender.com` URLs (BEFORE DNS cutover)

API service:
- [ ] `curl https://nexfortis-api.onrender.com/api/healthz` returns 200 with healthy JSON
- [ ] Spot-check one read endpoint (e.g., `/api/blog/posts`) returns 200

Marketing static site:
- [ ] `curl -I https://nexfortis-marketing.onrender.com/` returns 200, content-type `text/html`
- [ ] `curl -s https://nexfortis-marketing.onrender.com/ | grep -c application/ld+json` returns `1+` (schemas present)
- [ ] `curl -s https://nexfortis-marketing.onrender.com/ | grep -oE '<title[^>]*>[^<]+</title>'` shows real prerendered title (not the shell)
- [ ] `curl -I https://nexfortis-marketing.onrender.com/about/` returns 200
- [ ] `curl -I https://nexfortis-marketing.onrender.com/about` (no trailing slash) — **verify this returns the prerendered about page (≈77K bytes), NOT the home `index.html` SPA fallback (≈108K bytes).** Two-part fix applied 2026-04-21: (1) `prerender.mjs` writes both `dist/about/index.html` AND a flat `dist/about.html` mirror, and (2) `render.yaml` catch-all changed from `/* → /index.html` to `/* → /*.html` so Render serves the mirror for clean URLs (Render does NOT auto-strip `.html` like Netlify does). SPA-only routes (`/admin/*`, `/blog/admin`, qb-portal `/login`, `/order`, `/portal/*`, `/ticket/*`, `/auth/*`, etc.) have explicit `→ /index.html` rewrites placed BEFORE the catch-all.
- [ ] `curl -I https://nexfortis-marketing.onrender.com/services/automation-software` returns 301 → `/services/workflow-automation`
- [ ] `curl https://nexfortis-marketing.onrender.com/sitemap.xml` returns the sitemap (and contains all expected URLs)
- [ ] `curl https://nexfortis-marketing.onrender.com/robots.txt` returns the production robots.txt (no `noindex`)
- [ ] `curl https://nexfortis-marketing.onrender.com/api/healthz` returns 200 (same-origin `/api/*` rewrite proxies through to the API)
- [ ] Browser test: contact form submits successfully (relative `/api/contact` → rewrite → API)
- [ ] Browser test: GA4 fires (check Realtime in GA dashboard)

QB portal static site:
- [ ] `curl -I https://nexfortis-qb-portal.onrender.com/` returns 200
- [ ] `curl -I https://nexfortis-qb-portal.onrender.com/catalog` (no trailing slash) returns 200 prerendered page
- [ ] `curl https://nexfortis-qb-portal.onrender.com/api/healthz` returns 200 (same-origin `/api/*` rewrite works)
- [ ] Browser test: catalog → order page → file upload → checkout works end-to-end (all fetch calls go through the same-origin `/api/*` rewrite)
- [ ] Browser test: `/auth/login` page loads, Supabase auth widget renders without console errors
- [ ] Browser test: log in with a test account; AuthProvider doesn't throw (confirms `VITE_SUPABASE_*` env vars baked into bundle correctly)

---

## Phase 2 — Custom domains (still no DNS cutover yet)

### Add custom domains in Render
- [ ] `nexfortis-marketing` → Settings → Custom Domains → add `nexfortis.com` AND `www.nexfortis.com`
- [ ] `nexfortis-qb-portal` → Settings → Custom Domains → add `qb.nexfortis.com`
- [ ] `nexfortis-api` → no custom domain (it stays on `nexfortis-api.onrender.com`; it's only called via the static-site proxies)
- [ ] Note the DNS records Render shows you for each (typically a CNAME or ALIAS for apex, CNAME for subdomains)

### Update OAuth callback URLs in Supabase
- [ ] Supabase Dashboard → Authentication → URL Configuration → add to allowed redirect URLs:
  - `https://qb.nexfortis.com/auth/callback`
  - `https://nexfortis-qb-portal.onrender.com/auth/callback` (keep as fallback during transition)
- [ ] Site URL → set to `https://qb.nexfortis.com`

### Update Stripe webhook
- [ ] Stripe Dashboard → Developers → Webhooks → Add endpoint
- [ ] URL: `https://nexfortis-api.onrender.com/api/qb/webhooks/stripe` (use the Render hostname, not the custom domain — webhooks shouldn't depend on DNS)
- [ ] Subscribe to events your handler listens for (checkout.session.completed, customer.subscription.*, invoice.payment_failed, etc.)
- [ ] Copy the new webhook signing secret → paste into `nexfortis-api`'s `STRIPE_WEBHOOK_SECRET` → trigger redeploy

### Seed the operator account
- [ ] In Render dashboard: `nexfortis-api` → Shell tab → run:
  ```
  OPERATOR_EMAIL=hassan@nexfortis.com OPERATOR_PASSWORD='...' OPERATOR_NAME='Hassan' \
    pnpm --filter @workspace/api-server run db:seed-operator
  ```
- [ ] Confirm bcrypt hash inserted via Supabase SQL editor: `SELECT email, name FROM operator_users;`

---

## Phase 3 — DNS cutover (the point of no return)

This is when `nexfortis.com` stops pointing at GoDaddy and starts pointing at Render. Browsers will see the new site within minutes; full propagation can take up to 48 hours.

### Pre-cutover sanity check
- [ ] All Phase 1 + Phase 2 boxes above are checked
- [ ] Take a screenshot of current GoDaddy DNS records (rollback insurance)
- [ ] Pick a low-traffic window (off-hours)

### DNS changes (in your domain registrar — likely GoDaddy)
- [ ] **Apex (`nexfortis.com`):** delete the existing A/ALIAS record pointing at GoDaddy's site builder; replace with the value Render gave you (typically an ALIAS or ANAME to `nexfortis-marketing.onrender.com`, or A records to Render's static IPs — Render's UI will tell you exactly)
- [ ] **`www.nexfortis.com`:** CNAME to `nexfortis-marketing.onrender.com`
- [ ] **`qb.nexfortis.com`:** CNAME to `nexfortis-qb-portal.onrender.com`
- [ ] Delete any other GoDaddy-related DNS records you don't need (`Disallow: /404` robots.txt, parking page, etc. — verify before deleting if unsure)
- [ ] **Do not touch MX records** (email keeps working independently)

### Watch Render verify the domains
- [ ] Render Dashboard shows each custom domain transitioning from "Pending" → "Verified"
- [ ] TLS certificates auto-provision (Let's Encrypt; usually 1–5 minutes after DNS resolves)
- [ ] Browser test: `https://nexfortis.com` loads our React app with a green padlock (not GoDaddy)

---

## Phase 4 — Post-cutover verification

### Functional smoke tests on production domains
- [ ] `https://nexfortis.com/` loads, prerendered HTML, schemas visible in view-source
- [ ] `https://nexfortis.com/about/` loads correctly
- [ ] `https://nexfortis.com/services/quickbooks/` loads
- [ ] `https://nexfortis.com/blog/` loads with all 5 posts
- [ ] `https://nexfortis.com/contact` form submits → email arrives via Resend
- [ ] `https://qb.nexfortis.com/` loads QB portal
- [ ] Sign up a test customer → confirm email → log in → MFA flow works
- [ ] Place a test order with a real (small-amount) Stripe test → webhook fires → order status updates
- [ ] Log in as operator at `/admin/login` → admin panel loads → see test order
- [ ] Trigger a ticket → operator replies → customer email arrives
- [ ] Cancel the test subscription → confirm flow → email arrives

### SEO verification (technical baseline only — full analytics/search setup in next section)
- [ ] `curl -s https://nexfortis.com/ | grep -c application/ld+json` returns `1+`
- [ ] `curl -s https://nexfortis.com/sitemap.xml` returns the sitemap
- [ ] `curl -s https://nexfortis.com/robots.txt` returns production robots (NOT the noindex shell)
- [ ] Run Lighthouse on `https://nexfortis.com/` — target 90+ on Performance, 100 on SEO
- [ ] Run Lighthouse on `https://qb.nexfortis.com/` (note: lower SEO score expected on the app portal — fine)
- [ ] Re-run the auditor's curl tests; confirm they now correctly find schemas

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
- [ ] `curl -I https://nexfortis.com/` shows: `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, `strict-transport-security: max-age=...` (Render adds HSTS)
- [ ] Same checks on `https://qb.nexfortis.com/`
- [ ] Mozilla Observatory scan on each domain — target B+ minimum

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
