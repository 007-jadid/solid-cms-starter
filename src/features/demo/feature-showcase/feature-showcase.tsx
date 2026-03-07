import { For } from "solid-js";
import { useI18n } from "~/features/context/i18n";
import type { AuditLogEntry } from "~/features/ui/components/audit-log";
import { AuditLog } from "~/features/ui/components/audit-log";
import { Card, CardContent, CardHeader, CardTitle } from "~/features/ui/components/card";
import { DemoBanner } from "~/features/ui/components/demo-banner";
import { Separator } from "~/features/ui/components/separator";
import { StatCard } from "~/features/ui/components/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/features/ui/components/tabs";
import { ChartsShowcase } from "../chart-showcase";

// DataTable demos
import {
  ColumnPinningDemo,
  DragDropDemo,
  EditingDemo,
  ExpansionDemo,
  FilteringDemo,
  PaginationDemo,
  SelectionDemo,
  SettingsDemo,
  SortingDemo,
  VirtualDemo,
} from "./data-table-demos";
// Form demos
import {
  AllComponentsDemo,
  ArrayFieldsDemo,
  BasicFormDemo,
  DynamicFieldsDemo,
  MediaPickerDemo,
  MultiStepDemo,
  RichTextDemo,
  SectionsDemo,
  SelectFieldsDemo,
  ValidationDemo,
} from "./form-demos";

// Map demos
import { MapDrawingDemo, MapLocationDemo } from "./map-demos";
// Permissions demo
import { PermissionsDemo } from "./permissions-demo";

// Icons
const RowsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M224 56v40a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8h176a8 8 0 0 1 8 8m-8 56H40a8 8 0 0 0-8 8v40a8 8 0 0 0 8 8h176a8 8 0 0 0 8-8v-40a8 8 0 0 0-8-8m0 64H40a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h176a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8" />
  </svg>
);

const TextboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m0 176H48V48h160zM184 96a8 8 0 0 1-8 8h-32v64a8 8 0 0 1-16 0V72a8 8 0 0 1 8-8h40a8 8 0 0 1 8 8" />
  </svg>
);

const ArrowsDownUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="m119.39 172.94l-32 40A8 8 0 0 1 80 216a8 8 0 0 1-6.31-3.06l-32-40a8 8 0 1 1 12.5-10l18.81 23.5V48a8 8 0 0 1 16 0v138.44l18.81-23.5a8 8 0 1 1 12.5 10zM214.31 83l-32-40a8 8 0 0 0-12.5 0l-32 40a8 8 0 0 0 12.5 10l18.81-23.5V208a8 8 0 0 0 16 0V69.56l18.81 23.5a8 8 0 1 0 12.5-10z" />
  </svg>
);

const FunnelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M230.6 49.53A15.81 15.81 0 0 0 216 40H40a16 16 0 0 0-11.75 26.68L96 139.31V216a16 16 0 0 0 24.87 13.32l32-21.34A16 16 0 0 0 160 194.66v-55.35l67.74-72.63a15.83 15.83 0 0 0 2.86-17.15M40 56h176l-.07.08L148.18 128H107.82L40.06 56.08zm104 138.66l-32 21.34V144h32z" />
  </svg>
);

const ListNumbersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M224 128a8 8 0 0 1-8 8H104a8 8 0 0 1 0-16h112a8 8 0 0 1 8 8m-112-56h112a8 8 0 0 0 0-16H104a8 8 0 0 0 0 16zm112 112H104a8 8 0 0 0 0 16h112a8 8 0 0 0 0-16M40 60h8v56a8 8 0 0 0 16 0V52a8 8 0 0 0-8-8H40a8 8 0 0 0 0 16m40 132H40v-8h12a8 8 0 0 0 0-16H40a8 8 0 0 0-8 8v32a8 8 0 0 0 8 8h40a8 8 0 0 0 0-16" />
  </svg>
);

const CheckSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="m205.66 85.66l-96 96a8 8 0 0 1-11.32 0l-40-40a8 8 0 0 1 11.32-11.32L104 164.69l90.34-90.35a8 8 0 0 1 11.32 11.32" />
  </svg>
);

const DragIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M108 60a16 16 0 1 1-16-16a16 16 0 0 1 16 16m56 16a16 16 0 1 0-16-16a16 16 0 0 0 16 16m-72 36a16 16 0 1 0 16 16a16 16 0 0 0-16-16m72 0a16 16 0 1 0 16 16a16 16 0 0 0-16-16m-72 68a16 16 0 1 0 16 16a16 16 0 0 0-16-16m72 0a16 16 0 1 0 16 16a16 16 0 0 0-16-16" />
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="m227.31 73.37l-44.68-44.69a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h44.69a15.86 15.86 0 0 0 11.31-4.69L227.31 96a16 16 0 0 0 0-22.63M92.69 208H48v-44.69l88-88L180.69 120zM192 108.68L147.31 64l24-24L216 84.68z" />
  </svg>
);

const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M216 48v48a8 8 0 0 1-16 0V67.31l-42.34 42.35a8 8 0 0 1-11.32-11.32L188.69 56H160a8 8 0 0 1 0-16h48a8 8 0 0 1 8 8M98.34 146.34L56 188.69V160a8 8 0 0 0-16 0v48a8 8 0 0 0 8 8h48a8 8 0 0 0 0-16H67.31l42.35-42.34a8 8 0 0 0-11.32-11.32" />
  </svg>
);

const PinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M235.33 104L152 20.69a16 16 0 0 0-22.63 0L100.69 49.4L91.3 40a16 16 0 0 0-22.62 0L40 68.69a16 16 0 0 0 0 22.62l9.39 9.39l-28.7 28.7a16 16 0 0 0 0 22.62L74.34 205.66a16 16 0 0 0 22.63 0l28.69-28.69l9.39 9.39a16 16 0 0 0 22.62 0l28.69-28.69a16 16 0 0 0 0-22.62l-9.4-9.39l28.69-28.69a16 16 0 0 0 0-22.63ZM176 113.37L142.63 80L176 46.63L209.37 80Z" />
  </svg>
);

const GearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M128 80a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m88-29.84q.06-2.16 0-4.32l14.92-18.64a8 8 0 0 0 1.48-7.06a107.21 107.21 0 0 0-10.88-26.25a8 8 0 0 0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186 40.54a8 8 0 0 0-3.94-6a107.71 107.71 0 0 0-26.25-10.87a8 8 0 0 0-7.06 1.49L130.16 40q-2.16-.06-4.32 0L107.2 25.11a8 8 0 0 0-7.06-1.48a107.6 107.6 0 0 0-26.25 10.88a8 8 0 0 0-3.93 6l-2.64 23.76q-1.56 1.49-3 3L40.54 70a8 8 0 0 0-6 3.94a107.71 107.71 0 0 0-10.87 26.25a8 8 0 0 0 1.49 7.06L40 125.84q-.06 2.16 0 4.32l-14.92 18.64a8 8 0 0 0-1.48 7.06a107.21 107.21 0 0 0 10.88 26.25a8 8 0 0 0 6 3.93l23.72 2.64q1.49 1.56 3 3L70 215.46a8 8 0 0 0 3.94 6a107.71 107.71 0 0 0 26.25 10.87a8 8 0 0 0 7.06-1.49L125.84 216q2.16.06 4.32 0l18.64 14.92a8 8 0 0 0 7.06 1.48a107.21 107.21 0 0 0 26.25-10.88a8 8 0 0 0 3.93-6l2.64-23.72q1.56-1.48 3-3l23.78 2.64a8 8 0 0 0 6-3.94a107.71 107.71 0 0 0 10.87-26.25a8 8 0 0 0-1.49-7.06Zm-16.1-6.5a73.93 73.93 0 0 1 0 8.68a8 8 0 0 0 1.74 5.48l14.19 17.73a91.57 91.57 0 0 1-6.23 15l-22.6-2.51a8 8 0 0 0-5.67 1.85a74.55 74.55 0 0 1-6.21 6.21a8 8 0 0 0-1.85 5.67l2.51 22.6a91.32 91.32 0 0 1-15 6.23l-17.73-14.19a8 8 0 0 0-5.48-1.74a73.93 73.93 0 0 1-8.68 0a8 8 0 0 0-5.48 1.74l-17.73 14.19a91.57 91.57 0 0 1-15-6.23l2.51-22.6a8 8 0 0 0-1.85-5.67a74.55 74.55 0 0 1-6.21-6.21a8 8 0 0 0-5.67-1.85l-22.6 2.51a91.32 91.32 0 0 1-6.23-15l14.19-17.73a8 8 0 0 0 1.74-5.48a73.93 73.93 0 0 1 0-8.68a8 8 0 0 0-1.74-5.48L39.81 100a91.57 91.57 0 0 1 6.23-15l22.6 2.51a8 8 0 0 0 5.67-1.85a74.55 74.55 0 0 1 6.21-6.21a8 8 0 0 0 1.85-5.67L79.86 51.2a91.32 91.32 0 0 1 15-6.23l17.73 14.19a8 8 0 0 0 5.48 1.74a73.93 73.93 0 0 1 8.68 0a8 8 0 0 0 5.48-1.74l17.73-14.19a91.57 91.57 0 0 1 15 6.23l-2.51 22.6a8 8 0 0 0 1.85 5.67a74.55 74.55 0 0 1 6.21 6.21a8 8 0 0 0 5.67 1.85l22.6-2.51a91.32 91.32 0 0 1 6.23 15l-14.19 17.73a8 8 0 0 0-1.74 5.53Z" />
  </svg>
);

const FadersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M136 120v96a8 8 0 0 1-16 0v-96a8 8 0 0 1 16 0m64 72a8 8 0 0 0-8 8v16a8 8 0 0 0 16 0v-16a8 8 0 0 0-8-8m24-32h-16V40a8 8 0 0 0-16 0v120h-16a8 8 0 0 0 0 16h48a8 8 0 0 0 0-16M56 168a8 8 0 0 0-8 8v40a8 8 0 0 0 16 0v-40a8 8 0 0 0-8-8m24-32H64V40a8 8 0 0 0-16 0v96H32a8 8 0 0 0 0 16h48a8 8 0 0 0 0-16m72-48h-16V40a8 8 0 0 0-16 0v48H104a8 8 0 0 0 0 16h48a8 8 0 0 0 0-16" />
  </svg>
);

const CloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M247.93 124.52c-.2-.78-.51-1.54-.77-2.32a68.15 68.15 0 0 0-4.79-11.41c-1.14-2.3-2.46-4.5-3.8-6.68A68 68 0 0 0 128 48a68 68 0 0 0-111.57 55.1A68.08 68.08 0 0 0 0 168a68 68 0 0 0 68 68h112a68 68 0 0 0 67.93-63.48zM180 220H68a52 52 0 0 1 0-104h.57A51.91 51.91 0 0 1 128 76a52 52 0 0 1 51.43 44h.57a52 52 0 0 1 0 100" />
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M69.12 94.15L28.5 128l40.62 33.85a8 8 0 1 1-10.24 12.29l-48-40a8 8 0 0 1 0-12.29l48-40a8 8 0 0 1 10.24 12.3m176 27.7l-48-40a8 8 0 1 0-10.24 12.3L227.5 128l-40.62 33.85a8 8 0 1 0 10.24 12.29l48-40a8 8 0 0 0 0-12.29m-82.39-89.37a8 8 0 0 0-10.25 4.79l-64 176a8 8 0 0 0 4.79 10.26A8.14 8.14 0 0 0 96 224a8 8 0 0 0 7.52-5.27l64-176a8 8 0 0 0-4.79-10.25" />
  </svg>
);

const StepsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="m221.66 133.66l-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32" />
  </svg>
);

const NoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M200 32h-40a8 8 0 0 0 0 16h40a8 8 0 0 1 8 8v152a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8h40a8 8 0 0 0 0-16H56a24 24 0 0 0-24 24v152a24 24 0 0 0 24 24h144a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24m-72 0a8 8 0 0 0 0 16a8 8 0 0 0 0-16m40 80H88a8 8 0 0 0 0 16h80a8 8 0 0 0 0-16m0 32H88a8 8 0 0 0 0 16h80a8 8 0 0 0 0-16" />
  </svg>
);

const ScrollIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M168 48a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8m-8 152H96a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16m64-136v128a24 24 0 0 1-24 24H56a24 24 0 0 1-24-24V64a24 24 0 0 1 24-24h144a24 24 0 0 1 24 24m-16 0a8 8 0 0 0-8-8H56a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h144a8 8 0 0 0 8-8z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M208 40H48a16 16 0 0 0-16 16v56c0 52.72 25.52 84.67 46.93 102.19 23.06 18.86 46 26.29 47 26.63a8 8 0 0 0 4.2 0c.93-.34 23.89-7.77 46.93-26.63C198.48 196.67 224 164.72 224 112V56a16 16 0 0 0-16-16m0 72c0 37.07-13.66 65.49-40.6 84.44a172 172 0 0 1-39.4 22.2 172 172 0 0 1-39.4-22.2C61.66 177.49 48 149.07 48 112V56h160z" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M128 16a96 96 0 1 0 96 96A96.11 96.11 0 0 0 128 16m0 176a80 80 0 1 1 80-80a80.09 80.09 0 0 1-80 80m0-120a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="M224 200h-8V40a8 8 0 0 0-16 0v160h-32V88a8 8 0 0 0-16 0v112H120V136a8 8 0 0 0-16 0v64H72V168a8 8 0 0 0-16 0v32H40a8 8 0 0 0 0 16h184a8 8 0 0 0 0-16" />
  </svg>
);

const PencilRulerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-4 h-4" fill="currentColor">
    <path d="m227.31 73.37l-44.68-44.69a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h44.69a15.86 15.86 0 0 0 11.31-4.69L227.31 96a16 16 0 0 0 0-22.63ZM92.69 208H48v-44.69l88-88L180.69 120ZM192 108.68L147.31 64l24-24L216 84.68Z" />
  </svg>
);

/**
 * Feature Showcase
 *
 * A comprehensive demo page showcasing all DataTable, Form, and Permission features
 * organized into tabs for easy exploration.
 */
export function FeatureShowcase() {
  const { t } = useI18n();

  return (
    <div class="container mx-auto py-6 space-y-6">
      <DemoBanner />

      <div class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">{t("showcase.title")}</h1>
        <p class="text-muted-foreground">{t("showcase.description")}</p>
      </div>

      <Tabs defaultValue="data-table" class="space-y-6">
        <TabsList>
          <TabsTrigger value="data-table" class="gap-2">
            <RowsIcon />
            {t("showcase.tabs.dataTable")}
          </TabsTrigger>
          <TabsTrigger value="forms" class="gap-2">
            <TextboxIcon />
            {t("showcase.tabs.forms")}
          </TabsTrigger>
          <TabsTrigger value="permissions" class="gap-2">
            <ShieldIcon />
            {t("showcase.tabs.permissions")}
          </TabsTrigger>
          <TabsTrigger value="maps" class="gap-2">
            <MapPinIcon />
            {t("showcase.tabs.maps")}
          </TabsTrigger>
          <TabsTrigger value="charts" class="gap-2">
            <ChartBarIcon />
            {t("showcase.tabs.charts")}
          </TabsTrigger>
          <TabsTrigger value="components" class="gap-2">
            <FadersIcon />
            {t("showcase.tabs.components")}
          </TabsTrigger>
        </TabsList>

        {/* DataTable Section */}
        <TabsContent value="data-table">
          <Tabs defaultValue="sorting" orientation="vertical" class="flex gap-6">
            <TabsList class="flex-col h-fit w-48 shrink-0 items-start bg-transparent">
              <TabsTrigger value="sorting" class="w-full justify-start gap-2">
                <ArrowsDownUpIcon />
                {t("showcase.tabs.sorting")}
              </TabsTrigger>
              <TabsTrigger value="filtering" class="w-full justify-start gap-2">
                <FunnelIcon />
                {t("showcase.tabs.filtering")}
              </TabsTrigger>
              <TabsTrigger value="pagination" class="w-full justify-start gap-2">
                <ListNumbersIcon />
                {t("showcase.tabs.pagination")}
              </TabsTrigger>
              <TabsTrigger value="selection" class="w-full justify-start gap-2">
                <CheckSquareIcon />
                {t("showcase.tabs.rowSelection")}
              </TabsTrigger>
              <TabsTrigger value="drag-drop" class="w-full justify-start gap-2">
                <DragIcon />
                {t("showcase.tabs.dragDrop")}
              </TabsTrigger>
              <TabsTrigger value="editing" class="w-full justify-start gap-2">
                <PencilIcon />
                {t("showcase.tabs.rowEditing")}
              </TabsTrigger>
              <TabsTrigger value="expansion" class="w-full justify-start gap-2">
                <ExpandIcon />
                {t("showcase.tabs.expansion")}
              </TabsTrigger>
              <TabsTrigger value="pinning" class="w-full justify-start gap-2">
                <PinIcon />
                {t("showcase.tabs.columnPinning")}
              </TabsTrigger>
              <TabsTrigger value="settings" class="w-full justify-start gap-2">
                <GearIcon />
                {t("showcase.tabs.settings")}
              </TabsTrigger>
              <TabsTrigger value="virtual" class="w-full justify-start gap-2">
                <ScrollIcon />
                {t("showcase.tabs.virtualScroll")}
              </TabsTrigger>
            </TabsList>

            <div class="flex-1 min-w-0">
              <TabsContent value="sorting">
                <SortingDemo />
              </TabsContent>
              <TabsContent value="filtering">
                <FilteringDemo />
              </TabsContent>
              <TabsContent value="pagination">
                <PaginationDemo />
              </TabsContent>
              <TabsContent value="selection">
                <SelectionDemo />
              </TabsContent>
              <TabsContent value="drag-drop">
                <DragDropDemo />
              </TabsContent>
              <TabsContent value="editing">
                <EditingDemo />
              </TabsContent>
              <TabsContent value="expansion">
                <ExpansionDemo />
              </TabsContent>
              <TabsContent value="pinning">
                <ColumnPinningDemo />
              </TabsContent>
              <TabsContent value="settings">
                <SettingsDemo />
              </TabsContent>
              <TabsContent value="virtual">
                <VirtualDemo />
              </TabsContent>
            </div>
          </Tabs>
        </TabsContent>

        {/* Forms Section */}
        <TabsContent value="forms">
          <Tabs defaultValue="all-components" orientation="vertical" class="flex gap-6">
            <TabsList class="flex-col h-fit w-48 shrink-0 items-start bg-transparent">
              <TabsTrigger value="all-components" class="w-full justify-start gap-2">
                <RowsIcon />
                {t("showcase.tabs.allComponents")}
              </TabsTrigger>
              <TabsTrigger value="basic" class="w-full justify-start gap-2">
                <TextboxIcon />
                {t("showcase.tabs.basicForm")}
              </TabsTrigger>
              <TabsTrigger value="validation" class="w-full justify-start gap-2">
                <CheckSquareIcon />
                {t("showcase.tabs.validation")}
              </TabsTrigger>
              <TabsTrigger value="select" class="w-full justify-start gap-2">
                <FadersIcon />
                {t("showcase.tabs.selectFields")}
              </TabsTrigger>
              <TabsTrigger value="dynamic" class="w-full justify-start gap-2">
                <CodeIcon />
                {t("showcase.tabs.dynamicFields")}
              </TabsTrigger>
              <TabsTrigger value="multi-step" class="w-full justify-start gap-2">
                <StepsIcon />
                {t("showcase.tabs.multiStep")}
              </TabsTrigger>
              <TabsTrigger value="array" class="w-full justify-start gap-2">
                <ListNumbersIcon />
                {t("showcase.tabs.arrayFields")}
              </TabsTrigger>
              <TabsTrigger value="sections" class="w-full justify-start gap-2">
                <NoteIcon />
                {t("showcase.tabs.sections")}
              </TabsTrigger>
              <TabsTrigger value="rich-text" class="w-full justify-start gap-2">
                <PencilIcon />
                {t("showcase.tabs.richText")}
              </TabsTrigger>
              <TabsTrigger value="media-picker" class="w-full justify-start gap-2">
                <CloudIcon />
                {t("showcase.tabs.mediaPicker")}
              </TabsTrigger>
            </TabsList>

            <div class="flex-1 min-w-0">
              <TabsContent value="all-components">
                <AllComponentsDemo />
              </TabsContent>
              <TabsContent value="basic">
                <BasicFormDemo />
              </TabsContent>
              <TabsContent value="validation">
                <ValidationDemo />
              </TabsContent>
              <TabsContent value="select">
                <SelectFieldsDemo />
              </TabsContent>
              <TabsContent value="dynamic">
                <DynamicFieldsDemo />
              </TabsContent>
              <TabsContent value="multi-step">
                <MultiStepDemo />
              </TabsContent>
              <TabsContent value="array">
                <ArrayFieldsDemo />
              </TabsContent>
              <TabsContent value="sections">
                <SectionsDemo />
              </TabsContent>
              <TabsContent value="rich-text">
                <RichTextDemo />
              </TabsContent>
              <TabsContent value="media-picker">
                <MediaPickerDemo />
              </TabsContent>
            </div>
          </Tabs>
        </TabsContent>

        {/* Permissions Section */}
        <TabsContent value="permissions">
          <PermissionsDemo />
        </TabsContent>

        {/* Maps Section */}
        <TabsContent value="maps">
          <Tabs defaultValue="map-location" orientation="vertical" class="flex gap-6">
            <TabsList class="flex-col h-fit w-48 shrink-0 items-start bg-transparent">
              <TabsTrigger value="map-location" class="w-full justify-start gap-2">
                <MapPinIcon />
                {t("showcase.tabs.mapLocation")}
              </TabsTrigger>
              <TabsTrigger value="map-drawing" class="w-full justify-start gap-2">
                <PencilRulerIcon />
                {t("showcase.tabs.mapDrawing")}
              </TabsTrigger>
            </TabsList>
            <div class="flex-1 min-w-0">
              <TabsContent value="map-location">
                <MapLocationDemo />
              </TabsContent>
              <TabsContent value="map-drawing">
                <MapDrawingDemo />
              </TabsContent>
            </div>
          </Tabs>
        </TabsContent>

        {/* Charts Section */}
        <TabsContent value="charts">
          <ChartsShowcase />
        </TabsContent>

        {/* Components Section */}
        <TabsContent value="components">
          <ComponentsDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Components Demo ──────────────────────────────────────────────────────────

const demoAuditEntries: AuditLogEntry[] = [
  {
    id: "1",
    user: "Alex Rivera",
    action: "create",
    resource: "User: jane.doe@example.com",
    detail: "Created new editor account",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: "Sarah Chen",
    action: "update",
    resource: "Permissions: Editor Role",
    detail: "Added posts.publish permission",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    user: "Mike Ross",
    action: "delete",
    resource: "Post: Draft — Q4 Planning",
    timestamp: "Yesterday",
  },
  {
    id: "4",
    user: "Admin",
    action: "export",
    resource: "Users CSV",
    detail: "Exported 1,234 records",
    timestamp: "2 days ago",
  },
  {
    id: "5",
    user: "Sarah Chen",
    action: "login",
    resource: "Dashboard",
    timestamp: "3 days ago",
  },
];

const demoStats = [
  {
    title: "Total Users",
    value: "2,847",
    trend: { value: "+12.5%", direction: "up" as const },
    description: "from last month",
  },
  {
    title: "Active Sessions",
    value: "573",
    trend: { value: "+8.2%", direction: "up" as const },
    description: "currently online",
  },
  {
    title: "Revenue",
    value: "$45,231",
    trend: { value: "+20.1%", direction: "up" as const },
    description: "from last month",
  },
  {
    title: "Bounce Rate",
    value: "24.3%",
    trend: { value: "-3.1%", direction: "down" as const },
    description: "from last month",
  },
  {
    title: "API Calls",
    value: "1.2M",
    trend: { value: "0%", direction: "neutral" as const },
    description: "no change",
  },
  {
    title: "Error Rate",
    value: "0.12%",
    trend: { value: "-0.05%", direction: "down" as const },
    description: "from last week",
  },
];

function ComponentsDemo() {
  return (
    <div class="space-y-8">
      {/* Stat Cards */}
      <div class="space-y-4">
        <div>
          <h2 class="text-xl font-semibold">StatCard</h2>
          <p class="text-sm text-muted-foreground">
            KPI / metric cards with trend indicators. Use for dashboards and overview pages.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={demoStats}>
            {(stat) => (
              <StatCard
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                description={stat.description}
              />
            )}
          </For>
        </div>
      </div>

      <Separator />

      {/* Audit Log */}
      <div class="space-y-4">
        <div>
          <h2 class="text-xl font-semibold">AuditLog</h2>
          <p class="text-sm text-muted-foreground">
            Activity feed with action types, timestamps, and user attribution. Use for audit trails
            and activity history.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditLog entries={demoAuditEntries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
