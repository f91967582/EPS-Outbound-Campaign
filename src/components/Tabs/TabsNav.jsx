export default function TabsNav({ active, onChange }) {
  return (
    <div className="tabs-nav">
      <button
        className={`tab-btn ${active === "mainview" ? "active" : ""}`}
        onClick={() => onChange("mainview")}
      >
        Vista General
      </button>

      <button
        className={`tab-btn ${active === "details" ? "active" : ""}`}
        onClick={() => onChange("details")}
      >
        Listado de Contactos
      </button>

      <button
        className={`tab-btn ${active === "startcampaign" ? "active" : ""}`}
        onClick={() => onChange("startcampaign")}
      >
        Inicar Campaña
      </button>

      <button
        className={`tab-btn ${active === "campaignlist" ? "active" : ""}`}
        onClick={() => onChange("campaignlist")}
      >
        Lista de campañas
      </button>


    </div>
  );
}