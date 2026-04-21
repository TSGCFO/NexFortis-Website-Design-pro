# NexFortis UTM Tagging Convention

**Status:** Active
**Date opened:** 2026-04-21
**Owner:** Hassan
**Why this exists:** Every paid click, every email link, every social post, and every partner referral should be tagged consistently so GA4 can attribute traffic correctly. Without a written convention, tags drift over time ("google" vs "Google" vs "google_ads") and reports become useless.

---

## The five UTM parameters

| Parameter | Required? | What it means | Allowed values (controlled vocabulary) |
|---|---|---|---|
| `utm_source` | **Yes** | Where the click came from (the platform / site / publisher) | `google`, `bing`, `meta`, `linkedin`, `twitter`, `youtube`, `reddit`, `email`, `newsletter`, `partner-<name>`, `referral-<domain>`, `qr-<location>`, `direct-print` |
| `utm_medium` | **Yes** | The marketing channel / category of traffic | `cpc` (paid search), `display` (paid display banners), `paid-social`, `organic-social`, `email`, `affiliate`, `referral`, `print`, `qr`, `pr`, `sponsorship` |
| `utm_campaign` | **Yes** | The specific campaign / initiative | `lowercase-with-dashes`, kept short. Examples below. |
| `utm_content` | Optional | A/B variant, ad creative, or specific link in a multi-link asset | `headline-a`, `image-vs-video`, `footer-cta`, `sidebar-banner` |
| `utm_term` | Optional | Paid keyword (Google Ads / Bing Ads can auto-populate this) | Use `{keyword}` insertion in Google Ads, otherwise leave blank |

**Rules of the road:**
- Always **lowercase**. `Google` and `google` are different sources to GA4.
- Always **dashes, not underscores or spaces**. `quickbooks-conversion`, not `QuickBooks_Conversion`.
- Never tag internal links between your own pages on `nexfortis.com` or `qb.nexfortis.com` — UTM tags hijack the existing session and ruin attribution.
- Never tag email links to your CRM/portal that you send to existing customers (same reason).
- If you tag emails, tag only marketing/newsletter emails — not transactional ones (receipts, password resets, order confirmations).

---

## Campaign naming convention

Format: `<purpose>-<audience-or-product>-<region-if-relevant>`

Examples:
- `launch-msp-vaughan` — launch campaign, MSP service, Vaughan local
- `launch-quickbooks-canada` — launch, QuickBooks line, all-Canada
- `q2-2026-microsoft365-toronto` — Q2 push, M365, Toronto local
- `blog-promo-quickbooks-online-vs-desktop` — promoting a specific blog post
- `webinar-quickbooks-conversion-may` — driving signups to a specific webinar
- `partner-cpa-firms-q2` — outreach to a partner segment

Keep it under 40 chars when possible — long campaign names get truncated in some reporting views.

---

## Per-channel templates (copy-paste these)

**Google Ads (search):**
```
?utm_source=google&utm_medium=cpc&utm_campaign=<campaign-name>&utm_term={keyword}&utm_content=<ad-group-or-variant>
```
Most of this is set automatically when you enable auto-tagging (`gclid`) — you only need explicit UTMs if you want them visible in GA4 reports without needing the GA4↔Google Ads link.

**Bing / Microsoft Ads (search):**
```
?utm_source=bing&utm_medium=cpc&utm_campaign=<campaign-name>&utm_term={keyword}
```

**Meta (Facebook + Instagram) ads:**
```
?utm_source=meta&utm_medium=paid-social&utm_campaign=<campaign-name>&utm_content=<ad-creative-name>
```

**LinkedIn ads:**
```
?utm_source=linkedin&utm_medium=paid-social&utm_campaign=<campaign-name>&utm_content=<ad-name>
```

**Email (marketing newsletter):**
```
?utm_source=newsletter&utm_medium=email&utm_campaign=<send-name>&utm_content=<link-position>
```
Example: `?utm_source=newsletter&utm_medium=email&utm_campaign=may-2026-monthly&utm_content=hero-cta`

**Organic social posts (LinkedIn, Twitter, etc.):**
```
?utm_source=linkedin&utm_medium=organic-social&utm_campaign=<post-or-theme>
```

**Partner / affiliate referral (e.g., a CPA firm sending you traffic):**
```
?utm_source=partner-acmecpa&utm_medium=referral&utm_campaign=<promotion-or-evergreen>
```

**Print / QR codes (business cards, flyers, brochures):**
```
?utm_source=qr-businesscard&utm_medium=qr&utm_campaign=evergreen-businesscard
```
Use a different `utm_source` per physical location/asset so you can tell which printed asset is producing scans.

**Press / PR placements (when a publication links to you):**
```
?utm_source=referral-<publication-domain>&utm_medium=pr&utm_campaign=<launch-or-feature>
```

---

## Workflow when launching a new campaign

1. Pick the channel(s) the campaign will run on.
2. For each channel, build the destination URL: production page URL + the matching template above, with `<campaign-name>` filled in.
3. Test each link by clicking it once in an incognito tab — verify the page loads, then check GA4 → Realtime → Traffic Sources within 30 seconds; you should see your visit attributed to the correct source/medium/campaign.
4. Save the final URLs in a spreadsheet or notion doc so you can reuse them and so reports stay consistent across the campaign's life.
5. After campaign ends: in GA4 → Reports → Acquisition → Traffic acquisition, filter by `Session campaign = <campaign-name>` to see what it produced.

---

## What NOT to do

- ❌ Don't UTM-tag internal navigation links (button on `/services` that goes to `/contact`).
- ❌ Don't UTM-tag transactional emails (receipts, account notifications, password resets).
- ❌ Don't UTM-tag the `https://qb.nexfortis.com` ↔ `https://nexfortis.com` cross-property links unless you've explicitly set up cross-domain tracking and want to measure that as paid/marketing traffic (it isn't).
- ❌ Don't reuse the same `utm_campaign` value across years — date-stamp them (`q2-2026-`, `nov-2026-`).
- ❌ Don't paste tagged URLs into your sitemap, schema, or organic content. Tagged URLs should only appear in *outbound* marketing artifacts (ads, emails, social posts, print).

---

## Quick URL builder (mental model)

`https://nexfortis.com/<page>?utm_source=<X>&utm_medium=<Y>&utm_campaign=<Z>`

Five-second sanity check before publishing any tagged URL:
1. Is the source in the allowed list above?
2. Is the medium in the allowed list above?
3. Is the campaign name lowercase, dashed, descriptive, and under 40 chars?
4. Does the page actually exist? (Click it.)

If yes to all four, you're done.
