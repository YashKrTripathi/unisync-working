import { query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// ─── Helper: verify admin access ────────────────────────────────────────────
async function requireAdmin(ctx) {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const role = user?.role || "student";
    if (!user || (role !== "superadmin" && role !== "admin")) {
        throw new Error("Unauthorized: Admin access required");
    }
    return { user, role };
}

// ─── Simple event list for dropdown ─────────────────────────────────────────
export const getEventList = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const events = await ctx.db.query("events").order("desc").collect();
        return events.map((e) => ({
            _id: e._id,
            title: e.title,
            startDate: e.startDate,
            category: e.category,
            status: e.status || "approved",
        }));
    },
});

// ─── Aggregated platform-wide analytics ─────────────────────────────────────
export const getAggregatedAnalytics = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);

        const allEvents = await ctx.db.query("events").collect();
        const allRegistrations = await ctx.db.query("registrations").collect();

        // 1. Total counts
        const totalEvents = allEvents.length;
        const activeEvents = allEvents.filter(
            (e) => (e.status || "approved") === "live"
        ).length;
        const upcomingEvents = allEvents.filter(
            (e) =>
                ((e.status || "approved") === "approved") &&
                e.startDate > Date.now()
        ).length;
        const completedEvents = allEvents.filter(
            (e) =>
                (e.status || "approved") === "completed" || e.endDate < Date.now()
        ).length;

        // 2. Registration stats
        const confirmedRegs = allRegistrations.filter(
            (r) => r.status === "confirmed"
        );
        const totalRegistrations = confirmedRegs.length;
        const totalAttended = confirmedRegs.filter((r) => r.checkedIn).length;
        const attendanceRate =
            totalRegistrations > 0
                ? Math.round((totalAttended / totalRegistrations) * 100)
                : 0;

        // 3. Revenue (sum of ticketPrice * checkedIn registrations per paid event)
        const paidEventMap = {};
        allEvents.forEach((e) => {
            if (e.ticketType === "paid" && e.ticketPrice) {
                paidEventMap[e._id] = e.ticketPrice;
            }
        });
        let totalRevenue = 0;
        confirmedRegs.forEach((r) => {
            if (paidEventMap[r.eventId]) {
                totalRevenue += paidEventMap[r.eventId];
            }
        });

        // 4. Month-over-month comparison (this month vs last month registrations)
        const now = new Date();
        const thisMonthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        ).getTime();
        const lastMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        ).getTime();
        const thisMonthRegs = confirmedRegs.filter(
            (r) => r.registeredAt >= thisMonthStart
        ).length;
        const lastMonthRegs = confirmedRegs.filter(
            (r) =>
                r.registeredAt >= lastMonthStart &&
                r.registeredAt < thisMonthStart
        ).length;
        const regGrowth =
            lastMonthRegs > 0
                ? Math.round(
                    ((thisMonthRegs - lastMonthRegs) / lastMonthRegs) * 100
                )
                : thisMonthRegs > 0
                    ? 100
                    : 0;

        // 5. Registrations trend — last 6 months
        const registrationsTrend = [];
        for (let i = 5; i >= 0; i--) {
            const mStart = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            ).getTime();
            const mEnd = new Date(
                now.getFullYear(),
                now.getMonth() - i + 1,
                1
            ).getTime();
            const count = confirmedRegs.filter(
                (r) => r.registeredAt >= mStart && r.registeredAt < mEnd
            ).length;
            const label = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            ).toLocaleDateString("en-US", { month: "short" });
            registrationsTrend.push({ month: label, registrations: count });
        }

        // 6. Revenue by category
        const categoryRevenue = {};
        allEvents.forEach((e) => {
            const cat = e.category || "other";
            if (!categoryRevenue[cat]) categoryRevenue[cat] = 0;
        });
        confirmedRegs.forEach((r) => {
            const event = allEvents.find((e) => e._id === r.eventId);
            if (event) {
                const cat = event.category || "other";
                if (event.ticketType === "paid" && event.ticketPrice) {
                    categoryRevenue[cat] += event.ticketPrice;
                }
            }
        });
        const revenueByCategory = Object.entries(categoryRevenue)
            .map(([name, value]) => ({ name, value }))
            .filter((c) => c.value > 0);

        // 7. Monthly event count (last 6 months)
        const monthlyEvents = [];
        for (let i = 5; i >= 0; i--) {
            const mStart = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            ).getTime();
            const mEnd = new Date(
                now.getFullYear(),
                now.getMonth() - i + 1,
                1
            ).getTime();
            const count = allEvents.filter(
                (e) => e.createdAt >= mStart && e.createdAt < mEnd
            ).length;
            const label = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            ).toLocaleDateString("en-US", { month: "short" });
            monthlyEvents.push({ month: label, events: count });
        }

        // 8. Events by category (for pie)
        const eventsByCategory = {};
        allEvents.forEach((e) => {
            const cat = e.category || "other";
            eventsByCategory[cat] = (eventsByCategory[cat] || 0) + 1;
        });
        const eventsByCategoryArr = Object.entries(eventsByCategory).map(
            ([name, value]) => ({ name, value })
        );

        return {
            totalEvents,
            activeEvents,
            upcomingEvents,
            completedEvents,
            totalRegistrations,
            totalAttended,
            attendanceRate,
            totalRevenue,
            thisMonthRegs,
            lastMonthRegs,
            regGrowth,
            registrationsTrend,
            revenueByCategory,
            monthlyEvents,
            eventsByCategory: eventsByCategoryArr,
        };
    },
});

// ─── Event-wise analytics drilldown ─────────────────────────────────────────
export const getEventAnalytics = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const event = await ctx.db.get(args.eventId);
        if (!event) throw new Error("Event not found");

        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        const confirmed = registrations.filter(
            (r) => r.status === "confirmed"
        );
        const cancelled = registrations.filter(
            (r) => r.status === "cancelled"
        );
        const checkedIn = confirmed.filter((r) => r.checkedIn);

        const totalRegistered = confirmed.length;
        const totalAttended = checkedIn.length;
        const totalCancelled = cancelled.length;
        const attendanceRate =
            totalRegistered > 0
                ? Math.round((totalAttended / totalRegistered) * 100)
                : 0;

        // Revenue
        let totalRevenue = 0;
        if (event.ticketType === "paid" && event.ticketPrice) {
            totalRevenue = confirmed.length * event.ticketPrice;
        }

        // Registration timeline — cumulative registrations over time
        // Group by day
        const sorted = [...confirmed].sort(
            (a, b) => a.registeredAt - b.registeredAt
        );
        const timelineMap = {};
        let cumulative = 0;
        sorted.forEach((r) => {
            const day = new Date(r.registeredAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            cumulative++;
            timelineMap[day] = cumulative;
        });
        const registrationTimeline = Object.entries(timelineMap).map(
            ([date, count]) => ({ date, registrations: count })
        );

        // Daily registration counts (not cumulative)
        const dailyMap = {};
        confirmed.forEach((r) => {
            const day = new Date(r.registeredAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            dailyMap[day] = (dailyMap[day] || 0) + 1;
        });
        const dailyRegistrations = Object.entries(dailyMap).map(
            ([date, count]) => ({ date, count })
        );

        // Peak day
        let peakDay = null;
        let peakCount = 0;
        Object.entries(dailyMap).forEach(([day, count]) => {
            if (count > peakCount) {
                peakDay = day;
                peakCount = count;
            }
        });

        // Average daily rate
        const daySpan = registrationTimeline.length || 1;
        const avgDailyRate = Math.round((totalRegistered / daySpan) * 10) / 10;

        return {
            event: {
                _id: event._id,
                title: event.title,
                category: event.category,
                startDate: event.startDate,
                endDate: event.endDate,
                capacity: event.capacity,
                ticketType: event.ticketType,
                ticketPrice: event.ticketPrice,
                status: event.status || "approved",
            },
            totalRegistered,
            totalAttended,
            totalCancelled,
            attendanceRate,
            totalRevenue,
            capacityUtilization:
                event.capacity > 0
                    ? Math.round((totalRegistered / event.capacity) * 100)
                    : 0,
            registrationTimeline,
            dailyRegistrations,
            peakDay,
            peakCount,
            avgDailyRate,
        };
    },
});
