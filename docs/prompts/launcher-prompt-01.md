# Prompt 01 — Launcher

Before doing anything else:

1. Pull latest main: `git pull origin main`
2. Create a new branch: `git checkout -b feat/foundation-catalog-email-seo`
3. Read `replit.md` — it has the full project context, current state, architecture, and conventions.
4. Read the full prompt file at `docs/prompts/prompt-01-foundation-catalog-email-seo.md` — it contains the complete step-by-step instructions with all data (the 20-product JSON, file paths, SEO specs, everything).
5. Execute every step in that prompt file in order (Steps 1 through 6).

**Do not modify any files in `docs/`.**

The prompt file has 6 steps:
- Step 1: Replace products.json with the 20-product catalog (full JSON is in the file)
- Step 2: Update the products.ts helper module for the new schema
- Step 3: Update all frontend components that read from the catalog
- Step 4: Replace all hardcoded `hassansadiq73@gmail.com` with `support@nexfortis.com`
- Step 5: Add SEO foundation (react-helmet-async, SEO component, robots.txt, sitemap.xml, per-page meta tags)
- Step 6: Verify with `pnpm typecheck`, test in preview, commit and push, create PR against main

Go read the full prompt file now and execute it.
