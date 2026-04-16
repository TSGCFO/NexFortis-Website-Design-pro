# Overview

This pnpm workspace monorepo, built with TypeScript, provides NexFortis IT Solutions' comprehensive web presence. It includes a corporate website, a QuickBooks service portal, and an Express API backend. The project focuses on offering specialized QuickBooks Desktop services with a primary revenue product being the QB Portal. Key capabilities include user authentication (Supabase), product catalog with Stripe integration, order management, support ticketing, and robust security measures (MFA, Helmet, rate limiting). The business vision is to deliver a competitive online platform for QuickBooks services, with a strategic pricing model and a clear roadmap for feature expansion.

# User Preferences

I prefer concise and clear explanations. When making changes, please prioritize iterative development and ask for confirmation before implementing major architectural shifts. Do not make changes to files in the `docs/` directory.

**Project-specific rules (MUST follow):**
- Do NOT add `requireAuth` to the file upload route `POST /api/qb/orders/:id/files` — it intentionally supports upload-token auth via `x-upload-token` header as an alternative to Bearer auth.
- Rate limiter `keyGenerator` for authenticated routes must be `(req) => req.userId || ipKeyGenerator(req)` — uses `ipKeyGenerator` from `express-rate-limit` for IPv6 safety, falls back to IP when no userId (upload-token path).
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
Includes tables for `qb_users` (with `stripe_customer_id`), `qb_orders`, `qb_order_files`, `qb_support_tickets` (with subscription-aware columns: `subscription_id`, `tier_at_submission`, `is_critical`, `sla_deadline`, `first_response_at`, `operator_reply`, `internal_note`, `attachment_path`, `is_after_hours`), `qb_ticket_replies` (conversation thread: `ticket_id`, `sender_id`, `sender_role` customer/operator/internal, `message`, `attachment_path`), `qb_notification_events` (notification log: `event_type`, `ticket_id`, `user_id`, `payload`, `sent_at`), `qb_waitlist_signups`, `qb_subscriptions` (3 tiers: essentials/professional/premium), `qb_ticket_usage` (per-cycle tracking), `qb_referrals`, and `qb_referral_events`.

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
- **Features**: Product catalog (`public/products.json` with 20 products across 5 categories), dynamic order flow with per-product file type validation, volume pack and subscription flows (no file upload), bundle handling, waitlist, FAQ, QBM guide, client portal, Stripe integration (test mode). Subscription frontend with public landing page (`/subscription`), portal Subscription tab with management actions (upgrade/downgrade/cancel/reactivate), enhanced ticket form (subscription-aware with file attachments, critical flag), TierBadge component.
- **File Storage**: Supabase Storage (`order-files` bucket) with memoryStorage multer, magic byte validation for QBM files (OLE2 header), signed download URLs (1hr customer, 15min operator), 7-day auto-deletion cron via pg_cron. Graceful degradation via `isStorageAvailable()` flag.
- **Auth**: Supabase Auth (email/password, Google/Microsoft OAuth) with JWT Bearer tokens. Social login redirects to `/auth/callback`. MFA (TOTP) required for operator access (AAL2 enforcement).
- **API**: Dedicated routes at `/api/qb/` for orders, files, checkout, webhooks, support tickets, waitlist, and user management. Status transitions enforced: `pending_payment → paid → processing → completed`.
- **Upload Security**: Upload token transmitted via `X-Upload-Token` header only (no query parameter). File validation includes extension check against product's `accepted_file_types` and QBM magic byte verification.

### Express API Server (`artifacts/api-server`)
- **Framework**: Express 5
- **Routes**: `GET /api/healthz`, Blog CRUD, Contact form submission (`POST /api/contact`), QB Portal backend logic (`/api/qb/*`), Subscription routes (`/api/qb/subscriptions/*` — checkout, me, upgrade, downgrade, cancel, reactivate), Ticket routes (`/api/qb/tickets/*` — create with attachment, list, get by ID, POST/GET replies with role-based filtering), Admin routes (`/api/qb/admin/*` — dashboard stats, orders list/detail/status, customers list, file download/upload, subscriptions list/detail, tickets list/stats/detail/reply/status with filtering/pagination).
- **Ticket Thread System**: Full conversation threads via `qb_ticket_replies` table. Customer replies visible to both sides; operator replies visible to customers (labeled "NexFortis Support"); internal notes (`senderRole: "internal"`) filtered out for customer callers. Customer ticket endpoints whitelist safe fields (no `internalNote`, `operatorReply`, `attachmentPath` leaked). Status transitions: open↔in_progress↔resolved↔closed with validation. SLA timers with business-hours calculation. Notification events logged via `emitTicketNotification` with Resend email delivery for ticket_created, operator_replied, and ticket_resolved events. Customer notification preferences with unsubscribe support.
- **Admin Panel**: Full operator admin panel at `/qb-portal/admin/*` with sidebar navigation (Dashboard, Orders, Customers, Tickets). All admin API routes use `requireAuth, requireOperator` middleware chain. Admin layout includes AAL2 guard, mobile-responsive collapsible sidebar, and navy/rose-gold palette. Admin link in customer header visible only when `isOperator === true`. Customer header hidden on admin routes.
- **Subscription System**: 3 tiers (Essentials $49/mo, Professional $99/mo, Premium $149/mo) with per-cycle ticket limits (3/8/unlimited), SLA deadlines (60/60/30 min), subscriber discounts (0%/10%/20%), business-hours SLA calculation (Mon-Fri 9am-5pm ET), referral codes for Premium. Stripe setup script at `artifacts/api-server/src/scripts/setup-stripe-subscriptions.ts`.
- **Data Persistence**: Uses `@workspace/db`.
- **Validation**: Leverages `@workspace/api-zod`.
- **Email**: Resend integration for contact form submissions and ticket event notifications (ticket_created, operator_replied, ticket_resolved). Branded HTML email templates with NexFortis styling. Notification preferences with per-type opt-out and unsubscribe token management via `qb_notification_preferences` table. Preference endpoints at `/api/qb/notifications/preferences`.

**Replit Platform Constraints & Implementation Rules:**
- **Static File Serving**: Replit's multi-artifact routing serves static files directly; Express middleware does not apply to them.
- **Hosting Layer**: Replit adds `strict-transport-security` (HSTS) headers; Helmet's HSTS should be disabled to avoid duplicates.
- **Environment Variables**: Managed via Replit's Secrets panel; `.env` files are not used.
- **Express Middleware Order**: Strict order for security, body parsing, CORS, logging, and rate limiting. Stripe webhook route must precede `express.json()`.
- **Authentication**: `requireAuth` middleware for Supabase JWT verification; special `X-Upload-Token` header auth for file uploads (no query param fallback). Per-user rate limiters use `req.userId || req.ip`.
- **Anti-Patterns**: Avoid throwing errors for missing optional environment variables at module load (use console.warn + null), using `supabase.auth.admin.listUsers()` for single user lookups, `new Error()` in CORS callbacks, `express.static()` on the API server, `hsts` in Helmet, and incorrect webhook body parsing.

# External Dependencies

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth (@supabase/supabase-js)
- **Security**: Helmet, express-rate-limit, sanitize-html, CORS
- **File Uploads**: multer (memoryStorage), Supabase Storage
- **Payment Processing**: Stripe
- **Email Sending**: Resend (optional)
- **API Definition**: OpenAPI 3.1
- **Icons**: Lucide React
- **UI Animations**: Framer Motion
- **HMR Stability**: Custom `stableHmr` Vite plugin (`lib/vite-plugin-stable-hmr.ts`) prevents full-page reloads caused by WebSocket disconnections through the Replit proxy