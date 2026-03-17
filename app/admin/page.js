"use client";

import React, { useState } from "react";
import { BarLoader } from "react-spinners";
import {
    Calendar, ClipboardList, DollarSign, TrendingUp,
    Users, Zap, Plus, X, ArrowUpRight, Circle,
    Loader2, CalendarIcon, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMockAuth } from "@/components/convex-client-provider";

// Create Event form deps
import { useState as useFormState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { State, City } from "country-state-city";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UnsplashImagePicker from "@/components/unsplash-image-picker";
import { CATEGORIES } from "@/lib/data";
import Image from "next/image";

const isBackendEnabled = Boolean(
    process.env.NEXT_PUBLIC_CONVEX_URL && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

// ─── Create Event Form (embedded in drawer) ──────────────────
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    category: z.string().min(1, "Please select a category"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    startTime: z.string().regex(timeRegex, "HH:MM"),
    endTime: z.string().regex(timeRegex, "HH:MM"),
    locationType: z.enum(["physical", "online"]).default("physical"),
    venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    capacity: z.number().min(1),
    ticketType: z.enum(["free", "paid"]).default("free"),
    ticketPrice: z.number().optional(),
    coverImage: z.string().optional(),
    themeColor: z.string().default("#1e3a8a"),
}).superRefine((data, ctx) => {
    if (data.locationType === "physical" && !data.city)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required", path: ["city"] });
    if (data.locationType === "online" && !data.venue)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Meeting link required", path: ["venue"] });
    if (data.ticketType === "paid" && (!data.ticketPrice || data.ticketPrice <= 0))
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid price", path: ["ticketPrice"] });
});

function CreateEventForm({ onClose }) {
    const router = useRouter();
    const [showImagePicker, setShowImagePicker] = useState(false);
    const { has } = useAuth();
    const hasPro = has?.({ plan: "pro" });
    const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
    const { mutate: createEvent, isLoading } = useConvexMutation(api.events.createEvent);

    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            locationType: "physical", ticketType: "free",
            capacity: 50, themeColor: "#1e3a8a",
            category: "", state: "", city: "", startTime: "", endTime: "",
        },
    });

    const ticketType = watch("ticketType");
    const locationType = watch("locationType");
    const selectedState = watch("state");
    const startDate = watch("startDate");
    const endDate = watch("endDate");
    const coverImage = watch("coverImage");

    const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);
    const cities = useMemo(() => {
        if (!selectedState) return [];
        const st = indianStates.find((s) => s.name === selectedState);
        return st ? City.getCitiesOfState("IN", st.isoCode) : [];
    }, [selectedState, indianStates]);

    const combineDateTime = (date, time) => {
        if (!date || !time) return null;
        const [hh, mm] = time.split(":").map(Number);
        const d = new Date(date);
        d.setHours(hh, mm, 0, 0);
        return d;
    };

    const onSubmit = async (data) => {
        try {
            const start = combineDateTime(data.startDate, data.startTime);
            const end = combineDateTime(data.endDate, data.endTime);
            if (!start || !end) { toast.error("Select date + time for start and end."); return; }
            if (end <= start) { toast.error("End must be after start."); return; }
            await createEvent({
                title: data.title, description: data.description, category: data.category,
                tags: [data.category], startDate: start.getTime(), endDate: end.getTime(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                locationType: data.locationType, venue: data.venue || undefined,
                address: data.address || undefined, city: data.city || "Online",
                state: data.state || undefined, country: "India",
                capacity: data.capacity, ticketType: data.ticketType,
                ticketPrice: data.ticketPrice || undefined,
                coverImage: data.coverImage || undefined, themeColor: data.themeColor, hasPro,
            });
            toast.success("Event created!");
            onClose();
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Failed to create event");
        }
    };

    const inputCls = "h-10 bg-white/5 border-white/10 text-white text-sm placeholder:text-gray-600 focus:border-white/30 focus:ring-0";
    const labelCls = "text-xs text-gray-400 font-medium";

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
                <div>
                    <h2 className="text-base font-semibold text-white">Create New Event</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Fill details to publish your event</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Cover image */}
                <div>
                    <Label className={labelCls}>Cover Image</Label>
                    <div
                        className="mt-1.5 h-32 rounded-xl border border-white/10 bg-white/3 flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors overflow-hidden"
                        onClick={() => setShowImagePicker(true)}
                    >
                        {coverImage
                            ? <Image src={coverImage} alt="Cover" className="w-full h-full object-cover" width={400} height={128} />
                            : <span className="text-xs text-gray-500">Click to choose cover image</span>
                        }
                    </div>
                </div>

                <form id="create-event-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Basic */}
                    <div className="space-y-3">
                        <div>
                            <Label className={labelCls}>Event Title</Label>
                            <Input {...register("title")} placeholder="Event name" className={`mt-1.5 ${inputCls}`} />
                            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
                        </div>
                        <div>
                            <Label className={labelCls}>Category</Label>
                            <Controller control={control} name="category" render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className={`mt-1.5 w-full ${inputCls}`}><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>{CATEGORIES.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.label}</SelectItem>)}</SelectContent>
                                </Select>
                            )} />
                            {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>}
                        </div>
                        <div>
                            <Label className={labelCls}>Description</Label>
                            <Textarea {...register("description")} placeholder="Tell attendees what this is about" rows={3} className={`mt-1.5 bg-white/5 border-white/10 text-white text-sm placeholder:text-gray-600`} />
                            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div>
                        <Label className={`${labelCls} mb-2 block`}>Schedule</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Start", dateKey: "startDate", timeKey: "startTime", val: startDate, disabled: undefined },
                                { label: "End", dateKey: "endDate", timeKey: "endTime", val: endDate, disabled: (d) => d < (startDate || new Date()) },
                            ].map(({ label, dateKey, timeKey, val, disabled }) => (
                                <div key={dateKey} className="space-y-1.5">
                                    <p className="text-[11px] text-gray-500">{label}</p>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={`w-full justify-between ${inputCls} h-10`}>
                                                {val ? format(val, "MMM d, y") : "Pick date"}
                                                <CalendarIcon className="w-3.5 h-3.5 opacity-40" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <CalendarPicker mode="single" selected={val} onSelect={(d) => setValue(dateKey, d)} disabled={disabled} />
                                        </PopoverContent>
                                    </Popover>
                                    <Input type="time" {...register(timeKey)} className={inputCls} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Capacity & Tickets */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label className={labelCls}>Capacity</Label>
                            <Input type="number" {...register("capacity", { valueAsNumber: true })} placeholder="100" className={`mt-1.5 ${inputCls}`} />
                        </div>
                        <div>
                            <Label className={labelCls}>Ticket Type</Label>
                            <div className={`mt-1.5 flex h-10 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2`}>
                                {["free", "paid"].map(t => (
                                    <label key={t} className={`px-3 py-1 rounded-md text-xs cursor-pointer capitalize ${ticketType === t ? "bg-white/20 text-white" : "text-gray-400"}`}>
                                        <input type="radio" value={t} {...register("ticketType")} className="sr-only" />{t}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    {ticketType === "paid" && (
                        <div>
                            <Label className={labelCls}>Price (INR)</Label>
                            <Input type="number" placeholder="Ticket price" {...register("ticketPrice", { valueAsNumber: true })} className={`mt-1.5 ${inputCls}`} />
                        </div>
                    )}

                    {/* Location type */}
                    <div>
                        <Label className={`${labelCls} mb-2 block`}>Location</Label>
                        <div className="flex gap-2 mb-3">
                            {["physical", "online"].map(t => (
                                <label key={t} className={`px-4 py-1.5 rounded-full border text-xs cursor-pointer capitalize transition-colors ${locationType === t ? "bg-white/15 border-white/30 text-white" : "bg-white/5 border-white/10 text-gray-400"}`}>
                                    <input type="radio" value={t} {...register("locationType")} className="sr-only" />{t}
                                </label>
                            ))}
                        </div>
                        {locationType === "physical" ? (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <Controller control={control} name="state" render={({ field }) => (
                                        <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue("city", ""); }}>
                                            <SelectTrigger className={`w-full ${inputCls}`}><SelectValue placeholder="State" /></SelectTrigger>
                                            <SelectContent>{indianStates.map(s => <SelectItem key={s.isoCode} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    )} />
                                    <Controller control={control} name="city" render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange} disabled={!selectedState}>
                                            <SelectTrigger className={`w-full ${inputCls}`}><SelectValue placeholder={selectedState ? "City" : "Select state first"} /></SelectTrigger>
                                            <SelectContent>{cities.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    )} />
                                </div>
                                <Input {...register("address")} placeholder="Address / venue" className={inputCls} />
                            </div>
                        ) : (
                            <Input {...register("venue")} placeholder="Meeting link (Zoom / Meet)" type="url" className={inputCls} />
                        )}
                    </div>
                </form>
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-4 border-t border-white/[0.06] shrink-0">
                <Button type="submit" form="create-event-form" disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-100 font-semibold text-sm h-10 rounded-lg">
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : "Create Event"}
                </Button>
            </div>

            {showImagePicker && (
                <UnsplashImagePicker isOpen={showImagePicker} onClose={() => setShowImagePicker(false)}
                    onSelect={(url) => { setValue("coverImage", url); setShowImagePicker(false); }} />
            )}
        </div>
    );
}

// ─── Shared Stat Card ─────────────────────────────────────────
function StatCard({ title, value, subtitle, icon: Icon, trend }) {
    return (
        <div className="bg-[#1a1a1a] border border-white/[0.07] rounded-xl p-5 hover:border-white/15 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">{title}</p>
                <Icon className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-[11px] text-gray-500 mt-1.5">{subtitle}</p>}
        </div>
    );
}

function EventRow({ event, isLive }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
            <div className="min-w-0 flex-1">
                <p className="text-sm text-white font-medium truncate">{event.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    {" – "}
                    {new Date(event.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    {" · "}
                    {event.registrationCount}/{event.capacity} registered
                </p>
            </div>
            <span className={`ml-4 shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full ${isLive ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>
                {isLive ? "LIVE" : "UPCOMING"}
            </span>
        </div>
    );
}

function DashboardUI({ stats, onCreateEvent }) {
    return (
        <div className="p-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-1">Manage events and platform activity</p>
                </div>
                <button
                    onClick={onCreateEvent}
                    className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Event
                </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Live Events" value={stats.liveEvents.length} subtitle={`${stats.upcomingEvents.length} upcoming`} icon={Zap} />
                <StatCard title="Registrations" value={stats.totalRegistrations.toLocaleString()} subtitle={`${stats.attendanceRate}% attendance`} icon={ClipboardList} />
                <StatCard title="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} subtitle={`₹${stats.monthlyRevenue.toLocaleString()} this month`} icon={DollarSign} />
                <StatCard title="Total Events" value={stats.totalEvents} subtitle={`${stats.totalCheckedIn} checked in`} icon={Calendar} />
            </div>

            {/* Events list */}
            <div className="grid lg:grid-cols-2 gap-5">
                <div className="bg-[#1a1a1a] border border-white/[0.07] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white">Live & Upcoming</h2>
                        <a href="/admin/events" className="text-[11px] text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                            View all <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>
                    <div>
                        {stats.liveEvents.map(e => <EventRow key={e._id} event={e} isLive={true} />)}
                        {stats.upcomingEvents.slice(0, 4).map(e => <EventRow key={e._id} event={e} isLive={false} />)}
                        {stats.liveEvents.length === 0 && stats.upcomingEvents.length === 0 && (
                            <p className="text-xs text-gray-600 py-6 text-center">No live or upcoming events</p>
                        )}
                    </div>
                </div>

                <div className="bg-[#1a1a1a] border border-white/[0.07] rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-white mb-4">Platform Overview</h2>
                    <div className="space-y-4">
                        {[
                            { label: "Attendance Rate", value: `${stats.attendanceRate}%`, pct: stats.attendanceRate, color: "bg-white" },
                            { label: "Events Active", value: `${stats.liveEvents.length + stats.upcomingEvents.length}/${stats.totalEvents}`, pct: Math.min(100, Math.round(((stats.liveEvents.length + stats.upcomingEvents.length) / Math.max(stats.totalEvents, 1)) * 100)), color: "bg-blue-500" },
                            { label: "Check-in Rate", value: `${Math.round((stats.totalCheckedIn / Math.max(stats.totalRegistrations, 1)) * 100)}%`, pct: Math.round((stats.totalCheckedIn / Math.max(stats.totalRegistrations, 1)) * 100), color: "bg-emerald-500" },
                        ].map(({ label, value, pct, color }) => (
                            <div key={label}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-500">{label}</span>
                                    <span className="text-white font-medium">{value}</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5">
                                    <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AccessDenied({ onSwitchRole, currentRole }) {
    return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="max-w-sm w-full bg-[#1a1a1a] border border-white/[0.07] rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
                    <span className="text-xl">🔒</span>
                </div>
                <h1 className="text-lg font-semibold text-white mb-2">Access Denied</h1>
                <p className="text-sm text-gray-500 mb-6">You need <span className="text-white">Organiser</span> role to access the Admin Dashboard.</p>
                {process.env.NODE_ENV === "development" && onSwitchRole && (
                    <div className="border border-white/10 rounded-xl p-4">
                        <p className="text-[10px] text-gray-600 mb-3 tracking-widest uppercase">Dev Role Switcher</p>
                        <div className="flex gap-2">
                            <button onClick={() => onSwitchRole("student")} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${currentRole === "student" ? "bg-white text-black" : "bg-white/10 text-gray-300 hover:bg-white/15"}`}>Student</button>
                            <button onClick={() => onSwitchRole("organiser")} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${currentRole === "organiser" ? "bg-white text-black" : "bg-white/10 text-gray-300 hover:bg-white/15"}`}>Organiser</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Create Event Slide Drawer ────────────────────────────────
function CreateEventDrawer({ open, onClose }) {
    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}
            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-[480px] max-w-full z-50 bg-[#111111] border-l border-white/[0.07] shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
                {open && <CreateEventForm onClose={onClose} />}
            </div>
        </>
    );
}

// ─── Convex version ───────────────────────────────────────────
function ConvexAdminDashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const adminCheck = useQuery(api.admin.isAdmin);
    const isAdmin = adminCheck?.canAccessAdminPanel === true;
    const stats = useQuery(api.admin.getDashboardStats, isAdmin ? {} : "skip");
    const setMyRole = useMutation(api.devSeed.setMyRole);

    const handleSwitchRole = async (role) => {
        try { await setMyRole({ role }); } catch (e) { console.error(e); }
    };

    if (adminCheck === undefined) return <div className="flex items-center justify-center h-64"><BarLoader width={160} color="#fff" /></div>;
    if (!isAdmin) return <AccessDenied onSwitchRole={handleSwitchRole} currentRole={adminCheck?.role} />;
    if (!stats) return <div className="flex items-center justify-center h-64"><BarLoader width={160} color="#fff" /></div>;

    return (
        <>
            <DashboardUI stats={stats} onCreateEvent={() => setDrawerOpen(true)} />
            <CreateEventDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}

// ─── Mock version ─────────────────────────────────────────────
function MockAdminDashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { adminCheck, setRole } = useMockAuth();
    const isAdmin = adminCheck?.canAccessAdminPanel === true;

    const mockStats = {
        liveEvents: [{ _id: "1", title: "Tech Fest 2026", startDate: Date.now(), endDate: Date.now() + 86400000, registrationCount: 120, capacity: 200 }],
        upcomingEvents: [{ _id: "2", title: "Cultural Night", startDate: Date.now() + 86400000 * 3, endDate: Date.now() + 86400000 * 4, registrationCount: 80, capacity: 150 }],
        totalRegistrations: 450, attendanceRate: 78, totalRevenue: 125000,
        monthlyRevenue: 42000, totalEvents: 12, totalCheckedIn: 351,
    };

    if (!isAdmin) return <AccessDenied onSwitchRole={setRole} currentRole={adminCheck?.role} />;

    return (
        <>
            <DashboardUI stats={mockStats} onCreateEvent={() => setDrawerOpen(true)} />
            <CreateEventDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}

export default function AdminDashboard() {
    if (isBackendEnabled) return <ConvexAdminDashboard />;
    return <MockAdminDashboard />;
}
