"use client";

import React, { useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    BarChart3,
    ClipboardList,
    FileText,
    ChevronLeft,
    ChevronRight,
    Settings,
    Users,
    LogOut,
    Circle,
    Globe,
} from "lucide-react";
import AdminGuard from "@/components/admin-guard";
import { cn } from "@/lib/utils";
import { useMockAuth } from "@/components/convex-client-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const isBackendEnabled = Boolean(
    process.env.NEXT_PUBLIC_CONVEX_URL && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

// Nav sections matching the design reference
const navSections = [
    {
        label: "Overview",
        items: [
            { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        ],
    },
    {
        label: "Management",
        items: [
            { label: "Events", href: "/admin/events", icon: Calendar },
            { label: "Registrations", href: "/admin/registrations", icon: ClipboardList },
            { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
            { label: "Reports", href: "/admin/reports", icon: FileText },
        ],
    },
    {
        label: "Settings",
        items: [
            { label: "Team", href: "/admin/team", icon: Users },
            { label: "Site Content", href: "/admin/site-content", icon: Globe, requiresSuperAdmin: true },
            { label: "Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];

function AdminSidebar({ pathname, collapsed, setCollapsed, adminCheck }) {
    return (
        <aside className={cn(
            "fixed top-0 left-0 h-screen z-30 flex flex-col transition-all duration-300 border-r border-white/[0.06]",
            "bg-[#111111]",
            collapsed ? "w-14" : "w-56"
        )}>
            {/* Logo / collapse toggle */}
            <div className={cn(
                "flex items-center border-b border-white/[0.06] shrink-0",
                collapsed ? "justify-center py-4 px-2" : "justify-between px-4 py-4"
            )}>
                {!collapsed && (
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0">
                            <span className="text-black font-black text-sm leading-none">U</span>
                        </div>
                        <span className="text-white font-semibold text-[15px] tracking-tight">UniSync</span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/8 transition-colors"
                >
                    {collapsed
                        ? <ChevronRight className="w-4 h-4" />
                        : <ChevronLeft className="w-4 h-4" />
                    }
                </button>
            </div>

            {/* User profile */}
            {!collapsed && (
                <div className="px-4 py-3.5 border-b border-white/[0.06] shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                            <span className="text-white font-semibold text-xs">
                                {(adminCheck?.user?.name || "O").charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-medium text-white truncate leading-tight">
                                {adminCheck?.user?.name || "Organizer"}
                            </p>
                            <p className="text-[11px] text-gray-500 capitalize leading-tight mt-0.5">
                                {adminCheck?.role || "organiser"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-3 px-2">
                {navSections.map((section) => (
                    <div key={section.label} className="mb-4">
                        {!collapsed && (
                            <p className="px-2 mb-1 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
                                {section.label}
                            </p>
                        )}
                        {section.items.map((item) => {
                            // Hide items that require superadmin unless user has superadmin/owner role
                            if (item.requiresSuperAdmin && !adminCheck?.isSuperAdmin) return null;
                            const isActive = pathname === item.href ||
                                (item.href !== "/admin" && pathname?.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={collapsed ? item.label : undefined}
                                    className={cn(
                                        "flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 mb-0.5",
                                        isActive
                                            ? "bg-white/10 text-white"
                                            : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Bottom */}
            {!collapsed && (
                <div className="px-2 py-3 border-t border-white/[0.06] shrink-0">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-colors"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>Back to Site</span>
                    </Link>
                </div>
            )}
        </aside>
    );
}

function AdminLayoutUI({ pathname, collapsed, setCollapsed, adminCheck, children }) {
    return (
        <AdminGuard adminCheck={adminCheck}>
            <div className="flex min-h-screen bg-[#0c0c0c]">
                <AdminSidebar
                    pathname={pathname}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    adminCheck={adminCheck}
                />
                <main className={cn(
                    "flex-1 transition-all duration-300 min-h-screen bg-[#141414]",
                    collapsed ? "ml-14" : "ml-56"
                )}>
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}

function ConvexAdminLayout({ children }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const adminCheck = useQuery(api.admin.isAdmin);
    return (
        <AdminLayoutUI
            pathname={pathname}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            adminCheck={adminCheck}
        >
            {children}
        </AdminLayoutUI>
    );
}

function MockAdminLayout({ children }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { adminCheck } = useMockAuth();
    return (
        <AdminLayoutUI
            pathname={pathname}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            adminCheck={adminCheck}
        >
            {children}
        </AdminLayoutUI>
    );
}

export default function AdminLayout({ children }) {
    if (isBackendEnabled) return <ConvexAdminLayout>{children}</ConvexAdminLayout>;
    return <MockAdminLayout>{children}</MockAdminLayout>;
}
