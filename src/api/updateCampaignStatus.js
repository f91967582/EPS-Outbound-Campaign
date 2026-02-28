export async function updateCampaignStatus(campaignId, payload) {

  const baseUrl = `${import.meta.env.VITE_BASE_URL}`;

  const response = await fetch(`${baseUrl}/campaign/${campaignId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const text = await response.text();

  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      `Failed to update campaign (${response.status}): ${body?.message || body?.error || body?.raw || text || "Unknown error"
      }`
    );
  }

  // If your API returns JSON, prefer the already-parsed body:
  return body;
}
