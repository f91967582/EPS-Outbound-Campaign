export default function KpiCard({ label, value, valueColor, children }) {
  return (
    <div className="card">
      <div className="card-label">{label}</div>
      {value && (
        <div className="card-value" style={{ color: valueColor }}>
          {value}
        </div>
      )}
      {children && <div className="badge-group">{children}</div>}
    </div>
  );
}
