import { type JSX, Show, splitProps } from "solid-js";
import { fadeIn } from "~/features/lib/gsap-directives";
import { cn } from "~/features/lib/utils";
import { PageHeader } from "./page-header";

void fadeIn;

interface PageLayoutProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: JSX.Element;
  contentClass?: string;
  children: JSX.Element;
}

/**
 * Standard Page Layout component for consistent headers and content spacing.
 * Follows SolidJS best practices for reactivity and component structure.
 */
export function PageLayout(props: PageLayoutProps) {
  const [local, others] = splitProps(props, [
    "title",
    "description",
    "actions",
    "contentClass",
    "children",
    "class",
  ]);

  return (
    <div class={cn(local.class)} {...others}>
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        use:fadeIn={{ y: 8, duration: 0.35 }}
      >
        <PageHeader title={local.title} description={local.description} />
        <Show when={local.actions}>
          <div class="flex items-center gap-2">{local.actions}</div>
        </Show>
      </div>
      <div class={cn("animate-in fade-in-0 duration-500", local.contentClass)}>
        {local.children}
      </div>
    </div>
  );
}
