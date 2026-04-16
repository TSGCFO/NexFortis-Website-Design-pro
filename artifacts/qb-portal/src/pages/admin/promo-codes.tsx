import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import {
  adminFetch,
  formatCurrency,
  formatDate,
  PROMO_TYPE_LABELS,
  PROMO_STATUS_LABELS,
  PROMO_STATUS_COLORS,
  describePromoValue,
} from "@/lib/admin-api";
import { TableSkeleton, StatCardSkeleton, ErrorBanner } from "@/components/admin-skeletons";
import { Search, ChevronLeft, ChevronRight, Plus, Tag, TrendingUp, DollarSign, Trophy } from "lucide-react";

interface PromoCodeRow {
  id: number;
  code: string;
  type: string;
  isActive: boolean;
  percentOff: number | null;
  amountOffCents: number | null;
  subscriptionDurationMonths: number | null;
  maxUses: number | null;
  redemptionCount: number;
  expiresAt: string | null;
  createdAt: string;
  status: "active" | "inactive" | "expired" | "exhausted";
}

interface Analytics {
  activeCodes: number;
  totalRedemptions: number;
  totalDiscountCents: number;
  topCodes: Array<{ code: string; redemptions: number; discountCents: number }>;
}

const STATUS_FILTERS = ["all", "active", "inactive", "expired", "exhausted"];
const TYPE_FILTERS = ["all", "percentage", "fixed_amount", "free_service", "subscription"];

const TABLE_COLUMNS = [
  { width: "w-24" },
  { width: "w-20" },
  { width: "w-20" },
  { width: "w-16" },
  { width: "w-20" },
  { width: "w-20" },
  { width: "w-12" },
];

function PromoCodesContent() {
  const [, navigate] = useLocation();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [codes, setCodes] = useState<PromoCodeRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await adminFetch("/promo-analytics");
      if (!res.ok) throw new Error();
      setAnalytics(await res.json());
    } catch {
      // Soft fail; main error banner handles list errors
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (status !== "all") params.set("status", status);
      if (type !== "all") params.set("type", type);
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await adminFetch(`/promo-codes?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCodes(data.codes);
      setTotal(data.pagination.totalCount);
      setPage(data.pagination.page);
      setLimit(data.pagination.limit);
      setTotalPages(data.pagination.totalPages);
    } catch {
      setError("Failed to load promo codes.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, type, debouncedSearch]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);
  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1
          className="text-2xl md:text-3xl font-bold text-[#0A1628]"
          style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
        >
          Promo Codes
        </h1>
        <Link
          href="/admin/promo-codes/new"
          className="inline-flex items-center gap-2 bg-[#B76E79] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A45D68] transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Code
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {analyticsLoading ? (
          <StatCardSkeleton count={4} />
        ) : (
          <>
            <StatCard label="Active codes" value={String(analytics?.activeCodes ?? 0)} icon={Tag} color="bg-green-50 text-green-700" />
            <StatCard label="Total redemptions" value={String(analytics?.totalRedemptions ?? 0)} icon={TrendingUp} color="bg-blue-50 text-blue-700" />
            <StatCard label="Discount issued" value={formatCurrency(analytics?.totalDiscountCents ?? 0)} icon={DollarSign} color="bg-amber-50 text-amber-700" />
            <StatCard label="Top code" value={analytics?.topCodes[0]?.code ?? "—"} icon={Trophy} color="bg-rose-50 text-rose-700" small />
          </>
        )}
      </div>

      {analytics && analytics.topCodes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4 md:p-5">
          <h2 className="text-sm font-semibold text-[#0A1628] mb-3">Top 5 codes by redemptions</h2>
          <ul className="divide-y divide-gray-100">
            {analytics.topCodes.map((c) => (
              <li key={c.code} className="flex items-center justify-between py-2 text-sm">
                <span className="font-mono font-medium">{c.code}</span>
                <span className="text-gray-500">{c.redemptions} redemptions · {formatCurrency(c.discountCents)} issued</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <ErrorBanner message={error} onRetry={fetchCodes} className="mb-4" />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 space-y-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code..."
              aria-label="Search promo codes"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <FilterGroup label="Status" options={STATUS_FILTERS} value={status} onChange={(v) => { setStatus(v); setPage(1); }} labels={PROMO_STATUS_LABELS} />
            <FilterGroup label="Type" options={TYPE_FILTERS} value={type} onChange={(v) => { setType(v); setPage(1); }} labels={PROMO_TYPE_LABELS} />
          </div>
        </div>

        {loading ? (
          <TableSkeleton columns={TABLE_COLUMNS} rows={5} />
        ) : codes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No promo codes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Value</th>
                  <th className="px-4 py-3 text-left">Used</th>
                  <th className="px-4 py-3 text-left">Expires</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {codes.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/promo-codes/${c.id}`)}>
                    <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                    <td className="px-4 py-3">{PROMO_TYPE_LABELS[c.type] || c.type}</td>
                    <td className="px-4 py-3">{describePromoValue(c)}</td>
                    <td className="px-4 py-3">{c.redemptionCount}{c.maxUses != null ? ` / ${c.maxUses}` : ""}</td>
                    <td className="px-4 py-3 text-gray-500">{c.expiresAt ? formatDate(c.expiresAt) : "Never"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PROMO_STATUS_COLORS[c.status]}`}>
                        {PROMO_STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/promo-codes/${c.id}`} className="text-[#B76E79] hover:underline text-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, small }: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  small?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className={`font-bold text-[#0A1628] ${small ? "text-lg md:text-xl truncate" : "text-2xl md:text-3xl"}`}>{value}</p>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange, labels }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  labels: Record<string, string>;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs uppercase text-gray-400 font-medium">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value === o ? "bg-[#0A1628] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {o === "all" ? "All" : (labels[o] || o)}
        </button>
      ))}
    </div>
  );
}

export default function AdminPromoCodesPage() {
  return (
    <AdminLayout>
      <PromoCodesContent />
    </AdminLayout>
  );
}
