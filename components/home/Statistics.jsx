"use client";

import React, { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/scroll-reveal";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

const DEFAULT_STATS = {
  sectionHeading: "IMPACT",
  sectionSubheading: "Numbers speak louder than words. Discover how our platform is uniting the entire campus ecosystem.",
  stats: [
    { value: 120, suffix: "+", label: "EVENTS HOSTED" },
    { value: 12450, suffix: "+", label: "ACTIVE STUDENTS" },
    { value: 12, suffix: "", label: "DEPARTMENTS" },
    { value: 95, suffix: "%", label: "ENGAGEMENT RATE" },
  ],
};

function AnimatedCounter({ target, suffix, duration = 2500 }) {
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
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}

export default function Statistics() {
    const { data: cmsContent } = useConvexQuery(api.siteContent.getPageContent, { pageId: "home_statistics" });
    const content = cmsContent || DEFAULT_STATS;
    const stats = content.stats || DEFAULT_STATS.stats;

    return (
        <section className="py-32 relative bg-[var(--color-nameless-orange)] w-full">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row gap-12 justify-between items-start mb-24">
                    <ScrollReveal blur y={24} delay={0} className="md:w-1/2">
                        <h2 className="text-[12vw] md:text-[8vw] font-display text-black uppercase tracking-tighter leading-none">
                            {content.sectionHeading || "IMPACT"}
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal y={32} delay={150} className="md:w-1/2 md:pt-8 flex flex-col items-center md:items-end w-full">
                        <p className="font-serif-italic text-black text-2xl md:text-3xl text-left md:text-right leading-relaxed font-bold">
                            {content.sectionSubheading || DEFAULT_STATS.sectionSubheading}
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
                    {stats.map((stat, index) => (
                        <ScrollReveal key={stat.label} delay={index * 120} y={40}>
                            <div className="text-center group">
                                <div className="text-[12vw] md:text-[8vw] font-display text-black leading-none uppercase tracking-tighter hover:text-white transition-colors duration-500 mb-2">
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="font-sans text-sm md:text-lg text-black font-bold tracking-widest uppercase border-t-2 border-black pt-4 mt-4 w-3/4 mx-auto">
                                    {stat.label}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
