import type { RunSummary } from "./api/schemas";

export function shortId(id: string): string {
  return id.slice(0, 8);
}

export function formatLatency(ms: number | null | undefined): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function modelsLabel(
  models: Array<{ provider: string; model: string }>,
): string {
  if (!models.length) return "—";
  return models.map((m) => `${m.provider}/${m.model}`).join(", ");
}

/** Derive pass/fail/pending display from run summary counts. */
export type ResultKind = "pass" | "fail" | "running" | "cancelled" | "unknown";

export function deriveResult(run: RunSummary): ResultKind {
  if (run.status === "pending" || run.status === "running") return "running";
  if (run.status === "cancelled") return "cancelled";
  if (run.status === "failed" || run.failed > 0 || run.error_count > 0) {
    return "fail";
  }
  if (run.status === "completed" && run.succeeded > 0) return "pass";
  if (run.status === "completed") return "pass";
  return "unknown";
}

export function isTerminalRunStatus(status: string): boolean {
  return status === "completed" || status === "failed" || status === "cancelled";
}
