import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// ─── Helper: verify admin access ────────────────────────────────────────────
async function requireAdmin(ctx) {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const role = user?.role || "user";
    if (!user || (role !== "superadmin" && role !== "admin")) {
        throw new Error("Unauthorized: Admin access required");
    }
    return { user, role };
}

async function requireSuperAdmin(ctx) {
    const { user, role } = await requireAdmin(ctx);
    if (role !== "superadmin") {
        throw new Error("Unauthorized: SuperAdmin access required");
    }
    return { user, role };
}

// ─── Queries ────────────────────────────────────────────────────────────────

// Get all events for admin listing (with registration count & revenue)
export const getAllEvents = query({
    args: {
        searchTerm: v.optional(v.string()),
        status: v.optional(v.string()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        let events;

        // Use search index if there's a search term
        if (args.searchTerm && args.searchTerm.trim().length > 0) {
            events = await ctx.db
                .query("events")
                .withSearchIndex("search_title", (q) =>
                    q.search("title", args.searchTerm)
                )
                .collect();
        } else {
            events = await ctx.db.query("events").order("desc").collect();
        }

        // Apply filters client-side (Convex doesn't support compound filter + search)
        if (args.status && args.status !== "all") {
            events = events.filter((e) => (e.status || "approved") === args.status);
        }
        if (args.category && args.category !== "all") {
            events = events.filter((e) => e.category === args.category);
        }

        // Fetch all registrations once for revenue calculation
        const allRegistrations = await ctx.db.query("registrations").collect();

        // Enrich events with registration/revenue data
        const enrichedEvents = events.map((event) => {
            const eventRegs = allRegistrations.filter(
                (r) => r.eventId === event._id
            );
            const confirmedRegs = eventRegs.filter((r) => r.status === "confirmed");
            const checkedIn = confirmedRegs.filter((r) => r.checkedIn);
            const revenue =
                event.ticketType === "paid" && event.ticketPrice
                    ? checkedIn.length * event.ticketPrice
                    : 0;

            // Compute effective status based on dates if no explicit status
            let effectiveStatus = event.status || "approved";
            const now = Date.now();
            if (effectiveStatus === "approved") {
                if (event.startDate <= now && event.endDate >= now) {
                    effectiveStatus = "live";
                } else if (event.endDate < now) {
                    effectiveStatus = "completed";
                }
            }

            return {
                ...event,
                effectiveStatus,
                totalRegistrations: confirmedRegs.length,
                totalCheckedIn: checkedIn.length,
                revenue,
            };
        });

        return enrichedEvents;
    },
});

// Get a single event with full stats for the detail page
export const getEventWithStats = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const event = await ctx.db.get(args.eventId);
        if (!event) throw new Error("Event not found");

        // Registrations for this event
        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        const confirmed = registrations.filter((r) => r.status === "confirmed");
        const checkedIn = confirmed.filter((r) => r.checkedIn);
        const cancelled = registrations.filter((r) => r.status === "cancelled");
        const revenue =
            event.ticketType === "paid" && event.ticketPrice
                ? checkedIn.length * event.ticketPrice
                : 0;

        // Audit log
        const auditLog = await ctx.db
            .query("eventAuditLog")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .order("desc")
            .collect();

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

        return {
            ...event,
            effectiveStatus,
            stats: {
                totalRegistrations: confirmed.length,
                totalCheckedIn: checkedIn.length,
                totalCancelled: cancelled.length,
                revenue,
                attendanceRate:
                    confirmed.length > 0
                        ? Math.round((checkedIn.length / confirmed.length) * 100)
                        : 0,
            },
            registrations: confirmed.map((r) => ({
                _id: r._id,
                attendeeName: r.attendeeName,
                attendeeEmail: r.attendeeEmail,
                checkedIn: r.checkedIn,
                checkedInAt: r.checkedInAt,
                registeredAt: r.registeredAt,
                status: r.status,
            })),
            auditLog,
        };
    },
});

// Get audit log for an event
export const getEventAuditLog = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        return await ctx.db
            .query("eventAuditLog")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .order("desc")
            .collect();
    },
});

// ─── Mutations ──────────────────────────────────────────────────────────────

// Update event status (approve / reject / change status)
export const updateEventStatus = mutation({
    args: {
        eventId: v.id("events"),
        status: v.union(
            v.literal("draft"),
            v.literal("pending"),
            v.literal("approved"),
            v.literal("live"),
            v.literal("completed"),
            v.literal("cancelled")
        ),
        reason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAdmin(ctx);

        const event = await ctx.db.get(args.eventId);
        if (!event) throw new Error("Event not found");

        const oldStatus = event.status || "approved";

        // Require reason for rejection
        if (args.status === "cancelled" && !args.reason) {
            throw new Error("A reason is required when cancelling an event");
        }

        // Update event
        await ctx.db.patch(args.eventId, {
            status: args.status,
            updatedAt: Date.now(),
        });

        // Create audit log entry
        await ctx.db.insert("eventAuditLog", {
            eventId: args.eventId,
            userId: user._id,
            userName: user.name,
            action: "status_change",
            field: "status",
            oldValue: oldStatus,
            newValue: args.status,
            reason: args.reason,
            timestamp: Date.now(),
        });

        return { success: true };
    },
});

// SuperAdmin-only: Edit event dates and critical fields
export const superAdminEditEvent = mutation({
    args: {
        eventId: v.id("events"),
        startDate: v.optional(v.number()),
        endDate: v.optional(v.number()),
        status: v.optional(
            v.union(
                v.literal("draft"),
                v.literal("pending"),
                v.literal("approved"),
                v.literal("live"),
                v.literal("completed"),
                v.literal("cancelled")
            )
        ),
        title: v.optional(v.string()),
        capacity: v.optional(v.number()),
        reason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { user } = await requireSuperAdmin(ctx);

        const event = await ctx.db.get(args.eventId);
        if (!event) throw new Error("Event not found");

        const updates = {};
        const auditEntries = [];

        // Track each field change
        if (args.startDate !== undefined && args.startDate !== event.startDate) {
            updates.startDate = args.startDate;
            auditEntries.push({
                field: "startDate",
                oldValue: new Date(event.startDate).toISOString(),
                newValue: new Date(args.startDate).toISOString(),
            });
        }
        if (args.endDate !== undefined && args.endDate !== event.endDate) {
            updates.endDate = args.endDate;
            auditEntries.push({
                field: "endDate",
                oldValue: new Date(event.endDate).toISOString(),
                newValue: new Date(args.endDate).toISOString(),
            });
        }
        if (args.status !== undefined && args.status !== (event.status || "approved")) {
            updates.status = args.status;
            auditEntries.push({
                field: "status",
                oldValue: event.status || "approved",
                newValue: args.status,
            });
        }
        if (args.title !== undefined && args.title !== event.title) {
            updates.title = args.title;
            auditEntries.push({
                field: "title",
                oldValue: event.title,
                newValue: args.title,
            });
        }
        if (args.capacity !== undefined && args.capacity !== event.capacity) {
            updates.capacity = args.capacity;
            auditEntries.push({
                field: "capacity",
                oldValue: String(event.capacity),
                newValue: String(args.capacity),
            });
        }

        // Validate dates
        const newStartDate = updates.startDate || event.startDate;
        const newEndDate = updates.endDate || event.endDate;
        if (newEndDate < newStartDate) {
            throw new Error("End date must be after start date");
        }

        if (Object.keys(updates).length === 0) {
            return { success: true, message: "No changes detected" };
        }

        updates.updatedAt = Date.now();
        await ctx.db.patch(args.eventId, updates);

        // Create audit log entries for each changed field
        for (const entry of auditEntries) {
            await ctx.db.insert("eventAuditLog", {
                eventId: args.eventId,
                userId: user._id,
                userName: user.name,
                action: "date_edit",
                field: entry.field,
                oldValue: entry.oldValue,
                newValue: entry.newValue,
                reason: args.reason,
                timestamp: Date.now(),
            });
        }

        return { success: true, changedFields: auditEntries.length };
    },
});

// Bulk update event status
export const bulkUpdateEventStatus = mutation({
    args: {
        eventIds: v.array(v.id("events")),
        status: v.union(
            v.literal("approved"),
            v.literal("cancelled"),
            v.literal("pending")
        ),
        reason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAdmin(ctx);

        let updated = 0;
        for (const eventId of args.eventIds) {
            const event = await ctx.db.get(eventId);
            if (!event) continue;

            const oldStatus = event.status || "approved";
            await ctx.db.patch(eventId, {
                status: args.status,
                updatedAt: Date.now(),
            });

            await ctx.db.insert("eventAuditLog", {
                eventId,
                userId: user._id,
                userName: user.name,
                action: "bulk_status_change",
                field: "status",
                oldValue: oldStatus,
                newValue: args.status,
                reason: args.reason,
                timestamp: Date.now(),
            });

            updated++;
        }

        return { success: true, updated };
    },
});
