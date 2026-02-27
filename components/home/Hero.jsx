"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Sparkles, ChevronRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 md:py-32">
            {/* Premium Animated Background Elements */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-background">
                {/* Glowing Orbs */}
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-dypiu-navy/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow" />
                <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-dypiu-gold/10 rounded-full blur-[150px] mix-blend-screen animate-pulse-glow delay-700" />
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen" />

                {/* Grid pattern with gradient fade */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"></div>

                {/* Modern grid */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="text-center max-w-5xl mx-auto flex flex-col items-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-dypiu-gold/30 text-dypiu-gold-light text-sm font-medium mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:bg-dypiu-gold/10 hover:border-dypiu-gold/50 transition-all duration-300 hover:-translate-y-1 cursor-default animate-fade-in-up glass-light">
                        <GraduationCap className="w-5 h-5 text-dypiu-gold" />
                        <span className="tracking-widest uppercase text-xs md:text-sm font-bold bg-gradient-to-r from-dypiu-gold via-yellow-300 to-dypiu-gold bg-clip-text text-transparent animate-gradient">
                            D Y Patil International University
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter mb-6 animate-fade-in-up delay-100 leading-none">
                        <span className="text-foreground drop-shadow-sm">
                            UNI
                        </span>
                        <span className="bg-gradient-to-br from-blue-500 via-dypiu-navy-light to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                            SYNC
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mt-4 mb-12 max-w-4xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
                        The ultimate ecosystem for campus culture. <br className="hidden md:block" /> Discover, organize, and experience events with zero friction.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto animate-fade-in-up delay-300">
                        <Link href="/explore" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto rounded-full px-10 py-8 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(30,58,138,0.4)] group"
                            >
                                <Sparkles className="w-6 h-6 mr-3 text-dypiu-gold group-hover:animate-pulse" />
                                Explore Events
                                <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/create-event" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto rounded-full px-10 py-8 text-lg font-semibold border-border bg-card/5 text-foreground backdrop-blur-md hover:bg-card/10 hover:border-dypiu-gold/50 transition-all duration-300 group"
                            >
                                <Calendar className="w-6 h-6 mr-3 text-dypiu-navy-light group-hover:scale-110 transition-transform" />
                                Organize an Event
                            </Button>
                        </Link>
                    </div>

                    {/* Floating Stats or Features */}
                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-5xl opacity-90 hover:opacity-100 transition-opacity duration-500 animate-fade-in-up delay-500">
                        {[
                            { value: "50+", label: "Active Events", color: "from-blue-400 to-blue-600" },
                            { value: "10K+", label: "Happy Students", color: "from-dypiu-gold to-yellow-600" },
                            { value: "12", label: "Departments", color: "from-dypiu-red to-red-600" },
                            { value: "24/7", label: "Campus Life", color: "from-indigo-400 to-indigo-600" },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center justify-center p-8 rounded-3xl glass-light hover:bg-white/[0.04] transition-colors border-t border-white/10 shadow-xl">
                                <div className={`text-4xl sm:text-5xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-3`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm md:text-base text-muted-foreground font-semibold tracking-wider uppercase">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
        </section>
    );
}
