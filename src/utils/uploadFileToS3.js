async function uploadFileToS3(uploadUrl, file) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "text/csv"
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${text}`);
  }
}

export default uploadFileToS3;
