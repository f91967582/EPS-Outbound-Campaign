import React, { useMemo } from "react";
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
  Paper,
  Stack,
  useTheme,
} from "@mui/material";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useWhatsappCampaignDetail } from "../../../hooks/useWhatsappCampaignsList";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function WhatsappContactsResultsTable({ selectedId }) {
  const theme = useTheme();

  const {
    rows = [],
    nextToken,
    loading = false,
    error,
    loadMore,
  } = useWhatsappCampaignDetail(selectedId);

  const getStatusColor = (status) => {
    const s = String(status || "").toUpperCase();

    if (["READ", "DELIVERED"].includes(s)) return "success";
    if (["SENT"].includes(s)) return "info";
    if (["ACCEPTED", "STARTED", "QUEUED"].includes(s)) return "warning";
    if (["FAILED", "ERROR"].includes(s)) return "error";

    return "default";
  };

  const isSuccess = (row) => {
    const status = String(row?.latestStatus || "").toUpperCase();
    return ["DELIVERED", "READ"].includes(status);
  };

  const chartData = useMemo(() => {
    const ok = rows.filter(isSuccess).length;
    const rest = rows.length - ok;

    return [
      {
        name: "Entregados / leídos",
        value: ok,
        color: theme.palette.success.main,
      },
      {
        name: "Pendientes / fallidos",
        value: rest,
        color: theme.palette.error.light,
      },
    ];
  }, [rows, theme.palette]);

  const successCount = chartData[0]?.value || 0;
  const pendingCount = chartData[1]?.value || 0;

  const show = (value) => {
    if (value === null || value === undefined || value === "") return "—";
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
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={800}>
            RESULTADOS WHATSAPP
          </Typography>
          <Chip
            label={rows.length}
            size="small"
            color="success"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }}
          />
        </Stack>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <CircularProgress size={32} thickness={5} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Cargando resultados WhatsApp...
            </Typography>
          </Box>
        ) : (
          <>
            <Paper
              variant="outlined"
              sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: "grey.50" }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                alignItems="center"
                justifyContent="space-around"
              >
                <Box sx={{ width: "100%", maxWidth: 300, height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Stack spacing={1.5} sx={{ minWidth: 220 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      EFECTIVIDAD
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="success.main">
                      {rows.length > 0
                        ? Math.round((successCount / rows.length) * 100)
                        : 0}%
                    </Typography>
                  </Box>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Entregados / leídos:</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {successCount}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Pendientes / fallidos:</Typography>
                    <Typography variant="body2" fontWeight={700} color="error.main">
                      {pendingCount}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: 540, borderRadius: 3 }}
            >
              <Table size="medium" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headCellSx}>CONTACTO</TableCell>
                    <TableCell sx={headCellSx}>ESTADO</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((r, idx) => (
                    <TableRow
                      key={`${r?.contactId || "row"}-${idx}`}
                      hover
                      sx={{ "&:last-child td": { border: 0 } }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>
                        <Stack spacing={0.25}>
                          <Typography variant="body2" fontWeight={700}>
                            {show(r?.displayName || r?.contactId)}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={show(r?.latestStatus)}
                          size="small"
                          variant="outlined"
                          color={getStatusColor(r?.latestStatus)}
                          sx={{
                            width: "fit-content",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            fontSize: "0.65rem",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                        <SearchOffIcon
                          sx={{ color: "text.disabled", mb: 1, fontSize: 40 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          No se encontraron registros para esta campaña.
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
                  variant="contained"
                  onClick={loadMore}
                  disableElevation
                  sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
                >
                  Cargar más registros
                </Button>
              ) : (
                <Typography
                  variant="caption"
                  sx={{ color: "text.disabled", fontStyle: "italic" }}
                >
                  Fin de los registros.
                </Typography>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

const headCellSx = {
  bgcolor: "grey.100",
  fontWeight: 800,
  color: "text.secondary",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  letterSpacing: "0.05rem",
};