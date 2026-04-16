import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { adminFetch, formatDate, TICKET_STATUS_LABELS, TICKET_STATUS_COLORS } from "@/lib/admin-api";
import { TableSkeleton, ErrorBanner } from "@/components/admin-skeletons";
import { Search } from "lucide-react";

interface TicketRow {
  id: number;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userName: string | null;
  userEmail: string | null;
  isCritical: boolean;
  tierAtSubmission: string | null;
}

const STATUS_FILTERS = ["all", "open", "resolved", "closed"];

const TABLE_COLUMNS = [
  { width: "w-10" },
  { width: "w-40" },
  { width: "w-28" },
  { width: "w-20" },
  { width: "w-20" },
  { width: "w-10" },
];

function TicketsContent() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await adminFetch(`/tickets?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTickets(data.tickets);
    } catch {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [status, debouncedSearch]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl font-bold text-[#0A1628] mb-6"
        style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
      >
        Tickets
      </h1>

      {error && <ErrorBanner message={error} onRetry={fetchTickets} className="mb-4" />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 space-y-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
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
        </div>

        {loading ? (
          <TableSkeleton columns={TABLE_COLUMNS} rows={3} />
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No tickets yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Subject</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{ticket.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[250px]">{ticket.subject}</span>
                        {ticket.isCritical && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">CRITICAL</span>
                        )}
                        {ticket.tierAtSubmission === "premium" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">PREMIUM</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{ticket.userName || "—"}</div>
                      <div className="text-xs text-gray-400">{ticket.userEmail || ""}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TICKET_STATUS_COLORS[ticket.status] || "bg-gray-100 text-gray-700"}`}>
                        {TICKET_STATUS_LABELS[ticket.status] || ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(ticket.createdAt)}</td>
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
