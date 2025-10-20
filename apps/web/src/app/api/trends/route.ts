import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@shared/env";
import {
  TREND_TTL_MS,
  TrendItemSchema,
  TrendQuerySchema,
  makeTrendsCacheKey,
  type TrendItem,
  type TrendQuery,
} from "@shared/schemas/trend";

type TrendSeriesPoint = { t: number; v: number };
type TrendMetrics = {
  series: TrendSeriesPoint[][];
  deltas: Record<string, number>;
};

type TrendsCacheRow = {
  payload: unknown;
  cached_at: string;
};

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function computeMetrics(items: TrendItem[], hours: TrendQuery["hours"]): TrendMetrics {
  const series = items.map(item =>
    Array.from({ length: 10 }, (_, index) => ({
      t: index,
      v: item.growth_rate * ((index + 1) / 10),
    }))
  );

  const deltaValues = series.map(points => {
    const first = points[0]?.v ?? 0;
    const last = points[points.length - 1]?.v ?? 0;
    return last - first;
  });

  const deltaTotal = deltaValues.reduce((sum, value) => sum + value, 0);
  const deltaAverage = deltaValues.length > 0 ? deltaTotal / deltaValues.length : 0;

  return {
    series,
    deltas: { [`h${hours}`]: deltaAverage },
  };
}

function cleanProviderPayload(content: string | undefined | null) {
  if (!content) {
    return null;
  }

  const trimmed = content.trim();
  if (trimmed.startsWith("```")) {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match?.[1]) {
      return match[1];
    }
  }

  return trimmed;
}

function buildValidationErrorResponse() {
  return NextResponse.json(
    { code: "VALIDATION_FAIL", message: "Invalid query parameters" },
    { status: 400 }
  );
}

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams;
    const parseResult = TrendQuerySchema.safeParse({
      platform: search.get("platform") ?? undefined,
      region: search.get("region") ?? undefined,
      hours: search.get("hours") ?? undefined,
      query: search.get("query") ?? undefined,
    });

    if (!parseResult.success) {
      return buildValidationErrorResponse();
    }

    const params = parseResult.data;
    const cacheKey = makeTrendsCacheKey(params);
    const hoursValue = Number(params.hours);

    const { data: cacheRow, error: cacheError } = await supabase
      .from("trends_cache")
      .select("payload, cached_at")
      .eq("platform", params.platform)
      .eq("region", params.region)
      .eq("hours", hoursValue)
      .eq("query", params.query)
      .order("cached_at", { ascending: false })
      .limit(1)
      .maybeSingle<TrendsCacheRow>();

    if (cacheError) {
      console.error("[trends] cache lookup failed", cacheError);
      return NextResponse.json(
        { code: "INTERNAL", message: "Failed to read cache" },
        { status: 500 }
      );
    }

    let staleResponse: NextResponse | null = null;

    if (cacheRow) {
      const cachedAt = new Date(cacheRow.cached_at);
      const ageMs = Date.now() - cachedAt.getTime();

      try {
        const items = TrendItemSchema.parse(cacheRow.payload);
        const metrics = computeMetrics(items, params.hours);

        if (ageMs < TREND_TTL_MS) {
          return NextResponse.json(
            {
              cached: true,
              stale: false,
              items,
              series: metrics.series,
              deltas: metrics.deltas,
            },
            { status: 200 }
          );
        }

        staleResponse = NextResponse.json(
          {
            cached: true,
            stale: true,
            items,
            series: metrics.series,
            deltas: metrics.deltas,
          },
          { status: 200 }
        );
      } catch (err) {
        console.warn("[trends] invalid cached payload discarded", err);
      }
    }

    const promptParts = [
      `Analizza le ultime tendenze su ${params.platform} in ${params.region} nelle ultime ${params.hours} ore.`,
      "Restituisci in JSON un array di oggetti con le chiavi: title, growth_rate, saturation, examples, created_at.",
    ];

    if (params.query) {
      promptParts.splice(1, 0, `Concentrati sulla query \"${params.query}\" se disponibile.`);
    }

    const requestBody = {
      model: env.GROK_MODEL ?? "grok-3",
      messages: [
        { role: "system" as const, content: "You are a trend discovery assistant returning JSON only." },
        { role: "user" as const, content: promptParts.join(" ") },
      ],
      temperature: 0.4,
    };

    const providerResponse = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (providerResponse.status === 429) {
      const retryAfter = providerResponse.headers.get("Retry-After") ?? undefined;

      if (staleResponse) {
        if (retryAfter) {
          staleResponse.headers.set("Retry-After", retryAfter);
        }
        return staleResponse;
      }

      return NextResponse.json(
        {
          code: "RATE_LIMIT",
          message: "Provider rate limit",
          retryAfter,
        },
        {
          status: 429,
          headers: retryAfter ? { "Retry-After": retryAfter } : undefined,
        }
      );
    }

    if (providerResponse.status >= 500) {
      return NextResponse.json(
        { code: "PROVIDER_DOWN", message: "Trend provider unavailable" },
        { status: 503 }
      );
    }

    if (!providerResponse.ok) {
      return NextResponse.json(
        { code: "PROVIDER_RESPONSE_INVALID", message: "Invalid provider payload" },
        { status: 502 }
      );
    }

    const providerPayload = await providerResponse.json();
    const content = cleanProviderPayload(providerPayload?.choices?.[0]?.message?.content);

    if (!content) {
      return NextResponse.json(
        { code: "PROVIDER_RESPONSE_INVALID", message: "Invalid provider payload" },
        { status: 502 }
      );
    }

    let parsedItems: TrendItem[];

    try {
      const raw = JSON.parse(content);
      parsedItems = TrendItemSchema.parse(raw);
    } catch (error) {
      console.error("[trends] failed to parse provider payload", error);
      return NextResponse.json(
        { code: "PROVIDER_RESPONSE_INVALID", message: "Invalid provider payload" },
        { status: 502 }
      );
    }

    const metrics = computeMetrics(parsedItems, params.hours);

    const insertResult = await supabase.from("trends_cache").insert({
      platform: params.platform,
      region: params.region,
      hours: hoursValue,
      query: params.query,
      payload: parsedItems,
      cached_at: new Date().toISOString(),
    });

    if (insertResult.error) {
      console.error(`[trends] failed to persist cache (${cacheKey})`, insertResult.error);
    }

    return NextResponse.json(
      {
        cached: false,
        stale: false,
        items: parsedItems,
        series: metrics.series,
        deltas: metrics.deltas,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[trends] unexpected error", error);
    return NextResponse.json(
      { code: "INTERNAL", message: "Unexpected error" },
      { status: 500 }
    );
  }
}
