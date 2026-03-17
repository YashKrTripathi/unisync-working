"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Compass,
  QrCode,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSignals = [
  { label: "Departments active", value: "12", tone: "text-blue-300" },
  { label: "Avg check-in speed", value: "< 6 sec", tone: "text-dypiu-gold-light" },
  { label: "Reports delivered", value: "Same day", tone: "text-emerald-300" },
];

const workflow = [
  {
    step: "01",
    title: "Launch clean event pages",
    description: "Structure event details so students can trust what they are signing up for.",
  },
  {
    step: "02",
    title: "Handle attendance faster",
    description: "Use QR-first check-ins instead of manual lists and fragmented follow-up.",
  },
  {
    step: "03",
    title: "Close the loop with reports",
    description: "Export performance and attendance insights without chasing data across tools.",
  },
];

const controlHighlights = [
  {
    icon: CalendarDays,
    title: "Scheduling clarity",
    description: "One place to manage sessions, venues, timings, and visibility.",
    value: "Live",
  },
  {
    icon: Users,
    title: "Registration pulse",
    description: "Watch turnout, capacity, and attendance trends update in real time.",
    value: "Realtime",
  },
  {
    icon: QrCode,
    title: "Check-in flow",
    description: "Shorter queues with professional event-day operations.",
    value: "92%",
  },
  {
    icon: BarChart3,
    title: "Post-event reporting",
    description: "Give teams a clear story they can act on immediately.",
    value: "Ready",
  },
];

const schedulePreview = [
  { time: "09:00", title: "Speaker check-in", meta: "Main auditorium" },
  { time: "10:15", title: "Registration peak", meta: "North lobby" },
  { time: "12:00", title: "Workshop batch 2", meta: "Lab block" },
];

export default function Hero() {
  return (
    <section className="section-shell overflow-hidden pb-20 pt-8 md:pb-28 md:pt-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="site-grid absolute inset-0 opacity-[0.08] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
        <div className="absolute left-[6%] top-[8%] h-[24rem] w-[24rem] rounded-full bg-blue-500/18 blur-[130px] animate-drift" />
        <div className="absolute bottom-[8%] right-[8%] h-[20rem] w-[20rem] rounded-full bg-dypiu-gold/12 blur-[120px] animate-float-slow" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative z-10">
          <div className="eyebrow">
            <Sparkles className="h-3.5 w-3.5 text-dypiu-gold-light" />
            <span>Professional campus event experience</span>
          </div>

          <h1 className="section-heading text-balance mt-6 max-w-4xl text-5xl text-white sm:text-6xl lg:text-7xl xl:text-[5.35rem]">
            A sharper, faster way to run campus events at scale.
          </h1>

          <p className="text-balance mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            UniSync gives students a polished discovery experience and gives organizers a
            command center for registrations, QR attendance, and reporting.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="xl"
              className="rounded-full bg-primary text-primary-foreground shadow-[0_24px_48px_rgba(44,126,248,0.28)] hover:bg-primary/90"
            >
              <Link href="/explore">
                Explore Events
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="xl"
              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <Link href="/create-event">Launch an Event</Link>
            </Button>

            <a
              href="#platform-why"
              className="inline-flex items-center gap-2 rounded-full px-3 py-3 text-sm font-semibold text-slate-300 hover:text-white"
            >
              <Compass className="h-4 w-4 text-blue-300" />
              See the workflow
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="premium-card inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-slate-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Student-friendly discovery
            </div>
            <div className="premium-card inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-slate-200">
              <QrCode className="h-4 w-4 text-blue-300" />
              QR-first attendance
            </div>
            <div className="premium-card inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-slate-200">
              <BarChart3 className="h-4 w-4 text-dypiu-gold-light" />
              Instant reporting
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {heroSignals.map((signal) => (
              <div key={signal.label} className="premium-card rounded-[1.65rem] p-5">
                <p className={`font-display text-2xl font-semibold ${signal.tone}`}>{signal.value}</p>
                <p className="mt-2 text-sm text-slate-400">{signal.label}</p>
              </div>
            ))}
          </div>

          <div className="premium-surface mt-10 rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Event lifecycle
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-white">
                  Professional UX from launch to wrap-up
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {workflow.map((item) => (
                <div key={item.step} className="premium-card rounded-[1.5rem] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">
                    {item.step}
                  </p>
                  <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="premium-surface relative overflow-hidden rounded-[2.2rem] p-6 md:p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-[90px]" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Event control room
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-white">
                  Live campus operations
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  A cleaner way to monitor registrations, attendance flow, and event-day
                  momentum.
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Active
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {controlHighlights.map((highlight) => (
                <div key={highlight.title} className="premium-card rounded-[1.5rem] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6 text-blue-200">
                      <highlight.icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-white/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      {highlight.value}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{highlight.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{highlight.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="premium-card rounded-[1.65rem] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Today&apos;s timeline
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">Flagship tech summit</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    248 attendees
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {schedulePreview.map((item) => (
                    <div
                      key={item.time}
                      className="flex items-start gap-4 rounded-[1.2rem] border border-white/8 bg-white/4 px-4 py-3"
                    >
                      <div className="rounded-xl bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-200">
                        {item.time}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                          {item.meta}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="premium-card rounded-[1.65rem] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Attendance health
                </p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-blue-400/20 bg-[radial-gradient(circle_at_center,rgba(44,126,248,0.22),transparent_65%)]">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-[#07111f]/90">
                      <div className="text-center">
                        <p className="font-display text-4xl font-semibold text-white">92%</p>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          checked in
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      <span>Queue stability</span>
                      <span>High</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/6">
                      <div className="h-2 w-[82%] rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      <span>Report readiness</span>
                      <span>Complete</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/6">
                      <div className="h-2 w-[94%] rounded-full bg-gradient-to-r from-dypiu-gold to-orange-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card absolute -right-4 top-10 hidden rounded-[1.4rem] px-4 py-3 text-sm text-slate-200 xl:block">
            Next major launch in 48 min
          </div>
          <div className="premium-card absolute -bottom-6 left-6 hidden rounded-[1.4rem] px-4 py-3 text-sm text-slate-200 xl:block">
            Organizer workflow now feels operational
          </div>
        </div>
      </div>
    </section>
  );
}
