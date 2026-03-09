export async function resumeCampaign({ campaignId }) {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const response = await fetch(`${API_URL}/campaigns/${campaignId}/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const msg = await response.text().catch(() => "");
        throw new Error(msg || "Failed to resume campaign");
    }

    return response.json();
}