import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveSitemaps,
  rewriteLocToOrigin,
} from "./verify-rendered-content.mjs";

function withSitemapEnv(value, fn) {
  const prev = process.env.SITEMAP_URLS;
  try {
    if (value === undefined) delete process.env.SITEMAP_URLS;
    else process.env.SITEMAP_URLS = value;
    return fn();
  } finally {
    if (prev === undefined) delete process.env.SITEMAP_URLS;
    else process.env.SITEMAP_URLS = prev;
  }
}

test("resolveSitemaps — defaults to production when env unset", () => {
  withSitemapEnv(undefined, () => {
    const r = resolveSitemaps();
    assert.deepEqual(r, [
      "https://qb.nexfortis.com/sitemap.xml",
      "https://nexfortis.com/sitemap.xml",
    ]);
  });
});

test("resolveSitemaps — uses SITEMAP_URLS when set", () => {
  withSitemapEnv(
    "https://nexfortis-marketing-pr-42.onrender.com/sitemap.xml,https://nexfortis-qb-portal-pr-42.onrender.com/sitemap.xml",
    () => {
      const r = resolveSitemaps();
      assert.equal(r.length, 2);
      assert.match(r[0], /nexfortis-marketing-pr-42/);
      assert.match(r[1], /nexfortis-qb-portal-pr-42/);
    },
  );
});

test("resolveSitemaps — throws when SITEMAP_URLS is whitespace-only", () => {
  withSitemapEnv("   ,  ,", () => {
    assert.throws(() => resolveSitemaps(), /no sitemap URLs/);
  });
});

test("rewriteLocToOrigin — passes through when sitemap host matches", () => {
  const out = rewriteLocToOrigin(
    "https://nexfortis.com/about",
    "https://nexfortis.com/sitemap.xml",
  );
  assert.deepEqual(out, {
    url: "https://nexfortis.com/about",
    canonicalHost: "nexfortis.com",
  });
});

test("rewriteLocToOrigin — rewrites <loc> to sitemap origin and preserves canonical host", () => {
  const out = rewriteLocToOrigin(
    "https://qb.nexfortis.com/catalog",
    "https://nexfortis-qb-portal-pr-42.onrender.com/sitemap.xml",
  );
  assert.deepEqual(out, {
    url: "https://nexfortis-qb-portal-pr-42.onrender.com/catalog",
    canonicalHost: "qb.nexfortis.com",
  });
});
