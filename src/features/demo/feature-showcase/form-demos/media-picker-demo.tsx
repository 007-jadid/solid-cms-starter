import { createSignal, Show } from "solid-js";
import { Button } from "~/features/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { type MediaFile, MediaPickerDialog } from "~/features/ui/components/media-picker-dialog";
import { createForm } from "~/features/ui/form/form-factory";

export function MediaPickerDemo() {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [selected, setSelected] = createSignal<MediaFile[]>([]);

  const form = createForm({
    defaultValues: { thumbnail: null as MediaFile | null, gallery: [] as MediaFile[] },
    fields: [
      {
        name: "thumbnail" as const,
        label: "Featured Image",
        type: "media" as const,
        description: "Single image selection.",
        mediaConfig: { multiple: false, accept: "image/*" },
      },
      {
        name: "gallery" as const,
        label: "Gallery",
        type: "media" as const,
        description: "Multiple file selection.",
        mediaConfig: { multiple: true },
      },
    ],
    onSubmit: (values) => {
      alert(
        `Submitted!\nThumbnail: ${values.thumbnail ? (values.thumbnail as MediaFile).name : "none"}\nGallery: ${(values.gallery as MediaFile[]).map((f) => f.name).join(", ") || "none"}`,
      );
    },
    submitLabel: "Save Media",
  });

  return (
    <div class="space-y-4">
      {/* Standalone dialog */}
      <Card>
        <CardHeader>
          <CardTitle>Standalone Media Picker</CardTitle>
          <CardDescription>
            Upload files, filter by type, search, and select one or more. Object URLs are cleaned up
            automatically on unmount.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <svg
              class="mr-2 h-4 w-4"
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
            Open Media Library
          </Button>

          <MediaPickerDialog
            open={dialogOpen()}
            onOpenChange={setDialogOpen}
            onSelect={(files) => setSelected(files)}
            multiple
          />

          <Show when={selected().length > 0}>
            <div class="rounded-md border bg-muted p-3 text-sm">
              <p class="mb-1 font-medium">Selected files:</p>
              <ul class="list-disc pl-4 text-muted-foreground">
                {selected().map((f) => (
                  <li>
                    {f.name} ({f.type}, {(f.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            </div>
          </Show>
        </CardContent>
      </Card>

      {/* Inside createForm */}
      <Card>
        <CardHeader>
          <CardTitle>Media Picker Inside createForm()</CardTitle>
          <CardDescription>
            Use <code class="rounded bg-muted px-1 text-xs">type: "media"</code> in field config.
            Supports single and multiple selection via{" "}
            <code class="rounded bg-muted px-1 text-xs">mediaConfig.multiple</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.Form />
        </CardContent>
      </Card>
    </div>
  );
}
