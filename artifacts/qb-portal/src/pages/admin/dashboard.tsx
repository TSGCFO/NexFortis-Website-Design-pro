import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { adminFetch, formatCurrency, formatDate, STATUS_LABELS, STATUS_COLORS } from "@/lib/admin-api";
import { StatCardSkeleton, TableSkeleton, ErrorBanner } from "@/components/admin-skeletons";
import { ShoppingCart, Users, AlertCircle, CheckCircle } from "lucide-react";

interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  openTickets: number;
  recentOrders: Array<{
    id: number;
    status: string;
    serviceName: string;
    totalCad: number;
    createdAt: string;
    customerName: string;
    customerEmail: string;
  }>;
}

const RECENT_ORDERS_COLUMNS = [
  { width: "w-10" },
  { width: "w-28" },
  { width: "w-36" },
  { width: "w-16" },
  { width: "w-20" },
  { width: "w-20" },
  { width: "w-10" },
];

function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminFetch("/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard");
      setData(await res.json());
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (error && !data) {
    return (
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[#0A1628] mb-6"
          style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
        >
          Dashboard
        </h1>
        <ErrorBanner message={error} onRetry={fetchDashboard} />
      </div>
    );
  }

  const stats = [
    { label: "Total Orders", value: data?.totalOrders ?? 0, icon: ShoppingCart, color: "bg-blue-50 text-blue-700" },
    { label: "Pending", value: data?.pendingOrders ?? 0, icon: AlertCircle, color: "bg-yellow-50 text-yellow-700" },
    { label: "Processing", value: data?.processingOrders ?? 0, icon: ShoppingCart, color: "bg-purple-50 text-purple-700" },
    { label: "Completed", value: data?.completedOrders ?? 0, icon: CheckCircle, color: "bg-green-50 text-green-700" },
  ];

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl font-bold text-[#0A1628] mb-6"
        style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
      >
        Dashboard
      </h1>

      {error && <ErrorBanner message={error} onRetry={fetchDashboard} className="mb-4" />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <StatCardSkeleton count={4} />
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#0A1628]">{stat.value}</p>
              </div>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {loading ? (
          <StatCardSkeleton count={2} />
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-500">Total Customers</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-[#0A1628]">{data?.totalCustomers ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-orange-50 text-orange-700">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-500">Open Tickets</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-[#0A1628]">{data?.openTickets ?? 0}</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 md:p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#0A1628]">Recent Orders</h2>
        </div>
        {loading ? (
          <TableSkeleton columns={RECENT_ORDERS_COLUMNS} rows={3} />
        ) : !data?.recentOrders.length ? (
          <div className="p-8 text-center text-gray-500">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3 truncate max-w-[200px]">{order.serviceName}</td>
                    <td className="px-4 py-3">{formatCurrency(order.totalCad)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
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
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}
