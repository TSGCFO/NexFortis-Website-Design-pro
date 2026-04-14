# Overview

This is a pnpm workspace monorepo using TypeScript, designed to manage multiple related applications and shared libraries. The project delivers NexFortis IT Solutions' web presence: a corporate website, a QuickBooks service portal, and an Express API backend.

## User Preferences

I prefer concise and clear explanations. When making changes, please prioritize iterative development and ask for confirmation before implementing major architectural shifts. Do not make changes to files in the `docs/` directory.

## Current Project State (April 14, 2026)

The monorepo is functionally running in Replit with two frontends and one API server. The project is in active implementation — Prompt 01 is complete (PR #2 + PR #3 merged).

**What exists and works (after PR #2 and #3):**
- QB Portal: Auth (login/register), product catalog (20 products across 5 categories with `base_price_cad`/`launch_price_cad`/`promo_active` schema), order flow with Stripe (test mode), .QBM file upload, waitlist, FAQ (rewritten for 20-product catalog), QBM guide, client portal, support tickets (basic create/list), SEO foundation (react-helmet-async, robots.txt, sitemap.xml, per-page meta tags, OG tags)
- Main Site: All pages complete, blog with admin (no auth), contact form (email via Resend when configured), privacy & terms pages, SEO with react-helmet-async
- API: Express 5 server with QB auth, orders, tickets, blog CRUD, contact form, file uploads
- Email: All 4 instances of `hassansadiq73@gmail.com` replaced with `support@nexfortis.com`

**What still needs to be built (see `docs/implementation-plan.md` for full gap analysis):**
- Catalog UI enhancements: promo badges, /mo pricing for subscriptions, per-conversion rates for volume packs, FAQ filter tabs
- Admin/operator role and panel (no role column on qb_users yet, no admin auth, no admin routes, no admin UI)
- Support subscription system (no subscription billing, no SLA, no ticket counting)
- Promo code system (no promo codes, no discount mechanism)
- Stripe subscriptions (only one-time payments exist)
- Order flow updates for new product IDs, file types per service, volume packs
- SEO landing pages (none exist for QB Portal beyond the foundation)
- Main site fixes: blog admin auth, GA4, QB Portal link update, misc cleanup
- Transactional emails, security hardening, production polish

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

**Database Schema (current — 6 tables in `lib/db/src/schema/qb-portal.ts`):**
- `qb_users` — User accounts (email, password_hash, name, phone). No `role` column yet (added in Prompt 03).
- `qb_orders` — Orders with service_id, service_name, addons (JSON string), total_cad (integer cents), status, stripe_session_id, upload_token
- `qb_order_files` — File uploads per order (file_type, file_name, storage_path, file_size_bytes)
- `qb_support_tickets` — Basic tickets (user_id, subject, message, status). No priority, SLA, or reply.
- `qb_waitlist_signups` — Waitlist signups (email, product_id, product_name) with unique constraint on email+product
- `qb_password_resets` — Password reset tokens (user_id, token_hash, used, expires_at)

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
- **Auth**: bcrypt password hashing, HMAC-signed tokens, httpOnly session cookies, rate-limited login.
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

# External Dependencies

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: bcrypt
- **File Uploads**: multer
- **Payment Processing**: Stripe
- **Email Sending**: Resend (optional, falls back to logging if not configured)
- **API Definition**: OpenAPI 3.1
- **Icons**: Lucide React
- **UI Animations**: Framer Motion
