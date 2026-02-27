"use client";

import React, { useState } from "react";
import { Hash, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManualEntry() {
    const [eventCode, setEventCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!eventCode.trim()) return;

        setLoading(true);
        setResult(null);

        // TODO: Replace with actual API call to verify event code
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Mock response based on event code
        const validCodes = ["TF2026", "CF2026", "AIML26", "CRKT26", "SPD26", "ROBO26"];

        if (validCodes.includes(eventCode.toUpperCase())) {
            setResult({
                success: true,
                message: "Attendance marked successfully!",
                eventName:
                    eventCode.toUpperCase() === "TF2026"
                        ? "TechFusion 2026"
                        : eventCode.toUpperCase() === "CF2026"
                            ? "Cultural Fiesta"
                            : "Event Found",
            });
        } else {
            setResult({
                success: false,
                message: "Invalid event code. Please check and try again.",
            });
        }

        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                    Enter Event Code
                </h3>
                <p className="text-sm text-gray-400">
                    Enter the unique event code shared by the organizer to mark your attendance.
                </p>
            </div>

            {/* Code Entry Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={eventCode}
                        onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                        placeholder="e.g., TF2026"
                        maxLength={10}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-lg text-white text-center font-mono tracking-wider placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors uppercase"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={!eventCode.trim() || loading}
                    className="w-full bg-gradient-to-r from-dypiu-navy to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white py-6 text-base gap-2 disabled:opacity-40"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        "Mark Attendance"
                    )}
                </Button>
            </form>

            {/* Hint */}
            <p className="text-xs text-gray-600 text-center">
                The event code is usually displayed at the event venue or shared by the organizer.
            </p>

            {/* Result */}
            {result && (
                <div
                    className={`p-5 rounded-xl border text-center ${result.success
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : "bg-red-500/10 border-red-500/20"
                        }`}
                >
                    {result.success ? (
                        <>
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                            <p className="text-emerald-400 font-semibold text-lg">
                                {result.message}
                            </p>
                            {result.eventName && (
                                <p className="text-gray-400 text-sm mt-1">
                                    Event: {result.eventName}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                            <p className="text-red-400 font-semibold">{result.message}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
