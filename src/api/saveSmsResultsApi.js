const API_BASE =
  import.meta.env.VITE_BASE_URL;

export async function saveSmsDetail({ campaignId, phoneNumber }) {
  if (!API_BASE) throw new Error("Missing API base URL env var");

  const res = await fetch(`${API_BASE}/sms/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      campaignId,
      phoneNumber,
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  return text ? JSON.parse(text) : {};
}