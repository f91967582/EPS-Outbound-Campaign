import React, { useState, useEffect } from "react";
import { Alert, Container, Grid, Typography } from "@mui/material";

import {useCampaignsList, useCampaignDetail } from "../../../services/useCampaignsApi"
import { resumeCampaign } from "../../../api/resumeCampaign";
import { pauseCampaign } from "../../../api/pauseCampaign";

import CampaignList from "./CampaignList";
import CampaignCard from "./CampaignCard";

export default function CampaignsView() {
  const [selectedId, setSelectedId] = useState(null);
  const [pausing, setPausing] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [statusOverride, setStatusOverride] = useState(null);

  const { campaigns, loading: loadingList, error: listError } = useCampaignsList();

  const {
    campaign,
    rows,
    nextToken,
    loading: loadingDetail,
    error: detailError,
    loadMore,
  } = useCampaignDetail(selectedId);

  const currentStatus = statusOverride || campaign?.status || "UNKNOWN";

  useEffect(() => {
    setStatusOverride(null);
  }, [selectedId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "error";
      case "RUNNING":
        return "info";
      case "QUEUED":
        return "warning";
      case "PAUSED":
        return "secondary";
      default:
        return "default";
    }
  };

  const handlePause = async () => {
    if (!campaign?.campaignId) return;

    try {
      setPausing(true);
      await pauseCampaign({ campaignId: campaign.campaignId });
      setStatusOverride("PAUSED");
    } catch (err) {
      console.error(err);
    } finally {
      setPausing(false);
    }
  };

  const handleResume = async () => {
    if (!campaign?.campaignId) return;

    try {
      setResuming(true);
      await resumeCampaign({ campaignId: campaign.campaignId });
      setStatusOverride("QUEUED");
    } catch (err) {
      console.error(err);
    } finally {
      setResuming(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Campañas Outbound
      </Typography>

      {(listError || detailError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {listError || detailError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <CampaignList
            campaigns={campaigns}
            loading={loadingList}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <CampaignCard
            selectedId={selectedId}
            loading={loadingDetail}
            campaign={campaign}
            rows={rows}
            nextToken={nextToken}
            loadMore={loadMore}
            currentStatus={currentStatus}
            getStatusColor={getStatusColor}
            handlePause={handlePause}
            handleResume={handleResume}
            pausing={pausing}
            resuming={resuming}
          />
        </Grid>
      </Grid>
    </Container>
  );
}