import { useState, useEffect, useMemo } from "react";
import { useSearch } from "wouter";
import { Shield, Lock } from "lucide-react";
import { useAuth, getAuthToken } from "@/lib/auth";
import { loadProducts, type ProductCatalog, formatPrice, getActivePrice } from "@/lib/products";
import { SEO } from "@/components/seo";
import OrderComplete from "@/pages/order-complete";
import OrderForm from "@/pages/order-form";

interface SvcOption { id: number; name: string; price: number; }

export default function Order() {
  const { user } = useAuth();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const preselectedService = params.get("service");
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(preselectedService ? parseInt(preselectedService) : null);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [fileWarning, setFileWarning] = useState("");
  const [qbVersion, setQbVersion] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => { loadProducts().then(setCatalog); }, []);

  const { services, addons } = useMemo(() => {
    if (!catalog) return { services: [] as SvcOption[], addons: [] as SvcOption[] };
    return {
      services: catalog.services.filter((p) => !p.is_addon).map((p) => ({ id: p.id, name: p.name, price: getActivePrice(p) })),
      addons: catalog.services.filter((p) => p.is_addon).map((p) => ({ id: p.id, name: p.name, price: getActivePrice(p) })),
    };
  }, [catalog]);

  const selectedSvc = services.find((s) => s.id === selectedService);
  const isAvailableService = !!selectedSvc;

  const total = useMemo(() => {
    let sum = selectedSvc?.price || 0;
    for (const addonId of selectedAddons) {
      const addon = addons.find((a) => a.id === addonId);
      if (addon) sum += addon.price;
    }
    return sum;
  }, [selectedSvc, selectedAddons, addons]);

  const canSubmit = isAvailableService && !!file && !!qbVersion && confirmed && !!name && !!email;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileError(""); setFileWarning("");
    if (!f) { setFile(null); return; }
    if (!f.name.toLowerCase().endsWith(".qbm")) { setFileError("Only .QBM files accepted."); setFile(null); return; }
    if (f.size > 500 * 1024 * 1024) { setFileError("File exceeds 500 MB limit."); setFile(null); return; }
    if (f.size > 100 * 1024 * 1024) { setFileWarning("Large file detected (>100 MB). Processing may take longer."); }
    setFile(f);
  };

  const toggleAddon = (id: number) => {
    setSelectedAddons((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedSvc) return;
    setSubmitting(true); setSubmitError("");
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/qb/checkout/create-session", {
        method: "POST", headers, credentials: "include",
        body: JSON.stringify({ serviceId: selectedService, addonIds: selectedAddons, qbVersion, customerName: name, customerEmail: email, customerPhone: phone || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");
      const createdOrderId = data.order?.id || data.orderId || null;
      setOrderId(createdOrderId);
      if (file && createdOrderId) {
        const formData = new FormData(); formData.append("file", file);
        const uploadHeaders: Record<string, string> = {};
        if (token) uploadHeaders["Authorization"] = `Bearer ${token}`;
        if (data.uploadToken) uploadHeaders["X-Upload-Token"] = data.uploadToken;
        const uploadRes = await fetch(`/api/qb/orders/${createdOrderId}/files`, { method: "POST", headers: uploadHeaders, credentials: "include", body: formData });
        if (!uploadRes.ok) { const ud = await uploadRes.json().catch(() => ({})); throw new Error(ud.error || "File upload failed."); }
      }
      if (data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
      setOrderComplete(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setSubmitting(false); }
  };

  if (!catalog) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;

  if (orderComplete) {
    return <OrderComplete orderId={orderId} serviceName={selectedSvc?.name} addonNames={selectedAddons.map((id) => addons.find((a) => a.id === id)?.name || "")} total={total} fileName={file?.name} email={email} />;
  }

  return (
    <div>
      <SEO title="Place Your Order" description="Select your QuickBooks service, upload your file, and pay securely." path="/order" noIndex />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">Place Your Order</h1>
          <p className="text-white/70 text-lg">Select your service, upload your file, and pay securely</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-white/50">
            <span className="flex items-center gap-1"><Lock className="w-4 h-4 text-accent" /> 256-bit Encrypted</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-accent" /> PIPEDA Compliant</span>
          </div>
        </div>
      </section>
      <div className="brand-divider" />
      <section className="py-12 section-brand-light">
        <div className="max-w-3xl mx-auto px-4">
          <OrderForm
            services={services} addons={addons}
            selectedService={selectedService} setSelectedService={setSelectedService}
            selectedAddons={selectedAddons} toggleAddon={toggleAddon}
            isAvailableService={isAvailableService}
            file={file} fileError={fileError} fileWarning={fileWarning} handleFileChange={handleFileChange}
            qbVersion={qbVersion} setQbVersion={setQbVersion}
            confirmed={confirmed} setConfirmed={setConfirmed}
            name={name} setName={setName} email={email} setEmail={setEmail} phone={phone} setPhone={setPhone}
            total={total} submitting={submitting} submitError={submitError} canSubmit={canSubmit} onSubmit={handleSubmit}
          />
        </div>
      </section>
    </div>
  );
}
