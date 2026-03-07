import { createFileRoute, Link, useRouter } from "@tanstack/solid-router";
import { Show } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import { Button } from "~/features/ui/components/button";

export const Route = createFileRoute("/error")({
  component: ErrorPage,
});

function ErrorPage() {
  const router = useRouter();
  const { t } = useI18n();
  // Get error from router state if available
  const error = (router.state as { error?: unknown })?.error;

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div class="h-screen w-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle gradient background with destructive tint */}
      <div
        class="absolute inset-0 bg-linear-to-br from-destructive/5 via-transparent to-destructive/3"
        aria-hidden="true"
      />

      {/* Floating subtle circles */}
      <div
        class="absolute top-1/4 right-1/4 w-64 h-64 bg-destructive/5 rounded-full blur-3xl animate-pulse"
        aria-hidden="true"
      />
      <div
        class="absolute bottom-1/3 left-1/3 w-96 h-96 bg-destructive/3 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
        aria-hidden="true"
      />

      {/* Main content */}
      <div class="relative z-10 max-w-2xl w-full mx-auto px-6 py-4 sm:py-8 max-h-screen overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="text-center mb-6">
          {/* Error icon */}
          <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-destructive/10 mb-4 sm:mb-6">
            {/* Warning Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              class="size-6 sm:size-8 text-destructive"
            >
              <path d="M236.8 188.09L149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19a23.51 23.51 0 0 0 .02-23.72M120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12a12 12 0 0 1-12 12" />
            </svg>
          </div>

          {/* Error title */}
          <h1 class="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-2">
            {t("errors.somethingWrong")}
          </h1>
          {/* Error message */}
          <p class="text-sm text-muted-foreground">{t("errors.errorDescription")}</p>
        </div>

        {/* Error details card */}
        <Show when={error}>
          <div class="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div class="text-sm text-foreground font-medium mb-2">{t("errors.errorDetails")}</div>
            <p class="text-sm text-muted-foreground leading-relaxed">{String(error)}</p>
          </div>
        </Show>

        {/* Actions */}
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={handleRetry} class="w-full sm:w-auto gap-2 h-10 px-6">
            {/* Arrow Clockwise Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              class="size-4"
            >
              <path d="M240 56v48a8 8 0 0 1-8 8h-48a8 8 0 0 1 0-16h27.4l-26.59-24.36a80 80 0 1 0 1.67 114.06a8 8 0 0 1 11 11.54A96 96 0 1 1 175.16 80.6L208 110.37V56a8 8 0 0 1 16 0Z" />
            </svg>
            <span>{t("errors.tryAgain")}</span>
          </Button>
          <Button
            variant="secondary"
            class="w-full sm:w-auto gap-2 h-10 px-6"
            onClick={() => window.history.back()}
          >
            {/* Arrow Left Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              class="size-4"
            >
              <path d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8" />
            </svg>
            <span>{t("errors.goBack")}</span>
          </Button>
          <Button as={Link} href="/" variant="secondary" class="w-full sm:w-auto gap-2 h-10 px-6">
            {/* House Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              class="size-4"
            >
              <path d="M224 115.55V208a16 16 0 0 1-16 16h-48a16 16 0 0 1-16-16v-48h-32v48a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-92.45a16 16 0 0 1 5.17-11.78l80-75.48l.11-.1a16 16 0 0 1 21.53 0a1 1 0 0 0 .11.1l80 75.48a16 16 0 0 1 5.08 11.78" />
            </svg>
            <span>{t("errors.goHome")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
