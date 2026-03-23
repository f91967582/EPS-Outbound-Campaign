import React from "react";
import {
  Alert,
  CircularProgress,
  Divider,
  Typography,
  Box,
  Stack,
  alpha,
  useTheme
} from "@mui/material";
// Icons for feedback states
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TableChartIcon from '@mui/icons-material/TableChart';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

import CsvPreviewTable from "../../Tables/CsvPreviewTable";

export default function SmsCampaignFeedback({
  file,
  error,
  parsing,
  rows,
  s3Key,
}) {
  const theme = useTheme();

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      {/* File Selected Info */}
      {file && !error && !s3Key && (
        <Alert 
          severity="info" 
          icon={<InsertDriveFileIcon fontSize="small" />}
          sx={{ 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.info.main, 0.05),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            color: 'info.dark'
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Archivo preparado: {file.name}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Tamaño estimado: {Math.round(file.size / 1024)} KB
          </Typography>
        </Alert>
      )}

      {/* Error State */}
      {error && (
        <Alert 
          severity="error" 
          variant="filled" 
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {error}
        </Alert>
      )}

      {/* Parsing State */}
      {parsing && (
        <Alert 
          severity="warning" 
          icon={<CircularProgress size={18} color="inherit" thickness={5} />}
          sx={{ 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            fontWeight: 600
          }}
        >
          Procesando estructura del CSV...
        </Alert>
      )}

      {/* Preview Table Section */}
      {rows.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
            <TableChartIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Vista previa de datos
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Stack>
          
          <Box sx={{ 
            borderRadius: 2, 
            overflow: 'hidden', 
            border: '1px solid', 
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}>
            <CsvPreviewTable rows={rows} />
          </Box>
        </Box>
      )}

      {/* Success State */}
      {s3Key && (
        <Alert 
          severity="success" 
          icon={<CloudDoneIcon fontSize="small" />}
          sx={{ 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.success.main, 0.1),
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            color: 'success.dark'
          }}
        >
          <Typography variant="body2" fontWeight={700}>
            Archivo cargado exitosamente en la nube
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              display: "block", 
              fontFamily: 'monospace', 
              mt: 0.5,
              opacity: 0.7 
            }}
          >
            Ref: {s3Key}
          </Typography>
        </Alert>
      )}
    </Stack>
  );
}