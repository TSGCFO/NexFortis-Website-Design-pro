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

## Step 1: Admin API Routes (Backend)

Create the admin API routes in the Express server. All routes in this step are protected by the `requireOperator` middleware, which enforces Supabase JWT validation + operator role check + AAL2 assurance level. No route in this section is accessible without a valid AAL2 operator session.

These routes should be prefixed with `/api/qb/admin/` to make the pattern clear. Check `replit.md` for the exact router setup — the routes may go into the existing `qb-portal.ts` file or a new router file. Use whichever pattern fits the existing architecture.

### 1a. Dashboard Stats Route

`GET /api/qb/admin/dashboard`

Returns a JSON object with these stats:
- `totalOrders` — total count of all `qb_orders` records
- `pendingOrders` — count of orders with status `'pending'`
- `processingOrders` — count of orders with status `'processing'`
- `completedOrders` — count of orders with status `'completed'`
- `totalCustomers` — count of all `qb_users` records where `role = 'customer'`
- `openTickets` — count of `qb_support_tickets` with status `'open'`
- `recentOrders` — the 5 most recent orders, ordered by `created_at` descending, joined with customer name and email from `qb_users`

All counts should be computed in a single efficient database query or a minimal set of parallel queries. Do not make N+1 queries.

### 1b. Orders List Route

`GET /api/qb/admin/orders`

Returns a paginated list of all orders. Query parameters:
- `page` (integer, default 1) — the page number
- `limit` (integer, default 20, max 100) — orders per page
- `status` (string, optional) — filter by order status (`'pending'`, `'processing'`, `'completed'`, `'failed'`, `'cancelled'`)
- `search` (string, optional) — filter by customer name or email (case-insensitive partial match)

Each order in the response should include: `id`, `status`, `productId`, `productName` (joined from the products data or stored in the order), `totalCad`, `createdAt`, and the customer's `name` and `email` from `qb_users`. Also include a boolean `hasUploadedFile` indicating whether any `qb_order_files` record exists for the order.

Return the response as `{ orders: [...], total: number, page: number, limit: number }`.

### 1c. Order Detail Route

`GET /api/qb/admin/orders/:id`

Returns the full detail of a single order, including:
- All order fields from `qb_orders`
- The customer's profile from `qb_users` (name, email, phone, createdAt)
- All associated `qb_order_files` records (including `storage_path`, `expired`, `created_at`, and `original_filename` if stored)
- The payment status (if Stripe payment intent ID is stored, include it so the operator can reference it)

### 1d. Order Status Update Route

`PATCH /api/qb/admin/orders/:id/status`

Updates the status of an order. Accepts a JSON body with `status` (the new status string). Valid transitions: any status can be set by the operator — do not enforce a state machine on this endpoint. The operator may need to manually set any status to handle edge cases.

After updating, return the updated order record. Log the status change with the operator's user ID and a timestamp (you can do this in the application log, or add an internal notes field if the schema supports it).

### 1e. Tickets List Route

`GET /api/qb/admin/tickets`

Returns all support tickets, ordered by creation date descending (newest first). Query parameters:
- `status` (optional) — filter by `'open'`, `'in_progress'`, `'resolved'`, `'closed'`
- `search` (optional) — partial match on ticket subject or customer email

Each ticket in the response should include: `id`, `subject`, `status`, `createdAt`, `updatedAt`, and the customer's `name` and `email` from `qb_users`. Do not include the full message body in the list — only the subject.

### 1f. Ticket Detail + Reply Route

`GET /api/qb/admin/tickets/:id` — Returns the full ticket including the original message body and any stored reply.

`PATCH /api/qb/admin/tickets/:id` — Updates the ticket. Accepts a JSON body with any combination of:
- `status` — new status for the ticket
- `operatorReply` — the operator's reply text (plain text; HTML sanitization should already be applied)
- `internalNote` — an optional internal note not shown to the customer (if the schema supports it)

After saving the reply, return the updated ticket record. Email notification to the customer is out of scope for this prompt — that is Prompt 14 (Transactional Emails). Store the reply text in the database but do not send an email here.

### 1g. Customers List Route

`GET /api/qb/admin/customers`

Returns a paginated list of all `qb_users` records where `role = 'customer'`. Query parameters:
- `page` and `limit` for pagination (same defaults as orders)
- `search` — partial match on name or email

Each customer record should include: `id`, `name`, `email`, `phone`, `createdAt`, a count of their `qb_orders`, and a count of their open `qb_support_tickets`.

### 1h. Operator File Download (Signed URL)

`GET /api/qb/admin/orders/:orderId/files/:fileId/download`

Protected by `requireOperator`. Generates a Supabase Storage signed URL for the specified file with a 15-minute expiry. Returns `{ signedUrl: "..." }`.

Verify that the file belongs to the order specified in the route (simple join check). If the file is expired (`expired = true`), return 410.

### 1i. Operator File Upload (Processed File Back to Customer)

`POST /api/qb/admin/orders/:orderId/files/upload`

Protected by `requireOperator`. Accepts a multipart form upload with a single file field. The operator uses this to upload the processed conversion output (e.g., the converted file, a health report) back against the customer's order record.

Use multer with memory storage (same configuration as Prompt 04). Upload the file to Supabase Storage under the customer's path: `{customer_user_id}/{order_id}/{filename}`. The `customer_user_id` is the `user_id` from the `qb_orders` record (not the operator's ID).

Create a new `qb_order_files` record for the uploaded file. Set `expired = false` and `storage_path` to the Supabase Storage path.

Return the new file record as JSON.

---

## Step 2: Admin Layout Component

The admin layout component should already exist at `artifacts/qb-portal/src/components/admin-layout.tsx` from Prompt 03B (it contains the AAL2 guard). If it does not exist yet, create it now.

The layout component wraps all admin pages and provides:

1. **The AAL2 guard** (from Prompt 03B — ensure it's already present; do not duplicate it): checks the operator's assurance level on every render and redirects if not AAL2.

2. **A sidebar navigation** with links to:
   - Dashboard (`/admin`) — icon: a grid or home icon
   - Orders (`/admin/orders`) — icon: a clipboard or list icon
   - Customers (`/admin/customers`) — icon: a users/people icon
   - Tickets (`/admin/tickets`) — icon: a message/chat icon
   - A "Sign Out" action at the bottom of the sidebar — calls `supabase.auth.signOut()` and redirects to `/login`

3. **The current user's name** displayed somewhere in the sidebar header (e.g., "Hassan Sadiq" above the navigation links). Read this from the auth context's `user` object.

4. **Active link styling** — highlight the current route's link in the sidebar using the NexFortis navy/rose-gold palette. Use the React Router `useLocation` hook to detect the active route.

5. **Mobile responsiveness** — on small screens (below `md` breakpoint), the sidebar should be collapsible or replaced with a top navigation bar / hamburger menu. All critical admin actions must be completable on a 375px viewport per the PRD.

The main content area renders the page's `children` prop next to (or below, on mobile) the sidebar.

---

## Step 3: Admin Page Components

Create the admin page components. Each page imports and uses the admin layout from Step 2.

### 3a. Dashboard Page

**File:** `artifacts/qb-portal/src/pages/admin/dashboard.tsx`

Fetches data from `GET /api/qb/admin/dashboard` on mount. Displays:

1. **Stat cards row** — four cards in a responsive grid (2 columns on mobile, 4 on desktop):
   - "Pending Orders" — count with a clock or hourglass icon
   - "Processing Orders" — count with a spinner icon
   - "Open Tickets" — count with a message icon
   - "Total Customers" — count with a users icon
   Use the NexFortis navy and rose-gold palette for card headers or icon colors.

2. **Recent Orders table** — shows the 5 most recent orders from the `recentOrders` field in the dashboard response. Columns: Order ID (truncated), Customer Name, Status badge, and a "View" link to the order detail page. Status badges should be color-coded: pending = amber, processing = blue, completed = green, failed/cancelled = red.

3. **Loading state** — show skeleton placeholders while the data loads. Do not show a blank page or an empty table.

### 3b. Orders Table Page

**File:** `artifacts/qb-portal/src/pages/admin/orders.tsx`

Fetches from `GET /api/qb/admin/orders` with pagination and search/filter controls.

Displays:
- A search input at the top (searches customer name or email)
- Status filter pills or a dropdown: All / Pending / Processing / Completed / Failed / Cancelled
- A table with columns: Order ID, Customer, Product, Total (formatted as $XX.XX CAD), Status badge, Date, and a "View" link
- Pagination controls at the bottom (Previous / Next, current page / total pages)

Clicking "View" navigates to `/admin/orders/:id`.

Use the same status badge color scheme as the dashboard.

### 3c. Order Detail Page

**File:** `artifacts/qb-portal/src/pages/admin/order-detail.tsx`

Fetches from `GET /api/qb/admin/orders/:id`. Displays:

1. **Order header** — Order ID, status badge, product name, total, created date.

2. **Customer info section** — customer name, email, phone.

3. **Status update control** — a select/dropdown with all valid status values, pre-filled with the current status. A "Save Status" button that calls `PATCH /api/qb/admin/orders/:id/status`. Show a success or error toast/alert after the update.

4. **Customer files section** — a list of files the customer has uploaded (`qb_order_files` records where the file was uploaded by the customer). For each file: show the filename, upload date, and either a "Download" button or an expired message. The download button calls `GET /api/qb/admin/orders/:orderId/files/:fileId/download`, receives the signed URL, and redirects the browser to it.

5. **Operator upload section** — a file input and "Upload Processed File" button. When the operator selects a file and clicks the button, the frontend submits a multipart POST to `POST /api/qb/admin/orders/:orderId/files/upload`. Show upload progress if possible, or at minimum a loading state. On success, refresh the files list so the new file appears.

### 3d. Customers Table Page

**File:** `artifacts/qb-portal/src/pages/admin/customers.tsx`

Fetches from `GET /api/qb/admin/customers`.

Displays:
- A search input
- A table with columns: Name, Email, Phone, Joined Date, Total Orders, Open Tickets
- Pagination controls

No customer detail page is required in this prompt — the table is sufficient for the MVP.

### 3e. Tickets Table Page

**File:** `artifacts/qb-portal/src/pages/admin/tickets.tsx`

Fetches from `GET /api/qb/admin/tickets`.

Displays:
- Status filter pills: All / Open / In Progress / Resolved / Closed
- A table with columns: Subject, Customer, Status badge, Created Date, and a "View" link

### 3f. Ticket Detail Page

**File:** `artifacts/qb-portal/src/pages/admin/ticket-detail.tsx`

Fetches from `GET /api/qb/admin/tickets/:id`. Displays:

1. **Ticket header** — Subject, status badge, created date, customer name and email.

2. **Original message** — the customer's full ticket message displayed in a read-only text block.

3. **Reply section** — a textarea for the operator's reply text. A "Save Reply" button that calls `PATCH /api/qb/admin/tickets/:id` with the `operatorReply` and optionally a new `status`. Show success/error feedback.

4. **Status update** — a dropdown to change the ticket status (Open, In Progress, Resolved, Closed). This can be part of the same save action as the reply, or a separate control.

5. If a previous reply exists, show it in a styled read-only block with the timestamp.

---

## Step 4: Register Admin Routes in App.tsx

Update `artifacts/qb-portal/src/App.tsx` to register all admin page routes:
- `/admin` → Dashboard page
- `/admin/orders` → Orders table page
- `/admin/orders/:id` → Order detail page
- `/admin/customers` → Customers table page
- `/admin/tickets` → Tickets table page
- `/admin/tickets/:id` → Ticket detail page

All of these routes should be wrapped in the admin layout. The admin layout's AAL2 guard (from Prompt 03B) will handle all auth and MFA redirects — the route wrappers in App.tsx do not need to duplicate that logic.

Also add all `/admin/*` routes (collectively as `Disallow: /admin`) to `artifacts/qb-portal/public/robots.txt` if not already present.

---

## Step 5: Admin Link in Header

Update the customer-facing header component (check `replit.md` for the file location — likely `artifacts/qb-portal/src/components/header.tsx` or similar) to add an "Admin" link that is only visible when the current user is an operator.

Condition: `isOperator` from the auth context must be true. When visible, the link navigates to `/admin`. Style it subtly — use the secondary/muted style, not the primary CTA style, so it doesn't distract customers who happen to see a flash during rendering.

On the admin pages themselves, the header is replaced by the admin layout's sidebar — the customer-facing header should not appear on `/admin/*` routes. Ensure these routes do not render the customer header. This may require conditional rendering in App.tsx or in the header component itself based on the current route.

---

## Step 6: Order Status Update — UX Detail

The status update on the order detail page should behave as follows:

1. The operator changes the dropdown to a new status.
2. The operator clicks "Save Status."
3. The frontend calls `PATCH /api/qb/admin/orders/:id/status` with the selected status.
4. On success: update the status badge on the page in place (do not do a full page reload). Show a brief success message ("Status updated to Processing").
5. On error: show an error message with the error text returned from the API.

The status values and their display labels:
- `pending` → "Pending"
- `processing` → "Processing"
- `completed` → "Completed"
- `failed` → "Failed"
- `cancelled` → "Cancelled"

---

## Step 7: Operator File Download (Frontend Detail)

The download flow for operator files:

1. Operator clicks "Download" on a customer file in the order detail page.
2. Frontend calls `GET /api/qb/admin/orders/:orderId/files/:fileId/download` with the operator's access token in the Authorization header.
3. Receives `{ signedUrl: "..." }` (15-minute expiry).
4. Frontend redirects browser to `signedUrl` — the browser downloads the file directly from Supabase Storage.

If the server returns 410 (file expired), show a message instead of attempting the download: "This file has been deleted per the 7-day retention policy."

---

## Step 8: Update robots.txt

Confirm that `artifacts/qb-portal/public/robots.txt` disallows all admin paths. The file should contain at minimum:
- `Disallow: /admin`
- `Disallow: /admin/mfa-enroll` (from Prompt 03B)
- `Disallow: /admin/mfa-challenge` (from Prompt 03B)

A single `Disallow: /admin` covers all subpaths. Keep any existing disallow entries.

---

## Step 9: Verify

Run `pnpm typecheck` from the monorepo root. Fix all TypeScript errors before proceeding with manual testing.

### Manual test sequence:

**Test 1 — Dashboard:**
1. Log in as the operator (complete MFA challenge if prompted — see Prompt 03B).
2. Navigate to `/admin`.
3. The dashboard should display stat cards with real counts from the database.
4. Recent orders should appear in the table.

**Test 2 — Order list and detail:**
1. Navigate to `/admin/orders`.
2. The orders list should show all orders with pagination.
3. Use the search input to filter by a customer name or email — confirm the list updates.
4. Click "View" on an order. The detail page should load with customer info, file list, and status update control.
5. Change the order status using the dropdown and click "Save Status." Confirm the status badge updates in place and a success message appears.

**Test 3 — Operator file download:**
1. On an order detail page where the customer has uploaded a file, click "Download."
2. The browser should redirect to a Supabase Storage signed URL and start the download.
3. Confirm the URL contains the Supabase storage domain (not a local filesystem path or Express stream).

**Test 4 — Operator file upload:**
1. On an order detail page, select a file using the "Upload Processed File" input.
2. Click the upload button. The upload should succeed.
3. Refresh the files section — the newly uploaded file should appear.
4. Check the Supabase Storage dashboard — the file should appear under the customer's path (not the operator's path).

**Test 5 — Ticket list and reply:**
1. Navigate to `/admin/tickets`.
2. The tickets list should show all tickets.
3. Click "View" on a ticket. The detail page should show the customer's message.
4. Enter a reply text and click "Save Reply." Confirm success feedback.
5. The reply text should be saved in the database (verify in Supabase dashboard or by fetching the ticket again).

**Test 6 — Customer list:**
1. Navigate to `/admin/customers`.
2. A list of customers should appear with their order and ticket counts.
3. Use the search input — confirm filtering works.

**Test 7 — Security (customer cannot access admin routes):**
1. Log out of the operator account.
2. Register or log in as a customer.
3. Attempt to navigate to `/admin`. The admin layout guard should redirect to `/login` or `/portal`.
4. Attempt to call `GET /api/qb/admin/orders` with the customer's access token. Should receive 403.

**Test 8 — Admin header link:**
1. Logged in as operator, navigate to the customer-facing pages (catalog, portal).
2. Confirm the "Admin" link is visible in the header.
3. Log out and log in as a customer. Confirm the "Admin" link is NOT visible.

### Security grep check:

Run from the repo root:
- `grep -rn "requireOperator" artifacts/api-server/src/routes/qb-portal.ts` — all `/api/qb/admin/*` routes must use `requireOperator`.
- `grep -rn "isOperator" artifacts/qb-portal/src/components/` — the admin link visibility condition should appear here.

---

## Constraints

- Do NOT modify any files in `docs/`.
- Do NOT modify `artifacts/qb-portal/public/products.json`.
- Do NOT implement subscription billing, subscription management, or Stripe subscriptions — that is Prompt 06.
- Do NOT implement the promo code system — that is Prompt 09/10.
- Do NOT implement SLA timers, ticket priority routing, or ticket email notifications — that is Prompt 08.
- Do NOT implement product/pricing management in the admin panel — products are static JSON at this stage.
- Do NOT implement a Stripe refund action from the admin panel — that is a later prompt.
- The admin panel pages in this prompt are the MVP: dashboard, orders, customers, tickets. Scope is exactly what is defined here — do not build additional admin sections not covered in these steps.
- All admin routes (frontend and backend) must use the Supabase Auth operator verification from Prompts 03 and 03B. Do NOT introduce any new auth mechanism.
