import { createHash } from "node:crypto";
import { z } from "zod";

type TrendQueryRecord = {
  platform: "tiktok" | "instagram" | "x";
  region: string;
  hours: "3" | "12" | "24" | "72";
  query: string;
};

const TrendItemObjectSchema = z.object({
  title: z.string().min(1),
  growth_rate: z.number().min(0).max(1),
  saturation: z.enum(["low", "medium", "high"]),
  examples: z.array(z.string().min(1)),
  created_at: z.string().datetime(),
});

export const TrendItemSchema = z.array(TrendItemObjectSchema);
export type TrendItem = z.infer<typeof TrendItemObjectSchema>;

function normalizeQuery(query?: string | null) {
  if (query === undefined || query === null) {
    return "";
  }

  const normalized = query.trim().toLowerCase();
  return normalized.length === 0 ? "" : normalized;
}

export const TrendQuerySchema = z
  .object({
    platform: z.enum(["tiktok", "instagram", "x"]),
    region: z.string().trim().min(1).transform(value => value.trim()),
    hours: z.enum(["3", "12", "24", "72"]),
    query: z.string().optional(),
  })
  .transform(value => ({
    platform: value.platform,
    region: value.region,
    hours: value.hours,
    query: normalizeQuery(value.query),
  } satisfies TrendQueryRecord));

export type TrendQuery = z.infer<typeof TrendQuerySchema>;
export type TrendQueryInput = TrendQuery;

export function makeTrendsCacheKey({ platform, region, hours, query }: TrendQueryRecord) {
  const normalizedQuery = normalizeQuery(query);
  const hash = createHash("sha1").update(normalizedQuery).digest("hex");
  return `trends:${platform}:${region.toLowerCase()}:${hours}:${hash}`;
}

export const TREND_TTL_MS = 15 * 60 * 1000;
export const TREND_CACHE_TTL_SECONDS = TREND_TTL_MS / 1000;

export const trendItemSchema = TrendItemObjectSchema;
export const trendQuerySchema = TrendQuerySchema;
