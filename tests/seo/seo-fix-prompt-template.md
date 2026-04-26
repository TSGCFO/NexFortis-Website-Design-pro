# SEO Fix Prompt Template

Use this template when handing a Phase 2 SEO audit fix to a cloud agent
(Cursor / Claude Code / Codex).

## Variables to fill in

- `<ISSUE_ID>` — e.g. `C1`, `I3`, `M2`
- `<DESCRIPTION>` — the audit finding from `nexfortis-codebase-analysis.md`
- `<FILES>` — exact files to modify
- `<EXPECTED>` — what the test suite should report after the fix

## Template

Branch: feat/seo-fix-<issue-id>-<short-slug>

Context:
- The repository has a four-layer SEO regression test suite under tests/seo/.
- Pre-existing audit findings are allowlisted in tests/seo/__known-issues__.json.
- Your job: implement <DESCRIPTION>, remove the corresponding allowlist entry,
  and re-baseline any intentionally-changed snapshots.

Instructions:
1. Read docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md
   sections 4.1 (layout) and 4.2 (invariants).
2. Read tests/seo/README.md.
3. Locate the allowlist entry for <ISSUE_ID> in
   tests/seo/__known-issues__.json. Confirm it matches the audit finding.
4. Make the minimal code change in <FILES>. Do not modify anything else.
5. Run `pnpm build` to refresh dist artifacts.
6. Run `pnpm test:seo:invariants` — confirm the previously-allowlisted
   violation no longer occurs.
7. Remove that entry from __known-issues__.json.
8. Run `pnpm test:seo:invariants` — must pass without the allowlist entry.
9. Run `pnpm test:seo:snapshots` — review every diff.
10. If diffs are intentional consequences of the fix:
    - `pnpm test:seo:update`
    - Re-run `pnpm test:seo` — must pass.
    - Snapshot diffs will be visible in the PR for review.
11. Run `pnpm test:seo` once more end-to-end.
12. Commit, push, open PR. Title format: `fix(seo): <ISSUE_ID> <DESCRIPTION>`.
    PR body must include:
    - Audit reference
    - Before/after measurements (e.g. title pixel width 612 → 471)
    - List of allowlist entries removed
    - List of snapshot files touched

Expected end state:
<EXPECTED>

Constraints:
- Do not modify any other allowlist entries.
- Do not modify any tests/seo/lib/* file (those are infrastructure).
- Do not modify the docs/ directory (read-only by repo convention; only docs/superpowers/specs/ and docs/superpowers/plans/ are writable).
- All work must be in a single PR with a clean diff.
