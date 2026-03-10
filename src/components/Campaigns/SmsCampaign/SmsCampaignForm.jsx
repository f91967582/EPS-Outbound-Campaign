import { TextField } from "@mui/material";

export default function SmsCampaignForm({
  campaignTitle,
  setCampaignTitle,
}) {
  return (
    <TextField
      label="Título de campaña"
      size="small"
      value={campaignTitle}
      onChange={(e) => setCampaignTitle(e.target.value)}
      fullWidth
    />
  );
}