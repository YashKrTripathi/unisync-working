"use client";

import React, { useState } from "react";
import { QrCode, Hash, Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import QRScanner from "@/components/attendance/QRScanner";
import ManualEntry from "@/components/attendance/ManualEntry";
import { mockAttendanceRecords, mockUpcomingEvents, mockPastEvents } from "@/lib/mockData";
import { getCategoryIcon } from "@/lib/data";

const tabs = [
    { id: "scan", label: "Scan QR", icon: QrCode },
    { id: "manual", label: "Enter Code", icon: Hash },
];

// Build a map of events for quick lookup
const allEvents = [...mockUpcomingEvents, ...mockPastEvents];

export default function AttendancePage() {
    const [activeTab, setActiveTab] = useState("scan");

    // Mock: student's registered events
    const myAttendance = mockAttendanceRecords.filter(
        (r) => r.studentId === "stu_001"
    );

    return (
        <div className="pb-20 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Mark <span className="text-dypiu-gold">Attendance</span>
                </h1>
                <p className="text-gray-400">
                    Scan a QR code or enter the event code to mark your attendance.
                </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-8 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                ? "bg-dypiu-navy text-white shadow-lg shadow-blue-900/20"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 mb-12">
                {activeTab === "scan" ? <QRScanner /> : <ManualEntry />}
            </div>

            {/* My Registered Events */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-6">
                    My Registered Events
                </h2>

                {myAttendance.length > 0 ? (
                    <div className="space-y-3">
                        {myAttendance.map((record) => {
                            const event = allEvents.find((e) => e._id === record.eventId);
                            if (!event) return null;

                            const statusColor =
                                record.attendanceStatus === "attended"
                                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                    : record.attendanceStatus === "absent"
                                        ? "text-red-400 bg-red-500/10 border-red-500/20"
                                        : "text-blue-400 bg-blue-500/10 border-blue-500/20";

                            return (
                                <div
                                    key={record._id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
                                >
                                    {/* Event Icon */}
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                                        style={{
                                            backgroundColor: event.themeColor || "#1e3a8a",
                                        }}
                                    >
                                        {getCategoryIcon(event.category)}
                                    </div>

                                    {/* Event Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-white text-sm truncate">
                                            {event.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(event.startDate, "dd MMM yyyy")}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {event.venue}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <Badge
                                        className={`${statusColor} border capitalize text-xs shrink-0`}
                                    >
                                        {record.attendanceStatus === "attended" && (
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                        )}
                                        {record.attendanceStatus === "registered" && (
                                            <Clock className="w-3 h-3 mr-1" />
                                        )}
                                        {record.attendanceStatus}
                                    </Badge>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No registered events yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
