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
 * Column Pinning Demo
 *
 * Features demonstrated:
 * - Pin columns to left or right
 * - Pinned columns stay visible while scrolling
 * - Column header dropdown for pin/unpin
 * - Default pinning configuration
 */
export function ColumnPinningDemo() {
  const columns = createMemo(() => createUserColumns({ enableSelection: true }));

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Column Pinning</CardTitle>
          <CardDescription>
            Pin columns to the left or right to keep them visible while scrolling horizontally. Use
            the column header dropdown menu to pin/unpin columns, or set default pinning via props.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <DataTable
              columns={columns()}
              data={dummyUsers}
              enableColumnPinning
              defaultColumnPinning={{
                left: ["select", "id"],
                right: ["salary"],
              }}
              showTab={false}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pinning Features</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <ul class="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Left Pin:</strong> Columns stay fixed on the left while scrolling
            </li>
            <li>
              <strong>Right Pin:</strong> Columns stay fixed on the right while scrolling
            </li>
            <li>
              <strong>Visual Indicator:</strong> Pinned columns have a subtle border/shadow
            </li>
            <li>
              <strong>Header Menu:</strong> Pin/Unpin options in column header dropdown
            </li>
            <li>
              <strong>Default Config:</strong> Set initial pinned columns via{" "}
              <code class="text-xs bg-muted px-1 py-0.5 rounded">defaultColumnPinning</code>
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
            {`<DataTable
  columns={columns}
  data={users}
  enableColumnPinning
  defaultColumnPinning={{
    left: ["select", "id"],      // Pin to left
    right: ["actions", "salary"], // Pin to right
  }}
/>

// Users can also pin/unpin via column header dropdown menu
// The pinning state is managed internally by TanStack Table

// Type-safe column names
defaultColumnPinning?: {
  left?: Array<Extract<keyof TData, string> | (string & {})>;
  right?: Array<Extract<keyof TData, string> | (string & {})>;
};`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
