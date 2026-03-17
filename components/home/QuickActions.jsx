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
    accent: "text-brand-blue-light",
    icon: Search,
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
    accent: "text-brand-orange-light",
    icon: CalendarPlus,
    actions: [
      {
        icon: CalendarPlus,
        title: "Create Event",
        description: "Launch new events with a professional experience.",
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
        description: "Review outcomes and export attendance summaries.",
        href: "/admin/reports",
      },
    ],
  },
];

function ActionCard({ action }) {
  return (
    <Link href={action.href} className="group">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-slate-200">
            <action.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white">{action.title}</h4>
            <p className="mt-0.5 text-sm leading-6 text-slate-400">{action.description}</p>
          </div>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all group-hover:bg-white/10 group-hover:text-white">
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
        <div className="absolute right-[6%] top-[14%] h-[24rem] w-[24rem] rounded-full bg-brand-blue/8 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="relative z-10 mx-auto mb-12 max-w-3xl text-center">
          <div className="eyebrow mx-auto w-fit">
            <Rocket className="h-3.5 w-3.5 text-brand-green-light" />
            <span>Quick actions</span>
          </div>
          <h2 className="section-heading mt-5 text-4xl text-white md:text-5xl">
            Jump right into what matters.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Fast entry points for students discovering events and organizers managing them.
          </p>
        </div>

        <div className="relative z-10 grid gap-6 xl:grid-cols-2">
          {actionGroups.map((group) => (
            <div key={group.title} className="premium-surface rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
                  <group.icon className={`h-5 w-5 ${group.accent}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {group.subtitle}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {group.title}
                  </h3>
                </div>
              </div>

              <div className="soft-divider my-6" />

              <div className="grid gap-3">
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
