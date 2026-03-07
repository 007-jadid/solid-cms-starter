import { createSignal, For } from "solid-js";
import { cn } from "~/features/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Time picker with scrollable hour/minute columns and AM/PM toggle.
 * 12-hour display, stores value as 24-hour HH:MM.
 */
export function TimePickerPanel(props: {
  value?: string;
  onChange: (time: string) => void;
  onDone: () => void;
}) {
  const hours12 = () => Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const minutes = () => Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,10,...55

  // Parse initial value (24h format)
  const parsed = () => {
    if (!props.value) return { h: -1, m: -1, period: "AM" as "AM" | "PM" };
    const [hStr, mStr] = props.value.split(":");
    const h24 = Number.parseInt(hStr, 10);
    const m = Number.parseInt(mStr, 10);
    const period: "AM" | "PM" = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
    return { h: h12, m, period };
  };

  const [pickedHour, setPickedHour] = createSignal<number | undefined>(undefined);
  const [pickedMinute, setPickedMinute] = createSignal<number | undefined>(undefined);
  const [pickedPeriod, setPickedPeriod] = createSignal<"AM" | "PM" | undefined>(undefined);

  const activeHour = () => pickedHour() ?? (parsed().h > 0 ? parsed().h : -1);
  const activeMinute = () => pickedMinute() ?? (parsed().m >= 0 ? parsed().m : -1);
  const activePeriod = () => pickedPeriod() ?? parsed().period;

  const to24h = (h12: number, period: "AM" | "PM"): number => {
    if (period === "AM") return h12 === 12 ? 0 : h12;
    return h12 === 12 ? 12 : h12 + 12;
  };

  const emitChange = (h12: number, m: number, period: "AM" | "PM") => {
    const h24 = to24h(h12, period);
    props.onChange(`${pad(h24)}:${pad(m)}`);
  };

  const checkDone = () => {
    if (
      pickedHour() !== undefined &&
      pickedMinute() !== undefined &&
      pickedPeriod() !== undefined
    ) {
      props.onDone();
    }
  };

  const selectHour = (h: number) => {
    setPickedHour(h);
    const m = activeMinute() >= 0 ? activeMinute() : 0;
    const p = activePeriod();
    emitChange(h, m, p);
    checkDone();
  };

  const selectMinute = (m: number) => {
    setPickedMinute(m);
    const h = activeHour() > 0 ? activeHour() : 12;
    const p = activePeriod();
    emitChange(h, m, p);
    checkDone();
  };

  const selectPeriod = (p: "AM" | "PM") => {
    setPickedPeriod(p);
    const h = activeHour() > 0 ? activeHour() : 12;
    const m = activeMinute() >= 0 ? activeMinute() : 0;
    emitChange(h, m, p);
    checkDone();
  };

  return (
    <div class="flex gap-0 p-2">
      {/* Hour column */}
      <div class="flex flex-col w-11">
        <div class="text-[10px] font-medium text-muted-foreground text-center pb-1 uppercase tracking-wider">
          Hr
        </div>
        <div class="overflow-y-auto h-52 scrollbar-none flex flex-col">
          <For each={hours12()}>
            {(h) => (
              <button
                type="button"
                class={cn(
                  "block w-full shrink-0 h-8 rounded-md text-xs font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  activeHour() === h && "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
                onClick={() => selectHour(h)}
              >
                {h}
              </button>
            )}
          </For>
        </div>
      </div>

      <div class="w-px bg-border mx-0.5 my-4" />

      {/* Minute column */}
      <div class="flex flex-col w-11">
        <div class="text-[10px] font-medium text-muted-foreground text-center pb-1 uppercase tracking-wider">
          Min
        </div>
        <div class="overflow-y-auto h-52 scrollbar-none flex flex-col">
          <For each={minutes()}>
            {(m) => (
              <button
                type="button"
                class={cn(
                  "block w-full shrink-0 h-8 rounded-md text-xs font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  activeMinute() === m && "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
                onClick={() => selectMinute(m)}
              >
                {pad(m)}
              </button>
            )}
          </For>
        </div>
      </div>

      <div class="w-px bg-border mx-0.5 my-4" />

      {/* AM/PM toggle */}
      <div class="flex flex-col w-11">
        <div class="text-[10px] font-medium text-muted-foreground text-center pb-1 uppercase tracking-wider">
          &nbsp;
        </div>
        <div class="flex flex-col gap-1">
          <button
            type="button"
            class={cn(
              "block w-full h-8 rounded-md text-xs font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              activePeriod() === "AM" && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            onClick={() => selectPeriod("AM")}
          >
            AM
          </button>
          <button
            type="button"
            class={cn(
              "block w-full h-8 rounded-md text-xs font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              activePeriod() === "PM" && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            onClick={() => selectPeriod("PM")}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
}

export function formatTimeDisplay(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = Number.parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}
