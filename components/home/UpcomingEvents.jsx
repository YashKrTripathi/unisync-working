"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockUpcomingEvents } from "@/lib/mockData";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";

export default function UpcomingEvents() {
    // Show first 4 upcoming events
    const events = mockUpcomingEvents.slice(0, 4);

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-dypiu-navy/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                            <Sparkles className="w-3.5 h-3.5" />
                            Don't Miss Out
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-2 tracking-tighter">
                            Upcoming <span className="text-primary drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">Events</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl font-light">
                            Discover the most exciting moments happening soon on campus.
                        </p>
                    </div>
                    <Link href="/explore">
                        <Button
                            variant="outline"
                            className="rounded-full px-6 py-5 font-semibold border-white/10 glass-light text-foreground hover:bg-white/10 hover:border-primary/50 group transition-all duration-300"
                        >
                            View All Events
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 text-primary transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Event Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {events.map((event, index) => (
                        <Link
                            key={event._id}
                            href={`/events/${event.slug}`}
                            className="group"
                        >
                            <div
                                className="h-full flex flex-col rounded-3xl overflow-hidden glass hover:bg-white/[0.04] border-t border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(37,99,235,0.15)]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Card Image / Color */}
                                <div
                                    className="h-48 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundColor: event.themeColor || "#1e3a8a" }}
                                >
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                                    <span className="text-7xl opacity-50 drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500 z-10">
                                        {getCategoryIcon(event.category)}
                                    </span>

                                    <div className="absolute top-4 right-4 z-20">
                                        <Badge className="bg-background/40 hover:bg-background/60 text-foreground border border-white/10 text-xs px-3 py-1 font-bold tracking-wider uppercase backdrop-blur-md shadow-lg">
                                            {event.ticketType === "free" ? "Free" : "Paid"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 flex flex-col flex-grow relative z-20 -mt-8 bg-gradient-to-b from-transparent to-background/50">
                                    <div className="mb-4">
                                        <Badge
                                            variant="outline"
                                            className="mb-3 text-xs border-white/10 text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1"
                                        >
                                            {getCategoryIcon(event.category)}{" "}
                                            {getCategoryLabel(event.category)}
                                        </Badge>
                                        <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                            {event.title}
                                        </h3>
                                    </div>

                                    <div className="space-y-3 mt-auto text-sm text-muted-foreground font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <span>{format(event.startDate, "PPP")}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-dypiu-gold/10 flex items-center justify-center text-dypiu-gold border border-dypiu-gold/5">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <span className="line-clamp-1">
                                                {event.venue || event.city}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <span>
                                                {event.registrationCount} / {event.capacity} Enrolled
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
