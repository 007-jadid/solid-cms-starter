import * as DialogPrimitive from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { onCleanup, onMount, Show, splitProps } from "solid-js";

import { gsap } from "~/features/lib/gsap";
import { cn } from "~/features/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal: Component<DialogPrimitive.DialogPortalProps> = (props) => {
  const [, rest] = splitProps(props, ["children"]);
  return (
    <DialogPrimitive.Portal {...rest}>
      <div class="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
        {props.children}
      </div>
    </DialogPrimitive.Portal>
  );
};

type DialogOverlayProps<T extends ValidComponent = "div"> =
  DialogPrimitive.DialogOverlayProps<T> & { class?: string | undefined };

const DialogOverlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogOverlayProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogOverlayProps, ["class"]);
  let overlayRef: HTMLElement | null = null;

  onMount(() => {
    if (!(overlayRef instanceof HTMLElement)) return;
    gsap.fromTo(
      overlayRef,
      { opacity: 0, backdropFilter: "blur(0px)" },
      {
        opacity: 1,
        backdropFilter: "blur(4px)",
        duration: 0.28,
        ease: "power3.out",
        overwrite: "auto",
      },
    );
    onCleanup(() => {
      gsap.killTweensOf(overlayRef);
    });
  });

  return (
    <DialogPrimitive.Overlay
      ref={(el) => {
        overlayRef = el instanceof HTMLElement ? el : null;
      }}
      class={cn(
        "fixed inset-0 z-50 bg-background/58 backdrop-blur-xs transition-[opacity,backdrop-filter] data-expanded:opacity-100 data-closed:opacity-0 data-expanded:backdrop-blur-sm data-closed:backdrop-blur-none data-expanded:duration-320 data-closed:duration-180 data-expanded:ease-[cubic-bezier(0.2,0.9,0.2,1)] data-closed:ease-out",
        props.class,
      )}
      {...rest}
    />
  );
};

type DialogContentProps<T extends ValidComponent = "div"> =
  DialogPrimitive.DialogContentProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
    hideCloseButton?: boolean;
  };

const DialogContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogContentProps<T>>,
) => {
  const [local, rest] = splitProps(props as DialogContentProps, [
    "class",
    "children",
    "hideCloseButton",
  ]);
  let contentRef: HTMLElement | null = null;

  onMount(() => {
    if (!(contentRef instanceof HTMLElement)) return;
    gsap.fromTo(
      contentRef,
      { opacity: 0, filter: "blur(6px)" },
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.36,
        ease: "power3.out",
        overwrite: "auto",
        clearProps: "filter",
      },
    );
    onCleanup(() => {
      gsap.killTweensOf(contentRef);
    });
  });

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={(el) => {
          contentRef = el instanceof HTMLElement ? el : null;
        }}
        class={cn(
          "fixed left-1/2 top-1/2 z-50 grid max-h-screen w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto",
          "glass-panel p-6",
          "transition-[opacity,transform,filter] data-expanded:opacity-100 data-closed:opacity-0 data-expanded:scale-100 data-closed:scale-[0.98] data-expanded:-translate-y-1/2 data-closed:-translate-y-[49.5%] data-expanded:blur-none data-closed:blur-[1px] data-expanded:duration-360 data-closed:duration-200 data-expanded:ease-[cubic-bezier(0.2,0.9,0.2,1)] data-closed:ease-out",
          "rounded-xl",
          local.class,
        )}
        {...rest}
      >
        {local.children}
        <Show when={!local.hideCloseButton}>
          <DialogPrimitive.CloseButton class="absolute right-4 top-4 rounded-lg p-1 opacity-60 ring-offset-background transition-all hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
            <span class="sr-only">Close</span>
          </DialogPrimitive.CloseButton>
        </Show>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};

const DialogHeader: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <div class={cn("flex flex-col space-y-1.5 text-center sm:text-left", props.class)} {...rest} />
  );
};

const DialogFooter: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <div
      class={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", props.class)}
      {...rest}
    />
  );
};

type DialogTitleProps<T extends ValidComponent = "h2"> = DialogPrimitive.DialogTitleProps<T> & {
  class?: string | undefined;
};

const DialogTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, DialogTitleProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogTitleProps, ["class"]);
  return (
    <DialogPrimitive.Title
      class={cn("text-lg font-semibold leading-none tracking-tight", props.class)}
      {...rest}
    />
  );
};

type DialogDescriptionProps<T extends ValidComponent = "p"> =
  DialogPrimitive.DialogDescriptionProps<T> & {
    class?: string | undefined;
  };

const DialogDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, DialogDescriptionProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogDescriptionProps, ["class"]);
  return (
    <DialogPrimitive.Description
      class={cn("text-sm text-muted-foreground", props.class)}
      {...rest}
    />
  );
};

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
