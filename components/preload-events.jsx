"use client";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

/**
 * Warm up Convex event queries when the site loads so navigating
 * to events or past-events pages can render instantly from cache.
 */
export default function PreloadEvents() {
  // Fire and forget; useConvexQuery caches results in-memory.
  useConvexQuery(api.explore.getPopularEvents, { limit: 12 });
  useConvexQuery(api.explore.getPastEvents, { limit: 12 });
  return null;
}
