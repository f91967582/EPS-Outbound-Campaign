// hooks/useCampaignsApi.js
import { useEffect, useState, useCallback } from "react";
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

  return {
    campaigns,
    nextToken,
    loading,
    error,
    reload: load,
  };
}

export function useCampaignDetail(campaignId) {
  const [campaign, setCampaign] = useState(null);
  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!campaignId) {
      setCampaign(null);
      setRows([]);
      setTotalItems(0);
      setNextToken(null);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const data = await apiGetCampaignDetails(campaignId);

      const items = dedupeRows(data.items || [], campaignId);

      setCampaign(data.campaign || null);
      setRows(items);
      setTotalItems(data.totalItems ?? items.length);
      setNextToken(null);

      console.log("[useCampaignDetail] loaded full campaign details:", {
        campaignId,
        receivedItems: data.items?.length || 0,
        dedupedItems: items.length,
        totalItems: data.totalItems ?? items.length,
      });
    } catch (e) {
      console.error("[useCampaignDetail] load error:", e);
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = useCallback(() => {
    // No-op: /details now returns all campaign results in one request.
  }, []);

  return {
    campaign,
    rows,
    totalItems,
    nextToken,
    loading,
    loadingMore,
    error,
    reload: load,
    loadMore,
  };
}