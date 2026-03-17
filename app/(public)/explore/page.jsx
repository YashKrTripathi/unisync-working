"use client";

import React from "react";
import Tickets from "@/components/home/Tickets";

export default function ExplorePage() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Background  */}
      <div className="absolute inset-0 bg-black pointer-events-none -z-10" />

      {/* Hero Title Matching Screenshot 2 exactly */}
      <div className="pt-32 pb-8 px-6 md:px-10 text-center relative z-10 flex flex-col items-center">
        <h1 className="text-[12vw] md:text-[8vw] leading-[0.9] text-white text-center font-display tracking-tight mb-8">
          Don't miss the <span className="font-serif-italic opacity-90">Summer 2026</span><br />edition
        </h1>
        <p className="text-center font-sans text-[17px] md:text-[20px] text-white/90 font-medium">
          Choose your ticket and get ready for three unforgettable days of music and connection.
        </p>
      </div>

      {/* Tickets Section */}
      <div className="w-full bg-black pb-24 relative z-10">
        <Tickets />
      </div>
    </div>
  );
}
