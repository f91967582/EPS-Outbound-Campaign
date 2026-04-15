import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SmsIcon from "@mui/icons-material/Sms";

import { useCampaignsList, useCampaignDetail } from "../../../services/useCampaignsApi";
import { resumeCampaign } from "../../../api/resumeCampaign";
import { pauseCampaign } from "../../../api/pauseCampaign";

import CampaignList from "./CampaignList";
import CampaignDetailsCard from "./CampaignDetailsCard";
import ContactsResultsTable from "./ContactsResultsTable";
import SmsCampaignsCard from "./SmsCampaignsCard";

export default function CampaignsView() {
  const theme = useTheme();

  const [selectedId, setSelectedId] = useState(null);
  const [pausing, setPausing] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [statusOverride, setStatusOverride] = useState(null);

  const {
    campaigns = [],
    loading: loadingList,
    error: listError,
  } = useCampaignsList();

  const {
    campaign,
    rows,
    nextToken,
    loading: loadingDetail,
    error: detailError,
    loadMore,
  } = useCampaignDetail(selectedId);

  const currentStatus = statusOverride || campaign?.status || "UNKNOWN";
  const selectedCampaignType = String(campaign?.campaignType || "").toLowerCase();

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
    <Box sx={{ bgcolor: alpha(theme.palette.grey[100], 0.4), minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={5}>
          <Box
            sx={{
              p: 1,
              bgcolor: "primary.main",
              borderRadius: 2,
              display: "flex",
              color: "white",
            }}
          >
            <DashboardIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Campañas Outbound
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión centralizada de comunicaciones.
            </Typography>
          </Box>
        </Stack>

        {(listError || detailError) && (
          <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 3 }}>
            {listError || detailError}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
              <SmsIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="overline" fontWeight={800} sx={{ flexGrow: 1 }}>
                Campañas
              </Typography>
              <Chip
                label={campaigns.length}
                size="small"
                variant="outlined"
                sx={{ height: 18, fontSize: "0.65rem" }}
              />
            </Stack>

            <CampaignList
              campaigns={campaigns}
              loading={loadingList}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            {!selectedId ? (
              <Box
                sx={{
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                  borderRadius: 4,
                  border: "2px dashed",
                  borderColor: "divider",
                }}
              >
                <Typography color="text.disabled">
                  Selecciona una campaña para ver el detalle.
                </Typography>
              </Box>
            ) : selectedCampaignType === "sms" ? (
              <SmsCampaignsCard
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
            ) : (
              <Stack spacing={3}>
                <CampaignDetailsCard
                  selectedId={selectedId}
                  loading={loadingDetail}
                  campaign={campaign}
                  currentStatus={currentStatus}
                  getStatusColor={getStatusColor}
                  handlePause={handlePause}
                  handleResume={handleResume}
                  pausing={pausing}
                  resuming={resuming}
                />

                {campaign && (
                  <ContactsResultsTable
                    selectedId={selectedId}
                    getStatusColor={getStatusColor}
                  />
                )}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}