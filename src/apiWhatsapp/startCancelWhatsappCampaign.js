export async function startCancelWhatsappCampaign({
  campaignId,
  action = "start",
  startAt,
  timezone = "America/Santo_Domingo",
}) {
  const API_URL = import.meta.env.VITE_BASE_URL;

  const payload = {
    campaignId,
    action,
  };

  if (action === "start") {
    payload.startAt = startAt;
    payload.timezone = timezone;
  }

  const response = await fetch(`${API_URL}/whatsapp/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Failed to process SMS campaign"
    );
  }

  return data;
}