import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * DEV ONLY: Switch the current user's role for testing.
 * This lets you quickly test both roles (student, organiser)
 * without needing multiple Clerk accounts.
 *
 * Usage: Call this mutation from the Convex dashboard or via the DevRoleSwitcher component.
 */
export const setMyRole = mutation({
    args: {
        role: v.union(
            v.literal("student"),
            v.literal("organiser")
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found in database. Sign in first.");
        }

        await ctx.db.patch(user._id, {
            role: args.role,
            updatedAt: Date.now(),
        });

        return { success: true, newRole: args.role, userName: user.name };
    },
});
