import Link from "next/link";
import { listRuns, ApiError } from "@/lib/api/client";
import { RunsTable } from "@/components/runs/RunsTable";
import { ButtonLink, ErrorState } from "@/components/ui/primitives";

export const dynamic = "force-dynamic";

export default async function RunsPage() {
  let error: string | null = null;
  let runs = null;

  try {
    runs = await listRuns();
  } catch (err) {
    error =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Failed to load runs";
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-medium text-text-muted">
          Evaluation runs
        </h1>
        <ButtonLink href="/runs/new" variant="primary">
          New Evaluation
        </ButtonLink>
      </div>

      {error ? (
        <div className="flex flex-col gap-4">
          <ErrorState
            title="Could not load runs"
            message={`${error}. Is the Go API running on port 8080?`}
          />
          <p className="text-center text-sm text-text-muted">
            Start the backend, then{" "}
            <Link href="/runs" className="text-brand hover:underline">
              refresh
            </Link>
            .
          </p>
        </div>
      ) : (
        <RunsTable runs={runs ?? []} />
      )}
    </div>
  );
}
