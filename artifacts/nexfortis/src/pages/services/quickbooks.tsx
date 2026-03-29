import { PageHero, Section, SectionHeader, FAQItem } from "@/components/ui-elements";
import { SEO, ServiceSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo";
import { ArrowRight, Database, Wrench, ShieldAlert, CheckCircle2, DollarSign, ClipboardList, Zap, FileCheck, Headphones } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";

const qbFaqs = [
  {
    question: "What accounting platforms can you migrate data from into QuickBooks?",
    answer: "We migrate data from virtually every major accounting platform including Sage 50, Sage 100, SAP Business One, Xero, FreshBooks, Wave, MYOB, NetSuite, and Peachtree. We also handle migrations between QuickBooks versions — Desktop to Online, Enterprise to Pro/Premier, and vice versa. Each migration includes a full data audit, field mapping, test migration, and line-by-line reconciliation to guarantee 100% accuracy.",
  },
  {
    question: "How does your money-back guarantee work?",
    answer: "If the migrated data does not match your source data with 100% accuracy after our verification process, we will either re-do the migration at no additional cost or provide a full refund — your choice. This guarantee covers all data migration and recovery services. We have maintained a 100% satisfaction rate because we run comprehensive reconciliation checks before delivering your completed file.",
  },
  {
    question: "How long does a QuickBooks data migration take?",
    answer: "Standard migrations are completed within one business day. If you need your data sooner, we offer same-day expedited service for an additional fee. The timeline depends on the volume and complexity of your data — a simple migration with a few years of transactions can be done in hours, while larger datasets with complex inventory or custom fields may take a full day. We provide an accurate estimate after reviewing your source file.",
  },
  {
    question: "Can you recover a corrupted QuickBooks file?",
    answer: "Yes. Our data recovery services cover a wide range of QuickBooks file issues including TLG file recovery, company file corruption, verify and rebuild errors, network data file problems, and password recovery. We use specialized tools and techniques developed over years of working with QuickBooks file structures. If we cannot recover your data, you pay nothing — that is part of our money-back guarantee.",
  },
  {
    question: "What are your QuickBooks add-on tools and how do they work?",
    answer: "Our add-on tools extend QuickBooks functionality in areas where the native software falls short. Examples include our A/R Statements Pro for customized accounts receivable statements, Donor Statements for nonprofit organizations, Direct Debit and Direct Deposit file creators for Canadian payment processing, and IIF Transaction Creator for bulk data imports. Each tool is a one-time purchase, works alongside your existing QuickBooks installation, and includes free updates and email support.",
  },
];

export default function QuickBooks() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const services = [
    {
      icon: Database,
      title: "Data Migration",
      desc: "Migrate from NetSuite, Sage 50, SAP, Xero, and more. 100% accuracy guaranteed.",
      items: ["Standard (1 day): $299", "Expedited (Same day): $450"],
    },
    {
      icon: ShieldAlert,
      title: "Data Recovery",
      desc: "Error code repair, file corruption fixes, and password recovery with a money-back guarantee.",
      items: ["TLG Recovery", "Mac Data Recovery"],
    },
    {
      icon: Wrench,
      title: "Data Services",
      desc: "Optimize your company files for performance or audit preparation.",
      items: ["Enterprise to Pro/Premier Conversion (from $249)", "Super Condensing & List Reduction"],
    },
  ];

  const products = [
    { cat: "Financial Statements", items: [{ name: "A/R Statements Pro", price: "$79" }, { name: "List Reporter", price: "$59" }] },
    { cat: "Nonprofit/Donor", items: [{ name: "Donor Statements (Desktop)", price: "$99" }, { name: "Donor Statements (Online)", price: "$99" }, { name: "Desktop+Email Bundle", price: "$158" }] },
    { cat: "Payment Processing", items: [{ name: "Direct Debit File Creator", price: "$119" }, { name: "Direct Deposit File Creator", price: "$119" }, { name: "PayPal Link", price: "$99" }, { name: "PositivePay", price: "$119" }] },
    { cat: "Data Import", items: [{ name: "IIF Transaction Creator", price: "$139" }, { name: "Transaction Copier", price: "$119" }, { name: "Excel to QIF", price: "$69" }, { name: "OFX Cleaner", price: "$79" }] },
  ];

  const processSteps = [
    { step: "01", icon: ClipboardList, title: "Assessment & Scoping", desc: "We review your existing data source, file structure, chart of accounts, and transaction volume to produce a detailed migration plan and accurate turnaround estimate. We identify any custom fields, memorized transactions, or third-party integrations that require special handling." },
    { step: "02", icon: Zap, title: "Secure Data Transfer", desc: "Your files are transferred to our secure environment using encrypted channels. We never store or share your financial data beyond the scope of the engagement, and all files are permanently deleted from our systems within 30 days of project completion." },
    { step: "03", icon: FileCheck, title: "Migration & Verification", desc: "Our ProAdvisors perform the migration and run a full line-by-line reconciliation — comparing trial balances, account totals, and individual transaction details to confirm 100% data accuracy before delivery." },
    { step: "04", icon: Headphones, title: "Delivery & Support", desc: "Your completed file is delivered on schedule with a walkthrough of the migrated data. We include a post-delivery support window to answer questions, help with bank feed setup, and resolve any edge cases your team encounters." },
  ];

  return (
    <div>
      <SEO title="QuickBooks Migration, Recovery & Add-On Tools" description="Certified QuickBooks ProAdvisor team offering 100% accuracy-guaranteed data migration from Sage, SAP, Xero, and more. File recovery, custom add-ons, and same-day service available." path="/services/quickbooks" />
      <ServiceSchema name="QuickBooks Migration & Tools" description="QuickBooks data migration, file recovery, and custom add-on tools for Canadian businesses. Certified ProAdvisor team." url="https://nexfortis.com/services/quickbooks" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://nexfortis.com/" },
        { name: "Services", url: "https://nexfortis.com/services" },
        { name: "QuickBooks Solutions", url: "https://nexfortis.com/services/quickbooks" },
      ]} />
      <FAQSchema faqs={qbFaqs} />
      <PageHero 
        title="QuickBooks Migration & Tools" 
        subtitle="Expert data migration, recovery services, and powerful add-on tools to supercharge your accounting."
      />

      <Section bg="white">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold mb-6">QuickBooks ProAdvisor</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              Your Accounting Data, Safe and Sound
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Whether you're switching platforms, recovering corrupted files, or need specialized tools, our QuickBooks experts have handled thousands of migrations with a 100% accuracy guarantee. We support QuickBooks Desktop, Online, and Enterprise across all Canadian editions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              As certified QuickBooks ProAdvisors, we understand the nuances of Canadian tax reporting, GST/HST handling, payroll compliance, and multi-currency transactions. Our migration process preserves every detail — from memorized transactions and custom reports to vendor terms and payment methods — so your accounting team can pick up exactly where they left off.
            </p>
            <ul className="space-y-3">
              {["Money-back guarantee on all services", "Same-day expedited processing available", "Support for Desktop, Online, and Enterprise", "Certified QuickBooks ProAdvisor team"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <div className="space-y-6">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <svc.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">{svc.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{svc.desc}</p>
                    <ul className="text-sm font-medium text-foreground space-y-1">
                      {svc.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {i < services.length - 1 && <div className="border-b border-border mt-6" />}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section bg="secondary">
        <SectionHeader
          title="How Our Migration Process Works"
          subtitle="A transparent, step-by-step process that gets your data into QuickBooks accurately and on time — backed by our 100% accuracy guarantee."
          centered
        />
        <div className="relative max-w-4xl mx-auto mt-12">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent/20 hidden md:block" aria-hidden="true" />
          <div className="space-y-12">
            {processSteps.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="relative flex gap-6 md:gap-8 items-start"
                >
                  <div className="relative z-10 w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="pt-1">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Step {item.step}</span>
                    <h3 className="text-xl font-bold text-primary mt-1 mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section bg="white">
        <SectionHeader 
          title="QuickBooks Add-On Catalog" 
          subtitle="Powerful tools to extend the functionality of your QuickBooks software — one-time purchase, no subscriptions."
          centered 
        />
        
        <div className="grid lg:grid-cols-2 gap-12 mt-12">
          {products.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-accent" />
                {category.cat}
              </h3>
              <div className="space-y-3">
                {category.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:shadow-md hover:border-accent/30 transition-all">
                    <div>
                      <h4 className="font-bold text-foreground">{item.name}</h4>
                      <p className="text-accent font-semibold">{item.price}</p>
                    </div>
                    <Link href="/contact" className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary hover:bg-accent hover:text-white transition-colors text-sm font-bold">
                      Buy Now
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section bg="secondary">
        <SectionHeader
          title="QuickBooks FAQ"
          subtitle="Common questions about QuickBooks migration, data recovery, and our add-on tools."
          centered
        />
        <div className="max-w-3xl mx-auto border-t border-border">
          {qbFaqs.map((faq, i) => (
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
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Need Help with QuickBooks?</h2>
          <p className="text-lg text-white/80 mb-10">
            Get a free consultation on your migration, recovery, or custom tool needs.
          </p>
          <Link href="/contact" className="inline-flex px-8 py-4 min-h-[48px] rounded-xl bg-warning text-white font-bold text-lg hover:bg-warning/90 transition-all items-center justify-center gap-2 hover:-translate-y-0.5">
            Get a Free Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
