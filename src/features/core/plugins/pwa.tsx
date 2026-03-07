import {
  type PWAContextValue,
  PWAProvider,
  type PWAProviderConfig,
  usePWA,
} from "~/features/context/pwa";
import type { CMSPlugin } from "../core.types";

export type { PWAProviderConfig };

export function pwaPlugin(config?: PWAProviderConfig): CMSPlugin<"pwa", PWAContextValue> {
  return {
    name: "pwa",
    Provider: (props) => <PWAProvider config={config}>{props.children}</PWAProvider>,
    useHook: usePWA,
  };
}
