const BASE_ORIGINS: string[] = [
  "https://nexfortis.com",
  "https://www.nexfortis.com",
  "https://qb.nexfortis.com",
  "https://qbportal.nexfortis.com",
  ...(process.env["NODE_ENV"] !== "production"
    ? [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://nex-fortis-website-design-pro.replit.app",
      ]
    : []),
];

const ALLOWED_ORIGINS: string[] = [...BASE_ORIGINS];

if (process.env["ALLOWED_ORIGINS"]) {
  for (const origin of process.env["ALLOWED_ORIGINS"].split(",")) {
    const trimmed = origin.trim();
    if (!trimmed) continue;
    if (process.env["NODE_ENV"] === "production" && trimmed.startsWith("http://localhost")) continue;
    if (!ALLOWED_ORIGINS.includes(trimmed)) {
      ALLOWED_ORIGINS.push(trimmed);
    }
  }
}

const DEFAULT_ORIGIN = "https://nexfortis.com";

export function getValidOrigin(requestOrigin: string | undefined): string {
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    return requestOrigin;
  }
  return DEFAULT_ORIGIN;
}

export { ALLOWED_ORIGINS };
