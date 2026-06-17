#!/usr/bin/env node
// Publish-readiness gate: any digital-marketing page marked `published: true` in
// the link graph MUST have a complete run-book artifact set. This is the gate
// that makes "published a page without running the run book" impossible to push.
//
//   node seo-tools/runbook/check-publish-readiness.mjs
//
// Exit 0 = ok. Exit 1 = a published page is missing required run-book artifacts.
// Run by the pre-push hook (seo-tools/runbook/git-hooks/pre-push).
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url)); // seo-tools/runbook
const repoRoot = join(here, "..", "..");
const linksFile = join(repoRoot, "artifacts/nexfortis/src/lib/internal-links.ts");

// The load-bearing run-book outputs a published page must have.
const REQUIRED = ["04-outline.md", "05-draft.md", "06a-factcheck.json"];

if (!existsSync(linksFile)) {
  console.error(`publish-readiness: cannot find ${linksFile} — is this the repo root?`);
  process.exit(1);
}
const src = readFileSync(linksFile, "utf8");

// Heuristic: inside each DM_SPOKES object, `slug` appears before `published`.
const re = /slug:\s*"([a-z0-9-]+)"[\s\S]*?published:\s*(true|false)/g;
const published = [];
let m;
while ((m = re.exec(src)) !== null) if (m[2] === "true") published.push(m[1]);

const missing = [];
for (const slug of published) {
  const dir = join(here, slug);
  if (!existsSync(dir)) { missing.push({ slug, gaps: ["<no seo-tools/runbook/" + slug + "/ folder>"] }); continue; }
  const gaps = REQUIRED.filter((f) => !existsSync(join(dir, f)));
  if (gaps.length) missing.push({ slug, gaps });
}

if (missing.length) {
  console.error("PUBLISH-READINESS FAIL — published page(s) without a complete run-book artifact set:");
  for (const x of missing) console.error(`  ${x.slug}: missing ${x.gaps.join(", ")}`);
  console.error("A page may not be published until it has been taken through the run book (Steps 4-6 produce these).");
  process.exit(1);
}
console.log(`OK — ${published.length} published page(s), each has its run-book artifacts.`);
