# AEO Gap Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close four AEO gaps across the two NexFortis sites: unblock AI crawlers, add llms.txt to both sites, generate a machine-readable pricing.md for the QB portal, and stand up AI-visibility monitoring.

**Architecture:** Two PRs from branch `seo/aeo-gap-fixes`. PR 1 = static discovery files (robots.txt edits + llms.txt) with no build changes. PR 2 = a Node build script (`generate-pricing.mjs`) modeled on the existing `generate-sitemap.mjs` that reads `public/products.json` and emits `pricing.md`. Monitoring is a separate non-code workstream (baseline + scheduled task).

**Tech Stack:** Static text/markdown files; Node ESM build script (`node:fs`, `node:path`); existing pnpm@10.33.2 + Vite build; **`node --test` (Node's built-in test runner) with `node:test` + `node:assert/strict`** for the generator's pure formatting logic — this is the repo convention (e.g. `tests/seo-dedupe.test.mjs`). Do NOT use Vitest for this; qb-portal has no Vitest dependency and the repo reserves Vitest only for `test:seo:components`.

**CI reality (verified):** The repo's SEO test suite (`tests/seo/invariants.test.mjs`, `tests/seo/snapshots.test.mjs`) asserts only on rendered HTML and sitemap `<loc>` URLs. It does NOT enumerate `public/` files or assert on robots.txt content. Therefore robots.txt edits, llms.txt, and pricing.md are CI-safe **provided the sitemap is not changed** (another reason pricing.md stays out of the sitemap). CI builds qb-portal **vite-only** (`vite build`), deliberately skipping its prerender step (known issue C2, helmet timeout). All qb-portal build verification in this plan uses `vite build`, never full `pnpm build`.

**Process constraint (non-negotiable):** Nothing is committed or pushed to `main`. All work lands via PRs for the user to review and merge. The implementer does NOT merge.

---

## File Structure

**PR 1 (static discovery files):**
- Modify: `artifacts/nexfortis/public/robots.txt`
- Modify: `artifacts/qb-portal/public/robots.txt`
- Create: `artifacts/nexfortis/public/llms.txt`
- Create: `artifacts/qb-portal/public/llms.txt`

**PR 2 (generated pricing.md):**
- Create: `artifacts/qb-portal/scripts/generate-pricing.mjs` (generator)
- Create: `artifacts/qb-portal/scripts/pricing-lib.mjs` (pure formatting helpers, testable)
- Create: `tests/pricing-lib.test.mjs` (unit tests, root `tests/` dir, run via `node --test`)
- Modify: `artifacts/qb-portal/package.json` (build script + `"pricing"` alias)
- Modify: one in-page component (footer) to link `/pricing.md`

(The pricing.md → llms.txt link is added in PR1's Task 3, so PR2 does not re-touch llms.txt.)

> Splitting the generator into `pricing-lib.mjs` (pure functions: cents→CAD, group-by-category, render-markdown) and `generate-pricing.mjs` (I/O: read JSON, call lib, write files) keeps the testable logic isolated from filesystem side effects — mirrors how the codebase separates concerns and lets us TDD the formatting without touching disk.

---

# PR 1 — AEO discovery files (static, zero build risk)

## Task 1: Unblock AI crawlers in the main-site robots.txt

**Files:**
- Modify: `artifacts/nexfortis/public/robots.txt`

**Context:** The file currently has a `User-agent: *` default block, an "AI training crawlers" group where 9 bots each have `Disallow: /`, and an "AI search/grounding crawlers" group where allowed bots use `Allow: /` + the two main-site exclusions (`/admin/login`, `/blog/admin`). We move 7 bots from the blocked group to allowed, keep 2 blocked.

- [ ] **Step 1: Remove the 7 unblocked bots from the training-crawler block**

In `artifacts/nexfortis/public/robots.txt`, DELETE these blocks (keep `Bytespider` and `Omgilibot`):

```
User-agent: GPTBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: cohere-ai
Disallow: /
```

The remaining training-crawler section must be exactly:

```
# AI scrapers with no citation value — disallow
User-agent: Bytespider
Disallow: /

User-agent: Omgilibot
Disallow: /
```

- [ ] **Step 2: Add the 7 bots to the allowed group**

In the "AI search/grounding crawlers" section, after the existing `OAI-SearchBot` block, ADD (each gets the same exclusions the allowed bots already use):

```
User-agent: GPTBot
Allow: /
Disallow: /admin/login
Disallow: /blog/admin

User-agent: ClaudeBot
Allow: /
Disallow: /admin/login
Disallow: /blog/admin

User-agent: anthropic-ai
Allow: /
Disallow: /admin/login
Disallow: /blog/admin

User-agent: Claude-Web
Allow: /
Disallow: /admin/login
Disallow: /blog/admin

User-agent: Google-Extended
Allow: /
Disallow: /admin/login
Disallow: /blog/admin

User-agent: CCBot
Allow: /
Disallow: /admin/login
Disallow: /blog/admin

User-agent: cohere-ai
Allow: /
Disallow: /admin/login
Disallow: /blog/admin
```

- [ ] **Step 3: Verify the file is well-formed**

Run:
```bash
cd artifacts/nexfortis
grep -c "User-agent:" public/robots.txt    # expect bot count to match (default + 9 named + facebook)
grep -A1 "User-agent: GPTBot" public/robots.txt   # expect "Allow: /"
grep -A1 "User-agent: Bytespider" public/robots.txt # expect "Disallow: /"
```
Expected: GPTBot shows `Allow: /`; Bytespider shows `Disallow: /`; no `User-agent:` line appears twice for the same bot.

- [ ] **Step 4: Commit**

```bash
git add artifacts/nexfortis/public/robots.txt
git commit -m "feat(seo): unblock AI citation crawlers in main-site robots.txt"
```

---

## Task 2: Unblock AI crawlers in the QB-portal robots.txt

**Files:**
- Modify: `artifacts/qb-portal/public/robots.txt`

**Context:** Same change as Task 1, but the portal's allowed-bot exclusion block is the 15-line private-path list (portal/login/register/forgot-password/reset-password/order/auth-callback/admin/mfa/ticket).

- [ ] **Step 1: Remove the 7 unblocked bots from the training-crawler block**

DELETE the `Disallow: /` blocks for GPTBot, anthropic-ai, ClaudeBot, Claude-Web, CCBot, Google-Extended, cohere-ai. Keep only:

```
# AI scrapers with no citation value — disallow
User-agent: Bytespider
Disallow: /

User-agent: Omgilibot
Disallow: /
```

- [ ] **Step 2: Add the 7 bots to the allowed group**

After the existing `OAI-SearchBot` block, ADD one block per bot (GPTBot, ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, CCBot, cohere-ai), each using EXACTLY this exclusion list (copied from the existing PerplexityBot block):

```
User-agent: GPTBot
Allow: /
Disallow: /portal
Disallow: /portal/
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /order
Disallow: /order/
Disallow: /auth/callback
Disallow: /admin
Disallow: /admin/
Disallow: /admin/mfa-enroll
Disallow: /admin/mfa-challenge
Disallow: /ticket
Disallow: /ticket/
```

Repeat the identical block (only changing the `User-agent:` line) for: ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, CCBot, cohere-ai.

- [ ] **Step 3: Verify**

Run:
```bash
cd artifacts/qb-portal
grep -A1 "User-agent: GPTBot" public/robots.txt    # expect "Allow: /"
grep -A1 "User-agent: Bytespider" public/robots.txt # expect "Disallow: /"
grep -c "Disallow: /portal$" public/robots.txt      # expect one per allowed bot
```
Expected: GPTBot allowed with the private-path exclusions; Bytespider still fully blocked.

- [ ] **Step 4: Commit**

```bash
git add artifacts/qb-portal/public/robots.txt
git commit -m "feat(seo): unblock AI citation crawlers in qb-portal robots.txt"
```

---

## Task 3: Add llms.txt to both sites

**Files:**
- Create: `artifacts/nexfortis/public/llms.txt`
- Create: `artifacts/qb-portal/public/llms.txt`

- [ ] **Step 1: Create the main-site llms.txt**

Create `artifacts/nexfortis/public/llms.txt` with EXACTLY:

```
# NexFortis IT Solutions

> Canadian IT services company (Nobleton, ON) providing managed IT, Microsoft 365, QuickBooks migration, digital marketing, and workflow automation for small-to-medium businesses across Canada.

## Services
- [Services overview](https://nexfortis.com/services)
- [IT Consulting & Managed IT](https://nexfortis.com/services/it-consulting)
- [Microsoft 365](https://nexfortis.com/services/microsoft-365)
- [QuickBooks Migration & Tools](https://nexfortis.com/services/quickbooks)
- [Digital Marketing](https://nexfortis.com/services/digital-marketing)
- [Workflow Automation](https://nexfortis.com/services/workflow-automation)

## Key pages
- [About](https://nexfortis.com/about)
- [Contact](https://nexfortis.com/contact)
- [Blog](https://nexfortis.com/blog)
```

- [ ] **Step 2: Create the QB-portal llms.txt (includes the pricing.md link)**

Create `artifacts/qb-portal/public/llms.txt` with EXACTLY:

```
# NexFortis IT Solutions — QuickBooks Conversion Portal

> Productized, fixed-price QuickBooks file conversion and data migration services for Canadian businesses (Enterprise/Premier/Pro conversions, file recovery, .QBM handling, add-ons). Operated by NexFortis IT Solutions, Nobleton, ON.

## Key pages
- [Service catalog](https://qb.nexfortis.com/catalog)
- [FAQ](https://qb.nexfortis.com/faq)
- [QBM file guide](https://qb.nexfortis.com/qbm-guide)
- [Subscription / support plans](https://qb.nexfortis.com/subscription)
- [Pricing (machine-readable)](https://qb.nexfortis.com/pricing.md)

## Notes
- Individual services live under /service/<slug>; categories under /category/<slug> — all linked from the catalog.
- Portal, login, checkout, and admin routes are private and excluded.
```

> The `/pricing.md` link is added here in PR1 even though the file ships in PR2. A dead link for the short window between PRs is acceptable and avoids re-touching llms.txt later. If PRs are merged out of order, the link resolves once PR2 lands.

- [ ] **Step 3: Verify both files exist and are non-empty**

Run:
```bash
test -s artifacts/nexfortis/public/llms.txt && echo "main OK"
test -s artifacts/qb-portal/public/llms.txt && echo "portal OK"
grep -c "https://" artifacts/nexfortis/public/llms.txt   # expect 9
grep -c "https://" artifacts/qb-portal/public/llms.txt    # expect 5
```
Expected: both "OK"; link counts match.

- [ ] **Step 4: Commit**

```bash
git add artifacts/nexfortis/public/llms.txt artifacts/qb-portal/public/llms.txt
git commit -m "feat(seo): add llms.txt to both sites for AI agent discovery"
```

---

## Task 4: Open PR 1

- [ ] **Step 1: Push the branch**

```bash
git push -u origin seo/aeo-gap-fixes
```

- [ ] **Step 2: Open the PR (does NOT merge)**

```bash
gh pr create --base main --head seo/aeo-gap-fixes \
  --title "AEO discovery files: unblock AI crawlers + llms.txt" \
  --body "Closes AEO gaps (static files, no build changes).

## Changes
- robots.txt (both sites): unblock GPTBot, ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, CCBot, cohere-ai for AI citation. Keep Bytespider/Omgilibot blocked. Login/checkout/admin paths still excluded for all.
- llms.txt (both sites): llmstxt.org-format index per spec.

Spec: docs/superpowers/specs/2026-06-14-aeo-gap-fixes-design.md

Do not merge until reviewed."
```
Expected: PR URL printed. **Do not merge — hand off to the user.**

---

# PR 2 — Generated pricing.md (build change)

> Implement on the SAME branch only if PR1 is merged first; otherwise create a follow-up branch `seo/aeo-pricing-md` off updated `main` to keep PRs independent. Decide with the user at handoff. Tasks below assume the working branch is set.

## Task 5: Write the pure pricing-formatting library (TDD)

**Files:**
- Create: `artifacts/qb-portal/scripts/pricing-lib.mjs`
- Test: `tests/pricing-lib.test.mjs` (root `tests/` dir — matches repo convention; run via `node --test`)

**Context:** Prices in `products.json` are integer CENTS (e.g., `14900` = `$149.00`). Catalog shape: `{ promo_active: boolean, promo_label: string, services: Product[] }`. Each service has `name`, `category`, `base_price_cad`, `launch_price_cad`, `turnaround`, `is_addon`. There are 4 real categories. **The repo uses Node's built-in test runner (`node --test`), NOT Vitest.** Tests live in the root `tests/` dir as `*.test.mjs` using `node:test` + `node:assert/strict` (see `tests/seo-dedupe.test.mjs` for the pattern). The import path from `tests/` to the lib is `../artifacts/qb-portal/scripts/pricing-lib.mjs`.

- [ ] **Step 1: Write failing tests**

Create `tests/pricing-lib.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  centsToCAD,
  groupByCategory,
  renderPricingMarkdown,
} from "../artifacts/qb-portal/scripts/pricing-lib.mjs";

test("centsToCAD formats cents as CAD with 2 decimals", () => {
  assert.equal(centsToCAD(14900), "$149.00 CAD");
  assert.equal(centsToCAD(7500), "$75.00 CAD");
  assert.equal(centsToCAD(0), "$0.00 CAD");
});

test("groupByCategory groups by category preserving first-appearance order", () => {
  const services = [
    { name: "A", category: "Cat1", base_price_cad: 100, launch_price_cad: 50, turnaround: "1h" },
    { name: "B", category: "Cat2", base_price_cad: 200, launch_price_cad: 100, turnaround: "2h" },
    { name: "C", category: "Cat1", base_price_cad: 300, launch_price_cad: 150, turnaround: "3h" },
  ];
  const grouped = groupByCategory(services);
  assert.deepEqual([...grouped.keys()], ["Cat1", "Cat2"]);
  assert.deepEqual(grouped.get("Cat1").map((s) => s.name), ["A", "C"]);
});

test("renderPricingMarkdown renders title, promo, category, prices, footer", () => {
  const catalog = {
    promo_active: true,
    promo_label: "Launch Special — 50% Off",
    services: [
      {
        name: "Enterprise → Premier/Pro Standard",
        category: "QuickBooks Conversion Services",
        base_price_cad: 14900,
        launch_price_cad: 7500,
        turnaround: "Under 60 minutes",
      },
    ],
  };
  const md = renderPricingMarkdown(catalog, { generatedAt: "2026-06-14" });
  assert.ok(md.includes("# NexFortis IT Solutions — QuickBooks Conversion Pricing"));
  assert.ok(md.includes("Launch Special — 50% Off"));
  assert.ok(md.includes("## QuickBooks Conversion Services"));
  assert.ok(md.includes("Enterprise → Premier/Pro Standard"));
  assert.ok(md.includes("$75.00 CAD"));   // launch price
  assert.ok(md.includes("$149.00 CAD"));  // regular price
  assert.ok(md.includes("Under 60 minutes"));
  assert.ok(md.includes("2026-06-14"));
  assert.ok(md.includes("All prices in CAD"));
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run (from repo root): `node --test tests/pricing-lib.test.mjs`
Expected: FAIL — cannot find module `pricing-lib.mjs` / exports undefined.

- [ ] **Step 3: Implement the library**

Create `artifacts/qb-portal/scripts/pricing-lib.mjs`:

```js
// Pure formatting helpers for pricing.md generation. No filesystem I/O here.

export function centsToCAD(cents) {
  return `$${(cents / 100).toFixed(2)} CAD`;
}

export function groupByCategory(services) {
  const map = new Map();
  for (const s of services) {
    if (!map.has(s.category)) map.set(s.category, []);
    map.get(s.category).push(s);
  }
  return map;
}

export function renderPricingMarkdown(catalog, { generatedAt }) {
  const lines = [];
  lines.push("# NexFortis IT Solutions — QuickBooks Conversion Pricing");
  lines.push("");
  lines.push(
    "> Machine-readable price list for the NexFortis QuickBooks conversion portal " +
      "(qb.nexfortis.com). All prices in CAD. Operated by NexFortis IT Solutions, Nobleton, ON."
  );
  lines.push("");
  if (catalog.promo_active && catalog.promo_label) {
    lines.push(`**Current promotion:** ${catalog.promo_label} (launch prices shown below are active).`);
    lines.push("");
  }

  const grouped = groupByCategory(catalog.services);
  for (const [category, services] of grouped) {
    lines.push(`## ${category}`);
    lines.push("");
    lines.push("| Service | Regular price | Launch price | Turnaround |");
    lines.push("| --- | --- | --- | --- |");
    for (const s of services) {
      lines.push(
        `| ${s.name} | ${centsToCAD(s.base_price_cad)} | ${centsToCAD(s.launch_price_cad)} | ${s.turnaround} |`
      );
    }
    lines.push("");
  }

  lines.push("---");
  lines.push(`Generated on ${generatedAt}. See https://qb.nexfortis.com/catalog for full service details.`);
  lines.push("");
  return lines.join("\n");
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run (from repo root): `node --test tests/pricing-lib.test.mjs`
Expected: PASS (all tests green).

- [ ] **Step 5: Commit**

```bash
git add artifacts/qb-portal/scripts/pricing-lib.mjs tests/pricing-lib.test.mjs
git commit -m "feat(qb): add tested pricing-markdown formatting library"
```

---

## Task 6: Write the generator script (I/O wrapper)

**Files:**
- Create: `artifacts/qb-portal/scripts/generate-pricing.mjs`

**Context:** Mirror `generate-sitemap.mjs`: resolve paths via `import.meta.url`, dual-write to `public/` and `dist/public/`. The source of truth is `public/products.json`. Note: this reflects the STATIC `promo_active` in products.json (the live admin override is a runtime-only concern; the spec accepts showing both prices regardless, so the static flag is sufficient and the file always lists both regular + launch price).

- [ ] **Step 1: Implement the generator**

Create `artifacts/qb-portal/scripts/generate-pricing.mjs`:

```js
#!/usr/bin/env node
// Builds public/pricing.md (+ dist/public/pricing.md if present) from
// public/products.json. Run any time; safe before or after build.
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPricingMarkdown } from "./pricing-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist", "public");

const sourcePath = path.join(publicDir, "products.json");
if (!existsSync(sourcePath)) {
  throw new Error(`[pricing] ${sourcePath} missing`);
}

const catalog = JSON.parse(await fs.readFile(sourcePath, "utf8"));
const generatedAt = new Date().toISOString().slice(0, 10);
const markdown = renderPricingMarkdown(catalog, { generatedAt });

await fs.writeFile(path.join(publicDir, "pricing.md"), markdown, "utf8");
console.log(`[pricing] wrote ${path.join(publicDir, "pricing.md")}`);

if (existsSync(distDir)) {
  await fs.writeFile(path.join(distDir, "pricing.md"), markdown, "utf8");
  console.log(`[pricing] wrote ${path.join(distDir, "pricing.md")}`);
}
```

- [ ] **Step 2: Run it and inspect output**

Run:
```bash
cd artifacts/qb-portal && node scripts/generate-pricing.mjs && head -25 public/pricing.md
```
Expected: prints "wrote …/public/pricing.md"; output shows the title, the "Launch Special — 50% Off" promo line, a `## QuickBooks Conversion Services` heading, and a table row with `$149.00 CAD` and `$75.00 CAD`.

- [ ] **Step 3: Commit**

```bash
git add artifacts/qb-portal/scripts/generate-pricing.mjs artifacts/qb-portal/public/pricing.md
git commit -m "feat(qb): generate machine-readable pricing.md from catalog"
```

---

## Task 7: Wire the generator into the build

**Files:**
- Modify: `artifacts/qb-portal/package.json`

**Context:** Current build script: `"build": "vite build --config vite.config.ts && node prerender.mjs && node scripts/generate-sitemap.mjs"`. There is already a `"sitemap"` alias.

- [ ] **Step 1: Update the build script and add an alias**

In `artifacts/qb-portal/package.json`, change the `"build"` line to append the pricing generator, and add a `"pricing"` alias after the `"sitemap"` line:

```json
"build": "vite build --config vite.config.ts && node prerender.mjs && node scripts/generate-sitemap.mjs && node scripts/generate-pricing.mjs",
"sitemap": "node scripts/generate-sitemap.mjs",
"pricing": "node scripts/generate-pricing.mjs",
```

- [ ] **Step 2: Verify the build produces pricing.md in dist (vite-only, matching CI)**

> IMPORTANT: qb-portal's full `pnpm build` runs prerender, which fails locally (known issue C2, helmet timeout). CI runs qb-portal vite-only. So verify by running vite build, then the generator (which the build appends), then checking the dist file:

Run (from repo root):
```bash
pnpm --filter @workspace/qb-portal exec vite build --config vite.config.ts
pnpm --filter @workspace/qb-portal run pricing
test -s artifacts/qb-portal/dist/public/pricing.md && echo "dist pricing OK"
```
Expected: vite build succeeds; generator writes both public and dist copies; "dist pricing OK" prints. (The build-script edit is still correct for production, where prerender runs; we just can't exercise the full chain locally.)

- [ ] **Step 3: Commit**

```bash
git add artifacts/qb-portal/package.json
git commit -m "build(qb): generate pricing.md during build"
```

---

## Task 8: Add an in-page link to pricing.md

**Files:**
- Modify: the QB portal footer component (locate with the command below)

**Context:** The spec requires a normal human-visible hyperlink to `/pricing.md` so link-following crawlers can reach it. It must NOT go in the sitemap.

- [ ] **Step 1: Locate the footer component**

Run:
```bash
cd artifacts/qb-portal && grep -rln "footer\|Footer" src/components src/ --include="*.tsx" | head
```
Pick the shared footer (the one rendered in the global layout). Open it and find the existing list of footer links (e.g., FAQ, Terms, Privacy).

- [ ] **Step 2: Add the link**

In the footer's links list, add an anchor matching the existing link style. Because `pricing.md` is a static asset (not a client route), use a plain `<a>`, not the router `<Link>`:

```tsx
<a href="/pricing.md" className="<same classes as sibling footer links>">
  Pricing (text)
</a>
```

Match the surrounding className exactly; do not invent new styling.

- [ ] **Step 3: Verify it renders and points to the asset**

Run (from repo root): `pnpm --filter @workspace/qb-portal exec vite build --config vite.config.ts`
Expected: build passes. Confirm the footer markup contains `href="/pricing.md"`:
```bash
grep -rn 'href="/pricing.md"' artifacts/qb-portal/src/
```
Expected: one match in the footer component.

- [ ] **Step 4: Commit**

```bash
git add artifacts/qb-portal/src
git commit -m "feat(qb): link pricing.md from footer for crawl discovery"
```

---

## Task 9: Run CI-equivalent checks and open PR 2

**Files:** none

- [ ] **Step 1: Run typecheck + the new unit test + the SEO lib tests**

Run (from repo root):
```bash
node --test tests/pricing-lib.test.mjs
pnpm typecheck
```
Expected: pricing-lib tests pass; typecheck passes. (Full `pnpm test:seo` requires built dist for both sites; CI runs the complete suite on the PR. The robots.txt/llms.txt/pricing.md changes do not touch rendered HTML or the sitemap, so they are not expected to affect the SEO invariant/snapshot baselines.)

- [ ] **Step 2: Push and open PR (does NOT merge)**

```bash
git push -u origin <working-branch>
gh pr create --base main --head <working-branch> \
  --title "Generated pricing.md for QB portal (AEO)" \
  --body "Adds a build-generated machine-readable price list for AI agents.

## Changes
- scripts/pricing-lib.mjs (+ tests): pure cents→CAD / grouping / markdown rendering.
- scripts/generate-pricing.mjs: reads public/products.json, dual-writes pricing.md.
- package.json: pricing.md generated during build; added \`pricing\` alias.
- Footer: human-visible link to /pricing.md (NOT in sitemap, per spec).

Spec: docs/superpowers/specs/2026-06-14-aeo-gap-fixes-design.md

Do not merge until reviewed."
```
Expected: PR URL printed. **Do not merge — hand off to the user.**

---

# Monitoring workstream (no repo changes)

## Task 10: Establish the AI-visibility baseline

**Files:** none (output delivered to the user + optionally saved to workspace)

- [ ] **Step 1: Finalize the query list (~15)**

Use these seed queries; confirm/adjust with the user:
- "QuickBooks Enterprise to Premier conversion Canada"
- "QuickBooks Enterprise to Pro conversion service"
- "QuickBooks file conversion service cost Canada"
- "convert QuickBooks Enterprise to Premier cheap"
- "QBM file converter service"
- "QuickBooks data migration service Canada"
- "managed IT provider Nobleton Ontario"
- "Microsoft 365 migration consultant Ontario small business"
- "small business IT support King Township Ontario"
- "vCIO services small business Canada"
- "cheapest QuickBooks data conversion service"
- "QuickBooks Enterprise downgrade to Premier help"
- "QuickBooks conversion turnaround time"
- "NexFortis IT Solutions"
- "NexFortis QuickBooks conversion"

- [ ] **Step 2: Run each query across AI engines and record citations**

For each query, check whether `nexfortis.com` or `qb.nexfortis.com` is cited/linked, and note which competitor domains are cited. Record into a table: query | cited (Y/N) | which engine | competitor domains cited.

- [ ] **Step 3: Deliver the baseline table to the user**

Present as a markdown table + a 3-bullet summary (overall citation rate, strongest query, biggest gap). Optionally save to `docs/superpowers/aeo-visibility-baseline-2026-06-14.md` (do NOT commit unless the user asks).

---

## Task 11: Schedule the recurring visibility check

**Files:** none (scheduled task)

- [ ] **Step 1: Confirm cadence with the user (proposed: monthly)**

- [ ] **Step 2: Create the scheduled task**

Create a recurring task (monthly) that re-runs the Task 10 query list, compares against the prior run, and notifies the user of: new own-citations, lost citations, and new competitor citations. Note to the user that each run consumes credits.

---

## Self-Review (completed during authoring)

- **Spec coverage:** WS1 → Tasks 1–2; WS2 → Task 3; WS3 → Tasks 5–8; discoverability decision → Tasks 3 (llms link) + 8 (in-page link) + sitemap explicitly excluded; PR structure → Tasks 4, 9; WS4 → Tasks 10–11. All acceptance criteria mapped.
- **Placeholder scan:** No TBDs; all file contents and code shown in full. The only deferred lookup (footer component path) has an explicit locate command, which is correct for an existing-codebase edit.
- **Type/name consistency:** `centsToCAD`, `groupByCategory`, `renderPricingMarkdown` used identically in tests, lib, and generator. `renderPricingMarkdown(catalog, { generatedAt })` signature matches across all call sites.
- **Process:** Every PR task says "do not merge — hand off to user." No direct-to-main steps.
