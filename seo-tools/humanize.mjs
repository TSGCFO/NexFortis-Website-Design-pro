#!/usr/bin/env node
// Run-book Step 6c — Humanize via the Undetectable.ai Humanizer API.
// https://help.undetectable.ai/en/article/humanization-api-v2-p28b2n/
//   POST https://humanize.undetectable.ai/submit  (header apikey)
//        body { content, readability, purpose, strength, model }
//   POST https://humanize.undetectable.ai/document { id }  -> poll until .output
//
// Input : a JSON file { "items": [ { "id": "...", "text": "..." }, ... ] }
//   node seo-tools/humanize.mjs <input.json> <output.json>
// Output: { "<id>": "<humanized text>", ... }  (also prints before/after AI scores
//   via the detector so you can confirm the humanize step worked).
import { readFileSync, writeFileSync } from "node:fs";
import { secret } from "./_secrets.mjs";

const KEY = secret("UNDETECTABLE_AI_API_KEY");
const HBASE = "https://humanize.undetectable.ai";
const DBASE = "https://ai-detect.undetectable.ai";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function submit(content) {
  const r = await fetch(`${HBASE}/submit`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      content,
      readability: "High School",
      purpose: "General Writing",
      strength: "More Human",
      model: "v11",
    }),
  });
  const j = await r.json();
  return j.id || j.document_id || null;
}

async function poll(id, maxTries = 40) {
  for (let i = 0; i < maxTries; i++) {
    await sleep(6000);
    const r = await fetch(`${HBASE}/document`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const d = await r.json();
    if (d.output) return d.output;
  }
  return null;
}

async function aiScore(text) {
  const sub = await (
    await fetch(`${DBASE}/detect`, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ text, key: KEY, model: "xlm_ud_detector", retry_count: 0 }),
    })
  ).json();
  let res = sub;
  let t = 0;
  while (res.status !== "done" && res.status !== "failed" && t < 40) {
    await sleep(2000);
    res = await (
      await fetch(`${DBASE}/query`, {
        method: "POST",
        headers: { accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ id: sub.id }),
      })
    ).json();
    t++;
  }
  return res.result;
}

const [inPath, outPath] = process.argv.slice(2);
if (!inPath || !outPath) {
  console.error("Usage: node seo-tools/humanize.mjs <input.json> <output.json>");
  process.exit(1);
}
const items = JSON.parse(readFileSync(inPath, "utf8")).items;
const out = {};
for (const it of items) {
  const before = await aiScore(it.text);
  const id = await submit(it.text);
  if (!id) { console.log(`${it.id}: submit failed`); continue; }
  const humanized = await poll(id);
  if (!humanized) { console.log(`${it.id}: humanize timed out`); continue; }
  const after = await aiScore(humanized);
  out[it.id] = humanized;
  console.log(`${it.id.padEnd(16)} AI ${String(before).padStart(6)} -> ${String(after).padStart(6)}`);
}
writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Saved -> ${outPath}`);
