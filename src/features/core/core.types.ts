import type { Component, JSXElement } from "solid-js";

// ── Shared config types ─────────────────────────────────────────
export interface ReconnectConfig {
  enabled: boolean;
  /** Maximum number of reconnection attempts */
  maxAttempts: number;
  /** Base delay in milliseconds */
  baseDelay: number;
  /** Maximum delay in milliseconds */
  maxDelay: number;
}

// ── Core plugin interface ───────────────────────────────────────
export interface CMSPlugin<TName extends string = string, TContext = unknown> {
  /** Unique plugin name — used as the key for cms.use() */
  name: TName;
  /** SolidJS context provider wrapping children */
  Provider: Component<{ children: JSXElement }>;
  /** Returns the context value (wraps the existing use*() hook) */
  useHook: () => TContext;
  /** Optional components to render in the navbar action area */
  navActions?: Component[];
}

// ── Type-level helpers ──────────────────────────────────────────

/** Extracts the context type for a specific plugin name from a plugin tuple */
type ExtractContext<TPlugins extends readonly CMSPlugin[], K extends string> =
  Extract<TPlugins[number], { name: K }> extends CMSPlugin<K, infer C> ? C : never;

// ── createCMS return type ───────────────────────────────────────
export interface CMSInstance<TPlugins extends readonly CMSPlugin[]> {
  /** Nested provider component wrapping all plugin providers */
  Provider: Component<{ children: JSXElement }>;
  /** Type-safe hook — only accepts names of registered plugins */
  use: <K extends TPlugins[number]["name"]>(name: K) => ExtractContext<TPlugins, K>;
  /** Flat list of all nav action components from registered plugins */
  navActions: Component[];
  /** Runtime check if a plugin is registered */
  has: (name: string) => boolean;
}
