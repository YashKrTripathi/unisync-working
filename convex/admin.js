import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Get all organiser users (for team management) — uses by_role index
export const getAdminUsers = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        const role = user?.role || "student";
        if (!user || !["organiser", "superadmin", "owner"].includes(role)) {
            return [];
        }

        // Use index instead of collecting all users
        const organisers = await ctx.db
            .query("users")
            .withIndex("by_role")
            .filter((q) =>
                q.or(
                    q.eq(q.field("role"), "organiser"),
                    q.eq(q.field("role"), "superadmin"),
                    q.eq(q.field("role"), "owner")
                )
            )
            .take(100);

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

        const ownerEmails = (
            process.env.OWNER_EMAILS ||
            process.env.OWNER_EMAIL ||
            ""
        )
            .toLowerCase()
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean);

        const isOwnerByEmail = identity.email && ownerEmails.includes(identity.email.toLowerCase());
        const role = isOwnerByEmail ? "owner" : (user?.role || "student");

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
            user: user || { name: identity.name, email: identity.email },
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

        if (args.role === "superadmin" && role !== "owner") {
            throw new Error("Only the Owner can assign superadmin");
        }

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

// Get aggregated dashboard stats — bounded queries instead of full scans
export const getDashboardStats = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        const role = user?.role || "student";
        if (!user || !["organiser", "superadmin", "owner"].includes(role)) {
            return null;
        }

        const now = Date.now();
        const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;

        // Use bounded queries instead of collecting everything
        const allEvents = await ctx.db.query("events").withIndex("by_start_date").take(500);

        const liveEvents = allEvents.filter(
            (e) => e.startDate <= now && e.endDate >= now
        );
        const upcomingEvents = allEvents.filter(
            (e) => e.startDate > now && e.startDate <= sevenDaysFromNow
        );

        // For revenue, only query paid events' registrations (targeted)
        let totalRevenue = 0;
        let monthlyRevenue = 0;
        let totalRegistrations = 0;
        let totalCheckedIn = 0;

        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);
        const monthStartMs = thisMonthStart.getTime();

        const paidEvents = allEvents.filter(
            (e) => e.ticketType === "paid" && e.ticketPrice
        );

        // Process registrations per event (indexed) instead of scanning all
        for (const event of paidEvents) {
            const regs = await ctx.db
                .query("registrations")
                .withIndex("by_event", (q) => q.eq("eventId", event._id))
                .filter((q) =>
                    q.and(
                        q.eq(q.field("status"), "confirmed"),
                        q.eq(q.field("checkedIn"), true)
                    )
                )
                .take(event.capacity || 5000);

            totalRevenue += regs.length * event.ticketPrice;

            const monthlyRegs = regs.filter(
                (r) => r.registeredAt >= monthStartMs
            );
            monthlyRevenue += monthlyRegs.length * event.ticketPrice;
        }

        // Overall registration counts (bounded)
        const allRegs = await ctx.db.query("registrations").take(10000);
        totalRegistrations = allRegs.filter((r) => r.status === "confirmed").length;
        totalCheckedIn = allRegs.filter((r) => r.checkedIn && r.status === "confirmed").length;

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
