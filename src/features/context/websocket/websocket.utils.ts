import type { WSEventHandler } from "./websocket.types";

export type EventListeners = Map<string, Set<WSEventHandler>>;

export function emit(listeners: EventListeners, event: string, data: unknown) {
  const handlers = listeners.get(event);
  if (handlers) {
    for (const handler of handlers) {
      handler(data);
    }
  }
}

export function addListener(
  listeners: EventListeners,
  event: string,
  handler: WSEventHandler,
): () => void {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event)!.add(handler);
  return () => listeners.get(event)?.delete(handler);
}

export function removeListener(listeners: EventListeners, event: string, handler: WSEventHandler) {
  listeners.get(event)?.delete(handler);
}

/** Build a WebSocket URL with auth token as query param */
export function buildWSUrl(base: string, token: string | null): string {
  const url = new URL(base);
  if (token) {
    url.searchParams.set("token", token);
  }
  return url.toString();
}
