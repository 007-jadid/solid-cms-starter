import { Show } from "solid-js";
import { Button } from "../../components/button";
import { XIcon } from "./constants";

interface SidebarMobileControlsProps {
  mobileOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

export function SidebarMobileControls(props: SidebarMobileControlsProps) {
  return (
    <>
      <Show when={props.mobileOpen}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: overlay dismiss doesn't need keyboard */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay */}
        <div
          class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => props.onClose()}
        />
      </Show>

      <div class="flex items-center justify-end p-2 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          class="size-8 text-muted-foreground hover:text-foreground"
          onClick={props.onClose}
        >
          <XIcon />
          <span class="sr-only">{props.t("sidebar.close")}</span>
        </Button>
      </div>
    </>
  );
}
