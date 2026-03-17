"use client";

import React, { useEffect, useRef, useState } from "react";
import { Activity, Award, Building2, Calendar, Users, Zap } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: 120,
    suffix: "+",
    label: "Events Hosted",
    accent: "text-blue-300",
    progress: "w-[82%]",
  },
  {
    icon: Users,
    value: 12450,
    suffix: "+",
    label: "Active Students",
    accent: "text-dypiu-gold-light",
    progress: "w-[94%]",
  },
  {
    icon: Building2,
    value: 12,
    suffix: "",
    label: "Departments",
    accent: "text-emerald-300",
    progress: "w-[72%]",
  },
  {
    icon: Award,
    value: 95,
    suffix: "%",
    label: "Engagement Rate",
    accent: "text-cyan-300",
    progress: "w-[95%]",
  },
];

const operatingSignals = [
  {
    title: "Discovery to registration",
    description: "A cleaner event directory helps students decide faster and register with less hesitation.",
  },
  {
    title: "Registration to attendance",
    description: "Event-day flow stays visible with check-in readiness and attendance progress.",
  },
  {
    title: "Attendance to reporting",
    description: "Teams can summarize outcomes while the event is still fresh and actionable.",
  },
];

function AnimatedCounter({ target, suffix, duration = 2200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 5);
            setCount(Math.floor(eased * target));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [duration, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Statistics() {
  return (
    <section className="section-shell">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="relative z-10 space-y-6 lg:sticky lg:top-32">
            <div className="eyebrow">
              <Activity className="h-3.5 w-3.5 text-cyan-300" />
              <span>Operational confidence</span>
            </div>

            <h2 className="section-heading text-balance text-4xl text-white md:text-5xl">
              See the signals that make event operations feel reliable.
            </h2>

            <p className="max-w-xl text-lg leading-8 text-slate-300">
              Professional UI matters because it helps users understand status quickly. These
              numbers and checkpoints make the platform feel active, credible, and ready for scale.
            </p>

            <div className="premium-surface rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Performance loop
              </p>

              <div className="mt-5 space-y-5">
                {operatingSignals.map((signal, index) => (
                  <div key={signal.title} className="flex gap-4">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/6 text-xs font-semibold text-cyan-300">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{signal.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{signal.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="soft-divider my-6" />

              <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Team outcome
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  A stronger UI helps both trust and throughput.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Students find events faster, organizers manage operations with less friction,
                  and campus teams get clearer reports.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid gap-5 sm:grid-cols-2">
            {stats.map((stat) => (
              <div key={stat.label} className="premium-surface rounded-[1.9rem] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 text-slate-100">
                    <stat.icon className={`h-5 w-5 ${stat.accent}`} />
                  </div>
                  <Zap className="h-4 w-4 text-slate-500" />
                </div>

                <div className={`mt-6 font-display text-5xl font-semibold ${stat.accent}`}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>

                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {stat.label}
                </p>

                <div className="mt-5 h-2 rounded-full bg-white/6">
                  <div className={`h-2 rounded-full bg-gradient-to-r from-white to-white/40 ${stat.progress}`} />
                </div>
              </div>
            ))}

            <div className="premium-card rounded-[1.9rem] p-6 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                What this communicates
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
                  <p className="text-sm font-semibold text-white">Trust</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    A polished dashboard makes the platform feel credible from the first visit.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
                  <p className="text-sm font-semibold text-white">Momentum</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Live metrics signal that the platform is active, useful, and current.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
                  <p className="text-sm font-semibold text-white">Clarity</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Better visual hierarchy makes large amounts of event data easier to scan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
