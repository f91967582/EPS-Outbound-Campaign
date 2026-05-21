import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
  InputAdornment,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";

import LabelIcon from "@mui/icons-material/Label";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function CampaignBasicInfoWhatsapp({
  campaignTitle,
  setCampaignTitle,
  flowId,
  setFlowId,
  flows,
  flowsLoading,
}) {
  const theme = useTheme();

  const fieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      transition: "all 0.2s ease",
      backgroundColor: alpha(theme.palette.common.white, 0.5),
      "&:hover": {
        backgroundColor: theme.palette.common.white,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "primary.light",
        },
      },
      "&.Mui-focused": {
        backgroundColor: theme.palette.common.white,
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 500,
      "&.Mui-focused": {
        fontWeight: 700,
      },
    },
  };

  const allowedFlowNames = [
    "Bienvenida y activación de clientes recién inscritos - Whatsapp.",
    "Notificación a clientes usando dirección incorrecta para sus envíos - Whatsapp.",
    "Notificación a clientes no han sacado el RUA - Whatsapp.",
    "Notificación a clientes con paquetes en almacén de muchos días - Whatsapp.",
  ];

  const visibleFlows = flows.filter((flow) =>
    allowedFlowNames.includes(flow.name)
  );

  return (
    <Stack spacing={3} sx={{ mt: 1 }}>
      <TextField
        label="Título de campaña"
        placeholder="Ej: Cobros WhatsApp - Marzo"
        size="small"
        value={campaignTitle}
        onChange={(e) => setCampaignTitle(e.target.value)}
        fullWidth
        sx={fieldStyles}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LabelIcon
                sx={{
                  fontSize: 18,
                  color: campaignTitle ? "primary.main" : "text.disabled",
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      <FormControl fullWidth size="small" disabled={flowsLoading} sx={fieldStyles}>
        <InputLabel id="flow-select-label-whatsapp">Flujo</InputLabel>
        <Select
          labelId="flow-select-label-whatsapp"
          value={flowId}
          label="Flujo"
          onChange={(e) => setFlowId(e.target.value)}
          sx={{ fontWeight: 600 }}
          startAdornment={
            <InputAdornment position="start">
              {flowsLoading ? (
                <CircularProgress size={16} sx={{ ml: 0.5 }} />
              ) : (
                <WhatsAppIcon
                  sx={{
                    fontSize: 18,
                    color: flowId ? "success.main" : "text.disabled",
                    ml: 0.5,
                  }}
                />
              )}
            </InputAdornment>
          }
        >
          {visibleFlows.map((f) => (
            <MenuItem key={f.id} value={f.id} sx={{ fontWeight: 500 }}>
              {f.name}
            </MenuItem>
          ))}

          {visibleFlows.length === 0 && !flowsLoading && (
            <MenuItem disabled>No se encontraron flujos permitidos</MenuItem>
          )}
        </Select>
      </FormControl>
    </Stack>
  );
}