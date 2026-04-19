export interface LandingLink {
  slug: string;
  anchor: string;
}

export const serviceLandingLinks: Record<string, LandingLink[]> = {
  "enterprise-to-premier-standard": [
    { slug: "etech-alternative", anchor: "a modern alternative to E-Tech conversions" },
    { slug: "affordable-enterprise-conversion", anchor: "how our Enterprise conversion pricing compares" },
    { slug: "how-conversion-works", anchor: "what happens during a conversion, step by step" },
  ],
  "enterprise-to-premier-complex": [
    { slug: "how-conversion-works", anchor: "how we handle complex conversions end to end" },
    { slug: "is-it-safe", anchor: "how your file stays secure during conversion" },
    { slug: "affordable-enterprise-conversion", anchor: "affordable Enterprise to Premier conversion pricing" },
  ],
  "guaranteed-30-minute": [
    { slug: "how-conversion-works", anchor: "how a 30-minute conversion actually works" },
    { slug: "etech-alternative", anchor: "compare our rush turnaround to E-Tech" },
  ],
  "file-health-check": [
    { slug: "quickbooks-running-slow", anchor: "why QuickBooks gets slow and what to check first" },
    { slug: "quickbooks-file-too-large", anchor: "what to do when your QuickBooks file is too large" },
  ],
  "rush-delivery": [
    { slug: "how-conversion-works", anchor: "where rush orders sit in our process" },
    { slug: "is-it-safe", anchor: "is it safe to hand us your company file" },
  ],
  "extended-support": [
    { slug: "is-it-safe", anchor: "how we protect your data after conversion" },
    { slug: "how-conversion-works", anchor: "a full walkthrough of the conversion process" },
  ],

  "audit-trail-removal": [
    { slug: "audit-trail-removal", anchor: "why removing the audit trail shrinks QuickBooks files" },
    { slug: "quickbooks-file-too-large", anchor: "other ways to fix a too-large QuickBooks file" },
    { slug: "quickbooks-running-slow", anchor: "troubleshoot slow QuickBooks performance" },
  ],
  "super-condense": [
    { slug: "super-condense", anchor: "a deeper look at what Super Condense actually does" },
    { slug: "quickbooks-file-too-large", anchor: "fixing a QuickBooks file that's too large" },
    { slug: "quickbooks-running-slow", anchor: "why QuickBooks slows down as files grow" },
  ],
  "list-reduction": [
    { slug: "list-reduction", anchor: "how list reduction works on Canadian QuickBooks files" },
    { slug: "quickbooks-running-slow", anchor: "bloated lists and QuickBooks slowness" },
  ],
  "multi-currency-removal": [
    { slug: "multi-currency-removal", anchor: "the only way to turn multi-currency off in QuickBooks" },
    { slug: "quickbooks-multi-currency-problems", anchor: "common multi-currency problems and fixes" },
  ],
  "qbo-readiness-report": [
    { slug: "qbo-readiness", anchor: "what a QBO readiness report includes" },
    { slug: "quickbooks-desktop-end-of-life", anchor: "planning for QuickBooks Desktop end of life" },
  ],
  "cra-period-copy": [
    { slug: "quickbooks-file-too-large", anchor: "how isolating periods helps oversized files" },
    { slug: "quickbooks-company-file-error", anchor: "when QuickBooks company file errors block CRA prep" },
  ],
  "audit-trail-cra-bundle": [
    { slug: "audit-trail-removal", anchor: "why removing the audit trail helps with CRA-ready files" },
    { slug: "quickbooks-file-too-large", anchor: "fixing an oversized QuickBooks file before a CRA request" },
  ],

  "accountedge-to-quickbooks": [
    { slug: "accountedge-to-quickbooks", anchor: "a full walkthrough of AccountEdge to QuickBooks migration" },
    { slug: "how-conversion-works", anchor: "how our migration process works" },
  ],
  "sage50-to-quickbooks": [
    { slug: "sage-50-to-quickbooks", anchor: "a full walkthrough of Sage 50 to QuickBooks migration" },
    { slug: "how-conversion-works", anchor: "how our migration process works" },
  ],

  "expert-support-essentials": [
    { slug: "quickbooks-support-subscription", anchor: "what a QuickBooks support subscription covers" },
    { slug: "quickbooks-desktop-end-of-life", anchor: "staying on Desktop as end of life approaches" },
  ],
  "expert-support-professional": [
    { slug: "quickbooks-support-subscription", anchor: "compare QuickBooks support subscription tiers" },
    { slug: "quickbooks-company-file-error", anchor: "fixing QuickBooks company file errors" },
  ],
  "expert-support-premium": [
    { slug: "quickbooks-support-subscription", anchor: "what Premium support includes" },
    { slug: "quickbooks-desktop-end-of-life", anchor: "navigating QuickBooks Desktop end of life" },
    { slug: "quickbooks-company-file-error", anchor: "company file error diagnosis and recovery" },
  ],

  "5-pack-conversions": [
    { slug: "affordable-enterprise-conversion", anchor: "how volume packs lower per-conversion cost" },
    { slug: "etech-alternative", anchor: "why firms are switching from E-Tech to NexFortis" },
    { slug: "quickbooks-conversion-canada", anchor: "Canadian-first QuickBooks conversion service" },
  ],
  "10-pack-conversions": [
    { slug: "affordable-enterprise-conversion", anchor: "the most affordable way to buy Enterprise conversions" },
    { slug: "etech-alternative", anchor: "a modern alternative to E-Tech for firms" },
    { slug: "quickbooks-conversion-canada", anchor: "Canadian QuickBooks conversion service" },
  ],
};

export const categoryLandingLinks: Record<string, LandingLink[]> = {
  "quickbooks-conversion": [
    { slug: "how-conversion-works", anchor: "How QuickBooks conversion works" },
    { slug: "etech-alternative", anchor: "A modern alternative to E-Tech" },
    { slug: "affordable-enterprise-conversion", anchor: "Affordable Enterprise to Premier conversion" },
    { slug: "quickbooks-conversion-canada", anchor: "QuickBooks conversion in Canada" },
    { slug: "is-it-safe", anchor: "Is it safe to send us your QuickBooks file?" },
  ],
  "quickbooks-data-services": [
    { slug: "quickbooks-file-too-large", anchor: "QuickBooks file too large — how to fix it" },
    { slug: "quickbooks-running-slow", anchor: "Why QuickBooks is running slow" },
    { slug: "audit-trail-removal", anchor: "QuickBooks audit trail removal explained" },
    { slug: "super-condense", anchor: "Super Condense for Canadian files" },
    { slug: "list-reduction", anchor: "QuickBooks list reduction guide" },
    { slug: "quickbooks-multi-currency-problems", anchor: "QuickBooks multi-currency problems" },
    { slug: "qbo-readiness", anchor: "QuickBooks Desktop to Online readiness report" },
  ],
  "platform-migrations": [
    { slug: "accountedge-to-quickbooks", anchor: "AccountEdge to QuickBooks migration guide" },
    { slug: "sage-50-to-quickbooks", anchor: "Sage 50 to QuickBooks migration guide" },
    { slug: "quickbooks-desktop-end-of-life", anchor: "Planning around QuickBooks Desktop end of life" },
    { slug: "how-conversion-works", anchor: "How our migration process works" },
  ],
  "expert-support": [
    { slug: "quickbooks-support-subscription", anchor: "What a QuickBooks support subscription covers" },
    { slug: "quickbooks-company-file-error", anchor: "Fixing QuickBooks company file errors" },
    { slug: "quickbooks-desktop-end-of-life", anchor: "Navigating QuickBooks Desktop end of life" },
  ],
  "volume-packs": [
    { slug: "affordable-enterprise-conversion", anchor: "Affordable Enterprise to Premier conversions" },
    { slug: "etech-alternative", anchor: "A modern alternative to E-Tech" },
    { slug: "quickbooks-conversion-canada", anchor: "Canadian-first QuickBooks conversion service" },
  ],
};

export function getServiceLandingLinks(serviceSlug: string): LandingLink[] {
  return serviceLandingLinks[serviceSlug] ?? [];
}

export function getCategoryLandingLinks(categorySlug: string): LandingLink[] {
  return categoryLandingLinks[categorySlug] ?? [];
}
