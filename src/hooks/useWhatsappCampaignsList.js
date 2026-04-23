// hooks/useWhatsappCampaignsList.js
import { useCallback, useEffect, useState } from "react";
import { apiGetWhatsappCampaigns } from "../apiWhatsapp/getWhatsappCampaignsList";

export function useWhatsappCampaignsList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiGetWhatsappCampaigns();
      setCampaigns(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to load WhatsApp campaigns");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    campaigns,
    loading,
    error,
    reload: load,
  };
}