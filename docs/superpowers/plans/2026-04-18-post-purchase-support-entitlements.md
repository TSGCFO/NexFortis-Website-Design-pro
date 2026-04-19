# Post-Purchase Support Entitlements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every paid-order customer 2 free support tickets within 30 days of delivery, upgrade the "Post-Conversion Care" addon to "Extended Support" (5 tickets, 1hr SLA), and fix all landing page content that makes vague support promises.

**Architecture:** New `qb_order_support_entitlements` table tracks per-order ticket budgets. The ticket creation endpoint checks for entitlements as a fallback when no subscription exists. A new `/api/qb/tickets/entitlements` endpoint feeds the frontend. Frontend Support tab shows entitlement-aware UI. Content changes across 5+ pages make support promises specific and accurate.

**Tech Stack:** Drizzle ORM, PostgreSQL, Express.js, React (Wouter routing), TypeScript

**Spec:** `docs/superpowers/specs/2026-04-18-post-purchase-support-entitlements-design.md`

---

## Prompt Routing Summary

| Prompt | Target | Can Parallel With | Description |
|--------|--------|-------------------|-------------|
| 1 | Cursor | — | DB schema + migration + products.json rename |
| 2 | Cursor | Prompt 3, 4, 5 | Backend: ticket gate + entitlements endpoint + order delivery hook |
| 3 | Cursor | Prompt 2, 4, 5 | Frontend: portal Support tab entitlement UI |
| 4 | Cursor | Prompt 2, 3, 5 | Content: landing pages, FAQ, home, subscription, order-complete |
| 5 | Cursor | Prompt 2, 3, 4 | Admin: tier badge, admin-api labels, admin tickets filter |

**Prompt 1 must complete first** (creates the DB table that Prompts 2 and 3 depend on).
**Prompts 2–5 can all run in parallel** after Prompt 1 is done.

---

## Prompt 1 — DB Schema & Migration & Product Rename

**Target: Cursor**
**Must complete before Prompts 2–5**

### Task 1.1: Add the new table and column to the Drizzle schema

**Files:**
- Modify: `lib/db/src/schema/qb-portal.ts`

- [ ] **Step 1: Add the `qbOrderSupportEntitlements` table definition**

After the existing `qbTicketUsage` table, add a new table `qb_order_support_entitlements` with these columns:
- `id`: serial primary key
- `orderId`: integer, FK to `qbOrders.id`, unique (one entitlement per order)
- `userId`: uuid, FK to `qbUsers.id`, not null
- `ticketsAllowed`: integer, not null, default 2
- `ticketsUsed`: integer, not null, default 0
- `slaMinutes`: integer, not null, default 120
- `startsAt`: timestamp with timezone, not null
- `expiresAt`: timestamp with timezone, not null
- `isUpgraded`: boolean, not null, default false
- `createdAt`: timestamp with timezone, default now(), not null
- `updatedAt`: timestamp with timezone, default now(), not null

Follow the exact same patterns used by the existing tables (pgTable, column helpers, etc.). Look at `qbTicketUsage` and `qbSubscriptions` as reference for how FKs and defaults are done.

- [ ] **Step 2: Add `entitlementId` column to `qbSupportTickets`**

Add a nullable integer column `entitlement_id` to the existing `qbSupportTickets` table definition. It should reference `qbOrderSupportEntitlements.id`. This is nullable because subscription-based tickets won't have it set.

- [ ] **Step 3: Export the new table from the schema index**

Make sure `qbOrderSupportEntitlements` is exported from `lib/db/src/schema/index.ts` alongside the other qb-portal tables.

- [ ] **Step 4: Generate the Drizzle migration**

Run the project's migration generation command. The migration should create the new table and add the new column to `qb_support_tickets`. Check the generated SQL to make sure it has:
- CREATE TABLE for `qb_order_support_entitlements` with all columns and constraints
- ALTER TABLE `qb_support_tickets` ADD COLUMN `entitlement_id`
- The unique constraint on `order_id`
- The FK constraints

- [ ] **Step 5: Commit**

```bash
git add lib/db/src/schema/qb-portal.ts lib/db/src/schema/index.ts lib/db/drizzle/
git commit -m "feat: add qb_order_support_entitlements table and entitlement_id column on tickets"
```

### Task 1.2: Rename Product ID 6 in products.json

**Files:**
- Modify: `artifacts/qb-portal/public/products.json`

- [ ] **Step 1: Update product ID 6**

Find the product with `"id": 6` and update these fields:
- `"slug"`: change from `"post-conversion-care"` to `"extended-support"`
- `"name"`: change from `"Post-Conversion Care"` to `"Extended Support"`
- `"description"`: change to `"Upgrade your included 2-ticket post-order support to 5 tickets with 1-hour priority SLA and broader scope. Covers questions beyond your specific order for 30 days after delivery."`
- `"deliverable"`: change to `"5 support tickets with 1-hour SLA for 30 days after delivery"`

Do NOT change `id`, `base_price_cad`, `launch_price_cad`, `category`, `category_slug`, `is_addon`, `badge`, `turnaround`, `sort_order`, or any other field.

- [ ] **Step 2: Commit**

```bash
git add artifacts/qb-portal/public/products.json
git commit -m "feat: rename Post-Conversion Care to Extended Support (product ID 6)"
```

---

## Prompt 2 — Backend: Ticket Gate, Entitlements Endpoint, Order Delivery Hook

**Target: Cursor**
**Depends on: Prompt 1 (schema must exist)**
**Can run in parallel with: Prompts 3, 4, 5**

### Task 2.1: Add `getActiveOrderEntitlement` function to qb-tickets.ts

**Files:**
- Modify: `artifacts/api-server/src/routes/qb-tickets.ts`

- [ ] **Step 1: Import the new table**

At the top of the file, add the `qbOrderSupportEntitlements` import from `@workspace/db/schema` alongside the existing schema imports.

- [ ] **Step 2: Create the `getActiveOrderEntitlement` function**

Right after the existing `getActiveSubscription` function, add a new async function `getActiveOrderEntitlement(userId: string)` that:
- Queries `qb_order_support_entitlements` where `user_id = userId`
- Filters to rows where `expires_at > now()` (not expired)
- Filters to rows where `tickets_used < tickets_allowed` (still has remaining tickets)
- Orders by `expires_at ASC` (use the soonest-expiring one first)
- Returns the first qualifying row, or null

Use the same Drizzle query patterns as `getActiveSubscription`. Use `gt()`, `lt()`, and `sql` template literal for the `now()` comparison.

- [ ] **Step 3: Modify the POST `/` ticket creation handler**

In the existing `router.post("/", ...)` handler, after the line where `getActiveSubscription(userId)` returns null and before the 403 response:

1. Call `getActiveOrderEntitlement(userId)`
2. If an entitlement is found, proceed with ticket creation using the entitlement instead of a subscription:
   - Set `subscriptionId` to null on the created ticket
   - Set `entitlementId` to the entitlement's `id`
   - Set `tierAtSubmission` to `"order-extended"` if `entitlement.isUpgraded` is true, otherwise `"order-basic"`
   - Calculate SLA deadline using the entitlement's `slaMinutes` value (use the existing `calculateSlaDeadline` function from business-hours.ts — it already accepts a `slaMinutes` parameter)
   - Instead of the subscription-based ticket usage tracking, atomically increment `tickets_used` on the entitlement row (use `sql` template for atomic increment, in the same transaction)
   - Skip the `qb_ticket_usage` table entirely (that's subscription-only)
3. If neither subscription nor entitlement found, return the existing 403 response

The key structural change: the current code has a single path (subscription → create ticket). The new code has two paths: subscription path (unchanged) and entitlement path (new, simpler — no period tracking, just increment `tickets_used`).

- [ ] **Step 4: Commit**

```bash
git add artifacts/api-server/src/routes/qb-tickets.ts
git commit -m "feat: ticket creation gate accepts order entitlements as fallback"
```

### Task 2.2: Add GET /api/qb/tickets/entitlements endpoint

**Files:**
- Modify: `artifacts/api-server/src/routes/qb-tickets.ts`

- [ ] **Step 1: Add the entitlements endpoint**

Add a new `router.get("/entitlements", ...)` route that:
1. Gets the authenticated user's ID from `req.userId`
2. Fetches their active subscription (reuse `getActiveSubscription`)
3. Fetches ALL their order entitlements (not just active ones) by querying `qb_order_support_entitlements` where `user_id = userId`, ordered by `expires_at DESC`
4. For each entitlement, also look up the order's `serviceName` from `qb_orders` by joining on `order_id`
5. Returns a JSON response shaped like:

```json
{
  "subscription": { "tier": "...", "ticketsUsed": ..., "ticketLimit": ..., "ticketsRemaining": ..., "slaMinutes": ... } | null,
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
      "isExpired": false,
      "isActive": true
    }
  ]
}
```

Where `isExpired` is computed as `expiresAt < now()`, `isActive` is `!isExpired && ticketsUsed < ticketsAllowed`, and `ticketsRemaining` is `ticketsAllowed - ticketsUsed`.

For the subscription portion, reuse the existing logic from the `GET /api/qb/subscriptions/me` endpoint pattern — look at how `qb-subscriptions.ts` returns subscription info and mirror the same shape.

- [ ] **Step 2: Commit**

```bash
git add artifacts/api-server/src/routes/qb-tickets.ts
git commit -m "feat: add GET /entitlements endpoint for support access state"
```

### Task 2.3: Auto-create entitlement on order delivery

**Files:**
- Modify: `artifacts/api-server/src/routes/qb-portal.ts`

- [ ] **Step 1: Import the new table**

Add `qbOrderSupportEntitlements` to the imports from `@workspace/db/schema`.

- [ ] **Step 2: Find the order status update handler**

Look for the route that updates an order's status (it should be in the admin routes — check `qb-admin.ts` as well). The handler that sets an order's status to "delivered" is where we hook in.

Actually, check both `qb-portal.ts` and `qb-admin.ts` — the admin route is more likely where operators change order status to "delivered". Find the PATCH or PUT endpoint that updates order status.

- [ ] **Step 3: Add entitlement creation logic**

After the order status is successfully updated to `"delivered"`, add logic that:
1. Checks if an entitlement row already exists for this order ID (idempotency — use `SELECT` with `WHERE order_id = orderId`)
2. If it already exists, skip (don't create a duplicate)
3. If it doesn't exist:
   a. Look up the order's `addons` column and parse the JSON
   b. Check if "Post-Conversion Care" or "Extended Support" is in the addons list (check for both names since we're renaming — the `addons` column stores addon names as a JSON string array)
   c. If the Extended Support addon is present: `ticketsAllowed = 5`, `slaMinutes = 60`, `isUpgraded = true`
   d. Otherwise: `ticketsAllowed = 2`, `slaMinutes = 120`, `isUpgraded = false`
   e. Set `startsAt` to current timestamp
   f. Set `expiresAt` to current timestamp + 30 days
   g. Set `userId` from the order's `userId`
   h. Insert the row into `qb_order_support_entitlements`
4. Log the creation: `console.log("[Orders] Created support entitlement for order", orderId, { ticketsAllowed, slaMinutes, isUpgraded })`

Important: this logic should ONLY run when the new status is "delivered". Not for any other status change.

- [ ] **Step 4: Commit**

```bash
git add artifacts/api-server/src/routes/qb-portal.ts artifacts/api-server/src/routes/qb-admin.ts
git commit -m "feat: auto-create support entitlement when order status changes to delivered"
```

---

## Prompt 3 — Frontend: Portal Support Tab Entitlement UI

**Target: Cursor**
**Depends on: Prompt 1 (schema must exist for types)**
**Can run in parallel with: Prompts 2, 4, 5**

### Task 3.1: Update the EnhancedSupportTab in portal-settings.tsx

**Files:**
- Modify: `artifacts/qb-portal/src/pages/portal-settings.tsx`

- [ ] **Step 1: Add entitlements fetch**

In the `EnhancedSupportTab` component, add a new state variable for order entitlements and a fetch function that calls `GET /api/qb/tickets/entitlements`. This should be called on mount alongside the existing ticket fetch.

Create a helper function `entitlementApiUrl(path)` following the same pattern as the existing `ticketApiUrl(path)` — it should point to `/api/qb/tickets/entitlements`.

The response shape is:
```typescript
interface OrderEntitlement {
  id: number;
  orderId: number;
  serviceName: string;
  ticketsAllowed: number;
  ticketsUsed: number;
  ticketsRemaining: number;
  slaMinutes: number;
  startsAt: string;
  expiresAt: string;
  isUpgraded: boolean;
  isExpired: boolean;
  isActive: boolean;
}

interface EntitlementsResponse {
  subscription: SubscriptionInfo | null;
  orderEntitlements: OrderEntitlement[];
}
```

- [ ] **Step 2: Modify the UI rendering logic**

Currently the component checks `hasSub` (has subscription) and shows either the subscription UI or the "Subscription Required" amber card.

Change the rendering logic to handle four states:

**State 1 — Has active subscription:** Show the existing subscription UI completely unchanged. (Don't touch this code path at all.)

**State 2 — No subscription, but has active entitlement(s):** Show a new "Order Support" card with:
- A green badge showing "Order Support" (or "Extended Support" if `isUpgraded`)
- The service name from the entitlement (e.g., "Enterprise to Premier Conversion — Order #42")
- "X of Y tickets remaining" text with a progress bar (reuse the existing progress bar component)
- "Expires in Z days" countdown (calculate from `expiresAt`)
- The ticket submission form (exact same form that subscription users see — subject, message, critical toggle, file attachment)
- Below the form: a subtle upsell card — "Need ongoing support? Subscribe starting at $25/mo" with a link to `/subscription`
- If the user has MULTIPLE active entitlements, show the one being used (soonest expiring) and note "You have X other active support entitlements" below

**State 3 — No subscription, no active entitlements, but has expired entitlements:** Show a card saying "Your 30-day support window has ended" with a CTA to view subscription plans. Use a similar style to the existing amber "Subscription Required" card but with different wording.

**State 4 — No subscription, no entitlements at all:** Show the existing "Subscription Required" amber card, completely unchanged.

For the ticket submission: the existing `handleSubmitTicket` function calls `POST /api/qb/tickets`. That endpoint will now handle entitlement-based tickets on the backend (from Prompt 2). The frontend doesn't need to send any special flag — the backend figures out whether to use subscription or entitlement. So the form submission code stays the same.

- [ ] **Step 3: Match existing visual style**

The new entitlement UI cards should use the exact same Card, CardContent, Button, and color classes used by the existing subscription UI. Keep the same font-display headings, text-muted-foreground descriptions, and spacing patterns. Use the site's existing green colors for the "Order Support" badge (similar approach to how the existing TierBadge works — the tier-badge.tsx component will be updated in Prompt 5, but here you can just use inline styled badges matching the site's design system).

- [ ] **Step 4: Commit**

```bash
git add artifacts/qb-portal/src/pages/portal-settings.tsx
git commit -m "feat: support tab shows order entitlement UI for non-subscribers"
```

---

## Prompt 4 — Content Updates: Landing Pages, FAQ, Home, Subscription, Order Complete

**Target: Cursor**
**Depends on: Prompt 1 (product rename must be done)**
**Can run in parallel with: Prompts 2, 3, 5**

### Task 4.1: Update landingPages.ts — 5 content changes

**Files:**
- Modify: `artifacts/qb-portal/src/data/landingPages.ts`

- [ ] **Step 1: Update line ~67 (Enterprise-to-Premier body paragraph)**

Find the paragraph that ends with: `"...and a 30-day post-conversion support window during which any unexpected behavior is investigated at no additional cost. Most customers go from upload to fully restored Premier file in less than 24 hours."`

Replace the support window sentence with: `"...and a 30-day post-conversion support window — every order includes 2 support tickets with a 2-hour response SLA at no additional cost, with the option to upgrade to Extended Support for 5 tickets with 1-hour priority SLA. Most customers go from upload to fully restored Premier file in less than 24 hours."`

- [ ] **Step 2: Update line ~103 (Enterprise-to-Premier "How it works" step)**

Find the step body that says: `"We email you a signed download link. Open the .QBM in Premier or Pro, restore, and confirm the new file is ready for use. The 30-day post-conversion support window starts at this point."`

Change the last sentence to: `"The 30-day post-conversion support window starts at this point — you can submit up to 2 support tickets at no additional cost."`

- [ ] **Step 3: Update line ~512 (AccountEdge migration FAQ)**

Find the FAQ answer containing: `"...and we will help with that test return at no additional cost during the 30-day post-migration support window..."`

Change to: `"...and we will help with that test return at no additional cost during the 30-day post-migration support window (2 tickets included with every order)..."`

- [ ] **Step 4: Update line ~588 (Sage 50 migration "How it works" step)**

Find the step body containing: `"...We support the cutover with a 30-day post-migration support window."`

Change to: `"...We support the cutover with a 30-day post-migration support window — 2 tickets included with every order."`

- [ ] **Step 5: Update line ~1336 (NexFortis vs competitor "How it works" step)**

Find the step body containing: `"...The 30-day post-conversion support window starts at this point."`

Change to: `"The 30-day post-conversion support window starts at this point — 2 support tickets included at no additional cost."`

- [ ] **Step 6: Commit**

```bash
git add artifacts/qb-portal/src/data/landingPages.ts
git commit -m "content: make 30-day support promises specific (2 tickets, 2hr SLA)"
```

### Task 4.2: Add new FAQ entry

**Files:**
- Modify: `artifacts/qb-portal/src/pages/faq.tsx`

- [ ] **Step 1: Add the new FAQ item**

Find the `faqData` array. Insert a new entry in the "Support" category, right before the existing "What is QB Expert Support?" question (so it appears first in the Support section). The new entry:

```
{ cat: "Support", q: "Do I get any support included with my order?", a: "Yes. Every paid order includes 2 support tickets within 30 days of file delivery, with a 2-hour response time during business hours. If you need more, add Extended Support ($25 launch / $49 regular) to your order for 5 tickets with a 1-hour SLA. For ongoing support beyond 30 days, subscribe to one of our Expert Support plans." }
```

- [ ] **Step 2: Commit**

```bash
git add artifacts/qb-portal/src/pages/faq.tsx
git commit -m "content: add FAQ about included post-order support"
```

### Task 4.3: Add support mention to home.tsx

**Files:**
- Modify: `artifacts/qb-portal/src/pages/home.tsx`

- [ ] **Step 1: Add line above support tier cards**

Find the "Need Expert QuickBooks Support?" section (around line 378). Between the subtitle paragraph and the tier cards grid, add a new line of text:

`"Every paid order includes basic support — 2 tickets within 30 days of delivery."`

Style it as a small, muted text element (use `text-sm text-muted-foreground`) centered below the subtitle, with a bottom margin before the tier cards. It should feel like an informational note, not a heading.

- [ ] **Step 2: Commit**

```bash
git add artifacts/qb-portal/src/pages/home.tsx
git commit -m "content: mention included order support on home page"
```

### Task 4.4: Add note to subscription.tsx plans page

**Files:**
- Modify: `artifacts/qb-portal/src/pages/subscription.tsx`

- [ ] **Step 1: Add informational note at top of plans section**

Find the area right above the plan cards (after the "Choose Your Support Plan" heading and the subtitle). Add a small info banner:

`"Already placed an order? You have basic support included with your purchase. These subscription plans give you ongoing, expanded access beyond the 30-day window."`

Style it as a subtle info note — use a light blue/info-toned background card or just muted text. Don't make it too prominent since this page's purpose is selling subscriptions. A simple `text-sm text-muted-foreground text-center mb-6` paragraph would work.

- [ ] **Step 2: Commit**

```bash
git add artifacts/qb-portal/src/pages/subscription.tsx
git commit -m "content: add order support note on subscription plans page"
```

### Task 4.5: Update serviceLandingLinks.ts for slug rename

**Files:**
- Modify: `artifacts/qb-portal/src/data/serviceLandingLinks.ts`

- [ ] **Step 1: Update the slug key**

Find the entry with key `"post-conversion-care"` (around line 29). Change the key to `"extended-support"` to match the new product slug in products.json. Keep the array of landing page links the same — they still make sense for this addon.

- [ ] **Step 2: Commit**

```bash
git add artifacts/qb-portal/src/data/serviceLandingLinks.ts
git commit -m "content: update serviceLandingLinks slug from post-conversion-care to extended-support"
```

### Task 4.6: Add support messaging to order-complete.tsx

**Files:**
- Modify: `artifacts/qb-portal/src/pages/order-complete.tsx`

- [ ] **Step 1: Accept addon names in props and add support messaging**

The component already receives `addonNames: string[]` as a prop. After the existing order summary `<div>` (the one with service, addons, total, file), add a new card or section.

Check if "Extended Support" (or "Post-Conversion Care" for backwards compat) is in the `addonNames` array.

If Extended Support IS in the addons:
> Show a card with a shield/check icon: "Extended Support Included — Your order includes 5 support tickets within 30 days of file delivery, with a 1-hour priority response time. Submit tickets from your dashboard once your file is delivered."

If Extended Support is NOT in the addons (standard order):
> Show a card with an info icon: "Support Included — Your order includes 2 support tickets within 30 days of file delivery, with a 2-hour response time during business hours. Submit tickets from your dashboard once your file is delivered."

Use the site's existing Card component and match the visual style of the surrounding elements. Use lucide-react icons (Shield or CheckCircle for extended, Info or HelpCircle for basic).

- [ ] **Step 2: Commit**

```bash
git add artifacts/qb-portal/src/pages/order-complete.tsx
git commit -m "content: show included support details on order completion page"
```

### Task 4.7: Verify no other hardcoded slug references

- [ ] **Step 1: Search for remaining "post-conversion-care" references**

Run a project-wide search for the string `post-conversion-care` in all source files (excluding `node_modules` and `products.json` which was already updated in Prompt 1). If any are found, update them to `extended-support`.

- [ ] **Step 2: Commit any additional changes (if found)**

---

## Prompt 5 — Admin UI: Tier Badge, Labels, Filters

**Target: Cursor**
**Can run in parallel with: Prompts 2, 3, 4**

### Task 5.1: Update TierBadge component

**Files:**
- Modify: `artifacts/qb-portal/src/components/tier-badge.tsx`

- [ ] **Step 1: Expand the TierType and add new tier styles/labels**

Update the `TierType` type to include the new values: `"order-basic" | "order-extended"`

Add to `tierStyles`:
- `"order-basic"`: green-toned badge — `"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"`
- `"order-extended"`: teal-toned badge — `"bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800"`

Add to `tierLabels`:
- `"order-basic"`: `"Order Support"`
- `"order-extended"`: `"Extended Support"`

- [ ] **Step 2: Commit**

```bash
git add artifacts/qb-portal/src/components/tier-badge.tsx
git commit -m "feat: add order-basic and order-extended tier types to TierBadge"
```

### Task 5.2: Update admin-api.ts labels and colors

**Files:**
- Modify: `artifacts/qb-portal/src/lib/admin-api.ts`

- [ ] **Step 1: Add new entries to TIER_LABELS and TIER_COLORS**

Add to `TIER_LABELS`:
- `"order-basic"`: `"Order Support"`
- `"order-extended"`: `"Extended Support"`

Add to `TIER_COLORS`:
- `"order-basic"`: `"bg-green-100 text-green-700"`
- `"order-extended"`: `"bg-teal-100 text-teal-700"`

- [ ] **Step 2: Commit**

```bash
git add artifacts/qb-portal/src/lib/admin-api.ts
git commit -m "feat: add order tier labels and colors for admin UI"
```

### Task 5.3: Update admin tickets page tier filter

**Files:**
- Modify: `artifacts/qb-portal/src/pages/admin/tickets.tsx`

- [ ] **Step 1: Add new tier options to the filter dropdown**

Find the tier filter dropdown (the `<select>` or similar component that lets admins filter tickets by tier). It currently has options for "All Tiers", "No Subscription", "Essentials", "Professional", "Premium".

Add two new options after "No Subscription" and before "Essentials":
- Value `"order-basic"`, label `"Order Support"`
- Value `"order-extended"`, label `"Extended Support"`

These should work with the existing filtering logic since the backend returns `tierAtSubmission` on each ticket and the frontend filters by matching that value.

- [ ] **Step 2: Commit**

```bash
git add artifacts/qb-portal/src/pages/admin/tickets.tsx
git commit -m "feat: add order tier filter options to admin tickets page"
```

---

## Execution Order Summary

```
Prompt 1 (DB + products.json)  ──────────> MUST COMPLETE FIRST
     │
     ├── Prompt 2 (Backend logic)  ─────┐
     ├── Prompt 3 (Portal Support UI)  ─┤  ALL RUN IN PARALLEL
     ├── Prompt 4 (Content updates)  ───┤
     └── Prompt 5 (Admin UI updates)  ──┘
```

After all 5 prompts complete, run the Drizzle migration against the dev database and test the full flow end-to-end.
