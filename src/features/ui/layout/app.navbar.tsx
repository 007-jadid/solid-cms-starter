import { Link } from "@tanstack/solid-router";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";
import { useSettings } from "~/features/context/settings/settings.context";
import { CSS_EASE_OUT_EXPO, EASE_OUT_EXPO, gsap } from "~/features/lib/gsap";
import { cn } from "~/features/lib/utils";
import { Button } from "../components/button";
import { SettingsModal } from "../components/settings-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/tooltip";
import { useLayout } from "./layout.context";
import { NavActions } from "./navbar/nav-actions";
import { NavBreadcrumbs } from "./navbar/nav-breadcrumbs";
import { NavSearch } from "./navbar/nav-search";
import { NavUserMenu } from "./navbar/nav-user-menu";

// Icons with refined stroke widths
const PanelLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-[18px]"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
  </svg>
);

const LogoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-6 text-primary"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

interface AppNavbarProps {
  class?: string;
  forceCollapsedSidebar?: boolean;
}

export function AppNavbar(props: AppNavbarProps) {
  const layout = useLayout();
  const settings = useSettings();
  const [settingsOpen, setSettingsOpen] = createSignal(false);
  return (
    <>
      <header
        class={cn(
          "sticky top-0 z-50 flex h-14 w-full items-center border-b border-border bg-background/80 backdrop-blur-xl",
          props.class,
        )}
      >
        {/* Logo section — reactive styles + CSS transition keep it synced with sidebar */}
        <div
          style={{
            width: layout.state.isMobile
              ? undefined
              : layout.state.sidebarCollapsed
                ? "4rem"
                : "14rem",
            "padding-left": layout.state.isMobile
              ? undefined
              : layout.state.sidebarCollapsed
                ? "20px"
                : "16px",
            transition: layout.state.isMobile
              ? undefined
              : `width 0.45s ${CSS_EASE_OUT_EXPO}, padding-left 0.45s ${CSS_EASE_OUT_EXPO}`,
          }}
          class={cn(
            "flex h-full shrink-0 items-center border-r border-border overflow-hidden justify-start",
            "max-lg:w-auto max-lg:border-r-0! max-lg:px-4",
          )}
        >
          <Link to="/dashboard" class="flex items-center gap-2.5">
            <div class="shrink-0">
              <LogoIcon />
            </div>
            <Show when={!layout.state.sidebarCollapsed}>
              {(() => {
                let spanRef!: HTMLSpanElement;
                createEffect(() => {
                  if (spanRef) {
                    gsap.fromTo(
                      spanRef,
                      { opacity: 0, x: -10, width: 0 },
                      {
                        opacity: 1,
                        x: 0,
                        width: "auto",
                        duration: 0.35,
                        ease: EASE_OUT_EXPO,
                        clearProps: "width",
                      },
                    );
                    onCleanup(() => {
                      gsap.to(spanRef, { opacity: 0, x: -10, width: 0, duration: 0.2 });
                    });
                  }
                });
                return (
                  <span
                    ref={spanRef}
                    class="font-semibold tracking-tight text-foreground max-lg:hidden whitespace-nowrap overflow-hidden"
                    style={{ opacity: 0 }}
                  >
                    {settings.state.app.name}
                  </span>
                );
              })()}
            </Show>
          </Link>
        </div>

        {/* Left: Toggle + Breadcrumbs */}
        <div class="flex items-center gap-2 px-3">
          {/* Hide toggle button on large screens when forceCollapsedSidebar is true */}
          <Show when={!props.forceCollapsedSidebar}>
            <Tooltip>
              <TooltipTrigger
                as={Button}
                variant="ghost"
                size="icon"
                class="size-8 text-muted-foreground hover:text-foreground max-lg:block"
                onClick={() => {
                  layout.toggleSidebar();
                }}
              >
                <PanelLeftIcon />
                <span class="sr-only">Toggle sidebar</span>
              </TooltipTrigger>
              <TooltipContent>Toggle sidebar</TooltipContent>
            </Tooltip>
          </Show>

          <NavBreadcrumbs />
        </div>

        {/* Center: Search */}
        <NavSearch onSetSettingsOpen={setSettingsOpen} />

        {/* Right section */}
        <div class="flex items-center gap-1.5 px-3">
          <NavActions />
          <NavUserMenu onSetSettingsOpen={setSettingsOpen} />
        </div>
      </header>

      <SettingsModal open={settingsOpen()} onOpenChange={setSettingsOpen} />
    </>
  );
}
