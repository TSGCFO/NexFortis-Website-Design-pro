import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ShieldCheck, Monitor, Cloud, Database, Cog, LayoutDashboard,
  ArrowRight, CheckCircle2, Users, Award, Clock, Globe,
  TrendingUp, Zap, Building2, Briefcase, ShoppingCart,
  Factory, Landmark, GraduationCap, Quote
} from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { Section, SectionHeader, FAQItem } from "@/components/ui-elements";
import { SEO, OrganizationSchema, LocalBusinessSchema, WebSiteSchema, FAQSchema } from "@/components/seo";

const HeroCanvas = lazy(() => import("@/components/hero-canvas"));

const services = [
  {
    icon: Monitor,
    title: "Digital Marketing & Web Presence",
    description: "Custom websites, SEO, Google Ads, and content creation that convert visitors into loyal customers. We handle your entire digital storefront.",
    benefits: ["Mobile-first responsive design", "Monthly SEO reporting", "Dedicated account manager"],
    href: "/services/digital-marketing",
    badge: "Web & SEO",
    cta: "Get a Free Quote",
  },
  {
    icon: Cloud,
    title: "Microsoft 365 Solutions",
    description: "Enterprise-grade email, Teams, SharePoint, and zero-trust security deployment — with zero-downtime migration and 30-day post-launch support.",
    benefits: ["Microsoft Authorized Partner", "Zero-downtime migration", "Intune device management"],
    href: "/services/microsoft-365",
    badge: "Cloud & Productivity",
    cta: "Get a Free Quote",
  },
  {
    icon: Database,
    title: "QuickBooks Migration & Tools",
    description: "100% accuracy-guaranteed data migration from Sage, SAP, Xero, and more. Plus custom add-on tools to extend your QuickBooks capabilities.",
    benefits: ["Money-back guarantee", "Same-day expedited service", "Certified ProAdvisor team"],
    href: "/services/quickbooks",
    badge: "Accounting & Finance",
    cta: "Get a Free Quote",
  },
  {
    icon: Cog,
    title: "IT Consulting & Strategy",
    description: "Virtual CIO services, technology audits, and project management to align your IT infrastructure with your business growth goals.",
    benefits: ["Technology roadmap planning", "License cost optimization", "Security gap analysis"],
    href: "/services/it-consulting",
    badge: "Strategy & Advisory",
    cta: "Book a Consultation",
  },
  {
    icon: LayoutDashboard,
    title: "Workflow Automation & Custom Software",
    description: "Eliminate manual data entry with Power Automate, Zapier, custom APIs, and bespoke web applications built for your exact process.",
    benefits: ["Reduce manual work by up to 90%", "Real-time multi-system sync", "Custom dashboards & reporting"],
    href: "/services/automation-software",
    badge: "Automation & Dev",
    cta: "Get a Free Quote",
  },
];

const stats = [
  { icon: Users, value: "500+", label: "Businesses Served" },
  { icon: Award, value: "10+", label: "Years of Experience" },
  { icon: Clock, value: "24h", label: "Response Time SLA" },
  { icon: Globe, value: "CA", label: "Canadian-Based Team" },
];

const whyUs = [
  { title: "End-to-End IT Under One Roof", desc: "From marketing websites to cloud infrastructure — no juggling multiple vendors. NexFortis is your single point of contact for every technology need." },
  { title: "Microsoft Authorized Partner", desc: "Certified expertise in the Microsoft ecosystem including Microsoft 365, Azure, and Intune MDM for businesses of every size." },
  { title: "Scalable Solutions for Every Budget", desc: "Whether you're a five-person shop or a 200-seat enterprise, our solutions grow with you. We tailor recommendations to your stage and budget." },
  { title: "Canadian-Based, Privacy-First Support", desc: "Our team is local, our data handling complies with Canadian privacy standards (PIPEDA), and our response times reflect a business you can depend on." },
];

const processSteps = [
  { step: "01", icon: TrendingUp, title: "Discovery & Audit", desc: "We assess your current systems, goals, and gaps to build a strategy tailored to your business." },
  { step: "02", icon: Zap, title: "Planning & Design", desc: "A detailed project plan with milestones, timelines, and clearly defined success metrics." },
  { step: "03", icon: Cog, title: "Implementation", desc: "Our specialists execute the plan with minimal disruption to your daily operations." },
  { step: "04", icon: CheckCircle2, title: "Support & Optimization", desc: "Post-launch monitoring, training, and ongoing optimization so your investment keeps growing." },
];

const homeFaqs = [
  {
    question: "What does a managed IT provider do?",
    answer: "A managed IT provider like NexFortis handles all of your technology needs — from setting up and maintaining cloud infrastructure, managing cybersecurity, and providing helpdesk support, to planning long-term IT strategy. Instead of hiring a full in-house IT team, you get access to a complete team of specialists for a predictable monthly cost. We proactively monitor your systems, apply patches, manage backups, and ensure your business stays secure and productive.",
  },
  {
    question: "How much does Microsoft 365 migration cost for a small business?",
    answer: "The cost of Microsoft 365 migration depends on the number of users, the complexity of your existing email and file setup, and how much data needs to be transferred. At NexFortis, we offer transparent, flat-rate migration pricing with no hidden fees. Most small businesses (under 50 users) can expect a one-time migration fee plus the ongoing Microsoft 365 subscription. We include zero-downtime migration, data verification, and 30 days of post-migration support as standard.",
  },
  {
    question: "Do you work with small businesses or only large enterprises?",
    answer: "We work with businesses of every size — from five-person startups to 200+ seat enterprises. Our solutions are designed to scale with you. Whether you need a simple Microsoft 365 setup, a full QuickBooks migration, or a comprehensive managed IT plan, we tailor our recommendations to your current stage and budget. Many of our longest-running clients started as small businesses and grew with us.",
  },
  {
    question: "What is a virtual CIO and do I need one?",
    answer: "A virtual CIO (Chief Information Officer) provides the strategic technology leadership of a C-level executive without the full-time salary. If your business relies on technology but doesn't have a dedicated IT strategist, a virtual CIO from NexFortis can help you create a technology roadmap, evaluate vendors, optimize licensing costs, and ensure your IT investments align with your business goals. It's ideal for growing businesses that need expert guidance without the overhead.",
  },
  {
    question: "How do you handle data security and Canadian privacy compliance?",
    answer: "Data security and privacy are at the core of everything we do. As a Canadian-based IT provider, we ensure all our solutions comply with PIPEDA (Personal Information Protection and Electronic Documents Act) and provincial privacy regulations. We implement multi-layered security including endpoint protection, encrypted backups, multi-factor authentication, and regular security audits. Your data stays in Canada unless you explicitly choose otherwise.",
  },
  {
    question: "Can you help migrate our accounting data to QuickBooks?",
    answer: "Absolutely. We are certified QuickBooks ProAdvisors specializing in data migration from Sage, SAP, Xero, FreshBooks, and other accounting platforms. Our migration process includes a full data audit, field mapping, test migration, and validation to ensure 100% accuracy — backed by our money-back guarantee. We also offer same-day expedited migration for businesses that need to move quickly.",
  },
];

const industries = [
  { icon: Building2, name: "Healthcare & Clinics", desc: "PIPEDA-compliant infrastructure, EHR integrations, and secure patient data management for medical and dental practices across Canada." },
  { icon: Briefcase, name: "Legal & Professional Services", desc: "Document management, Microsoft 365 deployments, and secure client portals for law firms, accounting practices, and consulting firms." },
  { icon: ShoppingCart, name: "Retail & E-commerce", desc: "Inventory system integrations, POS connectivity, e-commerce platform management, and multi-channel data synchronization." },
  { icon: Factory, name: "Manufacturing & Logistics", desc: "ERP integrations, warehouse management automation, supply chain visibility tools, and real-time production reporting dashboards." },
  { icon: Landmark, name: "Finance & Accounting", desc: "QuickBooks migrations, financial reporting automation, audit preparation tools, and compliance-ready IT infrastructure." },
  { icon: GraduationCap, name: "Non-Profit & Education", desc: "Donor management systems, grant tracking, Microsoft 365 for Education deployments, and budget-conscious IT strategies." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full">
      <SEO
        title="NexFortis IT Solutions"
        description="NexFortis delivers end-to-end IT solutions for Canadian businesses — managed IT, Microsoft 365, QuickBooks migration, digital marketing, and workflow automation. Get a free consultation today."
        path="/"
      />
      <OrganizationSchema />
      <LocalBusinessSchema />
      <WebSiteSchema />
      <FAQSchema faqs={homeFaqs} />

      <section className="relative min-h-[70vh] flex items-center justify-center section-brand-navy overflow-hidden pt-24 pb-8">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--nf-navy)]/40 via-[var(--nf-navy)]/70 to-[var(--nf-navy)]" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-32 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-[500px] h-[500px] bg-rose-gold/8 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-white text-sm font-display font-medium mb-8">
                <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
                Canada's Trusted Managed IT Partner
              </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-white leading-[1.05] mb-4">
              Complexity Decoded.{" "}
              <span className="text-rose-gold">Advantage.</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/50 font-display font-semibold mb-8">
              Your Business. Our Technology. Limitless Growth.
            </p>

              <p className="text-xl md:text-2xl text-white/75 mb-12 max-w-3xl leading-relaxed">
                From managed IT and Microsoft 365 to QuickBooks migration and digital marketing — NexFortis is the all-in-one IT partner Canadian businesses trust to scale securely.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-10 py-4 min-h-[52px] rounded-xl bg-rose-gold text-rose-gold-foreground font-bold text-lg hover:bg-rose-gold-hover hover:-translate-y-1 transition-all shadow-xl shadow-rose-gold/25 flex items-center justify-center gap-2"
                >
                  Get a Free Quote <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/services"
                  className="w-full sm:w-auto px-10 py-4 min-h-[52px] rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center"
                >
                  Explore Our Services
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="hidden lg:flex flex-shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <div className="relative w-80 h-80 xl:w-96 xl:h-96">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/15 shadow-2xl" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-accent/20 via-transparent to-white/10" />
                <img
                  src={`${import.meta.env.BASE_URL}images/logo-white.svg`}
                  alt=""
                  className="absolute inset-8 w-auto h-auto object-contain drop-shadow-[0_0_50px_rgba(15,146,227,0.4)]"
                  style={{
                    filter: "brightness(1.15) drop-shadow(0 8px 30px rgba(0,0,0,0.3))",
                  }}
                />
                <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-accent/15 via-transparent to-rose-gold/10 blur-2xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" aria-hidden="true" />
      </section>

      <section className="py-14 section-brand-navy border-b border-white/5" aria-label="Key statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-0">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className={`flex items-center gap-4 px-10 py-5 ${i < stats.length - 1 ? "border-r border-white/15" : ""} max-sm:border-r-0 max-sm:border-b max-sm:border-white/10 max-sm:w-1/2 max-sm:justify-center max-sm:py-5`}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center" aria-hidden="true">
                  <stat.icon className="w-6 h-6 text-accent shrink-0" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-extrabold text-white leading-none">{stat.value}</div>
                  <p className="text-white/50 text-sm font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-12 section-brand-light border-b border-border/30"
        aria-label="Certified Partnerships"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-center text-sm tracking-widest mb-8"
            style={{ fontFamily: "'Alegreya Sans SC', sans-serif", fontVariant: "small-caps", color: "#A0A1A3" }}
          >
            Certified Technology Partner
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            <div className="p-6">
              <img
                src={`${import.meta.env.BASE_URL}images/badge-microsoft-partner.png`}
                alt="Microsoft AI Cloud Partner Program badge"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="p-6">
              <img
                src={`${import.meta.env.BASE_URL}images/badge-google-partner.png`}
                alt="Google Partner badge"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="p-6">
              <img
                src={`${import.meta.env.BASE_URL}images/badge-quickbooks-proadvisor.png`}
                alt="QuickBooks ProAdvisor badge"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <Section bg="brand-light">
        <SectionHeader
          title="Comprehensive IT Solutions for Canadian Businesses"
          subtitle="Five specialized service areas, delivered by one expert team. No vendor juggling, no knowledge gaps — just results."
          centered
        />

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
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center py-16 lg:py-24 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div className="flex-1 max-w-xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-display font-bold uppercase tracking-wider mb-5">
                    {service.badge}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-5 leading-tight">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
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

                <div className="flex-1 w-full max-w-lg">
                  <div className="relative bg-card rounded-3xl p-12 border border-border shadow-xl flex items-center justify-center aspect-square max-w-sm mx-auto lg:mx-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-3xl" aria-hidden="true" />
                    <Icon className="w-32 h-32 text-accent/25 relative z-10" aria-hidden="true" />
                    <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-accent/40" aria-hidden="true" />
                    <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-accent/30" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section bg="brand-navy">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              title="Why Canadian Businesses Choose NexFortis"
              subtitle="We don't just fix computers — we engineer business growth through smart, strategic technology adoption."
              light
            />

            <div className="space-y-6 mt-8">
              {whyUs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.3, ease: "easeOut" }}
                  className="flex gap-4"
                >
                  <div className="mt-1 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{item.title}</h3>
                    <p className="text-white/65 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-accent/15 rounded-3xl transform translate-x-4 translate-y-4" aria-hidden="true"></div>
            <picture>
              <source srcSet={`${import.meta.env.BASE_URL}images/about-team.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}images/about-team.png`}
                alt="NexFortis IT team collaborating on client project"
                className="relative z-10 rounded-3xl shadow-2xl object-cover aspect-[4/3]"
                loading="lazy"
                width={600}
                height={450}
              />
            </picture>
          </div>
        </div>
      </Section>

      <Section bg="brand-light">
        <SectionHeader
          title="How We Deliver Results"
          subtitle="A clear, repeatable process that keeps projects on time, on budget, and fully aligned with your goals."
          centered
        />
        <div className="relative max-w-4xl mx-auto mt-4">
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
        <SectionHeader
          title="Industries We Serve"
          subtitle="NexFortis provides managed IT services, cloud solutions, and digital transformation support to businesses across Canada's most dynamic sectors."
          centered
        />
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground text-lg leading-relaxed mb-10">
            Whether you run a busy medical clinic that needs PIPEDA-compliant infrastructure, a law firm migrating to Microsoft 365, or a retail operation scaling its e-commerce platform — our team has the domain expertise to deliver solutions that fit your industry's unique regulatory, security, and operational requirements.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="flex items-start gap-4"
                >
                  <Icon className="w-5 h-5 text-accent shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <span className="text-foreground font-bold text-lg block mb-1">{ind.name}</span>
                    <p className="text-muted-foreground text-sm leading-relaxed">{ind.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Contact Us <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      <Section bg="brand-navy">
        <SectionHeader
          title="What Our Clients Say"
          subtitle="Trusted by Canadian businesses to deliver reliable, results-driven IT solutions."
          centered
          light
        />
        <div className="text-center mb-12">
          <p className="text-lg font-semibold text-accent">Trusted by 500+ Canadian Businesses</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              quote: "NexFortis migrated our entire team to Microsoft 365 without a single hour of downtime. Their project management was flawless, and the post-migration support gave us complete confidence in the transition. I'd recommend them to any business looking to modernize their IT.",
              name: "Sarah Chen",
              title: "Operations Director",
              company: "Maple Ridge Dental Group",
            },
            {
              quote: "We were drowning in manual data entry before NexFortis built our custom automation workflows. They reduced our invoice processing time by over 80% and integrated everything with QuickBooks. The ROI paid for itself in the first quarter.",
              name: "David Okafor",
              title: "CFO",
              company: "Prism Logistics Inc.",
            },
            {
              quote: "As a growing law firm, we needed an IT partner who understood compliance and data security. NexFortis delivered a comprehensive technology audit, optimized our licensing costs, and built a roadmap that's kept us ahead of the curve for two years running.",
              name: "Michelle Tremblay",
              title: "Managing Partner",
              company: "Tremblay & Associates LLP",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col"
            >
              <Quote className="w-8 h-8 text-accent/40 mb-4 shrink-0" aria-hidden="true" />
              <p className="text-white/75 leading-relaxed mb-6 flex-grow italic">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-white/10 pt-4">
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/50">{testimonial.title}, {testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section bg="brand-light">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Answers to the most common questions Canadian businesses ask about managed IT services, Microsoft 365, and QuickBooks migration."
          centered
        />
        <div className="max-w-3xl mx-auto border-t border-border">
          {homeFaqs.map((faq, i) => (
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

      <section className="py-24 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" aria-hidden="true"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to Modernize Your Business IT?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Schedule a free 30-minute consultation. No commitment — just an honest conversation about your technology goals and how NexFortis can help you achieve them.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-4 min-h-[48px] rounded-xl bg-rose-gold text-rose-gold-foreground font-bold text-lg hover:bg-rose-gold-hover hover:scale-105 transition-all shadow-xl shadow-rose-gold/20 items-center justify-center gap-2"
          >
            Book a Consultation <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
