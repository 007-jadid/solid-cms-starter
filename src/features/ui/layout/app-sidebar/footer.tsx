import { Show } from "solid-js";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/tooltip";
import { ChevronExpandIcon } from "./constants";

interface SidebarFooterProps {
  isMobile: boolean;
  isCollapsed: boolean;
  onToggleSidebar: () => void;
  t: (key: string) => string;
  ref: HTMLDivElement | ((el: HTMLDivElement) => void);
}

export function SidebarFooter(props: SidebarFooterProps) {
  return (
    <div ref={props.ref} class="border-t border-border p-2">
      <Show when={!props.isMobile}>
        {props.isCollapsed ? (
          <Tooltip placement="right">
            <TooltipTrigger
              as="button"
              class="flex w-full items-center justify-center rounded-lg p-2.5 text-muted-foreground transition-all duration-200 hover:bg-accent/50 hover:text-foreground"
              onClick={props.onToggleSidebar}
            >
              <ChevronExpandIcon />
            </TooltipTrigger>
            <TooltipContent>{props.t("sidebar.expand")}</TooltipContent>
          </Tooltip>
        ) : (
          <div class="rounded-lg bg-linear-to-br from-primary/5 to-primary/10 p-3 border border-primary/10">
            <p class="text-xs font-semibold text-foreground">{props.t("sidebar.helpTitle")}</p>
            <p class="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              {props.t("sidebar.helpText")}
            </p>
          </div>
        )}
      </Show>
      <Show when={props.isMobile}>
        <div class="rounded-lg bg-linear-to-br from-primary/5 to-primary/10 p-3 border border-primary/10">
          <p class="text-xs font-semibold text-foreground">{props.t("sidebar.helpTitle")}</p>
          <p class="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            {props.t("sidebar.helpText")}
          </p>
        </div>
      </Show>
    </div>
  );
}
