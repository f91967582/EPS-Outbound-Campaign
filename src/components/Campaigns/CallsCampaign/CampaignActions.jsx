import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
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
  campaignStatus,
}) {
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={handlePickFile}
          disabled={uploading}
        >
          Seleccionar CSV
        </Button>

        <Button
          variant="text"
          onClick={resetAll}
          disabled={uploading || parsing || starting}
        >
          Limpiar
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          color="success"
          disabled={!isReady}
          onClick={handleUpload}
          startIcon={uploading ? <CircularProgress size={18} /> : null}
        >
          {uploading ? "Subiendo..." : "Confirmar y subir"}
        </Button>

        <Button
          variant="contained"
          color={started ? "success" : "primary"}
          disabled={!canStart}
          onClick={handleStart}
          startIcon={starting ? <CircularProgress size={18} /> : null}
        >
          {starting ? "Iniciando..." : started ? "✅ Iniciada" : "▶ Iniciar Campaña"}
        </Button>
      </Stack>

      {file && (
        <Alert severity="info">
          Archivo: {file.name} ({Math.round(file.size / 1024)} KB)
        </Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {rows.length > 0 && (
        <>
          <Divider />
          <Typography variant="subtitle2">Vista previa</Typography>
          <CsvPreviewTable rows={rows} />
        </>
      )}

      {s3Key && (
        <Alert severity="success">
          Archivo subido correctamente.
          <Typography variant="caption" display="block">
            {s3Key}
          </Typography>
          <Typography variant="caption" display="block">
            Status: {campaignStatus}
          </Typography>
        </Alert>
      )}
    </>
  );
}