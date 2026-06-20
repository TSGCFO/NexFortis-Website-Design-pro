#!/usr/bin/env node
// Mandatory Humanizer Gate (Step 6c) + binding integrity verification.
//
// Humanizes ONLY body prose paragraphs. Headings are NEVER sent (preserved verbatim),
// lists are preserved, and within each prose block every markdown link and every owned
// keyword is PROTECTED with a sentinel so the humanizer cannot reword or drop it.
// After humanizing, it runs the coverage gate (check-keyword-coverage.mjs) to VERIFY:
//   - every H1/H2/H3 from the locked outline is unchanged,
//   - every owned keyword (keyword-ownership.json) is still present,
//   - the internal-link set is unchanged.
// These three are BINDING. The Undetectable AI-detection score is ADVISORY (the detector
// flags genuine human prose), so it never blocks here.
//
//   node seo-tools/runbook/humanize.mjs <slug> [content-file]
//
// PASS  -> writes <slug>/06c-humanized.md + <slug>/06c-humanize.json.
// FAIL  -> writes <slug>/06c-humanized.attempt.md + report, exits 1, leaves the draft untouched.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { secret } from "../_secrets.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const slug = process.argv[2];
if (!slug) { console.error("Usage: humanize.mjs <slug> [content-file]"); process.exit(1); }
const contentFile = process.argv[3] || join(here, slug, "05-draft.md");
const KEY = secret("UNDETECTABLE_AI_API_KEY");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const reg = JSON.parse(readFileSync(join(here, "keyword-ownership.json"), "utf8"));
const page = reg.pages[slug];
if (!page) { console.error(`no page "${slug}" in keyword-ownership.json`); process.exit(1); }
// longest keyword first so "professional seo services" is protected before "seo services"
const keywords = [...(page.primary || []), ...(page.secondary || [])].sort((a, b) => b.length - a.length);

const raw = readFileSync(contentFile, "utf8");

async function humanizeText(text) {
  const sub = await fetch("https://humanize.undetectable.ai/submit", {
    method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ content: text, readability: "University", purpose: "General Writing", strength: "Balanced", model: "v11" }),
  });
  const sj = await sub.json();
  if (!sj.id) throw new Error("submit: " + JSON.stringify(sj).slice(0, 150));
  for (let i = 0; i < 50; i++) {
    await sleep(3000);
    const d = await fetch("https://humanize.undetectable.ai/document", { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ id: sj.id }) });
    const dj = await d.json();
    if (dj.output) return dj.output;
  }
  throw new Error("humanize timeout for id " + sj.id);
}

// Protect markdown links + owned keywords with CJK-bracket sentinels the humanizer leaves alone.
function protect(text) {
  const map = []; let out = text;
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m) => { const t = `【P${map.length}】`; map.push(m); return t; });
  for (const kw of keywords) {
    const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, (m) => { const t = `【P${map.length}】`; map.push(m); return t; });
  }
  return { out, map };
}
const restore = (text, map) => { let o = text; for (let i = 0; i < map.length; i++) o = o.split(`【P${i}】`).join(map[i]); return o; };

const blocks = raw.split(/\n\n+/);
const isHeading = (b) => /^\s{0,3}#{1,3}\s/.test(b);
const isList = (b) => b.split("\n").filter((l) => l.trim()).every((l) => /^\s*([-*]|\d+\.)\s/.test(l));
const wc = (b) => b.split(/\s+/).filter(Boolean).length;

let humanized = 0;
const outBlocks = [];
for (const b of blocks) {
  if (isHeading(b) || isList(b) || wc(b) < 50) { outBlocks.push(b); continue; }
  const { out, map } = protect(b);
  try { outBlocks.push(restore(await humanizeText(out), map)); humanized++; }
  catch (e) { console.error("  block kept (humanize failed):", e.message); outBlocks.push(b); }
}
const result = outBlocks.join("\n\n");

const attemptPath = join(here, slug, "06c-humanized.attempt.md");
writeFileSync(attemptPath, result);

// BINDING verify: headings + keywords via the coverage gate
let coverageOk = true, coverageOut = "";
try { coverageOut = execFileSync("node", [join(here, "check-keyword-coverage.mjs"), slug, attemptPath], { encoding: "utf8" }); }
catch (e) { coverageOk = false; coverageOut = (e.stdout || "") + (e.stderr || ""); }
// BINDING verify: link set unchanged
const links = (s) => [...s.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]).sort();
const origLinks = links(raw), newLinks = links(result);
const linksOk = JSON.stringify(origLinks) === JSON.stringify(newLinks);

const report = { slug, contentFile, humanizedBlocks: humanized, totalBlocks: blocks.length, integrity: { coverageOk, linksOk, origLinks: origLinks.length, newLinks: newLinks.length }, ai_detection: "ADVISORY (run undetectable-detect.mjs; detector flags human prose, non-binding)" };
writeFileSync(join(here, slug, "06c-humanize.json"), JSON.stringify(report, null, 2));
console.log(coverageOut.trim());
console.log(`links: ${origLinks.length} -> ${newLinks.length}  ${linksOk ? "OK" : "CHANGED: " + newLinks.filter(l=>!origLinks.includes(l)).join(",")}`);

if (coverageOk && linksOk) {
  writeFileSync(join(here, slug, "06c-humanized.md"), result);
  console.log(`\nHUMANIZE OK — outline + keywords + links intact. Wrote ${slug}/06c-humanized.md (${humanized}/${blocks.length} prose blocks humanized).`);
} else {
  console.error(`\nHUMANIZE INTEGRITY FAIL — draft left untouched. Attempt: ${attemptPath}. Re-insert dropped keywords/links or restore headings, then re-verify.`);
  process.exit(1);
}
