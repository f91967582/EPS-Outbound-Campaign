import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
  Stack,
  Avatar,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";

import CallIcon from "@mui/icons-material/Call";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

export default function CallsCampaignDetailsCard({
  selectedId,
  loading,
  campaign,
  currentStatus,
  getStatusColor,
  handlePause,
  handleResume,
  pausing,
  resuming,
}) {
  const theme = useTheme();

  React.useEffect(() => {
    if (!selectedId) return;

    console.group("Selected campaign");
    console.log("campaignId:", selectedId);
    console.log("campaign object:", campaign);
    console.log("scheduledAt:", campaign?.scheduledAt);
    console.groupEnd();
  }, [selectedId, campaign]);

  const renderSoftChip = (label, status) => {
    const safeStatus = status || label || "—";
    const color = getStatusColor?.(safeStatus) || "default";

    return (
      <Chip
        label={label || "—"}
        size="small"
        sx={{
          fontWeight: 700,
          borderRadius: "8px",
          textTransform: "uppercase",
          fontSize: "0.65rem",
          backgroundColor: alpha(theme.palette[color]?.main || "#ccc", 0.1),
          color: theme.palette[color]?.dark || "#000",
          border: `1px solid ${alpha(theme.palette[color]?.main || "#ccc", 0.2)}`,
        }}
      />
    );
  };

  const formatDate = (value) => {
    if (!value && value !== 0) return "—";

    if (typeof value === "number") {
      const ms = value < 1000000000000 ? value * 1000 : value;
      const d = new Date(ms);
      return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
    }

    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
  };

  const show = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    return String(value);
  };


  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            >
              <CallIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                Detalle de la Campaña de Voz
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Resumen y configuración de campaña
              </Typography>
            </Box>
          </Stack>

          {campaign && (
            <Stack direction="row" spacing={1} alignItems="center">
              {renderSoftChip(currentStatus, currentStatus)}

              {currentStatus === "RUNNING" && (
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={handlePause}
                  disabled={pausing || resuming}
                  startIcon={
                    pausing ? (
                      <CircularProgress size={14} color="inherit" />
                    ) : (
                      <PauseIcon />
                    )
                  }
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  {pausing ? "Pausando..." : "Pausar"}
                </Button>
              )}

              {currentStatus === "PAUSED" && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleResume}
                  disabled={resuming || pausing}
                  startIcon={
                    resuming ? (
                      <CircularProgress size={14} color="inherit" />
                    ) : (
                      <PlayArrowIcon />
                    )
                  }
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  {resuming ? "Reanudando..." : "Reanudar"}
                </Button>
              )}
            </Stack>
          )}
        </Stack>

        {!selectedId && (
          <Box
            textAlign="center"
            py={6}
            sx={{
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "grey.300",
            }}
          >
            <InfoOutlinedIcon
              sx={{ color: "text.disabled", fontSize: 40, mb: 1 }}
            />
            <Typography color="text.secondary" variant="body2">
              Selecciona una campaña para ver los detalles.
            </Typography>
          </Box>
        )}

        {selectedId && loading && (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <CircularProgress size={32} thickness={5} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Cargando detalles de campaña...
            </Typography>
          </Box>
        )}

        {campaign && !loading && (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.015),
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr 1fr" },
                gap: 4,
              }}
            >
              <Stack spacing={0.75}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={800}
                  display="flex"
                  alignItems="center"
                  gap={0.75}
                  sx={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.08rem",
                    lineHeight: 1.2,
                  }}
                >
                  <FingerprintIcon fontSize="small" /> IDENTIFICACION
                </Typography>

                <Typography
                  variant="subtitle1"
                  fontWeight={900}
                  sx={{
                    lineHeight: 1.25,
                    color: "text.primary",
                  }}
                >
                  {show(campaign.title)}
                </Typography>

                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Tipo:{" "}
                  <Box component="span" color="text.primary" fontWeight={700}>
                    {show(campaign.campaignType)}
                  </Box>
                </Typography>

                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Flujo:{" "}
                  <Box component="span" color="text.primary" fontWeight={700}>
                    {show(campaign.flowName)}
                  </Box>
                </Typography>
              </Stack>

              <Stack spacing={0.75}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={800}
                  display="flex"
                  alignItems="center"
                  gap={0.75}
                  sx={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.08rem",
                    lineHeight: 1.2,
                  }}
                >
                  <EventIcon fontSize="small" /> FECHAS / ESTADO
                </Typography>

                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Creada:{" "}
                  <Box component="span" color="text.primary" fontWeight={700}>
                    {formatDate(campaign.createdAt)}
                  </Box>
                </Typography>

                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Programada:{" "}
                  <Box component="span" color="text.primary" fontWeight={700}>
                    {formatDate(campaign.scheduledAt)}
                  </Box>
                </Typography>

                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Estado:{" "}
                  <Box component="span" color="text.primary" fontWeight={700}>
                    {show(campaign.status)}
                  </Box>
                </Typography>
              </Stack>

              <Stack spacing={0.75}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={800}
                  display="flex"
                  alignItems="center"
                  gap={0.75}
                  sx={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.08rem",
                    lineHeight: 1.2,
                  }}
                >
                  <SettingsIcon fontSize="small" /> CONFIGURACION
                </Typography>

                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Intentos max:{" "}
                  <Box component="span" color="text.primary" fontWeight={700}>
                    {show(campaign.maxAttempts)}
                  </Box>
                </Typography>

                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Intervalo:{" "}
                  <Box component="span" color="text.primary" fontWeight={700}>
                    {show(campaign.callIntervalSeconds)}m
                  </Box>
                </Typography>

                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Concurrentes:{" "}
                  <Box component="span" color="text.primary" fontWeight={700}>
                    {show(campaign.maxConcurrentCalls)}
                  </Box>
                </Typography>

                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Procesar todos:{" "}
                  <Box component="span" color="text.primary" fontWeight={700}>
                    {show(campaign.processAllSimultaneously)}
                  </Box>
                </Typography>
              </Stack>
            </Box>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
}