import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-xl font-medium text-text">Run not found</h1>
      <p className="mt-2 text-sm text-text-muted">
        That evaluation run does not exist or was removed.
      </p>
      <Link
        href="/runs"
        className="mt-6 inline-block text-sm text-brand hover:underline"
      >
        Back to runs
      </Link>
    </div>
  );
}
