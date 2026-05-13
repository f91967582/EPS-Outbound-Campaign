export async function createVoiceCampaign({
  campaignTitle,
  flowId,
  flowName,
  campaignType,
  maxAttempts,
  callIntervalSeconds,
  maxConcurrentCalls,
  processAllSimultaneously,
  campaignMode,
  messageTemplate,
}) {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing env var: VITE_BASE_URL");
  }

  const response = await fetch(`${baseUrl}/voice/campaigns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      campaignTitle,
      flowId,
      flowName,
      campaignType,
      maxAttempts,
      callIntervalSeconds,
      maxConcurrentCalls,
      processAllSimultaneously,
      campaignMode,
      messageTemplate,
    }),
  });

  console.log("callIntervalSeconds before saving:", callIntervalSeconds);
  console.log("campaignMode before saving:", campaignMode);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response.json();
}