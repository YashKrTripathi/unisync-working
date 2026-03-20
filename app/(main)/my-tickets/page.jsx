/* eslint-disable react-hooks/purity */
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  ExternalLink,
  House,
  Loader2,
  MapPin,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function formatLocation(event) {
  if (!event) return "Event unavailable";
  if (event.locationType === "online") return "Online event";
  return [event.city, event.state || event.country].filter(Boolean).join(", ");
}

function getEventBoundary(event) {
  return event?.endDate ?? event?.startDate ?? 0;
}

function isArchivedRegistration(registration, now) {
  if (!registration?.event) return false;
  if (registration.status === "cancelled") return true;
  if ((registration.event.status || "approved") === "completed") return true;
  if ((registration.event.status || "approved") === "cancelled") return true;
  return getEventBoundary(registration.event) < now;
}

function isActiveRegistration(registration, now) {
  if (!registration?.event) return false;
  if (registration.status !== "confirmed") return false;
  return !isArchivedRegistration(registration, now);
}

function getTicketStatus(registration, now) {
  if (registration.status === "cancelled") {
    return { label: "Cancelled", tone: "bg-red-500/18 text-red-100 border-red-400/18" };
  }
  if (registration.checkedIn) {
    return { label: "Checked in", tone: "bg-emerald-500/18 text-emerald-100 border-emerald-400/18" };
  }
  const endBoundary = getEventBoundary(registration.event);
  if (registration.event?.startDate <= now && endBoundary >= now) {
    return { label: "Live now", tone: "bg-amber-500/18 text-amber-100 border-amber-400/18" };
  }
  if (isArchivedRegistration(registration, now)) {
    return { label: "Completed", tone: "bg-white/10 text-white/70 border-white/10" };
  }
  return { label: "Confirmed", tone: "bg-sky-500/18 text-sky-100 border-sky-400/18" };
}

function TicketSkeleton() {
  return (
    <div className="min-h-screen bg-[#060508] px-4 pb-24 pt-32 text-white sm:px-6">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="rounded-[36px] border border-white/10 bg-[#111015] p-8">
          <div className="h-4 w-28 rounded-full bg-white/10" />
          <div className="mt-5 h-16 w-2/3 rounded-[24px] bg-white/10" />
          <div className="mt-4 h-5 w-1/2 rounded-full bg-white/10" />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 rounded-[24px] bg-white/10" />
            ))}
          </div>
        </div>

        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="grid gap-0 overflow-hidden rounded-[34px] border border-white/10 bg-[#111015] lg:grid-cols-[1.45fr_0.95fr_0.68fr]"
          >
            <div className="h-72 bg-white/8" />
            <div className="space-y-4 p-8">
              <div className="h-5 w-24 rounded-full bg-white/10" />
              <div className="h-10 w-3/4 rounded-[20px] bg-white/10" />
              <div className="h-20 rounded-[20px] bg-white/10" />
            </div>
            <div className="border-l border-dashed border-white/10 p-8">
              <div className="h-full rounded-[26px] bg-white/8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroMetric({ label, value, detail }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#121019] p-5">
      <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-white/62">{detail}</p>
    </div>
  );
}

function ActiveTicketCard({ registration, now, isCancelling, onOpen, onCancel }) {
  const { event } = registration;
  const status = getTicketStatus(registration, now);

  return (
    <article className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,#17131a_0%,#0d0b11_48%,#17110d_100%)] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.85)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,138,4,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_24%)]" />

      <div className="relative grid gap-0 lg:grid-cols-[1.45fr_0.95fr_0.68fr]">
        <div className="relative min-h-[320px] overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#2b2213,#120f15)]" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,8,0.18)_0%,rgba(5,4,8,0.38)_45%,rgba(5,4,8,0.92)_100%)]" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-white/78">
                {event.category}
              </span>
              <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${status.tone}`}>
                {status.label}
              </span>
            </div>
            <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/62">
              Pass #{registration.qrCode.slice(-6)}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/48">Premium event pass</p>
            <h2 className="mt-3 max-w-xl font-display text-[clamp(2.8rem,4vw,4.6rem)] leading-[0.9] tracking-[-0.05em] text-white">
              {event.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
              {event.description}
            </p>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[rgba(202,138,4,0.16)] p-3 text-[#f6c66a]">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Ticket holder</p>
              <p className="mt-2 text-xl font-semibold text-white">{registration.attendeeName}</p>
              <p className="text-sm text-white/58">{registration.attendeeEmail}</p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[24px] border border-white/10 bg-[#100e14] p-5">
              <p className="flex items-center gap-3 text-sm text-white/78">
                <Calendar className="h-4 w-4 text-[#f59e0b]" />
                {format(event.startDate, "EEEE, MMM d, yyyy")}
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-white/68">
                <Clock3 className="h-4 w-4 text-[#f59e0b]" />
                {format(event.startDate, "h:mm a")} - {format(event.endDate, "h:mm a")}
              </p>
              <p className="mt-3 flex items-center gap-3 text-sm text-white/68">
                <MapPin className="h-4 w-4 text-[#f59e0b]" />
                {formatLocation(event)}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#100e14] p-5">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Booked on</span>
                <span>{format(registration.registeredAt, "MMM d, yyyy")}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-white/70">
                <span>Access</span>
                <span>{event.ticketType === "free" ? "Complimentary" : `INR ${event.ticketPrice}`}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-white/70">
                <span>Event code</span>
                <span className="font-mono text-white/88">{event.eventCode || registration.qrCode.slice(-8)}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              className="h-12 rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#ea580c)] text-black hover:opacity-95"
              onClick={() => onOpen(registration)}
            >
              View pass
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-2xl border-white/12 bg-transparent text-white hover:bg-white/6"
            >
              <Link href={`/events/${event.slug}`}>
                Open event
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-[#0c0b10] p-6 lg:border-l lg:border-t-0">
          <span className="absolute -left-4 top-10 hidden h-8 w-8 rounded-full bg-[#060508] lg:block" />
          <span className="absolute -left-4 bottom-10 hidden h-8 w-8 rounded-full bg-[#060508] lg:block" />

          <div className="flex h-full flex-col justify-between rounded-[28px] border border-dashed border-white/12 bg-[#111015] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Scan at gate</p>
                <p className="mt-2 text-base font-medium text-white">Secure entry pass</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mx-auto mt-6 rounded-[24px] bg-white p-4 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
              <QRCode value={registration.qrCode} size={158} level="H" />
            </div>

            <div className="mt-6 space-y-2 text-center">
              <p className="font-mono text-xs tracking-[0.14em] text-white/82">{registration.qrCode}</p>
              <p className="text-xs leading-6 text-white/56">
                Arrive 15 minutes early and keep brightness high for a quick scan.
              </p>
            </div>

            <Button
              type="button"
              variant="destructive"
              className="mt-6 h-12 rounded-2xl"
              disabled={isCancelling}
              onClick={() => onCancel(registration._id)}
            >
              {isCancelling ? "Cancelling..." : "Cancel ticket"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ArchiveTicketCard({ registration, now, onOpen }) {
  const { event } = registration;
  const status = getTicketStatus(registration, now);

  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111015] shadow-[0_30px_80px_-55px_rgba(0,0,0,0.82)]">
      <div className="relative h-48 overflow-hidden border-b border-white/10 bg-[#0b0a0e]">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover opacity-75"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,12,0.15)_0%,rgba(9,8,12,0.82)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${status.tone}`}>
            {status.label}
          </span>
          <h3 className="mt-3 text-2xl font-semibold text-white">{event.title}</h3>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-7 text-white/66">{event.description}</p>
        <div className="space-y-3 text-sm text-white/72">
          <p className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-[#f59e0b]" />
            {format(event.startDate, "MMM d, yyyy")}
          </p>
          <p className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-[#f59e0b]" />
            {formatLocation(event)}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-2xl border-white/12 bg-transparent text-white hover:bg-white/6"
            onClick={() => onOpen(registration)}
          >
            View archive
          </Button>
          <Button
            asChild
            className="h-11 flex-1 rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#ea580c)] text-black hover:opacity-95"
          >
            <Link href={`/events/${event.slug}`}>Open event</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function TicketDialog({ registration, open, onOpenChange }) {
  if (!registration) return null;

  const { event } = registration;
  const location = formatLocation(event);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl border-white/10 bg-[#09080c] p-0 text-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Event pass</DialogTitle>
        </DialogHeader>

        <div className="overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#161118_0%,#0d0b11_45%,#18120d_100%)]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[340px] border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
              {event.coverImage ? (
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#2b2213,#120f15)]" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,8,0.16)_0%,rgba(5,4,8,0.48)_44%,rgba(5,4,8,0.94)_100%)]" />

              <div className="absolute inset-0 flex flex-col justify-between p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/18 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/80">
                    UniSync access
                  </span>
                  <span className="rounded-full border border-emerald-400/18 bg-emerald-500/18 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-emerald-100">
                    Valid pass
                  </span>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.34em] text-white/48">Premium ticket</p>
                  <h2 className="mt-4 font-display text-[clamp(3rem,5vw,5rem)] leading-[0.9] tracking-[-0.06em] text-white">
                    {event.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-8 text-white/72">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative bg-[#0d0c11] p-7 sm:p-9">
              <span className="absolute -left-4 top-12 hidden h-8 w-8 rounded-full bg-[#09080c] lg:block" />
              <span className="absolute -left-4 bottom-12 hidden h-8 w-8 rounded-full bg-[#09080c] lg:block" />

              <div className="grid gap-6">
                <div className="rounded-[24px] border border-white/10 bg-[#14121a] p-5">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Attendee</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{registration.attendeeName}</p>
                  <p className="mt-1 text-sm text-white/60">{registration.attendeeEmail}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-[#14121a] p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Date</p>
                    <p className="mt-3 text-sm text-white">{format(event.startDate, "EEEE, MMM d, yyyy")}</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-[#14121a] p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Time</p>
                    <p className="mt-3 text-sm text-white">
                      {format(event.startDate, "h:mm a")} - {format(event.endDate, "h:mm a")}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-[#14121a] p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Location</p>
                    <p className="mt-3 text-sm text-white">{location}</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-[#14121a] p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Entry code</p>
                    <p className="mt-3 font-mono text-sm text-white">{event.eventCode || registration.qrCode.slice(-8)}</p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-dashed border-white/12 bg-[#111015] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.26em] text-white/45">Scan panel</p>
                      <p className="mt-2 text-base font-medium text-white">Present this at the venue</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div className="mx-auto mt-5 w-fit rounded-[24px] bg-white p-4 shadow-[0_20px_48px_rgba(0,0,0,0.35)]">
                    <QRCode value={registration.qrCode} size={182} level="H" />
                  </div>

                  <div className="mt-5 text-center">
                    <p className="font-mono text-xs tracking-[0.14em] text-white/84">{registration.qrCode}</p>
                    <p className="mt-2 text-xs leading-6 text-white/58">
                      This pass is personal, non-transferable, and should be shown before entry.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    asChild
                    className="h-12 rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#ea580c)] text-black hover:opacity-95"
                  >
                    <Link href={`/events/${event.slug}`}>
                      Open event
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-2xl border-white/12 bg-transparent text-white hover:bg-white/6"
                    onClick={() => onOpenChange(false)}
                  >
                    Close pass
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MyTicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { data: registrations, isLoading } = useConvexQuery(api.registrations.getMyRegistrations);
  const { mutate: cancelRegistration, isLoading: isCancelling } = useConvexMutation(
    api.registrations.cancelRegistration
  );

  const now = Date.now();

  const upcomingTickets = useMemo(
    () =>
      (registrations || [])
        .filter((registration) => isActiveRegistration(registration, now))
        .sort((a, b) => a.event.startDate - b.event.startDate),
    [registrations, now]
  );

  const archivedTickets = useMemo(
    () =>
      (registrations || [])
        .filter((registration) => isArchivedRegistration(registration, now))
        .sort((a, b) => getEventBoundary(b.event) - getEventBoundary(a.event)),
    [registrations, now]
  );

  const dashboardStats = useMemo(() => {
    const distinctCities = new Set(
      (registrations || [])
        .filter((registration) => registration.event?.locationType !== "online")
        .map((registration) => formatLocation(registration.event))
    );
    const nextTicket = [...upcomingTickets].sort((a, b) => a.event.startDate - b.event.startDate)[0];
    const attended = archivedTickets.filter((registration) => registration.checkedIn).length;

    return {
      activeCount: upcomingTickets.length,
      attendedCount: attended,
      cityCount: distinctCities.size,
      nextDate: nextTicket ? format(nextTicket.event.startDate, "MMM d") : "No upcoming date",
    };
  }, [archivedTickets, registrations, upcomingTickets]);

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;

    try {
      await cancelRegistration({ registrationId });
      toast.success("Ticket cancelled successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to cancel ticket");
    }
  };

  if (isLoading) {
    return <TicketSkeleton />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060508] px-4 pb-24 pt-32 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[8%] h-72 w-72 rounded-full bg-[#d97706]/10 blur-[120px]" />
        <div className="absolute right-[10%] top-[10%] h-64 w-64 rounded-full bg-[#7c2d12]/16 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_30%),linear-gradient(180deg,#09080c_0%,#060508_40%,#050408_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-10">
        <section className="grid gap-8 rounded-[38px] border border-white/10 bg-[linear-gradient(135deg,#141018_0%,#0d0b11_55%,#16110c_100%)] p-7 shadow-[0_40px_130px_-70px_rgba(0,0,0,0.9)] sm:p-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.36em] text-white/42">My ticket lounge</p>
            <h1 className="mt-4 font-display text-[clamp(3.3rem,8vw,6.7rem)] leading-[0.88] tracking-[-0.06em] text-white">
              CURATED PASSES
            </h1>
            <p className="mt-5 max-w-2xl font-serif text-2xl italic leading-9 text-[#ead8c3] sm:text-3xl">
              Your premium entry collection for upcoming experiences and past event memories.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
              Every active registration is presented like a proper event pass, with fast entry access, refined detail
              hierarchy, and an archive that still feels intentional.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-[#100e14] px-4 py-2 text-sm text-white/72">
                Instant QR access
              </span>
              <span className="rounded-full border border-white/10 bg-[#100e14] px-4 py-2 text-sm text-white/72">
                Premium ticket layout
              </span>
              <span className="rounded-full border border-white/10 bg-[#100e14] px-4 py-2 text-sm text-white/72">
                Live archive history
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <HeroMetric
              label="Active passes"
              value={String(dashboardStats.activeCount).padStart(2, "0")}
              detail="Confirmed upcoming access ready for entry."
            />
            <HeroMetric
              label="Attended"
              value={String(dashboardStats.attendedCount).padStart(2, "0")}
              detail="Events you have already checked into."
            />
            <HeroMetric
              label="Cities"
              value={String(dashboardStats.cityCount).padStart(2, "0")}
              detail="Distinct locations across your event history."
            />
            <HeroMetric
              label="Next date"
              value={dashboardStats.nextDate}
              detail="Closest upcoming event in your collection."
            />
          </div>
        </section>

        {upcomingTickets.length > 0 ? (
          <section className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">Upcoming access</p>
                <h2 className="mt-3 font-serif text-4xl italic text-white sm:text-5xl">Ready to enter</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-white/58">
                Your live collection is arranged like premium passes so the important details are visible in one glance.
              </p>
            </div>

            <div className="space-y-6">
              {upcomingTickets.map((registration) => (
                <ActiveTicketCard
                  key={registration._id}
                  registration={registration}
                  now={now}
                  isCancelling={isCancelling}
                  onOpen={setSelectedTicket}
                  onCancel={handleCancelRegistration}
                />
              ))}
            </div>
          </section>
        ) : null}

        {archivedTickets.length > 0 ? (
          <section className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">Archive</p>
                <h2 className="mt-3 font-serif text-4xl italic text-white sm:text-5xl">Past collection</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-white/58">
                Completed and cancelled passes stay available in a refined archive instead of disappearing into a table.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {archivedTickets.map((registration) => (
                <ArchiveTicketCard
                  key={registration._id}
                  registration={registration}
                  now={now}
                  onOpen={setSelectedTicket}
                />
              ))}
            </div>
          </section>
        ) : null}

        {!upcomingTickets.length && !archivedTickets.length ? (
          <Card className="rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,#141018_0%,#0c0a10_100%)] p-12 text-center text-white">
            <div className="mx-auto max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">No passes yet</p>
              <h2 className="mt-4 font-serif text-4xl italic text-white sm:text-5xl">Your ticket collection is empty</h2>
              <p className="mt-5 text-base leading-8 text-white/68">
                Register for an event and your passes will appear here with the same premium entry format.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#ea580c)] px-6 text-black hover:opacity-95"
                >
                  <Link href="/events">Browse events</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-2xl border-white/12 bg-transparent px-6 text-white hover:bg-white/6"
                >
                  <Link href="/">
                    <House className="mr-2 h-4 w-4" />
                    Go home
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ) : null}
      </div>

      <TicketDialog
        registration={selectedTicket}
        open={Boolean(selectedTicket)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTicket(null);
          }
        }}
      />
    </div>
  );
}
