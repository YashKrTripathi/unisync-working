"use client";

import React from "react";

export default function AccommodationsPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center pt-32 pb-24 px-6 md:px-10">
      {/* Background */}
      <div className="absolute inset-0 bg-black pointer-events-none -z-10" />

      <div className="text-center w-full max-w-7xl mx-auto mb-16">
        <h1 className="text-[10vw] md:text-[8vw] leading-none font-display uppercase tracking-tighter mb-4 text-white">
          STAY WITH <span className="text-[var(--color-nameless-orange)]">US</span>
        </h1>
        <p className="text-xl md:text-3xl font-serif-italic text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
          Premium on-campus and off-campus accommodations for the ultimate festival experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mx-auto">
        {/* Mock Data Cards */}
        {[
          { title: "VIP GLAMPING", desc: "Luxury private tents with AC, dedicated washrooms, and 24/7 room service.", price: "$299/night" },
          { title: "CAMPUS HOSTEL", desc: "Standard shared accommodations right next to the main stage. Connect with others.", price: "$49/night" },
          { title: "HOTEL PARTNERS", desc: "Premium 5-star hotel stays in the city with official shuttle service.", price: "$149/night" }
        ].map((item, i) => (
          <div key={i} className="flex flex-col p-10 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] transition-colors">
            <h3 className="text-2xl font-bold text-white mb-3 font-display uppercase tracking-widest">{item.title}</h3>
            <p className="text-white/60 font-sans mb-8 flex-grow">{item.desc}</p>
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <span className="text-white font-sans font-bold">{item.price}</span>
              <button className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#ff6b00] border border-[#ff6b00] rounded-full px-5 py-2 hover:bg-[#ff6b00] hover:text-white transition-colors">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
