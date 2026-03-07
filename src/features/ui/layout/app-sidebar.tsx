import { useRouterState } from "@tanstack/solid-router";
import { createMemo } from "solid-js";
// solid-motionone removed — GSAP handles all animations
import { useI18n } from "~/features/context/i18n";
import { usePermissions } from "~/features/context/permissions/permissions.context";
import { useSettings } from "~/features/context/settings/settings.context";
import { filterNavItems } from "~/features/navigation/navigation.config";
import { useSidebarEffects } from "./app-sidebar/effects";
import { SidebarFooter } from "./app-sidebar/footer";
import { SidebarMobileControls } from "./app-sidebar/mobile";
import { SidebarNav } from "./app-sidebar/nav";
import { getSidebarClass, getSidebarStyle } from "./app-sidebar/styles";
import { useLayout } from "./layout.context";
import { SIDEBAR_ITEMS } from "./sidebar.data";

interface AppSidebarProps {
  class?: string;
}

export function AppSidebar(props: AppSidebarProps) {
  const layout = useLayout();
  const settings = useSettings();
  const permissions = usePermissions();
  const { t } = useI18n();
  const items = createMemo(() =>
    filterNavItems(SIDEBAR_ITEMS, (permission) => permissions.can(permission)),
  );
  let navRef!: HTMLElement;
  let footerRef!: HTMLDivElement;
  let indicatorRef!: HTMLDivElement;
  let asideRef!: HTMLElement;

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useSidebarEffects({
    layout,
    pathname,
    getNavRef: () => navRef,
    getIndicatorRef: () => indicatorRef,
    getAsideRef: () => asideRef,
    getFooterRef: () => footerRef,
  });

  return (
    <>
      <SidebarMobileControls
        mobileOpen={layout.state.sidebarMobileOpen}
        onClose={() => layout.setMobileSidebarOpen(false)}
        t={t}
      />

      {/* Sidebar */}
      <aside
        ref={asideRef}
        style={getSidebarStyle(layout.state)}
        class={getSidebarClass(settings.state.themeVariant, props.class)}
        data-mobile-open={layout.state.sidebarMobileOpen}
        data-collapsed={layout.state.sidebarCollapsed}
      >
        <SidebarNav
          items={items()}
          isMobile={layout.state.isMobile}
          isCollapsed={layout.state.sidebarCollapsed}
          setNavRef={(el) => {
            navRef = el;
          }}
          setIndicatorRef={(el) => {
            indicatorRef = el;
          }}
        />

        <SidebarFooter
          ref={footerRef}
          isMobile={layout.state.isMobile}
          isCollapsed={layout.state.sidebarCollapsed}
          onToggleSidebar={() => layout.toggleSidebar()}
          t={t}
        />
      </aside>
    </>
  );
}
