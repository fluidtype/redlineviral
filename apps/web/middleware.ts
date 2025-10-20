import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const buckets = new Map<string, { count: number; resetAt: number }>();

function identify(req: NextRequest) {
  return (
    req.ip ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local"
  );
}

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.next();
  }

  const key = identify(req);
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (bucket.count >= MAX_REQUESTS) {
    const retrySeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": String(retrySeconds) },
    });
  }

  bucket.count += 1;
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
