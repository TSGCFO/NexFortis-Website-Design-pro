import { useState, useEffect } from "react";
import { Link, useParams, useSearch } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Clock, CheckCircle, Download, FileText, Shield, AlertCircle } from "lucide-react";
import { SEO } from "@/components/seo";
import { getApiBase } from "@/lib/api-base";

interface OrderFile {
  id: number;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  uploadedAt: string;
  expired?: boolean;
  storagePath?: string | null;
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
  submitted: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock, label: "Submitted" },
  pending_payment: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock, label: "Pending Payment" },
  paid: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle, label: "Paid" },
  processing: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Package, label: "Processing" },
  completed: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle, label: "Completed" },
  delivered: { color: "bg-accent/10 text-accent", icon: CheckCircle, label: "Delivered" },
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const uploadTokenParam = params.get("uploadToken");
  const { getAccessToken, session } = useAuth();
  const isAuthenticated = !!session;

  const [order, setOrder] = useState<Order | null>(null);
  const [files, setFiles] = useState<OrderFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const token = await getAccessToken();
        let res: Response;

        // Prefer uploadToken when present (e.g. post-checkout success URL for
        // guest orders) so that even an authenticated user with no claim on
        // the order can still see their own guest purchase confirmation.
        if (uploadTokenParam) {
          res = await fetch(`${getApiBase()}/api/qb/orders/lookup?orderId=${id}&uploadToken=${encodeURIComponent(uploadTokenParam)}`);
          if (!res.ok && token) {
            res = await fetch(`${getApiBase()}/api/qb/orders/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        } else if (token) {
          res = await fetch(`${getApiBase()}/api/qb/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
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
  }, [id, uploadTokenParam, getAccessToken]);

  const handleDownload = async (fileItem: OrderFile) => {
    if (!order) return;
    if (fileItem.expired || !fileItem.storagePath) return;
    setDownloading(fileItem.id);
    try {
      const token = await getAccessToken();
      const url = `${getApiBase()}/api/qb/orders/${order.id}/files/${fileItem.id}/download`;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (uploadTokenParam) headers["X-Upload-Token"] = uploadTokenParam;

      const response = await fetch(url, { headers });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("Download failed:", errData.error || response.statusText);
        return;
      }
      const data = await response.json();
      if (data.signedUrl) {
        const link = document.createElement("a");
        link.href = data.signedUrl;
        link.download = fileItem.fileName;
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloading(null);
    }
  };

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
  const progress = order.status === "completed" || order.status === "delivered" ? 100 : order.status === "processing" ? 66 : order.status === "paid" ? 50 : 33;

  return (
    <div>
      <SEO title={`Order ORD-${String(order.id).padStart(3, "0")}`} description="View your order status and details." path={`/order/${order.id}`} noIndex />
      <section className="section-brand-navy py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/portal" className="text-white/50 hover:text-white/70 text-sm flex items-center gap-1 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-display text-white">Order ORD-{String(order.id).padStart(3, "0")}</h1>
              <p className="text-white/70 text-sm">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.color}`}>
              <StatusIcon className="w-4 h-4 inline mr-1" />
              {config.label}
            </span>
          </div>
        </div>
      </section>

      <div className="brand-divider" />

      <section className="py-8 section-brand-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold font-display text-primary mb-4">Order Progress</h2>
              <div className="h-3 rounded-full bg-muted overflow-hidden mb-2">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className={order.status !== "submitted" && order.status !== "pending_payment" ? "text-primary font-medium" : "text-accent font-medium"}>Submitted</span>
                <span className={order.status === "paid" ? "text-accent font-medium" : order.status === "processing" || order.status === "completed" || order.status === "delivered" ? "text-primary font-medium" : ""}>Paid</span>
                <span className={order.status === "processing" ? "text-accent font-medium" : order.status === "completed" || order.status === "delivered" ? "text-primary font-medium" : ""}>Processing</span>
                <span className={order.status === "completed" || order.status === "delivered" ? "text-accent font-medium" : ""}>Completed</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold font-display text-primary mb-4">Service Details</h2>
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
                    <span className="font-bold text-accent">${(order.totalCad / 100).toFixed(2)} CAD</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold font-display text-primary mb-4">Files</h2>
                {files.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No files attached to this order.</p>
                ) : (
                  <div className="space-y-3">
                    {files.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-sm font-medium">{f.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {f.fileSizeBytes ? `${(f.fileSizeBytes / 1024 / 1024).toFixed(1)} MB` : ""} &bull; {f.fileType.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        {f.expired ? (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span className="text-xs">Expired — deleted after 7 days</span>
                          </div>
                        ) : !f.storagePath ? (
                          <span className="text-xs text-muted-foreground">File unavailable</span>
                        ) : isAuthenticated ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            disabled={downloading === f.id}
                            onClick={() => handleDownload(f)}
                          >
                            <Download className="w-3 h-3" /> {downloading === f.id ? "..." : "Download"}
                          </Button>
                        ) : (
                          <Link href={`/login?returnTo=${encodeURIComponent(`/qb-portal/order/${id}${uploadTokenParam ? `?uploadToken=${encodeURIComponent(uploadTokenParam)}` : ""}`)}`}>
                            <span className="text-xs text-accent hover:underline cursor-pointer flex items-center gap-1">
                              <Download className="w-3 h-3" /> Sign in to download
                            </span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-accent" />
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
