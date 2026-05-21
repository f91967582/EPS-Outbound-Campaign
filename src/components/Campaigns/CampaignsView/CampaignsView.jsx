import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  // Divider,
  alpha,
  useTheme,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CallIcon from "@mui/icons-material/Call";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import { useCampaignsList, useCampaignDetail } from "../../../services/useCampaignsApi";
// import { useWhatsappCampaignsList } from "../../../hooks/useWhatsappCampaignsList";
import { updateCampaignStatus } from "../../../api/updateCampaignStatus";

import CallsCampaignList from "../CallsCampaignsList/CallsCampaignList";
// import WhatsappCampaignList from "../WhatsappCampaignsList/WhatsappCampaignList";
import CallsCampaignDetailsCard from "../CallsCampaignsList/CallsCampaignDetailsCard";
// import WhatsappCampaignDetailsCard from "../WhatsappCampaignsList/WhatsappCampaignDetailsCard";
import CallsContactsResultsTable from "../CallsCampaignsList/CallsContactsResultsTable";
// import WhatsappContactsResultsTable from "../WhatsappCampaignsList/WhatsappContactsResultsTable";
import { startVoiceCampaign } from "../../../api/startVoiceCampaign";

export default function CampaignsView() {
  const theme = useTheme();

  const [selectedId, setSelectedId] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null); // "voice" | "whatsapp"

  const [pausing, setPausing] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [stopping, setStopping] = useState(false);

  const [statusOverride, setStatusOverride] = useState(null);
  const {
    campaigns = [],
    loading: loadingList,
    error: listError,
  } = useCampaignsList();

  /*
  const {
    campaigns: whatsappCampaigns = [],
    loading: loadingWhatsappList,
    error: whatsappListError,
  } = useWhatsappCampaignsList();
  */

  const {
    campaign,
    loading: loadingDetail,
    error: detailError,
  } = useCampaignDetail(selectedSource === "voice" ? selectedId : null);

  /*
  const selectedWhatsappCampaign = useMemo(
    () => whatsappCampaigns.find((c) => c.campaignId === selectedId) || null,
    [whatsappCampaigns, selectedId]
  );
  */

  /*
  const activeCampaign =
    selectedSource === "whatsapp" ? selectedWhatsappCampaign : campaign;
  */

  const activeCampaign = campaign;

  const currentStatus = statusOverride || activeCampaign?.status || "UNKNOWN";

  useEffect(() => {
    setStatusOverride(null);
  }, [selectedId, selectedSource]);


  const getStatusColor = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "error";
      case "RUNNING":
        return "info";
      case "QUEUED":
      case "SCHEDULED":
        return "warning";
      case "PAUSED":
        return "secondary";
      case "STOPPED":
        return "default";
      default:
        return "default";
    }
  };


  const getReturnedStatus = (result, fallback) =>
    result?.status || result?.attributes?.status || fallback;


const handlePause = async () => {
  if (!activeCampaign?.campaignId) return;

  try {
    setPausing(true);

    const result = await updateCampaignStatus(activeCampaign.campaignId, "pause", {
      reason: "manual pause from dashboard",
      updatedBy: "admin",
    });

    setStatusOverride(getReturnedStatus(result, "PAUSED"));
  } catch (err) {
    console.error(err);
  } finally {
    setPausing(false);
  }
};

const handleResume = async () => {
  if (!activeCampaign?.campaignId) return;

  try {
    setResuming(true);

    const result = await updateCampaignStatus(activeCampaign.campaignId, "resume", {
      reason: "manual resume from dashboard",
      updatedBy: "admin",
    });

    const resumedStatus =
      result?.status || result?.attributes?.status || "RUNNING";

    setStatusOverride(resumedStatus);

    // Re-arm the campaign because the previous EventBridge schedule may have
    // already fired while the campaign was PAUSED.
    if (["RUNNING", "QUEUED", "SCHEDULED"].includes(resumedStatus)) {
      await startVoiceCampaign({
        campaignId: activeCampaign.campaignId,
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    setResuming(false);
  }
};

const handleStop = async () => {
  if (!activeCampaign?.campaignId) return;

  const confirmed = window.confirm(
    "¿Seguro que quieres detener esta campaña definitivamente? Esta acción no se podrá reanudar."
  );

  if (!confirmed) return;

  try {
    setStopping(true);

    const result = await updateCampaignStatus(activeCampaign.campaignId, "stop", {
      reason: "manual stop from dashboard",
      updatedBy: "admin",
    });

    setStatusOverride(getReturnedStatus(result, "STOPPED"));
  } catch (err) {
    console.error(err);
  } finally {
    setStopping(false);
  }
};


  // const combinedError = listError || whatsappListError || detailError;
  const combinedError = listError || detailError;

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

        {combinedError && (
          <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 3 }}>
            {combinedError}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "320px minmax(0, 1fr)",
            },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <CallIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  <Typography variant="overline" fontWeight={800} sx={{ flexGrow: 1 }}>
                    Campañas Voz
                  </Typography>
                  <Chip
                    label={campaigns.length}
                    size="small"
                    variant="outlined"
                    sx={{ height: 18, fontSize: "0.65rem" }}
                  />
                </Stack>

                <CallsCampaignList
                  campaigns={campaigns}
                  loading={loadingList}
                  selectedId={selectedSource === "voice" ? selectedId : null}
                  onSelect={(id) => {
                    setSelectedSource("voice");
                    setSelectedId(id);
                  }}
                />
              </Box>

              {/*
              <Divider />

              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <WhatsAppIcon sx={{ fontSize: 18, color: "success.main" }} />
                  <Typography variant="overline" fontWeight={800} sx={{ flexGrow: 1 }}>
                    Campañas WhatsApp
                  </Typography>
                  <Chip
                    label={whatsappCampaigns.length}
                    size="small"
                    variant="outlined"
                    sx={{ height: 18, fontSize: "0.65rem" }}
                  />
                </Stack>

                <WhatsappCampaignList
                  campaigns={whatsappCampaigns}
                  loading={loadingWhatsappList}
                  selectedId={selectedSource === "whatsapp" ? selectedId : null}
                  onSelect={(id) => {
                    setSelectedSource("whatsapp");
                    setSelectedId(id);
                  }}
                />
              </Box>
              */}
            </Stack>
          </Box>

          <Box sx={{ minWidth: 0 }}>
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
            ) : (
              <Stack spacing={3} sx={{ minWidth: 0 }}>
                <CallsCampaignDetailsCard
                  selectedId={selectedId}
                  loading={loadingDetail}
                  campaign={campaign}
                  currentStatus={currentStatus}
                  getStatusColor={getStatusColor}
                  handlePause={handlePause}
                  handleResume={handleResume}
                  handleStop={handleStop}
                  pausing={pausing}
                  resuming={resuming}
                  stopping={stopping}
                />

                {campaign && (
                  <CallsContactsResultsTable
                    selectedId={selectedId}
                    getStatusColor={getStatusColor}
                  />
                )}
              </Stack>
            )}

            {/*
            selectedSource === "whatsapp" ? (
              <Stack spacing={3} sx={{ minWidth: 0 }}>
                <WhatsappCampaignDetailsCard
                  selectedId={selectedId}
                  loading={loadingWhatsappList && !selectedWhatsappCampaign}
                  campaign={selectedWhatsappCampaign}
                  currentStatus={currentStatus}
                  getStatusColor={getStatusColor}
                  handlePause={handlePause}
                  handleResume={handleResume}
                  pausing={pausing}
                  resuming={resuming}
                />

                {selectedWhatsappCampaign && (
                  <WhatsappContactsResultsTable selectedId={selectedId} />
                )}
              </Stack>
            ) : (
              // Vista de campañas de voz
            )
            */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}