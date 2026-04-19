import { PageHero, Section, SectionHeader, FAQItem, PageBreadcrumbs } from "@/components/ui-elements";
import { SEO, ServiceSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo";
import { Zap, Code2, GitMerge, ArrowRight, CheckCircle2, Workflow, Bot, Layers, MessageCircle, FileCode, FlaskConical, Rocket } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";

const autoFaqs = [
  {
    question: "What types of business processes can be automated?",
    answer: "Almost any repetitive, rule-based process can be automated. Common examples include invoice processing and approval workflows, data entry between systems (e.g. CRM to accounting), employee onboarding task sequences, report generation and distribution, inventory updates across sales channels, email notifications and follow-ups, and document routing for signatures. During our discovery workshop, we map your current workflows and identify the highest-impact automation opportunities based on time savings, error reduction, and ROI.",
  },
  {
    question: "What platforms and tools do you use for workflow automation?",
    answer: "We work with the leading automation platforms including Microsoft Power Automate, Zapier, and Make (formerly Integromat) for no-code and low-code solutions. For more complex requirements, we build custom integrations using Node.js, Python, and Azure Functions with REST and GraphQL APIs. We choose the right tool for each job based on complexity, cost, and your existing technology stack — and we always document the solution so your team understands how it works.",
  },
  {
    question: "How much does a custom automation or software project cost?",
    answer: "Costs vary based on complexity. Simple automation workflows (connecting two or three systems with straightforward logic) typically start around $2,000 to $5,000. Mid-range projects involving custom APIs, data transformation, and multiple system integrations generally range from $5,000 to $20,000. Full-stack custom web applications with user interfaces, databases, and authentication start at $15,000 and up. We provide a detailed proposal with fixed pricing after our discovery workshop, so there are no surprises.",
  },
  {
    question: "Can you build custom web applications for our business?",
    answer: "Yes. Our full-stack development team builds secure, scalable web applications from the ground up — client portals, internal dashboards, inventory management systems, booking platforms, and more. We use modern technologies including React, Node.js, PostgreSQL, and cloud hosting on Azure or AWS. Every application is built with role-based access control, responsive design, and API-first architecture so it integrates cleanly with your existing systems.",
  },
  {
    question: "How do you ensure automated workflows are reliable and don't break?",
    answer: "Reliability is built into our process at every stage. We implement error handling, retry logic, and alerting in every automation so issues are caught and reported immediately. All workflows include logging and monitoring dashboards. Before going live, we run extensive testing with your actual data in a staging environment. After deployment, we offer ongoing monitoring and support plans that include proactive maintenance, version updates, and priority response times if anything needs attention.",
  },
];

export default function AutomationSoftware() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const capabilities = [
    {
      icon: Zap,
      title: "Workflow Automation",
      desc: "Utilize tools like Power Automate, Zapier, and Make to connect your favorite apps and eliminate manual busywork. Automatically trigger emails, update CRMs, sync inventory data, and notify teams without lifting a finger. We design automation workflows that handle the repetitive tasks your team spends hours on — so they can focus on work that actually moves the business forward.",
    },
    {
      icon: GitMerge,
      title: "Custom Integrations",
      desc: "Complex API integrations to sync data between legacy systems and modern cloud platforms. We build custom middleware that transforms, validates, and routes data safely between systems that were never designed to talk to each other — from on-premises databases to SaaS applications like HubSpot, QuickBooks, Shopify, and Microsoft 365.",
    },
    {
      icon: Code2,
      title: "Full-Stack Development",
      desc: "Need a bespoke client portal, internal dashboard, inventory management system, or custom booking platform? Our developers build secure, scalable web applications from the ground up using React, Node.js, PostgreSQL, and modern cloud infrastructure. Every application includes role-based access, responsive design, and API-first architecture.",
    },
  ];

  const useCases = [
    {
      title: "Automated Invoice Processing",
      desc: "PDF invoices arrive via email → AI extracts line items and totals → Data is validated and pushed to QuickBooks → Approval request sent via Microsoft Teams → Payment scheduled automatically. This workflow eliminates hours of manual data entry and reduces errors to near-zero.",
      icon: Bot,
    },
    {
      title: "Custom Client Portal",
      desc: "A secure web portal where your clients can log in, view project status and milestones, download documents and reports, communicate with your team, and pay invoices — all branded to your business. Replaces scattered email chains and shared folders with a single professional interface.",
      icon: Layers,
    },
    {
      title: "Multi-System Data Sync",
      desc: "Ensure your HubSpot CRM, QuickBooks accounting, inventory database, e-commerce platform, and marketing email lists are always perfectly synchronized in real-time. When a deal closes in your CRM, the invoice is created, inventory is updated, and the customer is added to your onboarding email sequence — automatically.",
      icon: Workflow,
    },
  ];

  const processSteps = [
    { step: "01", icon: MessageCircle, title: "Discovery Workshop", desc: "We map your current workflows, identify the highest-value automation opportunities, and define clear scope, KPIs, and success metrics. You leave this session with a prioritized list of opportunities ranked by impact and effort." },
    { step: "02", icon: FileCode, title: "Solution Design", desc: "We produce a detailed technical design — data flow diagrams, integration specs, and a working prototype — so you know exactly what you're getting before we build. This phase includes security review, error handling strategy, and a fixed-price proposal." },
    { step: "03", icon: FlaskConical, title: "Build & Test", desc: "Our developers build the solution in staged sprints with regular demos. Rigorous QA testing with your actual data ensures everything works reliably before production. You review and approve each sprint before we move forward." },
    { step: "04", icon: Rocket, title: "Deploy & Optimize", desc: "We go live with your new automation, configure monitoring and alerting, and continue to optimize based on real usage data. Post-launch support includes documentation, team training, and a response SLA for any issues." },
  ];

  const techStack = [
    "Power Automate", "Zapier", "Make (Integromat)", "Node.js", "Python",
    "React", "PostgreSQL", "REST APIs", "GraphQL", "Azure Functions",
  ];

  return (
    <div>
      <SEO title="Workflow Automation & Custom Software" description="Eliminate manual data entry with Power Automate, Zapier, and custom API integrations. Bespoke web apps and automated workflows for Canadian businesses." path="/services/workflow-automation" />
      <ServiceSchema name="Workflow Automation & Custom Software" description="Custom workflow automation, API integrations, and full-stack web application development for Canadian businesses." url="/services/workflow-automation" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
        { name: "Workflow Automation", url: "/services/workflow-automation" },
      ]} />
      <FAQSchema faqs={autoFaqs} />
      <PageHero 
        title="Workflow Automation & Custom Software" 
        subtitle="Eliminate manual busywork and build bespoke tools that run your business flawlessly."
      />
      <PageBreadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Workflow Automation" },
      ]} />

      <Section bg="brand-light">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-display font-bold mb-6">Custom Solutions</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              Engineered for Efficiency
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Off-the-shelf software doesn't always fit. When your business has unique workflows, legacy systems that need to communicate, or processes that require more than what a spreadsheet can handle — that's where NexFortis shines.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We build the bridges and applications that make your data flow seamlessly between systems, eliminating hours of manual work and the errors that come with it. Whether it's a simple Zapier integration or a full custom web application, we design solutions that save your team real time every single day.
            </p>
            <ul className="space-y-3">
              {["Reduce manual data entry by up to 90%", "Real-time data sync across all systems", "Custom dashboards and reporting", "Scalable architecture that grows with you"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="space-y-8">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <cap.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">{cap.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{cap.desc}</p>
                  </div>
                </div>
                {i < capabilities.length - 1 && <div className="border-b border-border mt-6 ml-16" />}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section bg="brand-light">
        <SectionHeader title="Real-World Use Cases" subtitle="See how automation transforms everyday business operations for Canadian companies across industries." centered />
        <div className="max-w-4xl mx-auto space-y-12 mt-12">
          {useCases.map((uc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex items-start gap-6"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <uc.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">{uc.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{uc.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section bg="white">
        <SectionHeader
          title="How We Deliver Your Automation Project"
          subtitle="A collaborative, low-risk delivery process from initial discovery through to production deployment and ongoing support."
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

      <Section bg="brand-light">
        <SectionHeader title="Our Technology Stack" subtitle="We work with the best tools and platforms to deliver robust, scalable solutions." centered />
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {techStack.map((tech, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="px-5 py-2.5 rounded-full bg-background border border-border text-foreground font-medium text-sm hover:border-accent/50 transition-colors"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </Section>

      <Section bg="white">
        <SectionHeader
          title="Automation & Software FAQ"
          subtitle="Common questions about workflow automation, custom integrations, and software development."
          centered
        />
        <div className="max-w-3xl mx-auto border-t border-border">
          {autoFaqs.map((faq, i) => (
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

      <Section bg="brand-navy">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Ready to Automate?</h2>
          <p className="text-lg text-white/80 mb-10">
            Tell us about your workflow challenges and we'll design a custom solution that saves your team hours every week.
          </p>
          <Link href="/contact" className="inline-flex px-8 py-4 min-h-[48px] rounded-xl bg-rose-gold text-rose-gold-foreground font-bold text-lg hover:bg-rose-gold-hover transition-all items-center justify-center gap-2 hover:-translate-y-0.5">
            Get a Free Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
