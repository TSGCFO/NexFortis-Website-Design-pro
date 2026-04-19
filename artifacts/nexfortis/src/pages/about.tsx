import { PageHero, Section, SectionHeader, PageBreadcrumbs } from "@/components/ui-elements";
import { SEO, BreadcrumbSchema } from "@/components/seo";
import { Target, Lightbulb, Users, Minimize2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function About() {
  const values = [
    { icon: Target, title: "Integrity", desc: "Honest advice and transparent pricing — always. We recommend what your business actually needs, explain the trade-offs clearly, and never upsell services that won't deliver real value. Our proposals include detailed scope and fixed pricing so there are no surprises." },
    { icon: Lightbulb, title: "Innovation", desc: "Technology moves fast, and so do we. Our team continuously evaluates emerging tools, platforms, and security frameworks to ensure our clients benefit from the most effective solutions available — not last year's best practices." },
    { icon: Users, title: "Client-First", desc: "Your success is our success. Every project starts with your business goals — not our service catalog. We listen, we ask questions, and we build solutions that move the needle on the metrics that matter to your organization." },
    { icon: Minimize2, title: "Simplicity", desc: "Complex technology should feel effortless to use. We design systems and workflows that your team can adopt quickly and manage confidently. Clear documentation, hands-on training, and responsive support ensure nothing gets lost in translation." },
  ];

  return (
    <div>
      <SEO title="About NexFortis — Canada's Trusted IT Partner" description="Learn about NexFortis IT Solutions — our mission, vision, and values, plus the certified team delivering end-to-end IT across Canada from Nobleton, Ontario." path="/about" />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "About Us", url: "/about" },
        ]}
      />
      <PageHero 
        title="About NexFortis" 
        subtitle="Empowering Canadian businesses with innovative, reliable, and scalable IT solutions."
        imagePath={`${import.meta.env.BASE_URL}images/about-team.png`}
        imageWebpPath={`${import.meta.env.BASE_URL}images/about-team.webp`}
      />
      <PageBreadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "About Us" },
      ]} />

      <Section bg="brand-light">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Founded with a vision to demystify technology for modern enterprises, NexFortis IT Solutions has grown into a trusted partner for businesses across Canada. 
              </p>
              <p>
                We realized that many organizations struggle with fragmented IT setups — juggling different vendors for marketing, cloud infrastructure, accounting software, and bespoke automation. We bridge that gap by offering true end-to-end solutions under one roof.
              </p>
              <p>
                Our headquarters in Nobleton, Ontario serves as the hub for our dedicated team of engineers, developers, and consultants who are passionate about driving your business forward.
              </p>
              <p>
                Over the years, we've had the privilege of working with Canadian businesses across healthcare, legal, finance, retail, manufacturing, and professional services. Each industry brings unique challenges — from PIPEDA-compliant data handling in medical clinics to real-time inventory integrations for e-commerce retailers — and our team has built deep domain expertise to address them all. We understand that Canadian businesses face a distinct regulatory landscape, and we design every solution with privacy, compliance, and data residency at the forefront.
              </p>
              <p>
                As a Microsoft AI Cloud Partner and certified QuickBooks ProAdvisor team, NexFortis brings credentials that matter. Our engineers hold current certifications across the Microsoft 365 ecosystem, Azure cloud services, and Intune device management. Combined with our ProAdvisor expertise in QuickBooks Online and Desktop, we offer a rare blend of cloud productivity and financial systems knowledge that most IT firms simply can't match. It's this combination of certifications, Canadian-first privacy practices, and a genuine commitment to long-term client relationships that sets NexFortis apart in a crowded market.
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-secondary rounded-3xl p-10 border border-border">
              <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
              <p className="text-lg text-muted-foreground mb-8">
                To seamlessly integrate robust technology solutions that enhance operational efficiency, ensure data security, and catalyze limitless growth for our clients.
              </p>
              <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
              <p className="text-lg text-muted-foreground">
                To be Canada's premier IT partner, recognized for transforming complex technical challenges into competitive business advantages.
              </p>
            </div>
            <div className="bg-secondary rounded-3xl p-10 border border-border">
              <h3 className="text-2xl font-bold text-primary mb-4">Our Approach</h3>
              <p className="text-lg text-muted-foreground mb-6">
                We don't hand you off to a junior tech or disappear after kickoff. Every NexFortis engagement is led hands-on by senior consultants who scope the work, build the solution, and stay with you through rollout and beyond.
              </p>
              <p className="text-lg text-muted-foreground">
                From the first discovery call to ongoing support, you work with the same small team that knows your environment end-to-end — your cloud stack, your accounting workflows, your compliance posture, and the people who depend on it all running smoothly.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section bg="brand-navy">
        <SectionHeader title="Core Values" centered light />
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-y-10 gap-x-16">
          {values.map((val, i) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex items-start gap-5"
              >
                <div className="w-14 h-14 shrink-0 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{val.title}</h4>
                  <p className="text-white/70 leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section bg="brand-light" className="!py-14 md:!py-20">
        <SectionHeader title="Our Leadership" centered />
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-8 bg-card rounded-3xl p-8 border border-border shadow-sm"
          >
            <picture>
              <source
                srcSet={`${import.meta.env.BASE_URL}images/hassan-headshot.webp`}
                type="image/webp"
              />
              <img
                src={`${import.meta.env.BASE_URL}images/hassan-headshot.png`}
                alt="Hassan Sadiq, Founder & CEO of NexFortis"
                className="w-32 h-32 rounded-2xl object-cover shrink-0 bg-secondary"
                width={128}
                height={128}
                loading="lazy"
              />
            </picture>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">Hassan Sadiq</h3>
              <p className="text-accent font-semibold mb-3">Founder & Principal IT Consultant</p>
              <p className="text-muted-foreground leading-relaxed">
                With over a decade of experience in enterprise IT, cloud infrastructure, and digital transformation, Hassan founded NexFortis to bring enterprise-grade technology solutions to Canadian small and mid-sized businesses. A certified Microsoft Solutions Partner and QuickBooks ProAdvisor, Hassan leads the team with a hands-on approach to every client engagement — ensuring that technology investments translate directly into measurable business growth.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section bg="brand-navy">
        <SectionHeader title="Partnerships & Certifications" centered light />
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/badge-microsoft-partner.png`}
                alt="Microsoft AI Cloud Partner Program badge"
                className="h-9 w-auto object-contain"
                width={120}
                height={40}
              />
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Microsoft AI Cloud Partner Program</h4>
                <p className="text-white/70 leading-relaxed text-sm">
                  As a Microsoft Partner, NexFortis delivers certified expertise across Microsoft 365, Azure, and Intune — ensuring your cloud infrastructure is built on best practices with direct access to Microsoft's partner resources and support.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/badge-google-partner.png`}
                alt="Google Partner badge"
                className="h-9 w-auto object-contain"
                width={120}
                height={40}
              />
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Google Partner</h4>
                <p className="text-white/70 leading-relaxed text-sm">
                  Our Google Partner status means your digital marketing campaigns — from Google Ads to Analytics — are managed by certified professionals who meet Google's strict performance and spend requirements.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.16 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/badge-quickbooks-proadvisor.png`}
                alt="QuickBooks ProAdvisor badge"
                className="h-9 w-auto object-contain"
                width={120}
                height={40}
              />
              <div>
                <h4 className="text-lg font-bold text-white mb-2">QuickBooks ProAdvisor</h4>
                <p className="text-white/70 leading-relaxed text-sm">
                  Our certified ProAdvisor team provides expert QuickBooks setup, customization, and training — helping your business streamline bookkeeping, automate reporting, and maximize the value of your accounting software.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      <Section bg="brand-navy">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Let's Work Together</h2>
          <p className="text-lg text-white/80 mb-10">
            Ready to transform your business with technology? We'd love to hear from you.
          </p>
          <Link href="/contact" className="inline-flex px-8 py-4 min-h-[48px] rounded-xl bg-rose-gold text-rose-gold-foreground font-bold text-lg hover:bg-rose-gold-hover transition-all items-center justify-center gap-2 hover:-translate-y-0.5">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
