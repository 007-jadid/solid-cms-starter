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
 * Pagination Demo
 *
 * Features demonstrated:
 * - Page size selection (10, 20, 30, 40, 50)
 * - Page navigation (First, Previous, Next, Last)
 * - Current page display
 * - URL-synced pagination state
 */
export function PaginationDemo() {
  const columns = createMemo(() => createUserColumns());

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pagination</CardTitle>
          <CardDescription>
            The pagination controls at the bottom allow you to navigate through pages and change the
            number of items per page. Pagination state is synced with the URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns()} data={dummyUsers} showTab={false} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagination Features</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <ul class="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>URL State:</strong> Page number and items per page are stored in URL query
              params (<code class="text-xs bg-muted px-1 py-0.5 rounded">pageNumber</code>,{" "}
              <code class="text-xs bg-muted px-1 py-0.5 rounded">itemsPerPage</code>)
            </li>
            <li>
              <strong>Page Sizes:</strong> Configurable options (default: 10, 20, 30, 40, 50)
            </li>
            <li>
              <strong>Navigation:</strong> First, Previous, Next, Last page buttons
            </li>
            <li>
              <strong>Server-side:</strong> Supports manual pagination for API-driven data
            </li>
            <li>
              <strong>Row Selection Counter:</strong> Shows selected rows count when row selection
              is enabled
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`// For server-side pagination, use the url prop
<DataTable
  columns={columns}
  url="/api/users"  // Server handles pagination
  // Pagination params are automatically sent to the server
/>

// For client-side pagination (default)
<DataTable
  columns={columns}
  data={users}  // All data loaded, pagination handled client-side
/>`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
