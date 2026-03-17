"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import ScrollReveal from "@/components/scroll-reveal";


export default function UpcomingEvents() {
    const { data: events = [] } = useConvexQuery(api.explore.getPopularEvents, {
        limit: 4,
    });

    return (
        <section className="py-24 relative overflow-hidden bg-black w-full border-t border-white/20">
            {/* Background elements */}
            <div className="absolute inset-0 bg-black pointer-events-none -z-10" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
                    <ScrollReveal blur y={24} delay={0}>
                        <div>
                            <h2 className="text-[10vw] md:text-[8vw] leading-none font-display uppercase tracking-tighter text-white mb-2">
                                UPCOMING <span className="text-[var(--color-nameless-orange)]">EVENTS</span>
                            </h2>
                            <p className="font-serif-italic text-white text-xl md:text-3xl mt-2">
                                Discover the most exciting moments happening soon.
                            </p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={200} y={20}>
                        <Link href="/explore">
                            <Button
                                variant="outline"
                                className="rounded-full px-8 py-6 font-bold font-sans uppercase tracking-widest text-xs border-white text-white hover:bg-white hover:text-black transition-all duration-300 group"
                            >
                                View All Events
                                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </ScrollReveal>
                </div>

                {/* Event Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {events.map((event, index) => (
                        <ScrollReveal key={event._id} delay={index * 100} y={50}>
                            <Link
                                href={`/events/${event.slug}`}
                                className="group block h-full"
                            >
                            <div
                                className="h-full flex flex-col rounded-3xl overflow-hidden bg-black hover:bg-white/[0.05] border border-white/20 transition-all duration-500 hover:-translate-y-2"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Card Image / Color */}
                                <div
                                    className="h-48 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundColor: event.themeColor || "#1e3a8a" }}
                                >
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                    <span className="text-7xl opacity-50 drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500 z-10 text-white">
                                        {getCategoryIcon(event.category)}
                                    </span>

                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="bg-transparent text-white border border-white text-[10px] px-3 py-1 font-bold tracking-widest uppercase">
                                            {event.ticketType === "free" ? "Free" : "Paid"}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 flex flex-col flex-grow relative z-20 -mt-8 bg-black">
                                    <div className="mb-4">
                                        <div className="mb-3 inline-block px-3 py-1 border border-white text-white font-sans uppercase text-[10px] tracking-widest font-bold">
                                            {getCategoryLabel(event.category)}
                                        </div>
                                        <h3 className="font-display text-white text-[6vw] md:text-[2.5vw] leading-none uppercase tracking-tighter group-hover:text-[var(--color-nameless-orange)] transition-colors mb-2">
                                            {event.title}
                                        </h3>
                                    </div>

                                    <div className="space-y-3 mt-auto text-sm text-white/80 font-medium">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-[var(--color-nameless-orange)]" />
                                            <span>{format(event.startDate, "PPP")}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-[var(--color-nameless-orange)]" />
                                            <span className="line-clamp-1">
                                                {event.venue || event.city}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="w-4 h-4 text-[var(--color-nameless-orange)]" />
                                            <span>
                                                {event.registrationCount} / {event.capacity} Enrolled
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
