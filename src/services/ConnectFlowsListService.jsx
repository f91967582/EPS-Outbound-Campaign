import { api } from "../api/ConnectFlowsListApi";

export async function fetchFlows() {
  const res = await api.post("/Dev/connect/flowinfo", {}); 
  return res.data; 
}
