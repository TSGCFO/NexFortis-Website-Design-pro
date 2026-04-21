import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import {
  resolveRequestPath,
  detectNoindex,
  createStaticServer,
  validatePrerenderedHtml,
} from "../lib/prerender-utils.mjs";

const distDir = path.resolve("/tmp/prerender-test-dist");

test("resolveRequestPath rejects literal /.. traversal", () => {
  const r = resolveRequestPath({
    url: "/../etc/passwd",
    base: "/",
    distDir,
  });
  assert.equal(r.insideDist, false);
});

test("resolveRequestPath rejects encoded %2e%2e traversal", () => {
  const r = resolveRequestPath({
    url: "/%2e%2e/%2e%2e/etc/passwd",
    base: "/",
    distDir,
  });
  assert.equal(r.insideDist, false);
});

test("resolveRequestPath rejects mixed-case encoded traversal", () => {
  const r = resolveRequestPath({
    url: "/foo/%2E%2E/%2E%2E/etc/shadow",
    base: "/",
    distDir,
  });
  assert.equal(r.insideDist, false);
});

test("resolveRequestPath rejects base-prefix-stripping traversal", () => {
  // base "/qb-portal/" strips the "/qb-portal" prefix; the remainder
  // starts with "/.." and must still be rejected.
  const r = resolveRequestPath({
    url: "/qb-portal/../../etc/passwd",
    base: "/qb-portal/",
    distDir,
  });
  assert.equal(r.insideDist, false);
});

test("resolveRequestPath rejects encoded traversal under a base prefix", () => {
  const r = resolveRequestPath({
    url: "/qb-portal/%2e%2e/%2e%2e/etc/passwd",
    base: "/qb-portal/",
    distDir,
  });
  assert.equal(r.insideDist, false);
});

test("resolveRequestPath accepts in-tree paths", () => {
  const r = resolveRequestPath({
    url: "/assets/main.js",
    base: "/",
    distDir,
  });
  assert.equal(r.insideDist, true);
  assert.equal(r.requested, path.join(distDir, "assets/main.js"));
});

test("resolveRequestPath accepts root path", () => {
  const r = resolveRequestPath({ url: "/", base: "/", distDir });
  assert.equal(r.insideDist, true);
});

test("resolveRequestPath rejects malformed percent-encoded urls", () => {
  const r = resolveRequestPath({
    url: "/%E0%A4%A",
    base: "/",
    distDir,
  });
  assert.equal(r.insideDist, false);
});

// --- HTTP-level traversal: actually run the server ---

async function withServer(distRoot, base, fn) {
  await fs.mkdir(distRoot, { recursive: true });
  await fs.writeFile(path.join(distRoot, "index.html"), "<html>ok</html>");
  const server = createStaticServer({ distDir: distRoot, base });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    await fn(port);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function get(port, urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: "127.0.0.1", port, path: urlPath, method: "GET" },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            body: Buffer.concat(chunks).toString("utf-8"),
          }),
        );
      },
    );
    req.on("error", reject);
    req.end();
  });
}

test("HTTP server returns 403 for /.. traversal", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "prerender-srv-"));
  await withServer(dir, "/", async (port) => {
    const res = await get(port, "/../../etc/passwd");
    assert.equal(res.status, 403);
  });
});

test("HTTP server returns 403 for %2e%2e traversal", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "prerender-srv-"));
  await withServer(dir, "/", async (port) => {
    const res = await get(port, "/%2e%2e/%2e%2e/etc/passwd");
    assert.equal(res.status, 403);
  });
});

test("HTTP server returns 403 for traversal under a base prefix", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "prerender-srv-"));
  await withServer(dir, "/qb-portal/", async (port) => {
    const res = await get(port, "/qb-portal/%2e%2e/%2e%2e/etc/passwd");
    assert.equal(res.status, 403);
  });
});

test("HTTP server serves apiRoutes before static files", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "prerender-srv-"));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "index.html"), "<html>shell</html>");
  const apiRoutes = [
    [/^\/api\/blog\/posts\/?$/, (_req, res) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify([{ slug: "a" }, { slug: "b" }]));
    }],
    [/^\/api\/blog\/posts\/([a-z0-9-]+)$/, (_req, res, m) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ slug: m[1], title: "T-" + m[1] }));
    }],
  ];
  const server = createStaticServer({ distDir: dir, base: "/", apiRoutes });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const list = await get(port, "/api/blog/posts");
    assert.equal(list.status, 200);
    assert.deepEqual(JSON.parse(list.body), [{ slug: "a" }, { slug: "b" }]);
    const single = await get(port, "/api/blog/posts/hello");
    assert.equal(single.status, 200);
    assert.deepEqual(JSON.parse(single.body), { slug: "hello", title: "T-hello" });
    // Non-api URL still falls back to index.html (SPA)
    const spa = await get(port, "/about");
    assert.equal(spa.status, 200);
    assert.ok(spa.body.includes("shell"));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("HTTP server returns 500 when apiRoute handler throws", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "prerender-srv-"));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "index.html"), "<html>shell</html>");
  const apiRoutes = [
    [/^\/api\/boom$/, () => { throw new Error("boom!"); }],
  ];
  const server = createStaticServer({ distDir: dir, base: "/", apiRoutes });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const res = await get(port, "/api/boom");
    assert.equal(res.status, 500);
    assert.ok(res.body.includes("boom!"));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("HTTP server falls back to index.html for SPA routes", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "prerender-srv-"));
  await withServer(dir, "/", async (port) => {
    const res = await get(port, "/some/spa/route");
    assert.equal(res.status, 200);
    assert.match(res.body, /<html>ok<\/html>/);
  });
});

// --- noindex detection ---

test("detectNoindex matches plain robots noindex meta", () => {
  const html = `<head><meta name="robots" content="noindex"></head>`;
  assert.equal(detectNoindex(html), "noindex");
});

test("detectNoindex matches react-helmet-async output (data-rh attribute)", () => {
  // react-helmet-async injects data-rh="true" and may put attributes in
  // varying orders. Make sure the regex is tolerant.
  const html = `<head><meta data-rh="true" name="robots" content="noindex, nofollow"/></head>`;
  assert.equal(detectNoindex(html), "noindex, nofollow");
});

test("detectNoindex matches when data-rh comes after content", () => {
  const html = `<head><meta name="robots" content="noindex" data-rh="true"></head>`;
  assert.equal(detectNoindex(html), "noindex");
});

test("detectNoindex matches single-quoted attributes", () => {
  const html = `<head><meta name='robots' content='noindex,follow'></head>`;
  assert.equal(detectNoindex(html), "noindex,follow");
});

test("detectNoindex is case-insensitive on the noindex value", () => {
  const html = `<head><meta name="robots" content="NoIndex"></head>`;
  assert.equal(detectNoindex(html), "NoIndex");
});

test("detectNoindex returns null for index/follow", () => {
  const html = `<head><meta name="robots" content="index, follow"></head>`;
  assert.equal(detectNoindex(html), null);
});

test("detectNoindex returns null when robots meta absent", () => {
  const html = `<head><meta name="description" content="hi"></head>`;
  assert.equal(detectNoindex(html), null);
});

test("validatePrerenderedHtml throws when noindex is present", () => {
  const html = `<head><meta name="robots" content="noindex"></head>`;
  assert.throws(
    () =>
      validatePrerenderedHtml({
        route: "/",
        html,
        noindexAllowlist: new Set(),
      }),
    /noindex robots meta/,
  );
});

test("validatePrerenderedHtml throws on react-helmet-async noindex output", () => {
  const html = `<head><meta data-rh="true" name="robots" content="noindex, nofollow"/></head>`;
  assert.throws(
    () =>
      validatePrerenderedHtml({
        route: "/blog/post-1",
        html,
        noindexAllowlist: new Set(),
      }),
    /robots="noindex, nofollow"/,
  );
});

test("validatePrerenderedHtml does not throw when noindex absent", () => {
  const html = `<head><meta name="robots" content="index, follow"></head>`;
  assert.doesNotThrow(() =>
    validatePrerenderedHtml({
      route: "/",
      html,
      noindexAllowlist: new Set(),
    }),
  );
});

test("validatePrerenderedHtml respects the noindex allowlist", () => {
  const html = `<head><meta name="robots" content="noindex"></head>`;
  assert.doesNotThrow(() =>
    validatePrerenderedHtml({
      route: "/admin/secret",
      html,
      noindexAllowlist: new Set(["/admin/secret"]),
    }),
  );
});

test("validatePrerenderedHtml throws for routes not in the allowlist", () => {
  const html = `<head><meta name="robots" content="noindex"></head>`;
  assert.throws(() =>
    validatePrerenderedHtml({
      route: "/public-page",
      html,
      noindexAllowlist: new Set(["/admin/secret"]),
    }),
  );
});

test("detectNoindex finds noindex among multiple robots tags", () => {
  // If the shell's noindex tag survives alongside the page's index tag,
  // we still want to flag it as a build failure.
  const html = `<head><meta name="robots" content="index, follow"><meta data-rh="true" name="robots" content="noindex"></head>`;
  assert.notEqual(detectNoindex(html), null);
});
