# SEO Regression Test Suite

This directory holds the four-layer SEO regression suite. See
[`docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md`](../../docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md)
for the design rationale.

## Quick start

> **PR #1 status:** only `pnpm test:seo:lib` is wired up. The remaining commands
> are declared as documented entry points and become functional in later PRs.

| Command | What it does | Wired in |
|---|---|---|
| `pnpm test:seo:lib` | Run library-level tests under `tests/seo/lib/` | PR #1 |
| `pnpm test:seo` | Run every layer (lib → component → snapshot → invariants) | PR #8 |
| `pnpm test:seo:components` | Vitest component tests (fast, no build) | PR #8 |
| `pnpm test:seo:snapshots` | Compare prerendered HTML to committed baselines (requires `pnpm build` first) | PR #6 |
| `pnpm test:seo:invariants` | Programmatic SEO rules against prerendered HTML | PR #7 |
| `pnpm test:seo:update` | Accept current HTML as the new snapshot baseline | PR #6 |

## Layout

> Filled in by PR #10. PR #1 only scaffolds the directories.
