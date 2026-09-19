import {
  apiErrorSchema,
  runResultsSchema,
  runSummarySchema,
  suiteSchema,
  testCaseSchema,
  type NewEvaluationForm,
  type RunResults,
  type RunSummary,
  type Suite,
  type TestCase,
} from "./schemas";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function apiBase(): string {
  if (typeof window === "undefined") {
    return process.env.JUDGE_API_URL || "http://localhost:8080";
  }
  return "/backend";
}

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  parse: (data: unknown) => T,
): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { error: text };
    }
  }

  if (!res.ok) {
    const parsed = apiErrorSchema.safeParse(body);
    const message = parsed.success
      ? parsed.data.error
      : `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return parse(body);
}

export async function listRuns(): Promise<RunSummary[]> {
  return request("/v1/runs", { method: "GET" }, (data) =>
    runSummarySchema.array().parse(data ?? []),
  );
}

export async function getRun(id: string): Promise<RunSummary> {
  return request(`/v1/runs/${id}`, { method: "GET" }, (data) =>
    runSummarySchema.parse(data),
  );
}

export async function getRunResults(id: string): Promise<RunResults> {
  return request(`/v1/runs/${id}/results`, { method: "GET" }, (data) =>
    runResultsSchema.parse(data),
  );
}

export async function createSuite(
  name: string,
  description = "",
): Promise<Suite> {
  return request(
    "/v1/suites",
    {
      method: "POST",
      body: JSON.stringify({ name, description }),
    },
    (data) => suiteSchema.parse(data),
  );
}

export async function createCase(
  suiteId: string,
  input: {
    name: string;
    prompt: string;
    validators: Array<{ type: string; value?: string }>;
    timeout_ms?: number;
  },
): Promise<TestCase> {
  return request(
    `/v1/suites/${suiteId}/cases`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    (data) => testCaseSchema.parse(data),
  );
}

export async function createRun(
  suiteId: string,
  models: Array<{ provider: string; model: string }>,
): Promise<RunSummary> {
  return request(
    "/v1/runs",
    {
      method: "POST",
      body: JSON.stringify({ suite_id: suiteId, models }),
    },
    (data) => runSummarySchema.parse(data),
  );
}

/** Orchestrate suite → case → run for the single-eval form. */
export async function submitNewEvaluation(
  form: NewEvaluationForm,
): Promise<RunSummary> {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const suite = await createSuite(`ui-${stamp}`, "Created from the-judge-ui");

  const validator: { type: string; value?: string } = {
    type: form.validatorType,
  };
  if (form.expectedValue?.trim()) {
    validator.value = form.expectedValue.trim();
  }

  await createCase(suite.id, {
    name: "case-1",
    prompt: form.prompt.trim(),
    validators: [validator],
    timeout_ms: 30000,
  });

  return createRun(suite.id, [
    { provider: form.provider, model: form.model.trim() },
  ]);
}
