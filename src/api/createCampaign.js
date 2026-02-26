export async function createCampaign({
  campaignTitle,
  flowId,
  campaignType,
}) {
  const response = await fetch(
    "https://jpeswe3371.execute-api.us-east-1.amazonaws.com/Dev/campaign",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaignTitle,
        flowId,
        campaignType, 
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response.json();
}

