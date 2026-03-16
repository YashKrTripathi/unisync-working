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

function generateEventCode(title, timestamp) {
    const base = title
        .toUpperCase()
        .replace(/[^A-Z0-9 ]/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
        .map((part) => part.slice(0, 2))
        .join("");

    const fallback = "EVT";
    const prefix = (base || fallback).slice(0, 6);
    const suffix = String(timestamp).slice(-4);
    return `${prefix}${suffix}`;
}

// One-time migration: add eventCode to older events.
export const addEventCodesToExistingEvents = internalMutation({
    handler: async (ctx) => {
        const events = await ctx.db.query("events").collect();
        let updated = 0;
        const usedCodes = new Set(events.map((event) => event.eventCode).filter(Boolean));

        for (const event of events) {
            if (event.eventCode) continue;

            let eventCode = generateEventCode(event.title, event.createdAt || Date.now());
            let attempt = 0;
            while (usedCodes.has(eventCode) && attempt < 50) {
                attempt += 1;
                eventCode = generateEventCode(event.title, (event.createdAt || Date.now()) + attempt);
            }

            await ctx.db.patch(event._id, { eventCode });
            usedCodes.add(eventCode);
            updated++;
        }

        return { updated, total: events.length };
    },
});
