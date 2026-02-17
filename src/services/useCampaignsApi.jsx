// hooks/useCampaignsApi.js
import { useEffect, useState, useCallback } from "react";
import { apiGetCampaigns, apiGetCampaign, apiGetCampaignResults } from "../api/getCampaignsList";

export function useCampaignsList() {
  const [campaigns, setCampaigns] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await apiGetCampaigns();
      const items = data.items ?? data; // supports {items:[]} or []
      setCampaigns(items);
      setNextToken(data.nextToken ?? null);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { campaigns, nextToken, loading, error, reload: load };
}

export function useCampaignDetail(campaignId) {
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

      const [c, r] = await Promise.all([
        apiGetCampaign(campaignId),
        apiGetCampaignResults(campaignId, { limit: 50 }),
      ]);

      setCampaign(c);
      setRows(r.items || []);
      setNextToken(r.nextToken || null);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  const loadMore = useCallback(async () => {
    if (!campaignId || !nextToken) return;
    try {
      setError("");
      const r = await apiGetCampaignResults(campaignId, { limit: 50, nextToken });
      setRows((prev) => [...prev, ...(r.items || [])]);
      setNextToken(r.nextToken || null);
    } catch (e) {
      setError(e.message || "Error");
    }
  }, [campaignId, nextToken]);

  useEffect(() => { load(); }, [load]);

  return { campaign, rows, nextToken, loading, error, reload: load, loadMore };
}
