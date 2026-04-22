import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { adminFetch } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RefreshCw } from "lucide-react";

const TYPES = [
  { value: "percentage", label: "Percentage off" },
  { value: "fixed_amount", label: "Fixed amount off (CAD)" },
  { value: "free_service", label: "Free service (100% off)" },
  { value: "subscription", label: "Subscription (recurring discount)" },
];

const CATEGORIES = [
  { id: "quickbooks-conversion", label: "QuickBooks Conversion" },
  { id: "quickbooks-data-services", label: "Data Services" },
  { id: "platform-migrations", label: "Platform Migrations" },
  { id: "expert-support", label: "Expert Support" },
  { id: "volume-packs", label: "Volume Packs" },
];

interface CatalogProduct {
  id: number;
  name: string;
  category_slug: string;
}

function generateRandomCode(): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += charset[Math.floor(Math.random() * charset.length)];
  }
  return code;
}

function NewPromoCodeContent() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");
  const [percentOff, setPercentOff] = useState("10");
  const [amountOffDollars, setAmountOffDollars] = useState("25");
  const [subscriptionDurationMonths, setSubscriptionDurationMonths] = useState("3");

  const [unlimitedUses, setUnlimitedUses] = useState(true);
  const [maxUses, setMaxUses] = useState("100");
  const [unlimitedPerCustomer, setUnlimitedPerCustomer] = useState(false);
  const [maxUsesPerCustomer, setMaxUsesPerCustomer] = useState("1");

  const [neverExpires, setNeverExpires] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [minOrderDollars, setMinOrderDollars] = useState("");
  const [firstTimeCustomerOnly, setFirstTimeCustomerOnly] = useState(false);
  const [restrictedToEmail, setRestrictedToEmail] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const base = import.meta.env.BASE_URL || "/";
    fetch(`${base}products.json`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.services)) setProducts(data.services);
      })
      .catch(() => {});
  }, []);

  const productsByCategory = useMemo(() => {
    const map: Record<string, CatalogProduct[]> = {};
    for (const p of products) {
      const k = p.category_slug || "other";
      if (!map[k]) map[k] = [];
      map[k].push(p);
    }
    return map;
  }, [products]);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!code || code.length < 6 || code.length > 32) e.code = "Code must be 6–32 characters.";
    if (code && !/^[A-Za-z0-9_-]+$/.test(code)) e.code = "Letters, numbers, underscore, and hyphen only.";
    if (type === "percentage") {
      const n = Number(percentOff);
      if (!Number.isFinite(n) || n < 1 || n > 100) e.value = "Percent off must be 1–100.";
    } else if (type === "fixed_amount") {
      const n = Number(amountOffDollars);
      if (!Number.isFinite(n) || n <= 0) e.value = "Amount off must be greater than 0.";
    } else if (type === "subscription") {
      const m = Number(subscriptionDurationMonths);
      if (!Number.isFinite(m) || m < 1 || m > 36) e.duration = "Duration must be 1–36 months.";
      const n = Number(percentOff);
      if (!Number.isFinite(n) || n < 1 || n > 100) e.value = "Percent off must be 1–100.";
    } else if (type === "free_service") {
      if (selectedProducts.length === 0 && selectedCategories.length === 0) {
        e.restriction = "Free service codes require at least one product or category restriction.";
      }
    }
    if (!unlimitedUses) {
      const n = Number(maxUses);
      if (!Number.isFinite(n) || n < 1) e.maxUses = "Max uses must be at least 1.";
    }
    if (!unlimitedPerCustomer) {
      const n = Number(maxUsesPerCustomer);
      if (!Number.isFinite(n) || n < 1) e.maxUsesPerCustomer = "Per-customer limit must be at least 1.";
    }
    if (!neverExpires && !expiresAt) e.expiresAt = "Pick an expiry date or check 'never expires'.";
    if (minOrderDollars) {
      const n = Number(minOrderDollars);
      if (!Number.isFinite(n) || n < 0) e.minOrder = "Minimum order must be 0 or greater.";
    }
    if (restrictedToEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(restrictedToEmail)) {
      e.restrictedToEmail = "Enter a valid email address.";
    }
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setServerError("");
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        code: code.trim(),
        type,
        maxUses: unlimitedUses ? null : Math.floor(Number(maxUses)),
        maxUsesPerCustomer: unlimitedPerCustomer ? null : Math.floor(Number(maxUsesPerCustomer)),
        expiresAt: neverExpires ? null : new Date(expiresAt).toISOString(),
        productIds: selectedProducts.length > 0 ? selectedProducts : null,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : null,
        minOrderAmountCents: minOrderDollars ? Math.round(Number(minOrderDollars) * 100) : null,
        firstTimeCustomerOnly,
        restrictedToEmail: restrictedToEmail.trim() || null,
        description: description.trim() || null,
      };
      if (type === "percentage" || type === "subscription" || type === "free_service") {
        payload.percentOff = type === "free_service" ? 100 : Math.floor(Number(percentOff));
      }
      if (type === "fixed_amount") {
        payload.amountOffCents = Math.round(Number(amountOffDollars) * 100);
      }
      if (type === "subscription") {
        payload.subscriptionDurationMonths = Math.floor(Number(subscriptionDurationMonths));
      }

      const res = await adminFetch("/promo-codes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setServerError(err.error || "Failed to create promo code.");
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      toast({ title: "Promo code created", description: `Code ${data.promoCode.code} is now active.` });
      navigate(`/admin/promo-codes/${data.promoCode.id}`);
    } catch {
      setServerError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  function toggleArrayValue(arr: string[], v: string, set: (a: string[]) => void) {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/promo-codes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0A1628] mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to promo codes
      </Link>
      <h1
        className="text-2xl md:text-3xl font-bold text-[#0A1628] mb-6"
        style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
      >
        Create Promo Code
      </h1>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">{serverError}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-6 bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
        <Section title="Code">
          <Field label="Code string" error={errors.code}>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. PARTNER20"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79]"
              />
              <button
                type="button"
                onClick={() => setCode(generateRandomCode())}
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Auto-generate
              </button>
            </div>
          </Field>
          <Field label="Description (internal notes)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79]"
            />
          </Field>
        </Section>

        <Section title="Discount type & value">
          <Field label="Type">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79]"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </Field>

          {type === "percentage" && (
            <Field label="Percent off (1–100)" error={errors.value}>
              <input type="number" min={1} max={100} value={percentOff} onChange={(e) => setPercentOff(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </Field>
          )}

          {type === "fixed_amount" && (
            <Field label="Amount off (CAD dollars)" error={errors.value}>
              <input type="number" min={0.01} step="0.01" value={amountOffDollars} onChange={(e) => setAmountOffDollars(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </Field>
          )}

          {type === "subscription" && (
            <>
              <Field label="Percent off (1–100)" error={errors.value}>
                <input type="number" min={1} max={100} value={percentOff} onChange={(e) => setPercentOff(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </Field>
              <Field label="Duration (months, 1–36)" error={errors.duration}>
                <input type="number" min={1} max={36} value={subscriptionDurationMonths} onChange={(e) => setSubscriptionDurationMonths(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </Field>
            </>
          )}

          {type === "free_service" && (
            <p className="text-sm text-gray-500">Free service codes require at least one product or category restriction (set below).</p>
          )}
        </Section>

        <Section title="Usage limits">
          <Field label="Total uses">
            <label className="inline-flex items-center gap-2 text-sm mb-2">
              <input type="checkbox" checked={unlimitedUses} onChange={(e) => setUnlimitedUses(e.target.checked)} />
              Unlimited
            </label>
            {!unlimitedUses && (
              <input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            )}
            {errors.maxUses && <p className="text-xs text-red-600 mt-1">{errors.maxUses}</p>}
          </Field>
          <Field label="Per-customer uses">
            <label className="inline-flex items-center gap-2 text-sm mb-2">
              <input type="checkbox" checked={unlimitedPerCustomer} onChange={(e) => setUnlimitedPerCustomer(e.target.checked)} />
              Unlimited per customer
            </label>
            {!unlimitedPerCustomer && (
              <input type="number" min={1} value={maxUsesPerCustomer} onChange={(e) => setMaxUsesPerCustomer(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            )}
            {errors.maxUsesPerCustomer && <p className="text-xs text-red-600 mt-1">{errors.maxUsesPerCustomer}</p>}
          </Field>
        </Section>

        <Section title="Expiry">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={neverExpires} onChange={(e) => setNeverExpires(e.target.checked)} />
            Never expires
          </label>
          {!neverExpires && (
            <Field label="Expiry date" error={errors.expiresAt}>
              <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </Field>
          )}
        </Section>

        <Section title="Product restrictions">
          <p className="text-xs text-gray-500 mb-3">Leave both empty to apply to all products.</p>
          {errors.restriction && <p className="text-xs text-red-600 mb-2">{errors.restriction}</p>}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Categories</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleArrayValue(selectedCategories, c.id, setSelectedCategories)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedCategories.includes(c.id)
                      ? "bg-[#0A1628] text-white border-[#0A1628]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Specific products</p>
            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto p-3 space-y-3">
              {Object.entries(productsByCategory).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-xs uppercase text-gray-600 mb-1">{cat}</p>
                  {items.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-sm py-1">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(String(p.id))}
                        onChange={() => toggleArrayValue(selectedProducts, String(p.id), setSelectedProducts)}
                      />
                      <span>{p.name}</span>
                    </label>
                  ))}
                </div>
              ))}
              {products.length === 0 && <p className="text-sm text-gray-600">Loading products…</p>}
            </div>
          </div>
        </Section>

        <Section title="Other constraints">
          <Field label="Minimum order amount (CAD dollars, optional)" error={errors.minOrder}>
            <input type="number" min={0} step="0.01" value={minOrderDollars} onChange={(e) => setMinOrderDollars(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </Field>
          <Field label="Restricted to email (optional)" error={errors.restrictedToEmail}>
            <input type="email" value={restrictedToEmail} onChange={(e) => setRestrictedToEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </Field>
          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={firstTimeCustomerOnly} onChange={(e) => setFirstTimeCustomerOnly(e.target.checked)} />
              First-time customer only
            </label>
          </div>
        </Section>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/promo-codes" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#0A1628]">Cancel</Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#B76E79] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#A45D68] transition-colors disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create Code"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-[#0A1628] mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export default function AdminPromoCodeNewPage() {
  return (
    <AdminLayout>
      <NewPromoCodeContent />
    </AdminLayout>
  );
}
