"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SnagdTheme = "tokyo-night" | "tokyo-day";

type ThemeContextValue = {
  theme: SnagdTheme;
  setTheme: (theme: SnagdTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: SnagdTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "tokyo-day" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<SnagdTheme>("tokyo-night");

  useEffect(() => {
    const stored = window.localStorage.getItem("snagd-theme");
    const nextTheme: SnagdTheme = stored === "tokyo-day" ? "tokyo-day" : "tokyo-night";
    setThemeState(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme(nextTheme) {
        setThemeState(nextTheme);
        window.localStorage.setItem("snagd-theme", nextTheme);
        applyTheme(nextTheme);
      },
      toggleTheme() {
        const nextTheme = theme === "tokyo-night" ? "tokyo-day" : "tokyo-night";
        setThemeState(nextTheme);
        window.localStorage.setItem("snagd-theme", nextTheme);
        applyTheme(nextTheme);
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useSnagdTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useSnagdTheme must be used inside ThemeProvider");
  }
  return context;
}