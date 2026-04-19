#!/usr/bin/env node
/**
 * Generates WebP versions of partner badge PNGs in both the marketing site
 * (`artifacts/nexfortis/public/images/`) and the QB portal
 * (`artifacts/qb-portal/public/images/`), and creates a 512×512 PNG version
 * of the QB portal logo (used as the `logo` property in the Organization
 * JSON-LD schema, since Google's structured-data guidelines recommend a
 * raster image rather than SVG).
 *
 * Run from the workspace root:
 *
 *   node scripts/convert-badges-to-webp.js
 *
 * `sharp` is installed as a dependency of @workspace/qb-portal. We resolve
 * it from that artifact's node_modules so this script works without adding
 * sharp as a workspace-root dependency.
 */
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");

const require = createRequire(import.meta.url);

function loadSharp() {
  // Try standard resolution first (works if sharp is hoisted to the workspace root).
  try {
    return require("sharp");
  } catch (err) {
    // Fall back to the qb-portal artifact, which lists sharp in its dependencies.
    const fallback = resolve(repoRoot, "artifacts/qb-portal/node_modules/sharp");
    if (!existsSync(fallback)) {
      throw new Error(
        `Unable to locate sharp. Tried default resolution and ${fallback}. ` +
          `Original error: ${err && err.message ? err.message : err}`,
      );
    }
    return require(fallback);
  }
}

const sharp = loadSharp();

const BADGE_FILENAMES = [
  "badge-microsoft-partner.png",
  "badge-google-partner.png",
  "badge-quickbooks-proadvisor.png",
];

const BADGE_DIRECTORIES = [
  resolve(repoRoot, "artifacts/nexfortis/public/images"),
  resolve(repoRoot, "artifacts/qb-portal/public/images"),
];

async function convertPngToWebp(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, ".webp");
  await sharp(pngPath)
    .webp({ quality: 85, effort: 5 })
    .toFile(webpPath);
  console.log(`  ✓ ${pngPath} → ${webpPath}`);
}

async function convertSvgLogoToPng(svgPath, pngPath, size = 512) {
  // density=192 keeps the rasterized intermediate well within sharp's default
  // 268 MP pixel limit even for wide SVG canvases, while still producing a
  // crisp 512×512 output after `resize(...)`.
  await sharp(svgPath, { density: 192, limitInputPixels: false })
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);
  console.log(`  ✓ ${svgPath} → ${pngPath} (${size}×${size})`);
}

async function main() {
  console.log("→ Generating WebP badge variants:");
  for (const dir of BADGE_DIRECTORIES) {
    for (const filename of BADGE_FILENAMES) {
      const png = resolve(dir, filename);
      if (!existsSync(png)) {
        console.warn(`  ! Skipping missing source: ${png}`);
        continue;
      }
      await convertPngToWebp(png);
    }
  }

  console.log("→ Generating PNG portal logo for Organization schema:");
  const portalLogoSvg = resolve(
    repoRoot,
    "artifacts/qb-portal/public/images/logo-original.svg",
  );
  const portalLogoPng = resolve(
    repoRoot,
    "artifacts/qb-portal/public/images/logo-original.png",
  );
  if (existsSync(portalLogoSvg)) {
    await convertSvgLogoToPng(portalLogoSvg, portalLogoPng, 512);
  } else {
    console.warn(`  ! Skipping missing source: ${portalLogoSvg}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Conversion failed:", err);
  process.exit(1);
});
