import { useState, useEffect, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import {
  adminFetch,
  formatDateTime,
  formatRelativeTime,
  formatSlaRemaining,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
  TIER_LABELS,
  TIER_COLORS,
  SLA_COLORS,
} from "@/lib/admin-api";
import { DetailPageSkeleton, ErrorBanner } from "@/components/admin-skeletons";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, CheckCircle, Send, Paperclip, StickyNote } from "lucide-react";

interface TicketData {
  id: number;
  subject: string;
  message: string;
  status: string;
  isCritical: boolean;
  isAfterHours: boolean;
  tierAtSubmission: string | null;
  operatorReply: string | null;
  internalNote: string | null;
  firstResponseAt: string | null;
  slaDeadline: string | null;
  slaStatus: string | null;
  slaRemainingMinutes: number | null;
  createdAt: string;
  updatedAt: string;
  userName: string | null;
  userEmail: string | null;
}

interface ReplyData {
  id: number;
  ticketId: number;
  senderId: string;
  senderRole: string;
  senderName: string | null;
  senderEmail: string | null;
  message: string;
  attachmentPath: string | null;
  attachmentUrl: string | null;
  createdAt: string;
}

const STATUS_TRANSITIONS: Record<string, { label: string; value: string; color: string }[]> = {
  open: [
    { label: "Start Working", value: "in_progress", color: "bg-amber-600 hover:bg-amber-700" },
    { label: "Resolve", value: "resolved", color: "bg-green-600 hover:bg-green-700" },
  ],
  in_progress: [
    { label: "Resolve", value: "resolved", color: "bg-green-600 hover:bg-green-700" },
    { label: "Close", value: "closed", color: "bg-gray-600 hover:bg-gray-700" },
  ],
  resolved: [
    { label: "Close", value: "closed", color: "bg-gray-600 hover:bg-gray-700" },
    { label: "Reopen", value: "open", color: "bg-blue-600 hover:bg-blue-700" },
  ],
  closed: [
    { label: "Reopen", value: "open", color: "bg-blue-600 hover:bg-blue-700" },
  ],
};

function TicketDetailContent() {
  const [, params] = useRoute("/admin/tickets/:id");
  const ticketId = params?.id;
  const { toast } = useToast();

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [replyText, setReplyText] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState("");

  const fetchTicket = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    setError("");
    try {
      const [ticketRes, repliesRes] = await Promise.all([
        adminFetch(`/tickets/${ticketId}`),
        fetch(
          `${(import.meta.env.BASE_URL || "/").replace(/\/qb-portal\/?$/, "")}/api/qb/tickets/${ticketId}/replies`,
          {
            headers: {
              Authorization: `Bearer ${await (await import("@/lib/auth")).getAccessToken()}`,
            },
          },
        ),
      ]);

      if (ticketRes.status === 404) {
        setError("Ticket not found.");
        setLoading(false);
        return;
      }
      if (!ticketRes.ok) throw new Error();

      const ticketData = await ticketRes.json();
      setTicket(ticketData.ticket);
      setInternalNote(ticketData.ticket.internalNote || "");

      if (repliesRes.ok) {
        const repliesData = await repliesRes.json();
        setReplies(repliesData.replies || []);
      }
    } catch {
      setError("Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { fetchTicket(); }, [fetchTicket]);

  const handleSendReply = async () => {
    if (!ticket || !replyText.trim()) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/tickets/${ticket.id}/reply`, {
        method: "POST",
        body: JSON.stringify({ reply: replyText.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: "Error", description: data.error || "Failed to send reply", variant: "destructive" });
        return;
      }
      setReplyText("");
      toast({ title: "Reply sent" });
      await fetchTicket();
    } catch {
      toast({ title: "Error", description: "Failed to send reply", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!ticket) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/tickets/${ticket.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: ticket.status, internalNote: internalNote.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: "Error", description: data.error || "Failed to save note", variant: "destructive" });
        return;
      }
      toast({ title: "Internal note saved" });
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;
    setStatusUpdating(newStatus);
    try {
      const res = await adminFetch(`/tickets/${ticket.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: "Error", description: data.error || "Failed to update status", variant: "destructive" });
        return;
      }
      const data = await res.json();
      setTicket(prev => prev ? { ...prev, ...data.ticket, userName: prev.userName, userEmail: prev.userEmail } : null);
      toast({ title: `Status updated to ${TICKET_STATUS_LABELS[newStatus] || newStatus}` });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setStatusUpdating("");
    }
  };

  if (loading) return <DetailPageSkeleton />;

  if (error) {
    return (
      <div>
        <Link href="/admin/tickets" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </Link>
        <ErrorBanner message={error} onRetry={error !== "Ticket not found." ? fetchTicket : undefined} />
      </div>
    );
  }

  if (!ticket) return null;

  const transitions = STATUS_TRANSITIONS[ticket.status] || [];

  return (
    <div>
      <Link href="/admin/tickets" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Tickets
      </Link>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h1
          className="text-2xl md:text-3xl font-bold text-[#0A1628]"
          style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
        >
          Ticket #{ticket.id}
        </h1>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${TICKET_STATUS_COLORS[ticket.status] || "bg-gray-100 text-gray-700"}`}>
          {TICKET_STATUS_LABELS[ticket.status] || ticket.status}
        </span>
        {ticket.isCritical && (
          <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700">CRITICAL</span>
        )}
        {ticket.tierAtSubmission && (
          <span className={`px-2 py-1 rounded text-xs font-bold ${TIER_COLORS[ticket.tierAtSubmission] || "bg-gray-100 text-gray-700"}`}>
            {TIER_LABELS[ticket.tierAtSubmission] || ticket.tierAtSubmission}
          </span>
        )}
        {ticket.isAfterHours && (
          <span className="px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-700">After Hours</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Customer</dt>
                <dd className="font-medium text-right">{ticket.userName || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium text-right text-xs">{ticket.userEmail || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Created</dt>
                <dd className="font-medium">{formatRelativeTime(ticket.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Updated</dt>
                <dd className="font-medium">{formatRelativeTime(ticket.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">SLA</h2>
            {ticket.slaDeadline ? (
              ticket.firstResponseAt ? (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Responded at {formatDateTime(ticket.firstResponseAt)}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${SLA_COLORS[ticket.slaStatus || "green"]}`}>
                    <Clock className="w-4 h-4" />
                    {ticket.slaRemainingMinutes !== null ? formatSlaRemaining(ticket.slaRemainingMinutes) : "—"}
                  </div>
                  <p className="text-xs text-gray-400">Deadline: {formatDateTime(ticket.slaDeadline)}</p>
                </div>
              )
            ) : (
              <span className="text-sm text-gray-400">No SLA (non-subscriber)</span>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Actions</h2>
            <div className="flex flex-wrap gap-2">
              {transitions.map(t => (
                <button
                  key={t.value}
                  onClick={() => handleStatusChange(t.value)}
                  disabled={!!statusUpdating}
                  className={`px-3 py-1.5 text-white text-xs font-medium rounded-lg ${t.color} disabled:opacity-40`}
                >
                  {statusUpdating === t.value ? "Updating..." : t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Conversation</h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                  C
                </div>
                <div className="flex-1 bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{ticket.userName || "Customer"}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">Customer</span>
                    <span className="text-xs text-gray-400">{formatRelativeTime(ticket.createdAt)}</span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
                </div>
              </div>

              {replies.map(reply => (
                <div key={reply.id} className={`flex gap-3 ${reply.senderRole === "operator" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    reply.senderRole === "operator" ? "bg-[#B76E79]/20 text-[#B76E79]" : "bg-blue-100 text-blue-700"
                  }`}>
                    {reply.senderRole === "operator" ? "O" : "C"}
                  </div>
                  <div className={`flex-1 rounded-lg p-3 ${
                    reply.senderRole === "operator" ? "bg-[#0A1628]/5" : "bg-blue-50"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{reply.senderName || (reply.senderRole === "operator" ? "Operator" : "Customer")}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        reply.senderRole === "operator" ? "bg-[#B76E79]/20 text-[#B76E79]" : "bg-blue-100 text-blue-700"
                      }`}>
                        {reply.senderRole === "operator" ? "Operator" : "Customer"}
                      </span>
                      <span className="text-xs text-gray-400">{formatRelativeTime(reply.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                    {reply.attachmentUrl && (
                      <a
                        href={reply.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs text-[#B76E79] hover:underline"
                      >
                        <Paperclip className="w-3 h-3" /> Attachment
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Reply</h2>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Type your reply to the customer..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79] mb-3"
            />
            <button
              onClick={handleSendReply}
              disabled={saving || !replyText.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A1628] text-white rounded-lg text-sm font-medium hover:bg-[#0A1628]/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {saving ? "Sending..." : "Send Reply"}
            </button>
          </div>

          <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <StickyNote className="w-4 h-4 text-yellow-700" />
              <h2 className="text-sm font-semibold text-yellow-800">Internal Note (not visible to customer)</h2>
            </div>
            <textarea
              value={internalNote}
              onChange={e => setInternalNote(e.target.value)}
              placeholder="Add private notes about this ticket..."
              rows={3}
              className="w-full border border-yellow-300 bg-white rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 mb-3"
            />
            <button
              onClick={handleSaveNote}
              disabled={saving}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminTicketDetailPage() {
  return (
    <AdminLayout>
      <TicketDetailContent />
    </AdminLayout>
  );
}
