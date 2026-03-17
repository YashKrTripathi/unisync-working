"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";
import {
    Calendar,
    ClipboardList,
    DollarSign,
    TrendingUp,
    Users,
    Zap,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useMutation } from "convex/react";

function StatCard({ title, value, subtitle, icon: Icon, color }) {
    const colorClasses = {
        purple: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        green: "bg-green-500/10 border-green-500/20 text-green-400",
        orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    };

    return (
        <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400 mb-1">{title}</p>
                    <p className="text-3xl leading-none font-bold text-white">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

function EventCard({ event, isLive }) {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    return (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 hover:border-white/[0.12] transition-colors">
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white text-sm truncate flex-1">{event.title}</h3>
                {isLive ? (
                    <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Live
                    </span>
                ) : (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                        Upcoming
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>
                    {startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    {" - "}
                    {endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
                <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.registrationCount}/{event.capacity}
                </span>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const adminCheck = useQuery(api.admin.isAdmin);
    const isAdmin = adminCheck?.canAccessAdminPanel === true;
    const stats = useQuery(api.admin.getDashboardStats, isAdmin ? {} : "skip");
    const updateStatus = useMutation(api.adminEvents.updateEventStatus);

    if (stats === undefined) {
        return (
            <div className="flex items-center justify-center h-64">
                <BarLoader width={200} color="#0288D1" />
            </div>
        );
    }

    const pendingEvents = (stats.pendingEvents || []);

    async function handleApprove(eventId) {
        try {
            await updateStatus({ eventId, status: "approved" });
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleReject(eventId) {
        const reason = prompt("Reason for rejection:");
        if (reason === null) return;
        try {
            await updateStatus({ eventId, status: "cancelled", reason: reason || "Rejected by admin" });
        } catch (e) {
            alert(e.message);
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-2">Overview of your platform activity</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Live Events"
                    value={stats.liveEvents.length}
                    subtitle={`${stats.upcomingEvents.length} upcoming this week`}
                    icon={Zap}
                    color="green"
                />
                <StatCard
                    title="Total Registrations"
                    value={stats.totalRegistrations.toLocaleString()}
                    subtitle={`${stats.attendanceRate}% attendance rate`}
                    icon={ClipboardList}
                    color="blue"
                />
                <StatCard
                    title="Total Revenue"
                    value={`Rs ${stats.totalRevenue.toLocaleString()}`}
                    subtitle={`Rs ${stats.monthlyRevenue.toLocaleString()} this month`}
                    icon={DollarSign}
                    color="orange"
                />
                <StatCard
                    title="Total Events"
                    value={stats.totalEvents}
                    subtitle={`${stats.totalCheckedIn} checked in`}
                    icon={Calendar}
                    color="purple"
                />
            </div>

            {/* Pending Approvals */}
            {pendingEvents.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-400" />
                            Pending Approval
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                                {pendingEvents.length}
                            </span>
                        </h2>
                        <Link href="/admin/events" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {pendingEvents.slice(0, 5).map((event) => (
                            <div key={event._id} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-medium text-white text-sm truncate">{event.title}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        by {event.organizerName} — {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 ml-3">
                                    <button
                                        onClick={() => handleApprove(event._id)}
                                        className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors"
                                        title="Approve"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleReject(event._id)}
                                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                        title="Reject"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-green-400" />
                            Live & Upcoming Events
                        </h2>
                        <span className="text-xs text-gray-500">
                            {stats.liveEvents.length + stats.upcomingEvents.length} events
                        </span>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {stats.liveEvents.map((event) => (
                            <EventCard key={event._id} event={event} isLive={true} />
                        ))}
                        {stats.upcomingEvents.map((event) => (
                            <EventCard key={event._id} event={event} isLive={false} />
                        ))}
                        {stats.liveEvents.length === 0 && stats.upcomingEvents.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-8">No live or upcoming events</p>
                        )}
                    </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Platform Snapshot
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Live Events</span>
                            <span className="text-sm text-white">{stats.liveEvents.length}</span>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Upcoming This Week</span>
                                <span className="text-white">{stats.upcomingEvents.length}</span>
                            </div>
                            <div className="w-full bg-white/[0.06] rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            Math.round(
                                                ((stats.liveEvents.length + stats.upcomingEvents.length) /
                                                    Math.max(stats.totalEvents, 1)) *
                                                100
                                            )
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Check-in Completion</span>
                                <span className="text-white">{stats.attendanceRate}%</span>
                            </div>
                            <div className="w-full bg-white/[0.06] rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${stats.attendanceRate}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Revenue / Checked-in User</span>
                                <span className="text-white">
                                    {`Rs ${Math.round(
                                        stats.totalRevenue / Math.max(stats.totalCheckedIn, 1)
                                    ).toLocaleString()}`}
                                </span>
                            </div>
                            <div className="w-full bg-white/[0.06] rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            Math.round(
                                                (Math.min(stats.totalRevenue, stats.totalCheckedIn * 500) /
                                                    Math.max(stats.totalCheckedIn * 500, 1)) *
                                                100
                                            )
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-5">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "Events", href: "/admin/events", icon: Calendar, color: "text-blue-400" },
                        { label: "Analytics", href: "/admin/analytics", icon: TrendingUp, color: "text-blue-400" },
                        { label: "Team", href: "/admin/team", icon: Users, color: "text-amber-400" },
                        { label: "Reports", href: "/admin/reports", icon: ClipboardList, color: "text-green-400" },
                    ].map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                        >
                            <action.icon className={`w-4 h-4 ${action.color}`} />
                            <span className="text-sm text-white font-medium">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
