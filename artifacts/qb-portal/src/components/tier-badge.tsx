import { cn } from "@/lib/utils";

type TierType = "essentials" | "professional" | "premium" | "order-basic" | "order-extended" | null | undefined;
type BadgeSize = "sm" | "md" | "lg";

interface TierBadgeProps {
  tier: TierType;
  size?: BadgeSize;
  className?: string;
}

const tierStyles: Record<string, string> = {
  essentials: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  professional: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  premium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  "order-basic": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  "order-extended": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  none: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

const tierLabels: Record<string, string> = {
  essentials: "Essentials",
  professional: "Professional",
  premium: "Premium",
  "order-basic": "Order Support",
  "order-extended": "Extended Support",
  none: "No Plan",
};

export function TierBadge({ tier, size = "md", className }: TierBadgeProps) {
  const key = tier || "none";
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border whitespace-nowrap",
        tierStyles[key] || tierStyles.none,
        sizeStyles[size],
        className,
      )}
      aria-label={`Subscription tier: ${tierLabels[key] || "None"}`}
    >
      {tierLabels[key] || "No Plan"}
    </span>
  );
}

export function getTierColor(tier: TierType): string {
  switch (tier) {
    case "essentials": return "text-blue-600 dark:text-blue-400";
    case "professional": return "text-purple-600 dark:text-purple-400";
    case "premium": return "text-amber-600 dark:text-amber-400";
    case "order-basic": return "text-green-600 dark:text-green-400";
    case "order-extended": return "text-teal-600 dark:text-teal-400";
    default: return "text-gray-500";
  }
}
