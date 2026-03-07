import { type JSX, Show } from "solid-js";

/**
 * Section component for grouping form fields with optional title and description.
 * Renders as a card with header and body for visual structure.
 */
export function Section(props: {
  title: string;
  description?: string;
  columns?: number;
  children: JSX.Element;
}) {
  return (
    <div class="rounded-lg border bg-card text-card-foreground shadow-xs">
      <Show when={props.title || props.description}>
        <div class="border-b px-6 py-4">
          <Show when={props.title}>
            <h3 class="text-sm font-semibold tracking-tight">{props.title}</h3>
          </Show>
          <Show when={props.description}>
            <p class="mt-0.5 text-xs text-muted-foreground">{props.description}</p>
          </Show>
        </div>
      </Show>
      <div
        class="grid gap-4 px-6 py-5"
        style={{
          "grid-template-columns": `repeat(${props.columns || 1}, minmax(0, 1fr))`,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

/**
 * Row component for horizontal field layout.
 */
export function Row(props: { children: JSX.Element }) {
  return <div class="grid gap-4 md:grid-cols-2">{props.children}</div>;
}
