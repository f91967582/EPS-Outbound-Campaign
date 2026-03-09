export async function getPresignedUploadUrlEmail(file, metadata = {}) {
  const url = `${import.meta.env.VITE_BASE_URL}/uploads/upload-url-email`;

  const res = await fetch(url, {
    method: "POST",
    headers:
    {
      "Content-Type": "application/json",
      "X-Api-Key": import.meta.env.VITE_API_KEY,
    },
    
    body: JSON.stringify({
      ...metadata,
      channel: "email",
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