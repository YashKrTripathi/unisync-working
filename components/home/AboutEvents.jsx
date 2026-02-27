"use client";

import React from "react";
import { Search, CalendarPlus, QrCode, BarChart3, Sparkles } from "lucide-react";

const features = [
    {
        icon: Search,
        title: "Discover Events",
        description:
            "Browse and search for upcoming campus events across all departments and categories.",
        color: "from-blue-400 to-blue-600",
        shadow: "shadow-blue-500/20",
        glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
    },
    {
        icon: CalendarPlus,
        title: "Organize Seamlessly",
        description:
            "Create and manage events with an intuitive dashboard. Track registrations in real-time.",
        color: "from-amber-400 to-orange-500",
        shadow: "shadow-amber-500/20",
        glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
    },
    {
        icon: QrCode,
        title: "QR Attendance",
        description:
            "Mark attendance instantly with QR code scanning. No more manual roll calls or paperwork.",
        color: "from-emerald-400 to-green-600",
        shadow: "shadow-emerald-500/20",
        glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
    },
    {
        icon: BarChart3,
        title: "Smart Reports",
        description:
            "Generate comprehensive reports with charts, analytics, and exportable data for every event.",
        color: "from-rose-400 to-red-600",
        shadow: "shadow-rose-500/20",
        glow: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]"
    },
];

export default function AboutEvents() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-dypiu-gold/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dypiu-gold/10 border border-dypiu-gold/20 text-dypiu-gold text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        <Sparkles className="w-3.5 h-3.5" />
                        Features
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tighter">
                        Everything You Need for{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Campus Events</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
                        A seamless ecosystem designed for UNI<span className="text-blue-500 font-semibold">SYNC</span> students and organizers to make every event an absolute success.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className={`group relative p-8 rounded-3xl glass-light hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 border-t border-white/10 ${feature.shadow} ${feature.glow}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 shadow-lg transition-transform duration-500`}
                            >
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-blue-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                {feature.description}
                            </p>

                            {/* Decorative border bottom on hover */}
                            <div className={`absolute bottom-0 left-8 right-8 h-[2px] rounded-t-full bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
