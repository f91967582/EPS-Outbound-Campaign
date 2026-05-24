import React, { useEffect, useMemo, useState } from "react";
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
    alpha,
} from "@mui/material";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";

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

const PAGE_SIZE = 25;

export default function CallsContactsResultsTable({ selectedId }) {
    const theme = useTheme();

    const {
        rows = [],
        loading = false,
        error,
        reload,
    } = useCampaignDetail(selectedId);

    const [search, setSearch] = useState("");
    const [callResultFilter, setCallResultFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const handleRefresh = () => {
        if (loading || !reload) return;
        reload();
    };

    const getRawCallResult = (row) =>
        row?.lastCallStatus || row?.finalStatus || row?.outboundCallStatus || "";

    const getAttemptsMade = (row) => Number(row?.attemptsMade || 0);

    const getMaxAttempts = (row) => Number(row?.maxAttempts || 0);

    const isContactado = (row) => {
        const status = String(getRawCallResult(row) || "").toUpperCase();

        return status === "ANSWERED" || status === "COMPLETED";
    };

    const isPendiente = (row) => {
        if (isContactado(row)) return false;

        const attemptsMade = getAttemptsMade(row);
        const maxAttempts = getMaxAttempts(row);

        return maxAttempts > 0 && attemptsMade < maxAttempts;
    };

    const isNoContestada = (row) => {
        return !isContactado(row) && !isPendiente(row);
    };

    const getCallResult = (row) => {
        if (isContactado(row)) {
            return "CONTESTADA";
        }

        if (isPendiente(row)) {
            return "PENDIENTE";
        }

        return "NO CONTESTADA";
    };

    const getCallResultTextColor = (row) => {
        if (isContactado(row)) return "success.main";
        if (isPendiente(row)) return "warning.main";
        if (isNoContestada(row)) return "error.main";

        return "text.primary";
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
        const availableValues = new Set(uniqueRows.map(getCallResult).filter(Boolean));

        return [
            "ALL",
            ...["CONTESTADA", "PENDIENTE", "NO CONTESTADA"].filter((option) =>
                availableValues.has(option)
            ),
        ];
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

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedId, search, callResultFilter]);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
    }, [filteredRows.length]);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }, [totalPages]);

const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return filteredRows.slice(start, end);
}, [filteredRows, currentPage]);

const paginationStart =
    filteredRows.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

const paginationEnd = Math.min(currentPage * PAGE_SIZE, filteredRows.length);

useEffect(() => {
    console.groupCollapsed("[CallsContactsResultsTable] Results pagination/debug");

    console.log("selectedId:", selectedId);
    console.log("loading:", loading);
    console.log("error:", error);

    console.log("rows from hook:", rows.length);
    console.log("uniqueRows:", uniqueRows.length);
    console.log("filteredRows:", filteredRows.length);

    console.log("PAGE_SIZE:", PAGE_SIZE);
    console.log("totalPages:", totalPages);
    console.log("currentPage:", currentPage);
    console.log("paginatedRows:", paginatedRows.length);

    console.log("paginationStart:", paginationStart);
    console.log("paginationEnd:", paginationEnd);

    console.log("first row from hook:", rows[0]);
    console.log("last row from hook:", rows[rows.length - 1]);

    console.table(
        rows.slice(0, 10).map((row) => ({
            contactId: row?.contactId,
            phoneNumber: row?.phoneNumber,
            attemptsMade: row?.attemptsMade,
            maxAttempts: row?.maxAttempts,
            lastCallStatus: row?.lastCallStatus,
            finalStatus: row?.finalStatus,
            outboundCallStatus: row?.outboundCallStatus,
            normalizedResult: getCallResult(row),
        }))
    );

    console.groupEnd();
}, [
    selectedId,
    loading,
    error,
    rows.length,
    uniqueRows.length,
    filteredRows.length,
    totalPages,
    currentPage,
    paginatedRows.length,
    paginationStart,
    paginationEnd,
]);

    const contactadosCount = useMemo(
        () => filteredRows.filter(isContactado).length,
        [filteredRows]
    );

    const pendientesCount = useMemo(
        () => filteredRows.filter(isPendiente).length,
        [filteredRows]
    );

    const noContestadasCount = useMemo(
        () => filteredRows.filter(isNoContestada).length,
        [filteredRows]
    );

    const chartData = useMemo(() => {
        return [
            {
                name: "Contactados",
                value: contactadosCount,
                color: theme.palette.success.main,
            },
            {
                name: "No contestadas",
                value: noContestadasCount,
                color: theme.palette.error.light,
            },
            {
                name: "Pendientes",
                value: pendientesCount,
                color: theme.palette.warning.main,
            },
        ].filter((item) => item.value > 0);
    }, [
        contactadosCount,
        noContestadasCount,
        pendientesCount,
        theme.palette.success.main,
        theme.palette.error.light,
        theme.palette.warning.main,
    ]);

    const hasActiveFilters = search.trim() || callResultFilter !== "ALL";

    const show = (value) => {
        if (value === null || value === undefined || value === "") return "—";
        return String(value);
    };

    const csvColumns = [
        { key: "contactId", label: "Telefono" },
        { key: "resultadoLlamada", label: "Resultado llamada" },
    ];

    const handleDownloadCsv = () => {
        const exportRows = filteredRows.map((row) => ({
            contactId: row?.contactId || "",
            resultadoLlamada: getCallResult(row),
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

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={
                                loading ? (
                                    <CircularProgress size={14} thickness={5} />
                                ) : (
                                    <RefreshIcon />
                                )
                            }
                            onClick={handleRefresh}
                            disabled={loading}
                            sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                            {loading ? "Actualizando..." : "Actualizar"}
                        </Button>

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

                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            color="success.main"
                                        >
                                            {contactadosCount}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">No contestadas:</Typography>

                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            color="error.main"
                                        >
                                            {noContestadasCount}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">Pendientes:</Typography>

                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            color="warning.main"
                                        >
                                            {pendientesCount}
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
                                    {paginatedRows.map((r, idx) => {
                                        const isMaxed =
                                            getAttemptsMade(r) >= getMaxAttempts(r);

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
                                                        fontWeight={600}
                                                        color={getCallResultTextColor(r)}
                                                    >
                                                        {show(getCallResult(r))}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Typography
                                                        variant="body2"
                                                        color={
                                                            isMaxed
                                                                ? "error.main"
                                                                : "text.secondary"
                                                        }
                                                        fontWeight={isMaxed ? 700 : 400}
                                                    >
                                                        {show(r?.attemptsMade)} /{" "}
                                                        {show(r?.maxAttempts)}
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

                        {filteredRows.length > PAGE_SIZE && (
                            <Paper
                                variant="outlined"
                                sx={{
                                    mt: 3,
                                    p: 1.5,
                                    borderRadius: 3,
                                    bgcolor: "grey.50",
                                }}
                            >
                                <Stack spacing={1}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            fontWeight={700}
                                        >
                                            Mostrando {paginationStart}-{paginationEnd} de{" "}
                                            {filteredRows.length}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.disabled"
                                            sx={{ whiteSpace: "nowrap" }}
                                        >
                                            Página {currentPage} de {totalPages}
                                        </Typography>
                                    </Stack>

                                    <Box
                                        sx={{
                                            overflowX: "auto",
                                            overflowY: "hidden",
                                            pb: 0.5,
                                            scrollSnapType: "x mandatory",

                                            "&::-webkit-scrollbar": {
                                                height: 6,
                                            },
                                            "&::-webkit-scrollbar-thumb": {
                                                borderRadius: 999,
                                                bgcolor: alpha(
                                                    theme.palette.text.primary,
                                                    0.18
                                                ),
                                            },
                                            "&::-webkit-scrollbar-thumb:hover": {
                                                bgcolor: alpha(
                                                    theme.palette.text.primary,
                                                    0.28
                                                ),
                                            },
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{
                                                width: "max-content",
                                                minWidth: "100%",
                                            }}
                                        >
                                            {pageNumbers.map((page) => {
                                                const isActive = currentPage === page;

                                                return (
                                                    <Button
                                                        key={page}
                                                        size="small"
                                                        variant={isActive ? "contained" : "outlined"}
                                                        disableElevation
                                                        onClick={() => setCurrentPage(page)}
                                                        sx={{
                                                            minWidth: 44,
                                                            borderRadius: 999,
                                                            fontWeight: 800,
                                                            flexShrink: 0,
                                                            scrollSnapAlign: "start",
                                                        }}
                                                    >
                                                        {page}
                                                    </Button>
                                                );
                                            })}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        )}
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