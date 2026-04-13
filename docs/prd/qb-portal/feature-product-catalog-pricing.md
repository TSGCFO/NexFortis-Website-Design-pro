# Feature PRD: QB Portal Product Catalog & Pricing Overhaul

**Document Type:** Feature Product Requirements Document  
**Epic:** QB Portal v1.0 Launch — `qb.nexfortis.com`  
**Status:** Draft  
**Version:** 1.0  
**Date:** 2026-03-23  
**Author:** Hassan Sadiq  
**Company:** 17756968 Canada Inc. (NexFortis)

---

## Table of Contents

1. [Feature Name](#1-feature-name)
2. [Epic](#2-epic)
3. [Goal](#3-goal)
4. [User Personas](#4-user-personas)
5. [User Stories](#5-user-stories)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Acceptance Criteria](#8-acceptance-criteria)
9. [Out of Scope](#9-out-of-scope)
10. [Appendix A: Complete 20-Product Catalog](#appendix-a-complete-20-product-catalog)
11. [Appendix B: Competitive Pricing Reference](#appendix-b-competitive-pricing-reference)
12. [Appendix C: File Type Acceptance Matrix](#appendix-c-file-type-acceptance-matrix)

---

## 1. Feature Name

**QB Portal Product Catalog & Pricing Overhaul**

Restructure the existing 54-product catalog to a curated 20-product catalog across 5 service categories, implement a CAD-denominated launch pricing strategy with automatic 50% strikethrough promotion, and build product detail pages with complete service information for each offering.

---

## 2. Epic

**Parent Epic:** QB Portal v1.0 Launch  
**Portal URL:** `qb.nexfortis.com`  
**Related Docs:**
- Pricing & Packaging PRD: `qb-converter/docs/prd_pricing_packaging.md`
- Competitive Analysis Matrix: `qb-converter/docs/competitive_analysis_matrix.md`
- PRD Context: `prd-context.md`

---

## 3. Goal

### Problem

The current QB Portal has 54 products in `products.json`, many of which are not deliverable at launch, creating customer confusion, order management overhead for the operator, and a fragmented user experience. Product detail pages lack complete service descriptions, turnaround time commitments, file requirements, and clear pricing with competitive context. Customers visiting the portal cannot immediately understand what they are buying, why NexFortis is cheaper than Big Red Consulting ($249 USD) or E-Tech ($299–$450 USD), or how to select the right service for their QuickBooks situation.

### Solution

Reduce the catalog to exactly 20 ship-ready products across 5 logical service categories. Implement a universal 50% launch promotion displayed as automatic strikethrough pricing on every product. Build complete product detail pages covering description, pricing with competitive anchor, requirements, turnaround commitment, deliverables, and FAQ. Add a category navigation layer with search/filter and featured product highlighting.

### Impact

| Metric | Baseline (Current) | Target (Post-Launch) |
|---|---|---|
| Catalog product count | 54 (many non-deliverable) | 20 (all deliverable) |
| Time for customer to select correct product | Unmeasured / high confusion | < 3 minutes from catalog landing |
| Checkout abandonment attributable to missing product info | Unmeasured | Track via Stripe event drop-off; target < 40% |
| Average order value (AOV) | $0 (pre-launch) | $149 CAD (Standard Conversion baseline) |
| Add-on attach rate (File Health Check / Rush / Post-Care) | N/A | ≥ 15% of conversion orders in first 30 days |
| Accountant volume pack orders | N/A | ≥ 2 packs in first 60 days |

---

## 4. User Personas

### Persona A — Small Business Owner (Primary)

**Who:** Canadian small business owner currently running QuickBooks Desktop Enterprise who needs to downgrade to Pro or Premier (e.g., subscription cost reduction, firm change).  
**Technical comfort:** Low to moderate. Knows their QB version but does not understand file internals or conversion process.  
**Decision driver:** Price, trust, and clarity. Will compare to Big Red ($249 USD) and E-Tech ($299 USD). Converts on: CAD pricing, money-back guarantee language, and clear turnaround time.  
**Pain point:** They fear losing financial data. They want confidence that GST/HST records, payroll history, and transaction history will survive the conversion.

### Persona B — Accountant / Bookkeeper (Secondary)

**Who:** Canadian CPA, bookkeeper, or accounting firm managing 5–20+ client QB Desktop files. Processes conversions for clients, often on behalf of business owners who call them first.  
**Technical comfort:** Moderate to high. Understands QB editions, file types, and data integrity requirements.  
**Decision driver:** Volume discounts, reliable turnaround, batch workflow, professional trust signals.  
**Pain point:** Current competitors (E-Tech, Big Red) have no accountant-specific purchasing path. Accountants want volume packs, not one-off checkouts.

### Persona C — Platform Migrator (Tertiary)

**Who:** Business owner or bookkeeper moving from AccountEdge/MYOB or Sage 50/Simply Accounting to QuickBooks Desktop. Often triggered by a software end-of-life or advisor recommendation.  
**Technical comfort:** Low. Does not understand file formats; needs guided requirements upfront.  
**Decision driver:** Expert guidance, clear what-to-send instructions, flat pricing (no hourly surprise).  
**Pain point:** No Canadian competitor offers flat-rate Sage 50 or AccountEdge migration at a transparent price with a clear process.

---

## 5. User Stories

### US-01: Category Navigation (All Personas)

> As a **first-time visitor to the catalog**, I want to **browse products by service category** so that I can **quickly identify whether NexFortis offers the service I need without reading through an unrelated list**.

### US-02: Product Detail — Conversion Services (Persona A)

> As a **small business owner**, I want to **read a product detail page that explains exactly what a Standard vs. Complex conversion includes, what files I need to send, and what I get back** so that I can **make an informed purchase decision without calling support**.

### US-03: Launch Promo Pricing (All Personas)

> As a **price-conscious buyer**, I want to **see both the regular price and the discounted launch price side-by-side** so that I can **understand I'm getting a limited-time deal and feel urgency to act now**.

### US-04: Competitive Price Anchoring (Persona A)

> As a **small business owner who has already checked Big Red Consulting**, I want to **see that NexFortis is explicitly cheaper than the $249 USD I was quoted elsewhere** so that I can **feel confident I'm getting a better deal without sacrificing quality**.

### US-05: Add-On Selection (Persona A)

> As a **small business owner placing a conversion order**, I want to **optionally add File Health Check, Rush Delivery, or Post-Conversion Care during checkout** so that I can **customize my service level without placing a separate order**.

### US-06: Volume Pack Purchase (Persona B)

> As an **accountant managing multiple client conversions**, I want to **purchase a 5-Pack or 10-Pack as a single product** so that I can **get a per-conversion discount and apply the pack credits across multiple client files**.

### US-07: Bundle Purchase (Persona A or B)

> As a **customer needing both Audit Trail Removal and CRA Period Copy**, I want to **see the Audit Trail + CRA Bundle clearly displayed as a discounted option** so that I can **save money vs. buying both services individually**.

### US-08: Migration Product Requirements (Persona C)

> As a **business migrating from Sage 50**, I want to **see exactly what files I need to provide, what data will and will not be migrated, and what the flat price is** so that I can **proceed confidently without requesting a quote**.

### US-09: Subscription Selection (Persona A or B)

> As a **QuickBooks Desktop user who wants ongoing support**, I want to **compare Essentials, Professional, and Premium subscription tiers on a single page** so that I can **choose the right support level for my needs and budget**.

### US-10: Search and Filter (All Personas)

> As a **returning customer who knows the service name**, I want to **search or filter the catalog by keyword or category** so that I can **find the right product in under 10 seconds without scrolling the full list**.

### US-11: File Upload Requirements (All Personas)

> As a **customer ready to order**, I want to **see exactly which file types are accepted for the specific product I'm ordering** so that I can **prepare and upload the correct file without a support back-and-forth**.

### US-12: GST/HST Disclosure (Persona A)

> As a **Canadian buyer**, I want to **understand whether displayed prices include or exclude GST/HST** so that I can **know my total cost before entering payment information**.

---

## 6. Functional Requirements

### FR-01: Catalog Data Structure

- **FR-01.1:** Replace `products.json` with exactly **20 products** matching the approved catalog (see Appendix A). Zero non-deliverable products may remain in the published catalog.
- **FR-01.2:** Each product record must contain the following fields:
  - `id` (unique slug, e.g. `conversion-standard`)
  - `category` (one of five approved categories)
  - `name` (display name)
  - `description` (2–4 sentence plain-language service description)
  - `basePrice` (CAD, integer cents)
  - `launchPrice` (CAD, integer cents, = basePrice × 0.50)
  - `isLaunchPromo` (boolean, `true` for all 20 products at launch)
  - `turnaroundTime` (string, e.g. `"Under 1 hour"`)
  - `acceptedFileTypes` (array, e.g. `[".qbm"]`)
  - `requirements` (array of strings — what customer must provide)
  - `deliverables` (array of strings — what customer receives)
  - `faqItems` (array of `{ question, answer }` objects, minimum 3 per product)
  - `isAddon` (boolean — `true` for File Health Check, Rush Delivery, Post-Conversion Care)
  - `isSubscription` (boolean — `true` for Expert Support tiers)
  - `stripePriceId` (string — references live Stripe Price object)
  - `featured` (boolean — for category-level featured product highlighting)
- **FR-01.3:** Subscription products (Expert Support tiers) must include:
  - `billingInterval` (`"monthly"`)
  - `introMonths` (integer — 3, the promotional period at launch pricing)
  - `ticketsPerMonth` (integer or `"unlimited"`)
  - `responseTimeSLA` (string, e.g. `"≤ 1 hour during business hours"`)
  - `tierPerks` (array of strings)

### FR-02: Category Navigation

- **FR-02.1:** The catalog page must render a top-level category filter bar with exactly 5 categories:
  1. Conversion Services
  2. Data Services
  3. Platform Migrations
  4. Expert Support
  5. Volume Packs
- **FR-02.2:** Clicking a category filter renders only products belonging to that category. Default view shows all products (no filter active).
- **FR-02.3:** Active category filter must be visually distinct (active state styling) and persist across browser back navigation within the same session.
- **FR-02.4:** Product count per category must display next to each category label (e.g., "Conversion Services (6)").

### FR-03: Search and Filter

- **FR-03.1:** A text search input on the catalog page filters products in real time (< 100ms response, client-side) by matching against product `name` and `description` fields.
- **FR-03.2:** Search is case-insensitive. Partial matches are accepted (e.g., "audit" returns "Audit Trail Removal" and "Audit Trail + CRA Bundle").
- **FR-03.3:** When a search query produces zero results, display: *"No products match your search. Need help? Contact us at support@nexfortis.com."*
- **FR-03.4:** A "Featured" filter badge highlights up to 3 featured products per category. Featured products render first within their category group.

### FR-04: Catalog Product Cards

- **FR-04.1:** Each product card must display:
  - Product name
  - Category badge
  - Short description (≤ 80 characters, truncated with ellipsis if needed)
  - Launch price (large, prominent, in CAD)
  - Base price as strikethrough text immediately adjacent to launch price
  - "Launch Promo" badge on all 20 products during active promotion period
  - "Add to Order" or "Learn More" CTA button
- **FR-04.2:** Add-on products (File Health Check, Rush Delivery, Post-Conversion Care) must display an "Add-on" badge and must NOT be purchasable as standalone products from the catalog. Their CTA must read "Add During Checkout" and link to the relevant parent product order page.
- **FR-04.3:** Subscription products must display pricing as `$XX/mo` (launch) with `~~$XX/mo~~` (base) and a footnote: *"Launch rate for first 3 months, then $XX CAD/mo."*
- **FR-04.4:** Volume pack cards must display the per-conversion effective price (e.g., "5 conversions — $65/each at launch") as a secondary line beneath the total price.

### FR-05: Product Detail Pages

Each of the 20 products must have a dedicated detail page at the route `/services/:productSlug` with the following sections rendered in order:

- **FR-05.1 — Hero Section:**
  - Product name (H1)
  - Category breadcrumb (Catalog → Category → Product Name)
  - Short tagline (1 sentence)
  - Launch price (large) + base strikethrough price
  - Primary CTA: "Order Now" (links to order form) or "Subscribe Now" for subscriptions
  - Trust badge row: "Money-Back Guarantee | All Prices CAD | GST/HST applies"

- **FR-05.2 — What's Included:**
  - Bulleted list of exactly what the customer receives (the `deliverables` array rendered)
  - Turnaround time prominently displayed as a highlighted stat block

- **FR-05.3 — Requirements / What to Prepare:**
  - Bulleted list of what the customer must provide
  - Accepted file type(s) displayed as a badge (e.g., `.qbm`, `.zip`)
  - Upload size limit displayed: 500 MB maximum

- **FR-05.4 — Pricing Block with Competitive Anchor:**
  - Table or side-by-side comparison showing:
    - NexFortis launch price (CAD)
    - NexFortis base price (CAD)
    - Big Red Consulting price (USD, converted to CAD at 1.38)
    - E-Tech price range (USD, converted to CAD at 1.38)
  - Footnote: *"Competitor prices shown in CAD equivalent at current exchange rate. Big Red Consulting and E-Tech price in USD. NexFortis prices always in CAD — no currency surprise at checkout."*
  - This competitive block is required on all Conversion Services and Data Services pages. It is optional (but encouraged) on Migration and Support pages.

- **FR-05.5 — FAQ Section:**
  - Minimum 3 FAQ items per product, rendered as an accessible accordion (open/close)
  - Standard FAQ items required on all Conversion Services pages:
    1. "What is a .qbm file and how do I create one?"
    2. "What data is preserved in the conversion?"
    3. "What if my file is too large or complex?"
  - Standard FAQ items required on all Migration pages:
    1. "What source file do I need to provide?"
    2. "What data is migrated and what is not?"
    3. "Can I migrate payroll history?"

- **FR-05.6 — Add-On Upsell Block (Conversion Services pages only):**
  - Inline section titled "Enhance Your Conversion" listing the three add-ons:
    - File Health Check — $25 CAD (launch)
    - Rush Delivery — $25 CAD (launch)
    - Post-Conversion Care — $25 CAD (launch)
  - Each add-on shows a one-sentence description and a checkbox. Checked add-ons are passed as query params to the order form: `/order?product=conversion-standard&addons=file-health-check,rush-delivery`

- **FR-05.7 — Related Products:**
  - Maximum 3 related product cards shown below the FAQ, selected from the same category or logically adjacent (e.g., Standard Conversion page shows Complex Conversion and 5-Pack)

### FR-06: Pricing Rules — Enforcement

- **FR-06.1:** No product `basePrice` in the Conversion Services category may be set below 14,900 CAD cents ($149.00 CAD). This constraint must be documented in code comments and enforced at the data layer (Drizzle schema check constraint or application-layer validation).
- **FR-06.2:** Launch prices must be exactly 50% of base price. Any mismatch between `launchPrice` and `basePrice × 0.50` must throw a validation error at seed/import time.
- **FR-06.3:** The 50% strikethrough launch promotion must be displayed **automatically** — no promo code required by the customer. It is applied site-wide at the product data level.
- **FR-06.4:** All prices rendered in the UI must include the suffix "CAD" or display within a context clearly labeled "All prices in Canadian dollars."
- **FR-06.5:** Every pricing display (product cards, detail pages, order form) must include the disclosure: *"GST/HST will be added at checkout based on your province."*
- **FR-06.6:** The promotional period end date is not hardcoded; it is controlled via a global `LAUNCH_PROMO_ACTIVE` feature flag in the environment config. When set to `false`, all prices revert to `basePrice` and strikethrough text is removed.

### FR-07: Add-On Flow

- **FR-07.1:** Add-ons (File Health Check, Rush Delivery, Post-Conversion Care) must NOT appear as standalone purchasable products in the catalog or in Stripe as directly purchasable line items from the catalog page.
- **FR-07.2:** Add-ons are presented at two points only:
  1. On the parent Conversion Services product detail pages (the upsell block per FR-05.6)
  2. In Step 2 of the order form ("Customize Your Order")
- **FR-07.3:** The order form must support multi-add-on selection. A customer must be able to select all three add-ons on a single conversion order.
- **FR-07.4:** The Stripe checkout line items must list each add-on as a separate line item with its individual launch price so the customer's receipt itemizes the services.
- **FR-07.5:** Rush Delivery add-on, when selected, must trigger an automated notification to `support@nexfortis.com` flagging the order as priority. (Implementation: Resend API email on order creation.)

### FR-08: Volume Pack Behavior

- **FR-08.1:** Volume packs (5-Pack: $325 CAD launch; 10-Pack: $600 CAD launch) are purchased as single Stripe products. Upon payment confirmation, the system generates a unique pack code (format: `PACK5-XXXX-XXXX` or `PACK10-XXXX-XXXX`) and emails it to the customer.
- **FR-08.2:** Pack codes are stored in the database with fields: `code`, `packSize` (5 or 10), `remainingConversions`, `purchasedAt`, `expiresAt` (12 months from purchase), `ownerUserId` or `ownerEmail`.
- **FR-08.3:** At order form checkout, an input field "Have a Pack Code?" accepts a pack code. On valid entry, the conversion price is set to $0 and a pack redemption record is created, decrementing `remainingConversions` by 1.
- **FR-08.4:** When a pack reaches 80% usage (i.e., 1 remaining on 5-pack, 2 remaining on 10-pack), an automated email is sent to the pack owner via Resend API: *"You're almost out of conversion credits. Purchase a new pack to continue saving."*
- **FR-08.5:** Pack codes do not expire per conversion — a 5-pack purchased in January covers 5 conversions anytime within 12 months. Expired pack codes must be rejected at checkout with the message: *"This pack code expired on [date]. Contact support@nexfortis.com to discuss options."*
- **FR-08.6:** The 10-Pack must display on its product detail page and product card: *"Includes Guaranteed 30-Minute turnaround on all conversions."*
- **FR-08.7:** Volume pack products are listed in their own "Volume Packs" category and must also be cross-linked from the Conversion Services category page via a banner: *"Accountant or bookkeeper? Save with volume packs →"*

### FR-09: Subscription Products (Expert Support)

- **FR-09.1:** The three Expert Support tiers (Essentials $49/mo, Professional $99/mo, Premium $149/mo) are created as Stripe subscription products with a 3-month introductory price equal to the launch price (50% of base).
- **FR-09.2:** A dedicated `/support-plans` page (or `/services/expert-support`) renders all three tiers in a side-by-side comparison table showing:
  - Price (launch / base)
  - Tickets per month
  - Response time SLA
  - Included features (per tier, see Appendix A detail)
  - CTA: "Subscribe — $XX/mo for 3 months, then $XX/mo"
- **FR-09.3:** The comparison table must include a "Most Popular" badge on the Professional tier.
- **FR-09.4:** After subscribing, the customer's portal dashboard must display their active subscription tier, tickets remaining this month, and renewal date.
- **FR-09.5:** The Premium tier detail page must explicitly list the monthly 30-minute video call via Microsoft Bookings as a deliverable, and the 20% service discount as a callout box.

### FR-10: Migration Product Requirements

- **FR-10.1:** AccountEdge/MYOB→QuickBooks and Sage 50/Simply Accounting→QuickBooks must have separate product detail pages with distinct file type requirements:
  - AccountEdge/MYOB: accepted formats — `.myo`, `.myob` (document in the `acceptedFileTypes` field; operator to confirm exact format before launch)
  - Sage 50/Simply Accounting: accepted formats — `.sai`, `.saj`, `.zip` (document in the `acceptedFileTypes` field; operator to confirm exact format before launch)
- **FR-10.2:** Both migration products are priced at $249 CAD base ($125 CAD launch). Flat pricing — no complexity tiers in v1.
- **FR-10.3:** Both migration product detail pages must state: *"This service matches the baseline feature set of E-Tech's migration service. Advanced data mapping and customization features are in development for v2."*
- **FR-10.4:** The order form for migration products must present a different file upload UI than the conversion order form — the `.qbm` restriction must not apply to migration orders. Migration orders accept the file types in FR-10.1.
- **FR-10.5:** Migration product pages must include an explicit "What is NOT migrated" section (e.g., payroll history, custom report templates) so customer expectations are set before purchase.

### FR-11: Contact Email Replacement

- **FR-11.1:** Replace all hardcoded references to `hassansadiq73@gmail.com` in the portal codebase with `support@nexfortis.com`. This includes footer, order confirmation templates, support ticket routing, and error pages.

### FR-12: Featured Products

- **FR-12.1:** The following products are designated as "featured" at launch and must appear in the Featured section on the catalog homepage and at the top of their category:
  - Enterprise→Premier/Pro Standard (Conversion Services)
  - Audit Trail + CRA Bundle (Data Services)
  - 5-Pack Conversions (Volume Packs)
- **FR-12.2:** A "Featured Services" section renders as the first block on the catalog homepage before the full category grid, displaying the 3 featured products as larger cards.

---

## 7. Non-Functional Requirements

### NFR-01: Performance

- **NFR-01.1:** Catalog page (20 products, all categories visible) must achieve a Largest Contentful Paint (LCP) ≤ 2.5 seconds on a simulated 4G connection (Chrome DevTools throttle) with product data served from a cached API response.
- **NFR-01.2:** Client-side category filter and text search must update the visible product list in ≤ 100ms after user input (no network round-trip required).
- **NFR-01.3:** Product detail pages must achieve a Time to Interactive (TTI) ≤ 3 seconds on a simulated 4G connection.

### NFR-02: Pricing Data Integrity

- **NFR-02.1:** Pricing is the source of truth in the database (PostgreSQL via Drizzle ORM), not in `products.json` or hardcoded in frontend components. The frontend fetches prices from the API at render time.
- **NFR-02.2:** Stripe Price IDs are stored in the database. The frontend must never construct a Stripe checkout session using a hardcoded price string — it must always retrieve the `stripePriceId` from the API.
- **NFR-02.3:** A database seed validation script must verify, on every deployment, that all 20 products exist, all launch prices equal 50% of base prices (within integer rounding), and all Stripe Price IDs resolve to active Stripe objects.

### NFR-03: Accessibility

- **NFR-03.1:** All product cards, detail pages, and the comparison table must meet WCAG 2.1 AA compliance. This includes:
  - All images have `alt` text
  - Color is not the sole differentiator for pricing states (strikethrough text must also be labeled with `aria-label="Original price"` and `aria-label="Launch price"`)
  - Accordion FAQ items use proper ARIA expand/collapse roles
  - Category filter buttons meet 4.5:1 contrast ratio in both active and inactive states
- **NFR-03.2:** The comparison table for Expert Support tiers must be navigable by keyboard and screen reader with correct table header associations.

### NFR-04: Security & Privacy

- **NFR-04.1:** No customer financial data (card numbers, bank details) is stored in NexFortis systems. All payment data is handled exclusively via Stripe.
- **NFR-04.2:** Pack codes must be generated using cryptographically random tokens (minimum 64 bits of entropy), not sequential integers.
- **NFR-04.3:** The `LAUNCH_PROMO_ACTIVE` environment flag must not be client-side readable. It must be resolved server-side and the computed price returned to the frontend — the flag itself must not be exposed via the API.
- **NFR-04.4:** The products API endpoint (`GET /api/products`) must not require authentication (public catalog), but write endpoints (`POST /api/products`, `PATCH /api/products/:id`) must require operator-level auth.

### NFR-05: Tax Disclosure Compliance

- **NFR-05.1:** All prices displayed in the portal are tax-exclusive. The GST/HST disclosure *"GST/HST will be added at checkout based on your province"* must appear on:
  - Every product card
  - Every product detail page pricing block
  - The order form summary step
  - The Stripe checkout session description
- **NFR-05.2:** NexFortis's BN (797942570 RC0001) must appear on the order confirmation email and any downloadable receipt generated.

### NFR-06: Maintainability

- **NFR-06.1:** Adding a new product to the catalog must require changes only to: the database seed file (or admin UI in a later version) and a corresponding Stripe product creation. No frontend component code should need modification for standard product additions.
- **NFR-06.2:** The launch promo on/off toggle (`LAUNCH_PROMO_ACTIVE`) must be operable without a code deployment — environment variable change only.

### NFR-07: Content Completeness

- **NFR-07.1:** At launch, all 20 products must have fully authored content in all required fields — no placeholder text ("TBD", "Coming soon", "Lorem ipsum") may appear on any published product card or detail page.

---

## 8. Acceptance Criteria

### AC-01: Catalog Structure

- [ ] `products.json` (or database seed) contains exactly 20 products and 0 products more
- [ ] Each of the 5 categories contains the correct product count: Conversion Services (6), Data Services (7), Platform Migrations (2), Expert Support (3), Volume Packs (2)
- [ ] All 20 products have non-empty values in all required fields defined in FR-01.2
- [ ] Running the seed validation script (NFR-02.3) returns zero errors on a fresh environment

### AC-02: Launch Pricing Correctness

- [ ] For all 20 products, `launchPrice === Math.round(basePrice × 0.50)` (within 1 cent rounding tolerance)
- [ ] All Conversion Services products have `basePrice >= 14900` (i.e., ≥ $149.00 CAD)
- [ ] Every product card displays both the strikethrough base price and the launch price simultaneously
- [ ] The "Launch Promo" badge is visible on all 20 product cards
- [ ] Toggling `LAUNCH_PROMO_ACTIVE=false` in the environment and reloading the catalog shows only base prices with no strikethrough and no badge — without a code deployment

### AC-03: Category Navigation

- [ ] All 5 category tabs render on the catalog page on both desktop and mobile (≥ 320px viewport)
- [ ] Clicking "Conversion Services" shows exactly 6 products and hides the other 14
- [ ] Clicking "Data Services" shows exactly 7 products and hides the other 13
- [ ] Clicking "Platform Migrations" shows exactly 2 products and hides the other 18
- [ ] Clicking "Expert Support" shows exactly 3 products and hides the other 17
- [ ] Clicking "Volume Packs" shows exactly 2 products and hides the other 18
- [ ] "All Services" / no-filter state shows all 20 products
- [ ] Active category tab has a visually distinct state (border, background, or color change)

### AC-04: Search

- [ ] Typing "audit" in the search box returns exactly 2 products: "Audit Trail Removal" and "Audit Trail + CRA Bundle"
- [ ] Typing "sage" returns exactly 1 product: "Sage 50/Simply Accounting → QuickBooks"
- [ ] Typing "xyznotaproduct" returns the zero-results message containing `support@nexfortis.com`
- [ ] Search response time is ≤ 100ms measured in Chrome DevTools Performance panel (no throttle applied)

### AC-05: Product Detail Pages

- [ ] All 20 products have a reachable detail page at `/services/:productSlug` (no 404s)
- [ ] Each detail page renders: H1 product name, breadcrumb, launch price + strikethrough base price, "Order Now" CTA, deliverables list, requirements list, accepted file types, turnaround time, and minimum 3 FAQ accordion items
- [ ] All 6 Conversion Services detail pages include the competitive pricing anchor table (FR-05.4) with NexFortis, Big Red, and E-Tech prices in CAD
- [ ] All 6 Conversion Services detail pages render the "Enhance Your Conversion" add-on upsell block
- [ ] FAQ accordions expand and collapse correctly via both mouse click and keyboard Enter/Space
- [ ] "Order Now" CTA on each product detail page links to the correct order form with the product pre-selected

### AC-06: Add-On Behavior

- [ ] File Health Check, Rush Delivery, and Post-Conversion Care do NOT appear as standalone purchasable items in the catalog grid
- [ ] All three add-ons appear in Step 2 of the order form for any Conversion Services product
- [ ] Selecting Rush Delivery at checkout results in an email to `support@nexfortis.com` with subject "PRIORITY ORDER — Rush Delivery" within 60 seconds of order confirmation
- [ ] A Stripe checkout session with Standard Conversion + Rush Delivery + File Health Check shows 3 line items: $75 + $25 + $25 = $125 CAD (all launch prices)

### AC-07: Volume Pack Flow

- [ ] Purchasing a 5-Pack via Stripe checkout generates a `PACK5-XXXX-XXXX` code and emails it to the purchaser within 5 minutes of payment confirmation
- [ ] Entering a valid pack code in the order form sets the conversion product price to $0 and shows "Pack Credit Applied"
- [ ] After 4 of 5 conversions are redeemed (80% usage), the pack owner receives the low-balance warning email
- [ ] Entering an expired pack code shows the expiry error message (FR-08.5)
- [ ] The 10-Pack product card and detail page both display "Includes Guaranteed 30-Minute turnaround on all conversions"

### AC-08: Migration Products

- [ ] AccountEdge and Sage 50 migration products each have distinct detail pages with their specific accepted file types documented
- [ ] The order form for migration products does NOT enforce `.qbm` file restriction
- [ ] Both migration detail pages include a "What is NOT migrated" section with at least 3 items listed
- [ ] Both migration detail pages display the v1 baseline disclosure (FR-10.3)

### AC-09: Expert Support Subscriptions

- [ ] The `/services/expert-support` (or `/support-plans`) page renders all three tiers in a side-by-side comparison
- [ ] Professional tier has a "Most Popular" badge
- [ ] Subscription CTAs read "Subscribe — $XX/mo for 3 months, then $XX/mo" (correct prices per tier)
- [ ] After subscribing to any tier, the customer portal dashboard displays: active tier name, tickets remaining this month, and renewal date

### AC-10: Compliance & Contact

- [ ] No instance of `hassansadiq73@gmail.com` appears anywhere in the rendered portal (verified via grep on the built output)
- [ ] `support@nexfortis.com` appears in the footer, zero-search-results message, contact links, and order confirmation email
- [ ] All 20 product cards display "GST/HST will be added at checkout" or equivalent disclosure
- [ ] NexFortis BN `797942570 RC0001` appears on the order confirmation email template

### AC-11: Performance

- [ ] Catalog page LCP ≤ 2.5s on simulated 4G (measured in Chrome Lighthouse, mobile preset)
- [ ] No product card or detail page contains placeholder text matching the regex `/(TBD|Coming Soon|Lorem ipsum|placeholder)/i`

---

## 9. Out of Scope

The following items are explicitly excluded from this feature and will be addressed in future iterations:

| Item | Reason / Target Version |
|---|---|
| Automated QuickBooks file processing pipeline | Operator processes orders manually via CLI at v1.0 launch. Automation is a separate workstream. |
| `.qbw` (live company file) acceptance | Requires SA17 ODBC approach; research complete but not implemented. Target: v1.1. |
| `.qbb` (backup file) acceptance | Not yet supported by the conversion tool. Target: Day 9 critical path / pre-launch. |
| Accountant portal / dedicated bookkeeper dashboard | Volume packs are the v1 accountant path. A dedicated portal is a v2 initiative. |
| Referral program infrastructure | Manual spreadsheet tracking at v1.0. Referral code system is a v1.1 feature. |
| Admin UI for product management | Products are managed via database seed at launch. A CMS-style admin panel is post-v1.0. |
| QBO (QuickBooks Online) migration services | Not in the approved 20-product catalog. Future scope. |
| Cross-platform migrations beyond AccountEdge and Sage 50 | NetSuite, Xero, SAP, Peachtree, DacEasy are v3.0+ scope. |
| Dynamic currency conversion (USD display) | All prices are CAD-only at launch. No real-time FX display. |
| Promo code / referral code system at checkout | System exists for future use but is not wired to any active promo at v1.0 launch (separate feature). |
| Blog admin authentication hardening | Tracked separately; not part of catalog feature. |
| SEO meta tags and sitemap for the qb-portal | Tracked as a separate SEO feature; not in this PRD's scope. |
| Data Recovery services (file corruption, error codes) | T2-A in competitive analysis; planned for v1.5 (6–9 months). |
| Transaction Copier as a service | T2-D in competitive analysis; planned for v1.2 (4–6 months). |

---

## Appendix A: Complete 20-Product Catalog

All prices in CAD. Launch price = 50% of base price (automatic, no code required).

### Category 1: Conversion Services (6 products)

| # | Product Name | Slug | Base Price | Launch Price | Turnaround | Stripe Type | Add-on? |
|---|---|---|---|---|---|---|---|
| 1 | Enterprise→Premier/Pro Standard | `conversion-standard` | $149 | $75 | Under 1 hour | One-time | No |
| 2 | Enterprise→Premier/Pro Complex | `conversion-complex` | $199 | $100 | Under 1 hour | One-time | No |
| 3 | Guaranteed 30-Minute Conversion | `conversion-30-min` | $249 | $125 | 30 minutes guaranteed | One-time | No |
| 4 | File Health Check | `addon-file-health-check` | $49 | $25 | With conversion order | One-time | **Yes** |
| 5 | Rush Delivery | `addon-rush-delivery` | $49 | $25 | Priority queue | One-time | **Yes** |
| 6 | Post-Conversion Care | `addon-post-care` | $49 | $25 | 30-day email support | One-time | **Yes** |

**Standard Conversion triggers:** Single-currency file, < 150 MB, standard account structure.  
**Complex Conversion triggers (any one):** Multi-currency enabled, file > 150 MB, payroll data spanning > 3 fiscal years, advanced inventory features enabled.  
**Guaranteed 30-Minute:** Full refund if turnaround exceeds 30 minutes.  
**File Health Check:** Pre-conversion diagnostic report on file integrity and compatibility.  
**Rush Delivery:** Priority queue processing; operator notified immediately.  
**Post-Conversion Care:** 30 days of email Q&A for post-conversion questions (setup, data verification, user migration).

---

### Category 2: Data Services (7 products)

| # | Product Name | Slug | Base Price | Launch Price | Turnaround | Stripe Type |
|---|---|---|---|---|---|---|
| 7 | Audit Trail Removal | `data-audit-trail-removal` | $99 | $50 | 1 business day | One-time |
| 8 | Super Condense | `data-super-condense` | $99 | $50 | 1 business day | One-time |
| 9 | List Reduction | `data-list-reduction` | $79 | $40 | 1 business day | One-time |
| 10 | Multi-Currency Removal | `data-multicurrency-removal` | $149 | $75 | 1 business day | One-time |
| 11 | QBO Readiness Report | `data-qbo-readiness` | $49 | $25 | Same day | One-time |
| 12 | CRA Period Copy | `data-cra-period-copy` | $99 | $50 | 1 business day | One-time |
| 13 | Audit Trail + CRA Bundle | `data-audit-cra-bundle` | $149 | $75 | 1 business day | One-time |

**Audit Trail Removal:** Removes audit trail data from QB file; reduces file size and improves performance.  
**Super Condense:** Removes old closed transactions to reduce file size; improves QB performance.  
**List Reduction:** Reduces customer/vendor/item list counts; targets files approaching Premier's 14,999 list limit.  
**Multi-Currency Removal:** Removes multi-currency configuration from a QB file for simplified operations.  
**QBO Readiness Report:** Analyzes a QB Desktop file and reports on readiness for migration to QuickBooks Online.  
**CRA Period Copy:** Extracts a specific fiscal period from a QB file for CRA audit purposes. Canadian-specific service; high demand Jan–Apr.  
**Audit Trail + CRA Bundle:** Both Audit Trail Removal and CRA Period Copy at a $49 discount vs. purchasing separately ($198 → $149 base).

---

### Category 3: Platform Migrations (2 products)

| # | Product Name | Slug | Base Price | Launch Price | Turnaround | Accepted Files |
|---|---|---|---|---|---|---|
| 14 | AccountEdge/MYOB → QuickBooks | `migration-accountedge` | $249 | $125 | 2–3 business days | `.myo`, `.myob` (TBC) |
| 15 | Sage 50/Simply Accounting → QuickBooks | `migration-sage50` | $249 | $125 | 2–3 business days | `.sai`, `.saj`, `.zip` (TBC) |

**Note:** Both migration products ship at v1.0 as flat-rate services matching E-Tech's baseline feature set. No complexity tiers in v1. v2 will add advanced data mapping and payroll history migration. Accepted file types must be confirmed by operator before launch content is published.

**What is NOT migrated (both products):**
- Payroll history (v1 limitation)
- Custom report templates and memorized reports
- Recurring transaction templates
- Bank reconciliation history
- Attached documents / scanned receipts

---

### Category 4: Expert Support (3 products)

| # | Product Name | Slug | Base Price | Launch Price | Billing | Tickets/mo | Response SLA |
|---|---|---|---|---|---|---|---|
| 16 | Essentials | `support-essentials` | $49/mo | $25/mo* | Monthly | 3 | ≤ 1 hr (biz hours) |
| 17 | Professional | `support-professional` | $99/mo | $50/mo* | Monthly | 8 | ≤ 1 hr (biz hours) |
| 18 | Premium | `support-premium` | $149/mo | $75/mo* | Monthly | Unlimited | ≤ 30 min (biz hours) |

*Launch price applies for first 3 months, then reverts to base price.

**All tiers include:**
- Business hours: Mon–Fri 9am–5pm ET
- Channel: Email via portal support ticket system
- 1 automated File Health Check per month
- Critical error triage: immediate acknowledgment, ≤ 1 hour human response regardless of tier
- After-hours tickets: first response at 9am next business day

**Professional tier adds:** File corruption diagnosis, data integrity analysis, list management, multi-user troubleshooting, optimization recommendations. **10% discount on all NexFortis services.**

**Premium tier adds:** Proactive file optimization, migration planning, priority conversion queue, 1 × 30-minute video call/month (Microsoft Bookings), **20% discount on all NexFortis services**, dedicated referral code ($25/referral paid via e-transfer).

---

### Category 5: Volume Packs (2 products)

| # | Product Name | Slug | Base Price | Launch Price | Effective Per-Conversion (Launch) | Valid |
|---|---|---|---|---|---|---|
| 19 | 5-Pack Conversions | `volume-pack-5` | $649 | $325 | $65/conversion | 12 months |
| 20 | 10-Pack Conversions | `volume-pack-10` | $1,199 | $600 | $60/conversion | 12 months |

**5-Pack details:** 5 conversions (Standard or Complex tier), pre-paid, transferable across client files, no auto-renewal, expires 12 months from purchase.  
**10-Pack details:** 10 conversions (Standard or Complex tier), pre-paid, transferable, no auto-renewal, expires 12 months from purchase. **Includes Guaranteed 30-Minute turnaround on all 10 conversions.**  
**Low-balance alert:** Automated email when pack reaches 80% usage (1 remaining on 5-pack; 2 remaining on 10-pack).

---

## Appendix B: Competitive Pricing Reference

All competitor prices converted to CAD at 1.38 exchange rate (USD × 1.38). For display on product detail pages.

| Service | NexFortis Launch (CAD) | NexFortis Base (CAD) | Big Red (USD → CAD) | E-Tech (USD → CAD) |
|---|---|---|---|---|
| Standard Conversion | **$75** | $149 | $249 → ~$344 | $299 → ~$413 |
| Complex Conversion | **$100** | $199 | $249 → ~$344 | $349–$450 → ~$482–$621 |
| Guaranteed 30-Min | **$125** | $249 | N/A (next-day only) | +$100 expedite → ~$138 |
| Audit Trail Removal | **$50** | $99 | Not offered | Not listed publicly |
| CRA Period Copy | **$50** | $99 | Not offered | Included in some services |
| AccountEdge Migration | **$125** | $249 | Not offered | Not listed publicly |
| Sage 50 Migration | **$125** | $249 | Not offered | Not listed publicly |
| Support Subscription | **$25–$75/mo** | $49–$149/mo | Not listed | Not listed |
| 5-Pack | **$325** ($65/ea) | $649 ($129.80/ea) | Not offered | Not offered |
| 10-Pack | **$600** ($60/ea) | $1,199 ($119.90/ea) | Not offered | Not offered |

**Key message for marketing copy:** "NexFortis is 42–57% cheaper than Big Red Consulting and 52–68% cheaper than E-Tech — with sub-1-hour turnaround vs. their 1-business-day standard. All prices in CAD — no currency surprise."

---

## Appendix C: File Type Acceptance Matrix

| Product Category | Accepted File Types | Max Size | Notes |
|---|---|---|---|
| Conversion Services (all 3 tiers) | `.qbm` | 500 MB | QBM = QuickBooks backup (portable). `.qbb` support targeted pre-launch. |
| Data Services | `.qbm` | 500 MB | Same as conversions. |
| AccountEdge/MYOB Migration | `.myo`, `.myob` | 500 MB | Operator to confirm exact format; update before content publish. |
| Sage 50/Simply Accounting Migration | `.sai`, `.saj`, `.zip` | 500 MB | Operator to confirm exact format; update before content publish. |
| Volume Packs (redemption) | `.qbm` | 500 MB | Same restriction as standard conversions. |

**UI requirement:** The file upload component on each order form must dynamically set the `accept` attribute based on the product being ordered. A conversion order renders `accept=".qbm"`. A migration order renders the migration-specific accept list. The upload component must display the accepted file types as help text beneath the upload dropzone.

---

*PRD version 1.0 — March 23, 2026. Owner: Hassan Sadiq. Next review: post-v1.0 launch retrospective.*
