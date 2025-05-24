import { Link } from "@tanstack/solid-router";
import { For, Match, Switch } from "solid-js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
} from "~/components/ui/sidebar";
import {
  CalendarIcon,
  Down,
  HomeIcon,
  MailIcon,
  SearchIcon,
  Settings,
} from "../icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

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
  console.log("Sidebar");

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel class="h-[40px] font-bold bg-white dark:bg-slate-900 text-lg items-center justify-center">
            Foodi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <For each={items}>
                {(item) => {
                  return (
                    <Switch>
                      <Match when={item.children?.length}>
                        <Collapsible>
                          <SidebarMenuItem>
                            <CollapsibleTrigger class="flex item-center px-3 justify-between w-full">
                              <div class="flex items-center gap-x-3">
                                <item.icon />
                                <span class="text-[13px]">{item.title}</span>
                              </div>
                              <Down />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
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
                                          class="flex items-center py-2 rounded px-3 gap-x-2 transition duration-100"
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
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      </Match>
                      <Match when={!item.children?.length}>
                        <SidebarMenuItem class="text-xs!">
                          <Link
                            activeProps={{
                              class:
                                "bg-white dark:bg-gray-600 transition duration-100",
                            }}
                            activeOptions={{ exact: true }}
                            to={item.url}
                            class="flex items-center py-2 rounded px-3 gap-x-2 transition duration-100"
                          >
                            <item.icon />
                            <span class="text-[13px]">{item.title}</span>
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
