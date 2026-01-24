import { useMemo, useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import { formatFecha } from "../../utils/date";

function toCsvValue(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  const escaped = s.replace(/"/g, '""');
  return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
}

function downloadCsv(filename, columns, data) {
  const header = columns.map((c) => toCsvValue(c.label)).join(",");
  const lines = data.map((row) =>
    columns.map((c) => toCsvValue(row?.[c.key])).join(",")
  );

  const csv = [header, ...lines].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

const normalize = (s) => String(s ?? "").trim().toLowerCase();

function TableBlock({
  title,
  rows,
  columns,
  rowsPerPage = 10,
  emptyText = "No data",
  onDownloadCsv,
}) {
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [rows.length]);

  const pageCount = Math.ceil(rows.length / rowsPerPage);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  return (
    <div className="data-table-wrapper" style={{ marginBottom: "1rem" }}>
      <div className="panel-header">
        <span className="panel-title">{title}</span>
        <button className="btn-white" onClick={onDownloadCsv}>
          Descargar CSV
        </button>
      </div>

      <div className="panel-body">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              pagedRows.map((r, idx) => {
                const fechaLegible = formatFecha(r.fechaRegistro);

                return (
                  <tr key={r.contactId ?? `${title}-${page}-${idx}`}>
                    <td className="font-bold">{r.telefonoCliente}</td>
                    <td className="text-dim">{fechaLegible}</td>
                    <td>{r.nombreCliente}</td>
                    <td>{r.tipificacion ?? r.Tipificacion}</td>
                    <td>{r.asesorCobro}</td>
                    <td>{r.contactId}</td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>

        {pageCount > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              variant="outlined"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactList({ data, loading, error }) {
  const rows = data?.data ?? [];

  const columns = [
    { label: "Teléfono ", key: "telefonoCliente" },
    { label: "Fecha", key: "fechaRegistro" },
    { label: "Cliente", key: "nombreCliente" },
    { label: "Tipificación", key: "tipificacion" },
    { label: "Asesor", key: "asesorCobro" },
    { label: "Contact ID", key: "contactId" },

  ];

  // ✅ split into two lists based on `llamadas`
  const { entrantesRows, salientesRows } = useMemo(() => {
    const entrantesRows = [];
    const salientesRows = [];

    for (const r of rows) {
      const dir = normalize(r?.llamadas); // "entrante" | "saliente"
      if (dir === "entrante") entrantesRows.push(r);
      else if (dir === "saliente") salientesRows.push(r);
    }

    return { entrantesRows, salientesRows };
  }, [rows]);

  const stamp = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const downloadEntrantes = () =>
    downloadCsv(`detalle-entrantes-${stamp}.csv`, columns, entrantesRows);

  const downloadSalientes = () =>
    downloadCsv(`detalle-salientes-${stamp}.csv`, columns, salientesRows);

  // optional: download all
  const downloadAll = () =>
    downloadCsv(`detalle-registros-${stamp}.csv`, columns, rows);

  if (loading) return <p>Loading details...</p>;
  if (error) return <p>{String(error)}</p>;

  return (
    <div>
      {/* optional global header/actions */}
      <div className="panel-header" style={{ marginBottom: "1rem" }}>
        <span className="panel-title">
          Detalle de Registros (Entrantes / Salientes)
        </span>
        <button className="btn-white" onClick={downloadAll}>
          Descargar CSV (Todos)
        </button>
      </div>

      <TableBlock
        title={`Entrantes (${entrantesRows.length})`}
        rows={entrantesRows}
        columns={columns}
        onDownloadCsv={downloadEntrantes}
      />

      <TableBlock
        title={`Salientes (${salientesRows.length})`}
        rows={salientesRows}
        columns={columns}
        onDownloadCsv={downloadSalientes}
      />
    </div>
  );
}
