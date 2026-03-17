"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminSetup() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const setUserRole = useMutation(api.admin.setUserRole);
    const adminCheck = useQuery(api.admin.isAdmin);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            // Note: setUserRole requires a userId. For initial setup,
            // the current user can promote themselves if they are already an organiser.
            // For a fresh setup, you may need to manually set the role in the Convex dashboard.
            toast.info("To set up the first organiser, update the user role directly in the Convex dashboard, or use the Team management page if you already have organiser access.");
            setTimeout(() => {
                window.location.href = "/admin";
            }, 2000);
        } catch (error) {
            toast.error(error.message || "Failed to initialize admin");
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
                        Set up your first organiser account. Enter the email of an existing
                        registered user to promote them.
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
                            placeholder="organiser@example.com"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Setting up..." : "Initialize Organiser"}
                    </Button>
                </form>

                <p className="text-xs text-gray-600 text-center mt-4">
                    After setup, use the Team module to manage roles.
                </p>
            </div>
        </div>
    );
}
