import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 bg-brand text-brand-fg shadow-sm">
      <div className="relative mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-4">
        <nav className="z-10 flex items-center gap-4 text-sm">
          <Link
            href="/runs"
            className="font-semibold tracking-tight hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            The Judge
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

        <div className="absolute inset-0 flex items-center justify-center">
          <Link target="_blank" href="https://cu7ious.dev">
            <Image
              src="/by-CU7IOUS.svg"
              alt="CU7IOUS"
              width={149}
              height={25}
              className="h-5 w-auto mb-[-5px]"
              priority
            />
          </Link>
        </div>

        <div className="z-10 flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
