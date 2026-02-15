import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

import OutboundCampaign from "./OutboundCampaign";
import EmailCampaign from "./EmailCampaign";
import SmsCampaign from "./SmsCampaign";

function MainCampaign() {
  const [campaignType, setCampaignType] = useState("voz");

  return (
    <Box sx={{ mt: 2 }}>

      {/* Header */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Selecciona tipo de campaña
      </Typography>

      {/* Dropdown */}
      <FormControl fullWidth size="small">
        <InputLabel id="campaign-type-label">
          Tipo de campaña
        </InputLabel>
        <Select
          labelId="campaign-type-label"
          value={campaignType}
          label="Tipo de campaña"
          onChange={(e) => setCampaignType(e.target.value)}
        >
          <MenuItem value="voz">Voz</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="sms">SMS</MenuItem>
        </Select>
      </FormControl>

      {/* Content */}
      <Box sx={{ mt: 3 }}>
        {campaignType === "voz" && <OutboundCampaign />}
        {campaignType === "email" && <EmailCampaign />}
        {campaignType === "sms" && <SmsCampaign />}
      </Box>

    </Box>
  );
}

export default MainCampaign;
