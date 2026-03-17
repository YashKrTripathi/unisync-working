"use client";

import React from "react";
import { Search, CalendarPlus, QrCode, BarChart3 } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";

const features = [
    { icon: Search,      title: "DISCOVER",  description: "Browse and search for upcoming campus events effortlessly." },
    { icon: CalendarPlus,title: "ORGANIZE",  description: "Create and manage events with an intuitive dashboard." },
    { icon: QrCode,      title: "ATTEND",    description: "Mark attendance instantly with simple QR code scanning." },
    { icon: BarChart3,   title: "ANALYZE",   description: "Generate comprehensive reports and real-time analytics." },
];

export default function AboutEvents() {
    return (
        <section className="py-32 relative bg-black w-full border-t border-white/20">
            <div className="absolute inset-0 bg-black pointer-events-none -z-10" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                {/* Section Header — blur-to-clear reveal on both parts */}
                <div className="flex flex-col md:flex-row gap-12 justify-between items-start mb-24">
                    <div className="md:w-1/2">
                        {/* Big heading: enters with heavy blur that clears as it scrolls in */}
                        <ScrollReveal blur y={30} delay={0}>
                            <h2 className="text-[12vw] md:text-[8vw] font-display text-white uppercase tracking-tighter leading-none">
                                EXPERIENCE
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal blur y={30} delay={120}>
                            <h2 className="text-[8vw] md:text-[6vw] font-display text-[var(--color-nameless-orange)] uppercase tracking-tighter leading-none mt-2">
                                MORE
                            </h2>
                        </ScrollReveal>
                    </div>
                    <ScrollReveal y={40} delay={200} className="md:w-1/2 md:pt-8">
                        <p className="font-serif-italic text-white text-2xl md:text-4xl text-left md:text-right leading-relaxed font-light">
                            A seamless ecosystem designed to make every event an absolute success.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Feature Cards — staggered slide-up entrance */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {features.map((feature, index) => (
                        <ScrollReveal key={feature.title} delay={index * 120} y={56}>
                            <div className="group relative flex flex-col border-t border-white pt-8">
                                <div className="mb-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <feature.icon
                                        className="w-12 h-12 text-white group-hover:text-[var(--color-nameless-orange)] transition-colors duration-500"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <h3 className="text-4xl lg:text-5xl font-display text-white mb-6 group-hover:text-[var(--color-nameless-orange)] transition-colors uppercase tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-xl text-white/70 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
