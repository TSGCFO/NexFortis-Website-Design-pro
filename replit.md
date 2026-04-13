# Overview

This is a pnpm workspace monorepo using TypeScript, designed to manage multiple related applications and shared libraries. The project delivers NexFortis IT Solutions' web presence: a corporate website, a QuickBooks service portal, and an Express API backend.

## User Preferences

I prefer concise and clear explanations. When making changes, please prioritize iterative development and ask for confirmation before implementing major architectural shifts. Do not make changes to files in the `docs/` directory.

## Current Project State (April 2026)

The monorepo is functionally running in Replit with two frontends and one API server. The project is now entering a structured implementation phase to launch the QB Portal as a production-ready product.

**What exists and works:**
- QB Portal: Auth (login/register), product catalog (54 products — being replaced with 20), order flow with Stripe (test mode), .QBM file upload, waitlist, FAQ, QBM guide, client portal, support tickets (basic create/list)
- Main Site: All pages complete, blog with admin (no auth), contact form (email via Resend when configured), privacy & terms pages, SEO with react-helmet-async
- API: Express 5 server with QB auth, orders, tickets, blog CRUD, contact form, file uploads

**What needs to be built (see `docs/implementation-plan.md` for full gap analysis):**
- Product catalog overhaul: 54 → 20 products with new pricing schema
- SEO foundation for QB Portal (no react-helmet, no sitemap, no robots.txt, no meta tags)
- Email references: 4 instances of `hassansadiq73@gmail.com` must become `support@nexfortis.com`
- Admin/operator role and panel (no admin auth, no admin routes, no admin UI)
- Support subscription system (no subscription billing, no SLA, no ticket counting)
- Promo code system (no promo codes, no discount mechanism)
- Stripe subscriptions (only one-time payments exist)
- SEO landing pages (none exist for QB Portal)
- Main site fixes: blog admin auth, GA4, QB Portal link update, misc cleanup

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

**Database Schema (current — 6 tables in `lib/db/`):**
- `qb_users` — User accounts (email, password hash, name). No `role` column yet.
- `qb_orders` — Orders with Stripe session ID, status, total_cad (integer cents)
- `qb_order_items` — Line items per order
- `qb_uploaded_files` — Customer file uploads (.qbm)
- `qb_support_tickets` — Basic tickets (subject, message, status). No priority, SLA, or reply.
- `qb_waitlist` — Waitlist signups (email, product interest)

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
- **Products**: Catalog lives in `artifacts/qb-portal/public/products.json`. After the catalog overhaul (Prompt 01), this file will contain exactly 20 products with `base_price_cad`, `launch_price_cad`, and a top-level `promo_active` flag.

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

Work is being done through a sequence of 15 prompts. Each prompt = one feature branch = one PR. See `docs/implementation-plan.md` for the full sequence and dependency graph.

**Branch naming convention:** `feat/{descriptive-name}` (e.g., `feat/foundation-catalog-email-seo`)

**Each PR must:**
1. Start from latest `main`
2. Create a new feature branch
3. Reference the relevant PRDs in `docs/prd/`
4. Run `pnpm typecheck` with no errors
5. Verify changes work in the Replit preview
6. Commit with a descriptive message
7. Push and create a PR against `main`
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
