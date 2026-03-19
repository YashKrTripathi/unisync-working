"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Archive,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

const now = Date.now();

const mockUpcomingEvents = [
  {
    _id: "mock-upcoming-1",
    slug: "unisync-innovators-summit",
    title: "Innovators Summit",
    description:
      "A campus-scale showcase of founders, student makers, and future-facing product demos.",
    startDate: now + 1000 * 60 * 60 * 24 * 7,
    endDate: now + 1000 * 60 * 60 * 24 * 8,
    city: "Pune",
    venue: "Innovation Dome",
    registrationCount: 420,
    capacity: 700,
    category: "technology",
    themeColor: "#1546ff",
  },
  {
    _id: "mock-upcoming-2",
    slug: "unisync-cultural-eve",
    title: "Cultural Eve",
    description:
      "Music, movement, and storytelling brought together in one high-energy student celebration.",
    startDate: now + 1000 * 60 * 60 * 24 * 12,
    endDate: now + 1000 * 60 * 60 * 24 * 12.5,
    city: "Pune",
    venue: "Open Air Arena",
    registrationCount: 680,
    capacity: 1200,
    category: "cultural",
    themeColor: "#ff5a1f",
  },
  {
    _id: "mock-upcoming-3",
    slug: "unisync-design-week",
    title: "Design Week",
    description:
      "Immersive workshops, installations, and critiques built around bold campus creativity.",
    startDate: now + 1000 * 60 * 60 * 24 * 18,
    endDate: now + 1000 * 60 * 60 * 24 * 20,
    city: "Pune",
    venue: "Studio Block",
    registrationCount: 250,
    capacity: 500,
    category: "art",
    themeColor: "#8b2cf5",
  },
  {
    _id: "mock-upcoming-4",
    slug: "unisync-startup-fair",
    title: "Startup Fair",
    description:
      "A curated networking floor for startups, recruiters, and ambitious student teams.",
    startDate: now + 1000 * 60 * 60 * 24 * 25,
    endDate: now + 1000 * 60 * 60 * 24 * 25.5,
    city: "Pune",
    venue: "Central Hall",
    registrationCount: 310,
    capacity: 650,
    category: "business",
    themeColor: "#0c9b6c",
  },
];

const mockPastEvents = [
  {
    _id: "mock-past-1",
    slug: "unisync-tech-conclave-2025",
    title: "Tech Conclave",
    description:
      "A packed auditorium, keynote sessions, and collaborative showcases across emerging technologies.",
    startDate: now - 1000 * 60 * 60 * 24 * 40,
    endDate: now - 1000 * 60 * 60 * 24 * 39,
    city: "Pune",
    venue: "Main Convention Hall",
    registrationCount: 540,
    attendeeCount: 486,
    category: "technology",
    themeColor: "#1d4ed8",
  },
  {
    _id: "mock-past-2",
    slug: "unisync-rhythm-night-2025",
    title: "Rhythm Night",
    description:
      "A vibrant music and dance night that turned the campus into a full-performance stage.",
    startDate: now - 1000 * 60 * 60 * 24 * 58,
    endDate: now - 1000 * 60 * 60 * 24 * 57,
    city: "Pune",
    venue: "Festival Courtyard",
    registrationCount: 860,
    attendeeCount: 792,
    category: "music",
    themeColor: "#db2777",
  },
  {
    _id: "mock-past-3",
    slug: "unisync-maker-expo-2025",
    title: "Maker Expo",
    description:
      "Prototype booths, engineering builds, and a full day of hands-on student innovation.",
    startDate: now - 1000 * 60 * 60 * 24 * 75,
    endDate: now - 1000 * 60 * 60 * 24 * 74,
    city: "Pune",
    venue: "Engineering Atrium",
    registrationCount: 390,
    attendeeCount: 342,
    category: "technology",
    themeColor: "#0891b2",
  },
  {
    _id: "mock-past-4",
    slug: "unisync-campus-awards-2025",
    title: "Campus Awards",
    description:
      "A polished celebration of standout student work, performances, and campus leadership.",
    startDate: now - 1000 * 60 * 60 * 24 * 96,
    endDate: now - 1000 * 60 * 60 * 24 * 95,
    city: "Pune",
    venue: "Grand Auditorium",
    registrationCount: 470,
    attendeeCount: 418,
    category: "cultural",
    themeColor: "#f97316",
  },
];

function mergeEvents(primary, fallback, type) {
  const filteredPrimary = primary.filter((event) => {
    const eventTime = event.endDate || event.startDate;
    return type === "past" ? eventTime < now : event.startDate > now;
  });

  const seen = new Set();
  const merged = [...filteredPrimary, ...fallback].filter((event) => {
    const key = event.slug || event._id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return merged.slice(0, 8);
}

function EventCard({ event, variant = "upcoming" }) {
  const isPast = variant === "past";

  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[32px] border border-white/12 bg-black/70 transition-all duration-500 hover:-translate-y-2 hover:border-white/22 hover:bg-white/[0.05]">
        <div
          className="relative flex h-56 items-center justify-center overflow-hidden"
          style={{ backgroundColor: event.themeColor || "#1e3a8a" }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent ${
              isPast ? "grayscale" : ""
            }`}
          />
          <span className="relative z-10 text-7xl text-white/70 transition-transform duration-500 group-hover:scale-110">
            {getCategoryIcon(event.category)}
          </span>
          <div className="absolute left-4 top-4 z-20">
            <Badge className="border border-white/15 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
              {isPast ? "Past Event" : "Upcoming"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-7">
          <div className="mb-4 inline-flex w-fit rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">
            {getCategoryLabel(event.category)}
          </div>

          <h3 className="mb-3 font-display text-[clamp(2rem,4vw,3.2rem)] uppercase leading-[0.92] tracking-[-0.05em] text-white transition-colors duration-300 group-hover:text-[var(--color-nameless-orange)]">
            {event.title}
          </h3>

          <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-white/62">
            {event.description}
          </p>

          <div className="mt-auto space-y-3 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[var(--color-nameless-orange)]" />
              <span>{format(event.startDate, "PPP")}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[var(--color-nameless-orange)]" />
              <span className="line-clamp-1">{event.venue || event.city}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-[var(--color-nameless-orange)]" />
              <span>
                {isPast
                  ? `${event.attendeeCount || event.registrationCount} attended`
                  : `${event.registrationCount} / ${event.capacity} enrolled`}
              </span>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors duration-300 group-hover:text-[var(--color-nameless-orange)]">
            <span>{isPast ? "View Memories" : "View Event"}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}

function SectionHeader({ icon: Icon, eyebrow, title, accent, copy }) {
  return (
    <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
          <Icon className="h-4 w-4 text-[var(--color-nameless-orange)]" />
          <span>{eyebrow}</span>
        </div>
        <h2 className="font-display text-[clamp(3.2rem,8vw,6.5rem)] uppercase leading-[0.88] tracking-[-0.06em] text-white">
          {title} <span className="text-[var(--color-nameless-orange)]">{accent}</span>
        </h2>
      </div>
      <p className="max-w-xl text-base leading-relaxed text-white/62 md:text-lg">
        {copy}
      </p>
    </div>
  );
}

export default function EventsPage() {
  const { data: upcomingEvents = [] } = useConvexQuery(api.explore.getPopularEvents, {
    limit: 8,
  });
  const { data: pastEvents = [] } = useConvexQuery(api.explore.getPastEvents, {
    limit: 8,
  });

  const upcomingDisplayEvents = useMemo(
    () => mergeEvents(upcomingEvents, mockUpcomingEvents, "upcoming"),
    [upcomingEvents]
  );
  const pastDisplayEvents = useMemo(
    () => mergeEvents(pastEvents, mockPastEvents, "past"),
    [pastEvents]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-black pb-24 pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.12),transparent_28%),linear-gradient(180deg,#050505_0%,#000_100%)]" />

      <div className="mx-auto max-w-[1600px] px-6">
        <section className="mb-14 rounded-[40px] border border-white/10 bg-white/[0.02] px-6 py-10 md:px-8 md:py-12">
          <SectionHeader
            icon={Sparkles}
            eyebrow="Upcoming Lineup"
            title="Upcoming"
            accent="Events"
            copy="Fresh launches, campus moments, and the next big experiences students can join right now."
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-4">
            {upcomingDisplayEvents.map((event) => (
              <EventCard key={event._id} event={event} variant="upcoming" />
            ))}
          </div>
        </section>

        <section className="rounded-[40px] border border-white/10 bg-white/[0.02] px-6 py-10 md:px-8 md:py-12">
          <SectionHeader
            icon={Archive}
            eyebrow="Event Archive"
            title="Past"
            accent="Events"
            copy="A quick archive of previous UniSync experiences, completed showcases, and memorable campus highlights."
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-4">
            {pastDisplayEvents.map((event) => (
              <EventCard key={event._id} event={event} variant="past" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
