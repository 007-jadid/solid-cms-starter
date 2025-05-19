import { SidebarGroupLabel, SidebarTrigger } from "~/components/ui/sidebar";

export const SidebarHeader = () => {
  return (
    <div class="flex items-center justify-between border rounded border-gray-100 dark:border-gray-700 mb-1 bg-white dark:bg-transparent">
      <SidebarTrigger />

      <SidebarGroupLabel class="h-[40px] font-bold dark:transparent text-lg items-center justify-center">
        Foodi
      </SidebarGroupLabel>
    </div>
  );
};
