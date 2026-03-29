import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard, Package, FileText, Settings, HelpCircle,
  Upload, Clock, CheckCircle, Shield, Download
} from "lucide-react";

interface Order {
  id: number;
  serviceName: string;
  addons: string | null;
  totalCad: number;
  status: string;
  createdAt: string;
}

interface Ticket {
  id: number;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  pending_payment: "bg-yellow-100 text-yellow-700",
  processing: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  delivered: "bg-[#1a2744]/10 text-[#1a2744]",
};

function apiHeaders() {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function Portal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/qb/orders", { headers: apiHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch { /* ignore */ }
    setLoadingOrders(false);
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch("/api/qb/support-tickets", { headers: apiHeaders() });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchTickets();
      setProfileName(user.name);
      setProfilePhone(user.phone || "");
    }
  }, [user, fetchOrders, fetchTickets]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/qb/support-tickets", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ subject: ticketSubject, message: ticketMessage }),
      });
      if (res.ok) {
        setTicketSubmitted(true);
        setTicketSubject("");
        setTicketMessage("");
        fetchTickets();
      }
    } catch { /* ignore */ }
  };

  const handleProfileSave = async () => {
    try {
      const res = await fetch("/api/qb/me", {
        method: "PUT",
        headers: apiHeaders(),
        body: JSON.stringify({ name: profileName, phone: profilePhone }),
      });
      if (res.ok) setProfileSaved(true);
    } catch { /* ignore */ }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    try {
      const res = await fetch("/api/qb/me/password", {
        method: "PUT",
        headers: apiHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPasswordSaved(true);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const data = await res.json();
        setPasswordError(data.error || "Failed to change password");
      }
    } catch {
      setPasswordError("Network error");
    }
  };

  const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "delivered");
  const processingOrders = orders.filter((o) => o.status === "processing" || o.status === "pending_payment");

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="bg-[#1a2744] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user.name.split(" ")[0]}</h1>
              <p className="text-white/70 text-sm">{user.email}</p>
            </div>
            <Link href="/order">
              <Button className="bg-[#f0a500] text-[#1a2744] hover:bg-[#f0a500]/90 font-bold gap-2">
                <Upload className="w-4 h-4" /> New Order
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard" className="gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><Package className="w-4 h-4" /> My Orders</TabsTrigger>
            <TabsTrigger value="files" className="gap-2"><FileText className="w-4 h-4" /> My Files</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Settings className="w-4 h-4" /> Settings</TabsTrigger>
            <TabsTrigger value="support" className="gap-2"><HelpCircle className="w-4 h-4" /> Support</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Package className="w-5 h-5 text-blue-600" /></div>
                    <div>
                      <p className="text-2xl font-bold text-[#1a2744]">{orders.length}</p>
                      <p className="text-xs text-muted-foreground">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
                    <div>
                      <p className="text-2xl font-bold text-[#1a2744]">{processingOrders.length}</p>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                    <div>
                      <p className="text-2xl font-bold text-[#1a2744]">{completedOrders.length}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-lg font-bold text-[#1a2744] mb-4">Recent Orders</h2>
            {loadingOrders ? (
              <p className="text-muted-foreground text-sm">Loading orders...</p>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No orders yet.</p>
                  <Link href="/order"><Button className="mt-4 bg-[#f0a500] text-[#1a2744]">Place Your First Order</Button></Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <Link key={order.id} href={`/order/${order.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-[#1a2744]">ORD-{String(order.id).padStart(3, "0")}</p>
                          <p className="text-xs text-muted-foreground">{order.serviceName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>{order.status}</span>
                          <span className="text-sm font-semibold">${order.totalCad} CAD</span>
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
            <h2 className="text-lg font-bold text-[#1a2744] mb-4">Order History</h2>
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
                            <div>
                              <h3 className="font-bold text-[#1a2744]">ORD-{String(order.id).padStart(3, "0")}</h3>
                              <p className="text-sm text-muted-foreground">{order.serviceName}</p>
                              {order.addons && <p className="text-xs text-muted-foreground mt-1">Add-ons: {order.addons}</p>}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>{order.status}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className="font-bold">${order.totalCad} CAD</span>
                          </div>
                          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${progressColor} ${progress}`} />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Submitted</span><span>Processing</span><span>Completed</span><span>Delivered</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="files">
            <h2 className="text-lg font-bold text-[#1a2744] mb-4">My Files</h2>
            <Card className="mb-4 border-[#f0a500]/30 bg-[#f0a500]/5">
              <CardContent className="p-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#f0a500]" />
                <p className="text-sm text-muted-foreground">Files are retained for 7 days after delivery, then permanently deleted per our privacy policy.</p>
              </CardContent>
            </Card>
            {completedOrders.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No delivered files yet.</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {completedOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">ORD-{String(order.id).padStart(3, "0")} — converted.qbm</p>
                          <p className="text-xs text-muted-foreground">Delivered {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => {
                            window.location.href = `/qb-portal/order/${order.id}`;
                          }}
                        >
                          <Download className="w-3 h-3" /> View Files
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <h2 className="text-lg font-bold text-[#1a2744] mb-4">Account Settings</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" value={profileName} onChange={(e) => { setProfileName(e.target.value); setProfileSaved(false); }} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" defaultValue={user.email} className="w-full px-3 py-2 rounded-lg border border-border text-sm" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={profilePhone} onChange={(e) => { setProfilePhone(e.target.value); setProfileSaved(false); }} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
                </div>
                <div className="flex items-center gap-3">
                  <Button className="bg-[#1a2744]" onClick={handleProfileSave}>Save Changes</Button>
                  {profileSaved && <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved</span>}
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-[#1a2744] mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
                    <input type="password" placeholder="New password (min 8 characters)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                    {passwordSaved && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Password updated</p>}
                    <Button variant="outline" onClick={handlePasswordChange}>Update Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <h2 className="text-lg font-bold text-[#1a2744] mb-4">Support</h2>
            {ticketSubmitted ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-[#1a2744] mb-2">Ticket Submitted</h3>
                  <p className="text-sm text-muted-foreground mb-4">We'll respond within 4 hours (1 hour for Premium Support).</p>
                  <Button onClick={() => setTicketSubmitted(false)} variant="outline">Submit Another Ticket</Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <input type="text" required value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm" placeholder="Brief description of your issue" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea required value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} rows={5} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none" placeholder="Please describe your issue in detail..." />
                    </div>
                    <Button type="submit" className="bg-[#1a2744]">Submit Ticket</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {tickets.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-[#1a2744] mb-3">Previous Tickets</h3>
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">{ticket.subject}</p>
                            <p className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.status === "open" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{ticket.status}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
