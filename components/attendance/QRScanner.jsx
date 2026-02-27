"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QRScanner() {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null); // { success: boolean, message: string, eventName?: string }
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    const startScanning = async () => {
        setResult(null);
        setError(null);
        setScanning(true);

        try {
            // Dynamically import html5-qrcode
            const { Html5Qrcode } = await import("html5-qrcode");

            if (!scannerRef.current) return;

            const html5QrCode = new Html5Qrcode("qr-reader");
            html5QrCodeRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    // TODO: Replace with actual API call to verify QR code
                    // Mock success
                    setResult({
                        success: true,
                        message: "Attendance marked successfully!",
                        eventName: "TechFusion 2026",
                        eventCode: decodedText,
                    });
                    stopScanning();
                },
                () => {
                    // Ignore scan failures (continuous scanning)
                }
            );
        } catch (err) {
            setError("Unable to access camera. Please check permissions.");
            setScanning(false);
        }
    };

    const stopScanning = async () => {
        try {
            if (html5QrCodeRef.current) {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current.clear();
                html5QrCodeRef.current = null;
            }
        } catch (e) {
            // Ignore cleanup errors
        }
        setScanning(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(() => { });
            }
        };
    }, []);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Scan QR Code</h3>
                <p className="text-sm text-gray-400">
                    Point your camera at the event QR code to mark your attendance.
                </p>
            </div>

            {/* Scanner Area */}
            <div className="relative rounded-2xl overflow-hidden bg-black/20 border border-white/10">
                <div
                    id="qr-reader"
                    ref={scannerRef}
                    className={`w-full ${scanning ? "min-h-[300px]" : "h-64 flex items-center justify-center"}`}
                >
                    {!scanning && !result && (
                        <div className="text-center p-8">
                            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 text-sm">
                                Click &quot;Start Scanning&quot; to activate camera
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center">
                {!scanning ? (
                    <Button
                        onClick={startScanning}
                        className="bg-gradient-to-r from-dypiu-navy to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white px-8 gap-2"
                    >
                        <Camera className="w-4 h-4" />
                        Start Scanning
                    </Button>
                ) : (
                    <Button
                        onClick={stopScanning}
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
                    >
                        <XCircle className="w-4 h-4" />
                        Stop Scanning
                    </Button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

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
