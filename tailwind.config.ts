import type { Config } from "tailwindcss";

// Snagd "deal terminal" design tokens. Colors are driven by CSS variables
// declared in globals.css so the whole system can be retuned in one place.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        line: "var(--line)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        profit: "var(--profit)",
        "profit-dim": "var(--profit-dim)",
        amber: "var(--amber)",
        pass: "var(--pass)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(61,220,132,0.25), 0 0 40px -8px rgba(61,220,132,0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -24px rgba(0,0,0,0.8)",
      },
      maxWidth: {
        shell: "1160px",
      },
      keyframes: {
        "rise": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        rise: "rise 0.6s cubic-bezier(0.22,1,0.36,1) both",
        ticker: "ticker 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
