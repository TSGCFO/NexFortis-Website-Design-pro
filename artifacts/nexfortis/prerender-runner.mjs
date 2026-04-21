// DIAGNOSTIC wrapper — runs prerender.mjs as a subprocess, captures all
// stdout+stderr to dist/public/.diag/log.txt, then EXITS 0 regardless of
// the subprocess result. This guarantees the log file is published to the
// static site so we can fetch it from the preview URL and read the output
// Render's build log suppresses. Revert to non-diagnostic build once the
// failure cause is identified.
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(__dirname, "prerender.mjs");
const diagDir = path.join(__dirname, "dist", "public", ".diag");
const logFile = path.join(diagDir, "log.txt");
const statusFile = path.join(diagDir, "status.json");

console.log("==> [runner] spawning prerender.mjs");

await fs.mkdir(diagDir, { recursive: true });

const buf = [];
const t0 = Date.now();
const child = spawn(process.execPath, [script], {
  cwd: __dirname,
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
});

function cap(stream) {
  stream.setEncoding("utf-8");
  stream.on("data", (c) => {
    buf.push(c);
    process.stdout.write(c);
  });
}
cap(child.stdout);
cap(child.stderr);

await new Promise((resolve) => {
  child.on("close", resolve);
  child.on("error", (e) => {
    buf.push(`\n[runner] spawn error: ${e?.stack || e}\n`);
    resolve();
  });
});

const durationMs = Date.now() - t0;
const code = child.exitCode;
const signal = child.signalCode;
const output = buf.join("");

await fs.writeFile(logFile, output, "utf-8");
await fs.writeFile(
  statusFile,
  JSON.stringify(
    {
      exitCode: code,
      signal,
      durationMs,
      outputBytes: output.length,
      timestamp: new Date().toISOString(),
      node: process.version,
    },
    null,
    2,
  ),
  "utf-8",
);

console.log(`==> [runner] prerender exited code=${code} signal=${signal || "(none)"} duration=${durationMs}ms`);
console.log(`==> [runner] wrote ${output.length} bytes to ${path.relative(path.join(__dirname, "dist", "public"), logFile)}`);
console.log(`==> [runner] DIAGNOSTIC MODE: exiting 0 regardless of prerender result so log.txt is published`);
console.log(`==> [runner] fetch the log from: <preview-url>/.diag/log.txt`);

// ALWAYS exit 0 so the static site builds and publishes .diag/log.txt
process.exit(0);
