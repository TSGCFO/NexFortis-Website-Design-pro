# Feature PRD: QB Portal Security Foundation

**QB Portal Security Foundation — Supabase Auth, Encrypted File Storage, and Web Application Hardening**

**Document version:** 1.0 — QB Portal Production Launch Epic
**Author:** NexFortis Product (Hassan Sadiq)
**Last updated:** April 2026

---

## 1. Feature Name

**QB Portal Security Foundation — Supabase Auth, Encrypted File Storage, and Web Application Hardening** — A complete replacement of the QB Portal's homegrown authentication system with Supabase Auth, migration of QBM file storage to Supabase Storage with encryption at rest and row-level security, and comprehensive web application security hardening (Helmet, CORS lockdown, rate limiting, CSRF mitigation, input validation, and Stripe webhook integrity). Applies to `qb.nexfortis.com` and its Express API backend.

---

## 2. Epic

**Parent Epic:** QB Portal Production Launch

**Related Documents:**
- Master Epic PRD: `/docs/prd/qb-portal/master-qb-portal-production-launch.md`
- Approved Design Spec: `/docs/specs/2026-04-14-supabase-auth-security-redesign.md`
- Operator Admin Panel PRD: `/docs/prd/qb-portal/feature-operator-admin-panel.md`
- Support Subscription PRD: `/docs/prd/qb-portal/feature-support-subscription.md`
- Operator Runbook: `/docs/operator_runbook.md`
- Portal Architecture: `artifacts/qb-portal/` (React 19 + Vite 7, Tailwind v4)
- API Server: `artifacts/api-server/` (Express 5, Drizzle ORM, Stripe, multer)
- API Spec: `lib/api-spec/` (OpenAPI 3.1)

**External References:**
- Supabase Auth Documentation: https://supabase.com/docs/guides/auth
- Supabase Storage Documentation: https://supabase.com/docs/guides/storage
- Supabase MFA Documentation: https://supabase.com/docs/guides/auth/auth-mfa
- Supabase Row Level Security: https://supabase.com/docs/guides/database/row-level-security
- OWASP Top 10 (2021): https://owasp.org/www-project-top-ten/
- PIPEDA (Canadian federal privacy law): https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/

---

## 3. Goal

### Problem

The QB Portal at `qb.nexfortis.com` has a critical security gap that makes it unacceptable to launch in its current state. The authentication system is entirely homegrown: passwords are hashed with bcrypt and sessions are managed using HMAC-SHA256-signed tokens with a 7-day expiry and no rotation. There is no rate limiting on any endpoint, no multi-factor authentication, no social login, and no server-side session revocation — logging out is a client-side localStorage clear only. The web application has no security headers (no Helmet), no Content Security Policy, and open CORS (`origin: true`) that accepts requests from any domain. There is no CSRF protection on cookie-bearing flows, no input validation beyond basic field checks, and no Stripe webhook signature verification.

Most critically: QBM files uploaded by customers sit unencrypted on the Replit/Render server filesystem. These files are QuickBooks Desktop company backups that routinely contain credit card numbers, employee SINs, T4 payroll data, banking credentials, and customer PII. Under PIPEDA (Canada's federal private sector privacy law), NexFortis as a data custodian has a legal obligation to protect this information using safeguards appropriate to its sensitivity. Storing unencrypted PII/financial data on an application server filesystem does not meet this standard. Upload tokens are currently passed as URL query parameters, which means they appear in server access logs, browser history, and any network proxy between the customer and the server.

The operator account — which has unrestricted access to all customer files, orders, payment data, and business configuration — is protected by a single password with no second factor.

This security posture is not a "nice to have" improvement. It is a launch blocker. No paying customer's financial records should be ingested under these conditions.

### Solution

This feature addresses the security posture across three coordinated pillars:

**Pillar 1 — Supabase Auth** replaces the homegrown auth system entirely. Supabase Auth provides: industry-standard password hashing (Argon2), built-in rate limiting on auth endpoints, email+password login, Google and Microsoft social login via OAuth 2.0, TOTP-based multi-factor authentication (enforced for the operator account), automatic JWT access tokens (1-hour expiry) with refresh token rotation, and server-side session revocation. The Express API backend replaces all HMAC verification middleware with Supabase JWT verification.

**Pillar 2 — Supabase Storage** replaces the server filesystem for all QBM file storage. Supabase Storage provides: AES-256 encryption at rest, private bucket access (no public URLs), row-level security (RLS) policies enforcing that customers can only access their own order files and the operator can access all files, expiring signed URLs for downloads (1-hour expiry), and a `pg_cron`-based auto-deletion job that purges files older than 7 days. Upload tokens are no longer passed in URL parameters — the upload flow is redesigned to use the Express API as an intermediary.

**Pillar 3 — Web Application Hardening** adds the missing OWASP Top 10 controls: `helmet` middleware for security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options), CORS lockdown to an explicit allowlist, `express-rate-limit` on all endpoints with tighter limits on auth-adjacent and payment endpoints, CSRF mitigation via the JWT-in-header approach (eliminating the cookie attack surface), QBM file magic byte validation, and `stripe.webhooks.constructEvent()` signature verification on the webhook handler.

### Impact

| Metric | Target |
|--------|--------|
| Plaintext passwords in database | 0 — Supabase stores all credentials; `password_hash` column removed from `qb_users` |
| QBM file storage | 100% of files in Supabase Storage (encrypted at rest, AES-256); 0 files on server filesystem |
| File download mechanism | 100% of downloads via signed URLs with ≤ 1-hour expiry; no permanent file URLs |
| Operator MFA coverage | 100% — operator cannot access `/admin` without AAL2 (TOTP-verified) session |
| OWASP Top 10 addressed | All 10 categories addressed by this feature |
| Auto-deletion compliance | 100% of QBM files older than 7 days automatically purged by cron (PIPEDA data minimization) |
| Stripe webhook integrity | 100% of webhook events verified via `Stripe-Signature` header |
| Upload token leakage | 0 — upload tokens no longer passed in URL query parameters |
| Social login options | 2 providers at launch: Google, Microsoft |
| CORS exposure | 0 unintended origins allowed — explicit 3-domain allowlist replacing open `origin: true` |

---

## 4. User Personas

### P1 — Customer (Small Business Owner)
A Canadian small business owner using QuickBooks Desktop who needs to convert their company file to a newer version or extract specific data. Typically files once per engagement. Has a Google account and may prefer social login over creating yet another password. Their QBM file contains their entire business's financial history, including employee payroll data, banking credentials, and potentially customer credit card information. They trust NexFortis with this data and expect it to be handled securely. Under PIPEDA, they have the right to know how their data is stored and the right to have it deleted.

### P2 — Accountant or Bookkeeper (Repeat Customer)
A Canadian accountant or bookkeeper who processes conversions for multiple clients, potentially submitting 5–10 orders per month. Files on behalf of their clients — the QBM files contain their clients' confidential financial data, not the accountant's own. Has a professional email account and may use Microsoft 365 / Azure AD; Microsoft social login is directly relevant for this persona. Repeat usage means they will be familiar with the login flow and benefit from session persistence.

### P3 — Hassan Sadiq (Operator — Sole Admin at Launch)
The founder and sole operator of NexFortis. Processes 100% of orders, has access to all customer files and data, manages pricing and configurations, and is the only person with admin-level access. At launch, he is the single operator account in the system. His account must be the most hardened account in the system: it is the highest-value target. MFA via TOTP is mandatory for his account — loss of his credentials without MFA would expose every customer file and order in the system. Uses Windows desktop (primary) and Android phone (secondary).

### P4 — Malicious Actor (Threat Model)
Any external party attempting to compromise the portal. Specific attack vectors this feature must defend against:
- **Credential stuffing / brute force:** Automated login attempts using leaked credential lists from other breaches. Mitigated by Supabase built-in rate limiting and the removal of the homegrown auth endpoint.
- **Session hijacking:** Stealing a valid session token. Mitigated by short-lived JWTs (1-hour access token), automatic rotation of refresh tokens, and server-side session revocation capability.
- **Privilege escalation:** Using a customer account or manipulated JWT to access operator-only routes. Mitigated by server-side JWT verification (not trust-on-client-decode), `requireOperator` middleware, and AAL2 enforcement on admin routes.
- **Direct file access:** Attempting to download another customer's QBM file via a guessable URL or by manipulating an order ID. Mitigated by Supabase Storage RLS (enforced at the database level, not just application level), and signed URL requirement.
- **Fake payment confirmation:** Sending a fabricated Stripe webhook to trigger order fulfillment without a real payment. Mitigated by `stripe.webhooks.constructEvent()` signature verification.
- **Cross-site request forgery:** A malicious website tricking a logged-in customer into making unintended API requests. Mitigated by the switch from cookie-based auth to JWT-in-Authorization-header, which cannot be sent by cross-origin JavaScript.
- **Cross-site scripting (XSS):** Injecting malicious scripts via user-supplied input that executes in another user's browser. Mitigated by Content Security Policy via Helmet, and input sanitization on all free-text fields.
- **Clickjacking:** Embedding the portal in an iframe on a malicious site. Mitigated by `X-Frame-Options: DENY` via Helmet.

---

## 5. User Stories

### 5.1 — Customer Registration

**US-01:** As a Customer, I want to register with my email and a password so that I can create an account without needing a social login provider.

**US-02:** As a Customer, I want to register using my Google account so that I can sign up in one click without creating or remembering a new password.

**US-03:** As a Customer, I want to register using my Microsoft account so that I can sign up with my existing work or Microsoft 365 credentials.

**US-04:** As a Customer who registered via Google or Microsoft, I want my name and email pre-populated from my social provider profile so that I do not have to re-enter information my provider already has.

---

### 5.2 — Customer Login

**US-05:** As a Customer, I want to log in with my email and password so that I can access my orders and account.

**US-06:** As a Customer, I want to log in with my Google account so that I can access my portal without a password.

**US-07:** As a Customer, I want to log in with my Microsoft account so that I can access my portal with my work credentials.

**US-08:** As a Customer, I want my session to persist across browser sessions (within reasonable limits) so that I am not logged out between visits.

**US-09:** As a Customer, I want to log out and have my session fully invalidated on the server so that closing my browser or using a public computer does not leave my account accessible.

---

### 5.3 — Password Reset

**US-10:** As a Customer who registered with email+password, I want to reset my password by receiving a reset link to my registered email address so that I can regain access if I forget my password.

**US-11:** As a Customer, I want the password reset link to expire after a reasonable time period so that old reset links cannot be used maliciously.

---

### 5.4 — Operator Login and MFA

**US-12:** As the Operator, I want to log in with my email and password (or Google/Microsoft) and then be required to enter a 6-digit TOTP code so that my admin account requires a second factor that cannot be bypassed even if my password is compromised.

**US-13:** As the Operator, I want to enroll a TOTP authenticator app (Google Authenticator, Authy, or any standards-compliant app) on my first login so that I can set up MFA before accessing any admin functionality.

**US-14:** As the Operator, I want to access backup codes for my MFA factor so that I can regain access to my account if I lose my authenticator device.

**US-15:** As the Operator, I want to be redirected to the MFA challenge screen immediately after password verification so that there is no window in which I have partial access to admin features without completing MFA.

---

### 5.5 — Admin Access Control

**US-16:** As the Operator, I want all `/admin` routes to verify my MFA status (AAL2) on every navigation so that an expired or downgraded session cannot silently retain admin access.

**US-17:** As a Customer, I want attempting to navigate to `/admin` to redirect me to the customer portal home so that admin functionality is completely invisible to me.

---

### 5.6 — Social Login Account Linking

**US-18:** As a Customer who registered with email+password, I want to also connect my Google account so that I can log in via either method.

**US-19:** As a Customer who registered via Google, I want the same account to be used regardless of whether I log in via Google or (if I later set a password) via email+password so that I do not end up with duplicate accounts.

---

### 5.7 — File Upload Security

**US-20:** As a Customer, I want to upload my QBM file securely after completing payment so that my file is immediately encrypted at rest and not accessible to anyone other than me and the NexFortis operator.

**US-21:** As a Customer, I want my upload to fail validation if the file is not a valid QBM file format so that I am warned immediately if I accidentally upload the wrong file type.

**US-22:** As a Customer, I want my upload progress to be visible and any upload failure to show a clear error message so that I know if my file was received successfully.

---

### 5.8 — File Download with Signed URLs

**US-23:** As a Customer, I want to download my processed output files via a secure, time-limited link so that the download URL cannot be bookmarked or shared with unauthorized parties.

**US-24:** As a Customer, I want downloading another customer's file to be impossible — even if I know their order ID — so that my account boundary is enforced at every layer.

**US-25:** As the Operator, I want to download any customer's original QBM file from the order detail page via a secure signed URL so that files are never exposed via direct, permanent storage paths.

---

### 5.9 — Session Management

**US-26:** As a Customer, I want my access token to be automatically refreshed in the background so that my session remains active without requiring me to log in repeatedly during normal use.

**US-27:** As the Operator, I want the ability to remotely revoke any user's session via the Supabase admin interface so that I can respond immediately to a suspected account compromise.

**US-28:** As a Customer, I want that when I click \"Log Out\", my session is invalidated on the server (not just cleared from my browser) so that my session cannot be replayed even if someone copies my token.

---

### 5.10 — Rate Limiting Protection

**US-29:** As a Customer, I want the system to limit how many checkout requests I can make in a short window so that accidental double-submits or malicious replay attacks cannot generate duplicate orders.

**US-30:** As any user, I want the system to throttle abusive request patterns to API endpoints so that the portal remains available even under automated attack traffic.

---

### 5.11 — Auto-Deletion of Expired Files

**US-31:** As a Customer, I want to be informed that my uploaded QBM file will be deleted after 7 days so that I understand NexFortis's data retention policy before uploading.

**US-32:** As NexFortis (PIPEDA compliance), I want all QBM files older than 7 days to be automatically and permanently deleted from storage so that customer financial data is not retained beyond the stated retention period.

---

## 6. Requirements

### 6.1 Authentication & Authorization (Functional Requirements)

#### Supabase Auth Integration

- **FR-AUTH-01:** The application must integrate Supabase Auth as the sole authentication provider, replacing the homegrown bcrypt+HMAC system. The frontend uses `@supabase/supabase-js` client library. The backend verifies all JWTs using the Supabase project's JWT secret.
- **FR-AUTH-02:** The `qb_users` table must be restructured as a profile table. The `id` column must be a `uuid` that matches `auth.users.id` (Supabase's internal auth user table). The `password_hash` column must be removed entirely — Supabase manages password storage internally.
- **FR-AUTH-03:** A Supabase database trigger (`on_auth_user_created`) must automatically create a corresponding `qb_users` profile row for every new auth user, regardless of sign-up method (email+password, Google, or Microsoft). The profile row must be created with `role = 'customer'` by default. See Section 8 for the trigger SQL.
- **FR-AUTH-04:** The `qb_password_resets` table must be dropped — Supabase manages the password reset flow natively including token generation, expiry, and validation.
- **FR-AUTH-05:** All authentication operations (register, login, logout, password reset) must call Supabase Auth directly from the frontend. The Express backend must not implement any `/auth/*` routes for these operations.
- **FR-AUTH-06:** The Express backend must expose no auth-proxying routes. Removed routes: `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `POST /auth/forgot-password`, `POST /auth/reset-password`.

#### Email + Password Authentication

- **FR-AUTH-07:** Customer registration via email+password must call `supabase.auth.signUp({ email, password, options: { data: { name, phone } } })`. Name and phone are stored in `raw_user_meta_data` and picked up by the `handle_new_user` trigger.
- **FR-AUTH-08:** Customer login via email+password must call `supabase.auth.signInWithPassword({ email, password })`. On success, Supabase returns a JWT access token and refresh token.
- **FR-AUTH-09:** Password complexity requirements are configured in the Supabase Auth dashboard settings. Minimum: 8 characters with at least one uppercase letter, one lowercase letter, and one number.

#### Social Login (Google and Microsoft)

- **FR-AUTH-10:** Google social login must be enabled via `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })`. Google OAuth credentials must be configured in Google Cloud Console and registered in the Supabase Auth dashboard.
- **FR-AUTH-11:** Microsoft social login must be enabled via `supabase.auth.signInWithOAuth({ provider: 'azure', options: { redirectTo: window.location.origin + '/auth/callback' } })`. Azure AD OAuth credentials must be configured in the Microsoft Azure portal and registered in the Supabase Auth dashboard.
- **FR-AUTH-12:** A frontend route at `/auth/callback` must handle the OAuth redirect from both Google and Microsoft, completing the Supabase OAuth flow and redirecting the user to the portal home (or the page they were attempting to access).
- **FR-AUTH-13:** When a social login creates a new user, the `handle_new_user` trigger fires identically — the user gets a `qb_users` profile row with `role = 'customer'`. No special handling is required in application code for this case.
- **FR-AUTH-14:** If a user attempts to sign in via Google with an email that already exists as an email+password account in Supabase Auth, Supabase handles the account linking per its configured linking behavior (automatic linking by email address when the email is verified).

#### Operator Account & MFA

- **FR-AUTH-15:** The operator account must be seeded via the Supabase Admin API (`supabase.auth.admin.createUser({ email, password, email_confirm: true })`), not via a bcrypt seed script. After creation, the `qb_users` profile row must have `role` updated to `'operator'`. The seed script must be idempotent (checks if the user already exists before creating).
- **FR-AUTH-16:** Multi-factor authentication using TOTP must be enforced for the operator account. Enforcement is implemented at three levels: (a) frontend route guard checks `supabase.auth.mfa.getAuthenticatorAssuranceLevel()` before rendering any `/admin/*` route; (b) `requireOperator` middleware on the backend verifies the JWT `aal` claim equals `'aal2'`; (c) Database RLS policies on sensitive tables require `auth.current_aal() = 'aal2'` for operator-scoped queries.
- **FR-AUTH-17:** MFA enrollment must be triggered on the operator's first login when no enrolled TOTP factor exists. The enrollment flow uses `supabase.auth.mfa.enroll({ factorType: 'totp' })` which returns a QR code URI that the operator scans with their authenticator app, followed by `supabase.auth.mfa.challengeAndVerify({ factorId, code })` to activate the factor.
- **FR-AUTH-18:** After the operator completes first-factor authentication (AAL1), the frontend must check the assurance level. If `nextLevel === 'aal2'` and `currentLevel !== 'aal2'`, the user is redirected to the MFA challenge screen before any admin content is displayed.
- **FR-AUTH-19:** MFA challenge screen must call `supabase.auth.mfa.challengeAndVerify({ factorId, code })` with the 6-digit TOTP code from the operator's authenticator app. On success, the session is upgraded to AAL2.

#### JWT Verification and Middleware

- **FR-AUTH-20:** The `requireAuth` middleware must: (a) extract the JWT from the `Authorization: Bearer <token>` header; (b) verify the JWT signature using Supabase's JWT verification (via `supabase.auth.getUser(token)` or by verifying against the Supabase project's JWT secret); (c) look up the `qb_users` profile by UUID to retrieve the `role`; (d) attach `req.userId` (UUID string) and `req.userRole` (`'customer'` or `'operator'`) to the request object. A missing or invalid JWT must return `401 Unauthorized`.
- **FR-AUTH-21:** The `requireOperator` middleware must: (a) call `requireAuth` first; (b) verify `req.userRole === 'operator'`; (c) verify the decoded JWT `aal` claim equals `'aal2'`. If the role check fails, return `403 Forbidden`. If AAL2 is not met, return `403 Forbidden` with body `{ error: 'mfa_required' }` so the frontend can redirect to the MFA challenge screen.
- **FR-AUTH-22:** All admin API routes (`/api/admin/*`) must use the `requireOperator` middleware. Customer-facing protected routes must use the `requireAuth` middleware.
- **FR-AUTH-23:** The `QB_TOKEN_SECRET` environment variable must be removed. All token verification is handled by Supabase's JWT infrastructure.

#### Session Management

- **FR-AUTH-24:** JWT access tokens have a 1-hour expiry (configurable in Supabase Auth dashboard). The Supabase client library automatically refreshes the access token using the refresh token via the `onAuthStateChange` listener — no manual token refresh code is required in the application.
- **FR-AUTH-25:** The frontend must no longer use `localStorage.setItem('qb_token')` for token storage. The Supabase client library manages token storage internally (uses localStorage by default in browser environments).
- **FR-AUTH-26:** All API calls must include the current JWT via: `const { data: { session } } = await supabase.auth.getSession(); const headers = { Authorization: \`Bearer ${session.access_token}\` };`
- **FR-AUTH-27:** Server-side session revocation is available via `supabase.auth.admin.signOut(userId)` (requires `SUPABASE_SERVICE_ROLE_KEY`). This is not an automated flow — it is an operator action available via the Supabase dashboard or a future admin panel action.
- **FR-AUTH-28:** The logout action must call `supabase.auth.signOut()`, which invalidates the session on both client and server (Supabase revokes the refresh token server-side).

---

### 6.2 File Storage & Security (Functional Requirements)

#### Supabase Storage Bucket Configuration

- **FR-STOR-01:** A private Supabase Storage bucket named `order-files` must be created. Private means no public access — all reads require either a signed URL or a service-role key. This is configured in the Supabase Storage dashboard.
- **FR-STOR-02:** The bucket must enforce a maximum file size of 500 MB per object (matching the existing multer limit).
- **FR-STOR-03:** The storage object path pattern must be `{user_id}/{order_id}/{filename}`, where `user_id` is the UUID from `auth.users.id`. This pattern enables RLS policies to enforce user-level access based on the path prefix.
- **FR-STOR-04:** All objects in the `order-files` bucket are encrypted at rest using AES-256 (Supabase default — no additional configuration required).

#### Row-Level Security on Storage

- **FR-STOR-05:** A storage RLS INSERT policy must permit authenticated users to upload objects only when: the path prefix matches their own `auth.uid()`, AND a valid order record exists in `qb_orders` that the user owns (verified via a subquery). Unauthenticated uploads must be rejected.
- **FR-STOR-06:** A storage RLS SELECT policy must permit file downloads only when: (a) the authenticated user's UUID matches the `user_id` path prefix in the object path (customer accessing own files), OR (b) the user's `qb_users.role = 'operator'` (operator accessing any file). No other access is permitted.
- **FR-STOR-07:** The storage bucket must have no public SELECT policy. Any unauthenticated request for an object must return a 403 error.

#### Upload Flow

- **FR-STOR-08:** File upload must be processed through the Express API (recommended approach for launch simplicity). The customer submits the file to `POST /api/qb/orders/:id/files/upload`. The API validates the file (magic bytes, size, MIME type), then streams the file to Supabase Storage using the service-role key. The storage path is recorded in `qb_order_files.storage_path`.
- **FR-STOR-09:** The upload token that authorizes a specific order's file upload must be passed in the request body or as a request header — NOT as a URL query parameter. This eliminates the current vulnerability where tokens appear in server access logs and browser history.
- **FR-STOR-10:** The `qb_order_files` table's `storage_path` column must store the Supabase Storage object path (e.g., `{user_id}/{order_id}/input.qbm`) rather than a local filesystem path.
- **FR-STOR-11:** An `expired` boolean column must exist on `qb_order_files` (default `false`). When the auto-deletion cron runs and deletes a file from storage, this column is set to `true` and `storage_path` is set to `NULL`.

#### Download Flow

- **FR-STOR-12:** Customer file download must be handled by `GET /api/qb/orders/:id/files/:fileId/download`. The backend verifies the authenticated user owns the order, then generates a signed URL via `supabase.storage.from('order-files').createSignedUrl(path, 3600)` (1-hour expiry). The API returns the signed URL; the frontend redirects the browser to it. The signed URL is never stored or logged.
- **FR-STOR-13:** Operator file download must follow the same signed URL pattern via the admin API route `GET /api/admin/orders/:id/files/:fileId`. The `requireOperator` middleware gates this route. Signed URL expiry is 15 minutes for operator downloads (shorter, given admin context).
- **FR-STOR-14:** No file must ever be served by streaming through the Express API (i.e., no `res.pipe(fileStream)` pattern for storage files). All files must be served via Supabase Storage signed URLs, keeping the Express API stateless.

#### QBM Magic Byte Validation

- **FR-STOR-15:** All uploaded files must be validated for format authenticity before writing to storage. QBM files are OLE2 Compound Binary Format. The first 4 bytes of the file must be `D0 CF 11 E0` (the OLE2 magic bytes). Files that fail this check must be rejected with `400 Bad Request` and an error message: `"The uploaded file does not appear to be a valid QuickBooks backup file (.QBM). Please verify the file and try again."` The file must not be written to storage.
- **FR-STOR-16:** Extension checking alone (`.qbm`) is not sufficient and must not be the sole validation mechanism.

#### Auto-Deletion (7-Day Retention)

- **FR-STOR-17:** A `pg_cron` job must be scheduled in Supabase to run daily at 3:00 AM UTC. The job deletes all objects from the `order-files` bucket where `storage.objects.created_at < NOW() - INTERVAL '7 days'`, and simultaneously updates `qb_order_files` to set `expired = true` and `storage_path = NULL` for the corresponding records. See Section 8 for the SQL.
- **FR-STOR-18:** After 7-day expiry, if a customer attempts to download their file, the system must return a clear error message: `"This file has expired and has been deleted per our 7-day retention policy. If you need your files re-processed, please contact support."` The download button must be replaced with an expired state indicator in the customer portal.

#### Database Schema for Storage

- **FR-STOR-19:** The `qb_order_files` table must be updated: `storage_path` column type remains `text` but now stores Supabase Storage paths; add `expired boolean DEFAULT false`; add `deleted_at timestamptz` (set by the cron when the file is purged).

---

### 6.3 Web Application Security (Functional Requirements)

#### Security Headers (Helmet)

- **FR-WEB-01:** The `helmet` npm package must be added as the first middleware in `app.ts` before any route handling. Helmet must be configured with:
  - `Content-Security-Policy`: `default-src 'self'`; `script-src 'self' https://js.stripe.com https://*.supabase.co`; `connect-src 'self' https://*.supabase.co https://api.stripe.com`; `frame-src https://js.stripe.com https://hooks.stripe.com`; `img-src 'self' data: https:`; `style-src 'self' 'unsafe-inline'` (required for Tailwind inline styles).
  - `X-Frame-Options: DENY` — prevents the portal from being embedded in an iframe (clickjacking protection).
  - `X-Content-Type-Options: nosniff` — prevents browsers from MIME-sniffing responses away from the declared Content-Type.
  - `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer information sent to third parties.
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` — enforces HTTPS for 1 year (production only; disabled in development to allow `http://localhost`).
  - `X-XSS-Protection: 0` — explicitly disables the legacy XSS auditor filter, which can cause issues; CSP provides the actual protection.

#### CORS Lockdown

- **FR-WEB-02:** The current open CORS configuration (`cors({ credentials: true, origin: true })`) must be replaced with an explicit allowlist:
  ```
  cors({
    credentials: true,
    origin: [
      'https://nexfortis.com',
      'https://www.nexfortis.com',
      'https://qb.nexfortis.com',
      process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
    ].filter(Boolean),
  })
  ```
- **FR-WEB-03:** Any cross-origin request from an origin not on the allowlist must receive a CORS error and no response body. This must be enforced by the `cors` middleware, not by application route logic.

#### Rate Limiting

- **FR-WEB-04:** `express-rate-limit` must be applied as a global middleware covering all API routes. The global rate limit is 100 requests per 15-minute window per IP address. Response on limit: `429 Too Many Requests`.
- **FR-WEB-05:** A tighter rate limit must be applied to the checkout endpoints (`POST /api/qb/checkout/*`): 10 requests per 15-minute window per IP address.
- **FR-WEB-06:** A tighter rate limit must be applied to order creation (`POST /api/qb/orders`): 10 requests per 15-minute window per authenticated user ID (not IP, to correctly identify the user even behind a shared NAT).
- **FR-WEB-07:** Support ticket creation (`POST /api/qb/support-tickets`) must be limited to 5 requests per 15-minute window per authenticated user ID.
- **FR-WEB-08:** The contact form endpoint (`POST /api/contact`) must be limited to 3 requests per 15-minute window per IP address.
- **FR-WEB-09:** Supabase Auth endpoints (login, register, password reset, MFA) are rate-limited natively by Supabase. No additional rate limiting on these endpoints is required from the Express application. The Express backend does not proxy these calls.
- **FR-WEB-10:** Rate limit implementation uses `express-rate-limit` with an in-memory store at launch. If future load requires multi-instance deployments, this must be upgraded to a Redis-backed store.

#### CSRF Mitigation

- **FR-WEB-11:** By migrating from cookie-based session tokens to JWTs in the `Authorization: Bearer` header, CSRF risk is substantially eliminated. A cross-origin malicious website cannot programmatically include a custom `Authorization` header in a cross-origin request — this is blocked by the browser's CORS policy.
- **FR-WEB-12:** Any remaining cookies in the application (e.g., if any cookie-based flows exist for non-auth purposes) must be set with `SameSite=Strict` and `HttpOnly` attributes.
- **FR-WEB-13:** State-changing API requests must be verified to have the `Authorization` header present, not just a valid session cookie. This is enforced by the `requireAuth` middleware.

#### Stripe Webhook Signature Verification

- **FR-WEB-14:** The Stripe webhook handler (`POST /api/webhooks/stripe`) must verify every incoming webhook using `stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)`. If verification fails (signature mismatch or timestamp tolerance exceeded), the handler must return `400 Bad Request` and not process the event.
- **FR-WEB-15:** The webhook handler must receive the raw request body (not parsed JSON) for signature verification. The `express.json()` body parser must NOT be applied to the webhook route. Use `express.raw({ type: 'application/json' })` for this route specifically.
- **FR-WEB-16:** `STRIPE_WEBHOOK_SECRET` must be set as an environment variable in both development (Stripe test webhook signing secret) and production (Stripe live webhook signing secret) environments.

#### Input Validation Hardening

- **FR-WEB-17:** All request bodies must be limited to 1 MB via `express.json({ limit: '1mb' })` and `express.urlencoded({ limit: '1mb', extended: true })`. This prevents JSON body size attacks.
- **FR-WEB-18:** All free-text input fields that may ever be rendered in HTML (ticket descriptions, order notes, support replies, names) must be sanitized server-side to strip or escape HTML tags before persistence. This prevents stored XSS if an operator-rendered view ever reflects customer input.
- **FR-WEB-19:** The Drizzle ORM parameterizes all SQL queries by construction. Application code must not concatenate user-supplied values into raw SQL strings. Any raw SQL usage must be audited and removed or replaced with parameterized queries.
- **FR-WEB-20:** File upload validation must check: file magic bytes (FR-STOR-15), MIME type (must be `application/octet-stream` or map to a `.qbm` file), and file size (must not exceed 500 MB). These checks must occur before the file is written to storage.

#### Logging and Monitoring

- **FR-WEB-21:** The application must log all authentication failures: failed login attempts (including the email attempted, but NOT the password), `401` responses from the `requireAuth` middleware, and `403` responses from the `requireOperator` middleware. Logs must include timestamp, endpoint, IP address, and user ID (if available from the JWT).
- **FR-WEB-22:** The application must log all file access events: file uploads (user ID, order ID, file size, outcome), signed URL generations (user ID, order ID, file path), and auto-deletion events.
- **FR-WEB-23:** The application must log all admin actions: any request handled by the `requireOperator` middleware, including endpoint, operator user ID, and HTTP status code.
- **FR-WEB-24:** Logs must NEVER contain: passwords, JWTs, Stripe secret keys, Supabase service role keys, file contents, or any PII beyond email address.

---

### 6.4 Non-Functional Requirements

- **NFR-01 — JWT Verification Latency:** JWT verification via `supabase.auth.getUser(token)` must add no more than 100ms overhead per request on authenticated API routes. If latency exceeds this under load, switch to local JWT verification using the Supabase project's JWT secret (avoids a round-trip to Supabase Auth).
- **NFR-02 — Supabase Free Tier Constraints:** The Supabase free tier allows 500 MB database storage, 1 GB file storage, and 50,000 monthly active users. At current projected volume (< 100 users at launch), these limits are not a concern. Alert thresholds should be set at 80% of limits.
- **NFR-03 — Supabase Service Reliability:** Supabase is an external dependency. The Supabase hosted platform offers a 99.9% monthly uptime SLA on paid plans. At free tier, no formal SLA is guaranteed. A Supabase outage would prevent all logins, file uploads, and file downloads. This risk is accepted at launch — see Section 11.
- **NFR-04 — PIPEDA Compliance:** Under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), NexFortis must: (a) limit data collection to what is necessary for the stated purpose; (b) protect personal information with appropriate safeguards; (c) retain data only as long as necessary. This feature directly addresses (b) and (c): AES-256 encryption satisfies "appropriate safeguards" for the sensitivity of QBM file contents, and the 7-day auto-deletion cron satisfies "retain only as long as necessary." The privacy policy at nexfortis.com must state the 7-day retention period for uploaded files.
- **NFR-05 — No Impact on Accessibility:** This feature does not modify the portal's visual UI beyond the login/register pages (new Google/Microsoft buttons) and the MFA challenge/enrollment screens. New UI elements must meet WCAG 2.1 AA standards. Social login buttons must have descriptive ARIA labels (e.g., `aria-label="Sign in with Google"`). MFA input fields must be labeled and keyboard-navigable.
- **NFR-06 — Environment Parity:** Development (Replit) and production (Render) must have complete environment parity for the Supabase configuration. Both environments point to separate Supabase projects (dev and production). All secrets must be environment variables — no hardcoded values. See Section 8.5 for the full environment variable specification.
- **NFR-07 — Zero Trust on Client-Side Role Claims:** The application must NEVER trust role claims sent from the frontend in request bodies or custom headers. Role determination must always come from the database (`qb_users.role`) after verifying the JWT. A customer cannot elevate their own privilege by sending `{ "role": "operator" }` in a request body.
- **NFR-08 — Signed URL Non-Persistence:** Generated signed URLs for file downloads must not be stored in the database or logged in plaintext. They are ephemeral — generated on demand and returned directly to the requesting client.
- **NFR-09 — Tech Stack Consistency:** All changes must remain within the existing stack: React 19 + Vite 7 + Tailwind v4 on the frontend; Express 5 + Drizzle ORM on the backend; Supabase (PostgreSQL) as the database. No new frameworks are introduced.

---

## 7. Acceptance Criteria

### AC-AUTH-01: Customer Email Registration

- Given: A new visitor navigates to `/register`
- When: They fill in name, email, password (meets complexity requirements), and phone, then submit
- Then:
  - [ ] `supabase.auth.signUp` is called with the provided credentials
  - [ ] A new record is created in `auth.users` (Supabase internal table)
  - [ ] The `on_auth_user_created` trigger fires and inserts a row in `qb_users` with `role = 'customer'`, correct email, name, and phone
  - [ ] The `qb_users` row's `id` is a UUID matching the `auth.users.id` for this user
  - [ ] No `password_hash` column exists in `qb_users` — password is stored exclusively by Supabase
  - [ ] The user is redirected to the portal home or a post-registration page
  - [ ] A weak password (< 8 characters or missing complexity) returns a validation error before submission

---

### AC-AUTH-02: Customer Google Login

- Given: A customer on the login page clicks \"Continue with Google\"
- When: They authenticate with their Google account
- Then:
  - [ ] `supabase.auth.signInWithOAuth({ provider: 'google' })` initiates the OAuth redirect flow
  - [ ] Google authenticates the user and redirects back to `/auth/callback`
  - [ ] The `/auth/callback` route completes the Supabase OAuth flow
  - [ ] If this is a new user, a `qb_users` profile row is created via the `on_auth_user_created` trigger with name populated from Google profile
  - [ ] If this is a returning user, the existing `qb_users` profile is retrieved
  - [ ] The user is issued a Supabase JWT access token and refresh token
  - [ ] The user is redirected to the portal home
  - [ ] No duplicate `qb_users` record is created if the user signs in via Google multiple times

---

### AC-AUTH-03: Customer Microsoft Login

- Given: A customer on the login page clicks \"Continue with Microsoft\"
- When: They authenticate with their Microsoft / Azure AD account
- Then:
  - [ ] `supabase.auth.signInWithOAuth({ provider: 'azure' })` initiates the OAuth redirect flow
  - [ ] Microsoft authenticates the user and redirects back to `/auth/callback`
  - [ ] Identical profile creation/retrieval behavior as AC-AUTH-02
  - [ ] Accountant using Microsoft 365 organizational account successfully authenticates

---

### AC-AUTH-04: Password Reset Flow

- Given: A customer visits `/forgot-password` and submits their registered email
- When: The reset flow executes
- Then:
  - [ ] `supabase.auth.resetPasswordForEmail(email)` is called
  - [ ] Supabase sends a password reset email to the address (if it exists in `auth.users`)
  - [ ] The email contains a reset link that is valid for 1 hour (Supabase default; configurable in dashboard)
  - [ ] Clicking the reset link allows the user to set a new password via `supabase.auth.updateUser({ password: newPassword })`
  - [ ] After password reset, the user is able to log in with the new password
  - [ ] Submitting a non-existent email shows the same success message as a real email (no user enumeration)
  - [ ] The `qb_password_resets` table no longer exists in the database

---

### AC-AUTH-05: Customer Logout

- Given: An authenticated customer is on any portal page and clicks \"Log Out\"
- When: The logout action executes
- Then:
  - [ ] `supabase.auth.signOut()` is called
  - [ ] The Supabase session is invalidated server-side (refresh token revoked)
  - [ ] The Supabase client clears its local session storage
  - [ ] The user is redirected to the login page
  - [ ] Attempting to replay the old JWT on a protected API endpoint returns `401 Unauthorized`
  - [ ] The browser's localStorage contains no `qb_token` key (legacy token storage removed)

---

### AC-AUTH-06: API Authentication Enforcement

- Given: A protected API endpoint (e.g., `GET /api/qb/orders`) is called
- When: The request arrives at the server
- Then:
  - [ ] A request with no `Authorization` header returns `401 Unauthorized`
  - [ ] A request with a malformed JWT returns `401 Unauthorized`
  - [ ] A request with an expired JWT (access token past 1-hour expiry, no valid refresh) returns `401 Unauthorized`
  - [ ] A request with a valid customer JWT returns the expected data with `200 OK`
  - [ ] A request where the JWT `sub` claim does not match any UUID in `qb_users` returns `401 Unauthorized`

---

### AC-AUTH-07: Operator MFA Enrollment

- Given: The operator account exists in Supabase Auth with `role = 'operator'` in `qb_users`, but no TOTP factor has been enrolled
- When: Hassan logs in with his email and password for the first time
- Then:
  - [ ] Login succeeds at AAL1 (first factor verified)
  - [ ] Frontend detects `nextLevel === 'aal2'` and `currentLevel === 'aal1'`
  - [ ] User is redirected to MFA enrollment screen before accessing any admin content
  - [ ] MFA enrollment screen displays a QR code from `supabase.auth.mfa.enroll({ factorType: 'totp' })`
  - [ ] Hassan scans the QR code with Google Authenticator or Authy
  - [ ] Entering the correct 6-digit TOTP code via `supabase.auth.mfa.challengeAndVerify()` activates the factor
  - [ ] Session is upgraded to AAL2 after successful verification
  - [ ] Hassan is redirected to `/admin` and admin content renders
  - [ ] Navigating to `/admin/orders` (or any admin subroute) is accessible without re-entering the TOTP code within the session

---

### AC-AUTH-08: Operator MFA Challenge (Subsequent Logins)

- Given: The operator has an enrolled TOTP factor
- When: Hassan logs in with email+password
- Then:
  - [ ] After password verification, the frontend detects `nextLevel === 'aal2'` and `currentLevel !== 'aal2'`
  - [ ] Hassan is immediately redirected to the MFA challenge screen — no admin content is visible
  - [ ] Entering an incorrect TOTP code returns an error and does not upgrade the session
  - [ ] Entering the correct TOTP code upgrades the session to AAL2
  - [ ] Hassan can access `/admin` after successful MFA

---

### AC-AUTH-09: Admin Route MFA Enforcement

- Given: Various users are authenticated and attempt to access `/admin`
- When: The routes are resolved
- Then:
  - [ ] An unauthenticated user (no session) navigating to `/admin` is redirected to `/login`
  - [ ] A customer (AAL1, `role = 'customer'`) navigating to `/admin` is redirected to the portal home — no admin UI renders, even briefly
  - [ ] The operator at AAL1 only (password verified, MFA not yet complete) navigating to `/admin` is redirected to the MFA challenge screen — no admin UI renders
  - [ ] The operator at AAL2 (both factors verified) navigating to `/admin` sees the admin panel
  - [ ] A direct fetch by a customer to `GET /api/admin/orders` returns `403 Forbidden`
  - [ ] A direct fetch by an unauthenticated client to `GET /api/admin/orders` returns `401 Unauthorized`
  - [ ] A direct fetch by the operator at AAL1 (MFA not complete) to `GET /api/admin/orders` returns `403 Forbidden` with `{ error: 'mfa_required' }`
  - [ ] A direct fetch by the operator at AAL2 to `GET /api/admin/orders` returns `200 OK`

---

### AC-AUTH-10: Cross-User Data Isolation

- Given: Customer A and Customer B both have accounts and active orders
- When: Customer A's authenticated session attempts to access Customer B's resources
- Then:
  - [ ] `GET /api/qb/orders` returns only Customer A's orders — no orders belonging to Customer B
  - [ ] `GET /api/qb/orders/{B's order ID}` returns `403 Forbidden` or `404 Not Found`
  - [ ] `GET /api/qb/orders/{B's order ID}/files/{fileId}/download` returns `403 Forbidden`
  - [ ] A direct Supabase Storage signed URL request for Customer B's file path (even if guessed) returns `403 Forbidden` — RLS policy enforces this at the storage layer
  - [ ] `GET /api/qb/support-tickets` returns only Customer A's support tickets

---

### AC-STOR-01: File Upload to Supabase Storage

- Given: A customer has a completed, paid order and navigates to the file upload screen
- When: They upload a valid `.QBM` file (file begins with `D0 CF 11 E0` magic bytes, size < 500 MB)
- Then:
  - [ ] The file is streamed through the Express API to Supabase Storage
  - [ ] The file is stored at path `{user_id}/{order_id}/{filename}` in the `order-files` bucket
  - [ ] The upload token is transmitted in the request header or body — NOT as a URL query parameter (`?token=...`)
  - [ ] `qb_order_files.storage_path` is set to the Supabase Storage path (not a filesystem path)
  - [ ] `qb_order_files.expired` is `false`
  - [ ] The file is NOT present anywhere on the Express server's local filesystem after upload
  - [ ] The customer portal shows a \"File received\" confirmation

---

### AC-STOR-02: Invalid File Rejection

- Given: A customer attempts to upload a file that is NOT a valid QBM file
- When: The upload is submitted (e.g., a `.zip` file renamed to `.qbm`, or any file whose first 4 bytes are not `D0 CF 11 E0`)
- Then:
  - [ ] The file is rejected with `400 Bad Request` before being written to Supabase Storage
  - [ ] The error message displayed to the customer is: `"The uploaded file does not appear to be a valid QuickBooks backup file (.QBM). Please verify the file and try again."`
  - [ ] No partial file data is written to storage
  - [ ] `qb_order_files` contains no new record for this failed upload attempt

---

### AC-STOR-03: Customer File Download (Signed URL)

- Given: A customer has an order with an uploaded, non-expired file
- When: The customer clicks \"Download\" for a file in their order detail view
- Then:
  - [ ] The frontend calls `GET /api/qb/orders/:id/files/:fileId/download`
  - [ ] The backend verifies the customer owns the order
  - [ ] A signed URL is generated with a 1-hour expiry via `supabase.storage.from('order-files').createSignedUrl(path, 3600)`
  - [ ] The signed URL is returned to the frontend and the browser redirects to it, initiating the download
  - [ ] The download URL is not a permanent, guessable path — it contains a signed token
  - [ ] Using the same signed URL more than 1 hour after generation returns an error (URL expired)
  - [ ] Attempting to access another customer's signed URL path (e.g., by modifying the user_id prefix) returns `403 Forbidden` from Supabase Storage

---

### AC-STOR-04: File Auto-Deletion After 7 Days

- Given: A file was uploaded 8 days ago (past the 7-day retention period)
- When: The daily `pg_cron` job runs at 3:00 AM UTC
- Then:
  - [ ] The object is deleted from the `order-files` Supabase Storage bucket
  - [ ] `qb_order_files.storage_path` is set to `NULL` for the corresponding record
  - [ ] `qb_order_files.expired` is set to `true`
  - [ ] `qb_order_files.deleted_at` is set to the deletion timestamp
  - [ ] A customer attempting to download an expired file sees: `"This file has expired and has been deleted per our 7-day retention policy."`
  - [ ] The download button in the customer portal is replaced with an expired state indicator
  - [ ] Files uploaded 6 days ago are NOT deleted in the same cron run

---

### AC-WEB-01: Security Headers Present

- Given: Any request is made to the Express API or the QB Portal frontend (for headers set at the proxy/CDN level)
- When: The response headers are inspected
- Then:
  - [ ] `X-Frame-Options: DENY` is present
  - [ ] `X-Content-Type-Options: nosniff` is present
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin` is present
  - [ ] `Strict-Transport-Security` header is present on production (Render) with `max-age=31536000; includeSubDomains`
  - [ ] `Content-Security-Policy` header is present and restricts `script-src` to `'self'`, `https://js.stripe.com`, and `https://*.supabase.co`
  - [ ] `X-XSS-Protection: 0` is present (explicitly disabling legacy filter)
  - [ ] No header contains the Express.js version or server identifier (`X-Powered-By` must be removed)

---

### AC-WEB-02: CORS Enforcement

- Given: An API request arrives at the Express server
- When: The request originates from various origins
- Then:
  - [ ] A request from `https://qb.nexfortis.com` receives a valid CORS response
  - [ ] A request from `https://nexfortis.com` receives a valid CORS response
  - [ ] A request from `https://www.nexfortis.com` receives a valid CORS response
  - [ ] A request from `http://localhost:5173` receives a valid CORS response in development (`NODE_ENV=development`)
  - [ ] A request from `http://localhost:5173` in production (`NODE_ENV=production`) is rejected with a CORS error
  - [ ] A request from an attacker's domain (e.g., `https://evil.com`) is rejected with a CORS error and returns no response body
  - [ ] A request from any other unlisted domain returns a CORS error

---

### AC-WEB-03: Rate Limiting

- Given: Various clients make API requests
- When: The request rate is exceeded
- Then:
  - [ ] The 11th checkout request (`POST /api/qb/checkout/*`) from the same IP within 15 minutes returns `429 Too Many Requests`
  - [ ] The 101st generic API request from the same IP within 15 minutes returns `429 Too Many Requests`
  - [ ] The 4th contact form submission (`POST /api/contact`) from the same IP within 15 minutes returns `429 Too Many Requests`
  - [ ] The 6th support ticket submission from the same user within 15 minutes returns `429 Too Many Requests`
  - [ ] After the rate limit window resets, the same IP/user can make requests again
  - [ ] Rate limiting does not affect requests from different IPs — one IP being throttled does not impact another IP's quota
  - [ ] A `Retry-After` header is included in all `429` responses

---

### AC-WEB-04: Stripe Webhook Integrity

- Given: The Stripe webhook endpoint (`POST /api/webhooks/stripe`) receives events
- When: Various payloads are submitted
- Then:
  - [ ] A legitimate Stripe event (with valid `Stripe-Signature` header) is processed normally and returns `200 OK`
  - [ ] A request with a missing `Stripe-Signature` header returns `400 Bad Request` and the event is NOT processed
  - [ ] A request with an incorrect/forged `Stripe-Signature` header returns `400 Bad Request` and the event is NOT processed
  - [ ] A manually crafted `payment_intent.succeeded` payload with a fake signature does NOT trigger order fulfillment
  - [ ] The raw request body (un-parsed) is used for signature verification, not the parsed JSON object

---

### AC-WEB-05: No Plaintext Credentials in Storage

- Given: Any user account exists in the system
- When: The `qb_users` table is queried
- Then:
  - [ ] The `qb_users` table has no `password_hash` column
  - [ ] No password-related data exists in any application-managed table
  - [ ] The `qb_password_resets` table does not exist
  - [ ] Supabase's `auth.users` table (managed by Supabase, not the application) contains hashed credentials — the application has no direct read access to this table via the anon key

---

### AC-WEB-06: Environment Variable Security

- Given: The application is running in production on Render
- When: The environment is inspected
- Then:
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` is set as a Render environment variable and is NOT present in any committed code or `.env` file in the repository
  - [ ] `SUPABASE_ANON_KEY` is the only Supabase key present in the frontend build (`VITE_SUPABASE_ANON_KEY`) — the service role key is never exposed to the browser
  - [ ] `QB_TOKEN_SECRET` is removed from all environment configurations
  - [ ] `STRIPE_WEBHOOK_SECRET` is set in Render environment variables
  - [ ] Running `grep -r "service_role" ./artifacts` returns no matches in application source code

---

## 8. Technical Architecture

### 8.1 Auth Flow (After Redesign)

```
Customer Browser
  │
  ├─ Sign up / Log in ──────────────► Supabase Auth (hosted)
  │   (email+password, Google,          ├─ Password hashing (Argon2)
  │    Microsoft)                       ├─ Social OAuth flow
  │                                     ├─ MFA TOTP challenge (operator)
  │                                     ├─ Built-in rate limiting
  │                                     └─ Returns JWT (1h) + refresh token
  │
  ├─ JWT in Authorization header ──► Express API Server
  │   Bearer <access_token>            ├─ Validates JWT (Supabase public key)
  │                                    ├─ Looks up qb_users by UUID → role
  │                                    ├─ requireAuth: any authenticated user
  │                                    ├─ requireOperator: role=operator + AAL2
  │                                    └─ Processes request, returns response
  │
  └─ File upload/download ──────────► Supabase Storage
      (via Express API proxy)           ├─ Private bucket: order-files
                                        ├─ RLS: customer → own files only
                                        ├─ RLS: operator → all files
                                        ├─ AES-256 encryption at rest
                                        ├─ Signed download URLs (1h expiry)
                                        └─ pg_cron auto-delete after 7 days

OAuth Flow (Social Login):
  Customer Browser
    │
    ├─ signInWithOAuth(provider) ────► Browser redirect to Google/Microsoft
    │                                  │
    │                              Google/Microsoft authenticates
    │                                  │
    └─ Redirect to /auth/callback ◄── Authorization code returned
          │
          └─ supabase.auth.exchangeCodeForSession() → JWT issued
                │
                └─ on_auth_user_created trigger (if new user) → qb_users row
```

### 8.2 Database Schema Changes

#### `qb_users` Table Migration

```sql
-- Step 1: Remove password_hash column (Supabase manages this now)
ALTER TABLE public.qb_users DROP COLUMN IF EXISTS password_hash;

-- Step 2: Change primary key from serial integer to UUID
-- (Requires recreating the table with UUID PK and migrating FK references)
-- At launch, existing test accounts are recreated — no data migration needed.

-- Final schema:
CREATE TABLE public.qb_users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  name        text NOT NULL DEFAULT '',
  phone       text,
  role        text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'operator')),
  created_at  timestamptz DEFAULT now() NOT NULL
);
```

#### Foreign Key Updates

```sql
-- qb_orders.user_id: integer → uuid
ALTER TABLE public.qb_orders
  ALTER COLUMN user_id TYPE uuid USING user_id::text::uuid;

-- qb_support_tickets.user_id: integer → uuid
ALTER TABLE public.qb_support_tickets
  ALTER COLUMN user_id TYPE uuid USING user_id::text::uuid;

-- qb_password_resets: remove entirely
DROP TABLE IF EXISTS public.qb_password_resets;
```

#### `qb_order_files` Table Changes

```sql
ALTER TABLE public.qb_order_files
  -- storage_path now holds Supabase Storage paths, not filesystem paths
  -- Column type remains text, but semantics change
  ADD COLUMN IF NOT EXISTS expired boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
```

#### Profile Creation Trigger

```sql
-- Automatically creates a qb_users profile for every new Supabase Auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.qb_users (id, email, name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Row-Level Security Policies

```sql
-- Enable RLS on all qb tables
ALTER TABLE public.qb_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qb_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qb_order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qb_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qb_waitlist_signups ENABLE ROW LEVEL SECURITY;

-- qb_users: user can read/update own profile; operator can read all
CREATE POLICY "users_own_profile" ON public.qb_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON public.qb_users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "operator_read_all_users" ON public.qb_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );

-- qb_orders: customer sees own orders; operator sees all
CREATE POLICY "customer_own_orders" ON public.qb_orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "customer_insert_order" ON public.qb_orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "operator_all_orders" ON public.qb_orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );

-- qb_order_files: customer sees own files (via order ownership); operator sees all
CREATE POLICY "customer_own_order_files" ON public.qb_order_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qb_orders o
      WHERE o.id = qb_order_files.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "operator_all_order_files" ON public.qb_order_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );

-- qb_support_tickets: customer sees own tickets; operator sees all
CREATE POLICY "customer_own_tickets" ON public.qb_support_tickets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "customer_insert_ticket" ON public.qb_support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "operator_all_tickets" ON public.qb_support_tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );

-- qb_waitlist_signups: authenticated users can insert; operator reads all
CREATE POLICY "authenticated_insert_waitlist" ON public.qb_waitlist_signups
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "operator_read_waitlist" ON public.qb_waitlist_signups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );
```

### 8.3 Storage Architecture

#### Bucket Configuration (Supabase Dashboard)

| Setting | Value |
|---------|-------|
| Bucket name | `order-files` |
| Public | `false` (private bucket) |
| Max file size | 500 MB |
| Allowed MIME types | `application/octet-stream` (QBM files) |
| Encryption | AES-256 (default — no additional configuration) |

#### Storage RLS Policies

```sql
-- Storage bucket RLS (applied to storage.objects table)

-- Customers: upload to own path prefix only
CREATE POLICY "customer_upload_own_files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'order-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND EXISTS (
      SELECT 1 FROM public.qb_orders o
      WHERE o.id::text = (storage.foldername(name))[2]
      AND o.user_id = auth.uid()
    )
  );

-- Customers: download own files only
CREATE POLICY "customer_download_own_files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'order-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Operator: full access to all files
CREATE POLICY "operator_full_storage_access"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'order-files'
    AND EXISTS (
      SELECT 1 FROM public.qb_users u
      WHERE u.id = auth.uid() AND u.role = 'operator'
    )
  );
```

#### Auto-Deletion Cron Job

```sql
-- Enable pg_cron extension (done once in Supabase dashboard)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily deletion of files older than 7 days
SELECT cron.schedule(
  'delete-expired-order-files',
  '0 3 * * *',  -- 3:00 AM UTC daily
  $$
    -- Delete objects from Supabase Storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'order-files'
    AND created_at < NOW() - INTERVAL '7 days';

    -- Mark the corresponding order file records as expired
    UPDATE public.qb_order_files
    SET
      storage_path = NULL,
      expired = true,
      deleted_at = NOW()
    WHERE created_at < NOW() - INTERVAL '7 days'
    AND storage_path IS NOT NULL
    AND expired = false;
  $$
);
```

### 8.4 Middleware Stack (Backend `app.ts`)

The Express middleware stack must be ordered as follows:

```
1. helmet({ ... })                  — Security headers (first — applied before anything else)
2. cors({ origin: [...] })          — CORS lockdown (before body parsing)
3. express.raw({ type: 'application/json' })  — For /api/webhooks/stripe ONLY (before json parser)
4. express.json({ limit: '1mb' })   — JSON body parser (all other routes)
5. express.urlencoded({ limit: '1mb', extended: true })
6. cookieParser()
7. rateLimit({ ... })               — Global rate limit (after body parsing)
8. [route-level rate limits]        — Applied per-route on checkout, orders, tickets, contact
9. requireAuth / requireOperator    — JWT verification (per-route or router-level)
```

**Critical note:** The Stripe webhook route must be registered BEFORE `express.json()` is applied globally, or it must use a route-specific `express.raw()` middleware. The raw body is required for `stripe.webhooks.constructEvent()` to verify the signature — parsing the body as JSON first invalidates the signature check.

### 8.5 Environment Variables

#### Production (Render)

| Variable | Description | Exposed to frontend? |
|----------|-------------|---------------------|
| `SUPABASE_URL` | Supabase project URL (production project) | No (server-only) |
| `SUPABASE_ANON_KEY` | Supabase public anon key | Via `VITE_SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (full access) | **Never** — server-only |
| `STRIPE_SECRET_KEY` | Live Stripe secret key | No |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (live) | No |
| `NODE_ENV` | `production` | No |

#### Development (Replit)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Dev Supabase project URL (separate project from production) |
| `SUPABASE_ANON_KEY` | Dev Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Dev Supabase service role key |
| `STRIPE_SECRET_KEY` | Stripe test secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe test webhook signing secret |
| `NODE_ENV` | `development` |

**Removed variables:**
- `QB_TOKEN_SECRET` — no longer needed; Supabase manages all token signing

#### Frontend (Vite)

Only variables prefixed with `VITE_` are exposed in the frontend bundle:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key (safe for client) |

The `SUPABASE_SERVICE_ROLE_KEY` must never appear in the Vite build. Any Vite bundle analysis should confirm this key is absent.

### 8.6 Migration Path

#### Existing Users

At the time of this security migration, the QB Portal has minimal existing users (predominantly test accounts created during development). The migration approach is:

1. Create the new `qb_users` table with UUID primary key in Supabase (replacing the integer-PK version).
2. Seed the operator account via the Supabase Admin API script.
3. All test accounts are recreated from scratch — no complex data migration is performed.
4. Production has no real customer accounts yet, so no customer data migration is needed.

#### Operator Seeding Script

The seed script is updated to use the Supabase Admin API instead of direct database insertion with bcrypt hashing. The script remains idempotent:

1. Check if a user with the operator email exists in `auth.users` via `supabase.auth.admin.listUsers()`.
2. If not exists: create via `supabase.auth.admin.createUser({ email, password, email_confirm: true })`.
3. Upsert the `qb_users` profile: `INSERT INTO qb_users (id, email, name, role) VALUES (...) ON CONFLICT (id) DO UPDATE SET role = 'operator'`.

#### Replit Dev/Prod Split

Both development (Replit) and production (Render) use Supabase, but pointing to separate projects:

- **Development:** Points to a dev Supabase project. Dev secrets set as Replit-only secrets (not in `.env` file committed to the repository). Stripe test keys used.
- **Production (Render):** Points to the production Supabase project (Hassan's Supabase account). Production secrets set as Render environment variables. Live Stripe keys used.

The switch between environments is fully controlled by environment variables — no code changes are needed to deploy from dev to production.

---

## 9. Out of Scope

The following are explicitly excluded from this feature's implementation:

- **Email verification for customer accounts.** Email confirmation on sign-up is disabled at launch. It can be enabled in the Supabase Auth dashboard settings without any code changes. Deferred to reduce friction during initial customer acquisition.
- **Phone-based MFA (SMS OTP).** Only TOTP authenticator app MFA is implemented at launch. Phone-based MFA requires Twilio or a similar SMS provider integration and is a future enhancement.
- **Role-based access control beyond customer/operator.** The two-role model (`customer`, `operator`) is the complete authorization model at launch. Fine-grained permissions (e.g., read-only operator, ticket-only access, accounting access) are a future enhancement when a second staff member is onboarded.
- **Automated penetration testing.** Manual security review against the OWASP Top 10 checklist is performed as part of the Prompt 14 security verification pass. Automated pen testing (Burp Suite, OWASP ZAP automated scans) is not in scope at launch.
- **Web Application Firewall (WAF).** A WAF can be added at the Render level (via Cloudflare proxy) as a future enhancement. Not required for launch given the low initial traffic volume.
- **End-to-end encryption of QBM files.** AES-256 encryption at rest via Supabase Storage is sufficient for PIPEDA compliance given the threat model. End-to-end encryption (where only the customer holds the key) would prevent NexFortis from processing the files, defeating the purpose of the service.
- **MFA for customer accounts.** TOTP MFA is enforced only for the operator account at launch. Customer MFA (optional or required) is a future enhancement.
- **Session management UI for customers.** Customers cannot view or revoke their own active sessions via the portal. Supabase Admin dashboard can be used by the operator for session management. A customer-facing session management interface is a future enhancement.
- **Audit log for authentication events.** Supabase Auth provides a built-in auth log in the Supabase dashboard. A customer-visible login history or a custom `auth_audit_log` table in the application database is not implemented at launch.
- **IP allowlisting for admin access.** Restricting the `/admin` route to Hassan's home IP is not implemented — MFA provides sufficient second-factor protection for a mobile-user admin. IP allowlisting is a future hardening option.
- **Signed upload URLs (direct-to-Supabase upload).** The simpler Express-API-as-proxy upload approach is used at launch (FR-STOR-08). Signed upload URLs (bypassing the Express API for upload, as described in the spec's Section 5.2) are a future optimization to reduce server load during large file uploads.

---

## 10. Dependencies

Before implementation can begin, the following external setup must be completed:

### 10.1 Supabase Project Setup

- [ ] A production Supabase project must be created in Hassan's Supabase account.
- [ ] A separate development Supabase project must be created for Replit development.
- [ ] Auth settings configured in Supabase dashboard: email+password enabled, Google enabled (requires 10.2), Microsoft/Azure enabled (requires 10.3), PKCE auth flow enabled for OAuth (recommended for SPA), minimum password length and complexity configured.
- [ ] The `order-files` storage bucket created as a private bucket with 500 MB max file size.
- [ ] The `pg_cron` extension enabled in Supabase database settings.
- [ ] All RLS policies (Section 8.2) applied to both dev and production Supabase projects.
- [ ] The `on_auth_user_created` trigger function applied to both projects.
- [ ] The auto-deletion cron job scheduled (Section 8.3).

### 10.2 Google Cloud Console (OAuth for Google Login)

- [ ] A Google Cloud project must be created (or an existing one used) in the NexFortis Google account.
- [ ] OAuth 2.0 credentials (Client ID and Client Secret) created for a web application.
- [ ] Authorized redirect URIs must include:
  - `https://{your-supabase-project-ref}.supabase.co/auth/v1/callback` (production)
  - `https://{your-dev-supabase-project-ref}.supabase.co/auth/v1/callback` (development)
- [ ] Client ID and Client Secret registered in the Supabase Auth dashboard under Providers > Google.

### 10.3 Microsoft Azure AD (OAuth for Microsoft Login)

- [ ] An Azure Active Directory app registration must be created in the Microsoft Azure portal.
- [ ] Application (Client) ID and Client Secret must be generated.
- [ ] Authorized redirect URIs must include the same Supabase callback URLs as 10.2.
- [ ] Supported account types: `Accounts in any organizational directory and personal Microsoft accounts` (to support both business M365 accounts and personal Outlook/Hotmail accounts).
- [ ] Client ID and Client Secret registered in the Supabase Auth dashboard under Providers > Azure.

### 10.4 Render Deployment Configuration

- [ ] All production environment variables listed in Section 8.5 must be set in the Render service's environment settings before deployment.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` must be set as a secret environment variable in Render (not visible in dashboard after initial set).
- [ ] The Render service must be updated to use the new `SUPABASE_*` environment variables and remove `QB_TOKEN_SECRET`.

### 10.5 Stripe Webhook Reconfiguration

- [ ] The live Stripe webhook endpoint must be confirmed as pointing to `https://qb.nexfortis.com/api/webhooks/stripe` (or the Render deployment URL).
- [ ] The Stripe webhook signing secret (live) must be copied from the Stripe dashboard to the `STRIPE_WEBHOOK_SECRET` Render environment variable.

---

## 11. Risks

| Risk | Severity (1–5) | Likelihood (1–5) | Score | Mitigation |
|------|---------------|-----------------|-------|------------|
| **Supabase service outage prevents all logins and file access** | 4 | 2 | 8 (YELLOW) | Supabase offers 99.9% SLA on paid plans; free tier has no formal SLA. Accept at launch given low volume. Upgrade to paid plan when revenue justifies it. |
| **Social login misconfiguration (Google or Microsoft OAuth) exposes auth flow or creates duplicate accounts** | 3 | 2 | 6 (YELLOW) | Follow Supabase OAuth setup documentation exactly. Test both providers in dev before enabling in production. Verify redirect URIs are correct in all three locations (Google Cloud Console / Azure Portal / Supabase Dashboard). |
| **RLS policy gap allows cross-customer data access** | 5 | 2 | 10 (ORANGE) | Thorough RLS policy testing: test every table as (a) unauthenticated, (b) Customer A, (c) Customer B, (d) Operator. Test storage RLS by attempting to generate a signed URL for another user's file path. Include these as E2E test cases. |
| **Migration breaks existing functionality (auth flow regression)** | 3 | 3 | 9 (YELLOW) | Run full E2E test suite immediately after migration in dev. Only promote to production after all test suites pass. Maintain the ability to roll back (keep the old auth code in a feature branch until production is validated). |
| **Operator MFA lockout (Hassan loses his authenticator device)** | 3 | 2 | 6 (YELLOW) | Supabase admin panel allows an operator to reset any user's MFA factor (unenroll the TOTP factor, allowing re-enrollment). Print and securely store TOTP backup codes offline. Document the recovery procedure in the Operator Runbook. |
| **Stripe webhook signature verification breaks payment flow** | 4 | 2 | 8 (YELLOW) | Test webhook signature verification in Stripe test mode using the Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`). Verify that the raw body is used (not parsed JSON) before deploying. |
| **AES-256 at rest is insufficient for a future data breach** | 3 | 1 | 3 (GREEN) | AES-256 at rest is the current industry standard and satisfies PIPEDA obligations for this data sensitivity level. Accept. |
| **Rate limiting causes false positives for legitimate high-volume accountants** | 2 | 2 | 4 (GREEN) | Rate limits are per-user (not global). An accountant submitting 5+ orders in 15 minutes would hit the order creation limit (10 per 15 min). This is generous for normal usage. If false positives occur post-launch, the window can be widened. |

---

## 12. Rollout Plan

### Phase 1 — Supabase Auth Migration + Web Hardening (Prompt 03 Rewrite)

**Launch Blocker — must complete before production.**

- [ ] Supabase project setup (Section 10.1 — dashboard configuration, not code)
- [ ] Google and Microsoft OAuth credentials configured (Sections 10.2, 10.3)
- [ ] Database schema migration: `qb_users` UUID PK, `password_hash` removal, FK updates, `qb_password_resets` drop
- [ ] `on_auth_user_created` trigger applied to Supabase
- [ ] RLS policies applied to all `qb_*` tables
- [ ] Frontend `auth.tsx` context rewritten to use `@supabase/supabase-js`
- [ ] Login and register pages updated: Google button, Microsoft button, OAuth callback route `/auth/callback`
- [ ] Backend `requireAuth` and `requireOperator` middleware rewritten for Supabase JWT verification
- [ ] All `/auth/*` Express routes removed
- [ ] `helmet` middleware added to `app.ts`
- [ ] CORS configuration locked down to explicit origin allowlist
- [ ] `express-rate-limit` applied globally and per-route
- [ ] Input validation hardening (body size limits, free-text sanitization, SQL audit)
- [ ] `STRIPE_WEBHOOK_SECRET` verification added to webhook handler
- [ ] Operator seed script updated to use Supabase Admin API
- [ ] Environment variables updated (`QB_TOKEN_SECRET` removed, `SUPABASE_*` variables added)

### Phase 2 — File Storage Migration (Integrated into Prompt 04 — Order Flow Updates)

**Launch Blocker — must complete before any customer QBM files are accepted.**

- [ ] `order-files` Supabase Storage bucket created (Section 10.1)
- [ ] Storage RLS policies applied (Section 8.3)
- [ ] File upload route (`POST /api/qb/orders/:id/files/upload`) updated to stream to Supabase Storage instead of local filesystem
- [ ] Magic byte validation added to upload route (OLE2 `D0 CF 11 E0` check)
- [ ] Upload token moved from URL query parameter to request body/header
- [ ] `qb_order_files.storage_path` now stores Supabase Storage paths
- [ ] File download route (`GET /api/qb/orders/:id/files/:fileId/download`) updated to generate signed URLs
- [ ] Admin file download route updated to generate signed URLs (15-minute expiry)
- [ ] Customer portal file download UI updated to handle signed URL redirect
- [ ] Expired file state shown in customer portal when `qb_order_files.expired = true`

### Phase 3 — MFA Enforcement + Advanced RLS (New Sub-Prompt or Part of Prompt 03)

**Launch Blocker — must complete before operator account goes live in production.**

- [ ] MFA enrollment screen implemented (QR code display, TOTP verification)
- [ ] MFA challenge screen implemented (6-digit code input)
- [ ] Frontend admin route guard checks AAL2 before rendering any `/admin/*` content
- [ ] `requireOperator` middleware verifies `aal === 'aal2'` on all `/api/admin/*` routes
- [ ] Operator seed script verified: operator account created and `role = 'operator'` set
- [ ] `pg_cron` auto-deletion job scheduled in Supabase (Section 8.3)

### Phase 4 — Security Verification Pass (Prompt 14)

**Pre-launch verification — completes the security hardening sprint.**

- [ ] Manual OWASP Top 10 checklist review against the live dev environment
- [ ] RLS policy test matrix: verify every table and storage bucket from all four perspectives (unauthenticated, Customer A, Customer B, Operator)
- [ ] Confirm no `password_hash` or `QB_TOKEN_SECRET` remnants in the codebase
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is not present in any frontend bundle
- [ ] Stripe webhook signature verification E2E test using Stripe CLI
- [ ] Security headers verified using browser DevTools and/or https://securityheaders.com
- [ ] Rate limiting verified by triggering limits in a controlled test
- [ ] MFA lockout recovery procedure documented in Operator Runbook
- [ ] PIPEDA compliance checklist verified: encryption at rest confirmed, 7-day deletion cron confirmed operational, privacy policy updated to state retention period

---

*Document version: 1.0 — QB Portal Production Launch Epic*
*Author: NexFortis Product (Hassan Sadiq)*
*Last updated: April 2026*
*Approved Design Spec: `/docs/specs/2026-04-14-supabase-auth-security-redesign.md`*
