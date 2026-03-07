import { createMemo, createSignal, For, Show } from "solid-js";
import { formatDateDisplay, toLocalDateInputValue } from "~/features/lib/date-time";
import { cn } from "~/features/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/popover";
import type { FieldConfig } from "../types";
import {
  buildCalendarGrid,
  type CalendarDay,
  ChevronLeft,
  ChevronRight,
  MONTH_NAMES,
  WEEK_DAYS,
} from "./date-picker-calendar";

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Range calendar: click first date for start, second for end.
 * Uses the shared buildCalendarGrid with month/year dropdowns.
 */
function RangeCalendar(props: {
  start?: string;
  end?: string;
  onSelect: (start: string, end?: string) => void;
  minDate?: string;
  maxDate?: string;
}) {
  const initDate = () => {
    if (props.start) return new Date(`${props.start}T00:00:00`);
    return new Date();
  };

  const [viewYear, setViewYear] = createSignal(initDate().getFullYear());
  const [viewMonth, setViewMonth] = createSignal(initDate().getMonth());
  const [selecting, setSelecting] = createSignal<"start" | "end">(
    props.start && !props.end ? "end" : "start",
  );
  const [hovered, setHovered] = createSignal<string | undefined>();
  const [showMonthPicker, setShowMonthPicker] = createSignal(false);
  const [showYearPicker, setShowYearPicker] = createSignal(false);

  const days = createMemo(() => buildCalendarGrid(viewYear(), viewMonth()));

  const yearRange = createMemo(() => {
    const center = viewYear();
    const start = center - 6;
    return Array.from({ length: 12 }, (_, i) => start + i);
  });

  const isDisabled = (dateStr: string) => {
    if (props.minDate && dateStr < props.minDate) return true;
    if (props.maxDate && dateStr > props.maxDate) return true;
    return false;
  };

  const isStart = (dateStr: string) => props.start === dateStr;
  const isEnd = (dateStr: string) => props.end === dateStr;

  const isInRange = (dateStr: string) => {
    const start = props.start;
    const end = props.end || (selecting() === "end" ? hovered() : undefined);
    if (!start || !end) return false;
    const lo = start < end ? start : end;
    const hi = start < end ? end : start;
    return dateStr > lo && dateStr < hi;
  };

  const isRangeEdge = (dateStr: string) => isStart(dateStr) || isEnd(dateStr);

  const prevMonth = () => {
    if (viewMonth() === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth() === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (d: CalendarDay) => {
    if (isDisabled(d.dateStr)) return;
    if (!d.isCurrentMonth) {
      setViewYear(d.year);
      setViewMonth(d.month);
    }

    const dateStr = d.dateStr;
    if (selecting() === "start") {
      props.onSelect(dateStr, undefined);
      setSelecting("end");
    } else {
      const start = props.start ?? dateStr;
      if (dateStr < start) {
        props.onSelect(dateStr, start);
      } else {
        props.onSelect(start, dateStr);
      }
      setSelecting("start");
    }
  };

  return (
    <div class="p-3 w-70">
      {/* Header */}
      <div class="flex items-center justify-between mb-3">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={prevMonth}
        >
          <ChevronLeft />
        </button>

        <div class="flex items-center gap-1">
          {/* Month dropdown */}
          <div class="relative">
            <button
              type="button"
              class={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium hover:bg-accent transition-colors",
                showMonthPicker() && "bg-accent",
              )}
              onClick={() => {
                setShowMonthPicker((v) => !v);
                setShowYearPicker(false);
              }}
            >
              {MONTH_NAMES[viewMonth()]}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="h-3 w-3 opacity-50"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {showMonthPicker() && (
              <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-10 grid grid-cols-3 gap-1 p-2 rounded-lg border border-border/60 bg-popover shadow-md w-55">
                <For each={MONTH_SHORT}>
                  {(name, i) => (
                    <button
                      type="button"
                      class={cn(
                        "rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-accent",
                        viewMonth() === i() &&
                          "bg-primary text-primary-foreground hover:bg-primary/90",
                      )}
                      onClick={() => {
                        setViewMonth(i());
                        setShowMonthPicker(false);
                      }}
                    >
                      {name}
                    </button>
                  )}
                </For>
              </div>
            )}
          </div>

          {/* Year dropdown */}
          <div class="relative">
            <button
              type="button"
              class={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium hover:bg-accent transition-colors",
                showYearPicker() && "bg-accent",
              )}
              onClick={() => {
                setShowYearPicker((v) => !v);
                setShowMonthPicker(false);
              }}
            >
              {viewYear()}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="h-3 w-3 opacity-50"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {showYearPicker() && (
              <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-10 grid grid-cols-3 gap-1 p-2 rounded-lg border border-border/60 bg-popover shadow-md w-45">
                <button
                  type="button"
                  class="col-span-3 text-xs text-muted-foreground hover:text-foreground py-0.5 transition-colors"
                  onClick={() => setViewYear((y) => y - 12)}
                >
                  &larr; Earlier
                </button>
                <For each={yearRange()}>
                  {(y) => (
                    <button
                      type="button"
                      class={cn(
                        "rounded-md px-1 py-1.5 text-xs font-medium transition-colors hover:bg-accent",
                        viewYear() === y &&
                          "bg-primary text-primary-foreground hover:bg-primary/90",
                      )}
                      onClick={() => {
                        setViewYear(y);
                        setShowYearPicker(false);
                      }}
                    >
                      {y}
                    </button>
                  )}
                </For>
                <button
                  type="button"
                  class="col-span-3 text-xs text-muted-foreground hover:text-foreground py-0.5 transition-colors"
                  onClick={() => setViewYear((y) => y + 12)}
                >
                  Later &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={nextMonth}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Weekday headers */}
      <div class="grid grid-cols-7 mb-1">
        <For each={WEEK_DAYS}>
          {(d) => (
            <div class="text-center text-xs text-muted-foreground font-medium h-8 flex items-center justify-center">
              {d}
            </div>
          )}
        </For>
      </div>

      {/* Day grid */}
      <div class="grid grid-cols-7">
        <For each={days()}>
          {(d) => {
            const disabled = () => isDisabled(d.dateStr);
            const rangeEdge = () => isRangeEdge(d.dateStr);
            const inRange = () => isInRange(d.dateStr);
            const startDay = () => isStart(d.dateStr);
            const endDay = () => isEnd(d.dateStr);

            return (
              <div
                class={cn(
                  "relative flex items-center justify-center h-8",
                  inRange() && d.isCurrentMonth && "bg-primary/10",
                  startDay() && props.end && "rounded-l-md bg-primary/10",
                  endDay() && props.start && "rounded-r-md bg-primary/10",
                )}
              >
                <button
                  type="button"
                  class={cn(
                    "relative z-10 inline-flex items-center justify-center h-8 w-full rounded-md text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50",
                    d.isCurrentMonth ? "text-foreground" : "text-muted-foreground/40",
                    !rangeEdge() &&
                      !disabled() &&
                      d.isCurrentMonth &&
                      "hover:bg-accent hover:text-accent-foreground",
                    d.isToday && !rangeEdge() && "bg-accent text-accent-foreground font-semibold",
                    rangeEdge() &&
                      "bg-primary text-primary-foreground font-semibold hover:bg-primary/90",
                    disabled() && "opacity-30 pointer-events-none",
                  )}
                  disabled={disabled()}
                  onMouseEnter={() => setHovered(d.dateStr)}
                  onMouseLeave={() => setHovered(undefined)}
                  onClick={() => handleDayClick(d)}
                >
                  {d.day}
                </button>
              </div>
            );
          }}
        </For>
      </div>

      <Show when={selecting() === "end"}>
        <p class="text-xs text-muted-foreground mt-2 text-center">Select end date</p>
      </Show>
    </div>
  );
}

/**
 * DateRangeInput — single trigger, one calendar, pick start then end.
 */
export function DateRangeInput<TValues extends object>(props: {
  field: FieldConfig<TValues>;
  value: { start?: string; end?: string };
  onChange: (value: { start?: string; end?: string }) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = createSignal(false);
  const dateConfig = props.field.dateConfig;

  const minDate = () =>
    dateConfig?.minDate
      ? typeof dateConfig.minDate === "string"
        ? dateConfig.minDate
        : toLocalDateInputValue(dateConfig.minDate)
      : undefined;

  const maxDate = () =>
    dateConfig?.maxDate
      ? typeof dateConfig.maxDate === "string"
        ? dateConfig.maxDate
        : toLocalDateInputValue(dateConfig.maxDate)
      : undefined;

  const displayText = () => {
    const val = props.value;
    if (val?.start && val?.end)
      return `${formatDateDisplay(val.start)} — ${formatDateDisplay(val.end)}`;
    if (val?.start) return `${formatDateDisplay(val.start)} — ...`;
    return "";
  };

  return (
    <div class="flex flex-col gap-1.5">
      <div class={cn("text-sm font-medium leading-none", props.error && "text-destructive")}>
        {props.field.label} {props.field.required && <span class="text-destructive">*</span>}
      </div>
      <Popover open={open()} onOpenChange={setOpen} placement="bottom-start">
        <PopoverTrigger
          class={cn(
            "flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            !props.value?.start && "text-muted-foreground",
            props.error && "border-destructive",
          )}
          disabled={props.disabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4 shrink-0 opacity-50"
          >
            <title>Calendar</title>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span class="flex-1 truncate text-left">
            {displayText() || props.field.placeholder || "Pick a date range"}
          </span>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <RangeCalendar
            start={props.value?.start}
            end={props.value?.end}
            onSelect={(start, end) => {
              props.onChange({ start, end });
              if (start && end) {
                setOpen(false);
              }
            }}
            minDate={minDate()}
            maxDate={maxDate()}
          />
        </PopoverContent>
      </Popover>
      <Show when={props.field.description}>
        <p class="text-xs text-muted-foreground">{props.field.description}</p>
      </Show>
      <Show when={props.error}>
        <p class="text-xs text-destructive">{props.error}</p>
      </Show>
    </div>
  );
}
