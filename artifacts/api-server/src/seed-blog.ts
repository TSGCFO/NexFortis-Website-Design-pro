import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "./lib/logger";

const blogPosts = [
  {
    title: "5 Signs Your Business Needs an IT Audit",
    slug: "5-signs-your-business-needs-an-it-audit",
    seoTitle: "5 Signs Your Business Needs an IT Audit",
    metaDescription: "Climbing IT costs, slow systems, or fuzzy security posture? Five clear signs your Canadian business is due for a professional IT audit.",
    excerpt: "If your technology costs are climbing, your team is frustrated with slow systems, or you're unsure about your security posture — it might be time for a professional IT audit. Here are five clear indicators.",
    category: "IT Consulting",
    coverImage: "/images/blog-1.png",
    published: true,
    content: `## Why an IT Audit Matters

Many Canadian businesses don't think about their IT infrastructure until something breaks. But by then, the damage — lost productivity, security breaches, or spiraling costs — has already been done. A professional IT audit gives you a clear picture of where your technology stands and where it needs to go.

## Sign 1: Your IT Costs Keep Climbing Without Clear ROI

If your technology spending is increasing year over year but you're not seeing proportional improvements in productivity or capability, something is off. An IT audit examines every line item — from software licenses and cloud subscriptions to hardware maintenance contracts — and identifies where money is being wasted. Many businesses discover they're paying for unused licenses, redundant services, or outdated tools that have cheaper modern alternatives.

## Sign 2: Your Team Complains About Slow or Unreliable Systems

When employees spend more time waiting for systems to load than actually working, it's a productivity killer. An IT audit assesses your network performance, hardware age, software configuration, and cloud resource allocation to pinpoint bottlenecks. Often, the fix is simpler and less expensive than you'd expect — a misconfigured server, an overloaded switch, or an application that needs a cloud-based upgrade.

## Sign 3: You're Not Sure If Your Data Is Secure

If you can't confidently answer questions like "Who has access to our financial data?" or "When was our last backup tested?" — you need an audit. Cybersecurity threats targeting Canadian SMBs are increasing, and PIPEDA requires businesses to implement appropriate safeguards. An audit reviews your firewall configuration, endpoint protection, access controls, backup procedures, and incident response readiness.

## Sign 4: You've Had Staff Changes Without IT Offboarding

Employee turnover without proper IT offboarding is one of the biggest security risks for small businesses. Former employees may still have access to email accounts, cloud storage, CRM systems, or financial tools. An IT audit identifies orphaned accounts, excessive permissions, and access control gaps so you can lock things down.

## Sign 5: You're Planning for Growth

Whether you're adding staff, opening a new location, or expanding into e-commerce, growth puts new demands on your IT infrastructure. An audit helps you understand whether your current systems can scale, what needs to be upgraded, and how to plan your technology roadmap to support your business goals without overspending.

## What Happens During a NexFortis IT Audit?

Our audit process covers hardware, software, network, security, and compliance. We deliver a prioritized action plan with clear cost estimates and ROI projections for each recommendation. Most audits are completed within one to two weeks, and the insights typically pay for themselves many times over through cost savings and risk reduction.

## Ready to Get Started?

Book a free 30-minute consultation with our team to discuss whether an IT audit is right for your business. There's no obligation and no sales pressure — just honest advice from certified IT professionals who understand the Canadian business landscape.`,
  },
  {
    title: "Microsoft 365 Migration Checklist for Canadian SMBs",
    slug: "microsoft-365-migration-checklist-canadian-smbs",
    seoTitle: "Microsoft 365 Migration Checklist",
    metaDescription: "A practical, Canadian-SMB-focused Microsoft 365 migration checklist: pre-migration assessment through post-launch support, step by step.",
    excerpt: "Planning a move to Microsoft 365? This comprehensive checklist covers everything from pre-migration assessment to post-launch support — designed specifically for Canadian small and mid-sized businesses.",
    category: "Microsoft 365",
    coverImage: "/images/blog-2.png",
    published: true,
    content: `## Before You Begin: Why Microsoft 365?

Microsoft 365 is the productivity backbone for millions of businesses worldwide. For Canadian SMBs, it offers enterprise-grade email, collaboration tools (Teams, SharePoint), cloud storage (OneDrive), and built-in security features — all at a predictable per-user monthly cost. But a successful migration requires careful planning.

## Phase 1: Pre-Migration Assessment

### Inventory Your Current Environment
- Document all existing email accounts, distribution lists, and shared mailboxes
- Catalog file shares, cloud storage, and collaboration tools currently in use
- Record any third-party integrations (CRM, accounting software, phone systems)
- Note the total data volume for email and files

### Choose the Right Microsoft 365 Plan
- Business Basic: Web-only Office apps, Exchange email, Teams, 1 TB OneDrive
- Business Standard: Desktop Office apps plus everything in Basic
- Business Premium: Everything in Standard plus advanced security (Intune, Azure AD P1)
- Enterprise plans: For organizations over 300 users with advanced compliance needs

### Verify Your Domain
- Ensure you own and control your business domain (e.g., yourcompany.ca)
- Gather DNS login credentials — you'll need to update MX, CNAME, and TXT records

## Phase 2: Planning

### Create a Migration Timeline
- Set a target migration date at least two weeks out
- Plan for a pilot group (5–10 users) to migrate first
- Schedule the full migration during low-activity periods
- Communicate the timeline to all staff

### Prepare User Accounts
- Create a master list of all users with email, display name, and department
- Assign appropriate Microsoft 365 licenses to each user
- Plan security groups and distribution lists

### Data Migration Strategy
- Decide what data to migrate: all historical email, or only recent years?
- Plan file migration from shared drives to SharePoint or OneDrive
- Identify any large mailboxes (over 10 GB) that may need special handling

## Phase 3: Migration Execution

### DNS Configuration
- Update MX records to point to Microsoft 365
- Add SPF, DKIM, and DMARC records for email authentication
- Verify domain ownership in the Microsoft 365 admin center

### Mailbox Migration
- Use Microsoft's migration tools or a third-party tool for batch migration
- Migrate the pilot group first and verify everything works
- Proceed with remaining users in batches
- Monitor migration progress and address any errors

### File Migration
- Move shared drive contents to SharePoint document libraries
- Migrate individual files to OneDrive
- Update any shared links or shortcuts

## Phase 4: Post-Migration

### Verify and Test
- Confirm all mailboxes are receiving and sending email
- Test calendar sharing, contacts, and distribution lists
- Verify file access permissions in SharePoint and OneDrive
- Test Teams functionality including meetings and channels

### User Training
- Provide hands-on training for Outlook, Teams, OneDrive, and SharePoint
- Create a quick-reference guide for common tasks
- Designate internal champions to help colleagues

### Security Configuration
- Enable multi-factor authentication (MFA) for all users
- Configure conditional access policies
- Set up data loss prevention (DLP) rules if needed
- Review and configure mobile device management (Intune)

## Working with a Migration Partner

While it's possible to handle a Microsoft 365 migration internally, working with a certified Microsoft partner like NexFortis ensures zero-downtime migration, proper security configuration, and expert support. Our team has completed hundreds of migrations for Canadian businesses and includes 30 days of post-migration support as standard.`,
  },
  {
    title: "QuickBooks Desktop vs. Online: Which Is Right for Your Business?",
    slug: "quickbooks-desktop-vs-online",
    seoTitle: "QuickBooks Desktop vs. Online",
    metaDescription: "Honest comparison of QuickBooks Desktop and Online for Canadian businesses, including when it makes sense to switch and what to watch for.",
    excerpt: "Choosing between QuickBooks Desktop and QuickBooks Online is one of the most common decisions Canadian businesses face. Here's an honest comparison to help you decide — or determine if it's time to switch.",
    category: "QuickBooks",
    coverImage: "/images/blog-3.png",
    published: true,
    content: `## The Big Question

If you're running a Canadian business and using QuickBooks — or considering it — you've probably asked: should I use QuickBooks Desktop or QuickBooks Online? The answer depends on your business size, workflow, industry, and growth plans. Let's break it down.

## QuickBooks Desktop: The Traditional Powerhouse

### Strengths
- **One-time purchase**: No monthly subscription (though Intuit now pushes annual renewals)
- **Advanced inventory**: Multi-location tracking, assemblies, and lot tracking
- **Complex reporting**: More built-in report templates and customization options
- **Speed**: Runs locally, so data entry and report generation can feel faster
- **Industry-specific editions**: Contractor, Manufacturing, Nonprofit, and Professional Services editions

### Limitations
- **No real-time collaboration**: Only one user can access the file at a time (unless using Enterprise with multi-user mode)
- **Manual backups**: You're responsible for backing up your company file
- **No mobile access**: Can't access your books from a phone or tablet without third-party tools
- **Declining support**: Intuit is gradually shifting development focus to Online

## QuickBooks Online: The Cloud-First Option

### Strengths
- **Access anywhere**: Log in from any browser or the mobile app — perfect for remote teams
- **Automatic updates**: Always running the latest version with no manual installs
- **Bank feeds**: Real-time bank and credit card connections for faster reconciliation
- **App integrations**: Hundreds of third-party apps connect directly to QBO
- **Multi-user**: Multiple team members and your accountant can work simultaneously

### Limitations
- **Monthly subscription**: Ongoing cost that increases with plan tier
- **Simpler inventory**: Less advanced than Desktop for manufacturing or complex inventory
- **Internet dependent**: Requires a stable connection to work
- **Fewer report templates**: Some power users find the reporting less flexible than Desktop

## Key Decision Factors for Canadian Businesses

### GST/HST and Tax Compliance
Both versions handle Canadian tax reporting well, but Desktop offers more granular control over tax codes and rates. Online has improved significantly and handles GST/HST, PST, and HST provincial rates for most businesses.

### Payroll
QuickBooks Online integrates with cloud payroll services and offers built-in payroll add-ons. Desktop payroll requires a separate subscription and manual tax table updates.

### Multi-Currency
Both support multi-currency transactions, which is important for Canadian businesses dealing with USD and other currencies. Online handles it more seamlessly with automatic exchange rate updates.

### Business Size
- **Sole proprietors and small teams (1–5)**: QuickBooks Online is usually the better fit — lower barrier to entry, easier collaboration, and mobile access
- **Mid-sized businesses (5–25)**: Either can work, depending on industry complexity
- **Larger operations with complex inventory**: Desktop Enterprise may still be the better choice

## When to Switch from Desktop to Online

Consider switching if:
- Your team needs remote access to the books
- You want your accountant to have real-time access
- You're tired of managing backups and software updates
- Your Desktop version is being discontinued by Intuit

## Making the Move

If you decide to migrate from Desktop to Online (or vice versa), the process requires careful data mapping and verification. NexFortis specializes in QuickBooks data migration with a 100% accuracy guarantee. We handle the technical details so you can focus on running your business.`,
  },
  {
    title: "What Is PIPEDA and Why It Matters for Your Business",
    slug: "what-is-pipeda-why-it-matters",
    seoTitle: "PIPEDA Explained for Businesses",
    metaDescription: "Plain-language guide to PIPEDA: what Canada's federal privacy law requires, how it affects your IT systems, and the cost of non-compliance.",
    excerpt: "Canada's federal privacy law affects every business that collects personal information. Here's a plain-language guide to PIPEDA — what it requires, how it affects your IT systems, and what happens if you don't comply.",
    category: "IT Consulting",
    coverImage: "/images/blog-1.png",
    published: true,
    content: `## PIPEDA in Plain Language

The Personal Information Protection and Electronic Documents Act (PIPEDA) is Canada's federal privacy law. It governs how private-sector organizations collect, use, and disclose personal information in the course of commercial activities. If your business collects customer names, email addresses, phone numbers, payment information, or any other personal data — PIPEDA applies to you.

## The 10 Fair Information Principles

PIPEDA is built on ten fair information principles that every business must follow:

### 1. Accountability
Your organization is responsible for the personal information under its control. You must designate someone to be accountable for compliance.

### 2. Identifying Purposes
You must identify the reasons for collecting personal information before or at the time of collection. For example, if you collect email addresses for a newsletter, you can't later use them for unrelated marketing without consent.

### 3. Consent
You need meaningful consent to collect, use, or disclose personal information. Consent can be express (opt-in) or implied, depending on the sensitivity of the information and the reasonable expectations of the individual.

### 4. Limiting Collection
Only collect personal information that is necessary for the purposes you've identified. Don't collect data "just in case" — every field on your contact form should have a clear business purpose.

### 5. Limiting Use, Disclosure, and Retention
Personal information should only be used for the purposes for which it was collected. Don't keep data longer than necessary, and have a clear data retention policy.

### 6. Accuracy
Personal information must be as accurate, complete, and up-to-date as necessary for the purposes for which it is used.

### 7. Safeguards
Protect personal information with security safeguards appropriate to the sensitivity of the information. This includes physical measures (locked offices), organizational measures (access controls), and technological measures (encryption, firewalls).

### 8. Openness
Make your privacy policies and practices readily available to the public. Your website should have a clear, accessible privacy policy.

### 9. Individual Access
Individuals have the right to access their personal information held by your organization and to challenge its accuracy.

### 10. Challenging Compliance
Individuals can challenge your organization's compliance with PIPEDA by contacting your designated privacy officer or filing a complaint with the Office of the Privacy Commissioner of Canada.

## How PIPEDA Affects Your IT Systems

### Data Storage
Where you store personal data matters. While PIPEDA doesn't explicitly require data to stay in Canada, transferring data to jurisdictions with weaker privacy laws creates additional obligations. Many Canadian businesses choose to keep data in Canadian data centers as a best practice.

### Access Controls
Your IT systems must enforce the principle of least privilege — employees should only have access to the personal information they need to do their jobs. This means role-based access controls, strong authentication, and regular access reviews.

### Encryption
Sensitive personal information should be encrypted both in transit (TLS/SSL) and at rest. This applies to your website, email systems, cloud storage, and databases.

### Breach Notification
Since November 2018, PIPEDA requires organizations to report data breaches that pose a "real risk of significant harm" to the Privacy Commissioner and affected individuals. You must also keep records of all breaches for at least two years.

### Email and Communication
If you use email to communicate with customers, ensure your email systems use encryption and that sensitive information isn't sent in plain text. Microsoft 365's built-in encryption and data loss prevention tools can help.

## Consequences of Non-Compliance

The Office of the Privacy Commissioner can investigate complaints, conduct audits, and make recommendations. While PIPEDA itself doesn't impose direct fines, the Commissioner can take organizations to Federal Court, and individuals can sue for damages. The reputational damage from a privacy breach can be even more costly than any legal penalties.

## What You Should Do Now

1. Review your privacy policy and ensure it's up to date
2. Audit what personal data you collect and why
3. Implement appropriate technical safeguards (encryption, access controls, backups)
4. Train your staff on privacy responsibilities
5. Create a data breach response plan
6. Consider a professional IT audit to identify compliance gaps

## Need Help with PIPEDA Compliance?

NexFortis helps Canadian businesses build IT infrastructure that meets PIPEDA requirements. From secure Microsoft 365 deployments to comprehensive technology audits, we ensure your systems protect customer data while keeping your business running efficiently.`,
  },
  {
    title: "Top 5 Workflow Automation Wins for Small Businesses",
    slug: "top-5-workflow-automation-wins-small-businesses",
    seoTitle: "5 Workflow Automation Wins for SMBs",
    metaDescription: "Five practical workflow automations Canadian small businesses can implement today to save hours every week — no coding required.",
    excerpt: "Workflow automation isn't just for enterprises. Here are five practical automations that Canadian small businesses can implement today to save hours every week — no coding required.",
    category: "Automation",
    coverImage: "/images/blog-2.png",
    published: true,
    content: `## Why Automation Matters for Small Businesses

If your team spends hours each week copying data between systems, sending routine emails, or manually updating spreadsheets — you're leaving money on the table. Workflow automation tools like Microsoft Power Automate, Zapier, and custom integrations can eliminate repetitive tasks and let your team focus on work that actually grows the business.

## Win 1: Automatic Invoice Processing

### The Problem
Your team receives invoices by email, manually enters them into QuickBooks, and then files the original. This process is slow, error-prone, and mind-numbing.

### The Automation
Set up a workflow that automatically captures incoming invoice emails, extracts key data (vendor, amount, date, line items), creates the bill in QuickBooks, and files the original document in a shared folder. Tools like Power Automate with AI Builder can handle the data extraction, while Zapier connects to QuickBooks for the entry.

### The Result
Businesses we've worked with report 80% faster invoice processing and near-zero data entry errors. For a company processing 200 invoices per month, that's roughly 20 hours saved.

## Win 2: New Client Onboarding

### The Problem
When you sign a new client, someone has to manually create accounts in your CRM, send a welcome email, set up a project folder, add them to your invoicing system, and notify the team. Steps get missed, and the client experience suffers.

### The Automation
Create a workflow triggered by a new client entry in your CRM (HubSpot, Salesforce, or even a Google Form). The automation creates a project folder in SharePoint, sends a branded welcome email with next steps, creates a client record in QuickBooks, assigns a team member, and posts a notification to your Teams channel.

### The Result
Consistent, professional onboarding every time. No steps missed, no delays, and your team is notified instantly.

## Win 3: Automated Reporting

### The Problem
Every Monday morning, someone pulls data from three different systems, builds a spreadsheet, and emails it to the management team. It takes two hours and the data is already a day old by the time anyone reads it.

### The Automation
Connect your data sources (CRM, accounting, project management) to a reporting tool like Power BI or Google Data Studio. Schedule automated report generation and email delivery. Better yet, build a live dashboard that updates in real time so your team always has current data.

### The Result
Real-time business intelligence without the manual effort. Leadership gets better data faster, and your analyst can focus on insights instead of data wrangling.

## Win 4: Employee Leave and Absence Tracking

### The Problem
Employees email their manager to request time off. The manager forwards it to HR. HR checks the balance, approves or denies, updates the spreadsheet, and notifies payroll. The whole process is scattered across email threads and spreadsheets.

### The Automation
Build a simple approval workflow using Microsoft Forms and Power Automate. The employee submits a request through a form. The automation checks their remaining balance, routes the request to their manager for approval, updates the tracking system, notifies HR and payroll, and blocks the dates on the team calendar.

### The Result
A professional, trackable process that takes minutes instead of days. No lost emails, no spreadsheet errors, and complete audit trail.

## Win 5: Social Media and Content Scheduling

### The Problem
Your marketing person manually posts to LinkedIn, Facebook, and Instagram. They copy-paste the same content three times, upload images separately, and try to remember to post at the optimal time. Some posts get forgotten entirely.

### The Automation
Use a content calendar tool (like Buffer or Hootsuite) integrated with your content creation workflow. When a blog post is published on your website, automatically generate social media posts, schedule them across all platforms, and track engagement — all from a single dashboard.

### The Result
Consistent social media presence without the daily manual effort. Your content reaches more people at the right times, and your marketing team can focus on strategy instead of scheduling.

## Getting Started with Automation

The best automation projects start small. Pick one repetitive task that frustrates your team, map out the current manual process, and work with an automation specialist to build and test the workflow. Once you see the time savings from your first automation, you'll quickly identify dozens more opportunities.

## How NexFortis Can Help

Our automation team specializes in building practical workflows for Canadian businesses using Power Automate, Zapier, custom APIs, and bespoke applications. We start with a free process assessment to identify your highest-impact automation opportunities and deliver solutions that integrate seamlessly with your existing tools — QuickBooks, Microsoft 365, CRM systems, and more.`,
  },
];

export async function seedBlogPosts() {
  try {
    for (const post of blogPosts) {
      const existing = await db
        .select({ id: blogPostsTable.id })
        .from(blogPostsTable)
        .where(eq(blogPostsTable.slug, post.slug))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(blogPostsTable).values(post);
        logger.info({ slug: post.slug }, "Seeded blog post");
      }
    }
    logger.info("Blog post seeding complete");
  } catch (error) {
    logger.error(error, "Failed to seed blog posts");
  }
}
