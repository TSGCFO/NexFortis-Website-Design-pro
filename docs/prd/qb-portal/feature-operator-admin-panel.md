# Feature PRD: Operator Admin Panel

**Document version:** 1.0 — QB Portal Production Launch Epic
**Author:** NexFortis Product (Hassan Sadiq)
**Last updated:** June 2025

---

## 1. Feature Name

**QB Portal Operator Admin Panel** — A secure, mobile-responsive web interface at `qb.nexfortis.com/admin` that gives Hassan Sadiq (and any future operator) full visibility and control over every operational aspect of the QB Portal: orders, customers, support tickets, subscriptions, promo codes, and product catalogue.

---

## 2. Epic

**Parent Epic:** QB Portal Production Launch

**Related Documents:**
- PRD Context: `/docs/prd/qb-portal/prd-context.md`
- Support Subscription PRD: `/docs/prd/qb-portal/feature-support-subscription.md`
- Operator Runbook: `/docs/operator_runbook.md`
- Email Templates: `/docs/email_templates.md`
- Portal Architecture: `artifacts/qb-portal/` (React 19 + Vite 7, Tailwind v4)
- API Server: `artifacts/api-server/` (Express 5, Drizzle ORM, Stripe, multer)
- API Spec: `lib/api-spec/` (OpenAPI 3.1)

---

## 3. Goal

### Problem

Hassan currently monitors the QB Portal through a patchwork of external dashboards: Stripe for payment status, a personal email inbox for order notifications, a file system for downloaded and processed files, and the QB CLI for conversion runs. There is no unified view of what is pending, what is in-flight, or what needs attention. As order volume and subscription count grow, this approach will cause missed SLAs, lost files, unanswered tickets, and an inability to audit business health at a glance. The support subscription product — with its 1-hour and 30-minute SLA commitments — demands a purpose-built triage interface, not an email inbox. Promo code creation, product pricing edits, and subscription management all currently require direct database or Stripe dashboard manipulation, which is fragile and error-prone.

### Solution

A first-party admin panel embedded in the QB Portal application, protected by an operator-level authentication role. The panel consolidates the complete operational workflow into seven sections: Dashboard, Order Management, Customer Management, Support Ticket Management, Subscription Management, Promo Code Management, and Product & Pricing Management. It surfaces SLA timers, priority indicators, and one-click actions so Hassan can process a new order, respond to a ticket, or create a promo code without switching context. At launch the workflow remains manual (5–6 minutes per order via CLI), but the admin panel provides the structured interface that makes that workflow reliable and auditable.

### Impact

| Metric | Target |
|--------|--------|
| Order processing time | Reduce context-switching overhead; all order actions in one screen |
| SLA breach rate | < 5% of tickets breach SLA (1hr Essentials/Professional, 30min Premium) during business hours |
| Missed orders | 0 orders missed due to notification failure — admin panel is primary triage surface |
| Promo code creation time | < 2 minutes from intent to live code |
| Product price update time | < 1 minute per product edit |
| Admin session mobile usability | All critical actions (order status update, ticket reply, file upload) completable on a 375px viewport |

---

## 4. User Personas

### P1 — Hassan Sadiq (Operator / Owner)
The sole operator at launch. Processes 100% of orders, responds to all support tickets, manages all subscriptions, and makes all pricing decisions. Works from a Windows desktop (primary) and an Android phone (secondary — for responding to urgent tickets while away from desk). Has deep QuickBooks and CLI expertise but should not need to touch the database directly for routine operational tasks. Values speed, clarity, and not missing time-sensitive work.

### P2 — Future Operator (Delegated Staff)
A future hire or contractor who may take on order processing or tier-1 support ticket triage. Needs the same interface as P1 but with potentially narrowed permissions (e.g., no ability to change pricing or create promo codes). Role-based access is an architectural consideration at launch even if only one role is deployed.

---

## 5. User Stories

### 5.1 — Dashboard

**US-01:** As an Operator, I want to see a real-time summary of today's revenue, pending orders, open tickets, and active subscriptions on a single dashboard screen so that I can assess business health in under 10 seconds.

**US-02:** As an Operator, I want to see a prioritized activity feed of recent events (new orders, new tickets, SLA warnings, failed payments) so that I know exactly what requires my attention next.

**US-03:** As an Operator, I want Rush Delivery orders and Premium subscriber tickets visually flagged in the activity feed so that I can process them ahead of standard-priority items.

---

### 5.2 — Order Management

**US-04:** As an Operator, I want to view all orders in a filterable, paginated list showing status (pending, processing, completed, failed, cancelled), customer name, product name, and order date so that I can triage the queue efficiently.

**US-05:** As an Operator, I want to open any order's detail page to see the complete order context — customer info, all products and add-ons purchased, payment status, uploaded file details, and current status — so that I can start processing without switching to Stripe.

**US-06:** As an Operator, I want to download the customer's uploaded `.QBM` file directly from the order detail page so that I can save it to `C:\Projects\qb-orders\<order-id>\input.qbm` in one click.

**US-07:** As an Operator, I want to upload the processed `converted.qbm` and `report.html` files to the order record so that they are stored against the order and can be delivered to the customer.

**US-08:** As an Operator, I want to update an order's status (Pending → Processing → Completed, or → Failed/Cancelled) with a single button click so that the customer portal reflects the current state.

**US-09:** As an Operator, I want to add internal notes to an order (e.g., "File was US edition, warned customer", "Re-upload requested") so that the full resolution history is preserved even when the workflow deviates from the standard runbook.

**US-10:** As an Operator, I want to trigger the customer delivery email (Template #2 or #3) directly from the order detail page — with the processed files attached — so that I do not need to compose a manual email.

**US-11:** As an Operator, I want to issue a full refund for a failed order from the order detail page, which calls the Stripe Refund API and updates the order status to Cancelled/Refunded, so that I can close out failed orders in under 30 seconds.

**US-12:** As an Operator, I want Rush Delivery orders visually distinguished in the order list (badge, border colour, or pinned to top) so that I process them within the 15-minute SLA without manual sorting.

**US-13:** As an Operator, I want to filter orders by status, date range, customer name or email, and product type so that I can locate any order quickly without scrolling through the full list.

---

### 5.3 — Customer Management

**US-14:** As an Operator, I want to search for any customer by name, email, or company and view their full profile: registration date, order history, subscription status, and open support tickets so that I have complete context before replying to any communication.

**US-15:** As an Operator, I want the customer list paginated and searchable with at least name, email, and subscription tier visible at a glance so that I can identify high-value customers quickly.

---

### 5.4 — Support Ticket Management

**US-16:** As an Operator, I want to see all support tickets in a prioritized list where Premium subscriber tickets appear first, Critical severity tickets are flagged with an alert colour, and a live countdown timer shows time remaining before SLA breach so that I never miss a response window.

**US-17:** As an Operator, I want to open a ticket and compose a reply in a rich-text or plain-text field, then click "Send Reply" to dispatch the email to the customer via Resend and record the response in the ticket record so that I can respond without leaving the admin panel.

**US-18:** As an Operator, I want to update a ticket's status (Open → In Progress → Resolved → Closed) from the ticket detail page so that the customer's portal reflects current progress.

**US-19:** As an Operator, I want to see the customer's subscription tier, remaining ticket count, and SLA deadline prominently displayed on the ticket detail page so that I understand the response commitment without cross-referencing another screen.

**US-20:** As an Operator, I want to flag a ticket as escalated with a reason note so that any future operator can see it requires special handling.

**US-21:** As an Operator, I want to attach files (e.g., health check reports, diagnostic exports) to a ticket reply so that I can deliver results in the same action as my written response.

**US-22:** As an Operator, I want to mark a file health check as Complete and attach the report PDF from the ticket or order management view so that the customer's portal reflects the finished report.

---

### 5.5 — Promo Code Management

**US-23:** As an Operator, I want to create a new promo code with all supported constraint types (percentage off, fixed amount off, free product, subscription-only) so that I can run promotions without touching the database.

**US-24:** As an Operator, I want to set usage limits (per-code max uses, per-customer max uses), expiration date/time, and product restrictions on each promo code so that codes cannot be over-redeemed or misapplied.

**US-25:** As an Operator, I want to view analytics for any active or expired promo code — total redemptions, unique customers, revenue impact, and conversion rate — so that I can evaluate promotion effectiveness.

**US-26:** As an Operator, I want to deactivate or reactivate any promo code with a single toggle so that I can end a campaign immediately without deleting historical data.

**US-27:** As an Operator, I want to see the referral codes generated for Premium subscribers listed alongside their subscriber name so that I can trace referral activity.

---

### 5.6 — Product & Pricing Management

**US-28:** As an Operator, I want to edit any product's name, description, price (base and launch-promo price), and availability status directly from the admin panel so that I do not need a code deployment to update a price.

**US-29:** As an Operator, I want to toggle any product active or inactive, with inactive products removed from the public catalogue immediately, so that I can respond to demand or supply constraints in real time.

**US-30:** As an Operator, I want a global launch promo toggle (on/off) that applies or removes the 50% strikethrough discount across all eligible products simultaneously so that I can end the launch promotion with one action.

**US-31:** As an Operator, I want to update a product's image URL from the admin panel so that I can refresh visual assets without a code deployment.

---

### 5.7 — Subscription Management

**US-32:** As an Operator, I want to view all active subscriptions grouped by tier (Essentials, Professional, Premium) with subscriber name, status, billing renewal date, and ticket usage for the current cycle so that I can monitor subscription health.

**US-33:** As an Operator, I want to manually override a subscriber's plan tier (e.g., to correct a billing error or apply a goodwill upgrade) with a reason note recorded in the audit log so that I can handle exceptions without direct database access.

**US-34:** As an Operator, I want to mark a subscription cancellation request as processed, trigger the Stripe cancel-at-period-end action, and record a refund reason note so that subscriber cancellations are handled completely from one interface.

**US-35:** As an Operator, I want to see subscriptions flagged when they are `past_due` so that I can proactively reach out before access is suspended.

---

## 6. Requirements

### 6.1 Functional Requirements

#### Authentication & Authorization

- **FR-01:** The admin panel must be accessible only to users with `role = 'operator'` in the `users` table. Any request to an `/admin/*` route by a non-operator user must return `403 Forbidden` and redirect to the portal login page.
- **FR-02:** Operator authentication must use the same HMAC-signed token infrastructure as customer auth, with a separate token scope claim (`scope: 'operator'`) so that a compromised customer token cannot be escalated to operator access.
- **FR-03:** Admin API routes (all `GET/POST/PATCH/DELETE /api/admin/*`) must validate the operator token on every request via middleware. Token validation failure must return `401 Unauthorized`.
- **FR-04:** The admin panel must implement a session idle timeout: after 30 minutes of inactivity, the operator token must be invalidated client-side and the operator redirected to the login screen.
- **FR-05:** All admin actions that mutate data (status changes, refunds, price edits, promo code creation/deactivation) must be recorded in an `admin_audit_log` table with: operator user ID, action type, affected entity type and ID, previous value (JSON), new value (JSON), and timestamp.

---

#### Dashboard (Section 6)

- **FR-06:** The dashboard must display the following KPI cards, updated on page load and on manual refresh: (a) Revenue Today (sum of completed Stripe charges, CAD), (b) Revenue This Week, (c) Revenue This Month, (d) Pending Orders count, (e) Open Support Tickets count, (f) Active Subscriptions count.
- **FR-07:** The activity feed must display the 20 most recent events across all entity types: new orders, new support tickets, subscription activations/cancellations, failed payments, file uploads (health checks), and SLA breach warnings. Each event must link directly to the relevant entity's detail view.
- **FR-08:** Rush Delivery orders must be visually distinguished in the activity feed with a "RUSH" badge. Critical severity tickets must be visually distinguished with a "CRITICAL" badge and red accent. Premium subscriber tickets must show a "PREMIUM" badge.
- **FR-09:** Dashboard data must load in < 3 seconds. A manual refresh button must trigger a fresh API fetch without a full page reload.

---

#### Order Management

- **FR-10:** The order list must display all orders with columns: Order ID, Customer Name, Product(s), Add-ons, Order Date, Payment Status (paid/refunded/failed), Order Status (pending/processing/completed/failed/cancelled), and File Received indicator.
- **FR-11:** The order list must support filtering by: status (multi-select), date range (date picker), customer name or email (text search), and product category. Filters must be combinable. Results must be paginated at 25 orders per page.
- **FR-12:** Rush Delivery orders must be visually pinned to the top of the default (unfiltered) order list view. Within the Rush group, orders are sorted ascending by order date (oldest first — FIFO).
- **FR-13:** The order detail page must display: all customer fields (name, email, company, phone if provided), all products/add-ons purchased with individual prices, total amount paid, Stripe Payment Intent ID (as a link to Stripe dashboard), file upload details (filename, size, upload timestamp, download link), current status, status history log, and internal notes.
- **FR-14:** The operator must be able to download the customer's uploaded `.QBM` file directly from the order detail page. The download endpoint must be authenticated (operator-only) and must not expose a publicly guessable file URL. Download must serve the file with `Content-Disposition: attachment`.
- **FR-15:** The operator must be able to upload up to 3 output files (e.g., `converted.qbm`, `report.html`, any add-on outputs) to an order record. Accepted MIME types: `.qbm`, `.html`, `.pdf`, `.txt`. Max file size per upload: 50 MB. Files must be stored in the same secured file storage as customer uploads.
- **FR-16:** Order status transitions must follow this state machine: `pending` → `processing` → `completed` | `failed` | `cancelled`. Direct transitions from `pending` to `completed` or `cancelled` must also be permitted to accommodate single-step resolution. The UI must display only the valid next states as selectable options.
- **FR-17:** The operator must be able to add an internal note (plain text, max 2000 chars) to any order at any time. Notes must display with operator name and timestamp. Notes must not be visible to the customer.
- **FR-18:** A "Send Delivery Email" button on a completed order must open a pre-populated email compose modal (from email Template #2 or #3 depending on service type) with the processed output files attached. Clicking "Send" must dispatch the email via Resend API and record a `delivery_email_sent` event in the order log.
- **FR-19:** A "Issue Refund" button on any paid order must trigger a Stripe full refund for the order's payment intent. The system must: call `stripe.refunds.create({ payment_intent: ... })`, update order status to `cancelled`, set a `refund_reason` note, and record the action in `admin_audit_log`. Partial refunds are out of scope at launch.
- **FR-20:** After a refund is issued, a "Send Refund Email" button must dispatch Email Template #4 to the customer with the correct reason pre-filled based on the refund reason note.

---

#### Customer Management

- **FR-21:** The customer list must display all registered users with: name, email, company, registration date, total orders, subscription tier (or "None"), and last activity date. Paginated at 50 per page.
- **FR-22:** Customer search must accept partial matches on name, email, or company name and return results in < 500ms for a database of up to 10,000 customers.
- **FR-23:** The customer detail page must display: full profile fields, all orders (linked to order detail), subscription status and history, all support tickets (linked to ticket detail), and total lifetime spend.
- **FR-24:** Guest checkout orders (no registered account) must appear in a separate "Guest Orders" view accessible from the order management section. Guest orders cannot have a customer profile page.

---

#### Support Ticket Management

- **FR-25:** The ticket list must display all tickets with columns: Ticket ID, Customer Name, Subscription Tier, Subject, Severity (Normal/Urgent/Critical), Status (open/in_progress/resolved/closed), SLA Deadline, and Time Until Breach (live countdown if < 60 minutes remaining).
- **FR-26:** SLA deadlines must be calculated as follows:
  - Premium subscriber tickets: first response required within 30 minutes of submission (during business hours ET)
  - Essentials/Professional subscriber tickets: first response required within 60 minutes of submission (during business hours ET)
  - After-hours submissions: SLA clock starts at 9am ET the next business day
  - Critical severity (any tier): 60-minute SLA regardless of tier
- **FR-27:** The ticket list must support filtering by: status (multi-select), severity (multi-select), subscription tier (multi-select), and customer name or email (text search). Default sort: SLA deadline ascending (most urgent first).
- **FR-28:** Tickets breaching SLA (time elapsed > SLA threshold without a first operator response) must be visually marked with a "BREACHED" badge and sorted to the top of the default list view.
- **FR-29:** The ticket detail page must display: customer name, email, subscription tier, current tickets used / monthly limit, SLA deadline with countdown, ticket subject, description, severity, all status history, all prior replies in chronological order (with timestamps), and any attached files.
- **FR-30:** The operator must be able to compose a reply in a plain-text area (max 5000 chars) and optionally attach up to 5 files (any type, max 20 MB each). Clicking "Send Reply" must: dispatch the reply email to the customer via Resend API using the customer's registered email address, save the reply text and attachments to the ticket record, update ticket status to `in_progress` (if currently `open`), and record a `first_response_at` timestamp on the ticket (only the first reply sets this field — subsequent replies do not overwrite it).
- **FR-31:** The operator must be able to update ticket status independently of sending a reply (e.g., mark as `resolved` without a new reply if the previous reply was the resolution).
- **FR-32:** A "Escalate" flag must be settable on any ticket with a free-text reason (max 500 chars). Escalated tickets must display an "ESCALATED" badge in the list and detail views.
- **FR-33:** For health check tickets/records, an "Attach Report & Complete" action must be available on the ticket detail page. This action must: accept a PDF or text file upload (max 20 MB), attach it to the `file_health_checks` record, update `file_health_checks.status` to `completed`, and send the `health-check-report-ready` email to the customer.
- **FR-34:** The ticket list must display the count of tickets used vs. allowed this billing period for each subscriber, visible without opening the ticket detail.

---

#### Promo Code Management

- **FR-35:** The promo code creation form must accept the following fields:
  - Code string (uppercase alphanumeric, 4–20 chars, unique; auto-generate button available)
  - Discount type: `percentage` | `fixed_amount` | `free_product` | `subscription_only`
  - Discount value (percentage 1–100, or fixed amount in CAD cents, or product ID for free product)
  - Maximum total redemptions (integer ≥ 1, or unlimited)
  - Maximum redemptions per customer (integer ≥ 1, default 1)
  - Expiration date/time (optional; timezone = America/Toronto)
  - Product restriction: applicable to all products, or restricted to specific product IDs (multi-select)
  - Stackable: boolean (whether this code can be combined with other active codes; default false)
  - Internal label (operator-only description, max 200 chars)
- **FR-36:** On creation, a `promo_codes` record must be written to the database. The code must be immediately active unless the operator sets `active = false` on creation.
- **FR-37:** The promo code list must display: code string, discount type/value, total uses, max uses, expiration date, status (active/inactive/expired), and product restrictions summary. Paginated at 50 per page.
- **FR-38:** Promo code analytics per code must display: total redemption count, unique customer count, total discount value applied (CAD), and estimated revenue influenced (total order value of orders using this code).
- **FR-39:** A toggle control on each code must allow the operator to set `active = true/false` without deleting the record. Deactivated codes must return an error at checkout. The toggle must be operable from the list view without opening the detail page.
- **FR-40:** Expired codes (past expiration date/time) must automatically transition to `expired` status. Expired codes must not be redeemable at checkout regardless of the `active` flag.
- **FR-41:** Premium subscriber referral codes (generated by the subscription system) must appear in the promo code list with a "REFERRAL" label and a link to the subscriber's customer profile. Referral codes must not be editable via the promo code form (they are managed by the subscription system).

---

#### Product & Pricing Management

- **FR-42:** The product list must display all 20 launch products with columns: product name, category, base price (CAD), launch promo price (CAD), active/inactive status, and last updated timestamp.
- **FR-43:** The product edit form must allow updating: display name (max 100 chars), short description (max 300 chars), long description / service detail copy (max 5000 chars, markdown supported), base price (CAD, minimum $0.01), launch promo price (CAD, optional — leave blank to use base price), availability toggle (active/inactive), product image URL, and product category.
- **FR-44:** Price changes must take effect immediately for new orders. In-flight orders (status = pending or processing) at the time of a price change must retain the price at which they were placed (stored on the order record).
- **FR-45:** A global Launch Promo toggle must appear at the top of the Product Management section. When toggled OFF, all products revert to displaying their base prices only (no strikethrough). When toggled ON, all products with a non-null `launch_promo_price` display the strikethrough. This toggle must update a `config.launch_promo_active` setting in the database, not edit individual product records.
- **FR-46:** Toggling a product inactive must remove it from the public catalogue immediately (products API excludes inactive products). The admin panel must show inactive products clearly labelled so the operator can reactivate them.
- **FR-47:** The product edit history for each product must be viewable as a log of: timestamp, operator, field changed, previous value, new value. This log is stored in `admin_audit_log`.

---

#### Subscription Management

- **FR-48:** The subscription list must display all subscriptions (active, past_due, pending_downgrade, cancelled) grouped by tier. Visible columns: subscriber name, email, tier, status, billing renewal date, tickets used this cycle / monthly limit, subscription start date.
- **FR-49:** The operator must be able to manually override a subscriber's plan tier from the subscription detail page. The override must: update `subscriptions.plan_tier` in the database, create a `subscription_events` record with event type `manual_override`, record the reason note in `admin_audit_log`, and NOT trigger a Stripe charge or credit (this is an administrative correction only).
- **FR-50:** The operator must be able to trigger a cancel-at-period-end action from the subscription detail page. This must call `stripe.subscriptions.update({ cancel_at_period_end: true })`, update `subscriptions.cancel_at_period_end = true`, and record the action in `admin_audit_log`.
- **FR-51:** Subscriptions with `status = 'past_due'` must be visually flagged with a "PAST DUE" badge in the subscription list.
- **FR-52:** The subscription detail page must display the full `subscription_events` history for that subscription (all upgrades, downgrades, payment failures, etc.) in chronological order.
- **FR-53:** The operator must be able to see the exact ticket usage count for any subscriber for the current billing period, with a link to filter the ticket list to that subscriber's tickets.

---

### 6.2 Non-Functional Requirements

- **NFR-01 — Authentication Security:** The `/admin` route and all `/api/admin/*` endpoints must be inaccessible without a valid operator-scoped token. A customer token must not unlock any admin functionality. Pen-test scenario: manually replacing a customer JWT with `"role": "operator"` must be rejected because the HMAC signature will be invalid.
- **NFR-02 — Audit Completeness:** Every mutating admin action (all POST/PATCH/DELETE on admin routes) must write a record to `admin_audit_log` before the action is confirmed to the client. If the audit write fails, the action must be rolled back (use a database transaction).
- **NFR-03 — Mobile Responsiveness:** All admin sections must be fully operable on viewports ≥ 375px (iPhone SE / Samsung Galaxy A series). Critical actions — marking an order complete, sending a ticket reply, updating order status — must be achievable without horizontal scrolling. Tables must stack or scroll horizontally on mobile with sticky first column.
- **NFR-04 — Page Load Performance:** Each admin section's primary list view (orders, tickets, customers, subscriptions, promo codes) must load and render its first page of results in < 2 seconds on a standard broadband connection. Dashboard KPI cards must load in < 3 seconds.
- **NFR-05 — API Pagination:** All list-returning admin API endpoints must support `limit` and `offset` (or cursor-based) pagination. Default page size: 25 for orders/tickets, 50 for customers/subscriptions/promo codes. Maximum page size: 100 for all endpoints.
- **NFR-06 — File Download Security:** Customer-uploaded `.QBM` files must only be downloadable via authenticated admin API routes that verify operator token. Direct S3/storage URLs (if applicable) must be signed with a 15-minute expiry and must not be logged or cached in browser history.
- **NFR-07 — Stripe API Safety:** All Stripe-mutating operations (refunds, subscription updates) in the admin panel must use idempotency keys (e.g., `admin-refund-{order_id}`) to prevent double-execution on retry.
- **NFR-08 — SLA Timer Accuracy:** SLA countdown timers in the ticket list must update in real time (client-side countdown from the calculated deadline). Timer must use America/Toronto timezone for business hours detection. Timers must not require a WebSocket — client-side JavaScript countdown is sufficient.
- **NFR-09 — Data Integrity — Refunds:** Issuing a refund must be atomic: either the Stripe refund call succeeds AND the order status is updated, or neither happens. If the Stripe call fails, the order status must remain unchanged and the error must be displayed to the operator.
- **NFR-10 — Accessibility:** Admin panel UI must meet WCAG 2.1 AA standards. Status badges must not rely on colour alone — they must include a text label. Form inputs must have visible labels and appropriate ARIA roles.
- **NFR-11 — No Real-Time Infrastructure Required at Launch:** The admin panel does not require WebSockets or server-sent events. Manual page refresh and a visible "Refresh" button are acceptable for updating list views. SLA timers count down client-side from the pre-calculated deadline loaded at page open.
- **NFR-12 — Tech Stack Consistency:** The admin panel must be implemented within the existing `artifacts/qb-portal` React 19 + Vite 7 + Tailwind v4 + Wouter application. No separate admin application is to be created. Admin routes are simply gated React routes under `/admin/*` with operator role enforcement.

---

## 7. Acceptance Criteria

### AC-01: Admin Route Access Control

- Given: A user with `role = 'customer'` is authenticated and navigates to `/admin`
- When: The router resolves the route
- Then:
  - [ ] The user is redirected to the customer portal home (or login page if unauthenticated)
  - [ ] No admin UI is rendered, even briefly
  - [ ] Any direct fetch to `/api/admin/*` returns `403 Forbidden`
  - [ ] The operator account can successfully access `/admin` with a valid operator token

---

### AC-02: Dashboard KPI Cards

- Given: An authenticated operator navigates to `/admin`
- When: The dashboard loads
- Then:
  - [ ] All six KPI cards are visible: Revenue Today, Revenue This Week, Revenue This Month, Pending Orders, Open Tickets, Active Subscriptions
  - [ ] Each value reflects the current database state (verified against direct DB query)
  - [ ] A "Refresh" button triggers a re-fetch without full page reload
  - [ ] Cards load in < 3 seconds on a standard broadband connection
  - [ ] At least one Rush Delivery order and one Critical ticket (if any exist) are badged in the activity feed

---

### AC-03: Order List and Filtering

- Given: The operator navigates to `/admin/orders`
- When: The page loads with 50 test orders of mixed status
- Then:
  - [ ] All orders are visible and paginated at 25 per page
  - [ ] Filtering by status "pending" shows only pending orders
  - [ ] Filtering by date range returns only orders within the range
  - [ ] Text search on customer email returns matching orders in < 500ms
  - [ ] Rush Delivery orders appear pinned above non-rush pending orders
  - [ ] Applying multiple filters simultaneously returns the correct intersection

---

### AC-04: Order Detail — File Download

- Given: A pending order exists with a `.QBM` file uploaded by the customer
- When: The operator opens the order detail page and clicks "Download File"
- Then:
  - [ ] The browser initiates a download of the `.QBM` file with `Content-Disposition: attachment`
  - [ ] The download URL is an authenticated endpoint — accessing it without an operator token returns `403`
  - [ ] The download URL is not a publicly guessable direct storage path

---

### AC-05: Order Status Update + Internal Note

- Given: A pending order is open in the operator's order detail view
- When: The operator selects "Mark as Processing" and adds an internal note "Dry-run passed, running full conversion"
- Then:
  - [ ] Order status in database updates to `processing`
  - [ ] Customer portal reflects "Processing" status for that order
  - [ ] Internal note is saved with operator name and timestamp
  - [ ] Note is not visible in the customer portal
  - [ ] Action is recorded in `admin_audit_log`

---

### AC-06: Refund Issuance

- Given: An order with status `pending` or `processing` exists with a successful Stripe payment
- When: The operator clicks "Issue Refund" and confirms
- Then:
  - [ ] Stripe Refund API is called with the order's payment intent ID
  - [ ] On Stripe success: order status updates to `cancelled`, a refund reason is recorded
  - [ ] If Stripe call fails: order status remains unchanged, error message is shown to operator
  - [ ] Action is recorded in `admin_audit_log` with previous and new status
  - [ ] Customer portal reflects the refunded/cancelled state
  - [ ] "Send Refund Email" button becomes available on the order

---

### AC-07: Delivery Email Send

- Given: An order has been marked Complete and output files have been uploaded
- When: The operator clicks "Send Delivery Email"
- Then:
  - [ ] A pre-populated email compose modal appears using the correct template (Template #2 for conversions, Template #3 for data services)
  - [ ] Uploaded output files are listed as attachments
  - [ ] Operator can edit the email body before sending
  - [ ] Clicking "Send" dispatches the email via Resend API to the customer's email address
  - [ ] A `delivery_email_sent` event is recorded in the order log with timestamp
  - [ ] The modal closes and a success toast is shown

---

### AC-08: Ticket List — SLA Ordering and Timers

- Given: The operator navigates to `/admin/tickets` with a mix of ticket types
- When: The page loads
- Then:
  - [ ] Tickets are sorted by SLA deadline ascending (most urgent first) by default
  - [ ] Premium subscriber tickets show a "PREMIUM" badge
  - [ ] Critical tickets show a "CRITICAL" badge with red accent
  - [ ] Tickets with < 60 minutes remaining show a live countdown timer that decrements in real time
  - [ ] Breached tickets (SLA exceeded without first response) show a "BREACHED" badge and appear at top
  - [ ] After-hours tickets do not show as breaching — their SLA clock starts at 9am ET the next business day

---

### AC-09: Ticket Reply

- Given: An open ticket from a Premium subscriber is visible in the ticket detail view
- When: The operator types a reply, optionally attaches a file, and clicks "Send Reply"
- Then:
  - [ ] The reply email is dispatched to the customer's email via Resend
  - [ ] The reply is saved to the ticket record with operator name and timestamp
  - [ ] Ticket status updates to `in_progress` (if it was `open`)
  - [ ] `first_response_at` timestamp is set on the ticket (not overwritten on subsequent replies)
  - [ ] SLA compliance is recalculated: if response was within SLA, the ticket is marked compliant
  - [ ] The operator sees a success confirmation

---

### AC-10: Health Check Report Delivery

- Given: A subscriber's health check is in `pending` status
- When: The operator attaches a completed report PDF and clicks "Mark Complete"
- Then:
  - [ ] The report file is saved to secure storage
  - [ ] `file_health_checks.status` updates to `completed` with `report_completed_at` timestamp
  - [ ] `health-check-report-ready` email is sent to the customer via Resend
  - [ ] The report is visible in the customer's portal Support tab
  - [ ] Action is recorded in `admin_audit_log`

---

### AC-11: Promo Code Creation

- Given: The operator navigates to `/admin/promo-codes` and clicks "Create New Code"
- When: They fill in all required fields (code string "LAUNCH50OFF", 50% discount, expires in 30 days, all products, max 100 uses) and submit
- Then:
  - [ ] A `promo_codes` record is created in the database with `active = true`
  - [ ] The code is immediately valid at checkout — a test checkout applying the code receives the 50% discount
  - [ ] The code appears in the promo code list with correct columns
  - [ ] Submitting a duplicate code string returns a validation error before DB insert
  - [ ] Action is recorded in `admin_audit_log`

---

### AC-12: Promo Code Deactivation

- Given: An active promo code exists in the list
- When: The operator toggles the code to inactive from the list view
- Then:
  - [ ] `promo_codes.active` updates to `false` immediately
  - [ ] Attempting to apply the code at checkout returns an error ("This promo code is no longer active")
  - [ ] The code remains visible in the list with an "Inactive" status badge
  - [ ] The toggle can be reversed to reactivate the code
  - [ ] Action is recorded in `admin_audit_log`

---

### AC-13: Product Price Edit

- Given: The operator navigates to `/admin/products` and opens a product edit form
- When: They change the base price from $149 to $159 and save
- Then:
  - [ ] The product record in the database reflects the new price
  - [ ] The public catalogue at `/catalog` displays the new price within one page load (no CDN delay required at launch)
  - [ ] A new order placed for this product is charged $159
  - [ ] An existing order (status = pending) placed before the price change retains the original $149 price
  - [ ] Price change is recorded in `admin_audit_log` with old and new value

---

### AC-14: Global Launch Promo Toggle

- Given: The global launch promo is currently active (all products show strikethrough prices)
- When: The operator toggles "Launch Promo" to OFF in Product Management
- Then:
  - [ ] `config.launch_promo_active` is set to `false` in the database
  - [ ] All product pages and the catalogue immediately show only base prices (no strikethrough)
  - [ ] Individual product `launch_promo_price` values are NOT modified — they remain stored for potential reactivation
  - [ ] Toggling back to ON restores strikethrough pricing across all products
  - [ ] Toggle action is recorded in `admin_audit_log`

---

### AC-15: Subscription Manual Override

- Given: An Essentials subscriber's detail page is open
- When: The operator selects "Override to Professional" with reason "Goodwill upgrade — 1 month" and confirms
- Then:
  - [ ] `subscriptions.plan_tier` updates to `professional` immediately
  - [ ] A `subscription_events` record is created with `event_type = 'manual_override'`
  - [ ] No Stripe charge or credit is triggered
  - [ ] The subscriber's portal reflects Professional tier benefits (8 ticket limit, etc.)
  - [ ] Action with reason is recorded in `admin_audit_log`

---

### AC-16: Mobile Usability

- Given: The operator is on a mobile device (375px viewport, e.g., iPhone SE)
- When: Navigating to the order detail page for a pending order
- Then:
  - [ ] All order detail fields are readable without horizontal scrolling
  - [ ] "Download File", "Mark as Processing", "Add Note", and "Issue Refund" buttons are tappable (min 44x44px touch target)
  - [ ] The file upload input for processed files is functional on mobile
  - [ ] The ticket reply textarea and "Send Reply" button are accessible on mobile
  - [ ] The admin navigation menu collapses to a hamburger menu on mobile

---

## 8. Out of Scope

The following are explicitly excluded from this feature's v1 implementation:

- **Role-based access control (RBAC) beyond operator/customer.** Only two roles exist at launch: `customer` and `operator`. Fine-grained permissions (e.g., read-only operator, ticket-only access) are a future enhancement when a second operator is onboarded.
- **Real-time push notifications / WebSocket updates.** The admin panel uses polling (manual refresh). Live order notifications are handled via Resend email to support@nexfortis.com.
- **In-app email inbox.** The admin panel sends emails via Resend but does not receive or display email replies. Customer email replies go to support@nexfortis.com and are handled outside the portal at launch.
- **Full email thread display in ticket detail.** Only the original ticket and operator-sent replies are shown. Inbound customer email replies are not ingested into the ticket system at launch.
- **Partial refunds.** The refund action issues a full refund only. Partial refunds require direct Stripe dashboard access.
- **Bulk actions.** Bulk status update, bulk email send, and bulk export are not required at launch.
- **CSV / data export.** Revenue, order, and customer data export to CSV is out of scope. Financial reporting is done via the Stripe dashboard at launch.
- **Analytics dashboards beyond basic KPI cards.** Funnel analysis, cohort analysis, churn rate tracking, and conversion attribution are future data/analytics features.
- **Automated CLI invocation.** The admin panel does not execute the QB CLI. The operator still runs `qb-convert` manually and uploads the output via the admin panel.
- **Multi-operator assignment / ticket ownership.** Tickets cannot be assigned to specific operators. All tickets are handled by Hassan at launch.
- **Customer communication history (email thread).** The admin panel records that a delivery email or refund email was sent (event log), but does not store the full email body for archival.
- **Stripe Connect or multi-currency.** All payments are single-account, CAD.
- **Two-factor authentication for the admin account.** Strong password + HMAC token is the auth model at launch. 2FA is a future security enhancement.
- **Automated file deletion (7-day retention policy).** The runbook specifies deleting customer files after 7 days. This automation is not in the admin panel scope — it is a separate background job (cron) to be built separately.

---

## 9. Technical Specifications

### 9.1 Architecture Overview

The admin panel is a set of gated routes within the existing `artifacts/qb-portal` React SPA. No separate application is deployed.

```
artifacts/qb-portal/src/
  pages/
    admin/
      AdminLayout.tsx          # Persistent sidebar nav + mobile hamburger
      AdminDashboard.tsx       # Section 1: Dashboard + KPI cards + activity feed
      orders/
        OrderList.tsx          # Section 2a: Filterable/paginated order list
        OrderDetail.tsx        # Section 2b: Full order detail + actions
      customers/
        CustomerList.tsx       # Section 3a: Searchable customer list
        CustomerDetail.tsx     # Section 3b: Customer profile
      tickets/
        TicketList.tsx         # Section 4a: Prioritized ticket list + SLA timers
        TicketDetail.tsx       # Section 4b: Ticket detail + reply compose
      subscriptions/
        SubscriptionList.tsx   # Section 5a: Subscription list grouped by tier
        SubscriptionDetail.tsx # Section 5b: Subscription history + override
      promos/
        PromoCodeList.tsx      # Section 6a: Promo code list + toggle
        PromoCodeCreate.tsx    # Section 6b: Create/edit form
        PromoCodeDetail.tsx    # Section 6c: Analytics view
      products/
        ProductList.tsx        # Section 7a: Product list + global promo toggle
        ProductEdit.tsx        # Section 7b: Product edit form
  components/admin/
    SlaTimer.tsx               # Countdown timer component
    StatusBadge.tsx            # Reusable status + severity badges
    AdminTable.tsx             # Sortable/paginated table base component
    FileUploadRow.tsx          # File upload for processed order outputs
    ReplyCompose.tsx           # Ticket reply textarea + file attach + send
    KpiCard.tsx                # Dashboard metric card
    ActivityFeed.tsx           # Recent events feed
  hooks/admin/
    useAdminOrders.ts          # React Query hooks for admin order API
    useAdminTickets.ts
    useAdminCustomers.ts
    useAdminSubscriptions.ts
    useAdminPromos.ts
    useAdminProducts.ts
    useAdminDashboard.ts
```

**Route guard:** A `<OperatorRoute>` wrapper component (analogous to `<PrivateRoute>` for customers) reads the current auth token's `role` claim. If `role !== 'operator'`, it redirects to `/login`. Applied to the top-level `AdminLayout` route.

---

### 9.2 API Routes (New Admin Endpoints)

All routes are prefixed `/api/admin/` and require `Authorization: Bearer <operator-token>` with `scope: 'operator'` claim.

```
# Dashboard
GET    /api/admin/dashboard/stats          — KPI aggregates
GET    /api/admin/dashboard/activity       — Recent events feed (limit=20)

# Orders
GET    /api/admin/orders                   — List + filter + paginate
GET    /api/admin/orders/:id               — Order detail
PATCH  /api/admin/orders/:id/status        — Update status
POST   /api/admin/orders/:id/notes         — Add internal note
GET    /api/admin/orders/:id/files/:fileId — Download customer-uploaded file
POST   /api/admin/orders/:id/files         — Upload processed output files
POST   /api/admin/orders/:id/refund        — Issue Stripe refund
POST   /api/admin/orders/:id/send-delivery — Send delivery email via Resend

# Customers
GET    /api/admin/customers                — List + search + paginate
GET    /api/admin/customers/:id            — Customer detail

# Tickets
GET    /api/admin/tickets                  — List + filter + paginate (SLA-sorted)
GET    /api/admin/tickets/:id              — Ticket detail
PATCH  /api/admin/tickets/:id/status       — Update status
POST   /api/admin/tickets/:id/reply        — Send reply + update first_response_at
PATCH  /api/admin/tickets/:id/escalate     — Set escalation flag + reason
POST   /api/admin/tickets/:id/health-check-report — Attach report + mark complete

# Subscriptions
GET    /api/admin/subscriptions            — List + filter by tier/status
GET    /api/admin/subscriptions/:id        — Subscription detail + event history
PATCH  /api/admin/subscriptions/:id/override — Manual tier override
POST   /api/admin/subscriptions/:id/cancel  — Set cancel_at_period_end via Stripe

# Promo Codes
GET    /api/admin/promo-codes              — List + paginate
POST   /api/admin/promo-codes              — Create new code
GET    /api/admin/promo-codes/:id          — Detail + analytics
PATCH  /api/admin/promo-codes/:id          — Update (active toggle, edit fields)

# Products
GET    /api/admin/products                 — List all products
PATCH  /api/admin/products/:id             — Edit product
PATCH  /api/admin/config/launch-promo      — Toggle global launch promo on/off
```

---

### 9.3 Database Schema Additions

```sql
-- Admin audit log (all mutating admin actions)
CREATE TABLE admin_audit_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id     uuid REFERENCES users(id) NOT NULL,
  action_type     text NOT NULL,
  -- e.g. 'order_status_update' | 'refund_issued' | 'ticket_reply_sent' |
  --      'product_price_edit' | 'promo_code_created' | 'subscription_override' | etc.
  entity_type     text NOT NULL,  -- 'order' | 'ticket' | 'product' | 'promo_code' | 'subscription'
  entity_id       uuid NOT NULL,
  previous_value  jsonb,
  new_value       jsonb,
  note            text,           -- operator-entered reason/note where applicable
  created_at      timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX idx_admin_audit_entity ON admin_audit_log (entity_type, entity_id);
CREATE INDEX idx_admin_audit_created ON admin_audit_log (created_at DESC);

-- Order internal notes
CREATE TABLE order_notes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid REFERENCES orders(id) NOT NULL,
  operator_id     uuid REFERENCES users(id) NOT NULL,
  note            text NOT NULL,
  created_at      timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX idx_order_notes_order ON order_notes (order_id);

-- Promo codes
CREATE TABLE promo_codes (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                  text UNIQUE NOT NULL,
  discount_type         text NOT NULL,  -- 'percentage' | 'fixed_amount' | 'free_product' | 'subscription_only'
  discount_value        numeric(10,2),  -- percentage or CAD amount (null for free_product)
  free_product_id       uuid REFERENCES products(id),
  max_redemptions       integer,        -- null = unlimited
  max_per_customer      integer DEFAULT 1,
  current_redemptions   integer DEFAULT 0,
  expires_at            timestamptz,
  product_restrictions  uuid[],         -- null = all products; array of product IDs = restricted
  stackable             boolean DEFAULT false,
  active                boolean DEFAULT true,
  internal_label        text,
  is_referral_code      boolean DEFAULT false,
  referral_subscriber_id uuid REFERENCES subscriptions(id),
  created_by            uuid REFERENCES users(id) NOT NULL,
  created_at            timestamptz DEFAULT now() NOT NULL,
  updated_at            timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX idx_promo_codes_code ON promo_codes (code);
CREATE INDEX idx_promo_codes_active ON promo_codes (active);

-- Config table for global settings (e.g., launch_promo_active)
CREATE TABLE config (
  key       text PRIMARY KEY,
  value     jsonb NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  updated_by uuid REFERENCES users(id)
);
INSERT INTO config (key, value, updated_by) VALUES ('launch_promo_active', 'true', NULL);

-- Additions to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS internal_notes_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS refund_reason text,
  ADD COLUMN IF NOT EXISTS refunded_at timestamptz;

-- Additions to products table (if not present)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS launch_promo_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Additions to support_tickets table (if not present)
ALTER TABLE support_tickets
  ADD COLUMN IF NOT EXISTS first_response_at timestamptz,
  ADD COLUMN IF NOT EXISTS sla_deadline timestamptz,
  ADD COLUMN IF NOT EXISTS sla_breached boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS escalated boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS escalation_reason text;
```

---

### 9.4 SLA Deadline Calculation (Server-Side)

The `sla_deadline` field must be calculated server-side at ticket creation and stored on the record. Client-side timers count down from this pre-calculated value.

```typescript
// lib/utils/slaDeadline.ts
import { isBusinessHours, nextBusinessDayOpen } from './businessHours';

type Tier = 'essentials' | 'professional' | 'premium';
type Severity = 'normal' | 'urgent' | 'critical';

function slaMinutes(tier: Tier, severity: Severity): number {
  if (severity === 'critical') return 60;   // 60 min for all tiers
  if (tier === 'premium') return 30;
  return 60;  // essentials and professional
}

export function calculateSlaDeadline(
  submittedAt: Date,
  tier: Tier,
  severity: Severity
): Date {
  const minutes = slaMinutes(tier, severity);
  const et = toZonedTime(submittedAt, 'America/Toronto');

  if (!isBusinessHoursAt(et)) {
    // SLA clock starts at 9am ET next business day
    const clockStart = nextBusinessDayOpen(et);
    return addMinutes(clockStart, minutes);
  }

  const deadline = addMinutes(submittedAt, minutes);

  // If deadline crosses end of business (5pm ET), carry remainder to next day
  const etDeadline = toZonedTime(deadline, 'America/Toronto');
  if (etDeadline.getHours() >= 17) {
    const minutesPastClose = (etDeadline.getHours() - 17) * 60 + etDeadline.getMinutes();
    const nextOpen = nextBusinessDayOpen(etDeadline);
    return addMinutes(nextOpen, minutesPastClose);
  }

  return deadline;
}
```

---

### 9.5 Email Templates Required for Admin Actions (Resend)

The following templates are triggered by operator actions in the admin panel (in addition to templates already defined in the Support Subscription PRD):

| Template ID | Trigger | Recipient |
|-------------|---------|-----------|
| `order-delivery-conversion` | Operator sends delivery email for conversion orders | Customer |
| `order-delivery-data-service` | Operator sends delivery email for data service orders | Customer |
| `order-refund-issued` | Operator issues refund | Customer |
| `order-reupload-request` | Operator requests corrected file (wrong file type) | Customer |

All outbound emails must use `support@nexfortis.com` as the From address (not `hassansadiq73@gmail.com`).

---

### 9.6 Security Considerations

1. **Token scope enforcement:** The HMAC token generation function must accept a `scope` parameter. Operator tokens are issued only on successful login of a `role = 'operator'` user. The verification middleware must check both signature validity and `scope === 'operator'`.
2. **File download authorization:** The admin file download endpoint must look up the file record by ID, verify it belongs to an order or health check in the database, and serve the file from server-side storage. Never construct a file path from user-supplied input.
3. **Stripe refund idempotency:** Use `idempotency_key: \`admin-refund-${orderId}\`` on all `stripe.refunds.create` calls.
4. **Input sanitization:** All operator-submitted free-text fields (notes, reply bodies, promo code labels) must be sanitized server-side to prevent XSS if content is ever rendered in a customer-facing context.
5. **Admin audit log integrity:** The `admin_audit_log` table must have no `UPDATE` or `DELETE` permissions for the application database user. Log records are append-only.

---

## 10. Phased Rollout

### Phase 1 — MVP (Launch Blocker)

Required before any public orders are accepted:

- [ ] Operator authentication (role guard, token scope)
- [ ] Dashboard: KPI cards + activity feed
- [ ] Order list + filter + detail view
- [ ] Customer file download (authenticated)
- [ ] Order status update + internal notes
- [ ] Processed file upload to order record
- [ ] Manual order status transitions (pending → processing → completed/failed)
- [ ] Ticket list with SLA timers + priority sort
- [ ] Ticket detail + reply compose + Resend dispatch
- [ ] Ticket status update
- [ ] Health check report attach + complete action
- [ ] Basic subscription list (read-only)
- [ ] `admin_audit_log` recording for all mutations
- [ ] Mobile-responsive layout (375px+)

### Phase 1.1 — Post-Launch Week 1

- [ ] Refund issuance (Stripe + status update + email)
- [ ] Delivery email send from order detail
- [ ] Promo code create/deactivate/list
- [ ] Global launch promo toggle
- [ ] Customer list + search + detail

### Phase 1.2 — Post-Launch Month 1

- [ ] Product price edit form
- [ ] Product active/inactive toggle
- [ ] Product image URL update
- [ ] Subscription manual tier override
- [ ] Subscription cancel-at-period-end trigger
- [ ] Promo code analytics (redemption count, revenue impact)

### Phase 2 — Future

- [ ] Role-based permissions (read-only operator, ticket-only operator)
- [ ] Inbound email ingestion into ticket thread
- [ ] CSV data export
- [ ] Revenue analytics dashboard (charts, cohort, churn)
- [ ] Automated 7-day file deletion job surface in admin
- [ ] Two-factor authentication for operator account

---

*Document version: 1.0 — QB Portal Production Launch Epic*
*Author: NexFortis Product (Hassan Sadiq)*
*Last updated: June 2025*
