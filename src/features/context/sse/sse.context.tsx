import { fetchEventSource } from "@microsoft/fetch-event-source";
import { createContext, createEffect, type JSX, on, onCleanup, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { useAuth } from "~/features/context/auth/auth.context";
import type { ReconnectConfig } from "~/features/core/core.types";
import { calculateBackoff } from "~/features/lib/backoff";
import type { SSEContextValue, SSEEventHandler, SSEState } from "./sse.types";
import { parseSSEData } from "./sse.utils";

export interface SSEProviderConfig {
  url?: string | null;
  autoConnect?: boolean;
  reconnect?: Partial<ReconnectConfig>;
  showStatusIndicator?: boolean;
}

const defaultSSEConfig = {
  url: null as string | null,
  autoConnect: true,
  reconnect: { enabled: true, maxAttempts: 10, baseDelay: 1000, maxDelay: 30_000 },
  showStatusIndicator: true,
};

type EventListeners = Map<string, Set<SSEEventHandler>>;

const SSEContext = createContext<SSEContextValue>();

export function SSEProvider(props: { children: JSX.Element; config?: SSEProviderConfig }) {
  const auth = useAuth();
  const config = {
    ...defaultSSEConfig,
    ...props.config,
    reconnect: { ...defaultSSEConfig.reconnect, ...props.config?.reconnect },
  };

  const [state, setState] = createStore<SSEState>({
    status: "disconnected",
    reconnectAttempts: 0,
    lastError: null,
    connectedAt: null,
  });

  const listeners: EventListeners = new Map();
  let abortController: AbortController | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let intentionalClose = false;

  const getUrl = () => config.url ?? (import.meta.env.VITE_SSE_URL as string) ?? "";
  const getToken = () => auth.state.tokens.accessToken;

  function emit(event: string, data: unknown) {
    const handlers = listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(data);
      }
    }
  }

  function scheduleReconnect() {
    if (!config.reconnect.enabled || state.reconnectAttempts >= config.reconnect.maxAttempts) {
      setState("status", "error");
      return;
    }

    setState("status", "reconnecting");
    const delay = calculateBackoff(
      state.reconnectAttempts,
      config.reconnect.baseDelay,
      config.reconnect.maxDelay,
    );
    setState("reconnectAttempts", (prev) => prev + 1);

    reconnectTimer = setTimeout(() => {
      connectSSE();
    }, delay);
  }

  function connectSSE() {
    disconnectSSE();
    intentionalClose = false;

    const url = getUrl();
    if (!url) return;

    setState("status", "connecting");
    abortController = new AbortController();

    fetchEventSource(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      signal: abortController.signal,

      onopen: async (response) => {
        if (response.ok) {
          setState({
            status: "connected",
            reconnectAttempts: 0,
            lastError: null,
            connectedAt: new Date().toISOString(),
          });
        } else {
          setState({
            status: "error",
            lastError: `SSE open failed: ${response.status}`,
          });
          throw new Error(`SSE open failed: ${response.status}`);
        }
      },

      onmessage: (ev) => {
        const eventType = ev.event || "message";
        const parsed = parseSSEData(ev.data);
        emit(eventType, parsed);
      },

      onclose: () => {
        if (!intentionalClose) {
          scheduleReconnect();
        } else {
          setState("status", "disconnected");
        }
      },

      onerror: (err) => {
        setState({ status: "error", lastError: String(err) });
        if (intentionalClose) {
          throw err; // stop retrying
        }
        // Return nothing to let fetch-event-source retry
      },

      openWhenHidden: true,
    });
  }

  function disconnectSSE() {
    intentionalClose = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    setState("status", "disconnected");
  }

  // ── Public API ────────────────────────────────────────────────────────

  const connect = () => {
    intentionalClose = false;
    connectSSE();
  };

  const disconnect = () => {
    disconnectSSE();
  };

  const onEvent = <K extends string>(event: K, handler: SSEEventHandler): (() => void) => {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event)!.add(handler);
    return () => listeners.get(event)?.delete(handler);
  };

  const offEvent = <K extends string>(event: K, handler: SSEEventHandler) => {
    listeners.get(event)?.delete(handler);
  };

  // React to auth changes — only if a URL is configured
  createEffect(
    on(
      () => auth.state.status,
      (status) => {
        if (!getUrl()) return;
        if (status === "authenticated" && config.autoConnect) {
          connect();
        } else if (status === "unauthenticated") {
          disconnect();
        }
      },
      { defer: true },
    ),
  );

  onCleanup(() => {
    disconnectSSE();
  });

  const value: SSEContextValue = {
    state,
    connect,
    disconnect,
    on: onEvent,
    off: offEvent,
  };

  return <SSEContext.Provider value={value}>{props.children}</SSEContext.Provider>;
}

export function useSSE(): SSEContextValue {
  const ctx = useContext(SSEContext);
  if (!ctx) throw new Error("useSSE must be used within a SSEProvider");
  return ctx;
}

export function useSSESafe(): SSEContextValue | null {
  return useContext(SSEContext) ?? null;
}
