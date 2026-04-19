import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import {
  adminFetch,
  formatRelativeTime,
  formatSlaRemaining,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
  TIER_LABELS,
  TIER_COLORS,
  SLA_COLORS,
} from "@/lib/admin-api";
import { TableSkeleton, ErrorBanner } from "@/components/admin-skeletons";
import {
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  BarChart3,
  Filter,
} from "lucide-react";

interface TicketRow {
  id: number;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userName: string | null;
  userEmail: string | null;
  isCritical: boolean;
  isAfterHours: boolean;
  tierAtSubmission: string | null;
  slaDeadline: string | null;
  firstResponseAt: string | null;
  slaStatus: string | null;
  slaRemainingMinutes: number | null;
}

interface TicketStats {
  openTickets: number;
  inProgressTickets: number;
  criticalOpen: number;
  slaBreached: number;
  avgResponseMinutes: number;
  slaCompliancePercent: number;
  ticketsByTier: Record<string, number>;
}

const STATUS_FILTERS = ["all", "open", "in_progress", "resolved", "closed"];
const TIER_FILTERS = ["all", "none", "order-basic", "order-extended", "essentials", "professional", "premium"];
const SORT_OPTIONS = [
  { value: "priority", label: "Priority" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

function StatsHeader({ stats }: { stats: TicketStats | null }) {
  if (!stats) return null;

  const complianceColor =
    stats.slaCompliancePercent >= 98
      ? "text-green-700"
      : stats.slaCompliancePercent >= 95
        ? "text-yellow-700"
        : "text-red-700";

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-xs text-gray-500 uppercase font-medium">Open</div>
        <div className="text-2xl font-bold text-[#0A1628]">{stats.openTickets + stats.inProgressTickets}</div>
        <div className="text-xs text-gray-400">{stats.openTickets} new / {stats.inProgressTickets} in progress</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-xs text-gray-500 uppercase font-medium">Critical</div>
        <div className={`text-2xl font-bold ${stats.criticalOpen > 0 ? "text-red-600" : "text-[#0A1628]"}`}>
          {stats.criticalOpen}
        </div>
        {stats.criticalOpen > 0 && <div className="text-xs text-red-500">Needs attention</div>}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-xs text-gray-500 uppercase font-medium">SLA Breached</div>
        <div className={`text-2xl font-bold ${stats.slaBreached > 0 ? "text-red-600" : "text-[#0A1628]"}`}>
          {stats.slaBreached}
        </div>
        {stats.slaBreached > 0 && <div className="text-xs text-red-500">Past deadline</div>}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-xs text-gray-500 uppercase font-medium">Avg Response</div>
        <div className="text-2xl font-bold text-[#0A1628]">{stats.avgResponseMinutes} min</div>
        <div className="text-xs text-gray-400">Last 30 days</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-xs text-gray-500 uppercase font-medium">SLA Compliance</div>
        <div className={`text-2xl font-bold ${complianceColor}`}>{stats.slaCompliancePercent}%</div>
      </div>
    </div>
  );
}

function SlaTimer({ ticket }: { ticket: TicketRow }) {
  const [remainingMin, setRemainingMin] = useState(ticket.slaRemainingMinutes);
  const [currentStatus, setCurrentStatus] = useState(ticket.slaStatus);

  useEffect(() => {
    if (!ticket.slaDeadline || ticket.firstResponseAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const deadline = new Date(ticket.slaDeadline!);
      const mins = Math.floor((deadline.getTime() - now.getTime()) / 60000);
      setRemainingMin(mins);
      if (mins <= 0) setCurrentStatus("breached");
      else if (mins < 10) setCurrentStatus("red");
      else if (mins < 30) setCurrentStatus("yellow");
      else setCurrentStatus("green");
    }, 30000);

    return () => clearInterval(interval);
  }, [ticket.slaDeadline, ticket.firstResponseAt]);

  if (!ticket.slaDeadline) {
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">No SLA</span>;
  }

  if (ticket.firstResponseAt) {
    const responseMs = new Date(ticket.firstResponseAt).getTime() - new Date(ticket.createdAt).getTime();
    const responseMin = Math.round(responseMs / 60000);
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
        <CheckCircle className="w-3 h-3" />
        Responded in {responseMin}m
      </span>
    );
  }

  const statusKey = currentStatus || "green";
  const colorClass = SLA_COLORS[statusKey] || SLA_COLORS.green;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${colorClass}`}>
      <Clock className="w-3 h-3" />
      {remainingMin !== null && remainingMin !== undefined ? formatSlaRemaining(remainingMin) : "—"}
    </span>
  );
}

function TicketsContent() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [status, setStatus] = useState("all");
  const [tier, setTier] = useState("all");
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [sortBy, setSortBy] = useState("priority");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [status, tier, criticalOnly, sortBy, debouncedSearch]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminFetch("/tickets/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
    }
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (tier !== "all") params.set("tier", tier);
      if (criticalOnly) params.set("critical", "true");
      params.set("sort", sortBy);
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await adminFetch(`/tickets?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTickets(data.tickets);
      setTotal(data.total);
    } catch {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [status, tier, criticalOnly, sortBy, debouncedSearch, page]);

  useEffect(() => { fetchTickets(); fetchStats(); }, [fetchTickets, fetchStats]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl font-bold text-[#0A1628] mb-6"
        style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
      >
        Tickets
      </h1>

      <StatsHeader stats={stats} />

      {error && <ErrorBanner message={error} onRetry={fetchTickets} className="mb-4" />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 space-y-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject or email..."
              aria-label="Search tickets by subject or email"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1">
              {STATUS_FILTERS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    status === s
                      ? "bg-[#0A1628] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === "all" ? "All" : TICKET_STATUS_LABELS[s] || s}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-gray-200" />

            <select
              value={tier}
              onChange={e => setTier(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30"
            >
              {TIER_FILTERS.map(t => (
                <option key={t} value={t}>
                  {t === "all" ? "All Tiers" : t === "none" ? "No Subscription" : TIER_LABELS[t] || t}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={criticalOnly}
                onChange={e => setCriticalOnly(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Critical only
            </label>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <TableSkeleton columns={[
            { width: "w-10" }, { width: "w-40" }, { width: "w-28" },
            { width: "w-20" }, { width: "w-24" }, { width: "w-16" }, { width: "w-10" },
          ]} rows={5} />
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No tickets match your filters.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-500 text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">SLA</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-left"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">#{ticket.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate max-w-[200px]">{ticket.subject}</span>
                          {ticket.isCritical && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">CRITICAL</span>
                          )}
                          {ticket.tierAtSubmission && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${TIER_COLORS[ticket.tierAtSubmission] || "bg-gray-100 text-gray-700"}`}>
                              {(TIER_LABELS[ticket.tierAtSubmission] || ticket.tierAtSubmission).toUpperCase()}
                            </span>
                          )}
                          {ticket.isAfterHours && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700">AFTER-HRS</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[300px]">
                          {ticket.message?.substring(0, 100)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{ticket.userName || "—"}</div>
                        <div className="text-xs text-gray-400">{ticket.userEmail || ""}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TICKET_STATUS_COLORS[ticket.status] || "bg-gray-100 text-gray-700"}`}>
                          {TICKET_STATUS_LABELS[ticket.status] || ticket.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <SlaTimer ticket={ticket} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {formatRelativeTime(ticket.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/tickets/${ticket.id}`} className="text-[#B76E79] hover:underline text-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-xs rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1 text-xs rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminTicketsPage() {
  return (
    <AdminLayout>
      <TicketsContent />
    </AdminLayout>
  );
}
