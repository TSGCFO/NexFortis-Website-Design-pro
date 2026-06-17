// Dependency-free reader for an *extracted* .xlsx directory.
// First extract the workbook with the system tar:
//   tar -xf book.xlsx -C <dir>
// Then:
//   node seo-tools/read-xlsx.mjs <dir> [sheetN=1]
// Prints each row as a JSON array. Good enough for small KI cluster exports;
// not a general-purpose xlsx parser.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
const sheetN = Number(process.argv[3] || 1);
if (!dir) {
  console.error("Usage: node seo-tools/read-xlsx.mjs <extracted-xlsx-dir> [sheetN=1]");
  process.exit(1);
}

function decode(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}
function read(p) {
  try {
    return readFileSync(join(dir, p), "utf8");
  } catch {
    return "";
  }
}
function colToIdx(ref) {
  const c = ref.match(/^[A-Z]+/)[0];
  let n = 0;
  for (const ch of c) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

// Shared strings (ordered). Each <si> may hold multiple <t> runs.
const shared = [];
{
  const xml = read("xl/sharedStrings.xml");
  for (const m of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    const ts = [...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => decode(x[1]));
    shared.push(ts.join(""));
  }
}

const sheetXml = read(`xl/worksheets/sheet${sheetN}.xml`);
for (const rowM of sheetXml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
  const cells = [];
  for (const c of rowM[1].matchAll(
    /<c r="([A-Z]+\d+)"(?:[^>]*?\st="([^"]+)")?[^>]*>([\s\S]*?)<\/c>/g,
  )) {
    const idx = colToIdx(c[1]);
    const type = c[2];
    const v = c[3].match(/<v>([\s\S]*?)<\/v>/);
    const inline = c[3].match(/<t[^>]*>([\s\S]*?)<\/t>/);
    let val = "";
    if (type === "s" && v) val = shared[Number(v[1])] ?? "";
    else if (type === "inlineStr" && inline) val = decode(inline[1]);
    else if (v) val = v[1];
    cells[idx] = val;
  }
  console.log(JSON.stringify(Array.from(cells, (x) => x ?? "")));
}
