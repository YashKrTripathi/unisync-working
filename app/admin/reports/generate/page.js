"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import {
    ArrowLeft,
    FileText,
    FileDown,
    FileType,
    Loader2,
    Calendar,
    ChevronDown,
    Check,
    Info,
    Sparkles,
    Download,
    Plus,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GenerateReportPage() {
    const searchParams = useSearchParams();
    // ── State ───────────────────────────────────────────────────────────
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Auto-select event from URL query param
    useEffect(() => {
        const eventIdParam = searchParams.get("eventId");
        if (eventIdParam && !selectedEventId) {
            setSelectedEventId(eventIdParam);
        }
    }, [searchParams, selectedEventId]);
    const [generating, setGenerating] = useState(null); // "pdf" | "word" | null
    const [searchQuery, setSearchQuery] = useState("");

    // ── Extras form state ───────────────────────────────────────────────
    const [department, setDepartment] = useState("");
    const [coordinators, setCoordinators] = useState("");
    const [resourcePersons, setResourcePersons] = useState("");
    const [targetParticipants, setTargetParticipants] = useState("");
    const [objectives, setObjectives] = useState([""]);
    const [outcomes, setOutcomes] = useState([""]);
    const [briefReport, setBriefReport] = useState("");
    const [feedbackRating, setFeedbackRating] = useState("");
    const [feedbackBest, setFeedbackBest] = useState("");
    const [feedbackImprove, setFeedbackImprove] = useState("");

    // ── Convex queries ──────────────────────────────────────────────────
    const events = useQuery(api.eventReport.getEventsForReportSelector);
    const reportData = useQuery(
        api.eventReport.getEventReportData,
        selectedEventId ? { eventId: selectedEventId } : "skip"
    );

    // ── Derived ─────────────────────────────────────────────────────────
    const filteredEvents = useMemo(() => {
        if (!events) return [];
        if (!searchQuery) return events;
        return events.filter((e) =>
            e.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [events, searchQuery]);

    const selectedEvent = events?.find((e) => e._id === selectedEventId);

    // ── Build extras ────────────────────────────────────────────────────
    function buildExtras() {
        return {
            department: department || undefined,
            coordinators: coordinators || undefined,
            resourcePersons: resourcePersons || undefined,
            targetParticipants: targetParticipants || undefined,
            objectives: objectives.filter(Boolean),
            outcomes: outcomes.filter(Boolean),
            briefReport: briefReport || undefined,
            feedbackRating: feedbackRating || undefined,
            feedbackBest: feedbackBest || undefined,
            feedbackImprove: feedbackImprove || undefined,
        };
    }

    // ── Handlers ────────────────────────────────────────────────────────
    async function handleGeneratePDF() {
        if (!reportData) return;
        setGenerating("pdf");
        try {
            const { generateEventReportPDF } = await import("@/lib/generate-pdf-report");
            const doc = generateEventReportPDF(reportData, buildExtras());
            doc.save(
                `Event_Report_${reportData.event.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`
            );
            toast.success("PDF report downloaded successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate PDF report.");
        } finally {
            setGenerating(null);
        }
    }

    async function handleGenerateWord() {
        if (!reportData) return;
        setGenerating("word");
        try {
            const { generateEventReportWord } = await import("@/lib/generate-word-report");
            await generateEventReportWord(reportData, buildExtras());
            toast.success("Word report downloaded successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate Word report.");
        } finally {
            setGenerating(null);
        }
    }

    // ── Dynamic list helpers ─────────────────────────────────────────────
    function addListItem(setter) {
        setter((prev) => [...prev, ""]);
    }
    function updateListItem(setter, index, value) {
        setter((prev) => prev.map((item, i) => (i === index ? value : item)));
    }
    function removeListItem(setter, index) {
        setter((prev) => prev.filter((_, i) => i !== index));
    }

    // ── Render ──────────────────────────────────────────────────────────
    return (
        <div className="pb-12 max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
                href="/admin/reports"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Reports
            </Link>

            {/* Page Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Generate Event Report
                    </h1>
                    <p className="text-sm text-gray-400">
                        Auto-generate structured reports in PDF and Word format
                    </p>
                </div>
            </div>

            {/* ── Step 1: Select Event ─────────────────────────────────── */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">
                        1
                    </span>
                    Select Event
                </h2>
                <p className="text-xs text-gray-500 mb-4 ml-8">
                    Choose the event you want to generate a report for
                </p>

                {/* Custom dropdown */}
                <div className="relative ml-8">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:border-blue-500/50 transition-colors"
                    >
                        {selectedEvent ? (
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                {selectedEvent.title}
                                <span className="text-xs text-gray-500">
                                    ({format(new Date(selectedEvent.startDate), "dd MMM yyyy")})
                                </span>
                            </span>
                        ) : (
                            <span className="text-gray-500">Select an event...</span>
                        )}
                        <ChevronDown
                            className={cn(
                                "w-4 h-4 text-gray-500 transition-transform",
                                dropdownOpen && "rotate-180"
                            )}
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-white/10 rounded-lg shadow-xl max-h-72 overflow-hidden">
                            <div className="p-2 border-b border-white/5">
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                                    autoFocus
                                />
                            </div>
                            <div className="overflow-y-auto max-h-52">
                                {!events ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1" />
                                        Loading events...
                                    </div>
                                ) : filteredEvents.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No events found
                                    </div>
                                ) : (
                                    filteredEvents.map((ev) => (
                                        <button
                                            key={ev._id}
                                            onClick={() => {
                                                setSelectedEventId(ev._id);
                                                setDropdownOpen(false);
                                                setSearchQuery("");
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition-colors",
                                                selectedEventId === ev._id && "bg-blue-500/10"
                                            )}
                                        >
                                            <div className="text-left">
                                                <p className="text-white font-medium">{ev.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {format(new Date(ev.startDate), "dd MMM yyyy")} ·{" "}
                                                    {ev.category} · {ev.organizerName}
                                                </p>
                                            </div>
                                            {selectedEventId === ev._id && (
                                                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Step 2: Customise Report ─────────────────────────────── */}
            {selectedEventId && (
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">
                            2
                        </span>
                        Customise Report Details
                    </h2>
                    <p className="text-xs text-gray-500 mb-4 ml-8">
                        Fill in optional fields — unfilled fields will use smart defaults
                    </p>

                    <div className="ml-8 space-y-5">
                        {/* Basic extras */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FieldInput
                                label="Organizing Department / Club"
                                placeholder="e.g. CodeDecode DYPIU Club (SOCSEA)"
                                value={department}
                                onChange={setDepartment}
                            />
                            <FieldInput
                                label="Coordinator(s)"
                                placeholder="e.g. Prof. Rajesh Kumar"
                                value={coordinators}
                                onChange={setCoordinators}
                            />
                            <FieldInput
                                label="Resource Person(s)"
                                placeholder="e.g. Dr. A. Sharma, XYZ Corp."
                                value={resourcePersons}
                                onChange={setResourcePersons}
                            />
                            <FieldInput
                                label="Target Participants"
                                placeholder="e.g. B.Tech 3rd Year Students"
                                value={targetParticipants}
                                onChange={setTargetParticipants}
                            />
                        </div>

                        {/* Objectives */}
                        <DynamicList
                            label="Event Objectives"
                            hint="Action-verb bullet points (e.g. 'To enhance practical skills in...')"
                            items={objectives}
                            setItems={setObjectives}
                            placeholder="To provide hands-on training in..."
                            addItem={() => addListItem(setObjectives)}
                            updateItem={(i, v) => updateListItem(setObjectives, i, v)}
                            removeItem={(i) => removeListItem(setObjectives, i)}
                        />

                        {/* Outcomes */}
                        <DynamicList
                            label="Key Outcomes"
                            hint="What participants gained from the event"
                            items={outcomes}
                            setItems={setOutcomes}
                            placeholder="Comprehensive understanding of..."
                            addItem={() => addListItem(setOutcomes)}
                            updateItem={(i, v) => updateListItem(setOutcomes, i, v)}
                            removeItem={(i) => removeListItem(setOutcomes, i)}
                        />

                        {/* Brief Report */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Brief Report (Narrative)
                            </label>
                            <textarea
                                rows={5}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-y"
                                placeholder="Leave blank for auto-generated narrative based on event data..."
                                value={briefReport}
                                onChange={(e) => setBriefReport(e.target.value)}
                            />
                        </div>

                        {/* Feedback */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Feedback Summary
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input
                                    type="text"
                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                                    placeholder="Overall rating (e.g. 4.5/5)"
                                    value={feedbackRating}
                                    onChange={(e) => setFeedbackRating(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                                    placeholder="Most liked aspect"
                                    value={feedbackBest}
                                    onChange={(e) => setFeedbackBest(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                                    placeholder="Area for improvement"
                                    value={feedbackImprove}
                                    onChange={(e) => setFeedbackImprove(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Step 3: Report Preview & Export ──────────────────────── */}
            {reportData && (
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">
                            3
                        </span>
                        Preview & Export
                    </h2>
                    <p className="text-xs text-gray-500 mb-5 ml-8">
                        Review data and download the report
                    </p>

                    {/* Quick Stats */}
                    <div className="ml-8 grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <StatCard label="Registered" value={reportData.stats.totalRegistrations} />
                        <StatCard label="Attended" value={reportData.stats.totalCheckedIn} />
                        <StatCard
                            label="Attendance Rate"
                            value={`${reportData.stats.attendanceRate}%`}
                        />
                        <StatCard
                            label="Capacity Used"
                            value={`${reportData.stats.capacityUtilization}%`}
                        />
                    </div>

                    {/* Info blurb */}
                    <div className="ml-8 mb-6 flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-400">
                            The report will include all 7 sections: Basic Details, Objectives
                            (with SDGs & POs), Key Outcomes, Brief Narrative, Photo placeholders,
                            Feedback Summary, and the complete Attendance Record with{" "}
                            {reportData.attendees.length} confirmed participants.
                        </p>
                    </div>

                    {/* Download Buttons */}
                    <div className="ml-8 flex flex-wrap gap-3">
                        <Button
                            onClick={handleGeneratePDF}
                            disabled={generating !== null}
                            className="bg-red-600 hover:bg-red-700 text-white gap-2 px-6"
                        >
                            {generating === "pdf" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <FileText className="w-4 h-4" />
                            )}
                            Download PDF Report
                        </Button>

                        <Button
                            onClick={handleGenerateWord}
                            disabled={generating !== null}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
                        >
                            {generating === "word" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <FileDown className="w-4 h-4" />
                            )}
                            Download Word Report
                        </Button>

                        <Button
                            onClick={() => {
                                handleGeneratePDF();
                                setTimeout(handleGenerateWord, 500);
                            }}
                            disabled={generating !== null}
                            variant="outline"
                            className="border-white/10 text-gray-300 hover:bg-white/5 gap-2 px-6"
                        >
                            <Download className="w-4 h-4" />
                            Download Both
                        </Button>
                    </div>
                </div>
            )}

            {/* Loading state for report data */}
            {selectedEventId && !reportData && (
                <div className="flex items-center justify-center py-16 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading event data...
                </div>
            )}
        </div>
    );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function FieldInput({ label, placeholder, value, onChange }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
                {label}
            </label>
            <input
                type="text"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function DynamicList({ label, hint, items, placeholder, addItem, updateItem, removeItem }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-0.5">
                {label}
            </label>
            {hint && (
                <p className="text-xs text-gray-500 mb-2">{hint}</p>
            )}
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs w-4 shrink-0">{i + 1}.</span>
                        <input
                            type="text"
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                            placeholder={placeholder}
                            value={item}
                            onChange={(e) => updateItem(i, e.target.value)}
                        />
                        {items.length > 1 && (
                            <button
                                onClick={() => removeItem(i)}
                                className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button
                onClick={addItem}
                className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
                <Plus className="w-3 h-3" />
                Add another
            </button>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
            <p className="text-lg font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    );
}
