# SEO Regression Test Suite

Four-layer regression suite that locks every SEO behaviour of the NexFortis and
QB Portal artifacts in place. The source of truth for design rationale and
invariant definitions lives in the spec document:

[`docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md`](../../docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md)

---

## Commands

| Command | What it runs | When to use |
|---|---|---|
| `pnpm test:seo` | Full suite: `lib` → `verifiers` → `components` → `snapshots` → `invariants` | Before opening any PR that touches `artifacts/nexfortis/` or `artifacts/qb-portal/` |
| `pnpm test:seo:fast` | `lib` + `verifiers` + `components` only — no build required | Quick local feedback while iterating |
| `pnpm test:seo:lib` | Unit tests for every helper in `tests/seo/lib/` | After touching any `lib/*.mjs` file |
| `pnpm test:seo:components` | Vitest component tests (`tests/seo/components/**`) — no build required | After touching React/component code that affects `<head>` output |
| `pnpm test:seo:snapshots` | Diff prerendered HTML against committed baselines in `__snapshots__/` | After any `pnpm build` — requires a fresh dist |
| `pnpm test:seo:invariants` | Programmatic SEO rules against prerendered HTML | Before every PR that touches `artifacts/nexfortis/` or `artifacts/qb-portal/` |
| `pnpm test:seo:update` | Accept current prerendered HTML as the new snapshot baseline | **Only** after a deliberate, intended change to prerendered output — see below |
| `pnpm test:seo:verifiers` | Unit tests for `scripts/seo-verification/*.mjs` | After touching any verifier script |

> **Build prerequisite:** `test:seo:snapshots` and `test:seo:invariants` both
> read prerendered HTML from `artifacts/*/dist/`. Before running them, build the
> dist artifacts the way CI does — full build for nexfortis, vite-only for
> qb-portal (qb-portal's prerender step is the documented audit issue C2):
>
> ```
> pnpm --filter @workspace/nexfortis run build
> pnpm --filter @workspace/qb-portal exec vite build --config vite.config.ts
> ```
>
> Running root `pnpm build` will fail on qb-portal prerender — use the two
> filtered commands above (mirrors `.github/workflows/seo-tests.yml`).

---

## When to run `pnpm test:seo:update`

`test:seo:update` re-baselines every snapshot to match the current build output.
Run it **only** when you have made an intentional, deliberate change to
prerendered HTML (for example, fixing a title or meta description as part of a
Phase 2 audit fix) and you have already confirmed that `test:seo:invariants`
passes without the corresponding allowlist entry.

**Never run `test:seo:update` to silence a failing snapshot.** A snapshot
failure means the HTML changed unexpectedly. Investigate first; update only if
the diff is the intended consequence of your change.

---

## Allowlist (`__known-issues__.json`)

The file [`tests/seo/__known-issues__.json`](./__known-issues__.json) records
pre-existing audit findings that the test suite is aware of but not yet fixed.
This prevents CI failures for issues that are documented and queued for Phase 2
remediation.

### Entry shape

```json
{
  "INV-001": [
    {
      "site": "nexfortis",
      "route": "/about",
      "current": "2 <h1>",
      "expected": "1 <h1>",
      "issue": "M1",
      "note": "Second H1 is in <noscript> fallback block — pre-existing pattern"
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `site` | Which artifact — `nexfortis` or `qb-portal` |
| `route` | The page route the violation applies to |
| `current` | The actual (failing) value observed in the audit |
| `expected` | The value the invariant requires |
| `issue` | Audit issue ID from `nexfortis-codebase-analysis.md` (e.g. `M1`, `I5`, `C2`) |
| `note` | Human-readable explanation of why this is pre-existing |

### When to ADD an entry

Only when seeding a known, documented audit finding that predates the test suite.
New issues introduced by a code change must **not** be allowlisted — fix them
instead.

### When to REMOVE an entry

Remove an entry immediately after fixing the underlying issue:

1. Make the code change.
2. Build dist artifacts (`pnpm --filter @workspace/nexfortis run build` and
   `pnpm --filter @workspace/qb-portal exec vite build --config vite.config.ts`).
3. Run `pnpm test:seo:invariants` — confirm the violation no longer occurs.
4. Delete the allowlist entry.
5. Run `pnpm test:seo:invariants` again — must pass without the entry.
6. Update snapshots if HTML changed intentionally: `pnpm test:seo:update`.
7. Run `pnpm test:seo` end-to-end — must pass.

---

## Snapshot diff review checklist

When `pnpm test:seo:snapshots` reports an unexpected diff:

- [ ] Did you build the dist artifacts before the test? (stale dist = false diff)
- [ ] Is the changed file inside `artifacts/nexfortis/` or `artifacts/qb-portal/`?
- [ ] Does the diff correspond to an intentional change in the current branch?
- [ ] Does the diff match an allowlisted issue that is now fixed?
- [ ] Are there changes on routes you did not touch? (possible build side-effect)

If all diffs are intentional: run `pnpm test:seo:update`, then re-run
`pnpm test:seo` to confirm everything passes.

If any diff is unexpected: investigate the build output before updating.

---

## Layout

```
tests/seo/
├── README.md                          — this file
├── __known-issues__.json              — allowlist of pre-existing audit findings
├── __snapshots__/
│   ├── nexfortis/                     — one *.snap.json per prerendered route
│   │   ├── index.snap.json
│   │   ├── about.snap.json
│   │   ├── blog.snap.json
│   │   ├── blog_*.snap.json           — individual blog post snapshots
│   │   ├── contact.snap.json
│   │   ├── privacy.snap.json
│   │   ├── services.snap.json
│   │   ├── services_*.snap.json       — individual service page snapshots
│   │   ├── sitemap.snap.json
│   │   └── terms.snap.json
│   └── qb-portal/
│       ├── index.snap.json
│       └── sitemap.snap.json
├── components/
│   ├── nexfortis/
│   │   └── pages.test.tsx             — component-level SEO tests (Vitest)
│   └── qb-portal/
│       └── pages.test.tsx
├── fixtures/
│   └── seobility-pixel-widths.json    — pixel-width data from the Seobility audit
├── lib/                               — shared infrastructure (read-only)
│   ├── anchor-rules.mjs + .test.mjs
│   ├── extract.mjs + .test.mjs        — HTML extraction helpers
│   ├── jsonld.mjs + .test.mjs         — JSON-LD parsing helpers
│   ├── load-dist.mjs + .test.mjs      — dist loader
│   └── pixel-width.mjs + .test.mjs    — title/description pixel-width measurement
├── invariants.test.mjs                — Layer 3: programmatic SEO invariants
├── snapshots.test.mjs                 — Layer 2: snapshot comparison
└── vitest.setup.ts                    — Vitest setup for component tests
```

---

## CI

Two GitHub Actions jobs are required by branch protection before any PR can be merged:

### `Local SEO test suite`

Runs the full local test suite:

- `pnpm test:seo:lib` — library unit tests
- `pnpm test:seo:components` — Vitest component tests
- `pnpm test:seo:snapshots` — snapshot comparison against committed baselines
- `pnpm test:seo:invariants` — programmatic invariant checks
- `pnpm test:seo:verifiers` — unit tests for `scripts/seo-verification/*.mjs`

The verifier unit tests (`pnpm test:seo:verifiers`) run
`scripts/seo-verification/verify-head-tags.test.mjs` and
`verify-rendered-content.test.mjs` via the `pnpm test:seo:verifiers` script
(wired up in PR #9).

### `Verify Render PR previews`

Runs [`scripts/seo-verification/verify-head-tags.mjs`](../../scripts/seo-verification/verify-head-tags.mjs)
and [`scripts/seo-verification/verify-rendered-content.mjs`](../../scripts/seo-verification/verify-rendered-content.mjs)
against the live Render preview URL for the PR:

```
https://<service>-pr-<N>.onrender.com
```

Both checks must be green before a PR can be merged. This ensures that SEO tags
visible to search-engine bots in the deployed preview match the same invariants
enforced locally.
