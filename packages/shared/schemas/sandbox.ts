import { z } from "zod";

const sandboxScore = z.number().min(0).max(100);

export const sandboxScoresSchema = z.record(z.string().min(1), sandboxScore);

export const sandboxOutputSchema = z.object({
  scores: sandboxScoresSchema,
  improvements: z.tuple([z.string().min(1), z.string().min(1)]),
  notes: z.string().min(1),
});

export type SandboxOutput = z.infer<typeof sandboxOutputSchema>;
