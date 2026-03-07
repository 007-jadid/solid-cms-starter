export type NotificationPriority = "low" | "normal" | "high" | "urgent";
export type NotificationStatus = "unread" | "read" | "archived";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  image?: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  /** ISO timestamp */
  createdAt: string;
  /** Optional click action URL */
  actionUrl?: string;
  /** Optional category for filtering */
  category?: string;
  /** Arbitrary metadata from backend */
  data?: Record<string, unknown>;
}

export type NewNotification = Omit<AppNotification, "id" | "createdAt" | "status"> &
  Partial<Pick<AppNotification, "id" | "createdAt" | "status">>;

export interface NotificationsState {
  /** Notification history */
  notifications: AppNotification[];
  /** Count of unread notifications */
  unreadCount: number;
}

export interface NotificationsContextValue {
  state: NotificationsState;
  /** Add a notification (from WebSocket, SSE, SW push, or any source) */
  addNotification: (notification: NewNotification) => void;
  /** Mark a notification as read */
  markAsRead: (id: string) => void;
  /** Mark all as read */
  markAllAsRead: () => void;
  /** Remove a notification */
  remove: (id: string) => void;
  /** Clear all notifications */
  clearAll: () => void;
}
