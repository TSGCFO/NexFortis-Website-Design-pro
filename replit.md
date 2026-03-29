# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (bcrypt, multer, stripe, cookie-parser)
│   ├── nexfortis/          # NexFortis IT Solutions website (React + Vite)
│   ├── qb-portal/          # QuickBooks Service Portal (React + Vite) at /qb-portal/
│   └── mockup-sandbox/     # Design prototyping sandbox
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/nexfortis` (`@workspace/nexfortis`)

NexFortis IT Solutions — complete business website for a Canadian IT solutions company.

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Routing**: Wouter
- **SEO**: react-helmet-async (meta tags, Open Graph, JSON-LD structured data)
- **Theme**: Dark/Light/System toggle with localStorage persistence
- **Pages**:
  - `/` — Home page with hero, services grid, differentiators, testimonials, CTA
  - `/about` — About Us with company story, values, team
  - `/services` — Services overview grid
  - `/services/digital-marketing` — Digital Marketing services (hero, features, process steps, CTA)
  - `/services/microsoft-365` — Microsoft 365 / M365 Partner services + pricing table + migration process
  - `/services/quickbooks` — QuickBooks migration + add-on product catalog
  - `/services/it-consulting` — IT Consulting & Project Management (alternating sections, stats)
  - `/services/automation-software` — Workflow Automation & Custom Software (capabilities, use cases, tech stack)
  - `/contact` — Contact form + info + map placeholder
  - `/blog` — Blog listing (DB-backed, fallback to static posts)
  - `/blog/:slug` — Individual blog post page
  - `/blog/admin` — Blog CMS admin panel (create/edit/delete/publish posts)
  - `/privacy` — Privacy Policy placeholder
  - `/terms` — Terms of Service placeholder
- **Brand**: Dark navy (#1a2744) + teal (#00b4d8) + gold (#f77f00)
- **Company**: 17756968 Canada Inc., 204 Hill Farm Rd, Nobleton, ON L7B 0A1
- **Logo**: PNG versions in `public/images/` (logo-original.png for light mode, logo-white.png for dark mode/footer)
- Floating "Request a Quote" CTA button on all service pages
- **Theme System**: ThemeProvider in `src/hooks/use-theme.tsx`, toggle in navbar (Sun/Moon/Monitor icons), CSS variables in `.dark` class
- **SEO**:
  - Per-page meta tags (title, description, canonical, OG, Twitter) via React Helmet in `src/components/seo.tsx`
  - Static fallback meta tags, OG tags, and JSON-LD in `index.html` for non-JS crawlers
  - `robots.txt` and `sitemap.xml` in `public/`
  - Schemas: Organization, LocalBusiness (Nobleton, ON), WebSite (SearchAction), Service, BreadcrumbList, FAQPage, Article
  - `hreflang="en-CA"` and `x-default` on all pages
  - Dynamic URL resolution via `getSiteUrl()` — works on replit.app, custom domains, and production
  - Geo meta tags (`geo.region: CA-ON`, `geo.placename: Nobleton`)
  - All schema URLs use relative paths resolved to absolute at runtime
  - Blog admin and 404 pages have `noIndex` set
- **Accessibility (UI/UX Pro Max audit applied)**:
  - Skip-to-content link for keyboard navigation
  - Active nav state indicators (teal highlight + underline)
  - Full ARIA labeling: aria-labels on icon buttons, aria-expanded on mobile menu, aria-current on active nav
  - Form accessibility: htmlFor/id associations, type="tel"/"email", aria-invalid, role="alert" on errors, autoComplete attributes
  - Services dropdown: keyboard-accessible (focus opens, Escape closes, proper blur handling)
  - Reduced-motion: CSS `prefers-reduced-motion` + Framer Motion `MotionConfig reducedMotion="user"`
  - Consistent focus-visible outlines (2px teal)
  - Semantic HTML: `<article>` for blog cards, `<address>` for contact info, `<time>` for dates, table `scope`/`caption`
  - Images: loading="lazy" on below-fold, width/height attributes for CLS prevention
  - Touch targets: min-h-[44px] on all mobile interactive elements
  - Animation durations optimized to 200-400ms range with easeOut curves
  - Footer contact links are clickable mailto:/tel: links

### `artifacts/qb-portal` (`@workspace/qb-portal`)

NexFortis QuickBooks Service Portal — standalone web app for QB conversion, migration, and data services.

- **Framework**: React 19 + Vite + Tailwind CSS v4
- **Routing**: Wouter
- **Preview path**: `/qb-portal/`
- **Brand**: Navy (#1a2744), Gold (#f0a500), trust-first design (light backgrounds, security signals)
- **Products**: 54 products/services defined in `public/products.json` (4 Tier 1 available, 26 Tier 2 coming-soon services, 24 Tier 3 coming-soon tools)
- **Pages**:
  - `/` — Home/landing with hero, trust badges, how-it-works, competitor comparison, featured services
  - `/catalog` — Full 54-product catalog with category filtering and search
  - `/order` — Order flow: service selection, add-ons, .qbm file upload, QB version, price calculator, Stripe placeholder
  - `/waitlist` — Database-backed waitlist signup with duplicate prevention (reads product from URL param)
  - `/faq` — 30-entry FAQ with category filtering
  - `/qbm-guide` — Step-by-step guide to creating .QBM files
  - `/terms` — Terms of Service (Ontario law, all 54 products)
  - `/privacy` — Privacy Policy (PIPEDA compliant)
  - `/service/:slug` — Individual service/product detail page with pricing, add-ons, trust badges
  - `/category/:slug` — Category landing page showing all products in a category
  - `/login` — User login with forgot password link
  - `/register` — User registration
  - `/forgot-password` — Password reset request (sends token to server log)
  - `/reset-password` — Password reset confirmation (via token URL param)
  - `/portal` — Client portal with dashboard, orders, files, settings, support tickets
- **Auth**: bcrypt (12 rounds) password hashing, rate-limited login, HMAC-signed tokens with expiry (7d), httpOnly session cookies (`qb_session` at path `/api/qb`), bearer header fallback
- **Checkout**: Server-side pricing from `products.json` (single source of truth in `qb-portal/public/`), Stripe test-mode integration with webhook signature verification, graceful simulated fallback when unconfigured
- **File Upload**: multer (500MB limit, .qbm-only), disk storage in `uploads/`, per-order upload tokens for guest access
- **File Download**: Authorized download endpoint at `/api/qb/orders/:id/files/:fileId/download` — auth via cookie/bearer or uploadToken query param
- **Guest Order Lookup**: `/api/qb/orders/lookup?orderId=&uploadToken=` for post-Stripe payment confirmation
- **API**: Routes at `/api/qb/` — auth/register, auth/login, auth/logout, auth/forgot-password, auth/reset-password, me, me/password, waitlist, orders, orders/lookup, checkout/create-session, orders/:id/files, orders/:id/files/:fileId/download, support-tickets, stripe/webhook
- **Env vars**: `QB_TOKEN_SECRET` (stable sessions), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Operator docs**: `docs/operator_runbook.md`, `docs/email_templates.md`

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers
  - `src/routes/health.ts` — `GET /api/health`
  - `src/routes/blog.ts` — Blog CRUD: `GET /api/blog/posts`, `GET /api/blog/posts/all`, `GET /api/blog/posts/:slug`, `POST /api/blog/posts`, `PUT /api/blog/posts/:id`, `DELETE /api/blog/posts/:id`
  - `src/routes/qb-portal.ts` — QB Portal: `POST /api/qb/auth/register`, `POST /api/qb/auth/login`, `POST /api/qb/waitlist`, `POST /api/qb/orders`, `POST /api/qb/support-tickets`
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/blog-posts.ts` — blog_posts table (id, title, slug, excerpt, content, category, coverImage, published, createdAt, updatedAt)
- `src/schema/qb-portal.ts` — QB Portal tables: qb_users, qb_orders, qb_order_files, qb_waitlist_signups (unique on email+productId), qb_support_tickets, qb_password_resets
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
