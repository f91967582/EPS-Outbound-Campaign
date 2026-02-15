export async function updateCampaignStatus(campaignId, data) {
  const response = await fetch(
    `https://qm97ttj6qk.execute-api.us-east-1.amazonaws.com/campaign/${campaignId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }
  );

  if (!response.ok) {
    throw new Error("Failed to update campaign");
  }

  return response.json();
}

