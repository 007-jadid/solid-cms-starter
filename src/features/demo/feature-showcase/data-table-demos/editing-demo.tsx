import { createMemo, createSignal, For } from "solid-js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { toast } from "~/features/ui/components/sonner";
import { DataTable } from "~/features/ui/data-table";
import type { EditingHelpers } from "~/features/ui/data-table/types";
import { createUserColumns } from "../columns";
import { dummyUsers } from "../dummy-data";
import type { User } from "../types";

/**
 * Row Editing Demo
 *
 * Features demonstrated:
 * - Double-click cell to enter edit mode
 * - Inline input fields for editable columns
 * - Save/Cancel action buttons
 * - Custom save handler with helpers
 */
export function EditingDemo() {
  const [users, setUsers] = createSignal<User[]>(dummyUsers);
  const [editLog, setEditLog] = createSignal<string[]>([]);
  const columns = createMemo(() => createUserColumns());

  const handleRowEdit = async (originalRow: User, newRow: User, helpers: EditingHelpers<User>) => {
    // Use toast.promise for loading/success/error states
    await toast.promise(
      async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Log the change
        const changes: string[] = [];
        if (originalRow.firstName !== newRow.firstName) {
          changes.push(`firstName: "${originalRow.firstName}" -> "${newRow.firstName}"`);
        }
        if (originalRow.lastName !== newRow.lastName) {
          changes.push(`lastName: "${originalRow.lastName}" -> "${newRow.lastName}"`);
        }
        if (originalRow.email !== newRow.email) {
          changes.push(`email: "${originalRow.email}" -> "${newRow.email}"`);
        }
        if (originalRow.salary !== newRow.salary) {
          changes.push(`salary: $${originalRow.salary} -> $${newRow.salary}`);
        }

        if (changes.length > 0) {
          setEditLog((prev) => [`[${newRow.id}] ${changes.join(", ")}`, ...prev.slice(0, 4)]);
        }

        // Update the row in local state
        helpers.updateRow(newRow);

        // Update our state
        setUsers((prev) => prev.map((u) => (u.id === newRow.id ? newRow : u)));

        return newRow;
      },
      {
        loading: "Saving changes...",
        success: "Changes saved successfully!",
        error: "Failed to save changes",
      },
    );
  };

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Inline Row Editing</CardTitle>
          <CardDescription>
            Double-click on an editable cell (First Name, Last Name, Email, or Salary) to enter edit
            mode. All editable cells in the row become active. Use the Save/Cancel buttons to
            confirm or discard changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns()}
            data={users()}
            enableRowEditable
            rowEditAction={handleRowEdit}
            showTab={false}
          />
        </CardContent>
      </Card>

      {editLog().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle class="text-sm">Edit History</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-1 text-xs text-muted-foreground font-mono">
              <For each={editLog()}>
                {(log, i) => <li class={i() === 0 ? "text-foreground" : ""}>{log}</li>}
              </For>
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Editable Column Configuration</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <p class="text-sm text-muted-foreground mb-4">
            Mark columns as editable using the{" "}
            <code class="text-xs bg-muted px-1 py-0.5 rounded">meta.editable</code> property:
          </p>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`{
  accessorKey: "firstName",
  header: "First Name",
  meta: { editable: true }, // This column is editable
},
{
  accessorKey: "role",
  header: "Role",
  // No meta.editable = not editable
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Row Edit Action</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`import { toast } from "~/features/ui/components/sonner"

interface EditingHelpers<TData> {
  updateRow: (updatedData: TData) => void;  // Update the row in table
  revert: () => void;                        // Revert to original
  refetch?: () => Promise<void>;             // Refetch data (server mode)
}

const handleRowEdit = async (
  originalRow: User,
  newRow: User,
  helpers: EditingHelpers<User>
) => {
  // Option 1: Use toast.promise for automatic loading/success/error
  await toast.promise(
    async () => {
      await api.updateUser(newRow.id, newRow);
      helpers.updateRow(newRow);
      return newRow;
    },
    {
      loading: "Saving changes...",
      success: "Changes saved successfully!",
      error: "Failed to save changes",
    }
  );

  // Option 2: Manual toast control
  // try {
  //   await api.updateUser(newRow.id, newRow);
  //   helpers.updateRow(newRow);
  //   toast.success("Changes saved!");
  // } catch (error) {
  //   helpers.revert();
  //   toast.error("Failed to save changes");
  // }
};

<DataTable
  columns={columns}
  data={users}
  enableRowEditable
  rowEditAction={handleRowEdit}
/>`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
