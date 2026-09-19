"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ApiError, submitNewEvaluation } from "@/lib/api/client";
import {
  newEvaluationFormSchema,
  validatorsNeedingValue,
  type NewEvaluationForm,
} from "@/lib/api/schemas";
import { Card } from "@/components/ui/primitives";

const fieldClass =
  "w-full rounded border border-border-strong bg-surface px-3 py-2 text-sm text-text placeholder:text-text-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand";

const initial: NewEvaluationForm = {
  provider: "lmstudio",
  model: "",
  prompt: "",
  validatorType: "contains",
  expectedValue: "",
};

export function NewEvaluationForm() {
  const router = useRouter();
  const [values, setValues] = useState<NewEvaluationForm>(initial);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof NewEvaluationForm, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const needsValue = useMemo(
    () =>
      (validatorsNeedingValue as readonly string[]).includes(
        values.validatorType,
      ),
    [values.validatorType],
  );

  function update<K extends keyof NewEvaluationForm>(
    key: K,
    value: NewEvaluationForm[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const parsed = newEvaluationFormSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof NewEvaluationForm, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof NewEvaluationForm | undefined;
        if (key && !next[key]) next[key] = issue.message;
      }
      setFieldErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      const run = await submitNewEvaluation(parsed.data);
      router.push(`/runs/${run.id}`);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to create evaluation";
      setSubmitError(message);
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <Field
          label="Provider"
          htmlFor="provider"
          error={fieldErrors.provider}
        >
          <select
            id="provider"
            value={values.provider}
            onChange={(e) =>
              update("provider", e.target.value as NewEvaluationForm["provider"])
            }
            className={fieldClass}
          >
            <option value="lmstudio">LM Studio</option>
            <option value="gemini">Gemini</option>
          </select>
        </Field>

        <Field label="Model" htmlFor="model" error={fieldErrors.model}>
          <input
            id="model"
            type="text"
            value={values.model}
            onChange={(e) => update("model", e.target.value)}
            placeholder={
              values.provider === "lmstudio"
                ? "e.g. local-model"
                : "e.g. gemini-2.0-flash"
            }
            className={fieldClass}
            autoComplete="off"
          />
        </Field>

        <Field label="Prompt" htmlFor="prompt" error={fieldErrors.prompt}>
          <textarea
            id="prompt"
            value={values.prompt}
            onChange={(e) => update("prompt", e.target.value)}
            rows={5}
            placeholder="What should the model answer?"
            className={`${fieldClass} resize-y`}
          />
        </Field>

        <Field
          label="Validator"
          htmlFor="validatorType"
          error={fieldErrors.validatorType}
        >
          <select
            id="validatorType"
            value={values.validatorType}
            onChange={(e) =>
              update(
                "validatorType",
                e.target.value as NewEvaluationForm["validatorType"],
              )
            }
            className={fieldClass}
          >
            <option value="contains">Contains</option>
            <option value="exact">Exact match</option>
            <option value="regex">Regex</option>
            <option value="valid_json">Valid JSON</option>
            <option value="no_error">No provider error</option>
            <option value="no_timeout">No timeout</option>
          </select>
        </Field>

        {needsValue ? (
          <Field
            label={
              values.validatorType === "regex"
                ? "Pattern"
                : values.validatorType === "exact"
                  ? "Expected value"
                  : "Expected substring"
            }
            htmlFor="expectedValue"
            error={fieldErrors.expectedValue}
          >
            <input
              id="expectedValue"
              type="text"
              value={values.expectedValue ?? ""}
              onChange={(e) => update("expectedValue", e.target.value)}
              className={fieldClass}
              autoComplete="off"
            />
          </Field>
        ) : null}

        {submitError ? (
          <p
            className="rounded border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded bg-brand px-4 py-2 text-sm font-medium text-brand-fg hover:bg-brand-hover disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {submitting ? "Submitting…" : "Start evaluation"}
          </button>
          <Link href="/runs" className="text-sm text-text-muted hover:text-text">
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
