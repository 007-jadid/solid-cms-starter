import { createMemo, createSignal, For } from "solid-js";
import { formatDateDisplay, formatDateTimeDisplay } from "~/features/lib/date-time";
import { cn } from "~/features/lib/utils";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
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
const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface CalendarDay {
  day: number;
  month: number; // 0-indexed
  year: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}

function buildCalendarGrid(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const firstDay = new Date(year, month, 1);
  // Monday = 0, Sunday = 6
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: CalendarDay[] = [];

  // Previous month fill
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrev = new Date(prevYear, prevMonth + 1, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({
      day: d,
      month: prevMonth,
      year: prevYear,
      dateStr,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({
      day: d,
      month,
      year,
      dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Next month fill (always show 6 rows = 42 cells)
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({
      day: d,
      month: nextMonth,
      year: nextYear,
      dateStr,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-4 w-4"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-4 w-4"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/**
 * Polished inline calendar for single date selection (shadcn-style).
 * Features: month/year dropdowns, outside days, today highlight.
 */
export function DatePickerCalendar(props: {
  selected?: string;
  onSelect: (date: string) => void;
  minDate?: string;
  maxDate?: string;
}) {
  const initDate = () => (props.selected ? new Date(`${props.selected}T00:00:00`) : new Date());

  const [viewYear, setViewYear] = createSignal(initDate().getFullYear());
  const [viewMonth, setViewMonth] = createSignal(initDate().getMonth());
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
    // Navigate to that month if clicking outside day
    if (!d.isCurrentMonth) {
      setViewYear(d.year);
      setViewMonth(d.month);
    }
    props.onSelect(d.dateStr);
  };

  return (
    <div class="p-3 w-70">
      {/* Header with month/year selectors */}
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
            const selected = () => props.selected === d.dateStr;
            const disabled = () => isDisabled(d.dateStr);

            return (
              <button
                type="button"
                class={cn(
                  "relative inline-flex items-center justify-center h-8 w-full rounded-md text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50",
                  d.isCurrentMonth ? "text-foreground" : "text-muted-foreground/40",
                  !selected() &&
                    !disabled() &&
                    d.isCurrentMonth &&
                    "hover:bg-accent hover:text-accent-foreground",
                  !selected() &&
                    !disabled() &&
                    !d.isCurrentMonth &&
                    "hover:bg-accent/50 hover:text-muted-foreground",
                  d.isToday && !selected() && "bg-accent text-accent-foreground font-semibold",
                  selected() &&
                    "bg-primary text-primary-foreground font-semibold hover:bg-primary/90",
                  disabled() && "opacity-30 pointer-events-none",
                )}
                disabled={disabled()}
                onClick={() => handleDayClick(d)}
              >
                {d.day}
              </button>
            );
          }}
        </For>
      </div>
    </div>
  );
}

export { formatDateDisplay, formatDateTimeDisplay };
export { buildCalendarGrid, type CalendarDay, WEEK_DAYS, MONTH_NAMES, ChevronLeft, ChevronRight };
