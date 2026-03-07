import { createEffect, createSignal, on, onCleanup } from "solid-js";
import * as v from "valibot";
import { useI18n } from "~/features/context/i18n";
import { EASE_OUT_EXPO, gsap } from "~/features/lib/gsap";
import { staggerChildren } from "~/features/lib/gsap-directives";
import { Button } from "~/features/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import {
  FormAutosaveIndicator,
  type FormAutosaveState,
} from "~/features/ui/components/form-autosave-indicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/features/ui/components/tabs";
import { FormDialogProvider, useFormDialog } from "~/features/ui/form/form-dialog";
import { createForm } from "~/features/ui/form/form-factory";
import { PageHeader } from "~/features/ui/layout/page-header";
import {
  advancedFormConfig,
  customerFormConfig,
  onboardingFormConfig,
  orderFormConfig,
  teamFormConfig,
} from "./configs";

void staggerChildren;

export function FormsPage() {
  return (
    <FormDialogProvider>
      <FormsPageContent />
    </FormDialogProvider>
  );
}

function FormsPageContent() {
  const [activeTab, setActiveTab] = createSignal("basic");
  const { showDialog } = useFormDialog();
  const { t } = useI18n();
  let tabContentRef!: HTMLDivElement;
  let autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  const [autosaveState, setAutosaveState] = createSignal<FormAutosaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = createSignal<Date | null>(null);

  const runAutosave = async () => {
    setAutosaveState("saving");
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setLastSavedAt(new Date());
      setAutosaveState("saved");
    } catch {
      setAutosaveState("error");
    }
  };

  const queueAutosave = () => {
    if (activeTab() !== "basic") return;
    setAutosaveState("dirty");
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      void runAutosave();
    }, 900);
  };

  onCleanup(() => {
    if (autosaveTimer) clearTimeout(autosaveTimer);
  });

  // Animate tab content on switch
  createEffect(
    on(
      activeTab,
      () => {
        if (tabContentRef) {
          gsap.fromTo(
            tabContentRef,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.3, ease: EASE_OUT_EXPO },
          );
        }
      },
      { defer: true },
    ),
  );

  // Create form instances
  const customerForm = createForm(customerFormConfig);
  const orderForm = createForm(orderFormConfig);
  const onboardingForm = createForm(onboardingFormConfig);
  const advancedForm = createForm(advancedFormConfig);
  const teamForm = createForm(teamFormConfig);

  // Dialog Form Example
  const quickContactSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, "Name required")),
    email: v.pipe(v.string(), v.email("Invalid email")),
    message: v.pipe(v.string(), v.minLength(10, "Message must be at least 10 characters")),
  });

  type QuickContactData = v.InferOutput<typeof quickContactSchema>;

  const openQuickContactDialog = () => {
    showDialog<QuickContactData>({
      title: "Quick Contact",
      description: "Send us a message and we'll get back to you.",
      size: "md",
      formConfig: {
        defaultValues: { name: "", email: "", message: "" },
        schema: quickContactSchema,
        fields: [
          { name: "name", label: "Your Name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          {
            name: "message",
            label: "Message",
            type: "textarea",
            required: true,
            rows: 4,
          },
        ],
        onSubmit: async (values) => {
          console.log("Contact form submitted:", values);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          alert("Message sent!");
        },
        submitLabel: "Send Message",
      },
      onSuccess: () => {
        console.log("Dialog closed successfully");
      },
    });
  };

  return (
    <div class="space-y-6" use:staggerChildren={{ stagger: 0.08 }}>
      <PageHeader title={t("forms.title")} description={t("forms.description")} />

      <Tabs value={activeTab()} onChange={setActiveTab}>
        <TabsList class="grid w-full grid-cols-6">
          <TabsTrigger value="basic">{t("forms.tabs.basic")}</TabsTrigger>
          <TabsTrigger value="computed">{t("forms.tabs.computed")}</TabsTrigger>
          <TabsTrigger value="wizard">{t("forms.tabs.wizard")}</TabsTrigger>
          <TabsTrigger value="advanced">{t("forms.tabs.advanced")}</TabsTrigger>
          <TabsTrigger value="array">{t("forms.tabs.array")}</TabsTrigger>
          <TabsTrigger value="dialog">{t("forms.tabs.dialog")}</TabsTrigger>
        </TabsList>

        <div ref={tabContentRef}>
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>{t("forms.customer.title")}</CardTitle>
                <CardDescription>{t("forms.customer.description")}</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4" onInput={queueAutosave} onChange={queueAutosave}>
                <FormAutosaveIndicator
                  state={autosaveState()}
                  lastSavedAt={lastSavedAt()}
                  onRetry={() => void runAutosave()}
                />
                <customerForm.Form />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="computed">
            <Card>
              <CardHeader>
                <CardTitle>{t("forms.order.title")}</CardTitle>
                <CardDescription>{t("forms.order.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <orderForm.Form />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wizard">
            <Card>
              <CardHeader>
                <CardTitle>{t("forms.wizard.title")}</CardTitle>
                <CardDescription>{t("forms.wizard.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <onboardingForm.Form />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>{t("forms.advancedFields.title")}</CardTitle>
                <CardDescription>{t("forms.advancedFields.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <advancedForm.Form />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="array">
            <Card>
              <CardHeader>
                <CardTitle>{t("forms.arrayFields.title")}</CardTitle>
                <CardDescription>{t("forms.arrayFields.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <teamForm.Form />
                <div class="mt-6">
                  <teamForm.ArrayField name="members" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dialog">
            <Card>
              <CardHeader>
                <CardTitle>{t("forms.dialogForm.title")}</CardTitle>
                <CardDescription>{t("forms.dialogForm.description")}</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-muted-foreground">{t("forms.dialogForm.instructionText")}</p>
                <Button onClick={openQuickContactDialog}>{t("forms.dialogForm.openButton")}</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
