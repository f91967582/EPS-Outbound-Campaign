export async function createWhatsappCampaign({
  campaignTitle,
  flowId,
  campaignType,
  bucket,
  s3Key,
}) {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing env var: VITE_BASE_URL");
  }

  const response = await fetch(`${baseUrl}/whatsapp/campaigns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      campaignTitle,
      flowId,
      campaignType,
      bucket,
      s3Key,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response.json();
}










