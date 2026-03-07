/**
 * DataTable State Components
 * Loading, error, and empty state display components
 */

import { Show } from "solid-js";

import { EmptyState } from "../components/empty-state";
import { ErrorState } from "../components/error-state";
import { TableCell, TableRow } from "../components/table";

// ============================================================================
// Loading Row
// ============================================================================

interface DataTableLoadingRowProps {
  colSpan: number;
}

export function DataTableLoadingRow(props: DataTableLoadingRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={props.colSpan} class="h-24 text-center">
        <div class="flex items-center justify-center py-4">
          <svg
            class="h-6 w-6 animate-spin text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 176a72 72 0 1 1 72-72a72.08 72.08 0 0 1-72 72"
            />
          </svg>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ============================================================================
// Error Row
// ============================================================================

interface DataTableErrorRowProps {
  colSpan: number;
  onRetry?: () => void;
}

export function DataTableErrorRow(props: DataTableErrorRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={props.colSpan}>
        <ErrorState
          title="Failed to load data"
          description="We couldn't load the table data. Please try again."
          onRetry={props.onRetry}
        />
      </TableCell>
    </TableRow>
  );
}

// ============================================================================
// Empty Row
// ============================================================================

interface DataTableEmptyRowProps {
  colSpan: number;
  hasActiveFilters: boolean;
}

export function DataTableEmptyRow(props: DataTableEmptyRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={props.colSpan}>
        <EmptyState
          title={props.hasActiveFilters ? "No results found" : "No data available"}
          description={props.hasActiveFilters ? "Try adjusting your filters." : undefined}
          class="py-8"
        />
      </TableCell>
    </TableRow>
  );
}

// ============================================================================
// Loading Overlay
// ============================================================================

interface DataTableLoadingOverlayProps {
  isVisible: boolean;
}

export function DataTableLoadingOverlay(props: DataTableLoadingOverlayProps) {
  return (
    <Show when={props.isVisible}>
      <div class="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-background/50 backdrop-blur-md">
        <div class="flex flex-col items-center gap-2">
          <svg
            class="h-8 w-8 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 176a72 72 0 1 1 72-72a72.08 72.08 0 0 1-72 72"
            />
          </svg>
          <p class="font-sans text-sm font-medium text-foreground">Refreshing...</p>
        </div>
      </div>
    </Show>
  );
}
