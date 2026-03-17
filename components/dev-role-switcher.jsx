"use client";

import { useState } from "react";
import { Bug } from "lucide-react";
import { useMockAuth } from "@/components/convex-client-provider";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";

const isBackendEnabled = Boolean(
    process.env.NEXT_PUBLIC_CONVEX_URL && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

const ROLES = [
    { value: "student", label: "Student", color: "#3b82f6", emoji: "🎓" },
    { value: "organiser", label: "Organiser", color: "#f59e0b", emoji: "🎪" },
];

function DevRoleSwitcherUI({ isOpen, setIsOpen, switching, currentRole, handleSwitch }) {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full bg-gray-800 border border-gray-600 shadow-lg flex items-center justify-center hover:bg-gray-700 transition-all"
                title="Dev Role Switcher"
            >
                <Bug className="w-5 h-5 text-dypiu-gold" />
            </button>
            {isOpen && (
                <div className="absolute bottom-14 right-0 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-3 space-y-1">
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 px-1">
                        🧪 Dev Role Switcher
                    </div>
                    {ROLES.map((role) => (
                        <button
                            key={role.value}
                            disabled={switching}
                            onClick={() => handleSwitch(role.value)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-all ${currentRole === role.value
                                ? "bg-gray-700 text-white font-medium ring-1 ring-blue-500"
                                : "text-gray-300 hover:bg-gray-800"
                                }`}
                        >
                            <span>{role.emoji}</span>
                            <span>{role.label}</span>
                            {currentRole === role.value && (
                                <span className="ml-auto text-xs text-blue-400">Active</span>
                            )}
                        </button>
                    ))}
                    <div className="border-t border-gray-700 mt-2 pt-2">
                        <p className="text-[10px] text-gray-500 px-1">
                            Switch between Student and Organiser roles. Changes take effect immediately.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function MockDevRoleSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const { role: currentRole, setRole } = useMockAuth();
    return (
        <DevRoleSwitcherUI isOpen={isOpen} setIsOpen={setIsOpen} switching={false} currentRole={currentRole} handleSwitch={setRole} />
    );
}

function ConvexDevRoleSwitcher() {
    const { isAuthenticated } = useConvexAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [switching, setSwitching] = useState(false);
    const adminCheck = useQuery(api.admin.isAdmin);
    const setMyRole = useMutation(api.devSeed.setMyRole);
    const currentRole = adminCheck?.role || "student";

    const handleSwitch = async (role) => {
        if (!isAuthenticated) return;
        setSwitching(true);
        try { await setMyRole({ role }); } catch (err) { console.error(err); }
        setSwitching(false);
    };

    if (!isAuthenticated) return null;

    return (
        <DevRoleSwitcherUI isOpen={isOpen} setIsOpen={setIsOpen} switching={switching} currentRole={currentRole} handleSwitch={handleSwitch} />
    );
}

export default function DevRoleSwitcher() {
    if (process.env.NODE_ENV !== "development") return null;
    if (isBackendEnabled) return <ConvexDevRoleSwitcher />;
    return <MockDevRoleSwitcher />;
}
