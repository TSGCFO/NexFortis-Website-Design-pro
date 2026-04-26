// tests/seo/lib/load-dist.mjs
// Discovers prerendered HTML files in artifacts/<site>/dist/public/ for both sites.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "..", "..", "..");

// dist output lands in dist/public/ for both sites
const SITES = [
  { site: "nexfortis", dist: path.join(REPO_ROOT, "artifacts/nexfortis/dist/public") },
  { site: "qb-portal", dist: path.join(REPO_ROOT, "artifacts/qb-portal/dist/public") },
];

// Files to exclude from snapshotting (SPA fallbacks, not real routes)
const EXCLUDE_FILES = new Set(["200.html", "spa-shell.html"]);

export async function loadDist() {
  const out = [];
  for (const { site, dist } of SITES) {
    const exists = await fs.stat(dist).catch(() => null);
    if (!exists) continue;
    for await (const file of walk(dist)) {
      if (!file.endsWith(".html")) continue;
      const basename = path.basename(file);
      if (EXCLUDE_FILES.has(basename)) continue;
      // Skip foo.html when foo/index.html also exists (identical Netlify copies).
      // Only index.html files are the canonical prerendered routes.
      if (basename !== "index.html") {
        const siblingIndex = file.replace(/\.html$/, "/index.html");
        const siblingExists = await fs.stat(siblingIndex).catch(() => null);
        if (siblingExists) continue;
      }
      const html = await fs.readFile(file, "utf8");
      const rel = path.relative(dist, file).replace(/\\/g, "/");
      const route =
        rel === "index.html"
          ? "/"
          : "/" + rel.replace(/\/?index\.html$/, "");
      out.push({ site, route, html, file });
    }
  }
  return out;
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}
