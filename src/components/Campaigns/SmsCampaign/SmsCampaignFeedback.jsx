import {
  Alert,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import CsvPreviewTable from "../../Tables/CsvPreviewTable";
export default function SmsCampaignFeedback({
  file,
  error,
  parsing,
  rows,
  s3Key,
}) {
  return (
    <>
      {file && (
        <Alert severity="info">
          Archivo: {file.name} ({Math.round(file.size / 1024)} KB)
        </Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {parsing && (
        <Alert severity="warning" icon={<CircularProgress size={18} />}>
          Procesando CSV...
        </Alert>
      )}

      {rows.length > 0 && (
        <>
          <Divider />
          <Typography variant="subtitle2">
            Vista previa
          </Typography>
          <CsvPreviewTable rows={rows} />
        </>
      )}

      {s3Key && (
        <Alert severity="success">
          Archivo subido correctamente.
          <Typography variant="caption" display="block">
            {s3Key}
          </Typography>
        </Alert>
      )}
    </>
  );
}