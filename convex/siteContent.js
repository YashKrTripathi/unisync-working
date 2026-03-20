import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// ─── Public query: get page content by pageId ───
export const getPageContent = query({
  args: { pageId: v.string() },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("siteContent")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .unique();
    if (!doc) return null;
    try {
      return JSON.parse(doc.content);
    } catch {
      return null;
    }
  },
});

// ─── Mutation: update page content (superadmin/owner only) ───
export const updatePageContent = mutation({
  args: {
    pageId: v.string(),
    content: v.string(), // JSON string
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
    const role = currentUser?.role || "student";
    if (!currentUser || !["superadmin", "owner"].includes(role)) {
      throw new Error("Unauthorized: Only SuperAdmin/Owner can edit site content");
    }

    // Validate JSON
    try {
      JSON.parse(args.content);
    } catch {
      throw new Error("Invalid JSON content");
    }

    const existing = await ctx.db
      .query("siteContent")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        updatedAt: Date.now(),
        updatedBy: currentUser._id,
      });
    } else {
      await ctx.db.insert("siteContent", {
        pageId: args.pageId,
        content: args.content,
        updatedAt: Date.now(),
        updatedBy: currentUser._id,
      });
    }

    return { success: true };
  },
});

// ─── Query: get all site content (for admin panel) ───
export const getAllContent = query({
  handler: async (ctx) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
    const role = currentUser?.role || "student";
    if (!currentUser || !["superadmin", "owner"].includes(role)) {
      return [];
    }

    const docs = await ctx.db.query("siteContent").collect();
    return docs.map((doc) => {
      let parsed = null;
      try {
        parsed = JSON.parse(doc.content);
      } catch {
        parsed = null;
      }
      return {
        ...doc,
        parsedContent: parsed,
      };
    });
  },
});
