import { z } from "zod";

export const runStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

export const caseRunStatusSchema = z.enum([
  "pending",
  "running",
  "succeeded",
  "failed",
  "error",
  "cancelled",
]);

export const modelRefSchema = z.object({
  provider: z.string(),
  model: z.string(),
});

export const runSummarySchema = z.object({
  id: z.string().uuid(),
  suite_id: z.string().uuid(),
  models: z.array(modelRefSchema),
  status: runStatusSchema,
  created_at: z.string(),
  started_at: z.string().nullable().optional(),
  finished_at: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
  total: z.number(),
  pending: z.number(),
  running: z.number(),
  succeeded: z.number(),
  failed: z.number(),
  error_count: z.number(),
  cancelled: z.number(),
  max_latency_ms: z.number().nullable().optional(),
});

export const validationResultSchema = z.object({
  id: z.string().uuid(),
  case_run_id: z.string().uuid(),
  validator_type: z.string(),
  passed: z.boolean(),
  message: z.string(),
  details: z.unknown().optional(),
});

export const caseRunWithValidationsSchema = z.object({
  id: z.string().uuid(),
  run_id: z.string().uuid(),
  test_case_id: z.string().uuid(),
  provider: z.string(),
  model: z.string(),
  status: caseRunStatusSchema,
  response_text: z.string().nullable().optional(),
  response_raw: z.unknown().optional(),
  usage: z.unknown().optional(),
  latency_ms: z.number().nullable().optional(),
  attempt: z.number(),
  error: z.string().nullable().optional(),
  started_at: z.string().nullable().optional(),
  finished_at: z.string().nullable().optional(),
  test_case_name: z.string(),
  prompt: z.string(),
  validations: z
    .array(validationResultSchema)
    .nullable()
    .optional()
    .transform((v) => v ?? []),
});

export const evaluationRunSchema = z.object({
  id: z.string().uuid(),
  suite_id: z.string().uuid(),
  models: z.array(modelRefSchema),
  status: runStatusSchema,
  created_at: z.string(),
  started_at: z.string().nullable().optional(),
  finished_at: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
});

export const runResultsSchema = z.object({
  run: evaluationRunSchema,
  results: z.array(caseRunWithValidationsSchema),
});

export const suiteSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
  cases: z.array(z.unknown()).optional(),
});

export const testCaseSchema = z.object({
  id: z.string().uuid(),
  suite_id: z.string().uuid(),
  name: z.string(),
  prompt: z.string(),
  expected: z.unknown().optional(),
  validators: z.unknown().optional(),
  timeout_ms: z.number(),
  position: z.number(),
  created_at: z.string(),
});

export const apiErrorSchema = z.object({
  error: z.string(),
});

export const validatorsNeedingValue = ["contains", "exact", "regex"] as const;

export const newEvaluationFormSchema = z
  .object({
    provider: z.enum(["lmstudio", "gemini"]),
    model: z.string().min(1, "Model is required"),
    prompt: z.string().min(1, "Prompt is required"),
    validatorType: z.enum([
      "contains",
      "exact",
      "regex",
      "valid_json",
      "no_error",
      "no_timeout",
    ]),
    expectedValue: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (validatorsNeedingValue as readonly string[]).includes(data.validatorType) &&
      (!data.expectedValue || data.expectedValue.trim() === "")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["expectedValue"],
        message: "Expected value is required for this validator",
      });
    }
    if (data.validatorType === "regex" && data.expectedValue) {
      try {
        new RegExp(data.expectedValue);
      } catch {
        ctx.addIssue({
          code: "custom",
          path: ["expectedValue"],
          message: "Invalid regular expression",
        });
      }
    }
  });

export type RunSummary = z.infer<typeof runSummarySchema>;
export type RunResults = z.infer<typeof runResultsSchema>;
export type CaseRunWithValidations = z.infer<typeof caseRunWithValidationsSchema>;
export type NewEvaluationForm = z.infer<typeof newEvaluationFormSchema>;
export type Suite = z.infer<typeof suiteSchema>;
export type TestCase = z.infer<typeof testCaseSchema>;
