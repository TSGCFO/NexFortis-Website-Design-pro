// Diagnostic wrapper that spawns prerender.mjs, captures all stdout+stderr,
// and re-emits everything with banners on failure — so Render's static-site
// builder cannot silently swallow the output.
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(__dirname, "prerender.mjs");

console.log("==> [runner] spawning prerender.mjs");
console.log(`==> [runner] node=${process.version} cwd=${process.cwd()}`);

const buf = [];
const child = spawn(process.execPath, [script], {
  cwd: __dirname,
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
});

function capture(stream, label) {
  stream.setEncoding("utf-8");
  stream.on("data", (chunk) => {
    buf.push(chunk);
    // forward live for the (unlikely) case Render shows it
    process.stdout.write(chunk);
  });
}
capture(child.stdout, "out");
capture(child.stderr, "err");

child.on("close", (code, signal) => {
  const joined = buf.join("");
  console.log("");
  console.log("==============================================================");
  console.log(`==> [runner] prerender.mjs exited code=${code} signal=${signal || "(none)"}`);
  console.log(`==> [runner] captured ${joined.length} bytes of combined stdout/stderr`);
  console.log("==============================================================");
  console.log("==> [runner] BEGIN PRERENDER OUTPUT");
  console.log("==============================================================");
  // Re-emit in one contiguous block so Render can't miss it
  process.stdout.write(joined);
  if (!joined.endsWith("\n")) process.stdout.write("\n");
  console.log("==============================================================");
  console.log("==> [runner] END PRERENDER OUTPUT");
  console.log("==============================================================");
  if (code !== 0) process.exit(code || 1);
});

child.on("error", (err) => {
  console.error("==> [runner] spawn error:", err?.stack || err);
  process.exit(1);
});
