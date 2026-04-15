export default function TabsNav({ active, onChange }) {
  return (
    <div className="tabs-nav">

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