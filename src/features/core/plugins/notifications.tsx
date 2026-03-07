import {
  type NotificationsContextValue,
  NotificationsProvider,
  type NotificationsProviderConfig,
  useNotifications,
} from "~/features/context/notifications";
import { NotificationCenter } from "~/features/ui/components/notification-center";
import type { CMSPlugin } from "../core.types";

export type { NotificationsProviderConfig };

export function notificationsPlugin(
  config?: NotificationsProviderConfig,
): CMSPlugin<"notifications", NotificationsContextValue> {
  return {
    name: "notifications",
    Provider: (props) => (
      <NotificationsProvider config={config}>{props.children}</NotificationsProvider>
    ),
    useHook: useNotifications,
    navActions: [NotificationCenter],
  };
}
