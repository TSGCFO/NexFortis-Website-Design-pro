#!/usr/bin/env node
// DataForSEO API helper (HTTP Basic auth: login + API password).
// Canada = location_code 2124. Base: https://api.dataforseo.com
//
//   node seo-tools/dataforseo.mjs auth
//   node seo-tools/dataforseo.mjs keywords "kw1,kw2,..." [location_code=2124] [language_code=en]
import { secret } from "./_secrets.mjs";

const BASE = "https://api.dataforseo.com";

function authHeader() {
  const token = Buffer.from(
    `${secret("DATAFORSEO_LOGIN")}:${secret("DATAFORSEO_PASSWORD")}`,
  ).toString("base64");
  return `Basic ${token}`;
}

async function request(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

// /v3/appendix/user_data is FREE — returns account login + balance. Auth check.
async function auth() {
  const { status, json } = await request("GET", "/v3/appendix/user_data");
  const task = json?.tasks?.[0];
  if (status === 200 && task?.status_code === 20000) {
    const r = task.result?.[0] ?? {};
    console.log("DataForSEO auth OK.");
    console.log(`  login:        ${r?.login ?? "(unknown)"}`);
    console.log(`  balance USD:  ${r?.money?.balance ?? "(unknown)"}`);
  } else {
    console.error(
      `DataForSEO auth FAILED (HTTP ${status}). ${task?.status_message ?? JSON.stringify(json).slice(0, 300)}`,
    );
    process.exit(1);
  }
}

async function keywords(list, locationCode = 2124, languageCode = "en") {
  const kws = (list ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (kws.length === 0) {
    console.error('Provide a comma-separated keyword list, e.g. "local seo,local seo services"');
    process.exit(1);
  }
  const payload = [
    { keywords: kws, location_code: Number(locationCode), language_code: languageCode },
  ];
  const vol = await request("POST", "/v3/keywords_data/google_ads/search_volume/live", payload);
  const kdi = await request("POST", "/v3/dataforseo_labs/google/bulk_keyword_difficulty/live", payload);

  const volRows = vol.json?.tasks?.[0]?.result ?? [];
  const kdiItems = kdi.json?.tasks?.[0]?.result?.[0]?.items ?? [];
  const kdByKw = new Map(kdiItems.map((i) => [i.keyword, i.keyword_difficulty]));

  const out = volRows.map((r) => ({
    keyword: r.keyword,
    volume: r.search_volume,
    cpc: r.cpc,
    competition: r.competition,
    difficulty: kdByKw.get(r.keyword) ?? null,
  }));
  console.log(JSON.stringify(out, null, 2));
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === "auth") await auth();
else if (cmd === "keywords") await keywords(args[0], args[1], args[2]);
else
  console.log(
    'Usage:\n  node seo-tools/dataforseo.mjs auth\n  node seo-tools/dataforseo.mjs keywords "kw1,kw2" [location_code=2124] [language_code=en]',
  );
