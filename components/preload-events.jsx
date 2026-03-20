"use client";

import { usePathname } from "next/navigation";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

/**
 * Warm up Convex event queries when the site loads so navigating
 * to events or past-events pages can render instantly from cache.
 * 
 * PERF: Only fires on public routes — skipped entirely on /admin/*
 */
export default function PreloadEvents() {
  const pathname = usePathname();
  
  // Skip preloading on admin routes — they don't need explore data
  const isAdmin = pathname?.startsWith("/admin");
  
  useConvexQuery(api.explore.getPopularEvents, isAdmin ? "skip" : { limit: 6 });
  useConvexQuery(api.explore.getPastEvents, isAdmin ? "skip" : { limit: 6 });
  
  return null;
}
