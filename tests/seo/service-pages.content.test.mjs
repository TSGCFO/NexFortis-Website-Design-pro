// TDD test for PR #1 — QB service-page content rewrite (audit, 17 pages).
//
// Asserts that every prerendered QB service page has:
//   1. ≥500 words of body text (PDF p.34-35, "little text" finding).
//   2. No paragraph reused on the same page (PDF p.36-37, "duplicate
//      paragraphs" finding).
//   3. No paragraph reused across different service pages (PDF p.45-46,
//      "duplicate content" finding).
//   4. Every page-title bolded keyword from PDF p.38-39 appears at least
//      once (case-insensitive) in body copy.
//
// IMPORTANT: this test reads from artifacts/qb-portal/dist/public/service/
// which only exists after a FULL local prerender (vite + node prerender.mjs
// + generate-sitemap). CI builds qb-portal with vite-only because the
// prerender step is the documented audit issue C2 — so this test runs
// locally as a TDD/regression gate, not as a CI gate.
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

const SERVICE_SLUGS = [
  "enterprise-to-premier-standard",
  "enterprise-to-premier-complex",
  "guaranteed-30-minute",
  "file-health-check",
  "extended-support",
  "rush-delivery",
  "audit-trail-removal",
  "audit-trail-cra-bundle",
  "super-condense",
  "list-reduction",
  "multi-currency-removal",
  "qbo-readiness-report",
  "cra-period-copy",
  "accountedge-to-quickbooks",
  "sage50-to-quickbooks",
  "5-pack-conversions",
  "10-pack-conversions",
];

const QB_DIST = "artifacts/qb-portal/dist/public";

function loadPrerenderedBody(slug) {
  const p = join(QB_DIST, "service", slug, "index.html");
  const html = readFileSync(p, "utf8");
  const $ = cheerio.load(html);
  $("script,style,noscript").remove();
  return { $, text: $("main").text().replace(/\s+/g, " ").trim() };
}

test("each QB service page renders ≥500 words of body text", () => {
  for (const slug of SERVICE_SLUGS) {
    const { text } = loadPrerenderedBody(slug);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    assert.ok(wordCount >= 500, `${slug}: ${wordCount} words (need ≥500)`);
  }
});

test("no paragraph text repeats within a single service page", () => {
  for (const slug of SERVICE_SLUGS) {
    const { $ } = loadPrerenderedBody(slug);
    const paragraphs = $("main p")
      .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
      .get()
      .filter((p) => p.length >= 80);
    const seen = new Map();
    for (const p of paragraphs) {
      assert.ok(
        !seen.has(p),
        `${slug}: duplicate paragraph: "${p.slice(0, 80)}…"`,
      );
      seen.set(p, true);
    }
  }
});

test("no paragraph text repeats across different service pages", () => {
  const seen = new Map(); // text -> slug
  for (const slug of SERVICE_SLUGS) {
    const { $ } = loadPrerenderedBody(slug);
    const paragraphs = $("main p")
      .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
      .get()
      .filter((p) => p.length >= 80);
    for (const p of paragraphs) {
      const owner = seen.get(p);
      assert.ok(
        !owner || owner === slug,
        `paragraph reused on ${slug} (originally on ${owner}): "${p.slice(0, 80)}…"`,
      );
      seen.set(p, slug);
    }
  }
});

// Title-keyword-in-body coverage (audit PDF p.38-39).
// The bolded "Words from the page title that don't appear in the text" column
// is reproduced verbatim below. For all 9 affected QB service pages the only
// missing keyword is "Portal" — every service title ends with
// "| NexFortis QuickBooks Portal" but body copy never says "Portal".
// Fix: include the literal word "Portal" (or phrase "QuickBooks Portal")
// at least once in each service's combined body copy.
const TITLE_KEYWORDS = {
  "enterprise-to-premier-standard": ["Portal"], // PDF entry #8
  "enterprise-to-premier-complex": ["Portal"], // PDF entry #16
  "guaranteed-30-minute": ["Portal"], // PDF entry #11
  "file-health-check": ["Portal"], // PDF entry #17
  "rush-delivery": ["Portal"], // PDF entry #18
  "extended-support": ["Portal"], // PDF entry #19
  "audit-trail-cra-bundle": ["Portal"], // PDF entry #9
  "sage50-to-quickbooks": ["Portal"], // PDF entry #12
  "5-pack-conversions": ["Portal"], // PDF entry #10
  // The remaining 7 service slugs (audit-trail-removal, super-condense,
  // list-reduction, multi-currency-removal, qbo-readiness-report,
  // cra-period-copy, accountedge-to-quickbooks, 10-pack-conversions)
  // were NOT flagged on PDF p.38-39, so no required keyword inclusion.
};

test("title keywords appear in body for affected service pages", () => {
  for (const [slug, keywords] of Object.entries(TITLE_KEYWORDS)) {
    const { text } = loadPrerenderedBody(slug);
    const lower = text.toLowerCase();
    for (const kw of keywords) {
      assert.ok(
        lower.includes(kw.toLowerCase()),
        `${slug}: title keyword "${kw}" not in body`,
      );
    }
  }
});
