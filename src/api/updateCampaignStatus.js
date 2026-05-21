export async function updateCampaignStatus(campaignId, action, options = {}) {
  const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");

  const response = await fetch(`${API_URL}/voice/campaigns/${campaignId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action, // "pause", "resume", or "stop"
      reason: options.reason || `manual ${action} from dashboard`,
      updatedBy: options.updatedBy || "admin",
    }),
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
      `Failed to update campaign (${response.status}): ${
        body?.message || body?.error || body?.raw || text || "Unknown error"
      }`
    );
  }

  return body;
}