import { createContext, createSignal, type JSX, Show, useContext } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/dialog";
import { createForm } from "./form-factory";
import type { DialogFormConfig, FormConfig } from "./types";

interface DialogState {
  isOpen: boolean;
  content: JSX.Element | null;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

interface FormDialogContextValue {
  showDialog: <TValues extends Record<string, unknown>>(config: DialogFormConfig<TValues>) => void;
  closeDialog: () => void;
}

const FormDialogContext = createContext<FormDialogContextValue>();

// Get size class for dialog
function getDialogSizeClass(size?: "sm" | "md" | "lg" | "xl"): string {
  switch (size) {
    case "sm":
      return "max-w-sm";
    case "md":
      return "max-w-md";
    case "lg":
      return "max-w-lg";
    case "xl":
      return "max-w-xl";
    default:
      return "max-w-md";
  }
}

/**
 * Hook to access form dialog functions
 */
export function useFormDialog() {
  const context = useContext(FormDialogContext);
  if (!context) {
    throw new Error("useFormDialog must be used within a FormDialogProvider");
  }
  return context;
}

/**
 * Form Dialog Provider - render this once in your app layout
 */
export function FormDialogProvider(props: { children: JSX.Element }): JSX.Element {
  const [dialogState, setDialogState] = createSignal<DialogState>({
    isOpen: false,
    content: null,
    title: "",
    description: undefined,
    size: "md",
  });

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      content: null,
      title: "",
      description: undefined,
      size: "md",
    });
  };

  const showDialog = <TValues extends Record<string, unknown>>(
    config: DialogFormConfig<TValues>,
  ) => {
    const form = createForm({
      ...config.formConfig,
      onSubmit: async (values) => {
        await config.formConfig.onSubmit?.(values);
        config.onSuccess?.();
        closeDialog();
      },
    });

    setDialogState({
      isOpen: true,
      content: <form.Form />,
      title: config.title,
      description: config.description,
      size: config.size,
    });
  };

  const contextValue: FormDialogContextValue = {
    showDialog,
    closeDialog,
  };

  return (
    <FormDialogContext.Provider value={contextValue}>
      {props.children}
      <Dialog
        open={dialogState().isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeDialog();
          }
        }}
      >
        <DialogContent class={getDialogSizeClass(dialogState().size)}>
          <DialogHeader>
            <DialogTitle>{dialogState().title}</DialogTitle>
            <Show when={dialogState().description}>
              <DialogDescription>{dialogState().description}</DialogDescription>
            </Show>
          </DialogHeader>
          {dialogState().content}
        </DialogContent>
      </Dialog>
    </FormDialogContext.Provider>
  );
}

/**
 * Utility to create form configurations for dialogs
 * Useful for create/edit patterns with DataTable
 */
export function createDialogFormConfig<
  TValues extends Record<string, unknown>,
  TEntity extends Record<string, unknown> = TValues,
>(options: {
  /** Title for create mode */
  createTitle: string;
  /** Title for edit mode */
  editTitle: string;
  /** Description (optional) */
  description?: string;
  /** Form configuration */
  formConfig: Omit<FormConfig<TValues>, "onSubmit" | "defaultValues">;
  /** Default values for create mode */
  defaultValues: TValues;
  /** Map entity to form values for edit mode */
  entityToFormValues?: (entity: TEntity) => TValues;
  /** Create handler */
  onCreate: (values: TValues) => Promise<void>;
  /** Update handler */
  onUpdate: (id: string | number, values: TValues) => Promise<void>;
  /** Success callback */
  onSuccess?: () => void;
  /** Dialog size */
  size?: "sm" | "md" | "lg" | "xl";
}) {
  return {
    getCreateConfig: (): DialogFormConfig<TValues> => ({
      title: options.createTitle,
      description: options.description,
      size: options.size,
      formConfig: {
        ...options.formConfig,
        defaultValues: options.defaultValues,
        onSubmit: async (values) => {
          await options.onCreate(values);
        },
      },
      onSuccess: options.onSuccess,
    }),
    getEditConfig: (entity: TEntity, id: string | number): DialogFormConfig<TValues> => {
      const formValues = options.entityToFormValues
        ? options.entityToFormValues(entity)
        : (entity as unknown as TValues);

      return {
        title: options.editTitle,
        description: options.description,
        size: options.size,
        formConfig: {
          ...options.formConfig,
          defaultValues: formValues,
          onSubmit: async (values) => {
            await options.onUpdate(id, values);
          },
        },
        onSuccess: options.onSuccess,
      };
    },
  };
}
