"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  QrCode,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: CalendarDays,
    title: "Smart Event Pages",
    description: "Create structured, professional event listings that students trust.",
    accent: "text-brand-blue-light",
    bg: "bg-brand-blue/10",
  },
  {
    icon: Users,
    title: "Live Registrations",
    description: "Watch capacity fill in real time with automatic slot management.",
    accent: "text-brand-green-light",
    bg: "bg-brand-green/10",
  },
  {
    icon: QrCode,
    title: "QR Check-in",
    description: "Replace manual attendance with instant QR-based verification.",
    accent: "text-brand-orange-light",
    bg: "bg-brand-orange/10",
  },
  {
    icon: BarChart3,
    title: "Instant Reports",
    description: "Generate PDF/Word attendance and performance reports in seconds.",
    accent: "text-cyan-300",
    bg: "bg-cyan-500/10",
  },
];

export default function Hero() {
  return (
    <section className="section-shell overflow-hidden pb-20 pt-8 md:pb-28 md:pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[6%] top-[8%] h-[24rem] w-[24rem] rounded-full bg-brand-blue/15 blur-[130px] animate-drift" />
        <div className="absolute bottom-[8%] right-[8%] h-[20rem] w-[20rem] rounded-full bg-brand-blue-light/8 blur-[120px] animate-float-slow" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Main hero */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="eyebrow mx-auto w-fit">
            <Sparkles className="h-3.5 w-3.5 text-brand-blue-light" />
            <span>Campus Event Platform</span>
          </div>

          <h1 className="section-heading mt-6 text-5xl text-white sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
            Run campus events with clarity, speed, and confidence.
          </h1>

          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            UniSync gives students a polished discovery experience and gives organizers a
            command center for registrations, QR attendance, and reporting.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="xl"
              className="rounded-full bg-sky-600 text-white shadow-[0_20px_40px_rgba(2,136,209,0.3)] hover:bg-sky-700"
            >
              <Link href="/explore">
                Explore Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <Link href="/create-event">Create an Event</Link>
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="premium-card rounded-2xl p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.bg}`}>
                <feature.icon className={`h-5 w-5 ${feature.accent}`} />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Dashboard preview */}
        <div className="relative z-10 mt-12 premium-surface rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Organizer Dashboard Preview
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                Live event operations
              </h2>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Live
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Schedule */}
            <div className="premium-card rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Today&apos;s Schedule</p>
              <div className="space-y-2.5">
                {[
                  { time: "09:00", title: "Speaker check-in", location: "Main auditorium" },
                  { time: "10:15", title: "Registration opens", location: "North lobby" },
                  { time: "12:00", title: "Workshop batch 2", location: "Lab block" },
                ].map((item) => (
                  <div key={item.time} className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                    <span className="rounded-md bg-brand-blue/10 px-2 py-1 text-xs font-semibold text-brand-blue-light">{item.time}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance gauge */}
            <div className="premium-card rounded-xl p-4 flex flex-col items-center justify-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Attendance</p>
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-brand-blue-light/20 bg-[radial-gradient(circle_at_center,rgba(2,136,209,0.15),transparent_65%)]">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-[#07111f]/90">
                  <div className="text-center">
                    <p className="font-display text-3xl font-semibold text-white">92%</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">checked in</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Capacity</span><span>248 / 300</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06]">
                  <div className="h-1.5 w-[82%] rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-light" />
                </div>
              </div>
            </div>

            {/* Quick metrics */}
            <div className="premium-card rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Quick Metrics</p>
              <div className="space-y-3">
                {[
                  { label: "Registrations", value: "248", detail: "+12 today", color: "text-brand-blue-light" },
                  { label: "Avg check-in", value: "< 6s", detail: "QR powered", color: "text-brand-green-light" },
                  { label: "Reports ready", value: "3/3", detail: "Auto-generated", color: "text-brand-orange-light" },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{metric.label}</span>
                      <span className={`text-lg font-semibold ${metric.color}`}>{metric.value}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
