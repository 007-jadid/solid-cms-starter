import { createContext, type JSX, onCleanup, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { toast } from "solid-sonner";
import type { PWAContextValue, PWAState } from "./pwa.types";
import { isStandalone } from "./pwa.utils";

export interface PWAProviderConfig {
  showInstallPrompt?: boolean;
  showUpdateBanner?: boolean;
}

const defaultPWAConfig: Required<PWAProviderConfig> = {
  showInstallPrompt: true,
  showUpdateBanner: true,
};

const PWAContext = createContext<PWAContextValue>();

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAProvider(props: { children: JSX.Element; config?: PWAProviderConfig }) {
  const config = { ...defaultPWAConfig, ...props.config };

  const [state, setState] = createStore<PWAState>({
    canInstall: false,
    isInstalled: isStandalone(),
    updateAvailable: false,
    swRegistered: false,
    isOffline: typeof navigator !== "undefined" ? !navigator.onLine : false,
  });

  let deferredPrompt: BeforeInstallPromptEvent | null = null;
  let swRegistration: ServiceWorkerRegistration | null = null;
  let updateSW: ((reloadPage?: boolean) => Promise<void>) | null = null;

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    const result = await deferredPrompt.prompt();
    deferredPrompt = null;
    setState("canInstall", false);
    return result.outcome === "accepted";
  };

  const applyUpdate = () => {
    updateSW?.(true);
  };

  const checkForUpdate = async () => {
    await swRegistration?.update();
  };

  const getRegistration = () => swRegistration;

  onMount(() => {
    // Intercept install prompt
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setState("canInstall", true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // Track online/offline
    const onOnline = () => setState("isOffline", false);
    const onOffline = () => setState("isOffline", true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    // Register SW via vite-plugin-pwa
    import("virtual:pwa-register").then(({ registerSW }) => {
      updateSW = registerSW({
        onRegisteredSW(_swUrl, registration) {
          swRegistration = registration ?? null;
          setState("swRegistered", true);
          // Periodic update check (every 60 minutes)
          if (registration) {
            setInterval(() => registration.update(), 60 * 60 * 1000);
          }
        },
        onNeedRefresh() {
          setState("updateAvailable", true);
          if (config.showUpdateBanner) {
            toast.info("New version available!", {
              action: { label: "Update", onClick: () => applyUpdate() },
              duration: Number.POSITIVE_INFINITY,
            });
          }
        },
        onOfflineReady() {
          toast.success("App ready for offline use");
        },
      });
    });

    onCleanup(() => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    });
  });

  const value: PWAContextValue = {
    state,
    install,
    applyUpdate,
    checkForUpdate,
    getRegistration,
  };

  return <PWAContext.Provider value={value}>{props.children}</PWAContext.Provider>;
}

export function usePWA(): PWAContextValue {
  const ctx = useContext(PWAContext);
  if (!ctx) throw new Error("usePWA must be used within a PWAProvider");
  return ctx;
}

export function usePWASafe(): PWAContextValue | null {
  return useContext(PWAContext) ?? null;
}
