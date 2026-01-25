import { useMemo, useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { formatFecha } from "../../utils/date";

function toCsvValue(v) {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
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
  a.click();

  URL.revokeObjectURL(url);
}

const normalize = (s) => String(s ?? "").trim().toLowerCase();

function TableBlock({
  title,
  rows,
  columns,
  onDownloadCsv,
  rowsPerPage = 10,
  resetKey,

  // filters
  clienteFilter,
  setClienteFilter,
  tipificacionFilter,
  setTipificacionFilter,
  tipificacionOptions,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
}) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const pagedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  return (
    <div className="data-table-wrapper" style={{ marginBottom: "1.5rem" }}>
      <div className="panel-header">
        <span className="panel-title">{title}</span>
        <button className="btn-white" onClick={onDownloadCsv}>
          Descargar CSV
        </button>
      </div>

      <div className="panel-body">
        <table className="data-table">
          <thead>
            {/* Column labels */}
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
            </tr>

            {/* Column filters */}
            <tr>
              {/* Teléfono */}
              <th />

              {/* Fecha */}
              <th>
                <TextField
                  type="date"
                  size="small"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="date"
                  size="small"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 0.5 }}
                />
              </th>

              {/* Cliente */}
              <th>
                <TextField
                  size="small"
                  placeholder="Buscar"
                  value={clienteFilter}
                  onChange={(e) => setClienteFilter(e.target.value)}
                />
              </th>

              {/* Tipificación */}
              <th>
                <Autocomplete
                  size="small"
                  options={tipificacionOptions}
                  value={tipificacionFilter}
                  onChange={(_, v) => setTipificacionFilter(v)}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Todas" />
                  )}
                  clearOnEscape
                />
              </th>

              {/* Asesor */}
              <th />

              {/* Contact ID */}
              <th />
            </tr>
          </thead>

          <tbody>
            {pagedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  No data
                </td>
              </tr>
            ) : (
              pagedRows.map((r, idx) => (
                <tr key={r.contactId ?? idx}>
                  <td>{r.telefonoCliente}</td>
                  <td>{formatFecha(r.fechaRegistro)}</td>
                  <td>{r.nombreCliente}</td>
                  <td>{r.tipificacion ?? r.Tipificacion}</td>
                  <td>{r.asesorCobro}</td>
                  <td>{r.contactId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pageCount > 1 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, v) => setPage(v)}
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

  const [clienteFilter, setClienteFilter] = useState("");
  const [tipificacionFilter, setTipificacionFilter] = useState(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const columns = [
    { label: "Teléfono", key: "telefonoCliente" },
    { label: "Fecha", key: "fechaRegistro" },
    { label: "Cliente", key: "nombreCliente" },
    { label: "Tipificación", key: "tipificacion" },
    { label: "Asesor", key: "asesorCobro" },
    { label: "Contact ID", key: "contactId" },
  ];

  const tipificacionOptions = useMemo(() => {
    const set = new Set();
    for (const r of rows) {
      const raw = r.tipificacion ?? r.Tipificacion;
      if (raw) set.add(raw.trim());
    }
    return Array.from(set).sort();
  }, [rows]);

  const filteredRows = useMemo(() => {
    const hastaDate = fechaHasta
      ? new Date(fechaHasta + "T23:59:59")
      : null;

    return rows
      .filter((r) => {
        if (
          clienteFilter &&
          !normalize(r.nombreCliente).includes(normalize(clienteFilter))
        )
          return false;

        if (
          tipificacionFilter &&
          normalize(r.tipificacion ?? r.Tipificacion) !==
            normalize(tipificacionFilter)
        )
          return false;

        const fecha = new Date(r.fechaRegistro);
        if (fechaDesde && fecha < new Date(fechaDesde)) return false;
        if (hastaDate && fecha > hastaDate) return false;

        return true;
      })
      .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
  }, [rows, clienteFilter, tipificacionFilter, fechaDesde, fechaHasta]);

  const { entrantesRows, salientesRows } = useMemo(() => {
    const e = [];
    const s = [];

    for (const r of filteredRows) {
      const dir = normalize(r.llamadas);
      if (dir === "entrante") e.push(r);
      else if (dir === "saliente") s.push(r);
    }

    return { entrantesRows: e, salientesRows: s };
  }, [filteredRows]);

  const resetKey = `${clienteFilter}|${tipificacionFilter}|${fechaDesde}|${fechaHasta}`;
  const stamp = new Date().toISOString().slice(0, 10);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{String(error)}</p>;

  return (
    <div>
      <TableBlock
        title={`Entrantes (${entrantesRows.length})`}
        rows={entrantesRows}
        columns={columns}
        resetKey={resetKey}
        clienteFilter={clienteFilter}
        setClienteFilter={setClienteFilter}
        tipificacionFilter={tipificacionFilter}
        setTipificacionFilter={setTipificacionFilter}
        tipificacionOptions={tipificacionOptions}
        fechaDesde={fechaDesde}
        setFechaDesde={setFechaDesde}
        fechaHasta={fechaHasta}
        setFechaHasta={setFechaHasta}
        onDownloadCsv={() =>
          downloadCsv(`detalle-entrantes-${stamp}.csv`, columns, entrantesRows)
        }
      />

      <TableBlock
        title={`Salientes (${salientesRows.length})`}
        rows={salientesRows}
        columns={columns}
        resetKey={resetKey}
        clienteFilter={clienteFilter}
        setClienteFilter={setClienteFilter}
        tipificacionFilter={tipificacionFilter}
        setTipificacionFilter={setTipificacionFilter}
        tipificacionOptions={tipificacionOptions}
        fechaDesde={fechaDesde}
        setFechaDesde={setFechaDesde}
        fechaHasta={fechaHasta}
        setFechaHasta={setFechaHasta}
        onDownloadCsv={() =>
          downloadCsv(`detalle-salientes-${stamp}.csv`, columns, salientesRows)
        }
      />
    </div>
  );
}
