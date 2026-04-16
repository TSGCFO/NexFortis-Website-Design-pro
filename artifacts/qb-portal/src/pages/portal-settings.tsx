import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TierBadge } from "@/components/tier-badge";
import {
  CheckCircle,
  Shield,
  Download,
  AlertTriangle,
  XCircle,
  Paperclip,
  Loader2,
  Clock,
  MessageCircle,
  AlertOctagon,
} from "lucide-react";

function isCurrentlyAfterHours(): boolean {
  const now = new Date();
  const et = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    hour: "numeric",
    hour12: false,
    weekday: "short",
  }).formatToParts(now);

  const hourPart = et.find(p => p.type === "hour");
  const dayPart = et.find(p => p.type === "weekday");
  const hour = parseInt(hourPart?.value || "0");
  const day = dayPart?.value || "";

  const isWeekend = day === "Sat" || day === "Sun";
  return isWeekend || hour < 9 || hour >= 17;
}

interface Order {
  id: number;
  serviceName: string;
  addons: string | null;
  totalCad: number;
  status: string;
  createdAt: string;
}

interface EnhancedTicket {
  id: number;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  tierAtSubmission?: string | null;
  isCritical?: boolean;
  isAfterHours?: boolean;
  respondedAt?: string | null;
  attachmentPath?: string | null;
}

interface SubscriptionInfo {
  tier: string;
  ticketsUsed: number;
  ticketLimit: number;
  ticketsRemaining: number;
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
            <label htmlFor="settings-name" className="block text-sm font-medium mb-1">Name</label>
            <input id="settings-name" type="text" value={profileName} onChange={(e) => { setProfileName(e.target.value); setProfileSaved(false); }} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>
          <div>
            <label htmlFor="settings-email" className="block text-sm font-medium mb-1">Email</label>
            <input id="settings-email" type="email" defaultValue={user.email} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" disabled />
          </div>
          <div>
            <label htmlFor="settings-phone" className="block text-sm font-medium mb-1">Phone</label>
            <input id="settings-phone" type="tel" value={profilePhone} onChange={(e) => { setProfilePhone(e.target.value); setProfileSaved(false); }} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
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

const ALLOWED_FILE_TYPES = [".qbm", ".png", ".jpg", ".jpeg", ".pdf"];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

function ticketApiUrl(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base.slice(0, -1) : base;
  return prefix.replace(/\/qb-portal$/, "") + "/api/qb/tickets" + path;
}

interface EnhancedSupportProps {
  subscriptionInfo: SubscriptionInfo | null;
  getAccessToken: () => Promise<string | null>;
}

export function EnhancedSupportTab({ subscriptionInfo, getAccessToken }: EnhancedSupportProps) {
  const [tickets, setTickets] = useState<EnhancedTicket[]>([]);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isCritical, setIsCritical] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch(ticketApiUrl(""), {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch { /* ignore */ }
  }, [getAccessToken]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const hasSub = subscriptionInfo !== null;
  const isUnlimited = hasSub && subscriptionInfo.ticketsRemaining === -1;
  const atLimit = hasSub && !isUnlimited && subscriptionInfo.ticketsRemaining <= 0;
  const lastTicket = hasSub && !isUnlimited && subscriptionInfo.ticketsRemaining === 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) { setAttachment(null); return; }

    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      setFileError(`Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(", ")}`);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File too large. Maximum size is 25MB.");
      e.target.value = "";
      return;
    }

    setAttachment(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSub || atLimit) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = await getAccessToken();
      const formData = new FormData();
      formData.append("subject", ticketSubject);
      formData.append("message", ticketMessage);
      formData.append("isCritical", String(isCritical));
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const res = await fetch(ticketApiUrl(""), {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });

      if (res.ok) {
        setTicketSubmitted(true);
        setTicketSubject("");
        setTicketMessage("");
        setIsCritical(false);
        setAttachment(null);
        fetchTickets();
      } else {
        const data = await res.json();
        setSubmitError(data.error || "Failed to submit ticket");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const [afterHours, setAfterHours] = useState(false);

  useEffect(() => {
    setAfterHours(isCurrentlyAfterHours());
    const interval = setInterval(() => setAfterHours(isCurrentlyAfterHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold font-display text-primary mb-4">Support</h2>
      {afterHours && (
        <Card className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Our team is currently offline. Business hours are Mon–Fri, 9 AM – 5 PM ET. Tickets submitted now will receive a response on the next business day.
            </p>
          </CardContent>
        </Card>
      )}

      {!hasSub && (
        <Card className="mb-6 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">Subscription Required</p>
              <p className="text-sm text-muted-foreground mb-3">
                An active support plan is required to submit tickets. Get priority support starting at $25 CAD/month.
              </p>
              <Link href="/subscription">
                <Button size="sm" className="bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display gap-1">
                  View Support Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {hasSub && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <TierBadge tier={subscriptionInfo.tier as "essentials" | "professional" | "premium"} size="lg" />
          {!isUnlimited && (
            <span className="text-sm text-muted-foreground">
              {subscriptionInfo.ticketsRemaining} of {subscriptionInfo.ticketLimit} tickets remaining
            </span>
          )}
          {isUnlimited && (
            <span className="text-sm text-muted-foreground">Unlimited tickets</span>
          )}
        </div>
      )}
      {ticketSubmitted ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold font-display text-primary mb-2">Ticket Submitted</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We'll respond within{" "}
              {subscriptionInfo?.tier === "premium" ? "30 minutes" : "1 hour"}{" "}
              during business hours.
            </p>
            <Button onClick={() => setTicketSubmitted(false)} variant="outline">Submit Another Ticket</Button>
          </CardContent>
        </Card>
      ) : hasSub ? (
        <Card>
          <CardContent className="p-6">
            {atLimit && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  You've reached your ticket limit for this billing period. Tickets reset at the start of your next billing cycle, or you can upgrade for more.
                </p>
              </div>
            )}

            {lastTicket && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This is your last ticket for this billing period. Consider upgrading for more tickets.
                </p>
              </div>
            )}

            {submitError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="ticket-subject" className="block text-sm font-medium mb-1">Subject</label>
                <input
                  id="ticket-subject"
                  type="text"
                  required
                  disabled={atLimit}
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm disabled:opacity-50"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label htmlFor="ticket-message" className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  id="ticket-message"
                  required
                  disabled={atLimit}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none disabled:opacity-50"
                  placeholder="Please describe your issue in detail..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="ticket-critical"
                  type="checkbox"
                  checked={isCritical}
                  disabled={atLimit}
                  onChange={(e) => setIsCritical(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="ticket-critical" className="text-sm font-medium flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                  Mark as Critical/Urgent
                </label>
              </div>

              <div>
                <label htmlFor="ticket-attachment" className="block text-sm font-medium mb-1">
                  Attachment <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="ticket-attachment"
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm cursor-pointer hover:bg-muted transition-colors ${atLimit ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    {attachment ? attachment.name : "Choose file"}
                  </label>
                  <input
                    id="ticket-attachment"
                    type="file"
                    disabled={atLimit}
                    accept={ALLOWED_FILE_TYPES.join(",")}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {attachment && (
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                      aria-label="Remove attachment"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {fileError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fileError}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted: .qbm, .png, .jpg, .pdf — Max 25MB
                </p>
              </div>

              <Button
                type="submit"
                disabled={atLimit || submitting}
                className="bg-navy text-white hover:bg-navy/90 font-display gap-1"
                aria-label="Submit support ticket"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {tickets.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold font-display text-primary mb-3">Previous Tickets</h3>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-sm">{ticket.subject}</p>
                        {ticket.tierAtSubmission && (
                          <TierBadge tier={ticket.tierAtSubmission as "essentials" | "professional" | "premium"} size="sm" />
                        )}
                        {ticket.isCritical && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold">
                            <AlertOctagon className="w-3 h-3" /> CRITICAL
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        {ticket.isAfterHours && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> After hours
                          </span>
                        )}
                        {ticket.respondedAt && (
                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                            <MessageCircle className="w-3 h-3" /> Responded
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      ticket.status === "open"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : ticket.status === "in_progress"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      {ticket.status === "in_progress" ? "In Progress" : ticket.status}
                    </span>
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

export { type EnhancedTicket };
