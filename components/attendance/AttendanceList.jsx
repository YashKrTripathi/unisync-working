"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import {
    Search,
    Download,
    FileText,
    FileSpreadsheet,
    CheckCircle2,
    XCircle,
    Clock,
    Users,
    QrCode,
    PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAttendanceRecords } from "@/lib/mockData";

const statusConfig = {
    attended: {
        label: "Attended",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: CheckCircle2,
    },
    absent: {
        label: "Absent",
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        icon: XCircle,
    },
    registered: {
        label: "Registered",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        icon: Clock,
    },
};

export default function AttendanceList({ eventId }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Filter records for this event (or show all for demo)
    const records = useMemo(() => {
        let data = eventId
            ? mockAttendanceRecords.filter((r) => r.eventId === eventId)
            : mockAttendanceRecords;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            data = data.filter(
                (r) =>
                    r.studentName.toLowerCase().includes(q) ||
                    r.studentEmail.toLowerCase().includes(q) ||
                    r.department.toLowerCase().includes(q)
            );
        }

        if (statusFilter !== "all") {
            data = data.filter((r) => r.attendanceStatus === statusFilter);
        }

        return data;
    }, [eventId, searchQuery, statusFilter]);

    const totalCount = records.length;
    const attendedCount = records.filter(
        (r) => r.attendanceStatus === "attended"
    ).length;

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">
                        <strong className="text-white">{totalCount}</strong> total
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-gray-300">
                        <strong className="text-white">{attendedCount}</strong> attended
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                        Attendance Rate:{" "}
                        <strong className="text-dypiu-gold">
                            {totalCount > 0
                                ? Math.round((attendedCount / totalCount) * 100)
                                : 0}
                            %
                        </strong>
                    </span>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search attendees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                >
                    <option value="all" className="bg-gray-900">All Status</option>
                    <option value="attended" className="bg-gray-900">Attended</option>
                    <option value="absent" className="bg-gray-900">Absent</option>
                    <option value="registered" className="bg-gray-900">Registered</option>
                </select>

                {/* Export buttons - UI only */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-white/10 text-gray-400 hover:bg-white/5 gap-1"
                        onClick={() => {
                            // TODO: Implement CSV export
                            alert("CSV export coming soon!");
                        }}
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        CSV
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-white/10 text-gray-400 hover:bg-white/5 gap-1"
                        onClick={() => {
                            // TODO: Implement PDF export
                            alert("PDF export coming soon!");
                        }}
                    >
                        <FileText className="w-4 h-4" />
                        PDF
                    </Button>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="rounded-xl overflow-hidden border border-white/[0.06]">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                            <th className="text-left px-4 py-3 text-gray-400 font-medium">
                                Student
                            </th>
                            <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">
                                Department
                            </th>
                            <th className="text-left px-4 py-3 text-gray-400 font-medium">
                                Status
                            </th>
                            <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">
                                Method
                            </th>
                            <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">
                                Check-in Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => {
                            const status = statusConfig[record.attendanceStatus];
                            const StatusIcon = status.icon;

                            return (
                                <tr
                                    key={record._id}
                                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-white">
                                                {record.studentName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {record.studentEmail}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                                        {record.department}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            className={`${status.bg} ${status.color} ${status.border} border gap-1`}
                                        >
                                            <StatusIcon className="w-3 h-3" />
                                            {status.label}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        {record.qrScanned ? (
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <QrCode className="w-3.5 h-3.5" /> QR Scan
                                            </span>
                                        ) : record.manualEntry ? (
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <PenLine className="w-3.5 h-3.5" /> Manual
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                                        {record.checkInTime
                                            ? format(record.checkInTime, "PPp")
                                            : "—"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {records.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No attendance records found.
                    </div>
                )}
            </div>
        </div>
    );
}
