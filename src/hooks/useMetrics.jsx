import { useEffect, useState } from "react";
import { fetchMetrics } from "../services/metricsService";

export function useMetrics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let canceled = false;

        async function load() {
            try {
                setLoading(true);
                setError("");
                const res = await fetchMetrics();
                
                if (!canceled) setData(res);
            } catch (e) {
                if (!canceled) setError("Error loading metrics");
            } finally {
                if(!canceled) setLoading(false);
            }
        }
        load()
        return () => { canceled = true; };
    }, []);

    return { data, loading, error};
}