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
        className={`tab-btn ${active === "outboundcampaign" ? "active" : ""}`}
        onClick={() => onChange("outboundcampaign")}
      >
        Campaña Outbound
      </button>

      <button
        className={`tab-btn ${active === "emailcampaign" ? "active" : ""}`}
        onClick={() => onChange("emailcampaign")}
      >
        Campaña Email
      </button>

    </div>
  );
}
