import { Link } from "@tanstack/solid-router";
import { For } from "solid-js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
