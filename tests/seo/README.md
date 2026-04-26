# SEO Regression Test Suite

This directory holds the four-layer SEO regression suite. See
[`docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md`](../../docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md)
for the design rationale.

## Quick start

| Command | What it does |
|---|---|
| `pnpm test:seo` | Run every layer (component → snapshot → invariants) |
| `pnpm test:seo:components` | Vitest component tests only (fast, no build) |
| `pnpm test:seo:snapshots` | Compare prerendered HTML to committed baselines (requires `pnpm build` first) |
| `pnpm test:seo:invariants` | Run programmatic SEO rules against prerendered HTML |
| `pnpm test:seo:update` | Accept current HTML as the new snapshot baseline |

## Layout

> Filled in by PR #10. PR #1 only scaffolds the directories.
