#!/usr/bin/env node
// Cannibalization checker (HARD GATE 1).
// One page = one cluster: fails if any keyword is owned by more than one page.
// Reads seo-tools/runbook/keyword-ownership.json.
//
//   node seo-tools/runbook/check-cannibalization.mjs
//
// Exit 0 = clean. Exit 1 = at least one keyword owned by >1 page (a blocker).
// This is BOTH the Step-2 gate AND a Step-8 / pre-publish inspector check.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
// Optional path arg lets us test the checker against a fixture; defaults to the real registry.
const REG = process.argv[2] || join(here, "keyword-ownership.json");

const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();

const reg = JSON.parse(readFileSync(REG, "utf8"));
const pages = reg.pages ?? {};

const owners = new Map(); // normalized keyword -> Set(pages)
for (const [page, data] of Object.entries(pages)) {
  for (const bucket of ["primary", "secondary"]) {
    for (const kw of data?.[bucket] ?? []) {
      const k = norm(kw);
      if (!k) continue;
      if (!owners.has(k)) owners.set(k, new Set());
      owners.get(k).add(page);
    }
  }
}

const conflicts = [];
for (const [kw, set] of owners) {
  if (set.size > 1) conflicts.push({ keyword: kw, pages: [...set] });
}

if (conflicts.length) {
  console.error(`CANNIBALIZATION FAIL — ${conflicts.length} keyword(s) owned by >1 page:`);
  for (const c of conflicts) console.error(`  "${c.keyword}"  ->  ${c.pages.join("  ||  ")}`);
  process.exit(1);
}

console.log(
  `OK — no cannibalization. ${owners.size} unique keywords across ${Object.keys(pages).length} pages, no overlaps.`,
);
