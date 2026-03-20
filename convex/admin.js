import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Get all organiser users (for team management)
export const getAdminUsers = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        const role = user?.role || "student";
        if (!user || !["organiser", "superadmin", "owner"].includes(role)) {
            return [];
        }

        const organisers = await ctx.db
            .query("users")
            .collect()
            .then((users) =>
                users.filter((u) => ["organiser", "superadmin", "owner"].includes(u.role || "student"))
            );

        return organisers;
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
            isOrganiser: role === "organiser",
            isSuperAdmin: role === "superadmin" || role === "owner",
            isOwner: role === "owner",
            isAdmin: ["organiser", "superadmin", "owner"].includes(role),
            canAccessAdminPanel: ["organiser", "superadmin", "owner"].includes(role),
            canCreateEvents: ["organiser", "superadmin", "owner"].includes(role),
            role,
            roleLabel: role === "owner" ? "owner" : role === "superadmin" ? "superadmin" : role,
            user,
        };
    },
});

// Set user role (Organiser only)
export const setUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.union(
            v.literal("student"),
            v.literal("organiser"),
            v.literal("superadmin"),
        ),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
        const role = currentUser?.role || "student";
        if (!currentUser || !["owner", "superadmin"].includes(role)) {
            throw new Error("Unauthorized: Only Owner/Superadmin can change roles");
        }

        // Only the owner can promote/demote to superadmin
        if (args.role === "superadmin" && role !== "owner") {
            throw new Error("Only the Owner can assign superadmin");
        }

        // Protect owner account from being overwritten
        const target = await ctx.db.get(args.userId);
        if (target?.role === "owner") {
            throw new Error("Owner role cannot be changed");
        }

        await ctx.db.patch(args.userId, {
            role: args.role,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Get aggregated dashboard stats (for organiser dashboard)
export const getDashboardStats = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        const role = user?.role || "student";
        if (!user || role !== "organiser") {
            return null;
        }

        // Get all events
        const allEvents = await ctx.db.query("events").collect();

        // Get all registrations
        const allRegistrations = await ctx.db.query("registrations").collect();

        const now = Date.now();
        const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;

        // Live/Active events
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
