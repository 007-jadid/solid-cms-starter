import { createMemo, For, Show } from "solid-js";
import { Button } from "../components/button";
import { FieldRenderer } from "./field-renderer";
import { ArrayFieldInput } from "./fields";
import { createFormState } from "./form-context";
import { Row, Section } from "./form-layout";
import { createStepIndicator } from "./step-indicator";
import type { FormComponents, FormConfig, FormProps } from "./types";

/**
 * Creates a form with all components and state management.
 * Main entry point for form creation.
 */
export function createForm<TValues extends object>(
  config: FormConfig<TValues>,
): FormComponents<TValues> {
  // Initialize form state
  const formState = createFormState(config);

  const {
    values,
    isSubmitting,
    setIsSubmitting,
    fieldMap,
    getStepFields,
    validate,
    validateFields,
    reset,
    setValue,
    stepIndex,
    stepNavigation,
    setStepValidationStatus,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    isStepTransitioning,
    FormProvider,
    useForm,
  } = formState;

  // Create step indicator component
  const StepIndicator = createStepIndicator(config, stepIndex, stepNavigation);

  // Render field helper
  const RenderField = (props: { name: keyof TValues }) => {
    return <Field name={props.name} />;
  };

  // Main Form component
  const Form = (props: FormProps<TValues>) => {
    const handleSubmit = async (event: Event) => {
      event.preventDefault();

      // For multi-step forms, validate the final step
      if (config.layout?.multiStep?.enabled) {
        const stepFields = getStepFields(stepIndex());
        const isStepValid = validateFields(stepFields);
        if (!isStepValid) {
          setStepValidationStatus(stepIndex(), "invalid");
          return;
        }
      }

      if (!validate()) return;

      setIsSubmitting(true);
      try {
        const submitHandler = props.onSubmit ?? config.onSubmit;
        if (submitHandler) {
          await submitHandler(values);
        }
        if (config.resetOnSubmit) {
          reset();
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    const showSubmitButton = () => props.showSubmitButton !== false;

    // Filter sections based on current step
    const visibleSections = createMemo(() => {
      if (config.layout?.multiStep?.enabled && config.layout.sections) {
        const section = config.layout.sections[stepIndex()];
        return section ? [section] : [];
      }
      return config.layout?.sections || [];
    });

    return (
      <FormProvider>
        <form class={`space-y-6 ${props.class ?? ""}`} onSubmit={handleSubmit}>
          <Show when={config.layout?.multiStep?.enabled}>
            <StepIndicator />
          </Show>

          <Show
            when={visibleSections().length > 0}
            fallback={
              <Show when={!props.children && config.fields.length > 0} fallback={props.children}>
                <div
                  class="grid gap-4"
                  style={{
                    "grid-template-columns": `repeat(${config.columns ?? config.layout?.columns ?? 1}, minmax(0, 1fr))`,
                  }}
                >
                  <For each={config.fields}>{(field) => <RenderField name={field.name} />}</For>
                </div>
              </Show>
            }
          >
            <div
              class={`flex flex-col ${
                config.layout?.gap === "sm"
                  ? "gap-2"
                  : config.layout?.gap === "md"
                    ? "gap-4"
                    : config.layout?.gap === "lg"
                      ? "gap-6"
                      : config.layout?.gap === "xl"
                        ? "gap-8"
                        : "gap-4"
              }`}
            >
              <For each={visibleSections()}>
                {(section) => (
                  <Section
                    title={section.title || ""}
                    description={section.description}
                    columns={section.columns}
                  >
                    <For each={section.fields}>
                      {(fieldName) => <RenderField name={fieldName} />}
                    </For>
                  </Section>
                )}
              </For>
            </div>
          </Show>

          <Show when={showSubmitButton()}>
            <div class="flex items-center gap-3 justify-end pt-2">
              <Show when={config.layout?.multiStep?.enabled && !isFirstStep()}>
                <Button variant="outline" type="button" onClick={prevStep}>
                  Back
                </Button>
              </Show>
              <Show
                when={config.layout?.multiStep?.enabled && !isLastStep()}
                fallback={
                  <Button type="submit" disabled={isSubmitting()}>
                    <Show when={isSubmitting()} fallback={config.submitLabel || "Submit"}>
                      <svg
                        class="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </Show>
                  </Button>
                }
              >
                <Button type="button" onClick={nextStep} disabled={isStepTransitioning()}>
                  Next
                </Button>
              </Show>
            </div>
          </Show>
        </form>
      </FormProvider>
    );
  };

  // Field component - delegates to FieldRenderer
  const Field = (props: { name: keyof TValues; class?: string }) => {
    return (
      <FieldRenderer name={props.name} class={props.class} fieldMap={fieldMap} useForm={useForm} />
    );
  };

  // ArrayField wrapper component — uses closure state directly so it works
  // both inside and outside FormProvider.
  const ArrayField = (props: { name: keyof TValues }) => {
    const field = fieldMap().get(props.name);

    if (!field || !field.arrayConfig) {
      return <div>Array field configuration missing</div>;
    }

    return (
      <ArrayFieldInput
        field={field}
        name={props.name}
        form={{ values, setValue } as unknown as import("./types").FormContextValue<TValues>}
      />
    );
  };

  return {
    Form,
    Field,
    Section,
    Row,
    StepIndicator,
    ArrayField,
    useForm,
    setValue,
    stepNavigation,
    step: stepIndex,
    nextStep,
    prevStep,
  };
}
