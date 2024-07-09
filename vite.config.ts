/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov"],
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "/src") },
  },
});
