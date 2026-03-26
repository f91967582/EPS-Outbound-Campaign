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

// Icons for the dropdown
import SmsIcon from "@mui/icons-material/Sms";
import CampaignIcon from "@mui/icons-material/Campaign";
import EmailIcon from "@mui/icons-material/Email";
import TouchAppIcon from "@mui/icons-material/TouchApp";

import EmailCampaign from "./EmailCampaign/EmailCampaign";
import SmsCampaign from "./SmsCampaign/SmsCampaign";
import OutboundCampaign from "./CallsCampaign/OutboundCampaign";

function MainCampaign() {
  const theme = useTheme();
  const [campaignType, setCampaignType] = useState("sms");

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
          label="Tipo de campaña"
          onChange={(e) => setCampaignType(e.target.value)}
          sx={{ fontWeight: 600 }}
        >
          {/* <MenuItem
            value="voz"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CampaignIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight={600}>
              Voz
            </Typography>
          </MenuItem>*/}

          <MenuItem
            value="sms"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <SmsIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight={600}>
              SMS
            </Typography>
          </MenuItem> 

          {/* <MenuItem
            value="email"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <EmailIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight={600}>
              Email
            </Typography>
          </MenuItem>*/}
        </Select>
      </FormControl>

      <Box sx={{ mt: 4 }}>
        {campaignType === "voz" && <OutboundCampaign />}
        {campaignType === "email" && <EmailCampaign />}
        {campaignType === "sms" && <SmsCampaign />}
      </Box>
    </Box>
  );
}

export default MainCampaign;