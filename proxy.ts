import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Public routes — no Clerk session required.
 *
 * Every entry here is intentional. New routes default to protected unless
 * added below with a comment explaining why they must stay public.
 */
const isPublicRoute = createRouteMatcher([
  // Marketing landing page — visitors browse before signing up.
  "/",
  // Clerk sign-in UI — users must reach this page while logged out.
  "/login(.*)",
  // Clerk sign-up UI — same as login; must stay reachable without a session.
  "/signup(.*)",
  // Recipient document viewer — access is gated by share-link token, not Clerk.
  "/view(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  },
  {
    // Tolerate small system clock drift (fixes JWT nbf / redirect loops in dev).
    clockSkewInMs: 5 * 60 * 1000,
  },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    // Clerk internal auth handshake — must bypass protect() or sign-in loops.
    "/__clerk/(.*)",
  ],
};
