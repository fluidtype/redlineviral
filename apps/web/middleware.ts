import type { NextMiddleware } from "next/server";
import { NextResponse } from "next/server";
import { isAuthEnabled } from "@shared/env";

const publicRoutes = ["/sign-in(.*)", "/sign-up(.*)"];

const noopMiddleware: NextMiddleware = () => NextResponse.next();

const middlewarePromise: Promise<NextMiddleware> = isAuthEnabled()
  ? import("@clerk/nextjs/server").then(({ clerkMiddleware, createRouteMatcher }) => {
      const isPublicRoute = createRouteMatcher(publicRoutes);
      return clerkMiddleware(async (auth, req) => {
        if (!isPublicRoute(req)) {
          await auth.protect();
        }
      });
    })
  : Promise.resolve(noopMiddleware);

export default async function middleware(
  req: Parameters<NextMiddleware>[0],
  event: Parameters<NextMiddleware>[1],
) {
  const middleware = await middlewarePromise;
  return middleware(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
