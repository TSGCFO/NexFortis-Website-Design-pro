import { getAccessToken } from "./auth";

function apiUrl(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base.slice(0, -1) : base;
  return prefix.replace(/\/qb-portal$/, "") + "/api/qb/admin" + path;
}

export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
    Authorization: `Bearer ${token}`,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  if (response.status === 401) {
    try {
      const { supabase } = await import("./supabase");
      await supabase.auth.signOut();
    } catch { /* best-effort cleanup */ }
    window.location.href = `${import.meta.env.BASE_URL}login`;
    return response;
  }

  return response;
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)} CAD`;
}

export function formatDate(dateStr: string | Date): string {
  return new Date(dateStr).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateStr: string | Date): string {
  return new Date(dateStr).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  submitted: "Submitted",
  paid: "Paid",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<string, string> = {
  pending_payment: "bg-yellow-100 text-yellow-800",
  submitted: "bg-blue-100 text-blue-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export const TICKET_STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const TICKET_STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

export const TIER_LABELS: Record<string, string> = {
  essentials: "Essentials",
  professional: "Professional",
  premium: "Premium",
};

export const TIER_COLORS: Record<string, string> = {
  essentials: "bg-blue-100 text-blue-700",
  professional: "bg-purple-100 text-purple-700",
  premium: "bg-amber-100 text-amber-700",
};

export const SLA_COLORS: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  breached: "bg-red-600 text-white",
};

export function formatRelativeTime(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

export const PROMO_TYPE_LABELS: Record<string, string> = {
  percentage: "Percentage",
  fixed_amount: "Fixed amount",
  free_service: "Free service",
  subscription: "Subscription",
};

export const PROMO_STATUS_LABELS: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  expired: "Expired",
  exhausted: "Exhausted",
};

export const PROMO_STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-200 text-gray-700",
  expired: "bg-yellow-100 text-yellow-800",
  exhausted: "bg-red-100 text-red-800",
};

export function describePromoValue(row: {
  type: string;
  percentOff: number | null;
  amountOffCents: number | null;
  subscriptionDurationMonths: number | null;
}): string {
  if (row.type === "percentage") return `${row.percentOff ?? 0}% off`;
  if (row.type === "free_service") return "100% off";
  if (row.type === "fixed_amount") return `${formatCurrency(row.amountOffCents ?? 0)} off`;
  if (row.type === "subscription") {
    const m = row.subscriptionDurationMonths ?? 1;
    return `${row.percentOff ?? 100}% off (${m} month${m > 1 ? "s" : ""})`;
  }
  return "Discount";
}

export function formatSlaRemaining(minutes: number): string {
  if (minutes <= 0) return "Breached";
  if (minutes < 60) return `${minutes} min remaining`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m remaining`;
}
