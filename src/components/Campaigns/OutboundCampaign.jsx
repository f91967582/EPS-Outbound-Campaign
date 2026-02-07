import { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useFlows } from "../../hooks/useConnectFlowsList";

import OutboundSection from "./OutboundSection";

export default function OutboundCampaign() {
  // store selected flowId
  const [flowId, setFlowId] = useState("");

  // flows from hook: [{ id, name }, ...]
  const { flows, loading, error } = useFlows();

  const [metadata, setMetaData] = useState({flowId: ""})

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Iniciar Campaña Outbound</h2>

      {/* Optional status */}
      {loading && <p>Cargando flujos...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Flujo dropdown */}
      <Box sx={{ maxWidth: 420, mt: 2, mb: 3 }}>
        <FormControl fullWidth size="small" disabled={loading}>
          <InputLabel id="flujo-label">Flujo</InputLabel>
          <Select
            labelId="flujo-label"
            id="flujo"
            value={metadata.flowId}
            label="Flujo"
            onChange={(e) => setMetaData({...metadata, flowId: e.target.value})}
          >
            {flows.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                {f.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <OutboundSection
        title="Clientes a llamar"
        metadata={metadata}
      />
    </div>
  );
} 
