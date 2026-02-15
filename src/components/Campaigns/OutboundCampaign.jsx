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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useFlows } from "../../hooks/useConnectFlowsList";
import { uploadCsv, OUTBOUND_HEADER_MAP } from "../../utils/uploadCsv";
import { getPresignedUploadUrlOutbound } from "../../api/getPresignedUploadUrlOutbound";
import uploadFileToS3 from "../../utils/uploadFileToS3";
import CsvPreviewTable from "../Tables/CsvPreviewTable";
import { createCampaign } from "../../api/createCampaign";
import { updateCampaignStatus } from "../../api/updateCampaignStatus";
import { startVoiceCampaign } from "../../api/startVoiceCampaign";

export default function OutboundCampaign() {
  const inputRef = useRef(null);
  const { flows, loading: flowsLoading } = useFlows();

  const [campaignTitle, setCampaignTitle] = useState("");
  const [flowId, setFlowId] = useState("");

  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [s3Key, setS3Key] = useState("");
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  const [campaignStatus, setCampaignStatus] = useState("CREATED");
  const [campaignId, setCampaignId] = useState(null);

  // Start campaign button state
  const [starting, setStarting] = useState(false);
  const [started, setStarted] = useState(false);

  const resetAll = () => {
    setFile(null);
    setRows([]);
    setS3Key("");
    setCampaignId(null);
    setCampaignStatus("CREATED");
    setStarting(false);
    setStarted(false);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handlePickFile = () => inputRef.current?.click();

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError("");
    setFile(selected);

    // New file => reset upload/start state
    setRows([]);
    setS3Key("");
    setCampaignId(null);
    setCampaignStatus("CREATED");
    setStarting(false);
    setStarted(false);

    try {
      setParsing(true);
      const parsed = await uploadCsv(selected, OUTBOUND_HEADER_MAP);
      setRows(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error(err);
      setRows([]);
      setError("No se pudo leer el CSV.");
    } finally {
      setParsing(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !flowId || !campaignTitle.trim()) {
      setError("Debes completar título, flujo y seleccionar archivo.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      // 1️⃣ Create campaign
      const response = await createCampaign({
        campaignTitle,
        flowId,
        campaignType: "voz",
      });

      const newCampaignId = response.campaignId;
      setCampaignId(newCampaignId);
      setCampaignStatus("CREATED");

      // 2️⃣ Get presigned URL
      const metadata = {
        flowId,
        campaignTitle,
        campaignId: newCampaignId,
      };

      const { uploadUrl, key } = await getPresignedUploadUrlOutbound(
        file,
        metadata
      );

      // 3️⃣ Upload file
      await uploadFileToS3(uploadUrl, file);
      setS3Key(key);

      // 4️⃣ Save bucket + s3Key into DynamoDB
      await updateCampaignStatus(newCampaignId, {
        bucket: "csvfile-upload-react-dashboard",
        s3Key: key,
      });
    } catch (err) {
      console.error(err);
      setError("Error subiendo archivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleStart = async () => {
    if (!campaignId || !s3Key) return;

    try {
      setError("");
      setStarting(true);

      // Change status to RUNNING
      await updateCampaignStatus(campaignId, { status: "RUNNING" });
      setCampaignStatus("RUNNING");

      // Trigger start Lambda
      await startVoiceCampaign(campaignId);

      setStarted(true);
    } catch (err) {
      console.error(err);
      setError("Error iniciando campaña.");
    } finally {
      setStarting(false);
    }
  };

  const isReady =
    campaignTitle.trim() !== "" &&
    flowId !== "" &&
    file &&
    !uploading &&
    !parsing &&
    !s3Key;

  const canStart = Boolean(campaignId && s3Key) && !starting && !started;

  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <CardHeader
        title="Nueva Campaña Voz"
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
          <TextField
            label="Título de campaña"
            size="small"
            value={campaignTitle}
            onChange={(e) => setCampaignTitle(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth size="small" disabled={flowsLoading}>
            <InputLabel>Flujo</InputLabel>
            <Select
              value={flowId}
              label="Flujo"
              onChange={(e) => setFlowId(e.target.value)}
            >
              {flows.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* Buttons row (Start next to Confirm & Upload) */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={handlePickFile}
              disabled={uploading}
            >
              Seleccionar CSV
            </Button>

            <Button variant="text" onClick={resetAll} disabled={uploading || parsing || starting}>
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
        </Stack>
      </CardContent>
    </Card>
  );
}
