import { apiCall } from "../api/TipificacionApi"

export const fetchMetrics = async () => {
    const response = await apiCall.get("/metrics");
    return response.data;
};