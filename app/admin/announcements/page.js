"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";
import { format } from "date-fns";
import {
    Megaphone,
    Plus,
    Trash2,
    Users,
    Shield,
    GraduationCap,
    Calendar,
    Send,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PRIORITY_CONFIG = {
    low: { label: "Low", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    normal: { label: "Normal", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    high: { label: "High", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    urgent: { label: "Urgent", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const TARGET_CONFIG = {
    all: { label: "All Users", icon: Users },
    organisers: { label: "Organisers Only", icon: Shield },
    students: { label: "Students Only", icon: GraduationCap },
    event_attendees: { label: "Event Attendees", icon: Calendar },
};

function ComposerModal({ open, onClose, events }) {
    const createAnnouncement = useMutation(api.announcements.createAnnouncement);
    const [form, setForm] = useState({
        title: "",
        message: "",
        targetType: "all",
        targetEventId: "",
        priority: "normal",
    });
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.title.trim() || !form.message.trim()) {
            toast.error("Please fill in title and message");
            return;
        }

        setLoading(true);
        try {
            await createAnnouncement({
                title: form.title.trim(),
                message: form.message.trim(),
                targetType: form.targetType,
                targetEventId: form.targetType === "event_attendees" && form.targetEventId ? form.targetEventId : undefined,
                priority: form.priority,
            });
            toast.success("Announcement created successfully");
            setForm({ title: "", message: "", targetType: "all", targetEventId: "", priority: "normal" });
            onClose();
        } catch (e) {
            toast.error(e.message || "Failed to create announcement");
        }
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0c1222] border border-white/[0.06] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Send className="w-5 h-5 text-blue-400" />
                        New Announcement
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            placeholder="Announcement title..."
                            className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">Message</label>
                        <textarea
                            value={form.message}
                            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                            placeholder="Write your announcement..."
                            rows={4}
                            className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">Target Audience</label>
                            <select
                                value={form.targetType}
                                onChange={(e) => setForm((f) => ({ ...f, targetType: e.target.value }))}
                                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Users</option>
                                <option value="organisers">Organisers Only</option>
                                <option value="students">Students Only</option>
                                <option value="event_attendees">Event Attendees</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">Priority</label>
                            <select
                                value={form.priority}
                                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    {form.targetType === "event_attendees" && events && (
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">Select Event</label>
                            <select
                                value={form.targetEventId}
                                onChange={(e) => setForm((f) => ({ ...f, targetEventId: e.target.value }))}
                                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Choose event...</option>
                                {events.map((ev) => (
                                    <option key={ev._id} value={ev._id}>{ev.title}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-gray-400">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? "Creating..." : "Create Announcement"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AnnouncementsAdminPage() {
    const adminCheck = useQuery(api.admin.isAdmin);
    const isAdmin = adminCheck?.canAccessAdminPanel === true;
    const announcements = useQuery(api.announcements.getAnnouncements, isAdmin ? undefined : "skip");
    const eventList = useQuery(api.adminAnalytics.getEventList, isAdmin ? {} : "skip");
    const deleteAnnouncement = useMutation(api.announcements.deleteAnnouncement);

    const [composerOpen, setComposerOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [mountedAt] = useState(() => Date.now());

    const thisWeekCount = useMemo(() => {
        const weekWindowMs = 7 * 24 * 60 * 60 * 1000;
        return announcements
            ? announcements.filter((a) => a.createdAt > mountedAt - weekWindowMs).length
            : 0;
    }, [announcements, mountedAt]);

    async function handleDelete(id) {
        if (!confirm("Delete this announcement?")) return;
        setDeleteLoading(id);
        try {
            await deleteAnnouncement({ announcementId: id });
            toast.success("Announcement deleted");
        } catch (e) {
            toast.error(e.message || "Failed to delete");
        }
        setDeleteLoading(null);
    }

    if (announcements === undefined) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Announcements</h1>
                <p className="text-gray-400 text-sm mb-8">Create and manage platform announcements</p>
                <div className="flex justify-center py-20">
                    <BarLoader width={200} color="#0288D1" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Announcements</h1>
                    <p className="text-gray-400 text-sm mt-1">Create and manage platform announcements</p>
                </div>
                <Button
                    onClick={() => setComposerOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Total</p>
                    <p className="text-2xl font-bold text-white mt-1">{announcements.length}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-red-600/5 border border-red-500/30 rounded-xl p-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Urgent</p>
                    <p className="text-2xl font-bold text-white mt-1">{announcements.filter((a) => a.priority === "urgent").length}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/30 rounded-xl p-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">High</p>
                    <p className="text-2xl font-bold text-white mt-1">{announcements.filter((a) => a.priority === "high").length}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">This Week</p>
                    <p className="text-2xl font-bold text-white mt-1">{thisWeekCount}</p>
                </div>
            </div>

            {/* Announcements list */}
            {announcements.length === 0 ? (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-12 text-center">
                    <Megaphone className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No announcements yet</p>
                    <p className="text-gray-600 text-sm mt-1">Create your first announcement to reach platform users</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {announcements.map((announcement) => {
                        const priorityCfg = PRIORITY_CONFIG[announcement.priority] || PRIORITY_CONFIG.normal;
                        const targetCfg = TARGET_CONFIG[announcement.targetType] || TARGET_CONFIG.all;
                        const TargetIcon = targetCfg.icon;

                        return (
                            <div
                                key={announcement._id}
                                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h3 className="text-white font-semibold">{announcement.title}</h3>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityCfg.color}`}>
                                                {priorityCfg.label}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/[0.06] text-gray-400 border border-white/[0.08]">
                                                <TargetIcon className="w-3 h-3" />
                                                {targetCfg.label}
                                                {announcement.targetEventTitle && `: ${announcement.targetEventTitle}`}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">{announcement.message}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                            <span>By {announcement.creatorName}</span>
                                            <span>{format(new Date(announcement.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(announcement._id)}
                                        disabled={deleteLoading === announcement._id}
                                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ComposerModal
                open={composerOpen}
                onClose={() => setComposerOpen(false)}
                events={eventList || []}
            />
        </div>
    );
}
