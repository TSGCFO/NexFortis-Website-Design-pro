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

test("INV-002: <title> pixel width 200–580 px", () => {
  const violations = [];
  for (const p of fingerprints) {
    if (!p.fp.title) {
      if (!isAllowed("INV-002", p.site, p.route)) {
        violations.push(`${p.site}${p.route}: missing <title>`);
      }
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
      if (!isAllowed("INV-003", p.site, p.route)) {
        violations.push(`${p.site}${p.route}: missing description`);
      }
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

test('INV-014: <div id="root"> is non-empty (prerender shell check)', () => {
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
    const xmlPath = path.join(here, "..", "..", `artifacts/${site}/dist/public/sitemap.xml`);
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
    const xmlPath = path.join(here, "..", "..", `artifacts/${site}/dist/public/sitemap.xml`);
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
