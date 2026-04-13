# Master PRD: QB Portal Production Launch

**Document type:** Master PRD (Top-Level Epic)
**Portal:** qb.nexfortis.com
**Company:** 17756968 Canada Inc. (NexFortis)
**Owner/Operator:** Hassan Sadiq
**Status:** In Progress — 80% Complete
**Document version:** 1.0
**Last updated:** March 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [User Experience & Functionality](#2-user-experience--functionality)
3. [Technical Specifications](#3-technical-specifications)
4. [Risks & Roadmap](#4-risks--roadmap)
5. [Feature Dependency Map](#5-feature-dependency-map)
6. [Pre-Launch Checklist](#6-pre-launch-checklist)
7. [Feature PRD Index](#7-feature-prd-index)

---

## 1. Executive Summary

### 1.1 Problem Statement

NexFortis has built a QuickBooks Desktop conversion and data service business with a clear competitive advantage: 15–20% lower prices than the dominant Canadian competitor (E-Tech, $299–$450 USD) and sub-1-hour delivery versus their 1–3 business day standard. The QB Portal at qb.nexfortis.com is 80% complete but cannot go live in its current state. Critical gaps block production readiness: a 54-product catalog that includes deferred and non-deliverable items, Stripe in test mode with no live payment keys, a hardcoded personal email address in the footer, no transactional email pipeline, missing SEO infrastructure, no blog admin authentication, no operator admin panel, no GST/HST tax configuration, and no promo code system. The portal is not a prototype — it is 80% of a finished product that needs the remaining 20% executed cleanly to launch.

### 1.2 Proposed Solution

Complete and launch the QB Portal through a focused production hardening sprint covering five feature areas: (1) overhauling the product catalog to exactly 20 real, deliverable products with launch promotional pricing; (2) launching a standalone QB Expert Support Subscription (3 tiers, monthly recurring); (3) implementing a flexible promo code system at checkout; (4) building an operator admin panel so Hassan can manage orders, tickets, customers, and promos without CLI database commands; and (5) deploying SEO landing pages to capture high-intent Canadian QuickBooks Desktop search traffic. Alongside these features, a pre-launch hardening checklist ensures Stripe live mode, transactional email, SSL/DNS, legal pages, and security reviews are complete before any traffic is accepted.

### 1.3 Success Criteria

The following KPIs define a successful production launch. Measurement begins on the first day of live traffic.

| # | KPI | Target | Measurement Method |
|---|-----|--------|--------------------|
| KPI-1 | **Revenue — First 30 Days** | ≥ $3,000 CAD gross revenue | Stripe dashboard |
| KPI-2 | **Order Volume — First 30 Days** | ≥ 20 completed orders | Orders table, `status = fulfilled` |
| KPI-3 | **Checkout Conversion Rate** | ≥ 12% of catalog page visitors complete a purchase | Analytics funnel (catalog → checkout → confirmation) |
| KPI-4 | **Conversion Turnaround SLA** | ≥ 95% of conversion orders fulfilled within 60 minutes of file receipt during business hours | Order timestamps: `file_received_at` → `delivered_at` |
| KPI-5 | **Support Subscription Acquisition** | ≥ 10 active subscribers within 60 days of launch | `subscriptions` table, `status = active` |
| KPI-6 | **Support SLA Compliance** | ≥ 95% of tickets responded within plan SLA during business hours | Ticket timestamps: `submitted_at` → `first_response_at` |
| KPI-7 | **Catalog Error Rate** | 0 orders for non-deliverable or incorrect products after launch | Order review; any mis-fulfillment = failure |
| KPI-8 | **Payment Success Rate** | ≥ 97% of attempted Stripe payments succeed (no live-mode configuration errors) | Stripe payment intent success rate |
| KPI-9 | **Page Performance** | Catalog page FCP ≤ 1.5 s on simulated 4G (Lighthouse) | Lighthouse CI |
| KPI-10 | **SEO Indexing** | All SEO landing pages indexed by Google within 30 days of launch | Google Search Console |

---

## 2. User Experience & Functionality

### 2.1 User Personas

#### Persona A — Small Business Owner (SBO)

A Canadian small business owner currently running QuickBooks Desktop Enterprise who needs to downgrade to Premier or Pro, clean up their file, or get ongoing expert support. Not technically sophisticated. Has one file, one job. Wants a clear price, a simple upload, and a fast result. Price-sensitive but trust-sensitive first — must feel the service is legitimate before entering payment details. Likely finds NexFortis via Google search for "QuickBooks Enterprise to Premier conversion Canada."

**Primary entry points:** Catalog, SEO landing pages, home page CTA
**Primary products:** Enterprise→Premier Standard, Data Services add-ons, Essentials Support Subscription

#### Persona B — Bookkeeper / Accountant (BA)

A Canadian bookkeeper or accounting professional managing 5–30+ client QuickBooks Desktop files. Understands the product deeply — knows what "audit trail removal" means, evaluates on price, turnaround, and reliability. Wants volume pricing, subscriber discounts, and a frictionless repeat-order experience. May purchase a 10-pack and draw it down over time. Actively compares NexFortis against E-Tech.

**Primary entry points:** Volume Packs, Support Subscription (Professional/Premium), direct catalog
**Primary products:** 5-Pack / 10-Pack Conversions, QB Expert Support Professional or Premium, Data Services

#### Persona C — Standalone QB Support Seeker

Uses QuickBooks Desktop but has no immediate conversion need. Found NexFortis through organic search for QB Desktop help, error codes, or support alternatives to Intuit's $74.99/incident pricing. No prior order history. Evaluates the Expert Support Subscription entirely on its own merits. The product must stand alone — no dependency on a prior conversion order.

**Primary entry points:** SEO landing pages, direct support subscription page
**Primary products:** QB Expert Support (any tier)

#### Persona D — Operator (Hassan Sadiq)

The sole internal operator who processes every order via CLI tool, responds to support tickets, runs file health check diagnostics, and manages the business. Needs an admin panel that surfaces orders, customer records, support tickets, and promo codes in a single interface without requiring direct database commands. Every minute saved in the fulfillment workflow directly improves the product's core SLA promise.

**Primary entry points:** Admin panel at `/admin` (authenticated)
**Primary tools:** Operator Admin Panel, Operator Runbook, CLI (`qb-convert`)

---

### 2.2 User Stories

The following are portal-level user stories that span multiple feature areas. Feature-specific stories are defined in each feature PRD.

#### Portal — Discovery & Trust

**US-P1:** As a Small Business Owner, I want to land on the QB portal home page and immediately understand what NexFortis does, what it costs, and how fast it delivers, so that I can decide within 30 seconds whether to proceed.

**US-P2:** As any visitor, I want to see real pricing in CAD (not USD) upfront, so that I don't feel deceived when I reach checkout.

**US-P3:** As any visitor, I want a clear FAQ that addresses my top concerns (data safety, file privacy, turnaround time, money-back guarantee) before I upload my file, so that I feel confident placing an order.

**US-P4:** As a Small Business Owner, I want SEO landing pages to appear when I search for specific QuickBooks problems (e.g., "QuickBooks Enterprise to Premier Canada"), so that I can find NexFortis organically and land on a page that speaks directly to my problem.

#### Portal — Ordering

**US-P5:** As any customer, I want to place an order as a guest without creating an account, so that the friction to my first purchase is as low as possible.

**US-P6:** As an authenticated customer, I want my order history, file upload receipts, and support tickets to all be accessible in one portal dashboard, so that I don't have to email to track my orders.

**US-P7:** As any customer, I want to receive an order confirmation email immediately after payment, with the file delivery timeline and a support contact, so that I know my order was received and what happens next.

**US-P8:** As a returning customer, I want to sign in and pre-fill my billing details, so that repeat orders take less than 2 minutes.

#### Portal — Support & Communication

**US-P9:** As any customer with a problem, I want to reach NexFortis via a clear support email or ticket system, so that I'm not emailing a personal Gmail address.

**US-P10:** As an operator (Hassan), I want all customer-facing communications to come from support@nexfortis.com — not hassansadiq73@gmail.com — so that NexFortis appears professional and emails don't land in spam.

#### Portal — Legal & Trust

**US-P11:** As any customer, I want to review a Privacy Policy before submitting a .QBM file, so that I understand how my financial data is handled and stored.

**US-P12:** As any customer, I want to review Terms of Service before completing a purchase, so that I understand my rights, the refund policy, and the data retention policy (7 days).

---

### 2.3 Acceptance Criteria

The following portal-level acceptance criteria must pass before any live traffic is accepted:

#### AC-P1: Professional Contact Information
- [ ] The string "hassansadiq73@gmail.com" MUST NOT appear anywhere in the rendered portal HTML, JavaScript bundles, or API responses visible to customers.
- [ ] All customer-facing contact references MUST use support@nexfortis.com.
- [ ] The footer, FAQ, order confirmation email, and error pages all reference support@nexfortis.com.

#### AC-P2: Guest Checkout
- [ ] A user can complete an order from catalog selection to Stripe payment confirmation without creating an account.
- [ ] Guest orders create an order record in the database with a guest identifier (email-based).
- [ ] Guest users receive an order confirmation email.

#### AC-P3: Authenticated Portal
- [ ] An authenticated user can view all their orders, file uploads, and support tickets in the customer portal.
- [ ] Registration, login, and password reset flows all function correctly in production (live Resend email delivery).
- [ ] Auth tokens are HMAC-signed and expire correctly.

#### AC-P4: Legal Pages
- [ ] `/privacy` renders a complete Privacy Policy including: data collected, data retention period (7 days for customer files), contact information, PIPEDA compliance statement.
- [ ] `/terms` renders a complete Terms of Service including: refund policy, service SLA expectations, file format requirements.
- [ ] Both pages are linked from the portal footer and from the checkout flow.

#### AC-P5: Payment Infrastructure
- [ ] All Stripe operations use live mode keys (not test keys).
- [ ] GST/HST is automatically calculated and collected via Stripe Tax for Canadian customers.
- [ ] Payment receipts and invoices are generated and emailed by Stripe on successful payment.
- [ ] Stripe webhooks are registered for the production endpoint (not localhost).

#### AC-P6: Email Infrastructure
- [ ] Resend API is configured with the production domain (nexfortis.com).
- [ ] Order confirmation emails are sent within 60 seconds of payment confirmation.
- [ ] All transactional emails are sent from support@nexfortis.com, not from Resend's default domain.
- [ ] Email delivery is logged. Failed sends are logged with the associated order/ticket ID.

#### AC-P7: SSL & DNS
- [ ] qb.nexfortis.com resolves to the production server with a valid TLS certificate.
- [ ] HTTP requests to qb.nexfortis.com redirect to HTTPS.
- [ ] The certificate covers qb.nexfortis.com (not just nexfortis.com).

#### AC-P8: Security
- [ ] File uploads are not publicly accessible via direct URL. Download requires authentication or signed URL.
- [ ] Blog admin routes (`/blog/admin` or equivalent) are protected by authentication. Unauthenticated access returns 401 or redirect to login.
- [ ] File upload server-side validation rejects files that do not match the expected format (magic byte inspection, not just extension).
- [ ] Customer files are deleted after 7 days per the privacy policy (manual process at launch, tracked in operator daily checklist).

---

### 2.4 Non-Goals (Portal Level)

The following are explicitly out of scope for the production launch. These are documented to protect timeline and prevent scope creep.

1. **Automated file processing pipeline.** All conversion and data service orders are processed manually by Hassan via CLI. Zero automation of the `qb-convert` CLI is in scope at launch.

2. **Accountant sub-portal / client management.** A dedicated accountant portal with multi-client file management, white-labeling, or sub-accounts is a v2 milestone. Accountants use the same portal as individual customers.

3. **QuickBooks Online services.** All products are QuickBooks Desktop–specific. QB Online migration, cleanup, or support is explicitly excluded.

4. **US dollar pricing or international customers.** All prices are CAD. Currency localization, US market targeting, and international shipping are deferred.

5. **Live chat or phone support.** All customer support is ticket-based (email via portal). No real-time support channel at launch.

6. **Annual subscription pricing.** Monthly billing only. Annual plans are a future consideration.

7. **Free trial tier.** The 50% off launch promotion (first 3 months on subscriptions) serves as the introductory offer. No separate free trial.

8. **Automated health check reporting.** The Operator manually runs CLI diagnostics and writes health check reports. No automation at launch.

9. **Multi-currency or multi-language.** English only. CAD only.

10. **Mobile app.** The portal is a responsive web application. No iOS or Android native app.

11. **Payroll, QB Online, or Intuit-hosted services.** NexFortis operates exclusively on QuickBooks Desktop company files. No Intuit API integration, no hosted QB subscriptions, no payroll services.

12. **Invoice/PO payment method.** Stripe card payment and volume pack credit redemption are the only payment methods at launch.

---

## 3. Technical Specifications

### 3.1 Architecture Overview

The QB Portal is a monorepo application hosted on Replit, organized into four main packages:

```
NexFortis-Website-Design-pro/
├── artifacts/
│   ├── qb-portal/          # React 19 + Vite 7 SPA (qb.nexfortis.com)
│   └── nexfortis/          # Corporate website (nexfortis.com) — 95% complete, separate deploy
│   └── api-server/         # Express 5 backend — shared by portal and corporate site
├── lib/
│   ├── db/                 # Drizzle ORM schema + migrations (PostgreSQL)
│   ├── api-spec/           # OpenAPI 3.1 specification
│   ├── api-zod/            # Generated Zod validation schemas
│   └── api-client-react/   # Generated React Query hooks
└── docs/
    └── prd/                # Product requirements documents
```

#### Data Flow — Customer Order

```
Customer (Browser)
  │
  ├─ [1] Browses catalog (React 19 SPA, Wouter routing)
  ├─ [2] Uploads .QBM file → POST /api/files (multer, 500MB limit)
  │        └─ Server validates: file extension + magic bytes
  │        └─ Stores file to server filesystem: C:\Projects\qb-orders\<order-id>\
  ├─ [3] Submits order → POST /api/orders
  │        └─ Validates product exists, add-ons valid, subscriber discount verified
  │        └─ Creates Stripe PaymentIntent (live mode, CAD, GST/HST via Stripe Tax)
  ├─ [4] Completes Stripe payment (Stripe Elements or Stripe Checkout)
  ├─ [5] Stripe fires webhook → POST /api/webhooks/stripe
  │        └─ Validates Stripe-Signature header
  │        └─ Updates order status: pending → paid
  │        └─ Triggers Resend email: order confirmation to customer
  │        └─ Triggers Resend email: new order notification to support@nexfortis.com
  │
Hassan (Operator)
  ├─ [6] Receives order notification email
  ├─ [7] Opens Admin Panel → views order details
  ├─ [8] Downloads .QBM file from Admin Panel
  ├─ [9] Runs CLI: qb-convert "input.qbm" --dry-run
  ├─ [10] Runs CLI: qb-convert "input.qbm" --output "converted.qbm" --report "report.html"
  ├─ [11] Emails customer: converted.qbm + report.html (Email Template #2)
  └─ [12] Updates order status in Admin Panel: paid → fulfilled
```

#### Data Flow — Support Subscription

```
Customer
  ├─ Visits /catalog/expert-support or /support
  ├─ Selects plan → Stripe Checkout (recurring, CAD, LAUNCH50 coupon applied)
  ├─ Stripe webhook: checkout.session.completed
  │    └─ Creates: subscriptions record, subscription_events record
  │    └─ Sends: subscription-welcome email (Resend)
  │    └─ If Premium: generates referral_code
  │
  ├─ Submits support ticket → POST /api/tickets
  │    └─ Validates: subscription active, ticket quota not exceeded
  │    └─ Creates ticket record (billing_period_start tracked)
  │    └─ If Critical: sends ticket-critical-ack email within 60s
  │    └─ Sends: ticket-operator-notify to support@nexfortis.com
  │
  └─ Uploads health check file → POST /api/health-checks
       └─ Marks health check entitlement used for billing period
       └─ Sends: health-check-operator-notify to support@nexfortis.com

Hassan
  ├─ Receives ticket notification → responds via email within SLA
  ├─ Runs CLI diagnostic on health check file
  └─ Uploads report via Admin Panel → marks health check complete
       └─ Sends: health-check-report-ready email to customer
```

#### Frontend Architecture

- **Framework:** React 19 with concurrent features
- **Build tool:** Vite 7
- **Styling:** Tailwind CSS v4 (JIT, CSS custom properties)
- **Routing:** Wouter (lightweight, no React Router dependency)
- **Animations:** Framer Motion
- **Components:** shadcn/ui (Radix UI primitives + Tailwind)
- **State management:** React Query (server state) + React Context (auth, cart)
- **Data fetching:** Generated React Query hooks from `lib/api-client-react`

**Current routes (16 built):**

| Route | Component | Status |
|-------|-----------|--------|
| `/` | Home | Built |
| `/catalog` | Product Catalog | Built — needs overhaul |
| `/catalog/:productId` | Service Detail | Built |
| `/order/:productId` | Order Form | Built |
| `/checkout` | Checkout | Built — needs add-on system |
| `/portal` | Customer Dashboard | Built |
| `/portal/orders` | Order History | Built |
| `/portal/files` | File Manager | Built |
| `/portal/settings` | Account Settings | Built |
| `/portal/support` | Support Tickets | Built |
| `/faq` | FAQ | Built |
| `/qbm-guide` | QBM Creation Guide | Built |
| `/auth/login` | Login | Built |
| `/auth/register` | Register | Built |
| `/auth/reset` | Password Reset | Built |
| `/blog` | Blog | Built — admin unprotected |

**New routes required at launch:**

| Route | Purpose | Feature PRD |
|-------|---------|-------------|
| `/admin` | Operator Admin Panel | Operator Admin Panel PRD |
| `/admin/orders` | Order management | Operator Admin Panel PRD |
| `/admin/customers` | Customer management | Operator Admin Panel PRD |
| `/admin/tickets` | Ticket management | Operator Admin Panel PRD |
| `/admin/promos` | Promo code management | Promo Code System PRD |
| `/privacy` | Privacy Policy | Pre-launch checklist |
| `/terms` | Terms of Service | Pre-launch checklist |
| `/support` | Expert Support Subscription landing | Expert Support PRD |
| `/landing/:slug` | SEO Landing Pages | SEO Landing Pages PRD |
| `/sitemap.xml` | XML Sitemap | SEO Landing Pages PRD |
| `/robots.txt` | Robots file | SEO Landing Pages PRD |

---

### 3.2 Integration Points

#### Stripe (Payments)

| Integration | Status | Action Required |
|-------------|--------|----------------|
| Test mode keys | ✅ Configured | Replace with live keys |
| PaymentIntent (one-time) | ✅ Built | Switch endpoint to live |
| Stripe Subscriptions (recurring) | 🔴 Not built | Build for Expert Support |
| Stripe Tax (GST/HST) | 🔴 Not configured | Enable in Stripe dashboard, CAD |
| Stripe Webhooks (production) | 🔴 Not registered | Register production URL |
| Live Price objects (20 products) | 🔴 Not created | Create matching product catalog |
| Stripe Coupon `LAUNCH50` | 🔴 Not created | Create: 50% off, 3 months |
| Payment receipts / invoices | 🔴 Not configured | Enable in Stripe settings |
| Stripe Customer Portal | Optional | For subscription self-service |

**Webhook events to register (production endpoint: `https://qb.nexfortis.com/api/webhooks/stripe`):**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

All webhook handlers MUST validate `Stripe-Signature` header before processing.

#### Resend (Transactional Email)

| Email Template | Trigger | Status |
|---------------|---------|--------|
| `order-confirmation` | Payment confirmed (webhook) | 🔴 Not built |
| `order-operator-notify` | Payment confirmed (webhook) | 🔴 Not built |
| `order-delivered` | Hassan marks fulfilled | 🔴 Not built |
| `subscription-welcome` | Subscription created | 🔴 Not built |
| `ticket-confirmation` | Ticket submitted | 🔴 Not built |
| `ticket-critical-ack` | Critical ticket submitted | 🔴 Not built |
| `ticket-operator-notify` | Ticket submitted | 🔴 Not built |
| `health-check-received` | Health check file uploaded | 🔴 Not built |
| `health-check-operator-notify` | Health check file uploaded | 🔴 Not built |
| `health-check-report-ready` | Operator marks complete | 🔴 Not built |
| `subscription-payment-failed` | Stripe payment failed webhook | 🔴 Not built |
| `subscription-cancelled-confirm` | Cancellation confirmed | 🔴 Not built |
| `auth-password-reset` | Password reset requested | ⚠️ Built (verify live delivery) |

All emails sent FROM: `support@nexfortis.com`. Resend domain verification for nexfortis.com required.

#### PostgreSQL / Drizzle ORM

The database schema requires additions for the launch features. The following tables are new or require new columns:

**New tables:**
```sql
-- Volume pack credit ledger
conversion_credits (
  id                uuid PRIMARY KEY,
  user_id           uuid REFERENCES users(id),
  pack_id           text NOT NULL,  -- 'volume-5pack' | 'volume-10pack'
  total_credits     integer NOT NULL,
  used_credits      integer DEFAULT 0,
  remaining_credits integer GENERATED ALWAYS AS (total_credits - used_credits) STORED,
  purchased_at      timestamptz DEFAULT now(),
  expires_at        timestamptz  -- null at launch
)

-- Promo codes
promo_codes (
  id              uuid PRIMARY KEY,
  code            text UNIQUE NOT NULL,
  discount_type   text NOT NULL,  -- 'percent' | 'fixed'
  discount_value  integer NOT NULL,  -- percent (0-100) or cents
  max_uses        integer,  -- null = unlimited
  uses_count      integer DEFAULT 0,
  per_user_limit  integer DEFAULT 1,
  expires_at      timestamptz,
  applicable_to   text[],  -- product IDs or null for all
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
)

-- Promo code redemption log
promo_code_uses (
  id            uuid PRIMARY KEY,
  code_id       uuid REFERENCES promo_codes(id),
  user_id       uuid,  -- null for guest
  order_id      uuid REFERENCES orders(id),
  discount_amt  integer NOT NULL,  -- cents
  used_at       timestamptz DEFAULT now()
)

-- Support subscriptions (see Expert Support PRD for full schema)
subscriptions (
  id                      uuid PRIMARY KEY,
  user_id                 uuid REFERENCES users(id),
  stripe_subscription_id  text UNIQUE NOT NULL,
  stripe_customer_id      text NOT NULL,
  plan_tier               text NOT NULL,  -- 'essentials' | 'professional' | 'premium'
  status                  text NOT NULL,  -- 'active' | 'past_due' | 'cancelled' | 'pending_downgrade'
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean DEFAULT false,
  pending_plan_tier       text,
  referral_code           text UNIQUE,  -- premium only
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
)

subscription_events (
  id               uuid PRIMARY KEY,
  subscription_id  uuid REFERENCES subscriptions(id),
  event_type       text NOT NULL,
  previous_state   jsonb,
  new_state        jsonb,
  stripe_event_id  text,
  created_at       timestamptz DEFAULT now()
)

file_health_checks (
  id                    uuid PRIMARY KEY,
  user_id               uuid REFERENCES users(id),
  subscription_id       uuid REFERENCES subscriptions(id),
  billing_period_start  timestamptz,
  file_path             text,
  status                text DEFAULT 'pending',  -- 'pending' | 'in_progress' | 'completed'
  report_path           text,
  report_completed_at   timestamptz,
  created_at            timestamptz DEFAULT now()
)
```

**New columns on existing tables:**
```sql
-- Orders table additions
ALTER TABLE orders ADD COLUMN conversion_tier    text;     -- 'standard' | 'complex' | 'guaranteed_30min'
ALTER TABLE orders ADD COLUMN file_assessment    jsonb;    -- assessment answers
ALTER TABLE orders ADD COLUMN add_ons            jsonb;    -- [{id, name, priceCharged}]
ALTER TABLE orders ADD COLUMN is_bundle_order    boolean DEFAULT false;
ALTER TABLE orders ADD COLUMN bundle_id          text;
ALTER TABLE orders ADD COLUMN bundle_components  text[];
ALTER TABLE orders ADD COLUMN discount_applied   boolean DEFAULT false;
ALTER TABLE orders ADD COLUMN discount_source    text;     -- 'subscriber' | 'promo_code' | null
ALTER TABLE orders ADD COLUMN subscription_tier  text;
ALTER TABLE orders ADD COLUMN discount_pct       integer;
ALTER TABLE orders ADD COLUMN discount_amount    integer;  -- cents
ALTER TABLE orders ADD COLUMN promo_code_id      uuid REFERENCES promo_codes(id);
ALTER TABLE orders ADD COLUMN file_name          text;
ALTER TABLE orders ADD COLUMN file_size_bytes    bigint;
ALTER TABLE orders ADD COLUMN file_format        text;     -- 'qbm' | 'xml' | 'sai' | 'saj' | 'cab'
ALTER TABLE orders ADD COLUMN category_id        text;

-- Support tickets additions
ALTER TABLE support_tickets ADD COLUMN severity           text DEFAULT 'normal';  -- 'normal' | 'urgent' | 'critical'
ALTER TABLE support_tickets ADD COLUMN subscription_id    uuid REFERENCES subscriptions(id);
ALTER TABLE support_tickets ADD COLUMN billing_period_start timestamptz;
ALTER TABLE support_tickets ADD COLUMN first_response_at  timestamptz;  -- for SLA tracking
```

#### DNS / Hosting (Replit)

| Item | Status | Action Required |
|------|--------|----------------|
| `qb.nexfortis.com` subdomain DNS | 🔴 Not configured | Add CNAME to Replit deployment URL |
| TLS certificate (qb subdomain) | 🔴 Not configured | Auto-provisioned by Replit on custom domain |
| `nexfortis.com` (main site) | ✅ Existing | No change |

---

### 3.3 Security & Privacy

#### Authentication

- **Mechanism:** Custom HMAC-signed tokens + bcrypt password hashing (existing).
- **Admin routes:** All `/admin/*` routes MUST require authentication AND operator role verification server-side. Role check cannot be client-side only.
- **Blog admin:** All blog admin routes MUST require authentication. Current state (unauthenticated) is a blocking launch issue.
- **Token expiry:** Auth tokens MUST expire. Refresh token or re-login must be required after expiry period.

#### Payment Security

- Stripe secret keys MUST be environment variables only — never committed to source control.
- `Stripe-Signature` header MUST be validated on every webhook request using `stripe.webhooks.constructEvent()`.
- Stripe PaymentIntent amounts MUST be calculated server-side. Client-submitted amounts are never trusted.
- Subscriber discount eligibility MUST be verified server-side against the `subscriptions` table at PaymentIntent creation time.
- Promo code validity MUST be verified server-side at PaymentIntent creation, not just client-side.

#### File Security

- Uploaded customer files (`.qbm`, `.xml`, `.sai`, `.saj`, `.cab`) MUST NOT be accessible via direct public URL.
- File downloads MUST require authentication or a signed, time-limited URL.
- Server-side file validation MUST inspect file header/magic bytes, not just the file extension.
- Maximum file size: 500 MB (enforced by multer at the API layer).
- Customer files MUST be deleted after 7 days per the Privacy Policy. At launch, this is a manual daily checklist item for Hassan (step 5 in operator daily checklist). A deletion confirmation log MUST be maintained.

#### Data Privacy (PIPEDA Compliance)

NexFortis is a federal Canadian corporation. The portal handles personally identifiable information (PII) — customer names, emails, billing details — and sensitive business financial data (QuickBooks company files). The Privacy Policy (required at launch) MUST document:

- Categories of data collected (name, email, billing info, company files)
- Purpose of collection (service fulfillment)
- Data retention: company files deleted after 7 days; order records retained for 7 years (CRA requirement)
- Disclosure: data is not sold or shared with third parties except Stripe (payment processing) and Resend (transactional email)
- Contact for privacy requests: support@nexfortis.com
- Individual access rights under PIPEDA

#### Content Security

- All user-supplied input (support ticket content, file names, order notes) MUST be sanitized server-side before storage.
- File names stored in the database MUST be sanitized to prevent path traversal attacks.
- Rate limiting MUST be applied to authentication endpoints (login, register, password reset) to prevent brute-force attacks.

---

## 4. Risks & Roadmap

### 4.1 Phased Rollout

#### Phase 0: Pre-Launch Hardening (Weeks 1–2)

**Goal:** Make the existing 80%-complete portal production-safe before exposing it to live traffic.

This phase has no new feature development — it is entirely about resolving blocking gaps.

| Item | Priority | Blocking? |
|------|----------|-----------|
| Replace hassansadiq73@gmail.com with support@nexfortis.com in all code | P0 | Yes |
| Set up support@nexfortis.com mailbox | P0 | Yes |
| Configure Resend API with nexfortis.com domain verification | P0 | Yes |
| Switch Stripe to live mode (live publishable + secret keys) | P0 | Yes |
| Configure GST/HST via Stripe Tax | P0 | Yes |
| Register Stripe webhooks to production endpoint | P0 | Yes |
| Enable Stripe payment receipts/invoices | P0 | Yes |
| Configure SSL/DNS: qb.nexfortis.com → Replit | P0 | Yes |
| Add blog admin authentication | P0 | Yes |
| Build `/privacy` Privacy Policy page | P0 | Yes |
| Build `/terms` Terms of Service page | P0 | Yes |
| Audit file upload security (signed URLs or auth-gated) | P0 | Yes |
| Load test: simulate 20 concurrent file uploads (500MB) | P0 | Recommended |
| Add SEO meta tags to all 16 existing portal routes | P1 | No |
| Create `robots.txt` and `sitemap.xml` | P1 | No |

**Exit criteria:** All P0 items complete. Stripe live payment of $1.00 test order succeeds end-to-end. Order confirmation email delivered to customer. Operator notification email delivered to support@nexfortis.com.

---

#### Phase 1: MVP Launch (Weeks 3–5)

**Goal:** Deploy the production portal with all 5 feature epics complete and accept the first paying customer.

**Features shipping in Phase 1:**

1. **Product Catalog & Pricing Overhaul** — Replace 54-product catalog with 20-product catalog, five categories, strikethrough launch promo pricing, conversion tier logic, add-on system, bundle pricing, volume packs. *(Feature PRD: `feature-product-catalog-overhaul.md`)*

2. **Expert Support Subscription** — Three-tier recurring subscription (Essentials/Professional/Premium), Stripe Subscriptions with LAUNCH50 coupon, ticket quota enforcement, file health check redemption, plan management (upgrade/downgrade/cancel). *(Feature PRD: `feature-support-subscription.md`)*

3. **Promo Code System** — Flexible discount code creation, checkout code entry field, server-side validation, per-user limits, usage tracking, operator management via admin panel. *(Feature PRD: `feature-promo-code-system.md`)*

4. **Operator Admin Panel** — Authenticated admin UI at `/admin` for order management, customer lookup, support ticket status updates, health check report uploads, promo code CRUD, basic dashboard metrics. *(Feature PRD: `feature-operator-admin-panel.md`)*

5. **SEO Landing Pages** — Keyword-targeted pages for high-intent Canadian QB search queries, with structured data (JSON-LD), XML sitemap, robots.txt, and canonical tags. *(Feature PRD: `feature-seo-landing-pages.md`)*

**Phase 1 launch sequence:**

```
Day 0:  Phase 0 complete. Stripe live. Email live. SSL live.
Day 1:  Product catalog overhaul deployed. Catalog verified (20 products).
Day 2:  Operator Admin Panel deployed. Hassan logs in, confirms order flow end-to-end.
Day 3:  Expert Support Subscription deployed. Test subscription → webhook → portal.
Day 4:  Promo Code System deployed. First referral codes created.
Day 5:  SEO Landing Pages deployed. sitemap.xml submitted to Google Search Console.
Day 6:  Full end-to-end smoke test: SBO order, accountant order, subscription, admin panel.
Day 7:  Launch. Live traffic accepted.
```

**Phase 1 exit criteria:**
- All 10 KPIs have baseline measurement in place.
- A complete order can be placed, fulfilled, and marked complete in the admin panel in under 10 minutes total (operator time).
- Support subscription checkout, ticket submission, and health check upload all work end-to-end.
- Operator receives all email notifications at support@nexfortis.com.
- SEO pages indexed within 30 days (Google Search Console monitoring).

---

#### Phase 1.1: Operations Stabilization (Weeks 6–8, post-launch)

**Goal:** Respond to real customer feedback, fix friction points, and reach 20 fulfilled orders.

| Item | Trigger |
|------|---------|
| Order flow UX fixes based on customer drop-off analytics | After 50 catalog visits |
| Conversion tier logic refinements (if customers picking wrong tier) | After 5 orders |
| Ticket response time audit (SLA compliance vs. KPI-6) | After 10 tickets |
| Volume pack redemption flow testing (if accountants start buying packs) | After first 5-Pack sale |
| Promo code expansion: partner referral codes | After launch |
| Email template polish (if open rates < 40%) | After 100 emails |
| WCAG / accessibility audit | Week 6 |
| SEO performance review: impressions, clicks, index coverage | Week 8 |

---

#### Phase 2: Competitive Differentiation (Months 2–4)

**Goal:** Build the features that move NexFortis from price parity to capability advantage.

| Feature | Rationale |
|---------|-----------|
| **Automated conversion pipeline** | Reduce Hassan's per-order time from 5–6 min to near-zero for standard orders. Enables scale. |
| **Accountant portal (client management)** | Dedicated multi-client workspace for bookkeepers: upload files for clients, track per-client order history, manage pack credits per client. |
| **In-portal ticket response thread** | Show full operator reply within the portal ticket view (not email-only). Reduces "did you get my question" emails. |
| **Referral tracking dashboard** | Premium subscriber analytics: referral code click-throughs, successful conversions, credit earned. |
| **Data Recovery service** | $199, Coming Soon in runbook. File corruption rescue for files `qb-convert` cannot process. |
| **Volume pack credit expiry** | Time-bound credits (12 months) to improve revenue predictability. |
| **Annual subscription pricing** | 20% discount for annual commitment. Reduces churn. |
| **QuickBooks Online migration scoping** | Research and define scope for QBO migration services (separate from Desktop). |
| **Automated SLA monitoring** | System-level alerting when a ticket approaches SLA breach. Currently manual. |
| **v2 conversion features** | Advanced competitive differentiation (details TBD — under development). |

---

### 4.2 Technical Risks

#### Risk 1: Stripe Live Mode Configuration Errors

**Description:** Switching from Stripe test mode to live mode introduces risk of misconfigured webhook endpoints, incorrect product IDs, or tax calculation errors. A misconfigured live Stripe account can result in incorrect charges, failed webhooks, or absent tax collection — all of which create legal and financial exposure.

**Likelihood:** Medium
**Impact:** High (revenue, legal)

**Mitigation:**
1. Complete Stripe live mode transition checklist item-by-item (see Pre-Launch Checklist §6).
2. Run a live end-to-end test order of $1.00 CAD on the production endpoint before opening to public traffic.
3. Verify GST/HST calculation on a test transaction in Stripe Tax dashboard before launch.
4. Register all webhook events for the production URL, not localhost.
5. Keep Stripe test mode keys available in a non-production environment for future development.

---

#### Risk 2: Email Deliverability (Resend + support@nexfortis.com)

**Description:** Resend requires domain verification (DKIM, SPF, DMARC records) for emails sent from a custom domain. If DNS records are incorrectly configured, transactional emails will be rejected or land in spam. Order confirmation emails failing to deliver will result in customer confusion and support escalations.

**Likelihood:** Medium (DNS configuration is manual and error-prone)
**Impact:** High (customer trust, support overhead)

**Mitigation:**
1. Complete Resend domain verification (DKIM, SPF, DMARC) before Phase 0 exit.
2. Send test emails from every template to an external email address (Gmail) and verify delivery and non-spam placement.
3. Log all outbound emails to a `email_log` table. Failed sends are retried once; persistent failures are surfaced in the Admin Panel.
4. Monitor Resend dashboard for bounce rate in the first week post-launch.

---

#### Risk 3: Operator Capacity Ceiling

**Description:** Hassan is the sole operator. The manual workflow takes 5–6 minutes per standard conversion order. At 20 orders per day (the Phase 1 KPI target), this is approximately 2 hours of focused fulfillment time. Spikes in order volume (e.g., a Reddit mention, an accountant buying a 10-pack and submitting 10 orders rapidly) could overwhelm this capacity and breach the sub-1-hour SLA.

**Likelihood:** Low at launch, Medium at scale
**Impact:** Medium (SLA breach, customer trust)

**Mitigation:**
1. Rush Delivery add-on is available for customers who need < 15-minute turnaround — this is an explicit SLA commitment, not a standard promise.
2. Volume pack buyers are informed that pack redemptions are scheduled through the normal queue (not simultaneous processing).
3. Operator Admin Panel shows a real-time order queue with Rush orders flagged at the top.
4. If daily order volume exceeds 10 per day consistently, Phase 2 automation becomes a P0 priority.
5. Operator runbook documents a surge protocol: if Hassan cannot fulfill within SLA, he emails the customer proactively with a revised ETA before the SLA window closes.

---

#### Risk 4: File Security Breach

**Description:** Customer `.QBM` files contain complete business financial records — payroll, bank accounts, transaction history. A misconfigured file storage setup that exposes these files publicly would be a severe privacy incident with PIPEDA implications.

**Likelihood:** Low (if correctly implemented) → Medium (if file URLs are publicly guessable)
**Impact:** Critical (privacy, legal, trust)

**Mitigation:**
1. File download URLs MUST require authentication or be signed with a time-limited token. This must be verified in the Phase 0 security audit.
2. File names stored in the filesystem use order IDs, not original customer file names (prevents enumeration).
3. Server-side magic byte validation at upload prevents malicious files masquerading as `.qbm`.
4. 7-day file deletion is enforced and logged in the operator daily checklist.
5. Conduct a manual security test: attempt to access an uploaded file URL without authentication after upload. Expected result: 401 or 403.

---

#### Risk 5: Product Catalog Data Inconsistency

**Description:** The product catalog is the source of truth for pricing, Stripe product IDs, and operator fulfillment instructions. If the frontend catalog definition, the Stripe product registry, and the database are out of sync (e.g., a price in `catalog.ts` differs from the Stripe Price object), customers could be charged the wrong amount — or charged a test-mode price in production.

**Likelihood:** Medium (manual process to sync catalog → Stripe)
**Impact:** High (financial, legal, customer trust)

**Mitigation:**
1. The product catalog definition in `/lib/db/catalog.ts` MUST be the single source of truth. UI components and the API server MUST import from this file — no duplicated product metadata.
2. A Stripe product sync script (`scripts/sync-stripe-products.ts`) MUST be run after catalog changes and the output verified before deployment.
3. Promo pricing is controlled by the `PROMO_ACTIVE` environment variable. Flipping it off MUST revert all charged amounts to `basePrice` without requiring a code deployment.
4. Launch Day checklist includes: verify 3 random Stripe PaymentIntents from live test orders match the expected CAD cents from the catalog.

---

#### Risk 6: Launch Promo Pricing Permanence

**Description:** The 50% launch promotion is designed to be temporary. If it is hardcoded in UI components or the Stripe product configuration rather than driven by a feature flag, disabling it after the launch period will require a code deployment — which may be delayed or forgotten.

**Likelihood:** Medium (common implementation mistake)
**Impact:** Medium (revenue leakage if promo continues beyond intended period)

**Mitigation:**
1. `PROMO_ACTIVE` environment variable controls all promotional pricing (both display and Stripe amounts). This is a hard requirement in the Product Catalog PRD (FR-3.4).
2. Promo end date is set as a calendar reminder for Hassan.
3. Subscription promo (50% off for 3 months) is driven by the Stripe `LAUNCH50` coupon, which has a duration limit. It does not need to be manually disabled.

---

#### Risk 7: PostgreSQL Data Loss on Replit

**Description:** Replit's managed PostgreSQL has uptime and backup SLAs that may be lower than dedicated database hosting. Order records, subscription records, and customer data stored here are business-critical. A database outage or data loss event without backups could result in lost revenue records and customer data.

**Likelihood:** Low
**Impact:** High

**Mitigation:**
1. Enable automated PostgreSQL backups in Replit (daily or per Replit's available options).
2. Before launch, verify backup and restore procedure has been tested.
3. Maintain an export of completed orders weekly (CSV download from Admin Panel or manual pg_dump).
4. Document Replit PostgreSQL backup retention period. If insufficient, evaluate migration to Supabase or Railway for the database tier.

---

## 5. Feature Dependency Map

Understanding the build order and blocking dependencies is critical for sequencing the sprint correctly.

### 5.1 Dependency Graph

```
Phase 0: Pre-Launch Hardening
    └── [BLOCKS ALL] Stripe live mode
    └── [BLOCKS ALL] support@nexfortis.com email
    └── [BLOCKS ALL] Resend API configuration
    └── [BLOCKS ALL] SSL/DNS for qb.nexfortis.com
    └── [BLOCKS LAUNCH] Blog admin authentication
    └── [BLOCKS LAUNCH] Privacy Policy + Terms of Service
    └── [BLOCKS LAUNCH] GST/HST Stripe Tax configuration
    └── [BLOCKS LAUNCH] Stripe webhooks (production URL)

Feature 1: Product Catalog Overhaul
    └── Requires: Stripe live mode (Phase 0)
    └── Requires: catalog.ts single source of truth
    └── BLOCKS: Expert Support Subscription (subscriber discount at checkout)
    └── BLOCKS: Promo Code System (needs product IDs for code scope)
    └── BLOCKS: Operator Admin Panel (admin views orders by product)
    └── DOES NOT BLOCK: SEO Landing Pages

Feature 2: Expert Support Subscription
    └── Requires: Product Catalog Overhaul (product IDs, discount integration)
    └── Requires: Stripe Subscriptions configured in live mode
    └── Requires: Resend email templates (subscription-welcome, ticket-*)
    └── BLOCKS: Operator Admin Panel (admin must manage subscriptions + tickets)
    └── DOES NOT BLOCK: Promo Code System
    └── DOES NOT BLOCK: SEO Landing Pages

Feature 3: Promo Code System
    └── Requires: Product Catalog Overhaul (product IDs for code scope)
    └── Requires: Database schema (`promo_codes` table)
    └── BLOCKS: Operator Admin Panel (admin creates/manages promo codes)
    └── DOES NOT BLOCK: Expert Support Subscription
    └── DOES NOT BLOCK: SEO Landing Pages

Feature 4: Operator Admin Panel
    └── Requires: Product Catalog Overhaul (order views)
    └── Requires: Expert Support Subscription (ticket + subscription management)
    └── Requires: Promo Code System (promo management UI)
    └── DOES NOT BLOCK: SEO Landing Pages
    └── NOTE: This is last to build; depends on all other features being complete

Feature 5: SEO Landing Pages
    └── Requires: Phase 0 (SSL/DNS, robots.txt, sitemap.xml)
    └── DOES NOT BLOCK any other feature
    └── CAN be built in parallel with Features 1–4
    └── NOTE: Build early; Google indexing lag means earlier submission = earlier traffic
```

### 5.2 Recommended Build Sequence

```
Week 1: Phase 0 (all P0 blocking items)
Week 2: Feature 1 (Product Catalog) + Feature 5 (SEO — parallel track)
Week 3: Feature 2 (Expert Support Subscription) + Feature 3 (Promo Code System)
Week 4: Feature 4 (Operator Admin Panel)
Week 5: Integration testing, smoke testing, launch sequence
```

### 5.3 Dependency Table

| Feature | Depends On | Blocks |
|---------|-----------|--------|
| Phase 0: Hardening | Nothing | Everything |
| F1: Product Catalog | Phase 0 | F2, F3, F4 |
| F2: Expert Support | Phase 0, F1 | F4 |
| F3: Promo Code System | Phase 0, F1 | F4 |
| F4: Operator Admin Panel | Phase 0, F1, F2, F3 | Nothing |
| F5: SEO Landing Pages | Phase 0 | Nothing |

---

## 6. Pre-Launch Checklist

This checklist must be completed and verified before any live traffic is accepted. Hassan or a developer signs off on each item.

### P0 — Blocking (Cannot Launch Without)

#### Infrastructure
- [ ] **DNS:** `qb.nexfortis.com` CNAME points to Replit deployment URL
- [ ] **TLS:** SSL certificate provisioned and valid for `qb.nexfortis.com`
- [ ] **HTTPS redirect:** HTTP → HTTPS redirect active
- [ ] **Database backups:** PostgreSQL automated backups enabled and tested

#### Email
- [ ] **Mailbox:** `support@nexfortis.com` mailbox created and accessible by Hassan
- [ ] **Resend:** Domain verification complete (DKIM, SPF, DMARC records added to DNS)
- [ ] **Resend:** Sending domain configured as `nexfortis.com`
- [ ] **Resend:** Test email sent from `support@nexfortis.com` and verified delivered (not spam) to external Gmail

#### Payments
- [ ] **Stripe:** Live mode publishable key configured in production environment
- [ ] **Stripe:** Live mode secret key configured in production environment (env var only, not source control)
- [ ] **Stripe:** Webhook endpoint registered: `https://qb.nexfortis.com/api/webhooks/stripe`
- [ ] **Stripe:** Webhook secret configured in production environment
- [ ] **Stripe Tax:** GST/HST automatic tax enabled for Canada
- [ ] **Stripe:** Payment receipts and invoices enabled in Stripe settings
- [ ] **Stripe:** Live test order of $1.00 CAD placed, payment succeeded, order confirmation email received, GST visible on receipt
- [ ] **Stripe:** All 20 product Price objects created in live mode matching `catalog.ts` prices exactly

#### Security
- [ ] **Email sanitization:** `hassansadiq73@gmail.com` removed from all source files, templates, and database seed data
- [ ] **Blog admin:** Blog admin routes require authentication (unauthenticated access returns 401/redirect)
- [ ] **File security:** Customer file downloads require authentication or signed URL (manual security test passed)
- [ ] **Stripe signatures:** Webhook handler validates `Stripe-Signature` header on every request
- [ ] **Admin panel:** `/admin/*` routes return 401 for unauthenticated requests

#### Legal
- [ ] **Privacy Policy:** `/privacy` page live with PIPEDA-compliant content
- [ ] **Terms of Service:** `/terms` page live with refund policy, SLA, data retention
- [ ] **Footer links:** Privacy Policy and Terms of Service linked from portal footer
- [ ] **Checkout links:** Checkout page links to Privacy Policy and Terms before payment

### P1 — Launch Quality (Strong Recommendation)

#### Performance
- [ ] **Lighthouse:** Catalog page FCP ≤ 1.5 s (Lighthouse, simulated 4G)
- [ ] **Load test:** 20 concurrent users browsing catalog — no 500 errors
- [ ] **File upload:** 50 MB file upload completes with progress bar visible

#### SEO
- [ ] **Meta tags:** All 16 existing routes have `<title>` and `<meta name="description">` tags
- [ ] **OG tags:** Open Graph tags on home, catalog, and service detail pages
- [ ] **robots.txt:** `/robots.txt` accessible at `qb.nexfortis.com/robots.txt`
- [ ] **sitemap.xml:** `/sitemap.xml` accessible and submitted to Google Search Console
- [ ] **Google Search Console:** Property created for `qb.nexfortis.com`

#### Operational
- [ ] **Operator runbook:** Updated to reflect new 20-product catalog and Admin Panel workflow
- [ ] **Operator runbook:** Daily operations checklist includes 7-day file deletion step
- [ ] **Operator test:** Hassan completes a full order fulfillment using Admin Panel (not raw DB) end-to-end
- [ ] **Email templates:** All Resend email templates reviewed for content, formatting, and mobile display

---

## 7. Feature PRD Index

The following feature PRDs define the detailed requirements, acceptance criteria, and technical specifications for each launch epic. This Master PRD is the top-level document; feature PRDs are the implementation contracts.

| Feature | PRD File | Status | Depends On |
|---------|----------|--------|-----------|
| Product Catalog & Pricing Overhaul | `feature-product-catalog-overhaul.md` | ✅ Written | Phase 0 |
| QB Expert Support Subscription | `feature-support-subscription.md` | ✅ Written | Phase 0, Catalog |
| Promo Code System | `feature-promo-code-system.md` | 🔴 Not written | Phase 0, Catalog |
| Operator Admin Panel | `feature-operator-admin-panel.md` | 🔴 Not written | Phase 0, Catalog, Support, Promo |
| SEO Landing Pages | `feature-seo-landing-pages.md` | 🔴 Not written | Phase 0 |

### PRD Audit Trail

| Document | Version | Author | Last Updated |
|----------|---------|--------|-------------|
| `master-qb-portal-production-launch.md` (this doc) | 1.0 | NexFortis Product | March 2026 |
| `feature-product-catalog-overhaul.md` | 1.0 | NexFortis Product | March 2026 |
| `feature-support-subscription.md` | 1.0 | NexFortis Product | March 2026 |
| `feature-promo-code-system.md` | TBD | — | — |
| `feature-operator-admin-panel.md` | TBD | — | — |
| `feature-seo-landing-pages.md` | TBD | — | — |

---

## Appendix A: Competitive Positioning Summary

| Dimension | E-Tech | Big Red Consulting | NexFortis (Launch) |
|-----------|--------|-------------------|-------------------|
| Base price (conversion) | $299–$450 USD (~$413–$621 CAD) | $249 USD (~$344 CAD) | $149–$249 CAD |
| Launch price | Standard pricing | Standard pricing | $75–$125 CAD (50% off) |
| Turnaround | 1–3 business days | Next business day | Sub-1-hour (standard) |
| Canadian customers | ✅ Yes (Brandon, MB) | ❌ US only | ✅ Yes (Nobleton, ON) |
| GST/HST handling | Unknown | N/A (USD) | ✅ Collected via Stripe Tax |
| Support subscription | ❌ No | ❌ No | ✅ $49–$149 CAD/mo |
| Volume packs | ✅ Yes (E-Tech model) | ❌ No | ✅ 5-pack / 10-pack |
| Accountant discounts | Unknown | ❌ No | ✅ Subscriber discounts (10–20%) |
| Online ordering | ✅ Yes | ✅ Yes | ✅ Yes (with file upload) |

**Primary differentiators at launch:**
1. **Price:** 15–20% cheaper than E-Tech (CAD equivalent). 50% launch promo amplifies this to 75–80% cheaper.
2. **Speed:** Sub-1-hour vs. 1–3 business days. This is a categorical improvement, not an incremental one.
3. **Canadian-focused:** GST/HST-aware, CAD pricing, Canadian business context.
4. **Support subscription:** No competitor offers a recurring support product. This is a unique revenue stream and retention mechanism.

---

## Appendix B: Product Catalog at Launch (Summary)

| # | Product | Category | Base Price | Launch Price |
|---|---------|----------|-----------|-------------|
| 1 | Enterprise→Premier/Pro Standard | Conversion | $149 CAD | $75 CAD |
| 2 | Enterprise→Premier/Pro Complex | Conversion | $199 CAD | $100 CAD |
| 3 | Guaranteed 30-Minute Conversion | Conversion | $249 CAD | $125 CAD |
| 4 | File Health Check (add-on) | Conversion | $49 CAD | $25 CAD |
| 5 | Rush Delivery (add-on) | Conversion | $49 CAD | $25 CAD |
| 6 | Post-Conversion Care (add-on) | Conversion | $49 CAD | $25 CAD |
| 7 | Audit Trail Removal | Data Services | $99 CAD | $50 CAD |
| 8 | Super Condense | Data Services | $99 CAD | $50 CAD |
| 9 | List Reduction | Data Services | $79 CAD | $40 CAD |
| 10 | Multi-Currency Removal | Data Services | $149 CAD | $75 CAD |
| 11 | QBO Readiness Report | Data Services | $49 CAD | $25 CAD |
| 12 | CRA Period Copy | Data Services | $99 CAD | $50 CAD |
| 13 | Audit Trail + CRA Bundle | Data Services | $149 CAD | $75 CAD |
| 14 | AccountEdge/MYOB→QuickBooks | Migration | $249 CAD | $125 CAD |
| 15 | Sage 50/Simply Accounting→QuickBooks | Migration | $249 CAD | $125 CAD |
| 16 | QB Expert Support — Essentials | Expert Support | $49/mo | $25/mo (3 mo) |
| 17 | QB Expert Support — Professional | Expert Support | $99/mo | $50/mo (3 mo) |
| 18 | QB Expert Support — Premium | Expert Support | $149/mo | $75/mo (3 mo) |
| 19 | 5-Pack Conversions | Volume Packs | $649 CAD | $325 CAD |
| 20 | 10-Pack Conversions | Volume Packs | $1,199 CAD | $600 CAD |

*All prices in CAD. GST/HST additional. Launch promo is 50% off all products. Subscription promo is 50% off for first 3 months. Promo ends when `PROMO_ACTIVE` environment variable is set to `false`.*

---

## Appendix C: Operator Quick Reference (Hassan)

**Daily Checklist:**
1. Check Admin Panel order queue (morning + afternoon). Rush orders processed first.
2. Process orders in FIFO. Each standard conversion: 5–6 min via CLI.
3. Verify converted file before sending. Review `report.html`.
4. Email customer: `converted.qbm` + `report.html` (Template #2).
5. Mark order `fulfilled` in Admin Panel.
6. Archive completed orders to `C:\Projects\qb-orders\completed\`.
7. Delete files older than 7 days from `C:\Projects\qb-orders\`. Log deletions.
8. Check support ticket queue. Respond within SLA (1hr Essentials/Professional, 30min Premium).

**CLI Commands:**
```bash
# Dry-run validation
qb-convert "input.qbm" --dry-run

# Full conversion
qb-convert "input.qbm" --output "converted.qbm" --report "report.html" --verbose

# Health check report only
qb-convert "input.qbm" --report
```

**Turnaround SLAs:**
- Standard conversion: < 60 minutes from file receipt
- Guaranteed 30-Min tier: < 30 minutes from file receipt
- Rush Delivery add-on: < 15 minutes from file receipt
- Support tickets (Essentials/Professional): 1 hour during business hours (Mon–Fri 9am–5pm ET)
- Support tickets (Premium): 30 minutes during business hours
- After-hours tickets: First response at 9am ET next business day

**Escalation:** If an order cannot be fulfilled (file corruption, wrong format, conversion failure), issue a full refund immediately via Stripe dashboard. Email customer using Template #4. Log the issue.

*Full runbook: `/docs/operator_runbook.md`*
