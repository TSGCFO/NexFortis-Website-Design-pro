# Prompt 01 Fixes — Launcher

The branch `fix/prompt-01-e2e-issues` has already been created for you. You are working in that branch.

Before doing anything else:

1. Read the full fix prompt at `docs/prompts/prompt-01-fixes.md` — it contains 8 steps with exact file paths, line numbers, and replacement code for 24 issues found during E2E testing.
2. Execute every step in that file in order (Steps 1 through 8).
3. Do NOT run `git checkout` — the branch is already set up.

**Do not modify any files in `docs/`.**

Summary of what you're fixing:
- Step 1: products.json special characters (`->` to `→`, `--` to `—`)
- Step 2: Complete FAQ rewrite — stale prices, "coming soon" on live products, references to non-existent products
- Step 3: Service detail "What's Included" — replace generic template with category-aware content
- Step 4: Service detail add-ons section — fix filter so add-ons appear on conversion pages
- Step 5: Catalog category pill counts
- Step 6: Portal support response time (4 hours → 1–2 hours)
- Step 7: Waitlist page copy consistency
- Step 8: Verify typecheck, test preview, commit, push, create PR

Go read the full fix prompt now and execute it.
