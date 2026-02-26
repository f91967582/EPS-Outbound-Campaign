export async function getPresignedUploadUrlCalls(file, metadata = {}) {
  const url = `${import.meta.env.VITE_UPLOAD_API_URL}/uploads/upload-url-calls`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...metadata,
      channel: "calls",
      filename: file.name,
      contentType: file.type || "text/csv",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || `Presign failed (${res.status})`);
  }

  if (!data?.uploadUrl || !data?.key) {
    throw new Error(`Invalid response shape: ${JSON.stringify(data)}`);
  }

  return data;
}