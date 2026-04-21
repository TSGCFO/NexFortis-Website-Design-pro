import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/seo";
import { TierBadge } from "@/components/tier-badge";
import {
  Check,
  X as XIcon,
  ArrowRight,
  Shield,
  Clock,
  Headphones,
  Zap,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface TierDef {
  tier: "essentials" | "professional" | "premium";
  name: string;
  promoPrice: string;
  standardPrice: string;
  period: string;
  description: string;
  badge?: string;
  features: { text: string; included: boolean }[];
  highlight?: boolean;
}

const tiers: TierDef[] = [
  {
    tier: "essentials",
    name: "Essentials",
    promoPrice: "$25",
    standardPrice: "$49",
    period: "/mo CAD",
    description: "Basic support for small businesses getting started with QuickBooks.",
    features: [
      { text: "3 support tickets per month", included: true },
      { text: "1-hour response time SLA", included: true },
      { text: "Business hours support (Mon-Fri 9-5 ET)", included: true },
      { text: "Email support", included: true },
      { text: "Service discounts", included: false },
      { text: "Data integrity analysis", included: false },
      { text: "Priority health checks", included: false },
      { text: "Video call support", included: false },
      { text: "Referral rewards", included: false },
    ],
  },
  {
    tier: "professional",
    name: "Professional",
    promoPrice: "$50",
    standardPrice: "$99",
    period: "/mo CAD",
    description: "Enhanced support with more tickets, faster response, and service discounts.",
    badge: "Most Popular",
    highlight: true,
    features: [
      { text: "8 support tickets per month", included: true },
      { text: "1-hour response time SLA", included: true },
      { text: "Business hours support (Mon-Fri 9-5 ET)", included: true },
      { text: "Email support", included: true },
      { text: "10% discount on all services", included: true },
      { text: "Data integrity analysis", included: true },
      { text: "Priority health checks", included: true },
      { text: "Video call support", included: false },
      { text: "Referral rewards", included: false },
    ],
  },
  {
    tier: "premium",
    name: "Premium",
    promoPrice: "$75",
    standardPrice: "$149",
    period: "/mo CAD",
    description: "Unlimited support with the fastest response, maximum discounts, and exclusive perks.",
    badge: "Best Value",
    features: [
      { text: "Unlimited support tickets", included: true },
      { text: "30-minute response time SLA", included: true },
      { text: "After-hours critical support", included: true },
      { text: "Email & video call support", included: true },
      { text: "20% discount on all services", included: true },
      { text: "Data integrity analysis", included: true },
      { text: "Priority health checks", included: true },
      { text: "1-on-1 video call sessions", included: true },
      { text: "Referral rewards program ($25/referral)", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Can I change my plan later?",
    a: "Yes. You can upgrade at any time and the change takes effect immediately with prorated billing. Downgrades take effect at the start of your next billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) through Stripe. All prices are in Canadian dollars (CAD).",
  },
  {
    q: "What happens if I use all my tickets?",
    a: "You'll need to wait until your next billing cycle for tickets to reset, or upgrade to a higher tier for more tickets. Premium subscribers have unlimited tickets.",
  },
  {
    q: "Is there a contract or commitment?",
    a: "No. All plans are month-to-month. You can cancel anytime and your access continues until the end of your current billing period.",
  },
  {
    q: "What's the response time SLA?",
    a: "Essentials and Professional plans have a 1-hour SLA during business hours. Premium has a 30-minute SLA and includes after-hours critical support.",
  },
];

import { getApiBase } from "../lib/api-base";

function apiUrl(path: string) {
  return getApiBase() + "/api/qb/subscriptions" + path;
}

export default function Subscription() {
  const { user, getAccessToken } = useAuth();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const success = params.get("success") === "true";
  const canceled = params.get("canceled") === "true";
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent("/qb-portal/subscription")}`);
      return;
    }

    setLoadingTier(tier);
    setError(null);

    try {
      const token = await getAccessToken();
      const res = await fetch(apiUrl("/checkout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tier, usePromo: true }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          navigate("/portal");
          return;
        }
        setError(data.error || "Failed to start checkout");
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div>
      <SEO
        title="QuickBooks Support Plans — Monthly Expert Help"
        description="Choose a QuickBooks Expert Support plan. Get priority support, service discounts, and exclusive perks starting at $25 CAD/month."
        path="/subscription"
      />

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              Subscription activated! Welcome to your new plan. Visit your{" "}
              <Link href="/portal" className="underline font-bold">dashboard</Link> to get started.
            </p>
          </div>
        </div>
      )}

      {canceled && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
              Checkout was canceled. No charges were made. Feel free to try again when you're ready.
            </p>
          </div>
        </div>
      )}

      <section className="section-brand-navy py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-azure text-sm font-semibold mb-6">
              <Headphones className="w-4 h-4" />
              QB Expert Support Plans
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white font-display tracking-tight"
          >
            Choose Your Support Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70 mb-6 max-w-2xl mx-auto"
          >
            Priority QuickBooks support from Canadian experts. Faster responses, service discounts, and exclusive perks.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Clock className="w-4 h-4 text-azure" /> 30-min to 1-hour SLA
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Shield className="w-4 h-4 text-azure" /> Cancel anytime
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Zap className="w-4 h-4 text-azure" /> Launch pricing — up to 50% off
            </div>
          </motion.div>
        </div>
      </section>

      <div className="brand-divider" />

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <p className="text-sm text-muted-foreground text-center mb-6 max-w-3xl mx-auto">
            Already placed an order? You have basic support included with your purchase. These subscription plans give you ongoing, expanded access beyond the 30-day window.
          </p>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {tiers.map((t, i) => (
              <motion.div
                key={t.tier}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex"
              >
                <Card
                  className={`flex flex-col w-full relative ${
                    t.highlight
                      ? "border-accent shadow-lg ring-2 ring-accent/20"
                      : "border-border"
                  }`}
                >
                  {t.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-rose-gold text-white text-xs font-bold whitespace-nowrap">
                        {t.badge}
                      </span>
                    </div>
                  )}
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <TierBadge tier={t.tier} size="md" className="mb-3" />
                      <h3 className="text-xl font-bold font-display text-primary">{t.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                    </div>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">{t.promoPrice}</span>
                        <span className="text-sm text-muted-foreground">{t.period}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground line-through">{t.standardPrice}/mo</span>
                        <span className="text-xs font-semibold text-rose-gold">Launch Special</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6 flex-1" role="list" aria-label={`${t.name} plan features`}>
                      {t.features.map((f) => (
                        <li key={f.text} className="flex items-start gap-2 text-sm">
                          {f.included ? (
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <XIcon className="w-4 h-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          )}
                          <span className={f.included ? "text-foreground" : "text-muted-foreground/60"}>
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSubscribe(t.tier)}
                      disabled={loadingTier !== null}
                      className={`w-full font-display font-bold ${
                        t.highlight
                          ? "bg-accent text-white hover:bg-accent/90"
                          : "bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover"
                      }`}
                      aria-label={`Subscribe to ${t.name} plan at ${t.promoPrice} per month`}
                    >
                      {loadingTier === t.tier ? "Redirecting..." : user ? "Subscribe Now" : "Sign In to Subscribe"}
                      {loadingTier !== t.tier && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 section-brand-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-display text-primary text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-border overflow-hidden shadow-sm">
                <button
                  className="w-full p-4 flex items-center justify-between text-left"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  aria-expanded={expandedFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-semibold text-sm text-slate-900 dark:text-white pr-4">{faq.q}</span>
                  {expandedFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === i && (
                  <div id={`faq-answer-${i}`} className="px-4 pb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 section-brand-navy">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-4 text-center"
        >
          <h2 className="text-3xl font-bold font-display text-white mb-4">Not sure which plan is right?</h2>
          <p className="text-white/70 mb-8">
            Start with Essentials and upgrade anytime. All plans include our commitment to penny-perfect accuracy and Canadian-first support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleSubscribe("essentials")}
              size="lg"
              className="bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold rounded-full px-8"
              aria-label="Start with Essentials plan"
            >
              Start with Essentials <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link href="/faq">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-display rounded-full px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
