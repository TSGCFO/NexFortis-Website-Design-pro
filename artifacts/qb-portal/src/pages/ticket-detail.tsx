import { useState, useEffect, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useAuth, getAccessToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Clock, CheckCircle, AlertCircle, Paperclip } from "lucide-react";
import { getApiBase } from "@/lib/api-base";

interface TicketData {
  id: number;
  subject: string;
  message: string;
  status: string;
  isCritical: boolean;
  isAfterHours: boolean;
  tierAtSubmission: string | null;
  firstResponseAt: string | null;
  slaDeadline: string | null;
  slaStatus: string | null;
  slaRemainingMinutes: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ReplyData {
  id: number;
  senderRole: string;
  senderName: string | null;
  message: string;
  attachmentUrl: string | null;
  createdAt: string;
}

const STATUS_INFO: Record<string, { label: string; description: string; color: string }> = {
  open: { label: "Open", description: "Waiting for our team to respond", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "In Progress", description: "Our team is working on this", color: "bg-amber-100 text-amber-800" },
  resolved: { label: "Resolved", description: "This ticket has been resolved. Need more help? Post a reply to reopen it.", color: "bg-green-100 text-green-800" },
  closed: { label: "Closed", description: "This ticket is closed", color: "bg-gray-100 text-gray-800" },
};

const SLA_WINDOWS: Record<string, string> = {
  essentials: "60 minutes (business hours)",
  professional: "60 minutes (business hours)",
  premium: "30 minutes (business hours)",
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

export default function TicketDetailPage() {
  const { session, loading: authLoading } = useAuth();
  const [, params] = useRoute("/ticket/:id");
  const ticketId = params?.id;
  const { toast } = useToast();

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const fetchData = useCallback(async () => {
    if (!ticketId) return;
    const token = await getAccessToken();
    if (!token) return;

    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [ticketRes, repliesRes] = await Promise.all([
        fetch(`${getApiBase()}/api/qb/tickets/${ticketId}`, { headers }),
        fetch(`${getApiBase()}/api/qb/tickets/${ticketId}/replies`, { headers }),
      ]);

      if (ticketRes.status === 404) {
        setError("Ticket not found.");
        setLoading(false);
        return;
      }
      if (!ticketRes.ok) throw new Error();

      const ticketData = await ticketRes.json();
      setTicket(ticketData.ticket);

      if (repliesRes.ok) {
        const repliesData = await repliesRes.json();
        setReplies(repliesData.replies || []);
      }
    } catch {
      setError("Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (!authLoading && session) fetchData();
  }, [authLoading, session, fetchData]);

  const handleSendReply = async () => {
    if (!ticket || !replyText.trim()) return;
    const token = await getAccessToken();
    if (!token) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.append("message", replyText.trim());
      if (replyFile) {
        formData.append("attachment", replyFile);
      }

      const res = await fetch(`${getApiBase()}/api/qb/tickets/${ticket.id}/replies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        toast({ title: "Error", description: data.error || "Failed to send reply", variant: "destructive" });
        return;
      }

      setReplyText("");
      setReplyFile(null);
      toast({ title: "Reply sent" });
      await fetchData();
    } catch {
      toast({ title: "Error", description: "Failed to send reply", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (authLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B76E79]" />
      </div>
    );
  }

  const statusInfo = ticket ? STATUS_INFO[ticket.status] || STATUS_INFO.open : STATUS_INFO.open;

  return (
    <>
      <Helmet>
        <title>Ticket #{ticketId} | NexFortis</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/portal" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Support
        </Link>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        ) : ticket ? (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-[#0A1628]">
                Ticket #{ticket.id}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              {ticket.isCritical && (
                <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700">CRITICAL</span>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-4">{statusInfo.description}</p>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
              {ticket.slaDeadline ? (
                ticket.firstResponseAt ? (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Our team responded in {Math.round((new Date(ticket.firstResponseAt).getTime() - new Date(ticket.createdAt).getTime()) / 60000)} minutes</span>
                  </div>
                ) : isCurrentlyAfterHours() ? (
                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <Clock className="w-4 h-4" />
                    <span>Our team is currently offline. Response expected by 9:00 AM ET on the next business day.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Clock className="w-4 h-4" />
                    <span>
                      Expected response within {ticket.tierAtSubmission ? SLA_WINDOWS[ticket.tierAtSubmission] || "60 minutes" : "60 minutes"}
                    </span>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Response times may vary for non-subscription tickets.</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Conversation</h2>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    You
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">You</span>
                      <span className="text-xs text-gray-600">{formatRelativeTime(ticket.createdAt)}</span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>{ticket.subject}</h3>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{ticket.message}</p>
                  </div>
                </div>

                {replies.map(reply => (
                  <div key={reply.id} className={`flex gap-3 ${reply.senderRole === "customer" ? "" : "flex-row-reverse"}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      reply.senderRole === "operator"
                        ? "bg-[#B76E79]/20 text-[#B76E79]"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {reply.senderRole === "operator" ? "NF" : "You"}
                    </div>
                    <div className={`flex-1 rounded-lg p-3 ${
                      reply.senderRole === "operator" ? "bg-gray-50 border border-gray-200" : "bg-blue-50"
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {reply.senderRole === "operator" ? (reply.senderName || "NexFortis Support") : "You"}
                        </span>
                        <span className="text-xs text-gray-600">{formatRelativeTime(reply.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{reply.message}</p>
                      {reply.attachmentUrl && (
                        <a
                          href={reply.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-[#B76E79] hover:underline"
                        >
                          <Paperclip className="w-3 h-3" /> View Attachment
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {ticket.status !== "closed" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Reply</h2>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79] mb-3"
                />
                <div className="flex items-center gap-3 mb-3">
                  <label className="inline-flex items-center gap-1 text-xs text-gray-700 cursor-pointer hover:text-[#B76E79]">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{replyFile ? replyFile.name : "Attach file"}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.xlsx,.csv,.txt,.qbm,.qbb,.qbw"
                      onChange={e => setReplyFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {replyFile && (
                    <button
                      type="button"
                      onClick={() => setReplyFile(null)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A1628] text-white rounded-lg text-sm font-medium hover:bg-[#0A1628]/90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
