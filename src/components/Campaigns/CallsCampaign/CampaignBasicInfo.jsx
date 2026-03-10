import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

export default function CampaignBasicInfo({
  campaignTitle,
  setCampaignTitle,
  flowId,
  setFlowId,
  flows,
  flowsLoading,
}) {
  return (
    <>
      <TextField
        label="Título de campaña"
        size="small"
        value={campaignTitle}
        onChange={(e) => setCampaignTitle(e.target.value)}
        fullWidth
      />

      <FormControl fullWidth size="small" disabled={flowsLoading}>
        <InputLabel>Flujo</InputLabel>
        <Select
          value={flowId}
          label="Flujo"
          onChange={(e) => setFlowId(e.target.value)}
        >
          {flows.map((f) => (
            <MenuItem key={f.id} value={f.id}>
              {f.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}