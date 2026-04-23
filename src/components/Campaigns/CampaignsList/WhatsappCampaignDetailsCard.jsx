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

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import StorageIcon from "@mui/icons-material/Storage";

export default function WhatsappCampaignDetailsCard({
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
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: "success.main",
              }}
            >
              <WhatsAppIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                Detalle de la Campaña de WhatsApp
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Resumen, programación y métricas de ejecución
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
              p: 2.5,
              bgcolor: alpha(theme.palette.success.main, 0.02),
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr 1fr 1fr" },
                gap: 3,
              }}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <FingerprintIcon fontSize="inherit" /> IDENTIFICACIÓN
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {show(campaign.title)}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  ID: {show(campaign.campaignId)}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Tipo: {show(campaign.campaignType)}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Flujo: {show(campaign.flowId)}
                </Typography>
              </Stack>

              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <EventIcon fontSize="inherit" /> FECHAS / ESTADO
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Creada: {formatDate(campaign.createdAt)}
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Programada: {formatDate(campaign.scheduledStartUtc)}
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Finalizada: {formatDate(campaign.finishedAt)}
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Estado: {show(campaign.status)}
                </Typography>
              </Stack>

              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <SettingsIcon fontSize="inherit" /> PROGRAMACIÓN / EJECUCIÓN
                </Typography>

                <Typography variant="caption" fontWeight={500}>
                  Slots: {show(campaign.slots)}
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Total filas: {show(campaign.totalRows)}
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Restantes: {show(campaign.remainingRows)}
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Último índice: {show(campaign.lastProcessedIndex)}
                </Typography>
              </Stack>

              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <StorageIcon fontSize="inherit" /> ORIGEN / MÉTRICAS
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Enviados: {show(campaign.sentCount)}
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Fallidos: {show(campaign.failedCount)}
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  Omitidos: {show(campaign.skippedCount)}
                </Typography>
              </Stack>
            </Box>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
}