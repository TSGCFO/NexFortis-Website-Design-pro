# Prompt 02: Catalog UI — Promo Display, Product Cards, Home Page, FAQ Tabs

## Step 0: Setup

1. Pull the latest `main` branch: `git pull origin main`
2. Create and switch to a new branch: `git checkout -b feat/catalog-ui-promo-display`
3. Read these files before making any changes:
   - `replit.md` — project overview, architecture, conventions
   - `docs/prd/qb-portal/feature-product-catalog-pricing.md` — full catalog PRD (especially FR-04, FR-05, FR-06, FR-09, FR-12)
   - `docs/prompts/prompt-02-catalog-ui-promo-display.md` — this file (the complete instructions)

**Do NOT modify any files in `docs/`, `artifacts/api-server/`, `artifacts/nexfortis/`, or `lib/`.**

---

## Step 1: Enhance Catalog Product Cards

**File:** `artifacts/qb-portal/src/pages/catalog.tsx`

The current product cards show basic pricing but are missing several PRD requirements. Update the `ProductCard` component to include:

### 1a. Add "Launch Special" promo badge on every card when promo is active

Inside the card, after the "Available" badge, add a "Launch Special" badge when promo is active:

```tsx
{isPromoActive() && (
  <span className="px-2 py-0.5 rounded-full bg-rose-gold/10 text-rose-gold text-xs font-semibold shrink-0">
    Launch Special
  </span>
)}
```

### 1b. Show subscription products as "/mo" pricing

For products with `billing_type === "subscription"`, display prices as `$XX.XX/mo` instead of just `$XX.XX`. Update the price rendering:

```tsx
{product.billing_type === "subscription" ? (
  promo ? (
    <>
      <span className="font-bold text-accent">{formatPrice(activePrice)}/mo</span>
      <span className="text-xs text-muted-foreground line-through ml-2">{formatPrice(product.base_price_cad)}/mo</span>
    </>
  ) : (
    <span className="font-bold text-accent">{formatPrice(activePrice)}/mo</span>
  )
) : promo ? (
  <>
    <span className="font-bold text-accent">{formatPrice(activePrice)}</span>
    <span className="text-xs text-muted-foreground line-through ml-2">{formatPrice(product.base_price_cad)}</span>
  </>
) : (
  <span className="font-bold text-accent">{formatPrice(activePrice)}</span>
)}
```

### 1c. Show per-conversion effective price for Volume Packs

For volume pack products (`category_slug === "volume-packs"`), add a secondary line below the total price showing the per-conversion rate:

- 5-Pack (id=19): "$65.00/conversion at launch" (launch_price_cad 32500 / 5 = 6500 cents = $65.00)
- 10-Pack (id=20): "$60.00/conversion at launch" (launch_price_cad 60000 / 10 = 6000 cents = $60.00)

Calculate dynamically based on the product id:

```tsx
{product.category_slug === "volume-packs" && (
  <div className="text-xs text-muted-foreground mt-1">
    {product.id === 19
      ? `${formatPrice(Math.round(getActivePrice(product) / 5))}/conversion`
      : `${formatPrice(Math.round(getActivePrice(product) / 10))}/conversion`}
  </div>
)}
```

### 1d. Add GST/HST disclosure footer to catalog page

At the bottom of the catalog product grid section (after all category groups), add:

```tsx
<p className="text-xs text-muted-foreground text-center mt-8">
  All prices in Canadian dollars (CAD). GST/HST will be added at checkout based on your province.
</p>
```

### 1e. Improve the zero-results message

The current zero-results message is generic. Replace it with the PRD-required message:

Change:
```tsx
<div className="text-center py-12 text-muted-foreground">No services match your search.</div>
```

To:
```tsx
<div className="text-center py-12">
  <p className="text-muted-foreground mb-2">No products match your search.</p>
  <p className="text-sm text-muted-foreground">Need help? Contact us at{" "}
    <a href="mailto:support@nexfortis.com" className="text-accent hover:underline">support@nexfortis.com</a>
  </p>
</div>
```

---

## Step 2: Update Home Page Featured Services

**File:** `artifacts/qb-portal/src/pages/home.tsx`

### 2a. Update the `featuredServices` array

The current featured services array has hardcoded prices and descriptions. Replace it with a version that better represents the catalog per PRD FR-12 (featured products: Standard Conversion, Audit Trail + CRA Bundle, 5-Pack Conversions):

Replace the entire `featuredServices` array (around line 43) with:

```tsx
const featuredServices = [
  {
    title: "Enterprise → Premier/Pro Standard",
    price: "From $75.00 CAD",
    originalPrice: "$149.00",
    desc: "Convert your QuickBooks Enterprise file to Premier or Pro. Under 60 minutes. Penny-perfect accuracy.",
    badge: "Most Popular",
    href: "/service/enterprise-to-premier-standard",
  },
  {
    title: "Audit Trail + CRA Period Copy Bundle",
    price: "$75.00 CAD",
    originalPrice: "$149.00",
    desc: "Our most popular bundle: audit trail removal plus CRA period copy. Save vs. buying separately.",
    badge: "Best Value",
    href: "/service/audit-trail-cra-bundle",
  },
  {
    title: "5-Pack Conversions",
    price: "$325.00 CAD",
    originalPrice: "$649.00",
    desc: "Bundle of 5 standard conversions for accountants and bookkeepers. $65/conversion. Valid 12 months.",
    badge: "For Accountants",
    href: "/service/5-pack-conversions",
  },
  {
    title: "Guaranteed 30-Minute Conversion",
    price: "$125.00 CAD",
    originalPrice: "$249.00",
    desc: "Priority processing with a guaranteed 30-minute turnaround. Full refund if we exceed 30 minutes.",
    badge: "Fastest",
    href: "/service/guaranteed-30-minute",
  },
  {
    title: "QB Expert Support — Professional",
    price: "$50.00/mo CAD",
    originalPrice: "$99.00/mo",
    desc: "8 tickets/month, 1-hour response time, data integrity analysis, 10% discount on all services.",
    badge: "Recommended",
    href: "/service/expert-support-professional",
  },
  {
    title: "Sage 50 → QuickBooks Migration",
    price: "$125.00 CAD",
    originalPrice: "$249.00",
    desc: "Migrate your Sage 50 or Simply Accounting data to QuickBooks Desktop. Full data transfer.",
    badge: "New Service",
    href: "/service/sage50-to-quickbooks",
  },
];
```

### 2b. Update the featured services card rendering

Find the section that renders the featured services cards (look for `featuredServices.map`). Update each card to show both the launch price and the strikethrough original price:

In the card JSX, after where the price is displayed, add the original price with strikethrough:

```tsx
<div className="flex items-center gap-2 mb-2">
  <span className="text-lg font-bold text-accent">{service.price}</span>
  {service.originalPrice && (
    <span className="text-sm text-muted-foreground line-through">{service.originalPrice}</span>
  )}
</div>
```

Also add the badge for each featured service. Where the card header/title is, add:

```tsx
{service.badge && (
  <span className="px-2 py-0.5 rounded-full bg-rose-gold/10 text-rose-gold text-xs font-semibold">
    {service.badge}
  </span>
)}
```

### 2c. Add a "Launch Special" banner to the hero section

In the hero section (the first major section), add a promotional banner just below the subtitle text. Find the text that says something like "20 QuickBooks services" or "Canadian QuickBooks experts" and add below it:

```tsx
<div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-gold/20 text-rose-gold text-sm font-bold">
  🎉 Launch Special — 50% Off All Services
</div>
```

Note: Use the actual emoji character `🎉` — this is the only place emojis are acceptable (marketing banner).

### 2d. Update the hero "starting at" price

Make sure the hero section says "Starting at $75.00 CAD" (the launch price) not "$149" (the base price). Search for any price reference in the hero section and ensure it says `$75.00 CAD`. Also add the original price context: "(reg. $149.00)".

### 2e. Add GST/HST note to the comparison table

The `comparisonData` table on the home page compares NexFortis vs Big Red vs E-Tech. Add a footnote below the comparison table:

```tsx
<p className="text-xs text-muted-foreground text-center mt-4">
  All NexFortis prices in CAD. Competitor prices shown in CAD equivalent at ~1.38 USD/CAD exchange rate.
  GST/HST will be added at checkout.
</p>
```

---

## Step 3: Enhance Service Detail Page Pricing

**File:** `artifacts/qb-portal/src/pages/service-detail.tsx`

### 3a. Add a "Launch Special" badge to the hero section

In the service detail page hero section (where the product name and price are displayed), add a launch promo badge when the promo is active. Find where the price is displayed and add near it:

```tsx
{isPromoActive() && (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-gold/10 text-rose-gold text-sm font-semibold mb-3">
    Launch Special — 50% Off
  </span>
)}
```

### 3b. Add "/mo" suffix for subscription products on service detail

In the pricing section of the service detail page, check if the product is a subscription (`billing_type === "subscription"`) and append "/mo" to the price display. Also add a footnote for subscriptions:

```tsx
{product.billing_type === "subscription" && isPromoActive() && (
  <p className="text-xs text-muted-foreground mt-2">
    Launch rate for first 3 months, then {formatPrice(product.base_price_cad)}/mo.
  </p>
)}
```

### 3c. Add GST/HST + trust badge row

Below the pricing display on the service detail page, add a trust badge row:

```tsx
<div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground">
  <span className="flex items-center gap-1">✓ Money-Back Guarantee</span>
  <span className="flex items-center gap-1">✓ All Prices CAD</span>
  <span className="flex items-center gap-1">✓ GST/HST added at checkout</span>
</div>
```

### 3d. Show per-conversion price for volume packs on detail page

For volume pack products, add a highlighted stat below the price:

```tsx
{product.category_slug === "volume-packs" && (
  <div className="mt-3 px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium">
    {product.id === 19
      ? `That's just ${formatPrice(Math.round(getActivePrice(product) / 5))}/conversion`
      : `That's just ${formatPrice(Math.round(getActivePrice(product) / 10))}/conversion`}
    {product.id === 20 && " — includes Guaranteed 30-Minute turnaround on all conversions"}
  </div>
)}
```

### 3e. Add 10-Pack feature callout

For product id=20 (10-Pack Conversions), add a prominent callout in the "What's Included" section:

```tsx
{product.id === 20 && (
  <li className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
    <span className="text-sm font-semibold">Includes Guaranteed 30-Minute turnaround on all 10 conversions</span>
  </li>
)}
```

---

## Step 4: Add FAQ Category Filter Tabs

**File:** `artifacts/qb-portal/src/pages/faq.tsx`

The FAQ page currently shows all FAQ items in a flat list. Add category filter tabs to match the catalog categories.

### 4a. Add category filter state

At the top of the FAQ component, add a category filter state:

```tsx
const [activeCat, setActiveCat] = useState<string>("all");
```

### 4b. Get unique categories from the FAQ data

After the `faqData` array, derive the categories:

```tsx
const faqCategories = [...new Set(faqData.map((item) => item.cat))];
```

### 4c. Add filter pills UI

Above the FAQ accordion, add category filter pills matching the catalog page's visual style:

```tsx
<div className="flex flex-wrap gap-2 mb-8 justify-center">
  <button
    onClick={() => setActiveCat("all")}
    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
      activeCat === "all"
        ? "bg-navy text-white"
        : "bg-muted text-muted-foreground hover:bg-muted/80"
    }`}
  >
    All ({faqData.length})
  </button>
  {faqCategories.map((cat) => (
    <button
      key={cat}
      onClick={() => setActiveCat(cat)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        activeCat === cat
          ? "bg-navy text-white"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {cat} ({faqData.filter((f) => f.cat === cat).length})
    </button>
  ))}
</div>
```

### 4d. Filter displayed FAQ items

Where the FAQ items are mapped/rendered, filter by the active category:

```tsx
const filteredFaq = activeCat === "all" ? faqData : faqData.filter((f) => f.cat === activeCat);
```

Then use `filteredFaq` in the `.map()` instead of `faqData`.

---

## Step 5: Update Category Pages

**File:** `artifacts/qb-portal/src/pages/category.tsx`

### 5a. Add promo banner to category pages

At the top of each category page (after the category title), add a promo banner when the promo is active:

```tsx
{isPromoActive() && (
  <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-gold/20 text-rose-gold text-sm font-semibold">
    Launch Special — 50% Off All Services
  </div>
)}
```

Make sure you import `isPromoActive` from `@/lib/products` if not already imported.

### 5b. Add cross-link banner on Conversion Services category page

On the Conversion Services category page (when the category slug is `quickbooks-conversion`), add a banner linking to Volume Packs:

```tsx
{categorySlug === "quickbooks-conversion" && (
  <div className="mb-8 p-4 rounded-lg bg-accent/5 border border-accent/20">
    <p className="text-sm text-foreground">
      <strong>Accountant or bookkeeper?</strong> Save with our{" "}
      <Link href="/category/volume-packs" className="text-accent hover:underline font-medium">
        Volume Packs →
      </Link>
      {" "}— 5-Pack from $65/conversion, 10-Pack from $60/conversion.
    </p>
  </div>
)}
```

### 5c. Add GST/HST disclosure

At the bottom of the category product grid, add:

```tsx
<p className="text-xs text-muted-foreground text-center mt-8">
  All prices in Canadian dollars (CAD). GST/HST will be added at checkout based on your province.
</p>
```

---

## Step 6: Add "CAD" Suffix to Price Formatting

**File:** `artifacts/qb-portal/src/lib/products.ts`

Currently `formatPrice` returns `"$149.00"`. Per the PRD (FR-06.4), all prices should include "CAD" context. However, adding "CAD" to every `formatPrice` call would be too repetitive on cards where "CAD" is already contextually clear.

Instead, add a new helper function:

```tsx
export function formatPriceCAD(cents: number): string {
  return `$${(cents / 100).toFixed(2)} CAD`;
}
```

Use `formatPriceCAD` on:
- The service detail page hero price (the main price display)
- The home page hero "starting at" price
- The home page comparison table NexFortis column

Keep `formatPrice` (without CAD) for catalog cards and other compact displays where "CAD" context is already present via the page-level disclosure.

---

## Step 7: Verify and Commit

1. Run `pnpm typecheck` from the repo root — fix any TypeScript errors
2. Test in the Replit preview:
   - **Catalog page:**
     - Every product card shows "Launch Special" badge when promo is active
     - Subscription products show "/mo" pricing (e.g., "$25.00/mo" with "$49.00/mo" strikethrough)
     - Volume packs show per-conversion rate (e.g., "$65.00/conversion")
     - Zero-results message mentions support@nexfortis.com
     - GST/HST disclosure appears at the bottom
   - **Home page:**
     - Hero shows "Launch Special — 50% Off All Services" banner
     - "Starting at" price is $75.00 CAD (not $149)
     - Featured services show both launch and strikethrough prices
     - Featured services include: Standard Conversion (Most Popular), Audit Trail + CRA Bundle (Best Value), 5-Pack (For Accountants)
     - Comparison table footnote about CAD/USD is present
   - **Service detail page:**
     - "Launch Special — 50% Off" badge appears
     - Subscription pages show "/mo" suffix and "Launch rate for first 3 months" footnote
     - Volume pack pages show per-conversion effective price
     - 10-Pack page mentions "Guaranteed 30-Minute turnaround"
     - Trust badge row (Money-Back Guarantee, All Prices CAD, GST/HST) is visible
   - **FAQ page:**
     - Category filter tabs are visible (All, Conversion, Data Services, Migration, Support, Volume, General)
     - Clicking a tab filters the FAQ list correctly
     - Counts are accurate on each tab
   - **Category page:**
     - Promo banner appears when promo is active
     - Conversion Services page has "Accountant or bookkeeper?" Volume Packs banner
     - GST/HST disclosure at bottom
3. Grep for any remaining issues:
   - `grep -r "price_cad" artifacts/qb-portal/src/` — should only show field names in products.ts types, not hardcoded prices
   - `grep -rn "\\$149\\b" artifacts/qb-portal/src/` — check that $149 only appears as a strikethrough/original price, never as the primary active price
   - `grep -rn "hassansadiq73" artifacts/qb-portal/` — should return zero results
   - `grep -rn "coming.soon\|Coming Soon" artifacts/qb-portal/src/` — should return zero results
   - `grep -rn "\->" artifacts/qb-portal/public/products.json` — should return zero results (all arrows should be `→`)
   - `grep -rn "\-\-" artifacts/qb-portal/public/products.json` — should return zero results (all dashes should be `—`)
4. Commit all changes:
```bash
git add -A
git commit -m "feat: enhance catalog UI with promo badges, /mo pricing, volume per-conversion rates, FAQ tabs, home page promo banner"
git push -u origin feat/catalog-ui-promo-display
```
5. Create a PR against `main` with title: "Feat: Catalog UI — Promo Display, Product Cards, Home Page, FAQ Tabs"

---

## Constraints

- Do NOT modify any files in `docs/` — documentation is managed separately
- Do NOT modify `artifacts/api-server/` — backend changes come in a separate PR
- Do NOT modify `artifacts/nexfortis/` — main site changes come later
- Do NOT modify `lib/db/` or `lib/api-spec/` — schema changes come later
- Do NOT add new pages or routes — this PR only enhances existing pages
- Do NOT change any product data in `products.json` — the catalog data is already correct from PR #2/#3
- Do NOT modify the order form's submission logic — order flow updates are in Prompt 04
- Do NOT change any API endpoints
