# Launcher: Prompt 03B — MFA Enrollment + AAL2 Enforcement

Add TOTP-based MFA for the admin panel. PRIMARY INSTRUCTIONS: `docs/prompts/prompt-03b-mfa-enrollment-aal2.md` — follow Steps 0–6 precisely.

PREREQUISITE: Prompt 03 must be complete — Supabase client, auth context, `requireOperator` middleware must exist. If not, stop and report.

Before starting, read these files (do NOT modify them):
- `replit.md` — read the ENTIRE file, especially "Replit Platform Constraints & Implementation Rules". It documents anti-patterns that caused bugs in previous tasks.
- `docs/prd/qb-portal/feature-security-auth-storage.md` — sections 8.2–8.3.

Then execute Steps 0–6 in order. Pay close attention to every "COMMON MISTAKE" warning block in the prompt — these are real bugs from prior tasks.

6 steps: MFA enrollment page (QR + manual secret + verify), MFA challenge page (3-way AAL state check), admin layout guard (AAL2 every render), backend requireOperator upgrade (403 when not AAL2), route registration + robots.txt, full verification.

Do not modify `docs/`. After finishing, run all verification checks in the prompt AND in replit.md Section 7.
