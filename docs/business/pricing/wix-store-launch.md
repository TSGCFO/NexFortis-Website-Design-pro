# Wix Store Launch — Productized Service & Pricing Memo

**Status:** v1 (internal) · **Owner:** Hassan Sadiq, NexFortis IT Solutions
**Use:** Internal pricing reference for the productized "Wix Store Launch"
service. The first sale (to Justyna, Etobicoke ON) applies a documented
first-customer discount; this memo defines the list price the discount
is applied against and explains the math.

---

## 1. Scope: what "Wix Store Launch" is

A fixed-scope engagement that turns an **existing Wix site (Premium plan
already paid by the customer)** into a working **Wix-native online store**
that can take a real order from a real customer on the day of handoff.

### In scope (every tier)
- Confirm the customer's Wix Premium plan supports e-commerce (**Core**
  or above). If they're on **Light**, flag the upgrade as a prerequisite
  and pause until resolved.
- Enable the **Wix Stores** app on the existing site.
- Add a **Shop** page to the site navigation; light theme polish so the
  shop matches the existing look (colour, font, button shape).
- Configure **Wix Payments** in the customer's name (KYC, payout bank
  account). Add a manual "pay on pickup / e-transfer" option as a
  fallback.
- Add the customer's products with: name, description, price, photos
  (provided by customer), inventory count, weight (if shippable), and
  one variant axis (size or colour) where applicable.
- Configure **shipping** (flat rate to Canada at minimum) and **tax**
  (GST/HST based on the customer's province of registration).
- Configure the **checkout flow**: order confirmation email content,
  thank-you page text, store policies (shipping, returns, privacy)
  populated from a NexFortis template the customer can edit.
- One **30-minute live training session** on how to add a product,
  fulfil an order, refund, and view sales reports. Recording delivered.
- A **post-launch support window** (length depends on tier) for
  small fixes and "how do I…?" questions, async over email.

### Out of scope (every tier — chargeable as add-ons)
- Logo design, brand identity, photography, copywriting.
- Image editing or background removal beyond light cropping.
- Custom domain DNS work outside Wix's own DNS interface.
- Migrating an existing store from another platform (Shopify, Square,
  Etsy export). The store is built fresh.
- Shipping integrations beyond Wix's built-in flat-rate / by-weight
  rules (e.g., Canada Post / ShipStation / EasyPost API).
- POS hardware setup (Wix Retail / Tap to Pay / Square reader).
- Marketing automation beyond the default abandoned-cart email
  toggle (no Klaviyo, no ad campaigns, no SEO copy beyond the page
  titles Wix auto-generates).
- Multi-currency, multi-language, or wholesale / B2B pricing tiers.
- Custom Velo code.

### Stop-line (scope creep guard)
The build is "done" when the customer can place a test order against
their own published store, the order appears in their Wix dashboard,
the confirmation email arrives, and the test charge can be refunded.
Anything past that is a change order at the published add-on rates.

---

## 2. Effort estimate

Hours per phase, low / likely / high. The "likely" column drives the
fixed price.

| Phase                                          | Low | Likely | High |
| ---------------------------------------------- | --: | -----: | ---: |
| Kickoff & access handover                      | 0.5 |    1.0 |  1.5 |
| Wix plan + Stores app verification             | 0.5 |    0.5 |  1.0 |
| Theme/shop page polish                         | 1.0 |    1.5 |  2.5 |
| Product entry (~10 SKUs, customer-supplied)    | 1.5 |    2.5 |  4.0 |
| Payments + tax + shipping config               | 1.5 |    2.0 |  3.0 |
| Checkout flow & policies                       | 0.5 |    1.0 |  1.5 |
| Test orders + refunds + bug fixes              | 0.5 |    1.0 |  2.0 |
| Training session + recorded walkthrough        | 1.0 |    1.0 |  1.5 |
| Project mgmt, comms, scheduling                | 0.5 |    1.0 |  1.5 |
| **Build subtotal (likely)**                    |     | **11.5 h** |   |
| Post-launch async support (Standard, 14 days)  | 0.5 |    1.5 |  3.0 |

So a **Standard** build lands at ~13 hours likely, with a low/high band
of 8.5 / 21.5 hours. The fixed price has to absorb the high case at an
acceptable margin or the package is mispriced.

---

## 3. Market rate research (Toronto + Canada, 2025–2026)

15+ data points captured below. All figures normalized to **CAD** at
**1 USD ≈ 1.36 CAD** where the source quoted USD. Sources: web research
across Wix Marketplace pricing pages, Upwork Canada freelancer pages,
Fiverr gig listings, and published Canadian agency / freelancer rate
guides.

### A. Project / package prices for "basic Wix store setup"

| # | Source / provider                             | Scope                                              | Price (CAD)        |
| - | --------------------------------------------- | -------------------------------------------------- | ------------------ |
| 1 | Toronto freelancer guide — basic store        | Template customization, 10–20 products, basic pay  | **$700 – $1,500**  |
| 2 | Toronto freelancer guide — standard build     | Custom design, catalog, shipping, contact forms    | **$1,500 – $3,500**|
| 3 | Toronto freelancer guide — advanced build     | Custom branding, 50+ products, apps, SEO, blog     | **$3,500 – $6,500**|
| 4 | Wix Marketplace partner avg (web designer)    | Hourly                                             | **~$102/hr** (US$75)|
| 5 | Wix Marketplace partner — freelancer project  | Project, varies                                    | **$680 – $4,080+** |
| 6 | Fiverr — `claire_wendy` (Wix design/store)    | "Wix design / redesign / e-commerce"               | **~$20** (US$15) start |
| 7 | Fiverr — `optiquest_2`                        | Wix store with products/payments/shipping          | **~$41** (US$30) start |
| 8 | Fiverr — `simmion12` (Wix dropshipping)       | Custom-designed Wix store (dropship)               | **~$68** (US$50) start |
| 9 | Fiverr — `cholehutchison2`                    | Shopify/Wix store + SEO + fixes                    | **~$109** (US$80) start |
|10 | Fiverr — `natalierichard7`                    | Wix/Shopify website redesign                       | **~$109** (US$80) start |

### B. Hourly rates — Wix / web freelancers (Canada)

| #  | Source                                               | Tier                          | Hourly (CAD)         |
| -- | ---------------------------------------------------- | ----------------------------- | -------------------- |
| 11 | Upwork Canada — entry-level Wix dev                  | Junior (1–2 yrs)              | **$27 – $68**        |
| 12 | Upwork Canada — mid-level Wix dev                    | Mid (3–5 yrs)                 | **$68 – $136**       |
| 13 | Upwork Canada — senior / Velo                        | Senior (5+ yrs)               | **$136 – $272**      |
| 14 | Wix Marketplace — design hourly avg                  | Design                        | **~$102** (US$75)    |
| 15 | Wix Velo / custom dev                                | Custom dev                    | **$68 – $204**       |
| 16 | Toronto freelancer benchmark (general web)           | All tiers blended             | **$60 – $150**, avg ~$100 |
| 17 | Upwork median for "Wix developer" globally           | Median                        | **~$27** (US$20)     |
| 18 | Toronto agency rate                                  | Agency                        | **$135 – $270+**     |

### C. Bands

- **Low (Fiverr global / commodity):** ~$20 – $200 CAD per project.
  Foreign sellers, template-driven, near-zero customer service, no
  in-region presence, no GST/HST receipt for the customer.
- **Mid (Toronto/Canadian individual freelancer):** ~$700 – $2,500 CAD
  per project for an existing-site store-on plant, or ~$60 – $130 CAD/hr.
- **High (small Toronto agency):** ~$2,500 – $6,500 CAD per project,
  or ~$135 – $270/hr.

### D. Where NexFortis sits in the band

NexFortis is **not** competing with the Fiverr commodity band — that
band sells unsupported templates to international buyers; NexFortis
sells outcomes to a local SMB that wants a phone number to call. The
Fiverr column is in this memo for context, not as a price ceiling.

The honest competitive set is the **mid band: Toronto / Canadian
individual freelancers and small studios** quoting $700–$2,500 for
"set up the Wix store on my existing site." Within that band, NexFortis
should price toward the **mid-to-upper third** for these reasons:

- Registered Canadian corporation (17756968 Canada Inc.), not an
  unincorporated freelancer — the customer gets a real invoice with
  HST and corporate liability.
- Multi-disciplinary IT firm credentials (Microsoft AI Cloud Partner,
  Google Partner, QuickBooks ProAdvisor) — overkill for a Wix store
  but real signal that the operator won't disappear.
- In-region: Etobicoke / GTA, can do an in-person handoff if needed.
- Productized, fixed-scope, fixed-price quote — not "discovery, then
  we'll see" hourly billing.

But it should price below the agency band because NexFortis does not
yet have a public Wix portfolio to justify agency rates.

**Positioning sentence:** *"A Toronto-area IT firm that ships your
Wix store at a fixed price, gives you a real invoice, and answers
when you call. Faster than an agency, more accountable than a
$50 Fiverr gig."*

---

## 4. Cost & margin model

### Blended labour cost
Set the internal cost-of-time at **$60/hr CAD**. This is the floor of
the Toronto freelancer band — it represents the opportunity cost of
the operator's time on a Wix engagement vs. higher-margin QuickBooks
work. Below $60/hr the engagement is destroying value vs. selling QB
Portal hours; above $60/hr the model still leaves room for a discount.

### Wix-specific tooling cost
**$0** — all build work happens inside the customer's existing Wix
account using their existing plan. Wix Payments processing fees
(2.9% + $0.30 per card transaction) are pass-through on the customer's
own merchant account, never on NexFortis's books.

### Per-tier margin math

| Tier        | Likely h | Cost @ $60/h | Fixed price (CAD) | Gross margin $ | Gross margin % |
| ----------- | -------: | -----------: | ----------------: | -------------: | -------------: |
| Lean        |     8.0  |       $480   |        **$750**   |         $270   |        **36%** |
| Standard    |    13.0  |       $780   |      **$1,250**   |         $470   |        **38%** |
| Standard+   |    19.0  |     $1,140   |      **$1,950**   |         $810   |        **42%** |

If the engagement runs to the **high end** of the hour estimate, the
margin compresses but stays positive:

| Tier        | High h | Cost @ $60/h | Fixed price | Gross margin $ | Gross margin % |
| ----------- | -----: | -----------: | ----------: | -------------: | -------------: |
| Lean        |  11.5  |       $690   |        $750 |          $60   |          **8%**|
| Standard    |  18.0  |     $1,080   |      $1,250 |         $170   |         **14%**|
| Standard+   |  26.0  |     $1,560   |      $1,950 |         $390   |         **20%**|

The **Lean** tier is intentionally tight — it has to be priced as the
"cheap" option to anchor against Fiverr's perceived savings, but it
exists to upsell the customer to **Standard**. Standard is the
recommended default tier and the one to lead the conversation with.

### Add-on rate card (CAD, fixed unit prices)

| Add-on                                                            | Unit              | Price (CAD)          |
| ----------------------------------------------------------------- | ----------------- | -------------------- |
| Extra products beyond tier limit                                  | per product       | **$15**              |
| Photo touch-up (crop, background remove, resize)                  | per image         | **$10**              |
| Product copywriting (50–100 words)                                | per product       | **$25**              |
| Additional payment method (PayPal, Afterpay, manual transfer)     | per method        | **$75**              |
| Shipping zone beyond Canada flat rate (e.g., US, intl by weight)  | per zone          | **$95**              |
| Wix SEO basics for shop pages (titles, meta, alt text)            | one-time          | **$195**             |
| Abandoned-cart automation copy + setup (where Wix supports)       | one-time          | **$125**             |
| Post-launch retainer hours (async, 30-day expiry)                 | per hour          | **$95** (5h: $425)   |
| Rush turnaround (<5 business days from kickoff to handoff)        | flat              | **+25% of tier**     |
| In-person handoff (within GTA, ≤ 50 km of Etobicoke)              | flat              | **$150**             |

---

## 5. The three productized tiers

All prices in CAD. **Plus HST.** Fixed-price, fixed-scope.

### Lean — **$750**
*"Get me selling, fast."*
- Up to **5 products**, customer supplies photos and copy.
- Wix Payments only (single processor).
- Flat-rate shipping to Canada only. No international.
- HST/GST configured for **one province** of registration.
- 30-min live training, recording delivered.
- **7 days** of post-launch async email support.
- Turnaround: **5–7 business days** from kickoff.

### Standard — **$1,250** *(recommended default)*
*"Launch the store properly."*
- Up to **15 products**.
- Wix Payments + one alternative method (PayPal **or** manual
  e-transfer).
- Canada-wide shipping with by-weight rules.
- HST/GST configured per the customer's province.
- Light theme polish to match existing brand.
- 60-min live training + recording + 1-page printable cheat sheet.
- **14 days** of post-launch async email support.
- Turnaround: **7–10 business days** from kickoff.

### Standard+ — **$1,950**
*"Launch the store and don't think about it for a month."*
- Up to **30 products**.
- Wix Payments + up to two alternative methods.
- Canada + US shipping zones with by-weight rules.
- Full provincial tax configuration.
- Wix SEO basics for shop pages (titles, meta, alt text).
- Abandoned-cart email enabled (where Wix's plan supports it).
- 90-min live training + recording + cheat sheet.
- **30 days** of post-launch async email support, plus a **15-min
  check-in call** at day 14.
- Turnaround: **10–14 business days** from kickoff.

### Excluded from every tier (will be quoted as add-ons)
Product photography, copywriting, logo or brand design, custom Velo
code, migrating products from another platform, POS hardware,
multi-currency / multi-language, marketing-automation tools beyond
Wix's defaults.

---

## 6. Justyna — first-customer proposal

### What she asked for
Wix is already her platform: she has a basic Wix site live with an
**annual Premium plan**, hosting and domain on Wix. She tried to set
up the **built-in Wix store herself and couldn't**. On the Monday
discovery call she asked NexFortis to set up the store; she emailed
the same week asking for a **written proposal with pricing**. She is
in **Etobicoke (M8Y 1T9)**, has a 5.0 Kijiji rating from her own
customers, and offered a "small fee plus ad credit."

### Recommended package
**Standard ($1,250)** is the right fit. She has an existing site, she
needs the store working end-to-end (payments, shipping, tax), and she
will benefit from the longer training + 14-day support window because
she has already tried this herself and stalled.

Lean is too thin — the 7-day support window will end before she's
filled her catalogue. Standard+ is over-spec for an unproven first
sale.

### First-customer discount

| Line item                                              | CAD          |
| ------------------------------------------------------ | -----------: |
| Wix Store Launch — Standard tier                       |   **$1,250** |
| **First-Customer Launch Discount (–30%)**              |  **–$ 375**  |
| **Subtotal**                                           |    **$ 875** |
| HST (13% ON)                                           |     $ 113.75 |
| **Total (CAD)**                                        |  **$ 988.75**|

The discount is shown as a **visible line item** on the proposal so
Justyna sees the favour, not a low list price. This protects the
$1,250 list for the next customer.

**Why 30%, not 50%:**
- 50% off lands at **$625**, which is *below* the Lean list price and
  trains the next prospect to expect that floor when they hear about
  the deal from Justyna.
- 30% off lands at **$875** — still meaningfully cheap (cheaper than
  the bottom of the Toronto basic-build band's $700–$1,500 range
  before tax) but stays *above* the Lean list. The story to the next
  prospect is "Standard, with a one-time launch discount."
- Margin at $875 against the **likely** 13h estimate: $875 – $780 =
  **$95 (11%)**. Margin at the **high** 18h: $875 – $1,080 = **–$205**.
  The negative-margin risk is the price of buying a testimonial; it is
  capped because the build hits the high case only if scope creeps,
  which the Stop-Line in §1 prevents.

### What NexFortis gets in return (non-cash)
Spelled out in the proposal, conditional on Justyna being happy with
the work:

1. **Written testimonial** — 3–5 sentences, with her name, business
   name, and (optionally) a headshot or store screenshot.
2. **Case-study permission** — NexFortis may publish a public case
   study referencing her store on `nexfortis.com` and in marketing
   materials, with her business name and store URL.
3. **Up to two referral introductions** to other Etobicoke / GTA
   small-business owners who could use a similar store launch.

These are framed as "in exchange for the launch discount," not as a
contingency on payment. Payment is owed regardless.

### Payment terms
- **50% deposit ($437.50 + HST)** to start, balance on handoff.
- E-transfer to a NexFortis billing address, or Stripe invoice
  (NexFortis covers processing fee on the e-transfer; on Stripe it's
  pass-through).
- Quote validity: **14 days** from email date.

### Timeline
- Acceptance + deposit → kickoff within **3 business days**.
- Kickoff → handoff: **7–10 business days** (Standard turnaround).
- Total elapsed time, signature to live: **~2 weeks** assuming Justyna
  delivers product photos and policy text within 3 business days of
  kickoff.

### Assumptions the quote depends on (re-quote if any change)
1. Her existing Wix Premium plan is **Core or higher** (e-commerce
   capable). If she's on **Light**, she has to upgrade Wix
   (~$40 CAD/mo) before kickoff — that is her cost, not NexFortis's.
2. She has **≤ 15 products**, with photos and descriptions ready.
3. She wants to ship **within Canada only** at flat rate.
4. She is registered for HST in Ontario (or has a clear answer on tax
   collection).
5. She uses **Wix Payments** as the primary processor (no Square /
   Clover / Moneris integration).
6. She does **not** need migration from an existing storefront on
   another platform.
7. No custom Velo code is required.

If any of (1)–(7) is false, NexFortis will re-quote within 2 business
days at the published add-on rates and Justyna can decide.

---

## 7. The "ad credit" question — recommendation: **decline**

Justyna offered "small fee plus ad credit." NexFortis should **decline
the ad-credit portion** for V1 and take cash only. Reasons:

1. **Hard to value.** Her ad spend is in her business; NexFortis would
   be accepting a discount on advertising it does not actually run
   today. There is no liquid market price for "credit at Justyna's
   shop." Accepting this requires negotiating an exchange rate, which
   is more work than the discount itself.
2. **NexFortis isn't running paid acquisition yet.** Even if the credit
   were against her own products, NexFortis has nowhere to spend it.
   Trading hours for inventory is a barter, not revenue.
3. **Accounting headache.** Barter is taxable in Canada at fair market
   value on both sides. NexFortis would owe HST on the deemed value
   of the credit, the same as cash, but with no cash to pay it from.
4. **Negotiation anchor.** Cash is the cleanest signal that the work
   has a price. Once any portion of payment becomes credit, the next
   customer will assume the same is on offer.

**What to say to her:** "Thanks for offering, but to keep things
simple I'll keep this on a straight cash quote — and I've put a
launch discount on it instead so the cash number works for you. If
you ever do refer me to another business owner, that's worth a lot
more than ad credit to me."

---

## 8. Risk & assumption log

| Risk                                                    | Likelihood | Impact | Mitigation                                                                 |
| ------------------------------------------------------- | :--------: | :----: | -------------------------------------------------------------------------- |
| Customer is on Wix Light (no e-commerce)                |    Med     |  High  | Verify on kickoff call; upgrade is on customer.                            |
| Product photos not ready / wrong aspect ratio           |    High    |  Med   | Add-on for touch-up at $10/image; pause clock if photos missing > 5 days.  |
| Customer wants Square / Clover / Moneris instead of Wix Payments | Med | Med   | Add-on at $75/method; some integrations require Wix Business plan upgrade. |
| Customer wants product migration from another store     |    Low     |  High  | Out of scope; quote separately at hourly.                                  |
| Custom domain DNS surprise (split DNS, MX records)      |    Low     |  Med   | Stay inside Wix's DNS UI; refer customer to Wix support if domain breaks.  |
| Scope creep ("can you also redesign the homepage?")     |    High    |  Med   | Stop-Line in §1; written change order at add-on rates.                     |
| Customer dissatisfaction & refund request               |    Low     |  High  | 50% deposit is non-refundable once kickoff happens; balance disputable.    |
| Tax collection setup wrong (wrong province registered)  |    Med     |  Med   | Customer signs off on tax config in writing before launch.                 |

---

## 9. Decision rationale (one paragraph)

The Standard tier sits in the lower-middle of the Toronto $700–$3,500
basic Wix-store band. The Lean tier exists to anchor against the
"$50 Fiverr gig" perception and to make Standard look reasonable.
Standard+ is the upsell, not the default. Margin at the **likely**
hours is 36–42% across all three tiers — defensible without being
greedy. Justyna's first-customer discount of 30% is the largest
discount NexFortis should ever offer publicly; it's calibrated to make
her the cheapest-ever sale without setting a permanent floor below
the Lean list. The discount is recorded as a **visible line item** so
the favour is named and the regular price is preserved for the next
prospect. Cash only, no barter — the testimonial and the case-study
permission are the non-cash side of the trade and they're enough.

---

## 10. After Justyna — recommended follow-ups

These are not in this engagement; they belong in the project task
queue once Justyna is delivered:

1. Stand up a **`/services/wix-store-launch`** page on
   `nexfortis.com` with the three tiers and a "Get a Quote" CTA.
2. Apply to be listed on the **Wix Marketplace** as a Toronto-area
   partner once one published case study exists.
3. Draft a **one-page master services agreement** before the second
   sale (covers IP, refund policy, change-order process). The current
   "acceptance line at the bottom of the proposal" is fine for V1, not
   for V3.
4. Add a **promo code on the QB Portal admin** for the Justyna
   referral pipeline so referred prospects get a small thank-you.
