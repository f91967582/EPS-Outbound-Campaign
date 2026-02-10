import { useRef, useState } from "react";
import CsvPreviewTable from "../Tables/CsvPreviewTable";
import { getPresignedUploadUrlSms } from "../../api/getPresignedUploadUrlSms"
import uploadFileToS3 from "../../utils/uploadFileToS3";
import { uploadCsv, SMS_HEADER_MAP } from "../../utils/uploadCsv";

// MUI
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
  Typography,
} from "@mui/material";

export default function EmailSection({ title }) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [s3Key, setS3Key] = useState("");
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  const resetSelection = () => {
    setFile(null);
    setRows([]);
    setS3Key("");
    setError("");
    if (inputRef.current) inputRef.current.value = ""; // allow selecting same file again
  };

  const handlePickFile = () => inputRef.current?.click();

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError("");
    setS3Key("");
    setFile(selected);

    try {
      setParsing(true);
      const parsed = await uploadCsv(selected, SMS_HEADER_MAP);
      setRows(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error(err);
      setRows([]);
      setError("No se pudo leer el CSV. Verifica el formato e inténtalo de nuevo.");
    } finally {
      setParsing(false);
    }
  };

  const handleConfirmUpload = async () => {
    if (!file) return;

    try {
      setError("");
      setUploading(true);

      const { uploadUrl, key } = await getPresignedUploadUrlSms(file);
      await uploadFileToS3(uploadUrl, file);
      setS3Key(key);
    } catch (err) {
      console.error(err);
      setError("No se pudo subir el archivo. Inténtalo nuevamente.");
    } finally {
      setUploading(false);
    }
  };

  const canUpload = Boolean(file) && !s3Key && !uploading && !parsing;

  return (
    <Card sx={{ borderRadius: 3, mb: 2 }}>
      <CardHeader
        title={title}
        subheader="Selecciona un CSV, revisa la vista previa y confirma para subirlo."
        action={
          s3Key ? (
            <Chip label="Confirmado" color="success" variant="outlined" />
          ) : file ? (
            <Chip label="Listo para subir" color="primary" variant="outlined" />
          ) : (
            <Chip label="Sin archivo" variant="outlined" />
          )
        }
        sx={{ pb: 1 }}
      />

      <CardContent>
        {/* Hidden native input (still necessary), UI is pure MUI */}
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="outlined"
              onClick={handlePickFile}
              disabled={uploading}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Seleccionar CSV
            </Button>

            <Button
              variant="text"
              onClick={resetSelection}
              disabled={!file && !rows.length && !s3Key && !error}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Limpiar
            </Button>

            <Box sx={{ flex: 1 }} />

            <Button
              variant="contained"
              color="success"
              disabled={!canUpload}
              onClick={handleConfirmUpload}
              startIcon={
                uploading ? <CircularProgress size={18} /> : null
              }
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              {uploading ? "Subiendo…" : "Confirmar y subir"}
            </Button>
          </Stack>

          {/* File info */}
          {file ? (
            <Alert severity="info" variant="outlined">
              <Typography variant="body2">
                <b>Archivo:</b> {file.name}{" "}
                <Typography component="span" variant="caption" sx={{ ml: 1 }}>
                  ({Math.round(file.size / 1024)} KB)
                </Typography>
              </Typography>
            </Alert>
          ) : (
            <Alert severity="info" variant="outlined">
              Selecciona un archivo <b>.csv</b> para ver la vista previa.
            </Alert>
          )}

          {/* Errors */}
          {error ? <Alert severity="error">{error}</Alert> : null}

          {/* Parsing indicator */}
          {parsing ? (
            <Alert
              severity="warning"
              icon={<CircularProgress size={18} />}
              variant="outlined"
            >
              Procesando CSV…
            </Alert>
          ) : null}

          {/* Preview */}
          {rows.length > 0 && (
            <>
              <Divider />
              <Typography variant="subtitle2">Vista previa</Typography>
              <Box sx={{ overflowX: "auto" }}>
                <CsvPreviewTable rows={rows} />
              </Box>
            </>
          )}

          {/* Success */}
          {s3Key ? (
            <>
              <Divider />
              <Alert severity="success" variant="outlined">
                <Stack spacing={0.5}>
                  <Typography variant="body2">
                    ✅ Archivo confirmado y subido
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      wordBreak: "break-all",
                    }}
                  >
                    {s3Key}
                  </Typography>
                </Stack>
              </Alert>
            </>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
