"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ApiError, getRunResults } from "@/lib/api/client";
import type { RunResults } from "@/lib/api/schemas";
import {
  formatDateTime,
  formatLatency,
  isTerminalRunStatus,
  modelsLabel,
  shortId,
} from "@/lib/format";
import { StatusBadge } from "./RunStatusBadge";
import { Card, ErrorState, Spinner } from "@/components/ui/primitives";

const POLL_MS = 2000;

export function RunDetails({
  runId,
  initial,
}: {
  runId: string;
  initial: RunResults;
}) {
  const [data, setData] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(
    !isTerminalRunStatus(initial.run.status),
  );

  const refresh = useCallback(async () => {
    try {
      const next = await getRunResults(runId);
      setData(next);
      setError(null);
      if (isTerminalRunStatus(next.run.status)) {
        setPolling(false);
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to refresh";
      setError(message);
    }
  }, [runId]);

  useEffect(() => {
    if (!polling) return;
    const id = window.setInterval(() => {
      void refresh();
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [polling, refresh]);

  const { run, results } = data;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-sm text-text-muted">
              {shortId(run.id)}
              <span className="ml-2 text-text-subtle">{run.id}</span>
            </p>
            <p className="mt-1 text-base font-medium text-text">
              {modelsLabel(run.models)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={run.status} />
            {polling ? (
              <span className="text-xs text-text-subtle">Updating…</span>
            ) : null}
          </div>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Meta label="Created" value={formatDateTime(run.created_at)} />
          <Meta label="Started" value={formatDateTime(run.started_at)} />
          <Meta label="Finished" value={formatDateTime(run.finished_at)} />
          <Meta label="Suite" value={shortId(run.suite_id)} mono />
        </dl>

        {run.error ? (
          <p className="mt-4 rounded border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">
            {run.error}
          </p>
        ) : null}
      </Card>

      {error ? <ErrorState message={error} /> : null}

      {results.length === 0 ? (
        <Card>
          {polling ? (
            <Spinner label="Waiting for case results…" />
          ) : (
            <p className="px-6 py-10 text-center text-sm text-text-muted">
              No case results for this run.
            </p>
          )}
        </Card>
      ) : (
        results.map((cr) => (
          <Card key={cr.id} className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
              <div>
                <p className="text-sm font-medium text-text">
                  {cr.test_case_name}
                </p>
                <p className="text-xs text-text-muted">
                  {cr.provider}/{cr.model}
                </p>
              </div>
              <StatusBadge status={cr.status} />
            </div>

            <div className="space-y-4 px-5 py-4 text-sm">
              <Section title="Prompt">
                <pre className="whitespace-pre-wrap break-words rounded bg-surface-muted p-3 font-sans text-text">
                  {cr.prompt}
                </pre>
              </Section>

              <Section title="Model response">
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded bg-surface-muted p-3 font-mono text-xs text-text">
                  {cr.response_text?.length
                    ? cr.response_text
                    : cr.error
                      ? `(no response)\n${cr.error}`
                      : "—"}
                </pre>
              </Section>

              <Section title="Validation">
                {cr.validations.length === 0 ? (
                  <p className="text-text-muted">No validators recorded yet.</p>
                ) : (
                  <ul className="divide-y divide-border rounded border border-border">
                    {cr.validations.map((v) => (
                      <li
                        key={v.id}
                        className="flex flex-wrap items-start justify-between gap-2 px-3 py-2"
                      >
                        <div>
                          <p className="font-medium text-text">
                            {v.validator_type}
                          </p>
                          <p className="text-text-muted">{v.message}</p>
                        </div>
                        <span
                          className={
                            v.passed
                              ? "text-xs font-medium text-success"
                              : "text-xs font-medium text-danger"
                          }
                        >
                          {v.passed ? "Passed" : "Failed"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <dl className="grid gap-2 sm:grid-cols-3">
                <Meta label="Latency" value={formatLatency(cr.latency_ms)} />
                <Meta label="Attempts" value={String(cr.attempt)} />
                <Meta
                  label="Finished"
                  value={formatDateTime(cr.finished_at)}
                />
              </dl>

              {cr.error ? (
                <p className="rounded border border-danger/30 bg-danger-bg px-3 py-2 text-danger">
                  {cr.error}
                </p>
              ) : null}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-text-subtle">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-text-subtle">{label}</dt>
      <dd className={`mt-0.5 text-text ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
