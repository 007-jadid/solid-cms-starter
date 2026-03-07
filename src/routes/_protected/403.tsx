import { createFileRoute, Link } from "@tanstack/solid-router";
import { useI18n } from "~/features/context/i18n";
import { fadeIn, scaleIn } from "~/features/lib/gsap-directives";
import { Button } from "~/features/ui/components/button";

void fadeIn;
void scaleIn;

export const Route = createFileRoute("/_protected/403")({
  component: ForbiddenPage,
});

function ForbiddenPage() {
  const { t } = useI18n();

  return (
    <div class="flex min-h-[60vh] flex-col items-center justify-center" use:fadeIn>
      <div class="text-center">
        <h1
          class="text-9xl font-bold text-muted-foreground/30"
          use:scaleIn={{ delay: 0.1, scale: 0.9 }}
        >
          403
        </h1>
        <h2 class="mt-4 text-2xl font-semibold" use:fadeIn={{ delay: 0.2 }}>
          {t("forbidden.heading")}
        </h2>
        <p class="mt-2 text-muted-foreground" use:fadeIn={{ delay: 0.3, y: 8 }}>
          {t("forbidden.description")}
        </p>
        <div class="mt-8 flex gap-4 justify-center" use:fadeIn={{ delay: 0.4 }}>
          <Button as={Link} href="/dashboard" variant="default">
            {t("errors.goToDashboard")}
          </Button>
          <Button as={Link} href="/" variant="outline">
            {t("errors.goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
