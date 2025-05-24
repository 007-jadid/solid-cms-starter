import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/solid-router";
import { effect } from "solid-js/web";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { columns } from "~/feature/context/constants";
import { DataTableProvider } from "~/feature/ui/data-table/data-table.provider";

export const Route = createFileRoute("/")({
  component: App,
  errorComponent: (error) => {
    console.log({ error });

    return <div>Error</div>;
  },
  validateSearch: z.object({
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
  }),
});

function App() {
  const pageInfo = useSearch({ from: "/" });
  const navigate = useNavigate();

  effect(() => {
    console.log({
      pageSize: pageInfo().pageSize,
      page: pageInfo().page,
    });
  });

  return (
    <main class="p-4">
      <Button
        onClick={() => {
          const currentPage = pageInfo().page;
          navigate({
            from: "/",
            search: {
              page: currentPage + 1,
            },
            // replace: true,
          });
        }}
      >
        Page : {pageInfo()?.page}
      </Button>

      <h1 class="text-3xl font-bold underline">Hello world!</h1>
      <div class="mt-5">
        <DataTableProvider columns={columns} />
      </div>
    </main>
  );
}
