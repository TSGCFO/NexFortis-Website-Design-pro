import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

const QB_DIST = "artifacts/qb-portal/dist/public";

const LANDING_SLUGS = [
  "enterprise-to-premier-conversion",
  "quickbooks-file-too-large",
  "quickbooks-running-slow",
  "audit-trail-removal",
  "quickbooks-desktop-end-of-life",
  "etech-alternative",
  "affordable-enterprise-conversion",
  "quickbooks-support-subscription",
  "super-condense",
  "accountedge-to-quickbooks",
  "quickbooks-company-file-error",
  "multi-currency-removal",
  "list-reduction",
  "is-it-safe",
  "how-conversion-works",
];

function loadBody(slug) {
  const html = readFileSync(join(QB_DIST, "landing", slug, "index.html"), "utf8");
  const $ = cheerio.load(html);
  $("script,style,noscript").remove();
  return { $, text: $("main").text().replace(/\s+/g, " ").trim() };
}

test("each landing page renders ≥500 words", () => {
  for (const s of LANDING_SLUGS) {
    const { text } = loadBody(s);
    const w = text.split(/\s+/).filter(Boolean).length;
    assert.ok(w >= 500, `${s}: ${w} words`);
  }
});

test("no text block ≥100 chars appears on more than 2 landing pages", () => {
  const seen = new Map(); // block -> Set<slug>
  for (const s of LANDING_SLUGS) {
    const { $ } = loadBody(s);
    const blocks = $("main p, main li").map((_, el) => $(el).text().replace(/\s+/g, " ").trim()).get()
      .filter(t => t.length >= 100);
    for (const b of blocks) {
      if (!seen.has(b)) seen.set(b, new Set());
      seen.get(b).add(s);
    }
  }
  for (const [block, slugs] of seen) {
    assert.ok(slugs.size <= 2, `block on ${slugs.size} pages: "${block.slice(0, 80)}…"`);
  }
});
