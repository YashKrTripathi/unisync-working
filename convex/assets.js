import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all assets (organiser only)
export const getAssets = query({
    args: {
        category: v.optional(
            v.union(
                v.literal("hero_slider"),
                v.literal("event_cover"),
                v.literal("logo"),
                v.literal("gallery")
            )
        ),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        if (!user || (user.role || "student") !== "organiser") {
            return [];
        }

        if (args.category) {
            return await ctx.db
                .query("assets")
                .withIndex("by_category", (q) => q.eq("category", args.category))
                .order("desc")
                .collect();
        }

        return await ctx.db
            .query("assets")
            .withIndex("by_created")
            .order("desc")
            .collect();
    },
});

// Create a new asset (organiser only)
export const createAsset = mutation({
    args: {
        url: v.string(),
        title: v.string(),
        category: v.union(
            v.literal("hero_slider"),
            v.literal("event_cover"),
            v.literal("logo"),
            v.literal("gallery")
        ),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        if (!user || (user.role || "student") !== "organiser") {
            throw new Error("Unauthorized: Only organisers can manage assets");
        }

        return await ctx.db.insert("assets", {
            url: args.url,
            title: args.title,
            category: args.category,
            uploadedBy: user._id,
            uploaderName: user.name,
            createdAt: Date.now(),
        });
    },
});

// Delete an asset (organiser only)
export const deleteAsset = mutation({
    args: {
        assetId: v.id("assets"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        if (!user || (user.role || "student") !== "organiser") {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.assetId);
        return { success: true };
    },
});
