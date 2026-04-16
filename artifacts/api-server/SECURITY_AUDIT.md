# Security Verification Report

**Date:** 2026-04-16
**Audited by:** Replit Agent (Prompt 16)
**Scope:** Full application security review before production launch

## Summary

| Category | Status | Notes |
|---|---|---|
| CORS | PASS | Added `qbportal.nexfortis.com` to `app.ts` allowlist; synced `config.ts` (added `qb.nexfortis.com`, removed unused `http://localhost:3000` for parity with `app.ts`, applied production guard stripping `http://localhost:*` overrides). CORS error path uses `callback(null, false)`. Localhost origins included only when `NODE_ENV !== "production"`. |
| Security Headers | PASS | Helmet configured with strict CSP (`defaultSrc 'self'`, `scriptSrc 'self' https://js.stripe.com` — no `unsafe-eval`/`unsafe-inline`; `styleSrc` includes `'unsafe-inline'` for Tailwind; `imgSrc` includes `data:`; `connectSrc` covers Supabase + Stripe API; `frameSrc https://js.stripe.com`; `objectSrc 'none'`; `baseUri 'self'`; `formAction 'self'`). `frameguard: deny`, `noSniff: true`, `referrerPolicy: strict-origin-when-cross-origin`. `hsts: false` (hosting handles HSTS). `xssFilter: false` with separate middleware setting `X-XSS-Protection: 0`. `X-Powered-By` removed by Helmet default. |
| Rate Limiting | PASS | Global limiter 100/15m active (dev-only skip). Checkout `POST /qb/checkout/create-session` guarded by IP-keyed `checkoutLimiter` in `routes/index.ts` (10/15m). `orderLimiter` (10/15m, keyed by userId/IP) applied on `POST /qb/orders/:id/files`. `ticketLimiter` (5/15m) applied on ticket creation. Contact form limiter tightened from 5/hour to **3/15m** per FR-WEB. Notification preference endpoints limited (20/15m). Stripe webhook intentionally unlimited (signature auth). |
| Stripe Webhook | PASS | Raw body middleware `express.raw({ type: "application/json" })` registered for `/api/qb/webhook/stripe` BEFORE `express.json()`. Handler reads `stripe-signature` header + `STRIPE_WEBHOOK_SECRET`; production rejects 400 when secret missing; dev logs warning and parses unverified. `stripe.webhooks.constructEvent(req.body, sig, endpointSecret)` used. No auth middleware on webhook route (signature is auth). |
| Auth Middleware | PASS | `requireAuth` uses `supabase.auth.getUser(token)` (not `getSession`), looks up `qb_users` role, attaches `userId`/`userRole`, returns 401 on invalid token, 503 when Supabase unavailable. `requireOperator` runs after `requireAuth`, returns 403 on non-operator, and hard-enforces AAL2 by decoding the JWT `aal` claim — any missing/non-aal2 claim returns 403 with `MFA verification required...` message (no warn-and-continue). Admin router mounted at `/api/qb/admin` with `requireAuth, requireOperator` once at the mount point (no double-application on individual routes). |
| Environment Variables | PASS | No hardcoded passwords, Stripe live/test secret keys, JWTs, or Resend API keys in source. `SUPABASE_SERVICE_ROLE_KEY` appears only on the server. No `VITE_*SERVICE*/VITE_*SECRET*/VITE_*ROLE*` keys in the frontend. `RESEND_API_KEY` only referenced by backend. `.env.example` present at monorepo root with placeholder values. `.gitignore` extended to cover `.env`, `.env.local`, `.env.production`, `.env.*.local`, `*.key`. No legacy `QB_TOKEN_SECRET`, `qbPasswordResets`, `SESSION_MAX_AGE_MS` references. `password_hash` column and `bcrypt` remain only in the separate operator-auth (blog admin) seed path — intentional and out of scope. |
| Input Sanitization | PASS | `sanitizeHtml` (allowedTags/Attrs empty) applied on: ticket `subject`/`message` (customer + reply), `PUT /qb/me` `name`, admin ticket `operatorReply`/`internalNote`, contact form `name`/`email`/`phone`/`company`/`service`/`message`. This pass added sanitization to checkout `customerName`/`customerPhone` (stored on order, later interpolated into emails) and waitlist `product_name`. Enum-validated `status` fields intentionally not run through sanitize-html. No raw SQL concatenation — Drizzle parameterizes all queries. |
| File Upload | PASS | Customer upload uses multer memoryStorage + 500MB limit + extension allowlist (`.qbm`, `.qbw`, `.qbb`, `.csv`, `.xlsx`, `.pdf`, `.zip`) + per-product `accepted_file_types` enforcement + QBM magic-byte validation. Storage path keyed by authenticated user/order, timestamped. Admin upload uses the same 500MB limit, extended allowlist (adds `.html`, `.txt`), double-validates extension against a hardcoded safe-list before building the storage path (falls back to `.bin`), UUID-randomized storage path scoped to `order.userId`, and sanitizes filename by stripping `/\`. All uploads stream to Supabase Storage — no `fs.writeFileSync`/`createWriteStream`. |
| robots.txt | PASS | Disallows `/portal`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/order`, `/auth/callback`, `/admin`, `/admin/mfa-enroll`, `/admin/mfa-challenge`, and (newly added) `/qb-portal/admin`, `/qb-portal/admin/mfa-enroll`, `/qb-portal/admin/mfa-challenge`. Crawlable: `/`, landing pages, catalog. Sitemap points to `https://qb.nexfortis.com/sitemap.xml`. |
| Frontend Security | PASS | `qb-portal/src/lib/supabase.ts` uses `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` (auth.autoRefreshToken/persistSession/detectSessionInUrl all `true`) and does not reference any service-role key. `auth.tsx` uses `onAuthStateChange` and `getSession()`; `getAccessToken()` reads from the Supabase session (never localStorage); API calls use `Authorization: Bearer ${accessToken}`. No `QB_TOKEN`/`getAuthToken`/legacy cookie auth. No `VITE_*SERVICE*/SECRET*/ROLE*` leaks. |
| Dependencies | NOTED | `pnpm audit --production` reports **4 vulnerabilities: 2 high, 2 moderate, 0 critical** — all in transitive dependencies of `@workspace/api-server` (see Issues Noted for details). Per task directive ("Do NOT attempt to fix dependency vulnerabilities in this prompt"), versions were not bumped. `bcrypt` remains in dependency tree for the separate operator-auth blog admin flow (intentional; documented as cleanup candidate). |

## Issues Found and Fixed

1. **CORS allowlist missing production portal subdomain.** `app.ts` allowlist did not include `https://qbportal.nexfortis.com` even though the QB Portal ships from that subdomain and `config.ts` already listed it. Fix: added to `allowedOrigins` in `app.ts`.
2. **`config.ts` ALLOWED_ORIGINS out of parity + localhost leak risk in production.** `config.ts` was missing `https://qb.nexfortis.com`, included `http://localhost:3000` unconditionally, and the `ALLOWED_ORIGINS` env override did not guard against localhost entries in production. Fix: rewrote `config.ts` to derive a `BASE_ORIGINS` list that conditionally includes the three localhost origins only when `NODE_ENV !== "production"`, added `https://qb.nexfortis.com`, and made the env-var override reject any `http://localhost` entry in production.
3. **Checkout customer name/phone stored unsanitized.** `POST /api/qb/checkout/create-session` persisted `customerName`/`customerPhone` directly onto `qb_orders` and later interpolated them into customer/operator email templates — giving an attacker a path to inject HTML into transactional email. Fix: pass both fields through the existing `sanitizeInput` helper (sanitize-html with empty allowedTags/Attrs) before use and persistence.
4. **Waitlist `product_name` stored unsanitized.** Fix: run through `sanitizeInput` before insert.
5. **robots.txt missing `/qb-portal/admin*` paths.** Search engines could index the portal-prefixed admin URLs. Fix: added disallows for `/qb-portal/admin`, `/qb-portal/admin/mfa-enroll`, `/qb-portal/admin/mfa-challenge`.
6. **`.gitignore` missing `.env*` / `*.key`.** Added entries so future env files and key material are ignored by default.

## Issues Noted (Not Fixed)

- **Dependency vulnerabilities — 4 total from `pnpm audit --production`** (all transitive under `@workspace/api-server`; versions intentionally NOT bumped per task directive):
  - **HIGH** — `drizzle-orm <0.45.2`: SQL injection via improperly escaped input. Patched in `>=0.45.2`. Path: `artifacts__api-server>drizzle-orm`.
  - **HIGH** — `path-to-regexp >=8.0.0 <8.4.0`: Denial of Service. Patched in `>=8.4.0`. Path: `artifacts__api-server>express>router>path-to-regexp`.
  - **MODERATE** — `path-to-regexp >=8.0.0 <8.4.0`: Regular-expression DoS. Same patch.
  - **MODERATE** — `sanitize-html >=2.17.2 <2.17.3`: allowedTags bypass via entity-decoded text in nonTextTags. Patched in `>=2.17.3`. Path: `artifacts__api-server>sanitize-html`.
  - 0 critical. All 4 are low-complexity patch bumps for a follow-up task (tracked as follow-up #79).
- **`bcrypt` retained.** Still required for the separate operator-auth (blog admin) login flow (`routes/operator-auth.ts`, `scripts/seed-operator`, `operator_users.password_hash` column). Not related to the retired QB portal homegrown auth and therefore not a leak. Flagged as a future cleanup opportunity only if the blog admin auth is ever migrated to Supabase.
- **Git history not rewritten.** Per task directive, no `git filter-branch`/BFG work performed. `git log --all --oneline -20 --diff-filter=A -- "*.env" ".env.*"` returned two matches for the Prompt-03 commit that added `.env.example` (placeholder file — NOT a real-secret `.env`). No real `.env` files have ever been committed.
- **Paid-order promo redemption at create-session time.** Pre-existing known limitation documented in `replit.md` — abandoned carts consume a redemption slot. Not a security regression; tracked as follow-up #80 to move into the `checkout.session.completed` webhook.

## Grep Verification Results (Step 6a summary)

- Hardcoded passwords (`Hassan8488` / suspicious `password = "..."`): **0 real hits**. The only matches were column/label/placeholder names.
- `SUPABASE_SERVICE_ROLE_KEY` in `artifacts/qb-portal/`: **0 hits**.
- `VITE_SUPABASE_SERVICE_ROLE_KEY` anywhere: **0 hits**.
- Legacy auth tokens (`QB_TOKEN_SECRET`, `qbPasswordResets`, `SESSION_MAX_AGE_MS`): **0 hits**.
- Stripe/Resend/JWT literals in source (`sk_live_`, `sk_test_`, `rk_*`, `re_…`, `eyJ…`): **0 real hits** (only `sk_test_...` and `eyJ...` placeholders in `.env.example`).
- `RESEND_API_KEY` referenced in `artifacts/qb-portal/`: **0 hits**.
- Raw SQL concatenation (`db.execute` / string-concat): **0 hits**. Only match was Stripe raw body middleware (`express.raw(...)`), unrelated.
- `VITE_*SERVICE*/SECRET*/ROLE*` in frontend: **0 hits**.

## Raw Grep Evidence

```text
$ grep -rn "Hassan8488|password.*=.*['\"]" artifacts/ lib/ --include="*.ts" --include="*.tsx" --include="*.js" | filter(column/label/placeholder/type/form)
artifacts/qb-portal/src/pages/forgot-password.tsx:81: Remember your password? ...
artifacts/qb-portal/src/pages/login.tsx:122: Forgot your password? ...
artifacts/qb-portal/src/pages/portal-settings.tsx:104: To change your password, use the password reset ...
# → all three are UI copy, not hardcoded password values. PASS.

$ grep -rn "SUPABASE_SERVICE_ROLE_KEY|service_role" artifacts/qb-portal/ --include="*.ts" --include="*.tsx"
# (no output) PASS

$ grep -rn "VITE_SUPABASE_SERVICE_ROLE_KEY" artifacts/ lib/ --include="*.ts" --include="*.tsx"
# (no output) PASS

$ grep -rn "QB_TOKEN_SECRET|qbPasswordResets|SESSION_MAX_AGE_MS" artifacts/ lib/ --include="*.ts" --include="*.tsx"
# (no output) PASS

$ grep -rlE "sk_live_|sk_test_[a-zA-Z0-9]{20,}|rk_live_|rk_test_|re_[a-zA-Z0-9]{20,}" artifacts/ lib/ --include="*.ts" --include="*.tsx"
# (no output) PASS

$ grep -rn "RESEND_API_KEY" artifacts/qb-portal/ --include="*.ts" --include="*.tsx"
# (no output) PASS

$ grep -rn "VITE_.*SERVICE|VITE_.*SECRET|VITE_.*ROLE" artifacts/qb-portal/ --include="*.ts" --include="*.tsx"
# (no output) PASS

$ grep -rn "localStorage.*token|QB_TOKEN|getAuthToken|COOKIE_NAME|cookie.*auth" artifacts/qb-portal/src/ --include="*.ts" --include="*.tsx"
artifacts/qb-portal/src/pages/privacy.tsx:75: We use essential cookies for authentication ...
# → privacy-policy copy, no code. PASS.

$ grep -rln "bcrypt|password_hash|passwordHash" artifacts/ lib/ --include="*.ts" --include="*.tsx"
artifacts/api-server/src/routes/operator-auth.ts     # blog admin auth (out of scope)
lib/db/src/schema/qb-portal.ts                       # operator_users.password_hash column
lib/db/dist/schema/qb-portal.d.ts                    # build output
# → retained for separate blog-admin auth flow. Documented.

$ git log --all --oneline -20 --diff-filter=A -- "*.env" ".env.*"
e678714 feat(prompt-03): ... (added .env.example placeholder)
ef42d08 feat(prompt-03): ... (added .env.example placeholder)
# → only .env.example (placeholders). No real .env committed.

$ grep -nE "\.env|node_modules|\.secret|\.key" .gitignore
12: node_modules
52: .env
53: .env.local
54: .env.production
55: .env.*.local
56: *.key
# PASS

$ pnpm audit --production 2>&1 | tail
4 vulnerabilities found
Severity: 2 moderate | 2 high
# details captured in "Issues Noted" above.
```

## Final Verification

- `pnpm typecheck` at monorepo root: **zero errors**.
- `pnpm build` for `@workspace/api-server`, `@workspace/qb-portal`, `@workspace/nexfortis`: **success** (mockup-sandbox omitted — requires dev-only `PORT` env at build time; unchanged by this pass).
- Middleware order in `app.ts` verified: Helmet → custom X-XSS-Protection → CORS → Stripe raw body → `express.json` → `express.urlencoded` → cookieParser → pinoHttp → globalLimiter → router.
