import type { ResultKind } from "@/lib/format";

const statusStyles: Record<string, string> = {
  pending: "bg-info-bg text-info",
  running: "bg-warning-bg text-warning",
  completed: "bg-success-bg text-success",
  succeeded: "bg-success-bg text-success",
  failed: "bg-danger-bg text-danger",
  error: "bg-danger-bg text-danger",
  cancelled: "bg-surface-muted text-text-muted",
};

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? "bg-surface-muted text-text-muted";
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      {status}
    </span>
  );
}

const resultStyles: Record<ResultKind, string> = {
  pass: "bg-success-bg text-success",
  fail: "bg-danger-bg text-danger",
  running: "bg-warning-bg text-warning",
  cancelled: "bg-surface-muted text-text-muted",
  unknown: "bg-surface-muted text-text-muted",
};

const resultLabels: Record<ResultKind, string> = {
  pass: "Pass",
  fail: "Fail",
  running: "—",
  cancelled: "Cancelled",
  unknown: "—",
};

export function ResultBadge({ result }: { result: ResultKind }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${resultStyles[result]}`}
    >
      {resultLabels[result]}
    </span>
  );
}
