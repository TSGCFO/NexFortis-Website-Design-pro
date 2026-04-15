import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Shield, Download } from "lucide-react";

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

interface SettingsProps {
  user: { name: string; email: string; phone?: string };
  profileName: string;
  setProfileName: (v: string) => void;
  profilePhone: string;
  setProfilePhone: (v: string) => void;
  profileSaved: boolean;
  setProfileSaved: (v: boolean) => void;
  onProfileSave: () => void;
}

export function SettingsTab(props: SettingsProps) {
  const { profileName, setProfileName, profilePhone, setProfilePhone, profileSaved, setProfileSaved,
    onProfileSave, user } = props;

  return (
    <div>
      <h2 className="text-lg font-bold font-display text-primary mb-4">Account Settings</h2>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={profileName} onChange={(e) => { setProfileName(e.target.value); setProfileSaved(false); }} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" defaultValue={user.email} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" value={profilePhone} onChange={(e) => { setProfilePhone(e.target.value); setProfileSaved(false); }} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-navy text-white hover:bg-navy/90 font-display" onClick={onProfileSave}>Save Changes</Button>
            {profileSaved && <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved</span>}
          </div>
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-muted-foreground">
              To change your password, use the <Link href="/forgot-password" className="text-accent hover:underline">password reset</Link> flow.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SupportProps {
  tickets: Ticket[];
  ticketSubject: string;
  setTicketSubject: (v: string) => void;
  ticketMessage: string;
  setTicketMessage: (v: string) => void;
  ticketSubmitted: boolean;
  setTicketSubmitted: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SupportTab(props: SupportProps) {
  const { tickets, ticketSubject, setTicketSubject, ticketMessage, setTicketMessage,
    ticketSubmitted, setTicketSubmitted, onSubmit } = props;

  return (
    <div>
      <h2 className="text-lg font-bold font-display text-primary mb-4">Support</h2>
      {ticketSubmitted ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold font-display text-primary mb-2">Ticket Submitted</h3>
            <p className="text-sm text-muted-foreground mb-4">We'll respond within 1-2 hours (30 minutes for Premium Support subscribers).</p>
            <Button onClick={() => setTicketSubmitted(false)} variant="outline">Submit Another Ticket</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input type="text" required value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Brief description of your issue" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea required value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} rows={5} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" placeholder="Please describe your issue in detail..." />
              </div>
              <Button type="submit" className="bg-navy text-white hover:bg-navy/90 font-display">Submit Ticket</Button>
            </form>
          </CardContent>
        </Card>
      )}
      {tickets.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold font-display text-primary mb-3">Previous Tickets</h3>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.status === "open" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>{ticket.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FilesProps {
  completedOrders: Order[];
}

export function FilesTab({ completedOrders }: FilesProps) {
  return (
    <div>
      <h2 className="text-lg font-bold font-display text-primary mb-4">My Files</h2>
      <Card className="mb-4 border-accent/30 bg-accent/5">
        <CardContent className="p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-accent" />
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
                    <p className="font-semibold text-sm">ORD-{String(order.id).padStart(3, "0")} - converted.qbm</p>
                    <p className="text-xs text-muted-foreground">Delivered {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Link href={`/order/${order.id}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="w-3 h-3" /> View Files
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
