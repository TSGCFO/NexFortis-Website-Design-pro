#!/usr/bin/env node
// Keyword Insights API helper (X-API-Key auth: kwi_sk_...).
// Base: https://api.keywordinsights.ai
//
//   node seo-tools/keyword-insights.mjs auth
//   node seo-tools/keyword-insights.mjs brief "<keyword>" "<location>" "<folder_id>"
//   node seo-tools/keyword-insights.mjs get-brief "<order_id>"
//
// NOTE: KI is known to silently flip location "Canada" -> "United States".
// brief() echoes what we send; get-brief() prints the result so we can verify
// the location the brief was actually built for before trusting it.
import { secret } from "./_secrets.mjs";
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "https://api.keywordinsights.ai";

function buildHeaders(hasBody) {
  const h = { "X-API-Key": secret("KEYWORD_INSIGHTS_API_KEY") };
  // Only send Content-Type when there's actually a JSON body — sending it on a
  // bodyless GET makes some WSGI servers/proxies reject the request with a 400.
  if (hasBody) h["Content-Type"] = "application/json";
  return h;
}

async function request(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: buildHeaders(Boolean(body)),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 500) };
  }
  return { status: res.status, json };
}

// FREE: listing briefs validates the key without creating an order / spending credits.
async function auth() {
  const { status, json } = await request("GET", "/api/content-brief/orders/?page=1&page_size=1");
  if (status === 200) {
    console.log("Keyword Insights auth OK (API key valid).");
  } else if (status === 401 || status === 403) {
    console.error(`Keyword Insights auth FAILED (HTTP ${status}) — check the API key (kwi_sk_...).`);
    process.exit(1);
  } else {
    console.error(`Keyword Insights auth returned HTTP ${status}: ${JSON.stringify(json).slice(0, 300)}`);
    process.exit(1);
  }
}

// Costs ~500 credits. Requires a paid KI subscription + a folder_id (from the app URL).
async function brief(keyword, location, folderId) {
  if (!keyword || !location) {
    console.error('Usage: brief "<keyword>" "<location e.g. Canada>" [folder_id]');
    process.exit(1);
  }
  const fid = folderId || secret("KEYWORD_INSIGHTS_FOLDER_ID", { required: false });
  const body = { keyword, language: "en", location };
  if (fid) body.folder_id = fid;
  const { status, json } = await request("POST", "/api/content-brief/order/", body);
  console.log(
    `HTTP ${status} — location: "${location}" folder_id: ${fid || "(none / workspace default)"}`,
  );
  console.log(JSON.stringify(json, null, 2));
}

async function getBrief(id) {
  if (!id) {
    console.error("Usage: get-brief <order_id>");
    process.exit(1);
  }
  const { status, json } = await request("GET", `/api/content-brief/order/?id=${encodeURIComponent(id)}`);
  console.log(`HTTP ${status}`);
  console.log(JSON.stringify(json, null, 2));
}

// Clustering: POST /api/keywords-insights/order/ — groups keywords by SERP
// overlap. Needs keywords[] + parallel search_volumes[]. Async — poll with
// cluster-status. Verified against docs: api/api-use-cases/public-api-clustering.
async function cluster(payloadPath) {
  if (!payloadPath) {
    console.error("Usage: cluster <payload.json>");
    process.exit(1);
  }
  const payload = JSON.parse(readFileSync(payloadPath, "utf8"));
  if (!payload.folder_id) {
    const fid = secret("KEYWORD_INSIGHTS_FOLDER_ID", { required: false });
    if (fid) payload.folder_id = fid;
  }
  const { status, json } = await request("POST", "/api/keywords-insights/order/", payload);
  console.log(
    `HTTP ${status} — location: "${payload.location ?? "(none)"}" folder_id: ${payload.folder_id || "(none / workspace default)"}`,
  );
  console.log(JSON.stringify(json, null, 2));
}

// Poll a clustering order. NOTE: clustering uses ?order_id= (content briefs use
// ?id=) — different param names, verified from docs.
async function clusterStatus(orderId) {
  if (!orderId) {
    console.error("Usage: cluster-status <order_id>");
    process.exit(1);
  }
  const { status, json } = await request(
    "GET",
    `/api/keywords-insights/order/?order_id=${encodeURIComponent(orderId)}`,
  );
  console.log(`HTTP ${status}`);
  console.log(JSON.stringify(json, null, 2));
}

// Download the clustering result as xlsx (the only machine-readable export KI
// offers for clustering). Uses its own fetch (binary, not the JSON helper).
async function downloadXlsx(orderId, outfile) {
  if (!orderId || !outfile) {
    console.error("Usage: download-xlsx <order_id> <outfile>");
    process.exit(1);
  }
  const res = await fetch(
    `${BASE}/api/keywords-insights/order/xlsx/${encodeURIComponent(orderId)}/`,
    { headers: { "X-API-Key": secret("KEYWORD_INSIGHTS_API_KEY") } },
  );
  if (res.status !== 200) {
    console.error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outfile, buf);
  console.log(`Saved ${buf.length} bytes -> ${outfile}`);
}

// Poll a content brief every 12s until KI marks it completed, then save the
// full JSON and print a summary. The wait is in-process (not a shell sleep), so
// one call blocks until the brief is ready.
async function waitBrief(id, maxSeconds = 360) {
  if (!id) {
    console.error("Usage: wait-brief <order_id> [maxSeconds]");
    process.exit(1);
  }
  const deadline = Date.now() + maxSeconds * 1000;
  while (Date.now() < deadline) {
    const { json } = await request(
      "GET",
      `/api/content-brief/order/?id=${encodeURIComponent(id)}`,
    );
    const p = json?.payload ?? {};
    const ps = p.processing_status ?? {};
    const done = Object.values(ps).filter(Boolean).length;
    const total = Object.keys(ps).length;
    console.log(`completed=${ps.completed} (${done}/${total} jobs) location="${p.location}"`);
    if (ps.completed === true) {
      const out = `seo-tools/tmp/brief-${id}.json`;
      writeFileSync(out, JSON.stringify(json, null, 2));
      console.log(`DONE -> saved full brief to ${out}`);
      console.log(
        `  keyword="${p.keyword}" location="${p.location}" words avg/min/max=${p.word_count_avg}/${p.word_count_min}/${p.word_count_max} headings=${p.headings_count} pages=${p.pages_count}`,
      );
      return;
    }
    await new Promise((r) => setTimeout(r, 12000));
  }
  console.error(`Timed out after ${maxSeconds}s — brief still processing. Re-run wait-brief.`);
  process.exit(1);
}

// ---- AI Writer Agent: writes a full draft from a keyword ----
// POST /api/writer-agent/order/  -> create (returns order id)
// GET  /api/writer-agent/order/?id=  -> poll until payload.generated_article exists
// GET  /api/writer-agent/options/    -> available POV / content types / tones
// content_type: "article" (default) | "landing_page" (service/landing pages).
// Verified against docs: api/api-use-cases/public-api-writer-agent.
// Docs show two response shapes ({payload} vs {result:{payload}}) — unwrap handles both.
function unwrap(json) {
  return json?.result?.payload ?? json?.payload ?? json;
}

async function writerOptions() {
  const { status, json } = await request("GET", "/api/writer-agent/options/");
  console.log(`HTTP ${status}`);
  console.log(JSON.stringify(json, null, 2));
}

async function writer(keyword, location, contentType, insights) {
  if (!keyword || !location) {
    console.error('Usage: writer "<keyword>" "<location>" [article|landing_page] ["<additional_insights>"]');
    process.exit(1);
  }
  const fid = secret("KEYWORD_INSIGHTS_FOLDER_ID", { required: false });
  const body = {
    keyword,
    language_code: "en",
    location_name: location,
    content_type: contentType || "article",
    point_of_view: "Second Person (You)",
  };
  if (fid) body.folder_id = fid;
  if (insights) body.additional_insights = insights;
  const { status, json } = await request("POST", "/api/writer-agent/order/", body);
  const p = unwrap(json);
  console.log(
    `HTTP ${status} — content_type="${body.content_type}" location="${location}" folder_id=${fid || "(default)"} order_id=${p?.id ?? "(none)"}`,
  );
  console.log(JSON.stringify(json, null, 2));
}

async function waitWriter(id, maxSeconds = 900) {
  if (!id) {
    console.error("Usage: wait-writer <order_id> [maxSeconds]");
    process.exit(1);
  }
  const deadline = Date.now() + maxSeconds * 1000;
  while (Date.now() < deadline) {
    const { json } = await request("GET", `/api/writer-agent/order/?id=${encodeURIComponent(id)}`);
    const p = unwrap(json) ?? {};
    console.log(`status=${p.status ?? "processing"} stages=${JSON.stringify(p.processing_status ?? {})} hasArticle=${Boolean(p.generated_article)}`);
    if (p.generated_article) {
      const out = `seo-tools/tmp/ki-writer-${id}.md`;
      writeFileSync(out, p.generated_article);
      const words = p.generated_article.trim().split(/\s+/).filter(Boolean).length;
      console.log(`DONE -> ${out} (${p.generated_article.length} chars, ~${words} words) content_type=${p.content_type ?? "?"}`);
      return;
    }
    await new Promise((r) => setTimeout(r, 20000));
  }
  console.error(`Timed out after ${maxSeconds}s — still processing. Re-run: wait-writer ${id}`);
  process.exit(1);
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === "auth") await auth();
else if (cmd === "wait-brief") await waitBrief(args[0], Number(args[1] || 360));
else if (cmd === "download-xlsx") await downloadXlsx(args[0], args[1]);
else if (cmd === "cluster") await cluster(args[0]);
else if (cmd === "cluster-status") await clusterStatus(args[0]);
else if (cmd === "brief") await brief(args[0], args[1], args[2]);
else if (cmd === "get-brief") await getBrief(args[0]);
else if (cmd === "writer-options") await writerOptions();
else if (cmd === "writer") await writer(args[0], args[1], args[2], args[3]);
else if (cmd === "wait-writer") await waitWriter(args[0], Number(args[1] || 900));
else
  console.log(
    [
      "Usage:",
      "  node seo-tools/keyword-insights.mjs auth",
      "  node seo-tools/keyword-insights.mjs cluster <payload.json>",
      "  node seo-tools/keyword-insights.mjs cluster-status <order_id>",
      '  node seo-tools/keyword-insights.mjs brief "<keyword>" "Canada" "<folder_id>"',
      "  node seo-tools/keyword-insights.mjs get-brief <order_id>",
      "  node seo-tools/keyword-insights.mjs writer-options",
      '  node seo-tools/keyword-insights.mjs writer "<keyword>" "Canada" landing_page "<additional_insights>"',
      "  node seo-tools/keyword-insights.mjs wait-writer <order_id>",
    ].join("\n"),
  );
