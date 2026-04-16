import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { adminFetch, formatCurrency, formatDate, formatDateTime, STATUS_LABELS, STATUS_COLORS } from "@/lib/admin-api";
import { DetailPageSkeleton, ErrorBanner } from "@/components/admin-skeletons";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Upload, FileText } from "lucide-react";

interface OrderData {
  id: number;
  status: string;
  serviceId: number;
  serviceName: string;
  addons: string | null;
  totalCad: number;
  qbVersion: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  stripeSessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface FileData {
  id: number;
  orderId: number;
  fileType: string;
  fileName: string;
  storagePath: string | null;
  fileSizeBytes: number | null;
  expired: boolean;
  uploadedAt: string;
}

const ALL_STATUSES = ["pending_payment", "submitted", "paid", "processing", "completed", "failed", "cancelled"];

function OrderDetailContent() {
  const [, params] = useRoute("/admin/orders/:id");
  const orderId = params?.id;
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [downloadingFile, setDownloadingFile] = useState<number | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError("");
    try {
      const res = await adminFetch(`/orders/${orderId}`);
      if (res.status === 404) {
        setError("Order not found.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrder(data.order);
      setCustomer(data.customer);
      setFiles(data.files || []);
      setSelectedStatus(data.order.status);
    } catch {
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return;

    const previousStatus = order.status;
    setOrder(prev => prev ? { ...prev, status: selectedStatus } : null);
    setStatusSaving(true);

    try {
      const res = await adminFetch(`/orders/${order.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: selectedStatus }),
      });
      if (!res.ok) {
        setOrder(prev => prev ? { ...prev, status: previousStatus } : null);
        setSelectedStatus(previousStatus);
        const data = await res.json();
        toast({ title: "Error", description: data.error || "Failed to update status", variant: "destructive" });
        return;
      }
      const data = await res.json();
      setOrder(data.order);
      toast({ title: `Status updated to ${STATUS_LABELS[selectedStatus] || selectedStatus}` });
    } catch {
      setOrder(prev => prev ? { ...prev, status: previousStatus } : null);
      setSelectedStatus(previousStatus);
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setStatusSaving(false);
    }
  };

  const handleDownload = async (fileId: number) => {
    if (!order) return;
    setDownloadingFile(fileId);
    try {
      const res = await adminFetch(`/orders/${order.id}/files/${fileId}/download`);
      if (res.status === 410) {
        toast({ title: "File Expired", description: "This file has been deleted per the 7-day retention policy.", variant: "destructive" });
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        toast({ title: "Error", description: data.error || "Download failed", variant: "destructive" });
        return;
      }
      const data = await res.json();
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast({ title: "Error", description: "Download failed", variant: "destructive" });
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminFetch(`/orders/${order.id}/files/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: "Upload Failed", description: data.error || "Upload failed", variant: "destructive" });
        return;
      }
      const data = await res.json();
      setFiles(prev => [data.file, ...prev]);
      toast({ title: "File uploaded successfully" });
    } catch {
      toast({ title: "Error", description: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (error) {
    return (
      <div>
        <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <ErrorBanner message={error} onRetry={error !== "Order not found." ? fetchOrder : undefined} />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold text-[#0A1628]"
          style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
        >
          Order #{order.id}
        </h1>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-[#0A1628] mb-4">Order Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Service</dt>
              <dd className="font-medium">{order.serviceName}</dd>
            </div>
            {order.addons && (() => {
              let parsed: string[] = [];
              try { parsed = JSON.parse(order.addons); } catch { /* invalid JSON — skip */ }
              return Array.isArray(parsed) && parsed.length > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Add-ons</dt>
                  <dd className="font-medium">{parsed.join(", ")}</dd>
                </div>
              ) : null;
            })()}
            <div className="flex justify-between">
              <dt className="text-gray-500">Total</dt>
              <dd className="font-medium">{formatCurrency(order.totalCad)}</dd>
            </div>
            {order.qbVersion && (
              <div className="flex justify-between">
                <dt className="text-gray-500">QB Version</dt>
                <dd className="font-medium">{order.qbVersion}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Created</dt>
              <dd className="font-medium">{formatDateTime(order.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Updated</dt>
              <dd className="font-medium">{formatDateTime(order.updatedAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-[#0A1628] mb-4">Customer Info</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium">{customer?.name || order.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium">{customer?.email || order.customerEmail}</dd>
            </div>
            {(customer?.phone || order.customerPhone) && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-medium">{customer?.phone || order.customerPhone}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="text-lg font-semibold text-[#0A1628] mb-4">Update Status</h2>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            aria-label="Order status"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30"
          >
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={statusSaving || selectedStatus === order.status}
            className="px-4 py-2 bg-[#0A1628] text-white rounded-lg text-sm font-medium hover:bg-[#0A1628]/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {statusSaving ? "Saving..." : "Save Status"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0A1628]">Files</h2>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
              aria-label="Upload file to order"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#B76E79] text-white rounded-lg text-sm font-medium hover:bg-[#B76E79]/90 disabled:opacity-40"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </div>

        {files.length === 0 ? (
          <p className="text-gray-500 text-sm">No files uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.fileName}</p>
                    <p className="text-xs text-gray-400">
                      {file.fileSizeBytes ? `${(file.fileSizeBytes / 1024).toFixed(1)} KB` : ""} &middot; {formatDateTime(file.uploadedAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(file.id)}
                  disabled={file.expired || downloadingFile === file.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#0A1628] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 flex-shrink-0"
                >
                  {downloadingFile === file.id ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-[#0A1628] rounded-full animate-spin" role="status" aria-label="Loading" />
                      Preparing…
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      {file.expired ? "Expired" : "Download"}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrderDetailPage() {
  return (
    <AdminLayout>
      <OrderDetailContent />
    </AdminLayout>
  );
}
