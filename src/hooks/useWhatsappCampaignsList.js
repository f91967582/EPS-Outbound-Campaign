import { useEffect, useState, useCallback } from "react";
import {
  apiGetWhatsappCampaigns,
  apiGetWhatsappCampaignDetails,
} from "../apiWhatsapp/getWhatsappCampaignsList";

export function useWhatsappCampaignsList() {
  const [campaigns, setCampaigns] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const data = await apiGetWhatsappCampaigns();

      const items = data.items ?? data;
      setCampaigns(items);
      setNextToken(data.nextToken ?? null);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { campaigns, nextToken, loading, error, reload: load };
}

export function useWhatsappCampaignDetail(campaignId) {
  const [campaign, setCampaign] = useState(null);
  const [rows, setRows] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!campaignId) return;

    try {
      setError("");
      setLoading(true);

      const data = await apiGetWhatsappCampaignDetails(campaignId, { limit: 50 });

      setCampaign(data.campaign || null);
      setRows(data.items || []);
      setNextToken(data.nextToken || null);
    } catch (e) {
      console.error("[useWhatsappCampaignDetail] load error:", e);
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  const loadMore = useCallback(async () => {
    if (!campaignId || !nextToken) return;

    try {
      setError("");

      const data = await apiGetWhatsappCampaignDetails(campaignId, {
        limit: 50,
        nextToken,
      });


      setRows((prev) => [...prev, ...(data.items || [])]);
      setNextToken(data.nextToken || null);
    } catch (e) {
      console.error("[useWhatsappCampaignDetail] loadMore error:", e);
      setError(e.message || "Error");
    }
  }, [campaignId, nextToken]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    campaign,
    rows,
    nextToken,
    loading,
    error,
    reload: load,
    loadMore,
  };
}