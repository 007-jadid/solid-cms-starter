import { createSignal } from "solid-js";
import {
  formatDateDisplay,
  formatDateTimeDisplay,
  formatTimeDisplay,
  toLocalDateInputValue,
} from "~/features/lib/date-time";
import { cn } from "~/features/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/popover";
import { DatePickerCalendar } from "./date-picker-calendar";
import { TimePickerPanel } from "./time-picker";

const triggerClass =
  "flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";

type DateBoundary = Date | string | undefined;

function toDateBoundaryValue(boundary: DateBoundary): string | undefined {
  if (!boundary) return undefined;
  return typeof boundary === "string" ? boundary : toLocalDateInputValue(boundary);
}

function CalendarIcon() {
  return (
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
  );
}

function ClockIcon() {
  return (
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
      <title>Clock</title>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function DateFieldControl(props: {
  value: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: DateBoundary;
  maxDate?: DateBoundary;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = createSignal(false);
  const minDate = () => toDateBoundaryValue(props.minDate);
  const maxDate = () => toDateBoundaryValue(props.maxDate);

  return (
    <Popover open={open()} onOpenChange={setOpen} placement="bottom-start">
      <PopoverTrigger
        class={cn(
          triggerClass,
          !props.value && "text-muted-foreground",
          props.error && "border-destructive",
        )}
        disabled={props.disabled}
      >
        <CalendarIcon />
        <span class="flex-1 truncate text-left">
          {props.value ? formatDateDisplay(props.value) : props.placeholder || "Pick a date"}
        </span>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <DatePickerCalendar
          selected={props.value}
          onSelect={(date) => {
            props.onChange(date);
            setOpen(false);
          }}
          minDate={minDate()}
          maxDate={maxDate()}
        />
      </PopoverContent>
    </Popover>
  );
}

export function TimeFieldControl(props: {
  value: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = createSignal(false);

  return (
    <Popover open={open()} onOpenChange={setOpen} placement="bottom-start">
      <PopoverTrigger
        class={cn(
          triggerClass,
          !props.value && "text-muted-foreground",
          props.error && "border-destructive",
        )}
        disabled={props.disabled}
      >
        <ClockIcon />
        <span class="flex-1 truncate text-left">
          {props.value ? formatTimeDisplay(props.value) : props.placeholder || "Pick a time"}
        </span>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <TimePickerPanel
          value={props.value}
          onChange={props.onChange}
          onDone={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

export function DateTimeFieldControl(props: {
  value: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: DateBoundary;
  maxDate?: DateBoundary;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = createSignal(false);
  const [showTime, setShowTime] = createSignal(false);

  const minDate = () => toDateBoundaryValue(props.minDate);
  const maxDate = () => toDateBoundaryValue(props.maxDate);

  const dateTimeParts = () => {
    if (!props.value || !props.value.includes("T")) {
      return { date: "", time: "" };
    }
    const [date, time] = props.value.split("T");
    return { date, time };
  };

  const updateDateTime = (datePart: string, timePart: string) => {
    if (datePart && timePart) {
      props.onChange(`${datePart}T${timePart}`);
    } else if (datePart) {
      props.onChange(`${datePart}T00:00`);
    }
  };

  return (
    <Popover
      open={open()}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setShowTime(false);
      }}
      placement="bottom-start"
    >
      <PopoverTrigger
        class={cn(
          triggerClass,
          !props.value && "text-muted-foreground",
          props.error && "border-destructive",
        )}
        disabled={props.disabled}
      >
        <CalendarIcon />
        <span class="flex-1 truncate text-left">
          {props.value
            ? formatDateTimeDisplay(props.value)
            : props.placeholder || "Pick date & time"}
        </span>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <div class="flex">
          {/* Calendar side */}
          <DatePickerCalendar
            selected={dateTimeParts().date}
            onSelect={(date) => {
              const time = dateTimeParts().time || "00:00";
              updateDateTime(date, time);
              setShowTime(true);
            }}
            minDate={minDate()}
            maxDate={maxDate()}
          />

          {/* Time side */}
          <div
            class={cn(
              "border-l border-border flex flex-col transition-colors",
              showTime() && "bg-accent/20",
            )}
          >
            <div class="text-[10px] font-medium text-center py-2 border-b border-border uppercase tracking-wider text-muted-foreground">
              Time
            </div>
            <div class="flex-1 flex items-start">
              <TimePickerPanel
                value={dateTimeParts().time}
                onChange={(time) => {
                  const date = dateTimeParts().date || toLocalDateInputValue(new Date());
                  updateDateTime(date, time);
                  setShowTime(false);
                }}
                onDone={() => {
                  if (dateTimeParts().date) {
                    setOpen(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
