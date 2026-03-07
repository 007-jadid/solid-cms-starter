import { type JSX, onCleanup, onMount } from "solid-js";
import { CSS_EASE_OUT_EXPO, gsap } from "~/features/lib/gsap";
import { AppNavbar } from "./app.navbar";
import { AppSidebar } from "./app-sidebar";
import { LayoutProvider, useLayout } from "./layout.context";

interface AppLayoutContentProps {
  children: JSX.Element;
  forceCollapsedSidebar?: boolean;
}

function AppLayoutContent(props: AppLayoutContentProps) {
  const layout = useLayout();

  // Slow floating animation on decorative blobs
  onMount(() => {
    const blobs = document.querySelectorAll<HTMLElement>("[data-blob]");
    const tweens = Array.from(blobs).map((blob, i) =>
      gsap.to(blob, {
        y: `+=${15 + i * 5}`,
        x: `+=${10 - i * 7}`,
        duration: 8 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }),
    );
    onCleanup(() =>
      tweens.forEach((t) => {
        t.kill();
      }),
    );
  });

  return (
    <div class="min-h-screen bg-background text-foreground">
      {/* Subtle decorative background elements */}
      <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          data-blob
          class="absolute -top-[20%] -left-[10%] size-[50%] rounded-full bg-primary/3 blur-[100px]"
        />
        <div
          data-blob
          class="absolute top-[30%] -right-[15%] size-[40%] rounded-full bg-primary/5 blur-[120px]"
        />
        <div
          data-blob
          class="absolute -bottom-[10%] left-[30%] size-[35%] rounded-full bg-primary/2 blur-[80px]"
        />
      </div>

      <div class="relative z-10">
        <AppNavbar forceCollapsedSidebar={props.forceCollapsedSidebar} />
        <AppSidebar />
        <main
          style={{
            "margin-left": layout.state.isMobile
              ? "0px"
              : layout.state.sidebarCollapsed
                ? "4rem"
                : "14rem",
            transition: layout.state.isMobile ? "none" : `margin-left 0.45s ${CSS_EASE_OUT_EXPO}`,
          }}
          class="min-h-[calc(100vh-3.5rem)] overflow-x-hidden"
        >
          {props.children}
        </main>
      </div>
    </div>
  );
}

interface AppLayoutProps {
  children: JSX.Element;
  forceCollapsedSidebar?: boolean;
}

export function AppLayout(props: AppLayoutProps) {
  return (
    <LayoutProvider forceCollapsedSidebar={props.forceCollapsedSidebar}>
      <AppLayoutContent forceCollapsedSidebar={props.forceCollapsedSidebar}>
        {props.children}
      </AppLayoutContent>
    </LayoutProvider>
  );
}
