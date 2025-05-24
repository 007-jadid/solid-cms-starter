import type { Column, ColumnDef } from "@tanstack/solid-table";
import { Match, Show, Switch } from "solid-js";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  ChevronUpDown,
  EllipsisIcon,
  EyeOff,
  X,
} from "../ui/icons";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const DataTableHeader = (props: {
  column: Column<Payment, unknown>;
  title: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger class="flex items-center">
        <span class="mr-1">{props.title}</span>

        <Show when={props.column.getCanSort()}>
          <Switch fallback={<ChevronUpDown />}>
            <Match when={props?.column?.getIsSorted() === "desc"}>
              <ChevronDown />
            </Match>
            <Match when={props?.column?.getIsSorted() === "asc"}>
              <ChevronUp />
            </Match>
          </Switch>
        </Show>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <Show when={props.column.getCanSort()}>
          <DropdownMenuCheckboxItem
            class="space-x-1 relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
            checked={props.column.getIsSorted() === "asc"}
            on:click={() => {
              props.column.toggleSorting(false);
            }}
          >
            <ChevronUp />
            <span class="pl-.5 text-xs">Asc</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            class="space-x-1  relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
            checked={props.column.getIsSorted() === "desc"}
            onClick={() => {
              props.column.toggleSorting(true);
            }}
          >
            <ChevronDown />
            <span class="pl-.5 text-xs">Dsc</span>
          </DropdownMenuCheckboxItem>
        </Show>

        <Show when={props.column.getIsSorted()}>
          <DropdownMenuItem
            class="px-3 py-2 flex items-center "
            onClick={() => {
              props.column.clearSorting();
            }}
          >
            <X />
            <span class="pl-.5 text-xs">Reset</span>
          </DropdownMenuItem>
        </Show>

        {/* @TODO: NEED TO HANDLE THIS */}
        <Show when={props.column.getCanHide()}>
          <DropdownMenuCheckboxItem
            checked={!props.column.getIsVisible()}
            onClick={() => props.column.toggleVisibility(false)}
            class="space-x-1 pl-2"
          >
            <span class="pl-[2px]">
              <EyeOff />
            </span>

            <span class="text-xs">Hide</span>
          </DropdownMenuCheckboxItem>
        </Show>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: (props) => (
      <Checkbox
        checked={props.table.getIsAllPageRowsSelected()}
        indeterminate={props.table.getIsSomePageRowsSelected()}
        onChange={(value) => props.table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: (props) => (
      <Checkbox
        checked={props.row.getIsSelected()}
        onChange={(value) => props.row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: (props) => <DataTableHeader title="Status" column={props.column} />,
    cell: (props) => (
      <div class="capitalize">{props?.row?.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: (props) => <DataTableHeader title="Email" column={props.column} />,
    cell: (props) => <div class="lowercase">{props.row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div class="text-right">Amount</div>,
    cell: (props) => {
      const formatted = () => {
        const amount = parseFloat(props.row.getValue("amount"));
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
      };
      return <div class="text-right font-medium">{formatted()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: (props) => {
      return (
        <DropdownMenu placement="bottom-end">
          <DropdownMenuTrigger
            as={Button<"button">}
            variant="ghost"
            class="size-8 rounded-full p-0"
          >
            <span class="sr-only">Open menu</span>
            <EllipsisIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(props.row.original.id)
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
