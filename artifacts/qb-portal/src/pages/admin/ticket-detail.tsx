import { useState, useEffect, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { adminFetch, formatDateTime, TICKET_STATUS_LABELS, TICKET_STATUS_COLORS } from "@/lib/admin-api";
import { DetailPageSkeleton, ErrorBanner } from "@/components/admin-skeletons";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface TicketData {
  id: number;
  subject: string;
  message: string;
  status: string;
  isCritical: boolean;
  tierAtSubmission: string | null;
  operatorReply: string | null;
  internalNote: string | null;
  firstResponseAt: string | null;
  createdAt: string;
  updatedAt: string;
  userName: string | null;
  userEmail: string | null;
}

const TICKET_STATUSES = ["open", "resolved", "closed"];

function TicketDetailContent() {
  const [, params] = useRoute("/admin/tickets/:id");
  const ticketId = params?.id;
  const { toast } = useToast();

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reply, setReply] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchTicket = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    setError("");
    try {
      const res = await adminFetch(`/tickets/${ticketId}`);
      if (res.status === 404) {
        setError("Ticket not found.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTicket(data.ticket);
      setSelectedStatus(data.ticket.status);
      setReply("");
    } catch {
      setError("Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { fetchTicket(); }, [fetchTicket]);

  const handleSaveReply = async () => {
    if (!ticket) return;
    if (!reply.trim() && selectedStatus === ticket.status) return;

    const previousStatus = ticket.status;
    if (selectedStatus !== ticket.status) {
      setTicket(prev => prev ? { ...prev, status: selectedStatus } : null);
    }

    setSaving(true);
    try {
      if (reply.trim()) {
        const res = await adminFetch(`/tickets/${ticket.id}/reply`, {
          method: "POST",
          body: JSON.stringify({
            reply: reply.trim(),
            status: selectedStatus !== previousStatus ? selectedStatus : undefined,
          }),
        });
        if (!res.ok) {
          setTicket(prev => prev ? { ...prev, status: previousStatus } : null);
          setSelectedStatus(previousStatus);
          const data = await res.json();
          toast({ title: "Error", description: data.error || "Failed to save reply", variant: "destructive" });
          return;
        }
        const data = await res.json();
        setTicket(prev => prev ? { ...prev, ...data.ticket, userName: prev.userName, userEmail: prev.userEmail } : null);
        setReply("");
        toast({ title: "Reply saved" });
      } else if (selectedStatus !== previousStatus) {
        const res = await adminFetch(`/tickets/${ticket.id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: selectedStatus }),
        });
        if (!res.ok) {
          setTicket(prev => prev ? { ...prev, status: previousStatus } : null);
          setSelectedStatus(previousStatus);
          const data = await res.json();
          toast({ title: "Error", description: data.error || "Failed to update status", variant: "destructive" });
          return;
        }
        const data = await res.json();
        setTicket(prev => prev ? { ...prev, ...data.ticket, userName: prev.userName, userEmail: prev.userEmail } : null);
        toast({ title: `Status updated to ${TICKET_STATUS_LABELS[selectedStatus] || selectedStatus}` });
      }
    } catch {
      setTicket(prev => prev ? { ...prev, status: previousStatus } : null);
      setSelectedStatus(previousStatus);
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <DetailPageSkeleton />;
  }

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

  return (
    <div>
      <Link href="/admin/tickets" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Tickets
      </Link>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold text-[#0A1628]"
          style={{ fontFamily: "'Alegreya Sans SC', sans-serif" }}
        >
          Ticket #{ticket.id}
        </h1>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${TICKET_STATUS_COLORS[ticket.status] || "bg-gray-100 text-gray-700"}`}>
          {TICKET_STATUS_LABELS[ticket.status] || ticket.status}
        </span>
        {ticket.isCritical && (
          <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700">CRITICAL</span>
        )}
        {ticket.tierAtSubmission === "premium" && (
          <span className="px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700">PREMIUM</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-[#0A1628] mb-3">{ticket.subject}</h2>
          <dl className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <dt className="text-gray-500">Customer</dt>
              <dd className="font-medium">{ticket.userName || "—"} ({ticket.userEmail || "—"})</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created</dt>
              <dd className="font-medium">{formatDateTime(ticket.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Updated</dt>
              <dd className="font-medium">{formatDateTime(ticket.updatedAt)}</dd>
            </div>
            {ticket.tierAtSubmission && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Tier</dt>
                <dd className="font-medium capitalize">{ticket.tierAtSubmission}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-[#0A1628] mb-3">Customer Message</h2>
          <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap text-gray-700">
            {ticket.message}
          </div>
        </div>
      </div>

      {ticket.operatorReply && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="text-lg font-semibold text-[#0A1628] mb-3">Previous Reply</h2>
          <div className="bg-blue-50 rounded-lg p-4 text-sm whitespace-pre-wrap text-gray-700">
            {ticket.operatorReply}
          </div>
          {ticket.firstResponseAt && (
            <p className="text-xs text-gray-400 mt-2">First response: {formatDateTime(ticket.firstResponseAt)}</p>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="text-lg font-semibold text-[#0A1628] mb-4">Reply</h2>

        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          placeholder="Type your reply..."
          rows={5}
          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30 focus:border-[#B76E79] mb-4"
        />

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30"
          >
            {TICKET_STATUSES.map(s => (
              <option key={s} value={s}>{TICKET_STATUS_LABELS[s] || s}</option>
            ))}
          </select>

          <button
            onClick={handleSaveReply}
            disabled={saving || (!reply.trim() && selectedStatus === ticket.status)}
            className="px-4 py-2 bg-[#0A1628] text-white rounded-lg text-sm font-medium hover:bg-[#0A1628]/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Reply"}
          </button>
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
