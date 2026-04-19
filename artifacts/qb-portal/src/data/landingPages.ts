export type LandingPageCategory = "service" | "problem" | "comparison" | "educational";

export interface LandingProcessStep {
  title: string;
  body: string;
}

export interface LandingBenefit {
  title: string;
  body: string;
}

export interface LandingFAQ {
  question: string;
  answer: string;
}

export interface LandingPageData {
  slug: string;
  category: LandingPageCategory;
  primaryKeyword: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  productSlug?: string;
  ctaLabel: string;
  ctaHref: string;
  heroImageAlt: string;
  heroIcon?: import("@/lib/hero-icons").HeroIconName;
  hero: { intro: string };
  overview: string[];
  benefits?: LandingBenefit[];
  process: LandingProcessStep[];
  faqs: LandingFAQ[];
  relatedSlugs: string[];
  breadcrumbs: { name: string; path: string }[];
}

const SERVICES_CRUMB = { name: "Services", path: "/catalog" };

export const landingPages: LandingPageData[] = [
  // 5a
  {
    slug: "enterprise-to-premier-conversion",
    category: "service",
    primaryKeyword: "convert quickbooks enterprise to premier",
    h1: "QuickBooks Enterprise to Premier Conversion Service",
    metaTitle: "QuickBooks Enterprise to Premier Conversion | NexFortis",
    metaDescription:
      "Convert QuickBooks Enterprise to Premier or Pro with 100% data preservation. Canadian editions supported, next-business-day turnaround, from {launchPrice}.",
    productSlug: "enterprise-to-premier-standard",
    ctaLabel: "Order Now — From {launchPrice}",
    ctaHref: "/service/enterprise-to-premier-standard",
    heroImageAlt:
      "Diagram showing a QuickBooks Enterprise company file being converted into a Premier file",
    heroIcon: "ArrowRightLeft",
    hero: {
      intro:
        "Move from QuickBooks Enterprise to Premier or Pro without losing a single transaction. NexFortis performs a direct, database-level conversion that keeps every customer, vendor, template, and preference intact — including on Canadian QuickBooks editions.",
    },
    overview: [
      "Converting a QuickBooks Enterprise file down to Premier or Pro is not a feature Intuit exposes in the product. Most tools that claim to do it rely on the QuickBooks SDK, which strips payroll, memorized reports, linked transactions, and custom templates in the process. NexFortis does not use the SDK. Our team performs a direct modification of the underlying company file so that every record, link, and preference survives the conversion.",
      "We support Enterprise versions 6.0 through 24.0 and produce output files compatible with Premier or Pro 2017 through 2024. Canadian editions — including Premier Contractor, Premier Accountant, and the Canadian Payroll add-on — are fully supported. This is a key differentiator: the built-in Intuit utilities either fail outright on Canadian files or silently corrupt payroll data, and most third-party SDK-based tools simply refuse to run when they detect a Canadian file header.",
      "Your file is uploaded over a 256-bit encrypted connection, processed in our Canadian data region, and returned to you as a downloadable .QBM file that restores into Premier or Pro exactly as it behaved in Enterprise. Standard turnaround is the next business day; a 30-minute guaranteed rush option is available if you are on a deadline. Files are deleted from our processing environment within 30 days, and you can request earlier deletion at any time by contacting support with your order number.",
      "All Enterprise features that exist in Premier — advanced inventory summaries, class tracking, multi-currency, job costing, custom fields — are preserved. Enterprise-only features that Premier cannot display (such as Advanced Pricing rules, Combine Reports across companies, and Enhanced User Permissions on individual transactions) are converted to static values or removed where they have no Premier equivalent, and the conversion report tells you exactly which features were affected so there are no surprises after restoration.",
      "Why do businesses convert down from Enterprise in the first place? The most common reason is cost: Enterprise's per-seat annual subscription is several times the Premier or Pro license. A close second is consolidation: a company that bought Enterprise for capacity reasons years ago has since reduced staff, written off legacy data, or no longer needs the higher list limits. We also see Enterprise-to-Premier conversions tied to acquisitions, where the acquiring entity standardizes everyone onto Premier, and tied to accountants who prefer to receive client files in a tier their own practice already supports.",
      "What you receive at the end of the engagement is a clean, ready-to-restore .QBM, a side-by-side comparison of trial balance totals before and after conversion, a feature-conversion report listing what was preserved, what was downgraded to a Premier equivalent, and what was removed because Premier cannot represent it, and a 30-day post-conversion support window — every order includes 2 support tickets with a 2-hour response SLA at no additional cost. Upgrade to Extended Support for 5 tickets with 1-hour priority SLA. Most customers go from upload to fully restored Premier file in less than 24 hours.",
      "A common follow-on engagement is to bundle Audit Trail Removal or Super Condense with the conversion in the same upload. The reason is practical: businesses converting down from Enterprise are often doing so as part of a broader cost-and-complexity reduction, and shrinking the file at the same time as the tier downgrade saves a second round-trip and reduces total cost. We will quote the bundled engagement at a discount versus the two services run separately if you tell us up front that both are needed, and the bundle keeps your file restoration to a single download instead of two.",
    ],
    benefits: [
      {
        title: "100% data preservation",
        body: "Customers, vendors, items, chart of accounts, transactions, linked transactions, memorized reports, templates, users, and preferences all carry over with no manual re-entry.",
      },
      {
        title: "Canadian files supported",
        body: "Enterprise Canadian Edition, Premier Contractor Canadian, and the Canadian Payroll add-on convert cleanly — something most competitors cannot offer because their SDK-based tools refuse Canadian file headers.",
      },
      {
        title: "Direct database conversion",
        body: "No SDK, no XML export/import. The company file itself is downgraded so nothing is lost in translation and historical reports continue to render the same numbers they did in Enterprise.",
      },
      {
        title: "Works across versions",
        body: "Enterprise 6.0–24.0 source files; Premier or Pro 2017–2024 output files. Cross-version downgrades are supported in a single pass.",
      },
    ],
    process: [
      {
        title: "Create a .QBM backup",
        body: "Inside QuickBooks Enterprise, choose File → Create Backup → Portable Company File. Our QBM Guide walks through this if you have not done it before. Your original file is never modified.",
      },
      {
        title: "Upload securely",
        body: "Place your order, then upload the .QBM file over a 256-bit encrypted link. You will receive an order ID immediately and an email confirmation with the expected turnaround.",
      },
      {
        title: "NexFortis converts your file",
        body: "Our team performs the direct database conversion, runs data integrity checks, and validates the result against your original file's balances on a per-account basis.",
      },
      {
        title: "Download your converted file",
        body: "We email you a signed download link. Open the .QBM in Premier or Pro, restore, and confirm the new file is ready for use. The 30-day post-conversion support window starts at this point — you can submit up to 2 support tickets at no additional cost.",
      },
    ],
    faqs: [
      {
        question: "Will I lose any data when I convert from Enterprise to Premier?",
        answer:
          "No. NexFortis performs a direct database conversion rather than an SDK export, so customers, vendors, items, transactions, linked transactions, memorized reports, templates, preferences, users, and payroll history are all preserved exactly as they appear in Enterprise. Trial balance and historical reports tie out to the cent against the Enterprise source file on the conversion date.",
      },
      {
        question: "Does the conversion work on Canadian QuickBooks files?",
        answer:
          "Yes. Canadian editions — including Premier Contractor Canadian, Premier Accountant Canadian, and files using the Canadian Payroll add-on — are fully supported. This is one of the main reasons customers choose NexFortis over generic SDK-based tools, which typically refuse to run when they detect a Canadian edition header. GST/HST settings, bilingual customer and vendor names, and CRA reporting periods all carry over without manual re-entry.",
      },
      {
        question: "How long does the conversion take?",
        answer:
          "Standard turnaround is the next business day after you upload. If you need it faster, the Guaranteed 30-Minute Conversion add-on moves your order to the front of the queue with a 30-minute completion commitment that starts when our team picks the order up. For very large or complex files (heavy advanced inventory, dozens of users, hundreds of memorized reports), we will email a confirmed estimate within an hour of upload.",
      },
      {
        question: "Which QuickBooks versions are supported?",
        answer:
          "We accept Enterprise source files from version 6.0 through 24.0 and produce Premier or Pro output files compatible with 2017 through 2024. If you have a version outside this range, contact support before ordering — many out-of-range versions can still be converted in two passes (for example, Enterprise 5.0 → Enterprise 12.0 → Premier 2017), and we will confirm feasibility in writing before you place an order.",
      },
      {
        question: "Can I convert multiple Enterprise files at once?",
        answer:
          "Yes. Each file is a separate order, but volume packs (5-Pack and 10-Pack) are available at a discounted rate for accountants and bookkeepers managing multiple client files. Credits stay valid for 12 months and can be applied to any combination of standard, complex, or rush conversions across different client engagements.",
      },
      {
        question: "What happens if something goes wrong with the conversion?",
        answer:
          "Every converted file is validated against the original's trial balance on a per-account basis before it is returned to you, and the validation report is included with the download. If the conversion cannot be completed or does not preserve your data as described, we refund your order in full. Your original file is never altered — it stays on your computer untouched throughout the engagement, so a failed conversion never puts your live data at risk.",
      },
      {
        question: "Will my Enterprise users and permissions transfer to Premier?",
        answer:
          "User accounts and roles transfer, but Enterprise's Enhanced User Permissions (the granular per-transaction-type access controls) collapse into Premier's simpler permissions model, since Premier does not support the same granularity. The conversion report lists exactly which permissions were preserved, downgraded, or removed so you can re-validate access for sensitive accounts before going live.",
      },
    ],
    relatedSlugs: ["super-condense", "affordable-enterprise-conversion", "how-conversion-works", "quickbooks-conversion-canada", "etech-alternative"],
    breadcrumbs: [SERVICES_CRUMB, { name: "Enterprise to Premier Conversion", path: "/landing/enterprise-to-premier-conversion" }],
  },
  // 5b
  {
    slug: "audit-trail-removal",
    category: "service",
    primaryKeyword: "remove audit trail quickbooks",
    h1: "QuickBooks Audit Trail Removal Service",
    metaTitle: "QuickBooks Audit Trail Removal Service | NexFortis Canada",
    metaDescription:
      "Remove the QuickBooks audit trail to shrink your file size, speed up reports, and protect editing-history privacy. Canadian editions supported, from {launchPrice}.",
    productSlug: "audit-trail-removal",
    ctaLabel: "Remove Audit Trail — From {launchPrice}",
    ctaHref: "/service/audit-trail-removal",
    heroImageAlt:
      "Illustration of a QuickBooks company file shrinking after audit trail removal",
    heroIcon: "Eraser",
    hero: {
      intro:
        "The QuickBooks audit trail records every change ever made to your file — and it never stops growing. NexFortis safely removes the audit trail so your file opens faster, backs up quicker, and no longer exposes years of historical edits.",
    },
    overview: [
      "The audit trail is a transaction log built into every QuickBooks company file. Every time a user creates, edits, voids, or deletes a transaction, a row is added. Over years of use, that log becomes the single largest contributor to file bloat — often accounting for more than half of total file size in long-running companies. Unlike the General Ledger, the audit trail cannot be summarized, archived, or trimmed from inside QuickBooks; it is append-only by design.",
      "A bloated audit trail causes three concrete problems. First, it slows down everything QuickBooks does that has to touch the log: opening the file, running reports, backing up, condensing, and verifying. Second, it inflates backup sizes and can push the company file past the technical limits that trigger 6000-series file errors and unrecoverable corruption. Third, it exposes the entire editing history of your business — every voided invoice, every renumbered check, every deleted bill, with the user name and timestamp attached — which becomes a privacy and legal-discovery problem if the file is ever sold, transferred, or handed to a new accountant.",
      "NexFortis removes the audit trail by directly editing the underlying company file. Customers typically see a 30–60% file size reduction, depending on how transaction-heavy the history is. Every transaction, balance, list, template, and preference stays exactly where it was — only the edit history is removed. Because we operate at the database layer rather than through the QuickBooks UI, the removal is complete and irreversible: the rows are gone, not just hidden from the standard audit trail report.",
      "Canadian QuickBooks editions are fully supported, including files using the Canadian Payroll add-on. Because Intuit's built-in Condense Data utility does not work on Canadian files, audit trail removal is often the most effective way to shrink a Canadian company file. For files where size is critical, audit trail removal is frequently combined with Super Condense in a single engagement, producing combined reductions of 80–90% or more.",
      "Most businesses run audit trail removal annually as routine file maintenance — typically right after fiscal year-end, once the prior year's audit work is complete and the historical edit log no longer has audit value. We recommend this cadence over waiting for the file to become problematic, because annual maintenance keeps the file fast and stable instead of letting it accumulate to the point where performance becomes a daily friction.",
      "When is audit trail removal not the right choice? If you are in the middle of an active CRA or IRS audit, defer the removal until the audit closes — reviewers may want the change history. If you are required by your industry's regulator to retain change logs (for example, certain regulated financial services), check the regulation before removing. For everyone else, the audit trail is a private convenience that grows into a liability, and removing it on a regular schedule is a sound file-maintenance practice.",
    ],
    benefits: [
      {
        title: "Smaller, faster file",
        body: "Typical reductions of 30–60%, with correspondingly faster open, backup, and report times. Verify Data runs in a fraction of the time afterward.",
      },
      {
        title: "Privacy for file transfers",
        body: "Remove the historical edit log before selling the business, handing the file to a new accountant, or releasing the file to a third party for review.",
      },
      {
        title: "Balances and data untouched",
        body: "Only the audit trail is removed. All transactions, lists, reports, templates, and preferences remain identical to the source file.",
      },
      {
        title: "Works on Canadian files",
        body: "Full support for Canadian editions and the Canadian Payroll add-on — unlike Intuit's own Condense utility, which does not run on Canadian files.",
      },
    ],
    process: [
      {
        title: "Back up your file as .QBM",
        body: "Use QuickBooks' Create Backup → Portable Company File option to produce a .QBM. Your original file stays untouched on your computer for the entire engagement.",
      },
      {
        title: "Upload to NexFortis",
        body: "Place your order and upload the .QBM over a 256-bit encrypted connection. You will receive a confirmation email with the expected turnaround.",
      },
      {
        title: "Audit trail is removed",
        body: "We perform the removal at the database level and run integrity checks to confirm transactions and balances are unchanged versus your source file.",
      },
      {
        title: "Receive the cleaned file",
        body: "You get a signed download link for the new .QBM, ready to restore in your existing version of QuickBooks. A before/after size comparison is included.",
      },
    ],
    faqs: [
      {
        question: "Is audit trail removal permanent?",
        answer:
          "Yes. Once the audit trail is removed from the file, it cannot be reconstructed — the rows are physically gone from the database, not just hidden from the standard report. We recommend keeping a backup of the original file if you may need the edit history for future reference (for example, for a pending audit, a legal-discovery request, or a regulatory review).",
      },
      {
        question: "Will audit trail removal affect my current data?",
        answer:
          "No. Every transaction, balance, list, report, template, and preference in the file stays exactly the same. Only the historical log of edits is removed. We compare the source and output trial balances on a per-account basis and ship the comparison report with the cleaned file so you can confirm the removal did not touch a single line of live data.",
      },
      {
        question: "How much smaller will my QuickBooks file be after removal?",
        answer:
          "Most files shrink by 30–60%. The exact reduction depends on how many years of edits are stored and how transaction-heavy the history is. Files with heavy payroll, retail point-of-sale volume, or routine bulk edits tend to see the largest reductions. Files used by a single bookkeeper with low edit volume see the smallest. The before/after size comparison is included with delivery.",
      },
      {
        question: "Is audit trail removal safe for Canadian QuickBooks files?",
        answer:
          "Yes. NexFortis fully supports Canadian editions and the Canadian Payroll add-on. Because Intuit's own Condense Data utility does not work on Canadian files, this service is often the most effective way to shrink them. CRA reporting periods, GST/HST tax-agency balances, and bilingual records are all preserved unchanged.",
      },
      {
        question: "Can I remove the audit trail myself from within QuickBooks?",
        answer:
          "No. QuickBooks does not expose an option to delete the audit trail from the user interface — the log is append-only by product design. It can only be removed through direct modification of the company file at the database level, which is what NexFortis performs. There is no in-product workaround.",
      },
      {
        question: "How often should I remove the audit trail?",
        answer:
          "Most customers run audit trail removal annually as routine file maintenance, typically right after fiscal year-end once any audit work for the prior year is complete. This cadence keeps the file fast and stable instead of letting log bloat accumulate to the point where performance becomes a daily friction. Skip the cycle if you are in the middle of an active audit or are subject to a regulatory log-retention requirement.",
      },
    ],
    relatedSlugs: ["super-condense", "enterprise-to-premier-conversion", "quickbooks-file-too-large", "quickbooks-running-slow"],
    breadcrumbs: [SERVICES_CRUMB, { name: "Audit Trail Removal", path: "/landing/audit-trail-removal" }],
  },
  // 5c
  {
    slug: "super-condense",
    category: "service",
    primaryKeyword: "quickbooks super condense",
    h1: "QuickBooks Super Condense Service — Canadian Files Supported",
    metaTitle: "QuickBooks Super Condense — Canadian Files | NexFortis",
    metaDescription:
      "Super Condense your QuickBooks file even when Intuit's utility will not run. Works on Canadian editions, balances preserved, fast turnaround, from {launchPrice}.",
    productSlug: "super-condense",
    ctaLabel: "Condense My File — From {launchPrice}",
    ctaHref: "/service/super-condense",
    heroImageAlt:
      "Before-and-after illustration of a large QuickBooks file being condensed to a smaller file",
    heroIcon: "Minimize2",
    hero: {
      intro:
        "When a QuickBooks file has accumulated years of detail, Super Condense reduces its size dramatically while keeping every balance accurate. Best of all, it works on Canadian editions — something Intuit's own Condense Data utility cannot do.",
    },
    overview: [
      "Super Condense is a database-level rebuild of your QuickBooks company file that removes historical transaction detail prior to a cutoff date while preserving summary balances, list data, and all transactions after the cutoff. The result is a file that behaves identically for day-to-day use but is a fraction of the original size, with full reporting capability for the current and prior fiscal year intact.",
      "Canadian QuickBooks files cannot use Intuit's built-in Condense Data utility. The utility either fails silently, corrupts payroll data, or refuses to run on the Canadian edition. This has been a long-standing limitation that leaves Canadian businesses with no first-party way to shrink bloated files. Super Condense fills that gap with a database-layer process that respects Canadian-specific structures (GST/HST tax codes, bilingual records, CRA reporting period boundaries, and the Canadian Payroll add-on schema).",
      "What is preserved: full chart of accounts, all lists (customers, vendors, items, employees), all transactions after the cutoff date, opening balances that correctly reflect the condensed period, templates, memorized reports, and preferences. What is removed: transaction-level detail before the cutoff date, which is replaced by a single opening balance journal entry per account. The visual effect is that historical reports for periods after the cutoff continue to look exactly as they did before, while reports for periods before the cutoff show summary opening balances rather than line-item detail.",
      "File size reductions of 50–80% are typical for files with several years of history. Combined with Audit Trail Removal, reductions of 90%+ are possible on very old files. The most dramatic reductions are seen on retail and point-of-sale files (which have very high transaction volume in early years) and on files that have been carried through multiple QuickBooks version upgrades without ever being maintained.",
      "The right cutoff date for most businesses is the start of the second-prior fiscal year — far enough back that you no longer reference line-item detail in day-to-day work, but recent enough that you still have full prior-year comparatives in the file. We will help you choose the cutoff during the engagement; many customers pick a date and then ask us to run a dry-run analysis to see what the resulting file size would be before committing.",
      "Super Condense is a one-way operation. The transaction detail before the cutoff is collapsed into opening balances and cannot be reconstructed from the condensed file. We always recommend keeping a full backup of the source file in long-term storage so that the historical detail remains available for audit, legal-discovery, or simple curiosity reasons. Most customers keep the source backup on offline media (USB or external drive) rather than active storage, since they will not need to open it day-to-day. We can also produce a read-only \"archive copy\" of the source file alongside the condensed file as part of the engagement if you want a guaranteed long-term reference copy that is clearly labelled as historical-only.",
    ],
    benefits: [
      {
        title: "Works on Canadian editions",
        body: "The only practical way to condense Canadian QuickBooks files, including files using the Canadian Payroll add-on. Intuit's own utility refuses to run on these.",
      },
      {
        title: "Massive size reduction",
        body: "50–80% smaller is typical; 90%+ when combined with audit trail removal on long-running files.",
      },
      {
        title: "Balances stay accurate",
        body: "Opening balances are generated so every account ties back to the pre-condense totals on the cutoff date. Trial balance comparisons ship with the file.",
      },
      {
        title: "Recent detail intact",
        body: "All transactions after your chosen cutoff date remain at full detail, so current-year and prior-year comparative reporting are unaffected.",
      },
    ],
    process: [
      {
        title: "Choose a cutoff date",
        body: "Pick a date before which transaction detail can be summarized. Most customers choose the start of the second-prior fiscal year so prior-year comparatives stay intact.",
      },
      {
        title: "Back up and upload",
        body: "Create a .QBM and upload it to NexFortis over a 256-bit encrypted connection. Your original file stays untouched on your computer.",
      },
      {
        title: "NexFortis condenses",
        body: "We rebuild the file at the database level, summarize pre-cutoff detail into opening balances, and validate totals against your original on a per-account basis.",
      },
      {
        title: "Download the condensed file",
        body: "You receive a much smaller .QBM that restores into your existing QuickBooks version, plus a before/after size and balance comparison report.",
      },
    ],
    faqs: [
      {
        question: "Why can't I condense my Canadian QuickBooks file inside QuickBooks?",
        answer:
          "Intuit's built-in Condense Data utility does not support Canadian editions. It either fails outright, corrupts payroll data, or refuses to run when it detects the Canadian edition header. This is a long-standing product limitation and Intuit has not signalled plans to address it. Super Condense is a database-level alternative that works on Canadian files without touching payroll integrity.",
      },
      {
        question: "What data is removed during Super Condense?",
        answer:
          "Only transaction-level detail dated before your chosen cutoff date. Those transactions are replaced by per-account opening balance journal entries that match the pre-condense totals to the cent. Lists, templates, preferences, and post-cutoff transactions are untouched. Historical reports for periods before the cutoff will show opening balances rather than line-item detail; everything after the cutoff continues to render exactly as before.",
      },
      {
        question: "How much smaller will my QuickBooks file get after Super Condense?",
        answer:
          "File size reductions of 50–80% are typical for files with several years of pre-cutoff history. Files that also have large audit trails can exceed 90% reduction when Super Condense is combined with Audit Trail Removal. Retail and point-of-sale files, which carry extremely high early-year transaction volume, see the most dramatic reductions; single-bookkeeper professional services files see somewhat smaller (but still substantial) reductions.",
      },
      {
        question: "Is Super Condense the same as Intuit's Condense Data utility?",
        answer:
          "No. Intuit's utility is a feature built into QuickBooks that does not work on Canadian editions and that has known issues with payroll data corruption even on US editions. Super Condense is a database-level rebuild performed by NexFortis that supports Canadian files, handles payroll cleanly, and ships with a balance-comparison report so you can verify the result before going live.",
      },
      {
        question: "Can I Super Condense a QuickBooks Enterprise file?",
        answer:
          "Yes. Enterprise files are fully supported across versions 6.0 through 24.0. Many customers combine Super Condense with an Enterprise-to-Premier conversion in a single engagement to both shrink the file and downgrade to a lower tier — typically the lowest-cost path when the original Enterprise file has accumulated multiple years of detail and is no longer using Enterprise-specific features.",
      },
      {
        question: "Can I undo Super Condense if I change my mind?",
        answer:
          "No. The pre-cutoff transaction detail is collapsed into opening balances during the rebuild and cannot be reconstructed from the condensed file. This is why we always recommend keeping a full backup of the source file in long-term storage before condensing — typically on offline media. If you ever need the historical detail back, you restore from that backup; you cannot recover it from the condensed file itself.",
      },
    ],
    relatedSlugs: ["audit-trail-removal", "quickbooks-file-too-large", "enterprise-to-premier-conversion", "list-reduction"],
    breadcrumbs: [SERVICES_CRUMB, { name: "Super Condense", path: "/landing/super-condense" }],
  },
  // 5d
  {
    slug: "file-repair",
    category: "service",
    primaryKeyword: "quickbooks file repair service",
    h1: "QuickBooks File Repair Service",
    metaTitle: "QuickBooks File Repair & Recovery Service | NexFortis",
    metaDescription:
      "Repair corrupted QuickBooks company files at the database level. Honest free diagnostic, no charge if unrecoverable, fast turnaround, priced from {launchPrice}.",
    productSlug: "file-health-check",
    ctaLabel: "Start File Repair — From {launchPrice}",
    ctaHref: "/service/file-health-check",
    heroImageAlt:
      "Illustration of a damaged QuickBooks file being repaired and restored",
    heroIcon: "Wrench",
    hero: {
      intro:
        "When a QuickBooks company file refuses to open, runs Verify errors, or throws 6000-series messages, NexFortis performs database-level repair to recover as much of your data as possible — with an honest up-front assessment of what can and cannot be saved.",
    },
    overview: [
      "QuickBooks company files are databases, and like any database they can be corrupted by power failures during a write, network drive disconnections, crashes during large transactions, files that exceed technical size limits, or disk-level errors. When that happens, QuickBooks' built-in Verify and Rebuild tools often cannot finish, or they leave the file in a state where it opens but throws errors whenever a specific record is touched.",
      "NexFortis File Repair starts with a diagnostic pass on your file to identify what kind of corruption is present and whether repair is feasible. We are honest about this step: not every file can be recovered. If yours cannot, you will know before any repair work begins, and you will not be charged for work that cannot succeed. The diagnostic itself is free and is delivered as a short written assessment with a firm fixed-price quote for the repair where one is possible.",
      "Where repair is feasible, we operate at the database level — rebuilding indexes, repairing orphaned records, reconstructing broken transaction links, and validating that account balances tie back to what the file should contain. This is different from data recovery, which is the process of pulling records out of a file that will never open again. We offer both, depending on what your file needs, and the diagnostic tells you which path is appropriate before you commit.",
      "Turnaround depends on the severity of the corruption. Simple index or link damage is typically resolved within one business day. Severe structural corruption may take two to three business days. Catastrophic damage requiring data recovery into a new file can take up to five business days. You receive the repaired .QBM and a short report describing what was found, what was fixed, and any caveats — for example, a small number of orphaned transactions that could not be re-linked and were preserved as journal entries.",
      "The most common patterns we see are: (1) network-share corruption from running multi-user mode over an unreliable Wi-Fi or VPN connection, (2) size-related corruption on files that have crossed the practical 1.5 GB / 2.5 GB instability thresholds without ever being condensed, (3) shutdown-during-write corruption from forced reboots, lost power, or laptop sleep with the file open, and (4) third-party app corruption from integrations that wrote malformed records back into QuickBooks. Each pattern has a different repair playbook, and the diagnostic identifies which one applies before any work begins.",
      "Once your file is repaired, we typically recommend two follow-up actions. First, take an immediate backup of the repaired .QBM and store it offline. Second, address the underlying cause so the corruption does not recur — moving the file off a flaky network share, scheduling annual size maintenance, or replacing the integration that wrote bad records. The repair report includes a short \"prevention\" section tailored to what we found in your specific file.",
    ],
    benefits: [
      {
        title: "Honest diagnostic first",
        body: "We assess feasibility before any repair charge. Unrecoverable files are identified up front and you are not billed for work that cannot succeed.",
      },
      {
        title: "Database-level repair",
        body: "Beyond Verify/Rebuild — we rebuild indexes, repair orphaned records, and restore broken links that QuickBooks' own tools cannot fix.",
      },
      {
        title: "Repair or recovery",
        body: "If full repair is not possible, we can extract recoverable data into a new, clean company file so you do not lose everything.",
      },
      {
        title: "Post-repair report",
        body: "A short summary of what was found, what was fixed, and how to prevent the same issue from recurring ships with every repaired file.",
      },
    ],
    process: [
      {
        title: "Upload the damaged file",
        body: "Create a .QBM if possible; if the file will not open, upload the .QBW instead. Both are accepted for repair. Your original copy stays on your computer untouched.",
      },
      {
        title: "Diagnostic assessment",
        body: "We analyze the corruption and tell you whether repair is feasible, what the expected outcome is, and the firm fixed price before any work begins.",
      },
      {
        title: "Repair at the database level",
        body: "We rebuild indexes, repair links, and validate balances against what the file should contain. The repair is performed on a copy, never on your source.",
      },
      {
        title: "Return the repaired file",
        body: "You receive the repaired .QBM plus a short report of what was fixed and a prevention section tailored to the root cause.",
      },
    ],
    faqs: [
      {
        question: "What causes QuickBooks file corruption?",
        answer:
          "The most common causes are power failures during a write, network drive disconnections while the file is open, crashes during large transactions (like period-end close), files exceeding QuickBooks' technical size limits, disk-level hardware errors, and third-party integrations that write malformed records back into QuickBooks. Each pattern has different symptoms and a different repair playbook, which the diagnostic identifies before work begins.",
      },
      {
        question: "Can all corrupted QuickBooks files be repaired?",
        answer:
          "No. Some files are damaged too severely for repair — for example, files where the database header itself has been overwritten, or files truncated by a failed disk operation. NexFortis performs a free diagnostic assessment before any repair charge so that unrecoverable files are identified up front. In those cases we can often still extract recoverable records into a new company file via our data recovery process.",
      },
      {
        question: "What happens if the repair cannot succeed?",
        answer:
          "If the diagnostic shows the file cannot be repaired, you are not charged for the repair. We will walk you through your options, which may include extracting recoverable data into a new file via data recovery, restoring from a previous backup combined with re-keying transactions since the backup, or accepting the loss and starting fresh with the file's lists imported into a new company file.",
      },
      {
        question: "How long does QuickBooks file repair take?",
        answer:
          "Simple damage — broken indexes, corrupt links, single-record orphaning — is typically resolved within one business day. Severe structural corruption may take two to three business days. Catastrophic damage requiring data recovery into a new file can take up to five business days. You will receive a confirmed estimate after the diagnostic pass, before any work or charges begin.",
      },
      {
        question: "Will I lose any data during file repair?",
        answer:
          "Most repairs preserve all recoverable data with no loss. In the most severe cases, a small number of records may be unrecoverable — typically transactions whose database rows have been physically overwritten. Where this happens, the repair report lists exactly which records could not be saved so you know what (if anything) needs to be re-keyed before going live with the repaired file.",
      },
    ],
    relatedSlugs: ["quickbooks-company-file-error", "super-condense", "quickbooks-file-too-large", "enterprise-to-premier-conversion"],
    breadcrumbs: [SERVICES_CRUMB, { name: "File Repair", path: "/landing/file-repair" }],
  },
  // 5e
  {
    slug: "accountedge-to-quickbooks",
    category: "service",
    primaryKeyword: "accountedge to quickbooks",
    h1: "AccountEdge to QuickBooks Migration Service",
    metaTitle: "AccountEdge to QuickBooks Migration | NexFortis Canada",
    metaDescription:
      "Migrate AccountEdge (formerly MYOB) to QuickBooks Desktop with full transaction history, GST/HST preserved, and bilingual data intact. From {launchPrice}.",
    productSlug: "accountedge-to-quickbooks",
    ctaLabel: "Start Migration — From {launchPrice}",
    ctaHref: "/service/accountedge-to-quickbooks",
    heroImageAlt:
      "Illustration of AccountEdge data transferring to QuickBooks Desktop",
    heroIcon: "ArrowRightLeft",
    hero: {
      intro:
        "NexFortis migrates AccountEdge (formerly MYOB) company files to QuickBooks Desktop with your chart of accounts, customers, vendors, items, and transaction history intact — with special attention to Canadian GST/HST treatment.",
    },
    overview: [
      "AccountEdge — historically branded MYOB — remains widely used in Canada and Australia by small businesses and their accountants. When the time comes to move to QuickBooks Desktop, the migration is more involved than a simple export/import because the two platforms store their data very differently. AccountEdge uses a flat-file structure with proprietary record types; QuickBooks Desktop uses a relational database with rigid type-and-link constraints. Bridging the two requires a careful field-by-field mapping rather than a one-click conversion.",
      "NexFortis handles the full migration as a managed service. Chart of accounts, customers, vendors, items, open transactions, and historical transaction detail all transfer into a new QuickBooks company file. Opening balances are generated so that trial balance totals on the migration date match exactly between AccountEdge and QuickBooks. The result is a QuickBooks file that, on the first day of use, agrees to the cent with what your AccountEdge file showed on the migration date.",
      "Canadian-specific handling is where most generic migration tools fall down. We map AccountEdge GST/HST codes to QuickBooks tax items correctly, preserve tax-agency payable balances, and align CRA reporting periods to the QuickBooks tax-period structure. Bilingual data (French/English) is carried over without encoding issues — a common failure mode when generic tools assume ASCII rather than the UTF-8 that AccountEdge stores. Canadian Payroll data, where present, is summarized at the period level rather than line-item level because QuickBooks Desktop's payroll schema is structurally different.",
      "Not everything transfers at full detail. Payroll history is typically summarized rather than line-level, custom AccountEdge forms do not map to QuickBooks templates, recurring transaction templates need to be re-created in QuickBooks, and some report customizations are lost. You will receive a migration report that lists what came across at full detail, what was summarized, and what did not transfer — so there are no surprises after cutover and you have a clear punch list of items to re-establish in QuickBooks before going live.",
      "Most AccountEdge migrations complete in one to two business days from upload. Larger files (many years of history, heavy item catalogs, or complex inventory) may take three. We will give you a confirmed estimate within an hour of upload, and you can ask us to run a dry-run analysis first if you want to see the migration report before committing to the full service. Dry-run analyses are typically completed within four hours and the cost is credited against the full migration if you proceed.",
      "After migration, we recommend keeping AccountEdge installed and operational for at least one full reporting cycle so that you can reference the original records if any question arises during the transition. Once you have filed one full set of returns from QuickBooks (typically a GST/HST period and a payroll period), you can retire the AccountEdge installation. The QuickBooks file is fully self-sufficient at that point and AccountEdge is no longer needed for day-to-day operations or historical reporting.",
    ],
    benefits: [
      {
        title: "Full transaction history",
        body: "Historical transactions come across at line-item detail, not just balances, so QuickBooks reports for prior periods continue to show the same numbers AccountEdge did.",
      },
      {
        title: "GST/HST preserved",
        body: "Canadian tax codes, tax-agency balances, and CRA reporting periods map cleanly to QuickBooks tax items without manual reconciliation.",
      },
      {
        title: "Trial balance ties out",
        body: "Opening balances are generated so AccountEdge and QuickBooks match exactly on the migration date, validated on a per-account basis.",
      },
      {
        title: "Migration report included",
        body: "You receive a summary of what transferred at full detail, what was summarized, and what did not move — so the punch list is clear before cutover.",
      },
    ],
    process: [
      {
        title: "Export from AccountEdge",
        body: "Create a full company file backup. We accept .zip, .myo, and .myox formats. Your original AccountEdge file remains in place and untouched throughout the engagement.",
      },
      {
        title: "Upload securely",
        body: "Place your order and upload the backup over a 256-bit encrypted link. You can request a dry-run analysis first if you want to see the migration report before committing.",
      },
      {
        title: "NexFortis migrates",
        body: "We convert lists, transactions, and Canadian tax settings into a new QuickBooks Desktop company file. Trial balance is validated against the AccountEdge source.",
      },
      {
        title: "Review and go live",
        body: "You receive the QuickBooks file plus a migration report. Once trial balance is validated on your end, you stop using AccountEdge for new transactions.",
      },
    ],
    faqs: [
      {
        question: "What AccountEdge data transfers to QuickBooks?",
        answer:
          "Chart of accounts, customers, vendors, items, open invoices and bills, and historical transaction detail all transfer at line-item level. Canadian GST/HST codes and tax-agency balances are preserved. Payroll history is typically summarized at the period level rather than transferred at line-item detail because the two platforms' payroll schemas are structurally different.",
      },
      {
        question: "Do I need to keep AccountEdge installed after migration?",
        answer:
          "We recommend keeping AccountEdge installed for at least one full reporting cycle so that you can reference the original records if any question arises during the transition. Once you have filed one full set of returns from QuickBooks (typically a GST/HST period and a payroll period), you can safely retire the AccountEdge installation. The QuickBooks file is fully self-sufficient at that point.",
      },
      {
        question: "Will my GST/HST settings transfer to QuickBooks?",
        answer:
          "Yes. Canadian tax codes in AccountEdge are mapped to QuickBooks tax items, tax-agency payable balances are preserved, and CRA reporting periods are aligned. You should run a test return on the first post-migration period to confirm the mapping matches your filing practice — and we will help with that test return at no additional cost during the 30-day post-migration support window (2 tickets included with every order).",
      },
      {
        question: "How long does the AccountEdge migration take?",
        answer:
          "Standard turnaround is one to two business days. Larger files or files with complex custom reporting may require a third day. Very large files (many years of history, heavy item catalogs, or complex inventory) can take up to a week. You receive a confirmed estimate within an hour of uploading, and a dry-run analysis is available if you want to scope the work before committing.",
      },
      {
        question: "Does the AccountEdge migration support bilingual data?",
        answer:
          "Yes. French and English customer names, vendor names, item descriptions, and notes carry over without encoding loss. This is a common failure point for generic migration tools that assume ASCII rather than the UTF-8 encoding AccountEdge actually uses, but it is a built-in part of the NexFortis migration workflow.",
      },
    ],
    relatedSlugs: ["sage-50-to-quickbooks", "enterprise-to-premier-conversion", "super-condense", "quickbooks-conversion-canada"],
    breadcrumbs: [SERVICES_CRUMB, { name: "AccountEdge to QuickBooks", path: "/landing/accountedge-to-quickbooks" }],
  },
  // 5f
  {
    slug: "sage-50-to-quickbooks",
    category: "service",
    primaryKeyword: "sage 50 to quickbooks migration",
    h1: "Sage 50 to QuickBooks Migration Service",
    metaTitle: "Sage 50 to QuickBooks Migration | NexFortis Canada",
    metaDescription:
      "Migrate Sage 50 (Simply Accounting) to QuickBooks Desktop with Canadian Edition support, bilingual data, and CRA-ready GST/HST mapping. From {launchPrice}.",
    productSlug: "sage50-to-quickbooks",
    ctaLabel: "Start Migration — From {launchPrice}",
    ctaHref: "/service/sage50-to-quickbooks",
    heroImageAlt:
      "Illustration of Sage 50 Simply Accounting data migrating to QuickBooks Desktop",
    heroIcon: "ArrowRightLeft",
    hero: {
      intro:
        "Move from Sage 50 — formerly Simply Accounting — to QuickBooks Desktop with historical transactions, customer and vendor records, and CRA tax data intact. NexFortis specializes in the Canadian Edition migration.",
    },
    overview: [
      "Sage 50, long known in Canada as Simply Accounting, remains one of the most common small-business accounting platforms in the country. Businesses moving to QuickBooks typically want full transaction history preserved, bilingual records intact, and Canadian tax treatment to carry over without manual cleanup. NexFortis handles all three as part of the standard migration — there are no add-ons or upgrades to unlock these capabilities.",
      "The migration transfers chart of accounts, customers, vendors, items, inventory quantities, open transactions, and historical transaction detail into a new QuickBooks Desktop company file. Opening balances on the migration date are reconciled so that QuickBooks reports match Sage 50 exactly at that point in time. The reconciliation is per-account and is delivered as a written report with the migrated file, so you can verify the numbers before going live.",
      "For Canadian Edition files, we map GST/HST codes to QuickBooks tax items, carry across tax-agency payable balances, and align Sage 50's reporting periods to QuickBooks' tax-period structure. Bilingual (French/English) names and descriptions carry over without encoding loss — a common failure mode when generic migration tools assume ASCII rather than the UTF-8 that Sage 50 Canadian Edition actually uses for French characters.",
      "CRA integration differs between the two platforms. Sage 50's direct CRA filing features have no exact equivalent in QuickBooks Desktop, so any electronic filing settings need to be re-established in QuickBooks after migration. Your migration report will list this along with anything else that needs manual follow-up — typically a small set of recurring transaction templates, custom Sage 50 reports, and any Sage 50-specific add-ons (for example, the Sage Knowledgebase Pro extension) that have no direct QuickBooks counterpart.",
      "Sage 50 payroll requires special handling. Payroll detail is typically summarized at the period level rather than transferred at line-item detail because the two platforms' payroll schemas differ structurally. Year-to-date payroll totals as of the migration date are loaded into QuickBooks so that T4 generation, ROE filing, and remittance reporting work correctly going forward. We will confirm the cutover approach with you before running the migration so that the first post-migration payroll run goes smoothly.",
      "Most Sage 50 migrations complete in one to two business days from upload. Larger files (many years of history, heavy item catalogs, or complex inventory) may take three. We offer a paid dry-run analysis option that delivers the migration report before you commit to the full migration — useful when you need to scope the post-migration cleanup work for client billing purposes or when you want to review the list of items that will not transfer cleanly before signing off.",
    ],
    benefits: [
      {
        title: "Canadian Edition supported",
        body: "Full support for Sage 50 Canadian Edition and legacy Simply Accounting files, including bilingual French/English records.",
      },
      {
        title: "Historical detail preserved",
        body: "Transactions transfer at line-item level, not just opening balances, so prior-period QuickBooks reports show the same numbers Sage 50 did.",
      },
      {
        title: "Bilingual data intact",
        body: "French and English names, descriptions, and notes carry over without encoding issues — a common failure point for generic migration tools.",
      },
      {
        title: "CRA tax data mapped",
        body: "GST/HST codes, tax-agency balances, and reporting periods are aligned to QuickBooks tax items so the first post-migration return ties out cleanly.",
      },
    ],
    process: [
      {
        title: "Back up Sage 50",
        body: "Create a full backup in Sage 50. We accept .cab, .zip, and .sai formats. Your original Sage 50 file is never modified during the engagement.",
      },
      {
        title: "Upload securely",
        body: "Place your order and upload the backup over a 256-bit encrypted link. A dry-run analysis option is available if you want to scope the migration first.",
      },
      {
        title: "NexFortis migrates",
        body: "We convert lists, transactions, and Canadian tax settings into a new QuickBooks company file. Trial balance is validated against the Sage 50 source on a per-account basis.",
      },
      {
        title: "Validate and go live",
        body: "Compare trial balance on the migration date between Sage 50 and QuickBooks, then switch over. We support the cutover with a 30-day post-migration support window — 2 tickets included with every order.",
      },
    ],
    faqs: [
      {
        question: "Is Sage 50 the same as Simply Accounting?",
        answer:
          "Yes. Sage 50 Canadian Edition is the current name for what was historically called Simply Accounting. Sage rebranded the product around 2012, but the underlying file format, schema, and Canadian-specific handling are continuous across the rename. NexFortis supports both the current Sage 50 files and legacy Simply Accounting backups, including very old .sai backups from versions a decade or more out of date.",
      },
      {
        question: "What Sage 50 data transfers to QuickBooks Desktop?",
        answer:
          "Chart of accounts, customers, vendors, items, inventory quantities, open invoices and bills, and historical transaction detail all transfer at line-item level. GST/HST codes, tax-agency balances, and bilingual names are preserved. Payroll history is summarized at the period level rather than transferred line-by-line, because QuickBooks Desktop's payroll schema is structurally different from Sage 50's.",
      },
      {
        question: "Will my historical transactions transfer from Sage 50?",
        answer:
          "Yes, at line-item detail rather than as opening balances only. Customers routinely carry multiple years of history across so that historical reporting in QuickBooks continues to work without referring back to Sage 50. The volume of history transferred is bounded only by QuickBooks' own technical file-size limits, which is occasionally a constraint for very long-running Sage 50 files (we will warn you up front if your file is approaching that boundary).",
      },
      {
        question: "Can I migrate from Sage 50 Canadian Edition specifically?",
        answer:
          "Yes. Canadian Edition is explicitly supported, including bilingual data, GST/HST handling, CRA reporting-period alignment, and Canadian Payroll year-to-date totals as of the migration date. This is one of the main reasons Canadian businesses choose NexFortis for the migration — most generic Sage-to-QuickBooks tools either skip Canadian-specific structures entirely or refuse to run on Canadian Edition files.",
      },
      {
        question: "What happens to Sage 50 payroll data during migration?",
        answer:
          "Payroll detail is summarized at the period level. Year-to-date payroll totals as of the migration date are loaded into QuickBooks so that T4 generation, ROE filing, and remittance reporting work correctly going forward. Per-employee per-pay-period detail is not migrated because the two platforms' payroll schemas differ structurally — that detail remains available in your Sage 50 backup if you need to reference it later.",
      },
    ],
    relatedSlugs: ["accountedge-to-quickbooks", "enterprise-to-premier-conversion", "super-condense", "quickbooks-conversion-canada"],
    breadcrumbs: [SERVICES_CRUMB, { name: "Sage 50 to QuickBooks", path: "/landing/sage-50-to-quickbooks" }],
  },
  // 5g
  {
    slug: "multi-currency-removal",
    category: "service",
    primaryKeyword: "quickbooks multi currency removal",
    h1: "QuickBooks Multi-Currency Removal Service",
    metaTitle: "QuickBooks Multi-Currency Removal | NexFortis Canada",
    metaDescription:
      "Turn off QuickBooks multi-currency after accidental enable. Intuit offers no way to disable it — NexFortis removes it at the file level. From {launchPrice}.",
    productSlug: "multi-currency-removal",
    ctaLabel: "Remove Multi-Currency — From {launchPrice}",
    ctaHref: "/service/multi-currency-removal",
    heroImageAlt:
      "Illustration of currency symbols being removed from a QuickBooks file",
    heroIcon: "Coins",
    hero: {
      intro:
        "Multi-currency in QuickBooks is a one-way toggle: once enabled, Intuit provides no supported way to turn it off. NexFortis removes multi-currency at the database level, with full preservation of your transactions and balances.",
    },
    overview: [
      "QuickBooks' multi-currency feature is powerful when a business genuinely transacts in more than one currency. The problem is how it is enabled. A single accidental click of the \"Yes, I use more than one currency\" option permanently flips the file into multi-currency mode. From that point on, every transaction screen asks about exchange rates, reports split currencies, and the feature cannot be disabled from within QuickBooks. Intuit's own documentation confirms this is by design and lists no workaround.",
      "For businesses that do not actually need multi-currency, the consequence is constant friction: extra clicks on every invoice, confusing exchange-rate fields, and reports that show currency breakdowns for currencies that are not actually in use. Over time this leads to data entry errors and mistrust of the numbers. Staff begin to second-guess every report they generate because they cannot tell at a glance whether a total is in home currency, foreign currency, or a mix — and managers stop using QuickBooks reports for decision-making, which defeats the purpose of having the system in the first place.",
      "NexFortis removes multi-currency by directly editing the underlying company file. Your chart of accounts, customers, vendors, items, transactions, and balances are preserved. Any transaction that was denominated in a non-home currency is normalized to the home currency using the exchange rate that was recorded on the transaction, so reported totals do not change. The exchange-rate lists are cleared, the multi-currency flag is disabled at the database level, and the file behaves on first restoration as though multi-currency had never been enabled at all.",
      "If your business does transact in multiple currencies but you want to consolidate into a single reporting currency for cleanup reasons, we will talk through the tradeoffs before running the conversion. Multi-currency removal is the right answer for many files — but not all of them. Specifically, if a meaningful portion of your business is genuinely transacted in a foreign currency and you rely on QuickBooks to track unrealized FX gains and losses, removal will collapse that detail and you will lose the ability to report on it inside QuickBooks. We will flag this during the pre-engagement conversation, not after.",
      "Canadian-edition files are fully supported, with CAD as the home currency in the typical case. The removal also handles the special case of files where the home currency was originally set incorrectly (for example, a Canadian business whose file was created with USD as home currency by an accountant who did not catch the default). In those cases we can both remove multi-currency and reset the home currency in a single engagement, which is much faster and safer than the alternative of starting a new file from scratch.",
      "After removal, we recommend keeping a backup of the pre-removal file in long-term storage in case you ever need to reference the historical foreign-currency detail (for example, for an audit or a transfer-pricing study). The removal is one-way: once the exchange-rate detail is collapsed, it cannot be reconstructed from the cleaned file. The pre-removal backup is your insurance policy against ever needing that detail back.",
    ],
    benefits: [
      {
        title: "Turn off what Intuit will not",
        body: "QuickBooks does not expose any way to disable multi-currency. NexFortis does it at the file level so the feature is genuinely off, not just hidden.",
      },
      {
        title: "Balances preserved",
        body: "Transactions denominated in non-home currencies are converted using the recorded exchange rate, so reported totals do not change.",
      },
      {
        title: "Cleaner data entry",
        body: "No more exchange-rate prompts or currency fields on every invoice and bill. Staff stop second-guessing whether totals are in CAD or USD.",
      },
      {
        title: "Canadian files supported",
        body: "Full support for CAD home currency and Canadian editions of QuickBooks, including the edge case of files created with the wrong home currency.",
      },
    ],
    process: [
      {
        title: "Confirm home currency",
        body: "Decide which currency will be the single currency in the file post-removal. This is usually the currency you invoice and bank in. We will help confirm if you are unsure.",
      },
      {
        title: "Back up and upload",
        body: "Create a .QBM and upload it over a 256-bit encrypted connection. Your original file stays untouched throughout the engagement.",
      },
      {
        title: "NexFortis removes multi-currency",
        body: "We normalize non-home-currency transactions and disable the multi-currency flag at the database level. Balances are validated against the source.",
      },
      {
        title: "Download the cleaned file",
        body: "You receive a .QBM that no longer prompts for exchange rates and reports in a single currency. A before/after comparison ships with the file.",
      },
    ],
    faqs: [
      {
        question: "Can I turn off multi-currency myself in QuickBooks?",
        answer:
          "No. QuickBooks does not offer any supported way to disable multi-currency once it has been enabled. The feature is deliberately designed as a one-way toggle and Intuit's own documentation confirms there is no in-product workaround. NexFortis removes it through direct modification of the company file at the database level — the only practical path for businesses that enabled multi-currency by accident.",
      },
      {
        question: "What happens to my foreign currency transactions after removal?",
        answer:
          "Any transaction recorded in a non-home currency is normalized to the home currency using the exchange rate that was stored on the original transaction. The reported totals in your home currency do not change. What changes is that the per-currency breakdown is collapsed: a USD invoice that previously showed as both \"USD 1,000\" and \"CAD 1,350\" simply shows as \"CAD 1,350\" after removal, with the original exchange rate preserved in the transaction memo for reference.",
      },
      {
        question: "Will my reports still be accurate after multi-currency is removed?",
        answer:
          "Yes. Totals in the home currency remain identical to what they were before removal, because non-home-currency transactions are converted using their originally recorded exchange rates. What changes is that the reports no longer display per-currency breakdowns or unrealized FX gain/loss columns. If you actively use those columns for management reporting, removal is probably not the right service for you and we will flag that during the pre-engagement conversation.",
      },
      {
        question: "How does NexFortis actually remove multi-currency?",
        answer:
          "The feature flag is disabled at the database level, non-home-currency transactions are normalized to a single currency using their originally recorded exchange rates, and the exchange-rate lists are cleared. The result is a file that behaves as if multi-currency was never enabled. Validation runs against the source file's home-currency trial balance to confirm no totals shifted as a result of the removal.",
      },
      {
        question: "Can multi-currency removal be reversed?",
        answer:
          "Not from the cleaned file itself — the exchange-rate detail is collapsed during the removal and cannot be reconstructed afterward. This is why we always recommend keeping a backup of the pre-removal file in long-term storage, typically on offline media. If you ever need the historical foreign-currency detail back (for example, for an audit or a transfer-pricing study), you restore from that backup; you cannot recover it from the cleaned file.",
      },
    ],
    relatedSlugs: ["quickbooks-multi-currency-problems", "enterprise-to-premier-conversion", "audit-trail-removal", "super-condense"],
    breadcrumbs: [SERVICES_CRUMB, { name: "Multi-Currency Removal", path: "/landing/multi-currency-removal" }],
  },
  // 5h
  {
    slug: "list-reduction",
    category: "service",
    primaryKeyword: "quickbooks list reduction service",
    h1: "QuickBooks List Reduction Service",
    metaTitle: "QuickBooks List Reduction Service | NexFortis Canada",
    metaDescription:
      "Reduce bloated QuickBooks lists — customers, vendors, items, accounts — to stay below limits and speed up your file. Canadian editions, from {launchPrice}.",
    productSlug: "list-reduction",
    ctaLabel: "Reduce My Lists — From {launchPrice}",
    ctaHref: "/service/list-reduction",
    heroImageAlt:
      "Illustration of a cluttered list being trimmed down in QuickBooks",
    heroIcon: "ListMinus",
    hero: {
      intro:
        "Every QuickBooks Desktop list — customers, vendors, items, accounts — has a hard limit. NexFortis List Reduction merges duplicates, removes obsolete entries, and brings your file back below the limits without losing history.",
    },
    overview: [
      "QuickBooks Desktop enforces technical limits on every list in the file: names (customers + vendors + employees + other names), items, chart of accounts, classes, and more. Premier and Pro top out at 14,500 names combined; Enterprise allows more but still has a ceiling. Once a limit is hit, you cannot add new records until the list is reduced — and QuickBooks stops doing useful things like running Verify cleanly or completing backups within the normal time window.",
      "Lists grow for three reasons. First, years of legitimate use. Second, data-entry habits that create duplicates (for example, \"Acme Corp\", \"ACME Corporation\", and \"Acme\" stored as three separate customers because someone keyed the name slightly differently each time). Third, one-off records created during imports or integrations that were never cleaned up — a Shopify integration that creates a new customer record per email address, a payroll integration that leaves orphan vendor records when a contractor changes their billing entity, and so on. A long-running file can have thousands of records no one references anymore.",
      "NexFortis List Reduction performs a full list cleanup: duplicates are merged into a single canonical record, inactive records with no transaction history are removed, and records with stale history are consolidated under standard \"Inactive\" naming so they remain for reporting but do not clog search. Linked transactions are preserved — a merged customer's history rolls up under the surviving record, so prior-period customer reports continue to show the same totals they showed before the cleanup.",
      "What we do not do is mass-delete records that still have live transactions. Those remain in the file, but they are renamed and inactivated so that reports and searches stay clean. You receive a before-and-after count for every list and a CSV of the specific records merged or inactivated, with the merge target identified for each pair. The CSV is your audit trail of the cleanup and lets you spot-check any specific record if a question arises after the fact.",
      "Most List Reduction engagements turn around in one to two business days. Very large lists (200,000+ records combined) can take three. We offer a paid dry-run analysis that produces the merge/inactivate CSV without making any changes to the file, so you can review it and approve the proposed cleanup before we run the actual reduction. The dry-run cost is credited against the full engagement if you proceed, and is the recommended path when an external accountant or auditor needs to sign off on the cleanup before it happens.",
      "List Reduction is often combined with Audit Trail Removal and Super Condense in a single engagement when the file is both list-bloated and size-bloated. For most long-running businesses, all three issues develop together — the file grows, the audit trail balloons, and the lists fill with stale records — so handling all three at once is typically the most cost-effective path back to a fast, manageable file.",
    ],
    benefits: [
      {
        title: "Stay under list limits",
        body: "Bring Premier/Pro files back under the 14,500-name ceiling so you can add new customers and vendors again.",
      },
      {
        title: "Duplicates merged",
        body: "\"Acme Corp\" and \"Acme Corporation\" become one record with consolidated history and a single canonical name.",
      },
      {
        title: "Reports stay clean",
        body: "Inactivation preserves historical data while removing clutter from search results and dropdowns in transaction forms.",
      },
      {
        title: "Full audit trail",
        body: "You receive a CSV of every record merged or inactivated, with merge targets identified, so the cleanup is fully traceable.",
      },
    ],
    process: [
      {
        title: "Identify target lists",
        body: "Tell us which lists are causing pain — typically names and items for most businesses, sometimes accounts or classes for files used by multi-entity bookkeepers.",
      },
      {
        title: "Upload your file",
        body: "Create a .QBM and upload it over a 256-bit encrypted connection. A dry-run analysis option is available if external sign-off is needed before running the cleanup.",
      },
      {
        title: "NexFortis merges and inactivates",
        body: "Duplicates are merged with history consolidated; stale records are inactivated with standardized naming. Linked transactions are preserved.",
      },
      {
        title: "Review the cleanup report",
        body: "You receive the cleaned .QBM plus a CSV showing exactly which records were merged or inactivated, with merge targets identified for traceability.",
      },
    ],
    faqs: [
      {
        question: "What are the QuickBooks list limits I should know about?",
        answer:
          "In Premier and Pro the combined limit for customers, vendors, employees, and other names is 14,500 records. Items cap at 14,500 as well. Chart of accounts tops out at 10,000. Classes and customer types cap lower. Enterprise allows higher limits — up to 100,000 names with the right configuration — but is not unlimited. List Reduction brings files back under whichever ceilings apply to your edition.",
      },
      {
        question: "Can I reduce my QuickBooks lists myself?",
        answer:
          "You can inactivate individual records from within QuickBooks, but the process is slow and does not merge duplicates' transaction history — each duplicate has to be handled individually, and the standard QuickBooks merge UI is limited to one pair at a time. NexFortis performs the cleanup at scale (thousands of records in a single pass) with linked-transaction preservation that manual inactivation cannot match.",
      },
      {
        question: "What happens to inactive items after the reduction?",
        answer:
          "Inactive records stay in the file so historical reports continue to work, but they no longer clog search results or dropdowns in transaction forms. You can reactivate any inactivated record at any time from inside QuickBooks if you ever need to use it again. The cleanup CSV identifies every inactivated record, so reactivation is straightforward when needed.",
      },
      {
        question: "Will list reduction affect my reports?",
        answer:
          "No. Historical transactions remain linked to their records. When duplicates are merged, the merged history rolls up under the surviving record, so totals are preserved. You will see the same report numbers before and after reduction. The only visible change is that historical reports group transactions under the canonical (merged) customer or vendor name rather than splitting them across the original duplicates.",
      },
      {
        question: "How does NexFortis decide which records are duplicates?",
        answer:
          "We use a combination of fuzzy name matching, address matching, contact-info matching, and (for vendors) tax-ID matching. The proposed merge pairs are presented in the dry-run CSV before any change is made, and you can override any specific pair before the cleanup runs. For high-stakes records (large customers or major vendors), we recommend reviewing the dry-run output rather than approving blind.",
      },
    ],
    relatedSlugs: ["super-condense", "audit-trail-removal", "quickbooks-running-slow"],
    breadcrumbs: [SERVICES_CRUMB, { name: "List Reduction", path: "/landing/list-reduction" }],
  },
  // 5i
  {
    slug: "qbo-readiness",
    category: "service",
    primaryKeyword: "quickbooks desktop to online migration",
    h1: "QuickBooks Desktop to Online Readiness Report",
    metaTitle: "QuickBooks Desktop to Online Readiness Report | NexFortis",
    metaDescription:
      "Know before you migrate. A detailed readiness report on your QuickBooks Desktop file's compatibility with QuickBooks Online — Canadian-aware. From {launchPrice}.",
    productSlug: "qbo-readiness-report",
    ctaLabel: "Order Readiness Report — From {launchPrice}",
    ctaHref: "/service/qbo-readiness-report",
    heroImageAlt:
      "Illustration of a QuickBooks Desktop file being analyzed for QBO compatibility",
    heroIcon: "Cloud",
    hero: {
      intro:
        "Moving from QuickBooks Desktop to QuickBooks Online is a one-way trip with real limitations. The NexFortis Readiness Report tells you exactly what will and will not transfer before you commit to the migration.",
    },
    overview: [
      "Intuit's official QuickBooks Desktop to Online migration tool has documented limitations: file size caps, target-count limits (250,000 targets on most editions), features that are not supported in QBO, and behaviors that silently change after migration. Running headfirst into these after cutover is painful — reports that worked yesterday stop working tomorrow, and a rollback to Desktop is not trivial because the QBO file's data structure differs from the Desktop file's in ways that no third-party tool can perfectly reverse.",
      "The QBO Readiness Report analyzes your Desktop file across four dimensions. Technical compatibility: file size, target count, list sizes against QBO's ceilings. Feature usage: which Desktop features you actively use (inventory assemblies, progress invoicing, custom fields, job costing, advanced inventory, classes, multiple budgets) and how each behaves in QBO. Integration inventory: which third-party apps and bank feeds are attached to your Desktop file and whether equivalents exist in the QBO app store. Data hygiene: how many duplicate names, orphaned transactions, or stale items might complicate the migration.",
      "You receive a written report that lists every issue found, rated by severity, with a recommendation. Some issues are \"fix in Desktop before migrating\" (for example, reducing lists to get under QBO's name and item limits, or running Super Condense to get the file under QBO's target-count ceiling). Others are \"accept the behavior change\" (for example, progress invoicing working differently in QBO, or job costing being less granular). A handful are \"do not migrate to QBO yet\" (for example, a critical integration that has no QBO equivalent and that your business operations depend on day-to-day).",
      "The readiness report is not the migration itself — it is the decision aid you use before deciding whether, when, and how to migrate. Many customers use it to identify pre-migration cleanup work, then schedule the actual migration once their file is ready. Other customers use it specifically to decide against migrating, either temporarily (until a blocking integration becomes available in QBO) or permanently (because the cost-benefit does not work for their specific feature mix).",
      "Canadian-specific considerations are built into the analysis. Canadian Payroll on Desktop has no direct QBO equivalent (QBO Canada uses a different payroll architecture), GST/HST handling in QBO Canada has subtle behavioral differences from Desktop, and Canadian-edition multi-currency handling differs in ways that affect reporting. We flag each of these explicitly in the report rather than treating Canadian editions as edge cases — a common gap in generic QBO readiness assessments produced by US-based consultancies.",
      "Most readiness reports are delivered same-day once the file is uploaded. Very large files (over 1 GB) or files with extensive third-party integrations may take a full business day. The report is delivered as a 4–8 page PDF with severity-rated findings, recommended next steps for each, and a \"go / no-go / wait\" recommendation at the top. The report is yours to keep and share with your accountant, internal IT, or any other advisor — there are no licensing restrictions on circulation.",
    ],
    benefits: [
      {
        title: "Know before you commit",
        body: "Identify showstoppers and behavior changes before the one-way cutover to QBO, not after — when rollback is no longer practical.",
      },
      {
        title: "Severity-rated findings",
        body: "Each issue is ranked so you know what needs action now versus what is a post-migration adjustment, with a clear go/no-go recommendation.",
      },
      {
        title: "Pre-migration roadmap",
        body: "Use the report as a checklist of cleanup tasks to complete in Desktop before migrating — typically List Reduction, Super Condense, and integration replacement.",
      },
      {
        title: "Canadian-aware",
        body: "We account for Canadian tax, payroll, and edition differences that generic readiness checks produced by US-based consultancies miss.",
      },
    ],
    process: [
      {
        title: "Upload your Desktop file",
        body: "Create a .QBM and upload it over a 256-bit encrypted connection. The file is read-only — no changes are made to your Desktop file at any point.",
      },
      {
        title: "NexFortis analyzes",
        body: "We run the four-dimension assessment (technical, feature, integration, data hygiene) and compile findings against current QBO limits and behaviors.",
      },
      {
        title: "Receive the PDF report",
        body: "A 4–8 page report with severity-rated findings, recommended next steps for each, and an overall go/no-go/wait recommendation.",
      },
      {
        title: "Plan the migration (or not)",
        body: "Use the report to decide whether, when, and how to migrate. The report is yours to share with your accountant, IT team, or other advisors.",
      },
    ],
    faqs: [
      {
        question: "What does the QBO readiness report check?",
        answer:
          "Four areas: technical compatibility (file size, target count, list sizes against QBO limits), feature usage (which Desktop features you rely on and how they behave in QBO), third-party integrations (which apps have QBO equivalents in the app store), and data hygiene (duplicates, orphans, and cleanup opportunities). Canadian-specific considerations — payroll, GST/HST, multi-currency — are flagged explicitly.",
      },
      {
        question: "Do I have to migrate to QuickBooks Online after ordering the report?",
        answer:
          "No. The report is an independent assessment with no obligation to follow up. Many customers use it specifically to decide against migrating — or to stay on Desktop until a blocking integration becomes available in QBO. The report is yours to keep and share with your accountant, internal IT, or other advisors with no licensing restrictions.",
      },
      {
        question: "What if my file is not ready for QuickBooks Online?",
        answer:
          "The report lists the blocking issues with recommendations. Common pre-migration work includes List Reduction (to get under QBO limits), Super Condense (to get under file size and target-count limits), and cleanup of duplicate or orphaned records. You can tackle these yourself or as follow-up NexFortis services. Once the blocking issues are addressed, you can re-run the readiness report to confirm before scheduling the actual migration.",
      },
      {
        question: "How long does the readiness assessment take?",
        answer:
          "Same-day delivery in most cases once the file is uploaded. Very large files (over 1 GB) or files with extensive third-party integrations may take one full business day. The report itself is typically 4–8 pages and is delivered as a PDF, so you receive it as soon as the analysis is complete rather than waiting for a printed version or a scheduled review call.",
      },
      {
        question: "Does the readiness report cover Canadian Payroll specifically?",
        answer:
          "Yes. Canadian Payroll on Desktop has no direct QBO equivalent — QBO Canada uses a structurally different payroll architecture that does not import Desktop's payroll tax tables, T4 slips, or ROE history at line-item detail. The report explains the gap, lists the data that will and will not transfer, and recommends a cutover approach (typically a fiscal year-end or quarter-end migration so the gap aligns with a natural reporting boundary).",
      },
    ],
    relatedSlugs: ["enterprise-to-premier-conversion", "super-condense", "list-reduction", "quickbooks-desktop-end-of-life", "how-conversion-works"],
    breadcrumbs: [SERVICES_CRUMB, { name: "QuickBooks Desktop to Online Readiness", path: "/landing/qbo-readiness" }],
  },
  // ===== Group B — Problem-focused =====
  // 5j
  {
    slug: "quickbooks-file-too-large",
    category: "problem",
    primaryKeyword: "quickbooks file too large",
    h1: "QuickBooks File Too Large — Fix It Fast",
    metaTitle: "QuickBooks File Too Large? How to Shrink It | NexFortis",
    metaDescription:
      "QuickBooks file too large and slowing you down? Learn the four root causes and the three NexFortis services that safely shrink it — Canadian files supported.",
    ctaLabel: "See Size-Reduction Services",
    ctaHref: "/catalog",
    heroImageAlt:
      "Illustration of an oversized QuickBooks file being measured on a scale",
    heroIcon: "FileWarning",
    hero: {
      intro:
        "If QuickBooks takes minutes to open, your backups fail, or data entry feels sluggish, file size is almost certainly part of the problem. This page walks you through what is causing it and which NexFortis service will fix it.",
    },
    overview: [
      "A QuickBooks company file does not stay small on its own. Every transaction, every edit, every list entry, and every piece of attached metadata adds to the file. Over several years of steady use, it is normal for a file to grow into the 500 MB to 2 GB range — and once past about 1.5 GB in Premier or Pro, or 2.5 GB in Enterprise, you start to see the symptoms that brought you to this page. Past those thresholds the file does not just slow down; it becomes statistically more likely to corrupt, because the database engine inside QuickBooks was not architected for files that large.",
      "Common symptoms: the file takes more than 60 seconds to open, backups fail or abort partway through, data entry has noticeable lag between keystrokes, reports hang before rendering, and Verify Data either fails or runs for hours. In multi-user environments the symptoms show up as network timeouts, H-series errors (H202, H303, H505), and \"the connection has been lost\" dialogs that interrupt active data entry several times a day. If you are seeing any combination of these, file size is the first thing to investigate.",
      "There are four main contributors to file growth. First, the audit trail — the log of every change ever made — which can easily account for 30–60% of total file size on long-running files because it is append-only and cannot be summarized from inside QuickBooks. Second, years of transaction detail that could be summarized without losing reporting value, particularly for fiscal periods that have already been closed and audited. Third, bloated lists: thousands of customers, vendors, or items that are no longer actively used but still occupy database space and slow down every search and dropdown. Fourth, on Canadian editions, the fact that Intuit's built-in Condense Data utility does not work means the file has never been reduced — even when the business owner has actively wanted to shrink it.",
      "Three NexFortis services address the problem, individually or in combination. Audit Trail Removal typically delivers a 30–60% reduction by itself and is the lowest-effort, lowest-cost option to try first. Super Condense summarizes pre-cutoff transaction history for another 50–80% off what remains and is the most effective option for files with many years of legitimate detail. List Reduction handles the bloated lists and keeps you under QuickBooks' technical limits, which is critical when the file is at risk of hitting the 14,500-name ceiling. For badly overgrown files, all three run together often produce a 90%+ total size reduction in a single engagement.",
      "The right starting point depends on your specific situation. If your file has been in daily use for many years and the audit trail has never been removed, start there — it is the cheapest test and frequently delivers the largest single reduction. If the file is over 2 GB and is actively causing instability, jump straight to Super Condense (combined with Audit Trail Removal as a single engagement). If you are bumping up against list limits and cannot add new customers or vendors, List Reduction is mandatory regardless of file size — the limits are technical, not soft, and additions simply fail until the limit is cleared.",
      "Prevention matters too. The single most effective long-term strategy is annual maintenance: run Audit Trail Removal once a year, immediately after fiscal year-end and once any audit work is complete. Combine it with Super Condense every two to three years if you have high transaction volume. This cadence keeps the file fast and stable indefinitely, instead of letting bloat accumulate to the point where you are running emergency reduction work because the file became unusable. Most NexFortis customers move to this annual cadence after their first major reduction engagement.",
    ],
    benefits: [
      {
        title: "Audit Trail Removal",
        body: "Removes the change-history log. 30–60% reduction is typical. First choice for files that have been in daily use for many years.",
      },
      {
        title: "Super Condense",
        body: "Summarizes pre-cutoff transaction detail. 50–80% reduction. The only option that works on Canadian files (Intuit's Condense does not).",
      },
      {
        title: "List Reduction",
        body: "Merges duplicates and inactivates stale records. Keeps you under the 14,500-name and 14,500-item limits in Premier/Pro.",
      },
      {
        title: "Combined cleanup",
        body: "For very large files, running all three services together routinely produces a 90%+ total size reduction in a single engagement.",
      },
    ],
    process: [
      {
        title: "Measure current size",
        body: "Check your file size (File → Company Information or Windows file properties) and note the pain points you are seeing — slow opens, failed backups, report hangs.",
      },
      {
        title: "Pick the right service",
        body: "Use the FAQ below — or contact support — to choose between Audit Trail Removal, Super Condense, List Reduction, or a combination based on your specific symptoms.",
      },
      {
        title: "Upload your backup",
        body: "Create a .QBM and upload it over a 256-bit encrypted connection. Your original file stays untouched on your computer throughout the engagement.",
      },
      {
        title: "Receive the shrunk file",
        body: "You get the cleaned .QBM with balances preserved and a before/after size comparison report so you can see exactly what was reduced.",
      },
    ],
    faqs: [
      {
        question: "What is the maximum QuickBooks file size?",
        answer:
          "QuickBooks does not publish a single hard limit, but in practice Premier and Pro become unstable above 1.5 GB and Enterprise above 2.5 GB. Symptoms (slow opens, failed backups, report hangs, Verify failures) usually appear well before the instability threshold, so by the time the file is at the threshold itself, it has typically been painful to use for some time.",
      },
      {
        question: "How do I check my QuickBooks file size?",
        answer:
          "Open QuickBooks, go to File → Utilities → Condense Data (even though you will not actually run it) — the wizard shows current file size on the first screen. You can also check the .QBW file directly in Windows File Explorer and view its Properties for the size. The two numbers should agree closely; a large discrepancy is itself an indicator of corruption worth investigating.",
      },
      {
        question: "Why does my Canadian QuickBooks file keep growing?",
        answer:
          "Because Intuit's built-in Condense Data utility does not support Canadian editions, there is no in-product way to reduce the file. On Canadian files, the audit trail and pre-cutoff transaction detail accumulate indefinitely unless a service like Audit Trail Removal or Super Condense is run externally. This is a long-standing product limitation that Intuit has not signalled plans to address, which is why third-party services exist to fill the gap.",
      },
      {
        question: "Which service reduces QuickBooks file size the most?",
        answer:
          "Super Condense typically produces the largest single reduction (50–80%) because it collapses years of pre-cutoff detail into opening balances. Audit Trail Removal is the fastest and lowest-cost option when the audit trail is the main bloat contributor — and it is, on most files that have not been condensed in several years. Combining both plus List Reduction often exceeds 90% total reduction on long-running files.",
      },
      {
        question: "Can I prevent my QuickBooks file from growing too large?",
        answer:
          "Partially. Good data-entry habits (avoid duplicates, inactivate records you stop using, do not store attached document images directly in the file) slow growth. Scheduled annual Audit Trail Removal keeps change-log bloat under control. On Canadian files, periodic Super Condense (every two to three years for high-volume files) is the only practical maintenance strategy. Most NexFortis customers move to this annual cadence after their first reduction engagement.",
      },
      {
        question: "Will reducing the file size lose any of my data?",
        answer:
          "No data is lost from the live operating record. Audit Trail Removal removes only the change history. Super Condense replaces pre-cutoff transaction detail with opening balance journal entries that match the original totals exactly. List Reduction inactivates rather than deletes records that still have history. In all three services, current-year and post-cutoff reporting is unaffected and trial balance ties out to the source file before you go live.",
      },
    ],
    relatedSlugs: ["super-condense", "audit-trail-removal", "quickbooks-running-slow", "quickbooks-desktop-end-of-life"],
    breadcrumbs: [SERVICES_CRUMB, { name: "QuickBooks File Too Large", path: "/landing/quickbooks-file-too-large" }],
  },
  // 5k
  {
    slug: "quickbooks-running-slow",
    category: "problem",
    primaryKeyword: "quickbooks running slow",
    h1: "Why Is QuickBooks Running Slow? Solutions and Services",
    metaTitle: "QuickBooks Running Slow? Causes and Fixes | NexFortis",
    metaDescription:
      "QuickBooks running slow? Learn whether it is your file, your network, or your hardware — and which NexFortis service fixes the file-related causes safely.",
    ctaLabel: "Fix a Slow QuickBooks File",
    ctaHref: "/catalog",
    heroImageAlt:
      "Illustration of a slow QuickBooks window being sped up after file optimization",
    heroIcon: "Zap",
    hero: {
      intro:
        "QuickBooks slowness is usually one of three things: a bloated file, a network problem, or an underpowered machine. This page helps you figure out which is yours and, if it is the file, tells you exactly which service fixes it.",
    },
    overview: [
      "\"QuickBooks is slow\" is the single most common support complaint we hear. The frustrating part is that the remedy depends entirely on the cause — and the cause is not always obvious from the symptoms. Spending money on new hardware when the real problem is a 4 GB audit trail is a waste, and so is running file optimization on a file sitting on an underpowered NAS with a bad network card. The diagnostic steps below will tell you which category your slowness falls into before you spend money on the wrong fix.",
      "There are five main causes of QuickBooks slowness. File size is the most common: once a file exceeds about 1.5 GB in Premier/Pro or 2.5 GB in Enterprise, every operation that touches the database slows down because the database engine inside QuickBooks was not designed for files that large. Network issues come second: multi-user mode relies on the file sitting on a shared drive, and any network-card flakiness, weak Wi-Fi, or VPN latency translates directly into in-app lag because every keystroke in many forms triggers a small write to the shared file. Audit trail bloat is often a file-size problem dressed up as something else — the log is part of the file, and it is accessed every time a transaction is posted or a report is run.",
      "Beyond those three, too many concurrent users (especially above the edition's licensed user count) and outdated hardware (a 5400 RPM drive is deadly for QuickBooks; a USB external drive is worse) fill out the top five. Outdated QuickBooks versions themselves are occasionally to blame, but most performance issues survive a version upgrade unless the underlying cause is also addressed — so do not assume a version upgrade is going to fix slowness without first confirming what the actual cause is.",
      "NexFortis directly addresses the three file-related causes. For size, Super Condense and Audit Trail Removal shrink the file dramatically — often turning a 60-second file open into a 10-second file open without changing anything else about the environment. For list bloat contributing to slow searches and report runs, List Reduction cleans up the name and item lists. For corruption that makes Verify run for hours or that causes random hangs during specific operations, File Repair rebuilds the database structure. For the network and hardware causes, we give honest self-help guidance below — but those are outside our scope as a data service and you will want a local IT professional to address them.",
      "How do you tell which category your slowness falls into? The fastest test is to open the file directly on the host machine, with the file stored locally on that machine's internal drive (not on a network share, not on a USB drive). If QuickBooks is fast there, your slowness is a network problem and no amount of file work will fix it. If QuickBooks is still slow on the host machine with a local file, the slowness is in the file itself — and that is what NexFortis can fix. This single test, done before any other troubleshooting, saves more time and money than any other diagnostic step.",
      "There is one slowness pattern that is sometimes misdiagnosed: \"QuickBooks is fast at the start of the day and progressively slows down.\" That pattern is almost always memory pressure on the host machine, not a file problem — QuickBooks holds the company file in memory and grows its working set throughout the session, especially on large files. Restarting QuickBooks resets the working set and restores speed temporarily. The long-term fix is either more RAM on the host machine or a smaller file (which is where Super Condense and Audit Trail Removal help indirectly even though the root cause is hardware).",
    ],
    benefits: [
      {
        title: "File-related slowness (our focus)",
        body: "Audit Trail Removal, Super Condense, and List Reduction each tackle different components of file-based slowness with predictable, measurable results.",
      },
      {
        title: "Corruption-related slowness",
        body: "File Repair rebuilds broken indexes and fixes Verify errors that make every operation hang, including the random hangs during specific operations.",
      },
      {
        title: "Network slowness (self-help)",
        body: "Move the file off Wi-Fi, use gigabit Ethernet, confirm the host machine has the company file locally, and retire any SMBv1 shares.",
      },
      {
        title: "Hardware slowness (self-help)",
        body: "Put the company file on an SSD, give QuickBooks at least 8 GB of RAM, and avoid running it over a VPN where possible.",
      },
    ],
    process: [
      {
        title: "Check file size",
        body: "If your .QBW is above 1.5 GB (Premier/Pro) or 2.5 GB (Enterprise), file size is the likely cause. This is the single most common contributor to slowness.",
      },
      {
        title: "Try Verify Data",
        body: "File → Utilities → Verify Data. If it hangs or errors, corruption is in play — File Repair is the right service. If it completes cleanly, corruption is not your issue.",
      },
      {
        title: "Isolate network vs file",
        body: "Test QuickBooks on the host machine with the file stored locally. If it is fast there and slow on clients, you have a network problem, not a file problem.",
      },
      {
        title: "Pick the right NexFortis service",
        body: "For file size: Super Condense and Audit Trail Removal. For list bloat: List Reduction. For corruption: File Repair. For network or hardware: a local IT professional.",
      },
    ],
    faqs: [
      {
        question: "Why is my QuickBooks so slow all of a sudden?",
        answer:
          "Sudden slowness usually points to a recent change: a network move, a new user added, a failed Verify that left partial corruption, a Windows update that changed disk caching, or a file that just crossed a size threshold. Check the top three: file size against the Premier/Pro/Enterprise thresholds, the most recent Verify result, and whether multi-user mode was recently enabled or moved to a different host machine.",
      },
      {
        question: "Does QuickBooks file size affect speed?",
        answer:
          "Yes, directly. Every operation that reads or writes the database touches the file on disk. Past roughly 1.5 GB in Premier/Pro, the slowdown becomes severe because the database engine inside QuickBooks was not architected for files that large. Past 2.5 GB in Enterprise, the same thing happens. Reducing the file size with Super Condense or Audit Trail Removal is often the single highest-impact fix you can make.",
      },
      {
        question: "Will Super Condense make QuickBooks faster?",
        answer:
          "Usually dramatically so, when file size is the real cause. Customers routinely go from 60-second file opens to 10-second file opens after a Super Condense, with no change to hardware or network. If your file is already small (under 500 MB) and still slow, the cause is elsewhere (network, corruption, or hardware) and Super Condense will not help. The diagnostic test above tells you which category applies before you commit.",
      },
      {
        question: "How do I know if my slow QuickBooks is a file problem or something else?",
        answer:
          "Open the file directly on the host machine with no network involvement (file stored on the host's internal drive, opened by the host's QuickBooks installation). If it is fast there and slow on client machines, the problem is the network. If it is slow on the host machine too, the problem is the file itself (size, corruption, or list bloat). This single test, done before anything else, saves more time and money than any other diagnostic step.",
      },
      {
        question: "Can NexFortis help with network-related QuickBooks slowness?",
        answer:
          "No — NexFortis is a data service, not a network services provider. We focus specifically on the file: size, corruption, and lists. For network issues (weak Wi-Fi, slow shares, VPN latency, SMBv1 shares, NIC driver problems) you want an IT professional familiar with SMB and Windows networking. We will gladly tell you whether your slowness is in the file or the network, but the network fix itself is outside our scope.",
      },
    ],
    relatedSlugs: ["quickbooks-file-too-large", "super-condense", "audit-trail-removal", "file-repair", "quickbooks-desktop-end-of-life"],
    breadcrumbs: [SERVICES_CRUMB, { name: "QuickBooks Running Slow", path: "/landing/quickbooks-running-slow" }],
  },
  // 5l
  {
    slug: "quickbooks-company-file-error",
    category: "problem",
    primaryKeyword: "quickbooks company file error",
    h1: "QuickBooks Company File Error — Fix and Recovery",
    metaTitle: "QuickBooks Company File Error: Codes & Fixes | NexFortis",
    metaDescription:
      "QuickBooks company file errors explained: H202, H303, 6000-series. Self-help steps that work, when to call NexFortis, and how database-level repair works.",
    ctaLabel: "Start File Repair",
    ctaHref: "/landing/file-repair",
    heroImageAlt:
      "Illustration of a QuickBooks error dialog being resolved by file repair",
    heroIcon: "AlertTriangle",
    hero: {
      intro:
        "QuickBooks company file errors come in a handful of families — H-series, 6000-series, and update errors. This page explains what each one means, which you can fix yourself, and when professional file repair is the right next step.",
    },
    overview: [
      "A company file error in QuickBooks is the app's way of saying \"I cannot open this file the way I expected to.\" The error code narrows down the cause. H202, H303, and H505 are all multi-user hosting errors — the client machine cannot reach the file on the host. The 6000-series errors (6000 -77, 6000 -80, 6000 -82, 6000 -83, 6123, 6147) are file-integrity or path errors. \"Company file needs to be updated\" appears when a newer QuickBooks version is opening an older file. \"Could not locate the company file\" appears when the file path itself is broken — typically because the share moved, the host renamed, or the user lost network drive mappings.",
      "For the H-series, start with self-help: open QuickBooks File Doctor (free from Intuit), confirm the host machine is running QuickBooks Database Server Manager, and that the company file folder is shared with full control for the user running QuickBooks. Most H-series errors are network configuration, not file damage — and most resolve in under an hour with the standard checklist (firewall ports 8019, 56728, 55378-55382 open; SMB enabled on the host; the host's QuickBooks Database Server Manager service running). If File Doctor and the standard checklist do not resolve the H-series error, the next step is to validate that the user account has read-write access to the share, not just read access — a surprisingly common cause that File Doctor does not always catch.",
      "For the 6000-series, the standard first steps are File → Utilities → Verify Data, followed by Rebuild Data if Verify reports errors. Many 6000-series errors resolve with one Verify/Rebuild cycle. If they do not, the next step is to rename the .TLG (transaction log) and .ND (network descriptor) files — QuickBooks regenerates these on the next open and the regenerated files are often what the error was actually complaining about, even though the error message blamed the company file itself. Only when those steps fail is the issue true file corruption requiring database-level repair.",
      "NexFortis File Repair is the right service when Verify fails to complete, Rebuild reports errors it cannot fix, or the file will not open at all even after the .TLG/.ND reset. We perform a free diagnostic before any repair charge so that unrecoverable files are identified up front. For files that are too damaged to repair, we offer data recovery into a new, clean company file — which preserves your customers, vendors, items, and as much transaction history as the recovery process can extract from the damaged source.",
      "There is one error pattern that is uniquely worth flagging: the file opens, but Verify Data reports a small number of errors that Rebuild cannot fix. This is the most dangerous state because the file is still in active use and accumulating new transactions on top of an underlying corruption that is silently growing. Files in this state typically remain stable for weeks or months and then fail catastrophically — usually during a backup, a year-end close, or a multi-user session. If your Verify is reporting errors that Rebuild does not clear, do not keep entering data; run File Repair before the file fails completely.",
      "Prevention is mostly about avoiding the conditions that cause corruption in the first place. Do not run QuickBooks multi-user mode over a Wi-Fi connection. Do not store the company file on a USB drive or a NAS that has not been validated for QuickBooks. Do not put the host machine to sleep with QuickBooks open. Do not let the file grow past the practical 1.5 GB / 2.5 GB instability thresholds without periodic maintenance. Take a daily backup that is verified — meaning you actually restore it once a month to confirm it works — rather than just trusting that the backup is happening. These five practices avoid the vast majority of file-error situations.",
    ],
    benefits: [
      {
        title: "H-series errors",
        body: "H202/H303/H505 are multi-user hosting errors. Start with QuickBooks File Doctor and Database Server Manager — usually not file corruption.",
      },
      {
        title: "6000-series errors",
        body: "6000 -77, -80, -82, -83, 6123, 6147 are file-integrity errors. Start with Verify/Rebuild, then rename .TLG and .ND files.",
      },
      {
        title: "When self-help fails",
        body: "If Verify/Rebuild cannot complete or the file still will not open, you have true corruption. That is when NexFortis File Repair is the right next step.",
      },
      {
        title: "Recovery when repair is impossible",
        body: "For catastrophic damage, we extract recoverable records into a brand-new company file instead of trying to save the original.",
      },
    ],
    process: [
      {
        title: "Run Verify Data",
        body: "File → Utilities → Verify Data. Note any errors reported — they are the key input to the next step. A clean Verify means corruption is not your issue.",
      },
      {
        title: "Try Rebuild and .TLG/.ND rename",
        body: "Run Rebuild Data if Verify reported errors. If that does not fix it, close QuickBooks and rename the .TLG and .ND files so QuickBooks regenerates them on next open.",
      },
      {
        title: "Upload to NexFortis",
        body: "If self-help fails or the file will not open at all, create a backup (.QBM if possible, .QBW if not) and upload it over a 256-bit encrypted connection.",
      },
      {
        title: "Diagnostic and repair",
        body: "We assess feasibility before charging for repair. You receive the repaired file plus a short report of what was fixed and how to prevent recurrence.",
      },
    ],
    faqs: [
      {
        question: "What does QuickBooks error 6000 mean?",
        answer:
          "The 6000-series errors (6000 -77, 6000 -80, 6000 -82, 6000 -83, 6123, 6147 and related) indicate a problem accessing the company file itself — either a file-integrity issue, a broken path, or network-share permissions blocking the open. The specific sub-code narrows down the cause: -82 and -83 typically mean file-system permissions, -77 and -80 typically mean the file was opened by another process, and 6123/6147 typically mean true file-integrity damage requiring repair.",
      },
      {
        question: "Can I fix QuickBooks file errors myself?",
        answer:
          "Often, yes. Most H-series errors resolve with QuickBooks File Doctor and correct Database Server Manager configuration plus the standard firewall-and-share checklist. Most 6000-series errors resolve with Verify/Rebuild followed by a .TLG and .ND file rename. Only when those steps fail is professional repair needed. The self-help process resolves an estimated 70% of file errors without any external service involvement.",
      },
      {
        question: "What if Verify and Rebuild Data doesn't work?",
        answer:
          "If Rebuild fails to complete, reports unfixable errors, or the file still will not open after the .TLG/.ND rename, you have true structural corruption. NexFortis File Repair performs database-level rebuild of indexes and record links that Verify/Rebuild cannot fix — and for files where even database-level repair is not enough, we can extract recoverable data into a brand-new company file via the data recovery process.",
      },
      {
        question: "How much does professional QuickBooks file repair cost?",
        answer:
          "Pricing starts at the listed launch price and scales with severity of the damage. Diagnostic assessment is free — if the file cannot be recovered, you are not charged. The diagnostic also gives you a firm fixed-price quote for the repair before work begins, so there are no surprises after delivery. Most repairs come in at or near the listed launch price; only catastrophic damage requiring full data recovery into a new file commands a premium.",
      },
      {
        question: "Is my data at risk with a corrupted QuickBooks file?",
        answer:
          "Potentially, yes. A file that fails Verify is a file that can become unopenable at the next crash or network hiccup, and the most dangerous state is a file that opens but reports errors Rebuild cannot fix — that file is silently accumulating new transactions on top of growing corruption and will eventually fail catastrophically. Do not keep entering data into a file with known corruption — run repair first, then resume. And always keep a current backup, because recovery is easier from a mildly damaged file than from one that has been pushed past the point of opening.",
      },
    ],
    relatedSlugs: ["file-repair", "quickbooks-file-too-large", "quickbooks-running-slow", "is-it-safe"],
    breadcrumbs: [SERVICES_CRUMB, { name: "QuickBooks Company File Error", path: "/landing/quickbooks-company-file-error" }],
  },
  // 5m
  {
    slug: "quickbooks-multi-currency-problems",
    category: "problem",
    primaryKeyword: "quickbooks multi currency problems",
    h1: "QuickBooks Multi-Currency Problems and Removal",
    metaTitle: "QuickBooks Multi-Currency Problems & Fix | NexFortis",
    metaDescription:
      "Multi-currency accidentally enabled in QuickBooks? Intuit will not let you turn it off. Learn the common problems and how NexFortis removes it at file level.",
    ctaLabel: "Remove Multi-Currency",
    ctaHref: "/landing/multi-currency-removal",
    heroImageAlt:
      "Illustration of currency exchange fields cluttering a QuickBooks form",
    heroIcon: "Coins",
    hero: {
      intro:
        "Multi-currency in QuickBooks is a one-way toggle: once on, you cannot turn it off from within the product. This page explains the problems it causes, why it cannot be disabled, and how NexFortis removes it at the file level.",
    },
    overview: [
      "Multi-currency is a feature in QuickBooks Desktop designed for businesses that regularly transact in more than one currency. For those businesses it works well. The problem is how it gets enabled for businesses that do not need it: a single accidental click on \"Yes, I use more than one currency\" permanently flips the file into multi-currency mode. From that point on, QuickBooks behaves as if the business deals in multiple currencies whether it does or not — and Intuit's documentation explicitly confirms there is no in-product way to reverse the toggle.",
      "Symptoms of accidental multi-currency enablement are consistent. Every invoice, bill, and payment screen now includes exchange-rate fields, even if only one currency is ever used. Reports add per-currency columns and totals that clutter the output. Exchange-rate errors begin to appear — warnings that a non-existent exchange rate is out of date, prompts to update foreign-currency rates that nobody actually uses, and inaccurate home-currency totals if anyone ever enters a transaction in the wrong currency by mistake. Performance drops slightly because the feature adds overhead to every transaction post.",
      "The downstream cost of leaving multi-currency on when you do not need it is mostly soft but real: staff spend time training around the exchange-rate fields, occasionally make data-entry errors on those fields that have to be corrected after the fact, and gradually lose trust in QuickBooks reports because they cannot tell at a glance whether a total is in CAD, USD, or a mix. For accounting practices managing multiple client files, the inconsistency is also a frustration — a single client file with multi-currency on requires different training and different review processes than the rest of the practice.",
      "The critical frustration is that Intuit provides no supported way to turn the feature off. Their documentation confirms this explicitly: once enabled, multi-currency is permanent. This leaves affected businesses with three options. Start a new company file and re-enter all data (impractical for any active business with history worth preserving). Live with the clutter (the usual choice, grudgingly, for businesses that do not realize a third option exists). Or remove the feature at the file level — which is what NexFortis does.",
      "NexFortis Multi-Currency Removal directly edits the company file to disable the multi-currency flag, normalize any non-home-currency transactions to the home currency using their originally recorded exchange rates, and clear the exchange-rate lists. Reported totals in the home currency are unchanged because we use the original transaction-level exchange rates rather than re-pricing at a current rate. The result is a file that behaves as if multi-currency was never enabled, with home-currency historical reports tying out exactly to what they showed before the removal.",
      "The most common scenario we see is a single-currency Canadian business whose file was set up by an accountant or bookkeeper who flipped multi-currency on out of habit (it is a common default in some setup wizards) and then handed the file back to the business owner without warning that the toggle could not be reversed. Years later the business owner is looking at a file with USD, EUR, and GBP exchange-rate prompts on every screen even though they have only ever invoiced in CAD. Removal restores the file to the single-currency CAD state it should always have been in, with no impact on the historical CAD totals.",
    ],
    benefits: [
      {
        title: "Clean data-entry screens",
        body: "Exchange-rate fields and currency prompts disappear from invoices, bills, and payment forms. Staff stop second-guessing whether totals are in CAD or USD.",
      },
      {
        title: "Clean reports",
        body: "Per-currency columns and sub-totals are removed. Reports return to single-currency format and managers can trust the numbers at a glance again.",
      },
      {
        title: "No data loss",
        body: "Non-home-currency transactions are normalized using their originally recorded exchange rates, so home-currency totals stay identical before and after.",
      },
      {
        title: "Immediate productivity gain",
        body: "No more training staff around exchange-rate fields that should not exist on their screens, and no more correcting accidental currency-misposting errors.",
      },
    ],
    process: [
      {
        title: "Confirm the home currency",
        body: "Decide which currency becomes the only currency post-removal — typically the currency you invoice and bank in. We will help confirm if the file's home currency was set incorrectly at creation.",
      },
      {
        title: "Back up and upload",
        body: "Create a .QBM backup and upload it to NexFortis over a 256-bit encrypted connection. Your original file stays untouched throughout the engagement.",
      },
      {
        title: "Removal at the file level",
        body: "We normalize non-home-currency transactions, disable the multi-currency flag, and clear exchange-rate lists. Trial balance is validated against the source.",
      },
      {
        title: "Download the cleaned file",
        body: "You receive a .QBM that no longer treats the file as multi-currency, with home-currency totals unchanged and a before/after comparison report included.",
      },
    ],
    faqs: [
      {
        question: "Why can't I turn off multi-currency in QuickBooks Desktop?",
        answer:
          "Intuit designed multi-currency as a one-way toggle and their documentation explicitly confirms there is no supported way to disable it from within the product. The reasoning given is that the feature changes how transactions are stored at the database level, and Intuit chose not to build the reverse migration. The toggle was deliberately made permanent rather than the omission being an oversight.",
      },
      {
        question: "What problems does accidental multi-currency enablement cause?",
        answer:
          "Cluttered invoice, bill, and payment screens with unwanted exchange-rate fields. Reports that show per-currency columns and totals even though only one currency is in use. Exchange-rate update prompts and warnings about stale rates that nobody actually uses. Occasional data-entry errors when staff misclick a currency field. Slight performance overhead. Loss of staff trust in QuickBooks reports because of the per-currency clutter.",
      },
      {
        question: "Will removing multi-currency change my historical numbers?",
        answer:
          "No. Home-currency totals are unchanged because non-home-currency transactions are normalized using their originally recorded exchange rates rather than re-priced at current rates. A USD invoice that was previously stored as both USD 1,000 and CAD 1,350 simply becomes CAD 1,350 after removal, with the original exchange rate preserved in the transaction memo. Trial balance ties out exactly between source and cleaned file, validated on a per-account basis.",
      },
      {
        question: "How does NexFortis remove multi-currency safely?",
        answer:
          "We work on a copy of your file at the database level. The multi-currency flag is disabled, non-home-currency transactions are normalized using their originally recorded exchange rates, and the exchange-rate lists are cleared. Validation runs against the source file's home-currency trial balance to confirm no totals shifted as a result of the removal. Your original file stays untouched on your computer throughout the engagement.",
      },
      {
        question: "Can I avoid multi-currency problems in the first place?",
        answer:
          "Yes — never click \"Yes, I use more than one currency\" unless you genuinely transact in foreign currencies. The toggle is buried in Edit → Preferences → Multiple Currencies, and it is the only place the feature can be enabled. Once a file is set up correctly without multi-currency, the feature stays off permanently. The vast majority of accidental enablements happen during initial file setup or during a setup wizard run by a third-party consultant who flipped it on out of habit.",
      },
    ],
    relatedSlugs: ["multi-currency-removal", "audit-trail-removal", "super-condense"],
    breadcrumbs: [SERVICES_CRUMB, { name: "QuickBooks Multi-Currency Problems", path: "/landing/quickbooks-multi-currency-problems" }],
  },
  // ===== Group C — Comparison / Alternative =====
  // 5n
  {
    slug: "etech-alternative",
    category: "comparison",
    primaryKeyword: "etech quickbooks conversion alternative",
    h1: "A Modern Alternative to E-Tech for QuickBooks Conversions",
    metaTitle: "E-Tech Alternative for QuickBooks Conversion | NexFortis",
    metaDescription:
      "Looking for an alternative to E-Tech for QuickBooks Enterprise to Premier conversion? Compare NexFortis: Canadian-first, transparent pricing from {launchPrice}.",
    productSlug: "enterprise-to-premier-standard",
    ctaLabel: "Convert with NexFortis — From {launchPrice}",
    ctaHref: "/service/enterprise-to-premier-standard",
    heroImageAlt:
      "Side-by-side comparison illustration of two QuickBooks conversion service offerings",
    heroIcon: "Scale",
    hero: {
      intro:
        "If you have been searching for an alternative to E-Tech for QuickBooks Enterprise to Premier conversions, NexFortis offers a Canadian-first, modern, and transparently priced option. Below is a factual comparison so you can decide what fits your file.",
    },
    overview: [
      "QuickBooks Enterprise to Premier or Pro downgrades are a niche service. Only a handful of providers globally offer them at all, and most operate behind opaque ordering processes, request-a-quote forms, and ad-hoc turnaround estimates. E-Tech is one of the better-known providers in the space and has been operating for many years. NexFortis is a newer entrant that focuses specifically on Canadian editions of QuickBooks and on a transparent, self-service ordering experience. This page is a factual comparison; we make no claims about the quality, reliability, or customer satisfaction of any other provider.",
      "What both providers do at a high level is similar: convert a QuickBooks Enterprise company file to a format that can be restored in Premier or Pro, while preserving as much of the underlying data as the target tier can represent. The differences are in how the work is scoped, priced, ordered, and supported — and in which editions of QuickBooks are explicitly supported as part of the standard offering rather than as add-ons or special-case engagements.",
      "Pricing model is one of the most visible differences. NexFortis publishes its launch pricing on every service page and on the catalog: standard Enterprise to Premier conversion starts at {launchPrice}, with the regular base price of {basePrice} clearly disclosed alongside it. There are no quote forms required to see the price. Add-ons (rush delivery, extended support, file health check) are priced separately and shown on the same page. Volume packs are available at a published per-file rate. This transparent model is intended for businesses and accountants who want to know the cost before committing to an ordering conversation.",
      "Canadian QuickBooks support is a specific area where NexFortis has invested heavily as part of the core offering. Canadian editions — Premier Contractor Canadian, Premier Accountant Canadian, files using the Canadian Payroll add-on, and files with bilingual French/English records — are converted as part of the standard service rather than as a special-case engagement. We also support edge cases that are common in Canadian-bookkeeping practice but rare elsewhere, such as files where the home currency was originally set incorrectly to USD and needs to be reset to CAD as part of the conversion.",
      "Ordering and turnaround experience is another differentiator. NexFortis ordering is fully self-service through the qb.nexfortis.com portal: place the order with a credit card, upload your .QBM over a 256-bit encrypted link, receive an order ID and email confirmation immediately, and track status from your account. Standard turnaround is the next business day; a Guaranteed 30-Minute Conversion add-on is available when a deadline is tight. The portal also stores your past orders so accountants managing multiple client files have a single view of conversion history per practice.",
      "Things both providers handle well in their own ways: data preservation at the chart-of-accounts and transaction level, support for a broad range of source and target QuickBooks versions, and a willingness to take on complex files (heavy advanced inventory, large user counts, lots of memorized reports). The choice between NexFortis and any other provider is mostly a fit question — pricing transparency, Canadian-edition focus, and self-service ordering are the things NexFortis emphasizes; other providers may emphasize different attributes that matter more to your specific situation.",
      "Our recommendation, especially if you are an accountant or bookkeeper evaluating providers for repeat client work, is to run one paid test conversion against a representative client file with each provider you are considering. The cost of a single conversion is low compared to the long-term cost of choosing the wrong provider for a multi-year engagement, and the test conversion lets you evaluate turnaround, data preservation, and post-conversion support in a controlled, comparable way. NexFortis explicitly welcomes this kind of evaluation engagement and will work with you to scope a representative test file.",
    ],
    benefits: [
      {
        title: "Published, transparent pricing",
        body: "Launch and base prices are shown on every service page. No quote forms required to see what conversion will cost — and the same pricing is shown to every customer.",
      },
      {
        title: "Canadian editions as standard",
        body: "Canadian Premier and Pro editions, Canadian Payroll add-on, and bilingual records are part of the core service rather than a special-case add-on.",
      },
      {
        title: "Self-service ordering portal",
        body: "Order, upload, pay, and track from one portal. No back-and-forth email cycles before the work starts. Account history persists across orders for repeat-buyer practices.",
      },
      {
        title: "Volume packs and rush options",
        body: "5-Pack and 10-Pack credits for accountants managing multiple client files; Guaranteed 30-Minute Conversion add-on for deadline-driven engagements.",
      },
    ],
    process: [
      {
        title: "Compare your needs",
        body: "Identify the attributes that matter most for your file: pricing visibility, Canadian-edition support, ordering experience, turnaround commitment, and add-ons available.",
      },
      {
        title: "Order with NexFortis",
        body: "Place the order through the qb.nexfortis.com portal with a credit card. You receive an order ID and email confirmation immediately, with the expected turnaround stated up front.",
      },
      {
        title: "Upload your .QBM",
        body: "Upload your Enterprise backup over a 256-bit encrypted connection. Files are processed in our Canadian data region and are deleted within 30 days of order completion.",
      },
      {
        title: "Restore in Premier or Pro",
        body: "Download the converted .QBM, restore in Premier or Pro, and confirm the file behaves as expected. The 30-day post-conversion support window starts at this point — 2 support tickets included at no additional cost.",
      },
    ],
    faqs: [
      {
        question: "Why would I consider NexFortis as an alternative for QuickBooks conversion?",
        answer:
          "Three reasons most commonly come up in conversations with prospective customers: published pricing (so you know the cost before committing), Canadian-edition support as part of the standard offering rather than a special-case engagement, and a fully self-service ordering portal that does not require a back-and-forth email cycle before the conversion starts. Whether those are the right reasons for your specific file is a fit question we encourage you to evaluate with a paid test conversion.",
      },
      {
        question: "How does NexFortis pricing work for Enterprise to Premier conversion?",
        answer:
          "Standard Enterprise to Premier or Pro conversion is published on the service page with both the current launch price ({launchPrice}) and the regular base price ({basePrice}) shown. Complex files (heavy advanced inventory, large user counts, custom field complexity) have their own published price. Add-ons such as Rush Delivery, Extended Support, and File Health Check are priced separately and shown on the same page. Volume packs are available at a published per-file rate.",
      },
      {
        question: "Does NexFortis support the same QuickBooks versions for conversion?",
        answer:
          "NexFortis accepts Enterprise source files from version 6.0 through 24.0 and produces Premier or Pro output files compatible with 2017 through 2024. If your version is outside that range, contact support — many out-of-range versions can still be converted in two passes (for example, Enterprise 5.0 → Enterprise 12.0 → Premier 2017), and we will confirm feasibility in writing before you place an order.",
      },
      {
        question: "What is different about NexFortis for Canadian QuickBooks files?",
        answer:
          "Canadian editions — Premier Contractor Canadian, Premier Accountant Canadian, files using the Canadian Payroll add-on, and files with bilingual French/English records — are converted as part of the standard service rather than priced as a special-case engagement. Edge cases common in Canadian bookkeeping (for example, files where the home currency was set incorrectly to USD at file creation) are also handled as part of the standard workflow.",
      },
      {
        question: "How do I evaluate NexFortis against another conversion provider?",
        answer:
          "We recommend a paid test conversion against a representative client file. The cost of a single conversion is low compared to the long-term cost of choosing the wrong provider for repeat work, and the test lets you evaluate turnaround, data preservation, and post-conversion support in a controlled way. NexFortis explicitly welcomes this kind of evaluation engagement — contact support and we will help scope a representative test file.",
      },
      {
        question: "Is my file safe during the NexFortis conversion process?",
        answer:
          "Your original .QBW file is never modified — it stays on your computer untouched throughout the engagement. Only a copy (the .QBM backup you upload) is processed. Files are uploaded over a 256-bit encrypted link, processed in our Canadian data region, and automatically deleted from our processing environment within 30 days. You can request earlier deletion at any time by contacting support with your order number.",
      },
    ],
    relatedSlugs: ["enterprise-to-premier-conversion", "affordable-enterprise-conversion", "quickbooks-conversion-canada", "how-conversion-works"],
    breadcrumbs: [SERVICES_CRUMB, { name: "E-Tech Alternative", path: "/landing/etech-alternative" }],
  },
  // 5o
  {
    slug: "quickbooks-conversion-canada",
    category: "comparison",
    primaryKeyword: "quickbooks conversion canada",
    h1: "QuickBooks Conversion in Canada — Canadian-First Service",
    metaTitle: "QuickBooks Conversion Canada | NexFortis Canadian Editions",
    metaDescription:
      "Canadian QuickBooks conversion specialists. Canadian editions, Canadian Payroll, GST/HST, and bilingual data fully supported. Service from {launchPrice}.",
    productSlug: "enterprise-to-premier-standard",
    ctaLabel: "Convert My Canadian File — From {launchPrice}",
    ctaHref: "/service/enterprise-to-premier-standard",
    heroImageAlt:
      "Illustration of a Canadian flag overlaid on a QuickBooks company file conversion diagram",
    heroIcon: "MapPin",
    hero: {
      intro:
        "Canadian QuickBooks files have unique structures that generic US-built conversion tools either skip or refuse outright. NexFortis is built around Canadian editions from the ground up — Canadian Payroll, GST/HST, bilingual records, and CRA reporting periods are core, not edge cases.",
    },
    overview: [
      "Most QuickBooks conversion tools and services are built primarily for US editions. The Canadian Edition of QuickBooks Desktop has a different file-header signature, different tax structures (GST and HST instead of US sales tax), a structurally different payroll module (Canadian Payroll), and bilingual data in many fields. When a generic SDK-based tool encounters a Canadian file, the typical outcome is one of three: it refuses to run, it strips the Canadian-specific structures during conversion, or it silently corrupts payroll data without flagging the corruption to the user. None of these outcomes is acceptable for a Canadian business with active CRA filings.",
      "NexFortis was built specifically for the Canadian QuickBooks market. Every conversion service we offer treats Canadian editions as the primary case rather than the edge case. Canadian Payroll add-on data is preserved with year-to-date totals carried across cleanly. GST/HST tax codes, tax-agency payable balances, and CRA reporting period boundaries are mapped without manual cleanup. Bilingual French/English customer names, vendor names, item descriptions, and notes carry over without UTF-8 encoding loss. CRA-specific transaction memos and reference fields remain in the converted file exactly as they were in the source.",
      "The most common Canadian conversion engagements we see are: Enterprise to Premier or Pro downgrade for cost-reduction reasons (Canadian Premier and Pro licenses are dramatically cheaper than Enterprise's per-seat annual subscription), AccountEdge or Sage 50 (Simply Accounting) migration to QuickBooks Desktop for businesses standardizing on a single platform, multi-currency removal for Canadian businesses whose files were accidentally flipped to multi-currency mode by a third-party setup wizard, and Super Condense for files that have grown unmanageably large because Intuit's built-in Condense Data utility does not support Canadian files.",
      "Our processing infrastructure is hosted in our Canadian data region. Files uploaded for conversion stay within Canadian borders during processing and are deleted from the environment within 30 days of order completion. For accountants and bookkeepers with PIPEDA-conscious clients, this is often a deciding factor — a US-based service provider will store your client's complete financial history on US infrastructure, which creates downstream compliance considerations that are avoided entirely when the work is done in Canada.",
      "Pricing is transparent and quoted in Canadian dollars. Standard Enterprise to Premier conversion is {launchPrice} during our launch period (regular price {basePrice}), and that is the same price every customer pays — there are no quote forms, no negotiation, and no special pricing for one customer over another. For accountants managing multiple Canadian client files, 5-Pack and 10-Pack volume credits are available at published rates with credits valid for 12 months. CAD pricing avoids the FX-rate confusion that comes with US-priced services where the actual cost depends on the day you pay your invoice.",
      "Support is provided in business hours by a team familiar with Canadian QuickBooks specifics. When you ask a question about a T4 generation issue post-migration, you do not have to first explain what a T4 is. When you mention that the file is for a Quebec client and needs to handle QST (the Quebec Sales Tax) in addition to GST, that is a familiar engagement rather than an unusual request. This Canadian fluency is a small thing on any single ticket, but it adds up over a multi-year working relationship in ways that matter for accounting practices managing Canadian client work.",
    ],
    benefits: [
      {
        title: "Canadian editions, not edge cases",
        body: "Premier Contractor Canadian, Premier Accountant Canadian, and the Canadian Payroll add-on are core supported configurations on every service.",
      },
      {
        title: "GST/HST and CRA-aware",
        body: "Tax codes, tax-agency balances, and reporting period boundaries are preserved across conversion. QST handling for Quebec files is supported as standard.",
      },
      {
        title: "Bilingual data preserved",
        body: "French and English names, descriptions, and notes carry across without UTF-8 encoding loss — a common failure point for generic US-built conversion tools.",
      },
      {
        title: "Processed in Canada",
        body: "Files stay within Canadian borders during processing. Important for PIPEDA-conscious accountants and bookkeepers handling sensitive client data.",
      },
    ],
    process: [
      {
        title: "Pick the right Canadian service",
        body: "Enterprise to Premier downgrade, AccountEdge or Sage 50 migration, multi-currency removal, or Super Condense — each handles a different Canadian-specific problem with the same Canadian-edition focus.",
      },
      {
        title: "Order in Canadian dollars",
        body: "Pricing is published in CAD on every service page. Pay with a credit card through the portal; no quote forms required to know the cost.",
      },
      {
        title: "Upload to a Canadian region",
        body: "Files are uploaded over a 256-bit encrypted link and processed in our Canadian data region. They are deleted from the processing environment within 30 days.",
      },
      {
        title: "Receive your converted file",
        body: "Download the converted .QBM, restore in your QuickBooks Canadian Edition, and verify the GST/HST balances, payroll YTD totals, and bilingual records all carried across.",
      },
    ],
    faqs: [
      {
        question: "Does NexFortis support QuickBooks Canadian editions specifically?",
        answer:
          "Yes — Canadian editions are the primary supported configuration, not an add-on. Premier Contractor Canadian, Premier Accountant Canadian, the Canadian Payroll add-on, and bilingual French/English records are core to every conversion service we offer. Generic US-built tools either refuse to run on Canadian file headers or silently strip Canadian-specific structures, which is why most Canadian businesses end up looking for a Canadian-first provider.",
      },
      {
        question: "Are my files processed in Canada?",
        answer:
          "Yes. Our processing infrastructure runs in a Canadian data region, so files uploaded for conversion stay within Canadian borders during the engagement. Files are deleted from the processing environment within 30 days of order completion, and earlier deletion can be requested at any time by contacting support with your order number. For accountants with PIPEDA-conscious clients, this is often a deciding factor versus US-based providers.",
      },
      {
        question: "Will GST/HST and Canadian Payroll data carry across?",
        answer:
          "Yes. GST and HST tax codes, tax-agency payable balances, and CRA reporting period boundaries are mapped during conversion. Quebec QST handling is supported as standard for Quebec files. Canadian Payroll year-to-date totals as of the conversion date carry across so T4 generation, ROE filing, and remittance reporting work correctly going forward in the converted file.",
      },
      {
        question: "Is your pricing in Canadian dollars?",
        answer:
          "Yes. All published pricing on the catalog and service pages is in CAD. There are no FX surprises at the point of payment, and no quote-form negotiation — the launch and base prices shown on each page are the same for every customer. For multi-file engagements, 5-Pack and 10-Pack volume credits are available at published per-file CAD rates with credits valid for 12 months.",
      },
      {
        question: "What Canadian QuickBooks problems do you most often handle?",
        answer:
          "Four engagements come up regularly: Enterprise to Premier or Pro downgrade for cost-reduction reasons, AccountEdge or Sage 50 (Simply Accounting) migration to QuickBooks Desktop, accidental multi-currency removal for files flipped to multi-currency mode by a third-party setup wizard, and Super Condense for files that have grown too large because Intuit's built-in utility does not support Canadian editions.",
      },
    ],
    relatedSlugs: ["enterprise-to-premier-conversion", "accountedge-to-quickbooks", "sage-50-to-quickbooks", "super-condense"],
    breadcrumbs: [SERVICES_CRUMB, { name: "QuickBooks Conversion in Canada", path: "/landing/quickbooks-conversion-canada" }],
  },
  // 5p
  {
    slug: "affordable-enterprise-conversion",
    category: "comparison",
    primaryKeyword: "affordable quickbooks enterprise conversion",
    h1: "Affordable QuickBooks Enterprise to Premier Conversion",
    metaTitle: "Affordable QuickBooks Enterprise Conversion | NexFortis",
    metaDescription:
      "Move off QuickBooks Enterprise to a less expensive tier. NexFortis converts Enterprise to Premier or Pro from {launchPrice} with no quote-form pricing.",
    productSlug: "enterprise-to-premier-standard",
    ctaLabel: "Start Conversion — From {launchPrice}",
    ctaHref: "/service/enterprise-to-premier-standard",
    heroImageAlt:
      "Illustration showing Enterprise license cost being reduced after conversion to Premier",
    heroIcon: "BadgeDollarSign",
    hero: {
      intro:
        "QuickBooks Enterprise's per-seat annual subscription has become a meaningful cost for many businesses. NexFortis converts Enterprise files to Premier or Pro for a one-time fee starting at {launchPrice}, with the same data preservation as the conversion service itself.",
    },
    overview: [
      "QuickBooks Enterprise pricing has climbed steadily for years. Intuit's per-user, per-year subscription model means a five-user Enterprise installation costs many times what an equivalent Premier or Pro license costs — and the gap widens every year as Enterprise's annual price increases compound. For businesses that bought Enterprise years ago for capacity reasons but no longer need the higher list limits or the advanced features, the ongoing subscription cost is increasingly hard to justify versus the alternative of moving to Premier or Pro.",
      "The math is straightforward in most cases. The total Enterprise subscription cost across multiple users for a single year typically exceeds the one-time NexFortis conversion fee plus the cost of the Premier or Pro licenses that will replace Enterprise. From year two onwards, the savings are roughly the entire Enterprise subscription cost, year after year. For businesses with three or more Enterprise users, the payback on conversion is usually under a year — and frequently under six months.",
      "What makes NexFortis affordable for this specific engagement is published, transparent pricing. Standard Enterprise to Premier or Pro conversion is {launchPrice} during our launch period, with the regular base price of {basePrice} shown alongside it. There are no quote forms, no consultation fees, and no \"complexity surcharges\" added after you place the order. Complex files (heavy advanced inventory, large user counts, custom field complexity) have their own published price; you know which tier applies before you order. Add-ons (rush delivery, extended support, file health check) are priced separately and shown on the same page.",
      "For accountants and bookkeepers managing Enterprise downgrades for multiple clients in a portfolio, 5-Pack and 10-Pack volume credits provide further per-file savings. Credits are valid for 12 months and can be applied to any combination of standard, complex, or rush conversions across different client engagements. This is the most cost-effective path for practices systematically moving a book of clients off Enterprise — for example, in response to an Enterprise price increase that triggered a wave of cost-reduction conversations.",
      "The conversion itself is functionally identical to the standard Enterprise to Premier service. Direct database conversion (no SDK) preserves customers, vendors, items, transactions, linked transactions, memorized reports, templates, users, and preferences. Canadian editions and the Canadian Payroll add-on are supported as part of the standard service. Trial balance ties out to the source on a per-account basis. Standard turnaround is the next business day; the Guaranteed 30-Minute Conversion add-on is available when there is a deadline pressure.",
      "Where affordability does not mean compromising is in support. Every conversion includes a 30-day post-conversion support window during which any unexpected behavior is investigated at no additional cost. If the conversion cannot be completed or does not preserve your data as described, the order is refunded in full. Your original Enterprise file is never modified — it stays on your computer untouched throughout the engagement, so a failed conversion never puts your live data at risk regardless of price tier.",
      "If you are weighing the cost-benefit of staying on Enterprise versus moving to Premier or Pro, the most useful single number is your current Enterprise annual subscription divided by the one-time NexFortis conversion fee. If that number is greater than one, the payback period is under a year and conversion makes economic sense almost regardless of any other consideration. If it is greater than two, the payback is under six months and most CFOs treat the decision as a no-brainer. The remaining decision is then about whether the features you would lose by moving down a tier (Advanced Pricing, Combine Reports, Enhanced User Permissions) are ones you actively use day-to-day — and our pre-engagement conversation will help you confirm that.",
    ],
    benefits: [
      {
        title: "Published, transparent pricing",
        body: "{launchPrice} during launch (regular {basePrice}). No quote forms, no consultation fees, no surprise complexity surcharges added after you order.",
      },
      {
        title: "Fast payback period",
        body: "For most businesses with three or more Enterprise users, the conversion fee plus replacement license cost pays back in under a year of avoided Enterprise subscription.",
      },
      {
        title: "Volume credits for portfolios",
        body: "5-Pack and 10-Pack credits with 12-month validity for accountants and bookkeepers systematically moving a book of clients off Enterprise.",
      },
      {
        title: "Same data preservation",
        body: "Direct database conversion preserves customers, vendors, items, transactions, linked transactions, templates, users, and preferences — affordable does not mean lower-quality.",
      },
    ],
    process: [
      {
        title: "Calculate your payback",
        body: "Total your current Enterprise annual subscription cost across all users. Compare it to the one-time conversion fee plus the cost of replacement Premier or Pro licenses to estimate payback period.",
      },
      {
        title: "Order standard or complex",
        body: "Pick standard ({launchPrice}) for clean files or complex for files with heavy advanced inventory, multi-currency, large list counts, or extensive custom fields. Both prices are published.",
      },
      {
        title: "Upload your Enterprise .QBM",
        body: "Upload over a 256-bit encrypted link. Standard turnaround is the next business day; add Guaranteed 30-Minute Conversion if you are working to a deadline.",
      },
      {
        title: "Restore in Premier or Pro",
        body: "Download the converted .QBM, restore in your new Premier or Pro installation, and start saving on the next Enterprise renewal cycle. 30-day post-conversion support included.",
      },
    ],
    faqs: [
      {
        question: "How much does it cost to move off QuickBooks Enterprise?",
        answer:
          "The NexFortis conversion fee is {launchPrice} during launch (regular {basePrice}) for a standard file or a published complex-file price for files with heavy advanced inventory or multi-currency. You also need to license Premier or Pro for the destination tier — that cost is paid directly to Intuit and depends on which edition you choose. The total of the two is typically far less than a single year of Enterprise subscription for most multi-user businesses.",
      },
      {
        question: "Is downgrading from Enterprise to Premier worth it financially?",
        answer:
          "For most businesses with three or more Enterprise users, yes. The total Enterprise annual subscription cost across all users typically exceeds the one-time conversion fee plus replacement license cost in the first year, with the entire Enterprise subscription cost saved every subsequent year. Payback is under a year for most multi-user installations and under six months for many of them.",
      },
      {
        question: "Will I lose features by downgrading from Enterprise to Premier or Pro?",
        answer:
          "Yes — Enterprise-only features that have no Premier or Pro equivalent are removed during conversion. The most commonly affected features are Advanced Pricing rules (Premier has standard pricing only), Combine Reports across multiple companies, and Enhanced User Permissions for granular per-transaction-type access controls. The conversion report lists exactly which features were affected so there are no surprises after restoration. If you actively rely on any of these features, the conversion is probably not the right move.",
      },
      {
        question: "Can my accountant get a volume discount on Enterprise downgrades?",
        answer:
          "Yes. 5-Pack and 10-Pack conversion credits are available at published per-file rates that work out lower than ordering individual conversions. Credits are valid for 12 months and can be applied to any combination of standard, complex, or rush conversions across different client engagements. This is the most cost-effective path for practices systematically moving a book of clients off Enterprise.",
      },
      {
        question: "What happens if I cannot afford to convert all my Enterprise users at once?",
        answer:
          "There is no requirement to convert all users at once. The conversion produces a single converted .QBM file regardless of how many Enterprise users were in the source file — the user count in the destination file is determined by your Premier or Pro license, not by the number of Enterprise seats you previously had. Many businesses convert and license a smaller-than-Enterprise user count from day one, both to save licensing cost and because they have already reduced staff since they bought Enterprise.",
      },
    ],
    relatedSlugs: ["enterprise-to-premier-conversion", "etech-alternative", "how-conversion-works", "quickbooks-conversion-canada"],
    breadcrumbs: [SERVICES_CRUMB, { name: "Affordable Enterprise Conversion", path: "/landing/affordable-enterprise-conversion" }],
  },
  // ===== Group D — Educational / Trust =====
  // 5q
  {
    slug: "how-conversion-works",
    category: "educational",
    primaryKeyword: "how quickbooks conversion works",
    h1: "How QuickBooks Conversion Actually Works — Step by Step",
    metaTitle: "How QuickBooks Conversion Works | NexFortis Step-by-Step",
    metaDescription:
      "Curious how a QuickBooks conversion actually works? Step-by-step walkthrough of the process, what is preserved, and what to verify. Service from {launchPrice}.",
    productSlug: "enterprise-to-premier-standard",
    ctaLabel: "Start a Conversion — From {launchPrice}",
    ctaHref: "/service/enterprise-to-premier-standard",
    heroImageAlt:
      "Step-by-step diagram of a QuickBooks file moving through conversion stages",
    heroIcon: "BookOpen",
    hero: {
      intro:
        "If you have not converted a QuickBooks file before, the process can feel like a black box. This page walks through exactly what happens at each step — from the .QBM you upload to the converted file you restore — so you know what to expect.",
    },
    overview: [
      "A QuickBooks conversion is the process of taking a company file produced by one edition of QuickBooks (for example, Enterprise) and producing a new file that opens correctly in a different edition (for example, Premier or Pro). It sounds straightforward, but the underlying mechanics are not — Intuit does not expose a way to do this from inside the product, and the third-party tools that exist take very different approaches with very different outcomes for your data. Understanding the mechanics helps you make informed decisions about what service to use, what to verify after delivery, and what questions to ask up front.",
      "The two main approaches in the industry are SDK-based conversion and direct database conversion. SDK-based tools use Intuit's published QuickBooks SDK to export data from the source file as XML and then import it into a new file in the target edition. This works for the most basic data (chart of accounts, customers, vendors, items, simple transactions) but loses anything the SDK does not expose: payroll detail, memorized reports, linked transactions, custom templates, and several other features. SDK-based tools also typically refuse to run on Canadian files because the SDK does not handle Canadian-edition headers cleanly.",
      "Direct database conversion is the approach NexFortis uses. Instead of exporting and reimporting through the SDK, the underlying file structure is modified directly so the file opens in the target edition. This preserves features the SDK cannot reach (linked transactions, memorized reports, custom templates, payroll detail, Canadian-specific structures) and produces a file in which historical reports continue to render the same numbers they did in the source file. The tradeoff is that direct database conversion requires deeper tooling and is generally only offered by specialist providers — but for files where data preservation matters, it is the only approach that produces a clean result.",
      "Step one in any conversion engagement is producing a portable backup (.QBM) of the source file. The .QBM is a compact, self-contained snapshot of the company file that can be uploaded over the internet without including the network metadata or transaction logs that ride along with a .QBW. Your original .QBW file is never modified during the engagement — it stays on your computer untouched throughout, so even a failed conversion does not put your live data at risk. The .QBM is the only thing that gets uploaded.",
      "Step two is upload and pre-flight checks. The .QBM is uploaded over a 256-bit encrypted link to the NexFortis processing environment in our Canadian data region. Pre-flight checks verify the file integrity, confirm the source edition and version, and identify any features in use that may behave differently in the target edition (Advanced Pricing, Combine Reports, Enhanced User Permissions, and so on). If any of those features are in use, you receive an email summary before conversion proceeds so you can confirm the planned handling.",
      "Step three is the conversion itself. Direct database modifications are applied to produce a file that opens in the target edition. Trial balance is computed both before and after conversion and validated on a per-account basis to confirm no balances shifted as a result of the conversion. Lists are checked for record-count integrity. Linked transactions are validated to confirm the links survived. The conversion report — which is delivered with the converted file — captures all of these checks and lists any feature downgrades or removals.",
      "Step four is delivery, restoration, and validation. You receive a signed download link for the converted .QBM. Open the .QBM in the target edition of QuickBooks, restore it, and the file opens with all your data in place. Spot-check a recent month's trial balance against the source, run a customer balance summary, and run a payroll summary report (if applicable) to confirm the numbers match. The 30-day post-conversion support window starts at restoration, during which any unexpected behavior is investigated at no additional cost.",
    ],
    benefits: [
      {
        title: "Direct database conversion",
        body: "No SDK, no XML export-and-reimport. Linked transactions, memorized reports, custom templates, and payroll detail all survive intact.",
      },
      {
        title: "Original file untouched",
        body: "Only a copy (.QBM) is uploaded and processed. Your original .QBW stays on your computer throughout the engagement.",
      },
      {
        title: "Validation built in",
        body: "Trial balance is checked per-account before and after conversion; lists are validated for record-count integrity; linked transactions are confirmed to survive.",
      },
      {
        title: "Conversion report delivered",
        body: "A written report ships with the converted file showing what was preserved, what was downgraded, what was removed, and the trial-balance comparison.",
      },
    ],
    process: [
      {
        title: "Create a .QBM backup",
        body: "Inside QuickBooks, choose File → Create Backup → Portable Company File. The QBM Guide walks through this if you have not done it before. Your original .QBW file is never modified.",
      },
      {
        title: "Upload the .QBM securely",
        body: "Upload the file over a 256-bit encrypted link to our Canadian data region. Pre-flight checks identify any features in use that may behave differently in the target edition.",
      },
      {
        title: "Conversion and validation",
        body: "Direct database modifications produce the converted file. Trial balance is checked per-account before and after to confirm no balances shifted; lists and linked transactions are validated.",
      },
      {
        title: "Download, restore, and verify",
        body: "Download the converted .QBM, restore in the target edition, and spot-check a recent trial balance, customer balance summary, and payroll summary against the source file.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between SDK-based and direct database conversion?",
        answer:
          "SDK-based conversion exports data from the source file as XML through Intuit's QuickBooks SDK and reimports it into a new file. This loses anything the SDK does not expose — typically payroll detail, memorized reports, linked transactions, and custom templates — and refuses to run on Canadian files. Direct database conversion modifies the underlying file structure to open in the target edition, preserving everything the SDK cannot reach. NexFortis uses direct database conversion exclusively.",
      },
      {
        question: "Why do I need to create a .QBM instead of uploading my .QBW directly?",
        answer:
          "A .QBM (Portable Company File) is a compact, self-contained snapshot of the company file that excludes the network metadata and transaction logs (.ND and .TLG files) that ride along with a .QBW. The .QBM is far smaller, can be uploaded over the internet practically, and isolates the data from the local network state. Your original .QBW file stays on your computer untouched throughout the conversion engagement.",
      },
      {
        question: "What does NexFortis check before, during, and after the conversion?",
        answer:
          "Before: file integrity, source edition and version, and any features in use that may behave differently in the target edition. During: direct database modifications and intermediate integrity checks at each major step. After: trial balance comparison on a per-account basis, list record-count validation, and linked-transaction verification. All checks are summarized in the conversion report that ships with the converted file.",
      },
      {
        question: "How do I verify the converted file is correct after restoration?",
        answer:
          "Spot-check three reports against the source file: trial balance for a recent month, a customer balance summary, and a payroll summary report (if your file uses payroll). All three should match the corresponding reports from the source file to the cent. The conversion report shipped with the file includes the per-account trial balance comparison from our validation step, which should align with what your spot-check produces.",
      },
      {
        question: "What happens to features that exist in the source edition but not the target?",
        answer:
          "Features that have no equivalent in the target edition are either downgraded to a target equivalent (where one exists) or removed (where none exists). For Enterprise-to-Premier conversions, this typically affects Advanced Pricing rules (downgraded to standard pricing), Combine Reports across companies (removed), and Enhanced User Permissions (collapsed into Premier's simpler permissions model). The conversion report lists every affected feature so there are no surprises after restoration.",
      },
      {
        question: "How long does the whole conversion process take end-to-end?",
        answer:
          "From upload to delivery, standard turnaround is the next business day. Add the time you spend creating the .QBM backup at the start (typically 10-30 minutes depending on file size) and restoring the converted file at the end (typically 10-30 minutes). The Guaranteed 30-Minute Conversion add-on shrinks the middle step to 30 minutes when there is a deadline. End-to-end, most engagements complete within one business day from start to finish.",
      },
    ],
    relatedSlugs: ["enterprise-to-premier-conversion", "is-it-safe", "affordable-enterprise-conversion", "etech-alternative"],
    breadcrumbs: [SERVICES_CRUMB, { name: "How Conversion Works", path: "/landing/how-conversion-works" }],
  },
  // 5r
  {
    slug: "is-it-safe",
    category: "educational",
    primaryKeyword: "is quickbooks conversion safe",
    h1: "Is QuickBooks Conversion Safe? What You Should Know",
    metaTitle: "Is QuickBooks Conversion Safe? | NexFortis Security & Process",
    metaDescription:
      "Worried about QuickBooks conversion safety? Learn how files are protected, why your original is untouched, and what safeguards make conversion low-risk.",
    ctaLabel: "Browse Conversion Services",
    ctaHref: "/catalog",
    heroImageAlt:
      "Illustration of a QuickBooks file under a security shield during conversion",
    heroIcon: "ShieldCheck",
    hero: {
      intro:
        "Sending a company file to a third party for conversion or repair feels risky. This page explains the specific safeguards NexFortis uses, why your original file is never at risk, and what you should ask any conversion provider before sending them your data.",
    },
    overview: [
      "It is reasonable to be cautious about sending a QuickBooks company file to anyone. The file contains your customer list, your vendor list, your bank balances, your payroll history, and years of financial detail. The decision to hand it to a service provider should be evaluated like any other vendor selection: what are the safeguards, what is the actual risk profile, and what protections exist if something goes wrong. This page answers those questions for NexFortis, with enough detail that you can compare against the same questions for any other provider.",
      "The single most important safeguard is that your original .QBW file is never modified during a conversion or data-service engagement. Only a copy — the .QBM Portable Company File you upload — is processed by NexFortis. Your original .QBW stays on your computer untouched throughout the engagement. If something unexpected happens to the .QBM during processing, your live data is unaffected. This is structural, not procedural — there is no path by which a NexFortis engagement can alter your live company file because the live file is never even sent to us.",
      "Files in transit are protected with 256-bit encrypted upload links. Files at rest in the processing environment are stored in our Canadian data region with access restricted to the technicians actively working on the order. Files are deleted from the processing environment within 30 days of order completion as a matter of standard policy, and you can request earlier deletion at any time by contacting support with your order number. Our processing infrastructure is hosted in a Canadian region for files originating from Canadian customers, which keeps the data within Canadian borders for the duration of the engagement.",
      "The validation built into every engagement is the second key safeguard. Trial balance is computed on the source file before any modification is made, then computed again on the resulting file after modification, then compared on a per-account basis. If any balance shifts by even one cent that the engagement was not designed to shift, the result is rejected and the order is reworked. The validation report is included with the delivered file so you can verify the comparison yourself rather than taking our word for it.",
      "The order-protection terms are the third safeguard. If a conversion or data service cannot be completed or does not preserve your data as described in the service page, the order is refunded in full. Diagnostic assessments on file repair engagements are free — if a damaged file cannot be recovered, you are not charged. There is a 30-day post-conversion support window after every conversion during which any unexpected behavior is investigated at no additional cost.",
      "Questions you should ask any conversion provider, not just NexFortis: Is my original file modified or only a copy? How is the file encrypted in transit? Where is it stored at rest, and for how long? What validation is run to confirm balances did not shift? What is the refund or rework policy if the conversion fails or does not preserve data as described? A provider that cannot answer these questions in writing is not a provider you should trust with a multi-year financial history.",
      "What you should do on your end before any conversion: take an additional backup of your .QBW file and store it on offline media (USB or external drive that is not connected to the network) before creating the .QBM you will upload. This is your insurance policy. The chance you will need it is very low — your original .QBW is not even sent to us — but the cost of the extra backup is essentially zero, and the peace of mind it provides is worth it. The same offline-backup practice is good general QuickBooks hygiene regardless of whether you are doing a conversion.",
    ],
    benefits: [
      {
        title: "Original file never touched",
        body: "Only the .QBM copy is processed. Your live .QBW stays on your computer throughout the engagement, so a failed conversion never affects your operating data.",
      },
      {
        title: "Encrypted in transit, secured at rest",
        body: "256-bit encrypted upload links; files at rest in our Canadian data region with access restricted to the technicians working on the order.",
      },
      {
        title: "Validation against the source",
        body: "Per-account trial balance comparison before and after, with the validation report included so you can verify the result yourself.",
      },
      {
        title: "Refund and rework if it fails",
        body: "If the engagement cannot be completed or does not preserve your data as described, the order is refunded in full. File-repair diagnostics are free.",
      },
    ],
    process: [
      {
        title: "Take an offline backup first",
        body: "Before creating your .QBM, take an additional .QBW backup to an offline USB drive. Your insurance policy in case anything unexpected ever happens to your live file for any reason.",
      },
      {
        title: "Create the .QBM",
        body: "Inside QuickBooks, choose File → Create Backup → Portable Company File. This is the only file you will upload — your original .QBW stays on your computer throughout.",
      },
      {
        title: "Upload over an encrypted link",
        body: "The upload uses a 256-bit encrypted connection. Files are stored in our Canadian data region with access restricted to the technicians working on your order.",
      },
      {
        title: "Verify and request deletion",
        body: "Verify the delivered file with the included validation report. Files are deleted within 30 days; request earlier deletion at any time by contacting support with your order number.",
      },
    ],
    faqs: [
      {
        question: "Is my original QuickBooks file at risk during conversion?",
        answer:
          "No. Your original .QBW file is never sent to NexFortis. Only the .QBM Portable Company File you create as a copy is uploaded and processed. The original .QBW stays on your computer untouched throughout the engagement, so even an unexpected outcome on the processed copy does not affect your live data. This is a structural protection — the live file is not part of the engagement.",
      },
      {
        question: "How is my QuickBooks file protected during the upload?",
        answer:
          "The upload uses a 256-bit encrypted connection from your computer to our processing environment. Files at rest are stored in our Canadian data region with access restricted to the technicians actively working on your order. Files are deleted from the processing environment within 30 days of order completion as a matter of standard policy, and you can request earlier deletion at any time by contacting support with your order number.",
      },
      {
        question: "What happens if the conversion fails or my data is not preserved?",
        answer:
          "If a conversion or data service cannot be completed, or does not preserve your data as described on the service page, the order is refunded in full. File-repair diagnostics are free regardless of outcome — if a damaged file cannot be recovered, you are not charged. Every conversion includes a 30-day post-conversion support window during which unexpected behavior is investigated at no additional cost.",
      },
      {
        question: "What questions should I ask any QuickBooks service provider before sending my file?",
        answer:
          "Five questions: Is my original file modified or only a copy? How is the file encrypted in transit? Where is it stored at rest, and for how long? What validation runs to confirm balances did not shift? What is the refund or rework policy if the engagement fails? A provider that cannot answer these in writing is not one you should trust with a multi-year financial history.",
      },
      {
        question: "Where is my QuickBooks data stored during processing?",
        answer:
          "Files originating from Canadian customers are processed in our Canadian data region, which keeps the data within Canadian borders for the duration of the engagement. This is often a deciding factor for accountants with PIPEDA-conscious clients. Access is restricted to the technicians actively working on your order, and the file is deleted within 30 days of order completion as a matter of standard policy.",
      },
      {
        question: "Should I take my own backup before sending my QuickBooks file?",
        answer:
          "Yes — always. Take an additional .QBW backup to offline media (a USB drive or external drive that is not connected to the network) before creating the .QBM you will upload. This is your insurance policy. The chance you will need it is very low because your original .QBW is not even sent to us, but the cost is essentially zero and the peace of mind is worth it. This is good general QuickBooks hygiene regardless of whether you are doing a conversion.",
      },
    ],
    relatedSlugs: ["how-conversion-works", "enterprise-to-premier-conversion", "audit-trail-removal", "file-repair"],
    breadcrumbs: [SERVICES_CRUMB, { name: "Is It Safe?", path: "/landing/is-it-safe" }],
  },
  // 5s
  {
    slug: "quickbooks-desktop-end-of-life",
    category: "educational",
    primaryKeyword: "quickbooks desktop end of life",
    h1: "QuickBooks Desktop End of Life — What It Means and What to Do",
    metaTitle: "QuickBooks Desktop End of Life | NexFortis Migration Guide",
    metaDescription:
      "QuickBooks Desktop end of life: what discontinuation means, what still works, and how to plan your next move. Conversion and migration help available.",
    ctaLabel: "Explore Migration Services",
    ctaHref: "/catalog",
    heroImageAlt:
      "Illustration of a QuickBooks Desktop calendar marking discontinuation and a planning roadmap",
    heroIcon: "CalendarClock",
    hero: {
      intro:
        "Intuit's discontinuation of older QuickBooks Desktop versions has been a recurring source of confusion for users. This page explains what \"end of life\" actually means, what continues to work after discontinuation, and how to plan a sensible next move.",
    },
    overview: [
      "QuickBooks Desktop \"end of life\" or \"discontinuation\" is Intuit's term for when an older Desktop version stops receiving certain services. It does not mean the software stops working. Discontinued versions still open, still let you enter and view transactions, still produce reports, and still print and export. What stops are the connected services that the version depends on Intuit's servers for: payroll tax tables, bank feeds, online banking integration, merchant services, payments processing, and live technical support. For some users none of these matter; for others they matter a lot.",
      "Intuit historically discontinues each major Desktop version about three years after release. So a version released in May of one year typically reaches end of life in May three years later. The discontinuation is announced months in advance and is published on Intuit's support site. The pattern is predictable enough that most accounting practices include a \"Desktop version being used\" field on their client intake checklist so they can warn clients about upcoming discontinuations before they take effect.",
      "What stops working at discontinuation is the connected services tied to that specific version: payroll tax tables stop updating (so payroll calculations will use the last-loaded tax table indefinitely, becoming progressively stale over time), bank feeds and online banking integration stop syncing (so transactions need to be entered manually or imported from CSV files), merchant services and payments processing through Intuit stop, and Intuit's own live technical support stops accepting cases for that version. Critically, the company file itself continues to work, all your data is intact, and you can keep entering manual transactions indefinitely.",
      "The most common scenarios for users hitting Desktop end of life are: stay on the discontinued version because none of the affected services are used (common for smaller businesses with simple bookkeeping needs and no payroll), upgrade to a newer Desktop version to restore the connected services (the path Intuit pushes most heavily, and the simplest option for users who want to keep using Desktop), migrate to QuickBooks Online to escape the recurring discontinuation cycle entirely (which has its own tradeoffs around feature parity and pricing), or convert to a different tier of Desktop (for example, Enterprise to Premier) as a cost-reduction step combined with the upgrade decision.",
      "If you do upgrade to a newer Desktop version, the upgrade is typically straightforward: Intuit's upgrade utility opens the older file in the newer version, runs an internal upgrade routine, and produces an upgraded file. For most files this works without issue. For very large files (over 1.5 GB Premier/Pro or 2.5 GB Enterprise), the upgrade can fail or run for many hours; in those cases pre-upgrade File Health Check, Audit Trail Removal, or Super Condense engagements often clear the path. If you are sitting on a long-running large file and dreading the upgrade, that pre-upgrade cleanup is the typical recommendation.",
      "If you migrate to QuickBooks Online instead, the QBO Readiness Report tells you in advance what will and will not transfer cleanly. QBO has different limits, different features, and different behaviors than Desktop, and the migration is one-way — once you are on QBO, returning to Desktop is impractical. The readiness report is the decision aid you use before committing to that migration, particularly relevant when end-of-life pressure is creating urgency to make a decision quickly. Many businesses use the report and decide to upgrade Desktop instead; others use it to plan a clean QBO migration with realistic expectations about what will change.",
      "Whatever path you choose, the worst response to a discontinuation announcement is to ignore it and let services silently degrade in the background. Payroll calculations using progressively stale tax tables become incorrect over time, and missed payroll-tax remittances triggered by stale tables can create CRA or IRS penalties that vastly exceed the cost of any upgrade or migration. Bank-feed sync stopping means transactions stop appearing in QuickBooks even though they continue to clear at the bank. Plan deliberately rather than reactively, and the end-of-life cycle becomes a manageable accounting decision rather than a crisis.",
    ],
    benefits: [
      {
        title: "Pre-upgrade cleanup",
        body: "Audit Trail Removal, Super Condense, and File Health Check before an in-place Desktop upgrade can avoid the failures that hit very large files during the upgrade routine.",
      },
      {
        title: "Tier-change conversion",
        body: "If end of life is your trigger to also reconsider Enterprise pricing, NexFortis converts Enterprise to Premier or Pro in the same engagement window as your version upgrade.",
      },
      {
        title: "QBO migration readiness",
        body: "A QBO Readiness Report tells you in advance what will and will not transfer cleanly, so you can make the migration decision deliberately rather than reactively.",
      },
      {
        title: "Canadian-specific guidance",
        body: "Discontinuation hits Canadian editions on the same cycle as US editions — and Canadian Payroll on Desktop has no direct QBO equivalent, which is a critical input to the upgrade-or-migrate decision.",
      },
    ],
    process: [
      {
        title: "Confirm your version and end-of-life date",
        body: "Help → About QuickBooks shows your version. Cross-reference against Intuit's published discontinuation schedule to find the date your version stops receiving connected services.",
      },
      {
        title: "Decide which services you actually use",
        body: "Payroll, bank feeds, merchant services, Intuit live support — list which of these you actively use today. If none, staying on the discontinued version is a real option for many users.",
      },
      {
        title: "Choose a path",
        body: "Stay on the discontinued version (no action needed if no connected services are used), upgrade to a newer Desktop version, or migrate to QBO. Each has a different cost and disruption profile.",
      },
      {
        title: "Pre-upgrade cleanup if needed",
        body: "For large files, run File Health Check, Audit Trail Removal, or Super Condense before the in-place upgrade. For QBO migration, run the QBO Readiness Report before committing.",
      },
    ],
    faqs: [
      {
        question: "What does QuickBooks Desktop end of life actually mean?",
        answer:
          "It means Intuit stops providing certain connected services for that specific Desktop version: payroll tax table updates, bank feeds and online banking integration, merchant services and payments processing, and Intuit's own live technical support for the version. The software itself continues to work — you can still open the file, enter transactions, view reports, and print or export. Only the connected services stop.",
      },
      {
        question: "When does my QuickBooks Desktop version reach end of life?",
        answer:
          "Intuit historically discontinues each major Desktop version about three years after release. A version released in May of one year typically reaches end of life in May three years later. Help → About QuickBooks shows your specific version, and Intuit's support site publishes the exact discontinuation date for each version several months in advance of the cutoff.",
      },
      {
        question: "Can I keep using QuickBooks Desktop after end of life?",
        answer:
          "Yes, indefinitely, as long as you do not need the connected services that stop at discontinuation. The software continues to open files, enter transactions, view reports, and print or export. Many smaller businesses with simple bookkeeping needs and no payroll continue using a discontinued version for years without issue. The decision to keep using it depends entirely on whether you actively rely on the affected services.",
      },
      {
        question: "Should I upgrade Desktop or migrate to QuickBooks Online?",
        answer:
          "Depends on what you value. Desktop upgrade is the simplest path if you want to keep your current workflow — same software, same file structure, same features, with a few new releases-only enhancements. QBO migration escapes the recurring three-year discontinuation cycle but has different limits, features, and behaviors that take adjustment. The QBO Readiness Report is the decision aid we recommend running before committing either way, particularly for files that have been in use for many years.",
      },
      {
        question: "Will my data be lost when QuickBooks Desktop reaches end of life?",
        answer:
          "No. End of life affects services, not data. Your company file is unchanged, all transactions and lists remain intact, and the file continues to open in the discontinued version indefinitely. What changes is that future transactions you enter need to be handled with the connected services unavailable: payroll calculated against the last-loaded tax table, bank transactions entered manually instead of synced, and so on. The data itself is not at risk simply because the version reached end of life.",
      },
      {
        question: "What should I do before an in-place Desktop upgrade?",
        answer:
          "Take a full backup first (always — this is the single most important pre-upgrade step). For large files (over 1.5 GB Premier/Pro or 2.5 GB Enterprise), run File Health Check beforehand to identify any integrity issues that could cause the upgrade to fail; consider Audit Trail Removal or Super Condense to shrink the file before upgrade so the upgrade routine runs cleanly. Confirm in writing which features change in the new version so post-upgrade workflow surprises are minimized.",
      },
    ],
    relatedSlugs: ["qbo-readiness", "enterprise-to-premier-conversion", "audit-trail-removal", "super-condense"],
    breadcrumbs: [SERVICES_CRUMB, { name: "QuickBooks Desktop End of Life", path: "/landing/quickbooks-desktop-end-of-life" }],
  },
  // 5t
  {
    slug: "quickbooks-support-subscription",
    category: "educational",
    primaryKeyword: "quickbooks support subscription",
    h1: "QuickBooks Support Subscription — Predictable Help, Fixed Monthly Cost",
    metaTitle: "QuickBooks Support Subscription | NexFortis Monthly Plans",
    metaDescription:
      "Monthly QuickBooks Desktop support subscription with predictable response times and a fixed monthly cost. Compare Essentials, Professional, and Premium plans.",
    ctaLabel: "Browse Subscription Plans",
    ctaHref: "/catalog",
    heroImageAlt:
      "Illustration of a support ticket being responded to by a NexFortis QuickBooks expert",
    heroIcon: "Headphones",
    hero: {
      intro:
        "If QuickBooks problems hit your business at unpredictable times — and they always do — a monthly support subscription gives you a known cost, a known response time, and a single point of contact instead of scrambling for help every time something breaks.",
    },
    overview: [
      "QuickBooks problems do not arrive on a schedule. They arrive at month-end close, the morning of payroll, the afternoon you are trying to send invoices, and the day before a CRA filing is due. Pay-per-incident support — whether through Intuit's own paid support, a local IT provider, or an ad-hoc consultant — solves the immediate problem but leaves you exposed to the next one with no relationship in place to call on. A subscription model trades that uncertainty for a predictable monthly cost and a documented response-time commitment.",
      "NexFortis QuickBooks Expert Support comes in three monthly tiers. Essentials covers most small businesses with three tickets per month and a one-hour response time during business hours. Professional handles small accounting practices and larger small businesses with eight tickets per month, the same response time, plus access to file corruption diagnosis and multi-user troubleshooting. Premium provides unlimited tickets with a 30-minute response time, monthly check-in calls, and a 20% discount on all NexFortis services — designed for businesses that depend heavily on QuickBooks day-to-day or that manage a portfolio of client files.",
      "What is covered by a support ticket: error code troubleshooting (H-series multi-user errors, 6000-series file errors, 3000-series payroll and merchant errors, update errors), performance issue diagnosis (slow opens, slow reports, hangs during specific operations), setup guidance (multi-user mode, network configuration, version upgrades, edition changes), data integrity and list management questions, integration troubleshooting with Intuit-supported third-party apps, and general how-to guidance for any QuickBooks Desktop feature.",
      "What is not covered by a support ticket: training on QuickBooks for new users (we recommend Intuit's official training resources or a local QuickBooks ProAdvisor for that), bookkeeping advice or accounting decisions (we are a technical service, not your accountant), data services that are separate paid services (Audit Trail Removal, Super Condense, conversion), and support for non-Intuit accounting platforms. The Professional and Premium tiers include a discount that can be applied to NexFortis data services if a ticket investigation reveals one is needed.",
      "Tickets are submitted through the customer portal and tracked end-to-end with notifications at each status change. The response-time commitment (one hour for Essentials and Professional, 30 minutes for Premium) is measured from the moment the ticket enters the queue during business hours, and the actual resolution time depends on the complexity of the issue. Most error-code and how-to tickets resolve within the first response. More complex issues — particularly multi-user network problems and file corruption — typically need a follow-up exchange or two as additional information is gathered from your environment.",
      "Tier upgrades and downgrades are handled at the next billing cycle and there is no contract commitment beyond the current month. Customers commonly start at Essentials, upgrade to Professional during a busy season (year-end close, fiscal year-end, payroll quarter-end), and downgrade back to Essentials when the busy season passes. The subscription is intended to flex with your actual support needs rather than locking you into a tier you do not need most of the year.",
      "For accountants and bookkeepers, the Premium tier includes a dedicated referral code that pays out a fixed amount per referred customer who signs up for any NexFortis service. This is designed for practices that regularly recommend NexFortis to clients for conversions, data services, or support — the referral revenue often offsets a meaningful portion of the practice's own subscription cost, which is the practical reason most accountants who refer clients choose Premium over the lower tiers regardless of their own ticket volume.",
    ],
    benefits: [
      {
        title: "Predictable monthly cost",
        body: "Fixed monthly fee instead of per-incident billing. Easier to budget and plan around than ad-hoc support engagements that vary in cost from one ticket to the next.",
      },
      {
        title: "Documented response times",
        body: "One hour on Essentials and Professional during business hours; 30 minutes on Premium. Measured from the moment your ticket enters the queue.",
      },
      {
        title: "Discount on data services",
        body: "10% on Professional, 20% on Premium, applied to any NexFortis data service (conversion, Audit Trail Removal, Super Condense, etc.) when a ticket investigation reveals one is needed.",
      },
      {
        title: "Flex with your needs",
        body: "Upgrade or downgrade at the next billing cycle with no contract commitment beyond the current month. Most customers flex tiers around their busy seasons.",
      },
    ],
    process: [
      {
        title: "Pick a tier that matches your volume",
        body: "Essentials for most small businesses (3 tickets/month). Professional for active small practices and growing businesses (8 tickets/month). Premium for QuickBooks-heavy operations (unlimited tickets).",
      },
      {
        title: "Subscribe through the portal",
        body: "Sign up at the catalog support-plans section. The subscription starts immediately and you can submit your first ticket the same day.",
      },
      {
        title: "Submit tickets when issues arise",
        body: "Tickets are submitted through the customer portal and tracked end-to-end. You receive notifications at each status change so you always know where your ticket stands.",
      },
      {
        title: "Adjust the tier as needs change",
        body: "Upgrade or downgrade at the next billing cycle. Cancel any time. Most customers move between tiers seasonally to match actual ticket volume rather than paying for unused capacity.",
      },
    ],
    faqs: [
      {
        question: "What does a QuickBooks support subscription cover?",
        answer:
          "Error code troubleshooting (H-series, 6000-series, 3000-series, update errors), performance issue diagnosis, setup guidance (multi-user mode, network configuration, version upgrades), data integrity and list management questions, integration troubleshooting with Intuit-supported third-party apps, and general how-to guidance for any QuickBooks Desktop feature. Training for new users, bookkeeping advice, and paid data services are out of scope.",
      },
      {
        question: "How is response time measured?",
        answer:
          "From the moment your ticket enters the queue during business hours. Essentials and Professional commit to a one-hour first response; Premium commits to 30 minutes. Actual resolution time depends on issue complexity — most error-code and how-to tickets resolve within the first response, while complex multi-user or file-corruption issues typically need a follow-up exchange or two as additional information is gathered.",
      },
      {
        question: "Can I switch between subscription tiers?",
        answer:
          "Yes, at any next billing cycle with no contract commitment. Many customers start at Essentials, move to Professional during busy seasons (year-end close, fiscal year-end, payroll quarter-end), and move back to Essentials when those seasons pass. The subscription is designed to flex with your actual support needs rather than lock you in.",
      },
      {
        question: "What happens if I exceed my monthly ticket allowance?",
        answer:
          "On Essentials and Professional, additional tickets in the same month are billed at a published per-ticket rate that is lower than ad-hoc support pricing. If you consistently exceed your tier's allowance month over month, the typical recommendation is to upgrade to the next tier — the all-in cost usually works out lower than the tier plus per-ticket overage fees.",
      },
      {
        question: "Is the subscription worth it if I only have occasional QuickBooks problems?",
        answer:
          "Probably not, on its own. Essentials at three tickets per month is sized for businesses that hit a QuickBooks issue most months. If you have one issue per year, pay-per-incident support through Intuit or a local ProAdvisor is cheaper. The subscription becomes the better choice when QuickBooks is critical to daily operations or when you want predictability around month-end close, payroll cycles, and CRA filing deadlines — situations where the cost of being unable to get help quickly outweighs the subscription cost.",
      },
      {
        question: "Do accountants get any extra benefit from a support subscription?",
        answer:
          "Yes — particularly on the Premium tier. Premium includes a dedicated referral code that pays out a fixed amount per referred customer who signs up for any NexFortis service. For accounting practices that regularly recommend NexFortis to clients for conversions, data services, or support, the referral revenue often offsets a meaningful portion of the practice's own subscription cost, which is why most accountants who refer clients choose Premium regardless of their own ticket volume.",
      },
    ],
    relatedSlugs: ["quickbooks-running-slow", "quickbooks-company-file-error", "is-it-safe", "how-conversion-works"],
    breadcrumbs: [SERVICES_CRUMB, { name: "QuickBooks Support Subscription", path: "/landing/quickbooks-support-subscription" }],
  },
];

export function getLandingPageBySlug(slug: string): LandingPageData | undefined {
  return landingPages.find((p) => p.slug === slug);
}

export function listLandingSlugs(): string[] {
  return landingPages.map((p) => p.slug);
}
