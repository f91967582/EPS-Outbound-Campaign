export default function TabsNav({ active, onChange }) {
  return (
    <div className="tabs-nav">
      <button
        className={`tab-btn ${active === "dashboard" ? "active" : ""}`}
        onClick={() => onChange("dashboard")}
      >
        Vista General
      </button>
      <button
        className={`tab-btn ${active === "details" ? "active" : ""}`}
        onClick={() => onChange("details")}
      >
        Listado de Contactos
      </button>
    </div>
  );
}
