import { createMemo } from "solid-js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { DataTable } from "~/features/ui/data-table";
import { createUserColumns } from "../columns";
import { dummyUsers } from "../dummy-data";

/**
 * Sorting Demo
 *
 * Features demonstrated:
 * - Column header click to sort
 * - Ascending/Descending toggle
 * - Multi-column sorting support
 * - Sort indicator icons
 */
export function SortingDemo() {
  const columns = createMemo(() => createUserColumns({ enableSorting: true }));

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sorting</CardTitle>
          <CardDescription>
            Click on column headers to sort. The dropdown menu provides options for
            ascending/descending order. Sorting works with all column types including text, numbers,
            and dates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns()} data={dummyUsers} showTab={false} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <ul class="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>
              Uses TanStack Table's{" "}
              <code class="text-xs bg-muted px-1 py-0.5 rounded">getSortedRowModel()</code> for
              client-side sorting
            </li>
            <li>
              Column headers use{" "}
              <code class="text-xs bg-muted px-1 py-0.5 rounded">DataTableColumnHeader</code>{" "}
              component with sorting controls
            </li>
            <li>
              Supports manual sorting via{" "}
              <code class="text-xs bg-muted px-1 py-0.5 rounded">manualSorting</code> prop for
              server-side
            </li>
            <li>
              Sort state is managed internally and can be controlled via URL when using server-side
              data
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
