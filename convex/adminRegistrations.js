import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
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

// ─── Get all registrations with joined event data ───────────────────────────
export const getAllRegistrations = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);

        const registrations = await ctx.db
            .query("registrations")
            .order("desc")
            .collect();

        // Join event data
        const enriched = await Promise.all(
            registrations.map(async (reg) => {
                const event = await ctx.db.get(reg.eventId);
                return {
                    _id: reg._id,
                    attendeeName: reg.attendeeName,
                    attendeeEmail: reg.attendeeEmail,
                    status: reg.status,
                    checkedIn: reg.checkedIn,
                    checkedInAt: reg.checkedInAt,
                    registeredAt: reg.registeredAt,
                    qrCode: reg.qrCode,
                    eventId: reg.eventId,
                    eventTitle: event?.title || "Deleted Event",
                    eventDate: event?.startDate,
                    eventCategory: event?.category,
                    ticketType: event?.ticketType || "free",
                    ticketPrice: event?.ticketPrice || 0,
                };
            })
        );

        // Summary stats
        const total = registrations.length;
        const confirmed = registrations.filter((r) => r.status === "confirmed").length;
        const cancelled = registrations.filter((r) => r.status === "cancelled").length;
        const checkedIn = registrations.filter((r) => r.checkedIn && r.status === "confirmed").length;

        return {
            registrations: enriched,
            stats: { total, confirmed, cancelled, checkedIn },
        };
    },
});

// ─── Admin cancel a registration ────────────────────────────────────────────
export const adminCancelRegistration = mutation({
    args: { registrationId: v.id("registrations") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const registration = await ctx.db.get(args.registrationId);
        if (!registration) throw new Error("Registration not found");
        if (registration.status === "cancelled") throw new Error("Already cancelled");

        // Update status
        await ctx.db.patch(args.registrationId, { status: "cancelled" });

        // Decrement event registration count
        const event = await ctx.db.get(registration.eventId);
        if (event && event.registrationCount > 0) {
            await ctx.db.patch(registration.eventId, {
                registrationCount: event.registrationCount - 1,
            });
        }

        return { success: true };
    },
});

// ─── Admin check in a registration by ID ────────────────────────────────────
export const adminCheckIn = mutation({
    args: { registrationId: v.id("registrations") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const registration = await ctx.db.get(args.registrationId);
        if (!registration) throw new Error("Registration not found");
        if (registration.status !== "confirmed") throw new Error("Cannot check in a cancelled registration");
        if (registration.checkedIn) throw new Error("Already checked in");

        await ctx.db.patch(args.registrationId, {
            checkedIn: true,
            checkedInAt: Date.now(),
        });

        return { success: true };
    },
});
