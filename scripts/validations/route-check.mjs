import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const QB_PORTAL = resolve(__dirname, "../../artifacts/qb-portal");
const APP_TSX = resolve(QB_PORTAL, "src/App.tsx");
const PRODUCTS_JSON = resolve(QB_PORTAL, "public/products.json");

console.log("=== Route & Link Check ===\n");

let errors = [];
let warnings = [];
function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

const appSource = readFileSync(APP_TSX, "utf-8");

const routeRegex = /path="([^"]+)"/g;
const staticRoutes = new Set();
const dynamicRoutes = [];
let match;
while ((match = routeRegex.exec(appSource)) !== null) {
  const path = match[1];
  if (path.includes(":")) {
    dynamicRoutes.push(path);
  } else {
    staticRoutes.add(path);
  }
}

console.log(`Found ${staticRoutes.size} static routes and ${dynamicRoutes.length} dynamic routes in App.tsx`);

function collectTsxFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory() && !entry.startsWith(".") && entry !== "node_modules" && entry !== "dist") {
      results.push(...collectTsxFiles(full));
    } else if (extname(entry) === ".tsx" || extname(entry) === ".ts") {
      results.push(full);
    }
  }
  return results;
}

const srcDir = resolve(QB_PORTAL, "src");
const tsxFiles = collectTsxFiles(srcDir);

const hrefRegex = /(?:href|to)=["']([^"']+)["']/g;
const hrefTemplate = /(?:href|to)=\{`([^`]+)`\}/g;

function matchesDynamic(href) {
  for (const route of dynamicRoutes) {
    const pattern = route.replace(/:[^/]+/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(href)) return true;
  }
  return false;
}

function isValidHref(href) {
  if (href.startsWith("mailto:") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("#")) return true;
  if (staticRoutes.has(href)) return true;
  if (matchesDynamic(href)) return true;
  return false;
}

let totalLinks = 0;
let invalidLinks = [];

for (const file of tsxFiles) {
  const content = readFileSync(file, "utf-8");
  const relPath = file.replace(QB_PORTAL + "/", "");

  let m;
  hrefRegex.lastIndex = 0;
  while ((m = hrefRegex.exec(content)) !== null) {
    const href = m[1];
    if (href.startsWith("mailto:") || href.startsWith("http") || href.startsWith("#")) continue;

    totalLinks++;
    const cleanHref = href.split("?")[0];
    if (!isValidHref(cleanHref)) {
      invalidLinks.push({ file: relPath, href });
    }
  }

  hrefTemplate.lastIndex = 0;
  while ((m = hrefTemplate.exec(content)) !== null) {
    const template = m[1];
    if (template.includes("${")) {
      const staticPart = template.split("${")[0];
      const cleanStatic = staticPart.split("?")[0].replace(/\/$/, "") || "/";

      if (staticRoutes.has(cleanStatic)) continue;

      const matchesAnyDynamic = dynamicRoutes.some((r) => {
        const prefix = r.split(":")[0];
        return cleanStatic === prefix.replace(/\/$/, "") || cleanStatic.startsWith(prefix);
      });
      if (matchesAnyDynamic) continue;

      totalLinks++;
      const matchesRoute = [...staticRoutes].some((r) => r.startsWith(cleanStatic)) ||
        dynamicRoutes.some((r) => r.startsWith(cleanStatic));
      if (!matchesRoute) {
        invalidLinks.push({ file: relPath, href: template + " (template)" });
      }
    }
  }
}

console.log(`Scanned ${tsxFiles.length} source files, found ${totalLinks} internal links\n`);

const catalog = JSON.parse(readFileSync(PRODUCTS_JSON, "utf-8"));
const productSlugs = catalog.services.map((s) => s.slug);
const categorySlugs = [...new Set(catalog.services.map((s) => s.category_slug))];

let slugIssues = 0;
for (const slug of productSlugs) {
  const path = `/service/${slug}`;
  if (!matchesDynamic(path)) {
    fail(`Product slug '${slug}' would not resolve — no /service/:slug route`);
    slugIssues++;
  }
}
for (const slug of categorySlugs) {
  const path = `/category/${slug}`;
  if (!matchesDynamic(path)) {
    fail(`Category slug '${slug}' would not resolve — no /category/:slug route`);
    slugIssues++;
  }
}

if (slugIssues === 0) {
  console.log(`✓ All ${productSlugs.length} product slugs and ${categorySlugs.length} category slugs resolve to valid routes`);
}

if (invalidLinks.length > 0) {
  console.log("\nInvalid links found:");
  for (const { file, href } of invalidLinks) {
    fail(`${file}: href="${href}" does not match any defined route`);
    console.log(`  ${file}: ${href}`);
  }
}

if (warnings.length > 0) {
  console.log("\nWarnings:");
  warnings.forEach((w) => console.log(`  WARN: ${w}`));
}

if (errors.length > 0) {
  console.log(`\n✗ Route check FAILED (${errors.length} error(s))`);
  process.exit(1);
}

console.log(`\n✓ Route check passed — ${totalLinks} links verified, 0 broken`);
