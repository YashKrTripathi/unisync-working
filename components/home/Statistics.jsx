"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar, Users, Building2, Award, Zap } from "lucide-react";

const stats = [
    {
        icon: Calendar,
        value: 120,
        suffix: "+",
        label: "Events Hosted",
        color: "text-blue-400",
        gradient: "from-blue-400 to-blue-600",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        shadow: "shadow-[0_0_30px_rgba(59,130,246,0.2)]"
    },
    {
        icon: Users,
        value: 12450,
        suffix: "+",
        label: "Active Students",
        color: "text-dypiu-gold",
        gradient: "from-dypiu-gold to-yellow-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        shadow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]"
    },
    {
        icon: Building2,
        value: 12,
        suffix: "",
        label: "Departments",
        color: "text-emerald-400",
        gradient: "from-emerald-400 to-teal-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        shadow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]"
    },
    {
        icon: Award,
        value: 95,
        suffix: "%",
        label: "Engagement Rate",
        color: "text-purple-400",
        gradient: "from-purple-400 to-indigo-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        shadow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]"
    },
];

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
                        // Ease out quint
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
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Grain and Gradients */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
                        <Zap className="w-3.5 h-3.5" />
                        Our Reach
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tighter">
                        The Scale of our <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Impact</span>
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        Numbers speak louder than words. Discover how our platform is uniting the entire campus ecosystem.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`relative p-8 rounded-3xl glass-light border-t border-white/10 text-center group hover:-translate-y-2 transition-all duration-500 hover:${stat.shadow}`}
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl ${stat.bg} flex items-center justify-center border ${stat.border} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>

                            {/* Value */}
                            <div className={`text-5xl md:text-6xl font-black bg-gradient-to-b ${stat.gradient} bg-clip-text text-transparent mb-3 tracking-tighter`}>
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            </div>

                            {/* Label */}
                            <p className="text-sm md:text-base text-muted-foreground font-bold tracking-wider uppercase">
                                {stat.label}
                            </p>

                            {/* Hover Bottom line */}
                            <div className={`absolute bottom-0 left-0 h-1 rounded-b-3xl w-0 bg-gradient-to-r ${stat.gradient} group-hover:w-full transition-all duration-700 opacity-50`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
