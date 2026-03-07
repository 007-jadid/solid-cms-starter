import {
  type SSEContextValue,
  SSEProvider,
  type SSEProviderConfig,
  useSSE,
} from "~/features/context/sse";
import { cn } from "~/features/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/features/ui/components/tooltip";
import type { CMSPlugin } from "../core.types";

export type { SSEProviderConfig };

// ── StatusDot for SSE ───────────────────────────────────────────

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

function SSEStatusDot() {
  const sse = useSSE();
  return <StatusDot status={sse.state.status} label="SSE" />;
}

// ── Plugin factory ──────────────────────────────────────────────

export function ssePlugin(config?: SSEProviderConfig): CMSPlugin<"sse", SSEContextValue> {
  const showIndicator = config?.showStatusIndicator !== false;

  return {
    name: "sse",
    Provider: (props) => <SSEProvider config={config}>{props.children}</SSEProvider>,
    useHook: useSSE,
    navActions: showIndicator ? [SSEStatusDot] : [],
  };
}
