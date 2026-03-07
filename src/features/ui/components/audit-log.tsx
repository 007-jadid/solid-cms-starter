import { For, Show } from "solid-js";

import { cn } from "~/features/lib/utils";

export interface AuditLogEntry {
  id: string;
  user: string;
  action: "create" | "update" | "delete" | "login" | "logout" | "export" | "import" | "other";
  resource: string;
  detail?: string;
  timestamp: string;
  avatar?: string;
}

const actionConfig = {
  create: { label: "Created", dot: "bg-emerald-500" },
  update: { label: "Updated", dot: "bg-blue-500" },
  delete: { label: "Deleted", dot: "bg-red-500" },
  login: { label: "Logged in", dot: "bg-violet-500" },
  logout: { label: "Logged out", dot: "bg-slate-400" },
  export: { label: "Exported", dot: "bg-amber-500" },
  import: { label: "Imported", dot: "bg-cyan-500" },
  other: { label: "Action", dot: "bg-slate-400" },
} as const;

export function AuditLog(props: { entries: AuditLogEntry[]; class?: string }) {
  return (
    <div class={cn("relative", props.class)}>
      <div class="absolute left-[19px] top-2 bottom-2 w-px bg-border" />

      <div class="space-y-0">
        <For each={props.entries}>
          {(entry) => {
            const config = actionConfig[entry.action];

            return (
              <div class="relative flex gap-3 py-3 pl-0">
                <div class="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border bg-card text-[11px] font-semibold">
                  {entry.avatar ?? entry.user.slice(0, 2).toUpperCase()}
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">{entry.user}</span>
                    <div class="flex items-center gap-1.5">
                      <div class={cn("size-1.5 rounded-full", config.dot)} />
                      <span class="text-xs text-muted-foreground">{config.label}</span>
                    </div>
                    <span class="text-sm text-muted-foreground">{entry.resource}</span>
                  </div>
                  <Show when={entry.detail}>
                    <p class="mt-0.5 text-xs text-muted-foreground">{entry.detail}</p>
                  </Show>
                  <p class="mt-1 text-[11px] text-muted-foreground/70">{entry.timestamp}</p>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
