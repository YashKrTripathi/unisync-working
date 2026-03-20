"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileStack,
  Loader2,
  Search,
  Shield,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  pending: "bg-amber-500/15 text-amber-100",
  approved: "bg-blue-500/15 text-blue-100",
  live: "bg-emerald-500/15 text-emerald-100",
  completed: "bg-slate-500/15 text-slate-100",
  cancelled: "bg-rose-500/15 text-rose-100",
};

function Pill({ children, tone = "default" }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", tone === "default" ? "bg-white/8 text-slate-200" : tone)}>
      {children}
    </span>
  );
}

export default function EventsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [proposalReview, setProposalReview] = useState({});

  const adminCheck = useQuery(api.admin.isAdmin);
  const isAdmin = adminCheck?.canAccessAdminPanel === true;

  const proposals = useQuery(api.adminEvents.getAllProposals, isAdmin ? { searchTerm: searchTerm || undefined } : "skip");
  const events = useQuery(api.adminEvents.getAllEvents, isAdmin ? { searchTerm: searchTerm || undefined } : "skip");
  const reviewProposal = useMutation(api.adminEvents.reviewProposal);
  const updateStatus = useMutation(api.adminEvents.updateEventStatus);

  const stats = useMemo(() => {
    const proposalList = proposals || [];
    const eventList = events || [];
    return {
      pendingProposals: proposalList.filter((proposal) => proposal.status === "pending").length,
      approvedProposals: proposalList.filter((proposal) => proposal.status === "approved").length,
      activeEvents: eventList.filter((event) => ["approved", "live"].includes(event.effectiveStatus)).length,
      pendingRequests: eventList.reduce((total, event) => total + (event.pendingChangeRequests || 0), 0),
    };
  }, [events, proposals]);

  const handleProposalReview = async (proposalId, status) => {
    try {
      await reviewProposal({
        proposalId,
        status,
        reviewNotes: proposalReview[proposalId]?.trim() || undefined,
      });
      toast.success(`Proposal ${status === "approved" ? "approved" : "denied"}.`);
      setProposalReview((current) => ({ ...current, [proposalId]: "" }));
    } catch (error) {
      toast.error(error.message || "Could not update proposal");
    }
  };

  const handleEventStatus = async (eventId, status) => {
    try {
      await updateStatus({
        eventId,
        status,
        reason: status === "cancelled" ? "Cancelled by authority" : undefined,
      });
      toast.success(`Event ${status} successfully.`);
    } catch (error) {
      toast.error(error.message || "Could not update event");
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!proposals || !events) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.9))] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.32)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Pill tone="bg-white/10 text-blue-50">Authority Workspace</Pill>
            <h1 className="mt-4 text-3xl font-semibold">Proposals, approvals, and event admin handoff</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-200">
              Review organiser proposals, approve or deny them, then move approved items into the richer event builder where event admins are assigned before launch.
            </p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search proposals or events"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 pl-11 pr-4 text-sm text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300/40"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { label: "Pending proposals", value: stats.pendingProposals, icon: FileStack },
            { label: "Approved waiting build", value: stats.approvedProposals, icon: Shield },
            { label: "Active events", value: stats.activeEvents, icon: Calendar },
            { label: "Pending AI/content approvals", value: stats.pendingRequests, icon: Sparkles },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-200">{item.label}</p>
                <item.icon className="h-5 w-5 text-blue-200" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Proposal Approval Queue</h2>
            <p className="text-sm text-slate-400">Approve to unlock the event builder, or deny with notes so organisers know what to fix.</p>
          </div>
          <Pill>{proposals.length} proposals</Pill>
        </div>

        <div className="grid gap-4">
          {proposals.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
              No proposals match the current search.
            </div>
          )}

          {proposals.map((proposal) => (
            <div key={proposal._id} className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 text-white">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold">{proposal.title}</h3>
                    <Pill tone={STATUS_CONFIG[proposal.status] || STATUS_CONFIG.pending}>{proposal.status}</Pill>
                    <Pill>{proposal.category}</Pill>
                    <Pill>{proposal.locationPreference}</Pill>
                  </div>
                  <p className="max-w-3xl text-sm leading-6 text-slate-300">{proposal.conceptNote}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                    <span>By {proposal.proposerName}</span>
                    <span>Audience: {proposal.targetAudience}</span>
                    {proposal.expectedCapacity ? <span>Expected capacity: {proposal.expectedCapacity}</span> : null}
                    <span>Submitted {format(new Date(proposal.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>

                <div className="w-full max-w-md space-y-3">
                  <textarea
                    value={proposalReview[proposal._id] || ""}
                    onChange={(event) => setProposalReview((current) => ({ ...current, [proposal._id]: event.target.value }))}
                    rows={3}
                    placeholder="Review note for the organiser"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300/40"
                  />
                  <div className="grid gap-3 md:grid-cols-3">
                    <button onClick={() => handleProposalReview(proposal._id, "approved")} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-500/25">
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </button>
                    <button onClick={() => handleProposalReview(proposal._id, "denied")} className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-500/25">
                      <XCircle className="h-4 w-4" />
                      Deny
                    </button>
                    {proposal.status === "approved" && (
                      <Link href={`/admin/create-event?proposalId=${proposal._id}`} className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500/15 px-4 py-3 text-sm font-medium text-blue-100 transition hover:bg-blue-500/25">
                        Build Event
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Event Operations Board</h2>
            <p className="text-sm text-slate-400">Track admin coverage, AI/content approvals, and the live status of built events.</p>
          </div>
          <Pill>{events.length} events</Pill>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {events.map((event) => (
            <div key={event._id} className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <Pill tone={STATUS_CONFIG[event.effectiveStatus] || STATUS_CONFIG.approved}>{event.effectiveStatus}</Pill>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{event.organizerName} · {event.category}</p>
                </div>
                <Link href={`/admin/events/${event._id}`} className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15">
                  Open
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Users className="h-4 w-4" />
                    Event admins
                  </div>
                  <p className="mt-3 text-2xl font-semibold">{event.adminCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock className="h-4 w-4" />
                    Pending approvals
                  </div>
                  <p className="mt-3 text-2xl font-semibold">{event.pendingChangeRequests}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar className="h-4 w-4" />
                    Registrations
                  </div>
                  <p className="mt-3 text-2xl font-semibold">{event.totalRegistrations}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {event.effectiveStatus === "pending" && (
                  <button onClick={() => handleEventStatus(event._id, "approved")} className="rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-500/25">
                    Approve Event
                  </button>
                )}
                {event.effectiveStatus !== "cancelled" && (
                  <button onClick={() => handleEventStatus(event._id, "cancelled")} className="rounded-2xl bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-500/25">
                    Cancel Event
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
