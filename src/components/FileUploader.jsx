import { useState } from "react";
import { uploadCsv } from "../utils/uploadCsv";
import { getPresignedUploadUrl } from "../utils/getPresignedUploadUrl";
import uploadFileToS3 from "../utils/uploadFileToS3";

export default function FileUploader({
  accept = ".csv",
  parseFile = uploadCsv,
  onUploaded,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Upload to S3
      const { uploadUrl, key } = await getPresignedUploadUrl(file);
      await uploadFileToS3(uploadUrl, file);

      // Optional local parse
      const parsed = parseFile ? await parseFile(file) : null;

      onUploaded({
        file,
        s3Key: key,
        rows: parsed,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
      />

      {uploading && <p>⏳ Subiendo archivo…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
