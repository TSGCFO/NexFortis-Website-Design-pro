import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pixelWidth } from "./pixel-width.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(
  fs.readFileSync(path.join(here, "..", "fixtures", "seobility-pixel-widths.json"), "utf8"),
);

for (const row of fixture.rows) {
  test(`pixelWidth(${row.kind}) — ${row.text.slice(0, 40)}…`, () => {
    const got = pixelWidth(row.text, row.kind);
    const diff = Math.abs(got - row.expected_px);
    assert.ok(
      diff <= row.tolerance_px,
      `expected ~${row.expected_px} (±${row.tolerance_px}), got ${got} (diff ${diff})`,
    );
  });
}

test("pixelWidth — empty string is 0", () => {
  assert.equal(pixelWidth("", "title"), 0);
});

test("pixelWidth — unknown kind throws", () => {
  assert.throws(() => pixelWidth("x", "headline"));
});
