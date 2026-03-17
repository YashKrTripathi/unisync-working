"use client";

import React, { useEffect, useRef, useState } from "react";
import { Activity, Award, Building2, Calendar, Users } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: 120,
    suffix: "+",
    label: "Events Hosted",
    accent: "text-brand-blue-light",
    barColor: "from-brand-blue to-brand-blue-light",
    barWidth: 82,
  },
  {
    icon: Users,
    value: 12450,
    suffix: "+",
    label: "Active Students",
    accent: "text-brand-green-light",
    barColor: "from-brand-green to-brand-green-light",
    barWidth: 94,
  },
  {
    icon: Building2,
    value: 12,
    suffix: "",
    label: "Departments",
    accent: "text-brand-orange-light",
    barColor: "from-brand-orange to-brand-orange-light",
    barWidth: 72,
  },
  {
    icon: Award,
    value: 95,
    suffix: "%",
    label: "Engagement Rate",
    accent: "text-sky-300",
    barColor: "from-sky-400 to-sky-600",
    barWidth: 95,
  },
];

function AnimatedCounter({ target, suffix, duration = 2200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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

    observer.observe(el);
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
        <div className="absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand-blue/8 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="relative z-10 mx-auto mb-12 max-w-3xl text-center">
          <div className="eyebrow mx-auto w-fit">
            <Activity className="h-3.5 w-3.5 text-brand-blue-light" />
            <span>Platform metrics</span>
          </div>
          <h2 className="section-heading mt-5 text-4xl text-white md:text-5xl">
            Built for real campus scale.
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-lg leading-8 text-slate-300">
            Numbers that reflect active use across departments, student communities, and organizer teams.
          </p>
        </div>

        <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="premium-surface rounded-2xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
                <stat.icon className={`h-5 w-5 ${stat.accent}`} />
              </div>

              <div className={`mt-5 font-display text-5xl font-semibold ${stat.accent}`}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>

              <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>

              <div className="mt-4 h-1.5 rounded-full bg-white/[0.06]">
                <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${stat.barColor} transition-all duration-1000`}
                  style={{ width: `${stat.barWidth}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
