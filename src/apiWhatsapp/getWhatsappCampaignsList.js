const API_BASE = import.meta.env.VITE_BASE_URL;

async function fetchJson(path, { params } = {}) {
  if (!API_BASE) throw new Error("Missing API base URL env var");

  const url = new URL(`${API_BASE}${path}`);

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    });
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Not JSON: ${text.slice(0, 200)}`);
  }
}

// --- Endpoint wrappers ---
export function apiGetWhatsappCampaigns() {
  return fetchJson(`/whatsapp/campaigns`);
}

export function apiGetWhatsappCampaign(campaignId) {
  return fetchJson(`/whatsapp/campaigns/${encodeURIComponent(campaignId)}`);
}

export function apiGetWhatsappCampaignResults(
  campaignId,
  { limit = 50, nextToken } = {}
) {
  return fetchJson(`/whatsapp/campaigns/${encodeURIComponent(campaignId)}/results`, {
    params: { limit, nextToken },
  });
}

export function apiGetWhatsappCampaignDetails(
  campaignId,
  { limit = 50, nextToken } = {}
) {
  return fetchJson(`/whatsapp/campaigns/${encodeURIComponent(campaignId)}/details`, {
    params: { limit, nextToken },
  });
}