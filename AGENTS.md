# AGENTS.md

## Cursor Cloud specific instructions

This is a pnpm workspace monorepo (TypeScript, Node.js 22+). See `replit.md` for project rules, architecture overview, and anti-patterns.

### Services overview

| Service | Package filter | Dev command | Default port |
|---|---|---|---|
| API Server | `@workspace/api-server` | `DATABASE_URL="postgresql://ubuntu:devpass@localhost:5432/nexfortis" PORT=3001 pnpm --filter @workspace/api-server dev` | 3001 |
| NexFortis Website | `@workspace/nexfortis` | `PORT=5173 BASE_PATH="/" pnpm --filter @workspace/nexfortis dev` | 5173 |
| QB Portal | `@workspace/qb-portal` | `PORT=5174 BASE_PATH="/" pnpm --filter @workspace/qb-portal dev` | 5174 |

### PostgreSQL setup (required for API server)

PostgreSQL 16 must be running. After install:

```
sudo pg_ctlcluster 16 main start
sudo -u postgres createuser -s ubuntu
sudo -u postgres psql -c "ALTER USER ubuntu WITH PASSWORD 'devpass';"
sudo -u postgres createdb nexfortis
DATABASE_URL="postgresql://ubuntu:devpass@localhost:5432/nexfortis" pnpm --filter @workspace/db push
```

### Key gotchas

- **Vite configs require `PORT` and `BASE_PATH` env vars.** Both frontend apps (`nexfortis`, `qb-portal`) will crash at startup if these are missing. This is a Replit platform convention — pass them as inline env vars when running dev servers outside Replit.
- **API server requires `DATABASE_URL` and `PORT` env vars.** It will throw at startup without them.
- **Optional services (Supabase, Stripe, Resend) degrade gracefully.** The API server starts and functions without them; auth routes return 503, payments are simulated, and emails are logged.
- **`pnpm.onlyBuiltDependencies`** in `pnpm-workspace.yaml` covers `esbuild`, `@swc/core`, `msw`, and `unrs-resolver`. Do not run `pnpm approve-builds` interactively.
- **Typecheck:** `pnpm typecheck` at root runs composite lib builds first, then per-artifact checks.
- **No `.env` files.** Environment variables are managed via Replit Secrets in production; in Cursor Cloud, pass them inline or export in the shell session.
- **`docs/` directory is read-only** — do not modify files there.
