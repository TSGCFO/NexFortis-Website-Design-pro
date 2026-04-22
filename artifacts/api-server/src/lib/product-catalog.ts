import path from "path";
import fs from "fs";
import { fileURLToPath } from "node:url";

function getModuleDir(): string | null {
  // ESM (tsx dev): use import.meta.url. In esbuild's CJS bundle this is
  // empty, so we return null and rely on the cwd-based candidates below
  // (production cwd is the repo root per render.yaml startCommand).
  try {
    const url = (import.meta as { url?: string }).url;
    if (url) return path.dirname(fileURLToPath(url));
  } catch {
    // ignore
  }
  return null;
}

const moduleDir = getModuleDir();

export interface CatalogProduct {
  id: number;
  slug: string;
  name: string;
  // Added in PR #51. Optional per-service SEO description <=155 chars. Kept
  // as optional so older products.json files (and test fixtures) still
  // parse. Not used by the API server today, but included here to keep the
  // interface in lockstep with the qb-portal copy.
  meta_description?: string;
  base_price_cad: number;
  launch_price_cad: number;
  is_addon: boolean;
  badge: string;
  requires_service: number | null;
  accepted_file_types: string[];
  category_slug: string;
  pack_size?: number;
  billing_type?: string;
}

export interface ProductCatalog {
  promo_active: boolean;
  promo_label: string;
  services: CatalogProduct[];
}

const EMPTY_CATALOG: ProductCatalog = { promo_active: false, promo_label: "", services: [] };

let cachedCatalog: ProductCatalog | null = null;

function resolveCandidates(): string[] {
  const cwd = process.cwd();
  const list: string[] = [];
  if (moduleDir) {
    // Production (esbuild CJS): module lives in dist/, products.json sits beside it.
    list.push(path.resolve(moduleDir, "products.json"));
    // Dev (tsx): module is at src/lib/, walk up to artifacts/qb-portal/public.
    list.push(path.resolve(moduleDir, "../../../qb-portal/public/products.json"));
  }
  // CWD-relative fallbacks for both prod (cwd = repo root) and dev.
  list.push(path.resolve(cwd, "artifacts/api-server/dist/products.json"));
  list.push(path.resolve(cwd, "artifacts/qb-portal/public/products.json"));
  list.push(path.resolve(cwd, "dist/products.json"));
  return list;
}

export function loadProductCatalog(): ProductCatalog {
  if (cachedCatalog) return cachedCatalog;
  const candidates = resolveCandidates();
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        cachedCatalog = JSON.parse(fs.readFileSync(candidate, "utf-8")) as ProductCatalog;
        console.log("[Catalog] Loaded product catalog from", candidate, "services=", cachedCatalog.services?.length ?? 0);
        return cachedCatalog;
      }
    } catch (err) {
      console.error("[Catalog] Failed to read product catalog at", candidate, err);
    }
  }
  console.error("[Catalog] No product catalog found. Candidates tried:", candidates);
  cachedCatalog = EMPTY_CATALOG;
  return cachedCatalog;
}

export function resetProductCatalogCache(): void {
  cachedCatalog = null;
}
