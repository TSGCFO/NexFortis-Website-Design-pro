import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

// End-of-page conversion strip. Defaults to the site-wide primary CTA
// ("Get a Free Quote" → /contact) so the anchor stays consistent with the
// header, footer, and floating CTA (INV-015). Renders its own <h2>; the page
// wraps it in a navy Section.
export function CTAStrip({
  heading,
  subtext,
  ctaLabel = "Get a Free Quote",
  ctaHref = "/contact",
}: {
  heading: string;
  subtext: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">{heading}</h2>
      <p className="text-lg text-white/80 mb-10">{subtext}</p>
      <Link
        href={ctaHref}
        className="inline-flex px-8 py-4 min-h-[48px] rounded-xl bg-rose-gold text-rose-gold-foreground font-bold text-lg hover:bg-rose-gold-hover transition-all items-center justify-center gap-2 hover:-translate-y-0.5"
      >
        {ctaLabel} <ArrowRight className="w-5 h-5" aria-hidden="true" />
      </Link>
    </div>
  );
}
