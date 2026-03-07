import type { Component, ComponentProps, JSX } from "solid-js";
import { createEffect, createSignal, on, onCleanup, Show, splitProps } from "solid-js";
import { cn } from "~/features/lib/utils";

// Types
interface CommandContextValue {
  search: () => string;
  setSearch: (value: string) => void;
  selectedIndex: () => number;
  setSelectedIndex: (index: number) => void;
  itemCount: () => number;
  registerItem: () => number;
  unregisterItem: (index: number) => void;
  onSelect: (index: number) => void;
  registerCallback: (index: number, callback: () => void) => void;
}

// Simple context using closure
let commandContext: CommandContextValue | null = null;

// Command Root
type CommandProps = ComponentProps<"div"> & {
  class?: string;
  children?: JSX.Element;
};

const Command: Component<CommandProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  const [search, setSearch] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [itemCount, setItemCount] = createSignal(0);
  const callbacks = new Map<number, () => void>();

  const registerItem = () => {
    const index = itemCount();
    setItemCount(index + 1);
    return index;
  };

  const unregisterItem = (_index: number) => {
    setItemCount((c) => Math.max(0, c - 1));
  };

  const registerCallback = (index: number, callback: () => void) => {
    callbacks.set(index, callback);
  };

  const onSelect = (index: number) => {
    const callback = callbacks.get(index);
    callback?.();
  };

  commandContext = {
    search,
    setSearch,
    selectedIndex,
    setSelectedIndex,
    itemCount,
    registerItem,
    unregisterItem,
    onSelect,
    registerCallback,
  };

  // Reset selection when search changes
  createEffect(
    on(search, () => {
      setSelectedIndex(0);
    }),
  );

  onCleanup(() => {
    commandContext = null;
    callbacks.clear();
  });

  return (
    <div
      class={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover/95 backdrop-blur-xl text-popover-foreground",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

// Command Input
type CommandInputProps = ComponentProps<"input"> & {
  class?: string;
  placeholder?: string;
  onClear?: () => void;
};

const CommandInput: Component<CommandInputProps> = (props) => {
  // Extract value/onInput/onKeyDown/onClear so they don't collide with internal handlers
  const [local, others] = splitProps(props, [
    "class",
    "placeholder",
    "value",
    "onInput",
    "onKeyDown",
    "onClear",
  ]);
  const [focused, setFocused] = createSignal(false);
  let inputRef: HTMLInputElement | undefined;

  // Auto focus — defer to next frame so submenu/popover open animations
  // don't steal focus back from the trigger after mount
  createEffect(() => {
    const id = requestAnimationFrame(() => inputRef?.focus());
    onCleanup(() => cancelAnimationFrame(id));
  });

  const value = () =>
    local.value !== undefined ? (local.value as string) : (commandContext?.search() ?? "");

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    if (local.onInput) {
      (local.onInput as (e: InputEvent & { currentTarget: HTMLInputElement }) => void)(e);
    } else {
      commandContext?.setSearch(e.currentTarget.value);
    }
  };

  // Handle navigation keys directly on the input (the focused element).
  // Kobalte's overlays may intercept events at higher DOM levels, so we handle
  // them here and stopPropagation to avoid conflicts with menu keyboard handling.
  const handleKeyDown = (e: KeyboardEvent) => {
    const ctx = commandContext;
    if (ctx) {
      const count = ctx.itemCount();
      switch (e.key) {
        case "ArrowDown":
          if (count > 0) {
            e.preventDefault();
            e.stopPropagation();
            ctx.setSelectedIndex((ctx.selectedIndex() + 1) % count);
          }
          break;
        case "ArrowUp":
          if (count > 0) {
            e.preventDefault();
            e.stopPropagation();
            ctx.setSelectedIndex((ctx.selectedIndex() - 1 + count) % count);
          }
          break;
        case "Enter":
          if (count > 0) {
            e.preventDefault();
            e.stopPropagation();
            ctx.onSelect(ctx.selectedIndex());
          }
          break;
        // Escape: don't handle here — let it bubble so Kobalte closes the overlay
      }
    }
    (local.onKeyDown as ((e: KeyboardEvent) => void) | undefined)?.(e);
  };

  const handleClear = () => {
    // Imperatively clear the DOM input immediately so the user sees the change
    // even before SolidJS's reactive system flushes the effect.
    if (inputRef) inputRef.value = "";
    if (local.onClear) {
      local.onClear();
    } else {
      commandContext?.setSearch("");
    }
    inputRef?.focus();
  };

  return (
    <div
      class={cn(
        "flex w-full items-center gap-2 border border-transparent border-b-border/40 bg-transparent px-3 text-sm",
        "h-12 py-3",
        local.class,
      )}
      style={
        focused() ? { "border-bottom-color": "oklch(from var(--ring) l c h / 0.5)" } : undefined
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4 shrink-0 text-muted-foreground/50"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        ref={inputRef}
        class="flex-1 bg-transparent text-sm outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
        style={{ "box-shadow": "none", outline: "none" }}
        placeholder={local.placeholder ?? "Type a command or search..."}
        value={value()}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...others}
      />
      <Show when={value().length > 0}>
        <button
          type="button"
          tabIndex={-1}
          class="flex shrink-0 items-center justify-center rounded text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          onMouseDown={(e) => {
            e.preventDefault(); // keep focus on input
            handleClear();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </Show>
    </div>
  );
};

// Command List
type CommandListProps = ComponentProps<"div"> & {
  class?: string;
};

const CommandList: Component<CommandListProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "max-h-80 overflow-y-auto overflow-x-hidden border-t border-border/40 p-2 scrollbar-none",
        local.class,
      )}
      {...others}
    />
  );
};

// Command Empty - only shows when there's a search query and no items
type CommandEmptyProps = ComponentProps<"div"> & {
  class?: string;
};

const CommandEmpty: Component<CommandEmptyProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  // Only show when there's a search term and no items
  const shouldShow = () => {
    if (!commandContext) return false;
    const hasSearch = commandContext.search().trim().length > 0;
    const hasNoItems = commandContext.itemCount() === 0;
    return hasSearch && hasNoItems;
  };

  return (
    <Show when={shouldShow()}>
      <div
        class={cn("flex flex-col items-center justify-center gap-3 py-10 text-center", local.class)}
        {...others}
      >
        <div class="rounded-full bg-muted/50 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-6 text-muted-foreground/50"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <p class="text-sm text-muted-foreground/70">No results found</p>
      </div>
    </Show>
  );
};

// Command Group
type CommandGroupProps = ComponentProps<"div"> & {
  class?: string;
  heading?: string;
};

const CommandGroup: Component<CommandGroupProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "heading", "children"]);
  return (
    <div class={cn("py-1", local.class)} {...others}>
      <Show when={local.heading}>
        <div class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          {local.heading}
        </div>
      </Show>
      <div class="space-y-0.5">{local.children}</div>
    </div>
  );
};

// Command Item
type CommandItemProps = ComponentProps<"div"> & {
  class?: string;
  onSelect?: () => void;
  disabled?: boolean;
  keywords?: string[];
};

const CommandItem: Component<CommandItemProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "onSelect",
    "disabled",
    "children",
    "keywords",
  ]);

  const [itemIndex, setItemIndex] = createSignal(-1);
  let itemRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (commandContext && itemIndex() === -1) {
      const index = commandContext.registerItem();
      setItemIndex(index);
      if (local.onSelect) {
        commandContext.registerCallback(index, local.onSelect);
      }
    }
  });

  onCleanup(() => {
    if (commandContext && itemIndex() !== -1) {
      commandContext.unregisterItem(itemIndex());
    }
  });

  const isSelected = () =>
    commandContext ? commandContext.selectedIndex() === itemIndex() : false;

  // Scroll into view when selected
  createEffect(() => {
    if (isSelected() && itemRef) {
      itemRef.scrollIntoView({ block: "nearest" });
    }
  });

  return (
    <div
      ref={itemRef}
      role="option"
      tabIndex={local.disabled ? undefined : -1}
      aria-selected={isSelected()}
      class={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isSelected() && "bg-accent text-accent-foreground",
        local.disabled && "pointer-events-none opacity-50",
        local.class,
      )}
      onClick={() => !local.disabled && local.onSelect?.()}
      onKeyDown={(e) => {
        if (local.disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          local.onSelect?.();
        }
      }}
      onMouseEnter={() => {
        if (commandContext && itemIndex() !== -1) {
          commandContext.setSelectedIndex(itemIndex());
        }
      }}
      data-disabled={local.disabled ? "" : undefined}
      {...others}
    >
      {local.children}
    </div>
  );
};

// Command Separator
type CommandSeparatorProps = ComponentProps<"div"> & {
  class?: string;
};

const CommandSeparator: Component<CommandSeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("-mx-2 my-2 h-px bg-border/50", local.class)} {...others} />;
};

// Command Shortcut
type CommandShortcutProps = ComponentProps<"span"> & {
  class?: string;
};

const CommandShortcut: Component<CommandShortcutProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      class={cn(
        "ml-auto flex items-center gap-1 text-[11px] tracking-widest text-muted-foreground",
        local.class,
      )}
      {...others}
    />
  );
};

// Keyboard key display
type KbdProps = ComponentProps<"kbd"> & {
  class?: string;
};

const Kbd: Component<KbdProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <kbd
      class={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted/50 px-1 font-mono text-[10px] font-medium",
        local.class,
      )}
      {...others}
    />
  );
};

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Kbd,
};
