"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";
import {
    Globe,
    Calendar,
    Palette,
    AlertTriangle,
    Save,
    RotateCcw,
    Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const SETTING_SECTIONS = [
    {
        id: "general",
        label: "General",
        icon: Globe,
        color: "text-blue-400",
        fields: [
            { key: "platform_name", label: "Platform Name", type: "text", placeholder: "UniSync", description: "Display name for the platform" },
            { key: "platform_tagline", label: "Tagline", type: "text", placeholder: "Campus Event Operating System", description: "Short description shown in header" },
            { key: "contact_email", label: "Contact Email", type: "email", placeholder: "events@dypiu.ac.in", description: "Main contact email for support" },
            { key: "contact_phone", label: "Contact Phone", type: "text", placeholder: "+91 20 2742 0000", description: "Contact phone number" },
        ],
    },
    {
        id: "events",
        label: "Event Defaults",
        icon: Calendar,
        color: "text-blue-400",
        fields: [
            { key: "default_capacity", label: "Default Event Capacity", type: "number", placeholder: "100", description: "Default capacity for new events" },
            { key: "default_timezone", label: "Default Timezone", type: "text", placeholder: "Asia/Kolkata", description: "Default timezone for events" },
            { key: "free_event_limit", label: "Free Event Limit", type: "number", placeholder: "1", description: "Number of events allowed on free plan" },
            { key: "require_approval", label: "Require Approval", type: "toggle", description: "Require admin approval before events go live" },
        ],
    },
    {
        id: "appearance",
        label: "Appearance",
        icon: Palette,
        color: "text-amber-400",
        fields: [
            { key: "primary_color", label: "Primary Color", type: "color", placeholder: "#3b82f6", description: "Main brand color used across the platform" },
            { key: "university_name", label: "University Name", type: "text", placeholder: "D. Y. Patil International University", description: "Full university name for branding" },
            { key: "university_short", label: "University Short Name", type: "text", placeholder: "DYPIU", description: "Abbreviated name" },
        ],
    },
];

function SettingField({ field, value, onChange }) {
    if (field.type === "toggle") {
        const isOn = value === "true";
        return (
            <div className="flex items-center justify-between p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]/50">
                <div>
                    <p className="text-sm font-medium text-white">{field.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{field.description}</p>
                </div>
                <button
                    onClick={() => onChange(field.key, isOn ? "false" : "true")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOn ? "bg-blue-600" : "bg-white/[0.08]"}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? "translate-x-6" : "translate-x-1"}`} />
                </button>
            </div>
        );
    }

    if (field.type === "color") {
        return (
            <div className="space-y-1.5">
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium">{field.label}</label>
                <p className="text-xs text-gray-600">{field.description}</p>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={value || field.placeholder || "#3b82f6"}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        className="w-10 h-10 rounded-lg border border-white/[0.08] cursor-pointer bg-transparent"
                    />
                    <input
                        type="text"
                        value={value || ""}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium">{field.label}</label>
            <p className="text-xs text-gray-600">{field.description}</p>
            <input
                type={field.type}
                value={value || ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
}

export default function SettingsAdminPage() {
    const adminCheck = useQuery(api.admin.isAdmin);
    const isAdmin = adminCheck?.canAccessAdminPanel === true;
    const savedSettings = useQuery(api.settings.getAllSettings, isAdmin ? undefined : "skip");
    const updateSetting = useMutation(api.settings.updateSetting);

    const [localEdits, setLocalEdits] = useState({});
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState("general");
    const dirty = Object.keys(localEdits).length > 0;

    function getSettingValue(key) {
        if (Object.prototype.hasOwnProperty.call(localEdits, key)) {
            return localEdits[key];
        }
        return savedSettings?.[key] ?? "";
    }

    function handleChange(key, value) {
        const savedValue = savedSettings?.[key] ?? "";
        setLocalEdits((prev) => {
            if (value === savedValue) {
                const next = { ...prev };
                delete next[key];
                return next;
            }
            return { ...prev, [key]: value };
        });
    }

    async function handleSave() {
        setSaving(true);
        try {
            const changedKeys = Object.keys(localEdits);

            for (const key of changedKeys) {
                await updateSetting({ key, value: String(localEdits[key]) });
            }

            toast.success("Settings saved successfully");
            setLocalEdits({});
        } catch (err) {
            toast.error(err.message || "Failed to save settings");
        }
        setSaving(false);
    }

    function handleReset() {
        setLocalEdits({});
        toast.info("Settings reverted to last saved values");
    }

    if (savedSettings === undefined) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400 text-sm mb-8">Configure platform settings and preferences</p>
                <div className="flex justify-center py-20">
                    <BarLoader width={200} color="#0288D1" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 text-sm mt-1">Configure platform settings and preferences</p>
                </div>
                <div className="flex items-center gap-2">
                    {dirty && (
                        <Button variant="ghost" onClick={handleReset} className="text-gray-400 hover:text-white">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Revert
                        </Button>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={!dirty || saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    >
                        {saving ? "Saving..." : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {dirty && (
                <div className="flex items-center gap-2 px-4 py-2.5 mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm">
                    <Info className="w-4 h-4 shrink-0" />
                    You have unsaved changes
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
                {/* Section nav */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2 h-fit">
                    {SETTING_SECTIONS.map((section) => {
                        const SectionIcon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === section.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.06]"
                                }`}
                            >
                                <SectionIcon className="w-4 h-4" />
                                {section.label}
                            </button>
                        );
                    })}

                    <div className="my-2 border-t border-white/[0.06]" />

                    <button
                        onClick={() => setActiveSection("danger")}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === "danger"
                            ? "bg-red-600 text-white"
                            : "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        }`}
                    >
                        <AlertTriangle className="w-4 h-4" />
                        Danger Zone
                    </button>
                </div>

                {/* Settings content */}
                <div>
                    {SETTING_SECTIONS.filter((s) => s.id === activeSection).map((section) => {
                        const SectionIcon = section.icon;
                        return (
                            <div key={section.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <SectionIcon className={`w-5 h-5 ${section.color}`} />
                                    <h2 className="text-lg font-semibold text-white">{section.label}</h2>
                                </div>
                                <div className="space-y-5">
                                    {section.fields.map((field) => (
                                        <SettingField
                                            key={field.key}
                                            field={field}
                                            value={getSettingValue(field.key)}
                                            onChange={handleChange}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {activeSection === "danger" && (
                        <div className="bg-white/[0.03] border border-red-500/30 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                <h2 className="text-lg font-semibold text-white">Danger Zone</h2>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">These actions are irreversible. Proceed with caution.</p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-white">Clear All Platform Settings</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Reset all settings to their default values</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                        onClick={() => {
                                            if (confirm("Are you sure you want to reset all settings? This cannot be undone.")) {
                                                const clearedSettings = {};
                                                for (const key of Object.keys(savedSettings || {})) {
                                                    clearedSettings[key] = "";
                                                }
                                                setLocalEdits(clearedSettings);
                                                toast.info("Settings cleared locally. Click Save Changes to apply.");
                                            }
                                        }}
                                    >
                                        Reset Settings
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-white">Environment Info</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Current deployment configuration</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Convex: <span className="text-green-400">Connected</span></p>
                                        <p className="text-xs text-gray-400">Auth: <span className="text-green-400">Clerk</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
