import {
  useWebSocket,
  WebSocketProvider,
  type WebSocketProviderConfig,
  type WSContextValue,
} from "~/features/context/websocket";
import { cn } from "~/features/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/features/ui/components/tooltip";
import type { CMSPlugin } from "../core.types";

export type { WebSocketProviderConfig };

// ── StatusDot for WebSocket ─────────────────────────────────────

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "reconnecting" | "error";

function StatusDot(props: { status: ConnectionStatus; label: string }) {
  const dotColor = () => {
    switch (props.status) {
      case "connected":
        return "bg-emerald-500";
      case "connecting":
      case "reconnecting":
        return "bg-amber-500 animate-pulse";
      case "error":
        return "bg-red-500";
      default:
        return "bg-muted-foreground/40";
    }
  };

  const statusText = () => {
    switch (props.status) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "reconnecting":
        return "Reconnecting...";
      case "error":
        return "Connection error";
      default:
        return "Disconnected";
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger class="flex items-center justify-center size-9 rounded-md">
        <span class={cn("size-2 rounded-full", dotColor())} />
      </TooltipTrigger>
      <TooltipContent>
        {props.label}: {statusText()}
      </TooltipContent>
    </Tooltip>
  );
}

function WSStatusDot() {
  const ws = useWebSocket();
  return <StatusDot status={ws.state.status} label="WebSocket" />;
}

// ── Plugin factory ──────────────────────────────────────────────

export function wsPlugin(config?: WebSocketProviderConfig): CMSPlugin<"ws", WSContextValue> {
  const showIndicator = config?.showStatusIndicator !== false;

  return {
    name: "ws",
    Provider: (props) => <WebSocketProvider config={config}>{props.children}</WebSocketProvider>,
    useHook: useWebSocket,
    navActions: showIndicator ? [WSStatusDot] : [],
  };
}
