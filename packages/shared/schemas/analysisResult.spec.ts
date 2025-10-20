import { describe, expect, it } from "vitest";
import { analysisResultSchema } from "./analysisResult";

describe("analysisResultSchema", () => {
  it("accepts valid payload", () => {
    const payload = {
      scores: {
        hook: 80,
        emotion: 70,
        clarity: 90,
        novelty: 65,
        trendMatch: 88,
        storytelling: 92,
      },
      warnings: ["Too long"],
      recommendations: ["Shorten intro"],
    };

    expect(() => analysisResultSchema.parse(payload)).not.toThrow();
  });

  it("rejects out of range scores", () => {
    const payload = {
      scores: {
        hook: 101,
        emotion: 70,
        clarity: 90,
        novelty: 65,
        trendMatch: 88,
        storytelling: 92,
      },
      warnings: [],
      recommendations: [],
    };

    expect(() => analysisResultSchema.parse(payload)).toThrow();
  });
});
