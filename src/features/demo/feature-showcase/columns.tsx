import type { ColumnDef } from "@tanstack/solid-table";

import { Badge } from "~/features/ui/components/badge";
import { Checkbox } from "~/features/ui/components/checkbox";
import { DataTableColumnHeader } from "~/features/ui/data-table/data-table-column-header";
import type { Order, OrderItem, Product, User } from "./types";

// ============================================================================
// USER COLUMNS
// ============================================================================

export const createUserColumns = (options?: {
  enableSelection?: boolean;
  enableSorting?: boolean;
}): ColumnDef<User, unknown>[] => {
  const cols: ColumnDef<User, unknown>[] = [];

  if (options?.enableSelection) {
    cols.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    });
  }

  cols.push(
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => <span class="font-mono text-xs">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
      meta: { editable: true },
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
      meta: { editable: true },
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      meta: { editable: true },
    },
    {
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const variant = role === "admin" ? "default" : role === "editor" ? "secondary" : "outline";
        return <Badge variant={variant}>{role}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant =
          status === "active" ? "default" : status === "pending" ? "secondary" : "error";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "department",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    },
    {
      accessorKey: "salary",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Salary" />,
      cell: ({ row }) => {
        const salary = row.getValue("salary") as number;
        return <span>${salary.toLocaleString()}</span>;
      },
      meta: { editable: true },
    },
    {
      accessorKey: "joinDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Join Date" />,
    },
  );

  return cols;
};

// ============================================================================
// PRODUCT COLUMNS
// ============================================================================

export const createProductColumns = (options?: {
  enableSelection?: boolean;
}): ColumnDef<Product, unknown>[] => {
  const cols: ColumnDef<Product, unknown>[] = [];

  if (options?.enableSelection) {
    cols.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    });
  }

  cols.push(
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => <span class="font-mono text-xs">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Product Name" />,
      meta: { editable: true },
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    },
    {
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return <span>${price.toFixed(2)}</span>;
      },
      meta: { editable: true },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
      meta: { editable: true },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const label = status.replace(/_/g, " ");
        const variant =
          status === "in_stock" ? "default" : status === "low_stock" ? "secondary" : "error";
        return (
          <Badge variant={variant} class="capitalize">
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "rating",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return <span>{rating.toFixed(1)} / 5</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    },
  );

  return cols;
};

// ============================================================================
// ORDER COLUMNS (with expansion)
// ============================================================================

export const createOrderColumns = (options?: {
  enableSelection?: boolean;
}): ColumnDef<Order, unknown>[] => {
  const cols: ColumnDef<Order, unknown>[] = [];

  if (options?.enableSelection) {
    cols.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    });
  }

  cols.push(
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" />,
      cell: ({ row }) => <span class="font-mono text-xs font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant =
          status === "delivered"
            ? "default"
            : status === "shipped"
              ? "secondary"
              : status === "processing"
                ? "outline"
                : status === "cancelled"
                  ? "error"
                  : "secondary";
        return (
          <Badge variant={variant} class="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      cell: ({ row }) => {
        const total = row.getValue("total") as number;
        return <span class="font-medium">${total.toFixed(2)}</span>;
      },
    },
    {
      id: "itemCount",
      header: "Items",
      cell: ({ row }) => {
        const items = row.original.items;
        return <span>{items.length} item(s)</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    },
  );

  return cols;
};

// ============================================================================
// ORDER ITEM COLUMNS (for sub-grid)
// ============================================================================

export const orderItemColumns: ColumnDef<OrderItem, unknown>[] = [
  {
    accessorKey: "id",
    header: "Item ID",
    cell: ({ row }) => <span class="font-mono text-xs">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "productName",
    header: "Product",
  },
  {
    accessorKey: "quantity",
    header: "Qty",
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => {
      const price = row.getValue("unitPrice") as number;
      return <span>${price.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("total") as number;
      return <span class="font-medium">${total.toFixed(2)}</span>;
    },
  },
];
