// Gate-3 AI-detection for the digital-marketing spokes via the Undetectable.AI
// Detector API (https://help.undetectable.ai/en/article/detector-api-1cf74il/).
//
// Reads the per-page prose extracted to seo-tools/tmp/detect/<slug>.txt, submits
// each to POST /detect, polls POST /query until done, and reports the main
// "result" AI score (1-100: <50 human, 50-60 possible AI, >60 AI) plus the
// per-third-party-detector breakdown. Writes seo-tools/tmp/undetectable-results.json.
//
// Usage: node seo-tools/undetectable-detect.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { secret } from "./_secrets.mjs";

const KEY = secret("UNDETECTABLE_AI_API_KEY");
const BASE = "https://ai-detect.undetectable.ai";
const DIR = "seo-tools/tmp/detect";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function checkCredits() {
  const r = await fetch(`${BASE}/check-user-credits`, {
    headers: { apikey: KEY, accept: "application/json" },
  });
  return r.ok ? await r.json() : { error: r.status, body: await r.text() };
}

async function submit(text) {
  const r = await fetch(`${BASE}/detect`, {
    method: "POST",
    headers: { accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ text, key: KEY, model: "xlm_ud_detector", retry_count: 0 }),
  });
  if (!r.ok) throw new Error(`detect HTTP ${r.status}: ${await r.text()}`);
  return await r.json();
}

async function query(id) {
  const r = await fetch(`${BASE}/query`, {
    method: "POST",
    headers: { accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!r.ok) throw new Error(`query HTTP ${r.status}: ${await r.text()}`);
  return await r.json();
}

function verdict(score) {
  if (score == null) return "?";
  if (score < 50) return "HUMAN";
  if (score <= 60) return "POSSIBLE-AI";
  return "AI";
}

async function run() {
  console.log("credits:", JSON.stringify(await checkCredits()));
  const files = readdirSync(DIR).filter((f) => f.endsWith(".txt")).sort();
  const results = [];
  for (const f of files) {
    const slug = f.replace(/\.txt$/, "");
    const text = readFileSync(`${DIR}/${f}`, "utf8");
    const words = text.split(/\s+/).filter(Boolean).length;
    let res;
    try {
      const sub = await submit(text);
      res = sub;
      let tries = 0;
      while (res.status !== "done" && res.status !== "failed" && tries < 40) {
        await sleep(2000);
        res = await query(sub.id);
        tries++;
      }
    } catch (e) {
      console.log(`${slug.padEnd(32)} ERROR: ${e.message}`);
      results.push({ slug, words, error: e.message });
      continue;
    }
    const d = res.result_details || {};
    results.push({ slug, words, aiScore: res.result, human: d.human, status: res.status, details: d });
    console.log(
      `${slug.padEnd(32)} AI=${String(res.result).padStart(6)}  human%=${String(d.human).padStart(5)}  -> ${verdict(res.result)}`,
    );
    await sleep(400);
  }
  writeFileSync("seo-tools/tmp/undetectable-results.json", JSON.stringify(results, null, 2));
  const flagged = results.filter((r) => r.aiScore != null && r.aiScore >= 50);
  console.log(`\n${results.length} pages checked. Flagged (AI>=50): ${flagged.length ? flagged.map((r) => r.slug).join(", ") : "none"}`);
  console.log("Saved seo-tools/tmp/undetectable-results.json");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
