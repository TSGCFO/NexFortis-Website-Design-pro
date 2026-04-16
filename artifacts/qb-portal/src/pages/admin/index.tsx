import { AdminLayout } from "@/components/admin-layout";

function AdminDashboardPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold text-[#0A1628] mb-2"
          style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
        >
          Operator Dashboard
        </h1>
        <p className="text-gray-600">
          The admin panel is under development. MFA verification is active and protecting this area.
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboardPlaceholder />
    </AdminLayout>
  );
}
