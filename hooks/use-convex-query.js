import { useQuery as useOriginalQuery, useMutation as useOriginalMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

const isBackendEnabled = Boolean(
  process.env.NEXT_PUBLIC_CONVEX_URL &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

// Fallback mock events
const mockEvents = [
  { _id: "1", slug: "nameless-music-festival", title: "UNISYNC Music Festival", description: "Get ready for the biggest music festival campus experience ever.", startDate: new Date().getTime() + 864000000, city: "Pune", state: "MH", registrationCount: 1240, coverImage: "https://images.unsplash.com/photo-1540039155732-6761b54cb118?q=80&w=2670&auto=format&fit=crop", category: "music", themeColor: "#ff6b00", ticketType: "paid", capacity: 5000 },
  { _id: "2", slug: "hackathon-2026", title: "Code & Build Hackathon", description: "A 48-hour coding marathon to build the future.", startDate: new Date().getTime() + 1728000000, city: "Pune", state: "MH", registrationCount: 350, coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2670&auto=format&fit=crop", category: "technology", themeColor: "#1e3a8a", ticketType: "free", capacity: 500 },
  { _id: "3", slug: "cultural-night", title: "Cultural Fusion Night", description: "Experience cultures from around the world.", startDate: new Date().getTime() + 2592000000, city: "Pune", state: "MH", registrationCount: 890, coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2674&auto=format&fit=crop", category: "cultural", themeColor: "#db2777", ticketType: "paid", capacity: 1500 },
  { _id: "4", slug: "tech-symposium", title: "Annual Tech Symposium", description: "Industry leaders sharing insights on tomorrow's tech.", startDate: new Date().getTime() + 3456000000, city: "Pune", state: "MH", registrationCount: 500, coverImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop", category: "technology", themeColor: "#059669", ticketType: "paid", capacity: 800 }
];

const mockCategoryCounts = { "music": 12, "technology": 8, "cultural": 5 };
const mockUserAndAdmin = { canAccessAdminPanel: true, canCreateEvents: true, role: "organiser", location: { city: "Pune", state: "MH" } };
const mockEmptyArray = [];

const useMockQuery = (query) => {
  if (query?.name === "getFeaturedEvents" || query?.name === "getEventsByLocation" || query?.name === "getPopularEvents" || query?.name === "getPastEvents") {
    return mockEvents;
  }
  if (query?.name === "getCategoryCounts") {
    return mockCategoryCounts;
  }
  if (query?.name === "isAdmin" || query?.name === "getCurrentUser") {
    return mockUserAndAdmin;
  }
  return mockEmptyArray;
};

const useMockMutation = () => async (...args) => {
  console.log("Mock mutation executed", { args });
  return null;
};

/**
 * PERF FIX: Removed the extra useState/useEffect wrapper that was
 * causing unnecessary re-renders. Convex's useQuery is already reactive —
 * wrapping it in another state layer just adds latency and stale-data bugs.
 * 
 * Now: thin passthrough that returns { data, isLoading, error } directly
 * from Convex's reactive result without intermediate state.
 */
export const useConvexQuery = (query, ...args) => {
  if (!isBackendEnabled) {
    return {
      data: useMockQuery(query),
      isLoading: false,
      error: null,
    };
  }

  // Convex's useQuery handles "skip" natively — returns undefined when skipped
  const result = useOriginalQuery(query, ...args);

  return {
    data: result,
    isLoading: result === undefined,
    error: null,
  };
};

export const useConvexMutation = (mutation) => {
  const mutationFn = isBackendEnabled ? useOriginalMutation(mutation) : useMockMutation(mutation);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
};
