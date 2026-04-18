# Render Deployment Runbook

Production deployment of the NexFortis stack to [Render](https://render.com).

## Architecture

| Service              | Render type   | Source dir              | Public URL (custom)                       | `*.onrender.com` URL                      |
| -------------------- | ------------- | ----------------------- | ----------------------------------------- | ----------------------------------------- |
| `nexfortis-api`      | Web Service   | `artifacts/api-server`  | (none — internal only)                    | `https://nexfortis-api.onrender.com`      |
| `nexfortis-marketing`| Static Site   | `artifacts/nexfortis`   | `nexfortis.com`, `www.nexfortis.com`      | `https://nexfortis-marketing.onrender.com`|
| `nexfortis-qb-portal`| Static Site   | `artifacts/qb-portal`   | `qb.nexfortis.com`                        | `https://nexfortis-qb-portal.onrender.com`|

Both static sites proxy `/api/*` to the API web service, so the browser sees same-origin requests (no CORS preflights).

The repo root contains a `render.yaml` blueprint capturing the same config — use **New + → Blueprint** in Render to bootstrap all three services from it.

---

## Prerequisites

- [ ] GitHub/GitLab repo connected to the Render workspace.
- [ ] Render account on a paid plan (static sites are free; Web Service Starter is ~$7/mo and is required to avoid 15-min cold starts on the API).
- [ ] DNS access to `nexfortis.com` at the registrar.
- [ ] Stripe LIVE secret key, publishable key, and a placeholder webhook signing secret (rotated after step 6).
- [ ] Supabase project URL, anon key, service role key.
- [ ] Resend API key with `nexfortis.com` sending domain verified (tracked separately — fall back to `onboarding@resend.dev` if not yet verified).
- [ ] Postgres `DATABASE_URL` (the existing managed Postgres / Supabase connection pooler URL).

---

## 1. Pre-flight

1. Marketing site PRD merged and the build is green on `main`.
2. QB Portal pre-launch QA report shows zero blockers.
3. Security verification pass (Task #34) is green.
4. `pnpm typecheck` and `pnpm build` succeed locally from a clean clone.
5. Production secrets gathered into a password manager entry.

---

## 2. Deploy the API Web Service (`nexfortis-api`)

**Type:** Web Service · **Runtime:** Node · **Region:** Oregon · **Plan:** Starter

| Field            | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| Root directory   | `.` (repo root)                                            |
| Build command    | `corepack enable && NODE_ENV=development pnpm install --frozen-lockfile --prod=false && pnpm run typecheck:libs && pnpm --filter @workspace/api-server... build` |
| Start command    | `NODE_ENV=production node artifacts/api-server/dist/index.cjs` |
| Health check     | `/api/healthz`                                             |
| Auto-deploy      | On                                                         |
| Branch           | `main`                                                     |

### Environment variables

> **Do not set `NODE_ENV` as a service env var.** Render exposes service env vars to the build step, and `NODE_ENV=production` causes pnpm to skip devDependencies (`tsx`, `esbuild`, `typescript`), which breaks the build. `NODE_ENV=production` is set inline on the start command instead, so it only applies at runtime.

Plain values:

| Key                  | Value                                       |
| -------------------- | ------------------------------------------- |
| `NODE_VERSION`       | `24`                                        |
| `LOG_LEVEL`          | `info`                                      |
| `PORT`               | `10000` (Render assigns it automatically; explicit value is fine) |
| `PUBLIC_APP_URL`     | `https://nexfortis.com`                     |
| `PORTAL_URL`         | `https://qb.nexfortis.com`                  |
| `API_BASE_URL`       | `https://nexfortis-api.onrender.com/api`    |
| `EMAIL_FROM`         | `NexFortis Support <noreply@nexfortis.com>` |
| `LAUNCH_PROMO_ACTIVE`| `true`                                      |

Secrets (set via the dashboard, never committed):

`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY` *(LIVE, `sk_live_...`)*, `STRIPE_PUBLISHABLE_KEY` *(LIVE, `pk_live_...`)*, `STRIPE_WEBHOOK_SECRET` *(set after step 6)*, `SESSION_SECRET` *(64+ random bytes)*, `BLOG_ADMIN_SECRET`, `RESEND_API_KEY`, `OPERATOR_EMAIL`, `OPERATOR_PASSWORD`.

### Verify

```bash
curl -i https://nexfortis-api.onrender.com/api/healthz
# expect: HTTP/2 200
```

### Seed the operator account

From the Render shell on the API service:

```bash
node -e "require('child_process').spawnSync('pnpm',['--filter','@workspace/api-server','exec','tsx','src/seed-operator.ts'],{stdio:'inherit',env:process.env})"
```

Or run `pnpm --filter @workspace/scripts run seed-operator` if the `scripts` package is installed.

---

## 3. Deploy the Marketing Static Site (`nexfortis-marketing`)

**Type:** Static Site · **Plan:** Starter (free)

| Field             | Value                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| Root directory    | `.`                                                                                                    |
| Build command     | `corepack enable && NODE_ENV=development pnpm install --frozen-lockfile --prod=false && pnpm run typecheck:libs && PORT=3000 BASE_PATH=/ pnpm --filter @workspace/nexfortis... build` |
| Publish directory | `artifacts/nexfortis/dist/public`                                                                      |

> The `PORT` and `BASE_PATH` build-time env vars are required because `vite.config.ts` throws if either is missing — they are only consumed at config-load time, not at runtime.

### Redirects/Rewrites (in order)

1. `Source: /api/*` → `Destination: https://nexfortis-api.onrender.com/api/:splat` · Action: **Rewrite**
2. `Source: /*` → `Destination: /index.html` · Action: **Rewrite** (SPA fallback)

### Headers

- `/assets/*` → `Cache-Control: public, max-age=31536000, immutable`
- `/*` → `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`

### Verify

```bash
curl -I https://nexfortis-marketing.onrender.com/
curl -s https://nexfortis-marketing.onrender.com/api/healthz
# the second call should return the same JSON as the API healthz
```

---

## 4. Deploy the QB Portal Static Site (`nexfortis-qb-portal`)

Identical to step 3, swapping `nexfortis` → `qb-portal`:

- Build: `corepack enable && NODE_ENV=development pnpm install --frozen-lockfile --prod=false && pnpm run typecheck:libs && PORT=3000 BASE_PATH=/ pnpm --filter @workspace/qb-portal... build`
- Publish: `artifacts/qb-portal/dist/public`
- Same two rewrites, same headers.

### Required frontend env vars (build-time)

Vite **inlines** `VITE_*` variables into the bundle at build time, so they must be set as **service env vars on the static site itself** (not on the API). The site must be redeployed for any change to take effect.

| Key                      | Where to find the value                                | Notes                                                |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase → Project Settings → API → Project URL        | Required — `AuthProvider` throws on load if missing. |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` public key  | Required — `AuthProvider` throws on load if missing. |

After setting these, click **Manual Deploy → Clear build cache & deploy** and then verify in the browser:

```
Open https://nexfortis-qb-portal.onrender.com (or qb.nexfortis.com once DNS is live)
DevTools → Console: no "Missing Supabase env" errors
DevTools → Network: the Supabase URL above appears in the auth request URLs
```

### Marketing site frontend env vars (build-time, optional)

| Key                       | Notes                                                              |
| ------------------------- | ------------------------------------------------------------------ |
| `VITE_GA_MEASUREMENT_ID`  | Optional — only needed if Google Analytics is enabled in production. |

---

## 5. Custom Domains and DNS

In Render → each static site → **Settings → Custom Domains**, add the domains listed below. Render will display the DNS records to create.

### `nexfortis-marketing`

| Domain               | Record type | Host  | Value                                       |
| -------------------- | ----------- | ----- | ------------------------------------------- |
| `nexfortis.com`      | `ALIAS`/`ANAME` (apex) | `@` | `nexfortis-marketing.onrender.com` |
| `www.nexfortis.com`  | `CNAME`     | `www` | `nexfortis-marketing.onrender.com`          |

If the registrar does not support `ALIAS`/`ANAME` for the apex, use Render's documented A records for the apex and a `CNAME` for `www`. Render's UI will surface the exact IPs to use.

### `nexfortis-qb-portal`

| Domain               | Record type | Host | Value                                     |
| -------------------- | ----------- | ---- | ----------------------------------------- |
| `qb.nexfortis.com`   | `CNAME`     | `qb` | `nexfortis-qb-portal.onrender.com`        |

### After adding records

1. Wait for Render to verify the domain (status flips from "Pending" to "Verified", typically 5–30 min).
2. Render auto-issues a Let's Encrypt cert. Wait until "Certificate issued".
3. Test:
   ```bash
   curl -I https://nexfortis.com
   curl -I https://www.nexfortis.com
   curl -I https://qb.nexfortis.com
   ```

---

## 6. Stripe LIVE Configuration

1. Stripe dashboard → **Developers → Webhooks → Add endpoint**.
2. URL: `https://nexfortis-api.onrender.com/api/qb/webhook/stripe` (use the `*.onrender.com` URL, not the apex domain — webhooks should hit the API directly without going through the static-site proxy). Cross-check the path against `artifacts/api-server/src/app.ts` (raw-body mount) and `artifacts/api-server/src/routes/qb-portal.ts` (route definition) before saving.
3. Subscribe to: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
4. Copy the **Signing secret** (`whsec_...`) and set it as `STRIPE_WEBHOOK_SECRET` on the API service. Trigger a manual redeploy so the env var takes effect.
5. Click **Send test webhook** in the Stripe dashboard. Confirm a `200 OK` in the API logs.
6. Verify the endpoint path before LIVE cutover:
   ```bash
   # Wrong path returns 404 — confirms the router only accepts the canonical path
   curl -i -X POST https://nexfortis-api.onrender.com/api/qb/stripe/webhook
   # Correct path returns 400 "Missing signature" (route exists, signature missing)
   curl -i -X POST https://nexfortis-api.onrender.com/api/qb/webhook/stripe
   ```
   Then re-send a test event from the Stripe dashboard and tail the API logs to confirm the `POST /api/qb/webhook/stripe` line returns 200.

---

## 7. Supabase Configuration

Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL:** `https://qb.nexfortis.com`
- **Redirect URLs (allowlist):**
  - `https://qb.nexfortis.com/auth/callback`
  - `https://qb.nexfortis.com/**`
  - `https://nexfortis.com/**` (only if marketing uses Supabase auth — currently not, leave out otherwise)

Also confirm the Google and Microsoft OAuth providers have the production callback URL in their respective consoles:

- Google Cloud Console → OAuth 2.0 client → Authorized redirect URIs: `https://<project-ref>.supabase.co/auth/v1/callback`
- Microsoft Entra → App registration → Redirect URIs: `https://<project-ref>.supabase.co/auth/v1/callback`

---

## 8. Production Smoke Test

Run end-to-end against the live domains:

| # | Scenario                         | Expectation                                                  |
| - | -------------------------------- | ------------------------------------------------------------ |
| 1 | Browse `https://nexfortis.com`   | Loads, no console errors, blog posts render.                 |
| 2 | Submit contact form              | 200, email arrives at the configured inbox.                  |
| 3 | Sign up at `qb.nexfortis.com`    | Confirmation email received, account created in Supabase.    |
| 4 | Enroll MFA (TOTP) on the new account | Code accepted, AAL2 reached.                             |
| 5 | Sign in via Google SSO           | Redirected back, session established.                        |
| 6 | Sign in via Microsoft SSO        | Redirected back, session established.                        |
| 7 | One-time order with Stripe LIVE  | Small real charge (e.g., $1 test product). Order moves to `paid`. **Refund the charge in the Stripe dashboard immediately.** |
| 8 | Subscription checkout (Essentials) | Subscription created, welcome email sent.                  |
| 9 | Submit a support ticket          | Ticket created, customer + operator notification emails sent.|
|10 | Operator reply via admin panel   | Customer receives the operator-replied email.                |

Document any failures in a follow-up task before announcing launch.

---

## 9. Render Blueprint (Infrastructure-as-Code)

The repo root contains [`render.yaml`](../../render.yaml) — a Render Blueprint that captures all three services and their non-secret env vars. To re-create the stack from scratch (DR drill, second region, etc.):

1. Render dashboard → **New + → Blueprint**.
2. Pick the repo and the `main` branch. Render parses `render.yaml`.
3. Approve the plan. Render creates all three services.
4. Re-enter every secret marked `sync: false` from the password manager entry.
5. Re-attach custom domains (Render does not move them automatically).

---

## On-call Cheat Sheet

### Cold start on the API
- Symptom: First request after idle takes 1–3 s (Starter plan) or 30–60 s (free tier).
- Mitigation: An external uptime monitor pings `/api/healthz` every 5 minutes — see the **Uptime monitoring & warm-up ping** section below.
- If recurring beyond 3 s on Starter, upgrade the API to the Standard plan.

### Stripe webhook returning 4xx
- 400 with "No signatures found" → `STRIPE_WEBHOOK_SECRET` is wrong or unset. Re-copy from Stripe dashboard, redeploy.
- 400 with "Webhook payload must be provided as a string or buffer" → `express.json()` is being applied before the webhook route. Check `artifacts/api-server/src/app.ts` route order.
- 404 → Stripe is calling the wrong path. The canonical route is `POST /api/qb/webhook/stripe` (defined in `artifacts/api-server/src/routes/qb-portal.ts`, raw-body mounted in `artifacts/api-server/src/app.ts`). Update the endpoint URL in the Stripe dashboard.
- 401 → Stripe is hitting a path that requires auth. Confirm the endpoint is `/api/qb/webhook/stripe` and not behind `requireAuth`.

### Static site loads but `/api/*` returns 404
- The proxy rewrite is missing or in the wrong order. In Render → Static Site → **Redirects/Rewrites**, ensure the `/api/*` rewrite is **above** the SPA `/* → /index.html` fallback.

### Certificate did not renew
- Render auto-renews 30 days before expiry. If it fails:
  1. Confirm DNS still resolves to the Render hostname.
  2. Render → Custom Domain → **Verify** to retry the ACME challenge.

### CORS error in the browser
- Should not happen because of the same-origin rewrite. If it does, the frontend is calling the API's `*.onrender.com` URL directly — switch back to relative `/api/...` calls. Allowed origins are listed in `artifacts/api-server/src/app.ts:46-53`; add the new origin there only as a last resort.

### Rollback
- Render → Service → **Deploys** tab → find the previous green deploy → **Redeploy**. Takes 2–3 min.
- For a database rollback, use Postgres point-in-time recovery from the Supabase dashboard. Coordinate with the on-call before doing this — it is destructive to data created since the recovery point.

### Tail logs
- Render dashboard → Service → **Logs** (live tail).
- For structured search use the **Log search** UI; pino logs are JSON so filter by `level=error`.

---

## 10. Uptime monitoring & warm-up ping

> **Status:** Monitoring configured: **no** · Last verified: _pending_ · Owner: _pending_
> Update this line after the operator finishes the UptimeRobot setup below.

An external uptime monitor pings the API health endpoint every 5 minutes. This serves two purposes:

1. **Keeps the Render Starter instance warm** — Render idles a Starter web service after periods of low traffic, so the next request can pay a 1–3 s cold-start cost. A regular ping prevents the idle timer from elapsing.
2. **External uptime alerting** — if the API goes down, the monitor pages the on-call before customers notice.

### Endpoint

| Field            | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| URL              | `https://nexfortis-api.onrender.com/api/healthz`           |
| Method           | `GET`                                                      |
| Expected status  | `200`                                                      |
| Expected body    | JSON containing `"status":"ok"`                            |
| Interval         | 5 minutes                                                  |
| Timeout          | 30 seconds (covers worst-case cold start)                  |
| Retries          | 1 (alert only after 2 consecutive failures)                |

> Use the `*.onrender.com` URL, not a custom domain — the API is internal-only and has no public custom hostname.

### Setup (UptimeRobot — recommended free tier)

1. Sign in to [UptimeRobot](https://uptimerobot.com/) using the shared `ops@nexfortis.com` account (credentials in the team password manager under **UptimeRobot — Production**). Create the account if it does not exist yet, then store the credentials.
2. **+ Add New Monitor**:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: `nexfortis-api healthz`
   - URL: `https://nexfortis-api.onrender.com/api/healthz`
   - Monitoring Interval: **5 minutes**
   - Monitor Timeout: **30 seconds**
   - HTTP Method: `GET`
   - (Pro only) Keyword Monitoring → keyword `"ok"` exists in response.
3. **Alert Contacts** — attach the on-call channels:
   - Email: `oncall@nexfortis.com` (distribution list)
   - Slack: `#alerts-prod` (configured via UptimeRobot's Slack integration; webhook URL stored in 1Password under **Slack — UptimeRobot Webhook**)
4. **Alert Settings**: notify when down, notify when back up, send the first alert after **2 consecutive failed checks** (≈10 min) to suppress flaps from a single transient cold start.
5. Save. The monitor's first ping happens within 5 minutes — confirm the status flips to **Up** in the UptimeRobot dashboard.

### Verification

- UptimeRobot dashboard → `nexfortis-api healthz` shows uptime ≥ 99% over the last 24 h after a day of running.
- In Render → API service → **Logs**, you should see one `GET /api/healthz 200` line every 5 minutes.
- Trigger a fake outage by temporarily renaming the route in a feature branch (do **not** deploy) — instead, validate alerting by clicking **Test notification** in the alert contact's settings.

### Alternative providers

If UptimeRobot is unavailable or rate-limited, the same configuration works on:

- **Better Stack** (formerly Better Uptime) — free tier supports 30 s intervals and richer Slack/PagerDuty integrations.
- **Pingdom** — paid but enterprise-grade if/when SLAs require it.
- **Render Cron Job** (paid add-on) — last resort, since it shares infrastructure with the thing being monitored.

### Account ownership

| Item                          | Owner / location                                              |
| ----------------------------- | ------------------------------------------------------------- |
| UptimeRobot login             | `ops@nexfortis.com` — credentials in 1Password ("UptimeRobot — Production") |
| Slack alert webhook           | 1Password ("Slack — UptimeRobot Webhook")                     |
| On-call email distribution    | `oncall@nexfortis.com` — managed in Google Workspace admin    |

Update this table whenever ownership changes.
