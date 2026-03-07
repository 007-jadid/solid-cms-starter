import { createForm as createTanStackForm } from "@tanstack/solid-form";
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  on,
  untrack,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { safeParse as vSafeParse } from "valibot";
import type {
  FieldConfig,
  FormConfig,
  FormContextValue,
  StepNavigation,
  StepStatus,
} from "./types";

/**
 * Creates form state and context for a form configuration.
 * Uses @tanstack/solid-form as the underlying state engine,
 * bridged to the existing config-driven API.
 */
export function createFormState<TValues extends object>(config: FormConfig<TValues>) {
  const FormContext = createContext<FormContextValue<TValues>>();

  // TanStack Form instance (source of truth for form state)
  // Guarded with isServer check — createTanStackForm uses client-only SolidJS primitives
  const tanstackForm = isServer
    ? null
    : createTanStackForm(() => ({
        defaultValues: config.defaultValues,
        onSubmit: async () => {}, // Submission handled externally in form-factory
      }));

  // Parallel SolidJS stores for backward-compatible reactivity
  const [values, setValues] = createStore<TValues>(config.defaultValues);
  const [errors, setErrors] = createStore<Partial<Record<keyof TValues, string>>>({});
  const [touched, setTouched] = createStore<Partial<Record<keyof TValues, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  // Multi-step state
  const [stepIndex, setStepIndex] = createSignal(config.layout?.multiStep?.initialStep ?? 0);
  const [isStepTransitioning, setIsStepTransitioning] = createSignal(false);
  const [stepValidationStatus, setStepValidationStatus] = createStore<Record<number, StepStatus>>(
    {},
  );

  // Field map for quick lookup
  const fieldMap = createMemo(() => {
    const map = new Map<keyof TValues, FieldConfig<TValues>>();
    for (const field of config.fields) map.set(field.name, field);
    return map;
  });

  // Get fields for a specific step
  const getStepFields = (stepIdx: number): Array<keyof TValues> => {
    if (config.layout?.multiStep?.enabled && config.layout.sections) {
      const section = config.layout.sections[stepIdx];
      return section?.fields || [];
    }
    return [];
  };

  // Validate specific fields only
  const validateFields = (fieldNames: Array<keyof TValues>): boolean => {
    if (!config.schema) return true;
    const result = untrack(() => vSafeParse(config.schema!, values));
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TValues, string>> = {};
      let hasError = false;
      result.issues.forEach((issue) => {
        const key = issue.path?.[0]?.key as keyof TValues;
        if (key && fieldNames.includes(key)) {
          fieldErrors[key] = issue.message;
          hasError = true;
        }
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      return !hasError;
    }
    // Clear errors for these fields
    fieldNames.forEach((field) => {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    });
    return true;
  };

  // Validate all fields
  const validate = (): boolean => {
    if (!config.schema) return true;
    const result = untrack(() => vSafeParse(config.schema!, values));
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TValues, string>> = {};
      result.issues.forEach((issue) => {
        const key = issue.path?.[0]?.key as keyof TValues;
        if (key) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  // Validate single field
  const validateField = (field: keyof TValues): boolean => {
    if (!config.schema) return true;
    const result = untrack(() => vSafeParse(config.schema!, values));
    if (!result.success) {
      const issue = result.issues.find((i) => i.path?.[0]?.key === field);
      if (issue) {
        setErrors((prev) => ({ ...prev, [field]: issue.message }));
        return false;
      }
    }
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    return true;
  };

  const validationMode = () => config.validationMode || "onChange";

  // Set a field value with validation (bridges TanStack + SolidJS store)
  const setValue = <K extends keyof TValues>(key: K, value: TValues[K]) => {
    // Update TanStack form (source of truth)
    tanstackForm?.setFieldValue(String(key), value as never);
    // Sync to parallel SolidJS store for backward-compatible reactivity
    (setValues as (key: string, value: unknown) => void)(String(key), value);

    if (validationMode() === "onChange") {
      setTouched((prev) => ({ ...prev, [key]: true }));
      validateField(key);
    }
  };

  // Handle field blur (bridges TanStack + SolidJS store)
  const handleBlur = <K extends keyof TValues>(key: K) => {
    tanstackForm?.setFieldMeta(String(key), (prev) => ({
      ...prev,
      isTouched: true,
    }));
    setTouched((prev) => ({ ...prev, [key]: true }));
    if (validationMode() === "onBlur") {
      validateField(key);
    }
  };

  // Reset form to default values
  const reset = () => {
    tanstackForm?.reset();
    setValues(config.defaultValues);
    setErrors({});
    setTouched({});
    setStepIndex(0);
  };

  // Computed validity
  const isValid = createMemo(() => {
    if (!config.schema) return true;
    const result = vSafeParse(config.schema, values);
    return result.success;
  });

  // Form context value
  const formContext: FormContextValue<TValues> = {
    values,
    errors,
    touched,
    setValue,
    setFieldValue: setValue,
    setTouched: (key, value) =>
      setTouched((prev) => ({
        ...prev,
        [key]: value,
      })),
    handleBlur,
    validate,
    validateField,
    isSubmitting,
    isValid,
    reset,
  };

  // Computed fields — one targeted effect per computed field,
  // watching only the declared dependencies (not the entire store).
  config.fields.forEach((field) => {
    if (field.computed) {
      const { dependencies, compute } = field.computed;
      createEffect(
        on(
          () => dependencies.map((dep) => values[dep]),
          () => {
            const computedValue = compute(values);
            if (values[field.name] !== computedValue) {
              setValue(field.name, computedValue as TValues[keyof TValues]);
            }
          },
        ),
      );
    }
  });

  // Form effects — one targeted effect per declared effect,
  // watching only the specified watch keys.
  config.effects?.forEach((effect) => {
    createEffect(
      on(
        () => effect.watch.map((key) => values[key]),
        (curr, prev) => {
          if (!prev) return; // skip initial run
          const changedIdx = curr.findIndex((v, i) => v !== prev[i]);
          if (changedIdx >= 0) {
            effect.handler(values, formContext, effect.watch[changedIdx]);
          }
        },
      ),
    );
  });

  // Step navigation
  const totalSteps = config.layout?.multiStep?.enabled ? (config.layout.sections?.length ?? 1) : 1;

  const isFirstStep = createMemo(() => stepIndex() === 0);
  const isLastStep = createMemo(() => stepIndex() === totalSteps - 1);

  const getStepStatus = (index: number): StepStatus => {
    if (index === stepIndex()) return "current";
    return stepValidationStatus[index] || "pending";
  };

  const nextStep = async (): Promise<boolean> => {
    if (isLastStep()) return false;

    const validationMode = config.layout?.multiStep?.validationMode || "onNext";

    if (validationMode === "onNext") {
      setIsStepTransitioning(true);
      const stepFields = getStepFields(stepIndex());
      const isStepValid = validateFields(stepFields);

      if (!isStepValid) {
        setStepValidationStatus(stepIndex(), "invalid");
        setIsStepTransitioning(false);
        return false;
      }

      setStepValidationStatus(stepIndex(), "valid");
      setIsStepTransitioning(false);
    }

    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
    return true;
  };

  const prevStep = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = async (index: number): Promise<boolean> => {
    if (index < 0 || index >= totalSteps) return false;

    const allowJump = config.layout?.multiStep?.allowJumpToStep ?? false;

    if (!allowJump && index > stepIndex()) {
      return false;
    }

    if (index > stepIndex()) {
      const stepFields = getStepFields(stepIndex());
      const isStepValid = validateFields(stepFields);
      if (!isStepValid) {
        setStepValidationStatus(stepIndex(), "invalid");
        return false;
      }
      setStepValidationStatus(stepIndex(), "valid");
    }

    setStepIndex(index);
    return true;
  };

  const canGoToStep = (index: number): boolean => {
    if (index < 0 || index >= totalSteps) return false;
    if (index < stepIndex()) return true;
    if (index === stepIndex()) return true;
    const allowJump = config.layout?.multiStep?.allowJumpToStep ?? false;
    return allowJump;
  };

  const stepNavigation: StepNavigation = {
    currentStep: stepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    isStepTransitioning,
    nextStep,
    prevStep,
    goToStep,
    getStepStatus,
    canGoToStep,
  };

  // Form Provider component
  const FormProvider = (props: { children: JSX.Element }) => {
    return <FormContext.Provider value={formContext}>{props.children}</FormContext.Provider>;
  };

  // Hook to access form context
  const useForm = () => {
    const ctx = useContext(FormContext);
    if (!ctx) throw new Error("useForm must be used within Form");
    return ctx;
  };

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    isValid,
    // Field utilities
    fieldMap,
    getStepFields,
    // Validation
    validate,
    validateField,
    validateFields,
    // Actions
    setValue,
    handleBlur,
    reset,
    // Step navigation
    stepIndex,
    stepNavigation,
    stepValidationStatus,
    setStepValidationStatus,
    totalSteps,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    getStepStatus,
    canGoToStep,
    isStepTransitioning,
    // Context
    FormContext,
    FormProvider,
    useForm,
    formContext,
    // TanStack Form instance (for advanced direct access)
    tanstackForm,
  };
}
