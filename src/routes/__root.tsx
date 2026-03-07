import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useRouterState,
} from "@tanstack/solid-router";
import { createEffect, createSignal, ErrorBoundary, lazy, on, onCleanup, Show } from "solid-js";
import { useAuth } from "~/features/context/auth/auth.context";
import { useI18n } from "~/features/context/i18n";
import { OnboardingModal } from "~/features/ui/components/onboarding-modal";
import { Toaster } from "~/features/ui/components/sonner";
import { ErrorComponent } from "~/features/ui/layout/error.page";
import { NotFoundComponent } from "~/features/ui/layout/not-found.page";

/** Typed context available to every route's beforeLoad / loader. */
export interface RouterContext {
  auth: {
    isAuthenticated: () => boolean;
  };
}

// Lazy load devtools to avoid module-level signal issues
const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/solid-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : () => null;

export const Route = createRootRouteWithContext<RouterContext>()({
  shellComponent: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function GlobalGlassBackground() {
  return (
    <div class="ios-glass-background" role="presentation">
      <div class="ios-glass-mesh" />
      <div class="ios-glass-orb ios-glass-orb-primary" />
      <div class="ios-glass-orb ios-glass-orb-accent" />
      <div class="ios-glass-orb ios-glass-orb-secondary" />
      <div class="ios-glass-noise" />
    </div>
  );
}

function RootComponent() {
  const auth = useAuth();

  // Fade out the static HTML loader once auth is resolved.
  // No defer — if initialized is already true on first render (e.g. no stored
  // token), the effect must run immediately so the loader gets removed.
  // Double rAF ensures the transition property is painted before opacity changes.
  createEffect(
    on(
      () => auth.state.initialized,
      (initialized) => {
        if (!initialized) return;
        const loader = document.getElementById("initial-loader");
        if (loader) {
          requestAnimationFrame(() => {
            loader.style.transition = "opacity 0.4s ease";
            requestAnimationFrame(() => {
              loader.style.opacity = "0";
              setTimeout(() => loader.remove(), 400);
            });
          });
        }
      },
    ),
  );

  return (
    <>
      <HeadContent />
      <GlobalGlassBackground />
      <div class="relative z-10">
        <Show when={auth.state.initialized}>
          <RouteLoadingIndicator />
          <ErrorBoundary fallback={(err, reset) => <ErrorComponent error={err} reset={reset} />}>
            <Outlet />
          </ErrorBoundary>
        </Show>
      </div>
      <OnboardingModal />
      <Toaster />
      <Show when={import.meta.env.DEV}>
        <TanStackRouterDevtools />
      </Show>
    </>
  );
}

function RouteLoadingIndicator() {
  const routerState = useRouterState({ select: (s) => s.isLoading });
  const { t } = useI18n();
  const [barVisible, setBarVisible] = createSignal(false);
  const [hintVisible, setHintVisible] = createSignal(false);
  let barTimer: ReturnType<typeof setTimeout> | null = null;
  let hintTimer: ReturnType<typeof setTimeout> | null = null;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  createEffect(() => {
    if (routerState()) {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      // Phase 1 — top bar after 150 ms
      barTimer = setTimeout(() => setBarVisible(true), 150);
      // Phase 2 — floating spinner badge after 2 s if still loading
      hintTimer = setTimeout(() => setHintVisible(true), 2000);
    } else {
      if (barTimer) {
        clearTimeout(barTimer);
        barTimer = null;
      }
      if (hintTimer) {
        clearTimeout(hintTimer);
        hintTimer = null;
      }
      setHintVisible(false);
      // Brief hold so the bar doesn't snap off mid-sweep for fast navigation
      if (barVisible()) hideTimer = setTimeout(() => setBarVisible(false), 300);
    }
  });

  onCleanup(() => {
    if (barTimer) clearTimeout(barTimer);
    if (hintTimer) clearTimeout(hintTimer);
    if (hideTimer) clearTimeout(hideTimer);
  });

  return (
    <>
      {/* Phase 1: sweeping top bar */}
      <Show when={barVisible()}>
        <div class="fixed inset-x-0 top-0 z-9998 h-1 overflow-hidden pointer-events-none bg-primary/20">
          <div class="absolute h-full w-[40%] bg-linear-to-r from-transparent via-primary to-transparent animate-route-bar shadow-[0_0_8px_var(--color-primary)]" />
        </div>
      </Show>

      {/* Phase 2: floating spinner badge for slow loads */}
      <Show when={hintVisible()}>
        <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-9998 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div class="flex items-center gap-2.5 rounded-full border border-border bg-background/90 px-4 py-2 shadow-md backdrop-blur-sm">
            <div class="size-3.5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <span class="text-xs font-medium text-muted-foreground">{t("errors.loading")}</span>
          </div>
        </div>
      </Show>
    </>
  );
}
