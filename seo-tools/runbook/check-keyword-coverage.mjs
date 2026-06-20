#!/usr/bin/env node
// Keyword + Outline Coverage Gate (HARD GATE).
//
// Verifies a page's content contains, in full:
//   1. the PRIMARY keyword,
//   2. EVERY owned SECONDARY keyword (seo-tools/runbook/keyword-ownership.json), and
//   3. EVERY heading from the locked outline (H1 + all H2/H3 in <slug>/04-outline.json).
//
// Run it after the draft (Step 5) AND again after humanizing (Step 6c) to prove the
// humanizer did not drop or reword a keyword, or alter/replace any H1/H2/H3.
//
//   node seo-tools/runbook/check-keyword-coverage.mjs <slug> [content-file]
//
// content-file defaults to seo-tools/runbook/<slug>/05-draft.md. Pass a rendered
// HTML file for the pre-publish (Step 8) check. Works on .md and .html/.tsx.
//
// Exit 0 = full coverage. Exit 1 = something missing (it lists exactly what).
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const slug = process.argv[2];
if (!slug) {
  console.error("Usage: check-keyword-coverage.mjs <slug> [content-file]");
  process.exit(1);
}
const contentFile = process.argv[3] || join(here, slug, "05-draft.md");

// Normalize: lowercase, straighten smart quotes, collapse whitespace.
const norm = (s) =>
  String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();

// --- owned keywords ---
const reg = JSON.parse(readFileSync(join(here, "keyword-ownership.json"), "utf8"));
const page = reg.pages?.[slug];
if (!page) {
  console.error(`No page "${slug}" in keyword-ownership.json`);
  process.exit(1);
}
const primary = page.primary || [];
const secondary = page.secondary || [];
const keywords = [...primary, ...secondary];

// --- content ---
if (!existsSync(contentFile)) {
  console.error(`Content file not found: ${contentFile}`);
  process.exit(1);
}
const raw = readFileSync(contentFile, "utf8");
const looksHtml = /\.(html?|tsx|jsx)$/i.test(contentFile) || /<h[1-3][\s>]/i.test(raw);

let headings;
let plain;
if (looksHtml) {
  headings = [...raw.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => m[2].replace(/<[^>]+>/g, " ").trim());
  plain = raw.replace(/<[^>]+>/g, " ");
} else {
  headings = [...raw.matchAll(/^\s{0,3}#{1,3}\s+(.+?)\s*#*\s*$/gm)].map((m) => m[1].trim());
  plain = raw;
}
const plainNorm = norm(plain);
const headNorm = headings.map(norm);

// --- keyword coverage (normalized substring across the whole content) ---
const missingKw = keywords.filter((k) => !plainNorm.includes(norm(k)));

// --- heading coverage (each expected heading must appear AS a heading) ---
const outlineFile = join(here, slug, "04-outline.json");
let expectedHeads = [];
let missingHead = [];
let headingChecked = false;
if (existsSync(outlineFile)) {
  headingChecked = true;
  const o = JSON.parse(readFileSync(outlineFile, "utf8"));
  expectedHeads = [o.h1, ...(o.h2 || []), ...(o.h3 || [])].filter(Boolean);
  // Exact (normalized) match: an expected heading must appear verbatim as a heading,
  // so an altered/reworded H1/H2 is caught (substring would falsely pass overlapping headings).
  missingHead = expectedHeads.filter((h) => !headNorm.includes(norm(h)));
}

// --- report ---
console.log(`coverage[${slug}]  file=${contentFile}  (${looksHtml ? "html" : "markdown"})`);
console.log(`  keywords: ${keywords.length - missingKw.length}/${keywords.length} present  (primary: ${primary.join(", ")})`);
if (missingKw.length) console.error(`  MISSING keyword(s): ${missingKw.join("  |  ")}`);
if (headingChecked) {
  console.log(`  headings: ${expectedHeads.length - missingHead.length}/${expectedHeads.length} present`);
  if (missingHead.length) console.error(`  MISSING/ALTERED heading(s): ${missingHead.join("  |  ")}`);
} else {
  console.warn(`  (no ${slug}/04-outline.json — heading check skipped)`);
}

if (missingKw.length || missingHead.length) {
  console.error("KEYWORD/OUTLINE COVERAGE FAIL — content must contain every owned keyword and every locked heading.");
  process.exit(1);
}
console.log("OK — full keyword + outline coverage.");
