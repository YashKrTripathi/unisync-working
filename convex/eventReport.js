import { internal } from "./_generated/api";
import { query } from "./_generated/server";
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

// ─── Get full event report data for PDF/Word generation ─────────────────────
export const getEventReportData = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const event = await ctx.db.get(args.eventId);
        if (!event) throw new Error("Event not found");

        // Fetch organizer details
        const organizer = await ctx.db.get(event.organizerId);

        // Fetch all registrations for this event
        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        const confirmed = registrations.filter((r) => r.status === "confirmed");
        const cancelled = registrations.filter((r) => r.status === "cancelled");
        const checkedIn = confirmed.filter((r) => r.checkedIn);

        const revenue =
            event.ticketType === "paid" && event.ticketPrice
                ? checkedIn.length * event.ticketPrice
                : 0;

        // Compute effective status
        let effectiveStatus = event.status || "approved";
        const now = Date.now();
        if (effectiveStatus === "approved") {
            if (event.startDate <= now && event.endDate >= now) {
                effectiveStatus = "live";
            } else if (event.endDate < now) {
                effectiveStatus = "completed";
            }
        }

        // Audit log
        const auditLog = await ctx.db
            .query("eventAuditLog")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .order("desc")
            .collect();

        return {
            // 1. Basic Event Details
            event: {
                _id: event._id,
                title: event.title,
                description: event.description,
                category: event.category,
                tags: event.tags,
                startDate: event.startDate,
                endDate: event.endDate,
                timezone: event.timezone,
                locationType: event.locationType,
                venue: event.venue || "N/A",
                address: event.address || "N/A",
                city: event.city,
                state: event.state || "",
                country: event.country,
                capacity: event.capacity,
                ticketType: event.ticketType,
                ticketPrice: event.ticketPrice || 0,
                status: effectiveStatus,
                coverImage: event.coverImage || null,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
            },

            // Organizer
            organizer: {
                name: organizer?.name || event.organizerName || "Unknown",
                email: organizer?.email || "N/A",
                role: organizer?.role || "organiser",
            },

            // Statistics
            stats: {
                totalRegistrations: confirmed.length,
                totalCheckedIn: checkedIn.length,
                totalCancelled: cancelled.length,
                attendanceRate:
                    confirmed.length > 0
                        ? Math.round((checkedIn.length / confirmed.length) * 100)
                        : 0,
                revenue,
                capacity: event.capacity,
                capacityUtilization:
                    event.capacity > 0
                        ? Math.round((confirmed.length / event.capacity) * 100)
                        : 0,
            },

            // Attendance record (participant list)
            attendees: confirmed.map((r) => ({
                name: r.attendeeName,
                email: r.attendeeEmail,
                checkedIn: r.checkedIn,
                checkedInAt: r.checkedInAt || null,
                registeredAt: r.registeredAt,
            })),

            // Audit log
            auditLog: auditLog.map((log) => ({
                action: log.action,
                field: log.field || "",
                oldValue: log.oldValue || "",
                newValue: log.newValue || "",
                userName: log.userName,
                reason: log.reason || "",
                timestamp: log.timestamp,
            })),
        };
    },
});

// ─── Get all events for report selector dropdown ────────────────────────────
export const getEventsForReportSelector = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);

        const events = await ctx.db.query("events").order("desc").collect();

        return events.map((e) => ({
            _id: e._id,
            title: e.title,
            category: e.category,
            startDate: e.startDate,
            status: e.status || "approved",
            organizerName: e.organizerName,
        }));
    },
});
