import { SidebarGroupLabel, SidebarTrigger } from "~/components/ui/sidebar";

export const SidebarHeader = () => {
  return (
    <div class="flex items-center justify-between border rounded border-gray-100 mb-1 bg-white">
      <SidebarTrigger />

      <SidebarGroupLabel class="h-[40px] font-bold dark:bg-slate-900 text-lg items-center justify-center">
        Foodi
      </SidebarGroupLabel>
    </div>
  );
};
