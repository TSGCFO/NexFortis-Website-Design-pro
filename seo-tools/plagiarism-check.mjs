// Gate-3 PLAGIARISM check via the Winston AI Plagiarism API (v2).
// Verified spec: https://docs.gowinston.ai/api-reference/v2/plagiarism/post
//   POST https://api.gowinston.ai/v2/plagiarism
//   headers: Authorization: Bearer <key>, Content-Type: application/json
//   body:    { text (100-120000 chars), language:"en", country:"ca", excluded_sources:[...] }
//   200 ->   { result:{ score, ... }, sources:[{url,score,plagiarismWords,...}],
//             credits_used, credits_remaining }
//   COST: 2 credits per word (a ~1,500-word page ≈ 3,000 credits).
//
// Reads each page's prose from seo-tools/tmp/detect/<slug>.txt (the SAME files the
// Undetectable AI detector uses). Writes seo-tools/tmp/plagiarism-results.json.
//
//   node seo-tools/plagiarism-check.mjs auth          # cheap key/connectivity check
//   node seo-tools/plagiarism-check.mjs scan          # scan every tmp/detect/<slug>.txt
//   node seo-tools/plagiarism-check.mjs scan <slug>   # scan one page
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { secret } from "./_secrets.mjs";

const KEY = secret("WINSTON_AI_API_KEY");
const BASE = "https://api.gowinston.ai";
const DIR = "seo-tools/tmp/detect";
const EXCLUDE = ["nexfortis.com"]; // don't count our own (future) page against us
const REVIEW_THRESHOLD = 15; // score >= this -> flag for human review

async function scanText(text) {
  const res = await fetch(`${BASE}/v2/plagiarism`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ text, language: "en", country: "ca", excluded_sources: EXCLUDE }),
  });
  let json;
  try { json = await res.json(); } catch { json = { raw: (await res.text()).slice(0, 400) }; }
  return { status: res.status, json };
}

async function auth() {
  // Minimal scan (>=100 chars required) to validate the key + read the balance.
  const probe =
    "This is a short connectivity and authentication probe used to verify the Winston AI plagiarism API key works.";
  const { status, json } = await scanText(probe);
  if (status === 200) {
    console.log("Winston AI auth OK.");
    console.log(`  probe plagiarism score: ${json?.result?.score}%`);
    console.log(`  credits used: ${json?.credits_used}   credits remaining: ${json?.credits_remaining}`);
  } else if (status === 401 || status === 403) {
    console.error(`Winston AI auth FAILED (HTTP ${status}) — check WINSTON_AI_API_KEY.`);
    process.exit(1);
  } else if (status === 402) {
    console.error("Winston AI: insufficient credits (HTTP 402). Top up at dev.gowinston.ai.");
    process.exit(1);
  } else {
    console.error(`Winston AI returned HTTP ${status}: ${JSON.stringify(json).slice(0, 300)}`);
    process.exit(1);
  }
}

async function scan(onlySlug) {
  if (!existsSync(DIR)) {
    console.error(`No ${DIR}/ — extract each page's prose to ${DIR}/<slug>.txt first.`);
    process.exit(1);
  }
  const files = readdirSync(DIR)
    .filter((f) => f.endsWith(".txt") && (!onlySlug || f === `${onlySlug}.txt`))
    .sort();
  if (!files.length) { console.error("No matching .txt files in " + DIR); process.exit(1); }
  const results = [];
  for (const f of files) {
    const slug = f.replace(/\.txt$/, "");
    const text = readFileSync(`${DIR}/${f}`, "utf8").trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const { status, json } = await scanText(text);
    if (status !== 200) {
      console.log(`${slug.padEnd(30)} ERROR HTTP ${status}`);
      results.push({ slug, words, error: status, body: json });
      if (status === 402) { console.error("Out of credits — stopping."); break; }
      continue;
    }
    const score = json?.result?.score ?? null;
    const sources = (json?.sources ?? []).map((s) => ({ url: s.url, score: s.score, plagiarismWords: s.plagiarismWords }));
    const flag = score != null && score >= REVIEW_THRESHOLD ? "REVIEW" : "ok";
    results.push({ slug, words, score, sources, credits_remaining: json?.credits_remaining, flag });
    console.log(
      `${slug.padEnd(30)} score=${String(score).padStart(5)}%  sources=${String(sources.length).padStart(3)}  -> ${flag}   (credits left: ${json?.credits_remaining})`,
    );
  }
  writeFileSync("seo-tools/tmp/plagiarism-results.json", JSON.stringify(results, null, 2));
  const flagged = results.filter((r) => r.score != null && r.score >= REVIEW_THRESHOLD);
  console.log(`\n${results.length} page(s) scanned. REVIEW (score>=${REVIEW_THRESHOLD}%): ${flagged.length ? flagged.map((r) => r.slug).join(", ") : "none"}`);
  console.log("Saved seo-tools/tmp/plagiarism-results.json");
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === "auth") await auth();
else if (cmd === "scan") await scan(arg);
else console.log("Usage:\n  node seo-tools/plagiarism-check.mjs auth\n  node seo-tools/plagiarism-check.mjs scan [slug]");
