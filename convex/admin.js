import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Get all non-student users (for team management)
export const getAdminUsers = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        const role = user?.role || "student";
        if (!user || (role !== "superadmin" && role !== "admin")) {
            throw new Error("Unauthorized: Admin access required");
        }

        const superadmins = await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", "superadmin"))
            .collect();

        const admins = await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", "admin"))
            .collect();

        const organisers = await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", "organiser"))
            .collect();

        const teachers = await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", "teacher"))
            .collect();

        return [...superadmins, ...admins, ...organisers, ...teachers];
    },
});

// Check current user's role and permissions
export const isAdmin = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return { isAdmin: false, canAccessAdminPanel: false, canCreateEvents: false, role: null };

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) return { isAdmin: false, canAccessAdminPanel: false, canCreateEvents: false, role: null };

        const role = user.role || "student";
        return {
            isStudent: role === "student",
            isTeacher: role === "teacher",
            isOrganiser: role === "organiser",
            isAdmin: role === "admin" || role === "superadmin",
            isSuperAdmin: role === "superadmin",
            canAccessAdminPanel: role === "admin" || role === "superadmin",
            canCreateEvents: ["organiser", "admin", "superadmin"].includes(role),
            role,
            user,
        };
    },
});

// Set user role (SuperAdmin only)
export const setUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.union(
            v.literal("student"),
            v.literal("teacher"),
            v.literal("organiser"),
            v.literal("admin"),
            v.literal("superadmin"),
        ),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
        if (!currentUser || currentUser.role !== "superadmin") {
            throw new Error("Unauthorized: Only SuperAdmin can change roles");
        }

        await ctx.db.patch(args.userId, {
            role: args.role,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Initialize first superadmin by email (one-time setup)
export const initSuperAdmin = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        // Check if any superadmin exists
        const existingSuperAdmins = await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", "superadmin"))
            .collect();

        if (existingSuperAdmins.length > 0) {
            throw new Error("A SuperAdmin already exists. Use setUserRole instead.");
        }

        // Find user by email
        const users = await ctx.db.query("users").collect();
        const targetUser = users.find((u) => u.email === args.email);

        if (!targetUser) {
            throw new Error(`User with email ${args.email} not found`);
        }

        await ctx.db.patch(targetUser._id, {
            role: "superadmin",
            updatedAt: Date.now(),
        });

        return { success: true, userId: targetUser._id };
    },
});

// Get aggregated dashboard stats (for admin dashboard)
export const getDashboardStats = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        const role = user?.role || "student";
        if (!user || (role !== "superadmin" && role !== "admin")) {
            throw new Error("Unauthorized: Admin access required");
        }

        // Get all events
        const allEvents = await ctx.db.query("events").collect();

        // Get all registrations
        const allRegistrations = await ctx.db.query("registrations").collect();

        const now = Date.now();
        const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;

        // Live/Active events (started but not ended, or starting within 7 days)
        const liveEvents = allEvents.filter(
            (e) => e.startDate <= now && e.endDate >= now
        );
        const upcomingEvents = allEvents.filter(
            (e) => e.startDate > now && e.startDate <= sevenDaysFromNow
        );

        // Aggregated revenue
        let totalRevenue = 0;
        for (const event of allEvents) {
            if (event.ticketType === "paid" && event.ticketPrice) {
                const eventRegs = allRegistrations.filter(
                    (r) => r.eventId === event._id && r.status === "confirmed" && r.checkedIn
                );
                totalRevenue += eventRegs.length * event.ticketPrice;
            }
        }

        // Monthly revenue
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);
        const monthlyRevenue = allEvents.reduce((sum, event) => {
            if (event.ticketType === "paid" && event.ticketPrice) {
                const eventRegs = allRegistrations.filter(
                    (r) =>
                        r.eventId === event._id &&
                        r.status === "confirmed" &&
                        r.checkedIn &&
                        r.registeredAt >= thisMonthStart.getTime()
                );
                return sum + eventRegs.length * event.ticketPrice;
            }
            return sum;
        }, 0);

        // Registration stats
        const totalRegistrations = allRegistrations.filter(
            (r) => r.status === "confirmed"
        ).length;
        const totalCheckedIn = allRegistrations.filter(
            (r) => r.checkedIn && r.status === "confirmed"
        ).length;

        return {
            liveEvents,
            upcomingEvents,
            totalEvents: allEvents.length,
            totalRevenue,
            monthlyRevenue,
            totalRegistrations,
            totalCheckedIn,
            attendanceRate:
                totalRegistrations > 0
                    ? Math.round((totalCheckedIn / totalRegistrations) * 100)
                    : 0,
        };
    },
});
