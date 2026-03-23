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
  Tooltip,
  Divider,
  Stack,
  Avatar,
  Paper,
  alpha,
  useTheme
} from "@mui/material";
// Icons make the UI feel much more professional
import CampaignIcon from '@mui/icons-material/Campaign';
import EventIcon from '@mui/icons-material/Event';
import SmsIcon from '@mui/icons-material/Sms';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const STATUS_MAP = {
  SKIPPED: { label: "Omitido", color: "warning", tooltip: "Valor de la póliza es cero" },
  CREATED: { label: "Creada", color: "info" },
  SENT: { label: "Enviado", color: "success" },
};

export default function SmsCampaignsCard({
  selectedId,
  loading,
  campaign,
  rows = [],
  nextToken,
  loadMore,
}) {
  const theme = useTheme();

  const renderStatusChip = (status) => {
    const config = STATUS_MAP[status] || { label: status || "—", color: "default" };
    
    const chipElement = (
      <Chip
        label={config.label}
        size="small"
        sx={{
          fontWeight: 700,
          borderRadius: "8px",
          textTransform: "uppercase",
          fontSize: "0.65rem",
          // Creating a "Soft" variant look
          backgroundColor: alpha(theme.palette[config.color]?.main || "#ccc", 0.1),
          color: theme.palette[config.color]?.dark || "#000",
          border: `1px solid ${alpha(theme.palette[config.color]?.main || "#ccc", 0.2)}`,
        }}
      />
    );

    return config.tooltip ? (
      <Tooltip title={config.tooltip} arrow placement="top">
        <span>{chipElement}</span>
      </Tooltip>
    ) : chipElement;
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
        {/* Header Section */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
            <SmsIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
              Detalle de la Campaña
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Monitoreo de envíos en tiempo real
            </Typography>
          </Box>
        </Stack>

        {!selectedId && (
          <Box textAlign="center" py={6} sx={{ bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
            <InfoOutlinedIcon sx={{ color: 'text.disabled', fontSize: 40, mb: 1 }} />
            <Typography color="text.secondary" variant="body2">
              Selecciona una campaña para ver los detalles detallados.
            </Typography>
          </Box>
        )}

        {selectedId && loading && (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <CircularProgress size={32} thickness={5} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">Cargando datos...</Typography>
          </Box>
        )}

        {campaign && !loading && (
          <>
            {/* Campaign Metadata Grid */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2.5, 
                mb: 4, 
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                borderRadius: 3,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 2
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
                  <CampaignIcon fontSize="inherit" /> TÍTULO
                </Typography>
                <Typography variant="body2" fontWeight={600}>{campaign.title || "—"}</Typography>
              </Stack>
              
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
                  <EventIcon fontSize="inherit" /> CREACIÓN
                </Typography>
                <Typography variant="body2">
                  {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : "—"}
                </Typography>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
                  <PhoneIphoneIcon fontSize="inherit" /> TIPO
                </Typography>
                <Typography variant="body2">{campaign.campaignType || "SMS"}</Typography>
              </Stack>
            </Paper>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              LISTA DE DESTINATARIOS
              <Chip label={rows.length} size="small" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
            </Typography>

            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size="medium" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>TELÉFONO</TableCell>
                    <TableCell align="right" sx={{ bgcolor: 'grey.50', fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>ESTADO</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((r, idx) => {
                    const statusKey = r.status || r.deliveryStatus || r.finalStatus;
                    return (
                      <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>
                          {r.phoneNumber || r.phone || "—"}
                        </TableCell>
                        <TableCell align="right">
                          {renderStatusChip(statusKey)}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                        <SearchOffIcon sx={{ color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          No se encontraron registros en esta campaña.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination/Load More */}
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
                  Fin del listado
                </Typography>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}