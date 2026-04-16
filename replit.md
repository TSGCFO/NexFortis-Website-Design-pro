# Overview

This is a pnpm workspace monorepo using TypeScript, designed to manage multiple related applications and shared libraries. The project delivers NexFortis IT Solutions' web presence: a corporate website, a QuickBooks service portal, and an Express API backend.

## User Preferences

I prefer concise and clear explanations. When making changes, please prioritize iterative development and ask for confirmation before implementing major architectural shifts. Do not make changes to files in the `docs/` directory.

## Current Project State (April 15, 2026)

The monorepo is functionally running in Replit with two frontends and one API server. The project is in active implementation — Prompts 01-02 complete, Prompt 03 (Supabase Auth + Web Hardening) implemented.

**What exists and works:**
- QB Portal: Supabase Auth (email/password, Google OAuth, Microsoft OAuth), product catalog (20 products), order flow with Stripe (test mode), .QBM file upload, waitlist, FAQ, QBM guide, client portal, support tickets, SEO foundation
- Main Site: All pages complete, blog with admin (no auth), contact form (email via Resend when configured), privacy & terms pages, SEO
- API: Express 5 server with Helmet, CORS lockdown, rate limiting, input sanitization, Supabase JWT auth
- Auth: Supabase Auth replaces homegrown bcrypt+HMAC system — social login (Google, Microsoft), password reset via Supabase, JWT Bearer tokens
- Security: Helmet CSP headers, strict CORS allowlist, global + per-endpoint rate limiting, sanitize-html on free-text inputs, Stripe webhook signature verification

**What still needs to be built (see `docs/implementation-plan.md` for full gap analysis):**
- Catalog UI enhancements: promo badges, /mo pricing for subscriptions, per-conversion rates for volume packs, FAQ filter tabs
- Admin/operator panel (role column exists, requireOperator middleware exists, no admin UI yet)
- Support subscription system (no subscription billing, no SLA, no ticket counting)
- Promo code system (no promo codes, no discount mechanism)
- Stripe subscriptions (only one-time payments exist)
- Order flow updates for new product IDs, file types per service, volume packs
- SEO landing pages (none exist for QB Portal beyond the foundation)
- Main site fixes: blog admin auth, GA4, QB Portal link update, misc cleanup
- MFA enforcement (AAL2 for operators — Prompt 03B), transactional emails, production polish

## PRDs & Implementation Docs

All product requirements and implementation documents live in `docs/`. **Do not modify any files in `docs/`.**

- `docs/prd/README.md` — Index of all PRDs
- `docs/prd/qb-portal/master-qb-portal-production-launch.md` — Master PRD for the full QB Portal launch
- `docs/prd/qb-portal/feature-product-catalog-pricing.md` — 20-product catalog, pricing, categories
- `docs/prd/qb-portal/feature-expert-support-subscription.md` — 3-tier support subscription ($49/$99/$149/mo)
- `docs/prd/qb-portal/feature-seo-landing-pages.md` — SEO strategy, 20 landing pages, technical SEO
- `docs/prd/qb-portal/feature-promo-code-system.md` — Discount codes, constraints, analytics
- `docs/prd/qb-portal/feature-operator-admin-panel.md` — Admin dashboard, order/ticket/customer management
- `docs/prd/nexfortis-main/master-nexfortis-website-remaining-work.md` — Main site remaining work
- `docs/implementation-plan.md` — Full gap analysis + 15-prompt implementation sequence
- `docs/prompts/` — Individual prompt files for each implementation step

## Key Business Context

**NexFortis** is a Canadian IT solutions company specializing in QuickBooks Desktop services. The QB Portal (qb.nexfortis.com) is the primary revenue product.

**Pricing rules:**
- All prices are in **CAD cents** (14900 = $149.00) — consistent with the `total_cad` column in the orders table
- Base prices are 15-20% below competitors (E-Tech is the main competitor)
- A 50% launch promo applies to all products — controlled by the `promo_active` flag in products.json
- Support subscription is standalone — any QB Desktop user can buy it, not just conversion customers
- Response time for support is 1-2 hours maximum, even at the basic tier

**Product categories (20 products total):**
1. QuickBooks Conversion Services (6 products: 3 conversions + 3 add-ons)
2. QuickBooks Data Services (6 products: audit trail, super condense, list reduction, multi-currency removal, QBO readiness, CRA period copy + 1 bundle)
3. Platform Migration Services (2 products: AccountEdge, Sage 50)
4. QB Expert Support (3 tiers: Essentials $49/mo, Professional $99/mo, Premium $149/mo)
5. Volume Packs (2 products: 5-pack, 10-pack conversions)

# System Architecture

The monorepo is structured with `artifacts/` for deployable applications and `lib/` for shared libraries. It leverages pnpm workspaces, Node.js 24, and TypeScript 5.9.

**Core Technologies:**
- **API Framework**: Express 5
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod (v4)
- **API Codegen**: Orval (from OpenAPI spec)
- **Build Tool**: esbuild (for CJS bundles)

**Monorepo Structure:**
- `artifacts/`: Contains deployable applications like `api-server`, `nexfortis` (React + Vite website), `qb-portal` (React + Vite QuickBooks portal), and `mockup-sandbox`.
- `lib/`: Houses shared libraries such as `api-spec` (OpenAPI spec + Orval config), `api-client-react` (generated React Query hooks), `api-zod` (generated Zod schemas), and `db` (Drizzle ORM schema + connection).
- `scripts/`: Contains utility scripts for various tasks.
- `docs/`: PRDs, implementation plan, and prompt files. **Do not modify.**

**TypeScript and Composite Projects:**
All packages extend a base `tsconfig.base.json` with `composite: true`. The root `tsconfig.json` lists all packages as project references, enabling root-level type-checking and efficient build ordering. Type declaration files (`.d.ts`) are emitted during type-checking, while actual JavaScript bundling is handled by esbuild/Vite.

**Database Schema (current — 5 tables in `lib/db/src/schema/qb-portal.ts`):**
- `qb_users` — User profiles (UUID PK matching Supabase auth.users.id, email, name, phone, role CHECK 'customer'|'operator'). Auto-created by `handle_new_user` trigger on Supabase auth signup.
- `qb_orders` — Orders with user_id (UUID FK, nullable for guest checkout), service_id, service_name, addons (JSON string), total_cad (integer cents), status, stripe_session_id, upload_token
- `qb_order_files` — File uploads per order (file_type, file_name, storage_path, file_size_bytes, expired, deleted_at)
- `qb_support_tickets` — Basic tickets (user_id UUID FK, subject, message, status). No priority, SLA, or reply.
- `qb_waitlist_signups` — Waitlist signups (email, product_id, product_name) with unique constraint on email+product
- **Removed**: `qb_password_resets` (Supabase handles password resets)

**Applications:**

### NexFortis IT Solutions Website (`artifacts/nexfortis`)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Routing**: Wouter
- **SEO**: `react-helmet-async` for dynamic meta tags, Open Graph, and JSON-LD structured data. Includes `robots.txt` and `sitemap.xml`.
- **Performance**: Code splitting, vendor chunk splitting, dynamic import for React, WebP images, self-hosted fonts, and PWA manifest.
- **Accessibility**: Comprehensive UI/UX audit applied, including skip-to-content links, ARIA labeling, form accessibility, and reduced-motion support.
- **Key Pages**: Home, About, Services (Digital Marketing, Microsoft 365, QuickBooks, IT Consulting, Automation Software), Contact, Blog (listing, individual posts, admin), Privacy, Terms.

### QuickBooks Service Portal (`artifacts/qb-portal`)
- **Framework**: React 19 + Vite + Tailwind CSS v4
- **Routing**: Wouter
- **Design Language**: NexFortis brand-consistent design — navy (#0A1628), azure (#0F92E3), rose-gold (#B76E79) color palette. Inter body font + Alegreya Sans SC display font (self-hosted woff2). Dark mode support via ThemeProvider (`src/hooks/use-theme.tsx`). Glassmorphism utility classes, brand dividers, section gradients. Sticky scroll-aware navbar with SVG logo (light/dark variants). NexFortis-style footer with brand accent bar.
- **Features**: Product catalog, order flow with .qbm file upload, waitlist signup, FAQ, QBM guide, user authentication, client portal, and Stripe integration.
- **Auth**: Supabase Auth (email/password, Google OAuth, Microsoft OAuth). JWT Bearer tokens verified server-side via `supabase.auth.getUser(token)`. Social login redirects to `/auth/callback`. Password reset via Supabase's built-in flow.
- **File Management**: Multer for .qbm file uploads (500MB limit), authorized download endpoints.
- **API**: Dedicated routes at `/api/qb/` for authentication, waitlist, orders, checkout, file management, and support tickets.
- **Products**: Catalog lives in `artifacts/qb-portal/public/products.json`. Contains exactly 20 products with `base_price_cad`, `launch_price_cad`, `category_slug`, `sort_order`, `accepted_file_types`, optional `billing_type`/`billing_interval` for subscriptions, and a top-level `promo_active` flag. Helper functions in `src/lib/products.ts`: `formatPrice()`, `getActivePrice()`, `isPromoActive()`, `loadProducts()`.

### Express API Server (`artifacts/api-server`)
- **Framework**: Express 5
- **Routes**:
    - `GET /api/healthz`
    - Blog CRUD operations (`/api/blog/posts`)
    - Contact form submission (`POST /api/contact`)
    - QB Portal backend logic (`/api/qb/*` for auth, waitlist, orders, support tickets)
- **Data Persistence**: Uses `@workspace/db` for database interactions.
- **Validation**: Leverages `@workspace/api-zod` for request and response validation.
- **Env vars**: `RESEND_API_KEY` (optional) — when set, the `/api/contact` route sends form submissions via Resend email API to contact@nexfortis.com. When not set, submissions are logged to server console and a 200 response is returned.

# Implementation Workflow

Work is done through a sequence of 15 prompts executed via **Replit background tasks**. See `docs/implementation-plan.md` for the full sequence and dependency graph.

**IMPORTANT — Replit Background Task Rules:**
- All implementation work is done via background tasks (Task Board → "+ New task"), NEVER the main agent chat
- Each background task runs in its own **worktree** (isolated from main)
- Background tasks auto-commit to their worktree — do NOT include any git commands in prompts
- Do NOT include `git pull`, `git checkout`, `git branch`, `git commit`, `git push`, or "create a PR" in prompts
- When a task finishes, the worktree is merged into main via the "Approve" button on the Task Board
- Conflicts are handled by the main agent after approval
- The operator pushes main to GitHub manually from the Git tab

**Review process (after each round):**
1. Task finishes → operator approves merge into main + pushes to GitHub + republishes the app — all at once
2. Aki (external reviewer) pulls the new commits and runs a deep code review (diff against last known-good commit)
3. Aki simultaneously runs E2E browser tests on the published live site
4. Every finding — code issues, live site bugs, enhancement opportunities — is submitted via the **Replit feedback widget** (one issue per submission, specific and focused, no code blocks)
5. Operator fixes feedback items → pushes + republishes
6. Aki re-tests → if clean, round complete; if not, repeat from step 4

**Prompt structure:**
- Full prompt files live in `docs/prompts/` — the agent reads these as reference
- Launcher prompts (under 1,200 characters) are pasted into the Task Board to start a task
- Launcher prompts tell the agent to read `replit.md` and the full prompt file, then execute
- Prompts describe what to do in detail but do NOT include copy-paste code blocks — the agent writes the code itself

**Each task must:**
1. Read `replit.md` for project context
2. Read the full prompt file in `docs/prompts/`
3. Reference the relevant PRDs in `docs/prd/`
4. Execute all steps in order
5. Run `pnpm typecheck` with no errors
6. Verify changes work in the Replit preview
7. Not modify any files in `docs/`
8. Not break existing functionality

# Validation Checks

Six named validation commands are registered and can be run on demand individually or all at once via the validation system. Scripts live in `scripts/validations/`.

| Command | Script | What It Checks |
|---------|--------|----------------|
| `typecheck` | `typecheck.sh` | Zero TypeScript errors in both qb-portal and api-server |
| `product-integrity` | `product-integrity.mjs` | products.json structure: 20 products, required fields, valid prices, known categories, special chars (→, —) |
| `route-check` | `route-check.mjs` | All internal link hrefs resolve to defined routes in App.tsx; all product/category slugs resolvable |
| `price-consistency` | `price-consistency.mjs` | Hardcoded price strings in .tsx files match products.json values; flags stale/mismatched prices |
| `api-health` | `api-health.sh` | API server /api/healthz returns 200 with valid JSON (retries up to 5 times for server startup) |
| `task-compliance` | `task-compliance.mjs` | Post-merge regression detector: skips publish/deploy commits, checks changed files against allowed/protected dirs, derives scope from latest task description, runs typecheck + product-integrity as sub-checks |

# External Dependencies

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth (@supabase/supabase-js)
- **Security**: Helmet (CSP, HSTS, frameguard), express-rate-limit, sanitize-html, CORS lockdown
- **File Uploads**: multer
- **Payment Processing**: Stripe
- **Email Sending**: Resend (optional, falls back to logging if not configured)
- **API Definition**: OpenAPI 3.1
- **Icons**: Lucide React
- **UI Animations**: Framer Motion

---

# Replit Platform Constraints & Implementation Rules

This section documents critical Replit platform constraints and common implementation pitfalls. Read this before starting any task.

---

## 1. Static File Serving Architecture

Replit uses a **multi-artifact routing system**. Each artifact has its own `artifact.toml` with `serve = "static"` and a `publicDir` pointing to its built output.

| Artifact | Path | publicDir |
|---|---|---|
| NexFortis frontend | `/` | `artifacts/nexfortis/dist/public` |
| QB Portal frontend | `/qb-portal/` | `artifacts/qb-portal/dist/public` |
| API server (Express) | `/api/*` | n/a — Express on port 8080 |

Replit's router proxies based on path prefix:
- `/api/*` → Express server (port 8080)
- Everything else → Replit's static infrastructure

**CONSEQUENCE:** Express middleware (Helmet, custom headers, `express.static()`) **never applies** to static file responses. Static files bypass Express entirely. Do NOT add `express.static()` to the API server — it will either never be reached or create routing conflicts.

**CONSEQUENCE:** Security headers on frontend HTML must be added via HTML `<meta>` tags, NOT Express middleware. Express middleware only covers `/api/*` responses.

---

## 2. Hosting Layer Behavior

Replit's hosting layer sits in front of all traffic and automatically injects certain HTTP headers before responses reach the client.

- Replit automatically adds `strict-transport-security` (HSTS) headers. If Helmet also sets HSTS, responses will have **duplicate headers**. **ALWAYS set `hsts: false` in the Helmet config.**
- Replit's hosting layer may inject other headers — always test the **live deployed app**, not just the Replit dev preview. The dev preview does not replicate all hosting-layer behavior.

---

## 3. Environment Variables / Secrets

- All environment variables are configured in **Replit's Secrets panel** (UI). Do NOT use `.env` files for secrets — they will not work as expected in deployed environments.
- Secrets persist across deployments but **can be accidentally cleared by background tasks**. Always verify that existing secrets are still present after a task completes.
- The application reads from `process.env`. This works because Replit injects Secrets into the process environment at runtime.
- **Never hardcode secrets in source code.** The `.env.example` file documents required variables but contains only placeholder values.

**Critical secrets that MUST be configured in the Secrets panel:**

| Secret | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL (server-side) |
| `SUPABASE_ANON_KEY` | Supabase anon key (server-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) |
| `VITE_SUPABASE_URL` | Supabase project URL (injected into frontend build) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (injected into frontend build) |
| `DATABASE_URL` | Direct Postgres connection string |
| `STRIPE_SECRET_KEY` | Stripe API key |

---

## 4. Express Middleware Order

This is the **exact required middleware order** for the API server. Do not reorder these. When adding new middleware, insert it at the correct position in this chain.

```
1. helmet()                        — security headers (MUST be first)
2. Custom header middleware         — e.g., X-XSS-Protection: 0
3. Stripe webhook route             — express.raw() body parser, BEFORE express.json()
4. express.json()                  — JSON body parser
5. express.urlencoded()            — URL-encoded body parser
6. cookieParser()                  — cookie parsing
7. cors()                          — CORS with explicit origin allowlist
8. pinoHttp()                      — request logging
9. Global rate limiter
10. Routes
```

**Critical ordering constraints:**
- The Stripe webhook route **MUST** be registered before `express.json()`. If `express.json()` processes the body first, it will consume the raw bytes that Stripe's signature verification requires, causing all webhook signature checks to fail.
- Helmet **MUST** be first so that all API responses receive security headers.
- CORS must use `callback(null, false)` to reject disallowed origins — never `callback(new Error(...))`, which causes unhandled errors and 500 responses to the client.

---

## 5. Authentication Architecture

**Primary auth — Supabase JWT:**
The `requireAuth` middleware verifies Bearer tokens via `supabase.auth.getUser(token)` and populates `req.userId` and `req.userRole` on the request object. All standard protected routes use this middleware.

**Upload-token auth — file upload route:**
The route `POST /api/qb/orders/:id/files` supports an alternative auth path via `x-upload-token` header or `uploadToken` query param. This is **intentional design** — do NOT add `requireAuth` to this route. It handles its own token verification internally.

**Per-user rate limiters:**
`orderLimiter`, `ticketLimiter`, and similar per-user limiters MUST use:
```js
keyGenerator: (req) => req.userId || req.ip
```
This handles both auth paths. When `req.userId` is not populated (e.g., upload-token path), the limiter falls back to IP-based keying.

**Rate limiter placement:**
Rate limiters for authenticated routes MUST be applied **after** `requireAuth` in the middleware chain so that `req.userId` is already populated when the key generator runs.

---

## 6. Common Anti-Patterns (DO NOT DO THESE)

**Module initialization:**
- DO NOT use `throw new Error()` for missing environment variables at module load time. This crashes the entire server on startup, even if the missing variable is for an optional or rarely-used feature. Instead, use `console.warn()` and set the export to `null`. Add a runtime 503 check inside the relevant route handlers.

**Supabase user lookup:**
- DO NOT use `supabase.auth.admin.listUsers()` to find a single user — it fetches all users and filters in memory, which is slow and wasteful. Use `supabase.auth.admin.getUserByEmail(email)` for direct lookup.

**CORS origin rejection:**
- DO NOT use `callback(new Error("Not allowed by CORS"))` in the CORS origin function. Use `callback(null, false)` to reject the origin silently. Throwing inside the origin function causes Express to emit an unhandled error, resulting in a 500 response instead of a proper CORS rejection.

**Static file serving:**
- DO NOT add `express.static()` to the API server. Replit handles static file serving via its own infrastructure. Adding `express.static()` to Express creates routing conflicts and will never be reached for the paths it targets.

**HSTS / Helmet:**
- DO NOT configure `hsts` in Helmet. Replit's hosting layer already adds HSTS headers. Configuring both results in duplicate `strict-transport-security` headers.

**Webhook body parsing:**
- DO NOT assume `req.body` is always a string in webhook handlers. The body may arrive as a `Buffer` depending on the body parser configuration. Always handle both cases:
  ```js
  const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf-8") : req.body;
  ```

**X-XSS-Protection header:**
- DO NOT use `xssFilter: false` in Helmet and assume it emits `X-XSS-Protection: 0`. Setting `xssFilter: false` **disables the module entirely** — it does not emit the header with value `0`. To explicitly send `X-XSS-Protection: 0`, add a separate middleware after Helmet:
  ```js
  app.use((_req, res, next) => {
    res.setHeader("X-XSS-Protection", "0");
    next();
  });
  ```

---

## 7. Post-Implementation Verification

After completing any task, run through this checklist before marking the task done.

**1. TypeScript — zero errors:**
```bash
pnpm typecheck
```
Fix all errors before proceeding. Do not suppress errors with `// @ts-ignore` unless there is a documented reason.

**2. Secrets verification:**
Open the Replit Secrets panel and confirm all required secrets listed in Section 3 are still present. Background tasks can accidentally clear secrets.

**3. Live preview verification:**
Open the Replit preview and confirm:
- Main site loads at `/`
- QB Portal loads at `/qb-portal/`
- API healthcheck at `/api/healthz` returns HTTP 200

**4. Auth flow (if the task touched auth):**
Verify the login flow works end-to-end in the preview. Check both the NexFortis and QB Portal login paths if either was modified.

**5. CORS (if the task touched CORS config or added new origins):**
```bash
curl -X OPTIONS [endpoint] -H "Origin: https://example.com" -v
```
Verify the response is a proper CORS rejection (no `Access-Control-Allow-Origin` header for disallowed origins) and that no 500 errors occur.

**6. Rate limiting (if the task touched rate limiters or auth middleware):**
Review the middleware chain order and confirm that rate limiters for authenticated routes are registered **after** `requireAuth`. Check that `keyGenerator` falls back to `req.ip` for unauthenticated paths.
