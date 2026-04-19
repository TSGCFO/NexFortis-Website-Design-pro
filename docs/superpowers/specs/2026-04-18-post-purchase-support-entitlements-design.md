# Post-Purchase Support Entitlements — Design Spec

**Date:** 2026-04-18
**Status:** Approved
**Author:** Aki (orchestrator)
**Approved by:** Hassan

---

## Problem

The website promises "30-day post-conversion/migration support at no additional cost" on multiple landing pages, but the backend hard-gates ticket creation behind a paid subscription. Customers who buy a conversion/migration service and then try to submit a support ticket are blocked with "An active subscription is required to submit tickets." This is a false-advertising risk and a broken customer experience.

## Decision

**Approach A — Free basic ticket access for all paid orders.**

Every customer with a completed paid order gets a baseline support entitlement:
- 2 tickets within 30 days of order delivery
- 2-hour response SLA (standard business hours, Mon–Fri 9–5 ET)
- Scoped to their specific order (auto-tagged with order number)

The existing "Post-Conversion Care" add-on ($49 base / $25 launch) becomes "Extended Support" — an upgraded version of the baseline:
- 5 tickets within 30 days of order delivery
- 1-hour response SLA
- Broader scope (not limited to the specific order)

Paid subscription tiers are completely untouched.

---

## Data Model

### New Table: `qb_order_support_entitlements`

| Column | Type | Notes |
|--------|------|-------|
| `id` | serial, PK | |
| `order_id` | integer, FK → qb_orders.id, unique | One entitlement per order |
| `user_id` | uuid, FK → qb_users.id | For fast lookup |
| `tickets_allowed` | integer, default 2 | 5 if Extended Support addon purchased |
| `tickets_used` | integer, default 0 | Incremented on ticket creation |
| `sla_minutes` | integer, default 120 | 60 if Extended Support addon purchased |
| `starts_at` | timestamp with time zone | Set when order status → "delivered" |
| `expires_at` | timestamp with time zone | starts_at + 30 days |
| `is_upgraded` | boolean, default false | true if Extended Support addon purchased |
| `created_at` | timestamp with time zone, default now() | |
| `updated_at` | timestamp with time zone, default now() | |

### Drizzle Schema Addition

Add the table definition to `lib/db/src/schema/qb-portal.ts` alongside the existing tables. Add a Drizzle migration file.

### No Changes to Existing Tables

- `qb_orders` — no new columns needed (addon info already in `addons` JSON column)
- `qb_subscriptions` — untouched
- `qb_support_tickets` — already has nullable `subscriptionId`; ticket creation for order entitlements will set `subscriptionId` to null and we add a nullable `entitlementId` column (FK → qb_order_support_entitlements.id) to track which entitlement a ticket was created under
- `qb_ticket_usage` — untouched (subscription-only tracking)

### Column Addition: `qb_support_tickets.entitlement_id`

| Column | Type | Notes |
|--------|------|-------|
| `entitlement_id` | integer, nullable, FK → qb_order_support_entitlements.id | Set when ticket is created under an order entitlement; null for subscription tickets |

---

## Backend Logic Changes

### 1. Ticket Creation Gate (`qb-tickets.ts`)

Current flow:
1. `getActiveSubscription(userId)` → if null, return 403

New flow:
1. `getActiveSubscription(userId)` → if found, use subscription (existing logic, unchanged)
2. If no subscription, call new function `getActiveOrderEntitlement(userId)`:
   - Query `qb_order_support_entitlements` where `user_id = userId`, `expires_at > now()`, `tickets_used < tickets_allowed`
   - Order by `expires_at ASC` (use the soonest-expiring entitlement first)
   - Return the first qualifying row, or null
3. If entitlement found:
   - Create ticket with `entitlement_id` set, `subscription_id` null
   - Set SLA deadline using the entitlement's `sla_minutes`
   - Increment `tickets_used` on the entitlement row (atomically, in same transaction)
   - Set `tier_at_submission` to `"order-basic"` or `"order-extended"` (based on `is_upgraded`)
4. If neither subscription nor entitlement → return 403 (existing behavior)

### 2. Entitlement Creation (`qb-portal.ts`)

When an order's status is updated to `"delivered"`:
- Check if the order already has an entitlement row (idempotency)
- If not, create one:
  - `starts_at` = now
  - `expires_at` = now + 30 days
  - Parse the order's `addons` JSON to check if "Post-Conversion Care" (product ID 6) was purchased
  - If yes: `tickets_allowed` = 5, `sla_minutes` = 60, `is_upgraded` = true
  - If no: `tickets_allowed` = 2, `sla_minutes` = 120, `is_upgraded` = false

### 3. New Endpoint: `GET /api/qb/tickets/entitlements`

Returns the authenticated user's current support access state:
```json
{
  "subscription": { ... } | null,
  "orderEntitlements": [
    {
      "id": 1,
      "orderId": 42,
      "serviceName": "Enterprise to Premier Conversion",
      "ticketsAllowed": 2,
      "ticketsUsed": 0,
      "ticketsRemaining": 2,
      "slaMinutes": 120,
      "startsAt": "2026-04-15T14:00:00Z",
      "expiresAt": "2026-05-15T14:00:00Z",
      "isUpgraded": false,
      "isExpired": false
    }
  ]
}
```

This endpoint is called by the portal Support tab to determine what UI to show.

### 4. Ticket List Endpoint Updates

The existing `GET /api/qb/tickets` endpoint should continue to return all tickets for the user, regardless of whether they were created under a subscription or an entitlement. No filtering changes needed.

---

## Frontend Changes

### 1. `portal-settings.tsx` — EnhancedSupportTab

**Current behavior:** If no subscription → show "Subscription Required" amber card with upsell.

**New behavior:**
- On mount, fetch `/api/qb/tickets/entitlements`
- **If active subscription:** show existing subscription UI (unchanged)
- **If no subscription but active entitlement(s):** show "Order Support" card:
  - Badge showing "Order Support" (instead of tier badge)
  - "X of Y tickets remaining" with progress bar
  - "Expires in Z days" countdown
  - Ticket submission form (same form, works the same way)
  - If `is_upgraded`: show "Extended Support" badge instead
  - Below the form: upsell card — "Need more support? Subscribe for ongoing access starting at $25/mo"
- **If no subscription AND no active entitlement (but has expired entitlements):** show message "Your 30-day support window has ended. Subscribe for ongoing support." with link to plans page
- **If no subscription AND no entitlements at all:** show existing "Subscription Required" card (unchanged)
- **If both subscription and active entitlement:** subscription takes priority (better SLA, more tickets). Entitlement effectively dormant but still visible as a note.

### 2. `order-complete.tsx`

Add a section after the order summary card:

> **Support Included**
> Your order includes 2 support tickets within 30 days of file delivery, with a 2-hour response time during business hours. You'll be able to submit tickets from your dashboard once your file is delivered.

If Extended Support addon was in the order:

> **Extended Support Included**
> Your Extended Support package includes 5 support tickets within 30 days of file delivery, with a 1-hour priority response time.

### 3. `home.tsx` — Support Section (lines 378-415)

Add a line above the tier cards:

> Every paid order includes basic support — 2 tickets within 30 days of delivery.

### 4. `subscription.tsx` — Plans Page

Add a note at the top of the plans section:

> Already placed an order? You have basic support included with your purchase. These subscription plans give you ongoing, expanded access beyond the 30-day window.

### 5. `faq.tsx` — New FAQ Entry

Add to the "Support" category:

> **Q: Do I get any support included with my order?**
> A: Yes. Every paid order includes 2 support tickets within 30 days of file delivery, with a 2-hour response time during business hours. If you need more, add Extended Support ($25 launch / $49 regular) to your order for 5 tickets with a 1-hour SLA. For ongoing support beyond 30 days, subscribe to one of our Expert Support plans.

### 6. `landingPages.ts` — Update All 5 Occurrences

Replace vague "at no additional cost" with specific language. For each occurrence:

**Line 67 (Enterprise-to-Premier body):**
> "...and a 30-day post-conversion support window — every order includes 2 support tickets with a 2-hour response SLA at no additional cost. Upgrade to Extended Support for 5 tickets with 1-hour priority SLA."

**Line 103 (Enterprise-to-Premier "How it works" step):**
> "...The 30-day post-conversion support window starts at this point — you can submit up to 2 support tickets at no additional cost."

**Line 512 (AccountEdge migration FAQ):**
> "...and we will help with that test return at no additional cost during the 30-day post-migration support window (2 tickets included with every order)."

**Line 588 (Sage 50 migration "How it works" step):**
> "...We support the cutover with a 30-day post-migration support window — 2 tickets included with every order."

**Line 1336 (NexFortis vs competitor "How it works" step):**
> "...The 30-day post-conversion support window starts at this point — 2 support tickets included at no additional cost."

### 7. `products.json` — Product ID 6

Rename and update:
- `slug`: `"extended-support"` (from `"post-conversion-care"`)
- `name`: `"Extended Support"` (from `"Post-Conversion Care"`)
- `description`: `"Upgrade your included 2-ticket post-order support to 5 tickets with 1-hour priority SLA and broader scope. Covers questions beyond your specific order for 30 days after delivery."`
- `deliverable`: `"5 support tickets with 1-hour SLA for 30 days after delivery"`

### 8. `order-detail.tsx` — "Open Support Ticket" Button

No code change needed — the button already links to `/portal`, which routes to the Support tab. Under the new logic, the Support tab will show the ticket form if the user has an active entitlement.

### 9. `tier-badge.tsx` — New Tier Types

The `TierBadge` component currently only handles `essentials | professional | premium`. Add:
- `"order-basic"` — green badge, label "Order Support"
- `"order-extended"` — teal badge, label "Extended Support"

Update the `TierType` type, `tierStyles`, and `tierLabels` maps.

### 10. `admin-api.ts` — TIER_LABELS and TIER_COLORS

Add the two new tier values to both maps:
- `"order-basic"` → label "Order Support", color green
- `"order-extended"` → label "Extended Support", color teal

This ensures admin ticket list and ticket detail pages display the correct badge for order-based tickets.

### 11. `admin/tickets.tsx` — Tier Filter Dropdown

The admin tickets page has a tier filter dropdown that currently lists "All Tiers", "No Subscription", "Essentials", "Professional", "Premium". Add "Order Support" and "Extended Support" options.

---

## What Does NOT Change

- Subscription tiers, pricing, Stripe integration, and all subscription logic
- The subscription checkout flow
- Admin dashboard pages — tickets and customers pages get minor additions (new tier badge values and filter options) but their core layout and logic are unchanged
- Ticket reply/resolve workflow
- Email templates for ticket created/reply/resolved
- The "standalone" nature of subscriptions (FAQ: "You don't need a conversion to buy support")
- `subscription-config.ts` — all tier configs stay the same
- `ticket-usage.ts` — subscription-only usage tracking stays the same
- NexFortis main site pages (`services.tsx`, `services/quickbooks.tsx`, etc.)

---

## Edge Cases

1. **Customer has both a subscription and an order entitlement:** Subscription takes priority. Entitlement tickets are not consumed.
2. **Customer has multiple delivered orders:** Each order creates its own entitlement. The soonest-expiring active entitlement is used first.
3. **Order is delivered, then status changes back:** Entitlement stays (don't delete it — the support promise was made).
4. **Entitlement expires mid-ticket:** Existing open tickets are not affected. Only new ticket creation is gated.
5. **Extended Support addon purchased without a main service:** Not possible — it's an addon (`is_addon: true`) that can only be added to a service order.
6. **Free promo orders ($0 total):** Still get the entitlement — they placed a legitimate order through the system.

---

## Files Changed Summary

### Backend (6 files)
1. `lib/db/src/schema/qb-portal.ts` — New table + new column on tickets table
2. `lib/db/drizzle/` — New migration file
3. `artifacts/api-server/src/routes/qb-tickets.ts` — Modified ticket creation gate + new entitlements endpoint
4. `artifacts/api-server/src/routes/qb-portal.ts` — Entitlement creation on order delivery
5. `artifacts/api-server/src/lib/business-hours.ts` — May need to export SLA calculation for entitlement SLA (or reuse existing)
6. `artifacts/qb-portal/public/products.json` — Rename product ID 6

### Frontend (10 files)
7. `artifacts/qb-portal/src/pages/portal-settings.tsx` — New entitlement UI in Support tab
8. `artifacts/qb-portal/src/pages/order-complete.tsx` — Support included messaging
9. `artifacts/qb-portal/src/pages/home.tsx` — Basic support mention in support section
10. `artifacts/qb-portal/src/pages/subscription.tsx` — Note about included order support
11. `artifacts/qb-portal/src/pages/faq.tsx` — New FAQ entry
12. `artifacts/qb-portal/src/data/landingPages.ts` — Update 5 content occurrences
13. `artifacts/qb-portal/src/pages/service-detail.tsx` — If product slug changed, may need routing update (verify)
14. `artifacts/qb-portal/src/components/tier-badge.tsx` — Add order-basic and order-extended tier types
15. `artifacts/qb-portal/src/lib/admin-api.ts` — Add new tier labels and colors
16. `artifacts/qb-portal/src/pages/admin/tickets.tsx` — Add new tier filter options
