import { useRef, useState, useEffect } from "react";
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
  Switch,
  FormControlLabel,

} from "@mui/material";

import { useFlows } from "../../hooks/useConnectFlowsList";
import { uploadCsv, OUTBOUND_HEADER_MAP } from "../../utils/uploadCsv";
import { getPresignedUploadUrlCalls } from "../../api/getPresignedUploadUrlCalls";
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

  // Date starting campaign
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [startTime, setStartTime] = useState(""); // HH:mm
  const timezone = "America/Santo_Domingo";
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  // Max attempts and intervals seconds
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [callIntervalSeconds, setCallIntervalSeconds] = useState(10);
  const [maxConcurrentCalls, setMaxConcurrentCalls] = useState(5);

  const resetAll = () => {
    setFile(null);
    setRows([]);
    setS3Key("");
    setCampaignId(null);
    setCampaignStatus("CREATED");
    setStarting(false);
    setStarted(false);
    setError("");
    setScheduleEnabled(false);
    setStartDate("");
    setStartTime("");

    if (inputRef.current) inputRef.current.value = "";
  };
  useEffect(() => { setStarted(false); }, [scheduleEnabled, startDate, startTime]);

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
        maxAttempts,
        callIntervalSeconds,
        maxConcurrentCalls
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

      const { uploadUrl, key } = await getPresignedUploadUrlCalls(
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

    const hasSchedule = scheduleEnabled && Boolean(startDate && startTime);

    // If user turned on scheduling, force them to pick date + time
    if (scheduleEnabled && !hasSchedule) {
      setError("Selecciona fecha y hora para programar el inicio, o desactiva 'Programar inicio'.");
      return;
    }

    try {
      setError("");
      setStarting(true);

      const startAt = hasSchedule ? `${startDate}T${startTime}:00` : null;

      await updateCampaignStatus(campaignId, {
        status: "CREATED",
        ...(hasSchedule ? { startAt, timezone } : { startAt: null, timezone: null }),
      });

      await startVoiceCampaign({
        campaignId,
        ...(hasSchedule ? { startAt, timezone } : {}),
      });

      setStarted(true);
    } catch (err) {
      console.error(err);
      setError("Error iniciando/programando la campaña.");
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

  const canStart =
    Boolean(campaignId && s3Key) &&
    !starting &&
    !started;



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

          <Divider />

          <Typography variant="subtitle2">Configuración de llamadas</Typography>

          <Stack direction="row" spacing={2}>

            <TextField
              label="intentos"
              type="number"
              size="small"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(Number(e.target.value))}
              inputProps={{ min: 1, max: 10 }}
            />

            <TextField
              label="Intervalo entre llamadas (segundos)"
              type="number"
              size="small"
              value={callIntervalSeconds}
              onChange={(e) => setCallIntervalSeconds(Number(e.target.value))}
              inputProps={{ min: 1 }}
            />

            <TextField
              label="Simultáneos"
              type="number"
              size="small"
              value={maxConcurrentCalls}
              onChange={(e) => setMaxConcurrentCalls(Number(e.target.value))}
              inputProps={{ min: 1, max: 50 }}
            />

          </Stack>



          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* Buttons row (Start next to Confirm & Upload) */}
          <Stack direction="row" spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={scheduleEnabled}
                    onChange={(e) => {
                      const on = e.target.checked;
                      setScheduleEnabled(on);
                      if (!on) {
                        setStartDate("");
                        setStartTime("");
                      }
                    }}
                  />
                }
                label="Programar inicio"
              />

              {scheduleEnabled && (
                <>
                  <TextField
                    label="Fecha de inicio"
                    type="date"
                    size="small"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />

                  <TextField
                    label="Hora de inicio"
                    type="time"
                    size="small"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />

                  <Typography variant="caption" color="text.secondary">
                    Zona horaria: {timezone}
                  </Typography>
                </>
              )}
            </Stack>


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
