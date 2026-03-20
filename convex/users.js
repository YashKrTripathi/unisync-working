import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store or update user from Clerk
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    // Promote owner by email if configured (supports comma-separated list)
    const ownerEmails = (
      process.env.OWNER_EMAILS ||
      process.env.OWNER_EMAIL ||
      ""
    )
      .toLowerCase()
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (user !== null) {
      // If we've seen this identity before but details changed, update them
      const updates = {};
      if (user.name !== identity.name) {
        updates.name = identity.name ?? "Anonymous";
      }
      if (user.email !== identity.email) {
        updates.email = identity.email ?? "";
      }
      if (user.imageUrl !== identity.pictureUrl) {
        updates.imageUrl = identity.pictureUrl;
      }
      if (
        ownerEmails.length &&
        identity.email &&
        ownerEmails.includes(identity.email.toLowerCase()) &&
        user.role !== "owner"
      ) {
        updates.role = "owner";
      }

      if (Object.keys(updates).length > 0) {
        updates.updatedAt = Date.now();
        await ctx.db.patch(user._id, updates);
      }

      return user._id;
    }

    // If it's a new identity, create a new user with defaults
    const initialRole =
      ownerEmails.length && identity.email && ownerEmails.includes(identity.email.toLowerCase())
        ? "owner"
        : "student";

    return await ctx.db.insert("users", {
      email: identity.email ?? "",
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name ?? "Anonymous",
      imageUrl: identity.pictureUrl,
      role: initialRole,
      hasCompletedOnboarding: false,
      freeEventsCreated: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get current authenticated user
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // 🔹 Lookup by tokenIdentifier
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      return null;
    }

    return user;
  },
});

// Complete onboarding (attendee preferences)
export const completeOnboarding = mutation({
  args: {
    location: v.object({
      city: v.string(),
      state: v.optional(v.string()), // Added state field
      country: v.string(),
    }),
    interests: v.array(v.string()), // Min 3 categories
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    await ctx.db.patch(user._id, {
      location: args.location,
      interests: args.interests,
      hasCompletedOnboarding: true,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});
