import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["apps/*/src/**/*.integration.test.ts"],
    fileParallelism: false,
    env: { NODE_ENV: "development" },
  },
});
