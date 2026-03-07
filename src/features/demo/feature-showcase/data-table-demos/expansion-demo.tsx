import type { Row } from "@tanstack/solid-table";
import { createMemo, For } from "solid-js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { DataTable } from "~/features/ui/data-table";
import type { SubGridConfig } from "~/features/ui/data-table/types";
import { createOrderColumns, orderItemColumns } from "../columns";
import { dummyOrders } from "../dummy-data";
import type { Order, OrderItem } from "../types";

/**
 * Row Expansion Demo
 *
 * Features demonstrated:
 * - Expand/collapse rows to show details
 * - Custom sub-component rendering
 * - Nested DataTable (sub-grid)
 * - Expand toggle icon in first column
 */

// Custom sub-component for expanded row
function OrderDetails(props: { row: Row<Order> }) {
  const order = props.row.original;

  return (
    <div class="p-4 bg-muted/50 rounded-md space-y-3">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span class="text-muted-foreground">Order ID:</span>
          <p class="font-medium">{order.id}</p>
        </div>
        <div>
          <span class="text-muted-foreground">Customer:</span>
          <p class="font-medium">{order.customerName}</p>
        </div>
        <div>
          <span class="text-muted-foreground">Email:</span>
          <p class="font-medium">{order.email}</p>
        </div>
        <div>
          <span class="text-muted-foreground">Date:</span>
          <p class="font-medium">{order.createdAt}</p>
        </div>
      </div>
      <div>
        <h4 class="text-sm font-semibold mb-2">Order Items:</h4>
        <ul class="text-sm space-y-1">
          <For each={order.items}>
            {(item) => (
              <li class="flex justify-between">
                <span>
                  {item.productName} x{item.quantity}
                </span>
                <span class="font-medium">${item.total.toFixed(2)}</span>
              </li>
            )}
          </For>
        </ul>
        <div class="border-t mt-2 pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export function ExpansionDemo() {
  const columns = createMemo(() => createOrderColumns());

  // Memoize sub-grid configuration
  const subGridConfig = createMemo<SubGridConfig<Order, OrderItem>>(() => ({
    columns: orderItemColumns,
    getSubData: (row) => row.items,
  }));

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Row Expansion - Custom Content</CardTitle>
          <CardDescription>
            Click the expand icon to reveal detailed order information. This uses a custom{" "}
            <code class="text-xs bg-muted px-1 py-0.5 rounded">renderSubComponent</code> for full
            control over the expanded content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns()}
            data={dummyOrders}
            enableExpanding
            renderSubComponent={OrderDetails}
            showTab={false}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Row Expansion - Nested DataTable (Sub-Grid)</CardTitle>
          <CardDescription>
            The expanded row contains a fully functional nested DataTable showing order items. Uses{" "}
            <code class="text-xs bg-muted px-1 py-0.5 rounded">subGridConfig</code> for automatic
            sub-grid rendering.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns()}
            data={dummyOrders}
            enableExpanding
            subGridConfig={subGridConfig() as SubGridConfig<Order, unknown>}
            showTab={false}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expansion Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`// Option 1: Custom render function
<DataTable
  columns={columns}
  data={orders}
  enableExpanding
  renderSubComponent={(props) => (
    <div class="p-4">
      <h3>{props.row.original.customerName}</h3>
      <p>{props.row.original.email}</p>
      {/* Custom content */}
    </div>
  )}
/>

// Option 2: Nested DataTable (sub-grid)
const subGridConfig: SubGridConfig<Order, OrderItem> = {
  columns: orderItemColumns,
  getSubData: (row) => row.items,    // Static data
  // OR
  getSubUrl: (row) => \`/api/orders/\${row.id}/items\`,  // API URL
  // OR
  getSubFetcher: async (row, params) => {             // Custom fetcher
    return await api.getOrderItems(row.id, params);
  },
  enableRowSelection: true,  // Sub-grid options
  enableDragAndDrop: false,
};

<DataTable
  columns={columns}
  data={orders}
  enableExpanding
  subGridConfig={subGridConfig}
/>`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
