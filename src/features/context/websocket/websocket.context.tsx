import { createContext, createEffect, type JSX, on, onCleanup, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { useAuth } from "~/features/context/auth/auth.context";
import type { ReconnectConfig } from "~/features/core/core.types";
import { calculateBackoff } from "~/features/lib/backoff";
import type { WSContextValue, WSEventHandler, WSEventMap, WSState } from "./websocket.types";
import {
  addListener,
  buildWSUrl,
  type EventListeners,
  emit,
  removeListener,
} from "./websocket.utils";

export interface WebSocketProviderConfig {
  url?: string | null;
  transport?: "websocket" | "socketio" | "both";
  autoConnect?: boolean;
  reconnect?: Partial<ReconnectConfig>;
  showStatusIndicator?: boolean;
}

const defaultWSConfig = {
  url: null as string | null,
  transport: "websocket" as const,
  autoConnect: true,
  reconnect: { enabled: true, maxAttempts: 10, baseDelay: 1000, maxDelay: 30_000 },
  showStatusIndicator: true,
};

const WebSocketContext = createContext<WSContextValue>();

export function WebSocketProvider(props: {
  children: JSX.Element;
  config?: WebSocketProviderConfig;
}) {
  const auth = useAuth();
  const config = {
    ...defaultWSConfig,
    ...props.config,
    reconnect: { ...defaultWSConfig.reconnect, ...props.config?.reconnect },
  };

  const [state, setState] = createStore<WSState>({
    status: "disconnected",
    reconnectAttempts: 0,
    lastError: null,
    connectedAt: null,
  });

  const listeners: EventListeners = new Map();
  let ws: WebSocket | null = null;
  let socketIO: ReturnType<typeof import("socket.io-client").io> | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let intentionalClose = false;

  const getUrl = () => config.url ?? (import.meta.env.VITE_WS_URL as string) ?? "";
  const getToken = () => auth.state.tokens.accessToken;

  // ── Native WebSocket ──────────────────────────────────────────────────

  function connectNativeWS() {
    const url = getUrl();
    if (!url) return;

    setState("status", "connecting");
    ws = new WebSocket(buildWSUrl(url, getToken()));

    ws.onopen = () => {
      setState({
        status: "connected",
        reconnectAttempts: 0,
        lastError: null,
        connectedAt: new Date().toISOString(),
      });
      emit(listeners, "connection:open", undefined);
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data as string) as {
          event?: string;
          data?: unknown;
        };
        const eventName = parsed.event ?? "message";
        emit(listeners, eventName, parsed.data ?? parsed);
      } catch {
        // Non-JSON message
        emit(listeners, "message", event.data);
      }
    };

    ws.onclose = (event) => {
      emit(listeners, "connection:close", {
        code: event.code,
        reason: event.reason,
      });
      if (!intentionalClose) {
        scheduleReconnect();
      } else {
        setState("status", "disconnected");
      }
    };

    ws.onerror = () => {
      setState({ status: "error", lastError: "WebSocket connection error" });
      emit(listeners, "connection:error", {
        message: "WebSocket connection error",
      });
    };
  }

  function disconnectNativeWS() {
    if (ws) {
      ws.onclose = null;
      ws.onerror = null;
      ws.close();
      ws = null;
    }
  }

  // ── Socket.IO ─────────────────────────────────────────────────────────

  async function connectSocketIO() {
    const url = getUrl();
    if (!url) return;

    setState("status", "connecting");

    const { io } = await import("socket.io-client");
    socketIO = io(url, {
      auth: { token: getToken() },
      reconnection: config.reconnect.enabled,
      reconnectionAttempts: config.reconnect.maxAttempts,
      reconnectionDelay: config.reconnect.baseDelay,
      reconnectionDelayMax: config.reconnect.maxDelay,
      transports: ["websocket", "polling"],
    });

    socketIO.on("connect", () => {
      setState({
        status: "connected",
        reconnectAttempts: 0,
        lastError: null,
        connectedAt: new Date().toISOString(),
      });
      emit(listeners, "connection:open", undefined);
    });

    socketIO.on("disconnect", (reason) => {
      emit(listeners, "connection:close", { code: 0, reason });
      if (!intentionalClose) {
        setState("status", "reconnecting");
      } else {
        setState("status", "disconnected");
      }
    });

    socketIO.on("connect_error", (err) => {
      setState({ status: "error", lastError: err.message });
      emit(listeners, "connection:error", { message: err.message });
    });

    // Forward all events to our listener system
    socketIO.onAny((eventName: string, ...args: unknown[]) => {
      emit(listeners, eventName, args.length === 1 ? args[0] : args);
    });
  }

  function disconnectSocketIO() {
    if (socketIO) {
      socketIO.removeAllListeners();
      socketIO.disconnect();
      socketIO = null;
    }
  }

  // ── Reconnection ──────────────────────────────────────────────────────

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
      if (config.transport === "websocket" || config.transport === "both") {
        connectNativeWS();
      }
      // Socket.IO handles its own reconnection
    }, delay);
  }

  // ── Public API ────────────────────────────────────────────────────────

  const connect = () => {
    intentionalClose = false;
    const transport = config.transport;

    if (transport === "websocket" || transport === "both") {
      connectNativeWS();
    }
    if (transport === "socketio" || transport === "both") {
      connectSocketIO();
    }
  };

  const disconnect = () => {
    intentionalClose = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    disconnectNativeWS();
    disconnectSocketIO();
    setState("status", "disconnected");
  };

  const send = <K extends string>(event: K, data?: WSEventMap[K]) => {
    if (socketIO?.connected) {
      socketIO.emit(event, data);
    }
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event, data }));
    }
  };

  const onEvent = <K extends string>(
    event: K,
    handler: WSEventHandler<WSEventMap[K]>,
  ): (() => void) => {
    return addListener(listeners, event, handler as WSEventHandler);
  };

  const offEvent = <K extends string>(event: K, handler: WSEventHandler<WSEventMap[K]>) => {
    removeListener(listeners, event, handler as WSEventHandler);
  };

  const sendRaw = (data: string | ArrayBuffer) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
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
    disconnect();
  });

  const value: WSContextValue = {
    state,
    connect,
    disconnect,
    send,
    on: onEvent,
    off: offEvent,
    sendRaw,
  };

  return <WebSocketContext.Provider value={value}>{props.children}</WebSocketContext.Provider>;
}

export function useWebSocket(): WSContextValue {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket must be used within a WebSocketProvider");
  return ctx;
}

export function useWebSocketSafe(): WSContextValue | null {
  return useContext(WebSocketContext) ?? null;
}
