"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  CalendarPlus,
  QrCode,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const featureCards = [
  {
    icon: Search,
    title: "Discover with confidence",
    description: "Cleaner event listings with timing, venue, and capacity details students can trust.",
    tone: "bg-brand-blue/10 text-brand-blue-light",
  },
  {
    icon: CalendarPlus,
    title: "Create without friction",
    description: "Structured event pages with AI assist, image picker, and automatic slug generation.",
    tone: "bg-brand-orange/10 text-brand-orange-light",
  },
  {
    icon: QrCode,
    title: "Check-in professionally",
    description: "QR-based attendance replaces spreadsheets with instant verification on event day.",
    tone: "bg-brand-green/10 text-brand-green-light",
  },
  {
    icon: BarChart3,
    title: "Report instantly",
    description: "Generate PDF and Word reports with attendance stats, charts, and audit trails.",
    tone: "bg-sky-500/10 text-sky-300",
  },
];

const outcomes = [
  {
    title: "Students register faster",
    description: "Clear event structure and upfront details reduce friction from discovery to signup.",
  },
  {
    title: "Organizers manage in one place",
    description: "Registrations, attendance, and reporting live in a single workflow instead of scattered tools.",
  },
  {
    title: "Events scale without chaos",
    description: "Works for small club meetups and large multi-session festivals with the same interface.",
  },
];

export default function AboutEvents() {
  return (
    <section id="platform-why" className="section-shell">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[4%] top-[20%] h-72 w-72 rounded-full bg-brand-blue/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="relative z-10 space-y-6">
            <div className="eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-brand-blue-light" />
              <span>Why UniSync</span>
            </div>

            <h2 className="section-heading text-balance max-w-2xl text-4xl text-white md:text-5xl">
              Built for both students and organizers.
            </h2>

            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              One platform for event discovery, creation, attendance tracking, and post-event reporting.
            </p>

            <div className="premium-surface rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Key outcomes</p>
              <div className="mt-5 space-y-4">
                {outcomes.map((outcome, index) => (
                  <div key={outcome.title} className="flex gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-semibold text-brand-blue-light">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{outcome.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{outcome.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="soft-divider my-6" />

              <Button
                asChild
                variant="outline"
                size="xl"
                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href="/explore">Browse events</Link>
              </Button>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-2">
            {featureCards.map((feature) => (
              <div key={feature.title} className="premium-surface rounded-2xl p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.tone}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
