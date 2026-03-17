"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Sparkles, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

function LoadingCard() {
  return (
    <div className="premium-surface overflow-hidden rounded-[2rem]">
      <div className="h-56 animate-pulse bg-white/5" />
      <div className="space-y-4 p-6">
        <div className="h-4 w-28 animate-pulse rounded-full bg-white/6" />
        <div className="h-7 w-3/4 animate-pulse rounded-full bg-white/8" />
        <div className="h-4 w-full animate-pulse rounded-full bg-white/5" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-white/5" />
        <div className="pt-2">
          <div className="h-2 animate-pulse rounded-full bg-white/6" />
        </div>
      </div>
    </div>
  );
}

export default function UpcomingEvents() {
  const { data: events = [], isLoading } = useConvexQuery(api.explore.getPopularEvents, {
    limit: 4,
  });

  return (
    <section id="upcoming-events" className="section-shell">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/3 h-[30rem] w-[30rem] -translate-x-1/3 rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>Live on campus</span>
            </div>
            <h2 className="section-heading text-balance text-4xl text-white md:text-5xl">
              Featured events that already feel worth attending.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              A stronger homepage should help students see what is happening next, why it matters,
              and how full each event already is.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            size="xl"
            className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <Link href="/explore">
              View all events
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {events.map((event) => {
              const registrationRate = Math.min(
                100,
                Math.round((event.registrationCount / Math.max(event.capacity || 1, 1)) * 100)
              );

              return (
                <Link key={event._id} href={`/events/${event.slug}`} className="group">
                  <article className="premium-surface h-full overflow-hidden rounded-[2rem]">
                    <div className="relative h-56 overflow-hidden">
                      {event.coverImage ? (
                        <Image
                          src={event.coverImage}
                          alt={event.title}
                          fill
                          sizes="(max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${event.themeColor || "#1e3a8a"}, #07111f)`,
                          }}
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/30 to-transparent" />

                      <div className="absolute left-5 top-5 flex items-center gap-2">
                        <Badge className="border-none bg-[#07111f]/75 text-white backdrop-blur-md">
                          {event.ticketType === "free" ? "Free entry" : "Paid event"}
                        </Badge>
                      </div>

                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#07111f]/65 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 backdrop-blur-md">
                          <span>{getCategoryIcon(event.category)}</span>
                          <span>{getCategoryLabel(event.category)}</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-white">{event.title}</h3>
                      </div>
                    </div>

                    <div className="flex h-[calc(100%-14rem)] flex-col gap-5 p-6">
                      <p className="line-clamp-3 text-sm leading-7 text-slate-400">
                        {event.description}
                      </p>

                      <div className="space-y-3 text-sm text-slate-300">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-300">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <span>{format(event.startDate, "EEE, MMM d")}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-dypiu-gold/10 text-dypiu-gold-light">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <span className="line-clamp-1">{event.venue || event.city || "Campus venue"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                            <Users className="h-4 w-4" />
                          </div>
                          <span>
                            {event.registrationCount} / {event.capacity} registered
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                          <span>Seats filled</span>
                          <span>{registrationRate}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/6">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300"
                            style={{ width: `${registrationRate}%` }}
                          />
                        </div>

                        <div className="mt-5 flex items-center justify-between text-sm font-semibold text-white">
                          <span>{event.ticketType === "free" ? "Fast to join" : "Reserve your spot"}</span>
                          <span className="inline-flex items-center gap-2 text-blue-200">
                            Open event
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="premium-surface rounded-[2rem] p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <div className="eyebrow">
                  <Sparkles className="h-3.5 w-3.5 text-dypiu-gold-light" />
                  <span>Ready for the first launch</span>
                </div>
                <h3 className="mt-5 font-display text-3xl font-semibold text-white">
                  No upcoming events are live yet.
                </h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">
                  The new homepage already gives you a professional frame for discovery. Once
                  events are added, this section will surface them with capacity and location
                  context immediately.
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="xl" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/create-event">Create the first event</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="xl"
                    className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Link href="/explore">Open the event directory</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="premium-card rounded-[1.6rem] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Students will see
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">Better hierarchy</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Stronger typography and clearer event metadata.
                  </p>
                </div>
                <div className="premium-card rounded-[1.6rem] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Organizers will get
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">Cleaner conversion</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    A more trustworthy surface for registrations and attendance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
