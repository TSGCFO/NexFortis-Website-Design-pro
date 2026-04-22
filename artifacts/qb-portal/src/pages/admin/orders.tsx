import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { adminFetch, formatCurrency, formatDate, STATUS_LABELS, STATUS_COLORS } from "@/lib/admin-api";
import { TableSkeleton, ErrorBanner } from "@/components/admin-skeletons";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface OrderRow {
  id: number;
  status: string;
  serviceName: string;
  totalCad: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  hasUploadedFile: boolean;
}

const STATUS_FILTERS = ["all", "pending_payment", "submitted", "paid", "processing", "completed", "delivered", "failed", "cancelled"];

const TABLE_COLUMNS = [
  { width: "w-10" },
  { width: "w-32" },
  { width: "w-36" },
  { width: "w-16" },
  { width: "w-20" },
  { width: "w-20" },
  { width: "w-10" },
];

function OrdersContent() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
        order: sortOrder,
      });
      if (status !== "all") params.set("status", status);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await adminFetch(`/orders?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
      setPage(data.page);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, debouncedSearch, sort, sortOrder]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSort = (field: string) => {
    if (sort === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl font-bold text-[#0A1628] mb-6"
        style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
      >
        Orders
      </h1>

      {error && <ErrorBanner message={error} onRetry={fetchOrders} className="mb-4" />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 space-y-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or email..."
              aria-label="Search orders by customer name or email"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  status === s
                    ? "bg-[#0A1628] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s === "all" ? "All" : STATUS_LABELS[s] || s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <TableSkeleton columns={TABLE_COLUMNS} rows={5} />
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-700 text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("totalCad")}>
                    <span className="inline-flex items-center gap-1">
                      Total <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("status")}>
                    <span className="inline-flex items-center gap-1">
                      Status <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("createdAt")}>
                    <span className="inline-flex items-center gap-1">
                      Date <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900 font-medium">{order.customerName}</div>
                      <div className="text-xs text-gray-600">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 truncate max-w-[200px] text-gray-900">{order.serviceName}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{formatCurrency(order.totalCad)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-[#B76E79] hover:underline text-sm">
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

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <OrdersContent />
    </AdminLayout>
  );
}
