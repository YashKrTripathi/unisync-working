"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    BarChart3,
    ClipboardList,
    Users,
    Image,
    Megaphone,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    Shield,
} from "lucide-react";
import AdminGuard from "@/components/admin-guard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Events", href: "/admin/events", icon: Calendar },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Registrations", href: "/admin/registrations", icon: ClipboardList },
    { label: "Reports", href: "/admin/reports", icon: FileText },
    { label: "Team", href: "/admin/team", icon: Users, superadminOnly: true },
    { label: "Assets", href: "/admin/assets", icon: Image, superadminOnly: true },
    { label: "Announcements", href: "/admin/announcements", icon: Megaphone, superadminOnly: true },
    { label: "Settings", href: "/admin/settings", icon: Settings, superadminOnly: true },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const adminCheck = useQuery(api.admin.isAdmin);

    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-gray-950 -mt-40 md:-mt-32">
                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed top-0 left-0 h-screen z-30 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 flex flex-col transition-all duration-300",
                        collapsed ? "w-16" : "w-60"
                    )}
                >
                    {/* Logo */}
                    <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
                        {!collapsed && (
                            <div className="flex items-center gap-2">
                                <Shield className="w-6 h-6 text-purple-400" />
                                <span className="text-lg font-bold text-white">
                                    UniSync
                                    <span className="text-xs text-purple-400 ml-1">Admin</span>
                                </span>
                            </div>
                        )}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                        >
                            {collapsed ? (
                                <ChevronRight className="w-4 h-4" />
                            ) : (
                                <ChevronLeft className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                        {navItems
                            .filter((item) => !item.superadminOnly || adminCheck?.isSuperAdmin)
                            .map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/admin" && pathname.startsWith(item.href));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <item.icon className="w-5 h-5 shrink-0" />
                                        {!collapsed && <span>{item.label}</span>}
                                    </Link>
                                );
                            })}
                    </nav>

                    {/* User Role Badge */}
                    {adminCheck?.user && (
                        <div className="px-3 py-4 border-t border-gray-800">
                            {!collapsed ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {adminCheck.user.name}
                                        </p>
                                        <p className="text-xs text-purple-400 capitalize">
                                            {adminCheck.role}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-purple-400" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main
                    className={cn(
                        "flex-1 transition-all duration-300 pt-6 pb-12 px-6",
                        collapsed ? "ml-16" : "ml-60"
                    )}
                >
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}
