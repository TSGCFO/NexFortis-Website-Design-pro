import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDist } from "./lib/load-dist.mjs";
import { extract } from "./lib/extract.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const SNAP_DIR = path.join(here, "__snapshots__");
const UPDATE = process.env.UPDATE_SNAPSHOTS === "1";

const pages = await loadDist();

if (pages.length === 0) {
  test("snapshots — dist not built; run pnpm build first", () => {
    assert.fail("No dist files found. Run `pnpm build` before snapshot tests.");
  });
}

for (const page of pages) {
  const slug = page.route === "/" ? "index" : page.route.replace(/^\//, "").replace(/\//g, "_");
  const snapPath = path.join(SNAP_DIR, page.site, `${slug}.snap.json`);

  test(`snapshot ${page.site} ${page.route}`, async () => {
    const fp = extract(page.html, page.route);
    const serialized = JSON.stringify(fp, null, 2) + "\n";

    if (UPDATE) {
      await fs.mkdir(path.dirname(snapPath), { recursive: true });
      await fs.writeFile(snapPath, serialized, "utf8");
      return;
    }

    let baseline;
    try {
      baseline = await fs.readFile(snapPath, "utf8");
    } catch {
      assert.fail(
        `Missing snapshot for ${page.site}${page.route}. Run \`pnpm test:seo:update\` to create.`,
      );
    }
    assert.equal(serialized, baseline);
  });
}

// Sitemap fingerprints (Task 6.4)
const REPO_ROOT = path.resolve(here, "..", "..");
const SITEMAPS = [
  { site: "nexfortis", file: path.join(REPO_ROOT, "artifacts/nexfortis/dist/public/sitemap.xml") },
  { site: "qb-portal", file: path.join(REPO_ROOT, "artifacts/qb-portal/dist/public/sitemap.xml") },
];

for (const { site, file } of SITEMAPS) {
  const snapPath = path.join(SNAP_DIR, site, "sitemap.snap.json");
  test(`snapshot ${site} sitemap.xml`, async () => {
    const xml = await fs.readFile(file, "utf8");
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).sort();
    const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1].trim());
    const fp = { urlCount: urls.length, urls, hasLastmod: lastmods.length > 0 };
    const serialized = JSON.stringify(fp, null, 2) + "\n";

    if (UPDATE) {
      await fs.mkdir(path.dirname(snapPath), { recursive: true });
      await fs.writeFile(snapPath, serialized, "utf8");
      return;
    }

    const baseline = await fs.readFile(snapPath, "utf8").catch(() => null);
    assert.ok(baseline, `Missing sitemap snapshot for ${site}. Run pnpm test:seo:update.`);
    assert.equal(serialized, baseline);
  });
}
