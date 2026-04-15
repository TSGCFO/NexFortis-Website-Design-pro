# Launcher: Prompt 04 — Order Flow + Supabase Storage

Your task is to build the order flow and migrate file uploads to Supabase Storage. Your PRIMARY INSTRUCTIONS are in `docs/prompts/prompt-04-order-flow-supabase-storage.md` — that file tells you exactly what to build, step by step (Steps 0–9). Follow it precisely.

PREREQUISITE: Prompt 03 must be complete — Supabase client, `requireAuth` middleware, and schema migration must already exist. If they don't, stop and report.

Before starting, read these files for context (do NOT modify them):
- `replit.md` — project conventions and architecture.
- `docs/prd/qb-portal/feature-security-auth-storage.md` — Section 8.3 (storage requirements).
- `docs/implementation-plan.md` — dependency graph.

Then open `docs/prompts/prompt-04-order-flow-supabase-storage.md` and execute Steps 0 through 9 in order.

9 steps: order form updates (product IDs, file types, volume packs), verify storage bucket, migrate uploads to Supabase Storage, OLE2 magic byte validation, signed download URLs, upload token header, pg_cron 7-day auto-delete, expired-file UI, full verification.

Do not modify any files in `docs/`.
