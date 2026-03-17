"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarPlus,
  LayoutDashboard,
  QrCode,
  Rocket,
  Search,
  Ticket,
} from "lucide-react";

const actionGroups = [
  {
    title: "For Students",
    subtitle: "Discover and attend",
    description:
      "Students should be able to move from curiosity to confirmed attendance without friction.",
    accent: "text-blue-300",
    icon: Search,
    steps: [
      "Scan the latest featured events without getting lost in clutter.",
      "Open a clearer event page that explains what, when, and where.",
      "Keep tickets and attendance access in one reliable place.",
    ],
    actions: [
      {
        icon: Search,
        title: "Explore Events",
        description: "Browse what is happening next on campus.",
        href: "/explore",
      },
      {
        icon: Ticket,
        title: "My Tickets",
        description: "Access registrations and event entry details.",
        href: "/my-tickets",
      },
      {
        icon: QrCode,
        title: "Attendance",
        description: "Use the faster QR-based attendance flow.",
        href: "/attendance",
      },
    ],
  },
  {
    title: "For Organizers",
    subtitle: "Launch and manage",
    description:
      "Organizers need a cleaner operating flow that makes event creation and management feel dependable.",
    accent: "text-dypiu-gold-light",
    icon: CalendarPlus,
    steps: [
      "Create a polished event listing with stronger hierarchy and clearer fields.",
      "Track registrations and check-in progress through a more structured admin view.",
      "Generate reports without rebuilding the story of the event manually.",
    ],
    actions: [
      {
        icon: CalendarPlus,
        title: "Create Event",
        description: "Launch new events with a more professional experience.",
        href: "/create-event",
      },
      {
        icon: LayoutDashboard,
        title: "Dashboard",
        description: "Monitor registrations, turnout, and event activity.",
        href: "/admin",
      },
      {
        icon: BarChart3,
        title: "Reports",
        description: "Review outcomes and export cleaner summaries.",
        href: "/admin/reports",
      },
    ],
  },
];

function ActionCard({ action }) {
  return (
    <Link href={action.href} className="group">
      <div className="premium-card flex items-center justify-between gap-4 rounded-[1.5rem] p-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 text-slate-100">
            <action.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-semibold text-white">{action.title}</h4>
            <p className="mt-1 text-sm leading-6 text-slate-400">{action.description}</p>
          </div>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 group-hover:bg-white/10 group-hover:text-white">
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

export default function QuickActions() {
  return (
    <section id="action-hub" className="section-shell pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[6%] top-[14%] h-[24rem] w-[24rem] rounded-full bg-blue-500/8 blur-[120px]" />
        <div className="absolute left-[8%] bottom-[8%] h-[20rem] w-[20rem] rounded-full bg-dypiu-gold/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="eyebrow">
            <Rocket className="h-3.5 w-3.5 text-emerald-300" />
            <span>Action hub</span>
          </div>
          <h2 className="section-heading text-balance mt-5 text-4xl text-white md:text-5xl">
            Give every role a clearer next step.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Better UI and UX should make the platform easier to act on, not just nicer to look at.
            These entry points keep the most important flows obvious.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {actionGroups.map((group) => (
            <div key={group.title} className="premium-surface rounded-[2rem] p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 text-slate-100">
                      <group.icon className={`h-5 w-5 ${group.accent}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                        {group.subtitle}
                      </p>
                      <h3 className="mt-1 font-display text-3xl font-semibold text-white">
                        {group.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 text-base leading-7 text-slate-300">{group.description}</p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
                  Guided flow
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                {group.steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-[1.45rem] border border-white/8 bg-white/4 px-4 py-4"
                  >
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/6 text-xs font-semibold ${group.accent}`}>
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-7 text-slate-300">{step}</p>
                  </div>
                ))}
              </div>

              <div className="soft-divider my-6" />

              <div className="grid gap-4">
                {group.actions.map((action) => (
                  <ActionCard key={action.title} action={action} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
