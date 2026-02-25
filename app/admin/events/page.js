"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    Search,
    Filter,
    Calendar,
    Users,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Eye,
    Trash2,
    Zap,
    Clock,
    CheckCheck,
    Ban,
    FileEdit,
    Loader2,
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

const CATEGORIES = [
    "all",
    "conference",
    "workshop",
    "seminar",
    "networking",
    "social",
    "sports",
    "cultural",
    "academic",
    "other",
];

const PAGE_SIZE = 15;

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.approved;
    const Icon = config.icon;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                config.color
            )}
        >
            {config.pulse && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
            )}
            {!config.pulse && <Icon className="w-3 h-3" />}
            {config.label}
        </span>
    );
}

export default function EventsAdminPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortField, setSortField] = useState("startDate");
    const [sortDir, setSortDir] = useState("desc");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(0);
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    // Debounce search
    const searchTimerRef = React.useRef(null);
    const handleSearch = (value) => {
        setSearchTerm(value);
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
            setDebouncedSearch(value);
            setCurrentPage(0);
        }, 300);
    };

    const events = useQuery(api.adminEvents.getAllEvents, {
        searchTerm: debouncedSearch || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
    });

    const adminCheck = useQuery(api.admin.isAdmin);
    const updateStatus = useMutation(api.adminEvents.updateEventStatus);
    const bulkUpdate = useMutation(api.adminEvents.bulkUpdateEventStatus);

    // Client-side sort
    const sortedEvents = useMemo(() => {
        if (!events) return [];
        return [...events].sort((a, b) => {
            let aVal, bVal;
            switch (sortField) {
                case "title":
                    aVal = a.title.toLowerCase();
                    bVal = b.title.toLowerCase();
                    return sortDir === "asc"
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                case "startDate":
                    return sortDir === "asc"
                        ? a.startDate - b.startDate
                        : b.startDate - a.startDate;
                case "registrations":
                    return sortDir === "asc"
                        ? a.totalRegistrations - b.totalRegistrations
                        : b.totalRegistrations - a.totalRegistrations;
                case "revenue":
                    return sortDir === "asc"
                        ? a.revenue - b.revenue
                        : b.revenue - a.revenue;
                default:
                    return b.startDate - a.startDate;
            }
        });
    }, [events, sortField, sortDir]);

    // Pagination
    const totalPages = Math.ceil(sortedEvents.length / PAGE_SIZE);
    const pagedEvents = sortedEvents.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );

    // Summary stats
    const stats = useMemo(() => {
        if (!events) return { total: 0, live: 0, pending: 0, completed: 0 };
        return {
            total: events.length,
            live: events.filter((e) => e.effectiveStatus === "live").length,
            pending: events.filter((e) => e.effectiveStatus === "pending").length,
            completed: events.filter((e) => e.effectiveStatus === "completed").length,
        };
    }, [events]);

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir("desc");
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === pagedEvents.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(pagedEvents.map((e) => e._id)));
        }
    };

    const handleQuickAction = async (eventId, action) => {
        setActionMenuOpen(null);
        try {
            if (action === "approve") {
                await updateStatus({ eventId, status: "approved" });
                toast.success("Event approved");
            } else if (action === "cancel") {
                await updateStatus({
                    eventId,
                    status: "cancelled",
                    reason: "Cancelled by admin",
                });
                toast.success("Event cancelled");
            }
        } catch (err) {
            toast.error(err.message || "Action failed");
        }
    };

    const handleBulkAction = async (status) => {
        if (selectedIds.size === 0) return;
        setBulkActionLoading(true);
        try {
            await bulkUpdate({
                eventIds: Array.from(selectedIds),
                status,
                reason: status === "cancelled" ? "Bulk cancelled by admin" : undefined,
            });
            toast.success(`${selectedIds.size} events updated`);
            setSelectedIds(new Set());
        } catch (err) {
            toast.error(err.message || "Bulk action failed");
        } finally {
            setBulkActionLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === 0) return "Free";
        return `₹${amount.toLocaleString("en-IN")}`;
    };

    const SortHeader = ({ field, children }) => (
        <button
            onClick={() => toggleSort(field)}
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors group"
        >
            {children}
            <span
                className={cn(
                    "transition-opacity",
                    sortField === field ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                )}
            >
                {sortDir === "asc" ? "↑" : "↓"}
            </span>
        </button>
    );

    if (!events) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Events Management</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Manage, approve, and monitor all platform events
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        label: "Total Events",
                        value: stats.total,
                        icon: Calendar,
                        color: "text-blue-400",
                        bg: "bg-blue-500/10 border-blue-500/20",
                    },
                    {
                        label: "Live Now",
                        value: stats.live,
                        icon: Zap,
                        color: "text-emerald-400",
                        bg: "bg-emerald-500/10 border-emerald-500/20",
                    },
                    {
                        label: "Pending Approval",
                        value: stats.pending,
                        icon: Clock,
                        color: "text-amber-400",
                        bg: "bg-amber-500/10 border-amber-500/20",
                    },
                    {
                        label: "Completed",
                        value: stats.completed,
                        icon: CheckCheck,
                        color: "text-purple-400",
                        bg: "bg-purple-500/10 border-purple-500/20",
                    },
                ].map((card) => (
                    <div
                        key={card.label}
                        className={cn(
                            "rounded-xl border px-4 py-3 backdrop-blur-sm",
                            card.bg
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400">{card.label}</p>
                                <p className={cn("text-2xl font-bold mt-1", card.color)}>
                                    {card.value}
                                </p>
                            </div>
                            <card.icon className={cn("w-8 h-8 opacity-50", card.color)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search events by name..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900/60 border border-gray-800 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="px-3 py-2.5 rounded-lg bg-gray-900/60 border border-gray-800 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 appearance-none cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <option key={key} value={key}>
                                {cfg.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="px-3 py-2.5 rounded-lg bg-gray-900/60 border border-gray-800 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 appearance-none cursor-pointer"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3 animate-in slide-in-from-top-2">
                    <span className="text-sm text-purple-300 font-medium">
                        {selectedIds.size} selected
                    </span>
                    <div className="flex gap-2 ml-auto">
                        <button
                            onClick={() => handleBulkAction("approved")}
                            disabled={bulkActionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors border border-emerald-500/30 disabled:opacity-50"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                            onClick={() => handleBulkAction("cancelled")}
                            disabled={bulkActionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors border border-red-500/30 disabled:opacity-50"
                        >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-3 py-1.5 rounded-lg text-gray-400 text-xs font-medium hover:text-white transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={
                                            pagedEvents.length > 0 &&
                                            selectedIds.size === pagedEvents.length
                                        }
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500/40"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <SortHeader field="title">Event</SortHeader>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <SortHeader field="startDate">Dates</SortHeader>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Status
                                    </span>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Organizer
                                    </span>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <SortHeader field="registrations">Reg.</SortHeader>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <SortHeader field="revenue">Revenue</SortHeader>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {pagedEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-16 text-center">
                                        <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                                        <p className="text-gray-500 text-sm">No events found</p>
                                        <p className="text-gray-600 text-xs mt-1">
                                            Try adjusting your search or filters
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                pagedEvents.map((event) => (
                                    <tr
                                        key={event._id}
                                        className={cn(
                                            "hover:bg-gray-800/30 transition-colors group",
                                            selectedIds.has(event._id) && "bg-purple-500/5"
                                        )}
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(event._id)}
                                                onChange={() => toggleSelect(event._id)}
                                                className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500/40"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/events/${event._id}`}
                                                className="group/link"
                                            >
                                                <p className="text-sm font-medium text-white group-hover/link:text-purple-400 transition-colors line-clamp-1">
                                                    {event.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 capitalize">
                                                    {event.category}
                                                </p>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-gray-300">
                                                {format(new Date(event.startDate), "MMM d")}
                                                {event.startDate !== event.endDate &&
                                                    ` – ${format(new Date(event.endDate), "MMM d")}`}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {format(new Date(event.startDate), "yyyy")}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={event.effectiveStatus} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-gray-400 line-clamp-1">
                                                {event.organizerName}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-gray-500" />
                                                <span className="text-sm text-gray-300">
                                                    {event.totalRegistrations}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-300">
                                                {formatCurrency(event.revenue)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActionMenuOpen(
                                                            actionMenuOpen === event._id ? null : event._id
                                                        );
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {actionMenuOpen === event._id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={() => setActionMenuOpen(null)}
                                                        />
                                                        <div className="absolute right-0 top-8 z-50 w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-1.5 animate-in fade-in zoom-in-95">
                                                            <Link
                                                                href={`/admin/events/${event._id}`}
                                                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                                                                onClick={() => setActionMenuOpen(null)}
                                                            >
                                                                <Eye className="w-4 h-4" /> View Details
                                                            </Link>
                                                            {event.effectiveStatus === "pending" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleQuickAction(event._id, "approve")
                                                                    }
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:bg-gray-800 transition-colors w-full text-left"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4" /> Approve
                                                                </button>
                                                            )}
                                                            {event.effectiveStatus !== "cancelled" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleQuickAction(event._id, "cancel")
                                                                    }
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors w-full text-left"
                                                                >
                                                                    <XCircle className="w-4 h-4" /> Cancel Event
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
                        <p className="text-xs text-gray-500">
                            Showing {currentPage * PAGE_SIZE + 1}–
                            {Math.min((currentPage + 1) * PAGE_SIZE, sortedEvents.length)} of{" "}
                            {sortedEvents.length}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                                className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={cn(
                                        "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                                        i === currentPage
                                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                            : "text-gray-500 hover:text-white hover:bg-gray-800"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                                }
                                disabled={currentPage === totalPages - 1}
                                className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
