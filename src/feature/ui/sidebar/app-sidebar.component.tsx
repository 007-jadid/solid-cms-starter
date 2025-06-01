import { Popover as KPopover } from "@kobalte/core";
import { Link } from "@tanstack/solid-router";
import { For, Match, Show, Switch } from "solid-js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import {
  CalendarIcon,
  Dot,
  Down,
  HomeIcon,
  MailIcon,
  SearchIcon,
  Settings,
} from "../icons";
import { SidebarHeader } from "./sidebar-header.component";

const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: MailIcon,
    children: [
      {
        title: "Starred",
        url: "/starred",
        icon: CalendarIcon,
      },
      {
        title: "Sent",
        url: "/sent",
        icon: SearchIcon,
      },
      {
        title: "Drafts",
        url: "/drafts",
        icon: Settings,
      },
      {
        title: "Spam",
        url: "/spam",
        icon: SearchIcon,
      },
    ],
  },
  {
    title: "Form",
    url: "/form",
    icon: CalendarIcon,
  },
  {
    title: "Search",
    url: "/search",
    icon: SearchIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

let active = false;

export function AppSidebar() {
  const sidebarStore = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader />
          <SidebarGroupContent>
            <SidebarMenu
              class={cn(
                "space-y-3 mt-2",
                !sidebarStore.open() ? "flex items-center justify-center" : ""
              )}
            >
              <For each={items}>
                {(item) => {
                  return (
                    <Switch>
                      <Match
                        when={item.children?.length && sidebarStore.open()}
                      >
                        <Collapsible>
                          <SidebarMenuItem>
                            <CollapsibleTrigger class="flex item-center justify-between w-full relative">
                              <div class="flex items-center gap-x-2 dark:text-gray-400 text-gray-500">
                                <item.icon />
                                <Show when={sidebarStore.open()}>
                                  <span class="">{item.title}</span>
                                </Show>
                              </div>
                              <Switch>
                                <Match when={sidebarStore.open()}>
                                  <div class="dark:text-gray-400 text-gray-500">
                                    <Down />
                                  </div>
                                </Match>
                                <Match when={!sidebarStore.open()}>
                                  <div
                                    class={cn(
                                      "absolute -right-5 top-1/2 transform -translate-y-1/2",
                                      !active
                                        ? "dark:text-gray-400 text-gray-500"
                                        : ""
                                    )}
                                  >
                                    <Dot />
                                  </div>
                                </Match>
                              </Switch>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub class="mt-1">
                                <For each={item.children}>
                                  {(child) => {
                                    return (
                                      <div class="hover:bg-gray-200 dark:hover:bg-gray-800 px-2 py-1 rounded">
                                        <Link
                                          activeProps={{
                                            class:
                                              "font-semibold transition duration-100 ease-in-out",
                                          }}
                                          activeOptions={{ exact: true }}
                                          to={child.url}
                                          class="flex items-center rounded gap-x-2 transition duration-100 text-gray-500 dark:text-gray-400"
                                        >
                                          <child.icon />
                                          <span class="text-[13px]">
                                            {child.title}
                                          </span>
                                        </Link>
                                      </div>
                                    );
                                  }}
                                </For>
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      </Match>
                      <Match
                        when={item.children?.length && !sidebarStore.open()}
                      >
                        <Popover placement="right-start">
                          <SidebarMenuItem>
                            <PopoverTrigger class="flex item-center justify-between w-full relative">
                              <div class="flex items-center gap-x-2 dark:text-gray-400 text-gray-500">
                                <item.icon />
                                <Show when={sidebarStore.open()}>
                                  <span class="">{item.title}</span>
                                </Show>
                              </div>
                              <Switch>
                                <Match when={sidebarStore.open()}>
                                  <div class="dark:text-gray-400 text-gray-500">
                                    <Down />
                                  </div>
                                </Match>
                                <Match when={!sidebarStore.open()}>
                                  <div
                                    class={cn(
                                      "absolute -right-[18px] top-1/2 transform -translate-y-1/2",
                                      !active
                                        ? "dark:text-gray-400 text-gray-500"
                                        : ""
                                    )}
                                  >
                                    <Dot />
                                  </div>
                                </Match>
                              </Switch>
                            </PopoverTrigger>
                            <PopoverContent class="min-w-[160px] w-auto px-0 py-1 bg-gray-950 border-slate-500">
                              <KPopover.Arrow />
                              <SidebarMenuSub class="border-none m-0 p-1">
                                <For each={item.children}>
                                  {(child) => {
                                    return (
                                      <KPopover.CloseButton class="hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-100 px-3 py-1 rounded ease-in-out">
                                        <Link
                                          activeProps={{
                                            class:
                                              "font-semibold transition duration-100 ease-in-out",
                                          }}
                                          activeOptions={{ exact: true }}
                                          to={child.url}
                                          class="flex items-center rounded gap-x-2 transition duration-100 dark:text-gray-400 text-gray-500"
                                        >
                                          <child.icon />
                                          <span class="text-[13px]">
                                            {child.title}
                                          </span>
                                        </Link>
                                      </KPopover.CloseButton>
                                    );
                                  }}
                                </For>
                              </SidebarMenuSub>
                            </PopoverContent>
                          </SidebarMenuItem>
                        </Popover>
                      </Match>
                      <Match when={!item.children?.length}>
                        <SidebarMenuItem>
                          <Link
                            activeProps={{
                              class:
                                "font-semibold transition duration-100 ease-in-out",
                            }}
                            activeOptions={{ exact: true }}
                            to={item.url}
                            class={cn(
                              "flex items-center rounded gap-x-2 transition duration-100 dark:text-gray-400 text-gray-500"
                            )}
                          >
                            <item.icon />
                            <Show when={sidebarStore.open()}>
                              <span class=" h-4">{item.title}</span>
                            </Show>
                          </Link>
                        </SidebarMenuItem>
                      </Match>
                    </Switch>
                  );
                }}
              </For>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
