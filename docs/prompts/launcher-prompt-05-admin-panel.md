# Launcher: Prompt 05 — Admin Panel MVP

Before doing anything else:
1. Read `replit.md` — project context.
2. Read `docs/prd/qb-portal/feature-operator-admin-panel.md` — Sections 5.1–5.4.
3. Read `docs/prd/qb-portal/feature-security-auth-storage.md` — operator auth.
4. Read `docs/prompts/prompt-05-admin-panel-mvp.md` — full instructions.
5. Execute all steps (Steps 0–9).

**Do not modify any files in `docs/`.**

PREREQ: Prompts 03, 03B, 04 done — `requireOperator` + AAL2, signed URLs.

9 steps: admin API routes (dashboard stats, orders CRUD, tickets CRUD, customers, operator file download/upload), sidebar layout with nav, admin pages (dashboard, orders table+detail, customers, tickets+reply), register /admin/* routes in App.tsx, header admin link for operators only, order status updates, signed URL downloads, robots.txt, full verification (typecheck, all flows, customer 403 test).
