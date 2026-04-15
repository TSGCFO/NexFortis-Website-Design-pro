import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "../..");

console.log("=== Task Compliance Check ===\n");

let errors = [];
let warnings = [];
function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

const EXPECTED_SCOPE_DIRS = [
  "artifacts/qb-portal/",
  "scripts/",
];

const PROTECTED_DIRS = [
  "docs/",
  "artifacts/nexfortis/",
  "lib/",
];

let lastMergeCommit;
try {
  lastMergeCommit = execSync("git log --oneline -1 --format='%H %s'", {
    cwd: PROJECT_ROOT,
    encoding: "utf-8",
  }).trim();
} catch (e) {
  fail(`Cannot read git log: ${e.message}`);
  finish();
}

console.log(`Last commit: ${lastMergeCommit}\n`);

let changedFiles;
try {
  changedFiles = execSync("git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only HEAD", {
    cwd: PROJECT_ROOT,
    encoding: "utf-8",
  }).trim().split("\n").filter(Boolean);
} catch (e) {
  warn(`Cannot determine changed files: ${e.message}`);
  changedFiles = [];
}

if (changedFiles.length === 0) {
  console.log("No changed files detected in the last commit.\n");
} else {
  console.log(`Changed files (${changedFiles.length}):`);
  for (const f of changedFiles) {
    console.log(`  ${f}`);
  }
  console.log("");

  const outOfScope = changedFiles.filter((f) => {
    return PROTECTED_DIRS.some((d) => f.startsWith(d));
  });

  if (outOfScope.length > 0) {
    console.log("⚠ Files changed in protected directories:");
    for (const f of outOfScope) {
      warn(`Changed file in protected directory: ${f}`);
      console.log(`  ${f}`);
    }
    console.log("");
  }
}

console.log("--- Running sub-checks ---\n");

let subCheckFailed = false;

try {
  console.log("[1/2] TypeCheck...");
  execSync("pnpm --filter @workspace/qb-portal typecheck", {
    cwd: PROJECT_ROOT,
    encoding: "utf-8",
    stdio: "pipe",
  });
  console.log("  ✓ TypeCheck passed\n");
} catch (e) {
  fail("TypeCheck failed after merge — possible regression");
  console.log("  ✗ TypeCheck FAILED\n");
  if (e.stdout) console.log(e.stdout.substring(0, 500));
  subCheckFailed = true;
}

try {
  console.log("[2/2] Product Integrity...");
  execSync(`node ${resolve(__dirname, "product-integrity.mjs")}`, {
    cwd: PROJECT_ROOT,
    encoding: "utf-8",
    stdio: "pipe",
  });
  console.log("  ✓ Product integrity passed\n");
} catch (e) {
  fail("Product integrity failed after merge — possible regression");
  console.log("  ✗ Product integrity FAILED\n");
  if (e.stdout) console.log(e.stdout.substring(0, 500));
  subCheckFailed = true;
}

finish();

function finish() {
  console.log("--- Summary ---\n");

  if (warnings.length > 0) {
    console.log("Warnings:");
    warnings.forEach((w) => console.log(`  WARN: ${w}`));
    console.log("");
  }

  if (errors.length > 0) {
    console.log("Errors:");
    errors.forEach((e) => console.log(`  ERROR: ${e}`));
    console.log(`\n✗ Task compliance check FAILED (${errors.length} error(s), ${warnings.length} warning(s))`);
    process.exit(1);
  }

  console.log(`✓ Task compliance check passed — ${changedFiles ? changedFiles.length : 0} files reviewed, ${warnings.length} warning(s)`);
  process.exit(0);
}
