import type { JSX } from "solid-js";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./command";
import { Dialog, DialogContent } from "./dialog";

export interface EntityCommandAction {
  id: string;
  label: string;
  onSelect: () => void;
  group?: string;
  description?: string;
  shortcut?: string;
  keywords?: string[];
  icon?: () => JSX.Element;
}

export function EntityCommandPalette(props: {
  actions: EntityCommandAction[];
  placeholder?: string;
  shortcutKey?: string;
  trigger?: () => JSX.Element;
}) {
  const [open, setOpen] = createSignal(false);
  const [search, setSearch] = createSignal("");

  const normalizedShortcut = () => (props.shortcutKey || "j").toLowerCase();

  onMount(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === normalizedShortcut()) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
  });

  const filtered = createMemo(() => {
    const query = search().trim().toLowerCase();
    if (!query) return props.actions;

    return props.actions.filter((action) => {
      const haystack = [action.label, action.description, ...(action.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  });

  const grouped = createMemo(() => {
    const map = new Map<string, EntityCommandAction[]>();
    for (const action of filtered()) {
      const group = action.group || "Actions";
      const items = map.get(group) || [];
      items.push(action);
      map.set(group, items);
    }
    return Array.from(map.entries());
  });

  return (
    <>
      {props.trigger?.()}
      <Dialog
        open={open()}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSearch("");
        }}
      >
        <DialogContent class="max-w-lg overflow-hidden border-0 p-0 shadow-2xl" hideCloseButton>
          <Command>
            <CommandInput
              placeholder={props.placeholder ?? "Search actions..."}
              value={search()}
              onInput={(event) => setSearch(event.currentTarget.value)}
              onClear={() => setSearch("")}
            />
            <CommandList>
              <CommandEmpty />
              <For each={grouped()}>
                {([groupName, actions]) => (
                  <CommandGroup heading={groupName}>
                    <For each={actions}>
                      {(action) => (
                        <CommandItem
                          keywords={action.keywords}
                          onSelect={() => {
                            action.onSelect();
                            setOpen(false);
                          }}
                        >
                          {action.icon?.()}
                          <div class="flex min-w-0 flex-1 flex-col">
                            <span class="truncate">{action.label}</span>
                            {action.description ? (
                              <span class="truncate text-xs text-muted-foreground">
                                {action.description}
                              </span>
                            ) : null}
                          </div>
                          {action.shortcut ? (
                            <CommandShortcut>{action.shortcut}</CommandShortcut>
                          ) : null}
                        </CommandItem>
                      )}
                    </For>
                  </CommandGroup>
                )}
              </For>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
