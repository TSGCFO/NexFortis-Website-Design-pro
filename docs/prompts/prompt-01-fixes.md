# Prompt 01 Fixes — 24 Issues from E2E Review

**Branch:** `fix/prompt-01-e2e-issues`
**Scope:** Only modify files in `artifacts/qb-portal/`. Do NOT modify `docs/`, `artifacts/api-server/`, `artifacts/nexfortis/`, or `lib/`.

These are bugs and content issues found during end-to-end testing of the PR #2 merge. Fix all 24 issues in order.

---

## Step 0: Branch

The branch `fix/prompt-01-e2e-issues` has already been created and pushed. You are working in it. Do NOT run `git checkout`.

---

## Step 1: Fix products.json Special Characters

**File:** `artifacts/qb-portal/public/products.json`

1a. In the `name` field of these products, replace `->` with `→` (Unicode right arrow U+2192):
- Product ID 1: `"Enterprise -> Premier/Pro Standard"` → `"Enterprise → Premier/Pro Standard"`
- Product ID 2: `"Enterprise -> Premier/Pro Complex"` → `"Enterprise → Premier/Pro Complex"`
- Product ID 14: `"AccountEdge/MYOB -> QuickBooks"` → `"AccountEdge/MYOB → QuickBooks"`
- Product ID 15: `"Sage 50/Simply Accounting -> QuickBooks"` → `"Sage 50/Simply Accounting → QuickBooks"`

1b. In the `name` field of these products, replace `--` with `—` (Unicode em dash U+2014):
- Product ID 16: `"QB Expert Support -- Essentials"` → `"QB Expert Support — Essentials"`
- Product ID 17: `"QB Expert Support -- Professional"` → `"QB Expert Support — Professional"`
- Product ID 18: `"QB Expert Support -- Premium"` → `"QB Expert Support — Premium"`

1c. Fix the `promo_label` field:
- Change `"Launch Special -- 50% Off"` to `"Launch Special — 50% Off"`

1d. Also in products.json: the three add-on products (File Health Check id=4, Rush Delivery id=5, Post-Conversion Care id=6) currently have `"requires_service": null`. This needs to stay null for now (we'll handle add-on association differently), BUT the `description` field for each should include which services they complement. Verify descriptions are accurate:
- File Health Check: pre-conversion integrity report
- Rush Delivery: priority queue processing (NOT "15 minutes")
- Post-Conversion Care: 30-day post-conversion support

---

## Step 2: Rewrite FAQ Content

**File:** `artifacts/qb-portal/src/pages/faq.tsx`

The FAQ `faqData` array (lines 5-36) contains heavily stale content from the old 54-product catalog. Replace the ENTIRE `faqData` array with the corrected version below. Keep the component code (lines 38-99) unchanged.

Replace lines 5-36 with:

```typescript
const faqData = [
  { cat: "Conversion", q: "What is a .QBM file?", a: "A .QBM (QuickBooks Portable Company File) is a compact version of your company file that contains all your financial data but in a smaller, transportable format. It's created through File > Create Copy > Portable company file in QuickBooks Enterprise." },
  { cat: "Conversion", q: "How do I create a .QBM file from QuickBooks Enterprise?", a: "Open your company file in QuickBooks Enterprise, go to File > Create Copy, select 'Portable company file (.QBM)', click Next, choose a save location, and QuickBooks will create the file. The typical size is 5–30 MB." },
  { cat: "Conversion", q: "What QuickBooks versions are supported?", a: "We support QuickBooks Enterprise versions 2019 through 2024 for conversion to Premier or Pro. The file must be a Canadian edition." },
  { cat: "Conversion", q: "Is all my data preserved during conversion?", a: "Yes. Our conversion process is penny-perfect — all transactions, chart of accounts, customer/vendor lists, inventory, payroll data, and balances are preserved exactly. You receive a validation report confirming data integrity." },
  { cat: "Conversion", q: "What about GST/HST tax codes?", a: "All Canadian tax codes including GST, HST, PST, and QST are fully preserved during conversion. This is a key advantage of our Canadian-first service." },
  { cat: "Conversion", q: "Does the conversion handle multi-currency files?", a: "Yes, multi-currency settings and transactions are preserved during conversion. If you want multi-currency removed, our Multi-Currency Removal service is available starting at $75 CAD (launch special, reg. $149)." },
  { cat: "Conversion", q: "How long does the conversion take?", a: "Standard conversion is completed in under 1 hour. With our Rush Delivery add-on ($25 with launch special), your file gets priority queue processing for even faster turnaround." },
  { cat: "Conversion", q: "How is my data kept secure?", a: "Your file is encrypted during upload using 256-bit SSL/TLS. We process files on secure, access-controlled systems and delete all customer files within 7 days per our privacy policy. We are PIPEDA compliant." },
  { cat: "Conversion", q: "What if the conversion fails?", a: "If we are unable to convert your file for any technical reason, you receive a full refund. No questions asked. We'll also explain what went wrong and suggest alternatives." },
  { cat: "Conversion", q: "Can you convert US QuickBooks files?", a: "We can attempt conversion of US edition files, but our service is optimized for Canadian editions. We'll note in your delivery email if the file appears to be a US edition." },
  { cat: "Conversion", q: "What if I upload the wrong file type?", a: "If you upload a .QBB (backup) or .QBW (working file) instead of a .QBM, we'll send you step-by-step instructions to create the correct file type. Your order is not refunded — simply re-upload the correct file." },
  { cat: "Conversion", q: "What's the difference between Enterprise and Premier?", a: "QuickBooks Enterprise supports up to 1 million list items, advanced inventory, and more concurrent users. Premier has a limit of 14,999 list items and fewer advanced features. Some Enterprise-only features will not be available after conversion." },
  { cat: "Conversion", q: "What is the Premier list limit?", a: "QuickBooks Premier supports a maximum of 14,999 items per list (customers, vendors, items, etc.). If your Enterprise file exceeds this, you may need our List Reduction service ($40 with launch special) before conversion." },
  { cat: "Conversion", q: "Do I need a Premier/Pro licence to use the converted file?", a: "Yes, you'll need a valid QuickBooks Premier or Pro licence to open and use the converted file. The conversion changes the file format but doesn't include software licences." },
  { cat: "Conversion", q: "What Enterprise-only features will I lose?", a: "Features exclusive to Enterprise like advanced inventory, advanced pricing, custom user permissions beyond Premier's level, and certain reports will not be available in Premier/Pro. Core accounting features are fully preserved." },
  { cat: "Conversion", q: "How do I restore the converted .QBM file?", a: "Open QuickBooks Premier or Pro, go to File > Open or Restore Company, select 'Restore a portable file (.QBM)', browse to the converted file, choose a save location, and QuickBooks will restore it." },
  { cat: "Conversion", q: "What's your refund policy?", a: "We offer a full refund if we cannot technically complete the conversion. Refunds for incompatible files (wrong edition, already Premier) are also provided. We do not refund for wrong file types (.QBB, .QBW) — we'll help you upload the correct format." },
  { cat: "Conversion", q: "How does your pricing compare to competitors?", a: "Our core conversion starts at $75 CAD (launch special) vs. Big Red Consulting at $249 USD (~$344 CAD) and E-Tech at $299 USD (~$413 CAD). We're also significantly faster — under 1 hour vs. next business day." },
  { cat: "Conversion", q: "Can I convert Premier to Enterprise?", a: "No, our service currently only supports Enterprise-to-Premier/Pro conversion. Converting from Premier to Enterprise requires purchasing a QuickBooks Enterprise licence from Intuit." },
  { cat: "Data Services", q: "What is the File Health Check?", a: "The File Health Check ($25 with launch special, reg. $49) is an add-on that provides a comprehensive pre-conversion integrity report. It identifies potential data issues, verifies list counts, validates balances, and confirms your file is ready for conversion." },
  { cat: "Data Services", q: "What does Audit Trail Removal do?", a: "Audit Trail Removal ($50 with launch special, reg. $99) removes the internal audit trail history from your QuickBooks file, significantly reducing file size and improving performance. This is recommended for files with years of transaction history." },
  { cat: "Data Services", q: "What is Super Condense?", a: "Super Condense ($50 with launch special, reg. $99) dramatically reduces your QuickBooks file size by condensing old transactions while preserving essential summary data. This is ideal for files that have become slow due to years of data accumulation." },
  { cat: "Data Services", q: "What is a CRA Period Copy?", a: "CRA Period Copy ($50 with launch special, reg. $99) creates a copy of your QuickBooks data for a specific time period, formatted for CRA (Canada Revenue Agency) audit compliance and archival purposes." },
  { cat: "Data Services", q: "What is the Audit Trail + CRA Period Copy Bundle?", a: "The bundle ($75 with launch special, reg. $149) combines Audit Trail Removal and CRA Period Copy into a single discounted package. If you need both services, the bundle saves you money compared to ordering them separately." },
  { cat: "Data Services", q: "What is QBO Readiness Report?", a: "The QBO Readiness Report ($25 with launch special, reg. $49) analyzes your QuickBooks Desktop file and provides a detailed assessment of what data can and cannot migrate to QuickBooks Online, along with recommended steps to prepare your data." },
  { cat: "Data Services", q: "What is Multi-Currency Removal?", a: "Multi-Currency Removal ($75 with launch special, reg. $149) safely removes multi-currency settings from your QuickBooks file. This is recommended when multi-currency was enabled by mistake or is no longer needed. Processing takes 1–2 business days." },
  { cat: "Data Services", q: "What is List Reduction?", a: "List Reduction ($40 with launch special, reg. $79) reduces the number of items in your QuickBooks lists (customers, vendors, items, etc.) to bring them within Premier/Pro limits. Essential if your Enterprise file exceeds the 14,999 list item limit." },
  { cat: "Migration", q: "Can you migrate from AccountEdge/MYOB to QuickBooks?", a: "Yes! Our AccountEdge/MYOB to QuickBooks migration ($125 with launch special, reg. $249) transfers your chart of accounts, customers, vendors, items, and transaction history. Accepted file formats include .zip, .myo, and .myox. Processing takes 1–2 business days." },
  { cat: "Migration", q: "Can you migrate from Sage 50 to QuickBooks?", a: "Yes! Our Sage 50 / Simply Accounting to QuickBooks migration ($125 with launch special, reg. $249) supports full data migration including chart of accounts, transactions, and contacts. Accepted file formats include .cab, .zip, and .sai. Processing takes 1–2 business days." },
  { cat: "Migration", q: "Do you support migrations from other platforms?", a: "We currently offer migrations from AccountEdge/MYOB and Sage 50 to QuickBooks. Additional platform migrations (NetSuite, Xero, Peachtree, and others) are planned for future releases. Join the waitlist to be notified when your platform is supported." },
  { cat: "Migration", q: "How do you compare to E-Tech for migrations?", a: "Our migration services are priced significantly lower than E-Tech while maintaining the same quality. For example, our QuickBooks conversion starts at $75 CAD (launch special) vs. E-Tech's $299 USD (~$413 CAD)." },
  { cat: "Support", q: "What is QB Expert Support?", a: "QB Expert Support is a monthly subscription service for ongoing QuickBooks Desktop assistance. We offer three tiers: Essentials ($25/mo launch special), Professional ($50/mo launch special), and Premium ($75/mo launch special). All tiers include 1–2 hour response times during business hours." },
  { cat: "Support", q: "What's included in each support tier?", a: "Essentials: 3 tickets/month, 1-hour response, troubleshooting and setup guidance, 1 automated file health check/month. Professional: 10 tickets/month, 1-hour response, data review, custom reporting assistance, 2 file health checks/month. Premium: Unlimited tickets, 30-minute response, dedicated account manager, quarterly file optimization, priority queue for all services." },
  { cat: "Support", q: "Do I need to be a conversion customer to buy support?", a: "No! QB Expert Support is a standalone subscription available to any QuickBooks Desktop user. You don't need to have purchased a conversion or any other service from us." },
  { cat: "Volume", q: "What are Volume Packs?", a: "Volume Packs offer discounted bundles of standard Enterprise → Premier/Pro conversions. The 5-Pack ($325 with launch special, reg. $649) and 10-Pack ($600 with launch special, reg. $1,199) are ideal for accountants and bookkeepers managing multiple client files. Credits are valid for 12 months." },
  { cat: "General", q: "How does the waitlist work?", a: "Enter your email on our waitlist page to be notified when new services launch. You'll only receive emails about services you've specifically signed up for — no spam." },
];
```

**Important:** Change the `cat` values used in the array. The old categories were "Conversion", "Add-Ons", "Migration", "Tools". The new categories are "Conversion", "Data Services", "Migration", "Support", "Volume", "General". This aligns with the actual product categories.

---

## Step 3: Fix Service Detail — Generic "What's Included" Text

**File:** `artifacts/qb-portal/src/pages/service-detail.tsx`

Line 110 currently says:
```tsx
<span className="text-sm">Complete {product.name.toLowerCase()} processing</span>
```

This produces nonsensical text like "Complete qb expert support -- essentials processing" for subscriptions.

Replace the entire `<Card>` block for "What's Included" (lines 104-130) with a version that uses category-aware content. Replace that block with:

```tsx
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold font-display text-primary mb-4">What's Included</h2>
                  <ul className="space-y-3">
                    {product.billing_type === "subscription" ? (
                      <>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{product.description}</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">1–2 hour response time during business hours</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Cancel anytime — no long-term commitment</span>
                        </li>
                      </>
                    ) : product.category_slug === "volume-packs" ? (
                      <>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{product.description}</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Credits valid for 12 months</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Use credits for any standard Enterprise → Premier/Pro conversion</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{product.description}</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Penny-perfect accuracy verification</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Secure file handling (256-bit encrypted, deleted after 7 days)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Email confirmation and delivery notification</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Money-back guarantee if unsatisfied</span>
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>
```

---

## Step 4: Fix Service Detail — Add-ons Not Showing

**File:** `artifacts/qb-portal/src/pages/service-detail.tsx`

Line 48 currently filters add-ons by `requires_service === product.id`, but all add-ons have `requires_service: null` in products.json. Fix this to show add-ons on all conversion service pages.

Change line 48 from:
```tsx
const addons = catalog.services.filter((s) => s.is_addon && s.requires_service === product.id);
```

To:
```tsx
const addons = catalog.services.filter((s) => s.is_addon && product.category_slug === "quickbooks-conversion-services" && !product.is_addon);
```

This shows add-ons (File Health Check, Rush Delivery, Post-Conversion Care) on all non-addon conversion service pages, which is the correct behavior since these add-ons complement any conversion service.

---

## Step 5: Fix Catalog Category Pill Counts

**File:** `artifacts/qb-portal/src/pages/catalog.tsx`

Line 85 currently shows just the category name with no count:
```tsx
{cat}
```

Change it to show the count:
```tsx
{cat} ({allProducts.filter((p) => p.category === cat).length})
```

---

## Step 6: Fix Portal Support Response Time

**File:** `artifacts/qb-portal/src/pages/portal-settings.tsx`

Find the text that says:
```
We'll respond within 4 hours (1 hour for Premium Support)
```

Replace it with:
```
We'll respond within 1–2 hours (30 minutes for Premium Support subscribers)
```

---

## Step 7: Fix Waitlist Page Copy

**File:** `artifacts/qb-portal/src/pages/waitlist.tsx`

The current waitlist page says "new services" (plural) in the heading but "this product" (singular) in the fine print — contradictory. Since all 20 products are already live, update the copy:

- Change the heading/subtitle to something like: "Get Notified About New Services" / "Be the first to know when we launch new QuickBooks services and tools."
- Change the fine print from "We'll only email you about this product. No spam." to "We'll only email you about new service launches. No spam."

---

## Step 8: Verify and Submit

1. Run `pnpm typecheck` — must pass with no errors
2. Test in the Replit preview:
   - Catalog page: verify all product names show `→` and `—` correctly, category pills show counts
   - Any service detail page: verify "What's Included" shows meaningful content (not generic "{name} processing")
   - Enterprise → Premier/Pro Standard detail page: verify add-ons section shows 3 add-ons
   - FAQ page: verify all answers show correct launch prices, no "coming soon" on live products, no references to products not in the catalog
   - Portal support tab (if accessible): verify 1–2 hour response time
3. Commit all changes:
```bash
git add -A
git commit -m "fix: address 24 E2E review issues — FAQ content, special chars, add-ons, category counts, response time"
git push -u origin fix/prompt-01-e2e-issues
```
4. Create a PR against `main` with title: "Fix: 24 E2E Review Issues from Prompt 01"

---

## Constraints

- Do NOT modify any files in `docs/`
- Do NOT modify `artifacts/api-server/` or `lib/`
- Do NOT modify `artifacts/nexfortis/` (main site issues will be addressed in a separate prompt)
- Do NOT add new routes or new pages
- Do NOT change the API or database
