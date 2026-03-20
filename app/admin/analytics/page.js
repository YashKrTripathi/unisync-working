"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";
import { format } from "date-fns";
import {
    Users,
    CalendarCheck,
    IndianRupee,
    Calendar,
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart3,
    PieChart as PieChartIcon,
    Activity,
    Target,
    Clock,
    Zap,
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

// â”€â”€â”€ Color palette for charts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const COLORS = [
    "#a855f7", // purple
    "#3b82f6", // blue
    "#22c55e", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#8b5cf6", // violet
    "#14b8a6", // teal
    "#f97316", // orange
];

// â”€â”€â”€ Custom tooltip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
            <p className="text-gray-300 text-xs font-medium mb-1">{label}</p>
            {payload.map((entry, i) => (
                <p key={i} className="text-sm" style={{ color: entry.color }}>
                    {entry.name}: <span className="font-semibold">{entry.value?.toLocaleString()}</span>
                </p>
            ))}
        </div>
    );
}

// â”€â”€â”€ Format currency â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function formatCurrency(amount) {
    if (amount >= 100000) return `â‚¹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `â‚¹${(amount / 1000).toFixed(1)}K`;
    return `â‚¹${amount}`;
}

// â”€â”€â”€ Stat card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatCard({ label, value, icon: Icon, growth, suffix = "", color = "purple" }) {
    const colorMap = {
        purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
        blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
        green: "from-green-500/20 to-green-600/5 border-green-500/30",
        amber: "from-amber-500/20 to-amber-600/5 border-amber-500/30",
    };
    const iconColorMap = {
        purple: "text-purple-400 bg-purple-500/20",
        blue: "text-blue-400 bg-blue-500/20",
        green: "text-green-400 bg-green-500/20",
        amber: "text-amber-400 bg-amber-500/20",
    };

    return (
        <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-5`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">{label}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                        {value}{suffix}
                    </p>
                    {growth !== undefined && (
                        <div className="flex items-center gap-1 mt-2">
                            {growth > 0 ? (
                                <TrendingUp className="w-3 h-3 text-green-400" />
                            ) : growth < 0 ? (
                                <TrendingDown className="w-3 h-3 text-red-400" />
                            ) : (
                                <Minus className="w-3 h-3 text-gray-400" />
                            )}
                            <span
                                className={`text-xs font-medium ${growth > 0
                                        ? "text-green-400"
                                        : growth < 0
                                            ? "text-red-400"
                                            : "text-gray-400"
                                    }`}
                            >
                                {growth > 0 ? "+" : ""}
                                {growth}% vs last month
                            </span>
                        </div>
                    )}
                </div>
                <div className={`p-2.5 rounded-lg ${iconColorMap[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

// â”€â”€â”€ Chart card wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ChartCard({ title, icon: Icon, children, className = "" }) {
    return (
        <div className={`bg-gray-900/60 border border-gray-800 rounded-xl p-5 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                {Icon && <Icon className="w-4 h-4 text-purple-400" />}
                <h3 className="text-sm font-semibold text-white">{title}</h3>
            </div>
            {children}
        </div>
    );
}

// â”€â”€â”€ Aggregated analytics tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AggregatedAnalytics() {
    const adminCheck = useQuery(api.admin.isAdmin);
    const isAdmin = adminCheck?.canAccessAdminPanel === true;
    const data = useQuery(api.adminAnalytics.getAggregatedAnalytics, isAdmin ? {} : "skip");

    if (!data) {
        return (
            <div className="flex justify-center py-20">
                <BarLoader width={200} color="#a855f7" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Registrations"
                    value={data.totalRegistrations.toLocaleString()}
                    icon={Users}
                    growth={data.regGrowth}
                    color="purple"
                />
                <StatCard
                    label="Attendance Rate"
                    value={data.attendanceRate}
                    suffix="%"
                    icon={CalendarCheck}
                    color="blue"
                />
                <StatCard
                    label="Total Revenue"
                    value={formatCurrency(data.totalRevenue)}
                    icon={IndianRupee}
                    color="green"
                />
                <StatCard
                    label="Total Events"
                    value={data.totalEvents}
                    icon={Calendar}
                    color="amber"
                />
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap gap-3">
                <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium">
                    {data.activeEvents} Live
                </div>
                <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium">
                    {data.upcomingEvents} Upcoming
                </div>
                <div className="px-3 py-1.5 bg-gray-500/10 border border-gray-500/20 rounded-full text-gray-400 text-xs font-medium">
                    {data.completedEvents} Completed
                </div>
                <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium">
                    {data.totalAttended} Attended
                </div>
            </div>

            {/* Registrations trend */}
            <ChartCard title="Registrations Trend (Last 6 Months)" icon={TrendingUp}>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.registrationsTrend}>
                            <defs>
                                <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="registrations"
                                name="Registrations"
                                stroke="#a855f7"
                                strokeWidth={2}
                                fill="url(#regGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            {/* Two-column: Revenue by category + Monthly events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Events by Category" icon={PieChartIcon}>
                    <div className="h-[280px]">
                        {data.eventsByCategory.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.eventsByCategory}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {data.eventsByCategory.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        formatter={(value) => (
                                            <span className="text-gray-300 text-xs capitalize">{value}</span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                No event data available
                            </div>
                        )}
                    </div>
                </ChartCard>

                <ChartCard title="Monthly Event Count" icon={BarChart3}>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.monthlyEvents}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="events"
                                    name="Events"
                                    fill="#3b82f6"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Revenue by category bar chart (if any revenue) */}
            {data.revenueByCategory.length > 0 && (
                <ChartCard title="Revenue by Category" icon={IndianRupee}>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.revenueByCategory} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    stroke="#9ca3af"
                                    fontSize={12}
                                    width={100}
                                    tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    formatter={(value) => [`â‚¹${value.toLocaleString()}`, "Revenue"]}
                                />
                                <Bar
                                    dataKey="value"
                                    name="Revenue"
                                    fill="#22c55e"
                                    radius={[0, 6, 6, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            )}
        </div>
    );
}

// â”€â”€â”€ Event-wise analytics tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function EventWiseAnalytics() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const adminCheck = useQuery(api.admin.isAdmin);
    const isAdmin = adminCheck?.canAccessAdminPanel === true;
    const eventList = useQuery(api.adminAnalytics.getEventList, isAdmin ? {} : "skip");
    const eventData = useQuery(
        api.adminAnalytics.getEventAnalytics,
        isAdmin && selectedEvent ? { eventId: selectedEvent } : "skip"
    );

    if (!eventList) {
        return (
            <div className="flex justify-center py-20">
                <BarLoader width={200} color="#a855f7" />
            </div>
        );
    }

    const selectedEventMeta =
        eventList.find((event) => event._id === selectedEvent) || null;

    return (
        <div className="space-y-6">
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5">
                <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
                    <div className="space-y-4">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.24em] text-purple-300/80">Select Event</p>
                            <h3 className="mt-2 text-xl font-semibold text-white">Event-wise analytics</h3>
                            <p className="mt-1 text-sm text-gray-400">
                                Pick an event to inspect registrations, attendance, ownership, and revenue in one place.
                            </p>
                        </div>

                        <select
                            value={selectedEvent || ""}
                            onChange={(e) => setSelectedEvent(e.target.value || null)}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">Choose an event...</option>
                            {eventList.map((ev) => (
                                <option key={ev._id} value={ev._id}>
                                    {ev.title} - {new Date(ev.startDate).toLocaleDateString()}
                                </option>
                            ))}
                        </select>

                        {selectedEventMeta && (
                            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-purple-200/80">Current focus</p>
                                <p className="mt-2 text-base font-semibold text-white">{selectedEventMeta.title}</p>
                                <p className="mt-1 text-sm text-gray-400">
                                    {format(new Date(selectedEventMeta.startDate), "MMM d, yyyy")}
                                    {selectedEventMeta.endDate
                                        ? ` - ${format(new Date(selectedEventMeta.endDate), "MMM d, yyyy")}`
                                        : ""}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                        {eventList.map((event) => {
                            const adminNames = (event.eventAdmins || []).map((admin) => admin.name);
                            const isSelected = selectedEvent === event._id;

                            return (
                                <button
                                    key={event._id}
                                    type="button"
                                    onClick={() => setSelectedEvent(event._id)}
                                    className={`overflow-hidden rounded-2xl border text-left transition-all ${
                                        isSelected
                                            ? "border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10"
                                            : "border-gray-800 bg-gray-950/60 hover:border-gray-700 hover:bg-gray-900/80"
                                    }`}
                                >
                                    <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-purple-900/40 via-gray-900 to-gray-950">
                                        {event.coverImage ? (
                                            <Image
                                                src={event.coverImage}
                                                alt={event.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1536px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="flex h-full items-end bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.28),_transparent_45%),linear-gradient(135deg,rgba(17,24,39,0.92),rgba(2,6,23,0.98))] p-4">
                                                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-purple-100">
                                                    {event.category}
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                                            <span className="rounded-full border border-black/20 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/85 backdrop-blur">
                                                {event.status}
                                            </span>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4">
                                            <p className="text-base font-semibold text-white">{event.title}</p>
                                            <p className="mt-1 text-xs text-white/70">
                                                {format(new Date(event.startDate), "MMM d, yyyy")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-4">
                                        <div>
                                            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Organizer</p>
                                            <p className="mt-1 text-sm text-gray-100">{event.organizerName || "Unknown organizer"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">In-charge / manager</p>
                                            <p className="mt-1 text-sm text-gray-300">
                                                {adminNames.length > 0 ? adminNames.join(", ") : "Not assigned"}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {!selectedEvent && (
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-12 text-center">
                    <BarChart3 className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">Select an event above to view detailed analytics</p>
                </div>
            )}

            {selectedEvent && !eventData && (
                <div className="flex justify-center py-12">
                    <BarLoader width={200} color="#a855f7" />
                </div>
            )}

            {eventData && (
                <>
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="grid gap-0 lg:grid-cols-[260px_1fr]">
                            <div className="relative min-h-[220px] bg-gradient-to-br from-purple-900/35 via-slate-900 to-black">
                                {eventData.event.coverImage ? (
                                    <Image
                                        src={eventData.event.coverImage}
                                        alt={eventData.event.title}
                                        fill
                                        className="object-cover"
                                        sizes="260px"
                                    />
                                ) : (
                                    <div className="flex h-full items-end bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.28),_transparent_45%),linear-gradient(135deg,rgba(17,24,39,0.92),rgba(2,6,23,0.98))] p-5">
                                        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-purple-100">
                                            {eventData.event.category}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.24em] text-purple-300/80">Selected event</p>
                                        <h3 className="mt-2 text-2xl font-bold text-white">{eventData.event.title}</h3>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {format(new Date(eventData.event.startDate), "MMM d, yyyy")} - {format(new Date(eventData.event.endDate), "MMM d, yyyy")}
                                            <span className="ml-2 capitalize text-gray-500">• {eventData.event.category}</span>
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${eventData.event.status === "live"
                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                            : eventData.event.status === "approved"
                                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                : eventData.event.status === "completed"
                                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                        }`}>
                                        {eventData.event.status}
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3 md:grid-cols-2">
                                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Organizer</p>
                                        <p className="mt-2 text-base font-medium text-white">
                                            {eventData.event.organizerName || "Unknown organizer"}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Admin / manager</p>
                                        <p className="mt-2 text-base font-medium text-white">
                                            {eventData.event.eventAdmins?.length
                                                ? eventData.event.eventAdmins.map((admin) => admin.name).join(", ")
                                                : "Not assigned"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Registered"
                            value={eventData.totalRegistered}
                            icon={Users}
                            color="purple"
                        />
                        <StatCard
                            label="Attended"
                            value={eventData.totalAttended}
                            icon={CalendarCheck}
                            color="blue"
                        />
                        <StatCard
                            label="Attendance Rate"
                            value={eventData.attendanceRate}
                            suffix="%"
                            icon={Target}
                            color="green"
                        />
                        <StatCard
                            label="Revenue"
                            value={eventData.totalRevenue > 0 ? formatCurrency(eventData.totalRevenue) : "Free"}
                            icon={IndianRupee}
                            color="amber"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Target className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Capacity Used</p>
                                <p className="text-lg font-bold text-white">{eventData.capacityUtilization}%</p>
                                <p className="text-xs text-gray-500">{eventData.totalRegistered} / {eventData.event.capacity}</p>
                            </div>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Zap className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Peak Day</p>
                                <p className="text-lg font-bold text-white">{eventData.peakDay || "-"}</p>
                                <p className="text-xs text-gray-500">{eventData.peakCount} registrations</p>
                            </div>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <Activity className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Avg Daily Rate</p>
                                <p className="text-lg font-bold text-white">{eventData.avgDailyRate}</p>
                                <p className="text-xs text-gray-500">registrations/day</p>
                            </div>
                        </div>
                    </div>

                    {/* Registered vs Attended bar */}
                    <ChartCard title="Registered vs Attended" icon={BarChart3}>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        {
                                            name: eventData.event.title,
                                            Registered: eventData.totalRegistered,
                                            Attended: eventData.totalAttended,
                                            Cancelled: eventData.totalCancelled,
                                        },
                                    ]}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        formatter={(value) => (
                                            <span className="text-gray-300 text-xs">{value}</span>
                                        )}
                                    />
                                    <Bar dataKey="Registered" fill="#a855f7" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="Attended" fill="#22c55e" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="Cancelled" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* Registration timeline */}
                    {eventData.registrationTimeline.length > 1 && (
                        <ChartCard title="Cumulative Registrations Over Time" icon={TrendingUp}>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={eventData.registrationTimeline}>
                                        <defs>
                                            <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                                        <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="registrations"
                                            name="Total Registrations"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            fill="url(#timelineGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>
                    )}

                    {/* Daily registrations */}
                    {eventData.dailyRegistrations.length > 1 && (
                        <ChartCard title="Daily Registration Volume" icon={BarChart3}>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={eventData.dailyRegistrations}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                                        <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="count"
                                            name="Registrations"
                                            fill="#a855f7"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>
                    )}
                </>
            )}
        </div>
    );
}
// â”€â”€â”€ Main analytics page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function AnalyticsAdminPage() {
    const [activeTab, setActiveTab] = useState("aggregated");

    const tabs = [
        { id: "aggregated", label: "Aggregated", icon: BarChart3 },
        { id: "event-wise", label: "Event-wise", icon: PieChartIcon },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Platform-wide metrics and event-wise drilldown insights
                </p>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 bg-gray-900/60 border border-gray-800 rounded-xl p-1 mb-6 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === "aggregated" ? (
                <AggregatedAnalytics />
            ) : (
                <EventWiseAnalytics />
            )}
        </div>
    );
}
