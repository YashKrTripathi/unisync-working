import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { normalizeList, serializeEventAdmin } from "./eventPermissions";

const ADMIN_ROLES = ["organiser", "superadmin", "owner"];

async function requireAdmin(ctx) {
  const user = await ctx.runQuery(internal.users.getCurrentUser);
  const role = user?.role || "student";
  if (!user || !ADMIN_ROLES.includes(role)) {
    return null;
  }
  return user;
}

function computeEffectiveStatus(event) {
  let effectiveStatus = event.status || "approved";
  const now = Date.now();
  if (effectiveStatus === "approved") {
    if (event.startDate <= now && event.endDate >= now) {
      effectiveStatus = "live";
    } else if (event.endDate < now) {
      effectiveStatus = "completed";
    }
  }
  return effectiveStatus;
}

function buildSlug(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug}-${Date.now()}`;
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

  return `${(base || "EVT").slice(0, 6)}${Date.now().toString().slice(-4)}`;
}

function normalizeContentSections(contentSections = {}) {
  return {
    heroBlurb: contentSections.heroBlurb?.trim() || undefined,
    attendeeNotes: contentSections.attendeeNotes?.trim() || undefined,
    contactEmail: contentSections.contactEmail?.trim() || undefined,
    whyAttend: normalizeList(contentSections.whyAttend || []),
    agenda: (contentSections.agenda || [])
      .map((item) => ({
        time: item.time?.trim() || "",
        title: item.title?.trim() || "",
        description: item.description?.trim() || undefined,
      }))
      .filter((item) => item.time && item.title),
    faqs: (contentSections.faqs || [])
      .map((item) => ({
        question: item.question?.trim() || "",
        answer: item.answer?.trim() || "",
      }))
      .filter((item) => item.question && item.answer),
    resources: (contentSections.resources || [])
      .map((item) => ({
        label: item.label?.trim() || "",
        url: item.url?.trim() || "",
      }))
      .filter((item) => item.label && item.url),
  };
}

async function getSelectedAdmins(ctx, adminIds) {
  const admins = [];

  for (const adminId of adminIds) {
    const user = await ctx.db.get(adminId);
    if (!user || (user.role || "student") !== "organiser") {
      throw new Error("Each selected event admin must be an organiser.");
    }
    admins.push(serializeEventAdmin(user));
  }

  return admins;
}

export const getAllProposals = query({
  args: {
    status: v.optional(v.string()),
    searchTerm: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    if (!user) return [];

    const isOwner = ["owner", "superadmin"].includes(user.role);
    const isOrganiser = user.role === "organiser";

    let proposals = await ctx.db.query("eventProposals").order("desc").take(500);

    // If organiser, only show their own proposals
    if (isOrganiser && !isOwner) {
      proposals = proposals.filter((proposal) => proposal.proposerId === user._id);
    }

    if (args.status && args.status !== "all") {
      proposals = proposals.filter((proposal) => proposal.status === args.status);
    }

    if (args.searchTerm?.trim()) {
      const queryText = args.searchTerm.trim().toLowerCase();
      proposals = proposals.filter((proposal) =>
        [proposal.title, proposal.proposerName, proposal.category].some((value) =>
          value.toLowerCase().includes(queryText)
        )
      );
    }

    return proposals;
  },
});

export const getAllEvents = query({
  args: {
    searchTerm: v.optional(v.string()),
    status: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    if (!user) return [];

    const isOwner = ["owner", "superadmin"].includes(user.role);
    const isOrganiser = user.role === "organiser";

    let events = args.searchTerm?.trim()
      ? await ctx.db
          .query("events")
          .withSearchIndex("search_title", (q) => q.search("title", args.searchTerm))
          .take(200)
      : await ctx.db.query("events").order("desc").take(500);

    // If organiser, only show events they organize or are admins for
    if (isOrganiser && !isOwner) {
      events = events.filter((event) => 
        event.organizerId === user._id || 
        (event.eventAdmins || []).some(admin => admin.userId === user._id)
      );
    }

    if (args.status && args.status !== "all") {
      events = events.filter((event) => (event.status || "approved") === args.status);
    }

    if (args.category && args.category !== "all") {
      events = events.filter((event) => event.category === args.category);
    }

    // Per-event indexed queries instead of full table scans
    const results = [];
    for (const event of events) {
      const regs = await ctx.db
        .query("registrations")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .take(event.capacity || 5000);
      const eventRequests = await ctx.db
        .query("eventChangeRequests")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .take(50);

      const confirmed = regs.filter((r) => r.status === "confirmed");
      const checkedIn = confirmed.filter((r) => r.checkedIn);

      results.push({
        ...event,
        effectiveStatus: computeEffectiveStatus(event),
        totalRegistrations: confirmed.length,
        totalCheckedIn: checkedIn.length,
        revenue:
          event.ticketType === "paid" && event.ticketPrice
            ? checkedIn.length * event.ticketPrice
            : 0,
        pendingChangeRequests: eventRequests.filter((r) => r.status === "pending").length,
        adminCount: (event.eventAdmins || []).length,
      });
    }
    return results;
  },
});

export const getEventWithStats = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    if (!user) return null;

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    const isOwner = ["owner", "superadmin"].includes(user.role);
    const hasPermission = isOwner || event.organizerId === user._id || (event.eventAdmins || []).some(admin => admin.userId === user._id);
    
    if (!hasPermission) {
      throw new Error("Unauthorized: You do not have permission to view this event.");
    }

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .take(event.capacity || 5000);

    const auditLog = await ctx.db
      .query("eventAuditLog")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .take(50);

    const changeRequests = await ctx.db
      .query("eventChangeRequests")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .take(50);

    const confirmed = registrations.filter((registration) => registration.status === "confirmed");
    const checkedIn = confirmed.filter((registration) => registration.checkedIn);
    const cancelled = registrations.filter((registration) => registration.status === "cancelled");

    return {
      ...event,
      eventAdmins: event.eventAdmins || [],
      contentSections: event.contentSections || {},
      effectiveStatus: computeEffectiveStatus(event),
      stats: {
        totalRegistrations: confirmed.length,
        totalCheckedIn: checkedIn.length,
        totalCancelled: cancelled.length,
        revenue:
          event.ticketType === "paid" && event.ticketPrice
            ? checkedIn.length * event.ticketPrice
            : 0,
        attendanceRate:
          confirmed.length > 0
            ? Math.round((checkedIn.length / confirmed.length) * 100)
            : 0,
      },
      registrations: confirmed,
      auditLog,
      changeRequests,
    };
  },
});

export const reviewProposal = mutation({
  args: {
    proposalId: v.id("eventProposals"),
    status: v.union(v.literal("approved"), v.literal("denied")),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    if (!user) throw new Error("Unauthorized");

    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) throw new Error("Proposal not found");

    await ctx.db.patch(args.proposalId, {
      status: args.status,
      reviewNotes: args.reviewNotes,
      reviewedById: user._id,
      reviewedByName: user.name,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const createEventFromProposal = mutation({
  args: {
    proposalId: v.id("eventProposals"),
    adminIds: v.array(v.id("users")),
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
    const user = await requireAdmin(ctx);
    if (!user) throw new Error("Unauthorized");

    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) throw new Error("Proposal not found");
    if (proposal.status !== "approved") {
      throw new Error("Only approved proposals can be converted into events.");
    }
    if (proposal.linkedEventId) {
      throw new Error("This proposal is already linked to an event.");
    }
    if (args.adminIds.length < 1) {
      throw new Error("Please assign at least one event admin.");
    }

    const eventAdmins = await getSelectedAdmins(ctx, args.adminIds);
    const contentSections = normalizeContentSections(args.contentSections);
    const now = Date.now();

    const eventId = await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      slug: buildSlug(args.title),
      organizerId: proposal.proposerId,
      organizerName: proposal.proposerName,
      category: args.category,
      tags: normalizeList(args.tags),
      startDate: args.startDate,
      endDate: args.endDate,
      timezone: args.timezone,
      locationType: args.locationType,
      venueScope: args.venueScope,
      venue: args.venue,
      address: args.address,
      city: args.city,
      state: args.state,
      country: args.country,
      externalReason: args.externalReason,
      capacity: args.capacity,
      ticketType: args.ticketType,
      ticketPrice: args.ticketPrice,
      registrationCount: 0,
      eventCode: generateEventCode(args.title),
      coverImage: args.coverImage,
      themeColor: args.themeColor,
      eventAdmins,
      contentSections,
      status: "approved",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(args.proposalId, {
      status: "converted",
      linkedEventId: eventId,
      reviewedById: user._id,
      reviewedByName: user.name,
      updatedAt: now,
    });

    await ctx.db.insert("eventAuditLog", {
      eventId,
      userId: user._id,
      userName: user.name,
      action: "proposal_converted",
      field: "eventAdmins",
      oldValue: proposal._id,
      newValue: JSON.stringify(eventAdmins.map((admin) => admin.email)),
      reason: "Created from approved proposal",
      timestamp: now,
    });

    return eventId;
  },
});

export const reviewChangeRequest = mutation({
  args: {
    requestId: v.id("eventChangeRequests"),
    status: v.union(v.literal("approved"), v.literal("denied")),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    if (!user) throw new Error("Unauthorized");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Change request not found");

    const event = await ctx.db.get(request.eventId);
    if (!event) throw new Error("Event not found");

    await ctx.db.patch(args.requestId, {
      status: args.status,
      reviewNotes: args.reviewNotes,
      reviewedById: user._id,
      reviewedByName: user.name,
      updatedAt: Date.now(),
    });

    if (args.status === "approved") {
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(request.proposedPayload);
      } catch {
        throw new Error("The proposed payload is invalid.");
      }

      const contentSections = normalizeContentSections(parsedPayload);
      await ctx.db.patch(request.eventId, {
        contentSections,
        updatedAt: Date.now(),
      });

      await ctx.db.insert("eventAuditLog", {
        eventId: request.eventId,
        userId: user._id,
        userName: user.name,
        action: "ai_change_approved",
        field: request.requestType,
        oldValue: undefined,
        newValue: request.summary,
        reason: args.reviewNotes,
        timestamp: Date.now(),
      });
    }

    return { success: true };
  },
});

export const updateEventStatus = mutation({
  args: {
    eventId: v.id("events"),
    status: v.union(
      v.literal("draft"),
      v.literal("pending"),
      v.literal("approved"),
      v.literal("live"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    if (!user) throw new Error("Unauthorized");

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    if (args.status === "cancelled" && !args.reason?.trim()) {
      throw new Error("A reason is required when cancelling an event");
    }

    const oldStatus = event.status || "approved";
    await ctx.db.patch(args.eventId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("eventAuditLog", {
      eventId: args.eventId,
      userId: user._id,
      userName: user.name,
      action: "status_change",
      field: "status",
      oldValue: oldStatus,
      newValue: args.status,
      reason: args.reason,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

export const superAdminEditEvent = mutation({
  args: {
    eventId: v.id("events"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("pending"),
        v.literal("approved"),
        v.literal("live"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    title: v.optional(v.string()),
    capacity: v.optional(v.number()),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    if (!user) throw new Error("Unauthorized");

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    const updates = {};
    const auditEntries = [];

    if (args.startDate !== undefined && args.startDate !== event.startDate) {
      updates.startDate = args.startDate;
      auditEntries.push({
        field: "startDate",
        oldValue: new Date(event.startDate).toISOString(),
        newValue: new Date(args.startDate).toISOString(),
      });
    }
    if (args.endDate !== undefined && args.endDate !== event.endDate) {
      updates.endDate = args.endDate;
      auditEntries.push({
        field: "endDate",
        oldValue: new Date(event.endDate).toISOString(),
        newValue: new Date(args.endDate).toISOString(),
      });
    }
    if (args.status !== undefined && args.status !== (event.status || "approved")) {
      updates.status = args.status;
      auditEntries.push({
        field: "status",
        oldValue: event.status || "approved",
        newValue: args.status,
      });
    }
    if (args.title !== undefined && args.title !== event.title) {
      updates.title = args.title;
      auditEntries.push({
        field: "title",
        oldValue: event.title,
        newValue: args.title,
      });
    }
    if (args.capacity !== undefined && args.capacity !== event.capacity) {
      updates.capacity = args.capacity;
      auditEntries.push({
        field: "capacity",
        oldValue: String(event.capacity),
        newValue: String(args.capacity),
      });
    }

    const newStartDate = updates.startDate || event.startDate;
    const newEndDate = updates.endDate || event.endDate;
    if (newEndDate < newStartDate) {
      throw new Error("End date must be after start date");
    }

    if (Object.keys(updates).length === 0) {
      return { success: true, message: "No changes detected" };
    }

    updates.updatedAt = Date.now();
    await ctx.db.patch(args.eventId, updates);

    for (const entry of auditEntries) {
      await ctx.db.insert("eventAuditLog", {
        eventId: args.eventId,
        userId: user._id,
        userName: user.name,
        action: "date_edit",
        field: entry.field,
        oldValue: entry.oldValue,
        newValue: entry.newValue,
        reason: args.reason,
        timestamp: Date.now(),
      });
    }

    return { success: true, changedFields: auditEntries.length };
  },
});

export const bulkUpdateEventStatus = mutation({
  args: {
    eventIds: v.array(v.id("events")),
    status: v.union(v.literal("approved"), v.literal("cancelled"), v.literal("pending")),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    if (!user) throw new Error("Unauthorized");

    let updated = 0;
    for (const eventId of args.eventIds) {
      const event = await ctx.db.get(eventId);
      if (!event) continue;

      await ctx.db.patch(eventId, {
        status: args.status,
        updatedAt: Date.now(),
      });

      await ctx.db.insert("eventAuditLog", {
        eventId,
        userId: user._id,
        userName: user.name,
        action: "bulk_status_change",
        field: "status",
        oldValue: event.status || "approved",
        newValue: args.status,
        reason: args.reason,
        timestamp: Date.now(),
      });

      updated++;
    }

    return { success: true, updated };
  },
});

export const updateEventVisuals = mutation({
  args: {
    eventId: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    secondaryColor: v.optional(v.string()),
    fontFamily: v.optional(v.string()),
    layoutVariant: v.optional(v.string()),
    customCss: v.optional(v.string()),
    coverImage: v.optional(v.string()),
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
    const user = await requireAdmin(ctx);
    if (!user || !["superadmin", "owner"].includes(user.role)) {
      throw new Error("Unauthorized: Only Superadmin/Owner can use the Creative Studio.");
    }

    const { eventId, contentSections, ...directUpdates } = args;
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    const patch = {
      ...directUpdates,
      updatedAt: Date.now(),
    };

    if (contentSections) {
      patch.contentSections = normalizeContentSections(contentSections);
    }

    await ctx.db.patch(eventId, patch);

    await ctx.db.insert("eventAuditLog", {
      eventId,
      userId: user._id,
      userName: user.name,
      action: "creative_studio_edit",
      reason: "Updated via AI Creative Studio",
      timestamp: Date.now(),
    });

    return { success: true };
  },
});
