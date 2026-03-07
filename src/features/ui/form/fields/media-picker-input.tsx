import { createSignal, For, Show } from "solid-js";
import { Button } from "~/features/ui/components/button";
import { type MediaFile, MediaPickerDialog } from "~/features/ui/components/media-picker-dialog";
import type { FieldConfig } from "../types";

export function MediaPickerInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: MediaFile | MediaFile[] | null;
  onChange: (value: MediaFile | MediaFile[] | null) => void;
  error?: string;
  disabled?: boolean;
}) {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const multiple = () => props.field.mediaConfig?.multiple ?? false;
  const accept = () => props.field.mediaConfig?.accept;

  const selected = (): MediaFile[] => {
    if (!props.value) return [];
    return Array.isArray(props.value) ? props.value : [props.value];
  };

  const handleSelect = (files: MediaFile[]) => {
    props.onChange(multiple() ? files : (files[0] ?? null));
    setDialogOpen(false);
  };

  const removeFile = (id: string) => {
    const next = selected().filter((f) => f.id !== id);
    props.onChange(multiple() ? next : (next[0] ?? null));
  };

  return (
    <div class="space-y-1.5">
      <label class="text-sm font-medium leading-none">
        {props.field.label}
        <Show when={props.field.required}>
          <span class="ml-1 text-destructive">*</span>
        </Show>
      </label>

      <Show when={props.field.description}>
        <p class="text-[0.8rem] text-muted-foreground">{props.field.description}</p>
      </Show>

      {/* Selected file previews */}
      <Show when={selected().length > 0}>
        <div class="flex flex-wrap gap-2">
          <For each={selected()}>
            {(file) => (
              <div class="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                <Show
                  when={file.category === "image"}
                  fallback={
                    <div class="flex flex-col items-center gap-0.5 px-1">
                      <svg
                        class="h-5 w-5 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span class="max-w-full truncate text-[9px] text-muted-foreground">
                        {file.name}
                      </span>
                    </div>
                  }
                >
                  <img src={file.url} alt={file.name} class="h-full w-full object-cover" />
                </Show>
                <button
                  type="button"
                  disabled={props.disabled}
                  class="absolute right-0.5 top-0.5 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                  onClick={() => removeFile(file.id)}
                >
                  <svg
                    class="h-2.5 w-2.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={props.disabled}
        onClick={() => setDialogOpen(true)}
        class="h-8"
      >
        <svg
          class="mr-1.5 h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        {selected().length > 0 ? "Change Media" : "Choose Media"}
      </Button>

      <MediaPickerDialog
        open={dialogOpen()}
        onOpenChange={setDialogOpen}
        onSelect={handleSelect}
        multiple={multiple()}
        accept={accept()}
      />

      <Show when={props.error}>
        <p class="text-[0.8rem] text-destructive">{props.error}</p>
      </Show>
    </div>
  );
}
