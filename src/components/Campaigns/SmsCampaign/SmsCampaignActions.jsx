import { Box, Button, CircularProgress, Stack, useTheme, alpha } from "@mui/material";
// Icons for a professional action bar
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function SmsCampaignActions({
  inputRef,
  handleFileChange,
  handlePickFile,
  resetAll,
  handleUpload,
  handleStart,
  uploading,
  starting,
  isReady,
  canStart,
  started,
}) {
  const theme = useTheme();

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        spacing={2} 
        alignItems="center"
        sx={{ mt: 2 }}
      >
        {/* Secondary Actions Group */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={handlePickFile}
            disabled={uploading || starting}
            startIcon={<FileUploadIcon />}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 700,
              textTransform: 'none',
              px: 3
            }}
          >
            Seleccionar CSV
          </Button>

          <Button
            variant="text"
            color="inherit"
            onClick={resetAll}
            disabled={uploading || starting}
            startIcon={<RestartAltIcon />}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 600,
              textTransform: 'none',
              color: 'text.secondary'
            }}
          >
            Limpiar
          </Button>
        </Stack>

        <Box sx={{ flex: 1 }} />

        {/* Primary Actions Group */}
        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            color="success"
            disabled={!isReady || uploading || starting}
            onClick={handleUpload}
            startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: isReady ? `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}` : 'none',
              px: 3
            }}
          >
            {uploading ? "Subiendo..." : "Confirmar y subir"}
          </Button>

          <Button
            variant="contained"
            color="primary"
            disabled={!canStart}
            onClick={handleStart}
            startIcon={
              starting ? (
                <CircularProgress size={18} color="inherit" />
              ) : started ? (
                <CheckCircleIcon />
              ) : (
                <PlayArrowIcon />
              )
            }
            sx={{ 
              borderRadius: 2, 
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: canStart ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}` : 'none',
              px: 3,
              // Special style for the "Started" state
              ...(started && {
                bgcolor: 'primary.dark',
                opacity: 0.9
              })
            }}
          >
            {starting ? "Iniciando..." : started ? "Iniciada" : "Iniciar campaña"}
          </Button>
        </Stack>
      </Stack>
    </>
  );
}