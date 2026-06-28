import { defineConfig } from "@playwright/test";

const port = 3099;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
  },
  webServer: {
    command: `pnpm exec serve out -l ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
