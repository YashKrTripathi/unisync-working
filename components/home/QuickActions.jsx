"use client";

import React from "react";
import Link from "next/link";
import {
    QrCode,
    CalendarPlus,
    LayoutDashboard,
    BarChart3,
    Search,
    Ticket,
    ChevronRight,
} from "lucide-react";

const studentActions = [
    {
        icon: Search,
        title: "EXPLORE EVENTS",
        description: "Browse upcoming campus events",
        href: "/explore",
    },
    {
        icon: Ticket,
        title: "MY TICKETS",
        description: "View your registered events",
        href: "/my-tickets",
    },
    {
        icon: QrCode,
        title: "SCAN QR CODE",
        description: "Mark attendance via QR scan",
        href: "/attendance",
    },
];

const organizerActions = [
    {
        icon: CalendarPlus,
        title: "CREATE EVENT",
        description: "Set up a new campus event",
        href: "/create-event",
    },
    {
        icon: LayoutDashboard,
        title: "DASHBOARD",
        description: "Manage events & registrations",
        href: "/admin",
    },
    {
        icon: BarChart3,
        title: "REPORTS",
        description: "Generate analytics & reports",
        href: "/admin/reports",
    },
];

function ActionCard({ action }) {
    return (
        <Link href={action.href} className="group block">
            <div className="p-8 border border-white/20 hover:bg-white/10 transition-all duration-300 flex items-center justify-between bg-black">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-white/20 rounded-full group-hover:scale-110 group-hover:bg-[var(--color-nameless-orange)] group-hover:text-black group-hover:border-[var(--color-nameless-orange)] transition-all duration-500">
                        <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-display text-2xl lg:text-3xl text-white group-hover:text-[var(--color-nameless-orange)] transition-colors uppercase tracking-tight leading-none mb-1">
                            {action.title}
                        </h4>
                        <p className="text-white/60 font-sans text-sm uppercase tracking-wider">{action.description}</p>
                    </div>
                </div>
                <div className="text-white/30 group-hover:text-[var(--color-nameless-orange)] group-hover:scale-125 transition-all duration-300">
                    <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}

export default function QuickActions() {
    return (
        <section className="py-32 relative bg-black w-full border-t border-white/20">
            <div className="absolute inset-0 bg-black pointer-events-none -z-10" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row gap-12 justify-between items-start mb-24">
                    <div className="md:w-1/2">
                        <h2 className="text-[12vw] md:text-[8vw] font-display text-white uppercase tracking-tighter leading-none">
                            QUICK
                        </h2>
                        <h2 className="text-[10vw] md:text-[6vw] font-display text-[var(--color-nameless-orange)] uppercase tracking-tighter leading-none mt-2">
                            ACTIONS
                        </h2>
                    </div>
                    <div className="md:w-1/2 md:pt-8">
                        <p className="font-serif-italic text-white text-2xl md:text-3xl text-left md:text-right leading-relaxed font-light">
                            Whether you're hunting for the next big hackathon or managing thousands of registrations, we've got you covered.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1400px] mx-auto">
                    {/* Student Actions */}
                    <div className="space-y-6">
                        <h3 className="text-4xl font-display text-white uppercase tracking-tighter mb-8 border-b border-white/20 pb-4">
                            FOR <span className="text-white/50">STUDENTS</span>
                        </h3>
                        <div className="space-y-4">
                            {studentActions.map((action) => (
                                <ActionCard key={action.title} action={action} />
                            ))}
                        </div>
                    </div>

                    {/* Organizer Actions */}
                    <div className="space-y-6">
                        <h3 className="text-4xl font-display text-white uppercase tracking-tighter mb-8 border-b border-white/20 pb-4">
                            FOR <span className="text-[var(--color-nameless-orange)]">ORGANIZERS</span>
                        </h3>
                        <div className="space-y-4">
                            {organizerActions.map((action) => (
                                <ActionCard key={action.title} action={action} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
