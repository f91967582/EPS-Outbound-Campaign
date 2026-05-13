import React, { useMemo, useState } from "react";
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
    TextField,
    MenuItem,
} from "@mui/material";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import DownloadIcon from "@mui/icons-material/Download";

import { useCampaignDetail } from "../../../services/useCampaignsApi";
import { downloadCsv } from "../../../utils/downloadCsv";

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

    const [search, setSearch] = useState("");
    const [callResultFilter, setCallResultFilter] = useState("ALL");

    const getStatusColor = (status) => {
        const s = String(status || "").toUpperCase();

        if (["COMPLETED", "ANSWERED", "PROCESSED"].includes(s)) return "success";
        if (["IN_PROGRESS", "ACTIVE", "CALLING"].includes(s)) return "info";
        if (["PENDING", "QUEUED", "BUSY"].includes(s)) return "warning";
        if (["FAILED", "NO_ANSWER", "REJECTED", "ERROR"].includes(s)) return "error";

        return "default";
    };

    const getRawCallResult = (row) =>
        row?.lastCallStatus || row?.finalStatus || row?.outboundCallStatus || "";

    const getCallResult = (row) => {
        const status = String(getRawCallResult(row) || "").toUpperCase();

        if (status === "ANSWERED" || status === "COMPLETED") {
            return "CONTESTADA";
        }

        return status;
    };

    const isContactado = (row) => {
        const status = String(getRawCallResult(row) || "").toUpperCase();

        return status === "ANSWERED" || status === "COMPLETED";
    };



    const uniqueRows = useMemo(() => {
        const seen = new Set();

        return rows.filter((row, index) => {
            const key = [
                row?.campaignId || selectedId || "",
                row?.contactId || "",
                row?.phoneNumber || "",
            ].join("#");

            const fallbackKey = `${index}-${JSON.stringify(row)}`;
            const finalKey = key.replace(/#/g, "") ? key : fallbackKey;

            if (seen.has(finalKey)) return false;

            seen.add(finalKey);
            return true;
        });
    }, [rows, selectedId]);

    const callResultOptions = useMemo(() => {
        const values = uniqueRows.map(getCallResult).filter(Boolean);
        return ["ALL", ...Array.from(new Set(values))];
    }, [uniqueRows]);

    const filteredRows = useMemo(() => {
        const q = search.trim().toLowerCase();

        return uniqueRows.filter((row) => {
            const searchableText = [
                row?.contactId,
                row?.phoneNumber,
                row?.nombre,
                row?.correo,
                row?.codigo,
                row?.oficina,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const callResult = String(getCallResult(row) || "");

            const matchesSearch = !q || searchableText.includes(q);

            const matchesCallResult =
                callResultFilter === "ALL" || callResult === callResultFilter;

            return matchesSearch && matchesCallResult;
        });
    }, [uniqueRows, search, callResultFilter]);

    const chartData = useMemo(() => {
        const contactados = filteredRows.filter(isContactado).length;
        const noContactados = filteredRows.length - contactados;

        return [
            {
                name: "Contactados",
                value: contactados,
                color: theme.palette.success.main,
            },
            {
                name: "No contactados",
                value: noContactados,
                color: theme.palette.error.light,
            },
        ];
    }, [filteredRows, theme.palette]);

    const contactadosCount = chartData[0]?.value || 0;
    const noContactadosCount = chartData[1]?.value || 0;

    const hasActiveFilters = search.trim() || callResultFilter !== "ALL";

    const show = (value) => {
        if (value === null || value === undefined || value === "") return "—";
        return String(value);
    };

    const csvColumns = [
        { key: "contactId", label: "Telefono" },
    ];

    const handleDownloadCsv = () => {
        const exportRows = filteredRows.map((row) => ({
            contactId: row?.contactId || "",
        }));

        downloadCsv(
            `contactos-campana-${selectedId || "resultados"}.csv`,
            csvColumns,
            exportRows
        );
    };

    const handleClearFilters = () => {
        setSearch("");
        setCallResultFilter("ALL");
    };

    const handleLoadMore = () => {
        if (loading || !nextToken) return;
        loadMore();
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
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mb: 2 }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2" fontWeight={800}>
                            CONTACTOS
                        </Typography>

                        <Chip
                            label={`${filteredRows.length}/${uniqueRows.length}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                            }}
                        />
                    </Stack>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadCsv}
                        disabled={loading || filteredRows.length === 0}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        Descargar CSV
                    </Button>
                </Stack>

                <Paper
                    variant="outlined"
                    sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: "grey.50" }}
                >
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", md: "center" }}
                        sx={{ width: "100%" }}
                    >
                        <TextField
                            label="Buscar contacto, código u oficina"
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{
                                flex: { xs: "1 1 auto", md: "1 1 320px" },
                                minWidth: 0,
                            }}
                        />

                        <TextField
                            select
                            label="Resultado llamada"
                            size="small"
                            value={callResultFilter}
                            onChange={(e) => setCallResultFilter(e.target.value)}
                            sx={{
                                flex: { xs: "1 1 auto", md: "0 1 220px" },
                                minWidth: { xs: "100%", md: 180 },
                            }}
                        >
                            {callResultOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option === "ALL" ? "Todos" : option}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            variant="text"
                            onClick={handleClearFilters}
                            disabled={!hasActiveFilters}
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                                alignSelf: { xs: "stretch", md: "center" },
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </Stack>
                </Paper>

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
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                        >
                                            EFECTIVIDAD
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            fontWeight={800}
                                            color="success.main"
                                        >
                                            {filteredRows.length > 0
                                                ? Math.round(
                                                    (contactadosCount / filteredRows.length) * 100
                                                )
                                                : 0}
                                            %
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">Contactados:</Typography>
                                        <Typography variant="body2" fontWeight={700}>
                                            {contactadosCount}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">No contactados:</Typography>
                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            color="error.main"
                                        >
                                            {noContactadosCount}
                                        </Typography>
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
                                        <TableCell sx={headCellSx}>NOMBRE</TableCell>
                                        <TableCell sx={headCellSx}>CORREO</TableCell>
                                        <TableCell sx={headCellSx}>CÓDIGO</TableCell>
                                        <TableCell sx={headCellSx}>OFICINA</TableCell>
                                        <TableCell sx={headCellSx}>RESULTADO LLAMADA</TableCell>
                                        <TableCell sx={headCellSx} align="center">
                                            INTENTOS
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filteredRows.map((r, idx) => {
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

                                                <TableCell>{show(r?.nombre)}</TableCell>

                                                <TableCell>{show(r?.correo)}</TableCell>

                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={700}>
                                                        {show(r?.codigo)}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>{show(r?.oficina)}</TableCell>



                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={500}
                                                        color={
                                                            isContactado(r)
                                                                ? "success.main"
                                                                : "text.primary"
                                                        }
                                                    >
                                                        {show(getCallResult(r))}
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

                                    {filteredRows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                                <SearchOffIcon
                                                    sx={{
                                                        color: "text.disabled",
                                                        mb: 1,
                                                        fontSize: 40,
                                                    }}
                                                />

                                                <Typography variant="body2" color="text.secondary">
                                                    {uniqueRows.length === 0
                                                        ? "No se encontraron registros para esta campaña."
                                                        : "No se encontraron registros con los filtros seleccionados."}
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
                                    onClick={handleLoadMore}
                                    disabled={loading || !nextToken}
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