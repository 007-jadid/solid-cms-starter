import { createContext, type JSX, onCleanup, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { useNotificationsSafe } from "~/features/context/notifications";
import { usePWASafe } from "~/features/context/pwa";
import type { PermissionState, WebPushContextValue, WebPushState } from "./webpush.types";
import { urlBase64ToUint8Array } from "./webpush.utils";

export interface WebPushProviderConfig {
  /** VAPID public key. Falls back to VITE_VAPID_PUBLIC_KEY env var. */
  vapidPublicKey?: string | null;
}

const WebPushContext = createContext<WebPushContextValue>();

export function WebPushProvider(props: { children: JSX.Element; config?: WebPushProviderConfig }) {
  const pwa = usePWASafe();
  const notifications = useNotificationsSafe();

  const vapidKey =
    props.config?.vapidPublicKey ??
    (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined) ??
    null;

  const [state, setState] = createStore<WebPushState>({
    permission:
      typeof Notification !== "undefined"
        ? (Notification.permission as PermissionState)
        : "default",
    pushSubscribed: false,
  });

  const requestPermission = async (): Promise<PermissionState> => {
    if (typeof Notification === "undefined") return "denied";
    const result = (await Notification.requestPermission()) as PermissionState;
    setState("permission", result);
    return result;
  };

  const subscribeToPush = async (): Promise<PushSubscription | null> => {
    const registration = pwa?.getRegistration();
    if (!registration?.pushManager) return null;

    if (!vapidKey) {
      console.warn(
        "[WebPush] VAPID public key not configured. Pass vapidPublicKey to webPushPlugin.",
      );
      return null;
    }

    if (state.permission !== "granted") {
      const perm = await requestPermission();
      if (perm !== "granted") return null;
    }

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey).buffer as ArrayBuffer,
      });
      setState("pushSubscribed", true);
      return subscription;
    } catch (err) {
      console.error("[WebPush] Push subscription failed:", err);
      return null;
    }
  };

  const unsubscribeFromPush = async (): Promise<void> => {
    const registration = pwa?.getRegistration();
    const sub = await registration?.pushManager.getSubscription();
    if (sub) {
      await sub.unsubscribe();
      setState("pushSubscribed", false);
    }
  };

  const showBrowserNotification = (title: string, options?: NotificationOptions) => {
    const registration = pwa?.getRegistration();
    registration?.showNotification(title, { icon: "/logo192.png", ...options });
  };

  // Forward SW push messages → in-app notification store
  onMount(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === "push-notification") {
        const payload = event.data.payload as {
          title?: string;
          body?: string;
          icon?: string;
          image?: string;
          actionUrl?: string;
          category?: string;
          priority?: "low" | "normal" | "high" | "urgent";
          data?: Record<string, unknown>;
        };
        notifications?.addNotification({
          title: payload.title ?? "Notification",
          body: payload.body ?? "",
          icon: payload.icon,
          image: payload.image,
          actionUrl: payload.actionUrl,
          category: payload.category,
          priority: payload.priority ?? "normal",
          data: payload.data,
        });
      }
    };

    navigator.serviceWorker.addEventListener("message", handleSWMessage);
    onCleanup(() => navigator.serviceWorker.removeEventListener("message", handleSWMessage));
  });

  const value: WebPushContextValue = {
    state,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    showBrowserNotification,
  };

  return <WebPushContext.Provider value={value}>{props.children}</WebPushContext.Provider>;
}

export function useWebPush(): WebPushContextValue {
  const ctx = useContext(WebPushContext);
  if (!ctx) throw new Error("useWebPush must be used within a WebPushProvider");
  return ctx;
}

export function useWebPushSafe(): WebPushContextValue | null {
  return useContext(WebPushContext) ?? null;
}
