"use client";

import { use, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Shield,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";

import { api } from "@/convex/_generated/api";

function SectionCard({ title, children }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 text-white">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function EventDetailPage({ params }) {
  const { id } = use(params);
  const adminCheck = useQuery(api.admin.isAdmin);
  const isAdmin = adminCheck?.canAccessAdminPanel === true;
  const eventData = useQuery(api.adminEvents.getEventWithStats, isAdmin ? { eventId: id } : "skip");
  const reviewChangeRequest = useMutation(api.adminEvents.reviewChangeRequest);
  const [reviewNotes, setReviewNotes] = useState({});

  const handleReview = async (requestId, status) => {
    try {
      await reviewChangeRequest({
        requestId,
        status,
        reviewNotes: reviewNotes[requestId]?.trim() || undefined,
      });
      toast.success(`Change request ${status}.`);
      setReviewNotes((current) => ({ ...current, [requestId]: "" }));
    } catch (error) {
      toast.error(error.message || "Could not review request");
    }
  };

  if (!eventData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  const contentSections = eventData.contentSections || {};
  const changeRequests = eventData.changeRequests || [];

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.9))] p-6 text-white">
        <div className="flex items-center justify-between">
          <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm text-slate-200 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to events
          </Link>
          <Link 
            href={`/admin/events/${id}/studio`}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff6b1a,#ff8c00)] px-4 py-1.5 text-xs font-bold text-white shadow-lg transition-all hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            OPEN CREATIVE STUDIO
          </Link>
        </div>
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{eventData.title}</h1>
            <p className="mt-2 text-sm text-slate-200">{eventData.organizerName} · {eventData.category}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">{eventData.effectiveStatus}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">{eventData.stats.totalRegistrations} registrations</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">{changeRequests.length} change requests</span>
              </div>
            </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <p className="text-sm text-slate-200">Attendance rate</p>
              <p className="mt-3 text-3xl font-semibold">{eventData.stats.attendanceRate}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <p className="text-sm text-slate-200">Revenue</p>
              <p className="mt-3 text-3xl font-semibold">{eventData.stats.revenue === 0 ? "Free" : `₹${eventData.stats.revenue}`}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Event Ops Snapshot">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Calendar className="h-4 w-4" />
                Schedule
              </div>
              <p className="mt-3 text-sm text-white">{format(new Date(eventData.startDate), "PPP p")}</p>
              <p className="mt-1 text-sm text-slate-400">to {format(new Date(eventData.endDate), "PPP p")}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="h-4 w-4" />
                Location
              </div>
              <p className="mt-3 text-sm text-white">{eventData.locationType === "online" ? "Online event" : `${eventData.city}, ${eventData.state || eventData.country}`}</p>
              {eventData.venue ? (
                <a href={eventData.venue} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white">
                  Open venue link
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">{eventData.description}</p>
        </SectionCard>

        <SectionCard title="Assigned Event Admins">
          <div className="space-y-3">
            {(eventData.eventAdmins || []).map((admin) => (
              <div key={admin.userId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15">
                    <Shield className="h-4 w-4 text-blue-200" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{admin.name}</p>
                    <p className="text-sm text-slate-400">{admin.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Public Page Content">
          <div className="space-y-5 text-sm text-slate-300">
            {contentSections.heroBlurb ? <p className="rounded-2xl border border-white/10 bg-white/5 p-4">{contentSections.heroBlurb}</p> : null}
            {contentSections.whyAttend?.length ? (
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-slate-500">Why attend</p>
                <div className="space-y-2">
                  {contentSections.whyAttend.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3">{item}</div>
                  ))}
                </div>
              </div>
            ) : null}
            {contentSections.agenda?.length ? (
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-slate-500">Agenda</p>
                <div className="space-y-2">
                  {contentSections.agenda.map((item, index) => (
                    <div key={`${item.time}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-medium text-white">{item.time} · {item.title}</p>
                      {item.description ? <p className="mt-1 text-sm text-slate-400">{item.description}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {contentSections.contactEmail ? (
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Mail className="h-4 w-4 text-blue-200" />
                <span>{contentSections.contactEmail}</span>
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="AI / Content Approval Queue">
          <div className="space-y-4">
            {changeRequests.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">
                No AI/content requests have been submitted for this event yet.
              </div>
            )}
            {changeRequests.map((request) => (
              <div key={request._id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">{request.status}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">{request.requestType}</span>
                  <span className="text-xs text-slate-400">by {request.requestedByName}</span>
                </div>
                <p className="mt-3 text-sm text-white">{request.summary}</p>
                {request.aiPrompt ? (
                  <div className="mt-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 text-sm text-blue-100">
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-blue-200/80">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Prompt
                    </div>
                    {request.aiPrompt}
                  </div>
                ) : null}
                {request.status === "pending" ? (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={reviewNotes[request._id] || ""}
                      onChange={(event) => setReviewNotes((current) => ({ ...current, [request._id]: event.target.value }))}
                      rows={3}
                      placeholder="Approval note"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300/40"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button onClick={() => handleReview(request._id, "approved")} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-500/25">
                        <CheckCircle2 className="h-4 w-4" />
                        Approve and apply
                      </button>
                      <button onClick={() => handleReview(request._id, "denied")} className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-500/25">
                        <XCircle className="h-4 w-4" />
                        Deny
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">
                    Reviewed by {request.reviewedByName || "authority"} on {format(new Date(request.updatedAt), "MMM d, yyyy")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Attendee Snapshot">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Users className="h-4 w-4" />
              Confirmed
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">{eventData.stats.totalRegistrations}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="h-4 w-4" />
              Checked in
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">{eventData.stats.totalCheckedIn}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="h-4 w-4" />
              Cancelled
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">{eventData.stats.totalCancelled}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
