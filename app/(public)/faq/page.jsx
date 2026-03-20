"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

const DEFAULT_FAQ = {
  heading: { prefix: "FREQ ", middle: "ASKED ", suffix: "QUES" },
  subtitle: "Everything you need to know about UNISYNC.",
  faqs: [
    { q: "WHEN WILL THE TICKETS GO ON SALE?", a: "Early bird tickets will go live strictly 14 days prior to the festival date. Register on the platform to get push notifications exactly when they drop." },
    { q: "WHAT IS THE MINIMUM AGE REQUIRED TO ENTER?", a: "UNISYNC is strictly an 18+ event. You must present valid government-issued photographic ID to prove your age upon entry." },
    { q: "CAN I REFUND MY TICKET IF I CANNOT ATTEND?", a: "All purchased tickets are strictly non-refundable as per the organizer's terms and conditions. The name on the ticket is non-transferable." },
    { q: "IS RE-ENTRY ALLOWED?", a: "No, once you leave the festival venue, your ticket/wristband becomes void. Re-entry requires the purchase of a new admission ticket." },
    { q: "WHAT PAYMENT METHODS ARE ACCEPTED INSIDE?", a: "UNISYNC is a completely cashless campus experience. All food, beverage, and merchandise purchases require the UNISYNC NFC wristband." },
  ],
};

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const { data: cmsContent } = useConvexQuery(api.siteContent.getPageContent, { pageId: "faq" });
  const content = cmsContent || DEFAULT_FAQ;
  const faqs = content.faqs || DEFAULT_FAQ.faqs;

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-32 pb-24 px-6 md:px-10 bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-black pointer-events-none -z-10" />

      <div className="text-center w-full max-w-7xl mx-auto mb-16 relative z-10">
        <h1 className="text-[10vw] md:text-[8vw] leading-none font-display uppercase tracking-tighter mb-4 text-white">
          <span className="text-[var(--color-nameless-orange)]">{content.heading?.prefix || "FREQ "}</span>{content.heading?.middle || "ASKED "}<span className="text-[var(--color-nameless-orange)]">{content.heading?.suffix || "QUES"}</span>
        </h1>
        <p className="text-xl md:text-3xl font-serif-italic text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
          {content.subtitle || DEFAULT_FAQ.subtitle}
        </p>
      </div>

      <div className="max-w-4xl w-full mx-auto relative z-10 space-y-6">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border-b border-white/10"
          >
            <button 
              className="w-full py-8 text-left flex justify-between items-center group transition-colors focus:outline-none"
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
            >
              <h3 className="text-xl md:text-3xl font-display uppercase tracking-tighter text-white group-hover:text-[var(--color-nameless-orange)] transition-colors pr-8 leading-none">
                {faq.q}
              </h3>
              <div className="w-10 h-10 shrink-0 border border-white/20 rounded-full flex items-center justify-center bg-black group-hover:border-[var(--color-nameless-orange)] group-hover:text-[var(--color-nameless-orange)] text-white/50 transition-colors">
                {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-96 opacity-100 pb-8" : "max-h-0 opacity-0"}`}
            >
              <p className="font-sans text-lg text-white/60 font-light leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
