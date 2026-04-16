# Launcher: Prompt 04 — Order Flow + Supabase Storage

Build the order flow and migrate file uploads to Supabase Storage. PRIMARY INSTRUCTIONS: `docs/prompts/prompt-04-order-flow-supabase-storage.md` — follow Steps 0–9 precisely.

PREREQUISITE: Prompt 03 must be complete — Supabase client, `requireAuth` middleware, schema migration must exist. If not, stop and report.

Before starting, read these files (do NOT modify them):
- `replit.md` — read the ENTIRE file, especially "Replit Platform Constraints & Implementation Rules". It documents anti-patterns from previous tasks.
- `docs/prd/qb-portal/feature-security-auth-storage.md` — Section 8.3.

Then execute Steps 0–9 in order. Pay close attention to every "COMMON MISTAKE" warning block — these are real bugs from prior tasks. The upload route supports Bearer AND upload-token auth — do NOT add requireAuth to it.

9 steps: order form updates, storage bucket, Supabase Storage migration, OLE2 validation, signed downloads, upload token, pg_cron auto-delete, expired-file UI, verification.

Do not modify `docs/`. After finishing, run all verification checks in the prompt AND in replit.md Section 7.
