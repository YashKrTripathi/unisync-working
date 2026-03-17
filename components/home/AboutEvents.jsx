"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  CalendarPlus,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const featureCards = [
  {
    icon: Search,
    title: "Discover with confidence",
    description:
      "Students get cleaner event listings, clearer timing, and stronger trust before they register.",
    tone: "bg-blue-500/10 text-blue-200",
  },
  {
    icon: CalendarPlus,
    title: "Organize without friction",
    description:
      "Create better event pages, keep details structured, and reduce manual coordination overhead.",
    tone: "bg-dypiu-gold/12 text-dypiu-gold-light",
  },
  {
    icon: QrCode,
    title: "Check-in the professional way",
    description:
      "Move from spreadsheets and guesswork to fast, QR-led attendance on the day of the event.",
    tone: "bg-emerald-500/10 text-emerald-300",
  },
  {
    icon: BarChart3,
    title: "Report what really happened",
    description:
      "Generate cleaner summaries around turnout, attendance, and event performance immediately.",
    tone: "bg-cyan-500/10 text-cyan-300",
  },
];

const outcomes = [
  {
    title: "Students see a stronger first impression",
    description: "Better structure and hierarchy make events feel more legitimate and easier to trust.",
  },
  {
    title: "Organizers spend less time chasing operations",
    description: "Registrations, attendance, and reporting live in one workflow instead of scattered tools.",
  },
  {
    title: "Campus teams can scale without chaos",
    description: "The platform stays useful from small club meetups to large multi-session festivals.",
  },
];

const platformPrinciples = [
  {
    icon: ShieldCheck,
    title: "Clear information architecture",
    description: "Better page structure helps students decide faster and reduces avoidable questions.",
  },
  {
    icon: Users,
    title: "Professional operational flow",
    description: "Every action supports a smoother experience for attendees and staff on event day.",
  },
  {
    icon: Sparkles,
    title: "Premium visual confidence",
    description: "A polished UI signals reliability and raises perceived quality across the platform.",
  },
];

export default function AboutEvents() {
  return (
    <section id="platform-why" className="section-shell">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[4%] top-[20%] h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[8%] right-[8%] h-80 w-80 rounded-full bg-dypiu-gold/8 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="relative z-10 space-y-6">
            <div className="eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-dypiu-gold-light" />
              <span>Why this experience feels stronger</span>
            </div>

            <h2 className="section-heading text-balance max-w-2xl text-4xl text-white md:text-5xl">
              Professional UX for both students and organizers.
            </h2>

            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              The platform should not just look better. It should make campus event discovery,
              creation, attendance, and reporting feel easier at every step.
            </p>

            <div className="premium-surface rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                What improves immediately
              </p>
              <div className="mt-5 space-y-4">
                {outcomes.map((outcome, index) => (
                  <div key={outcome.title} className="flex gap-4">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/6 text-xs font-semibold text-blue-200">
                      0{index + 1}
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
                <Link href="/explore">Browse the live event directory</Link>
              </Button>
            </div>
          </div>

          <div className="relative z-10 grid gap-5 sm:grid-cols-2">
            {featureCards.map((feature) => (
              <div key={feature.title} className="premium-surface rounded-[1.9rem] p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.tone}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {platformPrinciples.map((principle) => (
            <div key={principle.title} className="premium-card rounded-[1.7rem] p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6 text-slate-100">
                <principle.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{principle.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
