#!/usr/bin/env node
// Builds public/pricing.md (+ dist/public/pricing.md if present) from
// public/products.json. Run any time; safe before or after build.
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPricingMarkdown } from "./pricing-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist", "public");

const sourcePath = path.join(publicDir, "products.json");
if (!existsSync(sourcePath)) {
  throw new Error(`[pricing] ${sourcePath} missing`);
}

const catalog = JSON.parse(await fs.readFile(sourcePath, "utf8"));
const generatedAt = new Date().toISOString().slice(0, 10);
const markdown = renderPricingMarkdown(catalog, { generatedAt });

await fs.writeFile(path.join(publicDir, "pricing.md"), markdown, "utf8");
console.log(`[pricing] wrote ${path.join(publicDir, "pricing.md")}`);

if (existsSync(distDir)) {
  await fs.writeFile(path.join(distDir, "pricing.md"), markdown, "utf8");
  console.log(`[pricing] wrote ${path.join(distDir, "pricing.md")}`);
}
