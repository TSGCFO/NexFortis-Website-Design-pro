import { execSync } from "child_process";
import { resolve, dirname, join } from "path";
import { readFileSync, readdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "../..");

console.log("=== Task Compliance Check ===\n");

let errors = [];
let warnings = [];
function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

const ALLOWED_SCOPE_DIRS = [
  "artifacts/qb-portal/",
  "scripts/",
  ".local/",
  "replit.md",
  ".replit",
  "pnpm-lock.yaml",
];

const PROTECTED_DIRS = [
  "docs/",
  "artifacts/nexfortis/",
  "lib/",
];

function findLatestCommit() {
  try {
    const hash = execSync(
      "git log --oneline -1 --format='%H'",
      { cwd: PROJECT_ROOT, encoding: "utf-8" }
    ).trim();
    const parentCount = execSync(
      `git cat-file -p ${hash} | grep -c '^parent' || true`,
      { cwd: PROJECT_ROOT, encoding: "utf-8" }
    ).trim();
    return { hash, isMerge: parseInt(parentCount, 10) > 1 };
  } catch (e) {
    fail(`Cannot read git log: ${e.message}`);
    finish();
  }
}

const commit = findLatestCommit();
const commitSubject = execSync(
  `git log --oneline -1 --format='%s' ${commit.hash}`,
  { cwd: PROJECT_ROOT, encoding: "utf-8" }
).trim();

console.log(`Analyzing commit: ${commit.hash.substring(0, 8)} ${commitSubject}`);
console.log(`Commit type: ${commit.isMerge ? "merge" : "regular"}\n`);

let changedFiles = [];
try {
  const diffCmd = commit.isMerge
    ? `git diff --name-only ${commit.hash}^1 ${commit.hash}`
    : `git diff --name-only HEAD~1 HEAD`;
  changedFiles = execSync(diffCmd, {
    cwd: PROJECT_ROOT,
    encoding: "utf-8",
  }).trim().split("\n").filter(Boolean);
} catch {
  try {
    changedFiles = execSync("git diff --name-only HEAD", {
      cwd: PROJECT_ROOT,
      encoding: "utf-8",
    }).trim().split("\n").filter(Boolean);
  } catch (e) {
    warn(`Cannot determine changed files: ${e.message}`);
  }
}

if (changedFiles.length === 0) {
  console.log("No changed files detected.\n");
} else {
  console.log(`Changed files (${changedFiles.length}):`);
  for (const f of changedFiles) {
    console.log(`  ${f}`);
  }
  console.log("");

  console.log("--- Scope Analysis ---\n");

  const protectedViolations = changedFiles.filter((f) =>
    PROTECTED_DIRS.some((d) => f.startsWith(d))
  );

  const outOfScope = changedFiles.filter((f) => {
    const inAllowedScope = ALLOWED_SCOPE_DIRS.some((d) => {
      if (d.endsWith("/")) return f.startsWith(d);
      return f === d;
    });
    return !inAllowedScope;
  });

  if (protectedViolations.length > 0) {
    for (const f of protectedViolations) {
      fail(`PROTECTED directory modified: ${f}`);
    }
    console.log(`✗ ${protectedViolations.length} file(s) changed in protected directories\n`);
  }

  if (outOfScope.length > 0) {
    for (const f of outOfScope) {
      if (!protectedViolations.includes(f)) {
        warn(`File outside expected scope: ${f}`);
      }
    }
    if (outOfScope.length > protectedViolations.length) {
      console.log(`⚠ ${outOfScope.length - protectedViolations.length} file(s) outside expected scope (not in ${ALLOWED_SCOPE_DIRS.join(", ")})\n`);
    }
  }

  const inScope = changedFiles.filter((f) =>
    ALLOWED_SCOPE_DIRS.some((d) => d.endsWith("/") ? f.startsWith(d) : f === d)
  );
  console.log(`  In scope: ${inScope.length}/${changedFiles.length} files`);
  console.log(`  Out of scope: ${outOfScope.length}/${changedFiles.length} files`);
  console.log(`  Protected violations: ${protectedViolations.length}/${changedFiles.length} files`);
  console.log("");
}

let taskDescription = null;
try {
  const tasksDir = join(PROJECT_ROOT, ".local/tasks");
  if (existsSync(tasksDir)) {
    const taskFiles = readdirSync(tasksDir)
      .filter((f) => f.startsWith("task-") && f.endsWith(".md"))
      .sort()
      .reverse();

    if (taskFiles.length > 0) {
      const latestTaskFile = join(tasksDir, taskFiles[0]);
      taskDescription = readFileSync(latestTaskFile, "utf-8");
      const titleMatch = taskDescription.match(/^title:\s*(.+)$/m);
      if (titleMatch) {
        console.log(`Latest task: ${titleMatch[1]}\n`);
      }
    }
  }
} catch {}

console.log("--- Running sub-checks ---\n");

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

  console.log(`✓ Task compliance check passed — ${changedFiles.length} files reviewed, ${warnings.length} warning(s)`);
  process.exit(0);
}
