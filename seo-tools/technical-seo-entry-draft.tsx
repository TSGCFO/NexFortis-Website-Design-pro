  // ------------------------------------------------------ TECHNICAL SEO ----
  "technical-seo": {
    metaTitle: "Technical SEO Services in Canada",
    metaDescription:
      "Technical SEO for Canadian businesses: Core Web Vitals, crawlability, indexation, structured data, and site architecture fixes that let your pages rank.",
    h1: "Technical SEO Services for Faster, Indexable Sites",
    heroSubtitle:
      "We fix the crawling, indexing, speed, and structured-data problems that quietly cap your rankings — so the pages you publish can actually compete.",
    serviceType: "Technical SEO",
    serviceSchemaName: "Technical SEO Services",
    serviceSchemaDescription:
      "Technical search engine optimization for Canadian businesses — Core Web Vitals, crawlability, indexation, structured data, rendering, and site architecture.",
    introHeading: "The foundation your rankings stand on",
    intro: (
      <>
        <p>
          You can write the best page on the internet, but if Google can&rsquo;t crawl it, render
          it, or load it fast enough, it never gets the chance to rank. Technical SEO is the
          plumbing underneath every other tactic &mdash; the crawl paths, the index signals, the
          structured data, and the speed that decide whether your content is even eligible to
          compete.
        </p>
        <p>
          Where our <InlineLink href={seo.href}>{seo.linkText}</InlineLink> handle the keyword and
          content side, this page is the engineering layer beneath it: the work that makes sure
          every URL is reachable, indexable, and quick. It&rsquo;s a core part of our{" "}
          <InlineLink href={DM_PILLAR_HREF}>{DM_PILLAR_LINK_TEXT}</InlineLink>, and on most sites
          we audit it&rsquo;s where the fastest, most overlooked wins are hiding &mdash; orphaned
          pages, bloated indexes, render-blocking scripts, and broken canonical signals nobody
          ever caught.
        </p>
        <p>
          Google is explicit that Core Web Vitals are used by its ranking systems, so speed and
          stability aren&rsquo;t a nice-to-have &mdash; they&rsquo;re a tiebreaker that decides
          close calls. We find what&rsquo;s holding your site back, fix it at the code and
          configuration level, and prove the gain with real field data.
        </p>
      </>
    ),
    stats: [
      {
        value: "54%",
        label: "of desktop sites pass all three Core Web Vitals — and mobile lags well behind.",
        sourceName: "2024 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2024/performance",
      },
      {
        value: "41%",
        label: "of mobile pages now use JSON-LD structured data, up from 34% in 2022.",
        sourceName: "2024 Web Almanac, HTTP Archive",
        sourceUrl: "https://almanac.httparchive.org/en/2024/structured-data",
      },
      {
        value: "2.5s",
        label: "is the 'good' Largest Contentful Paint threshold Google measures at the 75th percentile.",
        sourceName: "Google web.dev, Core Web Vitals",
        sourceUrl: "https://web.dev/articles/lcp",
      },
    ],
    featuresHeading: "What's included in our technical SEO services",
    featuresSubtitle:
      "The under-the-hood work that lets every page you publish get crawled, indexed, and ranked.",
    features: [
      {
        icon: Bot,
        title: "Crawlability & crawl budget",
        description:
          "We map how search engines move through your site, fix broken links and redirect chains, and clean up robots.txt and XML sitemaps so crawlers spend their budget on the pages that earn revenue — not on dead ends.",
      },
      {
        icon: Search,
        title: "Indexation & canonicalization",
        description:
          "We audit what's actually in Google's index, remove the thin and duplicate URLs bloating it, and set canonical, noindex, and pagination signals correctly so the right version of each page is the one that ranks.",
      },
      {
        icon: Gauge,
        title: "Core Web Vitals & page speed",
        description:
          "We diagnose LCP, INP, and CLS against real field data, then fix the render-blocking scripts, oversized images, and layout shifts behind a slow score — improvements you feel in the loading bar, not just a Lighthouse number.",
      },
      {
        icon: FileCode,
        title: "Structured data & schema",
        description:
          "We implement and validate the Schema.org markup — Organization, Article, FAQ, Product, Breadcrumb — that earns rich results and helps engines understand your pages, and we fix the invalid markup already costing you eligibility.",
      },
      {
        icon: Map,
        title: "Site architecture & internal links",
        description:
          "We restructure URL hierarchy and internal linking so authority flows to your money pages and nothing sits orphaned beyond reach — a flatter, cleaner path that both crawlers and buyers can follow.",
      },
      {
        icon: FileText,
        title: "Rendering & JavaScript SEO",
        description:
          "We check how your pages render to Googlebot, catch content that only appears after JavaScript runs, and recommend server-side or pre-rendering fixes so nothing important is invisible at the moment it's indexed.",
      },
    ],
    processHeading: "How we deliver technical SEO",
    process: [
      {
        step: "01",
        title: "Technical audit",
        description:
          "We crawl your entire site, pull Search Console and field Core Web Vitals data, and produce a prioritized list of every crawl, index, speed, and schema issue — ranked by impact, not volume.",
      },
      {
        step: "02",
        title: "Fix the blockers",
        description:
          "We start with what's actively suppressing rankings: indexation errors, broken canonicals, and redirect chains first, then the render and speed problems that drag every page down.",
      },
      {
        step: "03",
        title: "Speed & structured data",
        description:
          "We tune Core Web Vitals against the 75th-percentile field thresholds Google measures and roll out validated schema across your templates so the gains apply site-wide, not page by page.",
      },
      {
        step: "04",
        title: "Monitor & maintain",
        description:
          "We watch Search Console for new crawl and index errors, re-test vitals after every release, and catch regressions early — because a clean technical foundation only stays clean if someone is watching it.",
      },
    ],
    comparisonHeading: "NexFortis vs. a typical technical SEO audit",
    comparison: [
      { feature: "Core Web Vitals", us: "Fixed in code against real field data", them: "A Lighthouse PDF with no fixes" },
      { feature: "Crawl & index", us: "Crawl budget and index bloat resolved", them: "Left for the next agency" },
      { feature: "Structured data", us: "Implemented and validated for rich results", them: "Recommended but never shipped" },
      { feature: "JavaScript rendering", us: "Checked against how Googlebot sees it", them: "Assumed to just work" },
      { feature: "Deliverable", us: "Working fixes you can verify", them: "A 60-page report you action yourself" },
      { feature: "Commitment", us: "Month-to-month, with the fixes done for you", them: "A one-off audit invoice" },
    ],
    pricingHeading: "What technical SEO costs",
    pricing: {
      fromLabel: "Scoped to your site's size and stack",
      note: (
        <>
          <p className="mb-4">
            A ten-page brochure site needs far less than a thousand-URL store on a JavaScript
            framework, so we scope by how large and how complex your site is &mdash; the platform,
            the template count, and how deep the issues run &mdash; rather than a flat package
            price. A one-time audit-and-fix sprint and an ongoing technical retainer are both on
            the table, depending on how often your site changes.
          </p>
          <p>
            You get a fixed scope, the fixes actually implemented (not just listed), and no
            long-term lock-in. Ask for a quote and we&rsquo;ll give you a number tied to your real
            site, not a generic tier.
          </p>
        </>
      ),
    },
    faq: [
      {
        question: "What is technical SEO?",
        answer:
          "Technical SEO is the work that makes your site easy for search engines to crawl, render, index, and trust — separate from the words on the page. It covers crawlability, indexation, site speed and Core Web Vitals, structured data, site architecture, canonical signals, and how your pages render. It's the foundation that lets your content and links actually earn rankings.",
      },
      {
        question: "What is the difference between technical SEO and on-page SEO?",
        answer:
          "On-page SEO is about the content itself — keywords, titles, headings, and how well a page answers a search. Technical SEO is about the infrastructure underneath: whether Google can crawl the page, index it, render it correctly, and load it fast. You need both. We deliver the content and keyword side through our SEO services and the engineering side here, so the two reinforce each other.",
      },
      {
        question: "Do Core Web Vitals really affect rankings?",
        answer:
          "Yes. Google states plainly that Core Web Vitals are used by its ranking systems as part of page experience. They won't outrank genuinely better content on their own, but when two pages are close, the faster, more stable one wins — and a slow site also loses visitors before they ever convert. We treat vitals as both a ranking factor and a conversion lever.",
      },
      {
        question: "How do I know if my site has technical SEO problems?",
        answer:
          "Common warning signs are pages that won't appear in Google, traffic that has plateaued despite new content, slow load times, or errors in Google Search Console's index and Core Web Vitals reports. Our audit surfaces all of it at once — every crawl, index, speed, and schema issue, ranked by how much it's costing you — so you see the full picture before any work starts.",
      },
      {
        question: "Will technical SEO require changes to my website?",
        answer:
          "Almost always, yes — that's the point. Fixes can touch your code, server configuration, templates, redirects, and structured data. We work with your existing platform and developers wherever possible, flag anything that needs a build change before we touch it, and ship nothing without your sign-off.",
      },
      {
        question: "Is a one-time technical audit enough, or do I need ongoing work?",
        answer:
          "An audit-and-fix sprint resolves what's broken today, and for a small, stable site that can be enough. But every redesign, plugin update, and new release can reintroduce crawl errors, speed regressions, or broken schema. Sites that publish or change often do better with light ongoing monitoring so problems get caught in days, not the months it takes rankings to slide.",
      },
    ],
    authorNote: (
      <p>
        Hassan leads technical SEO at NexFortis, bringing an IT and engineering background to the
        crawl, index, speed, and structured-data work that most marketers skip. He works directly
        with every client &mdash; no hand-off to a junior team.
      </p>
    ),
    ctaHeading: "Is a technical problem holding your rankings back?",
    ctaSubtext:
      "Get a free, no-obligation technical audit of your site — crawl health, Core Web Vitals, indexation, and schema, with a clear plan to fix what's costing you.",
  },
