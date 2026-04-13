# Feature PRD: QB Expert Support Subscription

**Version:** 1.0  
**Date:** 2025  
**Author:** Hassan Sadiq / NexFortis  
**Status:** Draft

---

## 1. Feature Name

**QB Expert Support Subscription** — A tiered, standalone monthly subscription that provides QuickBooks Desktop users direct access to expert human support via a portal-based ticket system, with guaranteed response times, proactive file health monitoring, and tier-specific escalation paths.

---

## 2. Epic

- **Parent Epic:** QB Portal — Full Product Catalog & Subscription Services  
- **Portal Location:** `qb.nexfortis.com`  
- **Related Docs:**  
  - `docs/operator_runbook.md` — operator workflow for responding to tickets  
  - `docs/email_templates.md` — customer-facing transactional emails  
  - `docs/prd/qb-portal/` — sibling feature PRDs

---

## 3. Goal

### Problem

QuickBooks Desktop users — from solo small business owners to accountants managing dozens of client files — have no reliable, affordable, human-backed support option. Intuit's own support costs $29.95/month for basic access or $74.99 per incident, offers no guaranteed response times, and frequently routes users through scripted tier-1 agents unfamiliar with QB Desktop internals. ProAdvisors charge $50–$150/hour with no guaranteed availability. The result: users are left debugging error codes alone, losing productivity to corrupted files, and delaying critical financial workflows.

### Solution

NexFortis QB Expert Support Subscription provides direct access to a QuickBooks Desktop expert — a human who responds within 1 hour (or 30 minutes for Premium) during business hours, via a structured portal ticket system. Three tiers are priced to match distinct user needs: Essentials for occasional help, Professional for power users and bookkeepers, and Premium for accountants managing multiple client files. The subscription is **standalone** — any QB Desktop user can subscribe, regardless of whether they've purchased a conversion or data service.

### Impact

- **Primary:** Establish a predictable monthly recurring revenue (MRR) stream, decoupled from one-time transaction volume.
- **Secondary:** Deepen customer relationships and increase LTV — support subscribers are more likely to purchase conversion and data services (and receive discounts to do so).
- **Tertiary:** Differentiate NexFortis against Intuit support (faster, human, QB Desktop-specific) and ProAdvisors (predictable pricing, no hourly billing anxiety).
- **Target KPIs:**
  - First-response SLA compliance rate: ≥ 98% of tickets during business hours
  - Subscriber churn rate: < 5% monthly
  - Ticket-to-upsell conversion rate: ≥ 10% of Professional subscribers upgrade to Premium within 90 days
  - Monthly Automated File Health Check delivery rate: 100% of active subscribers

---

## 4. User Personas

### Persona A — The Solo Small Business Owner ("Sam")
- **Profile:** Runs a small business (retail, trades, services) in Canada. Uses QuickBooks Desktop Pro or Premier. Processes payroll and invoices personally.
- **Pain Points:** Occasional error codes, slow file performance, confusion about setup. Can't afford hours of downtime. Has no in-house bookkeeper.
- **Goal:** Get fast, plain-language answers when QB breaks or confuses them.
- **Tier Fit:** **Essentials** ($49/mo, 3 tickets/month, 1hr response)

### Persona B — The Bookkeeper / Power User ("Blake")
- **Profile:** Independent bookkeeper or internal accountant managing 1–5 QB Desktop company files. Encounters complex issues: file corruption, list bloat, multi-user network conflicts.
- **Pain Points:** Complex issues require expert diagnosis, not scripted support. Time lost = billable hours lost. Needs to validate data integrity before month-end close.
- **Goal:** Expert-level diagnosis and fixes. A discount on NexFortis data services (Condense, List Reduction, CRA Period Copy) is a bonus.
- **Tier Fit:** **Professional** ($99/mo, 8 tickets/month, 1hr response, 10% service discount)

### Persona C — The Multi-Client Accountant ("Alex")
- **Profile:** CPA or accounting firm principal managing 10–50 QB Desktop client files. Needs proactive monitoring and a direct line to expertise. May be evaluating migration paths for clients.
- **Pain Points:** Can't afford reactive-only support across a large client portfolio. Needs priority handling, migration planning guidance, and a mechanism to refer clients to NexFortis services.
- **Goal:** Proactive file health, migration planning, a monthly strategic call, and economics that reward referrals.
- **Tier Fit:** **Premium** ($149/mo, unlimited tickets, 30min response, 20% discount, monthly video call, referral code)

---

## 5. User Stories

### 5.1 Subscription Purchase

**US-01 — Discover and Compare Tiers**  
As any QB Desktop user, I want to view a clear comparison of support subscription tiers — including price, ticket limits, response times, and included features — so that I can choose the right plan for my needs without calling or emailing NexFortis first.

**US-02 — Subscribe (Logged-In User)**  
As a registered portal user, I want to subscribe to a support tier with a single checkout flow (Stripe payment), with the launch promotional price automatically applied, so that I can begin submitting tickets immediately after payment confirmation.

**US-03 — Subscribe (Guest / New User)**  
As a QB Desktop user who does not yet have a portal account, I want to subscribe to a support plan during checkout and have a portal account automatically created for me, so that I can manage my subscription and submit tickets without a separate registration step.

**US-04 — View Launch Promotional Pricing**  
As a prospective subscriber, I want to see the launch promotional price (strikethrough original price + highlighted discounted price) with a clear disclosure of the promotion end date or condition, so that I understand when the standard price applies.

**US-05 — Apply GST/HST at Checkout**  
As a Canadian customer, I want GST/HST calculated and displayed at checkout before I confirm payment, so that I am not surprised by tax charges.

---

### 5.2 Ticket Submission

**US-06 — Submit a Support Ticket**  
As an active subscriber, I want to submit a support ticket from the customer portal with a subject, description, and optional file attachment (.qbm or screenshots), so that I can communicate my QB Desktop issue clearly to the expert.

**US-07 — Ticket Limit Enforcement (Essentials and Professional)**  
As an Essentials or Professional subscriber, I want the portal to show me how many tickets I have remaining in my current billing cycle, and prevent me from submitting additional tickets when my limit is reached, so that I understand my usage and know when to consider upgrading.

**US-08 — Ticket Limit Warning**  
As an Essentials subscriber with 1 ticket remaining, I want to see a contextual warning when I open the ticket submission form, so that I can decide whether to use my last ticket or upgrade my plan first.

**US-09 — Critical Error Triage (Any Tier)**  
As any subscriber, I want critical errors (tagged as urgent) to trigger an immediate automated acknowledgment and a guaranteed human response within 1 hour regardless of my tier or time of submission, so that production-stopping issues are never ignored.

**US-10 — After-Hours Ticket Acknowledgment**  
As a subscriber who submits a ticket outside business hours (Mon–Fri 9am–5pm ET), I want to receive an automated acknowledgment immediately upon submission, clearly stating that the first human response will arrive by 9am ET the next business day, so that I know my ticket was received and when to expect a reply.

**US-11 — Receive Expert Response by Email**  
As a subscriber, I want to receive email notification (at my registered address) when the operator responds to my ticket, so that I don't need to keep checking the portal manually.

---

### 5.3 Tier-Based Scope Enforcement

**US-12 — Scope Mismatch Notification**  
As an Essentials subscriber who submits a ticket requesting a service outside my tier's scope (e.g., file corruption diagnosis), I want the system to flag the request and explain that it falls under a higher tier, with a one-click option to upgrade, so that I am not left waiting for a response that will never come.

**US-13 — Pro/Premium Service Discount at Checkout**  
As an active Professional (10% off) or Premium (20% off) subscriber, I want my service discount automatically applied when I place an order for any NexFortis service, so that I do not need to manually enter a coupon code each time.

---

### 5.4 Automated File Health Check

**US-14 — Monthly File Health Check Delivery**  
As any active subscriber, I want to receive one automated QB Desktop file health check report per billing cycle, delivered via the portal and by email, so that I can proactively identify file issues before they become emergencies.

**US-15 — Health Check Report Contents**  
As a subscriber receiving my monthly file health check, I want the report to include a list of identified issues (if any), severity ratings, and recommended next steps (which may include NexFortis data services), so that the report is actionable, not just informational.

---

### 5.5 Premium-Exclusive: Video Call Booking

**US-16 — Schedule Monthly Video Call (Premium)**  
As a Premium subscriber, I want to access a scheduling link (Microsoft Bookings) directly from my portal dashboard to book my included 30-minute video call, so that I can consult directly with the QB expert on complex client file issues or migration planning.

**US-17 — Video Call Booking Reset Per Cycle**  
As a Premium subscriber, I want my included monthly video call entitlement to reset at the start of each new billing cycle, so that unused calls do not accumulate and I always have access to at least one call per month.

**US-18 — Video Call Confirmation Email**  
As a Premium subscriber who books a video call, I want to receive a calendar invite and confirmation email with the meeting link, so that I can add it to my calendar without extra steps.

---

### 5.6 Premium-Exclusive: Referral Program

**US-19 — Access Referral Code (Premium)**  
As a Premium subscriber, I want to view my dedicated referral code from the portal dashboard, with a one-click copy function and a link I can share directly, so that I can easily refer new customers to NexFortis.

**US-20 — Track Referral Earnings**  
As a Premium subscriber, I want to see a running total of my referral earnings ($25 per referred customer who completes a purchase) in my portal, so that I can track the value I am generating through referrals.

---

### 5.7 Subscription Management

**US-21 — Upgrade Subscription**  
As a current Essentials or Professional subscriber, I want to upgrade to a higher tier from the portal settings at any time, with the price difference prorated for the current billing cycle, so that I can access expanded features immediately without waiting for my next renewal.

**US-22 — Downgrade Subscription**  
As a current Professional or Premium subscriber, I want to request a downgrade to a lower tier, effective at the next billing cycle renewal, so that my current tier benefits remain active for the remainder of the paid period.

**US-23 — Cancel Subscription**  
As a subscriber, I want to cancel my subscription from the portal settings, with my subscription remaining active until the end of the current paid billing period, so that I am not charged further and I retain access for the time I have paid for.

**US-24 — View Billing History**  
As a subscriber, I want to view a list of past subscription invoices (date, amount, tier, promotional discount applied) from the portal, and download each as a PDF, so that I can maintain accurate financial records.

**US-25 — Payment Method Update**  
As a subscriber, I want to update my saved payment method from the portal without canceling and restarting my subscription, so that my service is not interrupted due to an expired card.

---

### 5.8 Operator / Admin

**US-26 — Operator Ticket Dashboard**  
As the NexFortis operator (Hassan), I want a unified view of all open support tickets sorted by tier priority (Premium first, then Professional, then Essentials) and submission time, so that I can respond within the guaranteed SLA windows.

**US-27 — SLA Timer Visibility**  
As the operator, I want each ticket to display a countdown timer showing time remaining until the SLA deadline, with color-coded urgency (green > 30 min, yellow 10–30 min, red < 10 min), so that I can triage my queue at a glance.

**US-28 — Ticket Routing by Tier**  
As the operator, I want the system to automatically tag and sort incoming tickets by subscriber tier and response-time SLA, so that I do not need to manually prioritize the queue.

---

## 6. Requirements

### 6.1 Functional Requirements

#### Subscription & Billing
- **FR-01:** The system must offer three subscription products in Stripe: Essentials ($49/mo), Professional ($99/mo), and Premium ($149/mo), each with a corresponding promotional price ($25, $50, $75) applied automatically during the launch period.
- **FR-02:** Each Stripe subscription must be linked to a portal user account upon creation.
- **FR-03:** If a subscribing user does not have a portal account, one must be created automatically using the email address provided at Stripe checkout, with a password-setup email sent immediately.
- **FR-04:** All prices must be in CAD. GST/HST must be calculated based on the customer's province and displayed at checkout before payment confirmation.
- **FR-05:** Promotional pricing must display the standard price with strikethrough styling alongside the promotional price, with a label indicating the promotion duration (e.g., "First 3 months").
- **FR-06:** Subscription upgrades must take effect immediately, with the price difference prorated to the current billing cycle via Stripe's proration feature.
- **FR-07:** Subscription downgrades must be scheduled to take effect at the next renewal date, not immediately.
- **FR-08:** Subscription cancellations must set the Stripe subscription to cancel-at-period-end, leaving the customer with access until their paid period expires.
- **FR-09:** Stripe webhook events (`invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`) must update the portal database in real time.
- **FR-10:** Billing invoices must be downloadable as PDF from the customer portal.

#### Ticket System
- **FR-11:** The portal must display each subscriber's remaining ticket count for the current billing cycle (Essentials: 3, Professional: 8, Premium: ∞).
- **FR-12:** Ticket count must reset to the tier limit at the start of each new billing cycle.
- **FR-13:** The system must block ticket submission when a subscriber has reached their monthly limit, displaying a message with an upgrade prompt.
- **FR-14:** Subscribers with exactly 1 ticket remaining must see a warning banner on the ticket submission form before they submit.
- **FR-15:** Every submitted ticket must trigger an immediate automated acknowledgment email to the subscriber containing: ticket ID, submission timestamp, tier, SLA commitment, and after-hours notice (if applicable).
- **FR-16:** Tickets submitted outside Mon–Fri 9am–5pm ET must be tagged as "after-hours" and the acknowledgment email must state that the first human response will arrive by 9am ET the next business day.
- **FR-17:** Tickets marked as "critical" (either by the subscriber via a checkbox or detected by keyword matching — e.g., "error -6000", "company file won't open") must bypass tier priority ordering and trigger an immediate acknowledgment with a 1-hour SLA regardless of tier.
- **FR-18:** The ticket detail view must update in real time (or on page refresh) when the operator posts a response.
- **FR-19:** Subscribers must receive an email notification when the operator responds to any of their tickets.
- **FR-20:** Ticket attachments must support .qbm, .png, .jpg, and .pdf files up to 25MB per attachment.

#### Tier-Based Access & Scope
- **FR-21:** The ticket submission form must display the subscriber's current tier and the scope of support included, so the subscriber can self-assess whether their issue is in scope.
- **FR-22:** Out-of-scope ticket submissions (based on operator review) must trigger a portal notification and email explaining the scope limitation and offering a tier upgrade link.
- **FR-23:** Professional and Premium subscribers must have their tier discount (10% and 20%, respectively) automatically applied as a Stripe coupon or customer-level discount on all NexFortis service orders placed while the subscription is active.
- **FR-24:** Discount must be revoked at next service checkout if the subscriber has canceled or downgraded below the qualifying tier.

#### Automated File Health Check
- **FR-25:** One automated file health check entitlement must be credited to each subscriber at the start of each billing cycle.
- **FR-26:** The portal must display the subscriber's current health check status: "Available," "Submitted," or "Completed — view report."
- **FR-27:** The subscriber must be able to initiate the health check from the portal by uploading their .qbm file; this submission creates a standard support ticket tagged as "health-check."
- **FR-28:** The operator must fulfill the health check and post a structured report to the ticket. The portal must display the report in a readable format and email it to the subscriber.

#### Premium Video Call Booking
- **FR-29:** Premium subscribers must see a "Book Your Monthly Call" button on their portal dashboard, linking to the Microsoft Bookings scheduling page for NexFortis QB Expert calls.
- **FR-30:** One booking entitlement must be tracked per billing cycle; the portal must indicate whether the entitlement has been used ("Book Now" vs. "Call booked for [date]").
- **FR-31:** The system must reset the video call entitlement at the start of each billing cycle, regardless of whether the previous month's call was used.
- **FR-32:** Microsoft Bookings confirmation emails (calendar invite + meeting link) must be sent automatically by the Bookings integration; no additional portal-side email is required if Bookings handles this natively.

#### Premium Referral Program
- **FR-33:** Each Premium subscriber must be assigned a unique, persistent referral code at the time their Premium subscription activates.
- **FR-34:** The portal must display the referral code with a one-click copy button and a pre-formatted sharing link (`qb.nexfortis.com/?ref=CODE`).
- **FR-35:** When a new customer completes a purchase using a referral code, a $25 referral credit must be recorded against the referring Premium subscriber's account.
- **FR-36:** The portal must display the subscriber's total referral earnings and a list of referral events (date, $25 earned) without exposing the referred customer's identity.
- **FR-37:** Referral credits must be applied as a discount against the subscriber's next monthly billing charge via Stripe customer balance or coupon. If the credit exceeds the monthly charge, the remainder must carry forward.

#### Operator Admin
- **FR-38:** The operator dashboard must display all open tickets sorted by: (1) Critical flag, (2) Tier (Premium → Professional → Essentials), (3) Submission timestamp ascending.
- **FR-39:** Each ticket in the operator dashboard must display a live SLA countdown timer based on the tier's response-time commitment and submission time (adjusted for business hours only).
- **FR-40:** The operator must be able to post a response to any ticket from the dashboard, triggering the subscriber's email notification.
- **FR-41:** The operator must be able to mark a ticket as "Resolved" or "Closed," with the status visible to the subscriber in the portal.

---

### 6.2 Non-Functional Requirements

#### Performance
- **NFR-01:** Ticket submission must complete and display confirmation within 2 seconds under normal load.
- **NFR-02:** Stripe webhook processing must complete within 5 seconds of receipt to ensure subscription state is never stale at checkout or ticket submission.
- **NFR-03:** The portal dashboard (subscription status, ticket list, remaining counts) must load within 1.5 seconds on a standard broadband connection.

#### Reliability & SLA Integrity
- **NFR-04:** SLA countdown timers must account for business hours only (Mon–Fri 9am–5pm ET); time outside these hours must not count against the response window.
- **NFR-05:** After-hours ticket submissions must be stored durably; no ticket may be lost due to off-hours server state. Standard PostgreSQL durability guarantees apply.
- **NFR-06:** Stripe webhook endpoints must implement idempotency checks to prevent duplicate subscription updates from replayed events.

#### Security
- **NFR-07:** All Stripe webhook events must be verified using the Stripe webhook signing secret before processing.
- **NFR-08:** Ticket attachments must be scanned for MIME type validation server-side; the allowed types (.qbm, .png, .jpg, .pdf) must be enforced at the API layer, not just the UI.
- **NFR-09:** Subscribers must only be able to view and interact with their own tickets; cross-tenant ticket access must be prevented at the API query layer.
- **NFR-10:** Referral code generation must use a cryptographically random token (minimum 8 characters, alphanumeric) to prevent enumeration.
- **NFR-11:** The operator dashboard must be accessible only to authenticated operator accounts; no public or subscriber-level access.

#### Accessibility
- **NFR-12:** All subscription-facing portal pages (tier comparison, checkout, ticket submission, dashboard) must meet WCAG 2.1 AA standards.
- **NFR-13:** The tier comparison table must be navigable by keyboard and screen reader.

#### Privacy & Compliance
- **NFR-14:** Customer payment data must never be stored on NexFortis servers; all card handling must be delegated entirely to Stripe.
- **NFR-15:** Ticket content (including attached files) must be retained for a minimum of 12 months after ticket closure to support dispute resolution.
- **NFR-16:** PIPEDA compliance applies: subscriber data must not be shared with third parties beyond Stripe (billing) and Resend (transactional email). Microsoft Bookings data sharing is limited to name and email for scheduling purposes.

#### Operational
- **NFR-17:** All subscriber-facing transactional emails must be sent via the Resend API from `support@nexfortis.com`.
- **NFR-18:** All prices must be rendered in CAD with explicit "CAD" labeling to avoid ambiguity for cross-border visitors.

---

## 7. Acceptance Criteria

### AC-01: Tier Comparison Page

- **Given** a visitor arrives at the support subscription landing page,  
  **When** the page loads,  
  **Then** all three tiers are displayed side by side with: price (promotional + standard strikethrough), ticket limit, response time, scope summary, and a CTA button.

- **Given** the visitor clicks the CTA for any tier,  
  **When** they are not logged in,  
  **Then** they are directed to the registration/login page with the selected tier preserved in session, so the checkout flow resumes after auth.

---

### AC-02: Subscription Checkout

- **Given** a logged-in user selects a tier and clicks "Subscribe,"  
  **When** they complete the Stripe checkout,  
  **Then:**
  - A Stripe subscription is created with the correct price ID (promotional or standard based on launch period)
  - The portal database subscription record is updated within 5 seconds via webhook
  - The user's portal dashboard reflects the new tier immediately on next page load
  - A confirmation email is sent from `support@nexfortis.com` within 60 seconds

- **Given** a new user completes Stripe checkout without a prior portal account,  
  **When** the Stripe `checkout.session.completed` event is received,  
  **Then:**
  - A portal account is created linked to the Stripe customer ID
  - A password-setup email is sent to the address used at checkout

---

### AC-03: Ticket Submission

- **Given** an Essentials subscriber has 2 tickets remaining,  
  **When** they open the ticket submission form,  
  **Then** the form shows "2 tickets remaining this month" without any warning.

- **Given** an Essentials subscriber has 1 ticket remaining,  
  **When** they open the ticket submission form,  
  **Then** a yellow warning banner reads: "This is your last ticket this month. Need more? [Upgrade your plan]."

- **Given** an Essentials subscriber has 0 tickets remaining,  
  **When** they attempt to access the ticket submission form,  
  **Then** the form is replaced by a message: "You've used all 3 tickets for this billing cycle. Your next tickets reset on [reset date]. [Upgrade to Professional] for 8 tickets/month."

- **Given** any subscriber submits a ticket at any time,  
  **When** the submission is confirmed,  
  **Then** an automated acknowledgment email is sent within 60 seconds containing: ticket ID, tier, SLA commitment, and business hours notice.

- **Given** a ticket is submitted outside Mon–Fri 9am–5pm ET,  
  **When** the acknowledgment email is sent,  
  **Then** the email explicitly states: "Our team will respond by 9am ET on [next business day date]."

---

### AC-04: Critical Error Triage

- **Given** a subscriber submits a ticket with "critical" selected, OR the ticket body contains keywords matching the critical pattern list (e.g., "error -6000," "won't open," "data loss"),  
  **When** the ticket is received,  
  **Then:**
  - The ticket is tagged "critical" and sorted to the top of the operator queue regardless of tier
  - The acknowledgment email includes: "Your issue has been flagged as critical. A QB expert will respond within 1 hour."
  - The SLA timer is set to 1 hour from submission regardless of tier

---

### AC-05: Operator Queue & SLA Timer

- **Given** the operator opens the ticket dashboard,  
  **When** tickets are present,  
  **Then:**
  - Tickets are sorted: Critical (all tiers) → Premium → Professional → Essentials → by timestamp
  - Each ticket displays a live countdown timer to SLA deadline, color-coded: green (> 30 min), yellow (10–30 min), red (< 10 min)
  - The timer only counts down during Mon–Fri 9am–5pm ET business hours

---

### AC-06: Service Discount Application

- **Given** a Professional or Premium subscriber navigates to any NexFortis service checkout,  
  **When** the order summary is displayed,  
  **Then** a line item shows: "Professional Subscriber Discount: -10%" (or -20% for Premium) with the discounted total prominently displayed.

- **Given** a subscriber cancels their Professional or Premium plan,  
  **When** their subscription expires at period end,  
  **Then** their next service checkout does not apply the discount.

---

### AC-07: Monthly File Health Check

- **Given** a new billing cycle begins for any active subscriber,  
  **When** the renewal invoice is paid,  
  **Then** the health check entitlement resets to "Available" in the portal.

- **Given** a subscriber clicks "Start Health Check" and uploads a .qbm file,  
  **When** the upload completes,  
  **Then** a ticket tagged "health-check" is created automatically, the portal shows status "Submitted," and the operator receives the ticket in their queue.

- **Given** the operator completes and posts the health check report,  
  **When** the ticket is marked resolved,  
  **Then** the portal displays the report under the subscriber's health check section and an email with the report is sent to the subscriber.

---

### AC-08: Premium Video Call Booking

- **Given** a Premium subscriber views their dashboard,  
  **When** their video call entitlement has not been used for the current cycle,  
  **Then** a "Book Your Monthly Call" button is visible, linking to the Microsoft Bookings page.

- **Given** a Premium subscriber has already booked a call for the current cycle,  
  **When** they view their dashboard,  
  **Then** the button is replaced with "Call booked: [date/time]" and no additional booking link is shown.

- **Given** a new billing cycle begins,  
  **When** the renewal invoice is paid,  
  **Then** the video call entitlement resets to "Available" regardless of whether the previous month's call was used.

---

### AC-09: Referral Program (Premium)

- **Given** a user's Premium subscription activates for the first time,  
  **When** the `customer.subscription.created` webhook is processed with a Premium price ID,  
  **Then** a unique referral code is generated and stored in the portal, visible on the subscriber's dashboard.

- **Given** a new customer completes a purchase using a referral code,  
  **When** the order is confirmed,  
  **Then** a $25 referral credit is recorded for the referring subscriber, visible in their portal, and applied to their next billing charge.

---

### AC-10: Subscription Management

- **Given** a subscriber initiates an upgrade from Essentials to Professional or Premium,  
  **When** the upgrade is confirmed,  
  **Then:**
  - Stripe processes the prorated charge immediately
  - The portal reflects the new tier within 5 seconds of webhook receipt
  - A confirmation email is sent

- **Given** a subscriber initiates a downgrade,  
  **When** the downgrade is confirmed,  
  **Then:**
  - The current tier remains active for the remainder of the billing period
  - A confirmation email states the date the lower tier takes effect
  - Stripe schedules the subscription change at period end

- **Given** a subscriber cancels their subscription,  
  **When** cancellation is confirmed,  
  **Then:**
  - Stripe sets the subscription to cancel-at-period-end
  - The portal displays: "Your subscription is active until [end date]. No further charges will be made."
  - The subscriber retains full tier access until the period end date

---

## 8. Out of Scope

The following are explicitly **not** included in this feature:

1. **Phone support** — All support is email-based via the portal ticket system. No phone number, live chat, or real-time messaging channel.
2. **24/7 support** — Business hours are Mon–Fri 9am–5pm ET only. After-hours tickets receive a first response the next business day. SLA timers do not run outside business hours.
3. **QuickBooks Online (QBO) support** — This subscription covers QuickBooks Desktop products only (Pro, Premier, Enterprise). QBO issues are out of scope for operator response.
4. **Accounting advice** — The subscription covers QB Desktop software support, not accounting, tax, or financial advice. Operator responses must not constitute professional accounting or legal advice.
5. **Automated AI/chatbot responses** — All ticket responses are human (operator). No AI-generated responses to subscribers are in scope for v1.
6. **Multi-seat / team subscriptions** — One subscription per portal user account. No sub-user seat management in v1.
7. **Annual billing option** — Monthly billing only at launch. Annual pricing may be introduced in v2.
8. **Free trial** — No free trial tier. The launch promotional pricing (3 months at 50% off) serves as the acquisition incentive.
9. **Ticket escalation to third parties** — NexFortis does not escalate tickets to Intuit or external partners on the subscriber's behalf.
10. **Rollover tickets** — Unused tickets in a billing cycle do not roll over to the next cycle for Essentials or Professional tiers.
11. **Referral program for non-Premium subscribers** — Referral codes and earnings are exclusively a Premium tier benefit.
12. **Video calls for Essentials or Professional subscribers** — Microsoft Bookings integration is Premium-only.
13. **Dedicated account manager or named support contact** — The operator (Hassan Sadiq) fulfills all ticket responses; there is no named account manager assignment in v1.
14. **Mobile app** — Subscription management and ticket submission are portal-web only.

---

## 9. Technical Specifications

### 9.1 Data Model (Drizzle ORM / PostgreSQL)

```typescript
// subscriptions table
{
  id: uuid (PK),
  userId: uuid (FK → users.id),
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  stripePriceId: string,
  tier: enum('essentials' | 'professional' | 'premium'),
  status: enum('active' | 'past_due' | 'canceled' | 'cancel_at_period_end'),
  currentPeriodStart: timestamp,
  currentPeriodEnd: timestamp,
  cancelAtPeriodEnd: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}

// ticket_usage table (per billing cycle)
{
  id: uuid (PK),
  subscriptionId: uuid (FK → subscriptions.id),
  userId: uuid (FK → users.id),
  cycleStart: date,
  cycleEnd: date,
  ticketsUsed: integer (default 0),
  healthCheckUsed: boolean (default false),
  videoCallUsed: boolean (default false)
}

// referrals table (Premium only)
{
  id: uuid (PK),
  referrerId: uuid (FK → users.id),
  referralCode: string (unique),
  totalEarnings: integer (cents, default 0),
  createdAt: timestamp
}

// referral_events table
{
  id: uuid (PK),
  referralId: uuid (FK → referrals.id),
  referredOrderId: uuid (FK → orders.id),
  creditAmount: integer (cents, default 2500),
  appliedToBillingCycle: date,
  createdAt: timestamp
}
```

### 9.2 Stripe Integration

| Event | Action |
|---|---|
| `checkout.session.completed` | Create/link subscription record; provision portal account if new user |
| `invoice.paid` | Update `currentPeriodStart/End`; reset `ticket_usage` cycle record |
| `invoice.payment_failed` | Set subscription status to `past_due`; send payment failure email |
| `customer.subscription.updated` | Sync tier, status, `cancelAtPeriodEnd`, period dates |
| `customer.subscription.deleted` | Set status to `canceled`; revoke tier access at period end |

- Stripe Products and Prices must be created with `currency: 'cad'`.
- Stripe Tax must be enabled with automatic tax calculation, or HST/GST applied via Stripe Tax rates keyed to Canadian provinces.
- Proration behavior: `proration_behavior: 'create_prorations'` for upgrades.
- Downgrade scheduling: `proration_behavior: 'none'`, `billing_cycle_anchor: 'unchanged'`.

### 9.3 SLA Timer Logic (Business Hours)

```
SLA deadline = submission_time + SLA_window (business hours only)
Business hours = Mon–Fri 09:00–17:00 ET (America/Toronto)

Tier SLA windows:
  - Essentials: 60 business-hours minutes
  - Professional: 60 business-hours minutes
  - Premium: 30 business-hours minutes
  - Critical (any tier): 60 calendar minutes (not business-hours-adjusted)

Time remaining = deadline - now (counting only business hour minutes)
Color: green if > 30 min, yellow if 10–30 min, red if < 10 min
```

### 9.4 Email Triggers (Resend API, from `support@nexfortis.com`)

| Trigger | Template |
|---|---|
| Subscription created | Welcome + tier summary + portal link |
| Ticket submitted | Acknowledgment + ticket ID + SLA + hours notice |
| Operator responds to ticket | "You have a new response" + ticket link |
| Critical ticket received | Critical acknowledgment + 1hr SLA statement |
| Invoice paid | Receipt + billing period |
| Invoice payment failed | Payment failure + update card link |
| Subscription upgrade | Upgrade confirmation + new tier summary |
| Subscription downgrade scheduled | Downgrade confirmation + effective date |
| Subscription canceled | Cancellation confirmation + access-until date |
| New portal account (from checkout) | "Set your password" link |
| File health check report ready | Report summary + portal link |
| Referral credit earned | "$25 credited to your account" + running total |

### 9.5 Microsoft Bookings Integration (Premium)

- A single "QB Expert 30-Min Call" service is configured in Microsoft Bookings under the NexFortis account.
- The Bookings public page URL is stored as an environment variable (`BOOKINGS_URL`) and rendered as a direct link in the Premium subscriber dashboard.
- No API integration is required in v1; Bookings sends its own confirmation and calendar invites natively.
- Portal tracks whether a call has been booked in the current cycle by reading the `videoCallUsed` field in `ticket_usage`, updated manually by the operator after the call is confirmed.
- v2 may integrate the Bookings API to auto-update `videoCallUsed` on booking confirmation.

### 9.6 Service Discount Mechanism

- Professional and Premium subscribers are assigned a Stripe coupon at subscription creation: `NEXFORTIS_PRO_10` (10%) or `NEXFORTIS_PREMIUM_20` (20%).
- At service checkout, the API checks the user's active subscription tier and applies the coupon to the Stripe Checkout Session before redirect.
- If the subscription is `canceled` or `cancel_at_period_end` and past the period end date, no coupon is applied.
- Discounts do not stack with other promotional codes.

---

## 10. Risks & Phased Rollout

### 10.1 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Operator SLA breach during high ticket volume | Medium | High (customer trust) | Set realistic launch-period ticket limits; throttle subscriber count at launch if needed |
| Stripe webhook delivery failure | Low | High (subscription state mismatch) | Implement idempotent webhook handler with retry logging; add a manual "sync subscription" operator tool |
| After-hours ticket accumulation (Monday morning surge) | Medium | Medium | Operator triage protocol documented in `operator_runbook.md`; prioritize Premium queue first |
| Microsoft Bookings availability / scheduling conflicts | Low | Low (Premium only) | Operator controls Bookings calendar; buffer times built in |
| Referral credit abuse (self-referral) | Low | Low | Block referral code use if the referring user's email matches the purchasing user's email |
| Promotional pricing end date confusion | Medium | Medium | Clear disclosure on all pricing surfaces: "Promotional pricing for first 3 months. Standard pricing applies from month 4." |

### 10.2 Phased Rollout

#### Phase 1 — MVP (Launch)
- All three tiers live in Stripe and purchasable from the portal
- Ticket submission, limit tracking, and acknowledgment emails
- SLA timer in operator dashboard (manual tracking acceptable if not yet automated)
- After-hours and critical error handling
- Automated file health check (manual operator fulfillment)
- Service discounts at checkout (Pro + Premium)
- Microsoft Bookings link in Premium dashboard (manual `videoCallUsed` tracking)
- Referral code display (credit tracking manual or semi-manual via Stripe)
- Subscription upgrade/downgrade/cancel from portal settings
- Billing history and invoice download

#### Phase 2 — Automation & Scale
- SLA countdown timers fully automated in operator dashboard
- Microsoft Bookings API integration to auto-update `videoCallUsed`
- Referral credit auto-application via Stripe customer balance
- Keyword-based critical error auto-detection (pattern matching on ticket body)
- Scope mismatch auto-detection with upgrade prompt
- Automated health check report template (reduce operator fulfillment time)

#### Phase 3 — Growth Features
- Annual billing option (2 months free equivalent)
- Multi-seat subscriptions for accounting firms
- AI-assisted ticket triage (operator-facing suggestion, not subscriber-facing response)
- Subscription analytics dashboard (MRR, churn, ticket volume, SLA compliance rate)

---

*This document is the single source of truth for the QB Expert Support Subscription feature. Engineering implementation should not begin without sign-off on Section 6 (Requirements) and Section 7 (Acceptance Criteria).*
