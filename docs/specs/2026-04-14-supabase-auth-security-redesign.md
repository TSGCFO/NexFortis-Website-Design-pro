# Security Redesign: Supabase Auth + Storage + Web Application Hardening

**Date:** April 14, 2026
**Author:** Aki (Orchestrator)
**Approved by:** Hassan Sadiq
**Status:** Approved — pending implementation planning

---

## 1. Problem Statement

The QB Portal currently uses a homegrown authentication system (bcrypt password hashing + HMAC-SHA256 session tokens) with no rate limiting, no MFA, no social login, no CSRF protection, no security headers, open CORS, and unencrypted file storage on the server filesystem. Customer QBM files — which may contain credit card numbers, employee SINs, T4s, and customer PII — sit unencrypted on disk. The operator account, which has access to all customer files and data, is protected by only a password.

This spec replaces the homegrown auth system with Supabase Auth, moves file storage to Supabase Storage, and adds comprehensive web application security hardening.

---

## 2. Three Security Pillars

| Pillar | Current State | Target State |
|--------|--------------|--------------|
| **QBM file security** | Unencrypted files on Replit/Render server filesystem. Manual 7-day deletion. Upload token in URL params. | Supabase Storage with encryption at rest, RLS access control, expiring signed download URLs, auto-delete after 7 days. |
| **Payment data security** | Stripe Checkout redirect — card data never touches our server. | No change needed — Stripe handles this correctly. Verify webhook signature validation. |
| **Auth + web app security** | Homegrown bcrypt+HMAC. No rate limiting, no MFA, no social login, no CSRF, no Helmet, open CORS. | Supabase Auth with email+password, Google/Microsoft social login, TOTP MFA for operator. Rate limiting, Helmet, CORS lockdown, session management. |

---

## 3. Architecture Overview

### 3.1 Auth Flow (After Redesign)

```
Customer Browser
  │
  ├─ Sign up / Log in ──────────────► Supabase Auth (hosted)
  │   (email+password, Google,          ├─ Password hashing
  │    Microsoft)                       ├─ Social OAuth flow
  │                                     ├─ MFA challenge (operator)
  │                                     ├─ Rate limiting
  │                                     └─ Returns JWT + refresh token
  │
  ├─ JWT in Authorization header ──► Express API Server
  │                                     ├─ Validates JWT using Supabase public key
  │                                     ├─ Extracts user UUID + role from qb_users
  │                                     ├─ requireAuth middleware (any authenticated user)
  │                                     ├─ requireOperator middleware (operator role only)
  │                                     └─ Processes request
  │
  └─ File upload/download ─────────► Supabase Storage
                                        ├─ RLS: customer can only access own order files
                                        ├─ RLS: operator can access all files
                                        ├─ Encryption at rest
                                        ├─ Signed URLs for downloads (1-hour expiry)
                                        └─ Auto-delete after 7 days (DB cron)
```

### 3.2 Database Schema Changes

**`qb_users` table becomes a profile table:**

| Column | Before | After |
|--------|--------|-------|
| `id` | `serial` (auto-increment integer) | `uuid` (matches Supabase auth.users.id) |
| `email` | stored here | still stored here (denormalized for queries), synced from Supabase |
| `password_hash` | stored here | **REMOVED** — Supabase stores this |
| `name` | stored here | unchanged |
| `phone` | stored here | unchanged |
| `role` | `text` default `'customer'` | unchanged |
| `created_at` | timestamp | unchanged |

**`qb_password_resets` table:** **REMOVED** — Supabase handles password reset flow.

**`qb_order_files` table changes:**

| Column | Before | After |
|--------|--------|-------|
| `storage_path` | local filesystem path | Supabase Storage object path (e.g., `{user_id}/{order_id}/{filename}`) |

**New: RLS policies on all tables:**
- `qb_orders`: customer can SELECT/INSERT own orders (where `user_id = auth.uid()`), operator can SELECT/UPDATE all
- `qb_order_files`: customer can SELECT own order files (via order ownership), operator can SELECT all
- `qb_support_tickets`: customer can SELECT/INSERT own tickets, operator can SELECT/UPDATE all
- `qb_waitlist_signups`: authenticated users can INSERT, operator can SELECT all
- `qb_users`: user can SELECT/UPDATE own profile, operator can SELECT all

**New: Supabase Storage bucket `order-files`:**
- Private bucket (no public access)
- RLS: upload requires authenticated user + valid order ownership or upload token
- RLS: download requires authenticated user who owns the order, or operator role
- Objects auto-expire after 7 days via a Supabase database cron function

### 3.3 Foreign Key Migration

All tables that currently reference `qb_users.id` as an integer will need to reference the UUID primary key instead. Affected foreign keys:
- `qb_orders.user_id` (integer → uuid)
- `qb_support_tickets.user_id` (integer → uuid)
- `qb_password_resets.user_id` → table removed entirely
- `qb_waitlist_signups` — no user_id FK (uses email), no change needed

---

## 4. Auth System Detail

### 4.1 Customer Registration

1. Customer visits `/register`
2. Three options displayed: "Sign up with Google", "Sign up with Microsoft", email+password form
3. **Social login path:** `supabase.auth.signInWithOAuth({ provider: 'google' })` → redirect to Google → callback → Supabase creates auth user → trigger creates `qb_users` profile row with `role = 'customer'`
4. **Email+password path:** Customer fills form → `supabase.auth.signUp({ email, password, options: { data: { name, phone } } })` → Supabase creates auth user → trigger creates `qb_users` profile row

**Profile creation trigger:** A Supabase database function triggered on `auth.users` INSERT that creates the corresponding `qb_users` row. This ensures every auth user has a profile regardless of how they signed up.

```sql
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

### 4.2 Customer Login

1. Customer visits `/login`
2. Same three options (Google, Microsoft, email+password)
3. Supabase validates credentials, returns JWT
4. Frontend stores session via `supabase.auth.onAuthStateChange()` listener
5. JWT is sent in `Authorization: Bearer <token>` header on all API requests
6. No cookies needed for auth — JWT in header replaces the cookie approach

### 4.3 Operator Login + MFA

1. Hassan logs in with email+password (or Google/Microsoft)
2. Supabase returns AAL1 (first factor verified)
3. Frontend checks `supabase.auth.mfa.getAuthenticatorAssuranceLevel()`
4. If `nextLevel === 'aal2'` and `currentLevel !== 'aal2'` → redirect to MFA challenge screen
5. Hassan enters 6-digit code from authenticator app (Google Authenticator, Authy, etc.)
6. `supabase.auth.mfa.verify()` → session upgraded to AAL2
7. Admin panel routes check for AAL2 before rendering

**MFA enrollment (one-time setup):**
1. After first operator login, redirect to MFA enrollment page
2. `supabase.auth.mfa.enroll({ factorType: 'totp' })` → returns QR code
3. Hassan scans QR code with authenticator app
4. Enters verification code → `supabase.auth.mfa.verify()` → factor activated

**MFA enforcement:**
- Admin panel frontend: checks AAL2 before rendering any admin page
- Admin API routes: backend middleware verifies JWT contains `aal: 'aal2'` claim
- Database RLS: sensitive operations (admin queries) require `auth.current_aal() = 'aal2'`

### 4.4 Operator Account Seeding

The seed script changes from creating a bcrypt-hashed password to:
1. Create user via Supabase Admin API: `supabase.auth.admin.createUser({ email, password, email_confirm: true })`
2. Update `qb_users` profile: set `role = 'operator'`
3. Script remains idempotent — checks if user exists first

### 4.5 Session Management

| Feature | Before | After |
|---------|--------|-------|
| Session duration | 7 days, no rotation | Configurable in Supabase (default 1 hour access token + refresh token) |
| Session revocation | Not possible | `supabase.auth.admin.signOut(userId)` — immediate revocation |
| Token refresh | Not implemented | Automatic via Supabase client (`onAuthStateChange` handles refresh) |
| Multiple sessions | No tracking | Supabase tracks all active sessions per user |
| Logout | Client-side only (clear localStorage) | Server-side session invalidation + client cleanup |

---

## 5. File Storage Detail

### 5.1 Supabase Storage Bucket: `order-files`

- **Bucket type:** Private (no public access)
- **Object path pattern:** `{user_id}/{order_id}/{filename}`
- **Max file size:** 500MB (matches current multer limit)
- **Accepted MIME types:** restricted at upload policy level
- **Encryption:** AES-256 at rest (Supabase default)

### 5.2 Upload Flow

1. Customer completes order → receives upload token (as today)
2. Frontend calls Express API → API generates a Supabase Storage signed upload URL
3. Frontend uploads file directly to Supabase Storage using the signed URL
4. Express API records the storage path in `qb_order_files`
5. Upload token is passed in request body or header (NOT URL params — fixes the current URL leakage vulnerability)

**Alternative (simpler):** Upload goes through Express API (as today with multer), API streams the file to Supabase Storage server-side. This keeps the upload flow identical for the customer but stores files in Supabase instead of local disk. Recommended for launch simplicity.

### 5.3 Download Flow

**Customer download:**
1. Customer clicks "Download" in their portal
2. Frontend requests a signed download URL from Express API
3. API verifies: user owns the order → generates signed URL via `supabase.storage.from('order-files').createSignedUrl(path, 3600)` (1-hour expiry)
4. Frontend redirects to signed URL → download starts
5. URL expires after 1 hour — cannot be shared or bookmarked

**Operator download:**
1. Hassan clicks "Download" in admin panel
2. API verifies: user has operator role → generates signed URL (same mechanism)
3. Download proceeds

### 5.4 Auto-Deletion (7-Day Retention)

A Supabase database cron job (using `pg_cron` extension) runs daily and deletes files older than 7 days:

```sql
-- Runs daily at 3 AM UTC
SELECT cron.schedule(
  'delete-expired-order-files',
  '0 3 * * *',
  $$
    DELETE FROM storage.objects
    WHERE bucket_id = 'order-files'
    AND created_at < NOW() - INTERVAL '7 days';

    -- Also mark order file records as expired
    UPDATE public.qb_order_files
    SET storage_path = NULL, expired = true
    WHERE created_at < NOW() - INTERVAL '7 days'
    AND storage_path IS NOT NULL;
  $$
);
```

---

## 6. Web Application Security Hardening

### 6.1 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Supabase Auth (login/register/reset) | Handled by Supabase built-in rate limiting | N/A |
| `POST /api/qb/checkout/*` | 10 requests | 15 minutes per IP |
| `POST /api/qb/orders` | 10 requests | 15 minutes per user |
| `POST /api/qb/support-tickets` | 5 requests | 15 minutes per user |
| `POST /api/contact` | 3 requests | 15 minutes per IP |
| All other API routes | 100 requests | 15 minutes per IP |

Implementation: `express-rate-limit` middleware with in-memory store (upgrade to Redis if needed at scale).

### 6.2 Security Headers (Helmet)

Add `helmet` middleware to Express app with:
- `Content-Security-Policy`: restrict script sources to self + Supabase + Stripe
- `X-Frame-Options: DENY` — prevent clickjacking
- `X-Content-Type-Options: nosniff` — prevent MIME type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` — limit referrer leakage
- `Strict-Transport-Security` — enforce HTTPS
- `X-XSS-Protection: 0` — disable legacy XSS filter (CSP replaces it)

### 6.3 CORS Lockdown

Replace `cors({ credentials: true, origin: true })` (allows ALL origins) with:

```
cors({
  credentials: true,
  origin: [
    'https://nexfortis.com',
    'https://qb.nexfortis.com',
    'https://www.nexfortis.com',
    process.env.NODE_ENV === 'development' && 'http://localhost:5173',
  ].filter(Boolean),
})
```

### 6.4 CSRF Protection

With the move from cookies to JWT in Authorization header, CSRF risk is significantly reduced. Cookies are no longer the primary auth mechanism — JWTs must be explicitly included in requests by JavaScript code, which a malicious third-party site cannot do.

However, for any remaining cookie-based flows (Stripe webhooks, etc.), add:
- `SameSite=Strict` on any remaining cookies
- Verify `Origin` header on state-changing requests

### 6.5 Input Validation Hardening

- File upload: add magic byte validation (not just extension check) for QBM files. QBM files are OLE2 Compound Binary Format — check for the `D0 CF 11 E0` magic bytes.
- Request body size limits: `express.json({ limit: '1mb' })` (already exists, verify)
- SQL injection: Drizzle ORM parameterizes all queries (already safe), but verify no raw SQL strings exist.

### 6.6 Stripe Webhook Signature Verification

Verify the current webhook handler validates `Stripe-Signature` header using `stripe.webhooks.constructEvent()`. If not implemented, add it — this prevents fake payment confirmations.

### 6.7 Logging and Monitoring

- Log all auth failures (failed logins, unauthorized access attempts, 403s)
- Log all file access events (upload, download, delete)
- Log all admin actions (order status changes, customer data access)
- Do NOT log passwords, tokens, or file contents

### 6.8 Environment Variables Security

**Production-only secrets (set in Render/Replit prod environment):**
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — public anon key (safe for frontend)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only admin key (NEVER expose to frontend)
- `STRIPE_SECRET_KEY` — live Stripe key
- `STRIPE_WEBHOOK_SECRET` — webhook signature verification

**Development-only secrets:**
- Same keys but pointing to dev Supabase project / Stripe test keys

**Removed:**
- `QB_TOKEN_SECRET` — no longer needed (Supabase manages tokens)

---

## 7. Frontend Changes

### 7.1 New Dependencies

- `@supabase/supabase-js` — Supabase client library

### 7.2 Auth Context Rewrite (`auth.tsx`)

Replace the current custom auth context with a Supabase-powered version:
- `AuthProvider` initializes Supabase client, listens to `onAuthStateChange`
- `login()` → `supabase.auth.signInWithPassword()`
- `register()` → `supabase.auth.signUp()`
- `logout()` → `supabase.auth.signOut()`
- `loginWithGoogle()` → `supabase.auth.signInWithOAuth({ provider: 'google' })`
- `loginWithMicrosoft()` → `supabase.auth.signInWithOAuth({ provider: 'azure' })`
- `isOperator` computed from `qb_users.role`
- MFA state tracked via `supabase.auth.mfa.getAuthenticatorAssuranceLevel()`

### 7.3 Login/Register Page Updates

- Add Google and Microsoft sign-in buttons above the email+password form
- Add MFA challenge screen (shown after first-factor login when MFA is required)
- Add MFA enrollment screen (shown to operator on first login)
- OAuth callback route: `/auth/callback` — handles the redirect from Google/Microsoft

### 7.4 File Upload/Download Updates

- Upload: either direct-to-Supabase-Storage via signed URL, or through Express API which streams to Supabase (recommended for simplicity)
- Download: request signed URL from Express API → redirect to signed URL

### 7.5 Token Handling

- Remove `localStorage.setItem('qb_token')` — Supabase client manages tokens internally
- Remove `getAuthToken()` helper — replaced by `supabase.auth.getSession()` which returns the current JWT
- API calls include JWT via: `supabase.auth.getSession()` → `Authorization: Bearer ${session.access_token}`

---

## 8. Backend Changes

### 8.1 New Dependencies

- `@supabase/supabase-js` — Supabase server client (for admin operations, storage, JWT verification)
- `helmet` — security headers
- `express-rate-limit` — rate limiting
- Remove: `bcrypt` (no longer needed)

### 8.2 Middleware Changes

**`requireAuth` middleware:**
- Extract JWT from `Authorization: Bearer` header
- Verify JWT using Supabase's JWT secret or public key
- Look up `qb_users` profile by UUID to get role
- Attach `req.userId` (UUID) and `req.userRole` to request

**`requireOperator` middleware:**
- Same as `requireAuth` + check `role === 'operator'`
- For admin routes: also verify JWT `aal` claim is `'aal2'` (MFA verified)

### 8.3 Removed Routes

- `POST /auth/login` — frontend calls Supabase directly
- `POST /auth/register` — frontend calls Supabase directly
- `POST /auth/logout` — frontend calls Supabase directly
- `POST /auth/forgot-password` — frontend calls Supabase directly
- `POST /auth/reset-password` — frontend calls Supabase directly
- `GET /me` — can be kept as a convenience endpoint that returns the `qb_users` profile, or replaced by a direct Supabase query

### 8.4 Modified Routes

- `POST /orders/:id/files/upload` — streams file to Supabase Storage instead of local disk
- `GET /orders/:id/files/:fileId/download` — generates Supabase Storage signed URL instead of streaming from local disk
- All admin routes — add AAL2 verification for operator MFA

### 8.5 New Middleware Stack (app.ts)

```
app.use(helmet({ ... }));           // Security headers
app.use(cors({ ... }));             // Locked-down CORS
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(rateLimit({ ... }));        // Global rate limit
```

---

## 9. Migration Path

### 9.1 Development Environment

During development in Replit:
- Dev Supabase project (separate from production)
- Dev database in Supabase (replaces Replit's built-in PostgreSQL)
- Supabase secrets set as Replit dev-only secrets

### 9.2 Production Environment

On Render:
- Production Supabase project (Hassan's existing Supabase account)
- Production database in Supabase
- All secrets set as Render environment variables

### 9.3 Existing User Migration

At launch there are minimal existing users (mostly test accounts). Migration approach:
1. Create fresh `qb_users` table with UUID primary key in Supabase
2. Seed operator account via Supabase Admin API
3. Any existing test accounts are recreated — no need for complex data migration

### 9.4 Replit Dev/Prod Split

- **Development:** `SUPABASE_URL` and `SUPABASE_ANON_KEY` point to dev Supabase project
- **Production (published app):** Different `SUPABASE_URL` and keys pointing to production Supabase project
- Stripe keys follow the same pattern (test vs live)

---

## 10. Impact on Implementation Plan

### Prompts Affected

| Prompt | Impact |
|--------|--------|
| **Prompt 03 (Admin Auth Foundation)** | Complete rewrite — Supabase Auth replaces the entire homegrown auth system. This becomes the largest prompt. |
| **Prompt 04 (Order Flow Updates)** | File upload section changes — Supabase Storage instead of local multer. |
| **Prompt 05 (Admin Panel Full)** | Admin file download changes — signed URLs. Admin routes add AAL2 check. |
| **Prompt 07 (Stripe Subscriptions)** | Subscription auth uses Supabase JWT. Minor changes. |
| **Prompt 08 (Ticket System)** | Uses Supabase auth context. Minor changes. |
| **Prompt 14 (Security Hardening)** | Most of this work moves into Prompt 03 and the auth migration. Prompt 14 becomes a lighter verification/polish pass. |

### New Prompt Needed

A new prompt (or expansion of Prompt 03) is needed for:
- Supabase project setup (storage bucket, RLS policies, auth providers, MFA configuration)
- Database migration (schema changes, triggers, cron job for file expiry)
- This is Supabase dashboard configuration + SQL, not application code

---

## 11. Risk Assessment

| Risk | Severity | Likelihood | Score | Mitigation |
|------|----------|------------|-------|------------|
| Supabase service outage prevents login | 3 | 2 | 6 (YELLOW) | Supabase has 99.9% SLA. Accept risk. |
| Social login misconfiguration exposes auth flow | 3 | 2 | 6 (YELLOW) | Follow Supabase docs exactly. Test in dev first. |
| RLS policy gap exposes customer data | 4 | 2 | 8 (YELLOW) | Thorough testing of every RLS policy. Test as both customer and operator. |
| Migration breaks existing functionality | 3 | 3 | 9 (YELLOW) | Run full E2E test suite after migration. Test every flow. |
| MFA lockout (operator loses authenticator) | 3 | 2 | 6 (YELLOW) | Supabase admin panel allows MFA factor reset. Backup codes. |

---

## 12. Out of Scope

- Email verification for customer accounts (can be enabled later in Supabase dashboard)
- Phone-based MFA (TOTP authenticator app only at launch)
- Role-based access control beyond customer/operator (future consideration)
- Automated penetration testing
- WAF (Web Application Firewall) — can be added at Render/Cloudflare level later
- End-to-end encryption of QBM files (encryption at rest via Supabase is sufficient)
