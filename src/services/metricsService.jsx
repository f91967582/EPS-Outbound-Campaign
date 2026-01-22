import { apiCall } from "./api"

export const fetchMetrics = async () => {
    const response = await apiCall.get("/");
    return response.data;
};