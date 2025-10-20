import { ZodError } from "zod";
import { analysisResultSchema } from "@shared/schemas/analysisResult";

export async function persistAnalysisResult(result: unknown) {
  try {
    return analysisResultSchema.parse(result);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Validation errors:", error.issues);
    }
    throw new Error("VALIDATION_FAIL");
  }
}
