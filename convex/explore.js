import { query } from "./_generated/server";
import { v } from "convex/values";

// Get featured events (high registration count, upcoming)
export const getFeaturedEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const maxFetch = Math.min((args.limit ?? 3) * 4, 50); // Fetch a small multiple, then sort

    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .order("desc")
      .take(maxFetch);

    return events
      .filter((e) => !e.status || e.status === "approved" || e.status === "live")
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, args.limit ?? 3);
  },
});

// Get events by location (city/state)
export const getEventsByLocation = query({
  args: {
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const maxFetch = Math.min((args.limit ?? 4) * 6, 60);

    let events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .take(maxFetch);

    if (args.city) {
      events = events.filter(
        (e) => e.city.toLowerCase() === args.city.toLowerCase()
      );
    } else if (args.state) {
      events = events.filter(
        (e) => e.state?.toLowerCase() === args.state.toLowerCase()
      );
    }

    return events
      .filter((e) => !e.status || e.status === "approved" || e.status === "live")
      .slice(0, args.limit ?? 4);
  },
});

// Get popular events (high registration count)
export const getPopularEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const maxFetch = Math.min((args.limit ?? 6) * 4, 50);

    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .order("desc")
      .take(maxFetch);

    return events
      .filter((e) => !e.status || e.status === "approved" || e.status === "live")
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, args.limit ?? 6);
  },
});

// Get events by category with pagination
export const getEventsByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const maxFetch = Math.min((args.limit ?? 12) * 2, 50);

    const events = await ctx.db
      .query("events")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.gte(q.field("startDate"), now))
      .take(maxFetch);

    return events
      .filter((e) => !e.status || e.status === "approved" || e.status === "live")
      .slice(0, args.limit ?? 12);
  },
});

// Get event counts by category
export const getCategoryCounts = query({
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .take(200); // Reasonable cap

    const counts = {};
    for (const event of events) {
      if (!event.status || event.status === "approved" || event.status === "live") {
        counts[event.category] = (counts[event.category] || 0) + 1;
      }
    }

    return counts;
  },
});

// Get past (completed) events for archive pages.
export const getPastEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const limit = args.limit ?? 12;

    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .order("desc")
      .take(limit * 3); // Fetch extra to account for filtering

    const pastEvents = events.filter((event) => {
      const status = event.status || "approved";
      const isVisibleStatus =
        status === "approved" || status === "live" || status === "completed";
      return isVisibleStatus && event.endDate < now;
    }).slice(0, limit);

    // Instead of collecting ALL registrations, query per event (much faster for small result sets)
    const results = [];
    for (const event of pastEvents) {
      const checkedInCount = (await ctx.db
        .query("registrations")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .filter((q) =>
          q.and(
            q.eq(q.field("status"), "confirmed"),
            q.eq(q.field("checkedIn"), true)
          )
        )
        .take(event.capacity || 10000)).length;

      results.push({
        ...event,
        attendeeCount: checkedInCount,
      });
    }

    return results;
  },
});
