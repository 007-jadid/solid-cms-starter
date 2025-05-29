import { Link } from "@tanstack/solid-router";
import { For, Match, Show, Switch } from "solid-js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
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
      },
      {
        title: "Sent",
        url: "/sent",
      },
      {
        title: "Drafts",
        url: "/drafts",
      },
      {
        title: "Spam",
        url: "/spam",
      },
    ],
  },
  {
    title: "Calendar",
    url: "/calendar",
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
                      <Match when={item.children?.length}>
                        <Collapsible>
                          <SidebarMenuItem>
                            <CollapsibleTrigger class="flex item-center justify-between w-full">
                              <div class="flex items-center gap-x-2">
                                <item.icon />
                                <Show when={sidebarStore.open()}>
                                  <span class="text-[12px] pt-1">
                                    {item.title}
                                  </span>
                                </Show>
                              </div>
                              <Show when={sidebarStore.open()}>
                                <Down />
                              </Show>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <Show when={sidebarStore.open()}>
                                <SidebarMenuSub>
                                  <For each={item.children}>
                                    {(child) => {
                                      return (
                                        <div>
                                          <Link
                                            activeProps={{
                                              class:
                                                "bg-white dark:bg-gray-600 transition duration-100",
                                            }}
                                            activeOptions={{ exact: true }}
                                            to={child.url}
                                            class="flex items-center rounded gap-x-2 transition duration-100"
                                          >
                                            <span class="text-[13px]">
                                              {child.title}
                                            </span>
                                          </Link>
                                        </div>
                                      );
                                    }}
                                  </For>
                                </SidebarMenuSub>
                              </Show>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      </Match>
                      <Match when={!item.children?.length}>
                        <SidebarMenuItem>
                          <Link
                            activeProps={{
                              class:
                                "bg-white dark:bg-gray-600 transition duration-100",
                            }}
                            activeOptions={{ exact: true }}
                            to={item.url}
                            class={cn(
                              "flex items-center rounded gap-x-2 transition duration-100"
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
