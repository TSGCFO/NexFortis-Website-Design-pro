import { useState, useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Upload, Shield, Lock, AlertTriangle, Info } from "lucide-react";
import { useAuth, getAuthToken } from "@/lib/auth";
import { loadProducts, type ProductCatalog } from "@/lib/products";

const qbVersions = ["2024", "2023", "2022", "2021", "2020", "2019"];

interface OrderableService {
  id: number;
  slug: string;
  name: string;
  price: number;
  available: boolean;
  target?: string;
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
        price: p.price_cad || 0,
        available: p.badge === "available",
        target: p.badge === "coming-soon" ? "Coming Soon" : undefined,
      }));
    const serviceAddons = catalog.services
      .filter((p) => p.is_addon)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price_cad || 0,
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
        <section className="bg-[#1a2744] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Order Submitted</h1>
          </div>
        </section>
        <section className="py-16 bg-[#f5f7fa]">
          <div className="max-w-lg mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-[#28a745] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#1a2744] mb-2">Thank You!</h2>
                <p className="text-muted-foreground mb-4">Your order has been received. We'll begin processing shortly.</p>
                {orderId && <p className="text-sm font-medium text-[#1a2744] mb-3">Order ID: ORD-{String(orderId).padStart(3, "0")}</p>}
                <div className="bg-muted rounded-lg p-4 text-left text-sm space-y-1">
                  <p><strong>Service:</strong> {selectedSvc?.name}</p>
                  {selectedAddons.length > 0 && (
                    <p><strong>Add-ons:</strong> {selectedAddons.map((id) => addons.find((a) => a.id === id)?.name).join(", ")}</p>
                  )}
                  <p><strong>Total:</strong> ${total} CAD</p>
                  <p><strong>File:</strong> {file?.name}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-4">A confirmation email will be sent to {email}</p>
                <div className="mt-6">
                  <Link href="/portal">
                    <Button className="bg-[#1a2744]">Go to Dashboard</Button>
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
      <section className="bg-[#1a2744] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Place Your Order</h1>
          <p className="text-white/70 text-lg">Select your service, upload your file, and pay securely</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-white/50">
            <span className="flex items-center gap-1"><Lock className="w-4 h-4 text-[#f0a500]" /> 256-bit Encrypted</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-[#f0a500]" /> PIPEDA Compliant</span>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#f5f7fa]">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-[#1a2744] mb-4">1. Your Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Phone (optional)</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-[#1a2744] mb-4">2. Select Service</h2>
                <div className="space-y-3">
                  {services.map((svc) => (
                    <label
                      key={svc.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                        !svc.available ? "opacity-50 cursor-not-allowed bg-muted" :
                        selectedService === svc.id ? "border-[#f0a500] bg-[#f0a500]/5 cursor-pointer" : "border-border hover:border-[#f0a500]/30 cursor-pointer"
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        checked={selectedService === svc.id}
                        onChange={() => svc.available && setSelectedService(svc.id)}
                        disabled={!svc.available}
                        className="accent-[#f0a500]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{svc.name}</span>
                          {!svc.available && (
                            <span className="px-2 py-0.5 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-semibold">{svc.target}</span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-[#f0a500]">${svc.price} CAD</span>
                      {!svc.available && (
                        <Link href={`/waitlist?product=${svc.slug}`} className="text-xs text-[#ff6b35] underline" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                          Join Waitlist
                        </Link>
                      )}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {isAvailableService && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-[#1a2744] mb-4">3. Add-Ons</h2>
                  <div className="space-y-3">
                    {addons.map((addon) => (
                      <label
                        key={addon.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                          !addon.available ? "opacity-50 cursor-not-allowed bg-muted" :
                          selectedAddons.includes(addon.id) ? "border-[#f0a500] bg-[#f0a500]/5 cursor-pointer" : "border-border hover:border-[#f0a500]/30 cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.id)}
                          onChange={() => addon.available && toggleAddon(addon.id)}
                          disabled={!addon.available}
                          className="accent-[#f0a500]"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-sm">{addon.name}</span>
                          {!addon.available && <span className="ml-2 px-2 py-0.5 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-semibold">Coming Soon</span>}
                        </div>
                        <span className="font-bold text-[#f0a500]">+${addon.price} CAD</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-[#1a2744] mb-4">{isAvailableService ? "4" : "3"}. Upload Your .QBM File</h2>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <div className="mb-3">
                    <label htmlFor="qbm-file" className="cursor-pointer">
                      <span className="text-[#f0a500] font-medium hover:underline">Choose a .QBM file</span>
                      <input
                        id="qbm-file"
                        type="file"
                        accept=".qbm,.QBM"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-muted-foreground ml-1">or drag and drop</span>
                  </div>
                  {file && (
                    <div className="flex items-center gap-2 justify-center text-sm">
                      <CheckCircle className="w-4 h-4 text-[#28a745]" />
                      <span className="font-medium">{file.name}</span>
                      <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                  )}
                  {fileError && <p className="text-sm text-red-500 mt-2 flex items-center gap-1 justify-center"><AlertTriangle className="w-4 h-4" /> {fileError}</p>}
                  {fileWarning && <p className="text-sm text-amber-600 mt-2 flex items-center gap-1 justify-center"><Info className="w-4 h-4" /> {fileWarning}</p>}
                  <p className="text-xs text-muted-foreground mt-3">Max file size: 500 MB &bull; Only .QBM files accepted &bull; <Link href="/qbm-guide" className="text-[#f0a500]">How to create a .QBM file</Link></p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-[#1a2744] mb-4">{isAvailableService ? "5" : "4"}. QuickBooks Version</h2>
                <select
                  value={qbVersion}
                  onChange={(e) => setQbVersion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#f0a500]/50"
                >
                  <option value="">Select your QuickBooks Enterprise version year</option>
                  {qbVersions.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-[#1a2744] mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  {selectedSvc && (
                    <div className="flex justify-between">
                      <span>{selectedSvc.name}</span>
                      <span className="font-semibold">${selectedSvc.price} CAD</span>
                    </div>
                  )}
                  {selectedAddons.map((id) => {
                    const addon = addons.find((a) => a.id === id);
                    return addon ? (
                      <div key={id} className="flex justify-between text-muted-foreground">
                        <span>{addon.name}</span>
                        <span>+${addon.price} CAD</span>
                      </div>
                    ) : null;
                  })}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#f0a500]">${total} CAD</span>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-1 accent-[#f0a500]"
                    />
                    <span className="text-sm text-muted-foreground">
                      I confirm this is a Canadian QuickBooks Enterprise file and I agree to the{" "}
                      <Link href="/terms" className="text-[#f0a500] underline">Terms of Service</Link> and{" "}
                      <Link href="/privacy" className="text-[#f0a500] underline">Privacy Policy</Link>.
                    </span>
                  </label>
                </div>

                <div className="mt-6" id="stripe-payment-element">
                  <div className="p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground">
                    <Lock className="w-5 h-5 mx-auto mb-2 text-[#f0a500]" />
                    Stripe payment integration — test mode
                  </div>
                </div>

                {submitError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="w-full mt-6 bg-[#B76E79] text-white hover:bg-[#A35D68] font-bold text-lg py-3"
                  size="lg"
                >
                  {submitting ? "Processing..." : `Upload & Pay $${total} CAD`}
                </Button>

                <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Encrypted</span>
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> PIPEDA</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Money-back guarantee</span>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </div>
  );
}
