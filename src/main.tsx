import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { render } from "solid-js/web";

import "./app.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

const rootElement = document.getElementById("app");
if (rootElement) {
  render(() => <App />, rootElement);
}
