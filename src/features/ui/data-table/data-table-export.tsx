import { type ExportColumn, exportToCSV } from "~/features/lib/export";
import { Button } from "../components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";

interface DataTableExportProps<TData> {
  data: () => TData[];
  filename: string;
  columns?: ExportColumn<TData>[];
}

export function DataTableExport<TData>(props: DataTableExportProps<TData>) {
  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger
        as={(triggerProps: Record<string, unknown>) => (
          <Button {...triggerProps} variant="outline" size="sm" class="h-8">
            <svg
              class="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </Button>
        )}
      />
      <DropdownMenuContent class="w-40">
        <DropdownMenuItem onSelect={() => exportToCSV(props.data(), props.filename, props.columns)}>
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
