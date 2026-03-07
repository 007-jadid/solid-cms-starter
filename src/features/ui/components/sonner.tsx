import type { Component, ComponentProps, JSX } from "solid-js";

import { Toaster as Sonner, toast } from "solid-sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

// Icon components for toast types
const CheckCircleIcon = (props: { class?: string }): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="currentColor"
    class={props.class}
  >
    <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32" />
  </svg>
);

const InfoIcon = (props: { class?: string }): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="currentColor"
    class={props.class}
  >
    <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m-4 48a12 12 0 1 1-12 12a12 12 0 0 1 12-12m12 112a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 0 16" />
  </svg>
);

const WarningIcon = (props: { class?: string }): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="currentColor"
    class={props.class}
  >
    <path d="M236.8 188.09L149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19a23.51 23.51 0 0 0 .02-23.72M120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12a12 12 0 0 1-12 12" />
  </svg>
);

const XCircleIcon = (props: { class?: string }): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="currentColor"
    class={props.class}
  >
    <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m37.66 130.34a8 8 0 0 1-11.32 11.32L128 139.31l-26.34 26.35a8 8 0 0 1-11.32-11.32L116.69 128l-26.35-26.34a8 8 0 0 1 11.32-11.32L128 116.69l26.34-26.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
  </svg>
);

const SpinnerIcon = (props: { class?: string }): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="currentColor"
    class={props.class}
  >
    <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 176a72 72 0 1 1 72-72a72.08 72.08 0 0 1-72 72" />
  </svg>
);

const Toaster: Component<ToasterProps> = (props) => {
  return (
    <Sonner
      class="toaster group"
      icons={{
        success: <CheckCircleIcon class="size-4" />,
        info: <InfoIcon class="size-4" />,
        warning: <WarningIcon class="size-4" />,
        error: <XCircleIcon class="size-4" />,
        loading: <SpinnerIcon class="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      }}
      toastOptions={{
        classes: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

/**
 * Toast notification utilities
 *
 * Usage:
 * ```tsx
 * import { toast } from "~/features/ui/components/sonner"
 *
 * // Success toast
 * toast.success("Changes saved successfully!")
 *
 * // Error toast
 * toast.error("Something went wrong")
 *
 * // Info toast
 * toast.info("New update available")
 *
 * // Warning toast
 * toast.warning("Please review before submitting")
 *
 * // Loading toast with promise
 * toast.promise(fetchData(), {
 *   loading: "Loading...",
 *   success: "Data loaded!",
 *   error: "Failed to load data"
 * })
 *
 * // Toast with description
 * toast.success("User created", {
 *   description: "The user has been added to the system"
 * })
 *
 * // Toast with action
 * toast.error("Failed to save", {
 *   action: {
 *     label: "Retry",
 *     onClick: () => retry()
 *   }
 * })
 *
 * // Dismiss toast
 * const toastId = toast.success("Saved!")
 * toast.dismiss(toastId)
 * ```
 */

// Danger is an alias for error (commonly used in some UI libraries)
const danger = toast.error;

export { Toaster, toast, danger };
