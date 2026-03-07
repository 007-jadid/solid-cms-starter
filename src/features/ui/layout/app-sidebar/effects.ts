import { createEffect, on, onCleanup, onMount } from "solid-js";
import { EASE_OUT_EXPO, gsap } from "~/features/lib/gsap";

interface SidebarLayoutState {
  state: {
    isMobile: boolean;
    sidebarCollapsed: boolean;
    sidebarMobileOpen: boolean;
  };
}

interface UseSidebarEffectsParams {
  layout: SidebarLayoutState;
  pathname: () => string;
  getNavRef: () => HTMLElement | undefined;
  getIndicatorRef: () => HTMLDivElement | undefined;
  getAsideRef: () => HTMLElement | undefined;
  getFooterRef: () => HTMLDivElement | undefined;
}

export function useSidebarEffects(params: UseSidebarEffectsParams) {
  const moveIndicator = () => {
    const navRef = params.getNavRef();
    const indicatorRef = params.getIndicatorRef();
    if (!navRef || !indicatorRef) return;

    if (params.layout.state.sidebarCollapsed && !params.layout.state.isMobile) {
      gsap.to(indicatorRef, { opacity: 0, duration: 0.2 });
      return;
    }

    const activeEl = navRef.querySelector<HTMLElement>(`[data-nav-active="true"]`);
    if (activeEl) {
      const navRect = navRef.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      const barHeight = elRect.height * 0.6;
      const yOffset = elRect.top - navRect.top + navRef.scrollTop + (elRect.height - barHeight) / 2;
      gsap.to(indicatorRef, {
        y: yOffset,
        height: barHeight,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    } else {
      gsap.to(indicatorRef, { opacity: 0, duration: 0.2 });
    }
  };

  createEffect(
    on(params.pathname, () => {
      requestAnimationFrame(moveIndicator);
    }),
  );

  createEffect(
    on(
      () => params.layout.state.sidebarMobileOpen,
      (open) => {
        const asideRef = params.getAsideRef();
        if (!params.layout.state.isMobile || !asideRef) return;
        gsap.to(asideRef, {
          x: open ? 0 : "-100%",
          duration: 0.4,
          ease: open ? EASE_OUT_EXPO : "power2.inOut",
        });
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => params.layout.state.isMobile,
      (isMobile) => {
        const asideRef = params.getAsideRef();
        if (!asideRef) return;
        if (isMobile) {
          gsap.set(asideRef, {
            x: params.layout.state.sidebarMobileOpen ? 0 : "-100%",
          });
        } else {
          gsap.set(asideRef, { x: 0 });
        }
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => params.layout.state.sidebarCollapsed,
      (collapsed) => {
        if (params.layout.state.isMobile) return;
        const indicatorRef = params.getIndicatorRef();
        if (!indicatorRef) return;
        if (collapsed) {
          gsap.to(indicatorRef, { opacity: 0, duration: 0.25 });
        } else {
          setTimeout(moveIndicator, 500);
        }
      },
      { defer: true },
    ),
  );

  onMount(() => {
    const footerRef = params.getFooterRef();
    if (footerRef) {
      gsap.fromTo(
        footerRef,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: EASE_OUT_EXPO, delay: 0.5 },
      );
    }
    setTimeout(moveIndicator, 600);

    // Reposition indicator when collapsibles open/close
    const navRef = params.getNavRef();
    if (navRef) {
      let rafId: number | undefined;
      const observer = new MutationObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          // Delay slightly to let collapsible animation settle
          setTimeout(moveIndicator, 250);
        });
      });
      observer.observe(navRef, {
        subtree: true,
        attributes: true,
        attributeFilter: ["data-expanded", "data-closed"],
      });
      onCleanup(() => observer.disconnect());
    }
  });
}
