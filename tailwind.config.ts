import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        graphite: "var(--color-graphite)",
        smoke: "var(--color-smoke)",
        bone: "var(--color-bone)",
        brass: "var(--color-brass)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: { pulse: "cubic-bezier(0.16, 1, 0.3, 1)" },
      transitionDuration: { pulse: "480ms" },
      maxWidth: { container: "1440px" },
      letterSpacing: { "wider-pulse": "0.16em" },
    },
  },
  plugins: [],
};

export default config;
