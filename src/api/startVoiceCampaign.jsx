export async function startVoiceCampaign(campaignId) {
  const API_URL = import.meta.env.VITE_API_BASE_URL_START_VOICE;

  const response = await fetch(
    `${API_URL}/voice/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ campaignId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to start campaign");
  }

  return response.json();
}
