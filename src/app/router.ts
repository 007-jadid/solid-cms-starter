import { createRouter } from "@tanstack/solid-router";
import { getAuthContext } from "~/features/context/auth/auth.context";
import { routeTree } from "~/routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  context: {
    auth: {
      isAuthenticated: () => getAuthContext()?.isAuthenticated() ?? false,
    },
  },
});
