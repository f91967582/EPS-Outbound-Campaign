import { useState } from "react";
import TabsNav from "../Tabs/TabsNav";
import TabPanel from "../Tabs/TabPanel";
import MainCampaign from "../Campaigns/CampaignsView/MainCampaign";
import CampaignsView from "../Campaigns/CampaignsView/CampaignsView";

function Dashboard() {
  const [tab, setTab] = useState("startcampaign");

  return (
    <div className="mainview-container">
      <header>
        <h2 style={{ marginBottom: "0.5rem", color: "var(--dark)" }}>
          Dashboard de Gestión
        </h2>
        <TabsNav active={tab} onChange={setTab} />
      </header>

      <TabPanel active={tab === "startcampaign"}>
        <MainCampaign />
      </TabPanel>

      <TabPanel active={tab === "campaignlist"}>
        <CampaignsView />
      </TabPanel>
    </div>
  );
}

export default Dashboard;