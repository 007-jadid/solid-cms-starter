export type WSConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

export interface WSState {
  status: WSConnectionStatus;
  /** Number of reconnection attempts so far */
  reconnectAttempts: number;
  /** Last error message */
  lastError: string | null;
  /** Timestamp of last successful connection */
  connectedAt: string | null;
}

/** Type-safe event map — extend this interface for your app's events */
export interface WSEventMap {
  "connection:open": undefined;
  "connection:close": { code: number; reason: string };
  "connection:error": { message: string };
  [key: string]: unknown;
}

export type WSEventHandler<T = unknown> = (data: T) => void;

export interface WSContextValue {
  state: WSState;
  /** Connect to the server (called automatically if autoConnect is true) */
  connect: () => void;
  /** Disconnect from the server */
  disconnect: () => void;
  /** Send a message/event */
  send: <K extends string>(event: K, data?: WSEventMap[K]) => void;
  /** Subscribe to an event — returns unsubscribe function */
  on: <K extends string>(event: K, handler: WSEventHandler<WSEventMap[K]>) => () => void;
  /** Unsubscribe from an event */
  off: <K extends string>(event: K, handler: WSEventHandler<WSEventMap[K]>) => void;
  /** Send raw data (for native WebSocket only) */
  sendRaw: (data: string | ArrayBuffer) => void;
}
