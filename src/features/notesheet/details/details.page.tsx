import { lazy, Suspense } from "solid-js";
import { fadeIn, staggerChildren } from "~/features/lib/gsap-directives";
import { PageLayout } from "~/features/ui";

void fadeIn;
void staggerChildren;

const NotesheetContent = lazy(() => {
  return import("./form-items-virtual");
});

export default function NotesheetDetailsPage() {
  return (
    <PageLayout
      title="Notesheet Details"
      description="Notesheet Details"
      class="p-5"
      contentClass="mt-10 border rounded-lg p-5 shadow-sm"
    >
      <div class="space-y-4" use:staggerChildren={{ stagger: 0.05, y: 8, duration: 0.22 }}>
        <Suspense
          fallback={
            <div class="space-y-3" use:fadeIn={{ y: 8, duration: 0.22 }}>
              <div class="h-4 w-40 rounded bg-muted animate-pulse" />
              <div class="h-32 w-full rounded bg-muted animate-pulse" />
            </div>
          }
        >
          <div use:fadeIn={{ y: 8, duration: 0.22 }}>
            <NotesheetContent />
          </div>
        </Suspense>
      </div>
    </PageLayout>
  );
}
