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

      let parsedFlows = [];

      // Case 1: API already returns array
      if (Array.isArray(data)) {
        parsedFlows = data;
      }
      // Case 2: Lambda proxy wrapper { statusCode, headers, body: "[]" }
      else if (
        data &&
        typeof data === "object" &&
        typeof data.statusCode === "number" &&
        typeof data.body === "string"
      ) {
        const bodyParsed = JSON.parse(data.body);
        parsedFlows = Array.isArray(bodyParsed) ? bodyParsed : [];
      }
      // Case 3: object with nested array (optional fallback)
      else if (Array.isArray(data?.flows)) {
        parsedFlows = data.flows;
      }

      setFlows(parsedFlows);
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