export async function getPresignedUploadUrlSms(file) {
  const res = await fetch(import.meta.env.VITE_UPLOAD_API_URL_SMS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Presign failed: ${text}`);
  }

  return res.json(); // { uploadUrl, key }
}
