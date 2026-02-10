import { useCallback, useState } from "react";
import { sirWebInvoke } from "../services/SirWebService";

export function useSirWeb() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async (params) => {
    setLoading(true);
    setError("");
    try {
      const result = await sirWebInvoke(params);
      setData(result);
      return result;
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        (typeof e?.response?.data?.body === "string"
          ? (() => {
              try {
                return JSON.parse(e.response.data.body)?.message;
              } catch {
                return e.response.data.body;
              }
            })()
          : null) ||
        e?.message ||
        "Request failed";

      setError(msg);
      setData(null);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, run };
}
