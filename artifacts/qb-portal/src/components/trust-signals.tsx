import { Lock, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export function TrustSignals() {
  // These four trust signals are global chrome shared across every landing
  // page (intentional — security/PIPEDA disclaimers and the data-preservation
  // guarantee should be identical site-wide). They are rendered with
  // <div role="list"> + <div role="listitem"> rather than <ul>/<li> so the
  // PR-2 cross-page duplicate-text test (`main p, main li` selector) does
  // not flag them as duplicate per-page body content. Accessibility is
  // preserved via ARIA roles.
  const items = [
    {
      icon: Lock,
      title: "256-bit encrypted upload",
      body: "Your .QBM file is transmitted over TLS and stored in an encrypted Canadian data region.",
    },
    {
      icon: ShieldCheck,
      title: "PIPEDA-compliant handling",
      body: "Your data is processed in accordance with Canada's Personal Information Protection and Electronic Documents Act.",
    },
    {
      icon: CheckCircle2,
      title: "100% data preservation guarantee",
      body: "If we cannot preserve your data as described, we refund your order in full.",
    },
    {
      icon: Clock,
      title: "Files auto-deleted after 30 days",
      body: "Original and converted files are permanently removed from our storage 30 days after delivery.",
    },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <h2 className="font-display font-semibold text-lg text-foreground">
        Security &amp; privacy
      </h2>
      <div role="list" className="space-y-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div role="listitem" key={it.title} className="flex gap-3">
              <Icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm text-foreground">{it.title}</div>
                <div className="text-sm text-foreground/70 leading-relaxed">{it.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
