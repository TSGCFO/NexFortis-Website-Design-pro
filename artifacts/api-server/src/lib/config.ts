const ALLOWED_ORIGINS: string[] = [
  "https://nex-fortis-website-design-pro.replit.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

if (process.env["ALLOWED_ORIGINS"]) {
  for (const origin of process.env["ALLOWED_ORIGINS"].split(",")) {
    const trimmed = origin.trim();
    if (trimmed && !ALLOWED_ORIGINS.includes(trimmed)) {
      ALLOWED_ORIGINS.push(trimmed);
    }
  }
}

const DEFAULT_ORIGIN = "https://nex-fortis-website-design-pro.replit.app";

export function getValidOrigin(requestOrigin: string | undefined): string {
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    return requestOrigin;
  }
  return DEFAULT_ORIGIN;
}

export { ALLOWED_ORIGINS };
