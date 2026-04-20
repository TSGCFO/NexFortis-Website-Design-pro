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
- [ ] `VITE_GA_MEASUREMENT_ID` (Google Analytics 4 measurement ID — `G-XXXXXXXXXX`)

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
- [ ] `curl -I https://nexfortis-marketing.onrender.com/about` (no trailing slash) — **verify this returns the prerendered about page, NOT the home `index.html` SPA fallback.** This is the edge case we pinned. If it serves the home page, we'll need to either add explicit per-route rewrites or update `prerender.mjs` to emit `about.html` alongside `about/index.html`.
- [ ] `curl -I https://nexfortis-marketing.onrender.com/services/automation-software` returns 301 → `/services/workflow-automation`
- [ ] `curl https://nexfortis-marketing.onrender.com/sitemap.xml` returns the sitemap (and contains all expected URLs)
- [ ] `curl https://nexfortis-marketing.onrender.com/robots.txt` returns the production robots.txt (no `noindex`)
- [ ] `curl https://nexfortis-marketing.onrender.com/api/healthz` returns 200 (proxy through to API works)
- [ ] Browser test: GA4 fires (check Realtime in GA dashboard)

QB portal static site:
- [ ] `curl -I https://nexfortis-qb-portal.onrender.com/` returns 200
- [ ] `curl https://nexfortis-qb-portal.onrender.com/api/healthz` returns 200 (proxy works)
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

### SEO verification
- [ ] `curl -s https://nexfortis.com/ | grep -c application/ld+json` returns `1+`
- [ ] `curl -s https://nexfortis.com/sitemap.xml` returns the sitemap
- [ ] `curl -s https://nexfortis.com/robots.txt` returns production robots (NOT the noindex shell)
- [ ] Submit `https://nexfortis.com/sitemap.xml` to Google Search Console
- [ ] Submit same to Bing Webmaster Tools
- [ ] Run Lighthouse on `https://nexfortis.com/` — target 90+ on Performance, 100 on SEO
- [ ] Run Lighthouse on `https://qb.nexfortis.com/` (note: lower SEO score expected on the app portal — fine)
- [ ] Re-run the auditor's curl tests; confirm they now correctly find schemas

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
