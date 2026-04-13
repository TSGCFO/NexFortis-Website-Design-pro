# Feature PRD: Promo Code System

**QB Portal — qb.nexfortis.com**

---

## 1. Feature Name

**Promo Code System** — A flexible discount mechanism at checkout allowing customers to redeem referral codes, partnership codes, testimonial program codes, and marketing campaign codes against one-time service orders and subscriptions.

---

## 2. Epic

**Parent Epic:** QB Portal Production Launch

**Related Documents:**
- PRD Context: `/docs/prd/qb-portal/prd-context.md`
- Feature PRD — Support Subscription: `/docs/prd/qb-portal/feature-support-subscription.md`
- Portal Architecture: `artifacts/qb-portal/` (React 19 + Vite 7, Tailwind v4)
- API Server: `artifacts/api-server/` (Express 5, Drizzle ORM, Stripe, multer)
- OpenAPI Spec: `lib/api-spec/`
- Zod Schemas: `lib/api-zod/`

---

## 3. Goal

### Problem

NexFortis has four concrete discount distribution channels — a Premium subscriber referral program ($25/referral), accountant partnership codes, a "first 3 free" testimonial program for trusted accountants, and time-limited marketing campaign codes — but no mechanism exists in the checkout flow to redeem them. Without a promo code system, referral incentives cannot be honoured programmatically, the testimonial program requires fully manual order processing, and marketing campaigns cannot be tracked or measured. Additionally, the automatic 50% launch promo applies universally; there is no way to offer an additional or alternative targeted discount to specific customer segments without a code-based override layer.

### Solution

A promo code system integrated into the QB Portal checkout flow. Customers enter a code in a visible but unobtrusive text field before payment. The system validates the code in real time against a `promo_codes` table, evaluates all constraints (expiry, usage limit, product restrictions, first-time flag, stackability), computes the adjusted price, and shows a clear discount preview before the customer confirms payment. Stripe Coupon/Promotion Code objects back each code so discount application is authoritative at the payment layer, not just the UI layer. Hassan manages codes via the Operator Admin Panel.

### Impact

| Metric | Target |
|--------|--------|
| Testimonial program activation | ≥ 3 accountants complete "first 3 free" within 60 days of launch |
| Referral conversion rate | ≥ 15% of distributed referral codes result in a completed order within 90 days |
| Campaign code redemption tracking | 100% of codes created via admin panel have redemption data visible within 24 hours of first use |
| Checkout abandonment (promo-assisted) | Promo code redemption flow adds ≤ 5 seconds to median checkout time |
| Invalid code friction | ≤ 3% of code entries result in a support ticket about promo application |
| Revenue impact visibility | Operator can see total discount value issued per code within the admin panel |

---

## 4. User Personas

### P1 — Customer with Referral Code
A small business owner or accountant who received a referral code from a NexFortis Premium subscriber. They are already at checkout for a conversion or data service. They have a 6–8 character alphanumeric code and want to apply it before paying. They expect immediate validation feedback and a clear price reduction before confirming.

### P2 — Accountant in Testimonial Program ("First 3 Free")
A trusted accountant or bookkeeper who Hassan has personally approved for the testimonial program. They have been given a dedicated code that makes their first 3 conversions $0 (100% off, single-product type, usage-limited). They may be unfamiliar with the portal checkout flow and need frictionless code entry. They will ultimately provide a written testimonial/review in exchange.

### P3 — Partnership Code Holder
An accountant referred through a formal NexFortis partnership arrangement. Their code provides a fixed or percentage discount (e.g., 20% off all services) with no usage cap for their account, or a generous multi-use cap. They may use this repeatedly across multiple client orders.

### P4 — Marketing Campaign Respondent
A customer who arrived via a paid ad, social post, or email campaign that advertised a specific discount code. The code has a hard expiry date and a total-use cap. They expect the code to work as advertised and to see the exact savings amount before paying.

### P5 — Win-Back Customer
A previously churned customer who received a win-back email with a personalized code. The code is single-use, first-time-customer-or-lapsed check is applied, and it may offer a fixed dollar amount off ($50) to overcome re-engagement friction.

### P6 — Operator (Hassan Sadiq)
Creates, manages, and deactivates promo codes via the admin panel. Tracks redemption counts and revenue impact. Needs to quickly create a code for a new campaign or deactivate a code that has been shared publicly beyond intended scope. Reviews analytics to determine which programs drive the highest conversion lift.

---

## 5. User Stories

### 5.1 — Code Entry at Checkout

**US-01:** As a Customer, I want to see a promo code input field on the checkout page so that I can apply my discount before entering payment details.

**US-02:** As a Customer, I want to receive real-time feedback when I enter a code (valid, invalid, expired, already used, not applicable to this product) so that I know immediately whether my code works before proceeding.

**US-03:** As a Customer with a valid code, I want to see the exact discount amount (e.g., "–$50.00" or "–10% = –$14.90") applied to my order summary before I confirm payment so that I can verify my savings.

**US-04:** As a Customer whose code stacks with the active launch promo, I want to see both discounts listed as separate line items (e.g., "Launch Promo: –50%" and "Code NEXREF25: –$25.00") so that I understand the full discount breakdown.

**US-05:** As a Customer whose code cannot stack with the launch promo, I want the system to automatically apply the greater discount and display a notice explaining why only one discount is applied so that I am not confused about the price.

**US-06:** As a Customer, I want to be able to remove an applied promo code and revert to the original (or launch-promo-only) price so that I can correct an entry mistake.

**US-07:** As a Customer with a "first 3 free" testimonial code, I want the checkout to reflect $0.00 owing for the eligible service and allow me to complete the order without entering payment details so that the process is frictionless.

---

### 5.2 — Code Constraints and Validation

**US-08:** As a Customer, I want to be told clearly when a code has expired (with the expiry date shown if publicly appropriate) so that I can understand why it did not work.

**US-09:** As a Customer, I want to be told when a code is not applicable to the product in my order (e.g., a "Data Services only" code applied to a Migration service) so that I understand the restriction and am not left guessing.

**US-10:** As a Customer, I want to be told when a code is for first-time customers only and I am not eligible so that I can seek alternative pricing.

**US-11:** As a Customer, I want to be told when a code has reached its usage limit so that I am not waiting or re-entering the same code.

**US-12:** As a Customer, I want to be told when my order subtotal is below the minimum required for the code (e.g., "This code requires a minimum order of $100.00") so that I understand what I need to do.

---

### 5.3 — Subscription Discount Codes

**US-13:** As a Customer with a subscription discount code (e.g., "first month free" or "3 months at 25% off"), I want to see the subscription pricing adjusted during checkout so that I understand my billing schedule.

**US-14:** As a Customer using a subscription promo code, I want to see the post-promo regular price clearly stated (e.g., "After promo, billed at $49/mo") so that I am not surprised at renewal.

---

### 5.4 — Operator Code Management

**US-15:** As the Operator, I want to create a new promo code with all constraint fields (type, value, usage limit, expiry, product/category restriction, first-time flag, stackability, description/notes) from the Admin Panel so that I can launch new campaigns without engineering involvement.

**US-16:** As the Operator, I want to deactivate any promo code immediately so that I can shut down a leaked or over-distributed code without waiting for its natural expiry.

**US-17:** As the Operator, I want to view a list of all promo codes with their redemption count, total discount value issued, remaining uses, and active/inactive status so that I can track program effectiveness at a glance.

**US-18:** As the Operator, I want to generate a unique referral code for each new Premium subscriber at the time their subscription activates so that the referral program runs without manual code creation per subscriber.

**US-19:** As the Operator, I want to generate a "first 3 free" testimonial code for a specific accountant, pre-configured with a 3-use limit, 100% off, restricted to Conversion Services only, and tied to that accountant's email address so that the free conversions cannot be shared or abused.

**US-20:** As the Operator, I want to see a per-code usage log (timestamp, customer email, order ID, discount amount applied) so that I can audit usage for testimonial and partnership codes.

---

### 5.5 — Analytics

**US-21:** As the Operator, I want to see a summary dashboard for all promo codes showing total orders influenced, total discount value issued, and revenue per code source (referral, campaign, testimonial, partnership) so that I can evaluate ROI.

---

## 6. Requirements

### 6.1 Functional Requirements

#### Code Entry and UI

- **FR-01:** The checkout page must include a collapsible or inline "Promo Code" text input field. The field must be visible by default (not hidden behind a link) but visually secondary to the main order summary to avoid distraction from primary checkout flow.
- **FR-02:** The promo code field must trigger validation on user action (button click or pressing Enter), not on every keystroke. Validation must complete and render a response within 500ms of submission under normal API conditions.
- **FR-03:** The field must accept codes in a case-insensitive manner (e.g., `nexref25`, `NEXREF25`, and `NexRef25` must all match the same code).
- **FR-04:** On successful code validation, the order summary must update in real time to show the discount as a separate named line item (e.g., "Promo: NEXREF25 — –$25.00"). The final amount due must update immediately.
- **FR-05:** An "X Remove" action must be available adjacent to an applied code, allowing the customer to clear it and restore the pre-code price.
- **FR-06:** When a code results in a $0.00 order total (100% off / "first 3 free"), the payment step must be bypassed and a confirmation page shown directly after order record creation. No Stripe payment intent is created for $0 orders.
- **FR-07:** When a code cannot stack with the launch promo, the system must compute both discount amounts, apply the greater one, and display a notice: "This code cannot be combined with the Launch Promo. We've applied [code name / Launch Promo] as it gives you the greater saving."
- **FR-08:** When a code can stack with the launch promo, both discounts must appear as separate named line items in the order summary. Discounts are applied sequentially: launch promo first (percentage off base price), then code discount applied to the post-launch-promo price — unless the code specifies `applies_to_base_price: true`.

#### Code Types

- **FR-09 — Percentage Discount:** A code of type `percentage` must reduce the applicable product price(s) by the specified percentage (e.g., 25%). The percentage must be stored as an integer (0–100). Stripe Coupon `percent_off` field is used.
- **FR-10 — Fixed Amount Discount:** A code of type `fixed_amount` must reduce the order by the specified CAD dollar amount (e.g., $50.00). If the order subtotal is less than the fixed amount, the discount is capped at the order subtotal (order total = $0, not negative). Stripe Coupon `amount_off` field (in cents, CAD) is used.
- **FR-11 — Free Service (100% off):** A code of type `free_service` must reduce the price of the restricted product(s) to $0. It is functionally a `percentage = 100` code with mandatory `product_restriction` applied. This type must enforce the `product_restriction` field — a free service code without a product restriction must be rejected at creation time in the admin panel.
- **FR-12 — Subscription Discount:** A code of type `subscription` must create or apply a Stripe Coupon with `duration: repeating` and `duration_in_months` equal to the configured months, and either `percent_off` or `amount_off` as specified. The checkout summary must show the per-month promotional price, the number of months at that price, and the regular price effective after the promo period ends.

#### Code Constraints

- **FR-13 — Usage Limit:** Each code must have a `max_uses` field. Accepted values: a positive integer (1 to 999,999) or `null` (unlimited). Once redemption count reaches `max_uses`, the code is automatically marked `exhausted` and further validation attempts return "code has reached its usage limit." Stripe `max_redemptions` is set in parallel for Stripe-backed codes.
- **FR-14 — Single-Use Enforcement:** A code with `max_uses = 1` is a single-use code. This is the default for auto-generated referral codes and win-back codes. Once redeemed, the code cannot be used again by any customer. The system must check both the database and Stripe redemption status before accepting the code.
- **FR-15 — Per-Customer Use Limit:** Each code must support a `max_uses_per_customer` field (integer or `null` for unlimited per-customer). This is enforced by checking the `promo_code_redemptions` table for the current user's email/user_id. Guest users are matched by email. A customer who has already used the code `max_uses_per_customer` times receives: "You have already used this code the maximum number of times."
- **FR-16 — Expiration Date:** Each code must support an `expires_at` timestamptz field. A null value means the code never expires. If the current time (UTC) is past `expires_at`, validation returns: "This promo code expired on [formatted date]." Stripe `redeem_by` is set in parallel.
- **FR-17 — Product/Category Restriction:** Each code must support a `product_ids` array field (list of specific product IDs) and/or a `category_ids` array field (list of category slugs: `conversion`, `data_services`, `migration`, `subscription`, `volume_pack`). If either field is non-empty, the code only applies to matching items in the order. If none of the ordered items match, validation returns: "This code is not valid for the selected product(s)." If some items match and some do not, the discount applies only to matching items and the summary clearly labels which line item received the discount.
- **FR-18 — Minimum Order Amount:** Each code must support a `min_order_amount` field (integer cents, CAD, or null for no minimum). Validation checks the pre-discount order subtotal. If the subtotal is below `min_order_amount`, validation returns: "This code requires a minimum order of $[amount] CAD. Your current subtotal is $[amount]."
- **FR-19 — First-Time Customer Flag:** Each code must support a `first_time_customer_only` boolean field. When `true`, the system checks whether the current user (authenticated) or email (guest) has any prior completed orders in the `orders` table. If a prior order exists, validation returns: "This code is for first-time customers only." Guest users who have not registered but whose email matches a prior order record are also blocked.
- **FR-20 — Stackability Flag:** Each code must have a `stackable_with_launch_promo` boolean field. When `false`, the system applies the greater of the launch promo or the code discount (see FR-07). When `true`, both discounts apply (see FR-08). Stacking is evaluated only when the global launch promo is active. After the launch promo period ends, the `stackable_with_launch_promo` field has no effect.
- **FR-21 — Email Restriction (Testimonial Codes):** Each code must support an optional `restricted_to_email` field. When populated, the code can only be redeemed by a customer whose account email matches exactly. Validation for non-matching users (or guest users with a different email) returns: "This code is not valid for your account."

#### Validation API

- **FR-22:** `POST /api/promo/validate` must accept: `{ code: string, order_items: [{ product_id: string, quantity: number, unit_price_cents: number }], user_id?: string, guest_email?: string, order_type: 'one_time' | 'subscription' }`.
- **FR-23:** `POST /api/promo/validate` must return on success: `{ valid: true, discount_type, discount_value, discount_amount_cents, applies_to_items: [...], stackable: boolean, final_order_total_cents, preview_line_items: [...], code_description?: string }`.
- **FR-24:** `POST /api/promo/validate` must return on failure: `{ valid: false, error_code: string, error_message: string }`. Error codes: `EXPIRED`, `EXHAUSTED`, `PRODUCT_MISMATCH`, `MINIMUM_NOT_MET`, `FIRST_TIME_ONLY`, `EMAIL_RESTRICTED`, `NOT_FOUND`, `ALREADY_USED_MAX_TIMES`.
- **FR-25:** The validate endpoint must be rate-limited to 10 requests per minute per IP address to prevent code enumeration attacks.
- **FR-26:** The validate endpoint must NOT increment the usage counter. Usage is only incremented upon successful order completion via `POST /api/promo/redeem`.

#### Application API

- **FR-27:** `POST /api/promo/redeem` must be called server-side at order confirmation time (after Stripe payment intent succeeds or $0 order bypass). It must: (a) re-validate all constraints to prevent race conditions, (b) atomically increment `redemption_count` on the `promo_codes` record, (c) create a `promo_code_redemptions` record, (d) apply the Stripe Coupon to the Stripe PaymentIntent or Subscription, (e) return the final confirmed discount amount.
- **FR-28:** Redemption must use a database transaction. If any step fails (e.g., usage limit reached between validate and redeem due to concurrent redemptions), the order must fail gracefully with: "This promo code was just used by another customer and has reached its limit. Please complete your order at the standard price."
- **FR-29:** For subscription codes, the Stripe Coupon must be applied to the Stripe Subscription object, not the one-time invoice, to ensure recurring discount periods are honoured by Stripe.

#### Referral Code Auto-Generation

- **FR-30:** Upon processing a `customer.subscription.updated` or `checkout.session.completed` Stripe webhook that activates a Premium subscription, the system must auto-generate a unique referral code for that subscriber if they do not already have one. Code format: `REF` + 6 uppercase alphanumeric characters (e.g., `REFAB12XY`). Uniqueness must be guaranteed by database unique constraint retry logic (max 5 attempts before raising an error).
- **FR-31:** The auto-generated referral code must be inserted into `promo_codes` with: `type = fixed_amount`, `amount_off_cents = 2500` (CAD $25), `max_uses = null` (unlimited total uses), `max_uses_per_customer = 1`, `stackable_with_launch_promo = true`, `category_ids = null` (all products), `description = 'Referral code — [subscriber name]'`, `owner_user_id` set to the Premium subscriber's user ID.
- **FR-32:** When a referral code is redeemed, the `promo_code_redemptions` record must store the `owner_user_id` so that the $25 referral credit can be issued to the referring Premium subscriber. Credit issuance (Stripe balance credit or portal credit) must be recorded in a `referral_credits` table and surfaced in Settings > My Plan for the referring subscriber.

#### Admin Panel — Code Management

- **FR-33:** The Operator Admin Panel must include a "Promo Codes" section with: a paginated list of all codes, search/filter by code string, status (active/inactive/exhausted/expired), type, and creation date.
- **FR-34:** Each code row must show: code string, type, value, redemption count / max uses, expiry date, status badge, and action buttons (Edit, Deactivate, View Log).
- **FR-35:** The "Create Code" form must include all fields: code string (manual entry or auto-generate), type (percentage / fixed_amount / free_service / subscription), value, duration_months (subscription type only), max_uses (integer or "Unlimited"), max_uses_per_customer (integer or "Unlimited"), expires_at (date picker or "Never"), product_ids (multi-select from product catalog), category_ids (multi-select from category list), min_order_amount (CAD, optional), first_time_customer_only (toggle), stackable_with_launch_promo (toggle), restricted_to_email (text, optional), description/notes (textarea, internal only).
- **FR-36:** The "Deactivate" action must set `is_active = false` immediately. A deactivated code fails validation with `NOT_FOUND` (do not reveal existence of the code to the customer). Stripe `Promotion Code` object must also be deactivated via the Stripe API.
- **FR-37:** The "View Log" modal must display a per-code redemption log: timestamp, customer email, order ID, discount amount applied, order total before and after code.
- **FR-38:** The admin panel must display a "Promo Analytics" summary card showing: total active codes, total redemptions (all time), total discount value issued (CAD), top 5 codes by redemption count.

#### Analytics Tracking

- **FR-39:** Every order that includes a promo code redemption must store `promo_code_id` and `discount_amount_applied_cents` on the `orders` table row.
- **FR-40:** The `promo_code_redemptions` table must record: `promo_code_id`, `user_id`, `guest_email`, `order_id`, `discount_amount_cents`, `order_total_before_cents`, `order_total_after_cents`, `redeemed_at`.

---

### 6.2 Non-Functional Requirements

- **NFR-01 — Validation Latency:** `POST /api/promo/validate` must return a response within 500ms at p95 under normal load. This includes all database constraint checks.
- **NFR-02 — Race Condition Safety:** The redemption counter increment must use a SELECT FOR UPDATE (or equivalent Drizzle/PostgreSQL atomic update) to prevent double-redemption when two customers submit the same single-use code simultaneously.
- **NFR-03 — Security — Code Enumeration:** The validate endpoint must return `NOT_FOUND` for both non-existent and deactivated codes (no distinguishing response). The endpoint must be rate-limited at 10 requests/minute/IP. Codes must be at minimum 6 characters, case-insensitive alphanumeric, to make brute-force enumeration impractical.
- **NFR-04 — Security — Server-Side Authority:** Discount amounts must never be calculated solely on the frontend. The final discount applied to a Stripe PaymentIntent must always be derived from the server-side `POST /api/promo/redeem` response. The frontend only displays the preview from `validate`.
- **NFR-05 — Security — Stripe Coupon Integrity:** Every promo code must have a corresponding Stripe Coupon object. The Stripe Coupon is the authoritative discount mechanism at the payment layer. A server-side bug that skips applying the Stripe Coupon must not result in a customer being charged the undiscounted amount without the portal also failing.
- **NFR-06 — Stripe Idempotency:** Calls to create Stripe Coupons and apply them to PaymentIntents or Subscriptions must use idempotency keys derived from `promo_code_id + order_id` to prevent duplicate discount application on retry.
- **NFR-07 — Accessibility:** The promo code field, validation feedback messages, and updated order summary must meet WCAG 2.1 AA. Error messages must be announced via `aria-live="polite"`. Success states must update the order summary with an accessible label change.
- **NFR-08 — Mobile Responsiveness:** The promo code input and order summary discount breakdown must render correctly on viewports ≥ 375px. The field must not obstruct the primary checkout CTA on small screens.
- **NFR-09 — Data Privacy:** `restricted_to_email` values and `owner_user_id` on referral codes must not be exposed in any client-facing API response. The validate endpoint response must never return internal code metadata (description, owner, restriction details).
- **NFR-10 — Audit Trail:** All admin create/edit/deactivate actions on promo codes must be logged to a `promo_code_admin_events` table with: `admin_user_id`, `action`, `code_id`, `before_state` (jsonb), `after_state` (jsonb), `timestamp`.
- **NFR-11 — Performance — Admin Panel:** The admin promo code list must load in < 2 seconds for up to 500 code records with full pagination. The per-code redemption log must load in < 2 seconds for up to 1,000 redemption records.
- **NFR-12 — GST/HST Compliance:** Discounts must be applied before Stripe Tax calculates GST/HST. The taxable amount sent to Stripe must be the post-discount subtotal. This is enforced by applying the coupon to the PaymentIntent before tax calculation, consistent with Stripe Tax behaviour.

---

## 7. Acceptance Criteria

### AC-01: Promo Field Visibility at Checkout

- Given: Any customer (guest or authenticated) is on the checkout page for any one-time service order
- When: The page loads
- Then:
  - [ ] A clearly labelled "Promo Code" input field is visible in the order summary panel
  - [ ] The field is not collapsed behind a toggle link — it is directly visible
  - [ ] An "Apply" button (or equivalent) is adjacent to the field
  - [ ] The field is visually secondary (smaller, lower contrast) relative to the main order total and CTA

---

### AC-02: Valid Percentage Discount Code

- Given: A customer enters a valid, active percentage discount code (e.g., `PARTNER20` — 20% off all services) on a $149 CAD order
- When: They click "Apply"
- Then:
  - [ ] Validation completes within 500ms
  - [ ] Order summary shows: "Promo: PARTNER20 — –20% (–$29.80)"
  - [ ] New order total shows $119.20 CAD (before tax)
  - [ ] "Remove" action is available
  - [ ] The Stripe PaymentIntent amount is updated to $119.20 CAD before the customer proceeds to payment

---

### AC-03: Valid Fixed Amount Discount Code

- Given: A customer enters a valid fixed-amount code (e.g., `WINBACK50` — $50 off) on a $149 CAD order
- When: They click "Apply"
- Then:
  - [ ] Order summary shows: "Promo: WINBACK50 — –$50.00"
  - [ ] New order total shows $99.00 CAD (before tax)
  - [ ] If the same code is applied to a $49 order (below the discount value), the total shows $0.00 and a note states: "Discount capped at order value"
  - [ ] Final total is never negative

---

### AC-04: Free Service Code ("First 3 Free" Testimonial)

- Given: A trusted accountant enters their testimonial code (e.g., `FREE3-AB12XY`) on a Conversion Service order ($149 base / $75 launch-promo price)
- When: They click "Apply" and proceed to checkout
- Then:
  - [ ] Validation confirms the code is valid, type = `free_service`, restricted to Conversion Services
  - [ ] Order summary shows: "Promo: FREE3-AB12XY — –100% (–$75.00)" (applied after launch promo)
  - [ ] Final order total is $0.00 CAD
  - [ ] Payment step (credit card entry) is bypassed entirely
  - [ ] Order is created in the database with `status = confirmed`, `payment_status = free_promo`
  - [ ] Redemption counter on the code increments from e.g., 1 to 2 (toward the max_uses = 3 limit)
  - [ ] Operator receives an order notification email indicating the order was fulfilled via testimonial code

---

### AC-05: Free Service Code — Usage Limit Reached

- Given: The testimonial code `FREE3-AB12XY` has already been redeemed 3 times (max_uses = 3)
- When: The accountant (or anyone) tries to apply it for a 4th time
- Then:
  - [ ] Validation returns `EXHAUSTED`
  - [ ] Error message shown: "This promo code has reached its usage limit."
  - [ ] No discount is applied
  - [ ] The code in the database has `status = exhausted`

---

### AC-06: Free Service Code — Product Restriction Enforcement

- Given: An accountant with a free service testimonial code (restricted to `category: conversion`) is checking out for an Audit Trail Removal ($99)
- When: They apply the code
- Then:
  - [ ] Validation returns `PRODUCT_MISMATCH`
  - [ ] Error message: "This code is not valid for the selected product(s)."
  - [ ] No discount is applied

---

### AC-07: Subscription Discount Code ("First Month Free")

- Given: A customer enters a subscription code (e.g., `FIRSTFREE` — 100% off for 1 month) during QB Expert Support Essentials ($49/mo) checkout
- When: They click "Apply"
- Then:
  - [ ] Order summary shows: "Promo: FIRSTFREE — First month free (–$49.00). Renews at $49.00/mo from month 2."
  - [ ] The Stripe Subscription is created with a Coupon applied: `percent_off = 100`, `duration = repeating`, `duration_in_months = 1`
  - [ ] First invoice charges $0.00 CAD (excluding tax, per Stripe Tax behaviour on $0 subtotal)
  - [ ] Second invoice charges regular $49/mo
  - [ ] Post-promo price is clearly stated before the customer confirms

---

### AC-08: Subscription Discount Code — Multi-Month Partial Discount

- Given: A customer enters a code (e.g., `3MO25OFF` — 25% off for 3 months) during Professional ($99/mo) checkout
- When: They click "Apply"
- Then:
  - [ ] Order summary shows: "Promo: 3MO25OFF — 25% off for 3 months (–$24.75/mo). Months 1–3: $74.25/mo. From month 4: $99.00/mo."
  - [ ] Stripe Subscription Coupon: `percent_off = 25`, `duration = repeating`, `duration_in_months = 3`
  - [ ] Month 1 invoice: $74.25 CAD + applicable tax
  - [ ] Month 4 invoice: $99.00 CAD + applicable tax

---

### AC-09: Stacking — Code Stackable with Launch Promo

- Given: The launch promo (50% off) is active and a customer applies a stackable code (`NEXREF25` — $25 off, `stackable_with_launch_promo = true`) to a $149 base-price order
- When: They apply the code
- Then:
  - [ ] Order summary shows two distinct discount line items:
    - "Launch Promo (50% off): –$74.50"
    - "Promo: NEXREF25: –$25.00"
  - [ ] The $25 code discount is applied to the post-launch-promo price ($74.50), resulting in final total of $49.50 CAD
  - [ ] Both discounts are reflected in the Stripe PaymentIntent amount
  - [ ] Both discounts are stored on the order record

---

### AC-10: Stacking — Code NOT Stackable with Launch Promo (Code is Greater)

- Given: The launch promo (50% off a $149 order = $74.50 discount) is active and a customer applies a non-stackable code (`BIG100` — $100 off, `stackable_with_launch_promo = false`)
- When: They apply the code
- Then:
  - [ ] System computes: launch promo discount = $74.50; code discount = $100.00
  - [ ] Code discount is greater — code is applied
  - [ ] Order summary shows: "Promo: BIG100 — –$100.00" and a notice: "This code cannot be combined with the Launch Promo. We've applied BIG100 as it gives you the greater saving."
  - [ ] Launch Promo line item is NOT shown
  - [ ] Final total = $49.00 CAD

---

### AC-11: Stacking — Code NOT Stackable with Launch Promo (Launch Promo is Greater)

- Given: The launch promo (50% off a $149 order = $74.50 discount) is active and a customer applies a non-stackable code (`SAVE20` — $20 off, `stackable_with_launch_promo = false`)
- When: They apply the code
- Then:
  - [ ] System computes: launch promo discount = $74.50; code discount = $20.00
  - [ ] Launch promo is greater — launch promo is applied
  - [ ] Order summary shows: "Launch Promo (50% off): –$74.50" and a notice: "This code cannot be combined with the Launch Promo. We've kept the Launch Promo as it gives you the greater saving."
  - [ ] Final total = $74.50 CAD
  - [ ] The applied code is NOT recorded as a redemption in `promo_code_redemptions`

---

### AC-12: Expired Code

- Given: A code has an `expires_at` timestamp in the past
- When: A customer enters the code at checkout
- Then:
  - [ ] Validation returns `EXPIRED` within 500ms
  - [ ] Error message shown near the input: "This promo code expired on [formatted date, e.g., June 30, 2025]."
  - [ ] No discount is applied

---

### AC-13: First-Time Customer Only Code — Ineligible Customer

- Given: A code has `first_time_customer_only = true` and the authenticated customer has 2 prior completed orders
- When: They apply the code
- Then:
  - [ ] Validation returns `FIRST_TIME_ONLY`
  - [ ] Error message: "This promo code is for first-time customers only."
  - [ ] No discount is applied
  - [ ] The check is enforced server-side even if the frontend is manipulated

---

### AC-14: First-Time Customer Only Code — Eligible Customer

- Given: A code has `first_time_customer_only = true` and the customer has zero prior completed orders (or is a new guest email with no order history)
- When: They apply the code
- Then:
  - [ ] Validation returns `valid: true`
  - [ ] Discount is applied normally
  - [ ] The first-time eligibility check is re-run server-side at redemption time (AC-14a: if another order completes between validate and redeem, redemption fails gracefully)

---

### AC-15: Minimum Order Amount Not Met

- Given: A code has `min_order_amount = 10000` ($100.00 CAD) and the customer's order subtotal is $75 CAD
- When: They apply the code
- Then:
  - [ ] Validation returns `MINIMUM_NOT_MET`
  - [ ] Error message: "This code requires a minimum order of $100.00 CAD. Your current subtotal is $75.00 CAD."
  - [ ] No discount is applied

---

### AC-16: Email-Restricted Code — Non-Matching User

- Given: A code has `restricted_to_email = accountant@firm.com` and a different user (or guest with a different email) attempts to apply it
- When: They enter the code
- Then:
  - [ ] Validation returns `EMAIL_RESTRICTED` — but the error message shown is the generic "This promo code is not valid for your account." (do not reveal the restriction email)
  - [ ] No discount is applied

---

### AC-17: Email-Restricted Code — Matching User

- Given: A code has `restricted_to_email = accountant@firm.com` and the user logged in with that exact email applies the code
- When: They enter the code
- Then:
  - [ ] Validation returns `valid: true`
  - [ ] Discount is applied normally

---

### AC-18: Code Removal

- Given: A customer has applied a valid code and the order summary shows the discount
- When: They click the "Remove" action next to the applied code
- Then:
  - [ ] The discount line item is removed from the order summary
  - [ ] The order total reverts to the pre-code price (launch promo still applied if active)
  - [ ] The promo code input field is cleared and available for a new entry
  - [ ] The Stripe PaymentIntent amount is updated to the pre-code amount
  - [ ] No redemption has been recorded (redemption only occurs on order completion)

---

### AC-19: Non-Existent or Deactivated Code

- Given: A customer enters a code string that does not exist in `promo_codes`, or exists but `is_active = false`
- When: They click "Apply"
- Then:
  - [ ] Validation returns `NOT_FOUND`
  - [ ] Error message: "This promo code is invalid or has expired."
  - [ ] Response is identical for non-existent and deactivated codes (no enumeration hint)

---

### AC-20: Rate Limiting on Validate Endpoint

- Given: A single IP address sends 11 or more POST requests to `/api/promo/validate` within 60 seconds
- When: The 11th request arrives
- Then:
  - [ ] The endpoint returns HTTP 429 Too Many Requests
  - [ ] Response body: `{ "error": "Too many requests. Please try again in a moment." }`
  - [ ] The first 10 requests in the window are processed normally

---

### AC-21: Concurrent Redemption Race Condition

- Given: A single-use code (`max_uses = 1`) has 0 redemptions and two customers submit orders using it simultaneously
- When: Both `POST /api/promo/redeem` calls are processed concurrently
- Then:
  - [ ] Exactly one redemption succeeds (the atomic increment + constraint enforces this)
  - [ ] The second customer receives: "This promo code was just used by another customer and has reached its limit. Please complete your order at the standard price."
  - [ ] The second customer's order is not cancelled — they are prompted to proceed without the code
  - [ ] No duplicate `promo_code_redemptions` records exist for the same code at max_uses

---

### AC-22: Referral Code Auto-Generation for Premium Subscriber

- Given: A customer's Premium subscription is activated via Stripe webhook (`checkout.session.completed` with Premium price ID)
- When: The webhook handler processes the event
- Then:
  - [ ] A unique referral code in format `REF[6 alphanumeric]` is generated
  - [ ] The code is inserted into `promo_codes` with: type = `fixed_amount`, amount_off = $25 CAD, max_uses = null, max_uses_per_customer = 1, stackable_with_launch_promo = true, owner_user_id = subscriber's user ID, is_active = true
  - [ ] The code is stored on the subscriber's record (visible in Settings > My Plan)
  - [ ] If a referral code already exists for this subscriber (e.g., on reactivation), a new code is NOT generated — the existing one is reactivated

---

### AC-23: Referral Code Redemption and Credit

- Given: A new customer applies a valid referral code (e.g., `REFAB12XY`) at checkout for a $149 CAD service
- When: The order completes successfully
- Then:
  - [ ] The new customer receives $25 off their order (order total = $124 CAD before launch promo interaction)
  - [ ] A `promo_code_redemptions` record is created with `owner_user_id` = referring subscriber's user ID
  - [ ] A `referral_credits` record is created for the referring subscriber: `amount_cents = 2500`, `source = promo_code_redemption`, `order_id` = the new customer's order
  - [ ] The referring subscriber's "Your Referral Code" section in Settings > My Plan shows an updated "Credits Earned" total
  - [ ] The max_uses_per_customer = 1 enforcement means the same new customer cannot use the same referral code twice

---

### AC-24: Admin — Create Promo Code

- Given: Hassan is logged into the Admin Panel and navigates to Promo Codes > Create New
- When: He fills all required fields and submits
- Then:
  - [ ] The code is inserted into `promo_codes` with `is_active = true`
  - [ ] A corresponding Stripe Coupon and Stripe Promotion Code object are created via the Stripe API
  - [ ] The new code appears immediately in the promo code list
  - [ ] An entry is created in `promo_code_admin_events` with action = `created`
  - [ ] If the code string already exists, a clear validation error is shown: "A promo code with this name already exists."

---

### AC-25: Admin — Deactivate Promo Code

- Given: Hassan clicks "Deactivate" on an active code in the Admin Panel
- When: He confirms the action
- Then:
  - [ ] `promo_codes.is_active` is set to `false` immediately
  - [ ] The corresponding Stripe Promotion Code is deactivated via Stripe API
  - [ ] Subsequent validation attempts return `NOT_FOUND`
  - [ ] The code row in the admin list shows status badge "Inactive"
  - [ ] An entry is created in `promo_code_admin_events` with action = `deactivated`
  - [ ] Existing orders that already redeemed the code are unaffected

---

### AC-26: Admin — Per-Code Redemption Log

- Given: Hassan clicks "View Log" on any promo code
- When: The log modal opens
- Then:
  - [ ] A table shows all redemptions: timestamp, customer email, order ID (linked to order detail), discount amount applied, order total before and after code
  - [ ] The list is paginated (20 per page) and loads within 2 seconds for up to 1,000 records
  - [ ] If no redemptions exist, the modal shows: "No redemptions yet."

---

### AC-27: Admin — Promo Analytics Summary

- Given: Hassan views the Promo Codes section header
- When: The page loads
- Then:
  - [ ] A summary card shows: total active codes, total all-time redemptions, total CAD discount value issued (sum of all `discount_amount_cents` from `promo_code_redemptions`)
  - [ ] A "Top 5 Codes" table shows the 5 codes with the highest redemption count
  - [ ] All figures are accurate as of the last page load (no caching lag beyond the database read)

---

### AC-28: Order Record Integrity

- Given: Any order that includes a successfully redeemed promo code
- When: The order is completed and stored
- Then:
  - [ ] `orders.promo_code_id` is populated with the redeemed code's UUID
  - [ ] `orders.discount_amount_applied_cents` reflects the exact discount amount applied
  - [ ] `orders.subtotal_before_discount_cents` reflects the pre-code subtotal
  - [ ] The corresponding `promo_code_redemptions` record exists and references the order

---

### AC-29: $0 Order Bypass — No Payment Required

- Given: A promo code results in a $0.00 order total (100% off)
- When: The customer proceeds past the order summary
- Then:
  - [ ] The payment entry step (Stripe Elements / card form) is not shown
  - [ ] The customer clicks a "Confirm Free Order" button
  - [ ] The order is created with `payment_status = free_promo`, `amount_charged_cents = 0`
  - [ ] No Stripe PaymentIntent is created
  - [ ] The customer receives an order confirmation email
  - [ ] The operator receives the standard new order notification email with a note: "Order fulfilled via promo code — no payment collected."

---

## 8. Out of Scope

The following are explicitly excluded from this feature's initial implementation:

- **Automatic coupon codes.** The launch promo (50% off) is a separate, automatic system applied universally at checkout — not part of this promo code feature. This PRD covers only manually entered code-based discounts.
- **Referral dashboard / analytics page for subscribers.** Referral codes are generated and visible in Settings, and credits are tracked, but a full referral analytics page (conversion funnel, total earnings history, link sharing tools) is a v2 enhancement.
- **Public referral link generation.** Referral codes must be manually shared by subscribers as text. Auto-generated shareable URLs (e.g., `qb.nexfortis.com/?ref=REFAB12XY`) are out of scope at launch.
- **Referral credit cashout / payout.** Credits earned through referrals are stored in `referral_credits` and displayed to the subscriber, but automated Stripe payout or credit application to future invoices is a v2 feature. At launch, credits are tracked and applied manually by Hassan.
- **Bulk code generation.** The admin panel supports one code at a time. Generating hundreds of unique codes for a mass campaign (e.g., CSV export of 500 unique codes) is out of scope.
- **A/B testing of promo code offers.** No split testing or multi-variant code experiments at launch.
- **Customer-facing promo code history.** Customers do not see a list of codes they have previously used in their portal. Order history shows the discount applied but not the code name.
- **Code-triggered upsell flows.** A promo code that, upon validation, triggers a specific upsell modal or cross-sell product suggestion is out of scope.
- **Loyalty / points programs.** Promo codes are one-time or limited-use discount mechanisms, not a recurring points or loyalty accumulation system.
- **Affiliate tracking integration.** No third-party affiliate platform (e.g., Impact, ShareASale) integration. Referral tracking is internal only.
- **Multi-currency codes.** All codes are denominated in CAD. USD or multi-currency variants are not supported.
- **Code applicability to bundle products (Volume Packs) with split line-item logic.** Promo codes applied to 5-Pack or 10-Pack orders treat the pack as a single product unit. Per-conversion-within-pack discounting is not supported.

---

## 9. Technical Notes for Engineering

### Database Schema

```sql
-- Promo Codes master table
promo_codes (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                        text NOT NULL UNIQUE,             -- case-insensitive enforced via LOWER() index
  is_active                   boolean NOT NULL DEFAULT true,
  type                        text NOT NULL,                    -- 'percentage' | 'fixed_amount' | 'free_service' | 'subscription'
  percent_off                 integer,                          -- 1–100, used for percentage and free_service types
  amount_off_cents            integer,                          -- CAD cents, used for fixed_amount type
  subscription_duration_months integer,                         -- used for subscription type only
  max_uses                    integer,                          -- null = unlimited
  max_uses_per_customer       integer,                          -- null = unlimited per customer
  redemption_count            integer NOT NULL DEFAULT 0,
  expires_at                  timestamptz,                      -- null = never expires
  product_ids                 text[],                           -- null or empty = all products
  category_ids                text[],                           -- null or empty = all categories; values: 'conversion' | 'data_services' | 'migration' | 'subscription' | 'volume_pack'
  min_order_amount_cents      integer,                          -- null = no minimum
  first_time_customer_only    boolean NOT NULL DEFAULT false,
  stackable_with_launch_promo boolean NOT NULL DEFAULT true,
  restricted_to_email         text,                             -- null = no email restriction; stored lowercase
  applies_to_base_price       boolean NOT NULL DEFAULT false,   -- if true, stacked discount applies to base price, not post-launch-promo price
  owner_user_id               uuid REFERENCES users(id),        -- set for referral codes
  stripe_coupon_id            text,                             -- Stripe Coupon ID
  stripe_promotion_code_id    text,                             -- Stripe Promotion Code ID
  description                 text,                             -- internal operator notes
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
)

-- Unique index for case-insensitive code lookup
CREATE UNIQUE INDEX promo_codes_code_lower_idx ON promo_codes (LOWER(code));

-- Redemption log
promo_code_redemptions (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id               uuid NOT NULL REFERENCES promo_codes(id),
  user_id                     uuid REFERENCES users(id),         -- null for guest orders
  guest_email                 text,                              -- populated for guest orders
  order_id                    uuid NOT NULL REFERENCES orders(id),
  discount_amount_cents       integer NOT NULL,
  order_total_before_cents    integer NOT NULL,
  order_total_after_cents     integer NOT NULL,
  owner_user_id               uuid REFERENCES users(id),         -- copied from promo_codes.owner_user_id at redemption time
  redeemed_at                 timestamptz NOT NULL DEFAULT now()
)

-- Referral credits
referral_credits (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_user_id         uuid NOT NULL REFERENCES users(id), -- the Premium subscriber earning the credit
  amount_cents                integer NOT NULL,
  source                      text NOT NULL DEFAULT 'promo_code_redemption',
  promo_code_redemption_id    uuid REFERENCES promo_code_redemptions(id),
  order_id                    uuid REFERENCES orders(id),
  status                      text NOT NULL DEFAULT 'pending',    -- 'pending' | 'applied' | 'paid_out'
  created_at                  timestamptz NOT NULL DEFAULT now()
)

-- Admin audit log
promo_code_admin_events (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id               uuid NOT NULL REFERENCES users(id),
  action                      text NOT NULL,                     -- 'created' | 'updated' | 'deactivated' | 'reactivated'
  promo_code_id               uuid NOT NULL REFERENCES promo_codes(id),
  before_state                jsonb,
  after_state                 jsonb,
  created_at                  timestamptz NOT NULL DEFAULT now()
)

-- Additions to orders table
ALTER TABLE orders ADD COLUMN promo_code_id uuid REFERENCES promo_codes(id);
ALTER TABLE orders ADD COLUMN discount_amount_applied_cents integer DEFAULT 0;
ALTER TABLE orders ADD COLUMN subtotal_before_discount_cents integer;
ALTER TABLE orders ADD COLUMN payment_status text;  -- add 'free_promo' to existing enum
```

### API Endpoints Summary

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/promo/validate` | Validate code against order — does NOT redeem |
| `POST` | `/api/promo/redeem` | Atomically redeem code on confirmed order |
| `GET` | `/api/admin/promo-codes` | List all codes (admin only) |
| `POST` | `/api/admin/promo-codes` | Create new code (admin only) |
| `PATCH` | `/api/admin/promo-codes/:id` | Update code fields (admin only) |
| `POST` | `/api/admin/promo-codes/:id/deactivate` | Deactivate code (admin only) |
| `GET` | `/api/admin/promo-codes/:id/redemptions` | Per-code redemption log (admin only) |
| `GET` | `/api/admin/promo-codes/analytics` | Aggregated analytics summary (admin only) |

### Stripe Integration Details

- **Coupon vs Promotion Code:** Create a Stripe `Coupon` object for each promo code. Create a Stripe `PromotionCode` object linked to the Coupon with the code string. This allows Stripe-side redemption tracking as a second-layer validation.
- **One-Time Orders:** Apply coupon via `discounts` parameter on the `PaymentIntent` (for Stripe Payment Links) or via `Coupon` on the `Invoice` item if using Stripe Invoices for one-time orders.
- **Subscriptions:** Apply coupon via `coupon` parameter on `Subscription` create call. Stripe handles `duration_in_months` automatically.
- **$0 Orders:** Do not create a PaymentIntent. The Stripe coupon is not needed for $0 orders (no Stripe transaction). Record the discount in the `promo_code_redemptions` table only.
- **Deactivation:** When `is_active` is set to `false` in the database, call `stripe.promotionCodes.update(promoCodeId, { active: false })`.

### Referral Code Generation Utility

```typescript
// lib/utils/referralCode.ts
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // excludes O, 0, I, 1 for readability

export async function generateUniqueReferralCode(db: DrizzleDB): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = Array.from({ length: 6 }, () =>
      CHARSET[Math.floor(Math.random() * CHARSET.length)]
    ).join('');
    const code = `REF${suffix}`;
    const existing = await db.query.promoCodes.findFirst({
      where: eq(promoCodes.code, code)
    });
    if (!existing) return code;
  }
  throw new Error('Failed to generate unique referral code after 5 attempts');
}
```

### Validate Endpoint — Constraint Check Order

Perform checks in this sequence to return the most actionable error first:

1. Code existence and `is_active` check → `NOT_FOUND`
2. Expiry check → `EXPIRED`
3. Global usage limit (`redemption_count >= max_uses`) → `EXHAUSTED`
4. Per-customer usage limit (query `promo_code_redemptions`) → `ALREADY_USED_MAX_TIMES`
5. Email restriction → `EMAIL_RESTRICTED`
6. Product/category restriction → `PRODUCT_MISMATCH`
7. Minimum order amount → `MINIMUM_NOT_MET`
8. First-time customer flag → `FIRST_TIME_ONLY`
9. All checks passed → compute discount and return `valid: true`

### Email Templates Required (Resend)

| Template Key | Trigger | Recipients |
|---|---|---|
| `order-free-promo-confirmation` | $0 order completed via free service code | Customer |
| `order-free-promo-operator-notify` | $0 order completed via free service code | support@nexfortis.com |
| `referral-credit-earned` | referral code redeemed by a new customer | Referring Premium subscriber |

> Standard order confirmation and operator notification emails already cover promo-discounted paid orders. Only $0 orders and referral credit events require dedicated templates.

### Launch Promo Interaction — Implementation Note

The launch promo is stored as a global configuration flag (e.g., `LAUNCH_PROMO_ACTIVE=true` env var or a `site_config` table row). The checkout service reads this flag to determine whether the automatic 50% discount applies. The promo code stacking logic reads the same flag and the code's `stackable_with_launch_promo` field. When the launch promo is disabled globally, all codes behave as if `stackable_with_launch_promo` is irrelevant — only the code discount applies.

---

*Document version: 1.0 — QB Portal Production Launch Epic*
*Author: NexFortis Product (Hassan Sadiq)*
*Last updated: June 2025*
