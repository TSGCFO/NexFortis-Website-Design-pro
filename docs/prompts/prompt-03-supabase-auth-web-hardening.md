# Prompt 03: Supabase Auth Migration + Web Application Hardening

This prompt replaces the homegrown bcrypt+HMAC authentication system with Supabase Auth and adds comprehensive web application security hardening. This is the largest single prompt in the implementation sequence — read every step carefully before starting.

## Step 0: Setup

Read these files before making any changes:
1. `replit.md` — project overview, architecture, conventions, current state
2. `docs/prd/qb-portal/feature-security-auth-storage.md` — security PRD (the full document, especially Sections 6, 8, and 10)
3. `docs/specs/2026-04-14-supabase-auth-security-redesign.md` — approved design spec
4. `docs/prompts/prompt-03-supabase-auth-web-hardening.md` — this file (complete instructions)

**Do NOT modify any files in `docs/`.**

**Prerequisites — the following MUST already be configured before this prompt runs:**
- A Supabase project exists with email+password auth enabled
- The Supabase project URL and keys are set as Replit secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- The Vite-prefixed versions are also set: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Google OAuth is configured in Supabase dashboard (Client ID + Secret from Google Cloud Console)
- Microsoft/Azure OAuth is configured in Supabase dashboard (Client ID + Secret from Azure AD)

If any of these secrets are missing, stop and report which ones are needed. Do not proceed with placeholder values.

---

## Step 1: Install Dependencies

Install the Supabase client library and security packages. The project uses pnpm workspaces, so install packages in the correct workspace locations:

**For the API server** (`artifacts/api-server`):
- `@supabase/supabase-js` — Supabase client (used server-side with service role key for admin operations and JWT verification)
- `helmet` — security headers middleware
- `express-rate-limit` — rate limiting middleware
- `sanitize-html` — HTML sanitization for user-submitted free-text fields

**For the QB Portal frontend** (`artifacts/qb-portal`):
- `@supabase/supabase-js` — Supabase client (used client-side with anon key for auth flows)

Run `pnpm install` from the monorepo root after adding the packages.

---

## Step 2: Create the Supabase Client Modules

### 2a. Backend Supabase Client

Create a new file in the API server that initializes two Supabase client instances:

1. **Service role client** — uses `SUPABASE_SERVICE_ROLE_KEY`. This client bypasses RLS and is used for admin operations (creating the operator account, looking up users by ID, etc.). Never expose this client or its key to the frontend.

2. **Anon client factory** — a function that creates a Supabase client from a user's JWT access token. This is used to verify the token and get the authenticated user's session. Each request creates a short-lived client scoped to that user's permissions.

Place this file at `artifacts/api-server/src/lib/supabase.ts`.

Read the environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from `process.env`. If either is missing, log a warning but do not crash the server (this allows the app to start in environments where Supabase is not yet configured).

### 2b. Frontend Supabase Client

Create a new file in the QB Portal that initializes a single Supabase client using the public anon key.

Place this file at `artifacts/qb-portal/src/lib/supabase.ts`.

Read `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Vite's `import.meta.env`. The client should be configured with:
- `auth.autoRefreshToken: true` — automatically refreshes the JWT before it expires
- `auth.persistSession: true` — persists the session to localStorage
- `auth.detectSessionInUrl: true` — required for OAuth callback handling

Export the client as a named export so it can be imported throughout the frontend.

---

## Step 3: Database Schema Migration

The `qb_users` table currently uses an auto-incrementing integer primary key (`serial`). Supabase Auth assigns UUID IDs to users. The schema must be updated so that `qb_users.id` is a UUID that references `auth.users(id)`.

### 3a. Update the Drizzle Schema

In `lib/db/src/schema/qb-portal.ts`, make these changes to the `qbUsers` table:

1. Change the `id` column from `serial("id").primaryKey()` to a UUID column that references `auth.users(id)` with `ON DELETE CASCADE`. Use Drizzle's `uuid` column type.
2. **Remove the `passwordHash` column entirely.** Supabase Auth manages password storage — the application database never stores passwords.
3. Keep the `email`, `name`, `phone`, and `createdAt` columns as-is.
4. Add the `role` column as `text("role").notNull().default("customer")`. Valid values: `"customer"` or `"operator"`.

Also update the `qbOrders` table:
- Change `userId` from `integer` to `uuid` type. Update the foreign key reference to point to the new UUID-based `qbUsers.id`.

Also update the `qbSupportTickets` table:
- Change `userId` from `integer` to `uuid` type. Update the foreign key reference.

Also update the `qbOrderFiles` table:
- Add an `expired` column (`boolean`, default `false`)
- Add a `deletedAt` column (`timestamp`, nullable)

**Remove the `qbPasswordResets` table entirely.** Supabase Auth handles password resets natively — this table is no longer needed.

### 3b. Generate and Apply the Migration

After updating the schema file, generate and push the Drizzle migration. Since this is a destructive change (dropping `password_hash`, changing PK type), and there are no real customer accounts in the database yet, this is safe to apply directly.

Run the appropriate Drizzle migration commands. Check `package.json` for the correct command — it may be `npx drizzle-kit push`, `pnpm db:push`, or `pnpm db:migrate`.

If the migration tool cannot handle the PK type change automatically (integer → UUID), you may need to drop and recreate the affected tables. This is acceptable at this stage since there are no real customer records to preserve.

### 3c. Apply RLS Policies and Triggers in Supabase

The RLS policies and the `on_auth_user_created` trigger need to be applied in the Supabase database. These are SQL statements that run against the Supabase PostgreSQL instance.

Create a SQL migration file at `artifacts/api-server/src/migrations/supabase-rls-setup.sql` that contains:

1. **The `handle_new_user()` trigger function** — automatically creates a `qb_users` profile row whenever a new user signs up through Supabase Auth. It should extract the user's email, name (from `raw_user_meta_data`), and phone, and set `role = 'customer'`. The function must be `SECURITY DEFINER` so it can insert into `qb_users` regardless of RLS.

2. **The trigger** — `AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user()`

3. **RLS policies for all qb_* tables** — see Section 8.2 of the security PRD for the exact policies. Every table gets RLS enabled. Customers can only see/modify their own records (matched by `auth.uid()`). The operator can see all records (verified by checking `qb_users.role = 'operator'` for the current `auth.uid()`).

4. **Enable RLS** on `qb_users`, `qb_orders`, `qb_order_files`, `qb_support_tickets`, and `qb_waitlist_signups`.

Include a comment at the top of the SQL file explaining that these statements must be run in the Supabase SQL Editor (Dashboard → SQL Editor → New query) for both the dev and production Supabase projects. They cannot be run via Drizzle — they reference Supabase-specific schemas (`auth.users`, `storage.objects`).

---

## Step 4: Rewrite the Backend Auth Middleware

The current auth system in `artifacts/api-server/src/routes/qb-portal.ts` uses homegrown HMAC token verification. Replace it entirely with Supabase JWT verification.

### 4a. Remove Old Auth Code

Remove these from `qb-portal.ts`:
- The `generateToken` function
- The `verifyToken` function
- The `extractUserId` function (and `extractAuth` if it exists)
- The `TOKEN_SECRET` / `QB_TOKEN_SECRET` constant
- The `SESSION_MAX_AGE_MS` constant
- The `COOKIE_NAME` constant and all `res.cookie()` calls
- The `bcrypt` import and all bcrypt usage
- The `POST /auth/register` route
- The `POST /auth/login` route
- The `POST /auth/logout` route
- The `POST /auth/reset-password` and `POST /auth/reset-password/confirm` routes (if they exist)

### 4b. Create New Auth Middleware

Create new middleware functions that verify the Supabase JWT from the `Authorization: Bearer <token>` header:

**`requireAuth` middleware:**
1. Extract the Bearer token from the `Authorization` header.
2. Use the Supabase service role client to call `supabase.auth.getUser(token)` — this verifies the JWT signature and returns the user object.
3. If the token is missing or invalid, return 401.
4. Look up the corresponding `qb_users` row by the Supabase user's UUID. If no profile exists, return 401 (the trigger should have created one, but handle the edge case).
5. Attach `userId` (UUID string) and `userRole` (from `qb_users.role`) to the request object for downstream handlers.

**`requireOperator` middleware:**
1. Does everything `requireAuth` does.
2. Additionally checks that `userRole === "operator"`.
3. Additionally verifies that the user's session has AAL2 (MFA completed). To check this, use `supabase.auth.getUser(token)` and inspect the response — or decode the JWT and check the `aal` claim. If the user's session is AAL1 (no MFA completed), return 403 with a message indicating MFA is required.
4. If role is not operator or AAL is not AAL2, return 403.

**Important implementation notes:**
- Do NOT use `supabase.auth.getSession()` on the server — that's for client-side use. Use `supabase.auth.getUser(token)` which makes a server-side verification call.
- The middleware must handle the case where the Supabase service is down (network error) — return 503 instead of crashing.
- Add TypeScript types for the extended request object so downstream handlers can safely access `req.userId` and `req.userRole`.

### 4c. Update All Existing Route Handlers

Every existing route handler that currently calls `extractUserId(req)` or reads `req.userId` needs to be updated:

- The userId is now a UUID string, not an integer. Any database queries using `userId` must work with UUID comparison.
- The `req.cookies` approach for session auth is removed — all auth is via the Authorization header.
- Remove any `res.cookie(COOKIE_NAME, ...)` calls from login/register responses (there are no login/register routes anymore).

Specifically update:
- `GET /me` — now reads user profile from `qb_users` using the UUID from the middleware
- `PUT /me` — same
- `GET /orders` — filter by UUID user_id
- `POST /orders` — set user_id as UUID
- `GET /orders/:id` — verify ownership using UUID comparison
- File upload/download routes — verify ownership using UUID
- `GET /support-tickets` — filter by UUID
- `POST /support-tickets` — set user_id as UUID

---

## Step 5: Rewrite the Frontend Auth Context

The current auth context in `artifacts/qb-portal/src/lib/auth.tsx` manages login/register via API calls to the Express backend and stores tokens in localStorage. Replace this entirely with Supabase Auth.

### 5a. Rewrite the Auth Provider

The new auth context should:

1. **Initialize by listening for Supabase auth state changes** using `supabase.auth.onAuthStateChange()`. When a session is established (user logs in, page loads with existing session, token refreshes), update the React state.

2. **Expose these values/functions:**
   - `user` — the current user profile from `qb_users` (not just the Supabase auth user — includes `role`, `name`, `phone`)
   - `session` — the raw Supabase session object (needed for getting the access token)
   - `loading` — true while the initial session check is in progress
   - `isOperator` — computed: `user?.role === "operator"`
   - `signUp(email, password, name, phone?)` — calls `supabase.auth.signUp()` with the user metadata (name, phone) passed as `options.data` so the trigger can populate `qb_users`
   - `signIn(email, password)` — calls `supabase.auth.signInWithPassword()`
   - `signInWithGoogle()` — calls `supabase.auth.signInWithOAuth({ provider: 'google' })` with redirect URL
   - `signInWithMicrosoft()` — calls `supabase.auth.signInWithOAuth({ provider: 'azure' })` with redirect URL
   - `signOut()` — calls `supabase.auth.signOut()`
   - `resetPassword(email)` — calls `supabase.auth.resetPasswordForEmail()`
   - `getAccessToken()` — returns the current session's access token for API calls (replaces the old `getAuthToken()` that read from localStorage)

3. **Fetch the user profile from `qb_users`** after authentication succeeds. The Supabase auth user object has the UUID and email, but the `qb_users` table has the `role`, `name`, and `phone`. Make a `GET /api/qb/me` call with the access token in the Authorization header to get the full profile.

4. **Handle the OAuth callback.** When Google or Microsoft redirects back to the app after authentication, Supabase's client library automatically exchanges the code for a session (because `detectSessionInUrl: true` is configured). The `onAuthStateChange` listener will fire with the new session. Make sure the app handles this gracefully — the user lands back on the app and is logged in.

### 5b. Create an OAuth Callback Route

Create a new page component at `artifacts/qb-portal/src/pages/auth-callback.tsx`. This page:
1. Shows a loading spinner with "Completing sign-in..." text
2. The Supabase client automatically processes the URL hash/params
3. Once `onAuthStateChange` fires with a valid session, redirect the user to `/portal` (or wherever they came from)
4. If there's an error in the URL params, display an error message with a link to try again

Register this route in `App.tsx` at `/auth/callback`.

### 5c. Update the Login Page

Update `artifacts/qb-portal/src/pages/login.tsx`:

1. Replace the email+password form handler to call the new `signIn()` from the auth context instead of the old API call.
2. Add a "Sign in with Google" button that calls `signInWithGoogle()`.
3. Add a "Sign in with Microsoft" button that calls `signInWithMicrosoft()`.
4. Add a "Forgot password?" link that navigates to a password reset page (or shows an inline form).
5. Style the social login buttons consistently with the NexFortis brand — use the brand's navy/rose-gold palette. Google button should have the Google "G" icon, Microsoft button should have the Microsoft logo icon. Use the Lucide icon library or inline SVGs.
6. Add visual separators between the email form and social login buttons (e.g., "— or continue with —").

### 5d. Update the Register Page

Update `artifacts/qb-portal/src/pages/register.tsx`:

1. Replace the form handler to call the new `signUp()` from the auth context.
2. Add the same Google and Microsoft social login buttons as the login page.
3. After successful registration via email+password, show a message: "Account created! You can now sign in." (Email verification is disabled at launch per the PRD's out-of-scope section, so the user can sign in immediately.)

### 5e. Update All API Call Sites

Every place in the frontend that makes an API call to the Express backend needs to include the Supabase access token in the Authorization header. Search the codebase for all `fetch("/api/qb/` calls and:

1. Get the access token from the auth context (or from `supabase.auth.getSession()`)
2. Add `Authorization: Bearer ${accessToken}` to the request headers
3. Remove any references to the old `getAuthToken()` function or localStorage token reads

Common locations to check:
- Portal page (orders list, profile)
- Order creation flow
- File upload/download
- Support ticket creation/list
- Profile update (`PUT /me`)
- Any admin API calls

### 5f. Add a Password Reset Page

Create `artifacts/qb-portal/src/pages/reset-password.tsx`:
1. A form with an email field
2. On submit, calls `resetPassword(email)` from the auth context
3. Shows a success message: "If an account exists with that email, you'll receive a password reset link."
4. Supabase handles sending the actual reset email — no backend code needed

Register this route in `App.tsx` at `/reset-password`.

---

## Step 6: Web Application Hardening — Security Headers

Add Helmet middleware to the Express API server.

### 6a. Add Helmet to the Middleware Stack

In the main Express app setup file (likely `artifacts/api-server/src/app.ts` or `artifacts/api-server/src/index.ts` or wherever the Express app is configured):

1. Import and add `helmet()` as the FIRST middleware in the stack (before CORS, before body parsers, before routes).
2. Configure Helmet with these settings:
   - `contentSecurityPolicy`: Configure directives appropriate for a React SPA that loads from the same origin. Allow `'self'` for scripts, styles, images, fonts. Allow the Supabase project URL for API calls. Allow `https://fonts.googleapis.com` and `https://fonts.gstatic.com` for Google Fonts. Allow `https://js.stripe.com` for Stripe. Allow inline styles (`'unsafe-inline'` for styles only — needed for Tailwind and styled components). Do NOT allow `'unsafe-eval'` or `'unsafe-inline'` for scripts.
   - `hsts`: `maxAge: 31536000` (1 year), `includeSubDomains: true`
   - `frameguard`: `action: 'deny'` (prevents clickjacking)
   - `noSniff`: true (X-Content-Type-Options: nosniff)
   - `xssFilter`: true

### 6b. Middleware Ordering

The full middleware stack should follow this order (see PRD Section 8.4):
1. `helmet()` — security headers
2. CORS middleware
3. `express.raw()` for the Stripe webhook route ONLY
4. `express.json({ limit: '1mb' })` — JSON body parser
5. `express.urlencoded({ limit: '1mb', extended: true })`
6. `cookieParser()` (if still needed for any non-auth purpose)
7. Global rate limiter
8. Route handlers

**Critical:** The Stripe webhook route MUST receive the raw body (not parsed JSON) for signature verification. Either register the webhook route before `express.json()` is applied, or use a route-specific `express.raw()` middleware on that route.

---

## Step 7: Web Application Hardening — CORS Lockdown

Replace the current open CORS configuration (`origin: true` or `origin: '*'`) with an explicit allowlist.

The allowed origins are:
- `https://nexfortis.com`
- `https://www.nexfortis.com`
- `https://qb.nexfortis.com`
- In development (`NODE_ENV !== 'production'`): also allow `http://localhost:*` patterns and the Replit dev URL

Configure CORS with:
- `credentials: true` (needed for any cookie-based flows if they remain)
- `methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']`
- `allowedHeaders: ['Content-Type', 'Authorization']`

---

## Step 8: Web Application Hardening — Rate Limiting

Add rate limiting using `express-rate-limit`.

### 8a. Global Rate Limiter

Apply a global rate limiter to all routes:
- Window: 15 minutes
- Max requests per window: 100 per IP
- Standard headers: enabled (`RateLimit-*` headers)
- Message: `{ error: "Too many requests. Please try again later." }`
- Skip successful requests: false (count all requests)

### 8b. Stricter Per-Route Limits

Create separate rate limiters for sensitive endpoints:

**Checkout/payment routes** (`POST /api/qb/checkout`):
- Window: 15 minutes
- Max: 5 per IP
- These are expensive operations (Stripe API calls)

**Order creation** (`POST /api/qb/orders`):
- Window: 15 minutes
- Max: 10 per IP

**Support ticket creation** (`POST /api/qb/support-tickets`):
- Window: 15 minutes
- Max: 10 per IP

**Contact form** (`POST /api/contact`):
- Window: 15 minutes
- Max: 5 per IP

Apply these stricter limiters as middleware on the specific routes, in addition to the global limiter.

---

## Step 9: Web Application Hardening — Stripe Webhook Verification

The current Stripe webhook handler processes events without verifying the webhook signature. This means anyone who knows the webhook URL can send fake payment confirmations.

### 9a. Update the Webhook Handler

Find the Stripe webhook route (likely `POST /api/webhooks/stripe` or similar). Update it to:

1. Read the `stripe-signature` header from the request.
2. Read the `STRIPE_WEBHOOK_SECRET` from environment variables.
3. Call `stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)` to verify the signature and parse the event.
4. If verification fails, return 400 with an error message.
5. Only process the event if verification succeeds.

### 9b. Raw Body Requirement

The `constructEvent` method requires the raw request body (as a Buffer or string), NOT the parsed JSON object. If `express.json()` has already parsed the body, the signature verification will fail.

Solution: Make sure the webhook route receives the raw body. Either:
- Register the webhook route BEFORE `express.json()` middleware
- Or use a route-specific middleware: `express.raw({ type: 'application/json' })` on just the webhook route, and register it before the global `express.json()` parser

If `STRIPE_WEBHOOK_SECRET` is not set, log a warning and skip verification (for development environments where the secret may not be configured). But in production (`NODE_ENV === 'production'`), verification must be mandatory — reject all webhook requests if the secret is missing.

---

## Step 10: Web Application Hardening — Input Validation

### 10a. Body Size Limits

Already handled in Step 6b — `express.json({ limit: '1mb' })` limits JSON request bodies to 1 MB.

### 10b. HTML Sanitization

For all free-text fields that users can submit (support ticket subject, support ticket message, contact form message, user profile name), sanitize the input to strip any HTML tags. Use `sanitize-html` with a strict configuration that allows NO tags (plain text only).

Add sanitization at the route handler level — before the data is stored in the database. Create a utility function (e.g., `sanitizeInput(text: string): string`) that:
1. Strips all HTML tags
2. Trims whitespace
3. Returns the cleaned string

Apply it to:
- `POST /support-tickets` — sanitize `subject` and `message`
- `POST /contact` — sanitize `name`, `email`, `subject`, `message`
- `PUT /me` — sanitize `name`

### 10c. SQL Injection Audit

Drizzle ORM parameterizes all queries automatically, so SQL injection is not a concern for standard Drizzle operations. However, audit the codebase for any raw SQL queries (`db.execute()` or `sql` template literals with user input). If any exist, verify they use parameterized queries.

---

## Step 11: Operator Seed Script Update

The current seed script (`artifacts/api-server/src/seed-operator.ts`) creates the operator account using bcrypt. Rewrite it to use the Supabase Admin API.

The updated script should:

1. Initialize the Supabase service role client (which has admin privileges).
2. Check if a user with email `h.sadiq@nexfortis.com` already exists using `supabase.auth.admin.listUsers()`.
3. If the user does not exist, create them using `supabase.auth.admin.createUser()` with:
   - `email`: `h.sadiq@nexfortis.com`
   - `password`: Read from `OPERATOR_PASSWORD` environment variable (do NOT hardcode the password in the script)
   - `email_confirm: true` (skip email verification for the operator)
   - `user_metadata: { name: "Hassan Sadiq" }`
4. After the Supabase auth user is created (or confirmed to exist), upsert the `qb_users` profile with `role = 'operator'`. Use the Supabase user's UUID as the `qb_users.id`.
5. Print a summary of what was done.

Make the script idempotent — running it multiple times should not create duplicates or errors.

Update the `seed:operator` script in `package.json` to run this updated file.

---

## Step 12: Environment Variable Cleanup

### 12a. Remove Old Variables

- Remove `QB_TOKEN_SECRET` from any `.env` files, `.env.example` files, or code references. This secret is no longer used.

### 12b. Add New Variables

Verify these are documented in the codebase (e.g., in `.env.example` or in comments):
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase admin key (server-only, never in frontend)
- `VITE_SUPABASE_URL` — Same as SUPABASE_URL but exposed to Vite frontend
- `VITE_SUPABASE_ANON_KEY` — Same as SUPABASE_ANON_KEY but exposed to Vite frontend
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `OPERATOR_PASSWORD` — Operator account password (used only by seed script)

### 12c. Verify No Secret Leaks

Search the entire codebase for:
- Any hardcoded passwords (the old `Hassan8488$@` was in the seed script — it must be replaced with an env var read)
- Any `SUPABASE_SERVICE_ROLE_KEY` references in frontend code — this must NEVER appear in any file under `artifacts/qb-portal/`
- Any `VITE_SUPABASE_SERVICE_ROLE_KEY` — this variable must not exist

---

## Step 13: Update robots.txt

In `artifacts/qb-portal/public/robots.txt`, add these paths to the Disallow list:
- `/admin`
- `/auth/callback`
- `/reset-password`

These pages should never be indexed by search engines.

---

## Step 14: Verify

1. **TypeScript check:** Run `pnpm typecheck` from the repo root — fix all errors.

2. **Build check:** Run `pnpm build` (or the project's build command) — confirm the frontend builds without errors.

3. **Environment variable check:**
   - Confirm `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are set in Replit secrets
   - Confirm `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` are set in Replit secrets
   - Confirm `STRIPE_WEBHOOK_SECRET` is set (can be the test mode secret)
   - Confirm `OPERATOR_PASSWORD` is set

4. **Test in the Replit preview:**
   - **Registration (email+password):** Register a new account. Should succeed, redirect to portal, show the user's name.
   - **Login (email+password):** Log out, then log back in with the registered credentials. Should succeed.
   - **Social login — Google:** Click the Google sign-in button. Should redirect to Google, then back to the app with a valid session.
   - **Social login — Microsoft:** Click the Microsoft sign-in button. Should redirect to Microsoft, then back with a valid session.
   - **Password reset:** Click "Forgot password?", enter an email, submit. Should show success message.
   - **Operator login:** Log in as `h.sadiq@nexfortis.com`. The auth should succeed (MFA enforcement is in Prompt 03B — for now, the operator can log in without MFA).
   - **API calls with auth:** Navigate to the portal page — orders should load. Create a support ticket — should succeed. The Authorization header should carry the Supabase JWT.
   - **Security headers:** Open DevTools → Network tab → check any response headers. Should see: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
   - **Rate limiting:** Make more than 5 rapid requests to `POST /api/contact` — should get a 429 response.
   - **CORS:** From the browser console, try `fetch('https://evil.com/api/qb/me')` — should fail with CORS error. (Actually, test by checking the CORS headers on responses — `Access-Control-Allow-Origin` should only list your allowed domains.)

5. **Security audit — grep checks:**
   - `grep -rn "bcrypt" artifacts/` — should return NO results (bcrypt fully removed)
   - `grep -rn "QB_TOKEN_SECRET" .` — should return NO results
   - `grep -rn "password_hash" lib/db/` — should return NO results (column removed from schema)
   - `grep -rn "SUPABASE_SERVICE_ROLE_KEY" artifacts/qb-portal/` — must return NO results (never in frontend)
   - `grep -rn "Hassan8488" .` — must return NO results (password not hardcoded anywhere)
   - `grep -rn "qbPasswordResets" lib/db/` — should return NO results (table removed)

6. **Fix any issues found in steps 1–5 before considering this task complete.**

---

## Constraints

- Do NOT modify any files in `docs/` — documentation is managed separately
- Do NOT modify `artifacts/nexfortis/` — main site changes come later
- Do NOT modify `artifacts/qb-portal/public/products.json` — catalog data is managed separately
- Do NOT implement MFA enrollment/challenge screens — that is Prompt 03B
- Do NOT implement file storage migration to Supabase Storage — that is Prompt 04
- Do NOT implement the admin panel pages — that is Prompt 05
- Do NOT create admin API routes beyond what already exists — admin routes come in Prompt 05
- The `requireOperator` middleware should check for AAL2, but since MFA enrollment doesn't exist yet, the operator will only have AAL1 sessions. For now, log a warning when AAL2 is not present but still allow access. Prompt 03B will enforce AAL2 strictly after MFA enrollment is implemented.
- Social login OAuth providers (Google, Microsoft) must be configured in the Supabase dashboard BEFORE this prompt runs. The code connects to them but does not configure them.
- Keep the `bcrypt` package in `package.json` for now (other code may reference it) — it will be removed in a cleanup pass.
