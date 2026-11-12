import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--rgb-background) / <alpha-value>)",
        surface: "rgb(var(--rgb-surface) / <alpha-value>)",
        surfaceHover: "rgb(var(--rgb-surface-hover) / <alpha-value>)",
        border: "rgb(var(--rgb-border) / <alpha-value>)",
        foreground: "rgb(var(--rgb-foreground) / <alpha-value>)",
        body: "rgb(var(--rgb-body) / <alpha-value>)",
        muted: "rgb(var(--rgb-muted) / <alpha-value>)",
        faint: "rgb(var(--rgb-faint) / <alpha-value>)",
        accent: "rgb(var(--rgb-accent) / <alpha-value>)",
        code: "rgb(var(--rgb-code) / <alpha-value>)",
        ok: "rgb(var(--rgb-ok) / <alpha-value>)",
        warn: "rgb(var(--rgb-warn) / <alpha-value>)",
        danger: "rgb(var(--rgb-danger) / <alpha-value>)",
      },
      fontFamily: {
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: [
          "var(--font-space-grotesk)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
