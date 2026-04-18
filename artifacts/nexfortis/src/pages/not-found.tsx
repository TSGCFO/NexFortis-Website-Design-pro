import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { SEO } from "@/components/seo";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center section-brand-navy overflow-hidden pt-24 pb-16 px-4">
      <SEO title="Page Not Found" description="The page you are looking for does not exist." noIndex />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-32 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-white text-sm font-display font-medium mb-8">
          <AlertCircle className="w-4 h-4 text-rose-gold" aria-hidden="true" />
          Error 404
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white leading-[1.05] mb-6">
          Page Not <span className="text-rose-gold">Found.</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-4 min-h-[52px] rounded-xl bg-rose-gold text-rose-gold-foreground font-bold text-lg hover:bg-rose-gold-hover hover:-translate-y-1 transition-all shadow-xl shadow-rose-gold/25 flex items-center justify-center gap-2"
          >
            Return to Homepage
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-10 py-4 min-h-[52px] rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
