"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
    Calendar,
    Users,
    TrendingUp,
    Award,
    Sparkles,
    Filter,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { CATEGORIES, getCategoryLabel } from "@/lib/data";
import {
    LineChart,
    Line,
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

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 border border-white/10 rounded-lg p-3 shadow-xl">
                <p className="text-sm font-medium text-white">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs text-gray-400">
                        {entry.name}: <span className="text-white font-medium">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState("6months");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const { data: reportData, isLoading } = useConvexQuery(
        api.adminAnalytics.getReportsOverview,
        {
            range: dateRange,
            category: selectedCategory,
        }
    );

    const eventCategories = useMemo(
        () => [
            { value: "all", label: "All Categories" },
            ...CATEGORIES.map((category) => ({
                value: category.id,
                label: category.label,
            })),
        ],
        []
    );

    const summaryCards = useMemo(() => {
        if (!reportData) {
            return [];
        }

        const summary = reportData.reportSummary;
        return [
            {
                label: "Total Events",
                value: String(summary.totalEvents),
                icon: Calendar,
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20",
                change: `In selected range`,
            },
            {
                label: "Total Attendees",
                value: summary.totalAttendees.toLocaleString(),
                icon: Users,
                color: "text-dypiu-gold",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20",
                change: `Checked-in attendees`,
            },
            {
                label: "Attendance Rate",
                value: `${summary.attendanceRate}%`,
                icon: TrendingUp,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
                change: `${summary.averageAttendance} avg per event`,
            },
            {
                label: "Most Popular",
                value: summary.mostPopularEvent,
                icon: Award,
                color: "text-red-400",
                bg: "bg-red-500/10",
                border: "border-red-500/20",
                change: getCategoryLabel(summary.mostPopularCategory),
            },
        ];
    }, [reportData]);

    return (
        <div className="pb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Reports & Analytics</h1>
                    <p className="text-sm text-gray-400">
                        Comprehensive insights into event performance and participation.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link href="/admin/reports/generate">
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-1.5"
                        >
                            <Sparkles className="w-4 h-4" />
                            Generate Event Report
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Filter className="w-4 h-4" />
                    Filters:
                </div>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                >
                    <option value="1month" className="bg-gray-900">Last Month</option>
                    <option value="3months" className="bg-gray-900">Last 3 Months</option>
                    <option value="6months" className="bg-gray-900">Last 6 Months</option>
                    <option value="1year" className="bg-gray-900">Last Year</option>
                </select>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                >
                    {eventCategories.map((cat) => (
                        <option key={cat.value} value={cat.value} className="bg-gray-900">
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading || !reportData ? (
                <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading analytics...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {summaryCards.map((card) => (
                            <div
                                key={card.label}
                                className={`p-5 rounded-xl ${card.bg} border ${card.border}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <card.icon className={`w-5 h-5 ${card.color}`} />
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                        {card.label}
                                    </span>
                                </div>
                                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{card.change}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
                            <h3 className="text-lg font-semibold text-white mb-1">Attendance Over Time</h3>
                            <p className="text-xs text-gray-500 mb-4">Monthly checked-in attendance</p>
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={reportData.attendanceOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" stroke="#4b5563" fontSize={12} tickLine={false} />
                                    <YAxis stroke="#4b5563" fontSize={12} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="attendees"
                                        name="Attendees"
                                        stroke="#3b82f6"
                                        strokeWidth={2.5}
                                        dot={{ fill: "#3b82f6", r: 4 }}
                                        activeDot={{ r: 6, fill: "#60a5fa" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
                            <h3 className="text-lg font-semibold text-white mb-1">Event-wise Participation</h3>
                            <p className="text-xs text-gray-500 mb-4">Registration vs attendance per event</p>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={reportData.eventWiseParticipation}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="event"
                                        stroke="#4b5563"
                                        fontSize={11}
                                        tickLine={false}
                                        angle={-15}
                                        textAnchor="end"
                                        height={50}
                                    />
                                    <YAxis stroke="#4b5563" fontSize={12} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
                                    <Bar dataKey="registered" name="Registered" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="attended" name="Attended" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
                            <h3 className="text-lg font-semibold text-white mb-1">Category Distribution</h3>
                            <p className="text-xs text-gray-500 mb-4">Breakdown of events by category</p>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={reportData.categoryDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${getCategoryLabel(name)} ${(percent * 100).toFixed(0)}%`
                                        }
                                        labelLine={{ stroke: "#4b5563" }}
                                        fontSize={11}
                                    >
                                        {reportData.categoryDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
                            <h3 className="text-lg font-semibold text-white mb-1">Report Summary</h3>
                            <p className="text-xs text-gray-500 mb-4">Key metrics for the selected period</p>

                            <div className="space-y-4">
                                {[
                                    {
                                        label: "Total Events Conducted",
                                        value: reportData.reportSummary.totalEvents,
                                    },
                                    {
                                        label: "Total Attendees",
                                        value: reportData.reportSummary.totalAttendees.toLocaleString(),
                                    },
                                    {
                                        label: "Average Attendance per Event",
                                        value: reportData.reportSummary.averageAttendance,
                                    },
                                    {
                                        label: "Overall Attendance Rate",
                                        value: `${reportData.reportSummary.attendanceRate}%`,
                                    },
                                    {
                                        label: "Most Popular Event",
                                        value: reportData.reportSummary.mostPopularEvent,
                                    },
                                    {
                                        label: "Top Category",
                                        value: getCategoryLabel(reportData.reportSummary.mostPopularCategory),
                                    },
                                    {
                                        label: "Total Event Hours",
                                        value: `${reportData.reportSummary.totalHoursOfEvents} hrs`,
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0"
                                    >
                                        <span className="text-sm text-gray-400">{item.label}</span>
                                        <span className="text-sm font-semibold text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
