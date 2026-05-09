/**
 * Per-category SEO content (intro + FAQs) used by /category/<slug>.
 *
 * Why this exists:
 * SEObility flagged /category/quickbooks-data-services as duplicate content
 * with /catalog because both pages were thin shells around a product grid
 * with near-identical meta descriptions. This module gives every category a
 * unique, research-backed prose intro plus 3-4 long-form FAQ entries that
 * differentiate the page from /catalog and from competitors.
 *
 * Content provenance (May 2026 research pull, see PR #94 description):
 *   - DataForSEO Canada keyword data: "sage 50 to quickbooks" (10/mo MEDIUM
 *     comp), "simply accounting to quickbooks" (10/mo HIGH), "quickbooks
 *     data recovery" (10/mo HIGH, $18.75 CPC), "quickbooks file repair"
 *     (10/mo LOW), "quickbooks for canada" (5,400/mo).
 *   - Competitor service pages: e-tech.ca (turnaround windows, file types,
 *     Projects→Classes pattern), bigredconsulting.com ($249 flat conversion,
 *     same-day rush before 2pm Pacific).
 *   - Intuit official docs: Pro/Premier 14,500-name list limit
 *     (https://quickbooks.intuit.com/learn-support/en-us/help-article/list-management/maximum-number-list-entries-list-limits-custom/L0q0uTz3u_US_en_US),
 *     Multi-Currency one-way switch, Condense Data does not remove audit
 *     trail.
 *   - Intuit community thread (2021): audit-trail removal yields 30-50%
 *     file size reduction.
 *
 * To add or edit a category: keep `intro` between roughly 80-120 words so the
 * crawl-depth-to-content ratio stays favourable, keep FAQ answers between
 * 60-130 words each (Google's snippet preference for FAQPage), and ensure
 * any factual claim has a verifiable Intuit/competitor source.
 */

export interface CategoryFAQ {
  question: string;
  answer: string;
}

export interface CategoryContent {
  /** ~80-120-word prose intro, rendered above the product grid. */
  intro: string;
  /** Override for <meta name="description"> on this category page. */
  metaDescription: string;
  /** 3-4 FAQ pairs, rendered below the product grid and emitted as
   *  FAQPage JSON-LD for rich-result eligibility. */
  faqs: CategoryFAQ[];
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  "quickbooks-conversion": {
    metaDescription:
      "Convert QuickBooks Enterprise Canadian Edition to Pro or Premier with GST/HST, payroll history, and audit trail preserved. Same-business-day turnaround, 30-minute guaranteed option, complete-conversion refund guarantee.",
    intro:
      "Convert QuickBooks Enterprise Canadian Edition to Pro or Premier with Canadian GST/HST tax codes, payroll history, customer/vendor lists, item lists, audit trail, and memorized transactions all preserved. Most Canadian SMBs originally bought Enterprise when its premium over Pro/Premier was modest — current Intuit pricing has widened that gap to thousands of dollars per year for features most businesses never use. We accept .QBW, .QBB, and .QBM files, return your converted data the same business day, and offer a guaranteed 30-minute turnaround when a deadline cannot wait. Every conversion is backed by a complete-conversion guarantee or full refund.",
    faqs: [
      {
        question: "Why convert QuickBooks Enterprise to Pro or Premier?",
        answer:
          "Most Canadian small businesses adopted Enterprise when it cost only modestly more than Pro or Premier. Intuit's recent subscription pricing has widened that gap dramatically — Enterprise now runs into thousands of dollars per year compared to a one-time Pro or Premier licence. If your business has fewer than 14,500 customer or item list entries and does not need Advanced Inventory or Advanced Pricing, Pro or Premier covers your day-to-day accounting at a fraction of the annual cost.",
      },
      {
        question: "Will my Canadian GST/HST and payroll setup survive the conversion?",
        answer:
          "Yes. Every conversion preserves GST, HST, PST, QST, and combined sales-tax codes with their correct rates and tax-agency mappings, so your next CRA filing matches your previous one. Payroll history, year-to-date totals, T4 setup, customer and vendor lists, the item list, audit trail, and memorized transactions all carry over intact. Canadian Edition source files are returned as Canadian Edition Pro or Premier targets — never accidentally converted to a US edition.",
      },
      {
        question: "What turnaround can I expect, and what's the guarantee?",
        answer:
          "Standard conversions complete same business day for files received before 2 p.m. Eastern. Our Guaranteed 30-Minute Conversion service includes a full refund if we exceed 30 minutes from the moment we receive your file. All conversions ship with a complete-conversion guarantee — if any data fails to convert, you receive a full refund. Files are uploaded over SSL, processed on Canadian servers, and deleted within 14 days of project completion.",
      },
    ],
  },

  "quickbooks-data-services": {
    metaDescription:
      "QuickBooks data services for problems Condense Data can't solve: audit trail removal, super-condense, CRA period copies, file recovery, list cleanup, and Multi-Currency reversal. Returned in your existing QuickBooks version.",
    intro:
      "QuickBooks data services for the problems Intuit's Condense Data tool can't solve: removing audit trails older than a target date, super-condensing oversized company files, building CRA-ready period copies, recovering corrupted .QBW files, eliminating duplicate names from bloated lists, and reversing the one-way Multi-Currency switch. Audit-trail removal alone reduces file size by 30 to 50 percent and noticeably speeds up day-to-day work — and it is often required when handing files to CRA or new owners during an acquisition. Every job operates on your existing QuickBooks Desktop file and returns a clean working copy in the same version you use today.",
    faqs: [
      {
        question: "Can the QuickBooks audit trail actually be removed?",
        answer:
          "Yes. The audit trail is permanent through QuickBooks' standard interface — Intuit's Condense Data tool reduces some history but the audit trail itself stays. Our Audit Trail Removal service rebuilds your company file without the trail and clears entries from the Voided/Deleted Transactions Summary and Detail reports, while preserving every other piece of data exactly. It is commonly requested before handing files to CRA during a tax audit, after acquisitions, and any time the trail has accumulated to the point of slowing down QuickBooks. The result opens in your existing installation with no version upgrade needed.",
      },
      {
        question: "What is a CRA Period Copy and when do I need one?",
        answer:
          "A CRA Period Copy is a date-bounded slice of your QuickBooks file — for example, only the months CRA is auditing — with no data outside that range. CRA reviewers commonly request the source records for a specific GST/HST or payroll period, and providing your full live file exposes years of unrelated transactions. Our period copy service builds a sealed copy containing only the requested date range with all supporting transactions, customers, vendors, and account history needed to substantiate that period's filings. Pair it with Audit Trail Removal in our most popular CRA-readiness bundle.",
      },
      {
        question: "My QuickBooks file is too large or corrupted — what's the fastest fix?",
        answer:
          "Start with the File Health Check — a paid diagnostic that identifies fragmentation, list bloat, audit-trail bloat, data damage, and version-incompatibility issues, then recommends the cheapest remediation. Most large-file complaints resolve through Audit Trail Removal or Super Condense without losing any visible data. True corruption — files that won't open, throw verify/rebuild errors, or display data damage messages — needs the data recovery process, which works on Sybase and C-Index files across US, Canada, UK, and AU/NZ editions. Both fixes are returned in the same QuickBooks version you currently run, so no upgrade is forced on you.",
      },
      {
        question: "Can Multi-Currency be turned off after I enabled it?",
        answer:
          "Yes — but only by rebuilding the file. Multi-Currency is a one-way switch in standard QuickBooks: once enabled, the user interface does not let you turn it off. Our Multi-Currency Removal service rebuilds the company file with Multi-Currency disabled, while keeping every transaction, balance, and historical exchange-rate amount intact. The returned file opens in standard QuickBooks Pro, Premier, or Enterprise with no Multi-Currency menu visible.",
      },
    ],
  },

  "platform-migrations": {
    metaDescription:
      "Migrate Sage 50 (Simply Accounting), AccountEdge, or MYOB into QuickBooks Desktop with all customers, vendors, items, accounts, and the last two fiscal years converted by default. Sage Projects-to-Classes mapping available.",
    intro:
      "Move your full ledger from Sage 50 (formerly Simply Accounting), AccountEdge, or MYOB into QuickBooks Desktop with all customers, vendors, items, accounts, opening balances, and the last two fiscal years of transactions converted by default. We support every Sage 50 Canadian Edition release back through Simply Accounting Pro and Premium, plus AccountEdge and the Australian/New Zealand MYOB lineage. Conversions land directly in QuickBooks Pro, Premier, or Enterprise — no third-party intermediate format, no manual data re-entry, no balance reconciliation work for you to redo. Additional fiscal years and Sage Projects-to-QuickBooks-Classes mapping are available as optional add-ons.",
    faqs: [
      {
        question: "Which Sage 50 / Simply Accounting versions can be converted?",
        answer:
          "Every Sage 50 Canadian Edition version since the Simply Accounting era — Pro, Premium, Quantum, and the modern Sage 50 lineage — converts directly into QuickBooks Desktop Pro, Premier, or Enterprise. Source data files (.SAJ, .SAI, plus the corresponding company directory) are uploaded as a complete folder. We default to converting the last two fiscal years of transaction history (matching Sage 50's own data settings) and convert all years on request as a paid add-on.",
      },
      {
        question: "How are Sage Projects, Departments, and Classes handled?",
        answer:
          "QuickBooks Desktop has no native Projects equivalent, so by default Projects are not converted. We offer Projects-to-Classes conversion as a paid customization — every Project becomes a Class in QuickBooks, and every Sage transaction tagged with a Project carries the Class assignment forward. Sage Departments map directly to QuickBooks Classes. Multi-currency Sage files are converted with all foreign-currency transactions and historical exchange rates preserved.",
      },
      {
        question: "Can my AccountEdge or MYOB file move to QuickBooks Online instead of Desktop?",
        answer:
          "Yes — but the route is two-step. We first convert your AccountEdge or MYOB file to a QuickBooks Desktop company file (the format QuickBooks Online's import tool actually accepts), then import that file into your QuickBooks Online account. The Desktop step preserves more historical detail than QuickBooks Online's native importer, then QBO's import maps lists, balances, and transactions automatically. Add the QBO Readiness Report from our Data Services category to surface anything that won't survive the QBO import before you commit.",
      },
    ],
  },

  "volume-packs": {
    metaDescription:
      "Prepaid QuickBooks conversion volume packs for Canadian accountants and bookkeepers. 5-pack and 10-pack tiers with our lowest per-conversion rate, no expiry, single GST/HST invoice line at firm level.",
    intro:
      "Prepaid conversion packs for accountants, bookkeepers, and IT consultants who convert multiple client files per month. Each pack credits one standard Enterprise→Pro/Premier conversion, with the per-file rate dropping at the 5-pack and again at the 10-pack tier — the lowest per-conversion price we offer. Packs never expire, files in the pack can be from different clients, and any of our Canadian Conversion Services upgrades (rush delivery, complex-file handling, 30-minute guaranteed turnaround) can be applied per file at standard upgrade pricing. Invoicing supports firm-level billing under a single GST/HST invoice line.",
    faqs: [
      {
        question: "Do volume-pack conversions expire?",
        answer:
          "No. Pack credits stay on your account until used. Whether you convert five files this month or spread them across a year, the prepaid rate stays locked in. Unused credits remain redeemable for any standard Enterprise-to-Pro/Premier conversion in our catalogue.",
      },
      {
        question: "Can I apply rush delivery or complex-file handling to a pack file?",
        answer:
          "Yes. Each pack file starts as a standard conversion at the pack rate. Add Rush Delivery (priority queue) or upgrade to a Complex conversion (custom fields, multi-currency, very large lists) on a per-file basis at the standard upgrade price. Pack files can also be combined with our 30-Minute Guaranteed Conversion service when a single client deadline cannot move.",
      },
      {
        question: "How does invoicing work for firms with multiple partners?",
        answer:
          "Volume packs are billed once at the time of purchase under your firm's single GST/HST line, then drawn down per file with no further invoicing per conversion. This makes month-end client billback straightforward — your firm sees one invoice per pack and can allocate per-file costs internally. Standard 30-day net terms are available for firms with three or more pack purchases on file.",
      },
    ],
  },
};

/**
 * Returns the rich content payload for a category, or null when the slug
 * has no curated content yet (callers fall back to the generic page shell).
 */
export function getCategoryContent(slug: string): CategoryContent | null {
  return CATEGORY_CONTENT[slug] ?? null;
}
