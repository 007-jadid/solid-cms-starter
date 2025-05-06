import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "solid", autoCodeSplitting: true }),
    solidPlugin(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  ssr: false,
});
