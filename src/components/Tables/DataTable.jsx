import { formatFecha } from "../../utils/date";
import { useState } from "react";


export default function DataTable({ title, rows, columns, onDownloadCsv }) {
    const filterColumns = columns.filter((c) => c.filter);
    const [openDateKey, setOpenDateKey] = useState(null);


    const clearAllFilters = () => {
        filterColumns.forEach((c) => {
            if (c.filter.type === "text" || c.filter.type === "select") {
                c.filter.onChange("");
            }

            if (c.filter.type === "date-range") {
                c.filter.onChangeFrom("");
                c.filter.onChangeTo("");
            }
        });
    };

    return (
        <div className="data-table-wrapper" style={{ marginBottom: "1.5rem" }}>
            {/* HEADER */}
            <div className="panel-header">
                <span className="panel-title">{title}</span>
                <button className="btn-white" onClick={onDownloadCsv}>
                    Descargar CSV
                </button>
            </div>

            {/* FILTERS */}
            {filterColumns.length > 0 && (
                <div
                    style={{
                        backgroundColor: "#f5f7fa",
                        borderBottom: "1px solid #e0e0e0",
                        padding: "0.75rem",
                    }}
                >
                    {/* FILTER ACTIONS */}
                    {/* FILTER HEADER */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  }}
>
  <span
    style={{
      fontSize: 13,
      fontWeight: 700,
      color: "#555",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
    }}
  >
    Filtros
  </span>

  <button
    onClick={clearAllFilters}
    style={{
      background: "transparent",
      border: "1px solid #c62828",
      color: "#c62828",
      padding: "4px 10px",
      fontSize: 12,
      borderRadius: 4,
      cursor: "pointer",
    }}
  >
    Limpiar filtros
  </button>
</div>


                    {/* FILTER FIELDS */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "0.75rem",
                        }}
                    >
                        {filterColumns.map((c) => (
                            <div
                                key={c.key}
                                style={{ display: "flex", flexDirection: "column", gap: 4 }}
                            >
                                <label style={{ fontSize: 12, fontWeight: 600 }}>
                                    {c.label}
                                </label>

                                {c.filter.type === "text" && (
                                    <input
                                        type="text"
                                        value={c.filter.value}
                                        onChange={(e) => c.filter.onChange(e.target.value)}
                                        placeholder={c.filter.placeholder}
                                        style={{ padding: 6 }}
                                    />
                                )}

                                {c.filter.type === "date-range" && (
                                    <div style={{ position: "relative" }}>
                                        {/* SINGLE VISIBLE FIELD */}
                                        <input
                                            type="text"
                                            readOnly
                                            value={
                                                c.filter.from || c.filter.to
                                                    ? `${c.filter.from || "—"} → ${c.filter.to || "—"}`
                                                    : "Seleccionar rango"
                                            }
                                            onClick={() =>
                                                setOpenDateKey(openDateKey === c.key ? null : c.key)
                                            }
                                            style={{
                                                padding: 6,
                                                cursor: "pointer",
                                                backgroundColor: "#fff",
                                            }}
                                        />

                                        {/* EXPANDED CALENDARS */}
                                        {openDateKey === c.key && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "110%",
                                                    left: 0,
                                                    zIndex: 10,
                                                    background: "#fff",
                                                    border: "1px solid #ccc",
                                                    padding: 8,
                                                    display: "flex",
                                                    gap: 6,
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                                }}
                                            >
                                                <input
                                                    type="date"
                                                    value={c.filter.from}
                                                    onChange={(e) => c.filter.onChangeFrom(e.target.value)}
                                                />
                                                <input
                                                    type="date"
                                                    value={c.filter.to}
                                                    onChange={(e) => c.filter.onChangeTo(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {c.filter.type === "select" && (
                                    <select
                                        value={c.filter.value}
                                        onChange={(e) => c.filter.onChange(e.target.value)}
                                        style={{ padding: 6 }}
                                    >
                                        <option value="">
                                            {c.filter.placeholder ?? "Todas"}
                                        </option>
                                        {c.filter.options.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TABLE */}
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
                                    No data
                                </td>
                            </tr>
                        ) : (
                            rows.map((r, idx) => (
                                <tr
                                    id={`${r.contactId ?? idx}_${Math.random() * 10000}`}
                                    key={`${r.contactId ?? idx}_${Math.random() * 10000}`}
                                >
                                    <td
                                        style={{
                                            textAlign: "center",
                                            fontWeight: 700,
                                            color: "#1976d2",
                                            backgroundColor: "#f5f7fa",
                                            width: 48,
                                        }}
                                    >
                                        {idx + 1}
                                    </td>
                                    <td>{r.telefonoCliente}</td>
                                    <td>{formatFecha(r.fechaRegistro)}</td>
                                    <td>{r.nombreCliente}</td>
                                    <td>{r.tipificacion ?? r.Tipificacion}</td>
                                    <td>{r.asesorCobro}</td>
                                    <td style={{ textTransform: "capitalize" }}>
                                        {r.llamadas || "-"}
                                    </td>
                                    <td>{r.contactId}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
