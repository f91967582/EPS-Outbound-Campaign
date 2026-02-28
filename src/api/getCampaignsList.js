const API_BASE = import.meta.env.VITE_BASE_URL || process.env.REACT_APP_API_BASE_URL;

async function fetchJson(path, { params } = {}) {
  if (!API_BASE) throw new Error("Missing API base URL env var");

  const url = new URL(`${API_BASE}${path}`);

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
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
export function apiGetCampaigns() {
  return fetchJson("/campaigns");
}

export function apiGetCampaign(campaignId) {
  return fetchJson(`/campaigns/${encodeURIComponent(campaignId)}`);
}

export function apiGetCampaignResults(campaignId, { limit = 50, nextToken } = {}) {
  return fetchJson(`/campaigns/${encodeURIComponent(campaignId)}/results`, {
    params: { limit, nextToken },
  });
}
