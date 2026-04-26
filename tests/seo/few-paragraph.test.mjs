import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync, existsSync } from "node:fs";
import * as cheerio from "cheerio";

// Each route below should render at least 3 distinct <p> elements of >=100
// characters inside <main>. Audit reference: PDF p.33 ("Few paragraphs"
// finding). Locked in place by PR #7 of the Phase 2 SEO audit fix plan.
const PAGES = [
  "artifacts/nexfortis/dist/public/contact/index.html",
  "artifacts/qb-portal/dist/public/faq/index.html",
  "artifacts/qb-portal/dist/public/waitlist/index.html",
];

test("each page has >=3 paragraphs of >=100 chars", () => {
  for (const p of PAGES) {
    // qb-portal prerender (audit issue C2 — helmet timeout) is not run in CI;
    // the CI workflow only runs `vite build` for qb-portal. Skip routes whose
    // prerendered HTML is missing on disk so this test stays green in CI
    // while still enforcing the rule locally (full prerender) and once C2 is
    // fixed in CI. Same graceful-skip pattern as INV-018/INV-019 in
    // tests/seo/invariants.test.mjs.
    if (!existsSync(p)) continue;
    const $ = cheerio.load(readFileSync(p, "utf8"));
    const paras = $("main p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length >= 100);
    assert.ok(paras.length >= 3, `${p}: ${paras.length} qualifying paragraphs`);
  }
});
