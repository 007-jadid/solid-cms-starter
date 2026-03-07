// Custom push notification handlers for the service worker.
// vite-plugin-pwa (generateSW mode) generates the main SW;
// this file is imported via `importScripts` in the Workbox config.

self.addEventListener("push", (event) => {
  let data = { title: "New notification", body: "" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: "New notification", body: event.data.text() };
    }
  }

  const options = {
    body: data.body || "",
    icon: data.icon || "/logo192.png",
    badge: "/logo192.png",
    image: data.image || undefined,
    data: data,
    tag: data.tag || data.id || undefined,
    actions: data.actions || [],
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title, options),
      // Forward to all open clients for in-app notification list
      self.clients.matchAll({ type: "window" }).then((clients) => {
        for (const client of clients) {
          client.postMessage({
            type: "push-notification",
            payload: data,
          });
        }
      }),
    ]),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const notificationData = event.notification.data;
  const actionUrl = notificationData?.actionUrl || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Focus existing window if available
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            client.postMessage({
              type: "notification-click",
              payload: { actionUrl, data: notificationData },
            });
            return;
          }
        }
        // Otherwise open a new window
        return self.clients.openWindow(actionUrl);
      }),
  );
});
