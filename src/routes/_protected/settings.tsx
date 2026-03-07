import { createFileRoute } from "@tanstack/solid-router";
import { useI18n } from "~/features/context/i18n";
import { useSettings } from "~/features/context/settings/settings.context";
import { staggerChildren } from "~/features/lib/gsap-directives";

void staggerChildren;

import { Card, CardContent, CardHeader, CardTitle } from "~/features/ui/components/card";
import { DemoBanner } from "~/features/ui/components/demo-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/features/ui/components/select";
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from "~/features/ui/components/switch";
import { PageHeader } from "~/features/ui/layout/page-header";

export const Route = createFileRoute("/_protected/settings")({
  component: SettingsPage,
});

function GlassPresetChip(props: { preset: "subtle" | "balanced" | "strong" }) {
  const presetClass =
    props.preset === "subtle"
      ? "bg-background/90 backdrop-blur-sm"
      : props.preset === "strong"
        ? "bg-background/75 backdrop-blur-xl"
        : "bg-background/82 backdrop-blur-md";

  return (
    <span class="inline-flex h-4 w-7 items-center justify-center rounded-md border border-border/60">
      <span class={`h-2.5 w-5 rounded-sm border border-border/50 ${presetClass}`} />
    </span>
  );
}

function SettingsPage() {
  const settings = useSettings();
  const { t } = useI18n();

  return (
    <div class="space-y-6" use:staggerChildren={{ stagger: 0.1 }}>
      <DemoBanner />
      <PageHeader title={t("settings.title")} description={t("settings.description")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.appearance")}</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid gap-2">
            <div class="text-sm font-medium">{t("settings.theme")}</div>
            <Select<string>
              value={settings.state.theme}
              onChange={(value) => settings.setTheme(value as "light" | "dark" | "system")}
              options={["system", "light", "dark"]}
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger class="w-56">
                <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>
          <div class="grid gap-2">
            <div class="text-sm font-medium">{t("settings.themeVariant")}</div>
            <Select<string>
              value={settings.state.themeVariant}
              onChange={(value) => settings.setThemeVariant(value as "default" | "claude")}
              options={["default", "claude"]}
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger class="w-56">
                <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>
          <div class="grid gap-2">
            <div class="text-sm font-medium">Glass Effect</div>
            <Select<string>
              value={settings.state.glassPreset}
              onChange={(value) =>
                settings.setGlassPreset(value as "subtle" | "balanced" | "strong")
              }
              options={["subtle", "balanced", "strong"]}
              itemComponent={(props) => (
                <SelectItem item={props.item}>
                  <div class="flex w-full items-center justify-between gap-3">
                    <span class="capitalize">{props.item.rawValue}</span>
                    <GlassPresetChip
                      preset={props.item.rawValue as "subtle" | "balanced" | "strong"}
                    />
                  </div>
                </SelectItem>
              )}
            >
              <SelectTrigger class="w-56">
                <SelectValue<string>>
                  {(state) => {
                    const selected = (state.selectedOption() || "balanced") as
                      | "subtle"
                      | "balanced"
                      | "strong";
                    return (
                      <div class="flex w-full items-center justify-between gap-3">
                        <span class="capitalize">{selected}</span>
                        <GlassPresetChip preset={selected} />
                      </div>
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>
          <div class="grid gap-2">
            <div class="text-sm font-medium">{t("settings.fontFamily")}</div>
            <Select<string>
              value={settings.state.fontFamily}
              onChange={(value) => settings.setFontFamily(value as "inter" | "system" | "geist")}
              options={["inter", "system", "geist"]}
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger class="w-56">
                <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>
          <div class="grid gap-2">
            <div class="text-sm font-medium">{t("settings.density")}</div>
            <Select<string>
              value={settings.state.density}
              onChange={(value) =>
                settings.setDensity(value as "compact" | "comfortable" | "spacious")
              }
              options={["compact", "comfortable", "spacious"]}
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger class="w-56">
                <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>
          <div class="grid gap-2">
            <div class="text-sm font-medium">{t("settings.sidebarLabel")}</div>
            <Switch
              checked={settings.state.sidebarCollapsed}
              onChange={(checked) => settings.setSidebarCollapsed(Boolean(checked))}
            >
              <div class="flex items-center gap-3">
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel>{t("settings.collapsed")}</SwitchLabel>
              </div>
            </Switch>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.tableDefaults")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-2">
            <div class="text-sm font-medium">{t("settings.pageSize")}</div>
            <Select<string>
              value={String(settings.state.table.pageSize)}
              onChange={(value) => settings.setTablePageSize(Number(value))}
              options={[10, 20, 30, 40, 50].map(String)}
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger class="w-56">
                <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
