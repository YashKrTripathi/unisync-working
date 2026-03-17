import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all settings (organiser only)
export const getAllSettings = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        if (!user || (user.role || "student") !== "organiser") {
            return {};
        }

        const settings = await ctx.db.query("settings").collect();
        const map = {};
        for (const s of settings) {
            map[s.key] = s.value;
        }
        return map;
    },
});

// Get a single setting by key
export const getSetting = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        const setting = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();
        return setting?.value ?? null;
    },
});

// Update a setting (organiser only)
export const updateSetting = mutation({
    args: {
        key: v.string(),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        if (!user || (user.role || "student") !== "organiser") {
            throw new Error("Unauthorized: Only organisers can change settings");
        }

        const existing = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                value: args.value,
                updatedAt: Date.now(),
                updatedBy: user._id,
            });
        } else {
            await ctx.db.insert("settings", {
                key: args.key,
                value: args.value,
                updatedAt: Date.now(),
                updatedBy: user._id,
            });
        }

        return { success: true };
    },
});
