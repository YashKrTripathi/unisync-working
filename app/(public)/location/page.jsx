"use client";

import React from "react";
import { MapPin, Plane, Train, Car, Bus, Bike } from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

const ICON_MAP = { Plane, Train, Car, Bus, Bike, MapPin };

const DEFAULT_LOCATION = {
  heading: { prefix: "THE ", highlight: "LOCATION" },
  subtitle: "How to get to the festival grounds in Pune.",
  mapLabel: "Interactive Map",
  directions: [
    { icon: "Plane", title: "By Air", description: "Fly into Pune International Airport (PNQ). The festival grounds are a 45-minute drive from the airport terminals. Dedicated festival shuttles run every hour." },
    { icon: "Train", title: "By Train", description: "Akurdi Railway Station is right across the street. Direct trains connect from Mumbai, Delhi, and Bangalore perfectly synced with event gates." },
    { icon: "Car", title: "By Car", description: "Take the Pune-Mumbai Expressway. Premium festival parking is available for pre-booking. Follow signs for 'UNISYNC FESTIVAL'." },
  ],
};

export default function LocationPage() {
  const { data: cmsContent } = useConvexQuery(api.siteContent.getPageContent, { pageId: "location" });
  const content = cmsContent || DEFAULT_LOCATION;
  const directions = content.directions || DEFAULT_LOCATION.directions;

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-32 pb-24 px-6 md:px-10 bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-black pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-[#ff6b00]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="text-center w-full max-w-7xl mx-auto mb-16 relative z-10">
        <h1 className="text-[10vw] md:text-[8vw] leading-none font-display uppercase tracking-tighter mb-4 text-white">
          {content.heading?.prefix || "THE "}<span className="text-[var(--color-nameless-orange)]">{content.heading?.highlight || "LOCATION"}</span>
        </h1>
        <p className="text-xl md:text-3xl font-serif-italic text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
          {content.subtitle || DEFAULT_LOCATION.subtitle}
        </p>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 min-h-[400px] flex items-center justify-center flex-col gap-4">
          <MapPin className="w-16 h-16 text-[#ff6b00]" />
          <p className="font-sans text-white/50 text-center tracking-widest uppercase font-bold text-sm">{content.mapLabel || "Interactive Map"}</p>
        </div>

        <div className="flex flex-col gap-6 justify-center">
          {directions.map((dir, i) => {
            const IconComp = ICON_MAP[dir.icon] || MapPin;
            return (
              <div key={i} className="p-8 border border-white/10 rounded-3xl bg-black">
                <h3 className="flex items-center gap-4 text-2xl font-bold text-white mb-2 font-display uppercase tracking-widest">
                  <IconComp className="text-[#ff6b00]" /> {dir.title}
                </h3>
                <p className="text-white/60 font-sans leading-relaxed">{dir.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
