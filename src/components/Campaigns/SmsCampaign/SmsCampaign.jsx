import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
} from "@mui/material";

import { uploadCsv, SMS_HEADER_MAP } from "../../../utils/uploadCsv";
import { getPresignedUploadUrlSms } from "../../../api/getPresignedUploadUrlSms";
import uploadFileToS3 from "../../../utils/uploadFileToS3";
import { createCampaign } from "../../../api/createCampaign";

import SmsCampaignForm from "./SmsCampaignForm";
import SmsCampaignActions from "./SmsCampaignActions";
import SmsCampaignFeedback from "./SmsCampaignFeedback";

export default function SmsCampaign() {
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
      });

      const metadata = {
        campaignTitle,
        campaignId,
      };

      const { uploadUrl, key } = await getPresignedUploadUrlSms(file, metadata);

      await uploadFileToS3(uploadUrl, file);

      setS3Key(key);
    } catch (err) {
      console.error(err);
      setError("Error subiendo archivo.");
    } finally {
      setUploading(false);
    }
  };

  const isReady =
    campaignTitle.trim() !== "" &&
    file &&
    !uploading &&
    !parsing &&
    !s3Key;

  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <CardHeader
        title="Nueva Campaña SMS"
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
          <SmsCampaignForm
            campaignTitle={campaignTitle}
            setCampaignTitle={setCampaignTitle}
          />

          <SmsCampaignActions
            inputRef={inputRef}
            handleFileChange={handleFileChange}
            handlePickFile={handlePickFile}
            resetAll={resetAll}
            handleUpload={handleUpload}
            uploading={uploading}
            isReady={isReady}
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