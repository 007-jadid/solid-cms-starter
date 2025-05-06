import {
  ColorModeProvider,
  ColorModeScript,
  createLocalStorageManager,
} from "@kobalte/core";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/feature/ui";
import { Navbar } from "~/feature/ui/navbar";

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  const storageManager = createLocalStorageManager("vite-ui-theme");

  return (
    <SidebarProvider>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <aside>
          <AppSidebar />
        </aside>
        <main class="w-full">
          <Navbar />
          <div class="p-3">
            <Outlet />
          </div>
        </main>
      </ColorModeProvider>
      <SolidQueryDevtools />
      <TanStackRouterDevtools />
    </SidebarProvider>
  );
}
