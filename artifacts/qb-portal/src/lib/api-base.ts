// Centralized API base URL resolver for the QuickBooks portal.
//
// In production on Render (or any host where the API lives on a different
// origin than the static site), set the `VITE_API_BASE_URL` build-time env
// var (e.g. `https://nexfortis-api.onrender.com` or `https://api.nexfortis.com`)
// and all calls will be rewritten to the absolute URL.
//
// In development on Replit (where the dev server proxies `/api/*` to the
// local API) this falls back to a relative URL derived from `BASE_URL`,
// preserving the historical behavior.
export function getApiBase(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (envBase && envBase.length > 0) {
    return envBase.replace(/\/$/, "");
  }
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base.slice(0, -1) : base;
  return prefix.replace(/\/qb-portal$/, "");
}
