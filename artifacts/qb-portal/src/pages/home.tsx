import { Link } from "wouter";
import { Shield, Upload, Clock, CheckCircle, ArrowRight, Lock, DollarSign, MapPin, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const trustBadges = [
  { icon: MapPin, label: "Canadian-First" },
  { icon: Lock, label: "256-bit Encrypted" },
  { icon: CheckCircle, label: "Penny-Perfect Accuracy" },
  { icon: Clock, label: "Under 1 Hour" },
];

const steps = [
  { num: "1", icon: Upload, title: "Create & Upload Your QBM", desc: "Export your Enterprise file as a Portable Company File (.QBM) and upload it securely." },
  { num: "2", icon: DollarSign, title: "Choose Services & Pay", desc: "Select your conversion and any add-ons. Pay securely with Stripe. Starting at $149 CAD." },
  { num: "3", icon: Zap, title: "Receive Your Converted File", desc: "Get your converted Premier/Pro file delivered in under 1 hour with a validation report." },
];

const comparisonData = [
  { feature: "Price", nexfortis: "$149 CAD", bigred: "$249 USD (~$344 CAD)", etech: "$299 USD (~$413 CAD)" },
  { feature: "Turnaround", nexfortis: "Under 1 hour", bigred: "Next business day", etech: "1 business day" },
  { feature: "Same-day rush", nexfortis: "Included option (+$49)", bigred: "Not stated", etech: "$450 USD (~$621 CAD)" },
  { feature: "Canadian-first", nexfortis: "Yes", bigred: "No", etech: "Implied" },
  { feature: "GST/HST preserved", nexfortis: "Yes", bigred: "Unknown", etech: "Yes" },
  { feature: "Total products", nexfortis: "54", bigred: "28", etech: "7" },
];

const featuredServices = [
  { title: "Enterprise to Premier/Pro", price: "$149 CAD", desc: "Convert QuickBooks Enterprise .QBM files to Premier or Pro format.", badge: "available", href: "/order" },
  { title: "File Health Check", price: "+$49 CAD", desc: "Comprehensive file integrity check with detailed validation report.", badge: "available", href: "/order" },
  { title: "Rush Delivery", price: "+$49 CAD", desc: "Guaranteed 15-minute turnaround for your conversion.", badge: "available", href: "/order" },
  { title: "Data Recovery", price: "$199 CAD", desc: "Recover data from corrupted QuickBooks files.", badge: "coming-soon", href: "/waitlist?product=data-recovery" },
  { title: "Super Condense", price: "$99 CAD", desc: "Dramatically reduce your QuickBooks file size.", badge: "coming-soon", href: "/waitlist?product=super-condense" },
  { title: "Audit Trail Removal", price: "$79 CAD", desc: "Remove audit trail to improve performance.", badge: "coming-soon", href: "/waitlist?product=audit-trail-removal" },
];

export default function Home() {
  return (
    <div>
      <section className="bg-[#1a2744] text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0a500]/20 text-[#f0a500] text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" />
            Canadian QuickBooks Experts
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            QuickBooks Conversion &<br className="hidden md:block" /> Data Services
          </h1>
          <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
            Starting at <span className="text-[#f0a500] font-bold">$149 CAD</span>
          </p>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            Canadian-first. Under 1 hour. 54 products and services. Convert your QuickBooks Enterprise files to Premier/Pro with penny-perfect accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/order">
              <Button size="lg" className="bg-[#f0a500] text-[#1a2744] hover:bg-[#f0a500]/90 font-bold text-lg px-8 gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/catalog">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-medium text-lg px-8">
                View All Services
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-sm text-white/70">
                <badge.icon className="w-4 h-4 text-[#f0a500]" />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a2744] mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three simple steps to convert your QuickBooks Enterprise file</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#1a2744] text-white flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-[#f0a500] mb-2">Step {step.num}</div>
                <h3 className="text-lg font-bold text-[#1a2744] mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5f7fa]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a2744] mb-4">Why NexFortis?</h2>
            <p className="text-muted-foreground">See how we compare to the competition</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-border overflow-hidden">
              <thead>
                <tr className="bg-[#1a2744] text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Feature</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold bg-[#f0a500] text-[#1a2744]">NexFortis</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Big Red Consulting</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">E-Tech</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-[#f5f7fa]"}>
                    <td className="px-4 py-3 text-sm font-medium text-[#1a2744]">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-[#28a745] bg-[#28a745]/5">{row.nexfortis}</td>
                    <td className="px-4 py-3 text-sm text-center text-muted-foreground">{row.bigred}</td>
                    <td className="px-4 py-3 text-sm text-center text-muted-foreground">{row.etech}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a2744] mb-4">Featured Services</h2>
            <p className="text-muted-foreground">Our most popular QuickBooks solutions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((svc) => (
              <Card key={svc.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-[#1a2744]">{svc.title}</h3>
                    {svc.badge === "available" ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#28a745]/10 text-[#28a745] text-xs font-semibold">Available</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-semibold badge-coming-soon">Coming Soon</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{svc.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#f0a500]">{svc.price}</span>
                    <Link href={svc.href}>
                      <Button size="sm" variant={svc.badge === "available" ? "default" : "outline"} className={svc.badge === "available" ? "bg-[#1a2744] hover:bg-[#1a2744]/90" : ""}>
                        {svc.badge === "available" ? "Order Now" : "Join Waitlist"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/catalog">
              <Button variant="outline" className="gap-2">
                View All 54 Products <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1a2744] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-[#f0a500]" />
              <span>Files encrypted in transit</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-[#f0a500]" />
              <span>PIPEDA compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-[#f0a500]" />
              <span>Files deleted within 7 days</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to Convert Your QuickBooks File?</h2>
          <p className="text-white/70 mb-8">Get started in minutes. Your converted file will be delivered in under 1 hour.</p>
          <Link href="/order">
            <Button size="lg" className="bg-[#f0a500] text-[#1a2744] hover:bg-[#f0a500]/90 font-bold text-lg px-8 gap-2">
              Start Your Conversion <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
