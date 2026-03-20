import { useQuery as useOriginalQuery, useMutation as useOriginalMutation } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const isBackendEnabled = Boolean(
  process.env.NEXT_PUBLIC_CONVEX_URL &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

// Simple in-memory cache to share Convex query results across pages.
// Useful for avoiding repeated loading states on client-side navigation.
const queryCache = new Map();

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

// Fallback mock hooks when backend is disabled
const useMockQuery = (query, ...args) => {
  if (query?.name === "getFeaturedEvents" || query?.name === "getEventsByLocation" || query?.name === "getPopularEvents" || query?.name === "getPastEvents") {
    return mockEvents;
  }
  if (query?.name === "getCategoryCounts") {
    return mockCategoryCounts;
  }
  if (query?.name === "isAdmin" || query?.name === "getCurrentUser") {
    return mockUserAndAdmin;
  }
  return mockEmptyArray; // Return empty array instead of undefined to finish loading
};

const useMockMutation = (mutation) => async (...args) => {
  console.log("Mock mutation executed", { mutation, args });
  return null;
};

// Conditionally use real or mock hooks statically so React invariant isn't violated
const useActualQuery = isBackendEnabled ? useOriginalQuery : ((q, ...args) => useMockQuery(q, ...args));
const useActualMutation = isBackendEnabled ? useOriginalMutation : useMockMutation;

const queryIdentity = new WeakMap();
let queryIdentityCounter = 0;

const getQueryIdentity = (query) => {
  if (query && (typeof query === "object" || typeof query === "function")) {
    if (!queryIdentity.has(query)) {
      queryIdentityCounter += 1;
      queryIdentity.set(query, `query-${queryIdentityCounter}`);
    }
    return queryIdentity.get(query);
  }
  if (query == null) return "query-null";
  const primitiveType = typeof query;
  if (primitiveType === "string" || primitiveType === "number" || primitiveType === "boolean" || primitiveType === "bigint") {
    return `query-${primitiveType}-${String(query)}`;
  }
  return `query-${primitiveType}`;
};

const safeSerialize = (value) => {
  try {
    return JSON.stringify(value);
  } catch (_err) {
    return "unserializable";
  }
};

const buildCacheKey = (query, args) => {
  const queryPart = getQueryIdentity(query);
  const argsPart = safeSerialize(args?.[0] ?? {});
  return `${queryPart}::${argsPart}`;
};

export const useConvexQuery = (query, ...args) => {
  const cacheKey = buildCacheKey(query, args);
  const cachedValue = queryCache.get(cacheKey);

  const result = useActualQuery(query, ...args);
  const [data, setData] = useState(cachedValue);
  const [isLoading, setIsLoading] = useState(cachedValue === undefined);
  const [error, setError] = useState(null);

  // Use effect to handle the state changes based on the query result
  useEffect(() => {
    if (result === undefined && isBackendEnabled) {
      setIsLoading(true);
    } else {
      try {
        setData(result);
        queryCache.set(cacheKey, result);
        setError(null);
      } catch (err) {
        setError(err);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [result, cacheKey]);

  return {
    data,
    isLoading,
    error,
  };
};

export const useConvexMutation = (mutation) => {
  const mutationFn = useActualMutation(mutation);
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
