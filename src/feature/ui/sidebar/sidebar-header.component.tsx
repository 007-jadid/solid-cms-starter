import { Match, Switch } from "solid-js";
import { SidebarGroupLabel, useSidebar } from "~/components/ui/sidebar";

export const SidebarHeader = () => {
  const sidebarStore = useSidebar();

  return (
    <div class="flex items-center justify-between border rounded border-gray-100 dark:border-gray-700 mb-1 bg-white dark:bg-transparent">
      {/* <SidebarTrigger /> */}

      <SidebarGroupLabel class="h-[40px] font-bold dark:transparent text-lg items-center justify-center">
        <Switch>
          <Match when={sidebarStore.open()}>Foodi</Match>
          <Match when={!sidebarStore.open()}>F</Match>
        </Switch>
      </SidebarGroupLabel>
    </div>
  );
};
