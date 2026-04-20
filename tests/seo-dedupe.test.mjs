import { test } from "node:test";
import assert from "node:assert/strict";
import { dedupeSeoTags } from "../lib/seo-dedupe.mjs";

function head(inner) {
  return `<!doctype html><html><head>${inner}</head><body></body></html>`;
}

test("title dedupe keeps the last occurrence", () => {
  const html = head(`<title>Shell Title</title><title>Page Title</title>`);
  const out = dedupeSeoTags(html);
  assert.equal(out.match(/<title\b/gi)?.length, 1);
  assert.match(out, /<title>Page Title<\/title>/);
  assert.doesNotMatch(out, /Shell Title/);
});

test("meta description dedupe keeps the last", () => {
  const html = head(
    `<meta name="description" content="shell"><meta name="description" content="page">`,
  );
  const out = dedupeSeoTags(html);
  const matches = out.match(/<meta\b[^>]*name="description"[^>]*>/gi) ?? [];
  assert.equal(matches.length, 1);
  assert.match(out, /content="page"/);
  assert.doesNotMatch(out, /content="shell"/);
});

test("og:title (property=) dedupe keeps the last", () => {
  const html = head(
    `<meta property="og:title" content="shell"><meta property="og:title" content="page">`,
  );
  const out = dedupeSeoTags(html);
  const matches = out.match(/property="og:title"/g) ?? [];
  assert.equal(matches.length, 1);
  assert.match(out, /content="page"/);
});

test("canonical link dedupe keeps the last", () => {
  const html = head(
    `<link rel="canonical" href="https://example.com/old"><link rel="canonical" href="https://example.com/new">`,
  );
  const out = dedupeSeoTags(html);
  const matches = out.match(/rel="canonical"/g) ?? [];
  assert.equal(matches.length, 1);
  assert.match(out, /href="https:\/\/example\.com\/new"/);
});

test("hreflang alternates are dedupe per-language, last wins per language", () => {
  const html = head(
    [
      `<link rel="alternate" hreflang="en" href="https://example.com/en/old">`,
      `<link rel="alternate" hreflang="es" href="https://example.com/es">`,
      `<link rel="alternate" hreflang="en" href="https://example.com/en/new">`,
    ].join(""),
  );
  const out = dedupeSeoTags(html);
  const enMatches = out.match(/hreflang="en"/g) ?? [];
  const esMatches = out.match(/hreflang="es"/g) ?? [];
  assert.equal(enMatches.length, 1, "one en alternate");
  assert.equal(esMatches.length, 1, "one es alternate");
  assert.match(out, /href="https:\/\/example\.com\/en\/new"/);
  assert.doesNotMatch(out, /en\/old/);
});

test("non-deduped meta tags are preserved unchanged", () => {
  const html = head(
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="viewport" content="width=device-width">`,
  );
  const out = dedupeSeoTags(html);
  // viewport is not in dedupe list, both should remain
  const viewports = out.match(/name="viewport"/g) ?? [];
  assert.equal(viewports.length, 2);
});

test("returns html unchanged when there is no <head>", () => {
  const html = `<html><body>no head</body></html>`;
  assert.equal(dedupeSeoTags(html), html);
});
