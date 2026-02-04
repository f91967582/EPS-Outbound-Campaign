import { useState } from "react";
import FileSelector from "../FileUploader";
import CsvPreviewTable from "../Tables/CsvPreviewTable";
import { uploadCsv } from "../../utils/uploadCsv";
import { getPresignedUploadUrl } from "../../utils/getPresignedUploadUrl";
import uploadFileToS3 from "../../utils/uploadFileToS3";
import Button from "@mui/material/Button";


export default function CampaignSection({ title }) {
    const [file, setFile] = useState(null);
    const [rows, setRows] = useState([]);
    const [s3Key, setS3Key] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleConfirmUpload = async () => {
        if (!file) return;

        try {
            setUploading(true);

            // Upload to S3
            const { uploadUrl, key } = await getPresignedUploadUrl(file);
            await uploadFileToS3(uploadUrl, file);
            setS3Key(key);

        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
            <h3>{title}</h3>

            <FileSelector
                accept=".csv"
                onSelect={async (file) => {
                    setFile(file);
                    const parsed = await uploadCsv(file); // local parse only
                    setRows(parsed);
                }}
            />

            {rows.length > 0 && (
                <>
                    <h4>Vista previa</h4>
                    <CsvPreviewTable rows={rows} />
                </>
            )}

            {file && !s3Key && (
                <Button
                    variant="contained"
                    color="success"
                    disabled={uploading}
                    onClick={handleConfirmUpload}
                >
                    {uploading ? "Subiendo..." : "Confirmar y subir"}
                </Button>
            )}

            {s3Key && (
                <p style={{ color: "green" }}>
                    ✅ Archivo confirmado<br />
                    <code>{s3Key}</code>
                </p>
            )}
        </div>
    );
}
