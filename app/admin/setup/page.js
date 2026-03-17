"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, AlertCircle, Users } from "lucide-react";
import { toast } from "sonner";

export default function AdminSetup() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const setUserRole = useMutation(api.admin.setUserRole);
    const adminCheck = useQuery(api.admin.isAdmin);
    const isAdmin = adminCheck?.canAccessAdminPanel === true;

    // Look up user by email as they type
    const foundUser = useQuery(
        api.admin.findUserByEmail,
        isAdmin && email.trim().length > 3 ? { email: email.trim() } : "skip"
    );

    // Get current organisers list
    const organisers = useQuery(api.admin.getAdminUsers, isAdmin ? undefined : "skip");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        if (!foundUser) {
            toast.error("No registered user found with that email. The user must sign up first.");
            return;
        }

        if ((foundUser.role || "student") === "organiser") {
            toast.info("This user is already an organiser.");
            return;
        }

        setLoading(true);
        try {
            await setUserRole({ userId: foundUser._id, role: "organiser" });
            toast.success(`${foundUser.name} has been promoted to Organiser!`);
            setEmail("");
        } catch (error) {
            toast.error(error.message || "Failed to promote user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center -mt-20">
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        UniSync Admin Setup
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Promote a registered user to Organiser. Enter their email below.
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
                            className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            required
                        />
                        {/* User lookup feedback */}
                        {email.trim().length > 3 && foundUser === null && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-red-400">
                                <AlertCircle className="w-3.5 h-3.5" />
                                No registered user found with this email
                            </div>
                        )}
                        {foundUser && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-green-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Found: {foundUser.name} ({foundUser.role || "student"})
                            </div>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={loading || !foundUser || (foundUser.role || "student") === "organiser"}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    >
                        {loading ? "Promoting..." : "Promote to Organiser"}
                    </Button>
                </form>

                <p className="text-xs text-gray-600 text-center mt-4">
                    The user must have already signed up on the platform.
                </p>
            </div>

            {/* Current organisers */}
            {organisers && organisers.length > 0 && (
                <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 max-w-md w-full mx-4 mt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4 text-blue-400" />
                        <h2 className="text-sm font-semibold text-white">Current Organisers ({organisers.length})</h2>
                    </div>
                    <div className="space-y-2">
                        {organisers.map((org) => (
                            <div key={org._id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.04]">
                                {org.imageUrl ? (
                                    <img src={org.imageUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                        {org.name?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-white truncate">{org.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{org.email}</p>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">
                                    Organiser
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
