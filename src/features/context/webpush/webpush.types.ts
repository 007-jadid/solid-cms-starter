export type PermissionState = "default" | "granted" | "denied";

export interface WebPushState {
  /** Browser notification permission status */
  permission: PermissionState;
  /** Whether a push subscription is active */
  pushSubscribed: boolean;
}

export interface WebPushContextValue {
  state: WebPushState;
  /** Request browser notification permission */
  requestPermission: () => Promise<PermissionState>;
  /** Subscribe to web push (returns PushSubscription for backend registration) */
  subscribeToPush: () => Promise<PushSubscription | null>;
  /** Cancel the active push subscription */
  unsubscribeFromPush: () => Promise<void>;
  /** Show a native browser notification via the service worker */
  showBrowserNotification: (title: string, options?: NotificationOptions) => void;
}
