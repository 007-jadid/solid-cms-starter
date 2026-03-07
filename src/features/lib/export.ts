export interface ExportColumn<T> {
  key: keyof T;
  header: string;
  format?: (val: T[keyof T]) => string;
}

function buildRows<T>(data: T[], columns?: ExportColumn<T>[]): Record<string, unknown>[] {
  if (!columns || columns.length === 0) return data as Record<string, unknown>[];

  return data.map((row) => {
    const out: Record<string, unknown> = {};
    for (const col of columns) {
      const raw = row[col.key];
      out[col.header] = col.format ? col.format(raw) : (raw ?? "");
    }
    return out;
  });
}

/** Escape a CSV cell value — wraps in quotes if it contains comma, quote, or newline */
function escapeCSV(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSVString(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => headers.map((h) => escapeCSV(row[h])).join(",")),
  ];
  return lines.join("\n");
}

export function exportToCSV<T>(data: T[], filename: string, columns?: ExportColumn<T>[]): void {
  const rows = buildRows(data, columns);
  const csv = toCSVString(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
