import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--nf-bg) / <alpha-value>)",
        foreground: "hsl(var(--nf-text) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--nf-surface) / <alpha-value>)",
          foreground: "hsl(var(--nf-muted) / <alpha-value>)",
        },
        border: "hsl(var(--nf-border) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--nf-card) / <alpha-value>)",
          foreground: "hsl(var(--nf-card-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--nf-accent) / <alpha-value>)",
          foreground: "hsl(0 0% 100% / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--nf-radius)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
