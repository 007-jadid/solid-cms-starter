import { For, Show } from "solid-js";
import type {
  FormConfig,
  SectionConfig,
  StepIndicatorProps,
  StepNavigation,
  StepStatus,
} from "./types";

/**
 * Creates a StepIndicator component for multi-step forms.
 */
export function createStepIndicator<TValues extends object>(
  config: FormConfig<TValues>,
  stepIndex: () => number,
  stepNavigation: StepNavigation,
) {
  const { totalSteps, getStepStatus, goToStep, canGoToStep } = stepNavigation;

  /**
   * StepIndicator component with multiple visual variants.
   * Supports: dots, numbers, progress, breadcrumb
   */
  const StepIndicator = (props: StepIndicatorProps = {}) => {
    const variant = () => props.variant ?? "numbers";
    const showLabels = () => props.showLabels ?? true;
    const orientation = () => props.orientation ?? "horizontal";
    const isHorizontal = () => orientation() === "horizontal";
    const stepLabels = () => config.layout?.multiStep?.stepLabels;

    const getStatusClasses = (status: StepStatus) => {
      switch (status) {
        case "current":
          return "bg-primary text-primary-foreground border-primary";
        case "valid":
          return "bg-green-500 text-white border-green-500";
        case "invalid":
          return "bg-destructive text-destructive-foreground border-destructive";
        default:
          return "bg-muted text-muted-foreground border-muted-foreground/30";
      }
    };

    const getConnectorClasses = (index: number) => {
      const status = getStepStatus(index);
      if (status === "valid" || index < stepIndex()) {
        return "bg-primary";
      }
      return "bg-muted";
    };

    const getLabel = (section: SectionConfig<TValues>, index: number) =>
      stepLabels()?.[index] ?? section.title;

    // Progress bar variant
    const ProgressVariant = () => {
      const progress = () => ((stepIndex() + 1) / totalSteps) * 100;
      const currentStepLabel = () => getLabel(config.layout!.sections![stepIndex()], stepIndex());

      return (
        <div class={`w-full ${props.class ?? ""}`}>
          <div class="flex justify-between mb-2 text-sm">
            <span class="font-medium">
              Step {stepIndex() + 1} of {totalSteps}
              <Show when={currentStepLabel()}>
                <span class="text-muted-foreground ml-2">- {currentStepLabel()}</span>
              </Show>
            </span>
            <span class="text-muted-foreground">{Math.round(progress())}%</span>
          </div>
          <div class="h-2 bg-muted rounded-full overflow-hidden">
            <div
              class="h-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${progress()}%` }}
            />
          </div>
        </div>
      );
    };

    // Breadcrumb variant
    const BreadcrumbVariant = () => (
      <nav class={`flex items-center ${props.class ?? ""}`} aria-label="Progress">
        <ol class={`flex items-center ${isHorizontal() ? "gap-2" : "flex-col gap-2"}`}>
          <For each={config.layout!.sections}>
            {(section, index) => {
              const status = () => getStepStatus(index());
              const canNav = () => canGoToStep(index());
              const label = () => getLabel(section, index());

              return (
                <li class="flex items-center">
                  <Show when={index() > 0 && isHorizontal()}>
                    <span class="mx-2 text-muted-foreground">/</span>
                  </Show>
                  <button
                    type="button"
                    onClick={() => canNav() && goToStep(index())}
                    disabled={!canNav()}
                    class={`text-sm transition-colors ${
                      status() === "current"
                        ? "font-medium text-primary"
                        : status() === "valid"
                          ? "text-green-600"
                          : status() === "invalid"
                            ? "text-destructive"
                            : "text-muted-foreground"
                    } ${canNav() ? "hover:underline cursor-pointer" : "cursor-not-allowed"}`}
                  >
                    {label() || `Step ${index() + 1}`}
                  </button>
                </li>
              );
            }}
          </For>
        </ol>
      </nav>
    );

    // Dots and Numbers variants
    const DotsNumbersVariant = () => (
      <div
        class={`flex ${
          isHorizontal() ? "flex-row items-center justify-center" : "flex-col items-start gap-4"
        } ${props.class ?? ""}`}
      >
        <For each={config.layout!.sections}>
          {(section, index) => {
            const status = () => getStepStatus(index());
            const canNav = () => canGoToStep(index());
            const label = () => getLabel(section, index());
            const isActive = () => index() === stepIndex();

            return (
              <div class={`flex items-center ${isHorizontal() ? "flex-row" : "flex-row gap-3"}`}>
                {/* Connector line (before, except first) - horizontal only */}
                <Show when={index() > 0 && isHorizontal()}>
                  <div
                    class={`h-0.5 w-8 transition-colors duration-300 ${getConnectorClasses(index() - 1)}`}
                  />
                </Show>

                {/* Step indicator */}
                <button
                  type="button"
                  onClick={() => canNav() && goToStep(index())}
                  disabled={!canNav()}
                  class={`flex items-center justify-center rounded-full border-2 transition-[transform,border-color,background-color] duration-200 ${
                    variant() === "dots" ? "w-3 h-3" : "w-8 h-8"
                  } ${getStatusClasses(status())} ${
                    canNav() ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"
                  }`}
                  aria-label={`Step ${index() + 1}${label() ? `: ${label()}` : ""}`}
                  aria-current={status() === "current" ? "step" : undefined}
                >
                  <Show when={variant() === "numbers"}>
                    <Show
                      when={status() === "valid" && !isActive()}
                      fallback={<span class="text-sm font-medium">{index() + 1}</span>}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="size-4"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </Show>
                  </Show>
                  <Show when={variant() === "dots" && isActive()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-2"
                    >
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                  </Show>
                </button>

                {/* Label */}
                <Show when={showLabels() && label()}>
                  <span
                    class={`text-sm whitespace-nowrap ${isHorizontal() ? "ml-2 mr-2" : ""} ${
                      isActive()
                        ? "font-medium text-foreground"
                        : status() === "valid"
                          ? "text-green-600"
                          : status() === "invalid"
                            ? "text-destructive"
                            : "text-muted-foreground"
                    }`}
                  >
                    {label()}
                  </span>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
    );

    return (
      <Show when={config.layout?.multiStep?.enabled && config.layout.sections}>
        <div class="mb-6">
          <Show when={variant() === "progress"}>
            <ProgressVariant />
          </Show>
          <Show when={variant() === "breadcrumb"}>
            <BreadcrumbVariant />
          </Show>
          <Show when={variant() === "dots" || variant() === "numbers"}>
            <DotsNumbersVariant />
          </Show>
        </div>
      </Show>
    );
  };

  return StepIndicator;
}
