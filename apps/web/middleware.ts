import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public auth pages (catch-all)
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Protect everything except public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// Match all routes except Next.js internals and static assets
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
