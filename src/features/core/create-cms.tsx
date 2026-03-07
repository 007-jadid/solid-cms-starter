import type { Component, JSXElement } from "solid-js";
import type { CMSInstance, CMSPlugin } from "./core.types";

/**
 * Creates a type-safe CMS plugin system.
 *
 * Pass `as const` on the array to preserve plugin name literals:
 * ```ts
 * const cms = createCMS([pwaPlugin(), wsPlugin()] as const);
 * cms.use("pwa"); // ✓ typed
 * cms.use("sse"); // ✗ TypeScript error
 * ```
 */
export function createCMS<const TPlugins extends readonly CMSPlugin[]>(
  plugins: TPlugins,
): CMSInstance<TPlugins> {
  const pluginMap = new Map<string, CMSPlugin>(plugins.map((p) => [p.name, p]));

  const allNavActions: Component[] = plugins.flatMap((p) => p.navActions ?? []);

  // Nest providers: first plugin in array = outermost wrapper
  const Provider: Component<{ children: JSXElement }> = (props) => {
    return [...plugins].reduceRight<JSXElement>((children, plugin) => {
      const P = plugin.Provider;
      return (<P>{children}</P>) as JSXElement;
    }, props.children);
  };

  const use = (name: string) => {
    const plugin = pluginMap.get(name);
    if (!plugin) {
      throw new Error(`[CMS] Plugin "${name}" is not registered. Add it to createCMS().`);
    }
    return plugin.useHook();
  };

  const has = (name: string) => pluginMap.has(name);

  return {
    Provider,
    use,
    navActions: allNavActions,
    has,
  } as CMSInstance<TPlugins>;
}
