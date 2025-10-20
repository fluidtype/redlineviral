import { z } from "zod";

const boundedScore = z.number().min(0).max(100);

export const analysisScoresSchema = z.object({
  hook: boundedScore,
  emotion: boundedScore,
  clarity: boundedScore,
  novelty: boundedScore,
  trendMatch: boundedScore,
  storytelling: boundedScore,
});

export const analysisResultSchema = z
  .object({
    scores: analysisScoresSchema,
    radar: z.record(z.number()).optional(),
    warnings: z.array(z.string().min(1)).default([]),
    recommendations: z.array(z.string().min(1)).default([]),
  })
  .strict();

export type AnalysisResultPayload = z.infer<typeof analysisResultSchema>;
