import { formatFecha } from "../../utils/date";

export default function DataTable({ title, rows, columns, onDownloadCsv }) {
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
                        {/* labels */}
                        <tr>
                            {columns.map((c) => (
                                <th key={c.key}>{c.label}</th>
                            ))}
                        </tr>

                        {/* filters row */}
                        <tr>
                            {columns.map((c) => (
                                <th key={c.key}>
                                    {c.filter?.type === "text" && (
                                        <input
                                            type="text"
                                            value={c.filter.value}
                                            onChange={(e) => c.filter.onChange(e.target.value)}
                                            placeholder={c.filter.placeholder}
                                            style={{ width: "100%", padding: 4 }}
                                        />
                                    )}

                                    {c.filter?.type === "date-range" && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                            <input
                                                type="date"
                                                value={c.filter.from}
                                                onChange={(e) => c.filter.onChangeFrom(e.target.value)}
                                                style={{ width: "100%", padding: 4 }}
                                            />
                                            <input
                                                type="date"
                                                value={c.filter.to}
                                                onChange={(e) => c.filter.onChangeTo(e.target.value)}
                                                style={{ width: "100%", padding: 4 }}
                                            />
                                        </div>
                                    )}
                                    {c.filter?.type === "select" && (
  <select
    value={c.filter.value}
    onChange={(e) => c.filter.onChange(e.target.value)}
    style={{ width: "100%", padding: 4 }}
  >
    <option value="">{c.filter.placeholder ?? "Todas"}</option>
    {c.filter.options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
)}


                                </th>
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
