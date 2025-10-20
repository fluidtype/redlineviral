import { describe, expect, it } from "vitest";
import { sandboxOutputSchema } from "./sandbox";

describe("sandboxOutputSchema", () => {
  it("requires exactly two improvements", () => {
    const payload = {
      scores: { hook: 70, pacing: 55 },
      improvements: ["Tighten intro", "Use better hook"],
      notes: "Solid baseline",
    } as const;

    expect(() => sandboxOutputSchema.parse(payload)).not.toThrow();
  });

  it("rejects when improvements count mismatches", () => {
    const payload = {
      scores: { hook: 70, pacing: 55 },
      improvements: ["Only one"],
      notes: "Needs more detail",
    };

    expect(() => sandboxOutputSchema.parse(payload)).toThrow();
  });
});
