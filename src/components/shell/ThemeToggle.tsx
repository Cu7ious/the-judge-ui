"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded px-2 py-1 text-sm text-brand-fg/80"
        aria-label="Toggle theme"
        disabled
      >
        Theme
      </button>
    );
  }

  const next =
    theme === "system"
      ? resolvedTheme === "dark"
        ? "light"
        : "dark"
      : theme === "dark"
        ? "light"
        : "dark";

  const label =
    theme === "system"
      ? `System (${resolvedTheme})`
      : theme === "dark"
        ? "Dark"
        : "Light";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      onContextMenu={(e) => {
        e.preventDefault();
        setTheme("system");
      }}
      className="rounded px-2 py-1 text-sm text-brand-fg/90 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label={`Theme: ${label}. Click to switch to ${next}. Right-click for system.`}
      title="Click to toggle · right-click for system"
    >
      {label}
    </button>
  );
}
