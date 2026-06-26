import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--nl-primary) / <alpha-value>)",
        background: "hsl(var(--nl-background) / <alpha-value>)",
        foreground: "hsl(var(--nl-foreground) / <alpha-value>)",
      },
    },
  },
};

export default config;
