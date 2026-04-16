# Prompt 03B: MFA Enrollment + Challenge Screens + AAL2 Enforcement

This prompt adds TOTP-based multi-factor authentication for the operator account. The enrollment screen, challenge screen, admin route guard, and strict AAL2 backend enforcement are all covered here. This prompt runs after Prompt 03 has fully landed — the Supabase client modules, auth context, and the `requireOperator` middleware already exist.

## Step 0: Setup

Read these files before making any changes:
1. `replit.md` — project overview, architecture, current state, and file conventions
2. `docs/prd/qb-portal/feature-security-auth-storage.md` — security PRD (especially Sections 8.2 and 8.3 on MFA and the AAL2 enforcement requirement)
3. `docs/specs/2026-04-14-supabase-auth-security-redesign.md` — approved design spec (Section 4.3: Operator Login + MFA, Section 4.4: MFA Enrollment)
4. `docs/prompts/prompt-03b-mfa-enrollment-aal2.md` — this file (the complete instructions)

**Do NOT modify any files in `docs/`.**

**PREREQUISITE:** Prompt 03 (Supabase Auth Migration + Web Application Hardening) must be fully complete before running this prompt. Specifically, the following must already exist and be working:
- `artifacts/qb-portal/src/lib/supabase.ts` — frontend Supabase client
- `artifacts/api-server/src/lib/supabase.ts` — backend Supabase client (service role + anon factory)
- The auth context in `artifacts/qb-portal/src/lib/auth.tsx` — rewritten for Supabase Auth
- The `requireOperator` middleware in `artifacts/api-server/src/routes/qb-portal.ts` — currently logs a warning when AAL2 is missing but still allows access
- The operator account seeded via Supabase Admin API

If any of these prerequisites are missing, stop and report what needs to be completed first.

---

**PLATFORM REMINDERS (read replit.md for full details):**
- The API server only handles `/api/*` routes. Static files are served by Replit, not Express.
- Do NOT add `express.static()` to the API server.
- Do NOT throw errors for missing env vars — use `console.warn` + null.
- CORS rejected origins: use `callback(null, false)`, NEVER `callback(new Error(...))`.
- Helmet `hsts: false` (hosting layer handles HSTS).
- Verify Replit Secrets are still present after completing all steps.

---

## Step 1: MFA Enrollment Page

Create a new page component at `artifacts/qb-portal/src/pages/admin/mfa-enroll.tsx`.

This page is displayed to the operator the first time they log in, before they can access any admin routes. It guides them through enrolling a TOTP authenticator app.

### What the page does:

On mount, call `supabase.auth.mfa.enroll({ factorType: 'totp' })`. This returns a factor object that includes a `totp.qr_code` (a data URI for the QR code image) and a `totp.secret` (the plain-text secret for manual entry). Store both in component state. If the enrollment call fails, display the error message and a retry button.

**AAL2 error handling for the enrollment call:** If `enroll()` returns an error with message containing "already enrolled" or error code `MFA_FACTOR_NAME_CONFLICT` or similar, do NOT crash — display a message: "MFA is already set up for this account." and redirect to `/admin/mfa-challenge` after 2 seconds. For all other errors, display the error message text and show a "Try Again" button that re-calls `enroll()`.

The page should show:

1. **A heading:** "Set Up Two-Factor Authentication"
2. **Instructional paragraph:** "Scan this QR code with Google Authenticator, Authy, or your preferred authenticator app. If you can't scan the QR code, you can enter the key manually."
3. **The QR code image:** Render the `totp.qr_code` data URI as an `<img>` tag. Give it a clear alt attribute: "MFA QR code". Center the image with adequate padding. Size it at roughly 200×200px — not too small to scan comfortably.
4. **Manual entry disclosure (collapsed/toggle or always visible):** Show the TOTP secret in a monospaced font block, clearly labeled "Manual setup key". Include a copy-to-clipboard button next to the secret.
5. **Recovery warning:** Display a callout box (use an amber/warning color — border left with amber, light amber background) with the message: "Save the secret key somewhere safe. You will need it to recover your account if you lose your device. NexFortis cannot recover your account without this key."
6. **Verification input:** A labeled input field for the 6-digit code. The input type is `text` (not `number` — to avoid mobile number keyboard issues), with a `pattern` of `[0-9]{6}`, `maxLength` of 6, `inputMode` of `numeric`. Auto-focus this field after the QR code loads. Add a label: "Enter the 6-digit code from your authenticator app to confirm setup."
7. **Submit button:** "Activate MFA". Disabled when the input is not exactly 6 digits, or while the verification call is in-flight.
8. **Error display:** If the verification fails (wrong code), show an inline error message below the input: "Incorrect code. Please try again." Do not clear the input — let the user correct it.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Log or store `totp.secret` anywhere (console.log, server, analytics). This is a security key — it must only exist in component state and be displayed to the user.
> - Use `input type="number"` for the code field — it causes mobile keyboard issues and strips leading zeros.
> - Call `enroll()` on every render — call it only once on mount (use a ref guard or empty-dep `useEffect`).
> - Assume `enroll()` always succeeds — if the factor already exists, handle it gracefully (redirect to challenge, not an error page).
> - Clear the code input on a wrong-code error — leave it populated so the user can correct it.
> - Redirect to `/admin` directly after enrollment without first verifying `challengeAndVerify()` — the session is only AAL2 after a successful verify call.

### Verification flow:

When the user submits the 6-digit code:
1. Call `supabase.auth.mfa.challengeAndVerify({ factorId, code })` where `factorId` comes from the enrollment response. This both creates a challenge and verifies it in a single call.
2. If the call returns an error, display the error and let the user retry.
3. If the call succeeds, the session is now upgraded to AAL2. Redirect the user to `/admin` using the React Router `useNavigate` hook.

**Brute-force note:** Supabase handles TOTP rate limiting server-side. Do NOT add client-side lockout.

### Styling:

Use the NexFortis brand — navy background for the header/card, rose-gold accent color for buttons and highlights, Inter font (already in the project). The page should feel like a security-focused setup wizard, not a generic form. Use a centered card layout with reasonable max-width (around 480px). Keep it clean and focused — no sidebar, no navigation chrome.

**Verify this step:**
- Run `pnpm typecheck` — zero errors before moving on.
- Confirm `grep -rn "console.log\|console.debug" artifacts/qb-portal/src/pages/admin/mfa-enroll.tsx` returns no lines that include `secret` or `qr_code`.
- Open the enrollment page in the Replit preview — confirm QR code renders and input auto-focuses.

---

## Step 2: MFA Challenge Page

Create a new page component at `artifacts/qb-portal/src/pages/admin/mfa-challenge.tsx`.

This page is displayed to the operator after they complete their password login (AAL1 session established) but before they can access any admin routes. It prompts them for their TOTP code to upgrade the session to AAL2.

### On mount:

1. Call `supabase.auth.mfa.getAuthenticatorAssuranceLevels()`. This returns the current assurance level (`currentLevel`) and the next required level (`nextLevel`).
2. If `currentLevel` is already `aal2`, redirect immediately to `/admin` — no challenge needed.
3. If `currentLevel` is `aal1` and `nextLevel` is `aal2`, stay on the page and prompt for the code.
4. If the user is not authenticated at all, redirect to `/login`.

Also check whether the user has any enrolled TOTP factors. You can get the list of enrolled factors from the session or by calling `supabase.auth.mfa.listFactors()`. If the user has no enrolled TOTP factors (empty list or no factor with type `totp`), redirect them to `/admin/mfa-enroll` instead — they need to complete enrollment first.

**AAL2 state distinction — these three cases MUST be handled differently:**
- **No factors enrolled** → redirect to `/admin/mfa-enroll`
- **Factors enrolled, `currentLevel` is `aal1`** → stay on this page, show challenge input
- **`currentLevel` is `aal2`** → redirect to `/admin` immediately

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Return 403 or show an error page when the user has no enrolled factors — redirect to enrollment instead.
> - Skip the `listFactors()` check and assume any AAL1 user is enrolled — they may not be.
> - Show a blank page while the `getAuthenticatorAssuranceLevels()` call is in-flight — render a loading indicator.
> - Use a stale `factorId` — always read it from the `listFactors()` response on mount, not from a hardcoded constant.
> - Require the user to restart from the challenge step after a wrong code — let them retry with a new code.

### What the page shows:

1. **A heading:** "Two-Factor Authentication Required"
2. **Instructional text:** "Enter the 6-digit code from your authenticator app to continue."
3. **The 6-digit code input:** Same input configuration as the enrollment page — `text` type, `pattern` of `[0-9]{6}`, `maxLength` 6, `inputMode` `numeric`. **Auto-focus this field on mount** — the operator should be able to start typing immediately without clicking.
4. **Submit button:** "Verify". Disabled when input is not exactly 6 digits or while the API call is in-flight.
5. **Error display:** If the verification fails, show an inline error: "Incorrect code. Please check your authenticator app and try again." Allow retries — do not lock out the user after failed attempts (Supabase handles lockout on its side if needed).
6. **Loading state:** While the assurance level check is in-progress on mount, show a brief loading indicator rather than a blank or flickering page.

### Verification flow:

When the user submits the 6-digit code:
1. Get the enrolled TOTP factor ID from the factors list retrieved on mount.
2. Call `supabase.auth.mfa.challenge({ factorId })` to create a challenge. Store the returned `challengeId`.
3. Call `supabase.auth.mfa.verify({ factorId, challengeId, code })` with the user's code.
4. If successful, the session is now AAL2. Redirect to `/admin`.
5. If either call fails, display the error and allow retry. The user can correct the code and try again — do not require them to restart from the challenge step.

**Brute-force note:** Supabase enforces TOTP rate limiting server-side. Do NOT add client-side lockout.

### Styling:

Match the MFA enrollment page style exactly — same centered card layout, same brand colors, same font. This page is part of the same auth flow and should feel visually consistent.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- Confirm auto-focus works in preview: open `/admin/mfa-challenge` and verify the input is focused without clicking.
- Confirm the loading spinner appears on mount before the assurance level check resolves.

---

## Step 3: Admin Route Guard (Admin Layout Update)

Update the admin layout component at `artifacts/qb-portal/src/components/admin-layout.tsx`.

The current layout (if it exists from a prior implementation) may perform basic operator role checks. It needs to also verify the assurance level and redirect the operator to the correct MFA page based on their enrollment and session state.

### What the guard must check on every render:

The guard logic should live inside a `useEffect` that runs whenever the user's session or auth state changes — not only on initial mount. This ensures that if a session refresh changes the assurance level, the guard reacts.

The check sequence is:
1. If there is no session at all (user is not logged in), redirect to `/login`.
2. If the user is logged in but their role is not `operator`, redirect to `/portal` (the customer portal).
3. If the user is an operator, call `supabase.auth.mfa.getAuthenticatorAssuranceLevels()`.
4. If the returned result shows no enrolled TOTP factors (check via `supabase.auth.mfa.listFactors()` or by inspecting the session), redirect to `/admin/mfa-enroll`.
5. If the user has enrolled factors but `currentLevel` is `aal1` (not yet `aal2`), redirect to `/admin/mfa-challenge`.
6. Only if `currentLevel` is `aal2` should the admin layout render its children.

While the assurance level check is in-flight, render a loading indicator (a centered spinner or a blank page with a loading message) — do not flash the admin UI for even a single frame before the check completes.

Import the frontend Supabase client directly from `@/lib/supabase` (or the appropriate path alias) for the MFA calls. Also use the auth context's `user` and `isOperator` values for the role check.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Render children before the AAL2 check resolves — even a single-frame flash of the admin UI is a security leak.
> - Put the guard logic in `componentDidMount` equivalent only — it must re-run when auth state changes (include auth state in the `useEffect` dependency array).
> - Use `router.push` inside a render body — always call navigation inside `useEffect` or an event handler, never during render.
> - Redirect ALL non-AAL2 operators to `/admin/mfa-enroll` — first check whether factors are enrolled; if they are, redirect to `/admin/mfa-challenge` instead.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- While unauthenticated, navigate to `/admin` in the preview — confirm redirect to `/login`.
- Log in as operator (AAL1 only, before MFA) — confirm redirect to `/admin/mfa-challenge` (or `/admin/mfa-enroll` if first time).

---

## Step 4: Backend AAL2 Strict Enforcement

Update the `requireOperator` middleware in `artifacts/api-server/src/routes/qb-portal.ts`.

### Current behavior (from Prompt 03):

The middleware currently logs a warning when the JWT's assurance level is not `aal2`, but still allows the request to proceed. This was intentional in Prompt 03 because MFA enrollment didn't exist yet.

### Required change:

Remove the "log warning and continue" behavior. Replace it with strict enforcement:

The middleware chain for every admin route must be: `router.get('/admin/path', requireAuth, requireOperator, handler)`. `requireAuth` MUST come before `requireOperator`. Do not reorder them and do not merge them into one middleware.

1. After verifying the JWT and confirming the user's role is `operator`, inspect the `aal` claim in the decoded JWT payload. The claim is at `aal` in the JWT's AMR (Authentication Methods References) section, or it may be a top-level claim depending on the Supabase JWT structure. The exact field to check is the session's assurance level — use the value returned by `supabase.auth.getUser(token)` which includes the AAL in its response, or decode the JWT and read the `aal` claim directly.
2. If the `aal` claim is not `"aal2"`, return a 403 response with the JSON body: `{ "error": "MFA verification required. Please complete your two-factor authentication." }`.
3. Do not log a warning — return 403 immediately.

**If the Supabase `getUser()` call fails** (network error, service unavailable): return `503` with body `{ "error": "Auth service unavailable. Please try again." }`. Do NOT let the middleware crash the process with an unhandled rejection.

**If the `aal` claim is missing entirely from the JWT** (e.g., older token format): treat it as NOT `aal2` and return 403. Do not assume a missing claim means AAL2.

This means every single request to any `/api/qb/admin/*` route (all routes protected by `requireOperator`) will require a valid AAL2 session token. A customer impersonating an operator, or an operator who hasn't completed MFA, will receive a 403 and cannot access any admin data.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Apply this strict `aal2` check inside `requireAuth` — only `requireOperator` enforces AAL2. Customer routes use `requireAuth` only and must NOT be affected.
> - Throw an unhandled error if `getUser()` rejects — catch it and return 503.
> - Return 401 when the issue is AAL level (not authentication) — use 403.
> - Leave the old "warn and continue" code as a commented-out block — delete it entirely.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- `grep -rn "aal" artifacts/api-server/src/routes/qb-portal.ts` — must show the strict 403 enforcement, no "warn and continue" pattern.
- Using curl or the browser console, obtain an AAL1 JWT for the operator and make a request to `GET /api/qb/admin/orders` — confirm a 403 response.
- Confirm that a customer JWT against a customer route (e.g., `GET /api/qb/orders`) still returns 200.

---

## Step 5: Register Routes in App.tsx

Update `artifacts/qb-portal/src/App.tsx` to register the two new MFA pages.

- Register the MFA enrollment page at the path `/admin/mfa-enroll`. This route does NOT need to be wrapped in the admin layout guard — the user is in the process of enrolling, so they don't yet have AAL2. It should require authentication (an active session), but not AAL2.
- Register the MFA challenge page at the path `/admin/mfa-challenge`. Same constraint — requires an active session but not AAL2. The page handles the AAL check internally and redirects if already at AAL2.

For both routes: if there is no active Supabase session at all, redirect to `/login`. You can implement this with a simple wrapper that checks `session !== null` before rendering, redirecting if not authenticated.

Also add both paths to `artifacts/qb-portal/public/robots.txt` under the Disallow list:
- `Disallow: /admin/mfa-enroll`
- `Disallow: /admin/mfa-challenge`

These pages should not be indexed by search engines.

> **⚠️ COMMON MISTAKE — DO NOT:**
> - Wrap `/admin/mfa-enroll` or `/admin/mfa-challenge` in the admin layout guard — the user will be stuck in a redirect loop (guard requires AAL2, but the user is on the way to getting AAL2).
> - Forget to update `robots.txt` — both paths must be disallowed.
> - Use a lazy session check that allows a flash of the page before redirecting unauthenticated users — the session check should block render, not run in a `useEffect` after first render.

**Verify this step:**
- Run `pnpm typecheck` — zero errors.
- `grep -rn "mfa-enroll\|mfa-challenge" artifacts/qb-portal/src/App.tsx` — must show both routes registered.
- `grep -n "Disallow" artifacts/qb-portal/public/robots.txt` — must show both paths.
- Navigate to `/admin/mfa-enroll` while logged out in the preview — confirm redirect to `/login`.

---

## Step 6: Verify

Run `pnpm typecheck` from the monorepo root. Fix all TypeScript errors before proceeding with the manual tests.

### Manual test sequence:

Run the app in the Replit preview. Use the operator account (`h.sadiq@nexfortis.com`).

**Test 1 — First-time MFA enrollment:**
1. Log in as the operator with email + password.
2. You should be redirected to `/admin/mfa-enroll` (not to `/admin`).
3. The QR code should appear on screen.
4. Scan the QR code with Google Authenticator, Authy, or a compatible authenticator app.
5. Enter the 6-digit code from the app.
6. Confirm the session upgrades to AAL2 and you are redirected to `/admin`.

**Test 2 — Subsequent logins with MFA challenge:**
1. Log out (use the sign-out action in the app).
2. Log back in with the same operator credentials.
3. You should be redirected to `/admin/mfa-challenge` (not to `/admin/mfa-enroll`, and not directly to `/admin`).
4. The challenge page shows the 6-digit code input, auto-focused.
5. Enter the code from your authenticator app.
6. Confirm the session upgrades to AAL2 and you are redirected to `/admin`.

**Test 3 — Wrong code handling:**
1. On the MFA challenge page, enter an incorrect 6-digit code (e.g., `000000`).
2. The error message should appear: "Incorrect code. Please check your authenticator app and try again."
3. The input should remain on screen for the user to correct and retry.
4. Enter the correct code. The redirect to `/admin` should succeed.

**Test 4 — Admin route protection without MFA (AAL1 token):**
1. Using a REST client (e.g., curl, Postman, or the browser console), obtain a valid JWT for the operator by completing step 1 of the login (password authentication gives an AAL1 token).
2. Make a GET request to any admin API route (e.g., `GET /api/qb/admin/orders`) with that AAL1 token in the `Authorization: Bearer` header.
3. Confirm you receive a 403 response with the message "MFA verification required."
4. Now complete the MFA challenge, obtain the AAL2 session token, and repeat the request. Confirm it succeeds (200 response).

**Test 5 — Customer accounts are not affected:**
1. Log in as a customer (any non-operator account).
2. Navigate the customer portal normally.
3. Confirm that customers are NOT prompted for MFA at any point.
4. Confirm that customer API routes (orders, support tickets, profile) work normally.

### Security verification (grep checks):

Run these from the monorepo root and confirm the output:
- `grep -rn "aal" artifacts/api-server/src/routes/qb-portal.ts` — should show the strict AAL2 enforcement code that returns 403 when AAL is not `aal2`.
- `grep -rn "mfa-enroll\|mfa-challenge" artifacts/qb-portal/src/App.tsx` — should show both routes registered.
- `grep -rn "getAuthenticatorAssuranceLevels\|listFactors" artifacts/qb-portal/src/` — should show usage in the admin layout and the MFA challenge page.
- `grep -rn "secret\|qr_code" artifacts/qb-portal/src/pages/admin/mfa-enroll.tsx` — confirm no `console.log` lines reference these values.

---

## Constraints

- Do NOT modify any files in `docs/` — documentation is managed separately.
- Do NOT modify `artifacts/qb-portal/public/products.json` — catalog data is managed separately.
- Do NOT touch the main customer auth flow (login page, register page, social login, password reset) — those were built in Prompt 03 and must not be changed.
- Do NOT implement file upload or file storage changes — that is covered in Prompt 04.
- Do NOT create any admin panel pages (orders list, customers, tickets) — those are covered in Prompt 05.
- MFA enrollment and challenge only apply to the operator role. Customer accounts are completely unaffected by this prompt.
- The `requireOperator` change in Step 4 strictly tightens security. It must not accidentally apply to `requireAuth` — customer-facing routes must continue to work without MFA.
