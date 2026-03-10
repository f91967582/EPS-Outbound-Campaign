export async function startVoiceCampaign({ campaignId, startAt, timezone = "America/Santo_Domingo" }) {
  const API_URL = import.meta.env.VITE_BASE_URL;

  const response = await fetch(`${API_URL}/voice/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId, startAt, timezone }),
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => "");
    throw new Error(msg || "Failed to schedule campaign");
  }

  return response.json();
}
