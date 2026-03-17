"use client";

import React from "react";
import { Check, ShieldAlert } from "lucide-react";

export default function InformationPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center pt-32 pb-24 px-6 md:px-10 bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-black pointer-events-none -z-10" />

      <div className="text-center w-full max-w-7xl mx-auto mb-16">
        <h1 className="text-[10vw] md:text-[8vw] leading-none font-display uppercase tracking-tighter mb-4 text-white">
          <span className="text-[var(--color-nameless-orange)]">GENERAL</span> INFO
        </h1>
        <p className="text-xl md:text-3xl font-serif-italic text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
          The ultimate guide to experiencing UNISYNC safely and securely.
        </p>
      </div>

      <div className="max-w-4xl w-full mx-auto flex flex-col gap-12 text-white">
        <section className="bg-white/[0.03] p-8 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-4xl font-display uppercase tracking-tighter mb-6 text-[var(--color-nameless-orange)] border-b border-white/10 pb-4">Before You Arrive</h2>
          <ul className="space-y-4 font-sans text-lg text-white/70">
            <li className="flex gap-4 items-start"><Check className="text-green-500 mt-1 shrink-0" /> Your digital ticket QR Code must be ready to scan.</li>
            <li className="flex gap-4 items-start"><Check className="text-green-500 mt-1 shrink-0" /> Valid photo ID matching your ticket registration is required.</li>
            <li className="flex gap-4 items-start"><Check className="text-green-500 mt-1 shrink-0" /> Plan to arrive 2 hours prior to the headliner performance.</li>
            <li className="flex gap-4 items-start"><Check className="text-green-500 mt-1 shrink-0" /> We are a completely cashless event. Load funds into your UNISYNC app.</li>
          </ul>
        </section>

        <section className="bg-red-900/10 p-8 md:p-12 rounded-3xl border border-red-500/20">
          <h2 className="text-4xl font-display uppercase tracking-tighter mb-6 text-red-500 border-b border-red-500/20 pb-4 flex items-center gap-4">
             <ShieldAlert /> Prohibited Items
          </h2>
          <ul className="space-y-4 font-sans text-lg text-white/70">
            <li>• No outside food or beverages (including sealed water bottles)</li>
            <li>• No professional cameras with detachable lenses</li>
            <li>• No drones or remote-controlled vehicles</li>
            <li>• No large backpacks or bags exceeding 12x12x6 inches</li>
            <li>• Zero tolerance for illegal substances</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
