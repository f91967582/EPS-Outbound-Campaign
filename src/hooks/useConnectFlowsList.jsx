import { useEffect, useState, useCallback } from "react";
import { fetchFlows } from "../services/ConnectFlowsListService";

export function useFlows() {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchFlows();

      // Safety: ensure array
      setFlows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Error loading flows");
      setFlows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { flows, loading, error, reload: load };
}
