import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/tier-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Headphones,
  Activity,
  Video,
  Gift,
  Copy,
  Loader2,
  CreditCard,
  Shield,
} from "lucide-react";

type SubscriptionTier = "essentials" | "professional" | "premium";

interface SubscriptionData {
  id: number;
  tier: SubscriptionTier;
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  ticketLimit: number;
  ticketsUsed: number;
  ticketsRemaining: number;
  slaMinutes: number;
  discountPercent: number;
}

interface ReferralData {
  code: string;
  totalEarnings: string;
}

interface ReferralStatsRedemption {
  orderId: number | null;
  subscriptionId: number | null;
  redeemedAt: string;
  creditAmountCents: number;
  status: string;
}

interface ReferralStats {
  code: string | null;
  totalRedemptions: number;
  totalCreditsEarnedCents: number;
  pendingCreditsCents: number;
  appliedCreditsCents: number;
  redemptions: ReferralStatsRedemption[];
}

const tierNames: Record<SubscriptionTier, string> = {
  essentials: "Essentials",
  professional: "Professional",
  premium: "Premium",
};

const tierPricing: Record<SubscriptionTier, { promo: string; standard: string }> = {
  essentials: { promo: "$25", standard: "$49" },
  professional: { promo: "$50", standard: "$99" },
  premium: { promo: "$75", standard: "$149" },
};

import { getApiBase } from "../lib/api-base";

function apiUrl(path: string) {
  return getApiBase() + "/api/qb/subscriptions" + path;
}

interface SubscriptionTabProps {
  onRefreshPortal?: () => void;
}

export function SubscriptionTab({ onRefreshPortal }: SubscriptionTabProps) {
  const { getAccessToken } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [referral, setReferral] = useState<ReferralData | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [downgradeOpen, setDowngradeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchSubscription = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch(apiUrl("/me"), {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription);
        setReferral(data.referral || null);
      }
    } catch { /* ignore */ }

    try {
      const token2 = await getAccessToken();
      const statsUrl = getApiBase() + "/api/qb/promo/referral-stats";
      const statsRes = await fetch(statsUrl, {
        headers: { ...(token2 ? { Authorization: `Bearer ${token2}` } : {}) },
      });
      if (statsRes.ok) {
        const sdata = await statsRes.json();
        setReferralStats(sdata.stats || null);
      }
    } catch { /* ignore */ }

    setLoading(false);
  }, [getAccessToken]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  async function apiHeaders() {
    const token = await getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  const handleUpgrade = async (newTier: SubscriptionTier) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const headers = await apiHeaders();
      const res = await fetch(apiUrl("/upgrade"), {
        method: "POST",
        headers,
        body: JSON.stringify({ tier: newTier }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Upgrade failed");
        return;
      }
      setActionSuccess(`Upgraded to ${tierNames[newTier]}!`);
      setUpgradeOpen(false);
      fetchSubscription();
      onRefreshPortal?.();
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDowngrade = async (newTier: SubscriptionTier) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const headers = await apiHeaders();
      const res = await fetch(apiUrl("/downgrade"), {
        method: "POST",
        headers,
        body: JSON.stringify({ tier: newTier }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Downgrade failed");
        return;
      }
      setActionSuccess(data.message || `Downgrade to ${tierNames[newTier]} scheduled.`);
      setDowngradeOpen(false);
      fetchSubscription();
      onRefreshPortal?.();
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const headers = await apiHeaders();
      const res = await fetch(apiUrl("/cancel"), {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Cancellation failed");
        return;
      }
      setActionSuccess("Your subscription will cancel at the end of your billing period.");
      setCancelOpen(false);
      fetchSubscription();
      onRefreshPortal?.();
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const headers = await apiHeaders();
      const res = await fetch(apiUrl("/reactivate"), {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Reactivation failed");
        return;
      }
      setActionSuccess("Subscription reactivated!");
      fetchSubscription();
      onRefreshPortal?.();
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const activeReferralCode = referralStats?.code || referral?.code || null;
  const referralLink = activeReferralCode
    ? `${window.location.origin}/subscription?ref=${activeReferralCode}`
    : "";

  const copyReferralCode = async () => {
    if (!activeReferralCode) return;
    try {
      await navigator.clipboard.writeText(activeReferralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const copyReferralLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div>
        <h2 className="text-lg font-bold font-display text-primary mb-4">Subscription</h2>
        <Card>
          <CardContent className="p-8 text-center">
            <Headphones className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold font-display text-primary mb-2">No Active Subscription</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Get priority QuickBooks support, faster response times, service discounts, and exclusive perks with a support plan.
            </p>
            <Link href="/subscription">
              <Button className="bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold gap-2" aria-label="View available support plans">
                View Support Plans <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tier = subscription.tier;
  const isUnlimited = subscription.ticketsRemaining === -1;
  const ticketPercent = isUnlimited
    ? 0
    : subscription.ticketLimit > 0
    ? Math.round((subscription.ticketsUsed / subscription.ticketLimit) * 100)
    : 0;
  const ticketWarning = !isUnlimited && subscription.ticketsRemaining <= 1 && subscription.ticketsRemaining > 0;
  const ticketAtLimit = !isUnlimited && subscription.ticketsRemaining === 0;

  const upgradeTiers: SubscriptionTier[] = (["essentials", "professional", "premium"] as SubscriptionTier[]).filter(
    (t) => {
      const order = { essentials: 0, professional: 1, premium: 2 };
      return order[t] > order[tier];
    },
  );

  const downgradeTiers: SubscriptionTier[] = (["essentials", "professional", "premium"] as SubscriptionTier[]).filter(
    (t) => {
      const order = { essentials: 0, professional: 1, premium: 2 };
      return order[t] < order[tier];
    },
  );

  const periodEndFormatted = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div>
      <h2 className="text-lg font-bold font-display text-primary mb-4">Subscription</h2>

      {actionSuccess && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300">{actionSuccess}</p>
          <button onClick={() => setActionSuccess(null)} className="ml-auto text-green-600 hover:text-green-800" aria-label="Dismiss success message">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{actionError}</p>
          <button onClick={() => setActionError(null)} className="ml-auto text-red-600 hover:text-red-800" aria-label="Dismiss error message">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-display text-primary">{tierNames[tier]}</h3>
                  <TierBadge tier={tier} size="sm" />
                </div>
              </div>
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                {subscription.cancelAtPeriodEnd ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Canceling</span>
                ) : subscription.status === "past_due" ? (
                  <span className="text-red-600 dark:text-red-400 font-medium">Past Due</span>
                ) : (
                  <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Response SLA</span>
                <span className="font-medium">{subscription.slaMinutes} minutes</span>
              </div>
              {subscription.discountPercent > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service Discount</span>
                  <span className="font-medium text-green-600">{subscription.discountPercent}% off</span>
                </div>
              )}
              {periodEndFormatted && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {subscription.cancelAtPeriodEnd ? "Access until" : "Next billing"}
                  </span>
                  <span className="font-medium">{periodEndFormatted}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {subscription.cancelAtPeriodEnd ? (
                <Button
                  size="sm"
                  onClick={handleReactivate}
                  disabled={actionLoading}
                  className="bg-green-600 text-white hover:bg-green-700 font-display gap-1"
                  aria-label="Reactivate subscription"
                >
                  {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                  Reactivate
                </Button>
              ) : (
                <>
                  {upgradeTiers.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setUpgradeOpen(true); setActionError(null); }}
                      className="gap-1 font-display"
                      aria-label="Upgrade subscription"
                    >
                      <ArrowUp className="w-3 h-3" /> Upgrade
                    </Button>
                  )}
                  {downgradeTiers.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setDowngradeOpen(true); setActionError(null); }}
                      className="gap-1 font-display"
                      aria-label="Downgrade subscription"
                    >
                      <ArrowDown className="w-3 h-3" /> Downgrade
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setCancelOpen(true); setActionError(null); }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1 font-display"
                    aria-label="Cancel subscription"
                  >
                    Cancel Plan
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ticket Usage</p>
                <h3 className="text-xl font-bold font-display text-primary">
                  {isUnlimited
                    ? "Unlimited"
                    : `${subscription.ticketsUsed} / ${subscription.ticketLimit}`}
                </h3>
              </div>
              <Headphones className="w-5 h-5 text-muted-foreground" />
            </div>

            {!isUnlimited && (
              <>
                <Progress
                  value={ticketPercent}
                  className={`h-3 mb-2 ${
                    ticketAtLimit
                      ? "[&>div]:bg-red-500"
                      : ticketWarning
                      ? "[&>div]:bg-amber-500"
                      : "[&>div]:bg-green-500"
                  }`}
                  aria-label={`${subscription.ticketsUsed} of ${subscription.ticketLimit} tickets used`}
                />
                <p className="text-xs text-muted-foreground mb-2">
                  {subscription.ticketsRemaining} ticket{subscription.ticketsRemaining !== 1 ? "s" : ""} remaining this period
                </p>
              </>
            )}

            {isUnlimited && (
              <p className="text-sm text-muted-foreground mb-2">
                Submit as many tickets as you need with your Premium plan.
              </p>
            )}

            {ticketWarning && (
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                Only {subscription.ticketsRemaining} ticket left this period. Consider upgrading.
              </div>
            )}

            {ticketAtLimit && (
              <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <XCircle className="w-3 h-3 flex-shrink-0" />
                Ticket limit reached. Resets on {periodEndFormatted}.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Health Check</p>
                <h3 className="font-bold font-display text-primary">Data Integrity</h3>
              </div>
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {tier === "essentials"
                ? "Upgrade to Professional or Premium for data integrity analysis with every ticket."
                : "Data integrity analysis is included with your plan. Our team reviews your QuickBooks data health with every ticket."}
            </p>
            {tier === "essentials" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUpgradeOpen(true)}
                className="gap-1 font-display"
              >
                <ArrowUp className="w-3 h-3" /> Upgrade for Health Checks
              </Button>
            )}
            {tier !== "essentials" && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Included in your plan</span>
              </div>
            )}
          </CardContent>
        </Card>

        {tier === "premium" ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Video Support</p>
                  <h3 className="font-bold font-display text-primary">1-on-1 Video Calls</h3>
                </div>
                <Video className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Schedule a 1-on-1 video call with a QuickBooks expert for personalized assistance.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Included in Premium</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="opacity-70">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Video Support</p>
                  <h3 className="font-bold font-display text-primary">1-on-1 Video Calls</h3>
                </div>
                <Video className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Available exclusively for Premium subscribers. Get personalized video assistance from our experts.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Premium only</span>
              </div>
            </CardContent>
          </Card>
        )}

        {tier === "premium" && activeReferralCode ? (
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Referral Code</p>
                  <h3 className="font-bold font-display text-primary">Earn $25 Per Referral</h3>
                </div>
                <Gift className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Share your referral code with colleagues. Earn $25 credit for each person who uses it at checkout.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12">Code:</span>
                  <code className="px-4 py-2 bg-muted rounded-lg text-sm font-mono font-bold tracking-wider">{activeReferralCode}</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyReferralCode}
                    className="gap-1"
                    aria-label="Copy referral code"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Copied!" : "Copy Code"}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12">Link:</span>
                  <code className="px-4 py-2 bg-muted rounded-lg text-xs font-mono truncate max-w-xs">{referralLink}</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyReferralLink}
                    className="gap-1"
                    aria-label="Copy referral link"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </div>
              {referral && referral.totalEarnings && parseFloat(referral.totalEarnings) > 0 && (
                <p className="text-xs text-muted-foreground mt-3">
                  Total earned: ${parseFloat(referral.totalEarnings).toFixed(2)} CAD
                </p>
              )}
              {referralStats && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-muted text-center">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Redemptions</p>
                      <p className="text-lg font-bold font-display">{referralStats.totalRedemptions}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted text-center">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Credits Earned</p>
                      <p className="text-lg font-bold font-display text-emerald-600">
                        ${(referralStats.totalCreditsEarnedCents / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted text-center">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Pending</p>
                      <p className="text-lg font-bold font-display">
                        ${(referralStats.pendingCreditsCents / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {referralStats.redemptions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Recent redemptions</p>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {referralStats.redemptions.slice(0, 10).map((r, idx) => (
                          <div key={idx} className="flex justify-between text-xs p-2 rounded bg-muted/50">
                            <span>{new Date(r.redeemedAt).toLocaleDateString()}</span>
                            <span className="text-muted-foreground">
                              {r.subscriptionId ? "Subscription" : "Order"}
                            </span>
                            <span className="font-medium text-emerald-600">
                              +${(r.creditAmountCents / 100).toFixed(2)}
                            </span>
                            <span className="capitalize text-muted-foreground">{r.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-3 italic">
                    Credits are applied manually to future invoices by our team.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : tier !== "premium" ? (
          <Card className="md:col-span-2 opacity-70">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Referral Code</p>
                  <h3 className="font-bold font-display text-primary">Earn $25 Per Referral</h3>
                </div>
                <Gift className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Upgrade to Premium to get your referral code and earn $25 per referral.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              Choose a higher tier. Your upgrade takes effect immediately with prorated billing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {upgradeTiers.map((t) => (
              <button
                key={t}
                onClick={() => handleUpgrade(t)}
                disabled={actionLoading}
                className="w-full p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors text-left flex items-center justify-between"
                aria-label={`Upgrade to ${tierNames[t]}`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold font-display text-primary">{tierNames[t]}</span>
                    <TierBadge tier={t} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tierPricing[t].promo}/mo CAD (launch pricing)
                  </p>
                </div>
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <ArrowUp className="w-4 h-4 text-accent" />
                )}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeOpen(false)} className="font-display">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={downgradeOpen} onOpenChange={setDowngradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Downgrade Your Plan</DialogTitle>
            <DialogDescription>
              Your downgrade will take effect at the start of your next billing cycle. You'll keep your current plan benefits until then.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {downgradeTiers.map((t) => (
              <button
                key={t}
                onClick={() => handleDowngrade(t)}
                disabled={actionLoading}
                className="w-full p-4 rounded-lg border border-border hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors text-left flex items-center justify-between"
                aria-label={`Downgrade to ${tierNames[t]}`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold font-display text-primary">{tierNames[t]}</span>
                    <TierBadge tier={t} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tierPricing[t].promo}/mo CAD (launch pricing)
                  </p>
                </div>
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-amber-500" />
                )}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDowngradeOpen(false)} className="font-display">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-red-600">Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel? Your subscription will remain active until the end of your current billing period
              {periodEndFormatted ? ` (${periodEndFormatted})` : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
              <p className="font-medium mb-1">You'll lose access to:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Priority support with {subscription.slaMinutes}-minute SLA</li>
                {subscription.discountPercent > 0 && <li>{subscription.discountPercent}% service discount</li>}
                {tier === "premium" && <li>Video call support and referral rewards</li>}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)} className="font-display">
              Keep Plan
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={actionLoading}
              className="gap-1 font-display"
              aria-label="Confirm cancel subscription"
            >
              {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
