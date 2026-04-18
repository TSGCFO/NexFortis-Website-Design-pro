import { useState, useEffect, useMemo } from "react";
import { useSearch } from "wouter";
import { Shield, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { loadProducts, type ProductCatalog, type Product, formatPrice, getActivePrice, getProductById } from "@/lib/products";
import { SEO } from "@/components/seo";
import OrderComplete from "@/pages/order-complete";
import OrderForm, { type AppliedPromo } from "@/pages/order-form";

interface SvcOption { id: number; name: string; price: number; }

export default function Order() {
  const { user, getAccessToken } = useAuth();
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
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoApplying, setPromoApplying] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [subscriberDiscountPercent, setSubscriberDiscountPercent] = useState<number>(0);

  useEffect(() => { loadProducts().then(setCatalog); }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!user) { setSubscriberDiscountPercent(0); return; }
        const token = await getAccessToken();
        if (!token) return;
        const base = import.meta.env.BASE_URL || "/";
        const prefix = base.endsWith("/") ? base.slice(0, -1) : base;
        const url = prefix.replace(/\/qb-portal$/, "") + "/api/qb/subscriptions/me";
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setSubscriberDiscountPercent(Number(data?.subscription?.discountPercent) || 0);
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [user, getAccessToken]);

  const { services, addons } = useMemo(() => {
    if (!catalog) return { services: [] as SvcOption[], addons: [] as SvcOption[] };
    return {
      services: catalog.services.filter((p) => !p.is_addon).map((p) => ({ id: p.id, name: p.name, price: getActivePrice(p) })),
      addons: catalog.services.filter((p) => p.is_addon).map((p) => ({ id: p.id, name: p.name, price: getActivePrice(p) })),
    };
  }, [catalog]);

  const selectedProduct: Product | undefined = catalog && selectedService ? getProductById(catalog, selectedService) : undefined;

  const selectedSvc = services.find((s) => s.id === selectedService);
  const isAvailableService = !!selectedSvc;

  const requiresFileUpload = selectedProduct
    ? selectedProduct.accepted_file_types.length > 0
    : false;

  const isVolumePack = selectedProduct?.category_slug === "volume-packs";
  const isSubscription = selectedProduct?.billing_type === "subscription";
  const showFileUpload = requiresFileUpload && !isVolumePack && !isSubscription;

  const acceptedFileTypes = selectedProduct?.accepted_file_types ?? [];
  const acceptAttr = acceptedFileTypes.length > 0
    ? acceptedFileTypes.map(t => `${t},${t.toUpperCase()}`).join(",")
    : undefined;

  const total = useMemo(() => {
    let sum = selectedSvc?.price || 0;
    for (const addonId of selectedAddons) {
      const addon = addons.find((a) => a.id === addonId);
      if (addon) sum += addon.price;
    }
    return sum;
  }, [selectedSvc, selectedAddons, addons]);

  const subscriberDiscountCents = useMemo(() => {
    if (!subscriberDiscountPercent || subscriberDiscountPercent <= 0) return 0;
    if (isSubscription) return 0;
    return Math.floor((total * subscriberDiscountPercent) / 100);
  }, [total, subscriberDiscountPercent, isSubscription]);

  const canSubmit = isAvailableService
    && (showFileUpload ? !!file : true)
    && (showFileUpload ? !!qbVersion : true)
    && confirmed
    && !!name
    && !!email;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileError(""); setFileWarning("");
    if (!f) { setFile(null); return; }

    const ext = f.name.toLowerCase().split(".").pop() || "";
    const dotExt = `.${ext}`;
    if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(dotExt)) {
      setFileError(`Only ${acceptedFileTypes.join(", ")} files accepted.`);
      setFile(null);
      return;
    }
    if (f.size > 500 * 1024 * 1024) { setFileError("File exceeds 500 MB limit."); setFile(null); return; }
    if (f.size > 100 * 1024 * 1024) { setFileWarning("Large file detected (>100 MB). Processing may take longer."); }
    setFile(f);
  };

  const handleServiceChange = (id: number) => {
    setSelectedService(id);
    setFile(null);
    setFileError("");
    setFileWarning("");
  };

  const toggleAddon = (id: number) => {
    setSelectedAddons((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  const orderItemsForPromo = () => {
    const items: { productId: string; quantity: number; unitPriceCents: number }[] = [];
    if (selectedSvc) items.push({ productId: String(selectedSvc.id), quantity: 1, unitPriceCents: selectedSvc.price });
    for (const id of selectedAddons) {
      const a = addons.find((x) => x.id === id);
      if (a) items.push({ productId: String(a.id), quantity: 1, unitPriceCents: a.price });
    }
    return items;
  };

  const handleApplyPromo = async () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code.length < 6 || !selectedSvc) return;
    setPromoError(""); setPromoApplying(true);
    try {
      const res = await fetch("/api/qb/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          orderItems: orderItemsForPromo(),
          orderType: "one_time",
          userId: user?.id,
          guestEmail: user ? undefined : email,
        }),
      });
      const data = await res.json();
      if (!data.valid) {
        setPromoError(data.errorMessage || "This promo code is not valid.");
        setAppliedPromo(null);
        return;
      }
      setAppliedPromo({
        code: data.code || code,
        discountAmountCents: data.discountAmountCents,
        launchPromoDiscountCents: data.launchPromoDiscountCents || 0,
        finalOrderTotalCents: data.finalOrderTotalCents,
        previewLineItems: data.previewLineItems || [],
        codeDescription: data.codeDescription || "Discount",
        stackingNotice: data.stackingNotice,
      });
    } catch {
      setPromoError("Unable to apply the code right now. Please try again.");
    } finally {
      setPromoApplying(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedSvc) return;
    setSubmitting(true); setSubmitError("");
    try {
      const token = await getAccessToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const isFree = !!appliedPromo && appliedPromo.finalOrderTotalCents === 0;
      const res = await fetch("/api/qb/checkout/create-session", {
        method: "POST", headers,
        body: JSON.stringify({
          serviceId: selectedService,
          addonIds: selectedAddons,
          qbVersion: qbVersion || null,
          customerName: name,
          customerEmail: email,
          customerPhone: phone || null,
          promoCode: appliedPromo?.code || null,
          freeOrder: isFree,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");
      const createdOrderId = data.order?.id || data.orderId || null;
      setOrderId(createdOrderId);

      // Promo redemption is now handled server-side inside /checkout/create-session.
      // No client-side /api/qb/promo/redeem call needed.

      if (file && createdOrderId && showFileUpload) {
        const formData = new FormData(); formData.append("file", file);
        const uploadHeaders: Record<string, string> = {};
        if (token) uploadHeaders["Authorization"] = `Bearer ${token}`;
        if (data.uploadToken) uploadHeaders["X-Upload-Token"] = data.uploadToken;
        const uploadRes = await fetch(`/api/qb/orders/${createdOrderId}/files`, { method: "POST", headers: uploadHeaders, body: formData });
        if (!uploadRes.ok) { const ud = await uploadRes.json().catch(() => ({})); throw new Error(ud.error || "File upload failed."); }
      }
      if (!isFree && data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
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
      <SEO title="Place Your Order" description="Select your QuickBooks service and pay securely." path="/order" noIndex />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">Place Your Order</h1>
          <p className="text-white/70 text-lg">Select your service and pay securely</p>
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
            selectedService={selectedService} setSelectedService={handleServiceChange}
            selectedAddons={selectedAddons} toggleAddon={toggleAddon}
            isAvailableService={isAvailableService}
            showFileUpload={showFileUpload}
            isVolumePack={isVolumePack}
            isSubscription={isSubscription}
            selectedProduct={selectedProduct}
            acceptAttr={acceptAttr}
            file={file} fileError={fileError} fileWarning={fileWarning} handleFileChange={handleFileChange}
            qbVersion={qbVersion} setQbVersion={setQbVersion}
            confirmed={confirmed} setConfirmed={setConfirmed}
            name={name} setName={setName} email={email} setEmail={setEmail} phone={phone} setPhone={setPhone}
            total={total} submitting={submitting} submitError={submitError} canSubmit={canSubmit} onSubmit={handleSubmit}
            promoCodeInput={promoCodeInput}
            setPromoCodeInput={setPromoCodeInput}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
            appliedPromo={appliedPromo}
            promoApplying={promoApplying}
            promoError={promoError}
            subscriberDiscountPercent={subscriberDiscountPercent || undefined}
            subscriberDiscountCents={subscriberDiscountCents || undefined}
          />
        </div>
      </section>
    </div>
  );
}
