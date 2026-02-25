import { internalMutation } from "./_generated/server";

// One-time migration: migrate roles to new 5-role system
// Maps null/"user" → "student"
export const migrateUserRoles = internalMutation({
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        let updated = 0;

        for (const user of users) {
            if (!user.role || user.role === "user") {
                await ctx.db.patch(user._id, { role: "student" });
                updated++;
            }
        }

        return { updated, total: users.length };
    },
});

// One-time migration: add 'status' field to existing events
export const addStatusToExistingEvents = internalMutation({
    handler: async (ctx) => {
        const events = await ctx.db.query("events").collect();
        let updated = 0;

        for (const event of events) {
            if (!event.status) {
                await ctx.db.patch(event._id, { status: "approved" });
                updated++;
            }
        }

        return { updated, total: events.length };
    },
});
