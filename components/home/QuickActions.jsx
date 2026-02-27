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
    Rocket
} from "lucide-react";

const studentActions = [
    {
        icon: Search,
        title: "Explore Events",
        description: "Browse upcoming campus events",
        href: "/explore",
        color: "from-blue-400 to-blue-600",
        shadow: "shadow-blue-500/20"
    },
    {
        icon: Ticket,
        title: "My Tickets",
        description: "View your registered events",
        href: "/my-tickets",
        color: "from-purple-400 to-purple-600",
        shadow: "shadow-purple-500/20"
    },
    {
        icon: QrCode,
        title: "Scan QR Code",
        description: "Mark attendance via QR scan",
        href: "/attendance",
        color: "from-emerald-400 to-emerald-600",
        shadow: "shadow-emerald-500/20"
    },
];

const organizerActions = [
    {
        icon: CalendarPlus,
        title: "Create Event",
        description: "Set up a new campus event",
        href: "/create-event",
        color: "from-blue-500 to-blue-700",
        shadow: "shadow-blue-600/20"
    },
    {
        icon: LayoutDashboard,
        title: "Dashboard",
        description: "Manage events & registrations",
        href: "/admin",
        color: "from-dypiu-gold to-orange-500",
        shadow: "shadow-amber-500/20"
    },
    {
        icon: BarChart3,
        title: "Reports",
        description: "Generate analytics & reports",
        href: "/admin/reports",
        color: "from-rose-400 to-red-600",
        shadow: "shadow-rose-500/20"
    },
];

function ActionCard({ action }) {
    return (
        <Link href={action.href} className="group block">
            <div className={`p-6 rounded-3xl glass-light border-t border-white/10 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-1 flex items-center justify-between shadow-lg hover:${action.shadow} group-hover:border-white/20`}>
                <div className="flex items-center gap-5">
                    <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 shadow-md transition-transform duration-500`}
                    >
                        <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground text-lg group-hover:text-blue-400 transition-colors">
                            {action.title}
                        </h4>
                        <p className="text-sm text-muted-foreground font-medium mt-0.5">{action.description}</p>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
        </Link>
    );
}

export default function QuickActions() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
                        <Rocket className="w-3.5 h-3.5" />
                        Jump Right In
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tighter">
                        Quick <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Actions</span>
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto">
                        Whether you&apos;re hunting for the next big hackathon or managing thousands of registrations, we&apos;ve got you covered.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Student Actions */}
                    <div className="space-y-6 relative">
                        {/* Decorative line */}
                        <div className="absolute left-[27px] top-[72px] bottom-[40px] w-0.5 bg-gradient-to-b from-blue-500/20 to-transparent -z-10 hidden sm:block" />

                        <div className="flex items-center gap-3 mb-6 bg-card/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5 shadow-xl glass">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <Search className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">For Students</h3>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Attend & Experience</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {studentActions.map((action) => (
                                <ActionCard key={action.title} action={action} />
                            ))}
                        </div>
                    </div>

                    {/* Organizer Actions */}
                    <div className="space-y-6 relative">
                        {/* Decorative line */}
                        <div className="absolute left-[27px] top-[72px] bottom-[40px] w-0.5 bg-gradient-to-b from-dypiu-gold/20 to-transparent -z-10 hidden sm:block" />

                        <div className="flex items-center gap-3 mb-6 bg-card/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5 shadow-xl glass">
                            <div className="w-12 h-12 rounded-xl bg-dypiu-gold/20 flex items-center justify-center border border-dypiu-gold/30">
                                <CalendarPlus className="w-6 h-6 text-dypiu-gold" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">For Organizers</h3>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Create & Manage</p>
                            </div>
                        </div>
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
