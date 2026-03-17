"use client";

import React, { useState } from "react";
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
    GraduationCap,
    Users,
    Megaphone,
    ImageIcon,
    Settings,
} from "lucide-react";
import AdminGuard from "@/components/admin-guard";
import { cn } from "@/lib/utils";
import { useMockAuth } from "@/components/convex-client-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const isBackendEnabled = Boolean(
    process.env.NEXT_PUBLIC_CONVEX_URL && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Events", href: "/admin/events", icon: Calendar },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Registrations", href: "/admin/registrations", icon: ClipboardList },
    { label: "Reports", href: "/admin/reports", icon: FileText },
    { label: "Team", href: "/admin/team", icon: Users },
    { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { label: "Assets", href: "/admin/assets", icon: ImageIcon },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

function ConvexAdminLayout({ children }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const adminCheck = useQuery(api.admin.isAdmin);
    return <AdminLayoutUI pathname={pathname} collapsed={collapsed} setCollapsed={setCollapsed} adminCheck={adminCheck}>{children}</AdminLayoutUI>;
}

function MockAdminLayout({ children }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { adminCheck } = useMockAuth();
    return <AdminLayoutUI pathname={pathname} collapsed={collapsed} setCollapsed={setCollapsed} adminCheck={adminCheck}>{children}</AdminLayoutUI>;
}

function AdminLayoutUI({ pathname, collapsed, setCollapsed, adminCheck, children }) {
    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-[#0a1528]">
                <aside className={cn("fixed top-24 left-0 h-[calc(100vh-6rem)] z-30 bg-[#0b1730]/95 backdrop-blur-xl border-r border-white/[0.06] flex flex-col transition-all duration-300", collapsed ? "w-16" : "w-60")}>
                    <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
                        {!collapsed && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-navy to-brand-blue flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">DY</span>
                                </div>
                                <span className="text-lg font-bold text-white">
                                    DYPIU<span className="text-xs text-brand-orange ml-1">Organizer</span>
                                </span>
                            </div>
                        )}
                        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-md hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                    </div>

                    <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                            return (
                                <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200", isActive ? "bg-brand-blue/15 text-brand-blue-light border border-brand-blue/25" : "text-gray-400 hover:text-white hover:bg-white/5")} title={collapsed ? item.label : undefined}>
                                    <item.icon className="w-5 h-5 shrink-0" />
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-3 py-4 border-t border-white/[0.06]">
                        {!collapsed ? (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
                                    <GraduationCap className="w-4 h-4 text-brand-orange" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{adminCheck?.user?.name || "Organizer"}</p>
                                    <p className="text-xs text-brand-orange capitalize">{adminCheck?.role || "organiser"}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
                                    <GraduationCap className="w-4 h-4 text-brand-orange" />
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                <main className={cn("flex-1 transition-all duration-300 pt-2 pb-12 px-4 sm:px-6", collapsed ? "ml-16" : "ml-60")}>
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}

export default function AdminLayout({ children }) {
    if (isBackendEnabled) return <ConvexAdminLayout>{children}</ConvexAdminLayout>;
    return <MockAdminLayout>{children}</MockAdminLayout>;
}
