import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { canManageEvent, normalizeList } from "./eventPermissions";

const EVENT_SCHEMA_FIELDS = new Set([
  "title", "description", "slug",
  "organizerId", "organizerName",
  "category", "tags",
  "startDate", "endDate", "timezone",
  "locationType", "venueScope", "venue", "address", "city", "state", "country", "externalReason",
  "capacity", "ticketType", "ticketPrice", "registrationCount",
  "eventCode",
  "coverImage", "themeColor",
  "eventAdmins", "contentSections",
  "status",
  "createdAt", "updatedAt",
]);

function sanitizeEventData(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => EVENT_SCHEMA_FIELDS.has(key))
  );
}

function generateEventCode(title) {
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
  const suffix = Date.now().toString().slice(-4);
  return `${prefix}${suffix}`;
}

function buildSlug(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug}-${Date.now()}`;
}

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    timezone: v.string(),
    locationType: v.union(v.literal("physical"), v.literal("online")),
    venueScope: v.optional(v.union(v.literal("internal"), v.literal("external"))),
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),
    externalReason: v.optional(v.string()),
    capacity: v.number(),
    ticketType: v.union(v.literal("free"), v.literal("paid")),
    ticketPrice: v.optional(v.number()),
    coverImage: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    hasPro: v.optional(v.boolean()),
    eventAdmins: v.optional(v.array(v.object({
      userId: v.id("users"),
      name: v.string(),
      email: v.string(),
      assignedAt: v.number(),
    }))),
    contentSections: v.optional(v.object({
      heroBlurb: v.optional(v.string()),
      attendeeNotes: v.optional(v.string()),
      contactEmail: v.optional(v.string()),
      whyAttend: v.optional(v.array(v.string())),
      agenda: v.optional(v.array(v.object({
        time: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
      }))),
      faqs: v.optional(v.array(v.object({
        question: v.string(),
        answer: v.string(),
      }))),
      resources: v.optional(v.array(v.object({
        label: v.string(),
        url: v.string(),
      }))),
    })),
  },
  handler: async (ctx, args) => {
    try {
      const { hasPro = false, ...eventData } = args;
      const user = await ctx.runQuery(internal.users.getCurrentUser);

      const role = user?.role || "student";
      if (!user || !["organiser", "superadmin", "owner"].includes(role)) {
        throw new Error("Only organisers or superadmins can create events. Contact admin to get access.");
      }

      const themeColor = args.themeColor || "#1e3a8a";

      const eventId = await ctx.db.insert("events", {
        ...sanitizeEventData(eventData),
        themeColor,
        slug: buildSlug(args.title),
        eventCode: generateEventCode(args.title),
        organizerId: user._id,
        organizerName: user.name,
        registrationCount: 0,
        status: "approved",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return eventId;
    } catch (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  },
});

export const createProposal = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    conceptNote: v.string(),
    objectives: v.array(v.string()),
    targetAudience: v.string(),
    preferredStartDate: v.optional(v.number()),
    preferredEndDate: v.optional(v.number()),
    locationPreference: v.union(v.literal("internal"), v.literal("external"), v.literal("online")),
    expectedCapacity: v.optional(v.number()),
    aiSupportPlan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const role = user?.role || "student";
    if (!user || !["organiser", "superadmin", "owner"].includes(role)) {
      throw new Error("Only organisers can propose events.");
    }

    return await ctx.db.insert("eventProposals", {
      proposerId: user._id,
      proposerName: user.name,
      proposerEmail: user.email,
      title: args.title,
      category: args.category,
      conceptNote: args.conceptNote,
      objectives: normalizeList(args.objectives),
      targetAudience: args.targetAudience,
      preferredStartDate: args.preferredStartDate,
      preferredEndDate: args.preferredEndDate,
      locationPreference: args.locationPreference,
      expectedCapacity: args.expectedCapacity,
      aiSupportPlan: args.aiSupportPlan,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getMyEventProposals = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    if (!user) return [];

    return await ctx.db
      .query("eventProposals")
      .withIndex("by_proposer", (q) => q.eq("proposerId", user._id))
      .order("desc")
      .take(100);
  },
});

export const getProposalById = query({
  args: { proposalId: v.id("eventProposals") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal || !user) return null;

    if (proposal.proposerId !== user._id && !["organiser", "superadmin", "owner"].includes(user.role || "student")) {
      throw new Error("You are not authorized to view this proposal.");
    }

    return proposal;
  },
});

export const getEventBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!event) {
      return null;
    }

    const organizer = await ctx.db.get(event.organizerId);

    return {
      ...event,
      organizerImageUrl: organizer?.imageUrl,
      contentSections: event.contentSections || {},
      eventAdmins: event.eventAdmins || [],
    };
  },
});

export const getMyEvents = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    if (!user) return [];

    const allEvents = await ctx.db.query("events").order("desc").take(200);

    return allEvents
      .filter((event) => event.organizerId === user._id || (event.eventAdmins || []).some((admin) => admin.userId === user._id))
      .map((event) => ({
        ...event,
        myAccessRole: event.organizerId === user._id ? "owner" : "event_admin",
      }));
  },
});

export const submitEventChangeRequest = mutation({
  args: {
    eventId: v.id("events"),
    requestType: v.string(),
    summary: v.string(),
    aiPrompt: v.optional(v.string()),
    proposedPayload: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    if (!user) throw new Error("Please sign in to continue.");

    const event = await ctx.db.get(args.eventId);
    if (!canManageEvent(event, user)) {
      throw new Error("You are not authorized to suggest changes for this event.");
    }

    return await ctx.db.insert("eventChangeRequests", {
      eventId: args.eventId,
      requestedById: user._id,
      requestedByName: user.name,
      requestType: args.requestType,
      summary: args.summary,
      aiPrompt: args.aiPrompt,
      proposedPayload: args.proposedPayload,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getEventChangeRequests = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const event = await ctx.db.get(args.eventId);
    if (!canManageEvent(event, user)) {
      throw new Error("You are not authorized to view change requests for this event.");
    }

    return await ctx.db
      .query("eventChangeRequests")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .collect();
  },
});

export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const event = await ctx.db.get(args.eventId);
    if (!event || !user) {
      throw new Error("Event not found");
    }

    if (event.organizerId !== user._id && !["organiser", "superadmin", "owner"].includes(user.role || "student")) {
      throw new Error("You are not authorized to delete this event");
    }

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const registration of registrations) {
      await ctx.db.delete(registration._id);
    }

    const requests = await ctx.db
      .query("eventChangeRequests")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const request of requests) {
      await ctx.db.delete(request._id);
    }

    await ctx.db.delete(args.eventId);

    return { success: true };
  },
});
