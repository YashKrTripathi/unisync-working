import { query } from "./_generated/server";
import { v } from "convex/values";

// Get featured events (high registration count or recent)
export const getFeaturedEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .order("desc")
      .collect();

    // Sort by registration count for featured
    const featured = events
      .filter((e) => !e.status || e.status === "approved" || e.status === "live")
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, args.limit ?? 3);

    return featured;
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

    let events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Filter by city or state
    if (args.city) {
      events = events.filter(
        (e) => e.city.toLowerCase() === args.city.toLowerCase()
      );
    } else if (args.state) {
      events = events.filter(
        (e) => e.state?.toLowerCase() === args.state.toLowerCase()
      );
    }

    // Only show approved/live events
    events = events.filter((e) => !e.status || e.status === "approved" || e.status === "live");

    return events.slice(0, args.limit ?? 4);
  },
});

// Get popular events (high registration count)
export const getPopularEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Sort by registration count
    const popular = events
      .filter((e) => !e.status || e.status === "approved" || e.status === "live")
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, args.limit ?? 6);

    return popular;
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
    const events = await ctx.db
      .query("events")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Only show approved/live events
    const filtered = events.filter((e) => !e.status || e.status === "approved" || e.status === "live");

    return filtered.slice(0, args.limit ?? 12);
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
      .collect();

    // Count events by category
    const counts = {};
    events.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });

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
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .order("desc")
      .collect();

    const pastEvents = events.filter((event) => {
      const status = event.status || "approved";
      const isVisibleStatus =
        status === "approved" || status === "live" || status === "completed";
      return isVisibleStatus && event.endDate < now;
    });

    const sliced = pastEvents.slice(0, args.limit ?? 100);
    const ids = new Set(sliced.map((e) => e._id));
    const registrations = await ctx.db.query("registrations").collect();

    const attendanceByEvent = {};
    for (const registration of registrations) {
      if (!ids.has(registration.eventId)) continue;
      if (registration.status !== "confirmed") continue;
      if (!registration.checkedIn) continue;
      attendanceByEvent[registration.eventId] =
        (attendanceByEvent[registration.eventId] || 0) + 1;
    }

    return sliced.map((event) => ({
      ...event,
      attendeeCount: attendanceByEvent[event._id] || 0,
    }));
  },
});
