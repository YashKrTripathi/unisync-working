"use client";
/* eslint-disable react-hooks/incompatible-library */

import React, { useState } from "react";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import {
    Calendar, ClipboardList, DollarSign, TrendingUp,
    Users, Zap, Plus, X, ArrowUpRight, Circle,
    Loader2, CalendarIcon, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Create Event form deps
import { useState as useFormState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { State, City } from "country-state-city";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UnsplashImagePicker from "@/components/unsplash-image-picker";
import AIDescriptionButton from "@/components/ai-description-button";
import DateTimeField from "@/components/ui/date-time-field";
import { CATEGORIES } from "@/lib/data";
import Image from "next/image";

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
    venueScope: z.enum(["internal", "external"]).default("internal"),
    venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    externalReason: z.string().optional(),
    capacity: z.number().min(1),
    ticketType: z.enum(["free", "paid"]).default("free"),
    ticketPrice: z.number().optional(),
    coverImage: z.string().optional(),
    themeColor: z.string().default("#1e3a8a"),
}).superRefine((data, ctx) => {
    if (data.locationType === "physical" && data.venueScope === "external") {
        if (!data.state?.trim())
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "State is required", path: ["state"] });
        if (!data.city?.trim())
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required", path: ["city"] });
        if (!data.addressLine1?.trim())
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Address line 1 is required", path: ["addressLine1"] });
        if (!data.externalReason?.trim())
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Reason is required", path: ["externalReason"] });
    }
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
            locationType: "physical", venueScope: "internal", ticketType: "free",
            capacity: 50, themeColor: "#1e3a8a",
            category: "", addressLine1: "", addressLine2: "", city: "", state: "", startTime: "", endTime: "",
        },
    });

    const ticketType = watch("ticketType");
    const locationType = watch("locationType");
    const venueScope = watch("venueScope");
    const stateValue = watch("state") || "";
    const cityValue = watch("city") || "";
    const startDate = watch("startDate");
    const endDate = watch("endDate");
    const coverImage = watch("coverImage");

    const allStates = useMemo(() => State.getStatesOfCountry("IN"), []);
    const matchingStates = useMemo(() => {
        if (stateValue.trim().length < 3) return [];
        const query = stateValue.trim().toLowerCase();
        return allStates.filter((item) => item.name.toLowerCase().includes(query)).slice(0, 8);
    }, [allStates, stateValue]);
    const selectedState = useMemo(
        () => allStates.find((item) => item.name.toLowerCase() === stateValue.trim().toLowerCase()),
        [allStates, stateValue]
    );
    const allCitiesForState = useMemo(() => {
        if (!selectedState) return [];
        return City.getCitiesOfState("IN", selectedState.isoCode);
    }, [selectedState]);
    const matchingCities = useMemo(() => {
        if (!selectedState) return [];
        if (cityValue.trim().length === 0) return allCitiesForState.slice(0, 50);
        const query = cityValue.trim().toLowerCase();
        return allCitiesForState.filter((item) => item.name.toLowerCase().includes(query)).slice(0, 50);
    }, [allCitiesForState, cityValue, selectedState]);

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
                address: [data.addressLine1, data.addressLine2].filter(Boolean).join(", ") || undefined,
                city: data.locationType === "physical" ? (data.venueScope === "external" ? data.city : "Pune") : "Online",
                state: data.locationType === "physical" ? (data.venueScope === "external" ? data.state : "Maharashtra") : undefined,
                country: "India",
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
                            <div className="mt-0.5 flex items-center justify-between gap-3">
                                <Label className={labelCls}>Description</Label>
                                <AIDescriptionButton
                                    description={watch("description")}
                                    onApply={(value) =>
                                        setValue("description", value, {
                                            shouldDirty: true,
                                            shouldTouch: true,
                                            shouldValidate: true,
                                        })
                                    }
                                    className="h-8 px-3 text-[11px]"
                                />
                            </div>
                            <Textarea {...register("description")} placeholder="Tell attendees what this is about" rows={3} className={`mt-1.5 bg-white/5 border-white/10 text-white text-sm placeholder:text-gray-600`} />
                            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div>
                        <Label className={`${labelCls} mb-2 block`}>Schedule</Label>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1.5">
                                <p className="text-[11px] text-gray-500">Start</p>
                                <DateTimeField
                                    date={startDate}
                                    time={watch("startTime")}
                                    onDateChange={(date) => setValue("startDate", date, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                                    onTimeChange={(time) => setValue("startTime", time, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[11px] text-gray-500">End</p>
                                <DateTimeField
                                    date={endDate}
                                    time={watch("endTime")}
                                    onDateChange={(date) => setValue("endDate", date, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                                    onTimeChange={(time) => setValue("endTime", time, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                                    disabledDates={(date) => date < (startDate || new Date())}
                                />
                            </div>
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
                                <div className="flex gap-2">
                                    {[
                                        { value: "internal", label: "Inside Campus" },
                                        { value: "external", label: "External / Outing" },
                                    ].map((option) => (
                                        <label key={option.value} className={`px-4 py-1.5 rounded-full border text-xs cursor-pointer transition-colors ${venueScope === option.value ? "bg-white/15 border-white/30 text-white" : "bg-white/5 border-white/10 text-gray-400"}`}>
                                            <input type="radio" value={option.value} {...register("venueScope")} className="sr-only" />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>

                                {venueScope === "external" ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Input {...register("state")} list="drawer-state-options" placeholder="State" className={inputCls} />
                                                <datalist id="drawer-state-options">
                                                    {matchingStates.map((item) => <option key={item.isoCode} value={item.name} />)}
                                                </datalist>
                                                {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state.message}</p>}
                                            </div>
                                            <div>
                                                <Input {...register("city")} list="drawer-city-options" placeholder="City" className={inputCls} disabled={!selectedState} />
                                                <datalist id="drawer-city-options">
                                                    {matchingCities.map((item) => <option key={item.name} value={item.name} />)}
                                                </datalist>
                                                {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city.message}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <Input {...register("addressLine1")} placeholder="Address line 1" className={inputCls} />
                                            {errors.addressLine1 && <p className="text-xs text-red-400 mt-1">{errors.addressLine1.message}</p>}
                                        </div>
                                        <div>
                                            <Input {...register("addressLine2")} placeholder="Address line 2 (optional)" className={inputCls} />
                                        </div>
                                        <div>
                                            <Input {...register("venue")} placeholder="Google Maps link" type="url" className={inputCls} />
                                            {errors.venue && <p className="text-xs text-red-400 mt-1">{errors.venue.message}</p>}
                                        </div>
                                        <div>
                                            <Textarea {...register("externalReason")} placeholder="Reason for external event / outing approval context" rows={3} className={`bg-white/5 border-white/10 text-white text-sm placeholder:text-gray-600`} />
                                            {errors.externalReason && <p className="text-xs text-red-400 mt-1">{errors.externalReason.message}</p>}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Input {...register("addressLine1")} placeholder="Venue on campus, hall, auditorium, or room name" className={inputCls} />
                                        <Input {...register("venue")} placeholder="Google Maps link (optional)" type="url" className={inputCls} />
                                    </>
                                )}
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
                        <Link href="/admin/events" className="text-[11px] text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                            View all <ArrowUpRight className="w-3 h-3" />
                        </Link>
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

function AccessDenied({ currentRole }) {
    return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="max-w-sm w-full bg-[#1a1a1a] border border-white/[0.07] rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
                    <span className="text-xl">🔒</span>
                </div>
                <h1 className="text-lg font-semibold text-white mb-2">Access Denied</h1>
                <p className="text-sm text-gray-500 mb-6">You need <span className="text-white">Organiser</span> role to access the Admin Dashboard.</p>
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

    if (adminCheck === undefined) return <div className="flex items-center justify-center h-64"><BarLoader width={160} color="#fff" /></div>;
    if (!isAdmin) return <AccessDenied currentRole={adminCheck?.role} />;
    if (!stats) return <div className="flex items-center justify-center h-64"><BarLoader width={160} color="#fff" /></div>;

    return (
        <>
            <DashboardUI stats={stats} onCreateEvent={() => setDrawerOpen(true)} />
            <CreateEventDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}

export default function AdminDashboard() {
    return <ConvexAdminDashboard />;
}
