# Overview

This pnpm workspace monorepo, built with TypeScript, provides NexFortis IT Solutions' comprehensive web presence. It includes a corporate website, a QuickBooks service portal, and an Express API backend. The project focuses on offering specialized QuickBooks Desktop services with a primary revenue product being the QB Portal. Key capabilities include user authentication (Supabase), product catalog with Stripe integration, order management, support ticketing, and robust security measures (MFA, Helmet, rate limiting). The business vision is to deliver a competitive online platform for QuickBooks services, with a strategic pricing model and a clear roadmap for feature expansion.

# User Preferences

I prefer concise and clear explanations. When making changes, please prioritize iterative development and ask for confirmation before implementing major architectural shifts. Do not make changes to files in the `docs/` directory.

**Project-specific rules (MUST follow):**
- Do NOT add `requireAuth` to the file upload route `POST /api/qb/orders/:id/files` — it intentionally supports upload-token auth via `x-upload-token` header as an alternative to Bearer auth.
- Rate limiter `keyGenerator` for authenticated routes must be `(req) => req.userId || req.ip` — falls back to IP when no userId (upload-token path).
- Rate limiters for authenticated routes must be applied AFTER `requireAuth` in the middleware chain.
- Do NOT use `supabase.auth.admin.listUsers()` to find a single user — use `getUserByEmail(email)` for direct lookup.
- Do NOT use `throw new Error()` for missing env vars at module load time — use `console.warn()` and set the export to null. Add 503 checks in route handlers.
- Do NOT use `callback(new Error(...))` in the CORS origin function — use `callback(null, false)`.
- Helmet config must set `hsts: false` (hosting layer handles HSTS) and `xssFilter: false` plus a separate middleware for `X-XSS-Protection: 0`.
- Stripe webhook route must be registered BEFORE `express.json()` middleware.
- For missing optional service credentials (Supabase, Stripe): warn in dev, reject in production (`NODE_ENV === 'production'`).
- All prices are in CAD cents (14900 = $149.00). Base prices 15-20% below competitors, 50% launch promo.
- After completing any task, verify Replit Secrets are still present and run `pnpm typecheck` with zero errors.

# System Architecture

The monorepo is structured into `artifacts/` for deployable applications and `lib/` for shared libraries, leveraging pnpm workspaces, Node.js 24, and TypeScript 5.9.

**Core Technologies:**
- **API Framework**: Express 5
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod (v4)
- **API Codegen**: Orval (from OpenAPI spec)
- **Build Tool**: esbuild (for CJS bundles)

**Monorepo Structure:**
- `artifacts/`: Contains `api-server`, `nexfortis` (React + Vite website), `qb-portal` (React + Vite QuickBooks portal).
- `lib/`: Houses shared libraries like `api-spec`, `api-client-react`, `api-zod`, and `db`.
- `docs/`: Contains PRDs and implementation plans; **must not be modified**.

**TypeScript and Composite Projects:**
All packages extend a base `tsconfig.base.json` with `composite: true`, enabling root-level type-checking and efficient build processes.

**Database Schema (Drizzle ORM):**
Includes tables for `qb_users`, `qb_orders`, `qb_order_files`, `qb_support_tickets`, and `qb_waitlist_signups`.

**Applications:**

### NexFortis IT Solutions Website (`artifacts/nexfortis`)
- **Framework**: React 19 + Vite + Tailwind CSS v4
- **UI/UX**: Framer Motion for animations, React Hook Form + Zod for forms, Wouter for routing.
- **SEO**: `react-helmet-async`, `robots.txt`, `sitemap.xml`.
- **Performance**: Code splitting, dynamic imports, WebP images, self-hosted fonts, PWA manifest.
- **Accessibility**: Comprehensive UI/UX audit, ARIA labeling, reduced-motion support.

### QuickBooks Service Portal (`artifacts/qb-portal`)
- **Framework**: React 19 + Vite + Tailwind CSS v4
- **Routing**: Wouter
- **Design Language**: NexFortis brand-consistent design with specific color palette (navy, azure, rose-gold), Inter and Alegreya Sans SC fonts, dark mode support, glassmorphism, sticky scroll-aware navbar, and branded footer.
- **Features**: Product catalog (`public/products.json` with 20 products), order flow with .qbm file upload (500MB limit via Multer), waitlist, FAQ, QBM guide, client portal, Stripe integration (test mode).
- **Auth**: Supabase Auth (email/password, Google/Microsoft OAuth) with JWT Bearer tokens. Social login redirects to `/auth/callback`.
- **API**: Dedicated routes at `/api/qb/` for various functionalities.

### Express API Server (`artifacts/api-server`)
- **Framework**: Express 5
- **Routes**: `GET /api/healthz`, Blog CRUD, Contact form submission (`POST /api/contact`), QB Portal backend logic (`/api/qb/*`).
- **Data Persistence**: Uses `@workspace/db`.
- **Validation**: Leverages `@workspace/api-zod`.
- **Email**: Optional Resend integration for contact form submissions.

**Replit Platform Constraints & Implementation Rules:**
- **Static File Serving**: Replit's multi-artifact routing serves static files directly; Express middleware does not apply to them.
- **Hosting Layer**: Replit adds `strict-transport-security` (HSTS) headers; Helmet's HSTS should be disabled to avoid duplicates.
- **Environment Variables**: Managed via Replit's Secrets panel; `.env` files are not used.
- **Express Middleware Order**: Strict order for security, body parsing, CORS, logging, and rate limiting. Stripe webhook route must precede `express.json()`.
- **Authentication**: `requireAuth` middleware for Supabase JWT verification; special `x-upload-token` auth for file uploads. Per-user rate limiters use `req.userId || req.ip`.
- **Anti-Patterns**: Avoid throwing errors for missing optional environment variables at module load, using `supabase.auth.admin.listUsers()` for single user lookups, `new Error()` in CORS callbacks, `express.static()` on the API server, `hsts` in Helmet, and incorrect webhook body parsing.

# External Dependencies

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth (@supabase/supabase-js)
- **Security**: Helmet, express-rate-limit, sanitize-html, CORS
- **File Uploads**: multer
- **Payment Processing**: Stripe
- **Email Sending**: Resend (optional)
- **API Definition**: OpenAPI 3.1
- **Icons**: Lucide React
- **UI Animations**: Framer Motion