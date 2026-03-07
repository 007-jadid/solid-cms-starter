import { createFileRoute } from "@tanstack/solid-router";
import { Demo } from "~/features/demo";

export const Route = createFileRoute("/_protected/demo")({
  component: Demo,
});
