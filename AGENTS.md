# AGENTS.md

Guide for any AI agent (Cursor, Claude Code, Codex, Copilot) working in this
repository. Cursor IDE also reads structured rules from
[.cursor/rules/](./.cursor/rules/) — those rules and this file are kept in
sync and intentionally repeat the most important conventions.

## Repo at a glance

This is a pnpm workspace monorepo (TypeScript, Node.js 22+, **pnpm 10**). See
`replit.md` for project rules, architecture overview, and anti-patterns.

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

### Hard rules (do not violate)

- **`docs/` is read-only by repo convention.** The ONLY writable subpaths under
  `docs/` are `docs/superpowers/specs/` and `docs/superpowers/plans/`. Do not
  modify anything else under `docs/`.
- **Branch protection on `main` is active** (ruleset `15556829`). All work
  goes through a PR. Squash merges only. Both `Local SEO test suite` and
  `Verify Render PR previews` must pass, and every review thread must be
  resolved, before a PR can merge.
- **Use pnpm.** `npm` and `yarn` are blocked by the `preinstall` hook.
- **Use the words "collect", "extract", "browse", "read"** when describing
  fetching pages. Do not use "scrape" or "crawl" anywhere — code, comments,
  commit messages, PR bodies, or docs.

### Build commands

Root `pnpm build` runs typecheck then `pnpm -r run build`. The qb-portal
`build` script includes a prerender step that fails (audit issue C2 — helmet
timeout). For local SEO work and CI, mirror the workflow at
[.github/workflows/seo-tests.yml](./.github/workflows/seo-tests.yml):

```
pnpm --filter @workspace/nexfortis run build
pnpm --filter @workspace/qb-portal exec vite build --config vite.config.ts
```

Do not "fix" the qb-portal build by changing the build script — C2 is a
tracked Phase 2 audit item.

### Key gotchas

- **Vite configs require `PORT` and `BASE_PATH` env vars.** Both frontend apps (`nexfortis`, `qb-portal`) will crash at startup if these are missing. This is a Replit platform convention — pass them as inline env vars when running dev servers outside Replit.
- **API server requires `DATABASE_URL` and `PORT` env vars.** It will throw at startup without them.
- **Optional services (Supabase, Stripe, Resend) degrade gracefully.** The API server starts and functions without them; auth routes return 503, payments are simulated, and emails are logged.
- **`pnpm.onlyBuiltDependencies`** in `pnpm-workspace.yaml` covers `esbuild`, `@swc/core`, `msw`, and `unrs-resolver`. Do not run `pnpm approve-builds` interactively.
- **Typecheck:** `pnpm typecheck` at root runs composite lib builds first, then per-artifact checks.
- **No `.env` files.** Environment variables are managed via Replit Secrets in production; in Cursor Cloud, pass them inline or export in the shell session.
- **Routing uses [`wouter`](https://github.com/molefrog/wouter), not React Router.** Component tests under `tests/seo/components/**` use `wouter`'s `memoryLocation` to mount routes — copy the existing pattern.

### SEO regression test suite

A four-layer regression suite under `tests/seo/` locks every SEO behaviour in
place. **Always run `pnpm test:seo` before opening a PR that touches anything
under `artifacts/nexfortis/src/` or `artifacts/qb-portal/src/`.**

| Command | What it runs |
|---|---|
| `pnpm test:seo` | Full chain: `lib` → `verifiers` → `components` → `snapshots` → `invariants` |
| `pnpm test:seo:fast` | `lib` + `verifiers` + `components` only — no build needed |
| `pnpm test:seo:lib` | Unit tests under `tests/seo/lib/` |
| `pnpm test:seo:components` | Vitest component tests |
| `pnpm test:seo:snapshots` | Diff prerendered HTML vs `__snapshots__/` (requires fresh dist) |
| `pnpm test:seo:invariants` | Programmatic SEO rules (requires fresh dist) |
| `pnpm test:seo:update` | Re-baseline snapshots — only after intentional changes |
| `pnpm test:seo:verifiers` | Unit tests for `scripts/seo-verification/*.mjs` |

Workflow when fixing an audit issue:
1. Make the code change.
2. Build dist artifacts (mirror CI — see [Build commands](#build-commands) above).
3. `pnpm test:seo:invariants` — confirm the previously-allowlisted violation
   no longer occurs.
4. Remove the corresponding entry from
   [`tests/seo/__known-issues__.json`](./tests/seo/__known-issues__.json) in
   the same PR.
5. `pnpm test:seo:update` — re-baseline snapshots that intentionally changed.
6. `pnpm test:seo` — must pass before pushing (runs the full chain).
7. Open PR; CI runs the suite again + verifies the Render PR preview.

**Never add a new allowlist entry to silence a violation introduced by your
own change.** New entries are reserved for seeding pre-existing, documented
audit findings.

The Phase 2 fix prompt template (one PR per audit issue) is at
[`tests/seo/seo-fix-prompt-template.md`](./tests/seo/seo-fix-prompt-template.md).

Further reading:
- [tests/seo/README.md](./tests/seo/README.md) — full guide (commands, allowlist, snapshot review checklist, layout)
- [docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md](./docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md) — design rationale and invariant definitions
