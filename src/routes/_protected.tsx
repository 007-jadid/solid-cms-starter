import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/solid-router";
import { createEffect, on, onCleanup, onMount } from "solid-js";
import { useAuth } from "~/features/context/auth/auth.context";
import { useNotificationsSafe } from "~/features/context/notifications";
import { useSSESafe } from "~/features/context/sse";
import { useWebSocketSafe } from "~/features/context/websocket";
import { cms } from "~/features/core";
import { AppLayout } from "~/features/ui/layout/app-layout";
import { ErrorComponent } from "~/features/ui/layout/error.page";
import { NotFoundComponent } from "~/features/ui/layout/not-found.page";

export const Route = createFileRoute("/_protected")({
  // Fires before any child route renders — no spinner flash for unauthenticated users.
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated()) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href !== "/" ? location.href : undefined },
      });
    }
  },
  component: RouteComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
});

/** Bridge WS/SSE events → notification system (if both plugins are registered) */
function useRealtimeNotifications() {
  if (!cms.has("notifications")) return;

  const notifications = useNotificationsSafe();
  if (!notifications) return;

  const ws = useWebSocketSafe();
  const sse = useSSESafe();
  const cleanups: (() => void)[] = [];

  onMount(() => {
    if (cms.has("ws") && ws) {
      cleanups.push(
        ws.on("notification:new", (data) => {
          const d = data as Record<string, unknown>;
          notifications.addNotification({
            title: (d.title as string) ?? "Notification",
            body: (d.body as string) ?? "",
            icon: d.icon as string | undefined,
            actionUrl: d.actionUrl as string | undefined,
            category: d.category as string | undefined,
            priority: (d.priority as "low" | "normal" | "high" | "urgent") ?? "normal",
            data: d.data as Record<string, unknown> | undefined,
          });
        }),
      );
    }

    if (cms.has("sse") && sse) {
      cleanups.push(
        sse.on("notification", (data) => {
          const d = data as Record<string, unknown>;
          notifications.addNotification({
            title: (d.title as string) ?? "Notification",
            body: (d.body as string) ?? "",
            icon: d.icon as string | undefined,
            actionUrl: d.actionUrl as string | undefined,
            category: d.category as string | undefined,
            priority: (d.priority as "low" | "normal" | "high" | "urgent") ?? "normal",
            data: d.data as Record<string, unknown> | undefined,
          });
        }),
      );
    }

    onCleanup(() => {
      for (const unsub of cleanups) unsub();
    });
  });
}

function RouteComponent() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Bridge real-time events to notification system
  useRealtimeNotifications();

  // Handle runtime auth loss (e.g. logout, token expiry during a session).
  // on() pins the reactive dependency to status only — avoids accidental
  // re-runs from unrelated store reads inside navigate().
  createEffect(
    on(
      () => auth.state.status,
      (status) => {
        if (status === "unauthenticated") {
          navigate({
            to: "/auth/login",
            search: { redirect: undefined },
            replace: true,
          });
        }
      },
      { defer: true }, // beforeLoad already handles initial auth; this covers runtime loss only
    ),
  );

  return (
    <AppLayout forceCollapsedSidebar={false}>
      <Outlet />
    </AppLayout>
  );
}
