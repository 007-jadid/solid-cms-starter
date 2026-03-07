import { createCMS } from "./create-cms";
import { pwaPlugin } from "./plugins/pwa";

// ─────────────────────────────────────────────────────────────────
// CMS Plugin Registry
// ─────────────────────────────────────────────────────────────────
// Add/remove plugins here. Only registered plugins provide types,
// context, and navbar UI. `as const` is required for type safety.
//
// Example with all plugins:
//   createCMS([
//     pwaPlugin({ showInstallPrompt: true, showUpdateBanner: true }),
//     notificationsPlugin({ maxHistory: 100, showToast: true }),
//     webPushPlugin({ vapidPublicKey: "BKx..." }),
//     wsPlugin({ transport: "websocket", autoConnect: true }),
//     ssePlugin({ autoConnect: true }),
//   ] as const);
// ─────────────────────────────────────────────────────────────────

export const cms = createCMS([
  pwaPlugin({ showInstallPrompt: true, showUpdateBanner: true }),
] as const);

export type { CMSInstance, CMSPlugin, ReconnectConfig } from "./core.types";
// Re-export types and factories
export { createCMS } from "./create-cms";
export { notificationsPlugin } from "./plugins/notifications";
export { pwaPlugin } from "./plugins/pwa";
export { ssePlugin } from "./plugins/sse";
export { webPushPlugin } from "./plugins/webpush";
export { wsPlugin } from "./plugins/websocket";
