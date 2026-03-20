"use client";

import React from "react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

const DEFAULT_TEAM = {
  heading: { prefix: "THE ", highlight: "CREATORS" },
  subtitle: "Meet the minds behind UniSync. Currently, two dedicated individuals are powering this vision.",
  tiers: [
    {
      tierName: "Core Creators",
      brands: ["Yash Kr. Tripathi", "Rigved Aherrao"],
      cols: 2,
      height: "h-64",
    },
  ],
};

export default function TeamPage() {
  const { data: cmsContent } = useConvexQuery(api.siteContent.getPageContent, { pageId: "team" });
  const content = cmsContent || DEFAULT_TEAM;
  const tiers = content.tiers || DEFAULT_TEAM.tiers;

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-32 pb-24 px-6 md:px-10 bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-black pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-[#ff6b00]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="text-center w-full max-w-7xl mx-auto mb-16 relative z-10">
        <h1 className="text-[10vw] md:text-[8vw] leading-none font-display uppercase tracking-tighter mb-4 text-white">
          {content.heading?.prefix || "OUR "}<span className="text-[var(--color-nameless-orange)]">{content.heading?.highlight || "PARTNERS"}</span>
        </h1>
        <p className="text-xl md:text-3xl font-serif-italic text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
          {content.subtitle || DEFAULT_TEAM.subtitle}
        </p>
      </div>

      <div className="max-w-6xl w-full mx-auto relative z-10 space-y-16">
        {tiers.map((tier, tierIdx) => (
          <div key={tierIdx}>
            <h2 className="text-sm font-sans font-bold tracking-[0.2em] uppercase text-white/50 text-center mb-8 border-b border-white/10 pb-4">
              {tier.tierName}
            </h2>
            <div className={`grid grid-cols-2 md:grid-cols-${tier.cols || 4} gap-4`}>
              {(tier.brands || []).map((brand, i) => (
                <div
                  key={i}
                  className={`${tier.height || "h-40"} ${tierIdx === 0 ? "glass-light border border-white/5" : "bg-white/[0.02] border border-white/5"} rounded-2xl flex items-center justify-center grayscale hover:grayscale-0 ${tierIdx === 0 ? "opacity-50" : "opacity-40"} hover:opacity-100 transition-all cursor-pointer`}
                >
                  <span className={`${tierIdx === 0 ? "font-display text-2xl" : "font-sans text-xs font-bold tracking-widest uppercase text-center px-2"} text-white${tierIdx === 0 ? "" : "/70"}`}>
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
