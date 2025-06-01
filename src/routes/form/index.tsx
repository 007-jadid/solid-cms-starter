import { createFileRoute } from "@tanstack/solid-router";
import { FormComponent } from "~/feature/form";

export const Route = createFileRoute("/form/")({
  component: FormComponent,
  errorComponent(error) {
    console.log({ error });

    return "Error";
  },
});
