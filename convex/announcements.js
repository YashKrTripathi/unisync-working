import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all announcements (organiser only)
export const getAnnouncements = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        if (!user || (user.role || "student") !== "organiser") {
            return [];
        }

        const announcements = await ctx.db
            .query("announcements")
            .withIndex("by_created")
            .order("desc")
            .collect();

        // Enrich with event names for event_attendees type
        const enriched = await Promise.all(
            announcements.map(async (a) => {
                let targetEventTitle = null;
                if (a.targetEventId) {
                    const event = await ctx.db.get(a.targetEventId);
                    targetEventTitle = event?.title || "Deleted Event";
                }
                return { ...a, targetEventTitle };
            })
        );

        return enriched;
    },
});

// Create a new announcement (organiser only)
export const createAnnouncement = mutation({
    args: {
        title: v.string(),
        message: v.string(),
        targetType: v.union(
            v.literal("all"),
            v.literal("organisers"),
            v.literal("students"),
            v.literal("event_attendees")
        ),
        targetEventId: v.optional(v.id("events")),
        priority: v.union(
            v.literal("low"),
            v.literal("normal"),
            v.literal("high"),
            v.literal("urgent")
        ),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        if (!user || (user.role || "student") !== "organiser") {
            throw new Error("Unauthorized: Only organisers can create announcements");
        }

        return await ctx.db.insert("announcements", {
            title: args.title,
            message: args.message,
            targetType: args.targetType,
            targetEventId: args.targetEventId,
            priority: args.priority,
            createdBy: user._id,
            creatorName: user.name,
            createdAt: Date.now(),
        });
    },
});

// Delete an announcement (organiser only)
export const deleteAnnouncement = mutation({
    args: {
        announcementId: v.id("announcements"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        if (!user || (user.role || "student") !== "organiser") {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.announcementId);
        return { success: true };
    },
});
