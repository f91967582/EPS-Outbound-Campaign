export async function updateVoiceCampaignUpload(campaignId, payload) {
  const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");

  const response = await fetch(`${API_URL}/voice/campaigns/${campaignId}/upload`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      body?.message ||
        body?.error ||
        body?.raw ||
        `Failed to update campaign upload (${response.status})`
    );
  }

  return body;
}