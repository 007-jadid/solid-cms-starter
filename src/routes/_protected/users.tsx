import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/solid-router";
import { createMemo, Show } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import { fadeIn } from "~/features/lib/gsap-directives";
import { Button } from "~/features/ui/components/button";
import { DemoBanner } from "~/features/ui/components/demo-banner";
import { Resizable, ResizableHandle, ResizablePanel } from "~/features/ui/components/resizable";
import { PageLayout } from "~/features/ui/layout";
import { useLayout } from "~/features/ui/layout/layout.context";
import { UsersList } from "~/features/users/users-list";

void fadeIn;

export const Route = createFileRoute("/_protected/users")({
  component: UsersLayout,
});

function UsersLayout() {
  const { t } = useI18n();
  const layout = useLayout();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const hasDetailPanel = createMemo(() => {
    const p = pathname();
    return p !== "/users" && p !== "/users/";
  });

  const activeUserId = createMemo(() => {
    const p = pathname();
    const match = p.match(/^\/users\/([^/]+)$/);
    return match && match[1] !== "create" ? match[1] : null;
  });

  return (
    <PageLayout
      class="space-y-4 p-6"
      title={t("users.title")}
      description={t("users.description")}
      actions={
        <Show when={!hasDetailPanel()}>
          <Link to="/users/create">
            <Button size="sm">{t("users.createUser")}</Button>
          </Link>
        </Show>
      }
    >
      <DemoBanner />

      {/* Mobile: show only list or only detail */}
      <Show when={layout.state.isMobile}>
        <Show when={hasDetailPanel()} fallback={<UsersList />}>
          <Outlet />
        </Show>
      </Show>

      {/* Desktop */}
      <Show when={!layout.state.isMobile}>
        <Show
          when={hasDetailPanel()}
          fallback={
            <div use:fadeIn>
              <UsersList />
            </div>
          }
        >
          <div use:fadeIn class="h-[calc(100vh-12rem)]">
            <Resizable class="h-full rounded-lg border">
              <ResizablePanel initialSize={0.45} minSize={0.3} maxSize={0.6}>
                <div class="h-full overflow-y-auto p-4">
                  <div class="mb-3 flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-muted-foreground">{t("users.title")}</h3>
                    <Link to="/users/create">
                      <Button size="sm" variant="outline" class="h-7 text-xs">
                        {t("users.createUser")}
                      </Button>
                    </Link>
                  </div>
                  <UsersList compact activeUserId={activeUserId()} />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel initialSize={0.55} minSize={0.35} maxSize={0.7}>
                <div class="h-full overflow-y-auto p-6">
                  <Outlet />
                </div>
              </ResizablePanel>
            </Resizable>
          </div>
        </Show>
      </Show>
    </PageLayout>
  );
}
