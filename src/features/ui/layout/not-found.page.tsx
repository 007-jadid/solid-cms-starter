import { Link } from "@tanstack/solid-router";
import { Button } from "../components";

export function NotFoundComponent() {
  return (
    <div class="h-screen w-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle gradient background */}
      <div
        class="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/3"
        aria-hidden="true"
      />

      {/* Floating subtle circles */}
      <div
        class="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"
        aria-hidden="true"
      />
      <div
        class="absolute bottom-1/3 left-1/3 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
        aria-hidden="true"
      />

      {/* Main content */}
      <div class="relative z-10 max-w-md w-full mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Error code */}
        <div class="mb-6">
          <div class="text-[6rem] sm:text-[8rem] font-bold leading-none tracking-tight text-primary/20 select-none">
            404
          </div>
          <div class="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider uppercase mt-2">
            Page Not Found
          </div>
        </div>

        {/* Message */}
        <div class="mb-6 space-y-2">
          <h1 class="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            Page not found
          </h1>
          <p class="text-sm text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Please check the URL or
            return home.
          </p>
        </div>

        {/* Actions */}
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button as={Link} href="/" class="w-full sm:w-auto gap-2 h-10 px-6">
            {/* House Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              class="size-4"
            >
              <path d="M224 115.55V208a16 16 0 0 1-16 16h-48a16 16 0 0 1-16-16v-48h-32v48a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-92.45a16 16 0 0 1 5.17-11.78l80-75.48l.11-.1a16 16 0 0 1 21.53 0a1 1 0 0 0 .11.1l80 75.48a16 16 0 0 1 5.08 11.78" />
            </svg>
            <span>Go Home</span>
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
            <span>Go Back</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
