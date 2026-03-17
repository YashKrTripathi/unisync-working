"use client";

import React from "react";

export default function PartnerPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center pt-32 pb-24 px-6 md:px-10 bg-[#0a0a0a]">
      {/* Background glow */}
      <div className="absolute inset-0 bg-black pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-[#ff6b00]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="text-center w-full max-w-7xl mx-auto mb-16 relative z-10">
        <h1 className="text-[10vw] md:text-[8vw] leading-none font-display uppercase tracking-tighter mb-4 text-white">
          OUR <span className="text-[var(--color-nameless-orange)]">PARTNERS</span>
        </h1>
        <p className="text-xl md:text-3xl font-serif-italic text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
          The brands making the UNISYNC experience unforgettable.
        </p>
      </div>

      <div className="max-w-6xl w-full mx-auto relative z-10 space-y-16">
        <div>
          <h2 className="text-sm font-sans font-bold tracking-[0.2em] uppercase text-white/50 text-center mb-8 border-b border-white/10 pb-4">Headline Sponsors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["BRAND A", "BRAND B", "BRAND C", "BRAND D"].map(brand => (
              <div key={brand} className="h-40 glass-light border border-white/5 rounded-2xl flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all cursor-pointer">
                <span className="font-display text-2xl text-white">{brand}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-sans font-bold tracking-[0.2em] uppercase text-white/50 text-center mb-8 border-b border-white/10 pb-4">Official Partners</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-24 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all cursor-pointer">
                <span className="font-sans text-xs font-bold text-white/70 tracking-widest uppercase text-center px-2">Partner {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
