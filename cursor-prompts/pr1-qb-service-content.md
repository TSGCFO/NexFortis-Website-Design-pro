# Cursor Prompt — PR #1: QB service-page content rewrite

**Repo:** `TSGCFO/NexFortis-Website-Design-pro`  
**Base branch:** `main`  
**Working branch:** `phase2/pr1-qb-service-content`  
**Spec:** `docs/superpowers/specs/2026-04-26-seo-audit-fix-plan.md` § "PR #1"  
**Audit source of truth:** `2026-04-25_venture-full-export.pdf` (PDF p.34-46)

## HARD RULES — read before touching anything

1. **Do not modify, rename, or otherwise touch** any file under `scripts/seo-verification/` (`verify-rendered-content.mjs`, `verify-rendered-content.test.mjs`, `verify-head-tags.mjs`, `verify-head-tags.test.mjs`). Read-only forever.
2. Do not modify `docs/` except `docs/superpowers/specs/` and `docs/superpowers/plans/`.
3. Never use the words "scrape" or "crawl" in code, comments, commits, or PR text — use "collect", "extract", "browse", "read", "fetch".
4. Add packages without asking the user — but only minimal, well-known ones if absolutely necessary; prefer zero new deps for this PR.
5. Squash merge with `--delete-branch`. Use `gh` CLI for any GitHub URL (do not browse).
6. If Copilot leaves bot review comments, ignore them — they will be resolved via GraphQL `resolveReviewThread` after CI passes.
7. Branch protection on `main` requires the `Local SEO test suite` and `Verify Render PR previews` checks. Both must be green before merge.

## Goal

Close the following audit findings (PDF p.34-46) by rewriting the QB service-page body copy so each of the 16 service pages renders **≥500 words of unique, keyword-rich, non-duplicate body text** in the prerendered HTML:

- Duplicate content: 9 of 16 entries (PDF p.45-46)
- Pages with duplicate paragraphs: all 16 (PDF p.36-37)
- Pages with little text (<500 words): 15 of 28 (PDF p.34-35)
- Title-keywords-not-in-body: ~12 of 33 (PDF p.38-39)

## Files

**Modify:**

- `artifacts/qb-portal/public/products.json` — add new copy fields per service (see Schema Additions below).
- `artifacts/qb-portal/src/lib/products.ts` — extend the `Product` TypeScript type with the new optional fields.
- `artifacts/qb-portal/src/pages/service-detail.tsx` — render the new fields when present.

**Create:**

- `tests/seo/service-pages.content.test.mjs` — TDD test file (see Test Spec below).

**Out of scope:**

- Any landing-page file (`landingPages.ts`) — that is PR #2.
- Any H1 string — that is PR #3.
- Any `<title>` value — that is PR #5.
- The verifier scripts under `scripts/seo-verification/` — read-only.

## Affected service slugs (16)

`enterprise-to-premier-standard`, `enterprise-to-premier-complex`, `guaranteed-30-minute`, `file-health-check`, `extended-support`, `rush-delivery`, `audit-trail-removal`, `audit-trail-cra-bundle`, `super-condense`, `list-reduction`, `multi-currency-removal`, `qbo-readiness-report`, `cra-period-copy`, `accountedge-to-quickbooks`, `sage50-to-quickbooks`, `5-pack-conversions`, `10-pack-conversions`.

(Yes, that's 17 slugs; volume packs are siblings — both must be unique vs. each other.)

## Schema additions to products.json

For each service in `services[]`, ADD these optional fields (do not remove or rename existing fields):

```jsonc
{
  "longDescription": [
    "Paragraph 1 (≥80 words).",
    "Paragraph 2 (≥80 words).",
    "Paragraph 3 (≥80 words).",
    "Paragraph 4 (≥80 words).",
    "Paragraph 5 (≥80 words)."
  ],
  "whyItMatters": "Single paragraph, ≥80 words, explaining the business problem this service solves.",
  "howItWorks": [
    { "step": "Step name", "body": "≥40 words explaining what happens at this step." }
    // 4-6 steps total
  ],
  "featureSections": [
    { "heading": "Section heading", "body": "≥60 words of explanatory body copy." }
    // 3-4 sections per service
  ],
  "faqs": [
    { "question": "≥40 char question", "answer": "≥60 word answer" }
    // 4-6 FAQs per service
  ]
}
```

**Uniqueness requirement:** No paragraph (treated as a string after trimming and collapsing whitespace) may appear in more than one service entry. No paragraph may appear more than once within the same service. Verify this with the test below.

**Keyword requirement:** Every word that appears **bolded** in the audit's "Title — Keywords not contained in the body of the page" column (PDF p.38-39) must appear at least once verbatim (case-insensitive) in that service's combined body copy (longDescription + whyItMatters + howItWorks bodies + featureSections bodies + faqs answers).

## TypeScript type changes

In `artifacts/qb-portal/src/lib/products.ts`, extend the `Product` type:

```ts
export interface ProductFAQ { question: string; answer: string; }
export interface ProductHowItWorksStep { step: string; body: string; }
export interface ProductFeatureSection { heading: string; body: string; }

export interface Product {
  // … existing fields unchanged …
  longDescription?: string[];
  whyItMatters?: string;
  howItWorks?: ProductHowItWorksStep[];
  featureSections?: ProductFeatureSection[];
  faqs?: ProductFAQ[];
}
```

## Template changes — `service-detail.tsx`

After the existing "About This Service" `<Card>` and before "What's Included", render the new sections **only when present** so the type stays optional and existing code remains valid:

```tsx
{product.longDescription && product.longDescription.length > 0 && (
  <Card>
    <CardContent className="p-6">
      <h2 className="text-xl font-bold font-display text-primary mb-4">Overview</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        {product.longDescription.map((p, i) => (<p key={i}>{p}</p>))}
      </div>
    </CardContent>
  </Card>
)}

{product.whyItMatters && (
  <Card>
    <CardContent className="p-6">
      <h2 className="text-xl font-bold font-display text-primary mb-4">Why this matters</h2>
      <p className="text-muted-foreground leading-relaxed">{product.whyItMatters}</p>
    </CardContent>
  </Card>
)}

{product.howItWorks && product.howItWorks.length > 0 && (
  <Card>
    <CardContent className="p-6">
      <h2 className="text-xl font-bold font-display text-primary mb-4">How it works</h2>
      <ol className="space-y-4">
        {product.howItWorks.map((s, i) => (
          <li key={i}>
            <h3 className="font-semibold text-primary">{s.step}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.body}</p>
          </li>
        ))}
      </ol>
    </CardContent>
  </Card>
)}

{product.featureSections && product.featureSections.length > 0 && (
  <Card>
    <CardContent className="p-6">
      <div className="space-y-6">
        {product.featureSections.map((fs, i) => (
          <div key={i}>
            <h2 className="text-xl font-bold font-display text-primary mb-2">{fs.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">{fs.body}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}

{product.faqs && product.faqs.length > 0 && (
  <Card>
    <CardContent className="p-6">
      <h2 className="text-xl font-bold font-display text-primary mb-4">Frequently asked questions</h2>
      <div className="space-y-4">
        {product.faqs.map((f, i) => (
          <div key={i}>
            <h3 className="font-semibold text-primary">{f.question}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.answer}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}
```

Place these new cards inside the `md:col-span-2 space-y-6` column, after the existing About card.

Heading hierarchy: each card's section title must remain `<h2>` (the page H1 stays the existing `product.name`). Use `<h3>` for sub-items inside a card. **Do not add a fourth heading level** — PR #4 fixes hierarchy gaps and we don't want to introduce new ones.

JSON-LD: ensure `generateServiceSchema` continues to use the existing `description` field, not the new `longDescription`. Do not modify `seo-schemas.ts` in this PR.

## Heading-budget caution

Adding 5 new H2s per page must not push the page over Seobility's "too many headings" threshold (≤8). Pre-existing H2s on the service page: "About This Service", "What's Included", optionally "Available Add-Ons", "Related Services" — that's 3-4. Adding Overview + Why this matters + How it works + (one heading per featureSection) + Frequently asked questions could exceed 8. **Mitigation:** keep `featureSections` to **3 per page max**, and skip "Why this matters" if a service has it covered by longDescription. Aim for total H2 count ≤8 per service-detail page.

## TDD test spec — `tests/seo/service-pages.content.test.mjs`

```js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

const SERVICE_SLUGS = [
  "enterprise-to-premier-standard",
  "enterprise-to-premier-complex",
  "guaranteed-30-minute",
  "file-health-check",
  "extended-support",
  "rush-delivery",
  "audit-trail-removal",
  "audit-trail-cra-bundle",
  "super-condense",
  "list-reduction",
  "multi-currency-removal",
  "qbo-readiness-report",
  "cra-period-copy",
  "accountedge-to-quickbooks",
  "sage50-to-quickbooks",
  "5-pack-conversions",
  "10-pack-conversions",
];

const QB_DIST = "artifacts/qb-portal/dist/public";

function loadPrerenderedBody(slug) {
  const p = join(QB_DIST, "service", slug, "index.html");
  const html = readFileSync(p, "utf8");
  const $ = cheerio.load(html);
  $("script,style,noscript").remove();
  return { $, text: $("main").text().replace(/\s+/g, " ").trim() };
}

test("each QB service page renders ≥500 words of body text", () => {
  for (const slug of SERVICE_SLUGS) {
    const { text } = loadPrerenderedBody(slug);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    assert.ok(wordCount >= 500, `${slug}: ${wordCount} words (need ≥500)`);
  }
});

test("no paragraph text repeats within a single service page", () => {
  for (const slug of SERVICE_SLUGS) {
    const { $ } = loadPrerenderedBody(slug);
    const paragraphs = $("main p").map((_, el) => $(el).text().replace(/\s+/g, " ").trim()).get()
      .filter(p => p.length >= 80);
    const seen = new Map();
    for (const p of paragraphs) {
      assert.ok(!seen.has(p), `${slug}: duplicate paragraph: "${p.slice(0, 80)}…"`);
      seen.set(p, true);
    }
  }
});

test("no paragraph text repeats across different service pages", () => {
  const seen = new Map(); // text -> slug
  for (const slug of SERVICE_SLUGS) {
    const { $ } = loadPrerenderedBody(slug);
    const paragraphs = $("main p").map((_, el) => $(el).text().replace(/\s+/g, " ").trim()).get()
      .filter(p => p.length >= 80);
    for (const p of paragraphs) {
      const owner = seen.get(p);
      assert.ok(!owner || owner === slug, `paragraph reused on ${slug} (originally on ${owner}): "${p.slice(0, 80)}…"`);
      seen.set(p, slug);
    }
  }
});

// Title-keyword-in-body coverage (audit PDF p.38-39).
// Map each slug to the keywords the audit reported as missing-from-body.
// Fill this in based on the PDF column "Keywords not contained in the body of the page".
const TITLE_KEYWORDS = {
  // Example — populate the rest from PDF p.38-39:
  // "enterprise-to-premier-standard": ["enterprise", "premier", "standard"],
  // …
};

test("title keywords appear in body for affected service pages", () => {
  for (const [slug, keywords] of Object.entries(TITLE_KEYWORDS)) {
    const { text } = loadPrerenderedBody(slug);
    const lower = text.toLowerCase();
    for (const kw of keywords) {
      assert.ok(lower.includes(kw.toLowerCase()),
        `${slug}: title keyword "${kw}" not in body`);
    }
  }
});
```

**TDD discipline:** write the test first, run it, see it fail (no prerender output yet has the new copy), THEN add the copy and template changes. Run again — must pass.

## Verification commands

```bash
pnpm install
pnpm test          # all suites green
pnpm --filter qb-portal build
pnpm --filter qb-portal prerender
node --test tests/seo/service-pages.content.test.mjs
```

All four must exit 0.

## Commit + PR

- One logical commit (or split into "schema + types", "template", "copy", "tests" if it helps review).
- Commit message style: `feat(qb-portal): unique 500-word body copy for 17 service pages (audit PR-1)`
- Open PR via `gh pr create --base main --head phase2/pr1-qb-service-content --title "PR #1 — QB service-page content rewrite (audit, 17 pages)" --body-file <(echo "Closes audit findings: duplicate content (9/16), duplicate paragraphs (16/16), thin text (15/28), title-keyword-not-in-body (~12/33). See docs/superpowers/specs/2026-04-26-seo-audit-fix-plan.md § PR #1.")`
- Wait for both required checks to be green before flagging ready for review.

## Stop conditions

- If you cannot meet ≥500 words on a service without inventing technical claims, STOP and surface to the user. Do not fabricate features, prices, SLAs, or capabilities.
- If a copy claim contradicts an existing field (price, turnaround, deliverable, accepted_file_types), the existing field wins — adjust the new copy.
