import { createSignal, For, Show } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import type { AppNotification } from "~/features/context/notifications";
import { useNotifications } from "~/features/context/notifications";
import { cn } from "~/features/lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-4.5"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const CheckAllIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-3.5"
  >
    <path d="M18 6 7 17l-5-5" />
    <path d="m22 10-9.5 9.5L10 17" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-3.5"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

function timeAgo(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationItem(props: {
  notification: AppNotification;
  onRead: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      class={cn(
        "group flex items-start rounded-lg px-3 py-2.5 transition-colors",
        props.notification.status === "unread"
          ? "bg-primary/5 hover:bg-primary/10"
          : "hover:bg-muted/50",
      )}
    >
      <button
        type="button"
        class="flex min-w-0 flex-1 items-start gap-3 text-left"
        onClick={() => props.onRead(props.notification.id)}
      >
        {/* Unread dot */}
        <div class="mt-1.5 shrink-0">
          <Show when={props.notification.status === "unread"} fallback={<div class="size-2" />}>
            <div class="size-2 rounded-full bg-primary" />
          </Show>
        </div>

        {/* Content */}
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium leading-tight truncate">{props.notification.title}</p>
          <Show when={props.notification.body}>
            <p class="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {props.notification.body}
            </p>
          </Show>
          <p class="mt-1 text-[10px] text-muted-foreground/70">
            {timeAgo(props.notification.createdAt)}
          </p>
        </div>
      </button>

      {/* Remove button */}
      <button
        type="button"
        class="mt-0.5 shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          props.onRemove(props.notification.id);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-3"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}

export function NotificationCenter() {
  const { t } = useI18n();
  const notifications = useNotifications();
  const [open, setOpen] = createSignal(false);

  return (
    <Popover open={open()} onOpenChange={setOpen}>
      <PopoverTrigger
        as={Button}
        variant="ghost"
        size="icon"
        class="relative size-9 text-muted-foreground hover:text-foreground border border-border/40 bg-white dark:bg-card hover:bg-accent dark:hover:bg-accent"
      >
        <BellIcon />
        <Show when={notifications.state.unreadCount > 0}>
          <span class="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {notifications.state.unreadCount > 99 ? "99+" : notifications.state.unreadCount}
          </span>
        </Show>
        <span class="sr-only">{t("nav.notifications")}</span>
      </PopoverTrigger>

      <PopoverContent class="w-80 p-0">
        {/* Header */}
        <div class="flex items-center justify-between border-b px-4 py-3">
          <h3 class="text-sm font-semibold">{t("nav.notifications")}</h3>
          <div class="flex items-center gap-1">
            <Show when={notifications.state.notifications.length > 0}>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 gap-1 px-2 text-xs text-muted-foreground"
                onClick={() => notifications.markAllAsRead()}
              >
                <CheckAllIcon />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 gap-1 px-2 text-xs text-muted-foreground"
                onClick={() => notifications.clearAll()}
              >
                <TrashIcon />
              </Button>
            </Show>
          </div>
        </div>

        {/* List */}
        <div class="max-h-80 overflow-y-auto">
          <Show
            when={notifications.state.notifications.length > 0}
            fallback={
              <div class="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <BellIcon />
                <p class="mt-2 text-xs">No notifications</p>
              </div>
            }
          >
            <div class="py-1">
              <For each={notifications.state.notifications}>
                {(notification) => (
                  <NotificationItem
                    notification={notification}
                    onRead={(id) => notifications.markAsRead(id)}
                    onRemove={(id) => notifications.remove(id)}
                  />
                )}
              </For>
            </div>
          </Show>
        </div>
      </PopoverContent>
    </Popover>
  );
}
