// Content-quality gate for the digital-marketing hub-and-spoke pages.
//
// Reads the prerendered HTML in artifacts/nexfortis/dist/public/services/
// digital-marketing/ — so it only runs after a FULL nexfortis build (vite +
// prerender). Like the QB service-page content test, it is a local TDD /
// regression gate, not a CI gate, but the prerendered pages it checks are the
// same ones CI's snapshot/invariant suite validates.
//
// Enforces, per page, the content-SEO + EEAT rules ported from S Care Companion:
//   - word count (spoke ≥1200, pillar ≥2000)
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
import { join } from "node:path";
import * as cheerio from "cheerio";

const DIST = "artifacts/nexfortis/dist/public";

// route path (under dist) -> { kind }
const PAGES = [
  { route: "services/digital-marketing", kind: "pillar" },
  { route: "services/digital-marketing/seo", kind: "spoke" },
  { route: "services/digital-marketing/local-seo", kind: "spoke" },
  { route: "services/digital-marketing/generative-engine-optimization", kind: "spoke" },
];

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
const MIN_SPOKE_WORDS = 1200;
const MIN_PILLAR_WORDS = 2000;

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

test("each DM page meets its word-count floor", () => {
  for (const { route, kind } of PAGES) {
    const { mainText } = load(route);
    const words = wordCount(mainText);
    const floor = kind === "pillar" ? MIN_PILLAR_WORDS : MIN_SPOKE_WORDS;
    assert.ok(words >= floor, `${route}: ${words} words (need ≥${floor})`);
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
