// components/OutboundCampaign.jsx
import { useState } from "react";
import { uploadCsv } from "../../utils/uploadCsv";
import { getPresignedUploadUrl } from "../../utils/getPresignedUploadUrl";
import uploadFileToS3 from "../../utils/uploadFileToS3";
import CsvPreviewTable from "../Tables/CsvPreviewTable";

export default function OutboundCampaign() {
  const [rows, setRows] = useState([]);
  const [s3Key, setS3Key] = useState("");
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setUploading(true);

      // 1️⃣ Ask API Gateway for presigned URL
      const { uploadUrl, key } = await getPresignedUploadUrl(file);

      // 2️⃣ Upload file directly to S3
      await uploadFileToS3(uploadUrl, file);
      setS3Key(key);

      // 3️⃣ Parse locally for preview
      const parsedRows = await uploadCsv(file);
      setRows(parsedRows);
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed");
      setRows([]);
      setS3Key("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Iniciar Campaña</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading && (
        <p style={{ marginTop: "0.5rem" }}>⏳ Subiendo archivo…</p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}

      {s3Key && (
        <p style={{ marginTop: "0.5rem", color: "green" }}>
          ✅ Archivo subido a S3<br />
          <code>{s3Key}</code>
        </p>
      )}

      {rows.length > 0 && (
        <>
          <h3>Vista previa del CSV</h3>
          <CsvPreviewTable rows={rows} />
        </>
      )}
    </div>
  );
}
