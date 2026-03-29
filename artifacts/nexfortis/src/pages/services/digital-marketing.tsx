import { PageHero, Section, SectionHeader, FAQItem, PageBreadcrumbs } from "@/components/ui-elements";
import { SEO, ServiceSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo";
import { Globe, Server, Search, PenTool, BarChart, Settings, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";

const dmFaqs = [
  {
    question: "How long does it take to build a custom business website?",
    answer: "Most custom business websites are completed within four to six weeks from kickoff to launch. This includes discovery, wireframing, design, development, content integration, and testing. Simpler sites (five to ten pages) can be ready in as little as three weeks, while larger sites with e-commerce, client portals, or complex integrations may take eight to twelve weeks. We provide a clear timeline during our discovery phase so you know exactly what to expect.",
  },
  {
    question: "Do you offer ongoing SEO services or just one-time optimization?",
    answer: "We offer both. Every website we build includes foundational on-page SEO — optimized title tags, meta descriptions, header structure, image alt text, schema markup, and site speed optimization. For businesses that want to actively grow their organic traffic, we offer monthly SEO retainers that include keyword research, content planning, link building, technical audits, and monthly performance reporting. Most of our clients see measurable ranking improvements within three to six months of ongoing SEO work.",
  },
  {
    question: "Can you manage our Google Ads campaigns?",
    answer: "Yes. We create and manage data-driven Google Ads campaigns including search ads, display ads, and remarketing. Our approach starts with keyword research and competitor analysis, followed by ad copy creation, landing page optimization, and ongoing bid management. We provide transparent monthly reporting showing impressions, clicks, conversions, and cost per acquisition so you always know your return on ad spend.",
  },
  {
    question: "Do you provide website hosting and maintenance?",
    answer: "We provide secure, high-performance cloud hosting with a 99.9% uptime SLA, daily automated backups, SSL certificates, and CDN distribution for fast loading times across Canada. Our maintenance plans include regular security patches, plugin and framework updates, performance monitoring, and content updates. You never have to worry about your site going down or falling behind on security updates.",
  },
  {
    question: "Will my website work well on mobile devices?",
    answer: "Every website we build follows a mobile-first responsive design approach, meaning the mobile experience is designed first and then enhanced for larger screens. This ensures your site looks and performs well on smartphones, tablets, laptops, and desktops. We test across multiple devices and browsers before launch, and Google now uses mobile-first indexing, so a strong mobile experience directly impacts your search rankings.",
  },
];

export default function DigitalMarketing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const offerings = [
    { icon: Globe, title: "Web Design & Development", desc: "Modern, responsive, and high-converting websites built on the latest frameworks. We design for your audience, optimize for search engines, and build for performance — every site includes mobile-first responsive layouts, accessibility compliance, and analytics integration." },
    { icon: Server, title: "Hosting & Domain Management", desc: "Secure, fast, and reliable cloud hosting with 99.9% uptime SLA, automated daily backups, and complete domain administration. We handle SSL certificates, DNS configuration, CDN distribution, and server monitoring so you never have to think about infrastructure." },
    { icon: Search, title: "SEO Optimization", desc: "Comprehensive on-page and technical SEO to improve your visibility on Google and other search engines. We cover keyword research, content optimization, meta tags, schema markup, site speed, mobile usability, and monthly ranking reports — targeted at the Canadian search market." },
    { icon: BarChart, title: "Google Ads Management", desc: "Data-driven PPC campaigns designed to maximize your ROI. We handle keyword bidding, ad copy, landing page optimization, A/B testing, and conversion tracking. Monthly reports show exactly where your budget goes and what results it delivers." },
    { icon: PenTool, title: "Content Creation", desc: "Engaging copy, blog articles, and visual assets that resonate with your target audience and support your SEO strategy. Our content team produces industry-relevant articles, case studies, social media posts, and email newsletters that build authority and drive organic traffic." },
    { icon: Settings, title: "Website Maintenance", desc: "Ongoing updates, security patches, plugin upgrades, and performance optimization. Our maintenance plans ensure your website stays fast, secure, and up-to-date without requiring any technical knowledge from your team." },
  ];

  const process = [
    { step: "01", title: "Discovery & Strategy", desc: "We analyze your brand, target audience, competitors, and business goals to build a comprehensive digital strategy. This includes keyword research, content planning, and a clear roadmap for your online presence." },
    { step: "02", title: "Design & Build", desc: "Our team designs and develops your digital presence with performance, conversion, and SEO built in from the ground up. You review and approve designs before development begins, and we provide regular progress updates throughout the build." },
    { step: "03", title: "Launch & Optimize", desc: "We go live with thorough pre-launch testing, configure analytics and tracking, submit your site to search engines, and begin monitoring performance. Initial optimizations are made based on real user data within the first two weeks." },
    { step: "04", title: "Grow & Scale", desc: "Ongoing campaigns, content creation, technical SEO, and performance optimization to drive sustainable traffic growth. Monthly reporting keeps you informed of rankings, traffic trends, and conversion metrics." },
  ];

  return (
    <div>
      <SEO title="Digital Marketing & Web Design" description="Full-service digital marketing for Canadian businesses: custom web design, SEO optimization, Google Ads management, and content creation. Drive traffic and convert visitors." path="/services/digital-marketing" />
      <ServiceSchema name="Digital Marketing & Web Presence" description="Full-service digital marketing including web design, hosting, SEO, Google Ads, and content creation for Canadian businesses." url="/services/digital-marketing" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
        { name: "Digital Marketing", url: "/services/digital-marketing" },
      ]} />
      <FAQSchema faqs={dmFaqs} />
      <PageHero 
        title="Digital Marketing & Web Presence" 
        subtitle="Your digital storefront matters. We build, host, and optimize your online presence to attract and convert."
      />
      <PageBreadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Digital Marketing" },
      ]} />

      <Section bg="white">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold mb-6">Full-Service Digital Agency</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
                Your Complete Online Identity, Handled
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                From the first pixel to the final conversion, we handle every aspect of your online identity. No more juggling five different vendors — NexFortis delivers web design, hosting, SEO, ads, and content under one roof.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Our digital marketing team understands the Canadian market. We know how to target local search intent, structure content for Canadian audiences, and optimize campaigns for the regions and industries that matter to your business. Whether you serve customers in the GTA, across Ontario, or nationwide, we build a digital strategy that reaches them where they are searching.
              </p>
              <ul className="space-y-3">
                {["Mobile-first responsive design", "99.9% uptime SLA on hosting", "Monthly SEO & analytics reporting", "Dedicated account manager"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div className="space-y-4">
            {offerings.slice(0, 4).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex items-start gap-4 py-3"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc.split('.')[0]}.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section bg="secondary">
        <SectionHeader 
          title="Comprehensive Digital Solutions" 
          subtitle="Everything you need to establish, grow, and dominate your online presence — from design and development through to ongoing content and optimization."
          centered
        />
        
        <div className="max-w-4xl mx-auto space-y-12 mt-12">
          {offerings.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-start gap-6"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section bg="white">
        <SectionHeader title="Our Process" subtitle="A proven four-step approach to transforming your digital presence — from strategy through to ongoing growth." centered />
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

      <Section bg="secondary">
        <SectionHeader
          title="Digital Marketing FAQ"
          subtitle="Common questions about web design, SEO, Google Ads, and digital marketing services for Canadian businesses."
          centered
        />
        <div className="max-w-3xl mx-auto border-t border-border">
          {dmFaqs.map((faq, i) => (
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
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Ready to Grow Your Online Presence?</h2>
          <p className="text-lg text-white/80 mb-10">
            Let's discuss how we can build a digital strategy that drives real results for your business.
          </p>
          <Link href="/contact" className="inline-flex px-8 py-4 min-h-[48px] rounded-xl bg-warning text-white font-bold text-lg hover:bg-warning/90 transition-all items-center justify-center gap-2 hover:-translate-y-0.5">
            Get a Free Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
