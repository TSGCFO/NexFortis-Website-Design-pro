import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { adminFetch, formatDate } from "@/lib/admin-api";
import { TableSkeleton, ErrorBanner } from "@/components/admin-skeletons";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
  openTicketCount: number;
}

const TABLE_COLUMNS = [
  { width: "w-28" },
  { width: "w-36" },
  { width: "w-24" },
  { width: "w-20" },
  { width: "w-12" },
  { width: "w-16" },
];

function CustomersContent() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await adminFetch(`/customers?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCustomers(data.customers);
      setTotal(data.total);
      setPage(data.page);
    } catch {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl font-bold text-[#0A1628] mb-6"
        style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
      >
        Customers
      </h1>

      {error && <ErrorBanner message={error} onRetry={fetchCustomers} className="mb-4" />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              aria-label="Search customers by name or email"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79]"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton columns={TABLE_COLUMNS} rows={4} />
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No customers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-700 text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                  <th className="px-4 py-3 text-left">Orders</th>
                  <th className="px-4 py-3 text-left">Open Tickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-900">{c.email}</td>
                    <td className="px-4 py-3 text-gray-700">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{c.orderCount}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{c.openTicketCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-700">
            <span>
              Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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

export default function AdminCustomersPage() {
  return (
    <AdminLayout>
      <CustomersContent />
    </AdminLayout>
  );
}
