# Cursor Prompt — PR #3: Rewrite 17 short H1s

**Branch:** `phase2/pr3-h1-rewrites`  
**Spec:** `docs/superpowers/specs/2026-04-26-seo-audit-fix-plan.md` § "PR #3"  
**Audit:** PDF p.16

## HARD RULES (same as previous PRs)

## Goal

Every H1 on the audit's "H1 too short" list ≥25 chars and ≤70 chars, contains primary keyword, and differs from `<title>`. Drop allowlist `tests/seo/__known-issues__.json` `INV-004` (issue I1) entries from 5 → 0.

## Affected pages

**nexfortis.com (4):**

| Route | Current H1 | Suggested replacement (you may improve) |
|---|---|---|
| `/about` | "About NexFortis" | "About NexFortis — Canadian IT & SaaS Specialists" |
| `/contact` | "Contact us" | "Contact NexFortis — Canadian IT & QuickBooks Support" |
| `/privacy` | "Privacy Policy" | "NexFortis Privacy Policy & PIPEDA Compliance" |
| `/terms` | "Terms of Service" | "NexFortis Terms of Service & Acceptable Use" |
| `/services/microsoft-365` | "Microsoft 365 Solutions" | "Microsoft 365 Solutions for Canadian Businesses" |

**qb.nexfortis.com (13 — service-detail H1s come from `product.name` in `products.json`):**

- `/catalog` — page-template H1
- `/terms`, `/privacy` — page-template H1
- `/category/volume-packs` — page-template H1 (depends on `category` data)
- `/service/5-pack-conversions`, `/service/file-health-check`, `/service/rush-delivery`, `/service/extended-support`, `/service/audit-trail-removal`, `/service/super-condense`, `/service/list-reduction`, `/service/cra-period-copy`, `/service/10-pack-conversions` — these H1s come from `name` in `products.json`. Update those `name` values; remember `name` is also the visible page title, so each new value must read naturally on cards.

## Files

**Modify (depending on where each H1 actually lives — INSPECT each before editing):**

- `artifacts/nexfortis/src/pages/about.tsx`
- `artifacts/nexfortis/src/pages/contact.tsx`
- `artifacts/nexfortis/src/pages/privacy.tsx`
- `artifacts/nexfortis/src/pages/terms.tsx`
- `artifacts/nexfortis/src/pages/services/microsoft-365.tsx`
- `artifacts/qb-portal/src/pages/catalog.tsx`
- `artifacts/qb-portal/src/pages/category.tsx` (or a category data file)
- `artifacts/qb-portal/src/pages/terms.tsx`
- `artifacts/qb-portal/src/pages/privacy.tsx`
- `artifacts/qb-portal/public/products.json` — update `name` for the 9 affected service slugs ONLY IF the visible product name still reads correctly. If a longer name breaks the catalog UI, instead add a new `seo.h1` field and have the service-detail template prefer `seo.h1` when present (template change isolated to `<h1>` only).

**Modify allowlist:** `tests/seo/__known-issues__.json` — remove all 5 `INV-004` entries.

**Create:** `tests/seo/h1-length.test.mjs` (read prerendered HTML; assert each affected page's H1 is 25-70 chars and differs from title).

## Acceptance

- All 17 H1s pass length + differs-from-title check.
- Allowlist `INV-004` empty array.
- `pnpm test`, `pnpm build` (both sites) green; live verifier green post-deploy.

## Stop conditions

If renaming a service `name` would break catalog card layout or pricing copy, STOP and propose adding a separate `seo.h1` field instead.
