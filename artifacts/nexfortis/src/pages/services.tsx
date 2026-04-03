import { Section, SectionHeader, PageHero } from "@/components/ui-elements";
import { SEO, BreadcrumbSchema } from "@/components/seo";
import { Monitor, Cloud, Database, Cog, LayoutDashboard, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const services = [
  {
    icon: Monitor,
    title: "Digital Marketing & Web Presence",
    description: "Your online storefront is often the first impression. We build high-converting, mobile-first websites, manage SEO, run Google Ads, and create content that attracts and retains your ideal customers.",
    benefits: ["Custom web design & development", "On-page & technical SEO optimization", "Google Ads & PPC management", "99.9% uptime cloud hosting"],
    href: "/services/digital-marketing",
    badge: "Web & SEO",
    cta: "Get a Free Quote",
  },
  {
    icon: Cloud,
    title: "Microsoft 365 Solutions",
    description: "Empower your team to work from anywhere with enterprise-grade productivity. As a Microsoft Authorized Partner, we handle the complete M365 lifecycle: migration, deployment, Intune MDM, and zero-trust security.",
    benefits: ["Zero-downtime email migration", "Microsoft Teams & SharePoint setup", "Intune mobile device management", "MFA & conditional access security"],
    href: "/services/microsoft-365",
    badge: "Cloud & Productivity",
    cta: "Get a Free Quote",
  },
  {
    icon: Database,
    title: "QuickBooks Migration & Tools",
    description: "Switching platforms or dealing with a corrupted file? Our certified QuickBooks ProAdvisor team offers 100% accuracy-guaranteed data migration from Sage, SAP, Xero, NetSuite, and more — plus powerful custom add-ons.",
    benefits: ["Migration from 10+ accounting platforms", "Error code & file corruption repair", "Custom financial add-on tools", "Money-back guarantee on all services"],
    href: "/services/quickbooks",
    badge: "Accounting & Finance",
    cta: "Get a Free Quote",
  },
  {
    icon: Cog,
    title: "IT Consulting & Project Management",
    description: "Act like you have a CIO without the overhead. We provide strategic IT roadmaps, manage complex technology projects end-to-end, and conduct comprehensive audits to find cost savings and security gaps.",
    benefits: ["Virtual CIO & technology strategy", "End-to-end project management", "IT audit & license optimization", "Cybersecurity posture assessments"],
    href: "/services/it-consulting",
    badge: "Strategy & Advisory",
    cta: "Book a Consultation",
  },
  {
    icon: LayoutDashboard,
    title: "Workflow Automation & Custom Software",
    description: "Stop paying people to copy and paste data. We build custom integrations, Power Automate flows, Zapier workflows, and bespoke web applications that eliminate manual work and connect your entire tech stack.",
    benefits: ["Up to 90% reduction in manual data entry", "Custom API integrations & middleware", "Full-stack web application development", "Real-time multi-system data sync"],
    href: "/services/automation-software",
    badge: "Automation & Dev",
    cta: "Get a Free Quote",
  },
];

export default function ServicesOverview() {
  return (
    <div>
      <SEO
        title="IT Services for Canadian Businesses"
        description="Comprehensive managed IT services for Canadian businesses: digital marketing, Microsoft 365, QuickBooks migration, IT consulting, and workflow automation — all under one roof."
        path="/services"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />
      <PageHero
        title="IT Services for Canadian Businesses"
        subtitle="Five service areas, one expert team. NexFortis handles your entire technology lifecycle so you can focus on growing your business."
      />

      <Section bg="white" className="!py-0">
        <div className="space-y-0">
          {services.map((service, i) => {
            const isEven = i % 2 === 0;
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-20 items-center py-20 lg:py-28 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-display font-bold uppercase tracking-wider mb-5">
                    {service.badge}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-5 leading-tight">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-10">
                    {service.benefits.map((b, j) => (
                      <li key={j} className="flex items-center gap-3 text-foreground font-medium">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg"
                  >
                    {service.cta} <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="flex-1 w-full">
                  <div className="relative bg-secondary rounded-3xl p-14 border border-border shadow-xl flex items-center justify-center aspect-square max-w-sm mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-3xl" aria-hidden="true" />
                    <Icon className="w-28 h-28 text-accent/25 relative z-10" aria-hidden="true" />
                    <div className="absolute top-8 right-8 w-4 h-4 rounded-full bg-accent/30" aria-hidden="true" />
                    <div className="absolute bottom-10 left-10 w-3 h-3 rounded-full bg-accent/20" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section bg="brand-navy">
        <SectionHeader
          title="Not Sure Where to Start?"
          subtitle="Book a free 30-minute consultation and we'll recommend the right services for your business stage and budget."
          centered
          light
        />
        <div className="text-center mt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 min-h-[48px] rounded-xl bg-rose-gold text-rose-gold-foreground font-bold text-lg hover:bg-rose-gold-hover hover:-translate-y-0.5 transition-all shadow-xl shadow-rose-gold/20"
          >
            Book a Consultation <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
