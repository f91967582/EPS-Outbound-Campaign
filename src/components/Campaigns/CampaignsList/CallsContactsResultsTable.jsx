import React, { useEffect, useMemo } from "react";
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
import { useCampaignDetail } from "../../../services/useCampaignsApi";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

export default function CallsContactsResultsTable({ selectedId }) {
    const theme = useTheme();
    const {
        rows = [],
        nextToken,
        loading = false,
        error,
        loadMore,
    } = useCampaignDetail(selectedId);

    // --- Color Mapping Helpers ---

    const getStatusColor = (status) => {
        const s = String(status || "").toUpperCase();
        if (["COMPLETED", "ANSWERED", "PROCESSED"].includes(s)) return "success";
        if (["IN_PROGRESS", "ACTIVE", "CALLING"].includes(s)) return "info";
        if (["PENDING", "QUEUED", "BUSY"].includes(s)) return "warning";
        if (["FAILED", "NO_ANSWER", "REJECTED", "ERROR"].includes(s)) return "error";
        return "default";
    };

    const isContactado = (row) => {
        const status = String(
            row?.finalStatus || row?.lastCallStatus || row?.outboundCallStatus || ""
        ).toUpperCase();
        return status === "ANSWERED" || status === "COMPLETED";
    };

    // --- Data Processing ---

    const chartData = useMemo(() => {
        const contactados = rows.filter(isContactado).length;
        const noContactados = rows.length - contactados;

        return [
            { name: "Contactados", value: contactados, color: theme.palette.success.main },
            { name: "No contactados", value: noContactados, color: theme.palette.error.light },
        ];
    }, [rows, theme.palette]);

    const contactadosCount = chartData[0]?.value || 0;
    const noContactadosCount = chartData[1]?.value || 0;

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
                        CONTACTOS
                    </Typography>
                    <Chip
                        label={rows.length}
                        size="small"
                        color="primary"
                        variant="soft" // If using MUI Joy or a custom theme, otherwise use "outlined"
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
                            Cargando contactos...
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

                                <Stack spacing={1.5} sx={{ minWidth: 200 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            EFECTIVIDAD
                                        </Typography>
                                        <Typography variant="h4" fontWeight={800} color="success.main">
                                            {rows.length > 0 
                                                ? Math.round((contactadosCount / rows.length) * 100) 
                                                : 0}%
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">Contactados:</Typography>
                                        <Typography variant="body2" fontWeight={700}>{contactadosCount}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">No contactados:</Typography>
                                        <Typography variant="body2" fontWeight={700} color="error.main">{noContactadosCount}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Paper>

                        <TableContainer
                            component={Paper}
                            variant="outlined"
                            sx={{ maxHeight: 520, borderRadius: 3 }}
                        >
                            <Table size="medium" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={headCellSx}>CONTACTO</TableCell>
                                        <TableCell sx={headCellSx}>ESTADO PROCESO</TableCell>
                                        <TableCell sx={headCellSx}>RESULTADO LLAMADA</TableCell>
                                        <TableCell sx={headCellSx} align="center">INTENTOS</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {rows.map((r, idx) => {
                                        const isMaxed = r?.attemptsMade >= r?.maxAttempts;
                                        return (
                                            <TableRow
                                                key={`${r?.contactId || "row"}-${idx}`}
                                                hover
                                                sx={{ "&:last-child td": { border: 0 } }}
                                            >
                                                <TableCell sx={{ fontWeight: 600 }}>
                                                    {show(r?.contactId)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={show(r?.processingStatus)} 
                                                        size="small" 
                                                        variant="outlined"
                                                        color={getStatusColor(r?.processingStatus)}
                                                        sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={500} color={isContactado(r) ? "success.main" : "text.primary"}>
                                                        {show(r?.lastCallStatus || r?.finalStatus)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography 
                                                        variant="body2" 
                                                        color={isMaxed ? "error.main" : "text.secondary"}
                                                        fontWeight={isMaxed ? 700 : 400}
                                                    >
                                                        {show(r?.attemptsMade)} / {show(r?.maxAttempts)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    {rows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                                <SearchOffIcon sx={{ color: "text.disabled", mb: 1, fontSize: 40 }} />
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