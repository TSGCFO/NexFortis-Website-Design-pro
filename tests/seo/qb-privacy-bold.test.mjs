import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";

test("qb privacy has no duplicate or over-long <strong>/<b>", () => {
  const $ = cheerio.load(readFileSync("artifacts/qb-portal/dist/public/privacy/index.html", "utf8"));
  const items = $("strong,b").map((_, el) => $(el).text().trim()).get();
  for (const t of items) assert.ok(t.length <= 70, `over-long bold: "${t}"`);
  const seen = new Set();
  for (const t of items) {
    assert.ok(!seen.has(t), `duplicate bold: "${t}"`);
    seen.add(t);
  }
});
