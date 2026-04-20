#!/usr/bin/env node
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const BADGE_NAMES = [
  "badge-google-partner",
  "badge-microsoft-partner",
  "badge-quickbooks-proadvisor",
];

const ARTIFACT_DIRS = [
  path.join(rootDir, "artifacts", "nexfortis", "public", "images"),
  path.join(rootDir, "artifacts", "qb-portal", "public", "images"),
];

const PNG_SOURCES = ARTIFACT_DIRS.flatMap((dir) =>
  BADGE_NAMES.map((name) => ({
    src: path.join(dir, `${name}.png`),
    dest: path.join(dir, `${name}.webp`),
  }))
);

async function convert() {
  let converted = 0;
  let skipped = 0;

  for (const { src, dest } of PNG_SOURCES) {
    if (!fs.existsSync(src)) {
      console.log(`  skip (no PNG): ${path.relative(rootDir, src)}`);
      skipped++;
      continue;
    }

    const srcStat = fs.statSync(src);
    await sharp(src).webp({ quality: 80 }).toFile(dest);
    const destStat = fs.statSync(dest);

    const savings = ((1 - destStat.size / srcStat.size) * 100).toFixed(0);
    console.log(
      `  ${path.relative(rootDir, src)} → .webp  (${srcStat.size} → ${destStat.size} bytes, -${savings}%)`
    );
    converted++;
  }

  console.log(`\nDone. ${converted} converted, ${skipped} skipped.`);
}

convert().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
