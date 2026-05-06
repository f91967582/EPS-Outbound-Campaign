export function toCsvValue(v) {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

export function downloadCsv(filename, columns, data) {
  const header = columns.map((c) => toCsvValue(c.label)).join(",");
  const lines = data.map((row, i) =>
    columns
      .map((c) =>
        c.key === "__index" ? i + 1 : toCsvValue(row?.[c.key])
      )
      .join(",")
  );

  const csv = [header, ...lines].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}