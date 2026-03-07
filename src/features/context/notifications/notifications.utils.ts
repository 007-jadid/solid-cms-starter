import type { AppNotification } from "./notifications.types";

export const STORAGE_KEY = "cms.notifications.v1";

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return [];
  }
}

export function saveNotifications(notifications: AppNotification[], maxHistory: number): void {
  const trimmed = notifications.slice(0, maxHistory);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}
