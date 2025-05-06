import { SidebarTrigger } from "~/components/ui/sidebar";
import { ThemeToggle } from "../theme-toggle";

export const Navbar = () => {
  return (
    <header class="w-full py-3 px-3 border-b border-gray-100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav class="flex items-center justify-between">
        <SidebarTrigger />

        <ThemeToggle />
      </nav>
    </header>
  );
};
