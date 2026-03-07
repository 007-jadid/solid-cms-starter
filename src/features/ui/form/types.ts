import type { Accessor, JSX } from "solid-js";
import type { GenericSchema } from "valibot";

// Index signature helper for form data types
export type FormDataType = Record<string, unknown>;

// ========================================
// Field Dependencies Types
// ========================================

/**
 * A value that can be static or dynamically computed from form values.
 * Maintains backward compatibility with static values.
 * @example
 * disabled: true
 * disabled: (values) => values.paymentMethod !== 'credit'
 */
export type DynamicValue<TValues, TResult> = TResult | ((values: TValues) => TResult);

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "password"
  | "textarea"
  | "select"
  | "checkbox"
  | "switch"
  | "date"
  | "date-range"
  | "time"
  | "datetime"
  | "slider"
  | "array"
  | "otp"
  | "radio-group"
  | "file"
  | "color"
  | "tags"
  | "phone"
  | "url"
  | "search"
  | "rating"
  | "richtext"
  | "media"
  | "map";

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface SectionConfig<TValues> {
  id: string;
  title?: string;
  description?: string;
  columns?: number;
  fields: Array<keyof TValues>;
  /** Optional validation for this specific step */
  stepValidation?: (values: TValues) => boolean | Promise<boolean>;
  /** Whether to skip this step based on form values */
  skipIf?: (values: TValues) => boolean;
}

export interface MultiStepConfig {
  enabled: boolean;
  /** Initial step (default: 0) */
  initialStep?: number;
  /**
   * Validation mode for step transitions
   * - 'onChange': Validate as user types
   * - 'onNext': Validate only when clicking "Next" (default)
   * - 'onSubmit': Only validate on final submit
   */
  validationMode?: "onNext" | "onChange" | "onSubmit";
  /** Allow navigating to any step via indicator (default: false) */
  allowJumpToStep?: boolean;
  /** Custom step labels (overrides section titles in indicator) */
  stepLabels?: string[];
}

export interface LayoutConfig<TValues> {
  gap?: "sm" | "md" | "lg" | "xl";
  sections?: Array<SectionConfig<TValues>>;
  multiStep?: MultiStepConfig;
  columns?: number;
}

// Async select options configuration
export interface AsyncSelectConfig<TOption = unknown> {
  apiUrl: string;
  searchable?: boolean;
  paginated?: boolean;
  optionMapper: (item: TOption) => FieldOption;
  searchParam?: string;
  pageParam?: string;
  pageSizeParam?: string;
  pageSize?: number;
}

// Array field configuration for dynamic field lists
export interface ArrayFieldConfig<TValues> {
  itemFields: Array<FieldConfig<TValues>>;
  minItems?: number;
  maxItems?: number;
  addLabel?: string;
  removeLabel?: string;
}

// Number field specific configuration
export interface NumberFieldConfig {
  min?: number;
  max?: number;
  step?: number;
  formatOptions?: Intl.NumberFormatOptions;
}

// Date field specific configuration
export interface DateFieldConfig {
  minDate?: Date | string;
  maxDate?: Date | string;
}

// Slider field specific configuration
export interface SliderFieldConfig {
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}

// OTP field specific configuration
export interface OTPFieldConfig {
  length?: number;
  pattern?: string;
}

// File upload field configuration
export interface FileFieldConfig {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
}

// Tags/multi-input field configuration
export interface TagsFieldConfig {
  maxTags?: number;
  allowDuplicates?: boolean;
  placeholder?: string;
}

// Rating field configuration
export interface RatingFieldConfig {
  max?: number;
  allowHalf?: boolean;
}

// Color field configuration
export interface ColorFieldConfig {
  presets?: string[];
}

// Rich text editor configuration
export interface RichTextFieldConfig {
  maxLength?: number;
  minHeight?: string;
}

// Media picker field configuration
export interface MediaFieldConfig {
  multiple?: boolean;
  accept?: string;
}

// Map field configuration
export interface MapFieldConfig {
  /** Map provider. Default: { type: "leaflet" } */
  provider?: import("~/features/ui/components/map").MapProviderConfig;
  /** Initial map center [lat, lng]. Default: [23.8103, 90.4125] */
  defaultCenter?: [number, number];
  /** Initial zoom level. Default: 13 */
  defaultZoom?: number;
  /** Height of the map. Default: "360px" */
  height?: string;
  /** Whether the marker is draggable. Default: true */
  draggableMarker?: boolean;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
}

export interface FieldConfig<TValues> {
  name: keyof TValues;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  options?: FieldOption[];
  /**
   * Whether the field is disabled. Can be a static boolean or a function
   * that receives form values and returns a boolean.
   * @example
   * disabled: true
   * disabled: (values) => values.paymentMethod !== 'credit'
   */
  disabled?: DynamicValue<TValues, boolean>;
  required?: boolean;
  colSpan?: number;
  rows?: number; // For textarea
  dependsOn?: keyof TValues;
  showWhen?: (values: TValues) => boolean;
  hidden?: (values: TValues) => boolean;
  computed?: {
    dependencies: Array<keyof TValues>;
    compute: (values: TValues) => unknown;
  };
  // Async select configuration
  asyncOptions?: AsyncSelectConfig;
  // Array field configuration
  arrayConfig?: ArrayFieldConfig<Record<string, unknown>>;
  // Number field configuration
  numberConfig?: NumberFieldConfig;
  // Date field configuration
  dateConfig?: DateFieldConfig;
  // Slider field configuration
  sliderConfig?: SliderFieldConfig;
  // OTP field configuration
  otpConfig?: OTPFieldConfig;
  // File upload configuration
  fileConfig?: FileFieldConfig;
  // Tags/multi-input configuration
  tagsConfig?: TagsFieldConfig;
  // Rating configuration
  ratingConfig?: RatingFieldConfig;
  // Color picker configuration
  colorConfig?: ColorFieldConfig;
  // Rich text editor configuration
  richtextConfig?: RichTextFieldConfig;
  // Media picker configuration
  mediaConfig?: MediaFieldConfig;
  // Map field configuration
  mapConfig?: MapFieldConfig;
  // Multiple select
  multiple?: boolean;
  // Searchable select
  searchable?: boolean;
  // Step assignment (for multi-step forms without sections)
  step?: number;
  // Default value (for testing / initial population)
  defaultValue?: unknown;
  // Per-field validation function
  validation?: (value: unknown) => string | null;
}

export interface FormEffect<TValues> {
  watch: Array<keyof TValues>;
  handler: (values: TValues, form: FormContextValue<TValues>, changedField: keyof TValues) => void;
}

export interface FormStep<TValues> {
  id: string;
  title: string;
  fields: Array<keyof TValues>;
}

export interface FormConfig<TValues> {
  defaultValues: TValues;
  schema?: GenericSchema;
  fields: Array<FieldConfig<TValues>>;
  steps?: Array<FormStep<TValues>>;
  layout?: LayoutConfig<TValues>;
  effects?: Array<FormEffect<TValues>>;
  onSubmit?: (values: TValues) => Promise<void> | void;
  submitLabel?: string;
  resetOnSubmit?: boolean;
  /** Number of columns in the form grid */
  columns?: number;
  /**
   * Validation mode for form fields
   * - 'onChange': Validate as user types (default)
   * - 'onBlur': Validate when field loses focus
   * - 'onSubmit': Only validate on form submission
   */
  validationMode?: "onChange" | "onBlur" | "onSubmit";
}

export interface FormContextValue<TValues> {
  values: TValues;
  errors: Partial<Record<keyof TValues, string>>;
  touched: Partial<Record<keyof TValues, boolean>>;
  setValue: <K extends keyof TValues>(key: K, value: TValues[K]) => void;
  setFieldValue: <K extends keyof TValues>(key: K, value: TValues[K]) => void;
  setTouched: <K extends keyof TValues>(key: K, value: boolean) => void;
  /** Handles field blur - sets touched and triggers validation based on mode */
  handleBlur: <K extends keyof TValues>(key: K) => void;
  validate: () => boolean;
  validateField: (field: keyof TValues) => boolean;
  isSubmitting: Accessor<boolean>;
  isValid: Accessor<boolean>;
  reset: () => void;
}

export type StepStatus = "pending" | "valid" | "invalid" | "current";

export interface StepNavigation {
  currentStep: Accessor<number>;
  totalSteps: number;
  isFirstStep: Accessor<boolean>;
  isLastStep: Accessor<boolean>;
  isStepTransitioning: Accessor<boolean>;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  goToStep: (index: number) => Promise<boolean>;
  getStepStatus: (index: number) => StepStatus;
  /** Check if a specific step can be navigated to */
  canGoToStep: (index: number) => boolean;
}

/**
 * Props for the StepIndicator compound component
 */
export interface StepIndicatorProps {
  /** Visual variant */
  variant?: "dots" | "numbers" | "progress" | "breadcrumb";
  /** Additional className */
  class?: string;
  /** Show step labels */
  showLabels?: boolean;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
}

export interface FormProps<TValues> {
  children?: JSX.Element;
  class?: string;
  onSubmit?: (values: TValues) => Promise<void> | void;
  showSubmitButton?: boolean;
}

export interface FormComponents<TValues> {
  Form: (props: FormProps<TValues>) => JSX.Element;
  Field: (props: { name: keyof TValues; class?: string }) => JSX.Element;
  Section: (props: {
    title: string;
    description?: string;
    columns?: number;
    children: JSX.Element;
  }) => JSX.Element;
  Row: (props: { children: JSX.Element }) => JSX.Element;
  StepIndicator: (props?: StepIndicatorProps) => JSX.Element;
  ArrayField: (props: { name: keyof TValues }) => JSX.Element;
  useForm: () => FormContextValue<TValues>;
  setValue: <K extends keyof TValues>(key: K, value: TValues[K]) => void;
  stepNavigation: StepNavigation;
  step: Accessor<number>;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
}

// Dialog form configuration
export interface DialogFormConfig<TValues> {
  title: string;
  description?: string;
  formConfig: FormConfig<TValues>;
  onSuccess?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  size?: "sm" | "md" | "lg" | "xl";
}
