import Link from "next/link";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>
  );
}

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="mb-6 text-center text-xl font-medium text-text-muted">
      {children}
    </h1>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <p className="text-base font-medium text-text">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-text-muted">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div
      className="rounded-[var(--radius-card)] border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger"
      role="alert"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-danger/90">{message}</p>
    </div>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="flex items-center justify-center gap-2 py-16 text-sm text-text-muted"
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border-strong border-t-brand"
        aria-hidden
      />
      {label}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles =
    variant === "primary"
      ? "bg-brand text-brand-fg hover:bg-brand-hover"
      : variant === "secondary"
        ? "border border-border-strong bg-surface text-text hover:bg-surface-muted"
        : "text-text-muted hover:text-text";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${styles}`}
    >
      {children}
    </Link>
  );
}

