import { Box, Button, CircularProgress, Stack } from "@mui/material";

export default function SmsCampaignActions({
  inputRef,
  handleFileChange,
  handlePickFile,
  resetAll,
  handleUpload,
  uploading,
  isReady,
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
          disabled={uploading}
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
      </Stack>
    </>
  );
}