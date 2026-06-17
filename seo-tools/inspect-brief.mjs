// Print a structured summary of a saved KI content-brief JSON, without dumping
// the whole (large) payload. Usage: node seo-tools/inspect-brief.mjs <file.json>
import { readFileSync } from "node:fs";

const f = process.argv[2];
if (!f) {
  console.error("Usage: node seo-tools/inspect-brief.mjs <file.json>");
  process.exit(1);
}
const data = JSON.parse(readFileSync(f, "utf8"));
const p = data.payload ?? data;

function preview(v) {
  if (Array.isArray(v)) {
    const sample = v.length
      ? " e.g. " + JSON.stringify(v.slice(0, 3)).slice(0, 400)
      : "";
    return `Array(${v.length})${sample}`;
  }
  if (v && typeof v === "object") {
    return `Object{ ${Object.keys(v).slice(0, 20).join(", ")} }`;
  }
  return JSON.stringify(v);
}

console.log("=== payload keys ===");
for (const k of Object.keys(p)) console.log(`${k}: ${preview(p[k])}`);
