import { createFileRoute } from "@tanstack/solid-router";
import { columns } from "~/feature/context/constants";
import { DataTableProvider } from "~/feature/context/data-table.provider";

export const Route = createFileRoute("/")({
  component: App,
  errorComponent: (error) => {
    console.log({ error });

    return <div>Error</div>;
  },
});

function App() {
  return (
    <main class="p-4">
      <h1 class="text-3xl font-bold underline">Hello world!</h1>
      <div class="mt-5">
        <DataTableProvider columns={columns} />
      </div>
    </main>
  );
}
