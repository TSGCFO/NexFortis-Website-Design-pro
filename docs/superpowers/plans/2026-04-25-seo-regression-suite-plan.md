# SEO Regression Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a four-layer automated regression test suite (snapshots, invariants, components, post-deploy verifiers) that locks in every existing SEO behavior of the NexFortis monorepo before any audit fix is applied.

**Architecture:** All test code lives under `tests/seo/`. Layer 1 (snapshots) and Layer 2 (invariants) consume the prerendered HTML in `artifacts/<site>/dist/`. Layer 3 (component tests) runs Vitest + React Testing Library against the page components in `artifacts/nexfortis/src/pages/` and `artifacts/qb-portal/src/pages/`. Layer 4 (post-deploy verifiers) modifies the existing `scripts/seo-verification/*.mjs` to accept `SITEMAP_URLS` env var so CI can point them at Render PR previews. Phase 1 ships in 10 sequential PRs into protected `main`.

**Tech Stack:** Node 24, pnpm workspaces, TypeScript 5.9, Vite 7, React 19, Helmet (`react-helmet-async`), node:test (Node-native runner — already used in repo), Vitest + `@testing-library/react` for component tests, GitHub Actions, Render PR previews.

---

## Conventions used by every PR

Every PR in Phase 1 follows the same shape so subagents (and humans) don't have to re-derive it:

1. **Branch name:** the table in section 5 of the spec defines this exactly (e.g. `feat/seo-tests-1-scaffold`).
2. **Always start from latest `main`:** before any work, run `git fetch origin && git checkout main && git pull --ff-only && git checkout -b <branch>`.
3. **TDD discipline (mandatory — see superpowers:test-driven-development):**
   - Write the failing test first.
   - Run it. **Watch it fail.** Capture the exact failure message.
   - Implement minimal code to make it pass.
   - Run tests again. They must pass.
   - Skipping the watch-it-fail step is a violation of the iron law and the work must be redone.
4. **Verification before commit (see superpowers:verification-before-completion):** before claiming any task complete, run the exact test command and read the full output. No "should pass" claims.
5. **Commit cadence:** one commit per task pair (test + implementation). Use Conventional Commits: `feat(seo-tests): ...`, `test(seo-tests): ...`, `ci(seo-tests): ...`, `docs(seo-tests): ...`, `chore(seo-tests): ...`.
6. **Push & PR:** `git push -u origin <branch>` then open PR via `gh pr create --base main --title "<title>" --body "<body>"`. PR body must list each task by number, what changed, and the verification output.
7. **Wait for CI green** before merging. The branch protection ruleset requires linear history; merge with `gh pr merge --squash --delete-branch` (squash keeps `main` linear).
8. **After merge:** run `git checkout main && git pull --ff-only` before starting the next PR.

If a step in this plan says "Run: `pnpm test:seo:snapshots`" the agent must literally run that command and paste the output into the PR description's verification section. No paraphrasing.

---

## File structure (locked at start)

This is the final shape after PR #10. Each PR adds its slice.

```
nexfortis/
├── tests/
│   └── seo/
│       ├── README.md                          # PR #1 stub, PR #10 final
│       ├── lib/
│       │   ├── extract.mjs                    # PR #2
│       │   ├── extract.test.mjs               # PR #2
│       │   ├── pixel-width.mjs                # PR #3
│       │   ├── pixel-width.test.mjs           # PR #3
│       │   ├── jsonld.mjs                     # PR #4
│       │   ├── jsonld.test.mjs                # PR #4
│       │   ├── anchor-rules.mjs               # PR #5
│       │   ├── anchor-rules.test.mjs          # PR #5
│       │   └── load-dist.mjs                  # PR #6
│       ├── snapshots.test.mjs                 # PR #6
│       ├── invariants.test.mjs                # PR #7
│       ├── components.test.tsx                # PR #8
│       ├── __snapshots__/
│       │   ├── nexfortis/                     # PR #6 — one .snap.json per route
│       │   └── qb-portal/                     # PR #6
│       ├── __known-issues__.json              # PR #7
│       └── fixtures/
│           └── seobility-pixel-widths.json    # PR #3
├── vitest.config.ts                            # PR #1 (root, scoped to tests/seo/components.test.tsx)
├── package.json                                # PR #1 modifies; PR #8 adds devDeps
├── .github/
│   └── workflows/
│       └── seo-tests.yml                       # PR #9
├── scripts/
│   └── seo-verification/
│       ├── verify-head-tags.mjs                # PR #9 modifies (SITEMAP_URLS env)
│       └── verify-rendered-content.mjs         # PR #9 modifies
├── AGENTS.md                                   # PR #10 modifies
└── docs/
    └── seo-fix-prompt-template.md              # PR #10
```

---

# PR #1 — Scaffold

**Branch:** `feat/seo-tests-1-scaffold`
**Title:** `feat(seo-tests): scaffold test directory and pnpm scripts`
**Goal:** Create the empty skeleton, register pnpm scripts, add Vitest config. Nothing in this PR exercises real code beyond a single sanity test that proves the runner works.

## Task 1.1: Create the directory and stub README

**Files:**
- Create: `tests/seo/README.md`
- Create: `tests/seo/lib/.gitkeep`
- Create: `tests/seo/__snapshots__/nexfortis/.gitkeep`
- Create: `tests/seo/__snapshots__/qb-portal/.gitkeep`
- Create: `tests/seo/fixtures/.gitkeep`

- [ ] **Step 1: Start from clean main**

```bash
cd /home/user/workspace/nexfortis
git fetch origin
git checkout main
git pull --ff-only
git checkout -b feat/seo-tests-1-scaffold
```

- [ ] **Step 2: Create the stub README**

Write `tests/seo/README.md` with this exact content:

```markdown
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
```

- [ ] **Step 3: Create the four placeholder directories**

```bash
mkdir -p tests/seo/lib tests/seo/__snapshots__/nexfortis tests/seo/__snapshots__/qb-portal tests/seo/fixtures
touch tests/seo/lib/.gitkeep
touch tests/seo/__snapshots__/nexfortis/.gitkeep
touch tests/seo/__snapshots__/qb-portal/.gitkeep
touch tests/seo/fixtures/.gitkeep
```

## Task 1.2: Add pnpm scripts to root package.json

**Files:**
- Modify: `package.json` (root) — add `test:seo*` scripts

- [ ] **Step 1: Write the failing test**

The "test" here is that pnpm refuses to run an unknown script. Run before changes:

```bash
pnpm test:seo
```

Expected: `ERR_PNPM_NO_SCRIPT  Missing script: test:seo`

This is the failing-state evidence. Save the output to the PR body.

- [ ] **Step 2: Add the scripts**

Edit `package.json` and add these keys to the `scripts` object (preserve all existing keys):

```jsonc
{
  "scripts": {
    "preinstall": "...",                 // existing — DO NOT TOUCH
    "build": "...",                      // existing
    "typecheck:libs": "...",             // existing
    "typecheck": "...",                  // existing
    "start": "...",                      // existing
    "test": "...",                       // existing
    "test:seo": "node --test 'tests/seo/**/*.test.mjs' && pnpm test:seo:components",
    "test:seo:lib": "node --test 'tests/seo/lib/*.test.mjs'",
    "test:seo:snapshots": "node --test 'tests/seo/snapshots.test.mjs'",
    "test:seo:invariants": "node --test 'tests/seo/invariants.test.mjs'",
    "test:seo:components": "vitest run --config vitest.config.ts",
    "test:seo:update": "UPDATE_SNAPSHOTS=1 node --test 'tests/seo/snapshots.test.mjs'"
  }
}
```

- [ ] **Step 3: Verify the script is recognized**

```bash
pnpm run | grep -E "test:seo"
```

Expected: prints all six `test:seo*` keys with their commands. If pnpm shows a blank list, the JSON is malformed — fix before continuing.

## Task 1.3: Add a sanity test that proves the runner works

**Files:**
- Create: `tests/seo/lib/sanity.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `tests/seo/lib/sanity.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";

test("seo test runner is wired up", () => {
  // This test exists so PR #1 has at least one passing assertion proving
  // the node:test runner can discover files under tests/seo/. It will be
  // deleted by PR #2, which adds real tests.
  assert.equal(2 + 2, 4);
});
```

- [ ] **Step 2: Run the test to confirm it passes**

```bash
pnpm test:seo:lib
```

Expected output contains:
```
# tests 1
# pass 1
# fail 0
```

If the runner cannot find the file, your glob in `package.json` is wrong.

## Task 1.4: Add Vitest config (no test file yet)

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Write the config**

Create `vitest.config.ts` at repo root:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["tests/seo/components.test.tsx"],
    environment: "jsdom",
    globals: false,
    setupFiles: ["./tests/seo/vitest.setup.ts"],
    reporters: ["default"],
  },
  resolve: {
    alias: {
      // Match the marketing & portal vite configs so component tests can
      // import from "@/components/..." just like the apps do.
      "@nx": path.resolve(__dirname, "artifacts/nexfortis/src"),
      "@qb": path.resolve(__dirname, "artifacts/qb-portal/src"),
    },
  },
});
```

- [ ] **Step 2: Create the empty vitest setup file**

Create `tests/seo/vitest.setup.ts` with this exact content:

```typescript
// Setup hook for component tests (PR #8 wires assertions). PR #1 only
// stubs this file so vitest does not error on a missing setupFile path.
export {};
```

- [ ] **Step 3: Verify Vitest does not crash on config load**

PR #1 has not added Vitest as a dependency yet (PR #8 does). Run a syntax check only:

```bash
node --check vitest.config.ts 2>&1 || echo "NOTE: ts files cannot be node-checked; skip"
```

We rely on PR #8's CI run to fully exercise this. PR #1's contract is "config exists and parses as valid TypeScript syntax." Open the file and visually confirm.

## Task 1.5: Commit and push

- [ ] **Step 1: Stage and commit**

```bash
cd /home/user/workspace/nexfortis
git add tests/seo package.json vitest.config.ts
git status        # confirm only intended files
git commit -m "feat(seo-tests): scaffold test directory and pnpm scripts

Adds:
- tests/seo/ directory skeleton with README and placeholder dirs
- vitest.config.ts at repo root (used by PR #8)
- pnpm scripts: test:seo, test:seo:lib, test:seo:snapshots,
  test:seo:invariants, test:seo:components, test:seo:update
- tests/seo/lib/sanity.test.mjs (deleted by PR #2)

Refs: docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md"
```

- [ ] **Step 2: Push and open PR**

```bash
git push -u origin feat/seo-tests-1-scaffold
gh pr create --base main \
  --title "feat(seo-tests): scaffold test directory and pnpm scripts (1/10)" \
  --body "$(cat <<'EOF'
## What

PR #1 of the 10-PR Phase 1 SEO regression test suite. Scaffold-only — no real test logic yet.

## Changes
- `tests/seo/` directory with stub README + placeholder subdirs
- `vitest.config.ts` (used by PR #8)
- Six new `test:seo*` pnpm scripts
- One sanity test that PR #2 will delete

## Verification

\`\`\`
$ pnpm test:seo:lib
# tests 1 / pass 1 / fail 0
\`\`\`

## Refs
- Spec: \`docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md\`
- Plan: \`docs/superpowers/plans/2026-04-25-seo-regression-suite-plan.md\`
EOF
)"
```

- [ ] **Step 3: Wait for CI green; merge**

```bash
gh pr checks --watch
gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
```

---

# PR #2 — HTML extractor

**Branch:** `feat/seo-tests-2-extract`
**Title:** `feat(seo-tests): HTML extractor + tests`
**Goal:** Build `tests/seo/lib/extract.mjs` — pure function `extract(html, route) → fingerprint`. Tested in isolation with hand-written HTML fixtures. No build artifacts touched yet.

## Task 2.1: Branch and remove the sanity test

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull --ff-only
git checkout -b feat/seo-tests-2-extract
git rm tests/seo/lib/sanity.test.mjs
```

## Task 2.2: Write the failing extractor test (title)

**Files:**
- Create: `tests/seo/lib/extract.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `tests/seo/lib/extract.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { extract } from "./extract.mjs";

const html = `<!doctype html><html><head>
  <title>About NexFortis | NexFortis IT Solutions</title>
</head><body><div id="root"><h1>About NexFortis</h1></div></body></html>`;

test("extract — title is captured verbatim", () => {
  const fp = extract(html, "/about");
  assert.equal(fp.title, "About NexFortis | NexFortis IT Solutions");
});
```

- [ ] **Step 2: Run and watch it fail**

```bash
pnpm test:seo:lib
```

Expected: `Cannot find module ... extract.mjs`. Save the output.

## Task 2.3: Implement minimal extractor (title only)

**Files:**
- Create: `tests/seo/lib/extract.mjs`

- [ ] **Step 1: Write minimal implementation**

Create `tests/seo/lib/extract.mjs`:

```javascript
// HTML → normalized SEO fingerprint.
// Pure function. No filesystem, no network. Hand-written regex parser
// because we only ever read prerendered, server-emitted HTML.

export function extract(html, route) {
  return {
    route,
    title: matchTitle(html),
  };
}

function matchTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim().replace(/\s+/g, " ") : null;
}
```

- [ ] **Step 2: Run the test — must pass**

```bash
pnpm test:seo:lib
```

Expected: 1 pass / 0 fail.

## Task 2.4: Add description, canonical, robots tests

- [ ] **Step 1: Add tests**

Append to `tests/seo/lib/extract.test.mjs`:

```javascript
test("extract — meta description with double quotes", () => {
  const html = `<head><meta name="description" content="Hello world."></head>`;
  assert.equal(extract(html, "/").description, "Hello world.");
});

test("extract — meta description with single quotes", () => {
  const html = `<head><meta name='description' content='Hello world.'></head>`;
  assert.equal(extract(html, "/").description, "Hello world.");
});

test("extract — canonical link", () => {
  const html = `<head><link rel="canonical" href="https://nexfortis.com/about"></head>`;
  assert.equal(extract(html, "/about").canonical, "https://nexfortis.com/about");
});

test("extract — robots meta", () => {
  const html = `<head><meta name="robots" content="noindex,nofollow"></head>`;
  assert.equal(extract(html, "/").robots, "noindex,nofollow");
});

test("extract — robots defaults to null when absent", () => {
  assert.equal(extract(`<head></head>`, "/").robots, null);
});
```

- [ ] **Step 2: Run tests — watch the new ones fail**

```bash
pnpm test:seo:lib
```

Expected: 1 pass, 5 fail (description/canonical/robots not implemented).

- [ ] **Step 3: Implement the four matchers**

Edit `tests/seo/lib/extract.mjs`:

```javascript
export function extract(html, route) {
  return {
    route,
    title: matchTitle(html),
    description: matchMeta(html, "description"),
    canonical: matchLink(html, "canonical"),
    robots: matchMeta(html, "robots"),
  };
}

function matchTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim().replace(/\s+/g, " ") : null;
}

function matchMeta(html, name) {
  const re = new RegExp(
    `<meta\\s+[^>]*name=["']${name}["'][^>]*content=(?:"([^"]*)"|'([^']*)')[^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (!m) return null;
  return (m[1] ?? m[2]).trim();
}

function matchLink(html, rel) {
  const re = new RegExp(
    `<link\\s+[^>]*rel=["']${rel}["'][^>]*href=(?:"([^"]*)"|'([^']*)')[^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (!m) return null;
  return (m[1] ?? m[2]).trim();
}
```

- [ ] **Step 4: Run — all 6 tests pass**

```bash
pnpm test:seo:lib
```

Expected: `# tests 6 / pass 6 / fail 0`.

## Task 2.5: OG / Twitter / headings / anchors / JSON-LD / rootDivIsEmpty / hasNoindex

The fingerprint shape is fixed in spec section 4.2. We add tests + implementation for each remaining field, following the same red-green pattern.

- [ ] **Step 1: Write all remaining failing tests**

Append to `tests/seo/lib/extract.test.mjs`:

```javascript
test("extract — open graph tags", () => {
  const html = `<head>
    <meta property="og:title" content="OG Title">
    <meta property="og:description" content="OG Desc">
    <meta property="og:url" content="https://nexfortis.com/about">
    <meta property="og:image" content="https://nexfortis.com/og.png">
    <meta property="og:type" content="website">
  </head>`;
  const fp = extract(html, "/about");
  assert.deepEqual(fp.og, {
    title: "OG Title",
    description: "OG Desc",
    url: "https://nexfortis.com/about",
    image: "https://nexfortis.com/og.png",
    type: "website",
  });
});

test("extract — twitter card", () => {
  const html = `<head><meta name="twitter:card" content="summary_large_image"></head>`;
  assert.deepEqual(extract(html, "/").twitter, { card: "summary_large_image" });
});

test("extract — headings preserve order, level, text", () => {
  const html = `<body>
    <h1>About NexFortis</h1>
    <h2>Our Story</h2>
    <h3>Founders</h3>
    <h2>Our Values</h2>
  </body>`;
  assert.deepEqual(extract(html, "/about").headings, [
    { level: 1, text: "About NexFortis" },
    { level: 2, text: "Our Story" },
    { level: 3, text: "Founders" },
    { level: 2, text: "Our Values" },
  ]);
});

test("extract — headings strip nested tags", () => {
  const html = `<body><h1>About <span>NexFortis</span></h1></body>`;
  assert.deepEqual(extract(html, "/about").headings, [
    { level: 1, text: "About NexFortis" },
  ]);
});

test("extract — anchors capture text and href, dedupe by [text,href]", () => {
  const html = `<body>
    <a href="/contact">Contact us</a>
    <a href="/contact">Contact us</a>
    <a href="/services">Browse services</a>
  </body>`;
  assert.deepEqual(extract(html, "/").anchors, [
    { text: "Contact us", href: "/contact" },
    { text: "Browse services", href: "/services" },
  ]);
});

test("extract — JSON-LD blocks, sorted by @type", () => {
  const html = `<head>
    <script type="application/ld+json">{"@type":"WebPage","name":"X"}</script>
    <script type="application/ld+json">{"@type":"BreadcrumbList","itemListElement":[]}</script>
  </head>`;
  const fp = extract(html, "/");
  assert.equal(fp.jsonld.length, 2);
  assert.equal(fp.jsonld[0]["@type"], "BreadcrumbList");
  assert.equal(fp.jsonld[1]["@type"], "WebPage");
});

test("extract — rootDivIsEmpty true when only whitespace inside #root", () => {
  const html = `<body><div id="root">   </div></body>`;
  assert.equal(extract(html, "/").rootDivIsEmpty, true);
});

test("extract — rootDivIsEmpty false when content present", () => {
  const html = `<body><div id="root"><h1>Hi</h1></div></body>`;
  assert.equal(extract(html, "/").rootDivIsEmpty, false);
});

test("extract — hasNoindex true when robots contains noindex", () => {
  const html = `<head><meta name="robots" content="noindex,follow"></head>`;
  assert.equal(extract(html, "/").hasNoindex, true);
});

test("extract — hasNoindex false otherwise", () => {
  assert.equal(extract(`<head></head>`, "/").hasNoindex, false);
});
```

- [ ] **Step 2: Run — confirm all the new tests fail**

```bash
pnpm test:seo:lib
```

You should see ~10 failing tests. Save the failure list to the PR body.

- [ ] **Step 3: Implement remaining matchers**

Replace `tests/seo/lib/extract.mjs` body with:

```javascript
export function extract(html, route) {
  return {
    route,
    title: matchTitle(html),
    description: matchMeta(html, "description"),
    canonical: matchLink(html, "canonical"),
    robots: matchMeta(html, "robots"),
    og: extractOg(html),
    twitter: extractTwitter(html),
    headings: extractHeadings(html),
    jsonld: extractJsonLd(html),
    anchors: extractAnchors(html),
    rootDivIsEmpty: isRootDivEmpty(html),
    hasNoindex: (matchMeta(html, "robots") ?? "").includes("noindex"),
  };
}

function matchTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim().replace(/\s+/g, " ") : null;
}

function matchMeta(html, name) {
  const re = new RegExp(
    `<meta\\s+[^>]*name=["']${name}["'][^>]*content=(?:"([^"]*)"|'([^']*)')[^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (!m) return null;
  return (m[1] ?? m[2]).trim();
}

function matchProperty(html, property) {
  const re = new RegExp(
    `<meta\\s+[^>]*property=["']${property}["'][^>]*content=(?:"([^"]*)"|'([^']*)')[^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (!m) return null;
  return (m[1] ?? m[2]).trim();
}

function matchLink(html, rel) {
  const re = new RegExp(
    `<link\\s+[^>]*rel=["']${rel}["'][^>]*href=(?:"([^"]*)"|'([^']*)')[^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (!m) return null;
  return (m[1] ?? m[2]).trim();
}

function extractOg(html) {
  const og = {};
  for (const key of ["title", "description", "url", "image", "type"]) {
    const v = matchProperty(html, `og:${key}`);
    if (v != null) og[key] = v;
  }
  return og;
}

function extractTwitter(html) {
  const card = matchMeta(html, "twitter:card");
  return card ? { card } : {};
}

function extractHeadings(html) {
  const out = [];
  const re = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  for (const m of html.matchAll(re)) {
    const text = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    out.push({ level: Number(m[1]), text });
  }
  return out;
}

function extractAnchors(html) {
  const seen = new Set();
  const out = [];
  const re = /<a\s+[^>]*href=(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi;
  for (const m of html.matchAll(re)) {
    const href = (m[1] ?? m[2]).trim();
    const text = m[3].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const key = `${text}\u0000${href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ text, href });
  }
  return out;
}

function extractJsonLd(html) {
  const out = [];
  const re = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    try {
      out.push(JSON.parse(m[1]));
    } catch {
      out.push({ __invalid_json__: m[1].slice(0, 200) });
    }
  }
  return out.sort((a, b) => String(a["@type"] ?? "").localeCompare(String(b["@type"] ?? "")));
}

function isRootDivEmpty(html) {
  const m = html.match(/<div\s+id=["']root["'][^>]*>([\s\S]*?)<\/div>\s*(?:<script|<\/body)/i);
  if (!m) return false;
  return m[1].replace(/\s+/g, "").length === 0;
}
```

- [ ] **Step 4: Run — all tests pass**

```bash
pnpm test:seo:lib
```

Expected: `# tests 16 / pass 16 / fail 0`.

## Task 2.6: Commit and PR

- [ ] **Step 1: Commit**

```bash
git add tests/seo/lib/extract.mjs tests/seo/lib/extract.test.mjs
git rm tests/seo/lib/sanity.test.mjs   # already done in Task 2.1
git commit -m "feat(seo-tests): HTML extractor + tests

Adds tests/seo/lib/extract.mjs — pure HTML → fingerprint function with
16 tests covering title, description, canonical, robots, OG, twitter,
headings, anchors (deduped), JSON-LD (sorted by @type), and the
rootDivIsEmpty / hasNoindex flags.

Removes the PR #1 sanity test now that real tests exist."
```

- [ ] **Step 2: Open PR (verification block must include test output)**

```bash
git push -u origin feat/seo-tests-2-extract
gh pr create --base main \
  --title "feat(seo-tests): HTML extractor + tests (2/10)" \
  --body "<paste full test output and merge after CI green>"
gh pr checks --watch
gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
```

---

# PR #3 — Pixel-width calculator

**Branch:** `feat/seo-tests-3-pixel-width`
**Title:** `feat(seo-tests): pixel-width calculator + tests`
**Goal:** Build a pixel-width function calibrated against Seobility's known measurements so INV-002 (title 200–580 px) and INV-003 (description 400–1000 px) match what the audit tool says.

**Why this is hard:** Seobility's exact font metric tables are private. We approximate using a per-character width table for Verdana 11 px (matching their docs). Calibration test cases come from the audit itself — when Seobility reported "title 583 px" for `/about`, our function must return something within ±10 px of that.

## Task 3.1: Branch and seed fixtures

**Files:**
- Create: `tests/seo/fixtures/seobility-pixel-widths.json`

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull --ff-only
git checkout -b feat/seo-tests-3-pixel-width
```

- [ ] **Step 2: Seed the calibration fixture**

Create `tests/seo/fixtures/seobility-pixel-widths.json` with measurements pulled from the codebase analysis. **Each row must include the exact text Seobility measured and the pixel width Seobility reported for it.**

```json
{
  "_doc": "Calibration data extracted from 2026-04-25 Seobility audit. Each entry is { text, kind: 'title'|'description', expected_px, tolerance_px }. Pixel-width function must return a value within tolerance for every row.",
  "_source": "/2026-04-25_venture-full-export.pdf",
  "_font": "Verdana 11px (matches Seobility convention)",
  "rows": [
    { "kind": "title", "text": "About NexFortis | NexFortis IT Solutions", "expected_px": 396, "tolerance_px": 12 },
    { "kind": "title", "text": "Contact us | NexFortis IT Solutions", "expected_px": 343, "tolerance_px": 12 },
    { "kind": "title", "text": "QuickBooks Migration Services | NexFortis IT Solutions", "expected_px": 528, "tolerance_px": 12 },
    { "kind": "description", "text": "NexFortis delivers end-to-end IT solutions for Canadian businesses including managed IT, Microsoft 365, and QuickBooks migration.", "expected_px": 932, "tolerance_px": 20 }
  ]
}
```

> Note for the implementer: if the exact px values above are not present in the audit PDF, replace them with whatever the audit actually reports for the same titles. The point of the file is to be ground truth, not to invent numbers. **Re-derive from `/home/user/workspace/2026-04-25_venture-full-export.pdf` before committing.**

## Task 3.2: Failing test driven by the fixture

**Files:**
- Create: `tests/seo/lib/pixel-width.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pixelWidth } from "./pixel-width.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(
  fs.readFileSync(path.join(here, "..", "fixtures", "seobility-pixel-widths.json"), "utf8"),
);

for (const row of fixture.rows) {
  test(`pixelWidth(${row.kind}) — ${row.text.slice(0, 40)}…`, () => {
    const got = pixelWidth(row.text, row.kind);
    const diff = Math.abs(got - row.expected_px);
    assert.ok(
      diff <= row.tolerance_px,
      `expected ~${row.expected_px} (±${row.tolerance_px}), got ${got} (diff ${diff})`,
    );
  });
}

test("pixelWidth — empty string is 0", () => {
  assert.equal(pixelWidth("", "title"), 0);
});

test("pixelWidth — unknown kind throws", () => {
  assert.throws(() => pixelWidth("x", "headline"));
});
```

- [ ] **Step 2: Run — fails (module missing)**

```bash
pnpm test:seo:lib
```

## Task 3.3: Implement the calculator

**Files:**
- Create: `tests/seo/lib/pixel-width.mjs`

- [ ] **Step 1: Write the implementation**

The character-width table below is for Verdana 11 px, derived from public font-metric data. Calibrate: if a fixture row fails by more than tolerance, scale the table by a single multiplier until all rows pass.

```javascript
// Approximates Seobility's pixel-width measurement for SERP titles &
// meta descriptions. Per-character width table for Verdana 11px.
//
// Calibration target: every row in fixtures/seobility-pixel-widths.json
// must be within its declared tolerance.

const WIDTHS = {
  // letters
  a: 7, b: 7, c: 6, d: 7, e: 7, f: 4, g: 7, h: 7, i: 3, j: 4, k: 7, l: 3, m: 11,
  n: 7, o: 7, p: 7, q: 7, r: 5, s: 6, t: 4, u: 7, v: 7, w: 9, x: 7, y: 7, z: 6,
  A: 8, B: 8, C: 8, D: 9, E: 7, F: 7, G: 9, H: 9, I: 4, J: 5, K: 9, L: 7, M: 10,
  N: 9, O: 9, P: 8, Q: 9, R: 9, S: 8, T: 8, U: 9, V: 8, W: 12, X: 8, Y: 8, Z: 8,
  // digits & space
  "0": 7, "1": 7, "2": 7, "3": 7, "4": 7, "5": 7, "6": 7, "7": 7, "8": 7, "9": 7,
  " ": 4,
  // common punctuation
  ".": 4, ",": 4, "!": 4, "?": 7, ":": 4, ";": 4, "-": 4, "—": 11, "–": 7,
  "(": 4, ")": 4, "[": 4, "]": 4, "/": 4, "\\": 4, "&": 9, "@": 12,
  "'": 3, "\"": 5, "|": 4, "•": 5,
};

const FALLBACK = 7; // average for unmapped chars

const KINDS = {
  title: { fontSize: 11, scale: 1.0 },
  description: { fontSize: 11, scale: 1.0 },
};

export function pixelWidth(text, kind) {
  if (!KINDS[kind]) throw new Error(`unknown kind: ${kind}`);
  const cfg = KINDS[kind];
  let total = 0;
  for (const ch of text) total += WIDTHS[ch] ?? FALLBACK;
  return Math.round(total * cfg.scale);
}
```

- [ ] **Step 2: Run tests, calibrate**

```bash
pnpm test:seo:lib
```

If fixture rows fail by >tolerance, adjust `KINDS[kind].scale` (single multiplier) until they pass. Common case: bump to `1.05` or `1.10` for descriptions if the table under-counts.

- [ ] **Step 3: Confirm all green**

```bash
pnpm test:seo:lib
```

Expected: every fixture row passes within tolerance, plus the empty-string and unknown-kind tests.

## Task 3.4: Commit and PR

- [ ] **Step 1: Commit & push**

```bash
git add tests/seo/lib/pixel-width.mjs tests/seo/lib/pixel-width.test.mjs tests/seo/fixtures/seobility-pixel-widths.json
git commit -m "feat(seo-tests): pixel-width calculator + tests

Calibrated against Seobility audit measurements. Used by INV-002 and
INV-003 to enforce title/description pixel-width budgets."
git push -u origin feat/seo-tests-3-pixel-width
gh pr create --base main --title "feat(seo-tests): pixel-width calculator (3/10)" --body "<verification>"
gh pr checks --watch && gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
```

---

# PR #4 — JSON-LD validator

**Branch:** `feat/seo-tests-4-jsonld`
**Title:** `feat(seo-tests): JSON-LD extractor + validator`
**Goal:** Validate the schema-org payload structure inside JSON-LD blocks: every block has `@context` and `@type`; surface duplicate `@type` per page.

## Task 4.1: Failing tests

**Files:**
- Create: `tests/seo/lib/jsonld.test.mjs`

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull --ff-only
git checkout -b feat/seo-tests-4-jsonld
```

- [ ] **Step 2: Write tests**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateJsonLdBlock, findDuplicateTypes } from "./jsonld.mjs";

test("validateJsonLdBlock — accepts valid block", () => {
  const r = validateJsonLdBlock({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NexFortis",
  });
  assert.deepEqual(r, { ok: true, errors: [] });
});

test("validateJsonLdBlock — rejects missing @context", () => {
  const r = validateJsonLdBlock({ "@type": "Organization", name: "X" });
  assert.equal(r.ok, false);
  assert.match(r.errors.join("|"), /@context/);
});

test("validateJsonLdBlock — rejects missing @type", () => {
  const r = validateJsonLdBlock({ "@context": "https://schema.org", name: "X" });
  assert.equal(r.ok, false);
  assert.match(r.errors.join("|"), /@type/);
});

test("validateJsonLdBlock — rejects __invalid_json__ marker (extractor failure)", () => {
  const r = validateJsonLdBlock({ __invalid_json__: "..." });
  assert.equal(r.ok, false);
});

test("findDuplicateTypes — returns dup types", () => {
  const dups = findDuplicateTypes([
    { "@type": "Organization" },
    { "@type": "Organization" },
    { "@type": "WebPage" },
  ]);
  assert.deepEqual(dups, ["Organization"]);
});

test("findDuplicateTypes — empty when none", () => {
  assert.deepEqual(findDuplicateTypes([{ "@type": "WebPage" }]), []);
});
```

- [ ] **Step 3: Run — fails on missing module**

```bash
pnpm test:seo:lib
```

## Task 4.2: Implementation

**Files:**
- Create: `tests/seo/lib/jsonld.mjs`

- [ ] **Step 1: Write minimal code**

```javascript
export function validateJsonLdBlock(block) {
  const errors = [];
  if (block && block.__invalid_json__ !== undefined) {
    errors.push("block did not parse as JSON");
    return { ok: false, errors };
  }
  if (!block || typeof block !== "object") {
    errors.push("block is not an object");
    return { ok: false, errors };
  }
  if (!block["@context"]) errors.push("missing @context");
  if (!block["@type"]) errors.push("missing @type");
  return { ok: errors.length === 0, errors };
}

export function findDuplicateTypes(blocks) {
  const counts = new Map();
  for (const b of blocks) {
    const t = b?.["@type"];
    if (!t) continue;
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, n]) => n > 1).map(([t]) => t);
}
```

- [ ] **Step 2: Run, expect green**

```bash
pnpm test:seo:lib
```

## Task 4.3: Commit & PR

- [ ] **Step 1**

```bash
git add tests/seo/lib/jsonld.mjs tests/seo/lib/jsonld.test.mjs
git commit -m "feat(seo-tests): JSON-LD extractor + validator

Validates every JSON-LD block has @context + @type and surfaces
duplicate @type within a single page (used by INV-010, INV-013)."
git push -u origin feat/seo-tests-4-jsonld
gh pr create --base main --title "feat(seo-tests): JSON-LD validator (4/10)" --body "<verification>"
gh pr checks --watch && gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
```

---

# PR #5 — Anchor-rule analyzer

**Branch:** `feat/seo-tests-5-anchor-rules`
**Title:** `feat(seo-tests): anchor-rule analyzer`
**Goal:** Cross-page anchor analysis — one anchor text must always point to one URL across the site (audit finding I2). Plus per-anchor length and generic-text rules (I3).

## Task 5.1: Failing tests

**Files:**
- Create: `tests/seo/lib/anchor-rules.test.mjs`

- [ ] **Step 1: Branch & write tests**

```bash
git checkout main && git pull --ff-only
git checkout -b feat/seo-tests-5-anchor-rules
```

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  findAmbiguousAnchors,
  findGenericAnchors,
  findOverlongAnchors,
  GENERIC_ANCHOR_BANLIST,
} from "./anchor-rules.mjs";

test("findAmbiguousAnchors — same text, different hrefs across pages", () => {
  const pages = [
    { route: "/", anchors: [{ text: "Read more", href: "/blog/a" }] },
    { route: "/about", anchors: [{ text: "Read more", href: "/blog/b" }] },
  ];
  const r = findAmbiguousAnchors(pages);
  assert.equal(r.length, 1);
  assert.equal(r[0].text, "Read more");
  assert.deepEqual(new Set(r[0].hrefs), new Set(["/blog/a", "/blog/b"]));
});

test("findAmbiguousAnchors — same text & href is fine", () => {
  const pages = [
    { route: "/", anchors: [{ text: "Contact", href: "/contact" }] },
    { route: "/about", anchors: [{ text: "Contact", href: "/contact" }] },
  ];
  assert.deepEqual(findAmbiguousAnchors(pages), []);
});

test("findGenericAnchors — banlist hits", () => {
  const found = findGenericAnchors([
    { route: "/", anchors: [
      { text: "Read more", href: "/x" },
      { text: "Click here", href: "/y" },
      { text: "Browse our IT services", href: "/z" },
    ] },
  ]);
  assert.equal(found.length, 2);
  assert.deepEqual(found.map((f) => f.text).sort(), ["Click here", "Read more"]);
});

test("findOverlongAnchors — over 120 chars flagged", () => {
  const long = "a".repeat(121);
  const found = findOverlongAnchors([
    { route: "/", anchors: [{ text: long, href: "/x" }, { text: "ok", href: "/y" }] },
  ]);
  assert.equal(found.length, 1);
  assert.equal(found[0].text, long);
});

test("GENERIC_ANCHOR_BANLIST exports a non-empty array", () => {
  assert.ok(GENERIC_ANCHOR_BANLIST.length > 0);
});
```

- [ ] **Step 2: Run — fails on missing module**

```bash
pnpm test:seo:lib
```

## Task 5.2: Implementation

**Files:**
- Create: `tests/seo/lib/anchor-rules.mjs`

- [ ] **Step 1: Write impl**

```javascript
// Cross-page and per-anchor analysis. Input: array of
// { route, anchors: [{text, href}] }.

export const GENERIC_ANCHOR_BANLIST = [
  "read article",
  "read more",
  "details",
  "learn more",
  "click here",
];

const MAX_LEN = 120;

export function findAmbiguousAnchors(pages) {
  const map = new Map(); // text -> Map<href, route[]>
  for (const p of pages) {
    for (const a of p.anchors ?? []) {
      const text = a.text.toLowerCase();
      if (!map.has(text)) map.set(text, new Map());
      const inner = map.get(text);
      const list = inner.get(a.href) ?? [];
      list.push(p.route);
      inner.set(a.href, list);
    }
  }
  const out = [];
  for (const [text, hrefMap] of map) {
    if (hrefMap.size > 1) {
      out.push({
        text,
        hrefs: [...hrefMap.keys()],
        routes: [...new Set([].concat(...hrefMap.values()))],
      });
    }
  }
  return out;
}

export function findGenericAnchors(pages) {
  const banSet = new Set(GENERIC_ANCHOR_BANLIST);
  const out = [];
  for (const p of pages) {
    for (const a of p.anchors ?? []) {
      if (banSet.has(a.text.toLowerCase())) {
        out.push({ route: p.route, text: a.text, href: a.href });
      }
    }
  }
  return out;
}

export function findOverlongAnchors(pages) {
  const out = [];
  for (const p of pages) {
    for (const a of p.anchors ?? []) {
      if (a.text.length > MAX_LEN) {
        out.push({ route: p.route, text: a.text, href: a.href, length: a.text.length });
      }
    }
  }
  return out;
}
```

- [ ] **Step 2: Run, expect green**

```bash
pnpm test:seo:lib
```

## Task 5.3: Commit & PR

```bash
git add tests/seo/lib/anchor-rules.mjs tests/seo/lib/anchor-rules.test.mjs
git commit -m "feat(seo-tests): anchor-rule analyzer

Cross-page ambiguous-anchor detection (audit I2), generic-anchor banlist,
overlong-anchor flagging (audit I3). Used by INV-015, INV-016, INV-017."
git push -u origin feat/seo-tests-5-anchor-rules
gh pr create --base main --title "feat(seo-tests): anchor-rule analyzer (5/10)" --body "<verification>"
gh pr checks --watch && gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
```

---

# PR #6 — Snapshot driver + initial baseline

**Branch:** `feat/seo-tests-6-snapshots`
**Title:** `feat(seo-tests): snapshot test driver + baseline`
**Goal:** Walk every prerendered HTML file in `artifacts/<site>/dist/`, fingerprint it, compare to committed `__snapshots__/`. With `UPDATE_SNAPSHOTS=1` rewrite. Plus sitemap fingerprint per site (open question Q2 in spec — answered yes).

This is the largest PR — ~66 snapshot files. Treat the snapshot generation as one task, the test driver as another, the sitemap-snapshot bonus as a third.

## Task 6.1: Branch and ensure dist is fresh

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull --ff-only
git checkout -b feat/seo-tests-6-snapshots
```

- [ ] **Step 2: Build both sites so dist/ exists**

```bash
pnpm install --frozen-lockfile
pnpm build
```

Expected: marketing + qb-portal both build, prerender, generate sitemaps. If build fails for unrelated reasons, fix or skip-list before proceeding (this is data the snapshots depend on).

- [ ] **Step 3: Confirm dist contents**

```bash
find artifacts/nexfortis/dist -name "index.html" -o -name "*.html" | head -20
find artifacts/qb-portal/dist -name "index.html" -o -name "*.html" | head -20
```

You should see the prerendered routes for both sites. Capture the full list — it determines snapshot count.

## Task 6.2: load-dist helper + tests

**Files:**
- Create: `tests/seo/lib/load-dist.mjs`
- Create: `tests/seo/lib/load-dist.test.mjs`

- [ ] **Step 1: Write failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadDist } from "./load-dist.mjs";

test("loadDist — discovers prerendered HTML files for both sites", async () => {
  const pages = await loadDist();
  // Sanity: both sites have at least the home page
  const sites = new Set(pages.map((p) => p.site));
  assert.ok(sites.has("nexfortis"), "expected nexfortis site");
  assert.ok(sites.has("qb-portal"), "expected qb-portal site");
  // Each entry has the expected shape
  for (const p of pages) {
    assert.equal(typeof p.site, "string");
    assert.equal(typeof p.route, "string");
    assert.equal(typeof p.html, "string");
    assert.ok(p.html.includes("<html"), `route ${p.route} html missing <html>`);
  }
});

test("loadDist — route is the relative path with leading slash", async () => {
  const pages = await loadDist();
  const home = pages.find((p) => p.site === "nexfortis" && p.route === "/");
  assert.ok(home, "nexfortis homepage not found");
});
```

- [ ] **Step 2: Run — fails (module missing)**

```bash
pnpm test:seo:lib
```

- [ ] **Step 3: Implement**

```javascript
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "..", "..", "..");

const SITES = [
  { site: "nexfortis", dist: path.join(REPO_ROOT, "artifacts/nexfortis/dist") },
  { site: "qb-portal", dist: path.join(REPO_ROOT, "artifacts/qb-portal/dist") },
];

export async function loadDist() {
  const out = [];
  for (const { site, dist } of SITES) {
    const exists = await fs.stat(dist).catch(() => null);
    if (!exists) continue;
    for await (const file of walk(dist)) {
      if (!file.endsWith(".html")) continue;
      const html = await fs.readFile(file, "utf8");
      const rel = path.relative(dist, file).replace(/\\/g, "/");
      const route = rel === "index.html"
        ? "/"
        : "/" + rel.replace(/\/?index\.html$/, "");
      out.push({ site, route, html, file });
    }
  }
  return out;
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}
```

- [ ] **Step 4: Run, expect green**

```bash
pnpm test:seo:lib
```

## Task 6.3: Snapshot driver test

**Files:**
- Create: `tests/seo/snapshots.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDist } from "./lib/load-dist.mjs";
import { extract } from "./lib/extract.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const SNAP_DIR = path.join(here, "__snapshots__");
const UPDATE = process.env.UPDATE_SNAPSHOTS === "1";

const pages = await loadDist();

if (pages.length === 0) {
  test("snapshots — dist not built; run pnpm build first", () => {
    assert.fail("No dist files found. Run `pnpm build` before snapshot tests.");
  });
}

for (const page of pages) {
  const slug = page.route === "/" ? "index" : page.route.replace(/^\//, "").replace(/\//g, "_");
  const snapPath = path.join(SNAP_DIR, page.site, `${slug}.snap.json`);

  test(`snapshot ${page.site} ${page.route}`, async () => {
    const fp = extract(page.html, page.route);
    const serialized = JSON.stringify(fp, null, 2) + "\n";

    if (UPDATE) {
      await fs.mkdir(path.dirname(snapPath), { recursive: true });
      await fs.writeFile(snapPath, serialized, "utf8");
      return;
    }

    let baseline;
    try {
      baseline = await fs.readFile(snapPath, "utf8");
    } catch {
      assert.fail(
        `Missing snapshot for ${page.site}${page.route}. Run \`pnpm test:seo:update\` to create.`,
      );
    }
    assert.equal(serialized, baseline);
  });
}
```

- [ ] **Step 2: Run — every snapshot fails (no baselines yet)**

```bash
pnpm build              # ensure dist is current
pnpm test:seo:snapshots
```

Expected: ~66 failures, all "Missing snapshot for …".

- [ ] **Step 3: Generate baselines**

```bash
pnpm test:seo:update
```

This writes one `.snap.json` per route into `tests/seo/__snapshots__/<site>/`.

- [ ] **Step 4: Re-run — all snapshots pass**

```bash
pnpm test:seo:snapshots
```

Expected: every test passes. Capture the count.

- [ ] **Step 5: Sanity-check a few snapshots manually**

```bash
cat tests/seo/__snapshots__/nexfortis/index.snap.json | head -40
cat tests/seo/__snapshots__/qb-portal/index.snap.json | head -40
```

The values must reflect what the prerender actually produces. If anything is `null` that should not be (e.g. `canonical: null` on home), there's a bug in the extractor or the prerender — investigate before merging.

## Task 6.4: Sitemap snapshot (open question Q2)

**Files:**
- Modify: `tests/seo/snapshots.test.mjs` — append a sitemap-fingerprint block

- [ ] **Step 1: Write failing test**

Append to `tests/seo/snapshots.test.mjs`:

```javascript
const SITEMAPS = [
  { site: "nexfortis", file: path.join(here, "..", "..", "artifacts/nexfortis/dist/sitemap.xml") },
  { site: "qb-portal", file: path.join(here, "..", "..", "artifacts/qb-portal/dist/sitemap.xml") },
];

for (const { site, file } of SITEMAPS) {
  const snapPath = path.join(SNAP_DIR, site, "sitemap.snap.json");
  test(`snapshot ${site} sitemap.xml`, async () => {
    const xml = await fs.readFile(file, "utf8");
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).sort();
    const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1].trim());
    const fp = { urlCount: urls.length, urls, hasLastmod: lastmods.length > 0 };
    const serialized = JSON.stringify(fp, null, 2) + "\n";

    if (UPDATE) {
      await fs.writeFile(snapPath, serialized, "utf8");
      return;
    }

    const baseline = await fs.readFile(snapPath, "utf8").catch(() => null);
    assert.ok(baseline, `Missing sitemap snapshot for ${site}. Run pnpm test:seo:update.`);
    assert.equal(serialized, baseline);
  });
}
```

- [ ] **Step 2: Run, generate, re-run**

```bash
pnpm test:seo:snapshots          # fails: missing
pnpm test:seo:update             # creates sitemap.snap.json files
pnpm test:seo:snapshots          # passes
```

## Task 6.5: Commit & PR

```bash
git add tests/seo/lib/load-dist.mjs tests/seo/lib/load-dist.test.mjs tests/seo/snapshots.test.mjs tests/seo/__snapshots__
git status      # eyeball: ~66 .snap.json + 2 sitemap.snap.json
git commit -m "feat(seo-tests): snapshot test driver + initial baseline

Walks artifacts/<site>/dist/, fingerprints each prerendered HTML +
sitemap.xml, compares to committed __snapshots__/. Strict freeze;
UPDATE_SNAPSHOTS=1 rewrites baselines.

Initial baseline captured from main @ <commit-hash>."
git push -u origin feat/seo-tests-6-snapshots
gh pr create --base main --title "feat(seo-tests): snapshot test driver + baseline (6/10)" --body "<verification: snapshot count, file list>"
gh pr checks --watch && gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
```

---

# PR #7 — Invariants + known-issues allowlist

**Branch:** `feat/seo-tests-7-invariants`
**Title:** `feat(seo-tests): invariants test suite + known-issues allowlist`
**Goal:** Implement INV-001 through INV-020 from the spec. Seed `__known-issues__.json` from the audit so the suite ships green. Each Phase 2 fix removes one allowlist entry.

## Task 7.1: Branch and seed allowlist

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull --ff-only
git checkout -b feat/seo-tests-7-invariants
```

- [ ] **Step 2: Seed `__known-issues__.json` from the audit**

The seed list comes from `/home/user/workspace/nexfortis-codebase-analysis.md` and `/seo-audit/*.md`. Re-read those to populate. Initial structure:

```bash
mkdir -p tests/seo
cat > tests/seo/__known-issues__.json <<'JSON'
{
  "_doc": "Allowlist of pre-existing audit findings. Each Phase 2 fix removes its entry. When this file is { }, all invariants are enforced strictly.",
  "_seeded_from": "2026-04-25 Seobility audit + nexfortis-codebase-analysis.md",
  "INV-002": [],
  "INV-003": [],
  "INV-004": [],
  "INV-008": [],
  "INV-015": [],
  "INV-016": [],
  "INV-017": [],
  "INV-020": []
}
JSON
```

> **The implementer must populate each array** with `{ site, route, current, expected, issue }` objects mirroring the audit. Run `pnpm test:seo:invariants` against an unallowlisted version first to discover the exact set, then move each violation into the JSON. **Do not invent entries.**

## Task 7.2: Failing test for INV-001 (one H1)

**Files:**
- Create: `tests/seo/invariants.test.mjs`

- [ ] **Step 1: Write failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDist } from "./lib/load-dist.mjs";
import { extract } from "./lib/extract.mjs";
import { pixelWidth } from "./lib/pixel-width.mjs";
import { validateJsonLdBlock, findDuplicateTypes } from "./lib/jsonld.mjs";
import {
  findAmbiguousAnchors,
  findGenericAnchors,
  findOverlongAnchors,
} from "./lib/anchor-rules.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const allowlist = JSON.parse(
  await fs.readFile(path.join(here, "__known-issues__.json"), "utf8"),
);

const pages = await loadDist();
const fingerprints = pages.map((p) => ({ ...p, fp: extract(p.html, p.route) }));

function isAllowed(rule, site, route) {
  return (allowlist[rule] ?? []).some((e) => e.site === site && e.route === route);
}

test("INV-001: every page has exactly one <h1>", () => {
  const violations = [];
  for (const p of fingerprints) {
    const h1count = p.fp.headings.filter((h) => h.level === 1).length;
    if (h1count !== 1 && !isAllowed("INV-001", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: ${h1count} <h1>`);
    }
  }
  assert.deepEqual(violations, []);
});
```

- [ ] **Step 2: Run — observe whether it passes (depends on real data)**

```bash
pnpm build               # ensure dist is current
pnpm test:seo:invariants
```

If it passes, INV-001 is already clean and no allowlist needed. If it fails, **either fix the underlying page or add the route to `INV-001` in the allowlist** (the audit determines which).

## Task 7.3: Add INV-002 through INV-020

For each invariant, follow the same pattern: write the test, run it, populate the allowlist with what's currently broken (per the audit), confirm green.

- [ ] **Step 1: Add all 19 remaining tests**

Append to `tests/seo/invariants.test.mjs`. Each test follows this shape (one per invariant; full code below):

```javascript
test("INV-002: <title> pixel width 200–580 px", () => {
  const violations = [];
  for (const p of fingerprints) {
    if (!p.fp.title) {
      violations.push(`${p.site}${p.route}: missing <title>`);
      continue;
    }
    const w = pixelWidth(p.fp.title, "title");
    if ((w < 200 || w > 580) && !isAllowed("INV-002", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: title ${w}px (need 200-580)`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-003: <meta description> pixel width 400–1000 px", () => {
  const violations = [];
  for (const p of fingerprints) {
    if (!p.fp.description) {
      violations.push(`${p.site}${p.route}: missing description`);
      continue;
    }
    const w = pixelWidth(p.fp.description, "description");
    if ((w < 400 || w > 1000) && !isAllowed("INV-003", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: desc ${w}px (need 400-1000)`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-004: <h1> text length 25–70 chars", () => {
  const violations = [];
  for (const p of fingerprints) {
    const h1 = p.fp.headings.find((h) => h.level === 1);
    if (!h1) continue; // INV-001 covers absence
    const len = h1.text.length;
    if ((len < 25 || len > 70) && !isAllowed("INV-004", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: H1 length ${len} ("${h1.text}")`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-005: canonical present and matches expected URL", () => {
  const violations = [];
  for (const p of fingerprints) {
    if (!p.fp.canonical && !isAllowed("INV-005", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: missing canonical`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-006: <meta robots> does not contain noindex", () => {
  const violations = [];
  for (const p of fingerprints) {
    if (p.fp.hasNoindex && !isAllowed("INV-006", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: has noindex`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-007: OG/Twitter required tags present", () => {
  const required = ["title", "description", "url", "image", "type"];
  const violations = [];
  for (const p of fingerprints) {
    for (const k of required) {
      if (!p.fp.og?.[k] && !isAllowed("INV-007", p.site, p.route)) {
        violations.push(`${p.site}${p.route}: missing og:${k}`);
      }
    }
    if (!p.fp.twitter?.card && !isAllowed("INV-007", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: missing twitter:card`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-008: heading hierarchy — no level skipped", () => {
  const violations = [];
  for (const p of fingerprints) {
    let prev = 1;
    for (const h of p.fp.headings) {
      if (h.level > prev + 1 && !isAllowed("INV-008", p.site, p.route)) {
        violations.push(`${p.site}${p.route}: jumped H${prev}→H${h.level}`);
        break;
      }
      prev = h.level;
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-009: at least one JSON-LD block per page", () => {
  const violations = [];
  for (const p of fingerprints) {
    if (p.fp.jsonld.length === 0 && !isAllowed("INV-009", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: no JSON-LD`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-010: every JSON-LD block has @context and @type", () => {
  const violations = [];
  for (const p of fingerprints) {
    for (const block of p.fp.jsonld) {
      const r = validateJsonLdBlock(block);
      if (!r.ok && !isAllowed("INV-010", p.site, p.route)) {
        violations.push(`${p.site}${p.route}: ${r.errors.join(", ")}`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-011: every page has BreadcrumbList JSON-LD", () => {
  const violations = [];
  for (const p of fingerprints) {
    const has = p.fp.jsonld.some((b) => b["@type"] === "BreadcrumbList");
    if (!has && !isAllowed("INV-011", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: missing BreadcrumbList`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-012: service-detail pages emit Service JSON-LD", () => {
  const violations = [];
  for (const p of fingerprints) {
    if (!p.route.startsWith("/service/")) continue;
    const has = p.fp.jsonld.some((b) => b["@type"] === "Service");
    if (!has && !isAllowed("INV-012", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: missing Service schema`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-013: no duplicate @type within a single page", () => {
  const violations = [];
  for (const p of fingerprints) {
    const dups = findDuplicateTypes(p.fp.jsonld);
    if (dups.length && !isAllowed("INV-013", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: duplicate @types ${dups.join(",")}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-014: <div id=\"root\"> is non-empty (prerender shell check)", () => {
  const violations = [];
  for (const p of fingerprints) {
    if (p.fp.rootDivIsEmpty && !isAllowed("INV-014", p.site, p.route)) {
      violations.push(`${p.site}${p.route}: empty SPA shell`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-015: anchor uniqueness — same text never points to two URLs", () => {
  const sitePages = new Map();
  for (const p of fingerprints) {
    if (!sitePages.has(p.site)) sitePages.set(p.site, []);
    sitePages.get(p.site).push({ route: p.route, anchors: p.fp.anchors });
  }
  const violations = [];
  for (const [site, list] of sitePages) {
    const found = findAmbiguousAnchors(list);
    for (const f of found) {
      const allowed = (allowlist["INV-015"] ?? []).some(
        (e) => e.site === site && e.text?.toLowerCase() === f.text.toLowerCase(),
      );
      if (!allowed) violations.push(`${site}: "${f.text}" → ${f.hrefs.join(", ")}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-016: anchor length ≤ 120 chars", () => {
  const violations = [];
  for (const p of fingerprints) {
    const long = findOverlongAnchors([{ route: p.route, anchors: p.fp.anchors }]);
    for (const a of long) {
      if (!isAllowed("INV-016", p.site, p.route)) {
        violations.push(`${p.site}${p.route}: ${a.length}-char anchor`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-017: no generic anchors", () => {
  const violations = [];
  for (const p of fingerprints) {
    const generic = findGenericAnchors([{ route: p.route, anchors: p.fp.anchors }]);
    for (const a of generic) {
      if (!isAllowed("INV-017", p.site, p.route)) {
        violations.push(`${p.site}${p.route}: generic "${a.text}"`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-018: every sitemap URL resolves to a built page", async () => {
  const violations = [];
  for (const site of ["nexfortis", "qb-portal"]) {
    const xmlPath = path.join(here, "..", "..", `artifacts/${site}/dist/sitemap.xml`);
    const xml = await fs.readFile(xmlPath, "utf8").catch(() => null);
    if (!xml) continue;
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    for (const url of urls) {
      const route = new URL(url).pathname;
      const built = fingerprints.find((p) => p.site === site && p.route === route);
      if (!built && !(allowlist["INV-018"] ?? []).some((e) => e.site === site && e.route === route)) {
        violations.push(`${site}: sitemap URL ${route} has no built page`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-019: no sitemap URL has noindex", async () => {
  const violations = [];
  for (const site of ["nexfortis", "qb-portal"]) {
    const xmlPath = path.join(here, "..", "..", `artifacts/${site}/dist/sitemap.xml`);
    const xml = await fs.readFile(xmlPath, "utf8").catch(() => null);
    if (!xml) continue;
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    for (const url of urls) {
      const route = new URL(url).pathname;
      const page = fingerprints.find((p) => p.site === site && p.route === route);
      if (page?.fp.hasNoindex && !isAllowed("INV-019", site, route)) {
        violations.push(`${site}${route}: in sitemap but has noindex`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test("INV-020: every <img> has a non-empty alt or aria-hidden", () => {
  const violations = [];
  for (const p of fingerprints) {
    const imgs = [...p.html.matchAll(/<img\b[^>]*>/gi)];
    for (const m of imgs) {
      const tag = m[0];
      const alt = tag.match(/\balt=(?:"([^"]*)"|'([^']*)')/i);
      const ariaHidden = /\baria-hidden=["']true["']/i.test(tag);
      const hasAlt = alt && (alt[1] ?? alt[2]).length > 0;
      const hasEmptyDecorative = alt && (alt[1] ?? alt[2]) === "" && ariaHidden;
      if (!hasAlt && !hasEmptyDecorative && !isAllowed("INV-020", p.site, p.route)) {
        violations.push(`${p.site}${p.route}: <img> missing alt: ${tag.slice(0, 80)}`);
      }
    }
  }
  assert.deepEqual(violations, []);
});
```

- [ ] **Step 2: Run with empty allowlist — observe failures**

```bash
pnpm test:seo:invariants
```

Capture every failure. Each failure goes into the allowlist with audit reference.

- [ ] **Step 3: Populate `__known-issues__.json`**

For each failure, decide:
- **Pre-existing audit finding (Critical or Important)** → add to allowlist with `issue: "C1"|"I1"|...` matching the codebase analysis.
- **Genuine bug we should fix in this PR** → fix it (only if scope-appropriate; otherwise stop and discuss with user).

Re-run `pnpm test:seo:invariants` until it passes against the populated allowlist.

- [ ] **Step 4: Re-run**

```bash
pnpm test:seo:invariants
```

Expected: green.

## Task 7.4: Commit & PR

```bash
git add tests/seo/invariants.test.mjs tests/seo/__known-issues__.json
git commit -m "feat(seo-tests): invariants test suite + known-issues allowlist

20 invariants (INV-001 to INV-020) covering pixel widths, headings,
canonicals, OG/Twitter, JSON-LD validity, schema breadth, anchor
uniqueness, sitemap consistency, and image alts.

__known-issues__.json seeded with $(N) audit findings allowlisted by
{rule, site, route}. Each Phase 2 fix removes its entry."
git push -u origin feat/seo-tests-7-invariants
gh pr create --base main --title "feat(seo-tests): invariants + allowlist (7/10)" --body "<verification + allowlist count>"
gh pr checks --watch && gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
```

---

# PR #8 — Component tests

**Branch:** `feat/seo-tests-8-components`
**Title:** `feat(seo-tests): component-level SEO tests`
**Goal:** Vitest + RTL component tests for each top-level page. Catches mistakes before any build.

## Task 8.1: Branch + add devDeps

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull --ff-only
git checkout -b feat/seo-tests-8-components
```

- [ ] **Step 2: Add Vitest + RTL devDeps to root**

```bash
pnpm add -wD vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom react react-dom react-helmet-async react-router-dom
```

> The site apps already have `react-helmet-async` and `react-router-dom`; we're declaring them at root so the test config can import them. If pnpm complains about workspace conflicts, use `--workspace-root` instead of `-w`.

- [ ] **Step 3: Replace the empty vitest setup file**

Edit `tests/seo/vitest.setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest";
```

## Task 8.2: First component test (failing)

**Files:**
- Create: `tests/seo/components.test.tsx`

- [ ] **Step 1: Write failing test for nexfortis About page**

```tsx
import { describe, test, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import About from "../../artifacts/nexfortis/src/pages/about";

function renderWithRouter(node: React.ReactNode, route = "/about") {
  const helmetContext: any = {};
  render(
    <HelmetProvider context={helmetContext}>
      <MemoryRouter initialEntries={[route]}>{node}</MemoryRouter>
    </HelmetProvider>,
  );
  // Helmet writes synchronously to context.helmet only after render flushes.
  // For tests we flush by reading document.head directly — Helmet is wired
  // up to the real DOM in jsdom mode.
  return helmetContext;
}

describe("nexfortis About page", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  test("emits a non-empty <title>", () => {
    renderWithRouter(<About />);
    const title = document.head.querySelector("title")?.textContent ?? "";
    expect(title.length).toBeGreaterThan(0);
  });

  test("emits a canonical link", () => {
    renderWithRouter(<About />);
    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toMatch(/^https:\/\/nexfortis\.com/);
  });

  test("emits a non-empty meta description", () => {
    renderWithRouter(<About />);
    const desc = document.head
      .querySelector('meta[name="description"]')
      ?.getAttribute("content") ?? "";
    expect(desc.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run — fails until vitest is installed and About imports cleanly**

```bash
pnpm test:seo:components
```

Common failures and fixes:
- `Cannot find module 'vitest/config'` → re-run `pnpm install`
- `Cannot find module 'about'` → check the import path matches `artifacts/nexfortis/src/pages/about.tsx` exactly (case-sensitive on Linux)
- Helmet not flushing → confirm `HelmetProvider` wraps everything

- [ ] **Step 3: Make it pass (no implementation needed — the SEO component already emits these tags)**

This is testing existing behavior. If a test fails, the cause is one of:
1. Wrong import path → fix
2. Component imports something jsdom can't handle (e.g. `window.matchMedia`) → add a polyfill in `vitest.setup.ts`
3. Component depends on a query client / context provider missing here → wrap with that provider

Track each failure and fix iteratively until all 3 tests pass.

## Task 8.3: Add tests for every top-level page

The full list (from `ls artifacts/nexfortis/src/pages` and `ls artifacts/qb-portal/src/pages`):

**nexfortis:** about, blog, contact, home, privacy, services, terms, services/automation, services/digital-marketing, services/it-consulting, services/microsoft-365, services/quickbooks

**qb-portal:** catalog, category, faq, home, landing, portal, qbm-guide, privacy, service-detail, terms, waitlist

Pages excluded (auth/admin/post-login surfaces — they aren't crawlable so not in scope):
- nexfortis: admin-login, blog-admin, blog-post, not-found
- qb-portal: admin/*, auth-callback, forgot-password, login, order-*, portal-settings, portal-subscription, register, reset-password, subscription, ticket-detail

- [ ] **Step 1: Add one describe block per page with the same three assertions** (title, canonical, description). Pages requiring URL params (e.g. `service-detail`, `category`, `blog/[slug]`) get extra setup that passes representative params.

- [ ] **Step 2: Run iteratively until green**

```bash
pnpm test:seo:components
```

Expected: ~25 describe blocks × 3 tests = ~75 passing assertions.

## Task 8.4: Commit & PR

```bash
git add tests/seo/components.test.tsx tests/seo/vitest.setup.ts package.json pnpm-lock.yaml
git commit -m "feat(seo-tests): component-level SEO tests

Adds Vitest + @testing-library/react component tests for every crawlable
top-level page across both sites. Each page asserts non-empty <title>,
canonical link, and meta description.

Adds vitest, @vitejs/plugin-react, @testing-library/react,
@testing-library/jest-dom, and jsdom as root devDeps."
git push -u origin feat/seo-tests-8-components
gh pr create --base main --title "feat(seo-tests): component tests (8/10)" --body "<verification>"
gh pr checks --watch && gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
```

---

# PR #9 — CI workflow + branch protection update

**Branch:** `ci/seo-tests`
**Title:** `ci(seo-tests): GitHub Actions workflow + branch protection update`
**Goal:** Wire CI gates: local tests at PR open, post-deploy verifiers against Render PR previews after preview is live. Make both required status checks.

## Task 9.1: Branch and modify post-deploy verifiers

**Files:**
- Modify: `scripts/seo-verification/verify-head-tags.mjs` — add `SITEMAP_URLS` env support
- Modify: `scripts/seo-verification/verify-rendered-content.mjs` — same

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull --ff-only
git checkout -b ci/seo-tests
```

- [ ] **Step 2: Write a failing test that proves SITEMAP_URLS env is honored**

Create `scripts/seo-verification/verify-head-tags.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveSitemaps } from "./verify-head-tags.mjs";

test("resolveSitemaps — defaults to production when env unset", () => {
  delete process.env.SITEMAP_URLS;
  const r = resolveSitemaps();
  assert.deepEqual(r, [
    "https://qb.nexfortis.com/sitemap.xml",
    "https://nexfortis.com/sitemap.xml",
  ]);
});

test("resolveSitemaps — uses SITEMAP_URLS when set", () => {
  process.env.SITEMAP_URLS = "https://pr-42-nexfortis-marketing.onrender.com/sitemap.xml,https://pr-42-nexfortis-qb-portal.onrender.com/sitemap.xml";
  const r = resolveSitemaps();
  assert.equal(r.length, 2);
  assert.match(r[0], /pr-42-nexfortis-marketing/);
  delete process.env.SITEMAP_URLS;
});
```

- [ ] **Step 3: Run — fails (resolveSitemaps not exported yet)**

```bash
node --test scripts/seo-verification/verify-head-tags.test.mjs
```

- [ ] **Step 4: Modify `verify-head-tags.mjs`**

Replace the top-level `SITEMAPS` constant block:

```javascript
// before:
// const SITEMAPS = [
//   "https://qb.nexfortis.com/sitemap.xml",
//   "https://nexfortis.com/sitemap.xml",
// ];

// after:
const PROD_SITEMAPS = [
  "https://qb.nexfortis.com/sitemap.xml",
  "https://nexfortis.com/sitemap.xml",
];

export function resolveSitemaps() {
  const env = process.env.SITEMAP_URLS;
  if (!env) return PROD_SITEMAPS;
  return env.split(",").map((s) => s.trim()).filter(Boolean);
}

const SITEMAPS = resolveSitemaps();
```

- [ ] **Step 5: Run — passes**

```bash
node --test scripts/seo-verification/verify-head-tags.test.mjs
```

- [ ] **Step 6: Repeat the same edit on `verify-rendered-content.mjs`**

Find the production-sitemap constant and apply the same `resolveSitemaps()` pattern. Add the matching test file `verify-rendered-content.test.mjs`.

- [ ] **Step 7: Smoke test against the live site (sanity)**

```bash
node scripts/seo-verification/verify-head-tags.mjs --json | head -30
```

Expected: same output as before this PR (production behavior unchanged when env unset).

## Task 9.2: Add the GitHub Actions workflow

**Files:**
- Create: `.github/workflows/seo-tests.yml`

- [ ] **Step 1: Write the workflow exactly as specified in spec section 4.3**

```yaml
name: SEO Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  local-tests:
    name: Local SEO test suite
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm test:seo:components
      - run: pnpm build
      - run: pnpm test:seo:snapshots
      - run: pnpm test:seo:invariants
      - run: pnpm test:seo:lib

  preview-verifiers:
    name: Verify Render PR previews
    runs-on: ubuntu-latest
    needs: local-tests
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - name: Wait for previews to be live and verify
        run: |
          set -e
          PR=${{ github.event.pull_request.number }}
          MARKETING="https://pr-${PR}-nexfortis-marketing.onrender.com"
          QB="https://pr-${PR}-nexfortis-qb-portal.onrender.com"
          echo "Waiting for $MARKETING and $QB ..."
          for url in "$MARKETING" "$QB"; do
            for i in {1..60}; do
              if curl -sfI "$url/" | head -1 | grep -q "200"; then
                echo "$url is live"; break
              fi
              if [ $i -eq 60 ]; then
                echo "$url did not become live in 10 minutes" >&2; exit 1
              fi
              sleep 10
            done
          done
          export SITEMAP_URLS="${MARKETING}/sitemap.xml,${QB}/sitemap.xml"
          node scripts/seo-verification/verify-head-tags.mjs
          node scripts/seo-verification/verify-rendered-content.mjs
```

- [ ] **Step 2: Push the branch and watch the workflow run on its own PR**

```bash
git add scripts/seo-verification/verify-head-tags.mjs scripts/seo-verification/verify-head-tags.test.mjs scripts/seo-verification/verify-rendered-content.mjs scripts/seo-verification/verify-rendered-content.test.mjs .github/workflows/seo-tests.yml
git commit -m "ci(seo-tests): GitHub Actions workflow + SITEMAP_URLS env support

- New workflow .github/workflows/seo-tests.yml runs local suite at PR open
  and post-deploy verifiers against Render PR previews
- Both verifiers now honor SITEMAP_URLS env var; default unchanged in prod"
git push -u origin ci/seo-tests
gh pr create --base main --title "ci(seo-tests): workflow + verifiers (9/10)" --body "<verification>"
```

- [ ] **Step 3: Watch CI for its own PR**

```bash
gh pr checks --watch
```

Both jobs must pass. The `preview-verifiers` job will wait up to 10 minutes for Render previews. If Render takes longer, bump the loop count.

## Task 9.3: Add required status checks to branch protection

- [ ] **Step 1: Update the existing ruleset (15556829)**

```bash
gh api -X PATCH repos/TSGCFO/NexFortis-Website-Design-pro/rulesets/15556829 \
  --input - <<'JSON'
{
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "required_review_thread_resolution": true,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "do_not_enforce_on_create": false,
        "required_status_checks": [
          { "context": "Local SEO test suite" },
          { "context": "Verify Render PR previews" }
        ]
      }
    }
  ]
}
JSON
```

- [ ] **Step 2: Verify**

```bash
gh api repos/TSGCFO/NexFortis-Website-Design-pro/rulesets/15556829 | jq '.rules[] | select(.type=="required_status_checks")'
```

Expected: shows both contexts listed.

## Task 9.4: Merge

```bash
gh pr checks --watch
gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
```

---

# PR #10 — Docs and AGENTS.md update

**Branch:** `docs/seo-tests-readme`
**Title:** `docs(seo-tests): final README + AGENTS.md update + Phase 2 prompt template`
**Goal:** Documentation: full README under `tests/seo/`, AGENTS.md section about the suite, prompt template for Phase 2 cloud agents.

## Task 10.1: Branch and rewrite tests/seo/README.md

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull --ff-only
git checkout -b docs/seo-tests-readme
```

- [ ] **Step 2: Write the full README**

Replace `tests/seo/README.md` with a complete document covering: layout, each layer's purpose, how to run, when to run `pnpm test:seo:update`, how the allowlist works, and what to do when CI is red.

The file should answer these questions:
1. What does each command do? (table)
2. When does an agent run `pnpm test:seo:update`? (Phase 2 fix workflow)
3. How does the allowlist work? (entry shape, when to remove)
4. What if a snapshot diff looks unexpected? (PR review checklist)
5. What's the source of truth for invariants? (this README + spec doc)

## Task 10.2: Update AGENTS.md

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Append a new section after "Key gotchas"**

```markdown
### SEO regression test suite

A four-layer regression suite under `tests/seo/` locks every SEO behavior in
place. **Always run `pnpm test:seo` before opening a PR that touches any
artifact under `artifacts/nexfortis/` or `artifacts/qb-portal/`.**

Workflow when fixing an audit issue:
1. Make the code change.
2. `pnpm build && pnpm test:seo:invariants` — see exactly which invariants
   used to be allowlisted but no longer fail.
3. Remove the corresponding entries from `tests/seo/__known-issues__.json`.
4. `pnpm test:seo:update` — re-baseline snapshots that intentionally changed.
5. `pnpm test:seo` — must pass before pushing.
6. Open PR; CI runs the suite again + verifies Render previews.

See `tests/seo/README.md` and `docs/superpowers/specs/2026-04-25-seo-regression-suite-design.md`.
```

## Task 10.3: Phase 2 cloud-agent prompt template

**Files:**
- Create: `docs/seo-fix-prompt-template.md`

- [ ] **Step 1: Write the template**

```markdown
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
- Do not modify the docs/ directory (read-only by repo convention).
- All work must be in a single PR with a clean diff.
```

## Task 10.4: Commit & PR

```bash
git add tests/seo/README.md AGENTS.md docs/seo-fix-prompt-template.md
git commit -m "docs(seo-tests): final README + AGENTS.md + Phase 2 prompt template

- Full tests/seo/README.md documenting all four layers and workflows
- AGENTS.md gains a section explaining when/how to run the suite
- docs/seo-fix-prompt-template.md for handing Phase 2 fixes to cloud agents"
git push -u origin docs/seo-tests-readme
gh pr create --base main --title "docs(seo-tests): docs + Phase 2 template (10/10)" --body "<verification: links to each touched file>"
gh pr checks --watch && gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
```

---

# Self-review checklist (run after writing this plan, fix inline)

- [ ] **Spec coverage:** every section of the spec maps to a task.
  - 4.1 directory layout → defined at top of plan, built up across PRs 1, 2, 3, 4, 5, 6, 7, 8 ✓
  - 4.2 four layers → PRs 6, 7, 8, and PR 9 (verifiers) ✓
  - 4.2 INV-001..020 → PR #7 ✓
  - 4.2 known-issues allowlist → PR #7 ✓
  - 4.3 CI workflow → PR #9 ✓
  - 4.4 npm scripts → PR #1 ✓
  - 5 phasing → encoded in PR ordering 1–10 ✓
  - 7 success criteria → covered by combination of PRs 1–10 ✓
  - 8 open questions Q1, Q2 → Q2 (sitemap snapshot) handled in PR #6 Task 6.4; Q1 (image dimensions) deferred — explicitly out of scope for INV-020, will be tracked as a separate follow-up if needed
- [ ] **Placeholder scan:** searched for "TBD", "TODO" — none in plan body.
- [ ] **Type consistency:** function signatures (`extract`, `pixelWidth`, `validateJsonLdBlock`, `findAmbiguousAnchors`) match across all PRs that reference them.
- [ ] **Branch protection compatibility:** every PR's commit/push/merge sequence respects linear history (`--squash`) and PR-required ruleset.
- [ ] **TDD discipline:** every implementation task is preceded by a "write failing test → run → watch fail" task.
- [ ] **Dist dependency:** PRs that need `dist/` (6, 7, 9) explicitly call `pnpm build` first.

---

# Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-25-seo-regression-suite-plan.md`.

Two execution options for Phase 1:

1. **Subagent-Driven** (recommended for speed) — I dispatch a fresh subagent per PR, review the diff before merge, then move on. Faster iteration, parallel possible for non-overlapping tasks.

2. **Inline Execution** — I execute every task in this session sequentially. Slower but you watch every step.

For Phase 2 (after Phase 1 ships), the design already specifies cloud-agent execution with my review.

**Which approach for Phase 1?**
