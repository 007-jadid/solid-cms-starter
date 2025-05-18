import { Show } from "solid-js";
import { SidebarTrigger, useSidebar } from "~/components/ui/sidebar";
import { ThemeToggle } from "../theme-toggle";

export const Navbar = () => {
  const { open } = useSidebar();

  return (
    <header class="w-full py-3 px-3 border-b border-gray-100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav class="flex items-center justify-between">
        <div>
          <Show when={!open()}>
            <SidebarTrigger />
          </Show>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
};
