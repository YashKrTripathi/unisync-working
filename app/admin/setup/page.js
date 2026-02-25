"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminSetup() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const initSuperAdmin = useMutation(api.admin.initSuperAdmin);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            await initSuperAdmin({ email: email.trim() });
            toast.success("SuperAdmin initialized! Redirecting...");
            setTimeout(() => {
                window.location.href = "/admin";
            }, 1500);
        } catch (error) {
            toast.error(error.message || "Failed to initialize SuperAdmin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 -mt-40 md:-mt-32">
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        UniSync Admin Setup
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Initialize the first SuperAdmin by entering the email of an existing
                        registered user.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            User Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Initializing..." : "Initialize SuperAdmin"}
                    </Button>
                </form>

                <p className="text-xs text-gray-600 text-center mt-4">
                    This can only be used once. After setup, use the Team module to manage
                    roles.
                </p>
            </div>
        </div>
    );
}
