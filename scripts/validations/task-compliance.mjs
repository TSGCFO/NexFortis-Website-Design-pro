import { execSync } from "child_process";
import { resolve, dirname, join } from "path";
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
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
  "artifacts/api-server/",
  "lib/db/",
  "scripts/",
  ".local/",
  "replit.md",
  ".replit",
  ".env.example",
  "pnpm-lock.yaml",
];

const PROTECTED_DIRS = [
  "docs/",
  "artifacts/nexfortis/",
  "artifacts/mockup-sandbox/",
];

const SKIP_SUBJECTS = [
  /^Published your App$/,
  /^Merge branch/,
  /^Revert /,
];

function findLatestMeaningfulCommit() {
  try {
    const log = execSync(
      "git log --oneline -20 --format='%H|||%s'",
      { cwd: PROJECT_ROOT, encoding: "utf-8" }
    ).trim().split("\n");

    for (const line of log) {
      const [hash, ...subjectParts] = line.split("|||");
      const subject = subjectParts.join("|||");
      if (SKIP_SUBJECTS.some((re) => re.test(subject))) continue;

      const parentCount = execSync(
        `git cat-file -p ${hash} | grep -c '^parent' || true`,
        { cwd: PROJECT_ROOT, encoding: "utf-8" }
      ).trim();

      const diffCheck = execSync(
        parseInt(parentCount, 10) > 1
          ? `git diff --name-only ${hash}^1 ${hash}`
          : `git diff --name-only ${hash}~1 ${hash}`,
        { cwd: PROJECT_ROOT, encoding: "utf-8" }
      ).trim();

      if (diffCheck.length > 0) {
        return {
          hash,
          subject,
          isMerge: parseInt(parentCount, 10) > 1,
        };
      }
    }

    return null;
  } catch (e) {
    fail(`Cannot read git log: ${e.message}`);
    finish();
  }
}

const commit = findLatestMeaningfulCommit();

if (!commit) {
  console.log("No meaningful commit with changed files found in last 20 commits.\n");
} else {
  console.log(`Analyzing commit: ${commit.hash.substring(0, 8)} ${commit.subject}`);
  console.log(`Commit type: ${commit.isMerge ? "merge" : "regular"}\n`);
}

let changedFiles = [];
if (commit) {
  try {
    const diffCmd = commit.isMerge
      ? `git diff --name-only ${commit.hash}^1 ${commit.hash}`
      : `git diff --name-only ${commit.hash}~1 ${commit.hash}`;
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
      console.log(`⚠ ${outOfScope.length - protectedViolations.length} file(s) outside expected scope\n`);
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
let taskDerivedScope = [];
try {
  const tasksDir = join(PROJECT_ROOT, ".local/tasks");
  if (existsSync(tasksDir)) {
    const taskFiles = readdirSync(tasksDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => ({
        name: f,
        mtime: statSync(join(tasksDir, f)).mtimeMs,
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (taskFiles.length > 0) {
      const latestTaskFile = join(tasksDir, taskFiles[0].name);
      taskDescription = readFileSync(latestTaskFile, "utf-8");

      const titleMatch = taskDescription.match(/^#\s+(.+)$/m)
        || taskDescription.match(/^title:\s*(.+)$/m);
      if (titleMatch) {
        console.log(`Latest task: ${titleMatch[1]} (${taskFiles[0].name})`);
      }

      const relevantSection = taskDescription.match(/## Relevant files\s*\n([\s\S]*?)(?:\n##|$)/);
      if (relevantSection) {
        const fileLines = relevantSection[1].split("\n")
          .map((l) => l.replace(/^[-*]\s*/, "").replace(/`/g, "").trim())
          .filter(Boolean)
          .map((l) => l.split(":")[0].trim());

        for (const filePath of fileLines) {
          const dir = filePath.substring(0, filePath.lastIndexOf("/") + 1);
          if (dir && !taskDerivedScope.includes(dir)) {
            taskDerivedScope.push(dir);
          }
        }
      }

      if (taskDerivedScope.length > 0) {
        console.log(`  Derived scope from task: ${taskDerivedScope.join(", ")}`);
      }
      console.log("");

      if (changedFiles.length > 0 && taskDerivedScope.length > 0) {
        const outsideTaskScope = changedFiles.filter((f) => {
          const inDerived = taskDerivedScope.some((d) => f.startsWith(d));
          const inAllowed = ALLOWED_SCOPE_DIRS.some((d) =>
            d.endsWith("/") ? f.startsWith(d) : f === d
          );
          return !inDerived && inAllowed;
        });

        if (outsideTaskScope.length > 0) {
          console.log("Files in allowed scope but outside task's relevant files:");
          for (const f of outsideTaskScope) {
            warn(`File not listed in task's relevant files: ${f}`);
            console.log(`  ${f}`);
          }
          console.log("");
        }
      }
    }
  }
} catch {}

console.log("--- Running sub-checks ---\n");

try {
  console.log("[1/2] TypeCheck...");
  execSync("bash scripts/validations/typecheck.sh", {
    cwd: PROJECT_ROOT,
    encoding: "utf-8",
    stdio: "pipe",
  });
  console.log("  ✓ TypeCheck passed\n");
} catch (e) {
  fail("TypeCheck failed — possible regression");
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
  fail("Product integrity failed — possible regression");
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
