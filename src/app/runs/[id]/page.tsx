import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getRunResults } from "@/lib/api/client";
import type { RunResults } from "@/lib/api/schemas";
import { RunDetails } from "@/components/runs/RunDetails";
import { ErrorState, PageTitle } from "@/components/ui/primitives";

export const dynamic = "force-dynamic";

export default async function RunDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const loaded = await loadRunResults(id);

  if (loaded.kind === "not_found") {
    notFound();
  }

  if (loaded.kind === "error") {
    return (
      <div>
        <PageTitle>Run details</PageTitle>
        <ErrorState title="Could not load run" message={loaded.message} />
        <p className="mt-4 text-center text-sm">
          <Link href="/runs" className="text-brand hover:underline">
            Back to runs
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-xl font-medium text-text-muted">Run details</h1>
        <Link href="/runs" className="text-sm text-text-muted hover:text-text">
          ← All runs
        </Link>
      </div>
      <RunDetails runId={id} initial={loaded.data} />
    </div>
  );
}

async function loadRunResults(
  id: string,
): Promise<
  | { kind: "ok"; data: RunResults }
  | { kind: "not_found" }
  | { kind: "error"; message: string }
> {
  try {
    const data = await getRunResults(id);
    return { kind: "ok", data };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { kind: "not_found" };
    }
    const message =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Failed to load run";
    return { kind: "error", message };
  }
}
