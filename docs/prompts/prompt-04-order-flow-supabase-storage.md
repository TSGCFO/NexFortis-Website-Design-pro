# Prompt 04: Order Flow Updates + Supabase Storage Migration

This prompt has two concerns: updating the order form to work correctly with the 20-product catalog (order form updates), and migrating QBM file storage from the local filesystem to Supabase Storage (the security foundation for encrypted, access-controlled file handling). Both concerns are combined here because they both touch the upload and download routes.

## Step 0: Setup

Read these files before making any changes:
1. `replit.md` — project overview, architecture, conventions, current state
2. `docs/prd/qb-portal/feature-security-auth-storage.md` — security PRD, particularly Section 8.3 (Storage Architecture), the upload flow, the download flow, the RLS policies on `order-files`, and the 7-day auto-deletion requirement
3. `docs/specs/2026-04-14-supabase-auth-security-redesign.md` — design spec (Section 5: File Storage Detail, Sections 5.1 through 5.4)
4. `docs/implementation-plan.md` — understand how Prompt 04 fits into the overall sequence and what came before it in Prompt 03
5. `docs/prompts/prompt-04-order-flow-supabase-storage.md` — this file (complete instructions)

**Do NOT modify any files in `docs/`.**

**PREREQUISITES — the following must already be complete from Prompt 03:**
- The Supabase client module at `artifacts/api-server/src/lib/supabase.ts` — the service role client must be initialized and exported
- The frontend Supabase client at `artifacts/qb-portal/src/lib/supabase.ts`
- The `requireAuth` middleware already verifies Supabase JWTs and attaches `req.userId` (UUID) to requests
- The `qb_order_files` table already has the `expired` (boolean, default false) and `deletedAt` (timestamp, nullable) columns added in the Prompt 03 schema migration
- The Supabase RLS migration SQL file at `artifacts/api-server/src/migrations/supabase-rls-setup.sql` already exists from Prompt 03

If any of these prerequisites are missing, stop and report what is needed before continuing.

---

**PLATFORM REMINDERS (read replit.md for full details):**
- The API server only handles `/api/*` routes. Static files are served by Replit, not Express.
- Do NOT add `express.static()` to the API server.
- Do NOT throw errors for missing env vars — use `console.warn` + `null` fallback.
- The upload route `/api/qb/orders/:id/files/upload` supports BOTH Bearer auth AND `X-Upload-Token` auth. Do NOT add `requireAuth` to it.
- Rate limiter `keyGenerator` must be `(req) => req.userId || req.ip` — never IP-only on authenticated routes.
- Verify Replit Secrets (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY) are still present after completing all steps.

---

## Step 1: Order Form Updates

Update the order form in the QB Portal frontend to work correctly with the 20-product catalog introduced in Prompt 01.

**File:** `artifacts/qb-portal/src/pages/order.tsx` (or wherever the order form currently lives — check `replit.md` for the current file location if unsure).

### 1a. Product ID Alignment

The order form currently references product IDs from the old catalog. The new catalog (from `artifacts/qb-portal/public/products.json`) has 20 products. Ensure that when a product is selected and an order is submitted, the correct product ID from the new catalog is used. The order form should read its product selection from the `products.json` catalog, not from a hardcoded list of old product IDs.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Hardcode product IDs or names. Read them from `products.json` at runtime.
> - Assume old product IDs still exist — the new catalog may use different ID formats.

### 1b. Per-Service File Upload Types

The accepted file types for the upload input must reflect the service being ordered:

- For QuickBooks conversion services (enterprise-to-premier, pro-to-premier, and similar conversions): accept `.qbm` files only.
- For QuickBooks data services (audit trail removal, CRA period copy, and similar): accept `.qbm` files only.
- For migration services (AccountEdge to QuickBooks, Sage 50 to QuickBooks): accept `.dat`, `.zip`, or `.qbw` files — the formats used by AccountEdge and Sage 50 respectively. Check the products.json data to confirm the accepted file types per product.
- For volume packs (5-Pack, 10-Pack): these packs represent future conversions — no file upload is required at order time. The upload step should be skipped or hidden for pack products.
- For bundle products (Audit Trail + CRA Bundle, etc.): accept `.qbm` files — same as the individual conversion services.
- For subscription products (QB Expert Support tiers): no file upload. Subscriptions do not require a file.

Implement this by reading the `accepted_file_types` field from the product data (or deriving it from the product's category slug if that field doesn't exist in products.json). Update the `accept` attribute on the file input element dynamically based on the selected product.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Show the file upload field for volume pack or subscription products — hide it entirely.
> - Use a static `accept=".qbm"` on the file input. It must update when the selected product changes.

### 1c. Volume Pack Ordering Flow

When the customer selects a volume pack product (5-Pack or 10-Pack), the order form should:
- Not show a file upload field — packs are pre-purchased credits, not immediate conversions.
- Show a clear message explaining what they're purchasing: "You are purchasing a pack of [5/10] conversions. You will submit individual files for conversion after your order is confirmed."
- Submit the pack as a single order (one `qb_orders` record with the pack's product ID). Do not attempt to create multiple order records.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Create multiple `qb_orders` rows for a pack (e.g., 5 rows for a 5-Pack). One pack = one order record.
> - Block form submission because no file is attached — file upload is intentionally skipped for packs.

### 1d. Bundle Handling

Bundle products (products where the product data indicates they include multiple services) should be treated as a single product with a single SKU. The order form should show the bundle contents in a "What's included" summary, but the order itself is a single line item.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Split a bundle into multiple orders or line items.
> - Require separate file uploads per sub-service — bundles use a single `.qbm` upload.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- In DevTools → Elements, select each product category and confirm the file input `accept` attribute updates correctly.
- Select a volume pack — confirm no file input is visible and the pack message is shown.

---

## Step 2: Supabase Storage Bucket Verification

Before making any storage-related code changes, verify that the `order-files` bucket exists in the Supabase project.

In the backend startup code (or as part of the storage module initialization), add a verification step: call `supabase.storage.from('order-files').list('', { limit: 1 })` using the service role client. If the call returns an error indicating the bucket does not exist, log a clear error message and do not proceed with any storage operations that session. The application should not crash — it should degrade gracefully on upload attempts by returning a 503 with a message indicating storage is not configured.

If the bucket exists, the verification succeeds silently. Do not log on success.

**Note:** The RLS policies on the `order-files` bucket should already be configured in Supabase (they were part of the Prompt 03 SQL migration file). This step simply confirms the bucket is accessible. If RLS policies appear to be missing, report it but do not attempt to reapply them from application code — that requires Supabase dashboard access.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Call `supabase.storage.createBucket('order-files', ...)` from app code. The bucket is created via the Supabase dashboard or migration. If creation is ever used, handle "bucket already exists" as success, not an error.
> - Crash the server on bucket verification failure — set a module-level `storageAvailable = false` flag and degrade gracefully.
> - Log a success message on every startup — only log on failure.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- Check server startup logs — no bucket errors if bucket exists; a clear warning if it doesn't.

---

## Step 3: File Upload Migration (Local Filesystem → Supabase Storage)

Rewrite the file upload route in the API server to stream files to Supabase Storage instead of writing them to the local filesystem.

**File to update:** The Express route handler for `POST /api/qb/orders/:id/files/upload` (confirm the exact path in the current codebase by checking `replit.md` or the route file).

**The middleware chain for the upload route must be:**
`router.post('/orders/:id/files/upload', orderLimiter, uploadMiddleware, handler)`
Do NOT add `requireAuth` here — this route supports upload-token auth as an alternative to Bearer auth.

### Current approach (to be replaced):

The current route uses multer with disk storage — it saves the uploaded file to a local directory (something like `uploads/` on the server). The `qb_order_files` record stores the local filesystem path.

### New approach:

**Keep multer, but switch to memory storage.** The frontend still uploads to the Express API exactly as before — no changes to the upload request format. Multer parses the multipart form data and gives the API the file as an in-memory buffer (`req.file.buffer`). The API then uploads that buffer to Supabase Storage.

**Multer configuration change:** Change multer's storage from `diskStorage` (with a destination directory) to `memoryStorage()`. Multer will attach the file to `req.file` with a `buffer` property containing the raw file bytes and a `mimetype` property with the content type. Keep the file size limit at 500MB (matching the current limit).

**Remove** all references to disk storage destinations (`dest`, `filename` callback, `path` construction). After this change, no files should ever touch the local filesystem during upload processing.

**Upload to Supabase Storage:**

Construct the storage path using the **exact pattern**: `{user_id}/{order_id}/{timestamp}-{original_filename}` where `{timestamp}` is `Date.now()`. Example: `a1b2c3d4-uuid/order-uuid/1713000000000-company-data.qbm`. The timestamp prefix prevents filename collisions when the same file is uploaded more than once.

Use the Supabase service role client: `supabase.storage.from('order-files').upload(storagePath, fileBuffer, { contentType: req.file.mimetype, upsert: false })`.

After a successful upload, set `qb_order_files.storage_path` to the Supabase path string. This replaces the old local filesystem path.

**Migration note:** Existing `qb_order_files` records may still reference local filesystem paths. Do NOT delete local files. The migration is additive — new uploads go to Supabase Storage; old records keep their existing paths until manually migrated.

**Error handling for this route:**
- Supabase Storage upload fails → `500` with `{ error: "Storage upload failed: <message>" }`. Do not insert/update `qb_order_files`.
- File exceeds 500MB → multer throws `MulterError` with code `LIMIT_FILE_SIZE` — catch it and return `413` with `{ error: "File too large. Maximum size is 500MB." }`.
- Order ID does not exist → `404` with `{ error: "Order not found." }` before attempting upload.
- Authenticated user does not own the order → `403` with `{ error: "Forbidden." }` before attempting upload.
- Upload token missing or invalid → `401`.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Use `upsert: true` — this silently overwrites existing files. Always use `upsert: false`.
> - Store only `req.file.originalname` as the path. The path MUST be `{user_id}/{order_id}/{timestamp}-{filename}`.
> - Insert a `qb_order_files` record before the Storage upload succeeds — only write DB after confirmed upload.
> - Delete or overwrite the local `uploads/` directory. Migration is additive.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- `grep -rn "diskStorage\|dest:" artifacts/api-server/src/` — zero results.
- Upload a test file. In Supabase Storage dashboard, confirm path is `{user_id}/{order_id}/{timestamp}-{filename}`.
- Confirm `qb_order_files.storage_path` matches the Supabase path (not a local path like `uploads/`).

---

## Step 4: Magic Byte Validation for QBM Files

Before uploading a `.qbm` file to Supabase Storage, validate that the file is actually a QuickBooks backup file by checking its magic bytes.

QuickBooks backup files (`.qbm`) use the OLE2 Compound Binary Format. The first 8 bytes of a valid `.qbm` file are: `D0 CF 11 E0 A1 B1 1A E1`.

### Implementation:

In the upload route handler, after multer has placed the file buffer in memory and before the Supabase Storage upload call, perform this check if the product type expects a `.qbm` file:

1. Read the first 8 bytes from `req.file.buffer`.
2. Compare those 8 bytes against the OLE2 signature: bytes `[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]`.
3. If the bytes do not match, reject the upload immediately with a 400 response. The error message must be: `"Invalid file format. Expected a QuickBooks backup file (.QBM). The uploaded file does not appear to be a valid QuickBooks backup."`
4. If the bytes match, proceed with the Supabase Storage upload.

### When to apply this validation:

Apply the magic byte check only when the product associated with the order accepts `.qbm` files. You can determine this by looking up the order's product in the database and checking its category or accepted file types. Do NOT apply this check to migration products (AccountEdge, Sage 50) that accept different file formats — those have their own file format requirements and the magic byte signature is different.

Extract this validation into: `export function validateQbmMagicBytes(buffer: Buffer): boolean` in `artifacts/api-server/src/lib/file-validation.ts`.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Apply magic byte validation to `.dat`, `.zip`, or `.qbw` files — only to `.qbm` products.
> - Return `500` when validation fails — the correct status is `400`.
> - Infer product type from file extension alone — look up the order's product in the database.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- Rename a `.txt` file to `.qbm`, attempt upload on a conversion order → expect `400` with the exact error message.
- Upload a real `.qbm` file → expect success.

---

## Step 5: Signed Download URLs

Replace the current download route with Supabase Storage signed URL generation.

**File to update:** The Express route handler for `GET /api/qb/orders/:id/files/:fileId/download` (confirm the exact path).

**Middleware chain — customer download:** `router.get('/orders/:id/files/:fileId/download', requireAuth, handler)`
**Middleware chain — operator download:** `router.get('/orders/:id/files/:fileId/download', requireOperator, handler)` (admin prefix)

### Current approach (to be replaced):

The current route reads the file from the local filesystem path stored in `qb_order_files.storage_path` and streams it back to the client using `res.sendFile()` or `fs.createReadStream()`.

### New approach:

Instead of reading the file and streaming it, generate a Supabase Storage signed URL and return it to the frontend. The frontend then redirects the browser to the signed URL, which triggers the download directly from Supabase Storage's CDN.

**For customer downloads (routes protected by `requireAuth`):**
1. Look up the `qb_order_files` record by `fileId`.
2. Verify that the file belongs to an order owned by `req.userId` (UUID comparison against the order's `user_id`). Return `403` if not.
3. If `file.expired === true`, return `410` (Gone) with: `{ "error": "This file has expired and been deleted per our 7-day retention policy." }`. Do not attempt to generate a signed URL for expired files.
4. If `file.storage_path` is null (old filesystem record), return `410` with `{ "error": "File is no longer available." }`.
5. Call `supabase.storage.from('order-files').createSignedUrl(file.storage_path, 3600)` — 3600 seconds = 1-hour expiry.
6. If the signed URL generation fails, return `500`.
7. Return: `{ "signedUrl": "..." }`.

**For operator downloads (routes protected by `requireOperator`, covering admin routes):**
Same flow, but with a 15-minute (900 second) expiry instead of 1 hour.

**Frontend update:** Wherever the download button currently triggers a streaming download from the Express API, update it to: call the download endpoint → receive the `{ signedUrl }` response → redirect using `window.location.href = signedUrl` or a temporary anchor element with `download` attribute.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Return the signed URL as a redirect (`res.redirect(signedUrl)`) — return it as JSON so the frontend controls navigation.
> - Call `createSignedUrl` when `storage_path` is null — this will throw.
> - Use 3600s expiry for operator downloads — operators get 900s.
> - Return `404` when the file exists but belongs to a different user — return `403`.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- `grep -rn "sendFile\|createReadStream" artifacts/api-server/src/routes/qb-portal.ts` — zero results in download handler.
- Download button click → network tab shows JSON `{ signedUrl }` response, then browser redirects to `*.supabase.co`.

---

## Step 6: Upload Token Security (Token in Header)

The current upload flow passes the upload token as a URL query parameter (e.g., `POST /api/qb/orders/:id/files/upload?token=abc123`). This exposes the token in server access logs and browser history.

Change the upload flow to transmit the token in a custom request header instead.

### Backend change:

In the upload route handler, change where the upload token is read from: instead of `req.query.token`, read it from `req.headers['x-upload-token']`. The header name is `X-Upload-Token`.

Update the token validation logic to read from this header. If the header is absent or the token is invalid, return `401`.

### Frontend change:

In the file upload request, add `'X-Upload-Token': uploadToken` in the request headers alongside `Authorization: Bearer`. Remove the `?token=...` query parameter from the URL.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Leave `req.query.token` as a fallback — remove it entirely. The query param must stop being accepted.
> - Forget to update the frontend — if only the backend changes, all uploads will break.
> - Pass the token in both header AND query string during transition. Remove the query param fully.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- DevTools → Network tab → initiate upload. Request URL must NOT contain `?token=`. Token appears only in headers as `X-Upload-Token`.
- `grep -rn "query.token" artifacts/api-server/src/` — zero results.

---

## Step 7: Auto-Deletion Cron Job SQL

Create the pg_cron SQL for the 7-day auto-deletion job.

**File to create:** `artifacts/api-server/src/migrations/supabase-storage-cron.sql`

This SQL file contains statements that must be run in the Supabase SQL Editor (Dashboard → SQL Editor → New query). Include a comment at the top of the file explaining this — it cannot be run via Drizzle or the Express API.

The SQL must do the following (explain in comments within the SQL, but do not include the actual SQL logic here — let the agent write the SQL itself):

1. Use the `pg_cron` extension to schedule a job that runs daily at 3:00 AM UTC.
2. The job's logic: delete objects from `storage.objects` where the `bucket_id` is `'order-files'` and the object's `created_at` is more than 7 days ago.
3. After (or as part of the same transaction): update `public.qb_order_files` rows to set `expired = true` and `deleted_at = NOW()` where their `created_at` is more than 7 days ago and `storage_path` is not null and `expired` is currently false.
4. The cron job should be idempotent — running it multiple times should not cause errors.

Include the cron schedule string and explain the job naming convention in a comment so the operator can identify it in Supabase's cron dashboard.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Use `CREATE EXTENSION pg_cron` without `IF NOT EXISTS`.
> - Schedule the job without first unscheduling any existing job with the same name (`cron.unschedule` before `cron.schedule`, or use conflict handling).
> - Forget to update `qb_order_files.expired` when deleting from `storage.objects` — both must stay in sync.
> - Update `deleted_at` on rows where `expired` is already `true` — use `WHERE expired = false`.

---

## Step 8: Frontend Expired File State

Update the customer portal's order detail view to handle the case where an uploaded file has `expired = true`.

**File to update:** The order detail page or component that lists a customer's uploaded files (likely `artifacts/qb-portal/src/pages/portal.tsx` or a subcomponent — check the codebase).

### What to show:

When rendering the list of files for an order:
- If `file.expired` is `false` and `file.storage_path` is not null: show the download button as normal.
- If `file.expired` is `true`: instead of a download button, show an informational message: "This file was automatically deleted after 7 days per our data retention policy." Style this message in a muted gray appearance — use `text-muted-foreground` (or equivalent Tailwind class for the project's design system). Do not show a disabled download button — the message replaces it entirely.

This change is purely frontend — no new API endpoint is needed. The expired status is returned as part of the existing order files API response.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Show a disabled download button alongside the expiry message — the button must be removed entirely.
> - Call the download endpoint for expired files. Check `file.expired` before making any API call.
> - Use only `file.expired === false` to show the download button — also check `file.storage_path !== null`.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- Manually set `expired = true` on a `qb_order_files` record in Supabase. Load the order detail page — confirm the expiry message appears and no download button is visible.

---

## Step 9: Stripe Checkout Metadata + Order Status Enforcement

> **⚠️ REQUIRED — Stripe webhook matching depends on order ID in metadata.**

When creating a Stripe Checkout Session for an order, the session's `metadata` must include:
```
metadata: {
  order_id: "<qb_orders UUID>",
  user_id:  "<user UUID>"
}
```
The `payment_intent.succeeded` webhook handler must read `session.metadata.order_id` to locate the order. Without `order_id` in metadata, the webhook cannot update order status.

**Order status flow:** Enforce `pending → paid → processing → completed`. Before any status update, check the current status. Invalid transitions must return `400` with `{ "error": "Invalid status transition." }`.
- `pending → paid`: Stripe webhook only.
- `paid → processing`: operator action only.
- `processing → completed`: operator action only.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Create a Stripe session without `metadata.order_id`.
> - Allow direct `pending → completed` or other skipped transitions.
> - Allow client-side code to set `paid` status — only the Stripe webhook should do this.

---

## Step 10: Final Verification

Run `pnpm typecheck` from the monorepo root. Fix all TypeScript errors before proceeding to manual tests.

### Manual test sequence:

**Test 1 — File upload (QBM conversion product):**
1. Log in as a customer. Create a new order for a QuickBooks conversion service.
2. Upload a valid `.qbm` file. The upload should succeed.
3. Supabase Storage → `order-files` bucket: file appears at `{user_id}/{order_id}/{timestamp}-{filename}`.
4. `qb_order_files.storage_path` matches the Supabase path (not a local path).

**Test 2 — Magic byte validation:**
1. Rename a `.txt` file to `.qbm`. Attempt upload on a conversion order → expect `400` with the exact error message.
2. Upload a real `.qbm` file → success.

**Test 3 — File download:**
1. Click download button. Browser redirects to a Supabase signed URL (`*.supabase.co`).
2. File downloads from Supabase Storage CDN.

**Test 4 — Upload token not in URL:**
1. DevTools → Network → initiate upload. Request URL must NOT contain `?token=`. Token in headers only as `X-Upload-Token`.

**Test 5 — Expired file display:**
1. Set `expired = true` on a `qb_order_files` record. Load order detail page → expiry message visible, no download button.

**Test 6 — Old filesystem paths not used:**
```
grep -rn "uploads/" artifacts/api-server/src/           # zero results
grep -rn "diskStorage\|dest:" artifacts/api-server/src/ # zero results
grep -rn "sendFile\|createReadStream" artifacts/api-server/src/routes/qb-portal.ts # zero in download handler
grep -rn "query.token" artifacts/api-server/src/         # zero results
```

**Test 7 — Replit Secrets:**
Confirm `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `STRIPE_SECRET_KEY` are still set in Replit Secrets. Restore any that are missing before marking this prompt complete.

---

## Constraints

- Do NOT modify any files in `docs/`.
- Do NOT modify `artifacts/qb-portal/public/products.json` — catalog data is managed separately.
- Do NOT implement admin file management (operator viewing/downloading all customer files) — that is Prompt 05.
- Do NOT implement subscription billing or subscription-based order flows — that is Prompt 06.
- Keep multer in the project for multipart parsing, but remove disk storage. Use `memoryStorage()` only.
- The Express API remains the upload intermediary — do NOT implement direct-to-Supabase-Storage signed upload URLs from the frontend. The proxy approach (frontend → Express → Supabase) is the chosen architecture for launch simplicity.
- Do NOT change the Stripe checkout flow beyond adding `metadata.order_id` as specified in Step 9.
- The magic byte validation applies to QBM files only. Do not add magic byte validation for migration file types in this prompt.
- Do NOT add `express.static()` to the API server.
- Do NOT throw on missing env vars — warn and degrade gracefully.
