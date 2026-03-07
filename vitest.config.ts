import { fileURLToPath, URL } from "url";
import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

// Separate from vite.config.ts intentionally — TanStack Router plugin
// breaks in the test environment, so we only include solidPlugin here.
export default defineConfig({
  plugins: [solidPlugin()],
  define: {
    __CMS_EDITOR__: JSON.stringify("quill"),
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/test/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/**/*.d.ts",
        "src/routeTree.gen.ts",
        "src/main.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // "development" condition picks up the non-minified SolidJS reactive build
    // required for signals/effects to work correctly inside tests.
    conditions: ["development", "browser"],
  },
});
