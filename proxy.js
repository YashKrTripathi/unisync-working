import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/my-events(.*)",
  "/create-event(.*)",
  "/my-tickets(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Skip auth resolution for public pages to keep route latency low.
  if (!isProtectedRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();
  if (!userId) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Run middleware only where auth checks are needed.
    "/my-events(.*)",
    "/create-event(.*)",
    "/my-tickets(.*)",
    // Keep API matcher for future protected API checks.
    "/(api|trpc)(.*)",
  ],
};
