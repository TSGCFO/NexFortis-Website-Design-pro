import { PageHero, Section, SectionHeader, FAQItem } from "@/components/ui-elements";
import { SEO, ServiceSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo";
import { Check, ShieldCheck, Mail, Users, MonitorSmartphone, ArrowRight, Cloud, Lock, Smartphone } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";

const m365Faqs = [
  {
    question: "How long does a Microsoft 365 migration take for a small business?",
    answer: "For most small businesses with under 50 users, a complete Microsoft 365 migration typically takes one to two weeks from planning through completion. This includes the initial assessment, mailbox migration, file transfer, security configuration, and user training. We perform zero-downtime migrations, so your team continues working without interruption throughout the process. Larger organizations or those with complex on-premises setups may require three to four weeks.",
  },
  {
    question: "Will we lose any emails or files during the migration?",
    answer: "No. Our migration methodology includes a full pre-migration backup, staged data transfer with continuous verification, and a post-migration reconciliation check that confirms every mailbox, calendar entry, contact, and file has been transferred completely. We maintain your original environment in read-only mode until you confirm everything is working correctly in Microsoft 365. Our zero-data-loss track record spans thousands of migrations.",
  },
  {
    question: "What is Intune MDM and does my business need it?",
    answer: "Microsoft Intune is a mobile device management (MDM) solution that lets you secure and manage company data on employee devices — whether they are company-owned laptops, personal smartphones, or tablets. If your team accesses work email, files, or applications from any device outside the office, Intune ensures those devices meet your security policies. It is especially important for businesses with remote or hybrid workers, and is required for compliance with many industry regulations including PIPEDA.",
  },
  {
    question: "Can you set up Microsoft Teams for our entire organization?",
    answer: "Yes. We handle full Microsoft Teams deployments including channel architecture, meeting room configuration, external collaboration policies, and integration with your existing phone system. We also provide hands-on training for your staff to ensure rapid adoption. For larger organizations, we create a phased rollout plan that starts with pilot teams before expanding company-wide.",
  },
  {
    question: "Do you offer ongoing support after the migration is complete?",
    answer: "Every migration includes 30 days of complimentary post-migration support. During this period, our team handles any issues that arise, answers user questions, and fine-tunes your configuration. After the support window, you can continue with our managed IT services for ongoing administration, security monitoring, user onboarding and offboarding, and license management at a predictable monthly rate.",
  },
];

export default function Microsoft365() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    { icon: Mail, label: "Business Email", desc: "Professional email with custom domains, 50 GB mailboxes, and built-in calendar." },
    { icon: Users, label: "Teams Deployment", desc: "Full Microsoft Teams rollout with channels, meetings, and external collaboration." },
    { icon: MonitorSmartphone, label: "Intune MDM", desc: "Mobile device management to secure company data on any device, anywhere." },
    { icon: ShieldCheck, label: "Advanced Security", desc: "MFA, conditional access, and threat protection to keep your data safe." },
  ];

  const process = [
    { step: "01", title: "Assessment", desc: "We audit your current email and productivity setup to identify gaps, compliance risks, and migration requirements. This includes reviewing your domain configuration, existing mailbox sizes, and any on-premises dependencies." },
    { step: "02", title: "Planning", desc: "A detailed migration plan with timelines, user communication templates, rollback procedures, and security configuration standards — reviewed and approved by your team before we begin." },
    { step: "03", title: "Migration", desc: "Zero-downtime migration of mailboxes, files, and settings with continuous monitoring. We migrate in batches, verify data integrity after each stage, and keep your legacy system active until cutover is confirmed." },
    { step: "04", title: "Training & Support", desc: "Hands-on user training covering Outlook, Teams, OneDrive, and SharePoint workflows tailored to your business. Includes 30-day post-migration support with a dedicated point of contact." },
  ];

  const tiers = ["Small Business", "Medium Business", "Enterprise"];
  const rows = [
    ["Business Email Setup", "\u2713", "\u2713", "\u2713"],
    ["Office 365 Apps", "\u2713", "\u2713", "\u2713"],
    ["Microsoft Teams", "Optional", "\u2713", "\u2713"],
    ["Email Security", "Basic", "Advanced", "Enterprise-Grade"],
    ["User Management", "Up to 25", "Up to 100", "Unlimited"],
    ["Device Management", "\u2014", "Basic Intune", "Full Intune + Autopilot"],
    ["Security & Compliance", "MFA", "MFA + CA", "Full Zero Trust"],
    ["Dedicated Support", "Email", "Email + Phone", "Priority 24/7"],
  ];

  return (
    <div>
      <SEO title="Microsoft 365 for Canadian Businesses" description="Microsoft Authorized Partner for M365 deployment: zero-downtime email migration, Teams & SharePoint setup, Intune MDM, and zero-trust security for Canadian businesses." path="/services/microsoft-365" />
      <ServiceSchema name="Microsoft 365 Solutions" description="Microsoft 365 deployment, email migration, Teams, Intune MDM, and enterprise security for Canadian businesses." url="https://nexfortis.com/services/microsoft-365" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://nexfortis.com/" },
        { name: "Services", url: "https://nexfortis.com/services" },
        { name: "Microsoft 365", url: "https://nexfortis.com/services/microsoft-365" },
      ]} />
      <FAQSchema faqs={m365Faqs} />
      <PageHero
        title="Microsoft 365 Solutions"
        subtitle="Empower your workforce with enterprise-grade productivity tools and zero-trust security."
      />

      <Section bg="white">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-primary font-bold text-sm mb-6 border border-border">
              <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
              Microsoft Authorized Partner
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              Work Anywhere. Securely.
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              As an authorized Microsoft partner, NexFortis specializes in migrating, deploying, and managing Microsoft 365 environments for Canadian businesses of every size. Whether you need basic email setup for a five-person team or a complex Intune device management rollout across multiple offices, we bring the expertise and certifications to get it done right.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Every deployment follows Microsoft's best-practice security frameworks, including multi-factor authentication, conditional access policies, and data loss prevention — configured to meet Canadian privacy requirements under PIPEDA. Your data stays protected, your team stays productive, and your IT costs stay predictable.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Cloud, label: "Cloud-First" },
                { icon: Lock, label: "Zero Trust" },
                { icon: Smartphone, label: "Any Device" },
              ].map((badge, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-semibold">
                  <badge.icon className="w-4 h-4" /> {badge.label}
                </span>
              ))}
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex items-start gap-4 p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1">{item.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section bg="secondary">
        <SectionHeader title="Migration Process" subtitle="A battle-tested four-phase approach to moving your organization to Microsoft 365 — without downtime, data loss, or disruption to your daily operations." centered />
        <div className="relative max-w-4xl mx-auto mt-12">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent/20 hidden md:block" aria-hidden="true" />
          <div className="space-y-12">
            {process.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="relative flex gap-6 md:gap-8 items-start"
              >
                <div className="relative z-10 w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section bg="white">
        <SectionHeader title="Choose Your Tier" subtitle="Transparent pricing tiers that grow with your business. Every tier includes zero-downtime migration and post-launch support." centered />
        <div className="overflow-x-auto pb-8 -mx-4 px-4">
          <table className="w-full min-w-[800px] border-collapse" role="table">
            <caption className="sr-only">Microsoft 365 tier comparison — features by plan size</caption>
            <thead>
              <tr className="border-b-2 border-border text-left">
                <th scope="col" className="p-4 font-display font-bold text-xl text-primary">Feature</th>
                {tiers.map((tier, i) => (
                  <th key={i} scope="col" className={`p-4 font-display font-bold text-xl ${i === 2 ? "text-accent" : "text-primary"}`}>
                    {tier}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <th scope="row" className="p-4 font-medium text-foreground text-left">{row[0]}</th>
                  <td className="p-4">
                    {row[1] === "\u2713" ? <Check className="text-green-500 w-5 h-5" aria-label="Included" /> : row[1] === "\u2014" ? <span aria-label="Not available">{"\u2014"}</span> : row[1]}
                  </td>
                  <td className="p-4">
                    {row[2] === "\u2713" ? <Check className="text-green-500 w-5 h-5" aria-label="Included" /> : row[2]}
                  </td>
                  <td className="p-4 font-medium text-accent">
                    {row[3] === "\u2713" ? <Check className="text-green-500 w-5 h-5" aria-label="Included" /> : row[3]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section bg="secondary">
        <SectionHeader
          title="Microsoft 365 FAQ"
          subtitle="Common questions about Microsoft 365 migration, deployment, and ongoing management for Canadian businesses."
          centered
        />
        <div className="max-w-3xl mx-auto border-t border-border">
          {m365Faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </Section>

      <Section bg="primary">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Ready to Modernize Your Workspace?</h2>
          <p className="text-lg text-white/80 mb-10">
            Get a custom Microsoft 365 deployment plan tailored to your team's size and security requirements.
          </p>
          <Link href="/contact" className="inline-flex px-8 py-4 min-h-[48px] rounded-xl bg-warning text-white font-bold text-lg hover:bg-warning/90 transition-all items-center justify-center gap-2 hover:-translate-y-0.5">
            Get Your Microsoft 365 Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
