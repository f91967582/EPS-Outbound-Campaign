// src/utils/date.js
export function formatFecha(isoString, locale = "es-ES") {
  if (!isoString) return "";

  const date = new Date(isoString);

  // If invalid date, avoid showing "Invalid Date"
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
