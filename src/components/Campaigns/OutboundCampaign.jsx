import CampaignSection from "./CampaignSection";

export default function OutboundCampaign() {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Iniciar Campaña Outbound</h2>

      <CampaignSection
        title="Clientes a llamar"
        description="Carga el archivo CSV con los proveedores."
      />
    </div>
  );
}
