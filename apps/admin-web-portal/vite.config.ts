import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/cp/",
  server: { port: 5176 },
  build: { outDir: "dist", emptyOutDir: true, target: "es2022" },
});
