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
} from "@mui/material";

export default function CampaignCard({
  selectedId,
  loading,
  campaign,
  rows,
  nextToken,
  loadMore,
  currentStatus,
  getStatusColor,
  handlePause,
  handleResume,
  pausing,
  resuming,
}) {
  return (
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

        {selectedId && loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {campaign && (
          <>
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

              <Typography>
                <strong>Máx. intentos:</strong> {campaign.maxAttempts ?? "—"}
              </Typography>

              <Typography>
                <strong>Intervalo entre llamadas:</strong>{" "}
                {campaign.callIntervalSeconds ?? "—"} s
              </Typography>

              <Typography>
                <strong>Máx. llamadas simultáneas:</strong>{" "}
                {campaign.maxConcurrentCalls ?? "—"}
              </Typography>

              <Box mt={1} display="flex" alignItems="center" gap={2}>
                <Chip
                  label={currentStatus}
                  color={getStatusColor(currentStatus)}
                  size="small"
                />

                {currentStatus === "RUNNING" && (
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={handlePause}
                    disabled={pausing || resuming}
                    startIcon={pausing ? <CircularProgress size={16} /> : null}
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
                    startIcon={resuming ? <CircularProgress size={16} /> : null}
                  >
                    {resuming ? "Reanudando..." : "Reanudar"}
                  </Button>
                )}
              </Box>
            </Box>

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Resultados
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Teléfono</strong></TableCell>
                    <TableCell><strong>Intentos</strong></TableCell>
                    <TableCell><strong>Último estado</strong></TableCell>
                    <TableCell><strong>Estado final</strong></TableCell>
                    <TableCell><strong>Procesamiento</strong></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((r, idx) => (
                    <TableRow key={(r.phoneNumber || "") + idx}>
                      <TableCell>{r.phoneNumber || "—"}</TableCell>

                      <TableCell>{r.attemptsDisplay || "—"}</TableCell>

                      <TableCell>
                        <Chip
                          label={r.lastCallStatus || "—"}
                          size="small"
                          color={getStatusColor(r.lastCallStatus)}
                        />
                      </TableCell>

                      <TableCell>
                        {r.finalStatus ? (
                          <Chip
                            label={r.finalStatus}
                            size="small"
                            color={getStatusColor(r.finalStatus)}
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={r.processingStatus || "—"}
                          size="small"
                          color={getStatusColor(r.processingStatus)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">
                          Aún no hay resultados.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

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
  );
}