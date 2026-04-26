// tests/seo/lib/load-dist.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadDist } from "./load-dist.mjs";

test("loadDist — discovers prerendered HTML files for both sites", async () => {
  const pages = await loadDist();
  const sites = new Set(pages.map((p) => p.site));
  assert.ok(sites.has("nexfortis"), "expected nexfortis site");
  assert.ok(sites.has("qb-portal"), "expected qb-portal site");
  for (const p of pages) {
    assert.equal(typeof p.site, "string");
    assert.equal(typeof p.route, "string");
    assert.equal(typeof p.html, "string");
    assert.ok(p.html.includes("<html"), `route ${p.route} html missing <html>`);
  }
});

test("loadDist — route is the relative path with leading slash", async () => {
  const pages = await loadDist();
  const home = pages.find((p) => p.site === "nexfortis" && p.route === "/");
  assert.ok(home, "nexfortis homepage not found");
});
