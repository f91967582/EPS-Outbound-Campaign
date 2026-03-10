<<<<<<< HEAD
export async function createCampaign({
  campaignTitle,
  flowId,
  campaignType,
  maxAttempts,
  callIntervalSeconds,
  maxConcurrentCalls
}) {
=======
export async function createCampaign({ campaignTitle, flowId, campaignType }) {
>>>>>>> origin/main
  const baseUrl = import.meta.env.VITE_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing env var: VITE_BASE_URL");
  }

  const response = await fetch(`${baseUrl}/campaign`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
<<<<<<< HEAD
      body: JSON.stringify({
        campaignTitle,
        flowId,
        campaignType,
        maxAttempts,
        callIntervalSeconds,
        maxConcurrentCalls,
      }),
=======
      body: JSON.stringify({ campaignTitle, flowId, campaignType }),
>>>>>>> origin/main
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response.json();
}

