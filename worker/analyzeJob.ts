import Ajv from "ajv";
import { analysisResultSchema } from "@/lib/validation/analysisResultSchema";

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
const validate = ajv.compile(analysisResultSchema);

export async function persistAnalysisResult(result: unknown) {
  if (!validate(result)) {
    console.error("Validation errors:", validate.errors);
    throw new Error("VALIDATION_FAIL");
  }

  return result;
}
