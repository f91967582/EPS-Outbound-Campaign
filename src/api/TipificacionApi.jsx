import axios from "axios";

export const apiCall = axios.create({
  baseURL: import.meta.env.VITE_UPLOAD_API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});
