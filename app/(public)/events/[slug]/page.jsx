"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Share2,
  Ticket,
  Users,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RegisterModal from "./_components/register-modal";

function hexToRgba(color, alpha) {
  const normalized = color?.replace("#", "");
  if (!normalized || normalized.length !== 6) return `rgba(249, 115, 22, ${alpha})`;
  const number = Number.parseInt(normalized, 16);
  const r = (number >> 16) & 255;
  const g = (number >> 8) & 255;
  const b = number & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function EventSkeleton() {
  return (
    <div className="min-h-screen bg-[#080607] px-4 pb-20 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8">
            <div className="h-5 w-28 rounded-full bg-white/10" />
            <div className="mt-6 h-16 w-4/5 rounded-3xl bg-white/10" />
            <div className="mt-4 h-6 w-3/4 rounded-full bg-white/10" />
            <div className="mt-3 h-6 w-2/3 rounded-full bg-white/10" />
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="h-12 w-48 rounded-full bg-white/10" />
              <div className="h-12 w-40 rounded-full bg-white/10" />
              <div className="h-12 w-44 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8">
            <div className="h-64 rounded-[28px] bg-white/10" />
            <div className="mt-6 h-14 rounded-2xl bg-white/10" />
            <div className="mt-4 h-14 rounded-2xl bg-white/10" />
            <div className="mt-4 h-14 rounded-2xl bg-white/10" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
              <div className="h-6 w-40 rounded-full bg-white/10" />
              <div className="mt-5 h-4 rounded-full bg-white/10" />
              <div className="mt-3 h-4 rounded-full bg-white/10" />
              <div className="mt-3 h-4 w-2/3 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetaChip({ icon: Icon, children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white/78 backdrop-blur-xl">
      <Icon className="h-4 w-4 text-[var(--accent-color)]" />
      <span>{children}</span>
    </div>
  );
}

function SectionShell({ eyebrow, title, children }) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.35em] text-white/42">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl italic text-white sm:text-4xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
      <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">{label}</p>
      <p className="mt-3 text-lg font-medium text-white">{value}</p>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [currentTime] = useState(() => Date.now());

  const { data: event, isLoading } = useConvexQuery(api.events.getEventBySlug, {
    slug: params.slug,
  });
  const { data: registration } = useConvexQuery(
    api.registrations.checkRegistration,
    event?._id ? { eventId: event._id } : "skip"
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: event.description.slice(0, 120),
        url,
      });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Event link copied");
  };

  if (isLoading) {
    return <EventSkeleton />;
  }

  if (!event) {
    notFound();
  }

  const sections = event.contentSections || {};
  const accent = event.themeColor || "#f97316";
  const isEventFull = event.registrationCount >= event.capacity;
  const isEventPast = event.endDate < currentTime;
  const seatsLeft = Math.max(event.capacity - event.registrationCount, 0);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#080607] px-4 pb-20 pt-28 text-white sm:px-6"
      style={{
        ["--accent-color"]: accent,
        ["--accent-soft"]: hexToRgba(accent, 0.22),
        ["--accent-faint"]: hexToRgba(accent, 0.08),
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[340px] w-[340px] -translate-x-1/2 rounded-full blur-[110px]" style={{ background: "var(--accent-soft)" }} />
        <div className="absolute right-[8%] top-[16%] h-56 w-56 rounded-full bg-white/[0.04] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_34%),linear-gradient(180deg,#0b090a_0%,#080607_48%,#060505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:52px_52px] opacity-[0.18]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="overflow-hidden rounded-[38px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-0 bg-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white">
                Premium Event Template
              </Badge>
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.28em] text-white/40">
                {event.ticketType === "free" ? "Open Access" : "Reserved Access"}
              </span>
            </div>

            <h1 className="mt-8 max-w-4xl font-display text-[clamp(3.2rem,8vw,6.6rem)] leading-[0.9] tracking-[-0.05em] text-white">
              {event.title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">
              {sections.heroBlurb || event.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <MetaChip icon={Calendar}>
                {format(event.startDate, "EEEE, MMM dd, yyyy")}
              </MetaChip>
              <MetaChip icon={Clock}>
                {format(event.startDate, "h:mm a")} to {format(event.endDate, "h:mm a")}
              </MetaChip>
              <MetaChip icon={MapPin}>
                {event.locationType === "online"
                  ? "Online event"
                  : `${event.city}, ${event.state || event.country}`}
              </MetaChip>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <DetailItem label="Seats left" value={isEventPast ? "Closed" : `${seatsLeft}`} />
              <DetailItem label="Audience" value={`${event.registrationCount}/${event.capacity}`} />
              <DetailItem label="Organiser" value={event.organizerName} />
            </div>
          </section>

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div className="relative h-[320px] overflow-hidden border-b border-white/10">
                {event.coverImage ? (
                  <>
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--accent-soft),transparent_45%),linear-gradient(135deg,#111112,#1a1718)]" />
                )}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">
                    Ticketing
                  </p>
                  <p className="mt-3 text-5xl font-semibold text-white">
                    {event.ticketType === "free" ? "Free" : `INR ${event.ticketPrice}`}
                  </p>
                  <p className="mt-2 text-sm text-white/66">
                    {event.ticketType === "free"
                      ? "Reserve a seat instantly."
                      : "Offline collection at venue check-in."}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {registration ? (
                  <div className="rounded-[24px] border border-emerald-400/18 bg-emerald-500/10 p-5 text-emerald-100">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      <div>
                        <p className="text-lg font-medium">You are already registered</p>
                        <p className="mt-1 text-sm text-emerald-100/80">
                          Your seat is locked in. Open your ticket any time before the event.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Venue</p>
                    <p className="mt-3 text-sm font-medium text-white">
                      {event.locationType === "online" ? "Digital access" : event.city}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Entry</p>
                    <p className="mt-3 text-sm font-medium text-white">
                      {isEventPast ? "Closed" : isEventFull ? "Waitlist only" : "Open now"}
                    </p>
                  </div>
                </div>

                {registration ? (
                  <Button
                    className="h-[52px] w-full rounded-2xl text-base font-semibold text-white"
                    style={{ backgroundColor: accent }}
                    onClick={() => router.push("/my-tickets")}
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    View Ticket
                  </Button>
                ) : isEventPast ? (
                  <Button className="h-[52px] w-full rounded-2xl text-base" disabled>
                    Event Ended
                  </Button>
                ) : isEventFull ? (
                  <Button className="h-[52px] w-full rounded-2xl text-base" disabled>
                    Event Full
                  </Button>
                ) : (
                  <Button
                    className="h-[52px] w-full rounded-2xl text-base font-semibold text-white"
                    style={{ backgroundColor: accent }}
                    onClick={() => setShowRegisterModal(true)}
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    Reserve Your Seat
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="h-[52px] w-full rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.07]"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Event
                </Button>
              </div>
            </div>
          </aside>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <SectionShell eyebrow="Story" title="About this event">
            <p className="max-w-3xl text-base leading-8 text-white/72">
              {event.description}
            </p>

            {sections.whyAttend?.length ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {sections.whyAttend.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-white/10 bg-black/18 p-5 text-sm leading-7 text-white/76"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : null}
          </SectionShell>

          <SectionShell eyebrow="Visit" title="Location and contact">
            <div className="space-y-5 text-white/72">
              <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
                <p className="flex items-center gap-3 text-base text-white">
                  <MapPin className="h-5 w-5 text-[var(--accent-color)]" />
                  {event.locationType === "online"
                    ? "Online event"
                    : `${event.city}, ${event.state || event.country}`}
                </p>
                {event.address ? (
                  <p className="mt-3 text-sm leading-7 text-white/68">{event.address}</p>
                ) : null}
              </div>

              {event.venue ? (
                <a
                  href={event.venue}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-[24px] border border-white/10 bg-black/18 p-5 text-white transition hover:bg-white/[0.06]"
                >
                  <span>Open venue link</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}

              {sections.contactEmail ? (
                <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-black/18 p-5 text-white">
                  <Mail className="h-5 w-5 text-[var(--accent-color)]" />
                  <span>{sections.contactEmail}</span>
                </div>
              ) : null}

              {sections.attendeeNotes ? (
                <div className="rounded-[24px] border border-white/10 bg-black/18 p-5 text-sm leading-7 text-white/72">
                  {sections.attendeeNotes}
                </div>
              ) : null}
            </div>
          </SectionShell>
        </div>

        {sections.agenda?.length ? (
          <SectionShell eyebrow="Flow" title="Agenda">
            <div className="grid gap-4 lg:grid-cols-2">
              {sections.agenda.map((item, index) => (
                <div
                  key={`${item.time}-${index}`}
                  className="rounded-[26px] border border-white/10 bg-black/18 p-6"
                >
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">
                    {item.time}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium text-white">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-3 text-sm leading-7 text-white/68">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionShell>
        ) : null}

        {(sections.faqs?.length || sections.resources?.length) ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {sections.faqs?.length ? (
              <SectionShell eyebrow="Support" title="Frequently asked">
                <div className="space-y-4">
                  {sections.faqs.map((item, index) => (
                    <div
                      key={`${item.question}-${index}`}
                      className="rounded-[24px] border border-white/10 bg-black/18 p-5"
                    >
                      <p className="text-lg font-medium text-white">{item.question}</p>
                      <p className="mt-3 text-sm leading-7 text-white/68">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </SectionShell>
            ) : null}

            {sections.resources?.length ? (
              <SectionShell eyebrow="Links" title="Resources">
                <div className="space-y-4">
                  {sections.resources.map((item, index) => (
                    <a
                      key={`${item.label}-${index}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-[24px] border border-white/10 bg-black/18 p-5 text-white transition hover:bg-white/[0.06]"
                    >
                      <div>
                        <p className="text-lg font-medium">{item.label}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/42">
                          External Resource
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[var(--accent-color)]" />
                    </a>
                  ))}
                </div>
              </SectionShell>
            ) : null}
          </div>
        ) : null}
      </div>

      {showRegisterModal ? (
        <RegisterModal
          event={event}
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      ) : null}
    </div>
  );
}
