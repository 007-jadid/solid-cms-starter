export type SSEConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

export interface SSEState {
  status: SSEConnectionStatus;
  reconnectAttempts: number;
  lastError: string | null;
  connectedAt: string | null;
}

/** Type-safe event map — extend this interface for your app's events */
export interface SSEEventMap {
  message: string;
  [key: string]: unknown;
}

export type SSEEventHandler<T = unknown> = (data: T) => void;

export interface SSEContextValue {
  state: SSEState;
  /** Connect to SSE endpoint */
  connect: () => void;
  /** Disconnect */
  disconnect: () => void;
  /** Subscribe to a named event — returns unsubscribe function */
  on: <K extends string>(event: K, handler: SSEEventHandler<SSEEventMap[K]>) => () => void;
  /** Unsubscribe */
  off: <K extends string>(event: K, handler: SSEEventHandler<SSEEventMap[K]>) => void;
}
