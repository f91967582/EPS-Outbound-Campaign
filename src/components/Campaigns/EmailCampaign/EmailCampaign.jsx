import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
} from "@mui/material";

import { uploadCsv, EMAIL_HEADER_MAP } from "../../../utils/uploadCsv"
import { getPresignedUploadUrlEmail } from "../../../api/getPresignedUploadUrlEmail";
import uploadFileToS3 from "../../../utils/uploadFileToS3";
import { createCampaign } from "../../../api/createCampaign";

import EmailCampaignForm from "./EmailCampaignForm";
import EmailCampaignActions from "./EmailCampaignActions";
import EmailCampaignFeedback from "./EmailCampaignFeedback";

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
        action={s3Key ? <Chip label="Confirmado" color="success" /> : <Chip label="Pendiente" />}
      />

      <CardContent>
        <Stack spacing={3}>
          <EmailCampaignForm
            campaignTitle={campaignTitle}
            setCampaignTitle={setCampaignTitle}
          />

          <EmailCampaignActions
            inputRef={inputRef}
            handleFileChange={handleFileChange}
            handlePickFile={handlePickFile}
            resetAll={resetAll}
            handleUpload={handleUpload}
            uploading={uploading}
            isReady={isReady}
          />

          <EmailCampaignFeedback
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