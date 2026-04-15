# Launcher: Prompt 03B — MFA Enrollment + AAL2 Enforcement

Your task is to add TOTP-based MFA enrollment and AAL2 enforcement for the admin panel. Your PRIMARY INSTRUCTIONS are in `docs/prompts/prompt-03b-mfa-enrollment-aal2.md` — that file tells you exactly what to build, step by step (Steps 0–6). Follow it precisely.

PREREQUISITE: Prompt 03 must be complete — Supabase client, auth context, and `requireOperator` middleware must already exist. If they don't, stop and report.

Before starting, read these files for context (do NOT modify them):
- `replit.md` — project conventions and architecture.
- `docs/prd/qb-portal/feature-security-auth-storage.md` — sections 8.2–8.3 (MFA requirements).

Then open `docs/prompts/prompt-03b-mfa-enrollment-aal2.md` and execute Steps 0 through 6 in order.

6 steps: MFA enrollment page (QR + manual secret + verify), MFA challenge page (AAL check + auto-focused TOTP input), admin layout guard (AAL2 on every render), backend requireOperator upgrade (403 when not AAL2), route registration + robots.txt, full verification.

Do not modify any files in `docs/`.
