export type CmsEditorMode = "quill" | "none";

const rawEditor = __CMS_EDITOR__;

export const CMS_EDITOR: CmsEditorMode = rawEditor === "none" ? "none" : "quill";

export const EDITOR_BUILD_FLAGS = {
  quill: CMS_EDITOR === "quill",
} as const;
