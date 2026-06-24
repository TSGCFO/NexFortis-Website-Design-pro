import { test } from "node:test";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Guards that the generated geo route block in App.tsx is in sync with the
// geo-links.ts registry. If this fails, run: node artifacts/nexfortis/scripts/gen-geo-routes.mjs
const here = dirname(fileURLToPath(import.meta.url));
const script = join(here, "..", "..", "artifacts", "nexfortis", "scripts", "gen-geo-routes.mjs");

test("App.tsx geo routes are in sync with geo-links.ts (gen-geo-routes.mjs --check)", () => {
  // execFileSync throws if the script exits non-zero (drift detected).
  execFileSync(process.execPath, [script, "--check"], { stdio: "pipe" });
});
