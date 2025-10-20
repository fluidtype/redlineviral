import { describe, expect, it } from "vitest";
import { makeTrendsCacheKey, TrendItemSchema, TrendQuerySchema, type TrendQuery } from "./trend";

describe("trend schemas", () => {
  it("validates trend items", () => {
    const result = TrendItemSchema.safeParse([
      {
        title: "AI Shorts",
        growth_rate: 0.42,
        saturation: "medium",
        examples: ["Example A", "Example B"],
        created_at: new Date().toISOString(),
      },
    ]);

    expect(result.success).toBe(true);
  });

  it("normalises query params", () => {
    const parsed = TrendQuerySchema.parse({
      platform: "tiktok",
      region: " US ",
      hours: "24",
      query: "  hashtag  ",
    });

    expect(parsed).toEqual({
      platform: "tiktok",
      region: "US",
      hours: "24",
      query: "hashtag",
    });
  });

  it("produces distinct cache keys for different dimensions", () => {
    const base: TrendQuery = { platform: "tiktok", region: "us", hours: "12", query: "" };
    const keyA = makeTrendsCacheKey(base);
    const keyB = makeTrendsCacheKey({ ...base, hours: "24" as TrendQuery["hours"] });
    const keyC = makeTrendsCacheKey({ ...base, query: "dogs" });
    const keyD = makeTrendsCacheKey({ ...base, query: "dogs " });

    expect(keyA).not.toEqual(keyB);
    expect(keyA).not.toEqual(keyC);
    expect(keyC).toEqual(keyD);
  });
});
