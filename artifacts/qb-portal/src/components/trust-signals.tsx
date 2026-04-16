import { Lock, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export function TrustSignals() {
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
      <ul className="space-y-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.title} className="flex gap-3">
              <Icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-foreground">{it.title}</p>
                <p className="text-sm text-foreground/70 leading-relaxed">{it.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
