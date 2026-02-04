import { useState } from "react";
import FileUploader from "../FileUploader";
import CsvPreviewTable from "../Tables/CsvPreviewTable";

export default function OutboundCampaign() {
  const [rows, setRows] = useState([]);
  const [s3Key, setS3Key] = useState("");

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Iniciar Campaña Outbound</h2>

      <FileUploader
        accept=".csv"
        onUploaded={({ s3Key, rows }) => {
          setS3Key(s3Key);
          setRows(rows || []);
        }}
      />

      {s3Key && (
        <p style={{ color: "green" }}>
          ✅ Archivo en S3<br />
          <code>{s3Key}</code>
        </p>
      )}

      {rows.length > 0 && (
        <>
          <h3>Vista previa</h3>
          <CsvPreviewTable rows={rows} />
        </>
      )}
    </div>
  );
}
