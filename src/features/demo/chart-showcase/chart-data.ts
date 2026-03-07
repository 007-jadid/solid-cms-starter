// ════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export const DESKTOP = [186, 305, 237, 73, 209, 214];
export const MOBILE = [80, 200, 120, 190, 130, 140];
export const BROWSERS = ["Chrome", "Safari", "Firefox", "Edge", "Other"];
export const BROWSER_VALUES = [275, 200, 187, 173, 90];
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const RUNNING = [186, 305, 237, 73, 209, 214];
export const SWIMMING = [80, 200, 120, 190, 130, 140];

export function makeDailyData(months: number) {
  const labels: string[] = [];
  const desktop: number[] = [];
  const mobile: number[] = [];
  const end = new Date(2024, 5, 30);
  const start = new Date(end);
  start.setMonth(start.getMonth() - months);
  let s = 42;
  const r = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    labels.push(`${d.toLocaleDateString("en-US", { month: "short" })} ${d.getDate()}`);
    desktop.push(Math.floor(r() * 350 + 50));
    mobile.push(Math.floor(r() * 250 + 30));
  }
  return { labels, desktop, mobile };
}
