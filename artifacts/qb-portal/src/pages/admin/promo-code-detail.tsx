import { useState, useEffect, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import {
  adminFetch,
  formatCurrency,
  formatDate,
  formatDateTime,
  PROMO_TYPE_LABELS,
  PROMO_STATUS_LABELS,
  PROMO_STATUS_COLORS,
  describePromoValue,
} from "@/lib/admin-api";
import { DetailPageSkeleton, ErrorBanner } from "@/components/admin-skeletons";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Save, Power, RotateCw } from "lucide-react";

interface PromoCode {
  id: number;
  code: string;
  isActive: boolean;
  type: string;
  percentOff: number | null;
  amountOffCents: number | null;
  subscriptionDurationMonths: number | null;
  maxUses: number | null;
  maxUsesPerCustomer: number | null;
  redemptionCount: number;
  expiresAt: string | null;
  productIds: string[] | null;
  categoryIds: string[] | null;
  minOrderAmountCents: number | null;
  firstTimeCustomerOnly: boolean;
  restrictedToEmail: string | null;
  description: string | null;
  stripeCouponId: string | null;
  stripePromotionCodeId: string | null;
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive" | "expired" | "exhausted";
}

interface RedemptionRow {
  id: number;
  userId: string | null;
  guestEmail: string | null;
  customerName: string | null;
  customerEmail: string | null;
  orderId: number | null;
  orderStatus: string | null;
  discountAmountCents: number;
  orderTotalBeforeCents: number;
  orderTotalAfterCents: number;
  redeemedAt: string;
}

interface AdminEvent {
  id: number;
  action: string;
  beforeState: any;
  afterState: any;
  createdAt: string;
  adminName: string | null;
  adminEmail: string | null;
}

const DIFF_LABELS: Record<string, string> = {
  isActive: "Active",
  description: "Description",
  expiresAt: "Expires at",
  maxUses: "Max uses",
  maxUsesPerCustomer: "Max uses per customer",
  minOrderAmountCents: "Minimum order",
  firstTimeCustomerOnly: "First-time only",
  restrictedToEmail: "Restricted email",
  stripePromotionCodeId: "Stripe promotion ID",
};

function formatDiffValue(key: string, v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (key === "expiresAt" && typeof v === "string") return formatDateTime(v);
  if (key === "minOrderAmountCents" && typeof v === "number") return formatCurrency(v);
  if (Array.isArray(v)) return v.length > 0 ? v.join(", ") : "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function computeDiff(before: any, after: any): Array<{ key: string; before: unknown; after: unknown }> {
  if (!before || !after) return [];
  const diffs: Array<{ key: string; before: unknown; after: unknown }> = [];
  for (const key of Object.keys(DIFF_LABELS)) {
    const bv = before[key];
    const av = after[key];
    if (JSON.stringify(bv ?? null) !== JSON.stringify(av ?? null)) {
      diffs.push({ key, before: bv, after: av });
    }
  }
  return diffs;
}

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}

function PromoCodeDetailContent() {
  const [, params] = useRoute("/admin/promo-codes/:id");
  const promoId = params?.id;
  const { toast } = useToast();

  const [data, setData] = useState<PromoCode | null>(null);
  const [redemptions, setRedemptions] = useState<RedemptionRow[]>([]);
  const [totalRedemptions, setTotalRedemptions] = useState(0);
  const [redemptionPage, setRedemptionPage] = useState(1);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editFields, setEditFields] = useState({
    description: "",
    expiresAt: "",
    neverExpires: true,
    unlimitedUses: true,
    maxUses: "",
    unlimitedPerCustomer: true,
    maxUsesPerCustomer: "",
    minOrderDollars: "",
    firstTimeCustomerOnly: false,
    restrictedToEmail: "",
  });
  const [saving, setSaving] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [confirmReactivate, setConfirmReactivate] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);

  const limit = 25;

  const fetchData = useCallback(async () => {
    if (!promoId) return;
    setLoading(true);
    setError("");
    try {
      const res = await adminFetch(`/promo-codes/${promoId}?redemptionPage=${redemptionPage}&redemptionLimit=${limit}`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      setData(d.promoCode);
      setRedemptions(d.redemptions);
      setTotalRedemptions(d.totalRedemptions);
      setEvents(d.events);
      setEditFields({
        description: d.promoCode.description ?? "",
        expiresAt: toLocalInput(d.promoCode.expiresAt),
        neverExpires: !d.promoCode.expiresAt,
        unlimitedUses: d.promoCode.maxUses == null,
        maxUses: d.promoCode.maxUses == null ? "" : String(d.promoCode.maxUses),
        unlimitedPerCustomer: d.promoCode.maxUsesPerCustomer == null,
        maxUsesPerCustomer: d.promoCode.maxUsesPerCustomer == null ? "" : String(d.promoCode.maxUsesPerCustomer),
        minOrderDollars: d.promoCode.minOrderAmountCents == null ? "" : String((d.promoCode.minOrderAmountCents / 100).toFixed(2)),
        firstTimeCustomerOnly: d.promoCode.firstTimeCustomerOnly,
        restrictedToEmail: d.promoCode.restrictedToEmail ?? "",
      });
    } catch {
      setError("Failed to load promo code.");
    } finally {
      setLoading(false);
    }
  }, [promoId, redemptionPage]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function saveEdits() {
    if (!data) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        description: editFields.description.trim() || null,
        expiresAt: editFields.neverExpires ? null : new Date(editFields.expiresAt).toISOString(),
        maxUses: editFields.unlimitedUses ? null : Math.floor(Number(editFields.maxUses)),
        maxUsesPerCustomer: editFields.unlimitedPerCustomer ? null : Math.floor(Number(editFields.maxUsesPerCustomer)),
        minOrderAmountCents: editFields.minOrderDollars ? Math.round(Number(editFields.minOrderDollars) * 100) : null,
        firstTimeCustomerOnly: editFields.firstTimeCustomerOnly,
        restrictedToEmail: editFields.restrictedToEmail.trim() || null,
      };
      const res = await adminFetch(`/promo-codes/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Save failed", description: json.error || "Unable to save changes.", variant: "destructive" });
      } else {
        toast({ title: "Changes saved", description: "Promo code updated." });
        await fetchData();
      }
    } catch {
      toast({ title: "Save failed", description: "Network error.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(targetActive: boolean) {
    if (!data) return;
    setStatusBusy(true);
    try {
      const res = targetActive
        ? await adminFetch(`/promo-codes/${data.id}`, { method: "PATCH", body: JSON.stringify({ isActive: true }) })
        : await adminFetch(`/promo-codes/${data.id}/deactivate`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Action failed", description: json.error || "Unable to update status.", variant: "destructive" });
      } else {
        const baseDescription = targetActive
          ? "Customers can use this code again."
          : "Code can no longer be redeemed.";
        toast({
          title: targetActive ? "Code reactivated" : "Code deactivated",
          description: json.warning ? `${baseDescription} ${json.warning}` : baseDescription,
          variant: json.warning ? "destructive" : undefined,
        });
        setConfirmDeactivate(false);
        setConfirmReactivate(false);
        await fetchData();
      }
    } catch {
      toast({ title: "Action failed", description: "Network error.", variant: "destructive" });
    } finally {
      setStatusBusy(false);
    }
  }

  if (loading) return <DetailPageSkeleton />;
  if (error || !data) return <ErrorBanner message={error || "Not found"} onRetry={fetchData} />;

  const totalRedemptionPages = Math.max(1, Math.ceil(totalRedemptions / limit));

  return (
    <div className="space-y-6">
      <Link href="/admin/promo-codes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0A1628]">
        <ArrowLeft className="w-4 h-4" /> Back to promo codes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-[#0A1628] font-mono"
          >
            {data.code}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PROMO_STATUS_COLORS[data.status]}`}>
              {PROMO_STATUS_LABELS[data.status]}
            </span>
            <span>·</span>
            <span>{PROMO_TYPE_LABELS[data.type]}</span>
            <span>·</span>
            <span>{describePromoValue(data)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {data.isActive ? (
            <button
              onClick={() => setConfirmDeactivate(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-700 rounded-lg text-sm hover:bg-red-50"
            >
              <Power className="w-4 h-4" /> Deactivate
            </button>
          ) : (
            <button
              onClick={() => setConfirmReactivate(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-200 text-green-700 rounded-lg text-sm hover:bg-green-50"
            >
              <RotateCw className="w-4 h-4" /> Reactivate
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-[#0A1628] mb-3">Locked configuration</h2>
          <dl className="text-sm space-y-2">
            <Row label="Type" value={PROMO_TYPE_LABELS[data.type]} />
            <Row label="Discount" value={describePromoValue(data)} />
            {data.subscriptionDurationMonths != null && <Row label="Duration" value={`${data.subscriptionDurationMonths} months`} />}
            <Row label="Categories" value={data.categoryIds?.join(", ") || "All"} />
            <Row label="Products" value={data.productIds?.join(", ") || "All"} />
            <Row label="Redemptions" value={`${data.redemptionCount}${data.maxUses != null ? ` / ${data.maxUses}` : ""}`} />
            <Row label="Created" value={formatDateTime(data.createdAt)} />
            {data.stripePromotionCodeId && <Row label="Stripe promo ID" value={<span className="font-mono text-xs">{data.stripePromotionCodeId}</span>} />}
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-[#0A1628] mb-3">Editable settings</h2>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea
                value={editFields.description}
                onChange={(e) => setEditFields((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editFields.neverExpires}
                  onChange={(e) => setEditFields((f) => ({ ...f, neverExpires: e.target.checked }))}
                />
                Never expires
              </label>
              {!editFields.neverExpires && (
                <input
                  type="datetime-local"
                  value={editFields.expiresAt}
                  onChange={(e) => setEditFields((f) => ({ ...f, expiresAt: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="inline-flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={editFields.unlimitedUses}
                    onChange={(e) => setEditFields((f) => ({ ...f, unlimitedUses: e.target.checked }))}
                  />
                  Unlimited uses
                </label>
                {!editFields.unlimitedUses && (
                  <input type="number" min={1} value={editFields.maxUses} onChange={(e) => setEditFields((f) => ({ ...f, maxUses: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                )}
              </div>
              <div>
                <label className="inline-flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={editFields.unlimitedPerCustomer}
                    onChange={(e) => setEditFields((f) => ({ ...f, unlimitedPerCustomer: e.target.checked }))}
                  />
                  Unlimited per customer
                </label>
                {!editFields.unlimitedPerCustomer && (
                  <input type="number" min={1} value={editFields.maxUsesPerCustomer} onChange={(e) => setEditFields((f) => ({ ...f, maxUsesPerCustomer: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Minimum order ($CAD)</label>
              <input type="number" step="0.01" min={0} value={editFields.minOrderDollars} onChange={(e) => setEditFields((f) => ({ ...f, minOrderDollars: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Restricted to email</label>
              <input type="email" value={editFields.restrictedToEmail} onChange={(e) => setEditFields((f) => ({ ...f, restrictedToEmail: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-2"><input type="checkbox" checked={editFields.firstTimeCustomerOnly} onChange={(e) => setEditFields((f) => ({ ...f, firstTimeCustomerOnly: e.target.checked }))} /> First-time customer only</label>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={saveEdits}
                disabled={saving}
                className="inline-flex items-center gap-1.5 bg-[#B76E79] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A45D68] disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#0A1628]">Redemption log ({totalRedemptions})</h2>
        </div>
        {redemptions.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No redemptions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Order</th>
                  <th className="px-4 py-2 text-left">Discount</th>
                  <th className="px-4 py-2 text-left">Order total</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {redemptions.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="font-medium text-[#0A1628]">{r.customerName || r.customerEmail || "Guest"}</div>
                      {r.customerName && r.customerEmail && <div className="text-xs text-gray-600">{r.customerEmail}</div>}
                    </td>
                    <td className="px-4 py-2">
                      {r.orderId ? (
                        <Link href={`/admin/orders/${r.orderId}`} className="text-[#B76E79] hover:underline">#{r.orderId}</Link>
                      ) : "—"}
                      {r.orderStatus && <span className="text-xs text-gray-600 ml-1">({r.orderStatus})</span>}
                    </td>
                    <td className="px-4 py-2">{formatCurrency(r.discountAmountCents)}</td>
                    <td className="px-4 py-2">
                      <span className="text-gray-500 line-through">{formatCurrency(r.orderTotalBeforeCents)}</span>{" "}
                      <span>{formatCurrency(r.orderTotalAfterCents)}</span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{formatDateTime(r.redeemedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalRedemptionPages > 1 && (
          <div className="flex items-center justify-end gap-3 p-3 text-sm text-gray-500">
            <span>Page {redemptionPage} of {totalRedemptionPages}</span>
            <button onClick={() => setRedemptionPage((p) => Math.max(1, p - 1))} disabled={redemptionPage <= 1} className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40">Prev</button>
            <button onClick={() => setRedemptionPage((p) => Math.min(totalRedemptionPages, p + 1))} disabled={redemptionPage >= totalRedemptionPages} className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#0A1628]">Audit timeline</h2>
        </div>
        {events.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No admin events recorded.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {events.map((e) => {
              const diffs = e.action === "create" || e.action === "delete"
                ? []
                : computeDiff(e.beforeState, e.afterState);
              return (
                <li key={e.id} className="p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize text-[#0A1628]">{e.action}</span>
                    <span className="text-xs text-gray-600">{formatDateTime(e.createdAt)}</span>
                  </div>
                  <div className="text-xs text-gray-700 mt-0.5">
                    By {e.adminName || e.adminEmail || "operator"}
                  </div>
                  {e.action === "create" && (
                    <div className="text-xs text-gray-500 mt-2 italic">Code created.</div>
                  )}
                  {diffs.length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs">
                      {diffs.map((d) => (
                        <li key={d.key} className="flex gap-2">
                          <span className="text-gray-500 min-w-[120px]">{DIFF_LABELS[d.key]}:</span>
                          <span className="text-red-600 line-through break-all">{formatDiffValue(d.key, d.before)}</span>
                          <span className="text-gray-500">→</span>
                          <span className="text-green-700 break-all">{formatDiffValue(d.key, d.after)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {diffs.length === 0 && e.action !== "create" && (
                    <div className="text-xs text-gray-600 mt-1 italic">No field changes recorded.</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Dialog open={confirmDeactivate} onOpenChange={(o) => !o && setConfirmDeactivate(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate {data.code}?</DialogTitle>
            <DialogDescription>
              Customers will no longer be able to redeem this code. The code is also disabled in Stripe. You can reactivate later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={() => setConfirmDeactivate(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button onClick={() => changeStatus(false)} disabled={statusBusy} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">
              {statusBusy ? "Working…" : "Deactivate"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmReactivate} onOpenChange={(o) => !o && setConfirmReactivate(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reactivate {data.code}?</DialogTitle>
            <DialogDescription>
              Customers will be able to redeem this code again, subject to its existing limits and expiry. Note: the original Stripe promotion code stays archived; redemption falls back to internal validation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={() => setConfirmReactivate(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button onClick={() => changeStatus(true)} disabled={statusBusy} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {statusBusy ? "Working…" : "Reactivate"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-50 pb-1.5 last:border-0">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right text-[#0A1628] break-all">{value}</dd>
    </div>
  );
}

export default function AdminPromoCodeDetailPage() {
  return (
    <AdminLayout>
      <PromoCodeDetailContent />
    </AdminLayout>
  );
}
