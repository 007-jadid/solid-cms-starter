/**
 * RichTextEditor
 *
 * Controlled rich-text editor built on Quill.
 * Renders a themed Snow editor with optional character counter.
 *
 * Toolbar features:
 *   History: Undo / Redo
 *   Text:    Bold, Italic, Underline, Strikethrough, Inline Code
 *   Script:  Subscript, Superscript
 *   Size:    Small / Normal / Large / Huge
 *   Color:   Text color, Background color
 *   Heading: H1 / H2 / H3
 *   Lists:   Ordered, Bullet, Indent ±1
 *   Align:   Left / Center / Right / Justify
 *   Block:   Blockquote, Code block
 *   Insert:  Link, Image (with drag-corner resize)
 *   Clean:   Remove formatting
 */
import DOMPurify from "dompurify";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { cn } from "~/features/lib/utils";

// ─── Quill patches ────────────────────────────────────────────────────────────

// Quill 2 sanitizes image src and only allows http/https/data: by default.
// Patch the ImageBlot to also allow blob: URLs (from URL.createObjectURL).
const ImageBlot = Quill.import("formats/image") as {
  sanitize: (url: string) => string;
};
const _origSanitize = ImageBlot.sanitize.bind(ImageBlot);
ImageBlot.sanitize = (url: string) =>
  url.startsWith("blob:") ? url : _origSanitize(url);

// ─── Props ───────────────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  class?: string;
  minHeight?: string;
}

// ─── Image resize overlay ─────────────────────────────────────────────────────

/** Attaches a drag-corner resize overlay to every image clicked in the editor. */
function setupImageResize(
  quill: Quill,
  onContentChange: () => void,
): () => void {
  // The .ql-container div (parent of .ql-editor) is our positioning anchor.
  const qlContainer = quill.root.parentElement as HTMLElement;
  qlContainer.style.position = "relative";

  let overlay: HTMLDivElement | null = null;
  let activeImg: HTMLImageElement | null = null;

  // -- overlay position sync --------------------------------------------------
  const positionOverlay = () => {
    if (!overlay || !activeImg) return;
    const imgRect = activeImg.getBoundingClientRect();
    const cRect = qlContainer.getBoundingClientRect();
    overlay.style.left = `${imgRect.left - cRect.left + qlContainer.scrollLeft}px`;
    overlay.style.top = `${imgRect.top - cRect.top + qlContainer.scrollTop}px`;
    overlay.style.width = `${imgRect.width}px`;
    overlay.style.height = `${imgRect.height}px`;
  };

  // -- overlay lifecycle ------------------------------------------------------
  const hideOverlay = () => {
    overlay?.remove();
    overlay = null;
    activeImg = null;
  };

  const showOverlay = (img: HTMLImageElement) => {
    hideOverlay();
    activeImg = img;

    overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "absolute",
      boxSizing: "border-box",
      border: "2px solid #6366f1",
      pointerEvents: "none",
      zIndex: "10",
    });

    // Four corner handles (NW, NE, SW, SE)
    const corners: Array<{
      cursor: string;
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    }> = [
      { cursor: "nw-resize", top: "-5px", left: "-5px" },
      { cursor: "ne-resize", top: "-5px", right: "-5px" },
      { cursor: "sw-resize", bottom: "-5px", left: "-5px" },
      { cursor: "se-resize", bottom: "-5px", right: "-5px" },
    ];

    for (const corner of corners) {
      const handle = document.createElement("div");
      Object.assign(handle.style, {
        position: "absolute",
        width: "10px",
        height: "10px",
        background: "#6366f1",
        border: "1.5px solid white",
        borderRadius: "2px",
        pointerEvents: "all",
        cursor: corner.cursor,
        ...(corner.top && { top: corner.top }),
        ...(corner.bottom && { bottom: corner.bottom }),
        ...(corner.left && { left: corner.left }),
        ...(corner.right && { right: corner.right }),
      });

      const isLeft = corner.left !== undefined;
      const isTop = corner.top !== undefined;

      handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startW = activeImg!.getBoundingClientRect().width;
        const startH = activeImg!.getBoundingClientRect().height;
        const aspect = startW / startH;

        const onMouseMove = (e: MouseEvent) => {
          const dx = (e.clientX - startX) * (isLeft ? -1 : 1);
          const dy = (e.clientY - startY) * (isTop ? -1 : 1);
          // Lock aspect ratio: pick whichever axis moved more
          const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy * aspect;
          const newW = Math.max(50, startW + delta);
          activeImg!.style.width = `${newW}px`;
          activeImg!.style.height = "auto";
          positionOverlay();
        };

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          onContentChange();
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });

      overlay.appendChild(handle);
    }

    positionOverlay();
    qlContainer.appendChild(overlay);
  };

  // -- event listeners --------------------------------------------------------

  // Click on an image → show overlay
  const onEditorClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLImageElement) {
      e.preventDefault();
      showOverlay(e.target);
    }
  };

  // Click anywhere else → hide overlay
  const onDocumentClick = (e: MouseEvent) => {
    if (!activeImg) return;
    if (
      !(e.target instanceof HTMLImageElement) &&
      !overlay?.contains(e.target as Node)
    ) {
      hideOverlay();
    }
  };

  quill.root.addEventListener("click", onEditorClick);
  document.addEventListener("click", onDocumentClick);

  // Hide overlay when Quill makes a text-change (e.g. image deleted)
  const onTextChange = () => {
    if (activeImg && !quill.root.contains(activeImg)) hideOverlay();
  };
  quill.on("text-change", onTextChange);

  // Return cleanup
  return () => {
    hideOverlay();
    quill.root.removeEventListener("click", onEditorClick);
    document.removeEventListener("click", onDocumentClick);
    quill.off("text-change", onTextChange);
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RichTextEditor(props: RichTextEditorProps) {
  let containerRef!: HTMLDivElement;
  let quill: Quill | undefined;
  let internalUpdate = false;
  let cleanupResize: (() => void) | undefined;
  // Track blob URLs so we can revoke them on unmount
  const blobUrls: string[] = [];

  const [charCount, setCharCount] = createSignal(0);

  onMount(() => {
    quill = new Quill(containerRef, {
      theme: "snow",
      placeholder: props.placeholder ?? "Write something...",
      readOnly: props.disabled ?? false,
      modules: {
        toolbar: {
          container: [
            ["undo", "redo"],
            ["bold", "italic", "underline", "strike", "code"],
            [{ script: "sub" }, { script: "super" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ color: [] }, { background: [] }],
            [{ header: 1 }, { header: 2 }, { header: 3 }],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            [{ align: [] }],
            ["blockquote", "code-block"],
            ["link", "image"],
            ["clean"],
          ],
          handlers: {
            undo() {
              (quill as Quill & { history: { undo(): void } }).history.undo();
            },
            redo() {
              (quill as Quill & { history: { redo(): void } }).history.redo();
            },
            image() {
              // Override default handler to set a medium default width on insert.
              // Use createObjectURL (instant, no base64 encoding) so large images
              // don't freeze the UI.
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.click();
              input.onchange = () => {
                const file = input.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                blobUrls.push(url);
                const range = quill!.getSelection(true);
                quill!.insertEmbed(range.index, "image", url, "user");
                quill!.setSelection(range.index + 1, 0);
                // Apply default medium width after Quill has rendered the node
                queueMicrotask(() => {
                  const imgs = quill!.root.querySelectorAll("img");
                  const inserted = imgs[
                    imgs.length - 1
                  ] as HTMLImageElement | null;
                  if (inserted && !inserted.style.width) {
                    inserted.style.width = "40%";
                    inserted.style.height = "auto";
                    props.onChange?.(quill!.root.innerHTML);
                  }
                });
              };
            },
          },
        },
        history: { delay: 1000, maxStack: 100, userOnly: true },
      },
    });

    // Label undo/redo buttons (no built-in SVG)
    const toolbar = quill.getModule("toolbar") as { container: HTMLElement };
    const undoBtn = toolbar.container.querySelector(
      ".ql-undo",
    ) as HTMLElement | null;
    const redoBtn = toolbar.container.querySelector(
      ".ql-redo",
    ) as HTMLElement | null;
    if (undoBtn) undoBtn.textContent = "↩";
    if (redoBtn) redoBtn.textContent = "↪";

    // Set initial content (sanitized to prevent XSS)
    if (props.value) {
      internalUpdate = true;
      quill.root.innerHTML = DOMPurify.sanitize(props.value);
      internalUpdate = false;
      setCharCount(quill.getText().length - 1);
    }

    // Emit changes
    quill.on("text-change", () => {
      if (internalUpdate) return;
      const len = quill!.getText().length - 1;
      if (props.maxLength && len > props.maxLength) {
        (quill as Quill & { history: { undo(): void } }).history.undo();
        return;
      }
      setCharCount(len);
      props.onChange?.(quill!.root.innerHTML);
    });

    // Attach image resize
    cleanupResize = setupImageResize(quill, () => {
      props.onChange?.(quill!.root.innerHTML);
    });
  });

  // Sync controlled value from parent
  createEffect(
    on(
      () => props.value,
      (newVal) => {
        if (!quill || quill.root.innerHTML === newVal) return;
        internalUpdate = true;
        quill.root.innerHTML = DOMPurify.sanitize(newVal ?? "");
        internalUpdate = false;
        setCharCount(quill.getText().length - 1);
      },
      { defer: true },
    ),
  );

  // Sync disabled / readOnly
  createEffect(
    on(
      () => props.disabled,
      (disabled) => {
        quill?.enable(!disabled);
      },
      { defer: true },
    ),
  );

  onCleanup(() => {
    quill?.off("text-change");
    cleanupResize?.();
    for (const url of blobUrls) URL.revokeObjectURL(url);
  });

  return (
    <div
      class={cn(
        "rte-quill-wrapper rounded-md border border-input bg-background",
        props.disabled && "opacity-60 pointer-events-none",
        props.class,
      )}
    >
      <div
        ref={containerRef!}
        style={{ "min-height": props.minHeight ?? "150px" }}
      />

      {/* ── Character count ── */}
      <Show when={props.maxLength}>
        <div class="border-t border-border px-3 py-1 text-right text-xs text-muted-foreground">
          {charCount()} / {props.maxLength}
        </div>
      </Show>
    </div>
  );
}
