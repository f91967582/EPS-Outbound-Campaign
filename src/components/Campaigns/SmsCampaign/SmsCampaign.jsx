import { useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Divider,
  Avatar,
  Box,
  Typography,
  alpha,
  useTheme,
  TextField
} from "@mui/material";

// Icons
import PostAddIcon from "@mui/icons-material/PostAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import { uploadCsv, SMS_HEADER_MAP } from "../../../utils/uploadCsv";
import { getPresignedUploadUrlSms } from "../../../api/getPresignedUploadUrlSms";
import uploadFileToS3 from "../../../utils/uploadFileToS3";
import { createCampaign } from "../../../api/createCampaign";
import { startSmsCampaign } from "../../../api/startSmsCampaign";
import { updateCampaignStatus } from "../../../api/updateCampaignStatus";
import { saveSmsDetail } from "../../../api/saveSmsResultsApi";

import SmsCampaignForm from "./SmsCampaignForm";
import SmsCampaignActions from "./SmsCampaignActions";
import SmsCampaignFeedback from "./SmsCampaignFeedback";
import CampaignSchedule from "../CallsCampaign/CampaignSchedule";

export default function SmsCampaign() {
  const theme = useTheme();
  const inputRef = useRef(null);

  const [campaignTitle, setCampaignTitle] = useState("");
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [s3Key, setS3Key] = useState("");
  const [campaignId, setCampaignId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [starting, setStarting] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const timezone = "America/Santo_Domingo";
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState("");

  const resetAll = () => {
    setCampaignTitle("");
    setFile(null);
    setRows([]);
    setS3Key("");
    setCampaignId(null);
    setUploading(false);
    setParsing(false);
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
    setStarted(false);

    try {
      setParsing(true);
      const parsed = await uploadCsv(selected, SMS_HEADER_MAP);
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
    if (!file || !campaignTitle.trim()) {
      setError("Debes ingresar título y seleccionar archivo.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const { campaignId } = await createCampaign({
        campaignTitle,
        campaignType: "sms",
        messageTemplate,
      });

      setCampaignId(campaignId);

      for (const row of rows) {
        const phoneNumber = row.phoneNumber || row.telefono;
        if (!phoneNumber) continue;
        await saveSmsDetail({ campaignId, phoneNumber });
      }

      const metadata = { campaignTitle, campaignId };
      const { uploadUrl, key } = await getPresignedUploadUrlSms(file, metadata);

      await uploadFileToS3(uploadUrl, file);

      await updateCampaignStatus(campaignId, {
        bucket: "csvfile-upload-react-dashboard-sms",
        s3Key: key,
      });

      setS3Key(key);
    } catch (err) {
      console.error(err);
      setError("Error subiendo archivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleStart = async () => {
    if (!campaignId) {
      setError("No hay campaignId para iniciar la campaña.");
      return;
    }

    if (!s3Key) {
      setError("Debes subir el archivo antes de iniciar.");
      return;
    }

    const hasSchedule = scheduleEnabled && Boolean(startDate && startTime);

    if (scheduleEnabled && !hasSchedule) {
      setError("Selecciona fecha y hora o desactiva la programación.");
      return;
    }

    try {
      setStarting(true);
      setError("");

      const startAt = hasSchedule ? `${startDate}T${startTime}:00` : null;

      await updateCampaignStatus(campaignId, {
        status: "CREATED",
        ...(hasSchedule ? { startAt, timezone } : { startAt: null, timezone: null }),
      });

      await startSmsCampaign({
        campaignId,
        ...(hasSchedule ? { startAt, timezone } : {}),
      });

      setStarted(true);
    } catch (err) {
      console.error(err);
      setError("Error iniciando la campaña SMS.");
    } finally {
      setStarting(false);
    }
  };

  const isReady =
    campaignTitle.trim() !== "" &&
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
        sx={{ p: 3, pb: 0 }}
        avatar={
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
            }}
          >
            <PostAddIcon />
          </Avatar>
        }
        title={<Typography variant="h6" fontWeight={800}>Nueva Campaña SMS</Typography>}
        subheader="Configura los parámetros y carga tu base de contactos"
        action={
          s3Key ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="Archivo Confirmado"
              color="success"
            />
          ) : (
            <Chip
              icon={<PendingActionsIcon />}
              label="Configuración Pendiente"
            />
          )
        }
      />

      <CardContent sx={{ p: 3 }}>
        <Stack spacing={4}>
          <SmsCampaignForm
            campaignTitle={campaignTitle}
            setCampaignTitle={setCampaignTitle}
          />

         {/* <TextField
            label="Mensaje SMS"
            placeholder="Escribe aquí el mensaje que quieres enviar"
            multiline
            minRows={4}
            fullWidth
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
          /> */}

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

          <SmsCampaignActions
            inputRef={inputRef}
            handleFileChange={handleFileChange}
            handlePickFile={handlePickFile}
            resetAll={resetAll}
            handleUpload={handleUpload}
            handleStart={handleStart}
            uploading={uploading}
            starting={starting}
            isReady={isReady}
            canStart={canStart}
            started={started}
          />

          <SmsCampaignFeedback
            file={file}
            error={error}
            parsing={parsing}
            rows={rows}
            s3Key={s3Key}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}