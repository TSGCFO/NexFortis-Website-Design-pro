import { test } from "node:test";
import assert from "node:assert/strict";
import { embedBlogPostSnapshot } from "../../../lib/blog-snapshot.mjs";

const post = {
  id: 5, slug: "example-article", title: "Example", excerpt: "Summary",
  content: "</script><script>alert('test')</script>\u2028\u2029 $& $` $' $$",
  category: "Automation", published: true, createdAt: "2026-04-20T00:00:00Z",
  privateAdminNote: "Must not be published",
};

test("article snapshot cannot break out of its JSON script or expose extra fields", () => {
  const html = embedBlogPostSnapshot("<html><head></head><body>Article</body></html>", post, "/blog/example-article");
  const encoded = html.match(/type="application\/json">(.*?)<\/script>/s)[1];
  assert.equal(encoded.includes("<"), false);
  assert.equal(encoded.includes("\u2028"), false);
  assert.equal(encoded.includes("\u2029"), false);
  assert.equal(JSON.parse(encoded).content, post.content);
  assert.equal(html.includes("privateAdminNote"), false);
  assert.equal((html.match(/<script/g) || []).length, 1);
});

test("snapshot rejects draft articles, absent content, and the wrong route", () => {
  for (const candidate of [{ ...post, published: false }, { ...post, published: undefined }, { ...post, content: "" }, null]) {
    assert.throws(() => embedBlogPostSnapshot("<head></head>", candidate, "/blog/example-article"));
  }
  assert.throws(() => embedBlogPostSnapshot("<head></head>", post, "/blog/another-article"));
});
