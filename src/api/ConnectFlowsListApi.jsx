import axios from "axios";

const base = import.meta.env.VITE_UPLOAD_API_URL?.replace(/\/+$/, "");

export const api = axios.create({
  baseURL: base,
  headers: {
    "Content-Type": "application/json",
  },
});