// utils/uploadCsv.js

export function uploadCsv(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rows = parseCsv(text);
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function parseCsv(text) {
  // Strip BOM
  text = text.replace(/^\uFEFF/, "");

  const delimiter = detectDelimiter(text);

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  // Normalize headers
  const rawHeaders = lines[0].split(delimiter);
  const headers = rawHeaders.map(normalizeHeader);

  // Only allow these 4 headers
  const HEADER_MAP = {
    cedula: "cedula",
    pdfurl: "pdfUrl",
    correo: "correo",
    action: "action",
  };

  return lines.slice(1).map((line, index) => {
    const values = line.split(delimiter);

    const row = { __index: index + 1 };

    headers.forEach((header, i) => {
      const key = HEADER_MAP[header];
      if (key) row[key] = normalize(values[i]);
    });

    return row;
  });
}

function normalizeHeader(h) {
  // normalize to match: cedula, pdfUrl, correo, action
  return String(h)
    .trim()
    .toLowerCase()
    .replace(/^\uFEFF/, "")
    .replace(/\s+/g, "")      // remove spaces
    .replace(/[_-]/g, "");    // remove _ and -
}

function detectDelimiter(text) {
  // simple detection
  if (text.includes(";")) return ";";
  return ",";
}

function normalize(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}
