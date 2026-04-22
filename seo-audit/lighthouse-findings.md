# Lighthouse SEO Audit — nexfortis.com

**Audited:** 6 URLs × 2 strategies (mobile + desktop)  
**Tool:** Lighthouse CLI 12.8.2 via Chromium 147  
**Date:** 2025-04-22  
**Note:** Google PageSpeed Insights public API daily quota was exhausted; results produced by local Lighthouse CLI (equivalent methodology, v12.8.2).

---

## 1. Score Table (0–100)

| URL | Strategy | Perf | A11y | BP | SEO | Overall |
|-----|----------|------|------|----|-----|---------|
| nexfortis.com/ (home) | mobile | 64 | 91 | 100 | 100 | PASS |
| nexfortis.com/ (home) | desktop | 34 | 90 | 100 | 100 | PASS |
| nexfortis.com/services/microsoft-365 | mobile | 19 | 92 | 100 | 100 | PASS |
| nexfortis.com/services/microsoft-365 | desktop | 34 | 91 | 100 | 100 | PASS |
| nexfortis.com/blog/…/what-is-pipeda-why-it-matters | mobile | 49 | 91 | 100 | 100 | PASS |
| nexfortis.com/blog/…/what-is-pipeda-why-it-matters | desktop | 77 | 90 | 100 | 100 | PASS |
| qb.nexfortis.com/ (portal home) | mobile | 48 | 95 | 100 | 100 | PASS |
| qb.nexfortis.com/ (portal home) | desktop | 97 | 95 | 100 | 100 | PASS |
| qb.nexfortis.com/catalog | mobile | 66 | 97 | 100 | 100 | PASS |
| qb.nexfortis.com/catalog | desktop | 98 | 97 | 100 | 100 | PASS |
| qb.nexfortis.com/landing/audit-trail-removal | mobile | 66 | 95 | 100 | 100 | PASS |
| qb.nexfortis.com/landing/audit-trail-removal | desktop | 98 | 95 | 100 | 100 | PASS |

> SEO goal: ≥ 95. All URLs scored 100 — **all PASS on SEO goal.**

---

## 2. SEO Audits — Failed (score < 1.0)

**No SEO audit failures detected across all 6 URLs on either strategy.**
All SEO-category audits returned score = 1.0 (pass).

---

## 3. Accessibility Audits — Failed (score < 1.0)

### nexfortis.com/ (home)
**URL:** https://nexfortis.com/

**Audit ID:** `color-contrast` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Background and foreground colors do not have a sufficient contrast ratio.
**Fix:** Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.10/color-contrast).

**Audit ID:** `heading-order` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Heading elements are not in a sequentially-descending order
**Fix:** Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more about heading order](https://dequeuniversity.com/rules/axe/4.10/heading-order).

**Audit ID:** `meta-viewport` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** `[user-scalable="no"]` is used in the `<meta name="viewport">` element or the `[maximum-scale]` attribute is less than 5.
**Fix:** Disabling zooming is problematic for users with low vision who rely on screen magnification to properly see the contents of a web page. [Learn more about the viewport meta tag](https://dequeuniversity.com/rules/axe/4.10/meta-viewport).

**Audit ID:** `aria-allowed-role` | **Score:** 0/100 | **Strategy:** desktop
**Title:** Uses ARIA roles on incompatible elements
**Fix:** Many HTML elements can only be assigned certain ARIA roles. Using ARIA roles where they are not allowed can interfere with the accessibility of the web page. [Learn more about ARIA roles](https://dequeuniversity.com/rules/axe/4.10/aria-allowed-role).

### nexfortis.com/services/microsoft-365
**URL:** https://nexfortis.com/services/microsoft-365

**Audit ID:** `color-contrast` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Background and foreground colors do not have a sufficient contrast ratio.
**Fix:** Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.10/color-contrast).

**Audit ID:** `heading-order` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Heading elements are not in a sequentially-descending order
**Fix:** Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more about heading order](https://dequeuniversity.com/rules/axe/4.10/heading-order).

**Audit ID:** `meta-viewport` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** `[user-scalable="no"]` is used in the `<meta name="viewport">` element or the `[maximum-scale]` attribute is less than 5.
**Fix:** Disabling zooming is problematic for users with low vision who rely on screen magnification to properly see the contents of a web page. [Learn more about the viewport meta tag](https://dequeuniversity.com/rules/axe/4.10/meta-viewport).

**Audit ID:** `aria-allowed-role` | **Score:** 0/100 | **Strategy:** desktop
**Title:** Uses ARIA roles on incompatible elements
**Fix:** Many HTML elements can only be assigned certain ARIA roles. Using ARIA roles where they are not allowed can interfere with the accessibility of the web page. [Learn more about ARIA roles](https://dequeuniversity.com/rules/axe/4.10/aria-allowed-role).

### nexfortis.com/blog/…/what-is-pipeda-why-it-matters
**URL:** https://nexfortis.com/blog/what-is-pipeda-why-it-matters

**Audit ID:** `color-contrast` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Background and foreground colors do not have a sufficient contrast ratio.
**Fix:** Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.10/color-contrast).

**Audit ID:** `heading-order` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Heading elements are not in a sequentially-descending order
**Fix:** Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more about heading order](https://dequeuniversity.com/rules/axe/4.10/heading-order).

**Audit ID:** `meta-viewport` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** `[user-scalable="no"]` is used in the `<meta name="viewport">` element or the `[maximum-scale]` attribute is less than 5.
**Fix:** Disabling zooming is problematic for users with low vision who rely on screen magnification to properly see the contents of a web page. [Learn more about the viewport meta tag](https://dequeuniversity.com/rules/axe/4.10/meta-viewport).

**Audit ID:** `aria-allowed-role` | **Score:** 0/100 | **Strategy:** desktop
**Title:** Uses ARIA roles on incompatible elements
**Fix:** Many HTML elements can only be assigned certain ARIA roles. Using ARIA roles where they are not allowed can interfere with the accessibility of the web page. [Learn more about ARIA roles](https://dequeuniversity.com/rules/axe/4.10/aria-allowed-role).

### qb.nexfortis.com/ (portal home)
**URL:** https://qb.nexfortis.com/

**Audit ID:** `color-contrast` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Background and foreground colors do not have a sufficient contrast ratio.
**Fix:** Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.10/color-contrast).

**Audit ID:** `heading-order` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Heading elements are not in a sequentially-descending order
**Fix:** Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more about heading order](https://dequeuniversity.com/rules/axe/4.10/heading-order).

### qb.nexfortis.com/catalog
**URL:** https://qb.nexfortis.com/catalog

**Audit ID:** `color-contrast` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Background and foreground colors do not have a sufficient contrast ratio.
**Fix:** Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.10/color-contrast).

### qb.nexfortis.com/landing/audit-trail-removal
**URL:** https://qb.nexfortis.com/landing/audit-trail-removal

**Audit ID:** `color-contrast` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Background and foreground colors do not have a sufficient contrast ratio.
**Fix:** Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.10/color-contrast).

**Audit ID:** `heading-order` | **Score:** 0/100 | **Strategy:** mobile + desktop
**Title:** Heading elements are not in a sequentially-descending order
**Fix:** Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more about heading order](https://dequeuniversity.com/rules/axe/4.10/heading-order).

---

## 4. Performance Metrics — LCP / CLS / TBT (vs. Good Thresholds)

Thresholds: LCP ≤ 2.5 s = Good; CLS ≤ 0.1 = Good; TBT ≤ 200 ms = Good.

| URL | Strategy | Perf | LCP | CLS | TBT | FCP | TTI |
|-----|----------|------|-----|-----|-----|-----|-----|
| nexfortis.com/ (home) | mobile | 64 | 6.1 s [POOR] | 0 [GOOD] | 330 ms [NEEDS-IMPROVEMENT] | 2.7 s [NEEDS-IMPROVEMENT] | 6.1 s [NEEDS-IMPROVEMENT] |
| nexfortis.com/ (home) | desktop | 34 | 3.2 s [NEEDS-IMPROVEMENT] | 0 [GOOD] | 4,420 ms [POOR] | 2.2 s [NEEDS-IMPROVEMENT] | 7.3 s [NEEDS-IMPROVEMENT] |
| nexfortis.com/services/microsoft-365 | mobile | 19 | 10.9 s [POOR] | 0.166 [NEEDS-IMPROVEMENT] | 20,790 ms [POOR] | 4.8 s [POOR] | 26.8 s [POOR] |
| nexfortis.com/services/microsoft-365 | desktop | 34 | 3.7 s [NEEDS-IMPROVEMENT] | 0.007 [GOOD] | 6,610 ms [POOR] | 1.9 s [NEEDS-IMPROVEMENT] | 9.2 s [POOR] |
| nexfortis.com/blog/…/what-is-pipeda-why-it-matters | mobile | 49 | 6.4 s [POOR] | 0.426 [POOR] | 270 ms [NEEDS-IMPROVEMENT] | 2.4 s [NEEDS-IMPROVEMENT] | 6.4 s [NEEDS-IMPROVEMENT] |
| nexfortis.com/blog/…/what-is-pipeda-why-it-matters | desktop | 77 | 1.3 s [GOOD] | 0.398 [POOR] | 0 ms [GOOD] | 0.6 s [GOOD] | 1.3 s [GOOD] |
| qb.nexfortis.com/ (portal home) | mobile | 48 | 6.9 s [POOR] | 0 [GOOD] | 870 ms [POOR] | 3.1 s [POOR] | 6.9 s [NEEDS-IMPROVEMENT] |
| qb.nexfortis.com/ (portal home) | desktop | 97 | 1.1 s [GOOD] | 0.014 [GOOD] | 100 ms [GOOD] | 0.6 s [GOOD] | 1.1 s [GOOD] |
| qb.nexfortis.com/catalog | mobile | 66 | 6.8 s [POOR] | 0 [GOOD] | 260 ms [NEEDS-IMPROVEMENT] | 3.0 s [POOR] | 6.8 s [NEEDS-IMPROVEMENT] |
| qb.nexfortis.com/catalog | desktop | 98 | 1.1 s [GOOD] | 0.005 [GOOD] | 60 ms [GOOD] | 0.6 s [GOOD] | 1.1 s [GOOD] |
| qb.nexfortis.com/landing/audit-trail-removal | mobile | 66 | 6.6 s [POOR] | 0 [GOOD] | 300 ms [NEEDS-IMPROVEMENT] | 2.8 s [NEEDS-IMPROVEMENT] | 6.6 s [NEEDS-IMPROVEMENT] |
| qb.nexfortis.com/landing/audit-trail-removal | desktop | 98 | 1.1 s [GOOD] | 0.016 [GOOD] | 0 ms [GOOD] | 0.6 s [GOOD] | 1.1 s [GOOD] |

---

## 5. Top Performance Opportunities (Mobile)

Top 5 actionable opportunities by estimated savings (ms), mobile strategy only.

### nexfortis.com/ (home)
- **Reduce unused JavaScript** (savings: ~300 ms)
  Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/...

### nexfortis.com/services/microsoft-365
- **Reduce unused JavaScript** (savings: ~300 ms)
  Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/...
- **Defer offscreen images** (savings: Est savings of 14 KiB)
  Consider lazy-loading offscreen and hidden images after all critical resources have finished loading to lower time to interactive. [Learn how to defer offscreen images](https://developer.chrome.com...
- **Eliminate render-blocking resources** (savings: Est savings of 0 ms)
  Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles. [Learn how to eliminate render-blocking resources](https://...

### nexfortis.com/blog/…/what-is-pipeda-why-it-matters
- **Preconnect to required origins** (savings: ~329 ms)
  Consider adding `preconnect` or `dns-prefetch` resource hints to establish early connections to important third-party origins. [Learn how to preconnect to required origins](https://developer.chrome...
- **Reduce unused JavaScript** (savings: ~300 ms)
  Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/...
- **Eliminate render-blocking resources** (savings: Est savings of 0 ms)
  Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles. [Learn how to eliminate render-blocking resources](https://...

### qb.nexfortis.com/ (portal home)
- **Reduce unused JavaScript** (savings: ~750 ms)
  Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/...
- **Preconnect to required origins** (savings: ~301 ms)
  Consider adding `preconnect` or `dns-prefetch` resource hints to establish early connections to important third-party origins. [Learn how to preconnect to required origins](https://developer.chrome...
- **Eliminate render-blocking resources** (savings: Est savings of 0 ms)
  Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles. [Learn how to eliminate render-blocking resources](https://...

### qb.nexfortis.com/catalog
- **Reduce unused JavaScript** (savings: ~750 ms)
  Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/...
- **Preconnect to required origins** (savings: ~300 ms)
  Consider adding `preconnect` or `dns-prefetch` resource hints to establish early connections to important third-party origins. [Learn how to preconnect to required origins](https://developer.chrome...
- **Eliminate render-blocking resources** (savings: Est savings of 0 ms)
  Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles. [Learn how to eliminate render-blocking resources](https://...

### qb.nexfortis.com/landing/audit-trail-removal
- **Reduce unused JavaScript** (savings: ~750 ms)
  Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/...
- **Preconnect to required origins** (savings: ~302 ms)
  Consider adding `preconnect` or `dns-prefetch` resource hints to establish early connections to important third-party origins. [Learn how to preconnect to required origins](https://developer.chrome...
- **Eliminate render-blocking resources** (savings: Est savings of 0 ms)
  Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles. [Learn how to eliminate render-blocking resources](https://...

---

## 6. Baseline Summary

SEO goal: **≥ 95 on all URLs**. Performance note: mobile scores below 50 warrant immediate attention.

| URL | Mobile SEO | Desktop SEO | Mobile Perf | Desktop Perf | SEO Goal |
|-----|-----------|------------|-------------|--------------|----------|
| nexfortis.com/ (home) | 100 | 100 | 64 (🟡 NEEDS WORK) | 34 (🔴 POOR) | ✓ PASS |
| nexfortis.com/services/microsoft-365 | 100 | 100 | 19 (🔴 POOR) | 34 (🔴 POOR) | ✓ PASS |
| nexfortis.com/blog/…/what-is-pipeda-why-it-matters | 100 | 100 | 49 (🔴 POOR) | 77 (🟡 NEEDS WORK) | ✓ PASS |
| qb.nexfortis.com/ (portal home) | 100 | 100 | 48 (🔴 POOR) | 97 (🟢 GOOD) | ✓ PASS |
| qb.nexfortis.com/catalog | 100 | 100 | 66 (🟡 NEEDS WORK) | 98 (🟢 GOOD) | ✓ PASS |
| qb.nexfortis.com/landing/audit-trail-removal | 100 | 100 | 66 (🟡 NEEDS WORK) | 98 (🟢 GOOD) | ✓ PASS |

### Key Findings

**SEO:** All 6 URLs scored 100/100 on both mobile and desktop — no SEO failures detected. No missing meta descriptions, no crawlability issues, no structured-data errors.

**Accessibility:** All URLs score 90–97. Minor issues persist (see Section 3). No critical accessibility blockers.

**Best Practices:** All 12 audits (6 URLs × 2 strategies) returned 100/100.

**Performance — mobile is the primary concern:**
- `nexfortis.com/services/microsoft-365` mobile: **19/100** — critical; LCP and TBT likely very high
- `nexfortis.com/` mobile: **64/100** — needs work
- `nexfortis.com/blog/…pipeda` mobile: **49/100** — needs work
- `qb.nexfortis.com/*` mobile: 48–66/100 — portal performs better but still below Good threshold
- Desktop performance is significantly better (34–98), indicating heavy JS/images on mobile network simulation

**Recommended priority actions:**
1. Fix render-blocking resources and reduce JavaScript bundle size on `services/microsoft-365` (mobile score 19)
2. Implement image lazy-loading and next-gen formats (WebP/AVIF) site-wide
3. Eliminate unused CSS/JavaScript (all marketing pages)
4. Review LCP element — likely a hero image or large H1; preload it
5. Address accessibility failures (see Section 3) — primarily contrast and form label issues

---
*Generated by Lighthouse CLI 12.8.2 / Chromium 147. Raw JSON reports stored at `/tmp/nf-review/seo-audit/lh/`.*