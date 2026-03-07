import { createMemo } from "solid-js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { type BulkAction, DataTable } from "~/features/ui/data-table";
import { createUserColumns } from "../columns";
import { dummyUsers } from "../dummy-data";
import type { User } from "../types";

/**
 * Row Selection Demo
 *
 * Features demonstrated:
 * - Checkbox selection per row
 * - Select all on current page
 * - Selection counter in pagination
 * - Selected row highlighting
 * - Actions on selected rows
 */
const bulkActions: BulkAction<User>[] = [
  {
    label: "Delete Selected",
    variant: "destructive",
    onClick: (rows) =>
      alert(
        `Would delete ${rows.length} user(s): ${rows.map((r) => `${r.firstName} ${r.lastName}`).join(", ")}`,
      ),
  },
  {
    label: "Export Selected",
    variant: "outline",
    onClick: (rows) => console.log("Exporting", rows.length, "rows", rows),
  },
];

export function SelectionDemo() {
  const columns = createMemo(() => createUserColumns({ enableSelection: true }));

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Row Selection + Bulk Actions</CardTitle>
          <CardDescription>
            Enable row selection with checkboxes. Select rows to reveal the bulk action toolbar
            above the filters. Selected rows are highlighted with a blue border. The selection count
            is shown in the pagination area at the bottom.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns()}
            data={dummyUsers}
            enableRowSelection
            showTab={false}
            bulkActions={bulkActions}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selection Features</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <ul class="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Per-row checkbox:</strong> Each row has a checkbox for individual selection
            </li>
            <li>
              <strong>Header checkbox:</strong> Select/deselect all rows on the current page
            </li>
            <li>
              <strong>Visual feedback:</strong> Selected rows have highlighted background and left
              border
            </li>
            <li>
              <strong>Selection counter:</strong> Shows count of selected rows in pagination area
            </li>
            <li>
              <strong>Bulk actions:</strong> Implement actions that operate on all selected rows
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`// Add selection column to columns definition
const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // ... other columns
];

// Enable row selection on DataTable
<DataTable
  columns={columns}
  data={users}
  enableRowSelection
/>`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
