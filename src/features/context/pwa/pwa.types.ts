export interface PWAState {
  /** Whether the app can be installed (install prompt intercepted) */
  canInstall: boolean;
  /** Whether the app is already installed (standalone mode) */
  isInstalled: boolean;
  /** Whether a new version is available */
  updateAvailable: boolean;
  /** Whether the service worker is registered and active */
  swRegistered: boolean;
  /** Whether the app is currently offline */
  isOffline: boolean;
}

export interface PWAContextValue {
  state: PWAState;
  /** Trigger the native install prompt */
  install: () => Promise<boolean>;
  /** Apply the pending update (reloads the page) */
  applyUpdate: () => void;
  /** Manually check for updates */
  checkForUpdate: () => Promise<void>;
  /** Get the SW registration (for push subscription etc.) */
  getRegistration: () => ServiceWorkerRegistration | null;
}
