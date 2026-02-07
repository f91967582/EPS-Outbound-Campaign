// components/CsvPreviewTable.jsx
export default function CsvPreviewTable({ rows }) {
  if (!rows || rows.length === 0) return null;

  // Extract columns dynamically (excluding __index)
  const columns = Object.keys(rows[0]).filter(
    (key) => key !== "__index"
  );

  return (
    <div style={{ marginTop: "1rem", overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            {columns.map((col) => (
              <th key={col} style={thStyle}>
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.__index}>
              <td style={tdStyle}>{row.__index}</td>

              {columns.map((col) => (
                <td key={col} style={tdStyle}>
                  {row[col] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  background: "#f5f5f5",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};
