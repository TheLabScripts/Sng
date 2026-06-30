"use client";

import { useSnagdTheme } from "@/lib/theme/ThemeProvider";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useSnagdTheme();
  const isDay = theme === "tokyo-day";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-grid h-10 w-10 shrink-0 place-items-center rounded-card border border-line bg-surface text-ink shadow-soft transition hover:border-info hover:text-info"
      aria-label={isDay ? "Switch to Tokyo Night" : "Switch to Tokyo Day"}
      title={isDay ? "Tokyo Night" : "Tokyo Day"}
    >
      {isDay ? <MoonIcon /> : <SunIcon />}
      {!compact && <span className="sr-only">{isDay ? "Tokyo Night" : "Tokyo Day"}</span>}
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M20 14.6A7.7 7.7 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}