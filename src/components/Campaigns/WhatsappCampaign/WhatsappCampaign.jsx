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
  alpha,
  useTheme,
} from "@mui/material";

// Icons
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import { useFlows } from "../../../hooks/useConnectFlowsList";
import { uploadCsv, OUTBOUND_HEADER_MAP } from "../../../utils/uploadCsv";
import { getPresignedUploadUrlWhatsapp } from "../../../apiWhatsapp/getPresignedUploadUrlWhatsapp";
import uploadFileToS3 from "../../../utils/uploadFileToS3";
import { createWhatsappCampaign } from "../../../apiWhatsapp/createWhatsappCampaign";
import { startCancelWhatsappCampaign } from "../../../apiWhatsapp/startCancelWhatsappCampaign";

import CampaignBasicInfo from "./CampaignBasicInfo";
import CampaignSchedule from "./CampaignSchedule";
import CampaignActions from "./CampaignActions";

const WHATSAPP_BUCKET = "csvfile-upload-react-dashboard-whatsapp";

export default function WhatsAppCampaign() {
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

  const selectedFlow = flows?.find((flow) => {
    const candidateId =
      flow.id ||
      flow.Id ||
      flow.flowId ||
      flow.ContactFlowId ||
      flow.Arn ||
      "";

    return candidateId === flowId;
  });

  const flowName =
    selectedFlow?.name ||
    selectedFlow?.Name ||
    selectedFlow?.flowName ||
    selectedFlow?.ContactFlowName ||
    "";

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

  const handleUpload = async () => {
    if (!file || !flowId || !flowName || !campaignTitle.trim()) {
      setError("Debes completar título, flujo y seleccionar archivo.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      // 1) get presigned URL
      const metadata = {
        flowId,
        flowName,
        campaignTitle,
      };

      const { uploadUrl, key } =
        await getPresignedUploadUrlWhatsapp(file, metadata);

      // 2) upload to S3
      await uploadFileToS3(uploadUrl, file);

      // 3) create campaign WITH s3 info
      const { campaignId } = await createWhatsappCampaign({
        campaignTitle,
        flowId,
        flowName,
        campaignType: "whatsapp",
        bucket: WHATSAPP_BUCKET,
        s3Key: key,
      });

      setCampaignId(campaignId);
      setS3Key(key);
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

      await startCancelWhatsappCampaign({
        campaignId,
        ...(hasSchedule
          ? { startAt: `${startDate}T${startTime}:00`, timezone }
          : {}),
      });

      setStarted(true);
    } catch (err) {
      console.error(err);
      setError("Error iniciando la campaña de WhatsApp.");
    } finally {
      setStarting(false);
    }
  };

  const isReady =
    campaignTitle.trim() !== "" &&
    flowId !== "" &&
    flowName !== "" &&
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
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.success.main, 0.12),
              color: "success.main",
            }}
          >
            <WhatsAppIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6" fontWeight={800}>
            Nueva Campaña WhatsApp
          </Typography>
        }
        subheader="Carga la base de datos y programa el envío de mensajes"
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