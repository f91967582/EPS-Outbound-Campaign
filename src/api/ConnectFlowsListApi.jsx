import axios from "axios";

const base = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "");

export const api = axios.create({
  baseURL: base,
  headers: {
    "Content-Type": "application/json",
  },
});