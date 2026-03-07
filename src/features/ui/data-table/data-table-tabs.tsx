/**
 * DataTable Tabs Component
 * Tab navigation that syncs with URL, with smooth switching animation
 */

import { For } from "solid-js";
import { Dynamic } from "solid-js/web";

import { Tabs, TabsList, TabsTrigger } from "../components/tabs";

import { serializers, useUrlState } from "./hooks/use-url-state";
import type { DataTab } from "./types";

interface DataTableTabsProps {
  tabs: DataTab[];
  onTabChange?: (tab: string) => void;
}

export function DataTableTabs(props: DataTableTabsProps) {
  const defaultTab = () => props.tabs[0]?.keyName || "all";

  const [activeTab, setActiveTab] = useUrlState("tab", defaultTab(), serializers.string);

  const handleChange = (value: string) => {
    setActiveTab(value);
    props.onTabChange?.(value);
  };

  return (
    <Tabs value={activeTab()} onChange={handleChange} class="w-full">
      <TabsList>
        <For each={props.tabs}>
          {(tab) => (
            <TabsTrigger value={tab.keyName}>
              {tab.icon && <Dynamic component={tab.icon} class="mr-2 h-4 w-4" />}
              {tab.title}
            </TabsTrigger>
          )}
        </For>
      </TabsList>
    </Tabs>
  );
}
