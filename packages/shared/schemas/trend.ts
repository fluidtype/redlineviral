import { z } from "zod";

export const trendItemSchema = z.object({
  title: z.string().min(1),
  growth_rate: z.number().min(0),
  saturation: z.enum(["low", "medium", "high"]),
  examples: z.array(z.string().min(1)).max(10),
  created_at: z.string().datetime(),
});

export type TrendItem = z.infer<typeof trendItemSchema>;

export const trendQuerySchema = z
  .object({
    platform: z.string().min(1),
    region: z.string().min(1),
    hours: z.coerce.number().int().min(1).max(168).default(12),
    query: z
      .string()
      .trim()
      .min(1)
      .max(256)
      .optional()
      .transform((value) => (value === undefined || value === "" ? undefined : value)),
  })
  .transform((input) => ({
    ...input,
    query: input.query ?? undefined,
  }));

export type TrendQueryInput = z.infer<typeof trendQuerySchema>;

function normalizeQuery(query?: string | null) {
  if (!query) return "";
  return query.trim().toLowerCase();
}

export function makeTrendsCacheKey(input: Pick<TrendQueryInput, "platform" | "region" | "hours" | "query">) {
  const normalizedQuery = normalizeQuery(input.query ?? undefined);
  return [input.platform.toLowerCase(), input.region.toLowerCase(), String(input.hours), normalizedQuery].join(":");
}

export const TREND_CACHE_TTL_SECONDS = 15 * 60;
