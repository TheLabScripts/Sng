"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SnagdTheme = "snagd-light" | "snagd-black";

type ThemeContextValue = { theme: SnagdTheme; setTheme: (theme: SnagdTheme) => void; toggleTheme: () => void; };
const ThemeContext = createContext<ThemeContextValue | null>(null);
const themeStorageKey = "snagd-theme-v2";

function normalizeTheme(value: string | null): SnagdTheme {
  return value === "snagd-black" ? "snagd-black" : "snagd-light";
}

function applyTheme(theme: SnagdTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "snagd-light" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<SnagdTheme>("snagd-light");

  useEffect(() => {
    const nextTheme = normalizeTheme(window.localStorage.getItem(themeStorageKey));
    setThemeState(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme(nextTheme) {
      setThemeState(nextTheme);
      window.localStorage.setItem(themeStorageKey, nextTheme);
      applyTheme(nextTheme);
    },
    toggleTheme() {
      const nextTheme = theme === "snagd-light" ? "snagd-black" : "snagd-light";
      setThemeState(nextTheme);
      window.localStorage.setItem(themeStorageKey, nextTheme);
      applyTheme(nextTheme);
    }
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useSnagdTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useSnagdTheme must be used inside ThemeProvider");
  return context;
}
