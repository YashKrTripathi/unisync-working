"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";
import { format } from "date-fns";
import {
    Users,
    CheckCircle2,
    XCircle,
    UserCheck,
    Search,
    Filter,
    MoreVertical,
    LogIn,
    Ban,
    Calendar,
    Mail,
    QrCode,
} from "lucide-react";

// ─── Status config ──────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    confirmed: {
        label: "Confirmed",
        color: "bg-green-500/20 text-green-400 border-green-500/30",
        icon: CheckCircle2,
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        icon: XCircle,
    },
};

// ─── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }) {
    const colorMap = {
        purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
        green: "from-green-500/20 to-green-600/5 border-green-500/30",
        red: "from-red-500/20 to-red-600/5 border-red-500/30",
        blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    };
    const iconColorMap = {
        purple: "text-purple-400 bg-purple-500/20",
        green: "text-green-400 bg-green-500/20",
        red: "text-red-400 bg-red-500/20",
        blue: "text-blue-400 bg-blue-500/20",
    };

    return (
        <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-5`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">{label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value.toLocaleString()}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${iconColorMap[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

export default function RegistrationsAdminPage() {
    const data = useQuery(api.adminRegistrations.getAllRegistrations);
    const cancelMutation = useMutation(api.adminRegistrations.adminCancelRegistration);
    const checkInMutation = useMutation(api.adminRegistrations.adminCheckIn);

    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [eventFilter, setEventFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);

    // Unique events for filter dropdown
    const eventOptions = useMemo(() => {
        if (!data) return [];
        const seen = new Map();
        data.registrations.forEach((r) => {
            if (!seen.has(r.eventId)) {
                seen.set(r.eventId, r.eventTitle);
            }
        });
        return Array.from(seen.entries()).map(([id, title]) => ({ id, title }));
    }, [data]);

    // Filtered registrations
    const filtered = useMemo(() => {
        if (!data) return [];
        let list = data.registrations;

        // Tab filter
        if (activeTab === "confirmed") list = list.filter((r) => r.status === "confirmed");
        if (activeTab === "cancelled") list = list.filter((r) => r.status === "cancelled");

        // Event filter
        if (eventFilter !== "all") list = list.filter((r) => r.eventId === eventFilter);

        // Search
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(
                (r) =>
                    r.attendeeName.toLowerCase().includes(q) ||
                    r.attendeeEmail.toLowerCase().includes(q) ||
                    r.eventTitle.toLowerCase().includes(q)
            );
        }

        return list;
    }, [data, activeTab, eventFilter, searchTerm]);

    // Actions
    async function handleCancel(regId) {
        if (!confirm("Cancel this registration? This will decrement the event count.")) return;
        setActionLoading(regId);
        try {
            await cancelMutation({ registrationId: regId });
        } catch (e) {
            alert(e.message);
        }
        setActionLoading(null);
    }

    async function handleCheckIn(regId) {
        setActionLoading(regId);
        try {
            await checkInMutation({ registrationId: regId });
        } catch (e) {
            alert(e.message);
        }
        setActionLoading(null);
    }

    // Loading
    if (!data) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Registrations</h1>
                <p className="text-gray-400 text-sm mb-8">Manage all event registrations</p>
                <div className="flex justify-center py-20">
                    <BarLoader width={200} color="#a855f7" />
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "all", label: "All", count: data.stats.total },
        { id: "confirmed", label: "Confirmed", count: data.stats.confirmed },
        { id: "cancelled", label: "Cancelled", count: data.stats.cancelled },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Registrations</h1>
                <p className="text-gray-400 text-sm mt-1">Manage all event registrations across the platform</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total" value={data.stats.total} icon={Users} color="purple" />
                <StatCard label="Confirmed" value={data.stats.confirmed} icon={CheckCircle2} color="green" />
                <StatCard label="Cancelled" value={data.stats.cancelled} icon={XCircle} color="red" />
                <StatCard label="Checked In" value={data.stats.checkedIn} icon={UserCheck} color="blue" />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-900/60 border border-gray-800 rounded-xl p-1 mb-4 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                            }`}
                    >
                        {tab.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-gray-700"
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or event..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900/60 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                        value={eventFilter}
                        onChange={(e) => setEventFilter(e.target.value)}
                        className="bg-gray-900/60 border border-gray-800 rounded-lg pl-10 pr-8 py-2.5 text-sm text-white appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[200px]"
                    >
                        <option value="all">All Events</option>
                        {eventOptions.map((ev) => (
                            <option key={ev.id} value={ev.id}>
                                {ev.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results count */}
            <p className="text-gray-500 text-xs mb-3">
                Showing {filtered.length} registration{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Data table */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="text-left text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider">Attendee</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider hidden md:table-cell">Event</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider">Status</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider hidden lg:table-cell">Check-in</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider hidden lg:table-cell">Registered</th>
                                <th className="text-right text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                        No registrations found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((reg) => {
                                    const statusCfg = STATUS_CONFIG[reg.status] || STATUS_CONFIG.confirmed;
                                    const StatusIcon = statusCfg.icon;
                                    const isLoading = actionLoading === reg._id;

                                    return (
                                        <tr key={reg._id} className="hover:bg-gray-800/30 transition-colors">
                                            {/* Attendee */}
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-white font-medium">{reg.attendeeName}</p>
                                                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        {reg.attendeeEmail}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Event */}
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <p className="text-gray-300 text-sm">{reg.eventTitle}</p>
                                                {reg.eventDate && (
                                                    <p className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
                                                        <Calendar className="w-3 h-3" />
                                                        {format(new Date(reg.eventDate), "MMM d, yyyy")}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusCfg.label}
                                                </span>
                                            </td>

                                            {/* Check-in */}
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                {reg.status === "confirmed" && (
                                                    reg.checkedIn ? (
                                                        <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                                                            <UserCheck className="w-3 h-3" />
                                                            {reg.checkedInAt
                                                                ? format(new Date(reg.checkedInAt), "MMM d, h:mm a")
                                                                : "Yes"}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-600 text-xs">Not checked in</span>
                                                    )
                                                )}
                                                {reg.status === "cancelled" && (
                                                    <span className="text-gray-600 text-xs">—</span>
                                                )}
                                            </td>

                                            {/* Registered date */}
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <span className="text-gray-400 text-xs">
                                                    {format(new Date(reg.registeredAt), "MMM d, yyyy")}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {reg.status === "confirmed" && !reg.checkedIn && (
                                                        <button
                                                            onClick={() => handleCheckIn(reg._id)}
                                                            disabled={isLoading}
                                                            className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors disabled:opacity-50"
                                                            title="Check in"
                                                        >
                                                            <LogIn className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {reg.status === "confirmed" && (
                                                        <button
                                                            onClick={() => handleCancel(reg._id)}
                                                            disabled={isLoading}
                                                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                            title="Cancel registration"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {reg.checkedIn && (
                                                        <span className="p-1.5 text-green-500" title="Checked in">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
