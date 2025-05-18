import { Link } from "@tanstack/solid-router";
import { For } from "solid-js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import {
  CalendarIcon,
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
  return (
    <Sidebar class="">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader />
          <SidebarGroupContent>
            <SidebarMenu>
              <For each={items}>
                {(item) => (
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
                )}
              </For>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
