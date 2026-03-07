import { createMemo } from "solid-js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { DataTable } from "~/features/ui/data-table";
import type { DataTableFilterField } from "~/features/ui/data-table/types";
import { createUserColumns } from "../columns";
import { departmentOptions, dummyUsers, roleOptions, statusOptions } from "../dummy-data";
import type { User } from "../types";

/**
 * Filtering Demo
 *
 * Features demonstrated:
 * - Faceted filters (multi-select dropdowns)
 * - Input filters (text/number/date)
 * - Search functionality with debouncing
 * - Filter badges showing active filters
 * - Reset all filters
 */
export function FilteringDemo() {
  const columns = createMemo(() => createUserColumns());

  // Define filter fields for the toolbar
  const filterFields: DataTableFilterField<User>[] = [
    {
      label: "Role",
      value: "role",
      type: "select",
      options: roleOptions,
    },
    {
      label: "Status",
      value: "status",
      type: "select",
      options: statusOptions,
    },
    {
      label: "Department",
      value: "department",
      type: "select",
      options: departmentOptions,
    },
  ];

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Filtering</CardTitle>
          <CardDescription>
            Use the dropdowns to filter data by multiple criteria. Filters can be combined and are
            reflected in the URL for shareable links. Use the search bar for text-based filtering.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns()}
            data={dummyUsers}
            filterFields={filterFields}
            showTab={false}
            searchPlaceholder="Search users..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter Types</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold text-sm mb-2">Faceted Filters (Dropdowns)</h4>
              <ul class="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                <li>Multi-select support with checkboxes</li>
                <li>Can fetch options from API with pagination</li>
                <li>Server-side search within options</li>
                <li>Option count display (facet counts)</li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-sm mb-2">Input Filters</h4>
              <ul class="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                <li>Text, number, date input types</li>
                <li>Zod schema validation support</li>
                <li>Popover interface with apply/clear</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`const filterFields: DataTableFilterField<User>[] = [
  {
    label: "Role",
    value: "role",
    type: "select",
    options: [
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ],
  },
  {
    label: "Status",
    value: "status",
    type: "select",
    options: statusOptions,
  },
];

<DataTable
  columns={columns}
  data={users}
  filterFields={filterFields}
  searchPlaceholder="Search users..."
  resetFiltersOnSearch={true}
/>`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
