#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/og");
mkdirSync(OUT_DIR, { recursive: true });

const CATEGORY_LABELS = {
  service: "Service",
  problem: "Troubleshooting",
  comparison: "Compare",
  educational: "Guide",
};

const pages = [
  { slug: "enterprise-to-premier-conversion", category: "service", headline: "QuickBooks Enterprise\nto Premier Conversion", tag: "Canadian editions supported" },
  { slug: "audit-trail-removal", category: "service", headline: "QuickBooks\nAudit Trail Removal", tag: "Clean audit log, preserved data" },
  { slug: "super-condense", category: "service", headline: "QuickBooks\nSuper Condense", tag: "Shrink oversized company files" },
  { slug: "file-repair", category: "service", headline: "QuickBooks\nFile Repair & Recovery", tag: "Rescue corrupted QBW files" },
  { slug: "accountedge-to-quickbooks", category: "service", headline: "AccountEdge to\nQuickBooks Migration", tag: "Full data conversion, Canadian" },
  { slug: "sage-50-to-quickbooks", category: "service", headline: "Sage 50 to\nQuickBooks Migration", tag: "Accurate conversion, Canadian" },
  { slug: "multi-currency-removal", category: "service", headline: "Multi-Currency\nRemoval Service", tag: "Reset MCU, preserve history" },
  { slug: "list-reduction", category: "service", headline: "QuickBooks\nList Reduction", tag: "Trim oversized name lists" },
  { slug: "qbo-readiness", category: "service", headline: "Desktop to Online\nReadiness Report", tag: "Know what will migrate cleanly" },

  { slug: "quickbooks-file-too-large", category: "problem", headline: "QuickBooks File\nToo Large?", tag: "How to shrink it fast" },
  { slug: "quickbooks-running-slow", category: "problem", headline: "QuickBooks\nRunning Slow?", tag: "Causes and proven fixes" },
  { slug: "quickbooks-company-file-error", category: "problem", headline: "Company File\nError Codes", tag: "Recover your QuickBooks data" },
  { slug: "quickbooks-multi-currency-problems", category: "problem", headline: "Multi-Currency\nProblems & Fix", tag: "Resolve MCU issues for good" },

  { slug: "etech-alternative", category: "comparison", headline: "A Modern\nE-Tech Alternative", tag: "For QuickBooks conversions" },
  { slug: "quickbooks-conversion-canada", category: "comparison", headline: "QuickBooks Conversion\nin Canada", tag: "Canadian-first service" },
  { slug: "affordable-enterprise-conversion", category: "comparison", headline: "Affordable Enterprise\nto Premier Conversion", tag: "Transparent, fixed pricing" },

  { slug: "how-conversion-works", category: "educational", headline: "How QuickBooks\nConversion Works", tag: "Step-by-step, plain English" },
  { slug: "is-it-safe", category: "educational", headline: "Is QuickBooks\nConversion Safe?", tag: "Security, process & safeguards" },
  { slug: "quickbooks-desktop-end-of-life", category: "educational", headline: "QuickBooks Desktop\nEnd of Life", tag: "What it means & what to do" },
  { slug: "quickbooks-support-subscription", category: "educational", headline: "QuickBooks Support\nSubscription", tag: "Predictable help, fixed cost" },
];

const NAVY = "#0A1628";
const NAVY_2 = "#0E1F3C";
const AZURE = "#0F92E3";
const ROSE = "#B76E79";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.72)";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.14)";

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderSvg({ headline, tag, category }) {
  const lines = headline.split("\n").map(escapeXml);
  const catLabel = escapeXml((CATEGORY_LABELS[category] || "").toUpperCase());
  const tagSafe = escapeXml(tag);

  // Headline: render each line as its own tspan with dy spacing
  const lineHeight = 96;
  const startY = 260;
  const headlineTspans = lines
    .map((ln, i) => `<tspan x="80" y="${startY + i * lineHeight}">${ln}</tspan>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="${NAVY_2}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${AZURE}"/>
      <stop offset="50%" stop-color="${ROSE}"/>
      <stop offset="100%" stop-color="${AZURE}"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="15%" r="55%">
      <stop offset="0%" stop-color="${AZURE}" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="${AZURE}" stop-opacity="0.0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="15%" cy="90%" r="45%">
      <stop offset="0%" stop-color="${ROSE}" stop-opacity="0.28"/>
      <stop offset="70%" stop-color="${ROSE}" stop-opacity="0.0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- accent bar top -->
  <rect x="0" y="0" width="1200" height="6" fill="url(#accent)"/>

  <!-- Wordmark + category pill -->
  <g font-family="Inter, 'Helvetica Neue', Arial, sans-serif">
    <text x="80" y="110" fill="${WHITE}" font-size="32" font-weight="800" letter-spacing="1.5">
      <tspan fill="${WHITE}">Nex</tspan><tspan fill="${ROSE}">Fortis</tspan>
    </text>
    <text x="80" y="138" fill="${MUTED}" font-size="16" letter-spacing="2">
      QUICKBOOKS SERVICES · CANADA
    </text>

    ${catLabel ? `
    <g>
      <rect x="1000" y="86" width="120" height="38" rx="19" fill="${CARD}" stroke="${BORDER}"/>
      <text x="1060" y="111" fill="${WHITE}" font-size="14" font-weight="700" text-anchor="middle" letter-spacing="2">${catLabel}</text>
    </g>` : ""}
  </g>

  <!-- Headline -->
  <g font-family="Inter, 'Helvetica Neue', Arial, sans-serif">
    <text fill="${WHITE}" font-size="80" font-weight="800" letter-spacing="-1.5">
      ${headlineTspans}
    </text>
  </g>

  <!-- Tagline / subhead -->
  <g font-family="Inter, 'Helvetica Neue', Arial, sans-serif">
    <rect x="80" y="495" width="6" height="40" fill="url(#accent)"/>
    <text x="104" y="525" fill="${MUTED}" font-size="28" font-weight="500">${tagSafe}</text>
  </g>

  <!-- Footer row -->
  <g font-family="Inter, 'Helvetica Neue', Arial, sans-serif">
    <text x="80" y="585" fill="${WHITE}" font-size="20" font-weight="700" letter-spacing="0.5">qb.nexfortis.com</text>
    <text x="1120" y="585" fill="${MUTED}" font-size="18" font-weight="500" text-anchor="end">Canadian editions · Fixed pricing</text>
  </g>

  <!-- Accent bar bottom -->
  <rect x="0" y="624" width="1200" height="6" fill="url(#accent)"/>
</svg>`;
}

async function main() {
  const manifest = [];
  for (const p of pages) {
    const svg = renderSvg(p);
    const jpgPath = resolve(OUT_DIR, `${p.slug}.jpg`);
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 88, progressive: true, mozjpeg: true })
      .toFile(jpgPath);
    manifest.push({ slug: p.slug, file: `/og/${p.slug}.jpg` });
    console.log(`  ✓ ${p.slug}.jpg`);
  }
  writeFileSync(
    resolve(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );
  console.log(`\nGenerated ${manifest.length} OG images → ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
