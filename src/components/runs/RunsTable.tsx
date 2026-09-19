import Link from "next/link";
import type { RunSummary } from "@/lib/api/schemas";
import {
  deriveResult,
  formatDateTime,
  formatLatency,
  modelsLabel,
  shortId,
} from "@/lib/format";
import { ResultBadge, StatusBadge } from "./RunStatusBadge";
import { Card, EmptyState, ButtonLink } from "@/components/ui/primitives";

export function RunsTable({ runs }: { runs: RunSummary[] }) {
  if (runs.length === 0) {
    return (
      <Card>
        <EmptyState
          title="No evaluation runs yet"
          description="Create your first evaluation to see results here."
          action={
            <ButtonLink href="/runs/new" variant="primary">
              New Evaluation
            </ButtonLink>
          }
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-text-subtle">
              <th className="px-4 py-3 font-medium">Run</th>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Result</th>
              <th className="px-4 py-3 font-medium">Latency</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr
                key={run.id}
                className="border-b border-border last:border-0 hover:bg-surface-muted/60"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/runs/${run.id}`}
                    className="font-mono text-brand hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {shortId(run.id)}
                  </Link>
                </td>
                <td className="max-w-[14rem] truncate px-4 py-3 text-text">
                  {modelsLabel(run.models)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={run.status} />
                </td>
                <td className="px-4 py-3">
                  <ResultBadge result={deriveResult(run)} />
                </td>
                <td className="px-4 py-3 tabular-nums text-text-muted">
                  {formatLatency(run.max_latency_ms)}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {formatDateTime(run.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-border md:hidden">
        {runs.map((run) => (
          <li key={run.id}>
            <Link
              href={`/runs/${run.id}`}
              className="block px-4 py-4 hover:bg-surface-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-brand">
                  {shortId(run.id)}
                </span>
                <ResultBadge result={deriveResult(run)} />
              </div>
              <p className="mt-1 truncate text-sm text-text">
                {modelsLabel(run.models)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                <StatusBadge status={run.status} />
                <span>{formatLatency(run.max_latency_ms)}</span>
                <span>{formatDateTime(run.created_at)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
