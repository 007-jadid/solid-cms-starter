import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/_protected/users/")({
  component: () => null,
});
