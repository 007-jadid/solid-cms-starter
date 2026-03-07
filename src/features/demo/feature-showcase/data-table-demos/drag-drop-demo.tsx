import { createMemo, createSignal, For } from "solid-js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { DataTable } from "~/features/ui/data-table";
import { createProductColumns } from "../columns";
import { dummyProducts } from "../dummy-data";
import type { Product } from "../types";

/**
 * Drag & Drop Demo
 *
 * Features demonstrated:
 * - Drag handle for reordering rows
 * - Smooth animations during drag
 * - onReorder callback with new order
 * - Uses @dnd-kit for robust drag and drop
 */
export function DragDropDemo() {
  const [products, setProducts] = createSignal<Product[]>(dummyProducts);
  const [reorderLog, setReorderLog] = createSignal<string[]>([]);
  const columns = createMemo(() => createProductColumns());

  const handleReorder = (newOrder: Product[]) => {
    setProducts(newOrder);
    const log = `Reordered: ${newOrder.map((p) => p.name.split(" ")[0]).join(" -> ")}`;
    setReorderLog((prev) => [log, ...prev.slice(0, 4)]);
    console.log("New order:", newOrder);
  };

  return (
    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Drag & Drop Reordering</CardTitle>
          <CardDescription>
            Drag rows using the handle (6-dot icon) on the left to reorder items. The new order is
            reported via the <code class="text-xs bg-muted px-1 py-0.5 rounded">onReorder</code>{" "}
            callback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns()}
            data={products()}
            enableDragAndDrop
            onReorder={handleReorder}
            showTab={false}
          />
        </CardContent>
      </Card>

      {reorderLog().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle class="text-sm">Reorder Log</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-1 text-xs text-muted-foreground font-mono">
              <For each={reorderLog()}>
                {(log, i) => <li class={i() === 0 ? "text-foreground" : ""}>{log}</li>}
              </For>
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-sm dark:prose-invert max-w-none">
          <ul class="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Library:</strong> Uses{" "}
              <code class="text-xs bg-muted px-1 py-0.5 rounded">@dnd-kit</code> for collision
              detection and sensors
            </li>
            <li>
              <strong>Sensors:</strong> Supports Mouse, Touch, and Keyboard interactions
            </li>
            <li>
              <strong>Performance:</strong> O(1) row lookup using Map for efficient drag operations
            </li>
            <li>
              <strong>Conditional:</strong> DndContext is only rendered when drag is enabled (no
              overhead otherwise)
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`const [items, setItems] = createSignal(initialItems);

const handleReorder = (newOrder: Item[]) => {
  setItems(newOrder);
  // Optionally persist to server
  api.updateOrder(newOrder.map(item => item.id));
};

<DataTable
  columns={columns}
  data={items()}
  enableDragAndDrop
  onReorder={handleReorder}
/>`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
