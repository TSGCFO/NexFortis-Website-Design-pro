import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveSitemaps } from "./verify-head-tags.mjs";

test("resolveSitemaps — defaults to production when env unset", () => {
  delete process.env.SITEMAP_URLS;
  const r = resolveSitemaps();
  assert.deepEqual(r, [
    "https://qb.nexfortis.com/sitemap.xml",
    "https://nexfortis.com/sitemap.xml",
  ]);
});

test("resolveSitemaps — uses SITEMAP_URLS when set", () => {
  process.env.SITEMAP_URLS = "https://pr-42-nexfortis-marketing.onrender.com/sitemap.xml,https://pr-42-nexfortis-qb-portal.onrender.com/sitemap.xml";
  const r = resolveSitemaps();
  assert.equal(r.length, 2);
  assert.match(r[0], /pr-42-nexfortis-marketing/);
  delete process.env.SITEMAP_URLS;
});
