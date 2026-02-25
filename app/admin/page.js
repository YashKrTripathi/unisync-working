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
} from "lucide-react";

function StatCard({ title, value, subtitle, icon: Icon, color }) {
    const colorClasses = {
        purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        green: "bg-green-500/10 border-green-500/20 text-green-400",
        orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    };

    return (
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClasses[color]}`}
                >
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
        <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white text-sm truncate flex-1">
                    {event.title}
                </h3>
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
                    {startDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                    })}
                    {" - "}
                    {endDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                    })}
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
    const stats = useQuery(api.admin.getDashboardStats);

    if (stats === undefined) {
        return (
            <div className="flex items-center justify-center h-64">
                <BarLoader width={200} color="#a855f7" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Overview of your platform activity
                </p>
            </div>

            {/* Stats Grid */}
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
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    subtitle={`₹${stats.monthlyRevenue.toLocaleString()} this month`}
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

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live / Active Events */}
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
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
                        {stats.liveEvents.length === 0 &&
                            stats.upcomingEvents.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-8">
                                    No live or upcoming events
                                </p>
                            )}
                    </div>
                </div>

                {/* Server Health Placeholder */}
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                            Platform Health
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {/* Simulated health metrics */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">System Status</span>
                            <span className="flex items-center gap-2 text-sm text-green-400">
                                <span className="w-2 h-2 bg-green-400 rounded-full" />
                                Operational
                            </span>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Active Users</span>
                                <span className="text-white">
                                    {stats.totalRegistrations > 0
                                        ? Math.min(
                                            Math.floor(Math.random() * 50) + 10,
                                            stats.totalRegistrations
                                        )
                                        : 0}
                                </span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: "45%" }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">API Response</span>
                                <span className="text-white">42ms avg</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                                <div
                                    className="bg-purple-500 h-2 rounded-full"
                                    style={{ width: "25%" }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Error Rate</span>
                                <span className="text-white">0.02%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full"
                                    style={{ width: "2%" }}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            * Server metrics are placeholder — integrate real monitoring for
                            production.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
