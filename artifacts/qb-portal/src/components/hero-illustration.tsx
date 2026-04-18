import {
  HERO_ICON_REGISTRY,
  type HeroIconName,
} from "@/lib/hero-icons";
import type { LandingPageData, LandingPageCategory } from "@/data/landingPages";

const CATEGORY_DEFAULTS: Record<
  LandingPageCategory,
  { primary: HeroIconName; accent: HeroIconName }
> = {
  service: { primary: "Wrench", accent: "Settings" },
  problem: { primary: "AlertTriangle", accent: "Wrench" },
  comparison: { primary: "Scale", accent: "ArrowRightLeft" },
  educational: { primary: "BookOpen", accent: "Lightbulb" },
};

const SLUG_ACCENTS: Record<string, HeroIconName> = {
  "enterprise-to-premier-conversion": "Database",
  "audit-trail-removal": "ShieldCheck",
  "super-condense": "Database",
  "file-repair": "FileCheck2",
  "accountedge-to-quickbooks": "BookOpen",
  "sage-50-to-quickbooks": "Leaf",
  "multi-currency-removal": "X",
  "list-reduction": "Database",
  "qbo-readiness": "CheckCircle2",
  "quickbooks-file-too-large": "HardDrive",
  "quickbooks-running-slow": "Gauge",
  "quickbooks-company-file-error": "FileX2",
  "quickbooks-multi-currency-problems": "AlertCircle",
  "etech-alternative": "Trophy",
  "quickbooks-conversion-canada": "ArrowRightLeft",
  "affordable-enterprise-conversion": "ArrowRightLeft",
  "how-conversion-works": "ArrowRightLeft",
  "is-it-safe": "Lock",
  "quickbooks-desktop-end-of-life": "Cloud",
  "quickbooks-support-subscription": "ShieldCheck",
};

function resolveIcon(
  name: HeroIconName | undefined,
  fallback: HeroIconName
): HeroIconName {
  if (name && name in HERO_ICON_REGISTRY) return name;
  return fallback;
}

export function HeroIllustration({ page }: { page: LandingPageData }) {
  const defaults = CATEGORY_DEFAULTS[page.category];
  const PrimaryIcon =
    HERO_ICON_REGISTRY[resolveIcon(page.heroIcon, defaults.primary)];
  const AccentIcon =
    HERO_ICON_REGISTRY[SLUG_ACCENTS[page.slug] ?? defaults.accent];

  return (
    <div
      className="relative aspect-[4/3] rounded-2xl border border-white/10 bg-gradient-to-br from-azure/30 to-rose-gold/20 overflow-hidden"
      role="img"
      aria-label={page.heroImageAlt}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div
            className="absolute inset-0 -m-8 rounded-full bg-white/5 blur-2xl"
            aria-hidden="true"
          />
          <PrimaryIcon
            className="relative w-40 h-40 lg:w-48 lg:h-48 text-white/90"
            strokeWidth={1.25}
            aria-hidden={true}
          />
        </div>
      </div>
      <div className="absolute bottom-5 right-5">
        <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-3">
          <AccentIcon
            className="w-7 h-7 text-white/85"
            strokeWidth={1.5}
            aria-hidden={true}
          />
        </div>
      </div>
    </div>
  );
}
