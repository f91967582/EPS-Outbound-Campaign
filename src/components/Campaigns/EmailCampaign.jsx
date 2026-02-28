import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CsvPreviewTable from "../Tables/CsvPreviewTable";
import { uploadCsv, EMAIL_HEADER_MAP } from "../../utils/uploadCsv";
import { getPresignedUploadUrlEmail } from "../../api/getPresignedUploadUrlEmail";
import uploadFileToS3 from "../../utils/uploadFileToS3";
import { createCampaign } from "../../api/createCampaign";

export default function EmailCampaign() {
  const inputRef = useRef(null);

  const [campaignTitle, setCampaignTitle] = useState("");
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [s3Key, setS3Key] = useState("");
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  const resetAll = () => {
    setCampaignTitle("");
    setFile(null);
    setRows([]);
    setS3Key("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handlePickFile = () => inputRef.current?.click();

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError("");
    setFile(selected);
    setS3Key("");

    try {
      setParsing(true);
      const parsed = await uploadCsv(selected, EMAIL_HEADER_MAP);
      setRows(Array.isArray(parsed) ? parsed : []);
    } catch {
      setRows([]);
      setError("No se pudo leer el CSV.");
    } finally {
      setParsing(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !campaignTitle.trim()) {
      setError("Debes ingresar título y seleccionar archivo.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const { campaignId } = await createCampaign({
        campaignTitle,
        campaignType: "email",
      });

      const metadata = {
        campaignTitle,
        campaignId,
      };

      const { uploadUrl, key } = await getPresignedUploadUrlEmail(file, metadata);

      await uploadFileToS3(uploadUrl, file);

      setS3Key(key);
    } catch {
      setError("Error subiendo archivo.");
    } finally {
      setUploading(false);
    }
  };

  const isReady =
    campaignTitle.trim() !== "" && file && !uploading && !parsing && !s3Key;

  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <CardHeader
        title="Nueva Campaña Email"
        subheader="Configura la campaña y sube el CSV"
        action={
          s3Key ? (
            <Chip label="Confirmado" color="success" />
          ) : (
            <Chip label="Pendiente" />
          )
        }
      />

      <CardContent>
        <Stack spacing={3}>
          {/* Campaign Title */}
          <TextField
            label="Título de campaña"
            size="small"
            value={campaignTitle}
            onChange={(e) => setCampaignTitle(e.target.value)}
            fullWidth
          />

          {/* Hidden File Input */}
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={handlePickFile}
              disabled={uploading}
            >
              Seleccionar CSV
            </Button>

            <Button variant="text" onClick={resetAll}>
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

          {/* File Info */}
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

          {/* Preview */}
          {rows.length > 0 && (
            <>
              <Divider />
              <Typography variant="subtitle2">Vista previa</Typography>
              <CsvPreviewTable rows={rows} />
            </>
          )}

          {/* Success */}
          {s3Key && (
            <Alert severity="success">
              Archivo subido correctamente.
              <Typography variant="caption" display="block">
                {s3Key}
              </Typography>
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}