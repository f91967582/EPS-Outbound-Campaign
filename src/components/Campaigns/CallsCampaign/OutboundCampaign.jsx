import { useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Avatar,
  Typography,
  Box,
  alpha,
  useTheme,
} from "@mui/material";

// Icons
import SettingsPhoneIcon from "@mui/icons-material/SettingsPhone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import { useFlows } from "../../../hooks/useConnectFlowsList";
import { uploadCsv, OUTBOUND_HEADER_MAP } from "../../../utils/uploadCsv";
import { getPresignedUploadUrlCalls } from "../../../api/getPresignedUploadUrlCalls";
import uploadFileToS3 from "../../../utils/uploadFileToS3";
import { createVoiceCampaign } from "../../../api/createVoiceCampaign";
import { updateCampaignStatus } from "../../../api/updateCampaignStatus";
import { startVoiceCampaign } from "../../../api/startVoiceCampaign";

import CampaignBasicInfo from "./CampaignBasicInfo";
import CampaignCallSettings from "./CampaignCallSettings";
import CampaignSchedule from "./CampaignSchedule";
import CampaignActions from "./CampaignActions";

export default function OutboundCampaign() {
  const theme = useTheme();
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

  const [campaignId, setCampaignId] = useState(null);
  const [starting, setStarting] = useState(false);
  const [started, setStarted] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const timezone = "America/Santo_Domingo";
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  const [maxAttempts, setMaxAttempts] = useState(3);
  const [callIntervalSeconds, setCallIntervalSeconds] = useState(10);
  const [maxConcurrentCalls, setMaxConcurrentCalls] = useState(0);
  const [processAllSimultaneously, setProcessAllSimultaneously] = useState(false);

  const resetAll = () => {
    setCampaignTitle("");
    setFlowId("");
    setFile(null);
    setRows([]);
    setS3Key("");
    setCampaignId(null);
    setStarting(false);
    setStarted(false);
    setError("");
    setScheduleEnabled(false);
    setStartDate("");
    setStartTime("");
    setMaxAttempts(3);
    setCallIntervalSeconds(10);
    setMaxConcurrentCalls(5);

    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    setStarted(false);
  }, [scheduleEnabled, startDate, startTime]);

  const handlePickFile = () => inputRef.current?.click();

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError("");
    setFile(selected);
    setRows([]);
    setS3Key("");
    setCampaignId(null);
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

  const selectedFlow = flows.find((flow) => String(flow.id) === String(flowId));
  const flowName = selectedFlow?.name || "";

  const handleUpload = async () => {
    if (!file || !flowId || !flowName || !campaignTitle.trim()) {
      setError("Debes completar titulo, flujo y seleccionar archivo.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const response = await createVoiceCampaign({
        campaignTitle,
        flowId,
        flowName,
        campaignType: "voz",
        maxAttempts,
        setCallIntervalSeconds,
        maxConcurrentCalls: processAllSimultaneously ? null : maxConcurrentCalls,
        processAllSimultaneously,
      });

      const newCampaignId = response.campaignId;
      setCampaignId(newCampaignId);

      const metadata = {
        flowId,
        flowName,
        campaignTitle,
        campaignId: newCampaignId,
      };

      const { uploadUrl, key } = await getPresignedUploadUrlCalls(file, metadata);

      await uploadFileToS3(uploadUrl, file);
      setS3Key(key);

      await updateCampaignStatus(newCampaignId, {
        bucket: "csvfile-upload-react-dashboard-calls",
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

    if (scheduleEnabled && !hasSchedule) {
      setError("Selecciona fecha y hora o desactiva la programación.");
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
      setError("Error iniciando la campaña.");
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
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: "secondary.main" }}>
            <SettingsPhoneIcon />
          </Avatar>
        }
        title={<Typography variant="h6" fontWeight={800}>Nueva Campaña Voz</Typography>}
        subheader="Configura la lógica de llamadas y carga la base de datos"
        action={
          s3Key ? (
            <Chip icon={<CheckCircleIcon />} label="Confirmado" color="success" />
          ) : (
            <Chip icon={<PendingActionsIcon />} label="Pendiente" />
          )
        }
      />

      <CardContent>
        <Stack spacing={4}>
          <CampaignBasicInfo
            campaignTitle={campaignTitle}
            setCampaignTitle={setCampaignTitle}
            flowId={flowId}
            setFlowId={setFlowId}
            flows={flows}
            flowsLoading={flowsLoading}
          />

          <Divider />

          <CampaignCallSettings
            maxAttempts={maxAttempts}
            setMaxAttempts={setMaxAttempts}
            setCallIntervalSeconds={setCallIntervalSeconds}
            maxConcurrentCalls={maxConcurrentCalls}
            setMaxConcurrentCalls={setMaxConcurrentCalls}
            processAllSimultaneously={processAllSimultaneously}
            setProcessAllSimultaneously={setProcessAllSimultaneously}
          />

          <CampaignSchedule
            scheduleEnabled={scheduleEnabled}
            setScheduleEnabled={setScheduleEnabled}
            startDate={startDate}
            setStartDate={setStartDate}
            startTime={startTime}
            setStartTime={setStartTime}
            timezone={timezone}
          />

          <CampaignActions
            inputRef={inputRef}
            handleFileChange={handleFileChange}
            handlePickFile={handlePickFile}
            resetAll={resetAll}
            handleUpload={handleUpload}
            handleStart={handleStart}
            uploading={uploading}
            parsing={parsing}
            starting={starting}
            isReady={isReady}
            canStart={canStart}
            started={started}
            file={file}
            error={error}
            rows={rows}
            s3Key={s3Key}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}