/**
 * MediaPickerDialog
 *
 * Client-side media picker: upload files, browse by category,
 * search by name, and select one or multiple files to insert.
 * Object URLs are revoked on component cleanup to prevent memory leaks.
 */
import { createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { cn } from "~/features/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MediaCategory = "image" | "video" | "document" | "other";

export interface MediaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // Object URL — revoked on cleanup
  file: File;
  uploadedAt: Date;
  category: MediaCategory;
}

export interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (files: MediaFile[]) => void;
  multiple?: boolean;
  accept?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategory(mimeType: string): MediaCategory {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (
    mimeType.startsWith("application/") ||
    mimeType.startsWith("text/") ||
    mimeType === "application/pdf"
  )
    return "document";
  return "other";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MediaPickerDialog(props: MediaPickerDialogProps) {
  const [files, setFiles] = createSignal<MediaFile[]>([]);
  const [selectedIds, setSelectedIds] = createSignal<Set<string>>(new Set());
  const [activeTab, setActiveTab] = createSignal<"all" | MediaCategory>("all");
  const [search, setSearch] = createSignal("");
  const [isDragging, setIsDragging] = createSignal(false);

  // Revoke all Object URLs on unmount
  onCleanup(() => {
    for (const f of files()) URL.revokeObjectURL(f.url);
  });

  const handleUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;
    const newFiles: MediaFile[] = Array.from(uploadedFiles).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
      file: f,
      uploadedAt: new Date(),
      category: getCategory(f.type),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    const file = files().find((f) => f.id === id);
    if (file) URL.revokeObjectURL(file.url);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    if (props.multiple) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      setSelectedIds(new Set([id]));
    }
  };

  const filteredFiles = createMemo(() =>
    files().filter((f) => {
      const tab = activeTab();
      const matchesTab = tab === "all" || f.category === tab;
      const matchesSearch = f.name.toLowerCase().includes(search().toLowerCase());
      return matchesTab && matchesSearch;
    }),
  );

  const handleConfirm = () => {
    const selected = files().filter((f) => selectedIds().has(f.id));
    props.onSelect(selected);
    props.onOpenChange(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer?.files ?? null);
  };

  let fileInputRef!: HTMLInputElement;

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div class="flex flex-col gap-4">
          {/* Upload zone */}
          <button
            type="button"
            class={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
              isDragging()
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:bg-muted/50",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.click()}
          >
            <svg
              class="mb-2 h-8 w-8 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p class="text-sm font-medium">Drop files here or click to browse</p>
            <p class="text-xs text-muted-foreground">
              {props.accept ?? "All file types supported"}
            </p>
            <input
              ref={fileInputRef!}
              type="file"
              multiple={props.multiple ?? true}
              accept={props.accept}
              class="hidden"
              onChange={(e) => handleUpload(e.currentTarget.files)}
            />
          </button>

          {/* Search + tabs + gallery */}
          <Show when={files().length > 0}>
            <Input
              type="text"
              placeholder="Search files..."
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
              class="h-8 py-1"
            />

            <Tabs
              value={activeTab()}
              onChange={(v) =>
                setActiveTab(v as typeof activeTab extends () => infer T ? T : never)
              }
            >
              <TabsList class="h-8">
                <TabsTrigger value="all" class="h-7 text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="image" class="h-7 text-xs">
                  Images
                </TabsTrigger>
                <TabsTrigger value="document" class="h-7 text-xs">
                  Documents
                </TabsTrigger>
                <TabsTrigger value="video" class="h-7 text-xs">
                  Videos
                </TabsTrigger>
                <TabsTrigger value="other" class="h-7 text-xs">
                  Other
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab()} class="mt-3">
                <Show
                  when={filteredFiles().length > 0}
                  fallback={
                    <p class="py-8 text-center text-sm text-muted-foreground">
                      No files match your search.
                    </p>
                  }
                >
                  <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 max-h-64 overflow-y-auto">
                    <For each={filteredFiles()}>
                      {(file) => {
                        const isSelected = () => selectedIds().has(file.id);
                        return (
                          <button
                            type="button"
                            class={cn(
                              "group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all text-left",
                              isSelected()
                                ? "border-primary ring-2 ring-primary/30"
                                : "border-border hover:border-primary/50",
                            )}
                            onClick={() => toggleSelect(file.id)}
                          >
                            {/* Preview */}
                            <div class="flex h-20 items-center justify-center bg-muted">
                              <Show
                                when={file.category === "image"}
                                fallback={<FileTypeIcon category={file.category} />}
                              >
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  class="h-full w-full object-cover"
                                />
                              </Show>
                            </div>

                            {/* Selected checkmark */}
                            <Show when={isSelected()}>
                              <div class="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <svg
                                  class="h-3 w-3"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="3"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            </Show>

                            {/* Delete button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              class="absolute left-1 top-1 hidden size-5 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive group-hover:flex"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(file.id);
                              }}
                            >
                              <svg
                                class="h-3 w-3"
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
                            </Button>

                            {/* File info */}
                            <div class="p-1">
                              <p class="truncate text-[10px] font-medium leading-tight">
                                {file.name}
                              </p>
                              <p class="text-[9px] text-muted-foreground">
                                {formatBytes(file.size)}
                              </p>
                            </div>
                          </button>
                        );
                      }}
                    </For>
                  </div>
                </Show>
              </TabsContent>
            </Tabs>
          </Show>

          {/* Footer */}
          <div class="flex items-center justify-between border-t pt-3">
            <span class="text-sm text-muted-foreground">
              <Show when={selectedIds().size > 0} fallback="No files selected">
                <Badge variant="secondary">{selectedIds().size}</Badge> file
                {selectedIds().size !== 1 ? "s" : ""} selected
              </Show>
            </span>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => props.onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" disabled={selectedIds().size === 0} onClick={handleConfirm}>
                Select {selectedIds().size > 0 ? `(${selectedIds().size})` : ""}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── File type icon ───────────────────────────────────────────────────────────

function FileTypeIcon(props: { category: MediaCategory }) {
  return (
    <div class="flex flex-col items-center gap-1">
      <svg
        class="h-8 w-8 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <Show when={props.category === "document"}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </Show>
        <Show when={props.category === "video"}>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </Show>
        <Show when={props.category === "other"}>
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </Show>
      </svg>
    </div>
  );
}
