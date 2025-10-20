import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["src/e2e/**"],
    coverage: { provider: "v8" }
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react"
  }
});
