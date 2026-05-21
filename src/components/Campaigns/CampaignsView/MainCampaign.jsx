import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";

import CampaignIcon from "@mui/icons-material/Campaign";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import OutboundCampaign from "../CallsCampaign/OutboundCampaign";
import WhatsAppCampaign from "../WhatsappCampaign/WhatsappCampaign";

function MainCampaign() {
  const theme = useTheme();
  const [campaignType, setCampaignType] = useState("voz");

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <TouchAppIcon sx={{ color: "primary.main", fontSize: 24 }} />
        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
          Selecciona tipo de campaña
        </Typography>
      </Stack>

      <FormControl
        fullWidth
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 600,
          },
        }}
      >
        <InputLabel id="campaign-type-label">Canal</InputLabel>
        <Select
          labelId="campaign-type-label"
          value={campaignType}
          label="Canal"
          onChange={(e) => setCampaignType(e.target.value)}
          sx={{ fontWeight: 600 }}
        >
          <MenuItem value="voz">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CampaignIcon fontSize="small" color="primary" />
              <Typography variant="body2" fontWeight={600}>
                Voz
              </Typography>
            </Box>
          </MenuItem>

          <MenuItem value="whatsapp">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WhatsAppIcon fontSize="small" sx={{ color: "#25D366" }} />
              <Typography variant="body2" fontWeight={600}>
                WhatsApp
              </Typography>
            </Box>
          </MenuItem> 
          
        </Select>
      </FormControl>

      <Box sx={{ mt: 4 }}>
        {campaignType === "voz" && <OutboundCampaign />}
        {campaignType === "whatsapp" && <WhatsAppCampaign />}
      </Box>
    </Box>
  );
}

export default MainCampaign;