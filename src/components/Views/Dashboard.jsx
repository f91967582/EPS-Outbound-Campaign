import { useState } from "react";
import TabsNav from "../Tabs/TabsNav";
import TabPanel from "../Tabs/TabPanel";
import ContactList from "./ContactList";
import { useMetrics } from "../../hooks/useMetrics";
import MainView from "./MainView";
import MainCampaign from "../Campaigns/MainCampaign";
import CampaignList from "../Campaigns/CampaignList"
function Dashboard() {
  const [tab, setTab] = useState("mainview");

  const { data, loading, error } = useMetrics();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mainview-container">
      {/* ---- NAVBAR ---- */}
      <header>
        <h2 style={{ marginBottom: "0.5rem", color: "var(--dark)" }}>
          Dashboard de Gestión
        </h2>
        <TabsNav active={tab} onChange={setTab} />
      </header>
      {/* ---- TAB 1 ---- */}
      <TabPanel active={tab === "mainview"}>
        <MainView data={data} loading={loading} error={error} />
      </TabPanel>

      {/* ---- TAB 2 ---- */}
      <TabPanel active={tab === "details"}>
        <ContactList data={data} loading={loading} error={error} />
      </TabPanel>

      <TabPanel active={tab === "startcampaign"}>
        <MainCampaign />
      </TabPanel>

      <TabPanel active={tab === "campaignlist"}>
        <CampaignList />
      </TabPanel>



    </div>
  );
}

export default Dashboard;