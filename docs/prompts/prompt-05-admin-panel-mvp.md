# Prompt 05: Admin Panel MVP — Orders, Tickets, Customers

This prompt builds the operator admin panel. It covers the admin API routes, admin layout component, admin page components, and all supporting wiring. Because the old Prompt 03 (Admin Auth Foundation) was entirely replaced by the Supabase Auth migration, the admin layout shell, page shells, and route registration from that old prompt are included here. Authentication, sessions, and file storage are all already handled by Prompts 03, 03B, and 04 — this prompt only builds the operational UI and its backing routes.

## Step 0: Setup

Read these files before making any changes:
1. `replit.md` — project overview, architecture, conventions, and current state of the codebase
2. `docs/prd/qb-portal/feature-operator-admin-panel.md` — the full admin panel PRD (especially Section 5: User Stories, focusing on Dashboard US-01–US-03, Order Management US-04–US-09, Customer Management US-14–US-15, Ticket Management US-16–US-18)
3. `docs/prd/qb-portal/feature-security-auth-storage.md` — security PRD (to understand the `requireOperator` middleware and Supabase Storage signed URL pattern for file downloads and operator uploads)
4. `docs/implementation-plan.md` — understand what Prompts 03, 03B, and 04 have already built
5. `docs/prompts/prompt-05-admin-panel-mvp.md` — this file (complete instructions)

**Do NOT modify any files in `docs/`.**

**PREREQUISITES — the following must already exist and be working from Prompts 03, 03B, and 04:**
- `requireAuth` and `requireOperator` middleware in `artifacts/api-server/src/routes/qb-portal.ts` — these verify Supabase JWTs and enforce AAL2 for operator routes
- `requireOperator` must be the strict version from Prompt 03B — it returns 403 when `aal` is not `aal2`
- The admin layout component at `artifacts/qb-portal/src/components/admin-layout.tsx` — already contains the AAL2 guard from Prompt 03B
- The frontend Supabase client at `artifacts/qb-portal/src/lib/supabase.ts`
- The backend Supabase client (service role) at `artifacts/api-server/src/lib/supabase.ts`
- Supabase Storage `order-files` bucket and signed URL generation from Prompt 04
- The operator account seeded with the Supabase Admin API (from Prompt 03)

If any prerequisites are missing, stop and report what needs to be completed first.

---

**PLATFORM REMINDERS (read replit.md for full details):**
- The API server only handles `/api/*` routes. Static files are served by Replit.
- Do NOT add `express.static()` to the API server.
- Do NOT throw errors for missing env vars — use `console.warn` + `null`.
- Admin routes: middleware chain is ALWAYS `requireAuth → requireOperator → handler`. Never skip `requireAuth`.
- The `supabaseAdmin` export can be `null` (if env vars missing). Always null-check before using.
- Verify Replit Secrets are still present after completing all steps.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Register frontend admin routes under `/admin/*` — they MUST be under `/qb-portal/admin/*`
> - Register API routes under `/api/admin/*` — they MUST be under `/api/qb/admin/*`
> - Create a separate React app or layout for admin — reuse the existing QB Portal app and theme

---

## Step 1: Admin API Routes (Backend)

Create the admin API routes in the Express server. All routes are protected by `requireOperator`, which enforces Supabase JWT validation + operator role + AAL2. No route is accessible without a valid AAL2 operator session.

Routes must be prefixed with `/api/qb/admin/`. Check `replit.md` for whether they go into `qb-portal.ts` or a new router file.

**EXACT middleware chain for every admin route:**
```ts
router.get('/qb/admin/path', requireAuth, requireOperator, handler);
```
`requireAuth` MUST come before `requireOperator`. `requireAuth` validates the JWT; `requireOperator` additionally checks the operator role AND AAL2. Never call `requireOperator` alone.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Use only `requireOperator` without `requireAuth` first
> - Use only `requireAuth` on admin routes — customers pass `requireAuth` too
> - Reuse or recreate auth middleware — use exactly the ones from Prompt 03B

**Edge case — operator hasn't enrolled MFA:** `requireOperator` must return `403` with `{ redirect: '/qb-portal/admin/mfa-enroll' }`. It must NOT crash with 500.

### 1a. Dashboard Stats Route

`GET /api/qb/admin/dashboard`

Returns: `totalOrders`, `pendingOrders`, `processingOrders`, `completedOrders`, `totalCustomers`, `openTickets`, `recentOrders` (5 most recent, joined with customer name/email).

Use `Promise.all` for parallel queries — no N+1. All counts must be `0` (not `null`) when no data exists. `recentOrders` must be `[]` when empty.

### 1b. Orders List Route

`GET /api/qb/admin/orders`

Paginated. Query params: `page` (default 1), `limit` (default 20, max 100), `status` (optional filter), `search` (optional, case-insensitive match on customer name/email), `sort` and `order` for sorting (sorting MUST be implemented now — do not defer).

Response: `{ orders: [...], total: number, page: number, limit: number }`. Each order includes `id`, `status`, `productId`, `productName`, `totalCad`, `createdAt`, customer `name`/`email`, and `hasUploadedFile` boolean.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Return `orders: null` or omit `total` — always return the full shape even when empty
> - Accept `limit > 100` — clamp silently: `Math.min(parseInt(limit) || 20, 100)`

**Edge case — page exceeds total pages:** Return the last page of results, not an empty array or 500. Set `page` in the response to the actual page returned.

**Edge case — no orders:** Return `{ orders: [], total: 0, page: 1, limit: 20 }`.

### 1c. Order Detail Route

`GET /api/qb/admin/orders/:id`

Returns all `qb_orders` fields, the customer profile from `qb_users`, all `qb_order_files` records (or `files: []` if none), and the Stripe payment intent ID if stored.

**Edge case — order not found:** Return `404 { error: 'Order not found' }`. Never return 500 for a missing row.

### 1d. Order Status Update Route

`PATCH /api/qb/admin/orders/:id/status`

Accepts `{ status }`. Any status is valid (no state machine enforcement). Validate against the allowed list; return `400` for invalid values.

**Audit trail required:** Log `[AUDIT] Order {id} status changed from {old} to {new} by operator {userId} at {timestamp}` to application log minimum. Use a DB audit table if the schema supports it.

**The operator CANNOT delete orders.** Do not expose a DELETE endpoint.

Return the updated order record.

**Edge cases:** `404` if order not found. `400` if status is invalid.

### 1e. Tickets List Route

`GET /api/qb/admin/tickets`

Returns all tickets ordered by `created_at` descending. Query params: `status` filter, `search` (subject or customer email). Response includes `id`, `subject`, `status`, `createdAt`, `updatedAt`, customer `name`/`email` — no full message body in the list.

**Edge case — no tickets:** Return `[]`, not an error.

### 1f. Ticket Detail + Reply Route

`GET /api/qb/admin/tickets/:id` — Full ticket including message body and any stored reply.

`PATCH /api/qb/admin/tickets/:id` — Accepts `{ status?, operatorReply?, internalNote? }`. Returns updated ticket. Do NOT send email here — that is Prompt 14.

**Edge case — ticket not found:** Return `404 { error: 'Ticket not found' }`.

### 1g. Customers List Route

`GET /api/qb/admin/customers`

Paginated list of `qb_users` where `role = 'customer'`. Same `page`/`limit` defaults and clamping as 1b. Each record includes `id`, `name`, `email`, `phone`, `createdAt`, `orderCount`, `openTicketCount`. Use a JOIN/subquery — no N+1 per customer.

**Edge cases:** Empty → `{ customers: [], total: 0, page: 1, limit: 20 }`. Page overflow → return last page.

### 1h. Operator File Download (Signed URL)

`GET /api/qb/admin/orders/:orderId/files/:fileId/download`

Verifies the file belongs to the order. Generates a 15-minute Supabase Storage signed URL. Returns `{ signedUrl: "..." }`.

**Do NOT stream file bytes through Express.** The signed URL must point to the Supabase Storage domain.

Null-check `supabaseAdmin` — return `503 { error: 'Storage unavailable' }` if null.

**Edge cases:** `410` if `expired = true`. `404` if file not found or doesn't belong to order.

### 1i. Operator File Upload

`POST /api/qb/admin/orders/:orderId/files/upload`

Multer memory storage (same config as Prompt 04). Uploads to Supabase Storage under `{customer_user_id}/{order_id}/{filename}` — `customer_user_id` is from `qb_orders.user_id`, NOT the operator's ID. Creates a `qb_order_files` record with `expired = false`. Returns the new record.

**Edge case — order not found:** Return `404` before attempting the upload.

**Verify Steps 1a–1i:**
- Run `pnpm typecheck` — zero errors
- `grep -rn "requireOperator" artifacts/api-server/src/routes/qb-portal.ts` — every `/api/qb/admin/*` route must appear; each must also have `requireAuth` before it on the same line
- `curl "...api/qb/admin/orders?page=9999"` — returns last page, not 500
- Upload a file; confirm it appears in Supabase Storage under the **customer's** path, not the operator's

---

## Step 2: Admin Layout Component

The layout at `artifacts/qb-portal/src/components/admin-layout.tsx` (exists from Prompt 03B or create now) wraps all admin pages and provides:

1. **AAL2 guard** (from Prompt 03B — do not duplicate): redirects if not AAL2.
2. **Sidebar navigation** to: Dashboard (`/qb-portal/admin`), Orders (`/qb-portal/admin/orders`), Customers (`/qb-portal/admin/customers`), Tickets (`/qb-portal/admin/tickets`), Sign Out (`supabase.auth.signOut()` → `/qb-portal/login`).
3. **Operator name** in sidebar header from the auth context `user` object.
4. **Active link styling** using `useLocation` and the NexFortis navy/rose-gold palette.
5. **Mobile responsiveness** — collapsible sidebar or hamburger below `md`. All actions must be reachable on 375px viewport.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Create a separate React app, separate `index.html`, or separate Vite config for admin
> - Use `/admin/*` paths — all admin frontend routes are `/qb-portal/admin/*`
> - Duplicate the AAL2 guard — one copy in `admin-layout.tsx` only

**Edge case — API unreachable:** Any page fetch failure must show a visible error banner ("Failed to load data. Please refresh."), not a blank screen.

**Verify:** `pnpm typecheck` — zero errors. Navigate to `/qb-portal/admin` as customer → redirected. As operator → sidebar renders.

---

## Step 3: Admin Page Components

Each page imports `AdminLayout` from Step 2. All navigation links use `/qb-portal/admin/*` paths.

### 3a. Dashboard — `artifacts/qb-portal/src/pages/admin/dashboard.tsx`
Fetches `GET /api/qb/admin/dashboard`. Shows 4 stat cards (2-col mobile / 4-col desktop) and Recent Orders table with "View" links to `/qb-portal/admin/orders/:id`. Skeleton placeholders while loading.

**Empty state:** All cards show `0`; Recent Orders shows "No orders yet." — never an error.

### 3b. Orders Table — `artifacts/qb-portal/src/pages/admin/orders.tsx`
Fetches `GET /api/qb/admin/orders`. Shows search input (300ms debounce), status filter pills, table (Order ID, Customer, Product, Total as `$XX.XX CAD`, Status badge, Date, View link to `/qb-portal/admin/orders/:id`), pagination. Sorting by Date/Status/Total passed as API query params — no client-side-only sort.

**Empty state:** "No orders found." — not an error. Pagination controls must disable/hide at boundaries.

### 3c. Order Detail — `artifacts/qb-portal/src/pages/admin/order-detail.tsx`
Fetches `GET /api/qb/admin/orders/:id`. Shows: order header, customer info, status dropdown + "Save Status" button (updates badge in place on success — no full reload), customer files list with Download buttons, operator upload section.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Redirect to signed URL before the API responds — wait for the response
> - Show a blank files section — show "No files uploaded yet" when empty
> - Add a delete button — orders cannot be deleted

**Edge cases:** `404` → "Order not found" error page. Expired file (`410`) → "Deleted per 7-day retention policy." — no redirect attempt.

### 3d. Customers Table — `artifacts/qb-portal/src/pages/admin/customers.tsx`
Fetches `GET /api/qb/admin/customers`. Table: Name, Email, Phone, Joined Date, Total Orders, Open Tickets. Pagination + search. **Empty state:** "No customers yet."

### 3e. Tickets Table — `artifacts/qb-portal/src/pages/admin/tickets.tsx`
Fetches `GET /api/qb/admin/tickets`. Status filter pills. Table: Subject, Customer, Status badge, Created Date, View link to `/qb-portal/admin/tickets/:id`. **Empty state:** "No tickets yet."

### 3f. Ticket Detail — `artifacts/qb-portal/src/pages/admin/ticket-detail.tsx`
Fetches `GET /api/qb/admin/tickets/:id`. Shows ticket header, read-only message block, reply textarea + "Save Reply" button, status dropdown. If a previous reply exists, show it with timestamp. Do NOT attempt to send email — that is Prompt 14.

**Edge cases:** `404` → "Ticket not found" error page. Empty `operatorReply` in DB → empty textarea (not an error).

**Verify Steps 2–3:** `pnpm typecheck` — zero errors. All empty states render messages, not errors. All "View" links navigate to correct `/qb-portal/admin/*` paths.

---

## Step 4: Register Admin Routes in App.tsx

Update `artifacts/qb-portal/src/App.tsx`:

| Path | Component |
|---|---|
| `/qb-portal/admin` | Dashboard |
| `/qb-portal/admin/orders` | Orders table |
| `/qb-portal/admin/orders/:id` | Order detail |
| `/qb-portal/admin/customers` | Customers table |
| `/qb-portal/admin/tickets` | Tickets table |
| `/qb-portal/admin/tickets/:id` | Ticket detail |

All wrapped in `AdminLayout`. Do not add a second AAL2 guard in App.tsx. The customer-facing `<Header />` must NOT render on any `/qb-portal/admin/*` route.

Add `Disallow: /qb-portal/admin` to `artifacts/qb-portal/public/robots.txt`.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Register routes as `/admin/*` — must be `/qb-portal/admin/*`
> - Render the customer header inside admin routes

**Verify:** `pnpm typecheck` — zero errors. `/qb-portal/admin` as logged-out user → redirected to login. Customer header absent on admin pages.

---

## Step 5: Admin Link in Header

Add an "Admin" link in the customer-facing header, visible only when `isOperator === true` from auth context. Link navigates to `/qb-portal/admin`. Use secondary/muted styling (not primary CTA).

The customer header must not render on `/qb-portal/admin/*` routes — use `useLocation` or conditional rendering in App.tsx.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Guard with `isLoggedIn` instead of `isOperator` — customers must never see the link
> - Render the customer header on admin pages

**Verify:** `pnpm typecheck` — zero errors. Operator on customer page → "Admin" link visible. Customer on any page → link absent. Admin page → customer header absent.

---

## Step 6: Order Status Update — UX Detail

1. Operator changes dropdown → clicks "Save Status."
2. Frontend calls `PATCH /api/qb/admin/orders/:id/status`.
3. On success: update status badge in local state (no full reload). Show success toast: "Status updated to Processing."
4. On error: show error message from API response.
5. Disable the "Save Status" button while request is in flight.

Status display labels: `pending` → "Pending" / `processing` → "Processing" / `completed` → "Completed" / `failed` → "Failed" / `cancelled` → "Cancelled".

---

## Step 7: Operator File Download (Frontend Detail)

1. Operator clicks "Download."
2. Frontend calls `GET /api/qb/admin/orders/:orderId/files/:fileId/download` with `Authorization: Bearer <token>`.
3. On success: redirect browser to `signedUrl`.
4. On `410`: show "This file has been deleted per the 7-day retention policy." — no redirect.
5. On any other error: show error message.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Redirect before the API call resolves
> - Fetch file bytes into a blob — always use the Supabase signed URL directly

---

## Step 8: Update robots.txt

`artifacts/qb-portal/public/robots.txt` must contain:
```
Disallow: /qb-portal/admin
Disallow: /qb-portal/admin/mfa-enroll
Disallow: /qb-portal/admin/mfa-challenge
```
A single `Disallow: /qb-portal/admin` covers subpaths. Keep existing entries.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Add `Disallow: /admin` (missing `/qb-portal` prefix) and consider the job done

---

## Step 9: Verify

Run `pnpm typecheck` from the monorepo root. Fix all TypeScript errors before manual testing.

**Security grep (run before manual tests):**
```bash
grep -rn "requireOperator" artifacts/api-server/src/routes/qb-portal.ts
# Every /api/qb/admin/* route must appear
grep -rn "requireAuth" artifacts/api-server/src/routes/qb-portal.ts
# Every requireOperator line must also have requireAuth before it
grep -rn "isOperator" artifacts/qb-portal/src/components/
# Admin link visibility condition must appear here
```

**Test 1 — Dashboard:** Log in as operator → MFA challenge → `/qb-portal/admin`. Stat cards show real counts. With empty DB: all `0`, Recent Orders shows empty-state message.

**Test 2 — Orders list + detail:** `/qb-portal/admin/orders` shows paginated list. Search filters work. "View" → detail page loads. Status change → badge updates in place, success toast shown. Confirm no delete button.

**Test 3 — File download:** Click "Download" on a customer-uploaded file → browser redirects to Supabase Storage signed URL. URL contains Supabase domain, not localhost.

**Test 4 — File upload:** Upload a processed file → success. Supabase Storage shows file under `{customer_user_id}/{order_id}/` — NOT the operator's path.

**Test 5 — Tickets:** `/qb-portal/admin/tickets` list loads. View ticket → message shown. Save reply → success feedback. Reply stored in DB.

**Test 6 — Customers:** `/qb-portal/admin/customers` list shows `orderCount` and `openTicketCount`. Search works.

**Test 7 — Security:** Customer token → `GET /api/qb/admin/orders` returns `403`. Customer navigates to `/qb-portal/admin` → redirected.

**Test 8 — Admin header link:** Operator on catalog page → "Admin" link visible. Customer → not visible.

**Test 9 — Empty states:** All list pages with no data show empty-state messages, not errors.

**Final check:** Verify all Replit Secrets (Supabase URL, anon key, service role key) are still present.

---

## Constraints

- Do NOT modify any files in `docs/`.
- Do NOT modify `artifacts/qb-portal/public/products.json`.
- Do NOT implement subscription billing, Stripe subscriptions — Prompt 06.
- Do NOT implement the promo code system — Prompt 09/10.
- Do NOT implement SLA timers, ticket priority routing, or ticket email notifications — Prompt 08.
- Do NOT implement product/pricing management — products are static JSON at this stage.
- Do NOT implement a Stripe refund action — later prompt.
- Do NOT implement a delete action for orders — operators may only update status.
- Admin MVP scope is exactly: dashboard, orders, customers, tickets. Do not build additional sections.
- All admin routes use Supabase Auth operator verification from Prompts 03 and 03B. Do NOT introduce any new auth mechanism.
- Frontend admin routes are under `/qb-portal/admin/*`. API admin routes are under `/api/qb/admin/*`. No exceptions.
- List endpoints (orders, tickets, customers) MUST support pagination, sorting, and filtering from the start — do not defer.
