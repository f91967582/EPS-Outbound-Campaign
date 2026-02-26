// components/CampaignsView.jsx
import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Skeleton,
  Box,
} from "@mui/material";

import { useCampaignsList, useCampaignDetail } from "../../services/useCampaignsApi";

export default function CampaignsView() {
  const [selectedId, setSelectedId] = useState(null);

  const { campaigns, loading: loadingList, error: listError } = useCampaignsList();
  const {
    campaign,
    rows,
    nextToken,
    loading: loadingDetail,
    error: detailError,
    loadMore,
  } = useCampaignDetail(selectedId);

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "error";
      case "IN_PROGRESS":
        return "info";
      case "QUEUED":
        return "warning";
      default:
        return "default";
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
        {/* PANEL IZQUIERDO */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Listado de Campañas</Typography>
                {loadingList && <CircularProgress size={20} />}
              </Box>

              <Divider sx={{ my: 2 }} />

              {loadingList ? (
                <>
                  <Skeleton height={60} />
                  <Skeleton height={60} />
                  <Skeleton height={60} />
                </>
              ) : (
                <List>
                  {campaigns.map((c) => (
                    <ListItemButton
                      key={c.campaignId}
                      selected={selectedId === c.campaignId}
                      onClick={() => setSelectedId(c.campaignId)}
                      sx={{ mb: 1, borderRadius: 2 }}
                    >
                      <ListItemText
                        primary={
                          <Typography fontWeight={600}>
                            {c.title || "(Sin título)"}
                          </Typography>
                        }
                        secondary={
                          c.createdAt
                            ? `Iniciada: ${new Date(c.createdAt).toLocaleString()}`
                            : "—"
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* PANEL DERECHO */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalle de la Campaña
              </Typography>

              {!selectedId && (
                <Typography color="text.secondary">
                  Selecciona una campaña para ver los detalles.
                </Typography>
              )}

              {selectedId && loadingDetail && (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              )}

              {campaign && (
                <>
                  {/* Información general */}
                  <Box
                    sx={{
                      p: 2,
                      mb: 3,
                      borderRadius: 2,
                      backgroundColor: "grey.50",
                    }}
                  >
                    <Typography>
                      <strong>Título:</strong> {campaign.title}
                    </Typography>
                    <Typography>
                      <strong>ID de Campaña:</strong> {campaign.campaignId}
                    </Typography>
                    <Typography>
                      <strong>ID de Flujo:</strong> {campaign.flowId}
                    </Typography>
                    <Typography>
                      <strong>Fecha de Creación:</strong>{" "}
                      {new Date(campaign.createdAt).toLocaleString()}
                    </Typography>

                    <Box mt={1}>
                      <Chip
                        label={campaign.status}
                        color={getStatusColor(campaign.status)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  {/* Resultados */}
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Resultados
                  </Typography>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Teléfono</strong></TableCell>
                          <TableCell><strong>Estado</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((r, idx) => (
                          <TableRow key={(r.phoneNumber || "") + idx}>
                            <TableCell>{r.phoneNumber || "—"}</TableCell>
                            <TableCell>
                              <Chip
                                label={r.outboundCallStatus || r.status || "—"}
                                size="small"
                                color={getStatusColor(r.outboundCallStatus || r.status)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}

                        {rows.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              <Typography color="text.secondary">
                                Aún no hay resultados.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Paginación */}
                  <Box mt={3}>
                    {nextToken ? (
                      <Button variant="outlined" onClick={loadMore}>
                        Cargar más
                      </Button>
                    ) : (
                      <Typography color="text.secondary">
                        No hay más registros.
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}