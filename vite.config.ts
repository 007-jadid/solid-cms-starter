import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { URL, fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const rawMapBuildMode = env.VITE_MAP_BUILD_MODE ?? "both";
  const mapBuildMode =
    rawMapBuildMode === "none" ||
    rawMapBuildMode === "leaflet" ||
    rawMapBuildMode === "google" ||
    rawMapBuildMode === "both"
      ? rawMapBuildMode
      : "both";

  const rawCmsEditor = env.VITE_CMS_EDITOR ?? "quill";
  const cmsEditor: "quill" | "none" = rawCmsEditor === "none" ? "none" : "quill";

  return {
    define: {
      __CMS_MAP_BUILD_MODE__: JSON.stringify(mapBuildMode),
      __CMS_EDITOR__: JSON.stringify(cmsEditor),
    },
    plugins: [
      tanstackRouter({ target: "solid", autoCodeSplitting: true }),
      solidPlugin(),
      devtools(),
      tailwindcss(),
      VitePWA({
        registerType: "prompt",
        includeAssets: ["favicon.ico", "logo192.png", "logo512.png"],
        manifest: false, // use existing public/manifest.json
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          importScripts: ["sw-push.js"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "gstatic-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
      process.env.ANALYZE === "true" &&
        visualizer({
          gzipSize: true,
          brotliSize: true,
          filename: "dist/stats.html",
        }),
    ],
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;

            // SolidJS core
            if (id.includes("solid-js")) return "vendor-solid";

            // TanStack — split by package to avoid one mega-chunk
            if (
              id.includes("@tanstack/solid-router-devtools") ||
              id.includes("@tanstack/solid-query-devtools") ||
              id.includes("@tanstack/devtools-vite")
            )
              return "vendor-tanstack-devtools";
            if (
              id.includes("@tanstack/solid-router") ||
              id.includes("@tanstack/router")
            )
              return "vendor-tanstack-router";
            if (
              id.includes("@tanstack/solid-query") ||
              id.includes("@tanstack/query")
            )
              return "vendor-tanstack-query";
            if (
              id.includes("@tanstack/solid-form") ||
              id.includes("@tanstack/form")
            )
              return "vendor-tanstack-form";
            if (
              id.includes("@tanstack/solid-table") ||
              id.includes("@tanstack/table")
            )
              return "vendor-tanstack-table";
            if (
              id.includes("@tanstack/solid-virtual") ||
              id.includes("@tanstack/virtual")
            )
              return "vendor-tanstack-virtual";
            if (id.includes("@tanstack/valibot-adapter"))
              return "vendor-tanstack-misc";
            if (id.includes("@tanstack")) return "vendor-tanstack-misc";

            // Charts
            if (id.includes("chart.js") || id.includes("solid-chartjs"))
              return "vendor-charts";

            // Map libraries — only for the enabled build mode
            // Leaflet base (separate from geoman so drawing tools stay lazy)
            if (
              (mapBuildMode === "leaflet" || mapBuildMode === "both") &&
              id.includes("leaflet") &&
              !id.includes("@geoman-io")
            )
              return "vendor-leaflet";
            // @geoman-io is dynamically imported only when drawingTools prop is
            // used — keeping it separate lets the base map load without it
            if (
              (mapBuildMode === "leaflet" || mapBuildMode === "both") &&
              id.includes("@geoman-io")
            )
              return "vendor-leaflet-draw";
            if (
              (mapBuildMode === "leaflet" || mapBuildMode === "both") &&
              id.includes("terra-draw") &&
              !id.includes("google")
            )
              return "vendor-terra-draw";
            if (
              (mapBuildMode === "google" || mapBuildMode === "both") &&
              (id.includes("@googlemaps") ||
                id.includes("terra-draw-google-maps-adapter"))
            )
              return "vendor-google-maps";

            // Rich text editor — only when quill is the chosen editor
            if (cmsEditor === "quill" && id.includes("quill"))
              return "vendor-editor";

            // UI component libraries (corvu ecosystem includes solid-* helpers)
            if (
              id.includes("@kobalte") ||
              id.includes("@corvu") ||
              id.includes("solid-dismissible") ||
              id.includes("solid-presence") ||
              id.includes("solid-focus-trap") ||
              id.includes("solid-prevent-scroll") ||
              id.includes("solid-transition-size")
            )
              return "vendor-kobalte";

            // Animation
            if (id.includes("gsap")) return "vendor-gsap";

            // Form validation
            if (id.includes("valibot")) return "vendor-valibot";

            return "vendor-misc";
          },
        },
      },
    },
  };
});
