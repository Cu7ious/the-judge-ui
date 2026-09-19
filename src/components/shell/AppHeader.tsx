import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 bg-brand text-brand-fg shadow-sm">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-4">
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/runs"
            className="font-semibold tracking-tight hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            the-judge
          </Link>
          <Link
            href="/runs"
            className="text-brand-fg/85 hover:text-brand-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Runs
          </Link>
          <Link
            href="/runs/new"
            className="text-brand-fg/85 hover:text-brand-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            New
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-medium tracking-[0.2em] text-brand-fg/70 sm:inline">
            CU7IOUS
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
