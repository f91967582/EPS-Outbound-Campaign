export async function getPresignedUploadUrlOutbound(file, metadata) {
  const res = await fetch(import.meta.env.VITE_UPLOAD_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      metadata,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Presign failed: ${text}`);
  }

  return res.json(); // { uploadUrl, key }
}
