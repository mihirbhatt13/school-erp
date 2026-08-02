/**
 * Export JSON array data to a downloadable CSV file.
 * @param filename - Target filename (e.g., 'students_roster.csv')
 * @param data - Array of objects to export
 * @param headers - Optional custom column header mapping
 */
export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  data: T[],
  headers?: { key: keyof T; label: string }[]
) {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  let csvContent = "";

  if (headers && headers.length > 0) {
    const headerRow = headers.map((h) => `"${String(h.label).replace(/"/g, '""')}"`).join(",");
    csvContent += headerRow + "\r\n";

    data.forEach((row) => {
      const rowValues = headers.map((h) => {
        const val = row[h.key];
        const formatted = val === null || val === undefined ? "" : String(val).replace(/"/g, '""');
        return `"${formatted}"`;
      });
      csvContent += rowValues.join(",") + "\r\n";
    });
  } else {
    const keys = Object.keys(data[0]);
    const headerRow = keys.map((k) => `"${k.replace(/"/g, '""')}"`).join(",");
    csvContent += headerRow + "\r\n";

    data.forEach((row) => {
      const rowValues = keys.map((k) => {
        const val = row[k];
        const formatted = val === null || val === undefined ? "" : String(val).replace(/"/g, '""');
        return `"${formatted}"`;
      });
      csvContent += rowValues.join(",") + "\r\n";
    });
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
