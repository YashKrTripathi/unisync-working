"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Sparkles, ArrowRight, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

const now = Date.now();

function computeStatus(event) {
  if (!event) return { label: "Unknown", tone: "border-white/15 text-white/70 bg-white/10" };
  const referenceDate = event.endDate || event.startDate;
  if (event.startDate <= now && referenceDate >= now) {
    return { label: "Live", tone: "border-emerald-400/40 text-emerald-100 bg-emerald-500/10" };
  }
  if (event.startDate > now) {
    return { label: "Upcoming", tone: "border-sky-400/40 text-sky-100 bg-sky-500/10" };
  }
  return { label: "Past", tone: "border-white/20 text-white/70 bg-white/5" };
}

function filterEvents(events = [], type) {
  return events
    .filter((event) => {
      if (!event) return false;
      const referenceDate = event.endDate || event.startDate;
      if (type === "current") {
        return event.startDate <= now && referenceDate >= now;
      }
      if (type === "upcoming") {
        return event.startDate > now;
      }
      return false;
    })
    .slice(0, 6);
}

function EventCard({ event, variant }) {
  const status = computeStatus(event);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-b from-[#161216]/80 to-[#090708]/60 transition-all duration-400 hover:-translate-y-1 hover:border-white/40"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {event.coverImage && (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/40" />
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/80">
          <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1">
            {getCategoryLabel(event.category)}
          </span>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.25em] ${status.tone}`}>
            <CircleDot className="h-3 w-3" />
            {status.label}
          </span>
        </div>
      </div>
        <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-[1.6rem] font-semibold leading-tight tracking-tight text-white">
            {event.title}
          </h3>
          <span className="rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-nameless-orange)]">
            {getCategoryLabel(event.category)}
          </span>
        </div>
        <p className="mt-3 text-base leading-relaxed text-white/82">{event.description}</p>
        <div className="mt-5 flex flex-col gap-3 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[var(--color-nameless-orange)]" />
            {format(event.startDate, "MMM dd â€¢ h:mm a")}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--color-nameless-orange)]" />
            {event.city}, {event.state || event.country}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[var(--color-nameless-orange)]" />
            {event.registrationCount}/{event.capacity} reserved
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between pt-5 text-white/80">
          <span className="text-xs">Status: {variant}</span>
          <ArrowRight className="h-4 w-4 text-white/70 transition-colors duration-300 group-hover:text-[var(--color-nameless-orange)]" />
        </div>
      </div>
    </Link>
  );
}

function EventsLoadingState({ title }) {
  return (
    <div className="events-loader-shell rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-[#0f0a12] to-black/40 px-6 py-12">
      <div className="events-loader-shell__glow" />
      <div className="relative flex flex-col items-center justify-center gap-5 text-center">
        <div className="loader" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`events-loader-${title}-${index}`} className="circle">
              <div className="dot" />
              <div className="outline" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[var(--color-nameless-orange)]">
            Loading the events
          </p>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/60">
            Preparing the {title.toLowerCase()} cards.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { data: upcomingEvents = [], isLoading: isLoadingUpcoming } = useConvexQuery(
    api.explore.getPopularEvents,
    { limit: 12 }
  );
  const { data: pastEvents = [], isLoading: isLoadingPast } = useConvexQuery(api.explore.getPastEvents, {
    limit: 12,
  });

  const liveEvents = useMemo(() => filterEvents(upcomingEvents, "current"), [upcomingEvents]);
  const futureEvents = useMemo(() => filterEvents(upcomingEvents, "upcoming"), [upcomingEvents]);
  // Past/completed events already arrive pre-filtered from Convex; avoid re-filtering them out.
  const archiveEvents = useMemo(() => pastEvents || [], [pastEvents]);
  const mergedLiveUpcoming = useMemo(() => [...liveEvents, ...futureEvents], [liveEvents, futureEvents]);
  const allEventsCombined = useMemo(() => [...mergedLiveUpcoming, ...archiveEvents], [mergedLiveUpcoming, archiveEvents]);

  const [view, setView] = useState("active");

  const heroNavigation = [
    { title: "Ongoing & Upcoming", subtitle: "See what’s live and next", view: "active" },
    { title: "Past / Completed", subtitle: "Revisit previous showcases", view: "archive" },
  ];

  return (
    <div className="overflow-hidden bg-[#050304] text-white">
      <div className="relative">
        <div className="absolute -top-16 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#4f46e5]/30 blur-[110px]" />
        <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-[#0f172a] via-[#0b0e17] to-transparent" />
        <div className="relative mx-auto max-w-[1400px] px-6 py-12 lg:py-16">
          <h1 className="text-5xl font-semibold leading-tight text-white md:text-6xl">Curated Event Showcases</h1>
          <p className="mt-3 max-w-3xl text-lg text-white/75">
            Browse the live, upcoming, and premium showcases that define innovation across campus. This curated carousel
            keeps your focus on what's happening now and what's next.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {heroNavigation.map((item) => {
              const isActive = view === item.view;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setView(item.view)}
                  className={`group rounded-[26px] border px-6 py-5 text-left transition hover:border-white/50 ${
                    isActive
                      ? "border-white/60 bg-gradient-to-br from-white/15 to-black/40"
                      : "border-white/20 bg-gradient-to-br from-white/5 to-black/30"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">{item.subtitle}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.title}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                    <Sparkles className={`h-4 w-4 ${isActive ? "text-[var(--color-nameless-orange)]" : ""}`} />
                    {isActive ? "Showing" : "Explore"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] space-y-16 px-6 pb-20 pt-4">
            {(() => {
              const sections = [];

          if (view === "active") {
            sections.push({ title: "Live + Upcoming", events: mergedLiveUpcoming, loading: isLoadingUpcoming });
          }
          if (view === "all") {
            sections.push({ title: "All Events", events: allEventsCombined, loading: isLoadingUpcoming || isLoadingPast });
          }
          if (view === "archive") {
            sections.push({ title: "Archive", events: archiveEvents, loading: isLoadingPast });
          }

          return sections.map(({ title, events, loading }) => (
            <section
              key={title}
              className="space-y-6 rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">Curated lineup</p>
                  <h2 className="text-3xl font-semibold">{title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setView("all")}
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-nameless-orange)] transition hover:text-orange-300"
                >
                  Browse all
                </button>
              </div>
              {loading ? (
                <EventsLoadingState title={title} />
              ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} variant={title} />
                  ))}
                </div>
              )}
            </section>
          ));
        })()}
      </div>
    </div>
  );
}

