import { useState, useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Upload, Shield, Lock, AlertTriangle, Info } from "lucide-react";
import { useAuth, getAuthToken } from "@/lib/auth";
import { loadProducts, type ProductCatalog, formatPrice, getActivePrice } from "@/lib/products";
import { SEO } from "@/components/seo";

const qbVersions = ["2024", "2023", "2022", "2021", "2020", "2019"];

interface OrderableService {
  id: number;
  slug: string;
  name: string;
  price: number;
  available: boolean;
}

interface OrderableAddon {
  id: number;
  name: string;
  price: number;
  available: boolean;
}

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

  useEffect(() => {
    loadProducts().then(setCatalog);
  }, []);

  const { services, addons } = useMemo(() => {
    if (!catalog) return { services: [] as OrderableService[], addons: [] as OrderableAddon[] };
    const mainServices = catalog.services
      .filter((p) => !p.is_addon)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: getActivePrice(p),
        available: p.badge === "available",
      }));
    const serviceAddons = catalog.services
      .filter((p) => p.is_addon)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: getActivePrice(p),
        available: p.badge === "available",
      }));
    return { services: mainServices, addons: serviceAddons };
  }, [catalog]);

  const selectedSvc = services.find((s) => s.id === selectedService);
  const isAvailableService = selectedSvc?.available;

  const total = useMemo(() => {
    let sum = 0;
    if (selectedSvc) sum += selectedSvc.price;
    for (const addonId of selectedAddons) {
      const addon = addons.find((a) => a.id === addonId);
      if (addon) sum += addon.price;
    }
    return sum;
  }, [selectedSvc, selectedAddons, addons]);

  const canSubmit = isAvailableService && file && qbVersion && confirmed && name && email;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileError("");
    setFileWarning("");
    if (!f) { setFile(null); return; }

    if (!f.name.toLowerCase().endsWith(".qbm")) {
      setFileError("Only .QBM (Portable Company File) files are accepted. Please upload a .QBM file.");
      setFile(null);
      return;
    }

    if (f.size > 500 * 1024 * 1024) {
      setFileError("File exceeds 500 MB limit. Please contact us for alternative delivery options.");
      setFile(null);
      return;
    }

    if (f.size > 100 * 1024 * 1024) {
      setFileWarning("Large file detected (>100 MB). Processing may take longer than usual.");
    }

    setFile(f);
  };

  const toggleAddon = (id: number) => {
    setSelectedAddons((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedSvc) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const token = getAuthToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const orderPayload = {
        serviceId: selectedService,
        addonIds: selectedAddons,
        qbVersion,
        customerName: name,
        customerEmail: email,
        customerPhone: phone || null,
      };
      const res = await fetch("/api/qb/checkout/create-session", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      const createdOrderId = data.order?.id || data.orderId || null;
      const returnedUploadToken = data.uploadToken || null;
      setOrderId(createdOrderId);

      if (file && createdOrderId) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadHeaders: Record<string, string> = {};
        if (token) uploadHeaders["Authorization"] = `Bearer ${token}`;
        if (returnedUploadToken) uploadHeaders["X-Upload-Token"] = returnedUploadToken;

        const uploadRes = await fetch(`/api/qb/orders/${createdOrderId}/files`, {
          method: "POST",
          headers: uploadHeaders,
          credentials: "include",
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadData = await uploadRes.json().catch(() => ({}));
          throw new Error(uploadData.error || "File upload failed. Order was created but file was not attached. Please contact support.");
        }
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setOrderComplete(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!catalog) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  if (orderComplete) {
    return (
      <div>
        <section className="section-brand-navy py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold font-display text-white mb-4">Order Submitted</h1>
          </div>
        </section>
        <div className="brand-divider" />
        <section className="py-16 section-brand-light">
          <div className="max-w-lg mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-display text-primary mb-2">Thank You!</h2>
                <p className="text-muted-foreground mb-4">Your order has been received. We'll begin processing shortly.</p>
                {orderId && <p className="text-sm font-medium text-primary mb-3">Order ID: ORD-{String(orderId).padStart(3, "0")}</p>}
                <div className="bg-muted rounded-lg p-4 text-left text-sm space-y-1">
                  <p><strong>Service:</strong> {selectedSvc?.name}</p>
                  {selectedAddons.length > 0 && (
                    <p><strong>Add-ons:</strong> {selectedAddons.map((id) => addons.find((a) => a.id === id)?.name).join(", ")}</p>
                  )}
                  <p><strong>Total:</strong> {formatPrice(total)}</p>
                  <p><strong>File:</strong> {file?.name}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-4">A confirmation email will be sent to {email}</p>
                <div className="mt-6">
                  <Link href="/portal">
                    <Button className="bg-navy text-white hover:bg-navy/90 font-display">Go to Dashboard</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold font-display text-primary mb-4">1. Your Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background tex