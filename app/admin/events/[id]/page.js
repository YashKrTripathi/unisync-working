"use client";

import React, { useState, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    Edit3,
    History,
    User,
    Mail,
    Ticket,
    Globe,
    Zap,
    FileEdit,
    CheckCheck,
    Ban,
    Shield,
    Loader2,
    AlertTriangle,
    Save,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
    draft: {
        label: "Draft",
        color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        icon: FileEdit,
    },
    pending: {
        label: "Pending",
        color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        icon: Clock,
    },
    approved: {
        label: "Approved",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        icon: CheckCircle2,
    },
    live: {
        label: "Live",
        color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        icon: Zap,
        pulse: true,
    },
    completed: {
        label: "Completed",
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        icon: CheckCheck,
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        icon: Ban,
    },
};

function StatusBadge({ status, large }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.approved;
    const Icon = config.icon;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full font-medium border",
                config.color,
                large ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs"
            )}
        >
            {config.pulse && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
            )}
            {!config.pulse && <Icon className={large ? "w-4 h-4" : "w-3 h-3"} />}
            {config.label}
        </span>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Icon className={cn("w-4 h-4", color)} />
                <span className="text-xs">{label}</span>
            </div>
            <p className={cn("text-xl font-bold", color)}>{value}</p>
        </div>
    );
}

export default function EventDetailPage({ params }) {
    const { id } = use(params);
    const eventData = useQuery(api.adminEvents.getEventWithStats, {
        eventId: id,
    });
    const adminCheck = useQuery(api.admin.isAdmin);
    const updateStatus = useMutation(api.adminEvents.updateEventStatus);
    const superAdminEdit = useMutation(api.adminEvents.superAdminEditEvent);

    const [activeTab, setActiveTab] = useState("details");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [editReason, setEditReason] = useState("");
    const [editLoading, setEditLoading] = useState(false);
    const [statusAction, setStatusAction] = useState(null); // { action, reason }
    const [statusReason, setStatusReason] = useState("");
    const [statusLoading, setStatusLoading] = useState(false);

    if (!eventData) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
        );
    }

    const isSuperAdmin = adminCheck?.isSuperAdmin;

    const startEditing = () => {
        setEditData({
            startDate: new Date(eventData.startDate).toISOString().slice(0, 16),
            endDate: new Date(eventData.endDate).toISOString().slice(0, 16),
            title: eventData.title,
            capacity: eventData.capacity,
            status: eventData.status || eventData.effectiveStatus,
        });
        setEditReason("");
        setIsEditing(true);
    };

    const saveEdit = async () => {
        setEditLoading(true);
        try {
            await superAdminEdit({
                eventId: id,
                startDate: new Date(editData.startDate).getTime(),
                endDate: new Date(editData.endDate).getTime(),
                title: editData.title,
                capacity: Number(editData.capacity),
                status: editData.status,
                reason: editReason || undefined,
            });
            toast.success("Event updated successfully");
            setIsEditing(false);
        } catch (err) {
            toast.error(err.message || "Failed to update event");
        } finally {
            setEditLoading(false);
        }
    };

    const handleStatusAction = async () => {
        if (!statusAction) return;
        if (statusAction === "cancelled" && !statusReason.trim()) {
            toast.error("Please provide a reason for cancellation");
            return;
        }
        setStatusLoading(true);
        try {
            await updateStatus({
                eventId: id,
                status: statusAction,
                reason: statusReason || undefined,
            });
            toast.success(
                `Event ${statusAction === "approved" ? "approved" : statusAction === "cancelled" ? "cancelled" : "updated"}`
            );
            setStatusAction(null);
            setStatusReason("");
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        } finally {
            setStatusLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === 0) return "Free";
        return `₹${amount.toLocaleString("en-IN")}`;
    };

    const tabs = [
        { id: "details", label: "Details", icon: Calendar },
        { id: "registrations", label: "Registrations", icon: Users },
        { id: "activity", label: "Activity Log", icon: History },
    ];

    return (
        <div className="space-y-6">
            {/* Back + Header */}
            <div>
                <Link
                    href="/admin/events"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                </Link>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {eventData.title}
                            </h1>
                            <p className="text-sm text-gray-400 mt-0.5 capitalize">
                                {eventData.category} • by {eventData.organizerName}
                            </p>
                        </div>
                        <StatusBadge status={eventData.effectiveStatus} large />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {isSuperAdmin && (
                            <button
                                onClick={startEditing}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-colors border border-purple-500/30"
                            >
                                <Shield className="w-4 h-4" />
                                <Edit3 className="w-4 h-4" /> SuperAdmin Edit
                            </button>
                        )}
                        {eventData.effectiveStatus === "pending" && (
                            <button
                                onClick={() => setStatusAction("approved")}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Approve
                            </button>
                        )}
                        {eventData.effectiveStatus !== "cancelled" && (
                            <button
                                onClick={() => setStatusAction("cancelled")}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors border border-red-500/30"
                            >
                                <XCircle className="w-4 h-4" /> Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    label="Registrations"
                    value={eventData.stats.totalRegistrations}
                    color="text-blue-400"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Checked In"
                    value={eventData.stats.totalCheckedIn}
                    color="text-emerald-400"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Revenue"
                    value={formatCurrency(eventData.stats.revenue)}
                    color="text-amber-400"
                />
                <StatCard
                    icon={Zap}
                    label="Attendance Rate"
                    value={`${eventData.stats.attendanceRate}%`}
                    color="text-purple-400"
                />
            </div>

            {/* SuperAdmin Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 m-4">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-purple-400" />
                                <h2 className="text-lg font-bold text-white">
                                    SuperAdmin Edit
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) =>
                                        setEditData({ ...editData, title: e.target.value })
                                    }
                                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">
                                        Start Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={editData.startDate}
                                        onChange={(e) =>
                                            setEditData({ ...editData, startDate: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">
                                        End Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={editData.endDate}
                                        onChange={(e) =>
                                            setEditData({ ...editData, endDate: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">
                                        Capacity
                                    </label>
                                    <input
                                        type="number"
                                        value={editData.capacity}
                                        onChange={(e) =>
                                            setEditData({ ...editData, capacity: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">
                                        Status Override
                                    </label>
                                    <select
                                        value={editData.status}
                                        onChange={(e) =>
                                            setEditData({ ...editData, status: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 appearance-none"
                                    >
                                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                            <option key={key} value={key}>
                                                {cfg.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">
                                    Reason for Change{" "}
                                    <span className="text-gray-600">(optional)</span>
                                </label>
                                <textarea
                                    value={editReason}
                                    onChange={(e) => setEditReason(e.target.value)}
                                    rows={2}
                                    placeholder="Why are you making this change?"
                                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 placeholder-gray-600 resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>
                                    All changes will be recorded in the event audit log.
                                </span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveEdit}
                                    disabled={editLoading}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-colors disabled:opacity-50"
                                >
                                    {editLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Action Confirmation */}
            {statusAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 m-4">
                        <h2 className="text-lg font-bold text-white mb-2">
                            {statusAction === "approved" ? "Approve Event" : "Cancel Event"}
                        </h2>
                        <p className="text-sm text-gray-400 mb-4">
                            {statusAction === "approved"
                                ? `Are you sure you want to approve "${eventData.title}"?`
                                : `Are you sure you want to cancel "${eventData.title}"? This action requires a reason.`}
                        </p>
                        {statusAction === "cancelled" && (
                            <textarea
                                value={statusReason}
                                onChange={(e) => setStatusReason(e.target.value)}
                                rows={3}
                                placeholder="Reason for cancellation (required)..."
                                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 placeholder-gray-600 resize-none mb-4"
                            />
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setStatusAction(null);
                                    setStatusReason("");
                                }}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleStatusAction}
                                disabled={statusLoading}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50",
                                    statusAction === "approved"
                                        ? "bg-emerald-600 text-white hover:bg-emerald-500"
                                        : "bg-red-600 text-white hover:bg-red-500"
                                )}
                            >
                                {statusLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : statusAction === "approved" ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" /> Approve
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4" /> Cancel Event
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-800">
                <div className="flex gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                                activeTab === tab.id
                                    ? "border-purple-500 text-purple-400"
                                    : "border-transparent text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.id === "registrations" && (
                                <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded-full">
                                    {eventData.stats.totalRegistrations}
                                </span>
                            )}
                            {tab.id === "activity" && eventData.auditLog.length > 0 && (
                                <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded-full">
                                    {eventData.auditLog.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Info */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                            Event Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-300">
                                        {format(new Date(eventData.startDate), "PPP p")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        to {format(new Date(eventData.endDate), "PPP p")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-300 capitalize">
                                        {eventData.locationType === "online"
                                            ? "Online Event"
                                            : eventData.venue || "Physical Venue"}
                                    </p>
                                    {eventData.address && (
                                        <p className="text-xs text-gray-500">{eventData.address}</p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        {eventData.city}
                                        {eventData.state ? `, ${eventData.state}` : ""},{" "}
                                        {eventData.country}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-300">{eventData.timezone}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-300">
                                    Capacity: {eventData.capacity} ({eventData.registrationCount}{" "}
                                    registered)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Info */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                            Ticket & Revenue
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Ticket className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-300 capitalize">
                                    {eventData.ticketType} Event
                                    {eventData.ticketPrice
                                        ? ` — ₹${eventData.ticketPrice}`
                                        : ""}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-300">
                                    Total Revenue: {formatCurrency(eventData.stats.revenue)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-300">
                                    Organizer: {eventData.organizerName}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pt-3 border-t border-gray-800">
                            <h4 className="text-xs text-gray-500 mb-2">Description</h4>
                            <p className="text-sm text-gray-400 leading-relaxed line-clamp-6">
                                {eventData.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "registrations" && (
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
                    {eventData.registrations.length === 0 ? (
                        <div className="px-4 py-16 text-center">
                            <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No registrations yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Attendee
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Registered
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Check-in
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {eventData.registrations.map((reg) => (
                                        <tr
                                            key={reg._id}
                                            className="hover:bg-gray-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                        <User className="w-3.5 h-3.5 text-purple-400" />
                                                    </div>
                                                    <span className="text-sm text-white">
                                                        {reg.attendeeName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-400">
                                                    {reg.attendeeEmail}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-400">
                                                    {format(new Date(reg.registeredAt), "MMM d, yyyy")}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {reg.checkedIn ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        {reg.checkedInAt
                                                            ? format(new Date(reg.checkedInAt), "h:mm a")
                                                            : "Yes"}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-600">
                                                        Not checked in
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "activity" && (
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
                    {eventData.auditLog.length === 0 ? (
                        <div className="text-center py-12">
                            <History className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No activity recorded yet</p>
                            <p className="text-gray-600 text-xs mt-1">
                                Changes made by admins will appear here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {eventData.auditLog.map((entry, i) => (
                                <div key={entry._id} className="relative pl-8 pb-6">
                                    {/* Timeline line */}
                                    {i < eventData.auditLog.length - 1 && (
                                        <div className="absolute left-3 top-6 bottom-0 w-px bg-gray-800" />
                                    )}
                                    {/* Timeline dot */}
                                    <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-purple-500/40 border-2 border-purple-500" />

                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-white">
                                                {entry.userName}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {format(new Date(entry.timestamp), "MMM d, yyyy 'at' h:mm a")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            <span className="capitalize">
                                                {entry.action.replace(/_/g, " ")}
                                            </span>
                                            {entry.field && (
                                                <>
                                                    {" "}
                                                    on{" "}
                                                    <span className="text-purple-400 font-medium">
                                                        {entry.field}
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                        {(entry.oldValue || entry.newValue) && (
                                            <div className="mt-1.5 flex items-center gap-2 text-xs">
                                                {entry.oldValue && (
                                                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 line-through">
                                                        {entry.oldValue.length > 50
                                                            ? entry.oldValue.slice(0, 50) + "..."
                                                            : entry.oldValue}
                                                    </span>
                                                )}
                                                {entry.oldValue && entry.newValue && (
                                                    <span className="text-gray-600">→</span>
                                                )}
                                                {entry.newValue && (
                                                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        {entry.newValue.length > 50
                                                            ? entry.newValue.slice(0, 50) + "..."
                                                            : entry.newValue}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {entry.reason && (
                                            <p className="text-xs text-gray-500 mt-1 italic">
                                                Reason: {entry.reason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
