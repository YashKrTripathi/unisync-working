"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";
import { format } from "date-fns";
import {
    Users,
    Shield,
    GraduationCap,
    Search,
    Filter,
    ArrowUpDown,
    UserCog,
    CheckCircle2,
    Mail,
    Calendar,
} from "lucide-react";
import { toast } from "sonner";

function StatCard({ label, value, icon: Icon, color }) {
    const colorMap = {
        purple: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
        green: "from-green-500/20 to-green-600/5 border-green-500/30",
        blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
        amber: "from-amber-500/20 to-amber-600/5 border-amber-500/30",
    };
    const iconColorMap = {
        purple: "text-blue-400 bg-blue-500/20",
        green: "text-green-400 bg-green-500/20",
        blue: "text-blue-400 bg-blue-500/20",
        amber: "text-amber-400 bg-amber-500/20",
    };

    return (
        <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-5`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">{label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value.toLocaleString()}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${iconColorMap[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

const ROLE_CONFIG = {
    organiser: {
        label: "Organiser",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        icon: Shield,
    },
    student: {
        label: "Student",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        icon: GraduationCap,
    },
};

export default function TeamAdminPage() {
    const adminCheck = useQuery(api.admin.isAdmin);
    const isAdmin = adminCheck?.canAccessAdminPanel === true;
    const data = useQuery(api.admin.getAllUsersForAdmin, isAdmin ? {} : "skip");
    const setUserRole = useMutation(api.admin.setUserRole);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);

    const filtered = useMemo(() => {
        if (!data) return [];
        let list = data.users;

        if (roleFilter !== "all") {
            list = list.filter((u) => (u.role || "student") === roleFilter);
        }

        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(
                (u) =>
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q)
            );
        }

        return list;
    }, [data, roleFilter, searchTerm]);

    async function handleRoleChange(userId, newRole) {
        const action = newRole === "organiser" ? "promote to Organiser" : "demote to Student";
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        setActionLoading(userId);
        try {
            await setUserRole({ userId, role: newRole });
            toast.success(`User role updated to ${newRole}`);
        } catch (e) {
            toast.error(e.message || "Failed to update role");
        }
        setActionLoading(null);
    }

    if (!data) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Team Management</h1>
                <p className="text-gray-400 text-sm mb-8">Manage team members and roles</p>
                <div className="flex justify-center py-20">
                    <BarLoader width={200} color="#0288D1" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Team Management</h1>
                <p className="text-gray-400 text-sm mt-1">Manage team members, roles, and permissions</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Users" value={data.stats.total} icon={Users} color="purple" />
                <StatCard label="Organisers" value={data.stats.organisers} icon={Shield} color="amber" />
                <StatCard label="Students" value={data.stats.students} icon={GraduationCap} color="blue" />
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-white/[0.03] border border-white/[0.06] rounded-lg pl-10 pr-8 py-2.5 text-sm text-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]"
                    >
                        <option value="all">All Roles</option>
                        <option value="organiser">Organisers</option>
                        <option value="student">Students</option>
                    </select>
                </div>
            </div>

            <p className="text-gray-500 text-xs mb-3">
                Showing {filtered.length} user{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Data table */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <th className="text-left text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider">User</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider hidden md:table-cell">Email</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider">Role</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider hidden lg:table-cell">Onboarded</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider hidden lg:table-cell">Joined</th>
                                <th className="text-right text-gray-400 font-medium px-4 py-3 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06]/50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((user) => {
                                    const role = user.role || "student";
                                    const roleCfg = ROLE_CONFIG[role] || ROLE_CONFIG.student;
                                    const RoleIcon = roleCfg.icon;
                                    const isLoading = actionLoading === user._id;

                                    return (
                                        <tr key={user._id} className="hover:bg-white/[0.03] transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {user.imageUrl ? (
                                                        <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-white text-xs font-bold">
                                                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                                                        </div>
                                                    )}
                                                    <p className="text-white font-medium">{user.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <p className="text-gray-400 text-sm flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${roleCfg.color}`}>
                                                    <RoleIcon className="w-3 h-3" />
                                                    {roleCfg.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                {user.hasCompletedOnboarding ? (
                                                    <span className="text-green-400 text-xs flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Yes
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-600 text-xs">No</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {role === "student" ? (
                                                    <button
                                                        onClick={() => handleRoleChange(user._id, "organiser")}
                                                        disabled={isLoading}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors disabled:opacity-50"
                                                    >
                                                        <UserCog className="w-3 h-3" />
                                                        Promote
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRoleChange(user._id, "student")}
                                                        disabled={isLoading}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/20 transition-colors disabled:opacity-50"
                                                    >
                                                        <ArrowUpDown className="w-3 h-3" />
                                                        Demote
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
