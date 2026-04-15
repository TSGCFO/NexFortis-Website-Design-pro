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

## Step 1: Order Form Updates

Update the order form in the QB Portal frontend to work correctly with the 20-product catalog introduced in Prompt 01.

**File:** `artifacts/qb-portal/src/pages/order.tsx` (or wherever the order form currently lives — check `replit.md` for the current file location if unsure).

### 1a. Product ID Alignment

The order form currently references product IDs from the old catalog. The new catalog (from `artifacts/qb-portal/public/products.json`) has 20 products. Ensure that when a product is selected and an order is submitted, the correct product ID from the new catalog is used. The order form should read its product selection from the `products.json` catalog, not from a hardcoded list of old product IDs.

### 1b. Per-Service File Upload Types

The accepted file types for the upload input must reflect the service being ordered:

- For QuickBooks conversion services (enterprise-to-premier, pro-to-premier, and similar conversions): accept `.qbm` files only.
- For QuickBooks data services (audit trail removal, CRA period copy, and similar): accept `.qbm` files only.
- For migration services (AccountEdge to QuickBooks, Sage 50 to QuickBooks): accept `.dat`, `.zip`, or `.qbw` files — the formats used by AccountEdge and Sage 50 respectively. Check the products.json data to confirm the accepted file types per product.
- For volume packs (5-Pack, 10-Pack): these packs represent future conversions — no file upload is required at order time. The upload step should be skipped or hidden for pack products.
- For bundle products (Audit Trail + CRA Bundle, etc.): accept `.qbm` files — same as the individual conversion services.
- For subscription products (QB Expert Support tiers): no file upload. Subscriptions do not require a file.

Implement this by reading the `accepted_file_types` field from the product data (or deriving it from the product's category slug if that field doesn't exist in products.json). Update the `accept` attribute on the file input element dynamically based on the selected product.

### 1c. Volume Pack Ordering Flow

When the customer selects a volume pack product (5-Pack or 10-Pack), the order form should:
- Not show a file upload field — packs are pre-purchased credits, not immediate conversions.
- Show a clear message explaining what they're purchasing: "You are purchasing a pack of [5/10] conversions. You will submit individual files for conversion after your order is confirmed."
- Submit the pack as a single order (one `qb_orders` record with the pack's product ID). Do not attempt to create multiple order records.

### 1d. Bundle Handling

Bundle products (products where the product data indicates they include multiple services) should be treated as a single product with a single SKU. The order form should show the bundle contents in a "What's included" summary, but the order itself is a single line item.

---

## Step 2: Supabase Storage Bucket Verification

Before making any storage-related code changes, verify that the `order-files` bucket exists in the Supabase project.

In the backend startup code (or as part of the storage module initialization), add a verification step: call `supabase.storage.from('order-files').list('', { limit: 1 })` using the service role client. If the call returns an error indicating the bucket does not exist, log a clear error message and do not proceed with any storage operations that session. The application should not crash — it should degrade gracefully on upload attempts by returning a 503 with a message indicating storage is not configured.

If the bucket exists, the verification succeeds silently. Do not log on success.

**Note:** The RLS policies on the `order-files` bucket should already be configured in Supabase (they were part of the Prompt 03 SQL migration file). This step simply confirms the bucket is accessible. If RLS policies appear to be missing, report it but do not attempt to reapply them from application code — that requires Supabase dashboard access.

---

## Step 3: File Upload Migration (Local Filesystem → Supabase Storage)

Rewrite the file upload route in the API server to stream files to Supabase Storage instead of writing them to the local filesystem.

**File to update:** The Express route handler for `POST /api/qb/orders/:id/files/upload` (confirm the exact path in the current codebase by checking `replit.md` or the route file).

### Current approach (to be replaced):

The current route uses multer with disk storage — it saves the uploaded file to a local directory (something like `uploads/` on the server). The `qb_order_files` record stores the local filesystem path.

### New approach:

**Keep multer, but switch to memory storage.** The frontend still uploads to the Express API exactly as before — no changes to the upload request format. Multer parses the multipart form data and gives the API the file as an in-memory buffer (`req.file.buffer`). The API then uploads that buffer to Supabase Storage.

**Multer configuration change:** Change multer's storage from `diskStorage` (with a destination directory) to `memoryStorage()`. Multer will attach the file to `req.file` with a `buffer` property containing the raw file bytes and a `mimetype` property with the content type. Keep the file size limit at 500MB (matching the current limit).

**Remove** all references to disk storage destinations (`dest`, `filename` callback, `path` construction). After this change, no files should ever touch the local filesystem during upload processing.

**Upload to Supabase Storage:**

Construct the storage path using the pattern: `{user_id}/{order_id}/{original_filename}`. The `user_id` is the UUID from `req.userId` (attached by the `requireAuth` middleware). The `order_id` comes from the route parameter. The `original_filename` is `req.file.originalname`.

Use the Supabase service role client to upload: call `supabase.storage.from('order-files').upload(storagePath, fileBuffer, { contentType: req.file.mimetype, upsert: false })`. The service role client is needed here because the upload is being proxied through the Express API — the customer's JWT is not being used to authenticate directly to Supabase Storage.

After a successful upload, update the `qb_order_files` record: set `storage_path` to the Supabase storage path (the `{user_id}/{order_id}/{filename}` string). This replaces the old local filesystem path.

**Error handling:** If the Supabase Storage upload fails, return a 500 error to the client and do not create or update the `qb_order_files` record. Do not leave orphaned database records pointing to files that don't exist.

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

Extract this validation into a helper function (e.g., `validateQbmMagicBytes(buffer: Buffer): boolean`) placed in a shared utilities file within the API server (e.g., `artifacts/api-server/src/lib/file-validation.ts`). This keeps the route handler clean and makes the validation testable.

---

## Step 5: Signed Download URLs

Replace the current download route with Supabase Storage signed URL generation.

**File to update:** The Express route handler for `GET /api/qb/orders/:id/files/:fileId/download` (confirm the exact path).

### Current approach (to be replaced):

The current route reads the file from the local filesystem path stored in `qb_order_files.storage_path` and streams it back to the client using `res.sendFile()` or `fs.createReadStream()`.

### New approach:

Instead of reading the file and streaming it, generate a Supabase Storage signed URL and return it to the frontend. The frontend then redirects the browser to the signed URL, which triggers the download directly from Supabase Storage's CDN.

**For customer downloads (routes protected by `requireAuth`):**
1. Look up the `qb_order_files` record by `fileId`.
2. Verify that the file belongs to an order owned by `req.userId` (UUID comparison against the order's `user_id`). Return 403 if not.
3. If `file.expired === true`, return 410 (Gone) with the response body: `{ "error": "This file has expired and been deleted per our 7-day retention policy." }`. Do not attempt to generate a signed URL for expired files.
4. Call `supabase.storage.from('order-files').createSignedUrl(file.storage_path, 3600)` — 3600 seconds = 1-hour expiry.
5. If the signed URL generation fails, return 500.
6. Return the signed URL to the frontend as JSON: `{ "signedUrl": "..." }`.

**For operator downloads (routes protected by `requireOperator`, covering admin routes):**
Same flow, but with a 15-minute (900 second) expiry instead of 1 hour.

**Frontend update:** Wherever the download button currently triggers a streaming download from the Express API, update it to: call the download endpoint → receive the `{ signedUrl }` response → redirect the browser to `signedUrl` using `window.location.href = signedUrl` or by creating a temporary anchor element with `download` attribute. The browser will follow the signed URL and start the download from Supabase's servers.

---

## Step 6: Upload Token Security (Token in Header)

The current upload flow passes the upload token as a URL query parameter (e.g., `POST /api/qb/orders/:id/files/upload?token=abc123`). This exposes the token in server access logs and browser history.

Change the upload flow to transmit the token in a custom request header instead.

### Backend change:

In the upload route handler, change where the upload token is read from: instead of `req.query.token`, read it from `req.headers['x-upload-token']`. The header name is `X-Upload-Token`.

Update the token validation logic to read from this header. If the header is absent or the token is invalid, return 401.

### Frontend change:

In the file upload request (wherever the frontend calls the upload endpoint), add the header to the fetch call: include `'X-Upload-Token': uploadToken` in the request headers alongside the `Authorization: Bearer` header. Remove the `?token=...` query parameter from the URL.

Confirm that after this change, the upload token never appears in the URL string. Check the browser's Network tab in DevTools during a test upload — the URL should not contain the token.

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

---

## Step 8: Frontend Expired File State

Update the customer portal's order detail view to handle the case where an uploaded file has `expired = true`.

**File to update:** The order detail page or component that lists a customer's uploaded files (likely `artifacts/qb-portal/src/pages/portal.tsx` or a subcomponent — check the codebase).

### What to show:

When rendering the list of files for an order:
- If `file.expired` is `false` and `file.storage_path` is not null: show the download button as normal.
- If `file.expired` is `true`: instead of a download button, show an informational message: "This file was automatically deleted after 7 days per our data retention policy." Style this message in a muted gray appearance — use `text-muted-foreground` (or equivalent Tailwind class for the project's design system). Do not show a disabled download button — the message replaces it entirely.

This change is purely frontend — no new API endpoint is needed. The expired status is returned as part of the existing order files API response.

---

## Step 9: Verify

Run `pnpm typecheck` from the monorepo root. Fix all TypeScript errors before proceeding to manual tests.

### Manual test sequence:

**Test 1 — File upload (QBM conversion product):**
1. Log in as a customer. Create a new order for a QuickBooks conversion service.
2. Complete the order and proceed to the file upload step.
3. Upload a valid `.qbm` file. The upload should succeed.
4. Open the Supabase dashboard → Storage → `order-files` bucket. Confirm the file appears under the path `{user_id}/{order_id}/{filename}`.
5. Confirm the `qb_order_files` record in the database has a `storage_path` matching the Supabase path (not a local filesystem path).

**Test 2 — Magic byte validation:**
1. Take a plain text file (`.txt`) or any non-QBM file and rename it to have a `.qbm` extension.
2. Attempt to upload it for a conversion order.
3. The upload should be rejected with a 400 error and the message about invalid file format.
4. Upload a real `.qbm` file — it should succeed.

**Test 3 — File download:**
1. After a successful upload (Test 1), click the download button in the customer portal.
2. The browser should redirect to a Supabase signed URL (the URL will contain `supabase.co` or your project domain).
3. The file download should start from the Supabase Storage CDN.
4. Wait for the signed URL to expire (1 hour, or test with a short-lived URL if you modify the expiry temporarily).
5. After expiry, attempting to access the signed URL again should return an error from Supabase (not from your Express API).

**Test 4 — Upload token not in URL:**
1. Open browser DevTools → Network tab.
2. Initiate a file upload.
3. Find the upload request in the network log. The request URL should NOT contain `?token=` or any upload token in the query string.
4. The token should appear only in the request headers as `X-Upload-Token`.

**Test 5 — Expired file display:**
1. Manually set `expired = true` on a `qb_order_files` record in the database (using the Supabase dashboard or a SQL query).
2. Load the order detail page for that order.
3. Confirm the expired file shows the informational message instead of a download button.

**Test 6 — Old filesystem paths not used:**
Run this grep from the repo root and confirm no results:
- `grep -rn "uploads/" artifacts/api-server/src/` — should return no results (no hardcoded upload directory paths)
- `grep -rn "diskStorage\|dest:" artifacts/api-server/src/` — should return no results (multer disk storage removed)
- `grep -rn "sendFile\|createReadStream" artifacts/api-server/src/routes/qb-portal.ts` — should return no results in the download handler (file streaming removed)

---

## Constraints

- Do NOT modify any files in `docs/`.
- Do NOT modify `artifacts/qb-portal/public/products.json` — catalog data is managed separately.
- Do NOT implement admin file management (operator viewing/downloading all customer files) — that is Prompt 05.
- Do NOT implement subscription billing or subscription-based order flows — that is Prompt 06.
- Keep multer in the project for multipart parsing, but remove disk storage. Use `memoryStorage()` only.
- The Express API remains the upload intermediary — do NOT implement direct-to-Supabase-Storage signed upload URLs from the frontend. The proxy approach (frontend → Express → Supabase) is the chosen architecture for launch simplicity.
- Do NOT change the Stripe checkout flow — payment processing is not in scope here.
- The magic byte validation applies to QBM files only. Do not add magic byte validation for migration file types in this prompt.
