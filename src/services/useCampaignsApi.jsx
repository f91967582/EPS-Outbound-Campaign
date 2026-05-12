// hooks/useCampaignsApi.js
import { useEffect, useState, useCallback, useRef } from "react";
import {
  apiGetCampaigns,
  apiGetCampaignDetails,
} from "../api/getCampaignsList";

function getRowKey(row, campaignId) {
  return [
    row?.campaignId || campaignId || "",
    row?.contactId || "",
    row?.phoneNumber || "",
  ].join("#");
}

function dedupeRows(rows, campaignId) {
  const seen = new Set();

  return rows.filter((row, index) => {
    const key = getRowKey(row, campaignId);
    const fallbackKey = `${index}-${JSON.stringify(row)}`;
    const finalKey = key.replace(/#/g, "") ? key : fallbackKey;

    if (seen.has(finalKey)) return false;

    seen.add(finalKey);
    return true;
  });
}

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

      const items = data.items ?? data;
      setCampaigns(items);
      setNextToken(data.nextToken ?? null);
    } catch (e) {
      console.error("[useCampaignsList] apiGetCampaigns error:", e);
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

export function useCampaignDetail(campaignId) {
  const [campaign, setCampaign] = useState(null);
  const [rows, setRows] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadingMoreRef = useRef(false);

  const load = useCallback(async () => {
    if (!campaignId) {
      setCampaign(null);
      setRows([]);
      setNextToken(null);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const data = await apiGetCampaignDetails(campaignId, { limit: 50 });

      setCampaign(data.campaign || null);
      setRows(dedupeRows(data.items || [], campaignId));
      setNextToken(data.nextToken || null);
    } catch (e) {
      console.error("[useCampaignDetail] load error:", e);
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  const loadMore = useCallback(async () => {
    if (!campaignId || !nextToken || loadingMoreRef.current) return;

    try {
      loadingMoreRef.current = true;
      setLoadingMore(true);
      setError("");

      const currentToken = nextToken;

      const data = await apiGetCampaignDetails(campaignId, {
        limit: 50,
        nextToken: currentToken,
      });

      setRows((prev) =>
        dedupeRows([...prev, ...(data.items || [])], campaignId)
      );

      setNextToken(data.nextToken || null);
    } catch (e) {
      console.error("[useCampaignDetail] loadMore error:", e);
      setError(e.message || "Error");
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
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
    loadingMore,
    error,
    reload: load,
    loadMore,
  };
}