// In production on Render (or any host where the API is on a different origin
// than the static site), set the `VITE_API_BASE_URL` build-time env var
// (e.g. `https://nexfortis-api.onrender.com` or `https://api.nexfortis.com`).
// Falls back to a relative `/api` for local Replit dev where the dev server
// proxies `/api/*` to the local API.
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
const API_BASE = (API_ORIGIN ? API_ORIGIN.replace(/\/$/, "") : "") + "/api";

// URL builder for direct fetch() calls outside of apiFetch (e.g. file uploads,
// FormData posts, calls that need credentials/cookies).
export function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith("/") ? path : "/" + path}`;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}
