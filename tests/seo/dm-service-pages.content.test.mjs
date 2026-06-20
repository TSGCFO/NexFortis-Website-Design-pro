// Content-quality gate for the digital-marketing hub-and-spoke pages.
//
// Reads the prerendered HTML in artifacts/nexfortis/dist/public/services/
// digital-marketing/ — so it only runs after a FULL nexfortis build (vite +
// prerender). Wired into `pnpm test:seo` via the `test:seo:content` script.
//
// Pages and their word-count targets are read from tests/seo/dm-word-targets.json,
// which is populated per page in run-book Step 4 with a SERP-DERIVED range (the
// old hard-coded 1,200/2,000-word floors are gone). Only pages that have been
// taken through the run book appear there, so throwaway/unregenerated drafts are
// not gated. The other content-SEO + EEAT rules below run on that same page set:
//   - word count within the page's SERP-derived [min, max] range
//   - zero banned marketing-jargon phrases  (mirror of src/lib/brand-voice.ts)
//   - meta title ≤60 chars, meta description ≤160 chars
//   - ≥3 internal links and ≥3 external sourced-stat citations in <main>
//   - ≥4 FAQ entries via FAQPage JSON-LD
//   - Service + Person JSON-LD present, author named in body (EEAT)
//   - no paragraph reused within a page or across the cluster (no fabricated /
//     duplicated copy)
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const here = dirname(fileURLToPath(import.meta.url));
const DIST = "artifacts/nexfortis/dist/public";

// SERP-derived per-page targets (run-book Step 4). route -> { kind, min, max }.
const targets = JSON.parse(
  readFileSync(join(here, "dm-word-targets.json"), "utf8"),
).pages;

const PAGES = Object.entries(targets).map(([route, t]) => ({ route, ...t }));

// Mirror of artifacts/nexfortis/src/lib/brand-voice.ts — keep in sync.
const BANNED_PHRASES = [
  "world-class", "cutting-edge", "synergy", "best-in-class", "passionate about",
  "we are committed to", "dedicated to providing", "seamless", "holistic",
  "tailored solutions", "game-changing", "state-of-the-art", "at the forefront",
  "going above and beyond", "move the needle", "low-hanging fruit",
  "unlock your potential", "take your business to the next level",
  "one-stop shop", "secret sauce", "thought leader", "ninja", "rockstar", "guru",
];
const META_TITLE_MAX = 60;
const META_DESC_MAX = 160;
const MIN_INTERNAL_LINKS = 3;
const MIN_SOURCED_STATS = 3;
const MIN_FAQ_ITEMS = 4;

function load(route) {
  const file = join(DIST, route, "index.html");
  if (!existsSync(file)) {
    throw new Error(
      `Missing prerendered page: ${file}. Run \`pnpm --filter @workspace/nexfortis run build\` first.`,
    );
  }
  const html = readFileSync(file, "utf8");
  const $ = cheerio.load(html);
  const jsonld = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      jsonld.push(JSON.parse($(el).contents().text()));
    } catch {
      /* ignore unparseable blocks — invariants suite covers validity */
    }
  });
  const $main = $("main");
  const mainText = $main.text().replace(/\s+/g, " ").trim();
  return { $, $main, html, jsonld, mainText };
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

test("each DM page is within its SERP-derived word-count range", () => {
  if (PAGES.length === 0) return; // nothing regenerated through the run book yet
  for (const { route, min, max } of PAGES) {
    const { mainText } = load(route);
    const words = wordCount(mainText);
    assert.ok(
      typeof min === "number" && typeof max === "number" && min > 0 && max >= min,
      `${route}: invalid target range in dm-word-targets.json (min=${min}, max=${max})`,
    );
    assert.ok(
      words >= min && words <= max,
      `${route}: ${words} words (SERP-derived target ${min}-${max})`,
    );
  }
});

test("no banned marketing-jargon phrases appear", () => {
  for (const { route } of PAGES) {
    const { mainText } = load(route);
    const lower = mainText.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      assert.ok(!lower.includes(phrase), `${route}: banned phrase "${phrase}"`);
    }
  }
});

test("meta title ≤60 and description ≤160 characters", () => {
  for (const { route } of PAGES) {
    const { $ } = load(route);
    const title = $("title").first().text().trim();
    const desc = ($('meta[name="description"]').attr("content") || "").trim();
    assert.ok(title.length > 0 && title.length <= META_TITLE_MAX, `${route}: title ${title.length} chars`);
    assert.ok(desc.length > 0 && desc.length <= META_DESC_MAX, `${route}: description ${desc.length} chars`);
  }
});

test("≥3 internal links in main content", () => {
  for (const { route } of PAGES) {
    const { $, $main } = load(route);
    const hrefs = new Set();
    $main.find("a[href]").each((_, el) => {
      const href = ($(el).attr("href") || "").trim();
      if (href.startsWith("/") && !href.startsWith("/contact") && href !== "/") {
        hrefs.add(href);
      }
    });
    assert.ok(
      hrefs.size >= MIN_INTERNAL_LINKS,
      `${route}: ${hrefs.size} internal links (need ≥${MIN_INTERNAL_LINKS})`,
    );
  }
});

test("≥3 external sourced-stat citations in main content", () => {
  for (const { route } of PAGES) {
    const { $, $main } = load(route);
    const hrefs = new Set();
    $main.find("a[href]").each((_, el) => {
      const href = ($(el).attr("href") || "").trim();
      if (/^https?:\/\//i.test(href) && !/nexfortis\.com/i.test(href)) {
        hrefs.add(href);
      }
    });
    assert.ok(
      hrefs.size >= MIN_SOURCED_STATS,
      `${route}: ${hrefs.size} external citations (need ≥${MIN_SOURCED_STATS})`,
    );
  }
});

test("≥4 FAQ entries via FAQPage JSON-LD", () => {
  for (const { route } of PAGES) {
    const { jsonld } = load(route);
    const faq = jsonld.find((b) => b && b["@type"] === "FAQPage");
    assert.ok(faq, `${route}: no FAQPage JSON-LD`);
    const n = Array.isArray(faq.mainEntity) ? faq.mainEntity.length : 0;
    assert.ok(n >= MIN_FAQ_ITEMS, `${route}: ${n} FAQ items (need ≥${MIN_FAQ_ITEMS})`);
  }
});

test("Service + Person JSON-LD present and author named in body (EEAT)", () => {
  for (const { route } of PAGES) {
    const { jsonld, mainText } = load(route);
    assert.ok(jsonld.some((b) => b && b["@type"] === "Service"), `${route}: no Service JSON-LD`);
    assert.ok(jsonld.some((b) => b && b["@type"] === "Person"), `${route}: no Person JSON-LD`);
    assert.ok(mainText.includes("Hassan Sadiq"), `${route}: author not named in body`);
  }
});

test("no paragraph reused within a page or across the cluster", () => {
  const seen = new Map(); // paragraph -> route
  for (const { route } of PAGES) {
    const { $, $main } = load(route);
    const local = new Set();
    $main.find("p").each((_, el) => {
      // Skip paragraphs inside cards (.bg-card): related-service blurbs, stat
      // labels, pricing/author notes are repeated navigational UI by design,
      // not body copy. The dedup rule targets genuine prose only.
      if ($(el).closest(".bg-card").length > 0) return;
      const p = $(el).text().replace(/\s+/g, " ").trim();
      if (p.length < 80) return;
      assert.ok(!local.has(p), `${route}: duplicate paragraph within page: "${p.slice(0, 60)}…"`);
      local.add(p);
      const owner = seen.get(p);
      assert.ok(!owner || owner === route, `paragraph reused on ${route} (also ${owner}): "${p.slice(0, 60)}…"`);
      seen.set(p, route);
    });
  }
});
