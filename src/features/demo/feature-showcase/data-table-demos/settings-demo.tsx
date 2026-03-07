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
 * Table Settings Demo
 *
 * Features demonstrated:
 * - Column visibility toggle
 * - Density control (Compact, Standard, Spacious)
 * - Settings persistence with tableId
 * - Settings menu (gear icon)
 */
export function SettingsDemo() {
  const columns = createMemo(() => createUserColumns({ enableSelection: true }));

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Table Settings</CardTitle>
          <CardDescription>
            Click the gear icon in the toolbar to access table settings. You can toggle column
            visibility and change the row density. Settings are persisted in localStorage when a{" "}
            <code class="text-xs bg-muted px-1 py-0.5 rounded">tableId</code> is provided.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns()}
            data={dummyUsers}
            tableId="settings-demo-table"
            showTab={false}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings Features</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold text-sm mb-2">Column Visibility</h4>
              <ul class="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                <li>Toggle columns on/off via checkboxes</li>
                <li>Search filter to find columns quickly</li>
                <li>Shows count (X visible of Y total)</li>
                <li>Persisted per table (requires tableId)</li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-sm mb-2">Density Control</h4>
              <ul class="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                <li>
                  <strong>Compact (sm):</strong> Smaller padding, condensed view
                </li>
                <li>
                  <strong>Standard (md):</strong> Default comfortable spacing
                </li>
                <li>
                  <strong>Spacious (lg):</strong> Extra padding for readability
                </li>
                <li>Globally persisted (affects all tables)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Persistence</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`// Provide tableId for column visibility persistence
<DataTable
  columns={columns}
  data={users}
  tableId="users-table"  // Unique ID for this table
/>

// Storage keys used:
// - Column visibility: "table-visibility-{tableId}"
// - Density: "table-density" (global, not per-table)

// Without tableId, column visibility resets on page refresh
// Density is always persisted globally`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
