function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function toLocalDateInputValue(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [yearRaw, monthRaw, dayRaw] = dateStr.split("-");
  const year = Number.parseInt(yearRaw ?? "", 10);
  const month = Number.parseInt(monthRaw ?? "", 10);
  const day = Number.parseInt(dayRaw ?? "", 10);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return new Date(year, month - 1, day);
}

export function formatDateDisplay(dateStr: string): string {
  const parsed = parseLocalDate(dateStr);
  if (!parsed) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export function formatTimeDisplay(time: string): string {
  if (!time) return "";
  const [hourRaw, minuteRaw] = time.split(":");
  const hour = Number.parseInt(hourRaw ?? "", 10);
  const minute = Number.parseInt(minuteRaw ?? "", 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return "";

  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${pad2(minute)} ${ampm}`;
}

export function formatDateTimeDisplay(value: string): string {
  if (!value) return "";
  const [datePart, timePart] = value.split("T");
  const dateStr = datePart ? formatDateDisplay(datePart) : "";
  const timeStr = timePart ? formatTimeDisplay(timePart) : "";
  if (dateStr && timeStr) return `${dateStr}, ${timeStr}`;
  if (dateStr) return dateStr;
  return "";
}
