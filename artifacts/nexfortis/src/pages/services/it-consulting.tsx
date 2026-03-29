import { PageHero, Section, SectionHeader, FAQItem, PageBreadcrumbs } from "@/components/ui-elements";
import { SEO, ServiceSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo";
import { Map, ListChecks, SearchCheck, ArrowRight, Shield, TrendingUp, Clock, CheckCircle2, MessageCircle, Target, Rocket, BarChart2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";

const consultingFaqs = [
  {
    question: "What is virtual CIO consulting and how does it work?",
    answer: "Virtual CIO consulting gives your business access to senior-level technology strategy without hiring a full-time executive. Our virtual CIO works closely with your leadership team to evaluate your current IT infrastructure, identify cost-saving opportunities, create a technology roadmap aligned with your growth plans, and manage vendor relationships. Engagements are typically ongoing with monthly strategy sessions and quarterly business reviews.",
  },
  {
    question: "How do you conduct a technology audit?",
    answer: "Our technology audit is a comprehensive review of your entire IT environment — hardware, software, network infrastructure, security posture, and licensing. We examine your current spend, identify unused or redundant licenses, flag security vulnerabilities, and assess compliance with Canadian regulations including PIPEDA. The audit concludes with a detailed report and prioritized action plan with clear ROI projections for each recommendation.",
  },
  {
    question: "How much can IT consulting save my business?",
    answer: "On average, our clients report a 40% reduction in IT costs within the first year of engagement, based on client-reported data and internal case studies. Savings come from license optimization (eliminating unused subscriptions), vendor consolidation, security incident prevention, and strategic infrastructure decisions that avoid costly mistakes. We provide detailed ROI projections before any engagement so you can see the expected return on your consulting investment.",
  },
  {
    question: "Do you manage IT projects from start to finish?",
    answer: "Yes. Our certified project managers handle end-to-end execution for IT projects of all sizes — from Microsoft 365 migrations and network upgrades to full digital transformation initiatives. We manage requirements gathering, vendor coordination, milestone tracking, staff training, and post-launch support. Every project follows a structured methodology with clear timelines, budgets, and success metrics defined upfront.",
  },
  {
    question: "Can you help us build an IT strategy if we don't have an internal IT team?",
    answer: "Absolutely — that's one of the most common scenarios we work with. Many Canadian small and mid-sized businesses don't have dedicated IT staff, which is exactly where our virtual CIO and consulting services add the most value. We act as your outsourced IT leadership, handling everything from day-to-day technology decisions to long-term strategic planning, so you can focus on running your business.",
  },
];

export default function ITConsulting() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const services = [
    {
      icon: Map,
      title: "Strategic IT Consultation",
      desc: "We act as your virtual CIO. We evaluate your current systems, understand your long-term business objectives, and create a roadmap for digital transformation. From cloud migration strategy to cybersecurity posture assessments, we ensure your tech stack is an asset, not a liability.",
      highlights: ["Technology roadmap development", "Cloud migration planning", "Vendor evaluation & selection"],
    },
    {
      icon: ListChecks,
      title: "Project Management",
      desc: "Implementing new software or upgrading infrastructure shouldn't disrupt your daily operations. Our certified project managers handle end-to-end execution — requirements gathering, vendor coordination, milestone tracking, and user training.",
      highlights: ["End-to-end execution", "On-time, on-budget delivery", "User training & adoption"],
    },
    {
      icon: SearchCheck,
      title: "Technology Audits",
      desc: "Are you overpaying for unused licenses? Are there glaring security holes in your network? Our comprehensive IT audits review your hardware, software, security, and compliance standing, providing you with a clear, actionable report.",
      highlights: ["License optimization", "Security gap analysis", "Compliance review"],
    },
  ];

  const stats = [
    { icon: Shield, value: "100%", label: "Client satisfaction rate (based on client feedback surveys)" },
    { icon: TrendingUp, value: "40%", label: "Average cost reduction (as reported by clients in year one)" },
    { icon: Clock, value: "24h", label: "Response time SLA" },
  ];

  const processSteps = [
    { step: "01", icon: MessageCircle, title: "Discovery Call", desc: "A free 30-minute session to understand your current technology pain points, business goals, and priorities — no commitment required." },
    { step: "02", icon: Target, title: "Audit & Roadmap", desc: "We conduct a thorough assessment of your systems, security posture, and licensing costs, then deliver a prioritized action plan with clear ROI projections." },
    { step: "03", icon: Rocket, title: "Implementation", desc: "Our project managers execute the roadmap on your timeline — coordinating vendors, training staff, and hitting every milestone on budget." },
    { step: "04", icon: BarChart2, title: "Ongoing Review", desc: "Regular check-ins, performance reviews, and strategy updates ensure your IT investment continues to drive business value as you grow." },
  ];

  return (
    <div>
      <SEO title="IT Consulting & Managed IT Services" description="Virtual CIO services, strategic IT consulting, technology audits, and project management for Canadian businesses. Reduce costs, close security gaps, and modernize your infrastructure." path="/services/it-consulting" />
      <ServiceSchema name="IT Consulting & Project Management" description="Strategic IT consulting, project management, technology audits, and virtual CIO services for Canadian businesses." url="/services/it-consulting" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
        { name: "IT Consulting", url: "/services/it-consulting" },
      ]} />
      <FAQSchema faqs={consultingFaqs} />
      <PageHero 
        title="IT Consulting & Project Management" 
        subtitle="Strategic technology guidance to align your IT infrastructure with your business goals."
      />
      <PageBreadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "IT Consulting" },
      ]} />

      <Section bg="white">
        <div className="flex flex-wrap justify-center items-center gap-0 mb-24">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className={`flex items-center gap-4 px-10 py-4 ${i < stats.length - 1 ? "border-r border-border" : ""} max-sm:border-r-0 max-sm:border-b max-sm:border-border max-sm:w-full max-sm:justify-center max-sm:py-6`}
            >
              <stat.icon className="w-7 h-7 text-accent shrink-0" />
              <div>
                <div className="text-3xl md:text-4xl font-display font-extrabold text-primary leading-none">{stat.value}</div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-20">
          {services.map((svc, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                    <svc.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">{svc.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">{svc.desc}</p>
                  <ul className="space-y-3">
                    {svc.highlights.map((h, j) => (
                      <li key={j} className="flex items-center gap-3 text-foreground font-medium">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <div className="bg-secondary rounded-3xl p-12 border border-border aspect-[4/3] flex items-center justify-center">
                    <svc.icon className="w-24 h-24 text-accent/20" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section bg="secondary">
        <SectionHeader
          title="Our Engagement Process"
          subtitle="A structured approach that delivers measurable results without disrupting your day-to-day business."
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
          title="IT Consulting FAQ"
          subtitle="Common questions about our consulting, virtual CIO, and project management services."
          centered
        />
        <div className="max-w-3xl mx-auto border-t border-border">
          {consultingFaqs.map((faq, i) => (
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
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Let's Build Your IT Strategy</h2>
          <p className="text-lg text-white/80 mb-10">
            Book a free 30-minute consultation to discuss your technology challenges and goals.
          </p>
          <Link href="/contact" className="inline-flex px-8 py-4 min-h-[48px] rounded-xl bg-warning text-white font-bold text-lg hover:bg-warning/90 transition-all items-center justify-center gap-2 hover:-translate-y-0.5">
            Book a Consultation <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
