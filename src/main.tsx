import { QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { RouterProvider } from "@tanstack/solid-router";
import { Show } from "solid-js";
import { render } from "solid-js/web";
import { applyGlassPresetFromStorage } from "~/app/bootstrap";
import { MAP_RUNTIME_CONFIG } from "~/app/map-runtime-config";
import { queryClient } from "~/app/query-client";
import { router } from "~/app/router";
import { AuthProvider } from "~/features/context/auth/auth.context";
import { I18nProvider } from "~/features/context/i18n";
import { PermissionsProvider } from "~/features/context/permissions/permissions.context";
import { SettingsProvider } from "~/features/context/settings/settings.context";
import { cms } from "~/features/core";
import { MapConfigProvider } from "~/features/ui/components/map";

import "./app.css";

applyGlassPresetFromStorage();

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <AuthProvider>
            <PermissionsProvider>
              {/* Configure global map defaults and allowed runtime providers */}
              <MapConfigProvider config={MAP_RUNTIME_CONFIG}>
                <cms.Provider>
                  <RouterProvider router={router} />
                </cms.Provider>
              </MapConfigProvider>
            </PermissionsProvider>
          </AuthProvider>
        </SettingsProvider>
        <Show when={import.meta.env.DEV}>
          <SolidQueryDevtools initialIsOpen={false} />
        </Show>
      </QueryClientProvider>
    </I18nProvider>
  );
}

const rootElement = document.getElementById("app");
if (rootElement) {
  render(() => <App />, rootElement);
}
