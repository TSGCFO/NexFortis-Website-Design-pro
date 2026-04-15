# Prompt 03 — Launcher

Before doing anything else:

1. Read `replit.md` — full project context, architecture, conventions.
2. Read the full prompt at `docs/prompts/prompt-03-admin-auth-foundation.md` — complete step-by-step instructions.
3. Execute every step in order (Steps 1 through 10).

**Do not modify any files in `docs/`.** 

The prompt has 10 steps:
- Step 1: Add `role` column to qb_users table
- Step 2: Run database migration
- Step 3: Seed operator account (h.sadiq@nexfortis.com)
- Step 4: Update token system to include role (generateToken, verifyToken, extractAuth)
- Step 5: Add admin API routes (dashboard, orders, tickets, customers) with requireOperator middleware
- Step 6: Update frontend auth context with role and isOperator
- Step 7: Create admin layout component with sidebar nav
- Step 8: Register admin routes in frontend router, add admin link in header
- Step 9: Update robots.txt to disallow /admin
- Step 10: Verify with `pnpm typecheck` and test in preview

Go read the full prompt file now and execute it.
