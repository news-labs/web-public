import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
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
        "accent-2": "hsl(var(--nf-accent-2) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--nf-radius)",
        md: "calc(var(--nf-radius) - 2px)",
        sm: "calc(var(--nf-radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
