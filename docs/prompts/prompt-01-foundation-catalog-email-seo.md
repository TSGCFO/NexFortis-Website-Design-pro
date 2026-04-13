# Prompt 01: Foundation — Product Catalog Overhaul + Email Fix + SEO Base

## Step 0: Setup

1. Pull the latest `main` branch: `git pull origin main`
2. Create and switch to a new branch: `git checkout -b feat/foundation-catalog-email-seo`
3. Read these files before making any changes:
   - `replit.md` — project overview, architecture, conventions
   - `docs/prd/qb-portal/feature-product-catalog-pricing.md` — full catalog PRD with all requirements
   - `docs/prd/qb-portal/feature-seo-landing-pages.md` — SEO requirements (Section 6: Technical SEO Foundation)

## Step 1: Replace products.json with approved 20-product catalog

The current `artifacts/qb-portal/public/products.json` has 54 products (30 services + 24 tools) across 15+ categories. This must be replaced with exactly 20 products across 5 categories.

**Delete the entire file contents** and replace with the JSON structure below. Key differences from the old schema:
- `price_cad` is replaced by `base_price_cad` (full price) and `launch_price_cad` (50% off promo price)
- All prices are in **CAD cents** (14900 = $149.00) — this is consistent with how `total_cad` is already stored in the orders table
- New top-level `promo_active` boolean flag controls whether launch pricing is displayed
- New fields: `category_slug`, `sort_order`, `accepted_file_types`, optional `billing_type` and `billing_interval` for subscription products
- The `tools` array is completely removed — tools are out of scope for launch
- Old fields removed: `tier`, `competitor_ref`, `target_launch`
- Every product has `badge: "available"` — no more "coming-soon" products

**The complete JSON to use:**

```json
{
  "promo_active": true,
  "promo_label": "Launch Special — 50% Off",
  "services": [
    {
      "id": 1,
      "slug": "enterprise-to-premier-standard",
      "name": "Enterprise → Premier/Pro Standard",
      "category": "QuickBooks Conversion Services",
      "category_slug": "quickbooks-conversion",
      "description": "Convert your QuickBooks Enterprise file to Premier or Pro. Standard complexity files with clean data, processed in under 60 minutes. Includes list verification and data integrity check.",
      "base_price_cad": 14900,
      "launch_price_cad": 7500,
      "turnaround": "Under 60 minutes",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 1
    },
    {
      "id": 2,
      "slug": "enterprise-to-premier-complex",
      "name": "Enterprise → Premier/Pro Complex",
      "category": "QuickBooks Conversion Services",
      "category_slug": "quickbooks-conversion",
      "description": "Convert complex QuickBooks Enterprise files with advanced inventory, multi-currency, large list counts, or custom fields. Includes full data audit and integrity verification.",
      "base_price_cad": 19900,
      "launch_price_cad": 10000,
      "turnaround": "Under 60 minutes",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 2
    },
    {
      "id": 3,
      "slug": "guaranteed-30-minute",
      "name": "Guaranteed 30-Minute Conversion",
      "category": "QuickBooks Conversion Services",
      "category_slug": "quickbooks-conversion",
      "description": "Priority processing with a guaranteed 30-minute turnaround. Same thorough conversion with expedited delivery. Perfect for urgent deadlines.",
      "base_price_cad": 24900,
      "launch_price_cad": 12500,
      "turnaround": "30 minutes guaranteed",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 3
    },
    {
      "id": 4,
      "slug": "file-health-check",
      "name": "File Health Check",
      "category": "QuickBooks Conversion Services",
      "category_slug": "quickbooks-conversion",
      "description": "Comprehensive diagnostic scan of your QuickBooks file. Identifies data integrity issues, bloated lists, orphaned transactions, and optimization opportunities.",
      "base_price_cad": 4900,
      "launch_price_cad": 2500,
      "turnaround": "Same day",
      "badge": "available",
      "is_addon": true,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 4
    },
    {
      "id": 5,
      "slug": "rush-delivery",
      "name": "Rush Delivery",
      "category": "QuickBooks Conversion Services",
      "category_slug": "quickbooks-conversion",
      "description": "Jump to the front of the processing queue. Your order is prioritized above all standard orders.",
      "base_price_cad": 4900,
      "launch_price_cad": 2500,
      "turnaround": "Priority queue",
      "badge": "available",
      "is_addon": true,
      "requires_service": null,
      "accepted_file_types": [],
      "sort_order": 5
    },
    {
      "id": 6,
      "slug": "post-conversion-care",
      "name": "Post-Conversion Care",
      "category": "QuickBooks Conversion Services",
      "category_slug": "quickbooks-conversion",
      "description": "30 days of dedicated email support after your conversion. Get help with any questions, discrepancies, or adjustments needed in your converted file.",
      "base_price_cad": 4900,
      "launch_price_cad": 2500,
      "turnaround": "30-day coverage",
      "badge": "available",
      "is_addon": true,
      "requires_service": null,
      "accepted_file_types": [],
      "sort_order": 6
    },
    {
      "id": 7,
      "slug": "audit-trail-removal",
      "name": "Audit Trail Removal",
      "category": "QuickBooks Data Services",
      "category_slug": "quickbooks-data-services",
      "description": "Remove the audit trail from your QuickBooks file to reduce file size and improve performance. Essential for files that have grown large over years of use.",
      "base_price_cad": 9900,
      "launch_price_cad": 5000,
      "turnaround": "Same day",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 7
    },
    {
      "id": 8,
      "slug": "super-condense",
      "name": "Super Condense",
      "category": "QuickBooks Data Services",
      "category_slug": "quickbooks-data-services",
      "description": "Dramatically reduce your QuickBooks file size by condensing old transactions while preserving account balances and list data. Ideal for sluggish files.",
      "base_price_cad": 9900,
      "launch_price_cad": 5000,
      "turnaround": "Same day",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 8
    },
    {
      "id": 9,
      "slug": "list-reduction",
      "name": "List Reduction",
      "category": "QuickBooks Data Services",
      "category_slug": "quickbooks-data-services",
      "description": "Clean up and merge duplicate or inactive items in your QuickBooks lists (customers, vendors, items, accounts). Reduces clutter and improves searchability.",
      "base_price_cad": 7900,
      "launch_price_cad": 4000,
      "turnaround": "Same day",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 9
    },
    {
      "id": 10,
      "slug": "multi-currency-removal",
      "name": "Multi-Currency Removal",
      "category": "QuickBooks Data Services",
      "category_slug": "quickbooks-data-services",
      "description": "Remove multi-currency from your QuickBooks file. Once enabled, Intuit provides no way to turn it off — we handle it safely with full data preservation.",
      "base_price_cad": 14900,
      "launch_price_cad": 7500,
      "turnaround": "1-2 business days",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 10
    },
    {
      "id": 11,
      "slug": "qbo-readiness-report",
      "name": "QBO Readiness Report",
      "category": "QuickBooks Data Services",
      "category_slug": "quickbooks-data-services",
      "description": "Comprehensive report analyzing your QuickBooks Desktop file's readiness for migration to QuickBooks Online. Identifies compatibility issues, data gaps, and recommended pre-migration steps.",
      "base_price_cad": 4900,
      "launch_price_cad": 2500,
      "turnaround": "Same day",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 11
    },
    {
      "id": 12,
      "slug": "cra-period-copy",
      "name": "CRA Period Copy",
      "category": "QuickBooks Data Services",
      "category_slug": "quickbooks-data-services",
      "description": "Create a clean copy of your QuickBooks file containing only data for a specific date range. Perfect for CRA audit requests or fiscal year isolation.",
      "base_price_cad": 9900,
      "launch_price_cad": 5000,
      "turnaround": "Same day",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 12
    },
    {
      "id": 13,
      "slug": "audit-trail-cra-bundle",
      "name": "Audit Trail + CRA Period Copy Bundle",
      "category": "QuickBooks Data Services",
      "category_slug": "quickbooks-data-services",
      "description": "Save with our most popular bundle: Audit Trail Removal plus CRA Period Copy. Clean up your file and isolate a specific reporting period in one order.",
      "base_price_cad": 14900,
      "launch_price_cad": 7500,
      "turnaround": "Same day",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".qbm"],
      "sort_order": 13
    },
    {
      "id": 14,
      "slug": "accountedge-to-quickbooks",
      "name": "AccountEdge/MYOB → QuickBooks",
      "category": "Platform Migration Services",
      "category_slug": "platform-migrations",
      "description": "Migrate your AccountEdge or MYOB data to QuickBooks Desktop. Transfers chart of accounts, customers, vendors, items, and transaction history.",
      "base_price_cad": 24900,
      "launch_price_cad": 12500,
      "turnaround": "1-2 business days",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".zip", ".myo", ".myox"],
      "sort_order": 14
    },
    {
      "id": 15,
      "slug": "sage50-to-quickbooks",
      "name": "Sage 50/Simply Accounting → QuickBooks",
      "category": "Platform Migration Services",
      "category_slug": "platform-migrations",
      "description": "Migrate your Sage 50 (Simply Accounting) data to QuickBooks Desktop. Full transfer of chart of accounts, customers, vendors, items, and transaction history.",
      "base_price_cad": 24900,
      "launch_price_cad": 12500,
      "turnaround": "1-2 business days",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [".cab", ".zip", ".sai"],
      "sort_order": 15
    },
    {
      "id": 16,
      "slug": "expert-support-essentials",
      "name": "QB Expert Support — Essentials",
      "category": "QB Expert Support",
      "category_slug": "expert-support",
      "description": "Monthly QuickBooks Desktop support subscription. 3 tickets per month with 1-hour response time during business hours. Covers troubleshooting, error codes, performance issues, setup guidance. Includes 1 automated file health check per month.",
      "base_price_cad": 4900,
      "launch_price_cad": 2500,
      "turnaround": "Monthly subscription",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [],
      "billing_type": "subscription",
      "billing_interval": "month",
      "sort_order": 16
    },
    {
      "id": 17,
      "slug": "expert-support-professional",
      "name": "QB Expert Support — Professional",
      "category": "QB Expert Support",
      "category_slug": "expert-support",
      "description": "Monthly QuickBooks Desktop support subscription. 8 tickets per month with 1-hour response time. Covers everything in Essentials plus file corruption diagnosis, data integrity analysis, list management, multi-user troubleshooting, and optimization recommendations. 10% discount on all NexFortis services.",
      "base_price_cad": 9900,
      "launch_price_cad": 5000,
      "turnaround": "Monthly subscription",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [],
      "billing_type": "subscription",
      "billing_interval": "month",
      "sort_order": 17
    },
    {
      "id": 18,
      "slug": "expert-support-premium",
      "name": "QB Expert Support — Premium",
      "category": "QB Expert Support",
      "category_slug": "expert-support",
      "description": "Monthly QuickBooks Desktop support subscription. Unlimited tickets with 30-minute response time. Everything in Professional plus proactive file optimization, migration planning, priority service queue, monthly 30-min video call, and 20% discount on all NexFortis services. Dedicated referral code ($25/referral).",
      "base_price_cad": 14900,
      "launch_price_cad": 7500,
      "turnaround": "Monthly subscription",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [],
      "billing_type": "subscription",
      "billing_interval": "month",
      "sort_order": 18
    },
    {
      "id": 19,
      "slug": "5-pack-conversions",
      "name": "5-Pack Conversions",
      "category": "Volume Packs",
      "category_slug": "volume-packs",
      "description": "Bundle of 5 standard Enterprise → Premier/Pro conversions at a discounted rate. Perfect for accountants and bookkeepers managing multiple client files. Credits are valid for 12 months.",
      "base_price_cad": 64900,
      "launch_price_cad": 32500,
      "turnaround": "Credits issued immediately",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [],
      "sort_order": 19
    },
    {
      "id": 20,
      "slug": "10-pack-conversions",
      "name": "10-Pack Conversions",
      "category": "Volume Packs",
      "category_slug": "volume-packs",
      "description": "Bundle of 10 standard Enterprise → Premier/Pro conversions at the best value. Ideal for accounting firms with a steady volume of client conversions. Credits are valid for 12 months.",
      "base_price_cad": 119900,
      "launch_price_cad": 60000,
      "turnaround": "Credits issued immediately",
      "badge": "available",
      "is_addon": false,
      "requires_service": null,
      "accepted_file_types": [],
      "sort_order": 20
    }
  ]
}
```

## Step 2: Update the products helper module

The file `artifacts/qb-portal/src/lib/products.ts` loads and caches the catalog. It needs to be updated for the new schema.

**What to change:**
- Update the `Product` TypeScript interface to match the new JSON fields (`base_price_cad`, `launch_price_cad`, `accepted_file_types`, `category_slug`, `sort_order`, optional `billing_type`, optional `billing_interval`). Remove old fields (`price_cad`, `tier`, `competitor_ref`, `target_launch`).
- Update the `ProductCatalog` interface — the top-level now has `promo_active: boolean` and `promo_label: string`. Remove the `tools` array.
- Add a `formatPrice(cents: number): string` helper that formats cents to `"$X.XX"` (e.g., `14900` → `"$149.00"`)
- Add a `getActivePrice(product: Product): number` helper that returns `launch_price_cad` when the catalog's `promo_active` is `true`, otherwise `base_price_cad`
- Add an `isPromoActive(): boolean` helper that reads from the cached catalog's `promo_active` flag
- Remove any code that references the `tools` array

## Step 3: Update all frontend components that read from the catalog

Every component that uses `price_cad` must switch to the new price fields. Search the entire `artifacts/qb-portal/src/` directory for `price_cad` and update each occurrence.

**Key files to update (find them by searching for `price_cad`, `loadProducts`, `product.price`, and `tools`):**

- `src/pages/catalog.tsx` — Update the catalog page header text from "54 QuickBooks products" to "20 QuickBooks services". Update the category filter pills to use the 5 new categories. Update product card rendering to use `formatPrice(getActivePrice(product))`. Remove any references to the `tools` array.
- `src/pages/service-detail.tsx` — Update price display. Show both the base price (crossed out) and launch price when promo is active.
- `src/pages/order.tsx` — Update service selection to use new product IDs. Update price calculations to use `getActivePrice()`. Update add-on filtering logic (add-ons are products with `is_addon: true`).
- `src/pages/home.tsx` — Update the hero text from "54 products and services" to "20 services". Update the "starting at" price. Update the featured services section to show products from the new catalog.
- `src/pages/waitlist.tsx` — This page can remain as-is for now since all products are "available", but make sure it doesn't crash if no "coming-soon" products exist.
- `src/pages/category.tsx` — Update to use `category_slug` for matching. Remove the "Coming Soon" subsection since all products are now available.

**Important:** Do NOT change the order form's submission logic or the API endpoints — the backend changes come in a separate PR. Only the frontend display of products and prices changes in this PR.

## Step 4: Replace all hardcoded email addresses

Search the entire `artifacts/qb-portal/` directory for `hassansadiq73@gmail.com` and replace every occurrence with `support@nexfortis.com`. There are 4 known locations:

1. `src/components/layout.tsx` — Footer "Contact Us" mailto link
2. `src/components/layout.tsx` — Footer copyright text row
3. `src/pages/privacy.tsx` — Privacy Policy Section 10 contact info
4. `src/pages/terms.tsx` — Terms of Service Section 11 contact info

Verify there are no other occurrences: `grep -r "hassansadiq73" artifacts/qb-portal/`

## Step 5: Add SEO foundation to QB Portal

**5a. Install react-helmet-async:**
```bash
cd artifacts/qb-portal && pnpm add react-helmet-async
```

**5b. Wrap the app in HelmetProvider:**
In `artifacts/qb-portal/src/App.tsx`, import `HelmetProvider` from `react-helmet-async` and wrap the entire app (outside the Router, inside the QueryClientProvider).

**5c. Create the SEO component:**
Create `artifacts/qb-portal/src/components/seo.tsx` with a reusable `<SEO>` component.

Props:
- `title: string` — page title (will be appended with " | NexFortis QuickBooks Portal")
- `description: string` — meta description (150-160 chars)
- `path: string` — canonical path (e.g., "/catalog")
- `noIndex?: boolean` — for portal/auth pages

The component should use `<Helmet>` from react-helmet-async to render:
- `<title>` with the formatted title
- `<meta name="description">`
- `<link rel="canonical" href="https://qb.nexfortis.com{path}">`
- `og:title`, `og:description`, `og:url`, `og:image` (value: `https://qb.nexfortis.com/opengraph.jpg`), `og:type` ("website"), `og:site_name` ("NexFortis QuickBooks Portal"), `og:locale` ("en_CA")
- `twitter:card` ("summary_large_image"), `twitter:title`, `twitter:description`, `twitter:image`
- Conditional: `<meta name="robots" content="noindex, nofollow">` when `noIndex` is true

**5d. Add `<SEO>` to every page component:**
Add the SEO component to each page with appropriate title and description. Examples:
- Home: `title="QuickBooks Conversion & Data Services"`, `description="Canadian QuickBooks experts. Enterprise to Premier conversion, data services, and expert support. Starting at $75 CAD with our launch special."`, `path="/"`
- Catalog: `title="Service Catalog"`, `description="Browse 20 QuickBooks services across 5 categories. Conversion, data services, platform migrations, expert support, and volume packs."`, `path="/catalog"`
- FAQ: `title="Frequently Asked Questions"`, `description="Answers to common questions about QuickBooks conversion, data services, file uploads, pricing, and turnaround times."`, `path="/faq"`
- QBM Guide: `title="How to Create a QBM Backup File"`, `description="Step-by-step guide to creating a portable company file (.QBM) from QuickBooks Enterprise for conversion."`, `path="/qbm-guide"`
- Service Detail (dynamic): `title={product.name}`, `description={product.description}`, `path={"/service/" + product.slug}`
- Category (dynamic): `title={categoryName}`, `description` about the category, `path={"/category/" + categorySlug}`
- Portal, Login, Register, ForgotPassword, ResetPassword, Order, OrderDetail: all with `noIndex: true`
- Terms: `title="Terms of Service"`, `path="/terms"`
- Privacy: `title="Privacy Policy"`, `path="/privacy"`

**5e. Create robots.txt:**
Create `artifacts/qb-portal/public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /portal
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /order

Sitemap: https://qb.nexfortis.com/sitemap.xml
```

**5f. Create sitemap.xml:**
Create `artifacts/qb-portal/public/sitemap.xml` listing all public URLs. Use `https://qb.nexfortis.com` as the base URL. Include:
- Static pages: `/`, `/catalog`, `/faq`, `/qbm-guide`, `/terms`, `/privacy`
- Category pages: `/category/quickbooks-conversion`, `/category/quickbooks-data-services`, `/category/platform-migrations`, `/category/expert-support`, `/category/volume-packs`
- Product pages: `/service/{slug}` for each of the 20 products

All `<url>` entries should have `<lastmod>` set to today's date in YYYY-MM-DD format.

## Step 6: Verify and commit

1. Run `pnpm typecheck` from the repo root — fix any TypeScript errors
2. Run the dev server and verify:
   - Catalog page shows exactly 20 products in 5 categories
   - Product cards display correctly with names, descriptions, and prices
   - Service detail pages load for each product
   - Category pages show the correct products
   - No references to `hassansadiq73@gmail.com` anywhere (check footer and legal pages)
   - Footer shows `support@nexfortis.com`
   - Browser tab titles are unique per page (not just "NexFortis QuickBooks Portal" everywhere)
   - `/robots.txt` is accessible in the browser
   - `/sitemap.xml` is accessible and lists all URLs
3. Commit all changes with message: `feat: overhaul product catalog to 20 products, replace email, add SEO foundation`
4. Push the branch and create a PR against `main`

## Constraints

- Do NOT modify any files in `artifacts/api-server/` — backend changes come in a separate PR
- Do NOT modify any files in `artifacts/nexfortis/` — main site changes come later
- Do NOT modify any files in `lib/db/` — schema changes come later
- Do NOT modify any files in `docs/` — documentation is managed separately
- Do NOT add new routes — this PR only updates existing pages and adds SEO metadata
- Do NOT change the order form's API submission logic — the backend still expects the old product IDs for now, and products 1-3 map correctly
- Do NOT remove the waitlist page or route — keep it intact even though no products are "coming-soon"
