// src/api/apiCall.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_SIRWEB_BASE_URL, // e.g. https://xxxx.execute-api.us-east-1.amazonaws.com/Dev
  headers: { "Content-Type": "application/json" },
});

// Always return parsed payload (handles Lambda proxy { body: "..." })
export const postData = async (endpoint, payload) => {
  const res = await apiClient.post(endpoint, payload);

  const data = res.data;
  if (data && typeof data.body === "string") {
    try {
      return JSON.parse(data.body);
    } catch {
      return data;
    }
  }
  return data;
};
