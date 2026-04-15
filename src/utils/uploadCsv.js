export function uploadCsv(file, headerMap) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));
    if (!headerMap) return reject(new Error("No headerMap provided"));

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rows = parseCsv(text, headerMap);
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function parseCsv(text, headerMap) {
  text = text.replace(/^\uFEFF/, "");
  const delimiter = detectDelimiter(text);

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const rawHeaders = parseCsvLine(lines[0], delimiter);
  const headers = rawHeaders.map(normalizeHeader);

  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line, delimiter);
    const row = { __index: index + 1 };

    headers.forEach((header, i) => {
      const key = headerMap[header];
      if (key) row[key] = normalize(values[i]);
    });

    return row;
  });
}

function parseCsvLine(line, delimiter) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function normalizeHeader(h) {
  return String(h)
    .toLowerCase()
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/\s+/g, "")
    .replace(/[_-]/g, "");
}

function detectDelimiter(text) {
  if (text.includes(";")) return ";";
  return ",";
}

function normalize(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export const OUTBOUND_HEADER_MAP = {
  telefono: "telefono",
  nombre: "nombre",
  correo: "correo",
};

export const EMAIL_HEADER_MAP = OUTBOUND_HEADER_MAP;
export const SMS_HEADER_MAP = OUTBOUND_HEADER_MAP;