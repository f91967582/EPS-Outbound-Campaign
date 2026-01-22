export default function SummaryTable({ title, total, rows }) {
  return (
    <div className="panel section-half">
      <div className="panel-header">
        <span className="panel-title">{title}</span>
        <span className="panel-total">Total: {total}</span>
      </div>
      <div className="panel-body">
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th className="text-right">Cantidad</th>
              <th className="text-right">%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, qty, pct]) => (
              <tr key={label}>
                <td>{label}</td>
                <td className="text-right font-bold">{qty}</td>
                <td className="text-right text-dim">{pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
