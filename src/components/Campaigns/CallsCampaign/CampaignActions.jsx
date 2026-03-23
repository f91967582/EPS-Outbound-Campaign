import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  alpha,
  useTheme
} from "@mui/material";

// Matching Icons
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TableChartIcon from '@mui/icons-material/TableChart';

import CsvPreviewTable from "../../Tables/CsvPreviewTable";

export default function CampaignActions({
  inputRef,
  handleFileChange,
  handlePickFile,
  resetAll,
  handleUpload,
  handleStart,
  uploading,
  parsing,
  starting,
  isReady,
  canStart,
  started,
  file,
  error,
  rows,
  s3Key,
}) {
  const theme = useTheme();

  return (
    <Stack spacing={3}>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Buttons Row */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={handlePickFile}
            disabled={uploading}
            startIcon={<FileUploadIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Seleccionar CSV
          </Button>

          <Button
            variant="text"
            onClick={resetAll}
            disabled={uploading || parsing || starting}
            startIcon={<RestartAltIcon />}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 600, 
              textTransform: 'none',
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.05), color: 'error.main' }
            }}
          >
            Limpiar
          </Button>
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            color="success"
            disabled={!isReady}
            onClick={handleUpload}
            startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 700, 
              textTransform: 'none',
              px: 3,
              boxShadow: isReady ? `0 4px 14px 0 ${alpha(theme.palette.success.main, 0.39)}` : 'none'
            }}
          >
            {uploading ? "Subiendo..." : "Confirmar y subir"}
          </Button>

          <Button
            variant="contained"
            color={started ? "success" : "primary"}
            disabled={!canStart}
            onClick={handleStart}
            startIcon={
              starting ? (
                <CircularProgress size={18} color="inherit" />
              ) : started ? (
                <CheckCircleIcon />
              ) : (
                <PlayCircleFilledIcon />
              )
            }
            sx={{ 
              borderRadius: 2, 
              fontWeight: 700, 
              textTransform: 'none',
              px: 3,
              boxShadow: canStart ? `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}` : 'none'
            }}
          >
            {starting ? "Iniciando..." : started ? "Iniciada" : "Iniciar Campaña"}
          </Button>
        </Stack>
      </Stack>

      {/* Feedback & Alerts */}
      <Stack spacing={2}>
        {file && !error && !s3Key && (
          <Alert 
            severity="info" 
            icon={<InsertDriveFileIcon fontSize="small" />}
            sx={{ 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}
          >
            <Typography variant="body2" fontWeight={600}>Archivo: {file.name}</Typography>
            <Typography variant="caption">Tamaño: {Math.round(file.size / 1024)} KB</Typography>
          </Alert>
        )}

        {error && (
          <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {s3Key && (
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon fontSize="small" />}
            sx={{ borderRadius: 2 }}
          >
            Archivo subido correctamente.
          </Alert>
        )}

        {/* Preview Section */}
        {rows.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
              <TableChartIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                VISTA PREVIA
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Stack>
            <Box sx={{ 
              borderRadius: 2, 
              overflow: 'hidden', 
              border: '1px solid', 
              borderColor: 'divider' 
            }}>
              <CsvPreviewTable rows={rows} />
            </Box>
          </Box>
        )}
      </Stack>
    </Stack>
  );
}