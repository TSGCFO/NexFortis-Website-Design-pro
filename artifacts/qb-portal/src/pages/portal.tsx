import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/seo";
import { SettingsTab, EnhancedSupportTab } from "@/pages/portal-settings";
import { SubscriptionTab } from "@/pages/portal-subscription";
import { LayoutDashboard, Package, CreditCard, HelpCircle, Settings, Upload, Clock, CheckCircle } from "lucide-react";

interface Order { id: number; serviceName: string; addons: string | null; totalCad: number; status: string; createdAt: string; }

interface SubscriptionInfo {
  tier: string;
  ticketsUsed: number;
  ticketLimit: number;
  ticketsRemaining: number;
}

const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending_payment: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  delivered: "bg-accent/10 text-accent",
};

function subApiUrl(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base.slice(0, -1) : base;
  return prefix.replace(/\/qb-portal$/, "") + "/api/qb/subscriptions" + path;
}

export default function Portal() {
  const { user, loading: authLoading, signOut, getAccessToken } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);

  async function apiHeaders() {
    const token = await getAccessToken();
    return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }

  const fetchOrders = useCallback(async () => {
    try {
      const headers = await apiHeaders();
      const res = await fetch("/api/qb/orders", { headers });
      if (res.ok) { const data = await res.json(); setOrders(data.orders || []); }
    } catch { /* ignore */ }
    setLoadingOrders(false);
  }, []);

  const fetchSubscriptionInfo = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch(subApiUrl("/me"), {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.subscription) {
          setSubscriptionInfo({
            tier: data.subscription.tier,
            ticketsUsed: data.subscription.ticketsUsed,
            ticketLimit: data.subscription.ticketLimit,
            ticketsRemaining: data.subscription.ticketsRemaining,
          });
        } else {
          setSubscriptionInfo(null);
        }
      }
    } catch { /* ignore */ }
  }, [getAccessToken]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchSubscriptionInfo();
      setProfileName(user.name);
      setProfilePhone(user.phone || "");
    }
  }, [user, fetchOrders, fetchSubscriptionInfo]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  if (!user) { navigate("/login"); return null; }

  const handleProfileSave = async () => {
    try {
      const headers = await apiHeaders();
      const res = await fetch("/api/qb/me", { method: "PUT", headers, body: JSON.stringify({ name: profileName, phone: profilePhone }) });
      if (res.ok) setProfileSaved(true);
    } catch { /* ignore */ }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "delivered");
  const processingOrders = orders.filter((o) => o.status === "processing" || o.status === "pending_payment");

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Dashboard" description="Manage your QuickBooks orders, files, and account settings." path="/portal" noIndex />

      <div className="section-brand-navy py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-display text-white">Welcome, {user.name.split(" ")[0] || "there"}</h1>
              <p className="text-white/70 text-sm">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/order">
                <Button className="bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold gap-2">
                  <Upload className="w-4 h-4" /> New Order
                </Button>
              </Link>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="brand-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 flex-wrap">
            <TabsTrigger value="dashboard" className="gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><Package className="w-4 h-4" /> My Orders</TabsTrigger>
            <TabsTrigger value="subscription" className="gap-2"><CreditCard className="w-4 h-4" /> Subscription</TabsTrigger>
            <TabsTrigger value="support" className="gap-2"><HelpCircle className="w-4 h-4" /> Support</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Settings className="w-4 h-4" /> Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><Package className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div><div><p className="text-2xl font-bold text-primary">{orders.length}</p><p className="text-xs text-muted-foreground">Total Orders</p></div></div></CardContent></Card>
              <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" /></div><div><p className="text-2xl font-bold text-primary">{processingOrders.length}</p><p className="text-xs text-muted-foreground">In Progress</p></div></div></CardContent></Card>
              <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /></div><div><p className="text-2xl font-bold text-primary">{completedOrders.length}</p><p className="text-xs text-muted-foreground">Completed</p></div></div></CardContent></Card>
            </div>
            <h2 className="text-lg font-bold font-display text-primary mb-4">Recent Orders</h2>
            {loadingOrders ? (
              <p className="text-muted-foreground text-sm">Loading orders...</p>
            ) : orders.length === 0 ? (
              <Card><CardContent className="p-8 text-center"><Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No orders yet.</p><Link href="/order"><Button className="mt-4 bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display">Place Your First Order</Button></Link></CardContent></Card>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <Link key={order.id} href={`/order/${order.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div><p className="font-semibold text-sm text-primary">ORD-{String(order.id).padStart(3, "0")}</p><p className="text-xs text-muted-foreground">{order.serviceName}</p></div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>{order.status}</span>
                          <span className="text-sm font-semibold">${(order.totalCad / 100).toFixed(2)} CAD</span>
                          <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <h2 className="text-lg font-bold font-display text-primary mb-4">Order History</h2>
            {orders.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No orders yet.</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const progress = order.status === "completed" || order.status === "delivered" ? "w-full" : order.status === "processing" ? "w-2/3" : "w-1/3";
                  const progressColor = order.status === "completed" || order.status === "delivered" ? "bg-green-500" : order.status === "processing" ? "bg-amber-500" : "bg-blue-500";
                  return (
                    <Link key={order.id} href={`/order/${order.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div><h3 className="font-bold font-display text-primary">ORD-{String(order.id).padStart(3, "0")}</h3><p className="text-sm text-muted-foreground">{order.serviceName}</p>{order.addons && <p className="text-xs text-muted-foreground mt-1">Add-ons: {order.addons}</p>}</div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>{order.status}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Placed: {new Date(order.createdAt).toLocaleDateString()}</span><span className="font-bold">${(order.totalCad / 100).toFixed(2)} CAD</span></div>
                          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${progressColor} ${progress}`} /></div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Submitted</span><span>Processing</span><span>Completed</span><span>Delivered</span></div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionTab onRefreshPortal={fetchSubscriptionInfo} />
          </TabsContent>

          <TabsContent value="support">
            <EnhancedSupportTab subscriptionInfo={subscriptionInfo} getAccessToken={getAccessToken} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab user={user} profileName={profileName} setProfileName={setProfileName} profilePhone={profilePhone} setProfilePhone={setProfilePhone} profileSaved={profileSaved} setProfileSaved={setProfileSaved} onProfileSave={handleProfileSave} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
