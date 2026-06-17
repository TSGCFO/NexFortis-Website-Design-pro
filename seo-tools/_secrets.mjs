// Loads SEO-tool API secrets from seo-tools/secrets.local.json (gitignored),
// falling back to process.env. Never logs secret values.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SECRETS_FILE = join(here, "secrets.local.json");

let fileSecrets = {};
if (existsSync(SECRETS_FILE)) {
  try {
    fileSecrets = JSON.parse(readFileSync(SECRETS_FILE, "utf8"));
  } catch (e) {
    console.error(`[secrets] Could not parse ${SECRETS_FILE}: ${e.message}`);
    process.exit(1);
  }
}

export function secret(name, { required = true } = {}) {
  const value = process.env[name] ?? fileSecrets[name];
  if (required && (value === undefined || value === null || value === "")) {
    console.error(
      `[secrets] Missing "${name}". Add it to seo-tools/secrets.local.json (or set it as an environment variable).`,
    );
    process.exit(1);
  }
  return value;
}
