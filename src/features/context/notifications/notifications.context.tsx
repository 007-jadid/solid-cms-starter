import { createContext, createEffect, type JSX, on, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { toast } from "solid-sonner";
import type {
  AppNotification,
  NewNotification,
  NotificationsContextValue,
  NotificationsState,
} from "./notifications.types";
import { generateId, loadNotifications, saveNotifications } from "./notifications.utils";

export interface NotificationsProviderConfig {
  maxHistory?: number;
  showToast?: boolean;
}

const defaultConfig: Required<NotificationsProviderConfig> = {
  maxHistory: 100,
  showToast: true,
};

const NotificationsContext = createContext<NotificationsContextValue>();

export function NotificationsProvider(props: {
  children: JSX.Element;
  config?: NotificationsProviderConfig;
}) {
  const config = { ...defaultConfig, ...props.config };
  const initial = loadNotifications();

  const [state, setState] = createStore<NotificationsState>({
    notifications: initial,
    unreadCount: initial.filter((n) => n.status === "unread").length,
  });

  // Persist on change
  createEffect(
    on(
      () => state.notifications.length,
      () => saveNotifications([...state.notifications], config.maxHistory),
    ),
  );

  // Keep unreadCount in sync
  createEffect(() => {
    setState("unreadCount", state.notifications.filter((n) => n.status === "unread").length);
  });

  const addNotification = (input: NewNotification) => {
    const notification: AppNotification = {
      ...input,
      id: input.id ?? generateId(),
      createdAt: input.createdAt ?? new Date().toISOString(),
      status: input.status ?? "unread",
    };

    setState(
      produce((s) => {
        s.notifications.unshift(notification);
        if (s.notifications.length > config.maxHistory) {
          s.notifications.length = config.maxHistory;
        }
      }),
    );

    if (config.showToast) {
      toast.info(notification.title, { description: notification.body });
    }
  };

  const markAsRead = (id: string) => {
    setState(
      produce((s) => {
        const n = s.notifications.find((n) => n.id === id);
        if (n) n.status = "read";
      }),
    );
  };

  const markAllAsRead = () => {
    setState(
      produce((s) => {
        for (const n of s.notifications) {
          if (n.status === "unread") n.status = "read";
        }
      }),
    );
  };

  const remove = (id: string) => {
    setState(
      "notifications",
      state.notifications.filter((n) => n.id !== id),
    );
  };

  const clearAll = () => setState("notifications", []);

  const value: NotificationsContextValue = {
    state,
    addNotification,
    markAsRead,
    markAllAsRead,
    remove,
    clearAll,
  };

  return (
    <NotificationsContext.Provider value={value}>{props.children}</NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
  return ctx;
}

export function useNotificationsSafe(): NotificationsContextValue | null {
  return useContext(NotificationsContext) ?? null;
}
