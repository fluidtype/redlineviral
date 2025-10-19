import { Schema } from "ajv";

export const analysisResultSchema: Schema = {
  $id: "analysis_result_schema",
  type: "object",
  properties: {
    scores: {
      type: "object",
      properties: {
        hook: { type: "number" },
        emotion: { type: "number" },
        clarity: { type: "number" },
        novelty: { type: "number" },
        trendMatch: { type: "number" },
        storytelling: { type: "number" }
      },
      required: ["hook", "emotion", "clarity", "novelty", "trendMatch", "storytelling"]
    },
    warnings: { type: "array", items: { type: "string" } },
    recommendations: { type: "array", items: { type: "string" } }
  },
  required: ["scores"]
};
