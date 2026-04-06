# Overview

This is a pnpm workspace monorepo using TypeScript, designed to manage multiple related applications and shared libraries. The project aims to deliver a comprehensive suite of IT solutions, including a business website, a QuickBooks service portal, and a robust API backend.

## User Preferences

I prefer concise and clear explanations. When making changes, please prioritize iterative development and ask for confirmation before implementing major architectural shifts. Do not make changes to files in the `docs/` directory.

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

**TypeScript and Composite Projects:**
All packages extend a base `tsconfig.base.json` with `composite: true`. The root `tsconfig.json` lists all packages as project references, enabling root-level type-checking and efficient build ordering. Type declaration files (`.d.ts`) are emitted during type-checking, while actual JavaScript bundling is handled by esbuild/Vite.

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

### Express API Server (`artifacts/api-server`)
- **Framework**: Express 5
- **Routes**:
    - `GET /api/healthz`
    - Blog CRUD operations (`/api/blog/posts`)
    - Contact form submission (`POST /api/contact`)
    - QB Portal backend logic (`/api/qb/*` for auth, waitlist, orders, support tickets)
- **Data Persistence**: Uses `@workspace/db` for database interactions.
- **Validation**: Leverages `@workspace/api-zod` for request and response validation.
- **Env vars**: `RESEND_API_KEY` (optional) — when set, the `/api/contact` route sends form submissions via Resend email API to contact@nexfortis.com. When not set, submissions are logged to server console and a 200 response is returned. To enable email delivery: create a Resend account, get an API key, and set it as the `RESEND_API_KEY` environment secret.

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