import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_PATH = resolve(__dirname, "../../artifacts/qb-portal/public/products.json");

const REQUIRED_FIELDS = [
  "id", "slug", "name", "category", "category_slug", "description",
  "base_price_cad", "launch_price_cad", "turnaround", "badge",
  "is_addon", "accepted_file_types", "sort_order"
];

const KNOWN_CATEGORIES = {
  "quickbooks-conversion": "QuickBooks Conversion Services",
  "quickbooks-data-services": "QuickBooks Data Services",
  "platform-migrations": "Platform Migration Services",
  "expert-support": "QB Expert Support",
  "volume-packs": "Volume Packs",
};

const EXPECTED_COUNT = 20;

let errors = [];
let warnings = [];

function fail(msg) { errors.push(`ERROR: ${msg}`); }
function warn(msg) { warnings.push(`WARN: ${msg}`); }

console.log("=== Product Integrity Check ===\n");

let raw;
try {
  raw = readFileSync(PRODUCTS_PATH, "utf-8");
} catch (e) {
  fail(`Cannot read products.json: ${e.message}`);
  finish();
}

let catalog;
try {
  catalog = JSON.parse(raw);
} catch (e) {
  fail(`products.json is not valid JSON: ${e.message}`);
  finish();
}

if (typeof catalog.promo_active !== "boolean") {
  fail("Missing or invalid top-level 'promo_active' (expected boolean)");
}
if (typeof catalog.promo_label !== "string" || catalog.promo_label.length === 0) {
  fail("Missing or empty top-level 'promo_label'");
}

if (!Array.isArray(catalog.services)) {
  fail("'services' is not an array");
  finish();
}

if (catalog.services.length !== EXPECTED_COUNT) {
  fail(`Expected ${EXPECTED_COUNT} products, found ${catalog.services.length}`);
}

const slugsSeen = new Set();
const idsSeen = new Set();

for (const product of catalog.services) {
  const label = `[id=${product.id}, slug=${product.slug}]`;

  for (const field of REQUIRED_FIELDS) {
    if (product[field] === undefined || product[field] === null) {
      fail(`${label} missing required field '${field}'`);
    }
  }

  if (typeof product.base_price_cad === "number" && product.base_price_cad <= 0) {
    fail(`${label} base_price_cad is ${product.base_price_cad} (must be > 0)`);
  }
  if (typeof product.launch_price_cad === "number" && product.launch_price_cad <= 0) {
    fail(`${label} launch_price_cad is ${product.launch_price_cad} (must be > 0)`);
  }
  if (typeof product.launch_price_cad === "number" && typeof product.base_price_cad === "number") {
    if (product.launch_price_cad > product.base_price_cad) {
      warn(`${label} launch_price_cad (${product.launch_price_cad}) > base_price_cad (${product.base_price_cad})`);
    }
  }

  if (product.category_slug && !KNOWN_CATEGORIES[product.category_slug]) {
    fail(`${label} unknown category_slug '${product.category_slug}'`);
  }
  if (product.category_slug && KNOWN_CATEGORIES[product.category_slug]) {
    if (product.category !== KNOWN_CATEGORIES[product.category_slug]) {
      fail(`${label} category '${product.category}' doesn't match expected '${KNOWN_CATEGORIES[product.category_slug]}' for slug '${product.category_slug}'`);
    }
  }

  if (product.slug) {
    if (slugsSeen.has(product.slug)) {
      fail(`${label} duplicate slug '${product.slug}'`);
    }
    slugsSeen.add(product.slug);
  }
  if (product.id !== undefined) {
    if (idsSeen.has(product.id)) {
      fail(`${label} duplicate id ${product.id}`);
    }
    idsSeen.add(product.id);
  }

  if (!Array.isArray(product.accepted_file_types)) {
    fail(`${label} accepted_file_types is not an array`);
  }
}

const hasArrow = raw.includes("→");
const hasDash = raw.includes("—");
if (!hasArrow) warn("No '→' character found in products.json (expected in product names)");
if (!hasDash) warn("No '—' character found in products.json (expected in promo_label or descriptions)");

finish();

function finish() {
  if (warnings.length > 0) {
    console.log("Warnings:");
    warnings.forEach((w) => console.log(`  ${w}`));
    console.log("");
  }
  if (errors.length > 0) {
    console.log("Errors:");
    errors.forEach((e) => console.log(`  ${e}`));
    console.log(`\n✗ Product integrity check FAILED (${errors.length} error(s), ${warnings.length} warning(s))`);
    process.exit(1);
  }
  console.log(`✓ Product integrity check passed — ${EXPECTED_COUNT} products, all fields valid, ${warnings.length} warning(s)`);
  process.exit(0);
}
