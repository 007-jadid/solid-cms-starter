import { cn } from "~/features/lib/utils";

interface DemoBannerProps {
  class?: string;
}

export function DemoBanner(props: DemoBannerProps) {
  return (
    <div
      class={cn(
        "rounded-lg border border-amber-500/30 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-950/50 dark:text-amber-200",
        props.class,
      )}
    >
      <p class="font-medium">
        This is a demo page.{" "}
        <span class="font-normal text-amber-700 dark:text-amber-300">
          This page contains dummy data for demonstration purposes only. Remove or replace it when
          using this boilerplate in production.
        </span>
      </p>
    </div>
  );
}
