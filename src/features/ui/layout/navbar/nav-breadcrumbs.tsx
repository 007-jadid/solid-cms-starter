import { useRouterState } from "@tanstack/solid-router";
import { createMemo, For, Show } from "solid-js";
import { findBreadcrumbs, NAV_ITEMS } from "~/features/navigation/navigation.config";

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-3 text-muted-foreground/40"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export function NavBreadcrumbs() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const breadcrumbs = createMemo(() => {
    const segments = findBreadcrumbs(NAV_ITEMS, pathname());
    return segments.map((crumb, index) => ({
      label: crumb.title,
      href: crumb.href,
      isLast: index === segments.length - 1,
    }));
  });

  return (
    <nav class="hidden items-center text-[13px] lg:flex">
      <For each={breadcrumbs()}>
        {(crumb, index) => (
          <>
            <Show when={index() > 0}>
              <ChevronRightIcon />
            </Show>
            <Show
              when={!crumb.isLast}
              fallback={<span class="px-1.5 font-medium text-foreground">{crumb.label}</span>}
            >
              <a
                href={crumb.href}
                class="px-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </a>
            </Show>
          </>
        )}
      </For>
    </nav>
  );
}
