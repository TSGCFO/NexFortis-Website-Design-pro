import { useState, useEffect } from "react";
import { Link, useParams, useSearch } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Clock, CheckCircle, Download, FileText, Shield } from "lucide-react";

interface OrderFile {
  id: number;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}

interface Order {
  id: number;
  serviceName: string;
  addons: string | null;
  totalCad: number;
  status: string;
  qbVersion: string | null;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  submitted: { color: "bg-blue-100 text-blue-700", icon: Clock, label: "Submitted" },
  pending_payment: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Pending Payment" },
  processing: { color: "bg-amber-100 text-amber-700", icon: Package, label: "Processing" },
  completed: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Completed" },
  delivered: { color: "bg-[#1a2744]/10 text-[#1a2744]", icon: CheckCircle, label: "Delivered" },
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const uploadTokenParam = params.get("uploadToken");

  const [order, setOrder] = useState<Order | null>(null);
  const [files, setFiles] = useState<OrderFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const token = getAuthToken();
        let res: Response;

        if (token) {
          res = await fetch(`/api/qb/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });
        } else if (uploadTokenParam) {
          res = await fetch(`/api/qb/orders/lookup?orderId=${id}&uploadToken=${encodeURIComponent(uploadTokenParam)}`);
        } else {
          setError("Please sign in to view order details.");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          setError("Order not found.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setOrder(data.order);
        setFiles(data.files || []);
      } catch {
        setError("Failed to load order.");
      }
      setLoading(false);
    }
    fetchOrder();
  }, [id, uploadTokenParam]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading order...</div></div>;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error || "Order not found."}</p>
          <Link href="/portal"><Button variant="outline">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const config = statusConfig[order.status] || statusConfig.submitted;
  const StatusIcon = config.icon;
  const progress = order.status === "completed" || order.status === "delivered" ? 100 : order.status === "processing" ? 66 : 33;

  return (
    <div>
      <section className="bg-[#1a2744] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/portal" className="text-white/50 hover:text-white/70 text-sm flex items-center gap-1 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Order ORD-{String(order.id).padStart(3, "0")}</h1>
              <p className="text-white/70 text-sm">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.color}`}>
              <StatusIcon className="w-4 h-4 inline mr-1" />
              {config.label}
            </span>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#f5f7fa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-[#1a2744] mb-4">Order Progress</h2>
              <div className="h-3 rounded-full bg-muted overflow-hidden mb-2">
                <div className="h-full rounded-full bg-[#f0a500] transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className={order.status !== "submitted" ? "text-[#1a2744] font-medium" : "text-[#f0a500] font-medium"}>Submitted</span>
                <span className={order.status === "processing" ? "text-[#f0a500] font-medium" : order.status === "completed" || order.status === "delivered" ? "text-[#1a2744] font-medium" : ""}>Processing</span>
                <span className={order.status === "completed" || order.status === "delivered" ? "text-[#f0a500] font-medium" : ""}>Completed</span>
                <span className={order.status === "delivered" ? "text-[#f0a500] font-medium" : ""}>Delivered</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-[#1a2744] mb-4">Service Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{order.serviceName}</span>
                  </div>
                  {order.addons && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Add-ons</span>
                      <span className="font-medium text-right">{order.addons}</span>
                    </div>
                  )}
                  {order.qbVersion && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">QB Version</span>
                      <span className="font-medium">{order.qbVersion}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-[#f0a500]">${order.totalCad} CAD</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-[#1a2744] mb-4">Files</h2>
                {files.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No files attached to this order.</p>
                ) : (
                  <div className="space-y-3">
                    {files.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#f0a500]" />
                          <div>
                            <p className="text-sm font-medium">{f.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {f.fileSizeBytes ? `${(f.fileSizeBytes / 1024 / 1024).toFixed(1)} MB` : ""} &bull; {f.fileType.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        {(order.status === "completed" || order.status === "delivered") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => {
                              const token = getAuthToken();
                              let url = `/api/qb/orders/${order.id}/files/${f.id}/download`;
                              if (!token && uploadTokenParam) {
                                url += `?uploadToken=${encodeURIComponent(uploadTokenParam)}`;
                              }
                              window.open(url, "_blank");
                            }}
                          >
                            <Download className="w-3 h-3" /> Download
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-[#f0a500]" />
                  Files retained for 7 days after delivery, then permanently deleted.
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">Need help with this order?</p>
              <Link href="/portal">
                <Button variant="outline">Open Support Ticket</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
