import { Link, useRouterState } from "@tanstack/solid-router";
import { createEffect, createMemo, createSignal, For, Match, on, Show, Switch } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import { useSettings } from "~/features/context/settings/settings.context";
import { EASE_OUT_EXPO, gsap } from "~/features/lib/gsap";
import { cn } from "~/features/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/tooltip";
import type { SidebarItem } from "../sidebar.types";
import { ChevronRightIcon, NAV_I18N_MAP } from "./constants";
import { CollapsedSubMenuItem, hasActiveChild } from "./items";

interface SidebarMenuItemProps {
  item: SidebarItem;
  level?: number;
  collapsed?: boolean;
}

export function SidebarMenuItem(props: SidebarMenuItemProps) {
  const settings = useSettings();
  const { t } = useI18n();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const childActive = () => hasActiveChild(props.item, pathname());
  const [isOpen, setIsOpen] = createSignal(childActive());

  createEffect(
    on(
      childActive,
      (active) => {
        if (active) setIsOpen(true);
      },
      { defer: true },
    ),
  );

  const title = createMemo(() => {
    const key = NAV_I18N_MAP[props.item.id];
    if (!key) return props.item.title;
    return t(key) || props.item.title;
  });
  const level = () => props.level ?? 0;
  const hasChildren = () => props.item.children && props.item.children.length > 0;
  const isActive = () => props.item.href && pathname().startsWith(props.item.href);

  let collapsibleRef!: HTMLDivElement;

  createEffect(
    on(
      isOpen,
      (open) => {
        if (open && collapsibleRef) {
          requestAnimationFrame(() => {
            const children = collapsibleRef.children;
            if (!children.length) return;
            gsap.fromTo(
              Array.from(children),
              { opacity: 0, x: -8 },
              {
                opacity: 1,
                x: 0,
                stagger: 0.04,
                duration: 0.25,
                ease: EASE_OUT_EXPO,
                delay: 0.05,
              },
            );
          });
        }
      },
      { defer: true },
    ),
  );

  const isCollapsed = () => props.collapsed && level() === 0;
  const isCollapsedWithChildren = () => isCollapsed() && hasChildren();
  const isCollapsedWithoutChildren = () => isCollapsed() && !hasChildren();
  const isExpandedWithChildren = () => !isCollapsed() && hasChildren();

  const renderItemContent = () => (
    <div
      class={cn(
        "group/item flex w-full items-center rounded-lg px-3 py-2 text-[13px] transition-all duration-200",
        "text-muted-foreground font-medium",
        isActive() ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-accent/50",
        settings.state.themeVariant === "claude" && "font-sidebar",
      )}
      style={{
        "padding-left": level() > 0 ? `${(level() + 1) * 12}px` : undefined,
      }}
    >
      <div
        class={cn(
          "flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden justify-start",
          "group-data-[collapsed=true]/sidebar:justify-center",
        )}
      >
        <Show when={props.item.icon && level() === 0}>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: decorative hover animation only */}
          <span
            class="shrink-0"
            onMouseEnter={(e) => {
              const icon = e.currentTarget.querySelector("div");
              if (icon)
                gsap.to(icon, {
                  scale: 1.15,
                  rotation: 3,
                  duration: 0.2,
                  ease: "back.out(3)",
                });
            }}
            onMouseLeave={(e) => {
              const icon = e.currentTarget.querySelector("div");
              if (icon)
                gsap.to(icon, {
                  scale: 1,
                  rotation: 0,
                  duration: 0.25,
                  ease: EASE_OUT_EXPO,
                });
            }}
          >
            <div
              class={cn(
                "[&>svg]:size-4 [&>svg]:stroke-[1.5] shrink-0 transition-colors",
                isActive() && "[&>svg]:stroke-primary",
              )}
            >
              {props.item.icon!()}
            </div>
          </span>
        </Show>
        <Show when={level() > 0}>
          <span
            class={cn(
              "size-1.5 shrink-0 rounded-full transition-all",
              isActive()
                ? "bg-primary"
                : "bg-muted-foreground/40 group-hover/item:bg-muted-foreground/60",
            )}
          />
        </Show>
        <Show when={!props.collapsed}>
          <span class="truncate text-left overflow-hidden whitespace-nowrap" style={{ opacity: 1 }}>
            {title()}
          </span>
        </Show>
      </div>

      <Show when={!props.collapsed}>
        <div class="flex shrink-0 items-center gap-2 overflow-hidden">
          <Show when={props.item.badge}>
            <span
              class={cn(
                "flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[9px] font-bold tracking-wide",
                isActive() ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary",
              )}
            >
              {props.item.badge}
            </span>
          </Show>
          <Show when={hasChildren()}>
            <span class={cn("transition-transform duration-200", isOpen() && "rotate-90")}>
              <ChevronRightIcon />
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );

  return (
    <div data-nav-active={isActive() ? "true" : undefined}>
      <Switch>
        <Match when={isCollapsedWithChildren()}>
          <DropdownMenu placement="right-start" gutter={8}>
            <DropdownMenuTrigger
              as="button"
              class={cn(
                "group/btn relative flex w-full items-center justify-center rounded-lg p-2.5 transition-all duration-200",
                isActive() || childActive()
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <Show when={props.item.icon}>
                <div
                  class={cn(
                    "[&>svg]:size-4 [&>svg]:stroke-[1.5] transition-colors",
                    (isActive() || childActive()) && "[&>svg]:stroke-primary",
                  )}
                >
                  {props.item.icon!()}
                </div>
              </Show>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="absolute bottom-1 right-1 size-2 opacity-50"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="min-w-52 p-1.5">
              <div class="px-3 py-2 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider border-b border-border/50 mb-1">
                {title()}
              </div>
              <For each={props.item.children}>
                {(child) => <CollapsedSubMenuItem item={child} pathname={pathname()} />}
              </For>
            </DropdownMenuContent>
          </DropdownMenu>
        </Match>

        <Match when={isCollapsedWithoutChildren()}>
          <Tooltip placement="right">
            <TooltipTrigger as={Link} to={props.item.href ?? "/dashboard"} class="w-full">
              <div
                class={cn(
                  "relative flex w-full items-center justify-center rounded-lg p-2.5 transition-all duration-200",
                  isActive()
                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <Show when={props.item.icon}>
                  <div
                    class={cn(
                      "[&>svg]:size-4 [&>svg]:stroke-[1.5] transition-colors",
                      isActive() && "[&>svg]:stroke-primary",
                    )}
                  >
                    {props.item.icon!()}
                  </div>
                </Show>
              </div>
            </TooltipTrigger>
            <TooltipContent>{title()}</TooltipContent>
          </Tooltip>
        </Match>

        <Match when={isExpandedWithChildren()}>
          <Collapsible open={isOpen()} onOpenChange={setIsOpen}>
            <CollapsibleTrigger class="w-full">{renderItemContent()}</CollapsibleTrigger>
            <CollapsibleContent class="overflow-hidden border-0 data-closed:invisible data-closed:animate-collapsible-up data-expanded:animate-collapsible-down">
              <div ref={collapsibleRef}>
                <For each={props.item.children}>
                  {(child) => (
                    <SidebarMenuItem item={child} level={level() + 1} collapsed={props.collapsed} />
                  )}
                </For>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Match>

        <Match when={true}>
          <Link to={props.item.href ?? "/dashboard"} class="block">
            {renderItemContent()}
          </Link>
        </Match>
      </Switch>
    </div>
  );
}
