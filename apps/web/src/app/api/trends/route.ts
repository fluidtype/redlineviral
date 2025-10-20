import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  TREND_CACHE_TTL_SECONDS,
  TrendItem,
  makeTrendsCacheKey,
  trendQuerySchema,
} from "@shared/schemas/trend";
import { env } from "@shared/env";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function badRequest(issues: unknown) {
  return NextResponse.json({ code: "INVALID_QUERY", issues }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = trendQuerySchema.safeParse(params);
  if (!parsed.success) {
    return badRequest(parsed.error.flatten());
  }

  const queryInput = parsed.data;
  const cacheKey = makeTrendsCacheKey(queryInput);

  let builder = supabase
    .from("trends_cache")
    .select("payload, cached_at, query")
    .eq("platform", queryInput.platform)
    .eq("region", queryInput.region)
    .eq("hours", queryInput.hours)
    .order("cached_at", { ascending: false })
    .limit(1);

  if (queryInput.query) {
    builder = builder.eq("query", queryInput.query);
  } else {
    builder = builder.is("query", null);
  }

  const { data, error } = await builder.maybeSingle();

  if (error) {
    console.error("trends cache lookup failed", error);
    return NextResponse.json({ code: "CACHE_LOOKUP_FAILED" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { code: "PROVIDER_DOWN", message: "Provider not configured", cacheKey },
      { status: 503 }
    );
  }

  const cachedAt = new Date(data.cached_at);
  const ageSeconds = (Date.now() - cachedAt.getTime()) / 1000;
  const stale = ageSeconds > TREND_CACHE_TTL_SECONDS;
  const payload = (data.payload ?? {}) as { items?: TrendItem[] };
  const items = Array.isArray(payload.items) ? payload.items : [];

  return NextResponse.json({ cacheKey, items, cached: true, stale }, { status: 200 });
}
