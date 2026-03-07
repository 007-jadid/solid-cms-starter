import type { ColumnDef } from "@tanstack/solid-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { DataTable } from "~/features/ui/data-table";
import type { FetcherOptions, ResponseMapperResult } from "~/features/ui/data-table/types";
import { VirtualizedTable } from "~/features/ui/data-table/virtualized-table";

// ============================================================================
// Demo data
// ============================================================================

interface VirtualDemoItem {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  department: string;
  amount: number;
}

/** Pre-generated 500 rows used by both demos */
const allRows: VirtualDemoItem[] = Array.from({ length: 500 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: (["active", "inactive", "pending"] as const)[i % 3],
  department: ["Engineering", "Marketing", "Sales", "Support", "HR"][i % 5],
  amount: Math.round(Math.random() * 10000) / 100,
}));

/** 5,000 rows for the client-side virtual demo */
const largeDataset: VirtualDemoItem[] = Array.from({ length: 5000 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: (["active", "inactive", "pending"] as const)[i % 3],
  department: ["Engineering", "Marketing", "Sales", "Support", "HR"][i % 5],
  amount: Math.round(Math.random() * 10000) / 100,
}));

const columns: ColumnDef<VirtualDemoItem, unknown>[] = [
  { id: "id", header: "ID", accessorKey: "id", size: 60 },
  { id: "name", header: "Name", accessorKey: "name", size: 200 },
  { id: "email", header: "Email", accessorKey: "email", size: 250 },
  { id: "status", header: "Status", accessorKey: "status", size: 100 },
  {
    id: "department",
    header: "Department",
    accessorKey: "department",
    size: 150,
  },
  {
    id: "amount",
    header: "Amount",
    accessorKey: "amount",
    size: 100,
    cell: (info) => `$${(info.getValue() as number).toFixed(2)}`,
  },
];

// ============================================================================
// Dummy fetcher — simulates a paginated server response
// ============================================================================

/**
 * Simulates a server that returns paginated data.
 * Supports sorting and search filtering, with a 300ms artificial delay.
 */
async function dummyFetcher(
  params: FetcherOptions,
): Promise<ResponseMapperResult<VirtualDemoItem>> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));

  let filtered = [...allRows];

  // Apply search
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.department.toLowerCase().includes(q),
    );
  }

  // Apply sorting
  if (params.sorting?.length) {
    const sort = params.sorting[0];
    filtered.sort((a, b) => {
      const aVal = a[sort.id as keyof VirtualDemoItem];
      const bVal = b[sort.id as keyof VirtualDemoItem];
      if (aVal < bVal) return sort.desc ? 1 : -1;
      if (aVal > bVal) return sort.desc ? -1 : 1;
      return 0;
    });
  }

  const totalItems = filtered.length;
  const totalPage = Math.ceil(totalItems / params.itemsPerPage);
  const pageNumber = params.pageNumber;
  const start = (pageNumber - 1) * params.itemsPerPage;
  const items = filtered.slice(start, start + params.itemsPerPage);

  return {
    items,
    totalItems,
    totalPage,
    pageNumber,
    itemPerPage: params.itemsPerPage,
    hasNext: pageNumber < totalPage,
    hasPrev: pageNumber > 1,
  };
}

// ============================================================================
// Component
// ============================================================================

/**
 * Virtual Scrolling Demo
 *
 * Features demonstrated:
 * - enableVirtual prop on existing DataTable for large client-side datasets
 * - VirtualizedTable component with dummy fetcher for infinite scroll
 * - Page size selector (no page number — scroll loads more)
 * - CSS Grid + absolute positioning for 60fps scrolling
 * - Fixed header with scrollable body
 * - Row selection in virtual mode
 */
export function VirtualDemo() {
  return (
    <div class="space-y-6">
      {/* Demo 1: enableVirtual on DataTable */}
      <Card>
        <CardHeader>
          <CardTitle>enableVirtual — 5,000 Client Rows</CardTitle>
          <CardDescription>
            Standard DataTable with <code>enableVirtual</code> prop. Rows are rendered using
            TanStack Virtual with CSS Grid layout. Fixed header, smooth 60fps scrolling. Supports
            row selection, density changes, and all existing DataTable features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<VirtualDemoItem, unknown>
            columns={columns}
            data={largeDataset}
            enableVirtual
            enableRowSelection
            maxHeight="500px"
          />
        </CardContent>
      </Card>

      {/* Demo 2: VirtualizedTable — Scroll Mode (Infinite Scroll) */}
      <Card>
        <CardHeader>
          <CardTitle>VirtualizedTable — Scroll Mode (Infinite Scroll)</CardTitle>
          <CardDescription>
            <code>mode="scroll"</code> (default). Pages load automatically as you scroll down. No
            page number navigation — only a "Rows per page" selector. Uses{" "}
            <code>useInfiniteQuery</code> internally. Search and sorting are also supported.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VirtualizedTable<VirtualDemoItem, unknown>
            columns={columns}
            fetcher={dummyFetcher}
            mode="scroll"
            itemsPerPage={30}
            maxHeight="500px"
            enableRowSelection
            searchPlaceholder="Search users..."
          />
        </CardContent>
      </Card>

      {/* Demo 3: VirtualizedTable — Cursor Mode (Page Navigation) */}
      <Card>
        <CardHeader>
          <CardTitle>VirtualizedTable — Cursor Mode (Pagination)</CardTitle>
          <CardDescription>
            <code>mode="cursor"</code>. Traditional pagination with first/prev/next/last page
            navigation. User can change both page number and page size. Uses <code>useQuery</code>{" "}
            for single-page fetching. Virtual rendering still active for smooth scrolling within
            each page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VirtualizedTable<VirtualDemoItem, unknown>
            columns={columns}
            fetcher={dummyFetcher}
            mode="cursor"
            itemsPerPage={20}
            maxHeight="500px"
            enableRowSelection
            searchPlaceholder="Search users..."
          />
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">
            {`// Option 1: Virtual mode on existing DataTable (client-side data)
<DataTable
  columns={columns}
  data={largeDataset}     // 5,000+ rows
  enableVirtual           // Enables TanStack Virtual
  enableRowSelection
  maxHeight="500px"       // Required for scroll container
/>

// Option 2: VirtualizedTable — Scroll mode (infinite scroll)
<VirtualizedTable
  columns={columns}
  fetcher={dummyFetcher}
  mode="scroll"           // Default — infinite scroll, no page nav
  itemsPerPage={30}
  maxHeight="500px"
/>

// Option 3: VirtualizedTable — Cursor mode (page navigation)
<VirtualizedTable
  columns={columns}
  url="/v1/users"         // Server endpoint (or use fetcher)
  mode="cursor"           // Page navigation: first/prev/next/last
  itemsPerPage={20}
  maxHeight="500px"
  enableRowSelection
/>`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
