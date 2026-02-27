"use client";

import { createContext, useContext, useState } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

// Check if backend services are available
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isBackendEnabled = Boolean(CONVEX_URL && CLERK_KEY);

// Create Convex client only once (outside component to avoid re-creation)
const convex = isBackendEnabled ? new ConvexReactClient(CONVEX_URL) : null;

// ============ MOCK AUTH CONTEXT (for frontend-only mode) ============
const MockAuthContext = createContext({
  role: "student",
  isAuthenticated: true,
  setRole: () => { },
  user: { name: "Demo Student", email: "demo@dypiu.ac.in", imageUrl: null },
  adminCheck: {
    isStudent: true,
    isOrganiser: false,
    isAdmin: false,
    isSuperAdmin: false,
    canAccessAdminPanel: false,
    canCreateEvents: false,
    role: "student",
    user: { name: "Demo Student" },
  },
});

export function useMockAuth() {
  return useContext(MockAuthContext);
}

function MockAuthProvider({ children }) {
  const [role, setRole] = useState("student");

  const user = {
    name: role === "organiser" ? "Prof. Demo Organiser" : "Demo Student",
    email: role === "organiser" ? "organiser@dypiu.ac.in" : "student@dypiu.ac.in",
    imageUrl: null,
  };

  const adminCheck = {
    isStudent: role === "student",
    isOrganiser: role === "organiser",
    isAdmin: role === "organiser",
    isSuperAdmin: false,
    canAccessAdminPanel: role === "organiser",
    canCreateEvents: role === "organiser",
    role,
    user,
  };

  return (
    <MockAuthContext.Provider value={{ role, setRole, isAuthenticated: true, user, adminCheck }}>
      {children}
    </MockAuthContext.Provider>
  );
}

// ============ MAIN EXPORT ============
export function ConvexClientProvider({ children }) {
  if (isBackendEnabled) {
    // Clerk wraps Convex — useAuth is available inside ConvexProviderWithClerk
    return (
      <ClerkProvider appearance={{ baseTheme: dark }}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    );
  }

  return <MockAuthProvider>{children}</MockAuthProvider>;
}
