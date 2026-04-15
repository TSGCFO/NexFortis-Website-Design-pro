import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const QB_PORTAL = resolve(__dirname, "../../artifacts/qb-portal");
const PRODUCTS_JSON = resolve(QB_PORTAL, "public/products.json");

console.log("=== Price Consistency Check ===\n");

const catalog = JSON.parse(readFileSync(PRODUCTS_JSON, "utf-8"));

const validPricesCAD = new Set();
for (const product of catalog.services) {
  validPricesCAD.add(product.base_price_cad);
  validPricesCAD.add(product.launch_price_cad);
  if (product.pack_size) {
    validPricesCAD.add(Math.round(product.base_price_cad / product.pack_size));
    validPricesCAD.add(Math.round(product.launch_price_cad / product.pack_size));
  }
}

function centsToDisplay(cents) {
  return (cents / 100).toFixed(2).replace(/\.00$/, "");
}

const validDisplayPrices = new Set();
for (const cents of validPricesCAD) {
  validDisplayPrices.add(`$${(cents / 100).toFixed(2)}`);
  validDisplayPrices.add(`$${(cents / 100).toFixed(0)}`);
  const noTrailing = (cents / 100).toFixed(2).replace(/\.00$/, "");
  validDisplayPrices.add(`$${noTrailing}`);
}

const COMPETITOR_PATTERNS = [
  /\$\d+\s*USD/,
  /~\$\d+\s*CAD/,
  /exchange rate/i,
];

const EXCLUDE_PATTERNS = [
  /\$\d+\/referral/,
  /under \$[\d,]+/i,
  /\$25\/referral/,
  /\$\d{1,3},\d{3}/,
];

function collectTsxFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory() && !entry.startsWith(".") && entry !== "node_modules" && entry !== "dist") {
      results.push(...collectTsxFiles(full));
    } else if (extname(entry) === ".tsx") {
      results.push(full);
    }
  }
  return results;
}

const srcDir = resolve(QB_PORTAL, "src");
const tsxFiles = collectTsxFiles(srcDir);

const priceRegex = /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/g;

let warnings = [];
let totalPricesFound = 0;

for (const file of tsxFiles) {
  const content = readFileSync(file, "utf-8");
  const relPath = file.replace(QB_PORTAL + "/", "");
  const lines = content.split("\n");

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];

    if (line.trim().startsWith("//") || line.trim().startsWith("*") || line.trim().startsWith("/*")) continue;

    if (COMPETITOR_PATTERNS.some((p) => p.test(line))) continue;
    if (EXCLUDE_PATTERNS.some((p) => p.test(line))) continue;

    if (/formatPrice|getActivePrice|formatPriceCAD/.test(line)) continue;

    let m;
    priceRegex.lastIndex = 0;
    while ((m = priceRegex.exec(line)) !== null) {
      const priceStr = `$${m[1]}`;
      totalPricesFound++;

      if (!validDisplayPrices.has(priceStr)) {
        const surroundingContext = line.trim().substring(0, 120);
        warnings.push({
          file: relPath,
          line: lineNum + 1,
          price: priceStr,
          context: surroundingContext,
        });
      }
    }
  }
}

console.log(`Scanned ${tsxFiles.length} files, found ${totalPricesFound} hardcoded price references\n`);

if (warnings.length > 0) {
  console.log(`Found ${warnings.length} price(s) that don't match any product in the catalog:\n`);
  for (const w of warnings) {
    console.log(`  WARN: ${w.file}:${w.line} — ${w.price}`);
    console.log(`        ${w.context}`);
    console.log("");
  }
  console.log(`⚠ Price consistency check completed with ${warnings.length} warning(s)`);
  console.log("  Review these manually — they may be intentional (competitor prices, descriptions, etc.)");
  console.log("  or they may be stale prices that need updating.");
} else {
  console.log("✓ Price consistency check passed — all hardcoded prices match catalog values");
}
