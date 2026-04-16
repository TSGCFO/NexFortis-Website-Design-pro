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
      "Convert QuickBooks Enterprise to Premier or Pro with 100% data preservation. Canadian files supported, next-business-day turnaround, priced from {launchPrice}.",
    productSlug: "enterprise-to-premier-standard",
    ctaLabel: "Order Now — From {launchPrice}",
    ctaHref: "/service/enterprise-to-premier-standard",
    heroImageAlt:
      "Diagram showing a QuickBooks Enterprise company file being converted into a Premier file",
    hero: {
      intro:
        "Move from QuickBooks Enterprise to Premier or Pro without losing a single transaction. NexFortis performs a direct, database-level conversion that keeps every customer, vendor, template, and preference intact — including on Canadian QuickBooks editions.",
    },
    overview: [
      "Converting a QuickBooks Enterprise file down to Premier or Pro is not a feature Intuit exposes in the product. Most tools that claim to do it rely on the QuickBooks SDK, which strips payroll, memorized reports, linked transactions, and custom templates in the process. NexFortis does not use the SDK. Our team performs a direct modification of the underlying company file so that every record, link, and preference survives the conversion.",
      "We support Enterprise versions 6.0 through 24.0 and produce output files compatible with Premier or Pro 2017 through 2024. Canadian editions — including Premier Contractor, Premier Accountant, and the Canadian Payroll add-on — are fully supported. This is a key differentiator: the built-in Intuit utilities either fail outright on Canadian files or silently corrupt payroll data.",
      "Your file is uploaded over a 256-bit encrypted connection, processed in our Canadian data region, and returned to you as a downloadable .QBM file that restores into Premier or Pro exactly as it behaved in Enterprise. Standard turnaround is the next business day; a 30-minute guaranteed rush option is available if you are on a deadline.",
      "All Enterprise features that exist in Premier — advanced inventory summaries, class tracking, multi-currency, job costing, custom fields — are preserved. Enterprise-only features that Premier cannot display (such as Advanced Pricing rules) are converted to static values so you do not lose the underlying data.",
    ],
    benefits: [
      {
        title: "100% data preservation",
        body: "Customers, vendors, items, chart of accounts, transactions, linked transactions, memorized reports, templates, users, and preferences all carry over.",
      },
      {
        title: "Canadian files supported",
        body: "Enterprise Canadian Edition, Premier Contractor Canadian, and the Canadian Payroll add-on convert cleanly — something most competitors cannot offer.",
      },
      {
        title: "Direct database conversion",
        body: "No SDK, no XML export/import. The company file itself is downgraded so nothing is lost in translation.",
      },
      {
        title: "Works across versions",
        body: "Enterprise 6.0–24.0 source files; Premier or Pro 2017–2024 output files.",
      },
    ],
    process: [
      {
        title: "Create a .QBM backup",
        body: "Inside QuickBooks Enterprise, choose File → Create Backup → Portable Company File. Our QBM Guide walks through this if you have not done it before.",
      },
      {
        title: "Upload securely",
        body: "Place your order, then upload the .QBM file over a 256-bit encrypted link. You will receive an order ID immediately.",
      },
      {
        title: "NexFortis converts your file",
        body: "Our team performs the direct database conversion, runs data integrity checks, and validates the result against your original file's balances.",
      },
      {
        title: "Download your converted file",
        body: "We email you a signed download link. Open the .QBM in Premier or Pro, restore, and confirm the new file is ready for use.",
      },
    ],
    faqs: [
      {
        question: "Will I lose any data when I convert from Enterprise to Premier?",
        answer:
          "No. NexFortis performs a direct database conversion rather than an SDK export, so customers, vendors, items, transactions, linked transactions, memorized reports, templates, preferences, users, and payroll history are all preserved exactly as they appear in Enterprise.",
      },
      {
        question: "Does the conversion work on Canadian QuickBooks files?",
        answer:
          "Yes. Canadian editions — including Premier Contractor Canadian, Premier Accountant Canadian, and files using the Canadian Payroll add-on — are fully supported. This is one of the main reasons customers choose NexFortis over generic SDK-based tools.",
      },
      {
        question: "How long does the conversion take?",
        answer:
          "Standard turnaround is the next business day after you upload. If you need it faster, the Guaranteed 30-Minute Conversion add-on moves your order to the front of the queue with a 30-minute completion commitment.",
      },
      {
        question: "Which QuickBooks versions are supported?",
        answer:
          "We accept Enterprise source files from version 6.0 through 24.0 and produce Premier or Pro output files compatible with 2017 through 2024. If you have a version outside this range, contact support and we will confirm feasibility before you order.",
      },
      {
        question: "Can I convert multiple Enterprise files at once?",
        answer:
          "Yes. Each file is a separate order, but volume packs (5-Pack and 10-Pack) are available at a discounted rate for accountants and bookkeepers managing multiple client files. Credits stay valid for 12 months.",
      },
      {
        question: "What happens if something goes wrong with the conversion?",
        answer:
          "Every converted file is validated against the original's trial balance before it is returned to you. If the conversion cannot be completed or does not preserve your data as described, we refund your order in full. Your original file is never altered.",
      },
    ],
    relatedSlugs: ["super-condense", "audit-trail-removal", "quickbooks-file-too-large"],
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
      "Remove the QuickBooks audit trail to shrink your file, speed up performance, and protect privacy. Canadian files supported, priced from {launchPrice}.",
    productSlug: "audit-trail-removal",
    ctaLabel: "Remove Audit Trail — From {launchPrice}",
    ctaHref: "/service/audit-trail-removal",
    heroImageAlt:
      "Illustration of a QuickBooks company file shrinking after audit trail removal",
    hero: {
      intro:
        "The QuickBooks audit trail records every change ever made to your file — and it never stops growing. NexFortis safely removes the audit trail so your file opens faster, backs up quicker, and no longer exposes years of historical edits.",
    },
    overview: [
      "The audit trail is a transaction log built into every QuickBooks company file. Every time a user creates, edits, voids, or deletes a transaction, a row is added. Over years of use, that log becomes the single largest contributor to file bloat — often accounting for more than half of total file size in long-running companies.",
      "A bloated audit trail causes three concrete problems. First, it slows down everything QuickBooks does that has to touch the log: opening the file, running reports, backing up, condensing. Second, it inflates backup sizes and can push the company file past the technical limits that trigger file errors. Third, it exposes the entire editing history of your business — a privacy problem if the file will be sold, transferred, or handed to a new accountant.",
      "NexFortis removes the audit trail by directly editing the underlying company file. Customers typically see a 30–60% file size reduction, depending on how transaction-heavy the history is. Every transaction, balance, list, template, and preference stays exactly where it was — only the edit history is removed.",
      "Canadian QuickBooks editions are fully supported, including files using the Canadian Payroll add-on. Because Intuit's built-in Condense Data utility does not work on Canadian files, audit trail removal is often the most effective way to shrink a Canadian company file.",
    ],
    benefits: [
      {
        title: "Smaller, faster file",
        body: "Typical reductions of 30–60%, with correspondingly faster open, backup, and report times.",
      },
      {
        title: "Privacy for file transfers",
        body: "Remove the historical edit log before selling the business, handing the file to a new accountant, or releasing the file to a third party.",
      },
      {
        title: "Balances and data untouched",
        body: "Only the audit trail is removed. All transactions, lists, reports, templates, and preferences remain identical.",
      },
      {
        title: "Works on Canadian files",
        body: "Full support for Canadian editions and the Canadian Payroll add-on — unlike Intuit's own Condense utility.",
      },
    ],
    process: [
      {
        title: "Back up your file as .QBM",
        body: "Use QuickBooks' Create Backup → Portable Company File option to produce a .QBM. Your original file stays untouched on your computer.",
      },
      {
        title: "Upload to NexFortis",
        body: "Place your order and upload the .QBM over a 256-bit encrypted connection.",
      },
      {
        title: "Audit trail is removed",
        body: "We perform the removal at the database level and run integrity checks to confirm transactions and balances are unchanged.",
      },
      {
        title: "Receive the cleaned file",
        body: "You get a signed download link for the new .QBM, ready to restore in your existing version of QuickBooks.",
      },
    ],
    faqs: [
      {
        question: "Is audit trail removal permanent?",
        answer:
          "Yes. Once the audit trail is removed from the file, it cannot be reconstructed. We recommend keeping a backup of the original file if you may need the edit history for future reference (for example, for a pending audit).",
      },
      {
        question: "Will audit trail removal affect my current data?",
        answer:
          "No. Every transaction, balance, list, report, template, and preference in the file stays exactly the same. Only the historical log of edits is removed.",
      },
      {
        question: "How much smaller will my QuickBooks file be after removal?",
        answer:
          "Most files shrink by 30–60%. The exact reduction depends on how many years of edits are stored and how transaction-heavy the history is. Files with heavy payroll or retail transaction volume tend to see the largest reductions.",
      },
      {
        question: "Is audit trail removal safe for Canadian QuickBooks files?",
        answer:
          "Yes. NexFortis fully supports Canadian editions and the Canadian Payroll add-on. Because Intuit's own Condense Data utility does not work on Canadian files, this service is often the most effective way to shrink them.",
      },
      {
        question: "Can I remove the audit trail myself from within QuickBooks?",
        answer:
          "No. QuickBooks does not expose an option to delete the audit trail from the user interface. It can only be removed through direct modification of the company file, which is what NexFortis performs.",
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
      "Super Condense your QuickBooks file without Intuit's utility. Works on Canadian editions, preserves balances, priced from {launchPrice}.",
    productSlug: "super-condense",
    ctaLabel: "Condense My File — From {launchPrice}",
    ctaHref: "/service/super-condense",
    heroImageAlt:
      "Before-and-after illustration of a large QuickBooks file being condensed to a smaller file",
    hero: {
      intro:
        "When a QuickBooks file has accumulated years of detail, Super Condense reduces its size dramatically while keeping every balance accurate. Best of all, it works on Canadian editions — something Intuit's own Condense Data utility cannot do.",
    },
    overview: [
      "Super Condense is a database-level rebuild of your QuickBooks company file that removes historical transaction detail prior to a cutoff date while preserving summary balances, list data, and all transactions after the cutoff. The result is a file that behaves identically for day-to-day use but is a fraction of the original size.",
      "Canadian QuickBooks files cannot use Intuit's built-in Condense Data utility. The utility either fails silently, corrupts payroll data, or refuses to run on the Canadian edition. This has been a long-standing limitation that leaves Canadian businesses with no first-party way to shrink bloated files. Super Condense fills that gap.",
      "What is preserved: full chart of accounts, all lists (customers, vendors, items, employees), all transactions after the cutoff date, opening balances that correctly reflect the condensed period, templates, memorized reports, and preferences. What is removed: transaction-level detail before the cutoff date, which is replaced by a single opening balance journal entry per account.",
      "File size reductions of 50–80% are typical for files with several years of history. Combined with Audit Trail Removal, reductions of 90%+ are possible on very old files.",
    ],
    benefits: [
      {
        title: "Works on Canadian editions",
        body: "The only practical way to condense Canadian QuickBooks files, including files using the Canadian Payroll add-on.",
      },
      {
        title: "Massive size reduction",
        body: "50–80% smaller is typical; far more when combined with audit trail removal.",
      },
      {
        title: "Balances stay accurate",
        body: "Opening balances are generated so every account ties back to the pre-condense totals on the cutoff date.",
      },
      {
        title: "Recent detail intact",
        body: "All transactions after your chosen cutoff date remain at full detail, so current-year reporting is unaffected.",
      },
    ],
    process: [
      {
        title: "Choose a cutoff date",
        body: "Pick a date before which transaction detail can be summarized. Most customers choose their last fiscal year-end.",
      },
      {
        title: "Back up and upload",
        body: "Create a .QBM and upload it to NexFortis over a 256-bit encrypted connection.",
      },
      {
        title: "NexFortis condenses",
        body: "We rebuild the file at the database level, summarize pre-cutoff detail into opening balances, and validate totals against your original.",
      },
      {
        title: "Download the condensed file",
        body: "You receive a much smaller .QBM that restores into your existing QuickBooks version.",
      },
    ],
    faqs: [
      {
        question: "Why can't I condense my Canadian QuickBooks file inside QuickBooks?",
        answer:
          "Intuit's built-in Condense Data utility does not support Canadian editions. It either fails, corrupts payroll data, or refuses to run. Super Condense is a database-level alternative that works on Canadian files without touching payroll integrity.",
      },
      {
        question: "What data is removed during Super Condense?",
        answer:
          "Only transaction-level detail dated before your chosen cutoff date. Those transactions are replaced by per-account opening balance journal entries that match the pre-condense totals. Lists, templates, preferences, and post-cutoff transactions are untouched.",
      },
      {
        question: "How much smaller will my QuickBooks file get after Super Condense?",
        answer:
          "File size reductions of 50–80% are typical for files with several years of pre-cutoff history. Files that also have large audit trails can exceed 90% reduction when Super Condense is combined with Audit Trail Removal.",
      },
      {
        question: "Is Super Condense the same as Intuit's Condense Data utility?",
        answer:
          "No. Intuit's utility is a feature built into QuickBooks that does not work on Canadian editions. Super Condense is a database-level rebuild performed by NexFortis that supports Canadian files and handles payroll cleanly.",
      },
      {
        question: "Can I Super Condense a QuickBooks Enterprise file?",
        answer:
          "Yes. Enterprise files are fully supported. Many customers combine Super Condense with an Enterprise-to-Premier conversion in a single engagement to both shrink the file and downgrade to a lower tier.",
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
      "Repair corrupted QuickBooks company files at the database level. Honest assessment, no upfront charge if unrecoverable, priced from {launchPrice}.",
    productSlug: "file-health-check",
    ctaLabel: "Start File Repair — From {launchPrice}",
    ctaHref: "/service/file-health-check",
    heroImageAlt:
      "Illustration of a damaged QuickBooks file being repaired and restored",
    hero: {
      intro:
        "When a QuickBooks company file refuses to open, runs Verify errors, or throws 6000-series messages, NexFortis performs database-level repair to recover as much of your data as possible — with an honest up-front assessment of what can and cannot be saved.",
    },
    overview: [
      "QuickBooks company files are databases, and like any database they can be corrupted by power failures during a write, network drive disconnections, crashes during large transactions, files that exceed technical size limits, or disk-level errors. When that happens, QuickBooks' built-in Verify and Rebuild tools often cannot finish, or they leave the file in a state where it opens but throws errors whenever a specific record is touched.",
      "NexFortis File Repair starts with a diagnostic pass on your file to identify what kind of corruption is present and whether repair is feasible. We are honest about this step: not every file can be recovered. If yours cannot, you will know before any repair work begins, and you will not be charged for work that cannot succeed.",
      "Where repair is feasible, we operate at the database level — rebuilding indexes, repairing orphaned records, reconstructing broken transaction links, and validating that account balances tie back to what the file should contain. This is different from data recovery, which is the process of pulling records out of a file that will never open again. We offer both, depending on what your file needs.",
      "Turnaround depends on the severity of the corruption. Simple index or link damage is typically resolved within one business day. Severe structural corruption may take two to three business days. You receive the repaired .QBM and a short report describing what was found and what was fixed.",
    ],
    benefits: [
      {
        title: "Honest diagnostic first",
        body: "We assess feasibility before any repair charge. Unrecoverable files are identified up front.",
      },
      {
        title: "Database-level repair",
        body: "Beyond Verify/Rebuild — we rebuild indexes, repair orphaned records, and restore broken links.",
      },
      {
        title: "Repair or recovery",
        body: "If full repair is not possible, we can extract recoverable data into a new, clean company file.",
      },
      {
        title: "Post-repair report",
        body: "A short summary of what was found and what was fixed ships with every repaired file.",
      },
    ],
    process: [
      {
        title: "Upload the damaged file",
        body: "Create a .QBM if possible; if the file will not open, upload the .QBW instead. Both are accepted for repair.",
      },
      {
        title: "Diagnostic assessment",
        body: "We analyze the corruption and tell you whether repair is feasible and what the expected outcome is.",
      },
      {
        title: "Repair at the database level",
        body: "We rebuild indexes, repair links, and validate balances against what the file should contain.",
      },
      {
        title: "Return the repaired file",
        body: "You receive the repaired .QBM plus a short report of what was fixed.",
      },
    ],
    faqs: [
      {
        question: "What causes QuickBooks file corruption?",
        answer:
          "The most common causes are power failures during a write, network drive disconnections while the file is open, crashes during large transactions (like period-end close), files exceeding QuickBooks' technical size limits, and disk-level hardware errors.",
      },
      {
        question: "Can all corrupted QuickBooks files be repaired?",
        answer:
          "No. Some files are damaged too severely for repair. NexFortis performs a diagnostic assessment before any repair charge so that unrecoverable files are identified up front. In those cases we can often still extract recoverable data into a new company file via our data recovery process.",
      },
      {
        question: "What happens if the repair cannot succeed?",
        answer:
          "If the diagnostic shows the file cannot be repaired, you are not charged for the repair. We will walk you through your options, which may include extracting recoverable data into a new file or restoring from a previous backup.",
      },
      {
        question: "How long does QuickBooks file repair take?",
        answer:
          "Simple damage — broken indexes, corrupt links — is typically resolved within one business day. Severe structural corruption may take two to three business days. You will receive an estimate after the diagnostic pass.",
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
      "Migrate AccountEdge (formerly MYOB) data to QuickBooks Desktop with full transaction history, Canadian GST/HST preserved. From {launchPrice}.",
    productSlug: "accountedge-to-quickbooks",
    ctaLabel: "Start Migration — From {launchPrice}",
    ctaHref: "/service/accountedge-to-quickbooks",
    heroImageAlt:
      "Illustration of AccountEdge data transferring to QuickBooks Desktop",
    hero: {
      intro:
        "NexFortis migrates AccountEdge (formerly MYOB) company files to QuickBooks Desktop with your chart of accounts, customers, vendors, items, and transaction history intact — with special attention to Canadian GST/HST treatment.",
    },
    overview: [
      "AccountEdge — historically branded MYOB — remains widely used in Canada and Australia by small businesses and their accountants. When the time comes to move to QuickBooks Desktop, the migration is more involved than a simple export/import because the two platforms store their data very differently.",
      "NexFortis handles the full migration as a managed service. Chart of accounts, customers, vendors, items, open transactions, and historical transaction detail all transfer into a new QuickBooks company file. Opening balances are generated so that trial balance totals on the migration date match exactly between AccountEdge and QuickBooks.",
      "Canadian-specific handling is where most generic migration tools fall down. We map AccountEdge GST/HST codes to QuickBooks tax items correctly, preserve tax-agency payable balances, and align CRA reporting periods to the QuickBooks tax-period structure. Bilingual data (French/English) is carried over without encoding issues.",
      "Not everything transfers at full detail. Payroll history is typically summarized rather than line-level, custom AccountEdge forms do not map to QuickBooks templates, and some report customizations are lost. You will receive a migration report that lists what came across at full detail, what was summarized, and what did not transfer.",
    ],
    benefits: [
      {
        title: "Full transaction history",
        body: "Historical transactions come across at line-item detail, not just balances.",
      },
      {
        title: "GST/HST preserved",
        body: "Canadian tax codes, tax-agency balances, and CRA reporting periods map cleanly to QuickBooks.",
      },
      {
        title: "Trial balance ties out",
        body: "Opening balances are generated so AccountEdge and QuickBooks match exactly on the migration date.",
      },
      {
        title: "Migration report included",
        body: "You receive a summary of what transferred at full detail, what was summarized, and what did not move.",
      },
    ],
    process: [
      {
        title: "Export from AccountEdge",
        body: "Create a full company file backup. We accept .zip, .myo, and .myox formats.",
      },
      {
        title: "Upload securely",
        body: "Place your order and upload the backup over a 256-bit encrypted link.",
      },
      {
        title: "NexFortis migrates",
        body: "We convert lists, transactions, and Canadian tax settings into a new QuickBooks Desktop company file.",
      },
      {
        title: "Review and go live",
        body: "You receive the QuickBooks file plus a migration report. Once trial balance is validated, you stop using AccountEdge.",
      },
    ],
    faqs: [
      {
        question: "What AccountEdge data transfers to QuickBooks?",
        answer:
          "Chart of accounts, customers, vendors, items, open invoices and bills, and historical transaction detail all transfer. Canadian GST/HST codes and tax-agency balances are preserved. Payroll history is typically summarized rather than transferred at line-item detail.",
      },
      {
        question: "Do I need to keep AccountEdge installed after migration?",
        answer:
          "We recommend keeping AccountEdge installed for at least one full reporting cycle so that you can reference the original records if any question arises. Once you have filed one full set of returns from QuickBooks, you can retire the AccountEdge installation.",
      },
      {
        question: "Will my GST/HST settings transfer to QuickBooks?",
        answer:
          "Yes. Canadian tax codes in AccountEdge are mapped to QuickBooks tax items, tax-agency payable balances are preserved, and CRA reporting periods are aligned. You should run a test return on the first post-migration period to confirm the mapping matches your practice.",
      },
      {
        question: "How long does the AccountEdge migration take?",
        answer:
          "Standard turnaround is one to two business days. Larger files or files with complex custom reporting may require a third day. You receive a confirmed estimate after we review the uploaded file.",
      },
    ],
    relatedSlugs: ["sage-50-to-quickbooks", "enterprise-to-premier-conversion", "super-condense"],
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
      "Migrate Sage 50 (Simply Accounting) to QuickBooks Desktop. Canadian Edition supported, bilingual data, CRA-ready. From {launchPrice}.",
    productSlug: "sage50-to-quickbooks",
    ctaLabel: "Start Migration — From {launchPrice}",
    ctaHref: "/service/sage50-to-quickbooks",
    heroImageAlt:
      "Illustration of Sage 50 Simply Accounting data migrating to QuickBooks Desktop",
    hero: {
      intro:
        "Move from Sage 50 — formerly Simply Accounting — to QuickBooks Desktop with historical transactions, customer and vendor records, and CRA tax data intact. NexFortis specializes in the Canadian Edition migration.",
    },
    overview: [
      "Sage 50, long known in Canada as Simply Accounting, remains one of the most common small-business accounting platforms in the country. Businesses moving to QuickBooks typically want full transaction history preserved, bilingual records intact, and Canadian tax treatment to carry over without manual cleanup. NexFortis handles all three.",
      "The migration transfers chart of accounts, customers, vendors, items, inventory quantities, open transactions, and historical transaction detail into a new QuickBooks Desktop company file. Opening balances on the migration date are reconciled so that QuickBooks reports match Sage 50 exactly at that point in time.",
      "For Canadian Edition files, we map GST/HST codes to QuickBooks tax items, carry across tax-agency payable balances, and align Sage 50's reporting periods to QuickBooks' tax-period structure. Bilingual (French/English) names and descriptions carry over without encoding loss.",
      "CRA integration differs between the two platforms. Sage 50's direct CRA filing features have no exact equivalent in QuickBooks Desktop, so any electronic filing settings need to be re-established in QuickBooks after migration. Your migration report will list this along with anything else that needs manual follow-up.",
    ],
    benefits: [
      {
        title: "Canadian Edition supported",
        body: "Full support for Sage 50 Canadian Edition and legacy Simply Accounting files.",
      },
      {
        title: "Historical detail preserved",
        body: "Transactions transfer at line-item level, not just opening balances.",
      },
      {
        title: "Bilingual data intact",
        body: "French and English names, descriptions, and notes carry over without encoding issues.",
      },
      {
        title: "CRA tax data mapped",
        body: "GST/HST codes, tax-agency balances, and reporting periods are aligned to QuickBooks.",
      },
    ],
    process: [
      {
        title: "Back up Sage 50",
        body: "Create a full backup in Sage 50. We accept .cab, .zip, and .sai formats.",
      },
      {
        title: "Upload securely",
        body: "Place your order and upload the backup over a 256-bit encrypted link.",
      },
      {
        title: "NexFortis migrates",
        body: "We convert lists, transactions, and Canadian tax settings into a new QuickBooks company file.",
      },
      {
        title: "Validate and go live",
        body: "Compare trial balance on the migration date between Sage 50 and QuickBooks, then switch over.",
      },
    ],
    faqs: [
      {
        question: "Is Sage 50 the same as Simply Accounting?",
        answer:
          "Yes. Sage 50 Canadian Edition is the current name for what was historically called Simply Accounting. NexFortis supports both the current Sage 50 files and legacy Simply Accounting backups.",
      },
      {
        question: "What Sage 50 data transfers to QuickBooks Desktop?",
        answer:
          "Chart of accounts, customers, vendors, items, inventory quantities, open invoices and bills, and historical transaction detail all transfer. GST/HST codes, tax-agency balances, and bilingual names are preserved.",
      },
      {
        question: "Will my historical transactions transfer from Sage 50?",
        answer:
          "Yes, at line-item detail rather than as opening balances only. Customers routinely carry multiple years of history across so that historical reporting in QuickBooks continues to work without referring back to Sage 50.",
      },
      {
        question: "Can I migrate from Sage 50 Canadian Edition specifically?",
        answer:
          "Yes. Canadian Edition is explicitly supported, including bilingual data, GST/HST handling, and CRA reporting-period alignment. This is one of the main reasons Canadian businesses choose NexFortis for the migration.",
      },
    ],
    relatedSlugs: ["accountedge-to-quickbooks", "enterprise-to-premier-conversion", "super-condense"],
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
      "Turn off QuickBooks multi-currency after it was accidentally enabled. Intuit offers no way to disable it — we do. From {launchPrice}.",
    productSlug: "multi-currency-removal",
    ctaLabel: "Remove Multi-Currency — From {launchPrice}",
    ctaHref: "/service/multi-currency-removal",
    heroImageAlt:
      "Illustration of currency symbols being removed from a QuickBooks file",
    hero: {
      intro:
        "Multi-currency in QuickBooks is a one-way toggle: once enabled, Intuit provides no supported way to turn it off. NexFortis removes multi-currency at the database level, with full preservation of your transactions and balances.",
    },
    overview: [
      "QuickBooks' multi-currency feature is powerful when a business genuinely transacts in more than one currency. The problem is how it is enabled. A single accidental click of the \"Yes, I use more than one currency\" option permanently flips the file into multi-currency mode. From that point on, every transaction screen asks about exchange rates, reports split currencies, and the feature cannot be disabled from within QuickBooks.",
      "For businesses that do not actually need multi-currency, the consequence is constant friction: extra clicks on every invoice, confusing exchange-rate fields, and reports that show currency breakdowns for currencies that are not actually in use. Over time this leads to data entry errors and mistrust of the numbers.",
      "NexFortis removes multi-currency by directly editing the underlying company file. Your chart of accounts, customers, vendors, items, transactions, and balances are preserved. Any transaction that was denominated in a non-home currency is normalized to the home currency using the exchange rate that was recorded on the transaction, so reported totals do not change.",
      "If your business does transact in multiple currencies but you want to consolidate into a single reporting currency for cleanup reasons, we will talk through the tradeoffs before running the conversion. Multi-currency removal is the right answer for many files — but not all of them.",
    ],
    benefits: [
      {
        title: "Turn off what Intuit will not",
        body: "QuickBooks does not expose any way to disable multi-currency. NexFortis does it at the file level.",
      },
      {
        title: "Balances preserved",
        body: "Transactions denominated in non-home currencies are converted using the recorded exchange rate, so reported totals do not change.",
      },
      {
        title: "Cleaner data entry",
        body: "No more exchange-rate prompts or currency fields on every invoice and bill.",
      },
      {
        title: "Canadian files supported",
        body: "Full support for CAD home currency and Canadian editions of QuickBooks.",
      },
    ],
    process: [
      {
        title: "Confirm home currency",
        body: "Decide which currency will be the single currency in the file post-removal. This is usually the currency you invoice and bank in.",
      },
      {
        title: "Back up and upload",
        body: "Create a .QBM and upload it over a 256-bit encrypted connection.",
      },
      {
        title: "NexFortis removes multi-currency",
        body: "We normalize non-home-currency transactions and disable the multi-currency flag at the database level.",
      },
      {
        title: "Download the cleaned file",
        body: "You receive a .QBM that no longer prompts for exchange rates and reports in a single currency.",
      },
    ],
    faqs: [
      {
        question: "Can I turn off multi-currency myself in QuickBooks?",
        answer:
          "No. QuickBooks does not offer any supported way to disable multi-currency once it has been enabled. The feature is deliberately designed as a one-way toggle. NexFortis removes it through direct modification of the company file.",
      },
      {
        question: "What happens to my foreign currency transactions after removal?",
        answer:
          "Any transaction recorded in a non-home currency is normalized to the home currency using the exchange rate that was stored on the original transaction. The reported totals in your home currency do not change.",
      },
      {
        question: "Will my reports still be accurate after multi-currency is removed?",
        answer:
          "Yes. Totals in the home currency remain identical to what they were before removal, because non-home-currency transactions are converted using their originally recorded exchange rates. What changes is that the reports no longer display per-currency breakdowns.",
      },
      {
        question: "How does NexFortis actually remove multi-currency?",
        answer:
          "The feature flag is disabled at the database level, non-home-currency transactions are normalized to a single currency, and the exchange-rate lists are cleared. The result is a file that behaves as if multi-currency was never enabled.",
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
      "Reduce bloated QuickBooks lists — customers, vendors, items, accounts — to stay under list limits and speed up your file. From {launchPrice}.",
    productSlug: "list-reduction",
    ctaLabel: "Reduce My Lists — From {launchPrice}",
    ctaHref: "/service/list-reduction",
    heroImageAlt:
      "Illustration of a cluttered list being trimmed down in QuickBooks",
    hero: {
      intro:
        "Every QuickBooks Desktop list — customers, vendors, items, accounts — has a hard limit. NexFortis List Reduction merges duplicates, removes obsolete entries, and brings your file back below the limits without losing history.",
    },
    overview: [
      "QuickBooks Desktop enforces technical limits on every list in the file: names (customers + vendors + employees + other names), items, chart of accounts, classes, and more. Premier and Pro top out at 14,500 names combined; Enterprise allows more but still has a ceiling. Once a limit is hit, you cannot add new records until the list is reduced — and QuickBooks stops doing useful things like running Verify cleanly.",
      "Lists grow for three reasons. First, years of legitimate use. Second, data-entry habits that create duplicates (for example, \"Acme Corp\", \"ACME Corporation\", and \"Acme\"). Third, one-off records created during imports or integrations that were never cleaned up. A long-running file can have thousands of records no one references anymore.",
      "NexFortis List Reduction performs a full list cleanup: duplicates are merged into a single canonical record, inactive records with no transaction history are removed, and records with stale history are consolidated under standard \"Inactive\" naming so they remain for reporting but do not clog search. Linked transactions are preserved — a merged customer's history rolls up under the surviving record.",
      "What we do not do is mass-delete records that still have live transactions. Those remain in the file, but they are renamed and inactivated so that reports and searches stay clean. You receive a before-and-after count for every list and a CSV of the specific records merged or inactivated.",
    ],
    benefits: [
      {
        title: "Stay under list limits",
        body: "Bring Premier/Pro files back under the 14,500-name ceiling so you can add new customers and vendors again.",
      },
      {
        title: "Duplicates merged",
        body: "\"Acme Corp\" and \"Acme Corporation\" become one record with consolidated history.",
      },
      {
        title: "Reports stay clean",
        body: "Inactivation preserves historical data while removing clutter from search and dropdowns.",
      },
      {
        title: "Full audit trail",
        body: "You receive a CSV of every record merged or inactivated so the cleanup is traceable.",
      },
    ],
    process: [
      {
        title: "Identify target lists",
        body: "Tell us which lists are causing pain — typically names and items for most businesses.",
      },
      {
        title: "Upload your file",
        body: "Create a .QBM and upload it over a 256-bit encrypted connection.",
      },
      {
        title: "NexFortis merges and inactivates",
        body: "Duplicates are merged with history consolidated; stale records are inactivated with standardized naming.",
      },
      {
        title: "Review the cleanup report",
        body: "You receive the cleaned .QBM plus a CSV showing exactly which records were merged or inactivated.",
      },
    ],
    faqs: [
      {
        question: "What are the QuickBooks list limits I should know about?",
        answer:
          "In Premier and Pro the combined limit for customers, vendors, employees, and other names is 14,500 records. Items cap at 14,500 as well. Chart of accounts tops out at 10,000. Enterprise allows higher limits but is not unlimited. List Reduction brings files back under these ceilings.",
      },
      {
        question: "Can I reduce my QuickBooks lists myself?",
        answer:
          "You can inactivate individual records from within QuickBooks, but the process is slow and does not merge duplicates' transaction history. NexFortis performs the cleanup at scale — thousands of records in a single pass — with linked-transaction preservation that manual inactivation cannot match.",
      },
      {
        question: "What happens to inactive items after the reduction?",
        answer:
          "Inactive records stay in the file so historical reports continue to work, but they no longer clog search results or dropdowns in transaction forms. You can reactivate any inactivated record at any time.",
      },
      {
        question: "Will list reduction affect my reports?",
        answer:
          "No. Historical transactions remain linked to their records. When duplicates are merged, the merged history rolls up under the surviving record, so totals are preserved. You will see the same report numbers before and after reduction.",
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
      "Know before you migrate. A detailed report on your QuickBooks Desktop file's readiness for QuickBooks Online. From {launchPrice}.",
    productSlug: "qbo-readiness-report",
    ctaLabel: "Order Readiness Report — From {launchPrice}",
    ctaHref: "/service/qbo-readiness-report",
    heroImageAlt:
      "Illustration of a QuickBooks Desktop file being analyzed for QBO compatibility",
    hero: {
      intro:
        "Moving from QuickBooks Desktop to QuickBooks Online is a one-way trip with real limitations. The NexFortis Readiness Report tells you exactly what will and will not transfer before you commit to the migration.",
    },
    overview: [
      "Intuit's official QuickBooks Desktop to Online migration tool has documented limitations: file size caps, target-count limits (250,000 targets on most editions), features that are not supported in QBO, and behaviors that silently change after migration. Running headfirst into these after cutover is painful — reports that worked yesterday stop working tomorrow, and a rollback to Desktop is not trivial.",
      "The QBO Readiness Report analyzes your Desktop file across four dimensions. Technical compatibility: file size, target count, list sizes against QBO's ceilings. Feature usage: which Desktop features you actively use (inventory assemblies, progress invoicing, custom fields, job costing, advanced inventory, classes) and how each behaves in QBO. Integration inventory: which third-party apps and bank feeds are attached, and whether equivalents exist in QBO. Data hygiene: how many duplicate names, orphaned transactions, or stale items might complicate the migration.",
      "You receive a written report that lists every issue found, rated by severity, with a recommendation. Some issues are \"fix in Desktop before migrating\" (for example, reducing lists). Others are \"accept the behavior change\" (for example, progress invoicing working differently in QBO). A handful are \"do not migrate to QBO yet\" (for example, a critical integration that has no QBO equivalent).",
      "The readiness report is not the migration itself — it is the decision aid you use before deciding whether, when, and how to migrate. Many customers use it to identify pre-migration cleanup work, then schedule the actual migration once their file is ready.",
    ],
    benefits: [
      {
        title: "Know before you commit",
        body: "Identify showstoppers and behavior changes before the one-way cutover to QBO.",
      },
      {
        title: "Severity-rated findings",
        body: "Each issue is ranked so you know what needs action now versus what is a post-migration adjustment.",
      },
      {
        title: "Pre-migration roadmap",
        body: "Use the report as a checklist of cleanup tasks to complete in Desktop before migrating.",
      },
      {
        title: "Canadian-aware",
        body: "We account for Canadian tax, payroll, and edition differences that generic readiness checks miss.",
      },
    ],
    process: [
      {
        title: "Upload your Desktop file",
        body: "Create a .QBM and upload it to NexFortis over a 256-bit encrypted connection.",
      },
      {
        title: "NexFortis analyzes",
        body: "We run our readiness checks against the file and the active QBO compatibility matrix.",
      },
      {
        title: "Receive the written report",
        body: "Same-day delivery in most cases. The report lists every issue with severity and recommendation.",
      },
      {
        title: "Decide next steps",
        body: "Use the report to decide whether to migrate, when, and what to clean up first.",
      },
    ],
    faqs: [
      {
        question: "What does the QBO readiness report check?",
        answer:
          "Four areas: technical compatibility (file size, target count, list sizes against QBO limits), feature usage (which Desktop features you rely on and how they behave in QBO), third-party integrations (which apps have QBO equivalents), and data hygiene (duplicates, orphans, and cleanup opportunities).",
      },
      {
        question: "Do I have to migrate to QuickBooks Online after ordering the report?",
        answer:
          "No. The report is an independent assessment. Many customers use it specifically to decide against migrating — or to stay on Desktop until a blocking integration becomes available in QBO.",
      },
      {
        question: "What if my file is not ready for QuickBooks Online?",
        answer:
          "The report lists the blocking issues with recommendations. Common pre-migration work includes List Reduction (to get under QBO limits), Super Condense (to get under file size limits), and cleanup of duplicate or orphaned records. You can tackle these yourself or as follow-up NexFortis services.",
      },
      {
        question: "How long does the readiness assessment take?",
        answer:
          "Same-day delivery in most cases once the file is uploaded. Very large or complex files may take one business day. The report itself is typically 4–8 pages and is delivered as a PDF.",
      },
    ],
    relatedSlugs: ["enterprise-to-premier-conversion", "super-condense", "list-reduction"],
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
      "QuickBooks file too large and slowing you down? Learn the causes and the three services that can safely shrink it — Canadian files supported.",
    ctaLabel: "See Size-Reduction Services",
    ctaHref: "/catalog",
    heroImageAlt:
      "Illustration of an oversized QuickBooks file being measured on a scale",
    hero: {
      intro:
        "If QuickBooks takes minutes to open, your backups fail, or data entry feels sluggish, file size is almost certainly part of the problem. This page walks you through what is causing it and which NexFortis service will fix it.",
    },
    overview: [
      "A QuickBooks company file does not stay small on its own. Every transaction, every edit, every list entry, and every piece of attached metadata adds to the file. Over several years of steady use, it is normal for a file to grow into the 500 MB to 2 GB range — and once past about 1.5 GB in Premier or Pro, or 2.5 GB in Enterprise, you start to see the symptoms that brought you to this page.",
      "Common symptoms: the file takes more than 60 seconds to open, backups fail or abort partway through, data entry has noticeable lag between keystrokes, reports hang before rendering, and Verify Data either fails or runs for hours. In multi-user environments the symptoms show up as network timeouts and H-series errors as well.",
      "There are four main contributors to file growth. First, the audit trail — the log of every change ever made — which can easily account for 30–60% of total file size. Second, years of transaction detail that could be summarized without losing reporting value. Third, bloated lists: thousands of customers, vendors, or items that are no longer actively used. Fourth, on Canadian editions, the fact that Intuit's built-in Condense Data utility does not work means the file has never been reduced.",
      "Three NexFortis services address the problem, individually or in combination. Audit Trail Removal typically delivers a 30–60% reduction by itself. Super Condense summarizes pre-cutoff transaction history for another 50–80% off what remains. List Reduction handles the bloated lists and keeps you under QuickBooks' technical limits. For badly overgrown files, all three run together often produce a 90%+ total size reduction.",
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
        body: "For very large files, running all three services together routinely produces a 90%+ total size reduction.",
      },
    ],
    process: [
      {
        title: "Measure current size",
        body: "Check your file size (File → Company Information or Windows file properties) and note the pain points you are seeing.",
      },
      {
        title: "Pick the right service",
        body: "Use the FAQ below — or contact support — to choose between Audit Trail Removal, Super Condense, List Reduction, or a combination.",
      },
      {
        title: "Upload your backup",
        body: "Create a .QBM and upload it over a 256-bit encrypted connection.",
      },
      {
        title: "Receive the shrunk file",
        body: "You get the cleaned .QBM with balances preserved and a before/after size comparison.",
      },
    ],
    faqs: [
      {
        question: "What is the maximum QuickBooks file size?",
        answer:
          "QuickBooks does not publish a single hard limit, but in practice Premier and Pro become unstable above 1.5 GB and Enterprise above 2.5 GB. Symptoms (slow opens, failed backups, report hangs) usually appear well before the instability threshold.",
      },
      {
        question: "How do I check my QuickBooks file size?",
        answer:
          "Open QuickBooks, go to File → Utilities → Condense Data (even though you will not run it) — the wizard shows current file size. You can also check the .QBW file directly in Windows File Explorer and view its Properties.",
      },
      {
        question: "Why does my Canadian QuickBooks file keep growing?",
        answer:
          "Because Intuit's built-in Condense Data utility does not support Canadian editions, there is no in-product way to reduce the file. On Canadian files, the audit trail and pre-cutoff transaction detail accumulate indefinitely unless a service like Audit Trail Removal or Super Condense is run externally.",
      },
      {
        question: "Which service reduces QuickBooks file size the most?",
        answer:
          "Super Condense typically produces the largest single reduction (50–80%) because it collapses years of pre-cutoff detail. Audit Trail Removal is the fastest and lowest-cost option when the audit trail is the main bloat contributor. Combining both plus List Reduction often exceeds 90% total reduction.",
      },
      {
        question: "Can I prevent my QuickBooks file from growing too large?",
        answer:
          "Partially. Good data-entry habits (avoid duplicates, inactivate records you stop using) slow growth. Scheduled annual Audit Trail Removal keeps change-log bloat under control. On Canadian files, periodic Super Condense is the only practical maintenance strategy.",
      },
    ],
    relatedSlugs: ["super-condense", "audit-trail-removal", "quickbooks-running-slow", "list-reduction"],
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
      "QuickBooks running slow? Learn whether it's your file, your network, or your hardware — and which NexFortis service fixes file-related slowness.",
    ctaLabel: "Fix a Slow QuickBooks File",
    ctaHref: "/catalog",
    heroImageAlt:
      "Illustration of a slow QuickBooks window being sped up after file optimization",
    hero: {
      intro:
        "QuickBooks slowness is usually one of three things: a bloated file, a network problem, or an underpowered machine. This page helps you figure out which is yours and, if it is the file, tells you exactly which service fixes it.",
    },
    overview: [
      "\"QuickBooks is slow\" is the single most common support complaint we hear. The frustrating part is that the remedy depends entirely on the cause — and the cause is not always obvious from the symptoms. Spending money on new hardware when the real problem is a 4 GB audit trail is a waste, and so is running file optimization on a file sitting on an underpowered NAS with a bad network card.",
      "There are five main causes of QuickBooks slowness. File size is the most common: once a file exceeds about 1.5 GB in Premier/Pro or 2.5 GB in Enterprise, every operation that touches the database slows down. Network issues come second: multi-user mode relies on the file sitting on a shared drive, and any network-card flakiness, weak Wi-Fi, or VPN latency translates directly into in-app lag. Audit trail bloat is often a file-size problem dressed up as something else — the log is part of the file, and it is accessed every time a transaction is posted.",
      "Beyond those three, too many concurrent users (especially above the edition's licensed user count) and outdated hardware (a 5400 RPM drive is deadly for QuickBooks) fill out the top five. Outdated QuickBooks versions themselves are occasionally to blame, but most performance issues survive a version upgrade unless the underlying cause is also addressed.",
      "NexFortis directly addresses the three file-related causes. For size, Super Condense and Audit Trail Removal shrink the file dramatically. For list bloat contributing to slow searches and report runs, List Reduction cleans up the name and item lists. For corruption that makes Verify run for hours, File Repair rebuilds the database structure. For the network and hardware causes, we give honest self-help guidance below — but those are outside our scope as a data service.",
    ],
    benefits: [
      {
        title: "File-related slowness (our focus)",
        body: "Audit Trail Removal, Super Condense, and List Reduction each tackle different components of file-based slowness.",
      },
      {
        title: "Corruption-related slowness",
        body: "File Repair rebuilds broken indexes and fixes Verify errors that make every operation hang.",
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
        body: "If your .QBW is above 1.5 GB (Premier/Pro) or 2.5 GB (Enterprise), file size is the likely cause.",
      },
      {
        title: "Try Verify Data",
        body: "File → Utilities → Verify Data. If it hangs or errors, corruption is in play — File Repair is the right service.",
      },
      {
        title: "Isolate network vs file",
        body: "Test QuickBooks on the host machine with the file stored locally. If it is fast there and slow on clients, you have a network problem, not a file problem.",
      },
      {
        title: "Pick the right NexFortis service",
        body: "For file size: Super Condense and Audit Trail Removal. For list bloat: List Reduction. For corruption: File Repair.",
      },
    ],
    faqs: [
      {
        question: "Why is my QuickBooks so slow all of a sudden?",
        answer:
          "Sudden slowness usually points to a recent change: a network move, a new user added, a failed Verify that left partial corruption, or a file that just crossed a size threshold. Check the top three: file size, most recent Verify result, and whether multi-user mode was recently enabled.",
      },
      {
        question: "Does QuickBooks file size affect speed?",
        answer:
          "Yes, directly. Every operation that reads or writes the database touches the file on disk. Past roughly 1.5 GB in Premier/Pro, the slowdown becomes severe. Past 2.5 GB in Enterprise, the same thing happens. Reducing the file size with Super Condense or Audit Trail Removal is often the single highest-impact fix.",
      },
      {
        question: "Will Super Condense make QuickBooks faster?",
        answer:
          "Usually dramatically so, when file size is the real cause. Customers routinely go from 60-second file opens to 10-second file opens after a Super Condense. If your file is already small and still slow, the cause is elsewhere (network, corruption, or hardware) and Super Condense will not help.",
      },
      {
        question: "How do I know if my slow QuickBooks is a file problem or something else?",
        answer:
          "Open the file directly on the host machine with no network involvement. If it is fast there and slow on client machines, the problem is the network. If it is slow on the host machine too, the problem is the file itself (size, corruption, or list bloat).",
      },
      {
        question: "Can NexFortis help with network-related QuickBooks slowness?",
        answer:
          "No — NexFortis is a data service, not a network services provider. We focus specifically on the file: size, corruption, and lists. For network issues (weak Wi-Fi, slow shares, VPN latency) you want an IT professional familiar with SMB and Windows networking.",
      },
    ],
    relatedSlugs: ["quickbooks-file-too-large", "super-condense", "audit-trail-removal", "file-repair"],
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
      "QuickBooks company file errors explained: H202, H303, 6000-series. Self-help steps, when to call NexFortis, and how file repair works.",
    ctaLabel: "Start File Repair",
    ctaHref: "/landing/file-repair",
    heroImageAlt:
      "Illustration of a QuickBooks error dialog being resolved by file repair",
    hero: {
      intro:
        "QuickBooks company file errors come in a handful of families — H-series, 6000-series, and update errors. This page explains what each one means, which you can fix yourself, and when professional file repair is the right next step.",
    },
    overview: [
      "A company file error in QuickBooks is the app's way of saying \"I cannot open this file the way I expected to.\" The error code narrows down the cause. H202, H303, and H505 are all multi-user hosting errors — the client machine cannot reach the file on the host. The 6000-series errors (6000 -77, 6000 -80, 6000 -82, 6000 -83, 6123, 6147) are file-integrity or path errors. \"Company file needs to be updated\" appears when a newer QuickBooks version is opening an older file.",
      "For the H-series, start with self-help: open QuickBooks File Doctor (free from Intuit), confirm the host machine is running QuickBooks Database Server Manager, and that the company file folder is shared with full control for the user running QuickBooks. Most H-series errors are network configuration, not file damage.",
      "For the 6000-series, the standard first steps are File → Utilities → Verify Data, followed by Rebuild Data if Verify reports errors. Many 6000-series errors resolve with one Verify/Rebuild cycle. If they do not, the next step is to rename the .TLG (transaction log) and .ND (network descriptor) files — QuickBooks regenerates these on the next open. Only when those steps fail is the issue true file corruption requiring database-level repair.",
      "NexFortis File Repair is the right service when Verify fails to complete, Rebuild reports errors it cannot fix, or the file will not open at all even after the .TLG/.ND reset. We perform a diagnostic before any repair charge so that unrecoverable files are identified up front. For files that are too damaged to repair, we offer data recovery into a new, clean company file.",
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
        body: "File → Utilities → Verify Data. Note any errors reported — they are the key input to the next step.",
      },
      {
        title: "Try Rebuild and .TLG/.ND rename",
        body: "Run Rebuild Data if Verify reported errors. If that does not fix it, close QuickBooks and rename the .TLG and .ND files so QuickBooks regenerates them.",
      },
      {
        title: "Upload to NexFortis",
        body: "If self-help fails or the file will not open at all, create a backup (.QBM if possible, .QBW if not) and upload it.",
      },
      {
        title: "Diagnostic and repair",
        body: "We assess feasibility before charging for repair. You receive the repaired file plus a short report of what was fixed.",
      },
    ],
    faqs: [
      {
        question: "What does QuickBooks error 6000 mean?",
        answer:
          "The 6000-series errors (6000 -77, 6000 -80, 6000 -82, 6000 -83, 6123, 6147 and related) indicate a problem accessing the company file itself — either a file-integrity issue, a broken path, or network-share permissions blocking the open. The specific sub-code narrows down the cause.",
      },
      {
        question: "Can I fix QuickBooks file errors myself?",
        answer:
          "Often, yes. Most H-series errors resolve with QuickBooks File Doctor and correct Database Server Manager configuration. Most 6000-series errors resolve with Verify/Rebuild followed by a .TLG and .ND file rename. Only when those steps fail is professional repair needed.",
      },
      {
        question: "What if Verify and Rebuild Data doesn't work?",
        answer:
          "If Rebuild fails to complete, reports unfixable errors, or the file still will not open after the .TLG/.ND rename, you have true structural corruption. NexFortis File Repair performs database-level rebuild of indexes and record links that Verify/Rebuild cannot fix.",
      },
      {
        question: "How much does professional QuickBooks file repair cost?",
        answer:
          "Pricing starts at the listed launch price and scales with severity of the damage. Diagnostic assessment is free — if the file cannot be recovered, you are not charged. The diagnostic also gives you a firm quote for the repair before work begins.",
      },
      {
        question: "Is my data at risk with a corrupted QuickBooks file?",
        answer:
          "Potentially, yes. A file that fails Verify is a file that can become unopenable at the next crash or network hiccup. Do not keep entering data into a file with known corruption — run repair first, then resume. And always keep a current backup, because recovery is easier from a mildly damaged file than from one that has been pushed past the point of opening.",
      },
    ],
    relatedSlugs: ["file-repair", "quickbooks-file-too-large", "quickbooks-running-slow"],
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
      "Multi-currency accidentally enabled in QuickBooks? Intuit won't let you turn it off. Learn the common problems and how NexFortis removes it safely.",
    ctaLabel: "Remove Multi-Currency",
    ctaHref: "/landing/multi-currency-removal",
    heroImageAlt:
      "Illustration of currency exchange fields cluttering a QuickBooks form",
    hero: {
      intro:
        "Multi-currency in QuickBooks is a one-way toggle: once on, you cannot turn it off from within the product. This page explains the problems it causes, why it cannot be disabled, and how NexFortis removes it at the file level.",
    },
    overview: [
      "Multi-currency is a feature in QuickBooks Desktop designed for businesses that regularly transact in more than one currency. For those businesses it works well. The problem is how it gets enabled for businesses that do not need it: a single accidental click on \"Yes, I use more than one currency\" permanently flips the file into multi-currency mode. From that point on, QuickBooks behaves as if the business deals in multiple currencies whether it does or not.",
      "Symptoms of accidental multi-currency enablement are consistent. Every invoice, bill, and payment screen now includes exchange-rate fields, even if only one currency is ever used. Reports add per-currency columns and totals that clutter the output. Exchange-rate errors begin to appear — warnings that a non-existent exchange rate is out of date, prompts to update foreign-currency rates, and inaccurate home-currency totals if anyone ever enters a transaction in the wrong currency by mistake. Performance drops slightly because the feature adds overhead to every transaction post.",
      "The critical frustration is that Intuit provides no supported way to turn the feature off. Their documentation confirms this explicitly: once enabled, multi-currency is permanent. This leaves affected businesses with three options. Start a new company file and re-enter all data (impractical for any active business). Live with the clutter (the usual choice, grudgingly). Or remove the feature at the file level — which is what NexFortis does.",
      "NexFortis Multi-Currency Removal directly edits the company file to disable the multi-currency flag, normalize any non-home-currency transactions to the home currency using their originally recorded exchange rates, and clear the exchange-rate lists. Reported totals in the home currency are unchanged. The result is a file that behaves as if multi-currency was never enabled.",
    ],
    benefits: [
      {
        title: "Clean data-entry screens",
        body: "Exchange-rate fields and currency prompts disappear from invoices, bills, and payment forms.",
      },
      {
        title: "Clean reports",
        body: "Per-currency columns and sub-totals are removed. Reports return to single-currency format.",
      },
      {
        title: "No data loss",
        body: "Non-home-currency transactions are normalized using their originally recorded exchange rates, so home-currency totals stay identical.",
      },
      {
        title: "Immediate productivity gain",
        body: "No more training staff around exchange-rate fields that should not exist on their screens.",
      },
    ],
    process: [
      {
        title: "Confirm the home currency",
        body: "Decide which currency becomes the only currency post-removal — typically the currency you invoice and bank in.",
      },
      {
        title: "Back up and upload",
        body: "Create a .QBM backup and upload it to NexFortis over a 256-bit encrypted connection.",
      },
      {
        title: "Removal at the file level",
        body: "We normalize non-home-currency transactions, disable the multi-currency flag, and clear exchange-rate lists.",
      },
      {
        title: "Download the cleaned file",
        body: "You receive a .QBM that no longer treats the file as multi-currency, with home-currency totals unchanged.",
      },
    ],
    faqs: [
      {
        question: "Can I turn off multi-currency in QuickBooks myself?",
        answer:
          "No. Intuit does not provide a supported way to disable multi-currency from within QuickBooks. The feature is explicitly documented as a one-way toggle. The only way to remove it is through direct modification of the company file.",
      },
      {
        question: "What problems does multi-currency cause when it is not needed?",
        answer:
          "Exchange-rate fields clutter every transaction screen, reports include unnecessary per-currency breakdowns, exchange-rate errors and prompts appear even for unused currencies, and staff can accidentally enter transactions in the wrong currency. There is also a small performance penalty on every transaction post.",
      },
      {
        question: "Will removing multi-currency delete my data?",
        answer:
          "No. All transactions, lists, reports, templates, and preferences are preserved. Transactions originally recorded in a non-home currency are normalized to the home currency using their originally recorded exchange rates, so home-currency totals do not change.",
      },
      {
        question: "How much does multi-currency removal cost?",
        answer:
          "Pricing starts at the listed launch price. Because the operation is a one-time file edit, the price does not scale with file size or company complexity — see the Multi-Currency Removal service page for the current launch offer.",
      },
    ],
    relatedSlugs: ["multi-currency-removal", "enterprise-to-premier-conversion", "super-condense"],
    breadcrumbs: [SERVICES_CRUMB, { name: "QuickBooks Multi-Currency Problems", path: "/landing/quickbooks-multi-currency-problems" }],
  },
];

export function getLandingPageBySlug(slug: string): LandingPageData | undefined {
  return landingPages.find((p) => p.slug === slug);
}

export function listLandingSlugs(): string[] {
  return landingPages.map((p) => p.slug);
}
