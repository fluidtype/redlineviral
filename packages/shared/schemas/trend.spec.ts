import { describe, expect, it } from "vitest";
import { makeTrendsCacheKey, trendItemSchema, trendQuerySchema } from "./trend";

describe("trend schemas", () => {
  it("validates trend items", () => {
    const result = trendItemSchema.safeParse({
      title: "AI Shorts",
      growth_rate: 42,
      saturation: "medium",
      examples: ["Example A", "Example B"],
      created_at: new Date().toISOString(),
    });

    expect(result.success).toBe(true);
  });

  it("normalises query params and coerce hours", () => {
    const parsed = trendQuerySchema.parse({
      platform: "TikTok",
      region: "US",
      hours: "24",
      query: "  hashtag  ",
    });

    expect(parsed.hours).toBe(24);
    expect(parsed.query).toBe("hashtag");
  });

  it("produces distinct cache keys for different dimensions", () => {
    const base = { platform: "tiktok", region: "us", hours: 12, query: undefined as string | undefined };
    const keyA = makeTrendsCacheKey(base);
    const keyB = makeTrendsCacheKey({ ...base, hours: 24 });
    const keyC = makeTrendsCacheKey({ ...base, query: "dogs" });
    const keyD = makeTrendsCacheKey({ ...base, query: "dogs " });

    expect(keyA).not.toEqual(keyB);
    expect(keyA).not.toEqual(keyC);
    expect(keyC).toEqual(keyD);
  });
});
