import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Avatar,
  Paper,
  Divider,
  alpha,
  useTheme
} from "@mui/material";
// Icons for a professional look
import CallIcon from '@mui/icons-material/Call';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

export default function CallsCampaignCard({
  selectedId,
  loading,
  campaign,
  rows = [],
  nextToken,
  loadMore,
  currentStatus,
  getStatusColor,
  handlePause,
  handleResume,
  pausing,
  resuming,
}) {
  const theme = useTheme();

  // Helper for consistent "Soft" Chips
  const renderSoftChip = (label, status) => {
    const color = getStatusColor(status);
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

  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 4, 
        border: "1px solid", 
        borderColor: "divider",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" 
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
              <CallIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                Detalle de la Campaña de Voz
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Control y seguimiento de llamadas salientes
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
                  startIcon={pausing ? <CircularProgress size={14} color="inherit" /> : <PauseIcon />}
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
                  startIcon={resuming ? <CircularProgress size={14} color="inherit" /> : <PlayArrowIcon />}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  {resuming ? "Reanudando..." : "Reanudar"}
                </Button>
              )}
            </Stack>
          )}
        </Stack>

        {!selectedId && (
          <Box textAlign="center" py={6} sx={{ bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
            <InfoOutlinedIcon sx={{ color: 'text.disabled', fontSize: 40, mb: 1 }} />
            <Typography color="text.secondary" variant="body2">
              Selecciona una campaña para ver los detalles.
            </Typography>
          </Box>
        )}

        {selectedId && loading && (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <CircularProgress size={32} thickness={5} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">Cargando datos de campaña...</Typography>
          </Box>
        )}

        {campaign && !loading && (
          <>
            {/* Metadata Grid */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2.5, 
                mb: 4, 
                bgcolor: alpha(theme.palette.primary.main, 0.01),
                borderRadius: 3,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1.5fr 1fr 1fr' },
                gap: 3
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} display="flex" alignItems="center" gap={0.5}>
                   <FingerprintIcon fontSize="inherit" /> IDENTIFICACIÓN
                </Typography>
                <Typography variant="body2" fontWeight={600}>{campaign.title || "Sin título"}</Typography>
                <Typography variant="caption" color="text.disabled">ID: {campaign.campaignId || "—"}</Typography>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} display="flex" alignItems="center" gap={0.5}>
                   <EventIcon fontSize="inherit" /> CREACIÓN
                </Typography>
                <Typography variant="body2">
                   {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : "—"}
                </Typography>
                <Typography variant="caption" color="text.disabled">Flujo: {campaign.flowId || "—"}</Typography>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} display="flex" alignItems="center" gap={0.5}>
                   <SettingsIcon fontSize="inherit" /> CONFIGURACIÓN
                </Typography>
                <Typography variant="caption" fontWeight={500}>Intentos: {campaign.maxAttempts ?? "—"}</Typography>
                <Typography variant="caption" fontWeight={500}>Intervalo: {campaign.callIntervalSeconds ?? "—"}s</Typography>
                <Typography variant="caption" fontWeight={500}>Concurrentes: {campaign.maxConcurrentCalls ?? "—"}</Typography>
              </Stack>
            </Paper>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
              RESULTADOS DE LLAMADAS
              <Chip label={rows.length} size="small" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
            </Typography>

            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size="medium" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>TELÉFONO</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>INTENTOS</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>ÚLTIMO ESTADO</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>ESTADO FINAL</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>PROCESAMIENTO</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((r, idx) => (
                    <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{r.phoneNumber || "—"}</TableCell>
                      <TableCell>{r.attemptsDisplay || "—"}</TableCell>
                      <TableCell>{renderSoftChip(r.lastCallStatus, r.lastCallStatus)}</TableCell>
                      <TableCell>
                        {r.finalStatus ? renderSoftChip(r.finalStatus, r.finalStatus) : "—"}
                      </TableCell>
                      <TableCell>{renderSoftChip(r.processingStatus, r.processingStatus)}</TableCell>
                    </TableRow>
                  ))}

                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <SearchOffIcon sx={{ color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          No se encontraron resultados para esta campaña.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={3} display="flex" justifyContent="center">
              {nextToken ? (
                <Button 
                  variant="outlined" 
                  onClick={loadMore} 
                  size="small"
                  sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
                >
                  Cargar más registros
                </Button>
              ) : (
                <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                  No hay más registros disponibles.
                </Typography>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}