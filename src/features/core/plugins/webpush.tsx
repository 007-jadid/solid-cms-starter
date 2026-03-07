import {
  useWebPush,
  type WebPushContextValue,
  WebPushProvider,
  type WebPushProviderConfig,
} from "~/features/context/webpush";
import type { CMSPlugin } from "../core.types";

export type { WebPushProviderConfig };

export function webPushPlugin(
  config?: WebPushProviderConfig,
): CMSPlugin<"webpush", WebPushContextValue> {
  return {
    name: "webpush",
    Provider: (props) => <WebPushProvider config={config}>{props.children}</WebPushProvider>,
    useHook: useWebPush,
  };
}
