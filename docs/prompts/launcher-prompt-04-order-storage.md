# Launcher: Prompt 04 — Order Flow + Supabase Storage

Before doing anything else:
1. Read `replit.md` — project context.
2. Read `docs/prd/qb-portal/feature-security-auth-storage.md` — Section 8.3.
3. Read `docs/implementation-plan.md` — dependencies.
4. Read `docs/prompts/prompt-04-order-flow-supabase-storage.md` — full instructions.
5. Execute all steps (Steps 0–9).

**Do not modify any files in `docs/`.**

PREREQUISITE: Prompt 03 complete — Supabase client, `requireAuth`, schema migration.

9 steps: order form updates (product IDs, per-service file types, volume packs, bundles), verify order-files bucket, migrate upload to Supabase memoryStorage at {user_id}/{order_id}/{filename}, OLE2 magic byte validation on QBM, signed download URLs (1h/15m), upload token to X-Upload-Token header, pg_cron 7-day auto-delete SQL, expired-file UI in portal, full verification.
