# Launcher: Prompt 03B — MFA Enrollment + AAL2 Enforcement

Before doing anything else:
1. Read `replit.md` — project context and conventions.
2. Read `docs/prd/qb-portal/feature-security-auth-storage.md` — sections 8.2–8.3.
3. Read `docs/prompts/prompt-03b-mfa-enrollment-aal2.md` — full instructions.
4. Execute all steps in order (Steps 0–6).

**Do not modify any files in `docs/`.**

PREREQUISITE: Prompt 03 must be complete — Supabase client, auth context, and `requireOperator` must exist.

6 steps: (1) MFA enrollment page: QR code display, manual secret, `challengeAndVerify` flow, NexFortis branding. (2) MFA challenge page: assurance level check on mount, auto-focused input, `challenge` + `verify` flow, redirect to `/admin` on AAL2. (3) Admin layout guard: verify AAL2 on every render, redirect to enrollment or challenge as needed. (4) Backend `requireOperator`: return 403 when JWT `aal` is not `aal2` — removes the Prompt 03 warning-only behavior. (5) Register both routes in App.tsx and robots.txt. (6) Verify: `pnpm typecheck`, test full enrollment and challenge flows, confirm customers unaffected, confirm AAL1 token returns 403 on admin routes.
