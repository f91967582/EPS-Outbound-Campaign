import { api } from "../api/ConnectFlowsListApi";

export async function fetchFlows() {
  const res = await api.post("/connect/flowsinfo", {}); 
  return res.data; 
}

